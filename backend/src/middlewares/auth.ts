import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '../lib/prisma.js';

export interface AuthenticatedUser {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'GESTOR' | 'TECNICO';
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}

export function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (process.env.NODE_ENV === 'production' && (!secret || secret === 'secret' || secret.length < 16)) {
    throw new Error('FATAL: JWT_SECRET seguro é obrigatório em ambiente de produção (mínimo 16 caracteres).');
  }
  return secret || 'libus_partner_dev_fallback_secret_key_2024';
}

export async function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: 'Token de autenticação não fornecido', code: 'NO_TOKEN' });
  }

  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return res.status(401).json({ error: 'Formato de token inválido', code: 'INVALID_FORMAT' });
  }

  const token = parts[1];
  try {
    const decoded = jwt.verify(token, getJwtSecret()) as AuthenticatedUser;

    // Validação em tempo real no banco: bloqueia imediatamente técnicos desativados
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        active: true
      }
    });

    if (!user || !user.active) {
      return res.status(401).json({
        error: 'Acesso revogado: usuário inexistente ou desativado pela administração.',
        code: 'USER_INACTIVE'
      });
    }

    req.user = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role as 'ADMIN' | 'GESTOR' | 'TECNICO'
    };

    return next();
  } catch (err: any) {
    if (err?.name === 'TokenExpiredError') {
      return res.status(401).json({
        error: 'Sessão expirada. Faça login novamente.',
        code: 'TOKEN_EXPIRED'
      });
    }
    return res.status(401).json({
      error: 'Token inválido ou expirado',
      code: 'INVALID_TOKEN'
    });
  }
}

export function roleMiddleware(allowedRoles: Array<'ADMIN' | 'GESTOR' | 'TECNICO'>) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Não autenticado' });
    }
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Acesso negado para o seu perfil' });
    }
    return next();
  };
}

