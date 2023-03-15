export interface IUser {
  idx: string;
  id: string;
  password: string;
  nickname: string;
  passwordQuestion: string;
  passwordAnswer: string;
  salt: string;
  theme_id?: number;
  iso_time: string;
  created_at: Date;
  updated_at: Date;
}

export interface IUpdateUser {
  password?: string;
  nickname?: string;
}

export interface IUserSignUpDTO {
  id: string;
  password: string;
  nickname: string;
  passwordQuestion: string;
  passwordAnswer: string;
}

export interface IUserLoginDTO {
  id: string;
  password: string;
}
