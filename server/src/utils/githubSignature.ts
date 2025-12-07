import crypto from 'crypto';

/**
 * Verify GitHub webhook signature
 */
export function verifyGithubSignature(
   payload: string,
   signature: string,
   secret: string
): boolean {
   if (!signature || !signature.startsWith('sha256=')) {
      return false;
   }

   const hmac = crypto.createHmac('sha256', secret);
   hmac.update(payload);
   const computed = 'sha256=' + hmac.digest('hex');

   return crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(computed)
   );
}
