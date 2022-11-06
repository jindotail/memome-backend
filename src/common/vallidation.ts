import APIError from "../errors/APIError";
import { HttpStatusCode } from "./http";

export const ID_MIN_LENGTH = 3;
export const ID_MAX_LENGTH = 10;
export const PW_MIN_LENGTH = 3;
export const PW_MAX_LENGTH = 30;
export const NICKNAME_MIN_LENGTH = 1;
export const NICKNAME_MAX_LENGTH = 10;
export const PW_QUESTION_MIN_LENGTH = 1;
export const PW_QUESTION_MAX_LENGTH = 30;
export const PW_ANSWER_MIN_LENGTH = 1;
export const PW_ANSWER_MAX_LENGTH = 30;

export const validationLength = (
  input: string,
  minLength: number,
  maxLength: number
): void => {
  if (input.length < minLength || maxLength < input.length)
    throw new APIError(
      "AuthRouter",
      HttpStatusCode.BAD_REQUEST,
      "invalid length"
    );
};

export const validAlphabetOrNumber = (input: string): void => {
  if (!input.match(/^[0-9a-z]+$/))
    throw new APIError(
      "AuthRouter",
      HttpStatusCode.BAD_REQUEST,
      "not alphanumeric"
    );
};
