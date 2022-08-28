export interface IComment {
  idx: string;
  user_idx: number;
  comment: string;
  is_disabled: number;
  iso_time: string;
  created_at: Date;
}

export interface ICommentResponse {
  idx: string;
  comment: string;
  iso_time: string;
}
