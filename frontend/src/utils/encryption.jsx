import CryptoJS from 'crypto-js';

const SECRET_KEY = 'your-secret-key'; // In production, this should be stored securely

export const encryptMessage = (message) => {
  return CryptoJS.AES.encrypt(message, SECRET_KEY).toString();
};

export const decryptMessage = (encryptedMessage) => {
  const bytes = CryptoJS.AES.decrypt(encryptedMessage, SECRET_KEY);
  return bytes.toString(CryptoJS.enc.Utf8);
};