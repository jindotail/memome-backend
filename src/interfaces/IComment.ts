export interface IComment {
  _idx: number;
  user_idx: number;
  comment: string;
  iso_time: string;
  created_at: Date;
}

export interface ICommentResponse {
  comment: string;
  iso_time: string;
}
