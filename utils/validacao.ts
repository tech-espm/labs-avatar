const regExpSenhaSimplesInvalida = /[^A-Za-z0-9\-]/g;

export = class Validacao {
	public static isDocumento(cnpjOuCPF: string | null): string | null {
		return (cnpjOuCPF ? ((cnpjOuCPF.length === 14) ? Validacao.isCPF(cnpjOuCPF) : Validacao.isCNPJ(cnpjOuCPF)) : null);
	}

	public static isCNPJ(cnpj: string | null): string | null {
		if (!cnpj || !(cnpj = cnpj.replace(/\./g, "").replace(/\-/g, "").replace(/\//g, "").trim()) || cnpj.length !== 14)
			return null;

		let sum = 0;

		for (let i = 0; i < 12; i++)
			sum += (cnpj.charCodeAt(i) - 0x30) * (((i < 4) ? 5 : 13) - i);
		var modulus = sum % 11;
		if (modulus < 2)
			modulus = 0;
		else
			modulus = 11 - modulus;

		if ((cnpj.charCodeAt(12) - 0x30) !== modulus)
			return null;

		sum = 0;
		for (let i = 0; i < 13; i++)
			sum += (cnpj.charCodeAt(i) - 0x30) * (((i < 5) ? 6 : 14) - i);
		modulus = sum % 11;
		if (modulus < 2)
			modulus = 0;
		else
			modulus = 11 - modulus;

		return (((cnpj.charCodeAt(13) - 0x30) === modulus) ? cnpj : null);
	}

	public static isCPF(cpf: string | null): string | null {
		if (!cpf || !(cpf = cpf.replace(/\./g, "").replace(/\-/g, "").trim()) || cpf.length !== 11)
			return null;

		let sum = 1, firstChar = cpf.charCodeAt(0);

		for (let i = 1; i < 9; i++) {
			if (cpf.charCodeAt(i) !== firstChar) {
				sum = 0;
				break;
			}
		}
		if (sum)
			return null;

		sum = 0;
		for (let i = 0; i < 9; i++)
			sum += (cpf.charCodeAt(i) - 0x30) * (10 - i);
		var modulus = sum % 11;
		if (modulus < 2)
			modulus = 0;
		else
			modulus = 11 - modulus;

		if ((cpf.charCodeAt(9) - 0x30) !== modulus)
			return null;

		sum = modulus * 2;
		for (let i = 0; i < 9; i++)
			sum += (cpf.charCodeAt(i) - 0x30) * (11 - i);
		modulus = sum % 11;
		if (modulus < 2)
			modulus = 0;
		else
			modulus = 11 - modulus;

		return (((cpf.charCodeAt(10) - 0x30) === modulus) ? cpf : null);
	}

	public static isEmail(email: string | null): boolean {
		if (!email || !(email = email.trim()))
			return false;

		const arroba = email.indexOf("@"),
			arroba2 = email.lastIndexOf("@"),
			ponto = email.lastIndexOf(".");

		return (email.indexOf(":") < 0 && arroba > 0 && ponto > (arroba + 1) && ponto !== (email.length - 1) && arroba2 === arroba);
	}

	public static isRG(rg: string): string | null {

		rg = rg.replace(/[^\d]/g, ''); // Remove pontos e traços do RG
  
		// Verifica se o RG possui 9 dígitos
		if (rg.length !== 9) {
			return null;
		}
		
		// Verifica se todos os caracteres do RG são dígitos
		if (!/^\d+$/.test(rg)) {
			return null;
		}
		
		// Calcula o dígito verificador do RG
		let soma = 0;
		for (let i = 0; i < 8; i++) {
			soma += parseInt(rg[i]) * (9 - i);
		}

		const digitoVerificador = soma % 11;
		
		// Verifica se o dígito verificador está correto
		if (digitoVerificador === parseInt(rg[8])) {
			return rg; // Retorna somente os números do RG
		} else {
			return null;
		}
	}

	public static apenasCaracteresNumerosTracos(x: string | null): boolean {
		return (x ? !regExpSenhaSimplesInvalida.test(x) : false);
	}

	
};
