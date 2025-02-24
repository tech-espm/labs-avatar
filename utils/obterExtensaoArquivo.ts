
export = function obterExtensaoArquivo(nomeArquivo: string | null | undefined): string {
	let i: number;
	return ((!nomeArquivo || (i = nomeArquivo.lastIndexOf(".")) < 0) ? "" : nomeArquivo.substring(i).toLowerCase());
}
