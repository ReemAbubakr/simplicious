const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || 'smtp.example.com',
      port: process.env.EMAIL_PORT || 587,
      secure: process.env.EMAIL_SECURE === 'true',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    });
  }

  async sendOrderConfirmation({ email, orderId, items, total }) {
    try {
      if (!this.transporter) {
        console.warn('Email transporter not configured');
        return false;
      }

      const mailOptions = {
        from: process.env.EMAIL_FROM || '"Your Store" <noreply@example.com>',
        to: email,
        subject: `Order Confirmation #${orderId}`,
        html: `
          <h1>Thank you for your order!</h1>
          <p>Your order ID: ${orderId}</p>
          <h2>Order Summary:</h2>
          <ul>
            ${items.map(item => `
              <li>
                ${item.title} - 
                ${item.quantity} x $${item.price} = 
                $${(item.quantity * item.price).toFixed(2)}
              </li>
            `).join('')}
          </ul>
          <p><strong>Total: $${total.toFixed(2)}</strong></p>
          <p>We'll notify you when your order ships.</p>
        `
      };

      await this.transporter.sendMail(mailOptions);
      return true;
    } catch (err) {
      console.error('Error sending email:', err);
      return false;
    }
  }
}

// Create singleton instance
const emailService = new EmailService();

module.exports = {
  sendOrderConfirmationEmail: (data) => emailService.sendOrderConfirmation(data)
};