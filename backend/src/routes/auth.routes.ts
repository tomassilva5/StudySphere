import { Router } from "express";
import jwt from "jsonwebtoken";
import { signAccessToken, signRefreshToken, hashToken, verifyTokenHash} from "../helpers/auth";
import { Request, Response } from "express";
import { COOKIES_OPTIONS, REFRESH_TOKEN_SECRET } from "../helpers/config";
import { UserLogin } from "../types/user.dto";
import userService from "../services/user.service";
import userController from "../controllers/user.controller";
import refreshService from "../services/refresh.service";

const router = Router();

router.get("/check-availability", userController.checkAvailability);

router.post("/register", userController.create);

router.post("/login", async (req:Request, res:Response) => {
    const data: UserLogin = req.body;

    if ((!data.nome_utilizador && !data.email) || (data.nome_utilizador && data.email)) {
      return res.status(400).json({ message: "Provide username OR email" });
    }

    const valid = await userService.loginUser(data);
    if (!valid) {
      return res.status(401).json({ message: "Credenciais inválidas" });
    }

    const id = data.email
      ? await userService.idByEmail(data.email)
      : await userService.idByUsername(data.nome_utilizador!);

    if (!id) {
      return res.status(401).json({ message: "Credenciais inválidas" });
    }

    const identity = data.email ?? data.nome_utilizador!;

    const accessToken = signAccessToken({
      sub: id,
      identity,
    });

    const refreshToken = signRefreshToken({
      sub: id,
      identity,
    });

    await refreshService.createRefreshToken(id, refreshToken);

    res.cookie("accessToken", accessToken, {
      ...COOKIES_OPTIONS,
      maxAge: 15 * 60 * 1000,
    });

    res.cookie("refreshToken", refreshToken, {
      ...COOKIES_OPTIONS,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({ ok: true, identity });
});

router.post("/refresh", async (req:Request, res:Response) => {
    const token = req.cookies?.refreshToken;
    if (!token) {
      return res.status(401).json({ message: "No refresh token" });
    }

    try {
      const payload = jwt.verify(token, REFRESH_TOKEN_SECRET) as {
        sub: string;
        identity: string;
      };

      const storedToken = await refreshService.findRefreshToken(token);
      if (!storedToken) throw new Error("Token not found");

      if (new Date() > storedToken.expira_em) {
        await refreshService.deleteRefreshToken(token);
        throw new Error("Token expired");
      }

      const newAccess = signAccessToken({
        sub: payload.sub,
        identity: payload.identity,
      });

      const newRefresh = signRefreshToken({
        sub: payload.sub,
        identity: payload.identity,
      });

      await refreshService.deleteRefreshToken(token);
      await refreshService.createRefreshToken(payload.sub, newRefresh);

      res.cookie("accessToken", newAccess, {
        ...COOKIES_OPTIONS,
        maxAge: 15 * 60 * 1000,
      });

      res.cookie("refreshToken", newRefresh, {
        ...COOKIES_OPTIONS,
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      return res.json({ ok: true });
    } catch {
      res.clearCookie("accessToken", COOKIES_OPTIONS);
      res.clearCookie("refreshToken", COOKIES_OPTIONS);
      return res.status(401).json({ message: "Invalid refresh token" });
    }
});

router.post("/logout", async (req:Request, res:Response) => {
    const token = req.cookies?.refreshToken;
    if (token) {
        try {
            await refreshService.deleteRefreshToken(token);
        } catch {}
    }

    res.clearCookie("accessToken", COOKIES_OPTIONS);
    res.clearCookie("refreshToken", COOKIES_OPTIONS);

    res.json({ ok: true });
});

export default router;