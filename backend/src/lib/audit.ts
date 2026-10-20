import { prisma } from './prisma.js';
import { AuthenticatedUser } from '../middlewares/auth.js';
import { AlvesAuthenticatedUser } from '../middlewares/alvesAuth.js';

export interface AuditLogInput {
  user?: AuthenticatedUser | AlvesAuthenticatedUser | null;
  alvesUser?: AlvesAuthenticatedUser | null;
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'COMPLETE' | 'COMPLETE_AND_SIGN' | 'EMISSION' | 'EXPORT_PDF' | 'STATUS_CHANGE';
  entity: 'EVALUATION' | 'COMPANY' | 'USER' | 'CATALOG' | 'ALVES_CLIENT' | 'ALVES_PROPOSAL' | 'ALVES_CONTRACT' | 'ALVES_CONFIG';
  entityId: string;
  details?: Record<string, any> | string;
  ipAddress?: string;
}

export async function createAuditLog(input: AuditLogInput) {
  try {
    const detailsStr = typeof input.details === 'object'
      ? JSON.stringify(input.details)
      : input.details;

    return await prisma.auditLog.create({
      data: {
        userId: input.alvesUser ? null : input.user?.id || null,
        alvesUserId: input.alvesUser?.id || null,
        userName: input.alvesUser?.name || input.user?.name || null,
        userEmail: input.alvesUser?.email || input.user?.email || null,
        userRole: input.alvesUser?.role || input.user?.role || null,
        action: input.action,
        entity: input.entity,
        entityId: input.entityId,
        details: detailsStr || null,
        ipAddress: input.ipAddress || null
      }
    });
  } catch (error) {
    console.error('[AUDIT ERROR] Falha ao registrar log de auditoria:', error);
    return null;
  }
}
