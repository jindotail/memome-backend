export interface IComment {
  idx: string;
  user_idx: string;
  comment: string;
  ip: string;
  owner: boolean;
  iso_time: string;
  created_at: Date;
  updated_at: Date;
}

export interface ICommentResponse {
  idx: string;
  comment: string;
  owner: boolean;
  iso_time: string;
}
