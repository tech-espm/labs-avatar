const regA = /[áàãâä@]/g, regE = /[éèêë&]/g, regI = /[íìîï]/g, regO = /[óòõôö]/g, regU = /[úùûü]/g, regC = /ç/g, regEspaco = /\s/g, regRemover = /[\"\'\[\]\(\)\{\}\$\%\!\/\\\?\*\.\=\|\~\`\^\,\<\>\:\;]/g, regQuebraLinhaTab = /[\r\n\t]/g, regEspacoDuplo = /\s\s/g;

export function ajustarNome(nome: string): string {
	if (!nome || !(nome = nome.normalize().trim()))
		return nome;
	return nome.toLowerCase().replace(regA, "a").replace(regE, "e").replace(regI, "i").replace(regO, "o").replace(regU, "u").replace(regC, "c").replace(regRemover, "").replace(regEspaco, "-");
}

export function removerQuebraLinhaTabEspacoDuplo(texto: string): string {
	if (!texto || !(texto = texto.normalize().trim()))
		return texto;
	texto = texto.replace(regQuebraLinhaTab, " ");
	while (regEspacoDuplo.test(texto))
		texto = texto.replace(regEspacoDuplo, " ");
	return texto;
}

export function normalizarTexto(texto: string): string {
	if (!texto || !(texto = texto.normalize().trim()))
		return texto;
	texto = texto.toLowerCase().replace(regA, "a").replace(regE, "e").replace(regI, "i").replace(regO, "o").replace(regU, "u").replace(regC, "c").replace(regQuebraLinhaTab, " ");
	while (regEspacoDuplo.test(texto))
		texto = texto.replace(regEspacoDuplo, " ");
	return texto;
}
