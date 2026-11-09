import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

const base = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.4,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export const SearchIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.5-3.5" />
  </svg>
);

export const BagIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M5 8h14l-1 12H6L5 8Z" />
    <path d="M9 8V6a3 3 0 1 1 6 0v2" />
  </svg>
);

export const UserIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <circle cx="12" cy="8.5" r="3.5" />
    <path d="M4.5 20a7.5 7.5 0 0 1 15 0" />
  </svg>
);

export const BookmarkIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M6 4h12v16l-6-4-6 4V4Z" />
  </svg>
);

export const CloseIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="m6 6 12 12M18 6 6 18" />
  </svg>
);

export const MenuIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M4 7h16M4 12h16M4 17h16" />
  </svg>
);

export const ChevronDownIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="m6 9 6 6 6-6" />
  </svg>
);

export const ArrowRightIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M4 12h16m0 0-6-6m6 6-6 6" />
  </svg>
);

export const PlusIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M12 5v14M5 12h14" />
  </svg>
);

export const MinusIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M5 12h14" />
  </svg>
);

export const TrashIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M4 7h16M10 11v6M14 11v6" />
    <path d="M6 7l1 13h10l1-13M9 7V4h6v3" />
  </svg>
);

export const CheckIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="m5 13 4 4L19 7" />
  </svg>
);

export const TruckIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M2 7h11v10H2zM13 10h4l3 3v4h-7z" />
    <circle cx="6" cy="18" r="1.8" />
    <circle cx="17" cy="18" r="1.8" />
  </svg>
);

export const LeafIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M4 20c0-8 6-14 16-15 0 10-5 15-12 15H4Z" />
    <path d="M9 15c2-3 5-5 8-6" />
  </svg>
);

export const ShieldIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M12 3 5 6v6c0 4.5 3 7.8 7 9 4-1.2 7-4.5 7-9V6l-7-3Z" />
  </svg>
);
