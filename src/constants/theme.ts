/** Comic palette: printed-comic colours, dark navy for every outline and text. */
export const Colors = {
  ink: '#1B1340',
  inkSoft: '#5B5380',
  purple: '#8B7BFF',
  pink: '#FF7CBF',
  orange: '#FFA21A',
  yellow: '#FFD93D',
  green: '#5CD66B',
  blue: '#6EC6FF',
  red: '#F2384A',
  cream: '#FFF6E0',
  white: '#FFFFFF',
  success: '#1F7A3D',
  successBg: '#C9F5D0',
  danger: '#B3202F',
} as const;

export type ColorToken = 'purple' | 'pink' | 'orange' | 'yellow' | 'green' | 'blue' | 'cream';

export const Spacing = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 } as const;

export const Radius = { sm: 14, md: 22, lg: 30, pill: 999 } as const;

/** Minimum touch target for kids (dp). */
export const TouchTarget = 56;

export const Fonts = {
  /** Body: Andika has single-storey a/g, the shapes children are taught to write. */
  regular: 'Andika_400Regular',
  bold: 'Andika_700Bold',
  /** Chunky rounded display face for headlines and buttons. */
  display: 'LilitaOne_400Regular',
  /** Comic sound effects (POW!, YAY!) only. */
  sfx: 'Bangers_400Regular',
} as const;

export const Outline = { borderWidth: 3, borderColor: Colors.ink } as const;
