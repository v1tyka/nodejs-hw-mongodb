import { sendEmail } from './utils/sendEmail.js';

(async () => {
  try {
    const info = await sendEmail({
      from: 'mruhlukandrey@gmail.com',
      to: 'mruhlukandrey@gmail.com',
      subject: 'SMTP test',
      text: 'Brevo SMTP test successful!',
    });
    console.log('✅ Email sent:', info.messageId);
  } catch (err) {
    console.error('❌ Error sending email:', err);
  }
})();
