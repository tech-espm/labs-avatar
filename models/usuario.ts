import app = require("teem");
import { randomBytes } from "crypto";
import appsettings = require("../appsettings");
import DataUtil = require("../utils/dataUtil");
import GeradorHash = require("../utils/geradorHash");
import intToHex = require("../utils/intToHex");
import Perfil = require("../enums/perfil");
import Validacao = require("../utils/validacao");

interface Usuario {
	id_usuario: number;
	email: string;
	nome: string;
	id_perfil: Perfil;
	senha: string;
	criacao: string;

	// Utilizados apenas através do cookie
	admin: boolean;
}

class Usuario {
	private static readonly IdAdmin = 1;

	public static async cookie(req: app.Request, res: app.Response = null, admin: boolean = false): Promise<Usuario> {
		let cookieStr = req.cookies[appsettings.cookie] as string;
		if (!cookieStr || cookieStr.length !== 48) {
			if (res) {
				res.statusCode = 403;
				res.json("Não permitido");
			}
			return null;
		} else {
			let id_usuario = parseInt(cookieStr.substr(0, 8), 16) ^ appsettings.usuarioHashId;
			let usuario: Usuario = null;

			await app.sql.connect(async (sql) => {
				let rows = await sql.query("select id_usuario, email, nome, id_perfil, token from usuario where id_usuario = ?", [id_usuario]);
				let row: any;

				if (!rows || !rows.length || !(row = rows[0]))
					return;

				let token = cookieStr.substring(16);

				if (!row.token || token !== (row.token as string))
					return;

				usuario = new Usuario();
				usuario.id_usuario = id_usuario;
				usuario.email = row.email as string;
				usuario.nome = row.nome as string;
				usuario.id_perfil = row.id_perfil as number;
				usuario.admin = (usuario.id_perfil === Perfil.Administrador);
			});

			if (admin && usuario && usuario.id_perfil !== Perfil.Administrador)
				usuario = null;
			if (!usuario && res) {
				res.statusCode = 403;
				res.json("Não permitido");
			}
			return usuario;
		}
	}

	private static gerarTokenCookie(id_usuario: number): [string, string] {
		let idStr = intToHex(id_usuario ^ appsettings.usuarioHashId);
		let idExtra = intToHex(0);
		let token = randomBytes(16).toString("hex");
		let cookieStr = idStr + idExtra + token;
		return [token, cookieStr];
	}

	public static async efetuarLogin(email: string, senha: string, res: app.Response): Promise<[string, Usuario]> {
		if (!email || !senha)
			return ["Usuário ou senha inválidos", null];

		return await app.sql.connect(async (sql) => {
			email = email.normalize().trim().toLowerCase();

			const usuarios: Usuario[] = await sql.query("select id_usuario, nome, id_perfil, senha from usuario where email = ? and exclusao is null", [email]);
			let usuario: Usuario;

			if (!usuarios || !usuarios.length || !(usuario = usuarios[0]) || !(await GeradorHash.validarSenha(senha.normalize(), usuario.senha as string)))
				return ["Usuário ou senha inválidos", null];

			let [token, cookieStr] = Usuario.gerarTokenCookie(usuario.id_usuario);

			await sql.query("update usuario set token = ? where id_usuario = ?", [token, usuario.id_usuario]);

			usuario.admin = (usuario.id_perfil === Perfil.Administrador);

			res.cookie(appsettings.cookie, cookieStr, { maxAge: 365 * 24 * 60 * 60 * 1000, httpOnly: true, path: "/", secure: appsettings.cookieSecure });

			return [null, usuario];
		});
	}

	public static async efetuarLogout(usuario: Usuario, res: app.Response): Promise<void> {
		await app.sql.connect(async (sql) => {
			await sql.query("update usuario set token = null where id_usuario = ?", [usuario.id_usuario]);

			res.cookie(appsettings.cookie, "", { expires: new Date(0), httpOnly: true, path: "/", secure: appsettings.cookieSecure });
		});
	}

	public static async alterarPerfil(usuario: Usuario, res: app.Response, nome: string, senhaAtual: string, novaSenha: string): Promise<string> {
		nome = (nome || "").normalize().trim();
		if (nome.length < 3 || nome.length > 100)
			return "Nome inválido";

		if (!!senhaAtual !== !!novaSenha || (novaSenha && (novaSenha.length < 6 || novaSenha.length > 20)))
			return "Senha inválida";

		let r: string = null;

		await app.sql.connect(async (sql) => {
			if (senhaAtual) {
				let hash = await sql.scalar("select senha from usuario where id_usuario = ?", [usuario.id_usuario]) as string;
				if (!await GeradorHash.validarSenha(senhaAtual.normalize(), hash)) {
					r = "Senha atual não confere";
					return;
				}

				hash = await GeradorHash.criarHash(novaSenha.normalize());

				let [token, cookieStr] = Usuario.gerarTokenCookie(usuario.id_usuario);

				await sql.query("update usuario set nome = ?, senha = ?, token = ? where id_usuario = ?", [nome, hash, token, usuario.id_usuario]);

				res.cookie(appsettings.cookie, cookieStr, { maxAge: 365 * 24 * 60 * 60 * 1000, httpOnly: true, path: "/", secure: appsettings.cookieSecure });
			} else {
				await sql.query("update usuario set nome = ? where id_usuario = ?", [nome, usuario.id_usuario]);
			}
		});

		return r;
	}

	private static validar(usuario: Usuario, criacao: boolean): string {
		if (!usuario)
			return "Usuário inválido";

		usuario.id_usuario = parseInt(usuario.id_usuario as any);

		if (criacao) {
			// Limita o e-mail a 85 caracteres para deixar 15 sobrando, para tentar evitar perda de dados durante a concatenação da exclusão
			if (!usuario.email || !Validacao.isEmail(usuario.email = usuario.email.normalize().trim().toLowerCase()) || usuario.email.length > 85)
				return "E-mail inválido";
		} else {
			if (isNaN(usuario.id_usuario))
				return "Id inválido";
		}

		if (!usuario.nome || !(usuario.nome = usuario.nome.normalize().trim()) || usuario.nome.length > 100)
			return "Nome inválido";

		if (isNaN(usuario.id_perfil = parseInt(usuario.id_perfil as any) as Perfil))
			return "Perfil inválido";

		if (criacao) {
			if (!usuario.senha || (usuario.senha = usuario.senha.normalize()).length < 6 || usuario.senha.length > 20)
				return "Senha inválida";
		}

		return null;
	}

	public static async listar(): Promise<Usuario[]> {
		let lista: Usuario[] = null;

		await app.sql.connect(async (sql) => {
			lista = await sql.query("select u.id_usuario, u.email, u.nome, p.nome perfil, date_format(u.criacao, '%d/%m/%Y') criacao from usuario u inner join perfil p on p.id = u.id_perfil where u.exclusao is null order by u.email asc") as Usuario[];
		});

		return (lista || []);
	}

	public static async obter(id_usuario: number): Promise<Usuario> {
		let lista: Usuario[] = null;

		await app.sql.connect(async (sql) => {
			lista = await sql.query("select id_usuario, email, nome, id_perfil, date_format(criacao, '%d/%m/%Y') criacao from usuario where id_usuario = ?", [id_usuario]) as Usuario[];
		});

		return ((lista && lista[0]) || null);
	}

	public static async criar(usuario: Usuario): Promise<string> {
		let res: string;
		if ((res = Usuario.validar(usuario, true)))
			return res;

		await app.sql.connect(async (sql) => {
			try {
				await sql.query("insert into usuario (email, nome, id_perfil, senha, criacao) values (?, ?, ?, ?, now())", [usuario.email, usuario.nome, usuario.id_perfil, await GeradorHash.criarHash(usuario.senha)]);
			} catch (e) {
				if (e.code) {
					switch (e.code) {
						case "ER_DUP_ENTRY":
							res = `O e-mail ${usuario.email} já está em uso`;
							break;
						case "ER_NO_REFERENCED_ROW":
						case "ER_NO_REFERENCED_ROW_2":
							res = "Perfil não encontrado";
							break;
						default:
							throw e;
					}
				} else {
					throw e;
				}
			}
		});

		return res;
	}

	public static async editar(usuario: Usuario): Promise<string> {
		let res: string;
		if ((res = Usuario.validar(usuario, false)))
			return res;

		if (usuario.id_usuario === Usuario.IdAdmin)
			return "Não é possível editar o usuário administrador principal";

		return await app.sql.connect(async (sql) => {
			await sql.query("update usuario set nome = ?, id_perfil = ? where id_usuario = ?", [usuario.nome, usuario.id_perfil, usuario.id_usuario]);

			return (sql.affectedRows ? null : "Usuário não encontrado");
		});
	}

	public static async excluir(id_usuario: number): Promise<string> {
		if (id_usuario === Usuario.IdAdmin)
			return "Não é possível excluir o usuário administrador principal";

		return app.sql.connect(async (sql) => {
			const agora = DataUtil.horarioDeBrasiliaISOComHorario();

			// Utilizar substr(email, instr(email, ':') + 1) para remover o prefixo, caso precise desfazer a exclusão (caso
			// não exista o prefixo, instr() vai retornar 0, que, com o + 1, faz o substr() retornar a própria string inteira)
			await sql.query("update usuario set email = concat('@', id_usuario, ':', email), token = null, exclusao = ? where id_usuario = ?", [agora, id_usuario]);

			return (sql.affectedRows ? null : "Usuário não encontrado");
		});
	}
}

export = Usuario;
