import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import {
  ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET,
  ACCESS_TOKEN_EXP,
  REFRESH_TOKEN_EXP,
} from "./config";

export function signAccessToken(payload: object) {
  return jwt.sign(payload, ACCESS_TOKEN_SECRET, { expiresIn: ACCESS_TOKEN_EXP });
}

export function signRefreshToken(payload: object) {
  return jwt.sign(payload, REFRESH_TOKEN_SECRET, { expiresIn: REFRESH_TOKEN_EXP });
}

export async function hashToken(token: string) {
  return bcrypt.hash(token, 10);
}

export async function verifyTokenHash(token: string, hash: string) {
  return bcrypt.compare(token, hash);
}
