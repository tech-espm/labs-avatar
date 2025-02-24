import app = require("teem");
import dotenv = require("dotenv");
import appsettings = require("./appsettings");
import Perfil = require("./enums/perfil");

dotenv.config({ encoding: "utf8", path: app.currentDirectoryName() + "/../.env" });

const PORT = parseInt(process.env.PORT as any) || 3000; 

app.run({
	root: appsettings.root,
	port: appsettings.port,
	// Configurações de acesso ao banco de dados.
	// Mais informações: https://www.npmjs.com/package/mysql2#using-connection-pools
	sqlConfig: appsettings.sqlConfig,

	onInit: function () {
		app.express.locals.Perfil = Perfil;
	},

	htmlErrorHandler: function (err: any, req: app.Request, res: app.Response, next: app.NextFunction) {
		// Como é um ambiente de desenvolvimento, deixa o objeto do erro
		// ir para a página, que possivelmente exibirá suas informações
		res.render("index/erro", { layout: "layout-externo", mensagem: (err.status === 404 ? null : (err.message || "Ocorreu um erro desconhecido")), erro: err });
	}
});

console.log(`O servidor está rodando na porta http://localhost:${PORT}`);
