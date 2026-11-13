import { useId } from 'react';

export function BookArt({ className = '' }: { className?: string }) {
  const unique = useId();
  const blue = `${unique}-blue`,
    white = `${unique}-white`;
  return (
    <svg className={`book-art ${className}`} viewBox="0 0 600 168" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id={blue} x1="120" y1="65" x2="430" y2="170" gradientUnits="userSpaceOnUse">
          <stop stopColor="#82B1FF" />
          <stop offset="1" stopColor="#3158C9" />
        </linearGradient>
        <linearGradient
          id={white}
          x1="280"
          y1="70"
          x2="100"
          y2="160"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#fff" />
          <stop offset="1" stopColor="#D6E5FF" />
        </linearGradient>
      </defs>
      <path d="M15 20C100 5 150 55 180 120L15 168Z" fill="#F8BDA7" />
      <path d="M445 80C488 27 544 1 597 3V168H438Z" fill="#B8D2FF" />
      <path
        d="M0 168 45 109C143 86 254 102 300 159 349 101 465 79 555 107L600 168Z"
        fill={`url(#${blue})`}
      />
      <path
        d="M43 108 88 55C183 32 265 67 300 139 337 72 425 36 515 56L558 107C455 92 347 112 300 168 251 117 147 95 43 108Z"
        fill={`url(#${white})`}
      />
      <path
        d="M71 107C157 90 248 111 299 158M91 82C177 69 253 101 299 151M112 60C192 60 267 105 299 147M301 158C352 112 447 89 532 106M301 152C349 101 425 70 512 81M302 145C339 100 414 59 490 60"
        stroke="white"
        strokeWidth="7"
        strokeLinecap="round"
      />
      <path d="M432 168C474 124 552 104 600 111V168Z" fill="#F8BDA7" />
    </svg>
  );
}

export function BookLogo() {
  return (
    <svg viewBox="0 0 64 40" fill="none" aria-hidden="true">
      <path d="M35 11C44 0 52 0 59 5L42 19Z" fill="#F3B49B" />
      <path d="m4 18 4-11c11-1 20 4 25 15C42 9 53 8 61 9l1 13-30 10Z" fill="#B7D2FF" />
      <path
        d="M0 38 5 24c11-2 22 0 27 7 8-7 19-10 31-8l1 15c-14-5-24-4-32 1C21 33 11 33 0 38Z"
        fill="#3158C9"
      />
      <path d="M6 22c10-1 20 3 26 10 7-8 18-13 29-12" stroke="white" strokeWidth="3" />
    </svg>
  );
}
