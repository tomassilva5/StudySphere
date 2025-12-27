import dotenv from "dotenv";
dotenv.config();

export const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET as string;
export const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET as string;
export const ACCESS_TOKEN_EXP = "15m";
export const REFRESH_TOKEN_EXP = "7d";
export const FRONTEND_URL = process.env.FRONTEND_URL as string;
export const PORT = process.env.PORT || 3000;

export const COOKIES_OPTIONS = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
};
