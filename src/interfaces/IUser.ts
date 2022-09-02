export interface IUser {
  idx: string;
  id: string;
  password: string;
  nickname: string;
  salt: string;
  iso_time: string;
  created_at: Date;
  updated_at: Date;
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
