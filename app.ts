import app = require("teem");
import dotenv = require("dotenv");

dotenv.config({ encoding: "utf8", path: app.currentDirectoryName() + "/../.env" });

const PORT = parseInt(process.env.PORT as any) || 3000; 

app.run({
	// Configurações de acesso ao banco de dados.
	// Mais informações: https://www.npmjs.com/package/mysql2#using-connection-pools
	sqlConfig: {
		connectionLimit: 30,
		waitForConnections: true,
		charset: "utf8mb4",
		host: process.env.mysqlhost,
		port: parseInt(process.env.mysqlport),
		user: process.env.mysqluser,
		password: process.env.mysqlpassword,
		database: process.env.mysqldatabase
	},
	root: process.env.ROOT,
	port: PORT
});

console.log(`O servidor está rodando na porta http://localhost:${PORT}`);