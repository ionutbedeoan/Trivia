export type Difficulty = 'Ușor' | 'Mediu' | 'Dificil';
export interface Settings {
  capacity: 1 | 2 | 4;
  difficulty: Difficulty;
  seconds: '40';
  practice: boolean;
}
export type Phase =
  'lobby' | 'round' | 'countdown' | 'question' | 'explanation' | 'finished' | 'cancelled';
export interface PublicPlayer {
  id: string;
  name: string;
  host: boolean;
  ready: boolean;
  connected: boolean;
  score: number;
  wagerUsed: boolean;
  answered: boolean;
  confirmed: boolean;
}
export interface PublicQuestion {
  id: string;
  text: string;
  options: string[];
  category: string;
  difficulty: Difficulty;
}
export interface RevealedQuestion extends PublicQuestion {
  correct: number;
  explanation: string;
  reference: string;
  sourceUrl: string;
  answers: {
    playerId: string;
    option: number | null;
    wager: boolean;
    delta: number;
    total: number;
  }[];
}
export interface Snapshot {
  roomId: string;
  code: string;
  matchId: string | null;
  version: number;
  phase: Phase;
  settings: Settings;
  players: PublicPlayer[];
  selfId: string;
  index: number;
  round: number;
  serverNow: number;
  deadline: number | null;
  inactivityDeadline: number | null;
  question?: PublicQuestion;
  reveal?: RevealedQuestion;
  history?: RevealedQuestion[];
  ownAnswer?: { option: number; wager: boolean };
  paused: boolean;
  graceDeadline: number | null;
  resumeAt: number | null;
  reason?: string;
  rematch: string[];
}

export interface SessionInfo {
  csrf: string;
  roomId: string | null;
  invitationOrigin: string;
}

export interface EditorialQuestion extends PublicQuestion {
  factGroup: string;
  status: 'Schiță' | 'În verificare' | 'Aprobat' | 'Publicat' | 'Retras';
  correct: number;
  explanation: string;
  reference: string;
  sourceUrl: string;
  sourceTitle: string;
  locator: string;
  verifiedAt: string;
  notes: string;
  checklist: boolean[];
  revision: number;
}
