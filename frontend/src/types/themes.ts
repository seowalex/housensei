import { GroupColor } from './groups';

export type ColorTheme = Record<GroupColor, string>;

export const rainbowTheme: ColorTheme = {
  [GroupColor.Color1]: '#e6261f',
  [GroupColor.Color2]: '#e96a20',
  [GroupColor.Color3]: '#f6cd28',
  [GroupColor.Color4]: '#9fde3f',
  [GroupColor.Color5]: '#3fa02c',
  [GroupColor.Color6]: '#25b8e4',
  [GroupColor.Color7]: '#3145d8',
  [GroupColor.Color8]: '#b319c8',
};
