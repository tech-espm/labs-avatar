import app = require("teem");
import DataUtil = require("../utils/dataUtil");
import Validacao = require("../utils/validacao");

interface Curso {
    id_curso: number;
    nome: string;
    descricao: string;
    data_criacao: string;
    
}

class Curso {
    public static async listar(): Promise<Curso[]> {
        let lista: Curso[] = null;

        await app.sql.connect(async (sql) => {
            lista = await sql.query("select id_curso, nome, descricao, date_format(data_criacao, '%d/%m/%Y') data_criacao, date_format(criacao, '%d/%m/%Y') criacao from curso where exclusao is null order by nome asc") as Curso[];
        });

        return (lista || []);
    }

    public static async obter(id_curso: number): Promise<Curso> {
        let lista: Curso[] = null;

        await app.sql.connect(async (sql) => {
            lista = await sql.query("select id_curso, nome, descricao, date_format(data_criacao, '%d/%m/%Y') data_criacao, date_format(criacao, '%d/%m/%Y') criacao from curso where id_curso = ?", [id_curso]) as Curso[];
        });

        return ((lista && lista[0]) || null);
    }

    public static async criar(curso: Curso): Promise<string> {
        let res: string;
        if ((res = Curso.validar(curso, true)))
            return res;

        await app.sql.connect(async (sql) => {
            try {
                await sql.query("insert into curso (nome, descricao, data_criacao) values (?, ?, ?, now())", [curso.nome, curso.descricao, curso.data_criacao]);
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
            await sql.query("update curso set nome = ?, descricao = ?, data_criacao = ? where id_curso = ?", [curso.nome, curso.descricao, curso.data_criacao, curso.id_curso]);

            return (sql.affectedRows ? null : "Curso não encontrado");
        });
    }

    public static async excluir(id_curso: number): Promise<string> {
        return app.sql.connect(async (sql) => {
            const agora = DataUtil.horarioDeBrasiliaISOComHorario();

            await sql.query("update curso set exclusao = ? where id_curso = ?", [agora, id_curso]);

            return (sql.affectedRows ? null : "Curso não encontrado");
        });
    }

    private static validar(curso: Curso, criacao: boolean): string {
        if (!curso)
            return "Curso inválido";

        curso.id_curso = parseInt(curso.id_curso as any);

        if (!curso.nome || !(curso.nome = curso.nome.normalize().trim()) || curso.nome.length > 100)
            return "Nome inválido";

        if (!curso.descricao || !(curso.descricao = curso.descricao.normalize().trim()))
            return "Descrição inválida";
        
        curso.data_criacao = DataUtil.converterDataISO(curso.data_criacao);
        if (!curso.data_criacao)
            return "Data de criacao inválida";

        
        return null;

    }
}

export = Curso;