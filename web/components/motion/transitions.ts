// Shared motion timing — keep these in one place so the site feels coherent.
// Tuned to the "Linear / Vercel / Stripe" subtle register: present but not loud.

export const REVEAL_EASE = [0.16, 1, 0.3, 1] as const; // expo-out
export const REVEAL_DURATION = 0.5;
export const REVEAL_DISTANCE = 20;
export const STAGGER = 0.06;

// Slightly tighter stagger for grids with many items (e.g. 9 testimonial tiles)
// so the cascade reads quickly.
export const STAGGER_TIGHT = 0.05;

// Lightbox enter/exit
export const LIGHTBOX_DURATION = 0.18;

// Pricing card hover spring
export const HOVER_SPRING = {
  type: "spring",
  stiffness: 320,
  damping: 22,
} as const;
