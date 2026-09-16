import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { z } from 'zod';
import { prisma } from '../../lib/prisma.js';
import { authMiddleware, getJwtSecret } from '../../middlewares/auth.js';
import { sendResetPasswordEmail } from '../../lib/email.js';
import { createAuditLog } from '../../lib/audit.js';

export const authRouter = Router();

const loginSchema = z.object({
  email: z.string().email('E-mail inválido'),
  password: z.string().min(4, 'Senha deve ter pelo menos 4 caracteres')
});

authRouter.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = loginSchema.parse(req.body);

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    });

    if (!user || !user.active) {
      return res.status(401).json({ error: 'Credenciais inválidas ou usuário inativo' });
    }

    const passwordMatch = await bcrypt.compare(password, user.passwordHash);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    const payload = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    };

    const token = jwt.sign(payload, getJwtSecret(), {
      expiresIn: '7d'
    });

    return res.json({
      token,
      user: payload
    });
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ error: err.errors[0].message });
    }
    console.error('Erro detalhado no login:', err);
    return res.status(500).json({
      error: 'Erro interno ao autenticar',
      details: err?.message || String(err)
    });
  }
});

authRouter.get('/me', authMiddleware, async (req: Request, res: Response) => {
  return res.json({ user: req.user });
});

// Solicitação de Recuperação de Senha (Esqueceu a senha)
const forgotPasswordSchema = z.object({
  email: z.string().email('Informe um e-mail válido')
});

authRouter.post('/forgot-password', async (req: Request, res: Response) => {
  try {
    const { email } = forgotPasswordSchema.parse(req.body);
    const normalizedEmail = email.toLowerCase().trim();

    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail }
    });

    // Por boas práticas de segurança, retornamos mensagem genérica caso o e-mail não exista
    if (!user || !user.active) {
      return res.json({
        success: true,
        message: 'Se o e-mail estiver cadastrado em nossa base, as instruções de recuperação foram enviadas.'
      });
    }

    // Gerar token criptografado único com expiração de 1 hora
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hora a partir de agora

    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetPasswordToken: resetToken,
        resetPasswordExpires
      }
    });

    const clientUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const resetLink = `${clientUrl}/reset-password?token=${resetToken}`;

    await sendResetPasswordEmail({
      toEmail: user.email,
      userName: user.name,
      resetLink
    });

    await createAuditLog({
      user: { id: user.id, name: user.name, email: user.email, role: user.role as any },
      action: 'UPDATE',
      entity: 'USER',
      entityId: user.id,
      details: { action: 'SOLICITACAO_RESET_SENHA', ip: req.ip },
      ipAddress: req.ip
    });

    return res.json({
      success: true,
      message: 'Instruções para redefinição de senha foram enviadas para o seu e-mail corporativo.'
    });
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ error: err.errors[0].message });
    }
    console.error('Erro no forgot-password:', err);
    return res.status(500).json({ error: 'Erro ao processar solicitação de recuperação de senha' });
  }
});

// Validação e Definição da Nova Senha via Token
const resetPasswordWithTokenSchema = z.object({
  token: z.string().min(1, 'Token de recuperação é obrigatório'),
  newPassword: z.string().min(4, 'Nova senha deve ter pelo menos 4 caracteres')
});

authRouter.post('/reset-password-with-token', async (req: Request, res: Response) => {
  try {
    const { token, newPassword } = resetPasswordWithTokenSchema.parse(req.body);

    const user = await prisma.user.findFirst({
      where: {
        resetPasswordToken: token,
        resetPasswordExpires: {
          gt: new Date()
        }
      }
    });

    if (!user || !user.active) {
      return res.status(400).json({
        error: 'O link de recuperação é inválido ou expirou. Por favor, solicite uma nova redefinição.'
      });
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash,
        resetPasswordToken: null,
        resetPasswordExpires: null
      }
    });

    await createAuditLog({
      user: { id: user.id, name: user.name, email: user.email, role: user.role as any },
      action: 'UPDATE',
      entity: 'USER',
      entityId: user.id,
      details: { action: 'SENHA_REDEFINIDA_COM_SUCESSO_VIA_TOKEN' },
      ipAddress: req.ip
    });

    return res.json({
      success: true,
      message: 'Sua senha foi redefinida com sucesso! Você já pode realizar o login.'
    });
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ error: err.errors[0].message });
    }
    console.error('Erro no reset-password-with-token:', err);
    return res.status(500).json({ error: 'Erro ao redefinir senha' });
  }
});

// Alteração de Senha do Próprio Usuário (Logado)
const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Senha atual é obrigatória'),
  newPassword: z.string().min(4, 'Nova senha deve ter pelo menos 4 caracteres')
});

authRouter.post('/change-password', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { currentPassword, newPassword } = changePasswordSchema.parse(req.body);
    const userId = req.user!.id;

    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    const passwordMatch = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!passwordMatch) {
      return res.status(400).json({ error: 'Senha atual incorreta' });
    }

    const newPasswordHash = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { id: userId },
      data: { passwordHash: newPasswordHash }
    });

    return res.json({ success: true, message: 'Senha alterada com sucesso' });
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ error: err.errors[0].message });
    }
    return res.status(500).json({ error: 'Erro ao alterar senha' });
  }
});

