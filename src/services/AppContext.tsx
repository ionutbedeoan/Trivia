import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import type { Dispatch, ReactNode, SetStateAction } from 'react';
import type { SessionInfo, Snapshot } from '../../shared/contracts';
import type { Preferences } from '../types';
import { api, setCsrf } from './api';
interface AppState {
  session: SessionInfo | null;
  snapshot: Snapshot | null;
  connected: boolean;
  error: string;
  takenOver: boolean;
  preferences: Preferences;
  setPreferences: Dispatch<SetStateAction<Preferences>>;
  refreshSession: () => Promise<void>;
  setSnapshot: Dispatch<SetStateAction<Snapshot | null>>;
  command: (action: string, values?: Record<string, unknown>) => Promise<Snapshot>;
  leave: () => Promise<void>;
}
const Context = createContext<AppState | null>(null);
export function AppProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<SessionInfo | null>(null),
    [snapshot, setSnapshot] = useState<Snapshot | null>(null);
  const [connected, setConnected] = useState(false),
    [error, setError] = useState(''),
    [takenOver, setTakenOver] = useState(false);
  const [preferences, setPreferences] = useState<Preferences>(() => {
    try {
      const s = JSON.parse(localStorage.getItem('ps_preferences') ?? '{}');
      return {
        name: typeof s.name === 'string' ? s.name : 'Andrei',
        sound: s.sound === true,
        motion: ['system', 'reduced', 'full'].includes(s.motion) ? s.motion : 'system',
      };
    } catch {
      return { name: 'Andrei', sound: false, motion: 'system' };
    }
  });
  const refreshSession = useCallback(async () => {
    const next = await api<SessionInfo>('/session');
    setCsrf(next.csrf);
    setSession(next);
    setError('');
  }, []);
  useEffect(() => {
    refreshSession().catch((e) => setError((e as Error).message));
  }, [refreshSession]);
  useEffect(() => {
    document.documentElement.dataset.motion = preferences.motion;
    try {
      localStorage.setItem('ps_preferences', JSON.stringify(preferences));
    } catch {
      /* Storage disabled. */
    }
  }, [preferences]);
  const identity = session?.csrf;
  const latestSnapshot = useRef(snapshot);
  latestSnapshot.current = snapshot;
  useEffect(() => {
    if (snapshot?.phase === 'finished')
      refreshSession().catch((e) => setError((e as Error).message));
  }, [snapshot?.phase, refreshSession]);
  const previousQuestion = useRef('');
  useEffect(() => {
    const key = snapshot?.phase === 'question' ? `${snapshot.matchId}:${snapshot.index}` : '';
    if (key && key !== previousQuestion.current && preferences.sound) {
      try {
        const audio = new AudioContext();
        const oscillator = audio.createOscillator(),
          gain = audio.createGain();
        oscillator.frequency.value = 520;
        gain.gain.value = 0.04;
        oscillator.connect(gain);
        gain.connect(audio.destination);
        oscillator.start();
        oscillator.stop(audio.currentTime + 0.12);
        oscillator.onended = () => {
          void audio.close();
        };
      } catch {
        /* Audio may be blocked by browser preferences. */
      }
    }
    previousQuestion.current = key;
  }, [snapshot?.phase, snapshot?.index, snapshot?.matchId, preferences.sound]);
  useEffect(() => {
    if (!identity) return;
    let disposed = false,
      timer: number,
      heartbeat: number,
      socket: WebSocket;
    const connect = () => {
      if (disposed) return;
      socket = new WebSocket(
        `${location.protocol === 'https:' ? 'wss:' : 'ws:'}//${location.host}/api/live`,
      );
      socket.onopen = () => {
        setConnected(true);
        setTakenOver(false);
        setError('');
        heartbeat = window.setInterval(() => {
          if (socket.readyState === WebSocket.OPEN) socket.send('heartbeat');
        }, 5000);
      };
      socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data) as { snapshot: Snapshot | null };
          setSnapshot((previous) =>
            data.snapshot &&
            previous?.roomId === data.snapshot.roomId &&
            previous.version > data.snapshot.version
              ? previous
              : data.snapshot,
          );
        } catch {
          setError('Mesaj de sincronizare invalid. Reîncarcă pagina.');
        }
      };
      socket.onclose = (event) => {
        window.clearInterval(heartbeat);
        if (disposed) return;
        setConnected(false);
        if (event.code === 4001) {
          setTakenOver(true);
          return;
        }
        if (event.code === 4003) {
          refreshSession().catch((e) => setError((e as Error).message));
          return;
        }
        timer = window.setTimeout(connect, 1500);
      };
      socket.onerror = () => socket.close();
    };
    connect();
    return () => {
      disposed = true;
      window.clearTimeout(timer);
      window.clearInterval(heartbeat);
      socket?.close();
    };
  }, [identity, refreshSession]);
  const command = async (action: string, values: Record<string, unknown> = {}) => {
    if (!snapshot) throw new Error('Camera nu este disponibilă.');
    const next = await api<Snapshot>('/rooms/command', {
      ...values,
      roomId: snapshot.roomId,
      matchId: snapshot.matchId,
      index: snapshot.index,
      action,
      operationId: crypto.randomUUID(),
    });
    setSnapshot((previous) =>
      previous?.roomId === next.roomId && previous.version > next.version ? previous : next,
    );
    return next;
  };
  const leave = useCallback(async () => {
    const current = latestSnapshot.current;
    if (current) await api('/rooms/leave', { roomId: current.roomId });
    setSnapshot(null);
  }, []);
  return (
    <Context.Provider
      value={{
        session,
        snapshot,
        connected,
        error,
        takenOver,
        preferences,
        setPreferences,
        refreshSession,
        setSnapshot,
        command,
        leave,
      }}
    >
      {children}
    </Context.Provider>
  );
}
export function useApp() {
  const value = useContext(Context);
  if (!value) throw new Error('AppProvider absent');
  return value;
}
