const nodemailer = require('nodemailer');
require('dotenv').config();

const mailDisabled =
  process.env.MAIL_DISABLED === 'true' ||
  !process.env.MAIL_HOST ||
  !process.env.MAIL_USER ||
  !process.env.MAIL_PASS;

let transporter = null;

if (!mailDisabled) {
  transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: parseInt(process.env.MAIL_PORT || '587', 10),
    secure: false,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });
}

const sendMail = async (to, subject, html) => {
  if (mailDisabled) {
    console.log(`[MAIL_DISABLED] E-mail não enviado para ${to}: ${subject}`);
    return;
  }

  await transporter.sendMail({
    from: process.env.MAIL_FROM,
    to,
    subject,
    html,
  });
};

const sendWelcomeEmail = (email, name) =>
  sendMail(email, 'Bem-vindo ao TravelBuddy! ✈️', `
    <h2>Olá, ${name}!</h2>
    <p>Sua conta no <strong>TravelBuddy</strong> foi criada com sucesso.</p>
    <p>Comece agora a planejar sua próxima viagem!</p>
  `);

const sendPasswordResetEmail = (email, token) =>
  sendMail(email, 'Recuperação de senha - TravelBuddy', `
    <h2>Recuperação de senha</h2>
    <p>Clique no link abaixo para redefinir sua senha (válido por 1 hora):</p>
    <a href="${process.env.FRONTEND_URL}/reset-password?token=${token}">Redefinir senha</a>
  `);

const sendSubscriptionConfirmation = (email, name, expiresAt) =>
  sendMail(email, 'Assinatura Premium ativada! 🌟', `
    <h2>Parabéns, ${name}!</h2>
    <p>Seu plano <strong>Premium</strong> foi ativado com sucesso.</p>
    <p>Válido até: <strong>${new Date(expiresAt).toLocaleDateString('pt-BR')}</strong></p>
  `);

const sendCancellationEmail = (email, name, expiresAt) =>
  sendMail(email, 'Assinatura cancelada - TravelBuddy', `
    <h2>Olá, ${name}</h2>
    <p>Sua assinatura Premium foi cancelada.</p>
    <p>Você ainda terá acesso até <strong>${new Date(expiresAt).toLocaleDateString('pt-BR')}</strong>.</p>
  `);

module.exports = {
  sendWelcomeEmail,
  sendPasswordResetEmail,
  sendSubscriptionConfirmation,
  sendCancellationEmail,
};
