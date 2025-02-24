let regExpInvalidos = /[\\\/\:\*\?\"\<\>\|]/g;

export = function ajustarNomeArquivoUpload(nome: string | null | undefined): string {
	//https://github.com/expressjs/multer/issues/1104
	if (!nome || !(nome = nome.trim()))
		return "";
	const nomeOriginal = nome;
	nome = Buffer.from(nome, "latin1").toString("utf8").normalize().replace(regExpInvalidos, "_");
	if (nome.length > 200)
		nome = nome.substring(nome.length - 200); // Pega o final do arquivo para preservar a extensão
	// Às vezes vem como UTF-8... às vezes vem como latin1... :(
	return (nome.indexOf("\uFFFD") >= 0 ? nomeOriginal : nome); // 65533 = replacement character �
}
