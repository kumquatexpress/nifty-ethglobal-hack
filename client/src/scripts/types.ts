export type RGBAColor = {
  r: number;
  g: number;
  b: number;
  a: number;
};

export type BadgeDataColor =
  | "fontStroke"
  | "fontFill"
  | "background"
  | "rare"
  | "common"
  | "uncommon";

export type BadgeDataType = {
  imgSrc: string | null;
  imgFile: string | null;
  colors: {
    [key in BadgeDataColor]: RGBAColor;
  };
  hugImage: boolean;
};
