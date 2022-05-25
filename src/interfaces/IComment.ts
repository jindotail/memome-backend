export interface IComment {
  _idx: number;
  user_idx: number;
  comment: string;
  created_at: string;
}

export interface ICommentResponse {
  comment: string;
  created_at: string;
}
