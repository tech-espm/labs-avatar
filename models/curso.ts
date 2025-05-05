import app = require("teem");
import DataUtil = require("../utils/dataUtil");
import Validacao = require("../utils/validacao");

interface Curso {
    id_curso: number;
    nome: string;
    descricao: string;
    criacao: string;
}

class Curso {
    private static validar(curso: Curso, criacao: boolean): string {
        if (!curso)
            return "Curso inválido";

        if (!criacao) {
            if (!(curso.id_curso = parseInt(curso.id_curso as any)))
                return "Id inválido";
        }

        if (!curso.nome || !(curso.nome = curso.nome.normalize().trim()) || curso.nome.length > 100)
            return "Nome inválido";

        if (!curso.descricao || !(curso.descricao = curso.descricao.normalize().trim()))
            return "Descrição inválida";

        return null;
    }

    public static async listar(): Promise<Curso[]> {
        let lista: Curso[] = null;

        await app.sql.connect(async (sql) => {
            lista = await sql.query("select id_curso, nome, descricao, date_format(criacao, '%d/%m/%Y') criacao from curso where exclusao is null order by nome asc") as Curso[];
        });

        return (lista || []);
    }

    public static async obter(id_curso: number): Promise<Curso> {
        let lista: Curso[] = null;

        await app.sql.connect(async (sql) => {
            lista = await sql.query("select id_curso, nome, descricao, date_format(criacao, '%d/%m/%Y') criacao from curso where id_curso = ? and exclusao is null", [id_curso]) as Curso[];
        });

        return ((lista && lista[0]) || null);
    }

    public static async criar(curso: Curso): Promise<string> {
        let res: string;
        if ((res = Curso.validar(curso, true)))
            return res;

        await app.sql.connect(async (sql) => {
            try {
                await sql.query("insert into curso (nome, descricao) values (?, ?)", [curso.nome, curso.descricao]);
            } catch (e) {
                throw e;
            }
        });

        return res;
    }

    public static async editar(curso: Curso): Promise<string> {
        let res: string;
        if ((res = Curso.validar(curso, false)))
            return res;

        return await app.sql.connect(async (sql) => {
            await sql.query("update curso set nome = ?, descricao = ? where id_curso = ? and exclusao is null", [curso.nome, curso.descricao, curso.id_curso]);

            return (sql.affectedRows ? null : "Curso não encontrado");
        });
    }

    public static async excluir(id_curso: number): Promise<string> {
        return app.sql.connect(async (sql) => {
            const agora = DataUtil.horarioDeBrasiliaISOComHorario();

            await sql.query("update curso set exclusao = ? where id_curso = ? and exclusao is null", [agora, id_curso]);

            return (sql.affectedRows ? null : "Curso não encontrado");
        });
    }
}

export = Curso;