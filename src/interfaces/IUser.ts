export interface IUser {
  _idx: number;
  id: string;
  password: string;
  nickname: string;
  created_at: Date;
}

export interface IUserSignUpDTO {
  id: string;
  password: string;
  nickname: string;
}
