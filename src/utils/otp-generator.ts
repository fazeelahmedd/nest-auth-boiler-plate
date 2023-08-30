import * as crypto from 'crypto';
export const OTP_GENERATOR = () => {
  const otp = crypto.randomInt(0, 999999);
  return otp.toString().padStart(6, '0');
};
