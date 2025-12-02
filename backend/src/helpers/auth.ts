import jwt from 'jsonwebtoken';
import bcrypt from "bcryptjs";
import { ACCESS_TOKEN_EXP, ACCESS_TOKEN_SECRET, REFRESH_TOKEN_EXP, REFRESH_TOKEN_SECRET } from './config';

export function signAccessToken(payload:object){
    return jwt.sign(payload, ACCESS_TOKEN_SECRET, { expiresIn: ACCESS_TOKEN_EXP});
}

export function signRefreshToken(payload: object){
    return jwt.sign(payload, REFRESH_TOKEN_SECRET, {expiresIn: REFRESH_TOKEN_EXP})
}

export async function hashAndStoreRefreshToken(store: Map<string, string>, userId: string, token: string) {
    const hashed = await bcrypt.hash(token, 10);
    store.set(userId, hashed);
}

export async function verifyStoredRefreshToken(store: Map<string, string>, userId: string, token: string) {
    const hashed = store.get(userId);
    if (!hashed) return false;
    return bcrypt.compare(token, hashed);
}

export function clearStoredRefreshToken(store: Map<string, string>, userId: string) {
    store.delete(userId);
}