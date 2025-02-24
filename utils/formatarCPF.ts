
export = function formatarCPF(cpf: string | null | undefined): string {
	return (!cpf ? "" : (
		(cpf.length !== 11) ? cpf :
		`${cpf.substring(0, 3)}.${cpf.substring(3, 6)}.${cpf.substring(6, 9)}-${cpf.substring(9)}`
	));
}
