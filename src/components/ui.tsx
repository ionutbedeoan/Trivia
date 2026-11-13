import { useEffect, useId, useRef } from 'react';
import type { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode } from 'react';

export type IconName =
  | 'book'
  | 'users'
  | 'check'
  | 'plus'
  | 'enter'
  | 'arrow'
  | 'settings'
  | 'clock'
  | 'copy'
  | 'link'
  | 'play'
  | 'user'
  | 'shield'
  | 'info'
  | 'close'
  | 'menu'
  | 'sound'
  | 'muted'
  | 'trophy'
  | 'layers'
  | 'target'
  | 'star'
  | 'home'
  | 'refresh'
  | 'trash'
  | 'external'
  | 'lock';
const paths: Record<IconName, ReactNode> = {
  book: (
    <>
      <path d="M12 5C8 2 4 3 2 4v15c4-2 7-1 10 1 3-2 6-3 10-1V4c-3-1-7-2-10 1Z" />
      <path d="M12 5v15" />
    </>
  ),
  users: (
    <>
      <circle cx="9" cy="7" r="3" />
      <path d="M2 21v-2a7 7 0 0 1 14 0v2M17 4a3 3 0 0 1 0 6m2 4a6 6 0 0 1 3 5v2" />
    </>
  ),
  check: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="m8 12 3 3 5-6" />
    </>
  ),
  plus: <path d="M12 4v16M4 12h16" />,
  enter: (
    <>
      <path d="M13 3h6a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-6M3 12h12m-5-5 5 5-5 5" />
    </>
  ),
  arrow: <path d="M20 12H4m6-6-6 6 6 6" />,
  settings: (
    <>
      <path d="m9 3-1 3-3 1-2 5 2 5 3 1 1 3h6l1-3 3-1 2-5-2-5-3-1-1-3Z" />
      <circle cx="12" cy="12" r="3" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 6v6l4 2" />
    </>
  ),
  copy: (
    <>
      <rect x="8" y="8" width="13" height="13" rx="2" />
      <path d="M16 8V3H3v13h5" />
    </>
  ),
  link: (
    <>
      <path d="m10 13 4-4m-6 6-2 2a4 4 0 0 1-6-6l5-5a4 4 0 0 1 6 0m2 3 2-2a4 4 0 0 1 6 6l-5 5a4 4 0 0 1-6 0" />
    </>
  ),
  play: <path d="m7 3 14 9-14 9Z" />,
  user: (
    <>
      <circle cx="12" cy="7" r="4" />
      <path d="M3 22a9 9 0 0 1 18 0" />
    </>
  ),
  shield: (
    <>
      <path d="m12 2 9 4v6c0 6-9 10-9 10S3 18 3 12V6Z" />
      <path d="m8 12 3 3 5-6" />
    </>
  ),
  info: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v6m0-10v1" />
    </>
  ),
  close: <path d="m6 6 12 12M6 18 18 6" />,
  menu: <path d="M3 6h18M3 12h18M3 18h18" />,
  sound: (
    <>
      <path d="m11 3-6 5H2v8h3l6 5ZM16 7a7 7 0 0 1 0 10m3-13a11 11 0 0 1 0 16" />
    </>
  ),
  muted: (
    <>
      <path d="m11 3-6 5H2v8h3l6 5Zm5 6 6 6m-6 0 6-6" />
    </>
  ),
  trophy: (
    <>
      <path d="M7 3h10v7a5 5 0 0 1-10 0ZM7 5H2v3a5 5 0 0 0 5 5m10-8h5v3a5 5 0 0 1-5 5M12 15v6m-5 0h10" />
    </>
  ),
  layers: (
    <>
      <path d="m12 2 10 6-10 6L2 8Zm-10 10 10 6 10-6M2 16l10 6 10-6" />
    </>
  ),
  target: (
    <>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="12" cy="12" r="1" />
    </>
  ),
  star: <path d="m12 2 3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1Z" />,
  home: (
    <>
      <path d="m2 10 10-8 10 8M5 8v14h5v-8h4v8h5V8" />
    </>
  ),
  refresh: (
    <>
      <path d="M21 8a9 9 0 0 0-15-4L2 8m0-6v6h6M3 16a9 9 0 0 0 15 4l4-4m0 6v-6h-6" />
    </>
  ),
  trash: (
    <>
      <path d="M3 6h18M9 6V2h6v4M6 6l1 16h10l1-16M10 10v8m4-8v8" />
    </>
  ),
  external: (
    <>
      <path d="M14 3h7v7m0-7L10 14M10 3H3v18h18v-7" />
    </>
  ),
  lock: (
    <>
      <rect x="4" y="10" width="16" height="12" rx="2" />
      <path d="M8 10V6a4 4 0 0 1 8 0v4m-4 5v3" />
    </>
  ),
};
export function Icon({ name, className = '' }: { name: IconName; className?: string }) {
  return (
    <svg
      className={`icon ${className}`}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  );
}
export function Button({
  children,
  variant = 'primary',
  icon,
  className = '',
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'quiet' | 'danger';
  icon?: IconName;
}) {
  return (
    <button className={`button ${variant} ${className}`} type="button" {...props}>
      {icon && <Icon name={icon} />}
      <span>{children}</span>
    </button>
  );
}
export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <section className={`card ${className}`}>{children}</section>;
}
export function Field({
  label,
  hint,
  error,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & { label: string; hint?: string; error?: string }) {
  const generatedId = useId();
  const id = props.id ?? generatedId;
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <input
        {...props}
        id={id}
        aria-invalid={!!error}
        aria-describedby={error || hint ? `${id}-help` : undefined}
      />
      {(error || hint) && (
        <small id={`${id}-help`} className={error ? 'error-text' : ''}>
          {error ?? hint}
        </small>
      )}
    </div>
  );
}
export function Segmented<T extends string>({
  label,
  hint,
  value,
  options,
  onChange,
}: {
  label: string;
  hint?: string;
  value: T;
  options: { value: T; label: string }[];
  onChange: (value: T) => void;
}) {
  const name = useId();
  return (
    <fieldset className="field">
      <legend>{label}</legend>
      {hint && <small>{hint}</small>}
      <div className="segmented">
        {options.map((option) => (
          <label key={option.value} className={option.value === value ? 'selected' : ''}>
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={option.value === value}
              onChange={() => onChange(option.value)}
            />
            <span>{option.label}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
export function Notice({
  children,
  tone = 'info',
}: {
  children: ReactNode;
  tone?: 'info' | 'success' | 'error' | 'warning';
}) {
  return (
    <div className={`notice ${tone}`} role={tone === 'error' ? 'alert' : 'status'}>
      <Icon name={tone === 'success' ? 'check' : 'info'} />
      <div>{children}</div>
    </div>
  );
}
export function ExternalLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer">
      {children} <Icon name="external" />
      <span className="sr-only"> (nouă filă)</span>
    </a>
  );
}
export function Modal({
  title,
  children,
  onClose,
}: {
  title: string;
  children: ReactNode;
  onClose?: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    const dialog = ref.current;
    dialog?.showModal();
    return () => {
      dialog?.close();
      previous?.focus();
    };
  }, []);
  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      onCancel={(event) => {
        event.preventDefault();
        onClose?.();
      }}
    >
      {onClose && (
        <Button
          variant="quiet"
          className="dialog-close"
          icon="close"
          aria-label="Închide dialogul"
          onClick={onClose}
        />
      )}
      <h2 id={titleId}>{title}</h2>
      {children}
    </dialog>
  );
}
