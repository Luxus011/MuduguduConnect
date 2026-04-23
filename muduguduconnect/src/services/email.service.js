const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host:   process.env.EMAIL_HOST,
  port:   parseInt(process.env.EMAIL_PORT),
  secure: false,
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
});

exports.sendVerification = async (to, name, code) => {
  await transporter.sendMail({
    from:    process.env.EMAIL_FROM,
    to,
    subject: 'MuduguduConnect — Verify your email',
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px">
        <h2 style="color:#3B6D11">Welcome to MuduguduConnect, ${name}!</h2>
        <p style="color:#444;line-height:1.6">Your verification code is:</p>
        <div style="font-size:2.5rem;font-weight:700;letter-spacing:.3em;color:#3B6D11;padding:20px 0">${code}</div>
        <p style="color:#888;font-size:.85rem">This code expires in 15 minutes.</p>
        <hr style="border:none;border-top:1px solid #eee;margin:24px 0">
        <p style="color:#aaa;font-size:.75rem">MuduguduConnect · Hire locally. Get it done fast.</p>
      </div>
    `,
  });
};
