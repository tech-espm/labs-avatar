
export = function formatarMoeda(valor: number, moeda?: string | null, removerSigla?: boolean): string {
	let r = (valor || 0).toLocaleString("pt-br", { style: "currency", currency: (moeda || "BRL") });
	if (removerSigla) {
		let i = r.indexOf(" ");
		if (i >= 0)
			r = r.substring(i + 1).trim();
		i = r.indexOf("\u00A0");
		if (i >= 0)
			r = r.substring(i + 1).trim();
		if (valor < 0 && r.charAt(0) !== "-")
			r = "-" + r;
	}
	return r;
}
