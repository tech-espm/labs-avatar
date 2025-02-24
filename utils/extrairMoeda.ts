
const regExpMilhar = /\./g;
const regExpDecimal = /\,/g;

export = function extrairMoeda(valor: string | number | null, permitirNegativo?: boolean): number | null {
	if (valor === 0)
		return 0;

	if (!valor)
		return null;

	if (typeof valor === "string") {
		valor = valor.trim();
		if (!valor)
			return null;

		let negativo = false;
		if (valor.charAt(0) === "-")
			negativo = true;

		let i = valor.indexOf(" ");
		if (i >= 0)
			valor = valor.substring(i + 1).trim();
		i = valor.indexOf("\u00A0");
		if (i >= 0)
			valor = valor.substring(i + 1).trim();

		if (!valor)
			return null;

		valor = Number(valor.replace(regExpMilhar, "").replace(regExpDecimal, "."));
		if (negativo && valor > 0)
			valor = -valor;
	}

	return ((isNaN(valor) || (!permitirNegativo && valor < 0)) ? null : valor);
}
