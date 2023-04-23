import qs from "qs";
import { HttpStatusCode } from "../common/http";
import config from "../config";
import * as jwt from "../common/jwt";
import APIError from "../errors/APIError";
import axios, { AxiosResponse } from "axios";
import { IUserSignUpDTO } from "../interfaces/IUser";

interface TokenResponse {
  access_token: string;
  token_type: string;
  refresh_token: string;
  expires_in: number;
  scope: string;
  refresh_token_expires_in: string;
}



export const getToken = async (code: string): string => {
  try {
    const tokenResponse: AxiosResponse<TokenResponse> = await axios.post(
      "https://kauth.kakao.com/oauth/token",
      qs.stringify({
        grant_type: "authorization_code",
        client_id: config.kakao.client_id,
        redirect_uri: config.kakao.redirect_uri,
        code: code,
        client_secret: config.kakao.client_secret,
      })
    );

    return tokenResponse.data.access_token;
  } catch (err) {
    throw new APIError(
      "KakaoService",
      HttpStatusCode.BAD_REQUEST,
      "kakao token api 보낼 때 문제 생김...."
    );
  }
};
