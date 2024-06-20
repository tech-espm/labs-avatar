import app = require("teem");

class AvatarRoute{
    public async cursos(req: app.Request, res: app.Response) {
		res.render("index/cursos");
	}

	@app.http.post()
	public async enviarRespostas(req: app.Request, res: app.Response) {
		const ids: number[] = req.body.ids;
		const respostas: number[] = req.body.respostas;

		if (!ids || !respostas || !Array.isArray(ids) || !Array.isArray(respostas) || !ids.length || !respostas.length || ids.length !== respostas.length) {
			res.status(400).json("Id's e repostas inválidas");
			return;
		}

		let persona = "";

		await app.sql.connect(async sql => {
			await sql.beginTransaction();

			const personas: any[] = await sql.query("SELECT id_persona, nome FROM persona WHERE id_curso = 1 ORDER BY id_persona ASC");
			const perguntas: any[] = await sql.query("SELECT id_pergunta, ponto0, ponto1, ponto2, ponto3, ponto4, ponto5, ponto6, ponto7 FROM pergunta WHERE id_curso = 1 ORDER BY id_pergunta ASC");

			let pontosPorPersona: number[] = new Array(personas.length);

			for (let i = 0; i < ids.length; i++) {
				ids[i] = parseInt(ids[i] as any);
				respostas[i] = parseInt(respostas[i] as any);
			}

			for (let i = 0; i < pontosPorPersona.length; i++) {
				pontosPorPersona[i] = 0;
			}

			for (let p = 0; p < perguntas.length; p++) {
				for (let r = 0; r < ids.length; r++) {
					if (ids[r] === perguntas[p].id_pergunta) {
						const resposta = respostas[r];
						for (let i = 0; i < personas.length; i++) {
							if (resposta >= perguntas[p]["ponto" + i]) {
								pontosPorPersona[i]++;
							}
						}
						break;
					}
				}
			}

			let pontoMaximo = pontosPorPersona[0];
			let personaSelecionada = 0;
			for (let i = 1; i < pontosPorPersona.length; i++) {
				if (pontoMaximo < pontosPorPersona[i]) {
					pontoMaximo = pontosPorPersona[i];
					personaSelecionada = i;
				}
			}

			persona = personas[personaSelecionada].nome;
			const id_usuario = await sql.scalar("SELECT id_usuario FROM usuario ORDER BY id_usuario LIMIT 1") as number;

			let query = "INSERT INTO resultado_final (id_usuario, data";
			for (let i = 0; i < personas.length; i++) {
				query += ", ponto" + i;
			}
			query += ") VALUES (" + id_usuario + ", current_timestamp()";
			const params: number[] = [];
			for (let i = 0; i < pontosPorPersona.length; i++) {
				query += ", ?";
				params.push(pontosPorPersona[i]);
			}
			query += ")";

			await sql.query(query, params);

			const id_resultado_final = await sql.scalar("SELECT last_insert_id()") as number;

			for (let i = 0; i < ids.length; i++) {
				await sql.query("INSERT INTO resposta (id_pergunta, id_resultado_final, valor) VALUES (?, ?, ?)", [ids[i], id_resultado_final, respostas[i]]);
			}

			await sql.commit();
		});

		res.json(persona);
	}

	public async qualiSI(req: app.Request, res: app.Response) {
		const perguntas: any[] = await app.sql.connect(async sql => {
			return await sql.query("SELECT id_pergunta, descricao FROM pergunta WHERE id_curso = 1 ORDER BY id_pergunta ASC");
		});

		res.render("index/qualiSI", {
			perguntas: perguntas
		});
	}

	public async qualiSIOld(req: app.Request, res: app.Response) {
		res.render("index/qualiSIOld");
	}

	public async qualiSI2(req: app.Request, res: app.Response) {
		res.render("index/qualiSI2");
	}

	public async qualiSI3(req: app.Request, res: app.Response) {
		res.render("index/qualiSI3");
	}

	public async qualiSI4(req: app.Request, res: app.Response) {
		res.render("index/qualiSI4");
	}

	public async qualiSI5(req: app.Request, res: app.Response) {
		res.render("index/qualiSI5");
	}

	public async erro(req: app.Request, res: app.Response) {
		res.render("index/erro");
	}

	public async resultado(req: app.Request, res: app.Response) {
		res.render("index/resultado");
	}
}

export = AvatarRoute;