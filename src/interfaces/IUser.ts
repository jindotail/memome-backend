export interface IUser {
  idx: number;
  id: string;
  password: string;
  nickname: string;
  salt: string;
  is_disabled: number;
  iso_time: string;
  created_at: Date;
}

export interface IUserSignUpDTO {
  id: string;
  password: string;
  nickname: string;
}

export interface IUserLoginDTO {
  id: string;
  password: string;
}
