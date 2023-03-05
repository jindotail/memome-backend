export interface ITheme {
  id: number;
  backgroundColor: IBackgroundColor;
  commentColor: ICommentColor;
}

export interface IBackgroundColor {
  start: string;
  middle: string;
  end: string;
}

export interface ICommentColor {
  start: string;
  end: string;
}
