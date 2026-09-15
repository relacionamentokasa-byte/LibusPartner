import nodemailer from 'nodemailer';
import path from 'path';
import fs from 'fs';

export interface SendResetPasswordEmailParams {
  toEmail: string;
  userName: string;
  resetLink: string;
}

export async function sendResetPasswordEmail({ toEmail, userName, resetLink }: SendResetPasswordEmailParams): Promise<boolean> {
  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = parseInt(process.env.SMTP_PORT || '587', 10);
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  const smtpFrom = process.env.SMTP_FROM || 'Libus Partner <nao-responda@libus.com.br>';

  const logoBannerPath = path.resolve(process.cwd(), 'src/assets/libus_partner_banner.png');
  const distBannerPath = path.resolve(process.cwd(), 'dist/assets/libus_partner_banner.png');
  const finalBannerPath = fs.existsSync(distBannerPath) ? distBannerPath : logoBannerPath;
  const hasLogoBanner = fs.existsSync(finalBannerPath);

  const htmlContent = `
    <!DOCTYPE html>
    <html lang="pt-BR">
      <head>
        <meta charset="UTF-8" />
        <title>Recuperação de Senha - Libus Partner</title>
      </head>
      <body style="margin: 0; padding: 24px; background-color: #0F141F; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #E2E8F0;">
        <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 560px; background-color: #1A2130; border-radius: 16px; overflow: hidden; border: 1px solid #2D3748;">
          <tr>
            <td style="padding: 32px 32px 24px; text-align: center; border-bottom: 1px solid #2D3748; background-color: #0F141F;">
              <table align="center" border="0" cellpadding="0" cellspacing="0" style="margin: 0 auto;">
                <tr>
                  <td align="center">
                    ${hasLogoBanner ? `<img src="cid:libus_partner_banner@libus.com.br" width="280" height="50" alt="Libus Partner" style="display: block; margin: 0 auto; border: 0;" />` : ''}
                  </td>
                </tr>
              </table>
              <p style="margin: 14px 0 0; font-size: 11px; text-transform: uppercase; letter-spacing: 1.5px; color: #94A3B8; font-weight: 600;">
                Engenharia de Proteção & Homologações
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding: 32px;">
              <h2 style="margin: 0 0 16px; font-size: 18px; color: #FFFFFF; font-weight: 700;">
                Recuperação de Acesso à Plataforma
              </h2>
              <p style="margin: 0 0 16px; font-size: 14px; line-height: 1.6; color: #CBD5E1;">
                Olá, <strong>${userName}</strong>. Recebemos uma solicitação para redefinir a senha da sua conta corporativa no <strong>Libus Partner</strong>.
              </p>
              <p style="margin: 0 0 24px; font-size: 14px; line-height: 1.6; color: #CBD5E1;">
                Clique no botão abaixo para cadastrar sua nova senha. Este link é de uso único e expira em <strong>1 hora</strong>.
              </p>

              <div style="text-align: center; margin: 32px 0;">
                <a href="${resetLink}" style="display: inline-block; background-color: #E2005A; color: #FFFFFF; text-decoration: none; font-weight: 700; font-size: 13px; text-transform: uppercase; letter-spacing: 1px; padding: 14px 28px; border-radius: 10px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; box-shadow: 0 4px 14px rgba(226, 0, 90, 0.4);">
                  Redefinir Minha Senha
                </a>
              </div>

              <p style="margin: 0 0 12px; font-size: 12px; color: #94A3B8; line-height: 1.5;">
                Se o botão acima não funcionar, copie e cole o endereço abaixo no seu navegador:
              </p>
              <p style="margin: 0 0 24px; font-size: 11px; color: #E2005A; word-break: break-all; font-family: monospace; background-color: #0F141F; padding: 10px; border-radius: 6px; border: 1px solid #2D3748;">
                ${resetLink}
              </p>

              <hr style="border: 0; border-top: 1px solid #2D3748; margin: 24px 0;" />

              <p style="margin: 0; font-size: 12px; color: #64748B; line-height: 1.5;">
                Caso não tenha solicitado esta alteração, ignore esta mensagem. Sua senha atual permanecerá segura.
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding: 20px 32px; background-color: #0F141F; text-align: center; border-top: 1px solid #2D3748;">
              <p style="margin: 0; font-size: 11px; color: #64748B; font-family: monospace;">
                Libus do Brasil • Divisão de Engenharia de Aplicação
              </p>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;

  // Se o servidor SMTP estiver configurado no .env, realiza o envio real
  if (smtpHost && smtpUser && smtpPass) {
    try {
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpPort === 465,
        auth: {
          user: smtpUser,
          pass: smtpPass
        }
      });

      const attachments = hasLogoBanner ? [{
        filename: 'libus_partner_banner.png',
        path: finalBannerPath,
        cid: 'libus_partner_banner@libus.com.br'
      }] : [];

      await transporter.sendMail({
        from: smtpFrom,
        to: toEmail,
        subject: 'Recuperação de Senha - Libus Partner',
        html: htmlContent,
        attachments
      });

      return true;
    } catch (error) {
      console.error('[SMTP ERROR] Falha ao enviar e-mail via servidor SMTP:', error);
      console.log(`[SMTP DEV FALLBACK] Link de recuperação para ${toEmail}: ${resetLink}`);
      return false;
    }
  }

  // Modo Desenvolvimento / Homologação (sem SMTP configurado): registra no console
  console.log('--------------------------------------------------');
  console.log(`[AUTH EMAIL SIMULATION] Para: ${toEmail}`);
  console.log(`[AUTH EMAIL SIMULATION] Link: ${resetLink}`);
  console.log('--------------------------------------------------');
  return true;
}
