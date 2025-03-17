import app = require("teem");
import Curso = require("../../models/curso");
import Usuario = require("../../models/usuario"); 


class CursoApiRoute {
    @app.http.post()
    public static async criar(req: app.Request, res: app.Response) {
        const u = await Usuario.cookie(req, res, true);
        if (!u)
            return;

        const erro = await Curso.criar(req.body);

        if (erro) {
            res.status(400).json(erro);
            return;
        }

        res.sendStatus(204);
    }

    public static async listar(req: app.Request, res: app.Response) {
        const u = await Usuario.cookie(req, res, true);
        if (!u)
            return;

        res.json(await Curso.listar());
    }

    @app.http.get()
    public static async obter(req: app.Request, res: app.Response) {
        const u = await Usuario.cookie(req, res, true);
        if (!u)
            return;

        const id_curso = parseInt(req.query["id_curso"] as string);

        if (isNaN(id_curso)) {
            res.status(400).json("Id inválido");
            return;
        }

        const curso = await Curso.obter(id_curso);

        if (!curso) {
            res.status(404).json("Curso não encontrado");
            return;
        }

        res.json(curso);
    }

    @app.http.put()
    public static async editar(req: app.Request, res: app.Response) {
        const u = await Usuario.cookie(req, res, true);
        if (!u)
            return;

        const erro = await Curso.editar(req.body);

        if (erro) {
            res.status(400).json(erro);
            return;
        }

        res.sendStatus(204);
    }

    @app.http.delete()
    public static async excluir(req: app.Request, res: app.Response) {
        const u = await Usuario.cookie(req, res, true);
        if (!u)
            return;

        const id_curso = parseInt(req.query["id_curso"] as string);

        if (isNaN(id_curso)) {
            res.status(400).json("Id inválido");
            return;
        }

        const erro = await Curso.excluir(id_curso);

        if (erro) {
            res.status(400).json(erro);
            return;
        }

        res.sendStatus(204);
    }
}

export = CursoApiRoute;