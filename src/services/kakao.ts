import qs from "qs";
import axios from "axios";
import config from "../config";

export const getToken = async (code: string) => {
  const response = await axios.post(
    "https://kauth.kakao.com/oauth/token",
    qs.stringify({
      grant_type: "authorization_code",
      client_id: config.kakao.client_id,
      redirect_uri: config.kakao.redirect_uri,
      code: code,
      client_secret: config.kakao.client_secret,
    })
  );
  console.log(response.data);
};
