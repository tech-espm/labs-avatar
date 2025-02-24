const regExp = /\D/g;

export = function apenasDigitos(x: string | null | undefined): string {
	return (x ? x.replace(regExp, "") : "");
}
