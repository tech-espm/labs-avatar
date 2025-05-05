import app = require("teem");
import perfis = require("../models/perfil");
import Curso = require("../models/curso");
import Usuario = require("../models/usuario");


class CursoRoute {
    public static async criar(req: app.Request, res: app.Response) {
        let u = await Usuario.cookie(req);
        if (!u || !u.admin)
            res.redirect(app.root + "/acesso");
        else
            res.render("curso/editar", {
                layout: "layout-form",
                titulo: "Criar Curso",
                textoSubmit: "Criar",
                usuario: u,
                item: null,
                perfis: perfis.lista
            });
    }




    public static async editar(req: app.Request, res: app.Response) {
        let u = await Usuario.cookie(req);
        if (!u || !u.admin) {
            res.redirect(app.root + "/acesso");
        } else {
            let id_curso = parseInt(req.query["id_curso"] as string);
            let item: Curso = null;
            if (isNaN(id_curso) || !(item = await Curso.obter(id_curso)))
                res.render("index/nao-encontrado", {
                    layout: "layout-sem-form",
                    usuario: u
                });
            else
                res.render("curso/editar", {
                    layout: "layout-form",
                    titulo: "Editar Curso",
                    usuario: u,
                    item: item,
                    perfis: perfis.lista
                });
        }
    }




    
    public static async listar(req: app.Request, res: app.Response) {
        let u = await Usuario.cookie(req);
        if (!u || !u.admin)
            res.redirect(app.root + "/acesso");
        else
            res.render("curso/listar", {
                layout: "layout-tabela",
                titulo: "Gerenciar Cursos",
                datatables: true,
                xlsx: true,
                usuario: u,
                lista: await Curso.listar()
            });
    }
}

export = CursoRoute;