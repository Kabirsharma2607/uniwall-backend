import QRCode from "qrcode";
import { wallet_type } from "@prisma/client";

export const generateReceiveQRCode = async (
  publicKey: string,
  token: wallet_type
) => {
  try {
    const data = `${token}:${publicKey}`;
    const qr = await QRCode.toDataURL(data);
    return {
      success: true,
      qrCode: qr,
      message: `Send ${token} to ${publicKey}`,
    };
  } catch (err) {
    console.log("QR generation error:", err);
    return { success: false };
  }
};
