import type { ReactNode } from "react";

type IconName = "drop" | "shield" | "map" | "bolt" | "phone";

const paths: Record<IconName, ReactNode> = {
  drop: (
    <path d="M24 8C19 16 12 24 12 34C12 45 20 54 32 54C44 54 52 45 52 34C52 24 45 16 40 8C36 2 28 2 24 8Z" />
  ),
  shield: (
    <path d="M32 4L52 12V28C52 41 43 52 32 58C21 52 12 41 12 28V12L32 4Z" />
  ),
  map: (
    <path d="M12 14L24 10L40 14L52 10V46L40 50L24 46L12 50V14Z M24 10V46 M40 14V50" />
  ),
  bolt: (
    <path d="M30 4L12 32H26L22 56L50 24H34L38 4H30Z" />
  ),
  phone: (
    <path d="M18 8H26L30 20L24 26C27 33 33 39 40 42L46 36L58 40V48C58 52 55 56 51 56C27 56 8 37 8 13C8 9 12 8 18 8Z" />
  ),
};

export function IconMark({ name }: { name: IconName }) {
  return (
    <svg className={`icon-mark icon-mark-${name}`} viewBox="0 0 64 64" aria-hidden="true">
      <g fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
        {paths[name]}
      </g>
    </svg>
  );
}
