import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class EmailTemplatesService {
  private readonly logoPath: string;
  private logoBase64: string | null = null;

  constructor() {
    // Path to logo in templates directory
    // In development: src/mail/templates/logo.png
    // In production: dist/mail/templates/logo.png
    const isProduction = __dirname.includes('dist');
    const basePath = isProduction
      ? path.join(__dirname, 'templates', 'logo.png')
      : path.join(__dirname, 'templates', 'logo.png');
    this.logoPath = basePath;
    this.loadLogo();
  }

  private loadLogo() {
    try {
      if (fs.existsSync(this.logoPath)) {
        const logoBuffer = fs.readFileSync(this.logoPath);
        this.logoBase64 = logoBuffer.toString('base64');
      }
    } catch (error) {
      console.warn('Could not load logo for emails:', error);
    }
  }

  private getLogoHtml(): string {
    if (this.logoBase64) {
      return `<img src="data:image/png;base64,${this.logoBase64}" alt="WorkIt" style="max-width: 200px; height: auto; margin-bottom: 20px;" />`;
    }
    // Fallback to text logo if image not available
    return `<h1 style="color: #0891b2; font-size: 28px; font-weight: bold; margin: 0 0 20px 0;">WORKIT</h1>`;
  }

  private getBaseTemplate(content: string): string {
    return `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>WorkIt</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f1f5f9; line-height: 1.6;">
  <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #f1f5f9; padding: 20px 0;">
    <tr>
      <td align="center" style="padding: 20px 0;">
        <table role="presentation" style="max-width: 600px; width: 100%; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); overflow: hidden;">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #0891b2 0%, #06b6d4 100%); padding: 30px 40px; text-align: center;">
              ${this.getLogoHtml()}
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px;">
              ${content}
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #f8fafc; padding: 30px 40px; text-align: center; border-top: 1px solid #e2e8f0;">
              <p style="margin: 0 0 10px 0; color: #64748b; font-size: 14px;">
                <strong style="color: #0891b2;">WorkIt</strong> - Plateforme de recrutement
              </p>
              <p style="margin: 0; color: #94a3b8; font-size: 12px;">
                Cet email a été envoyé automatiquement, merci de ne pas y répondre.
              </p>
              <p style="margin: 15px 0 0 0; color: #94a3b8; font-size: 12px;">
                © ${new Date().getFullYear()} WorkIt. Tous droits réservés.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `.trim();
  }

  getEmailVerificationTemplate(
    confirmationUrl: string,
    userName?: string,
  ): string {
    const greeting = userName ? `Bonjour ${userName},` : 'Bonjour,';

    const content = `
      <h2 style="color: #0f172a; font-size: 24px; font-weight: 600; margin: 0 0 20px 0;">
        Bienvenue sur WorkIt ! 🎉
      </h2>
      <p style="color: #334155; font-size: 16px; margin: 0 0 20px 0;">
        ${greeting}
      </p>
      <p style="color: #334155; font-size: 16px; margin: 0 0 20px 0;">
        Merci de vous être inscrit sur <strong style="color: #0891b2;">WorkIt</strong>. 
        Pour finaliser votre inscription, veuillez confirmer votre adresse email en cliquant sur le bouton ci-dessous.
      </p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${confirmationUrl}" 
           style="display: inline-block; background-color: #0891b2; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 16px; transition: background-color 0.3s;">
          Confirmer mon adresse email
        </a>
      </div>
      <p style="color: #64748b; font-size: 14px; margin: 30px 0 0 0;">
        Si le bouton ne fonctionne pas, vous pouvez copier et coller ce lien dans votre navigateur :
      </p>
      <p style="color: #0891b2; font-size: 14px; word-break: break-all; margin: 10px 0 0 0;">
        ${confirmationUrl}
      </p>
      <p style="color: #94a3b8; font-size: 14px; margin: 30px 0 0 0;">
        Si vous n'avez pas créé de compte sur WorkIt, vous pouvez ignorer cet email en toute sécurité.
      </p>
    `;

    return this.getBaseTemplate(content);
  }

  getPasswordResetTemplate(resetUrl: string, userName?: string): string {
    const greeting = userName ? `Bonjour ${userName},` : 'Bonjour,';

    const content = `
      <h2 style="color: #0f172a; font-size: 24px; font-weight: 600; margin: 0 0 20px 0;">
        Réinitialisation de mot de passe 🔐
      </h2>
      <p style="color: #334155; font-size: 16px; margin: 0 0 20px 0;">
        ${greeting}
      </p>
      <p style="color: #334155; font-size: 16px; margin: 0 0 20px 0;">
        Vous avez demandé une réinitialisation de votre mot de passe sur <strong style="color: #0891b2;">WorkIt</strong>.
        Cliquez sur le bouton ci-dessous pour créer un nouveau mot de passe.
      </p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${resetUrl}" 
           style="display: inline-block; background-color: #0891b2; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 16px;">
          Réinitialiser mon mot de passe
        </a>
      </div>
      <p style="color: #64748b; font-size: 14px; margin: 30px 0 0 0;">
        Si le bouton ne fonctionne pas, vous pouvez copier et coller ce lien dans votre navigateur :
      </p>
      <p style="color: #0891b2; font-size: 14px; word-break: break-all; margin: 10px 0 0 0;">
        ${resetUrl}
      </p>
      <p style="color: #ef4444; font-size: 14px; margin: 30px 0 0 0; padding: 15px; background-color: #fef2f2; border-radius: 8px; border-left: 4px solid #ef4444;">
        <strong>⚠️ Important :</strong> Ce lien est valide pendant 1 heure uniquement. 
        Si vous n'avez pas demandé cette réinitialisation, ignorez cet email en toute sécurité.
      </p>
    `;

    return this.getBaseTemplate(content);
  }

  getApplicationStatusTemplate(
    status: 'pending' | 'reviewed' | 'accepted' | 'rejected',
    message: string,
    jobTitle?: string,
    isSpontaneous: boolean = false,
    userName?: string,
  ): string {
    const greeting = userName ? `Bonjour ${userName},` : 'Bonjour,';

    let statusIcon = '📋';
    let statusColor = '#0891b2';
    let statusTitle = 'Mise à jour de candidature';

    // Adjust titles based on whether it's spontaneous or regular application
    if (status === 'accepted') {
      statusIcon = '✅';
      statusColor = '#10b981';
      statusTitle = isSpontaneous
        ? 'Félicitations ! Votre candidature spontanée a été acceptée'
        : 'Félicitations ! Votre candidature a été acceptée';
    } else if (status === 'rejected') {
      statusIcon = '❌';
      statusColor = '#ef4444';
      statusTitle = isSpontaneous
        ? 'Réponse à votre candidature spontanée'
        : 'Réponse à votre candidature';
    } else if (status === 'reviewed') {
      statusIcon = '👀';
      statusColor = '#f59e0b';
      statusTitle = isSpontaneous
        ? 'Votre candidature spontanée avance'
        : 'Votre candidature avance';
    } else {
      // pending status
      statusTitle = isSpontaneous
        ? 'Mise à jour de votre candidature spontanée'
        : 'Mise à jour de candidature';
    }

    // Show job info for regular applications, or "Candidature Spontanée" for spontaneous
    const jobInfo = isSpontaneous
      ? `<div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid ${statusColor};">
           <p style="margin: 0 0 8px 0; color: #64748b; font-size: 14px; font-weight: 600;">TYPE :</p>
           <p style="margin: 0; color: #0f172a; font-size: 18px; font-weight: 600;">🚀 Candidature Spontanée</p>
         </div>`
      : jobTitle
        ? `<div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid ${statusColor};">
             <p style="margin: 0 0 8px 0; color: #64748b; font-size: 14px; font-weight: 600;">POSTE :</p>
             <p style="margin: 0; color: #0f172a; font-size: 18px; font-weight: 600;">${jobTitle}</p>
           </div>`
        : '';

    const content = `
      <h2 style="color: ${statusColor}; font-size: 24px; font-weight: 600; margin: 0 0 20px 0;">
        ${statusIcon} ${statusTitle}
      </h2>
      <p style="color: #334155; font-size: 16px; margin: 0 0 20px 0;">
        ${greeting}
      </p>
      ${jobInfo}
      <div style="background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; margin: 20px 0;">
        <p style="color: #334155; font-size: 16px; margin: 0; white-space: pre-line;">${message}</p>
      </div>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/candidate/dashboard" 
           style="display: inline-block; background-color: ${statusColor}; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 16px;">
          Voir mon tableau de bord
        </a>
      </div>
      <p style="color: #64748b; font-size: 14px; margin: 30px 0 0 0;">
        Vous pouvez consulter toutes vos candidatures depuis votre tableau de bord WorkIt.
      </p>
    `;

    return this.getBaseTemplate(content);
  }

  getApplicationReceivedTemplate(jobTitle: string, userName?: string): string {
    const greeting = userName ? `Bonjour ${userName},` : 'Bonjour,';

    const content = `
      <h2 style="color: #0891b2; font-size: 24px; font-weight: 600; margin: 0 0 20px 0;">
        📩 Candidature reçue
      </h2>
      <p style="color: #334155; font-size: 16px; margin: 0 0 20px 0;">
        ${greeting}
      </p>
      <p style="color: #334155; font-size: 16px; margin: 0 0 20px 0;">
        Nous avons bien reçu votre <strong style="color: #0891b2;">candidature</strong> pour le poste de 
        <strong>${jobTitle}</strong> sur WorkIt.
      </p>
      <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #0891b2;">
        <p style="margin: 0 0 8px 0; color: #64748b; font-size: 14px; font-weight: 600;">POSTE :</p>
        <p style="margin: 0; color: #0f172a; font-size: 18px; font-weight: 600;">${jobTitle}</p>
      </div>
      <p style="color: #334155; font-size: 16px; margin: 0 0 20px 0;">
        Notre équipe de recrutement examinera votre candidature prochainement. 
        Vous recevrez une réponse une fois qu'elle aura été examinée.
      </p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/candidate/dashboard" 
           style="display: inline-block; background-color: #0891b2; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 16px;">
          Voir mes candidatures
        </a>
      </div>
      <p style="color: #64748b; font-size: 14px; margin: 30px 0 0 0;">
        Cordialement,<br/>
        <strong style="color: #0891b2;">L'équipe WorkIt</strong>
      </p>
    `;

    return this.getBaseTemplate(content);
  }

  getSpontaneousApplicationReceivedTemplate(userName?: string): string {
    const greeting = userName ? `Bonjour ${userName},` : 'Bonjour,';

    const content = `
      <h2 style="color: #0891b2; font-size: 24px; font-weight: 600; margin: 0 0 20px 0;">
        📩 Candidature spontanée reçue
      </h2>
      <p style="color: #334155; font-size: 16px; margin: 0 0 20px 0;">
        ${greeting}
      </p>
      <p style="color: #334155; font-size: 16px; margin: 0 0 20px 0;">
        Nous avons bien reçu votre <strong style="color: #0891b2;">candidature spontanée</strong> sur WorkIt.
      </p>
      <p style="color: #334155; font-size: 16px; margin: 0 0 20px 0;">
        Notre équipe examinera votre profil et vous contactera si un poste correspond à vos compétences.
      </p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/candidate/dashboard" 
           style="display: inline-block; background-color: #0891b2; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 16px;">
          Voir mes candidatures
        </a>
      </div>
      <p style="color: #64748b; font-size: 14px; margin: 30px 0 0 0;">
        Cordialement,<br/>
        <strong style="color: #0891b2;">L'équipe WorkIt</strong>
      </p>
    `;

    return this.getBaseTemplate(content);
  }

  getInactiveUserWarningTemplate(userName?: string): string {
    const greeting = userName ? `Bonjour ${userName},` : 'Bonjour,';

    const content = `
      <h2 style="color: #f59e0b; font-size: 24px; font-weight: 600; margin: 0 0 20px 0;">
        ⏳ Votre compte WorkIt est inactif
      </h2>
      <p style="color: #334155; font-size: 16px; margin: 0 0 20px 0;">
        ${greeting}
      </p>
      <p style="color: #334155; font-size: 16px; margin: 0 0 20px 0;">
        Cela fait longtemps que vous n'avez pas utilisé <strong style="color: #0891b2;">WorkIt</strong>. 
        Votre compte est inactif depuis plus de 5 mois.
      </p>
      <div style="background-color: #fef3c7; border: 1px solid #f59e0b; border-radius: 8px; padding: 20px; margin: 20px 0;">
        <p style="color: #92400e; font-size: 16px; margin: 0; font-weight: 600;">
          ⚠️ Votre compte sera supprimé dans 30 jours si aucune activité n'est détectée.
        </p>
      </div>
      <p style="color: #334155; font-size: 16px; margin: 0 0 20px 0;">
        Pour conserver votre compte, connectez-vous simplement sur WorkIt dans les 30 prochains jours.
      </p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/login" 
           style="display: inline-block; background-color: #0891b2; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 16px;">
          Se connecter maintenant
        </a>
      </div>
      <p style="color: #64748b; font-size: 14px; margin: 30px 0 0 0;">
        Cordialement,<br/>
        <strong style="color: #0891b2;">L'équipe WorkIt</strong>
      </p>
    `;

    return this.getBaseTemplate(content);
  }
}
