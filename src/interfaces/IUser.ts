export interface IUser {
  _idx: number;
  id: string;
  password: string;
  nickname: string;
  created_at: string;
}

export interface IUserSignUpDTO {
  id: string;
  password: string;
  nickname: string;
}
