import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { prisma } from '../../lib/prisma.js';
import { authMiddleware, roleMiddleware } from '../../middlewares/auth.js';

export const usersRouter = Router();

usersRouter.use(authMiddleware);

// Listar todos os usuários (Apenas ADMIN e GESTOR)
usersRouter.get('/', roleMiddleware(['ADMIN', 'GESTOR']), async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      where: req.user!.role === 'GESTOR' ? { role: 'TECNICO' } : undefined,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        active: true,
        createdAt: true,
        _count: {
          select: { evaluations: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return res.json({ users });
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ error: 'Erro ao listar usuários' });
  }
});

const passwordPolicySchema = z.string()
  .min(8, 'A senha deve ter pelo menos 8 caracteres')
  .regex(/[A-Za-z]/, 'A senha deve conter pelo menos uma letra')
  .regex(/[0-9]/, 'A senha deve conter pelo menos um número');

const createUserSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z.string().email('E-mail inválido'),
  password: passwordPolicySchema,
  role: z.enum(['ADMIN', 'GESTOR', 'TECNICO']).default('TECNICO')
});

// Cadastrar novo técnico/usuário (Apenas ADMIN e GESTOR)
usersRouter.post('/', roleMiddleware(['ADMIN', 'GESTOR']), async (req: Request, res: Response) => {
  try {
    const data = createUserSchema.parse(req.body);
    if (req.user!.role === 'GESTOR' && data.role !== 'TECNICO') {
      return res.status(403).json({ error: 'Gestores só podem criar usuários Técnicos.' });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: data.email.toLowerCase() }
    });

    if (existingUser) {
      return res.status(400).json({ error: 'Este e-mail já está cadastrado no sistema.' });
    }

    const passwordHash = await bcrypt.hash(data.password, 10);

    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email.toLowerCase(),
        passwordHash,
        role: data.role,
        active: true,
        mustChangePassword: true
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        active: true,
        mustChangePassword: true,
        createdAt: true
      }
    });

    return res.status(201).json({ user });
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ error: err.errors[0].message });
    }
    console.error(err);
    return res.status(500).json({ error: 'Erro ao cadastrar usuário' });
  }
});

// Alternar status ativo/inativo (Apenas ADMIN e GESTOR)
usersRouter.patch('/:id/toggle-status', roleMiddleware(['ADMIN', 'GESTOR']), async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const currentUser = req.user!;

    if (id === currentUser.id) {
      return res.status(400).json({ error: 'Você não pode desativar seu próprio acesso.' });
    }

    const targetUser = await prisma.user.findUnique({
      where: { id }
    });

    if (!targetUser) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    if (currentUser.role === 'GESTOR' && targetUser.role !== 'TECNICO') {
      return res.status(403).json({ error: 'Gestores só podem alterar o acesso de usuários Técnicos.' });
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: { active: !targetUser.active },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        active: true,
        updatedAt: true
      }
    });

    return res.json({ user: updatedUser });
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ error: 'Erro ao alterar status do usuário' });
  }
});

// Redefinir senha de um usuário (Apenas ADMIN e GESTOR)
const resetPasswordSchema = z.object({
  newPassword: passwordPolicySchema
});

usersRouter.post('/:id/reset-password', roleMiddleware(['ADMIN', 'GESTOR']), async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const currentUser = req.user!;
    const { newPassword } = resetPasswordSchema.parse(req.body);

    const targetUser = await prisma.user.findUnique({
      where: { id }
    });

    if (!targetUser) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    if (currentUser.role === 'GESTOR' && targetUser.role !== 'TECNICO') {
      return res.status(403).json({ error: 'Gestores só podem redefinir a senha de usuários Técnicos.' });
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id },
      data: {
        passwordHash,
        mustChangePassword: true
      }
    });

    return res.json({ success: true, message: `Senha de ${targetUser.name} redefinida com sucesso. No próximo acesso será exigida a criação de uma nova senha pessoal.` });
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ error: err.errors[0].message });
    }
    console.error(err);
    return res.status(500).json({ error: 'Erro ao redefinir senha do usuário' });
  }
});

// Excluir usuário (Apenas ADMIN)
usersRouter.delete('/:id', roleMiddleware(['ADMIN']), async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const currentUser = req.user!;

    if (id === currentUser.id) {
      return res.status(400).json({ error: 'Você não pode excluir sua própria conta de usuário.' });
    }

    const targetUser = await prisma.user.findUnique({
      where: { id },
      include: {
        _count: {
          select: { evaluations: true }
        }
      }
    });

    if (!targetUser) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    // Se o usuário possuir laudos vinculados, desativa o acesso ao invés de quebrar a integridade referencial dos laudos
    if (targetUser._count.evaluations > 0) {
      await prisma.user.update({
        where: { id },
        data: { active: false }
      });

      // Registra log de auditoria
      await prisma.auditLog.create({
        data: {
          action: 'DELETE',
          entity: 'USER',
          entityId: id,
          userId: currentUser.id,
          userName: currentUser.name,
          userEmail: currentUser.email,
          details: JSON.stringify({
            targetUserName: targetUser.name,
            targetUserEmail: targetUser.email,
            reason: 'Usuário desativado por possuir laudos técnicos vinculados no histórico.'
          })
        }
      });

      return res.json({
        success: true,
        message: `O usuário ${targetUser.name} possui ${targetUser._count.evaluations} laudo(s) no histórico. O acesso foi desativado para preservar os laudos técnicos.`
      });
    }

    // Se não tiver laudos, exclui permanentemente
    await prisma.user.delete({
      where: { id }
    });

    // Registra log de auditoria da exclusão
    await prisma.auditLog.create({
      data: {
        action: 'DELETE',
        entity: 'USER',
        entityId: id,
        userId: currentUser.id,
        userName: currentUser.name,
        userEmail: currentUser.email,
        details: JSON.stringify({
          targetUserName: targetUser.name,
          targetUserEmail: targetUser.email,
          reason: 'Usuário removido permanentemente do sistema.'
        })
      }
    });

    return res.json({ success: true, message: `Usuário ${targetUser.name} excluído com sucesso.` });
  } catch (err: any) {
    console.error('Erro ao excluir usuário:', err);
    return res.status(500).json({ error: 'Erro ao excluir usuário' });
  }
});
