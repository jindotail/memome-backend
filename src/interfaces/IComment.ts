export interface IComment {
  _idx: number;
  user_idx: number;
  comment: string;
  created_at: Date;
}

export interface ICommentResponse {
  comment: string;
  created_at: number;
}
