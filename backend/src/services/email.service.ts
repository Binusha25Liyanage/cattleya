import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY || "");

function headerHtml() {
  return `
    <div style="background:#0A0A0A;padding:24px;text-align:center;color:#C9A84C;font-family:Arial,sans-serif">
      <img src="https://dummyimage.com/240x80/0a0a0a/c9a84c.png&text=CATTLEYA" alt="CATTLEYA" style="height:64px;display:block;margin:0 auto 12px" />
      <div style="font-size:12px;letter-spacing:2px;text-transform:uppercase">Immense Beauty of Heaven</div>
    </div>`;
}

async function sendEmail(to: string, subject: string, html: string) {
  if (!process.env.SENDGRID_API_KEY) return;
  await sgMail.send({
    to,
    from: process.env.SENDGRID_FROM_EMAIL || "noreply@cattleya.lk",
    subject,
    html: `${headerHtml()}<div style="padding:24px;font-family:Arial,sans-serif;color:#1A1A1A">${html}</div>`,
  });
}

export const emailService = {
  sendWelcome: (to: string, name: string) => sendEmail(to, "Welcome to CATTLEYA", `<h1>Welcome, ${name}</h1><p>Your account is ready.</p>`),
  sendOrderConfirmation: (to: string, summary: string) => sendEmail(to, "Your order is confirmed", `<h1>Order confirmed</h1><p>${summary}</p>`),
  sendOrderStatus: (to: string, status: string) => sendEmail(to, "Order update", `<h1>Order ${status}</h1>`),
  sendDesignApproved: (to: string) => sendEmail(to, "Design approved", `<h1>Your design was approved</h1>`),
  sendDesignRejected: (to: string, reason: string) => sendEmail(to, "Design rejected", `<h1>Your design was rejected</h1><p>${reason}</p>`),
  sendPasswordReset: (to: string, link: string) => sendEmail(to, "Password reset", `<h1>Reset your password</h1><a href="${link}">Reset link</a>`),
};
