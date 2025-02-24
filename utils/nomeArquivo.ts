const regExpNomeArquivoCertificadoInvalido = /[\r\n\\\/\:\*\?\"\<\>\|\t\']/g;
const regExpEspaco = /\s/g;
const regExpA = /[ÁÀÃÂÄ]/g;
const regExpE = /[ÉÈÊË]/g;
const regExpI = /[ÍÌÎÏ]/g;
const regExpO = /[ÓÒÕÔÖ]/g;
const regExpU = /[ÚÙÛÜ]/g;
const regExpY = /[ÝŸ]/g;
const regExpC = /[Ç]/g;
const regExpa = /[áàãâä]/g;
const regExpe = /[éèêë]/g;
const regExpi = /[íìîï]/g;
const regExpo = /[óòõôö]/g;
const regExpu = /[úùûü]/g;
const regExpy = /[ýÿ]/g;
const regExpc = /[ç]/g;

class NomeArquivo {
	public static contemCaracteresInvalidos(nomeArquivo?: string | null): boolean {
		return (nomeArquivo ? regExpNomeArquivoCertificadoInvalido.test(nomeArquivo) : false);
	}

	public static limpar(nomeArquivo?: string | null): string {
		return (nomeArquivo || "")
			.replace(regExpA, "A")
			.replace(regExpE, "E")
			.replace(regExpI, "I")
			.replace(regExpO, "O")
			.replace(regExpU, "U")
			.replace(regExpY, "Y")
			.replace(regExpC, "C")
			.replace(regExpa, "a")
			.replace(regExpe, "e")
			.replace(regExpi, "i")
			.replace(regExpo, "o")
			.replace(regExpu, "u")
			.replace(regExpy, "y")
			.replace(regExpc, "c")
			.replace(regExpNomeArquivoCertificadoInvalido, "_");
	}
}

export = NomeArquivo;
