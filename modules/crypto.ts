import * as crypto from "crypto";
import config from "../config";
export var Sha512 = function Sha512(value: any) {
	return crypto
		.createHmac("sha512", config.SALT)
		.update(value)
		.digest("base64");
};
export var AES256Encrypt = function AES256Encrypt(value: any) {
	var secretKeyToByteArray = Buffer.from(config.AESKEY, "utf-8");
	var iv = Buffer.from(config.AESKEY.slice(0, 16)); // const cipher = crypto.createCipheriv("aes-256-cbc", config.AESKEY, iv);

	var cipher = crypto.createCipheriv("aes-256-cbc", secretKeyToByteArray, iv);
	return cipher.update(value, "utf8", "base64") + cipher.final("base64");
};
export var AES256Decrypt = function AES256Decrypt(value: any) {
	var iv = crypto.randomBytes(16); // const decipher = crypto.createCipheriv("aes-256-cbc", config.AESKEY, iv);

	var decipher = crypto.createCipheriv("aes-256-cbc", config.AESKEY, iv);
	return decipher.update(value, "base64", "utf8") + decipher.final("utf8");
};
