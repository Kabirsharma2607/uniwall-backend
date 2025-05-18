import QRCode from "qrcode";
import { WalletType } from "@kabir.26/uniwall-commons";

export const generateReceiveQRCode = async (
  publicKey: string,
  token: WalletType
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
