import crypto from 'crypto';

const algorithm: string = 'aes-256-cbc';
const key: Buffer = crypto.scryptSync('your-secret-key', 'salt', 32); // In production, use a proper key management
const iv: Buffer = crypto.randomBytes(16);

interface EncryptResult {
	encrypted: string;
	iv: string;
}

export function encrypt(text: string): EncryptResult {
	const cipher = crypto.createCipheriv(algorithm, key, iv);
	let encrypted = cipher.update(text, 'utf8', 'hex');
	encrypted += cipher.final('hex');
	return { encrypted, iv: iv.toString('hex') };
}

export function decrypt(encrypted: string, ivHex: string): string {
	const decipher = crypto.createDecipheriv(algorithm, key, Buffer.from(ivHex, 'hex'));
	let decrypted = decipher.update(encrypted, 'hex', 'utf8');
	decrypted += decipher.final('utf8');
	return decrypted;
}
