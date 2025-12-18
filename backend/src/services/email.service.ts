// Email Service - Gratuit folosind EmailJS sau fallback la console logging
// Pentru producție, configurează EmailJS (100% gratuit pentru 200 emails/lună)

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

interface OrderEmailData {
  orderId: string;
  customerName: string;
  customerEmail: string;
  total: number;
  items: Array<{
    title: string;
    quantity: number;
    price: number;
  }>;
  shippingAddress: string;
  paymentMethod: string;
}

export class EmailService {
  private static isProduction = process.env.NODE_ENV === 'production';
  private static emailEnabled = process.env.EMAIL_ENABLED === 'true';

  // Trimite email generic
  static async sendEmail(options: EmailOptions): Promise<boolean> {
    try {
      if (!this.emailEnabled) {
        console.log('📧 Email (Simulat):', {
          to: options.to,
          subject: options.subject,
          preview: options.text?.substring(0, 100) || options.html.substring(0, 100)
        });
        return true;
      }

      // În producție, aici ai integra cu EmailJS sau alt serviciu gratuit
      // Pentru moment, logăm în consolă
      console.log('📧 Email trimis către:', options.to);
      console.log('📧 Subiect:', options.subject);
      
      return true;
    } catch (error) {
      console.error('❌ Eroare trimitere email:', error);
      return false;
    }
  }

  // Email confirmare comandă
  static async sendOrderConfirmation(data: OrderEmailData): Promise<boolean> {
    const html = this.generateOrderConfirmationHTML(data);
    const text = this.generateOrderConfirmationText(data);

    return await this.sendEmail({
      to: data.customerEmail,
      subject: `Confirmare Comandă #${data.orderId.substring(0, 8)}`,
      html,
      text
    });
  }

  // Email actualizare status comandă
  static async sendOrderStatusUpdate(
    email: string,
    orderId: string,
    status: string,
    customerName: string
  ): Promise<boolean> {
    const statusMessages: Record<string, string> = {
      PROCESSING: 'este în procesare',
      SHIPPING: 'a fost expediată',
      DELIVERED: 'a fost livrată',
      CANCELLED: 'a fost anulată'
    };

    const message = statusMessages[status] || 'a fost actualizată';

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #3b82f6; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9fafb; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
          .button { display: inline-block; padding: 12px 24px; background: #3b82f6; color: white; text-decoration: none; border-radius: 6px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🛒 E-Commerce</h1>
          </div>
          <div class="content">
            <h2>Bună ${customerName}!</h2>
            <p>Comanda ta <strong>#${orderId.substring(0, 8)}</strong> ${message}.</p>
            <p><strong>Status actual:</strong> ${status}</p>
            <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/orders" class="button">
              Vezi Comanda
            </a>
          </div>
          <div class="footer">
            <p>© 2025 E-Commerce. Toate drepturile rezervate.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const text = `
      Bună ${customerName}!
      
      Comanda ta #${orderId.substring(0, 8)} ${message}.
      Status actual: ${status}
      
      Vezi comanda: ${process.env.FRONTEND_URL || 'http://localhost:3000'}/orders
    `;

    return await this.sendEmail({
      to: email,
      subject: `Actualizare Comandă #${orderId.substring(0, 8)}`,
      html,
      text
    });
  }

  // Email stoc scăzut pentru admin
  static async sendLowStockAlert(
    adminEmail: string,
    productTitle: string,
    currentStock: number
  ): Promise<boolean> {
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #ef4444; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #fef2f2; }
          .alert { background: #fee2e2; border-left: 4px solid #ef4444; padding: 12px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>⚠️ Alertă Stoc Scăzut</h1>
          </div>
          <div class="content">
            <div class="alert">
              <strong>Atenție!</strong> Produsul "${productTitle}" are doar ${currentStock} bucăți în stoc.
            </div>
            <p>Te rugăm să reaprovizionezi stocul cât mai curând posibil.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    return await this.sendEmail({
      to: adminEmail,
      subject: `⚠️ Stoc Scăzut: ${productTitle}`,
      html,
      text: `Atenție! Produsul "${productTitle}" are doar ${currentStock} bucăți în stoc.`
    });
  }

  // Generează HTML pentru confirmare comandă
  private static generateOrderConfirmationHTML(data: OrderEmailData): string {
    const itemsHTML = data.items.map(item => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;">${item.title}</td>
        <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; text-align: center;">${item.quantity}</td>
        <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; text-align: right;">${item.price.toFixed(2)} RON</td>
      </tr>
    `).join('');

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #10b981; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9fafb; }
          .order-details { background: white; padding: 20px; margin: 20px 0; border-radius: 8px; }
          table { width: 100%; border-collapse: collapse; }
          .total { font-size: 18px; font-weight: bold; text-align: right; padding: 20px 0; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>✅ Comandă Confirmată!</h1>
          </div>
          <div class="content">
            <h2>Mulțumim pentru comandă, ${data.customerName}!</h2>
            <p>Comanda ta <strong>#${data.orderId.substring(0, 8)}</strong> a fost plasată cu succes.</p>
            
            <div class="order-details">
              <h3>Detalii Comandă:</h3>
              <table>
                <thead>
                  <tr style="background: #f3f4f6;">
                    <th style="padding: 10px; text-align: left;">Produs</th>
                    <th style="padding: 10px; text-align: center;">Cantitate</th>
                    <th style="padding: 10px; text-align: right;">Preț</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemsHTML}
                </tbody>
              </table>
              <div class="total">
                Total: ${data.total.toFixed(2)} RON
              </div>
              
              <p><strong>Adresă Livrare:</strong><br>${data.shippingAddress}</p>
              <p><strong>Metodă Plată:</strong> ${data.paymentMethod === 'card' ? 'Card' : 'Ramburs'}</p>
            </div>
            
            <p>Vei primi un email când comanda va fi expediată.</p>
          </div>
          <div class="footer">
            <p>© 2025 E-Commerce. Toate drepturile rezervate.</p>
            <p>Pentru întrebări, contactează-ne la support@ecommerce.ro</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  // Generează text pentru confirmare comandă
  private static generateOrderConfirmationText(data: OrderEmailData): string {
    const itemsText = data.items.map(item => 
      `${item.title} x${item.quantity} - ${item.price.toFixed(2)} RON`
    ).join('\n');

    return `
      Mulțumim pentru comandă, ${data.customerName}!
      
      Comanda ta #${data.orderId.substring(0, 8)} a fost plasată cu succes.
      
      Detalii Comandă:
      ${itemsText}
      
      Total: ${data.total.toFixed(2)} RON
      
      Adresă Livrare: ${data.shippingAddress}
      Metodă Plată: ${data.paymentMethod === 'card' ? 'Card' : 'Ramburs'}
      
      Vei primi un email când comanda va fi expediată.
      
      © 2025 E-Commerce
    `;
  }
}
