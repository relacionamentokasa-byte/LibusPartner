import { prisma } from './prisma.js';
import { AuthenticatedUser } from '../middlewares/auth.js';

export interface AuditLogInput {
  user?: AuthenticatedUser | null;
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'COMPLETE' | 'EMISSION' | 'EXPORT_PDF' | 'STATUS_CHANGE';
  entity: 'EVALUATION' | 'COMPANY' | 'USER' | 'CATALOG';
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
        userId: input.user?.id || null,
        userName: input.user?.name || null,
        userEmail: input.user?.email || null,
        userRole: input.user?.role || null,
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
