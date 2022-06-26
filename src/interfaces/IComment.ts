export interface IComment {
  idx: number;
  user_idx: number;
  comment: string;
  is_disabled: number;
  iso_time: string;
  created_at: Date;
}

export interface ICommentResponse {
  idx: number;
  comment: string;
  iso_time: string;
}
