import { Request, Response, NextFunction } from "express";
import { adminAuth } from "../services/firebase";

export interface AuthenticatedRequest extends Request {
  user?: {
    uid: string;
    email?: string;
    name?: string;
  };
}

export const authenticateToken = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    // If Firebase is not available, skip authentication for development
    if (!adminAuth) {
      console.log("⚠️  Firebase not available, skipping authentication");
      req.user = {
        uid: "demo-user",
        email: "demo@example.com",
        name: "Demo User",
      };
      return next();
    }

    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.startsWith('Bearer ') 
      ? authHeader.substring(7) 
      : null;

    if (!token) {
      return res.status(401).json({ message: "Token de acesso não fornecido" });
    }

    const decodedToken = await adminAuth.verifyIdToken(token);
    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email,
      name: decodedToken.name,
    };

    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    return res.status(403).json({ message: "Token inválido" });
  }
};
