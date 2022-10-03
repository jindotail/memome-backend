import APIError from "../errors/APIError";
import { HttpStatusCode } from "./http";

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
