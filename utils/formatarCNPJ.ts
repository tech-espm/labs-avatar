
export = function formatarCNPJ(cnpj: string | null | undefined): string {
	return (!cnpj ? "" : (
		(cnpj.length !== 14) ? cnpj :
		`${cnpj.substring(0, 2)}.${cnpj.substring(2, 5)}.${cnpj.substring(5, 8)}/${cnpj.substring(8, 12)}-${cnpj.substring(12)}`
	));
}
