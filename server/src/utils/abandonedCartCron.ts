/**
 * Abandoned Cart Cron — runs every hour.
 * Emails users whose cart has items sitting idle for 24+ hours.
 * Only runs if SMTP is configured (gracefully skips otherwise).
 */
import { Cart } from '../models/Cart';
import { User } from '../models/User';
import { sendEmail } from '../services/email';
import { config } from '../config/env';

function schedule(intervalMs: number, fn: () => Promise<void>) {
  const tick = async () => {
    try { await fn(); } catch (err) { console.error('[Cron] Error:', err); }
    setTimeout(tick, intervalMs);
  };
  setTimeout(tick, intervalMs);
}

async function sendAbandonedCartEmails() {
  if (!config.smtp.user) return; // Skip if SMTP not configured

  const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000); // 24h ago

  const carts = await Cart.find({
    updatedAt: { $lte: cutoff },
    'items.0': { $exists: true },
    emailedAt: { $exists: false },
  }).populate('userId', 'firstName email').limit(50);

  for (const cart of carts) {
    const user = cart.userId as unknown as { firstName: string; email: string };
    if (!user?.email) continue;

    try {
      await sendEmail({
        to: user.email,
        subject: `${user.firstName}, your Darbar cart is waiting 🛍️`,
        html: `
          <div style="font-family: 'Montserrat', sans-serif; max-width: 600px; margin: 0 auto; color: #1a1a1a;">
            <div style="background: #1B4D3E; padding: 32px; text-align: center;">
              <h1 style="font-family: serif; color: #D4AF37; font-size: 28px; margin: 0;">DARBAR</h1>
            </div>
            <div style="padding: 32px;">
              <h2 style="font-family: serif; font-size: 22px;">You left something behind, ${user.firstName}</h2>
              <p style="color: #555; line-height: 1.6;">Your cart has ${cart.items.length} item${cart.items.length > 1 ? 's' : ''} waiting for you. Each piece is crafted by master artisans — don't let it slip away.</p>
              <a href="${config.clientUrl}/cart" style="display: inline-block; background: #D4AF37; color: white; padding: 14px 32px; text-decoration: none; border-radius: 4px; font-size: 14px; margin-top: 16px;">
                Complete Your Order →
              </a>
            </div>
            <div style="padding: 24px 32px; border-top: 1px solid #eee; color: #999; font-size: 12px;">
              You're receiving this because you have items in your Darbar cart. © ${new Date().getFullYear()} Darbar.
            </div>
          </div>
        `,
      });

      // Mark as emailed by setting a flag (we use updatedAt trick — update with same data)
      await Cart.findByIdAndUpdate(cart._id, { emailedAt: new Date() });
      console.log(`[AbandonedCart] Email sent to ${user.email}`);
    } catch (err) {
      console.error(`[AbandonedCart] Failed to email ${user.email}:`, err);
    }
  }
}

export function startAbandonedCartCron() {
  console.log('[Cron] Abandoned cart email cron started (1h interval)');
  schedule(60 * 60 * 1000, sendAbandonedCartEmails);
}
