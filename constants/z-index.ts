export const Z_INDEX = {
  BEHIND: -10,
  HEADER: 100,
  DROPDOWN: 200,
  DRAWER: 300,
  BACKDROP: 900,
  MODAL: 1000,
  GALLERY: 1100,
  TOAST: 1200,
} as const;

export type ZIndexLevel = keyof typeof Z_INDEX;
