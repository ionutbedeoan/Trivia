import { createContext, useContext, useEffect, useState } from 'react';
import type { MouseEvent, ReactNode } from 'react';

interface NavigationValue {
  path: string;
  search: URLSearchParams;
  navigate: (path: string) => void;
}
const Navigation = createContext<NavigationValue | null>(null);
let guard: (() => boolean) | null = null;
export function setNavigationGuard(value: (() => boolean) | null) {
  guard = value;
}
export function NavigationProvider({ children }: { children: ReactNode }) {
  const [url, setUrl] = useState(() => location.pathname + location.search);
  const navigate = (path: string) => {
    if (guard && !guard()) return;
    history.pushState(null, '', path);
    setUrl(location.pathname + location.search);
  };
  useEffect(() => {
    const onPop = () => {
      if (guard && !guard()) {
        history.pushState(null, '', url);
        return;
      }
      setUrl(location.pathname + location.search);
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, [url]);
  const [path, search = ''] = url.split('?');
  return (
    <Navigation.Provider value={{ path, search: new URLSearchParams(search), navigate }}>
      {children}
    </Navigation.Provider>
  );
}
export function useNavigation() {
  const context = useContext(Navigation);
  if (!context) throw new Error('NavigationProvider absent');
  return context;
}
export function Link({
  to,
  children,
  className = '',
  ...props
}: {
  to: string;
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  'aria-current'?: 'page';
}) {
  const { navigate } = useNavigation();
  const onClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey)
      return;
    event.preventDefault();
    props.onClick?.();
    navigate(to);
  };
  return (
    <a {...props} href={to} className={className} onClick={onClick}>
      {children}
    </a>
  );
}
