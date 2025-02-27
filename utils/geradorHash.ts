import { createHash, createHmac, randomBytes, pbkdf2 } from "crypto";

export = class GeradorHash {
	private static readonly SALT_BYTE_SIZE = 33;
	private static readonly HASH_BYTE_SIZE = 33;

	public static async criarHash(senha: string): Promise<string> {
		return new Promise<string>((resolve, reject) => {
			var salt = randomBytes(GeradorHash.SALT_BYTE_SIZE);
			pbkdf2(Buffer.from(senha), salt, 1024, GeradorHash.HASH_BYTE_SIZE, "sha512", (err, derivedKey) => {
				if (err) {
					reject(err);
					return;
				}

				resolve(derivedKey.toString("base64") + ":" + salt.toString("base64"));
			});
		});
	}

	public static async validarSenha(senha: string, hash: string): Promise<boolean> {
		return new Promise<boolean>((resolve, reject) => {
			var i: number;
			if (!senha || !hash || (i = hash.indexOf(":")) <= 0) {
				resolve(false);
				return;
			}
			var senhaHash = hash.substring(0, i);
			var saltHash = hash.substring(i + 1);
			if (!senhaHash || !saltHash) {
				resolve(false);
				return;
			}
			pbkdf2(Buffer.from(senha), Buffer.from(saltHash, "base64"), 1024, GeradorHash.HASH_BYTE_SIZE, "sha512", (err, derivedKey) => {
				if (err) {
					reject(err);
					return;
				}

				resolve(derivedKey.toString("base64") === senhaHash);
			});
		});
	}

	public static sha256Hash(data: string): string {
		return createHash("sha256").update(data, "utf-8").digest("hex");
	}

	public static md5hash(data: string): string {
		return createHash("md5").update(data, "utf-8").digest("hex");
	}

	public static sha256Hmac(data: string, key: string): string {
		return createHmac("sha256", key).update(data, "utf-8").digest("hex");
	}

	public static md5Hmac(data: string, key: string): string {
		return createHmac("md5", key).update(data, "utf-8").digest("hex");
	}
}
