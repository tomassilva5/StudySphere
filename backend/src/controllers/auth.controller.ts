import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { ACCESS_TOKEN_SECRET } from "../helpers/config";
import { ExtendedError, Socket } from "socket.io";
import cookie from "cookie";
export function authController(req: Request, res:Response, next: NextFunction){
    const token = req.cookies?.accessToken;
    console.log('[Auth Middleware] Cookies recebidos:', req.cookies);
    console.log('[Auth Middleware] Access Token:', token ? 'presente' : 'ausente');
    
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    try {
        const payload = jwt.verify(
            token,
            process.env.ACCESS_TOKEN_SECRET!
        ) as { sub: string; identity: string };
      
        req.user = {
            id: payload.sub,
            identity: payload.identity,
        };
      
        console.log('[Auth Middleware] Usuário autenticado:', req.user.identity);
        next();
    } catch (error) {
        console.log('[Auth Middleware] Erro ao verificar token:', error);
        return res.status(401).json({ message: "Unauthorized" });
    }
}
export const  socketAuthMiddleware = (socket: Socket, next: (err?: ExtendedError) => void) => {
  try {
    const cookieHeader = socket.request.headers.cookie;
    
    if (!cookieHeader) {
      return next(new Error("Unauthorized: No cookies found"));
    }
    const cookies = cookie.parse(cookieHeader);
    const accessToken = cookies.accessToken;
    if (!accessToken) {
      return next(new Error("Unauthorized: Access Token missing"));
    }
    const payload = jwt.verify(accessToken, ACCESS_TOKEN_SECRET!) as { 
      sub: string; 
      identity: string 
    };
    socket.data.user = {
      id: payload.sub,
      identity: payload.identity
    };

    next();
  } catch (err) {
    next(new Error("Unauthorized: Invalid Token"));
  }
};