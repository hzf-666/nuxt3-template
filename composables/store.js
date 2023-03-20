export const store = {
  useIsMobile: () => useState('isMobile', () => (false)),
  useNavTree: () => useState('navTree', () => ([])),
  useNavMap: () => useState('navMap', () => (new Map())),
  useCurrentNav: () => useState('currentNav', () => ({})),
  useWebInfo: () => useState('webInfo', () => ({})),
};
