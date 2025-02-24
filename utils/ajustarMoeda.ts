import extrairMoeda = require("./extrairMoeda");
import formatarMoeda = require("./formatarMoeda");

export = function ajustarMoeda(valor: string | number | null, permitirNegativo?: boolean): string | null {
	valor = extrairMoeda(valor, permitirNegativo);
	return ((valor === null) ? null : formatarMoeda(valor, null, true));
}
