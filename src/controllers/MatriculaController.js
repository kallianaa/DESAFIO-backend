// src/controllers/MatriculaController.js
const db = require('../config/database'); // exporta .query e .pool

class MatriculaController {
    constructor() {
        this.getAll = this.getAll.bind(this);
        this.getById = this.getById.bind(this);
        this.getTurmasDisponiveis = this.getTurmasDisponiveis.bind(this);
    }

    _getUserIdFromReq(req) {
        if (!req || !req.user) return null;
        return req.user.id || req.user.sub || null;
    }

    async getAll(req, res) {
        console.log('[MatriculaController.getAll] query:', req.query, 'user:', req.user && { id: req.user.id || req.user.sub, roles: req.user.roles });
        try {
            const { aluno_id, turma_id, status, disciplina_id } = req.query;

            let baseQuery = `
                SELECT
                    m.id,
                    m.data,
                    m.status,
                    a.id as aluno_id,
                    a.ra,
                    ua.nome as aluno_nome,
                    t.id as turma_id,
                    t.codigo as turma_codigo,
                    d.codigo as disciplina_codigo,
                    d.nome as disciplina_nome,
                    d.creditos,
                    up.nome as professor_nome,
                    t.dia,
                    t.turno
                FROM "Matricula" m
                         INNER JOIN "Aluno" a ON m.aluno_id = a.id
                         INNER JOIN "Usuario" ua ON a.id = ua.id
                         INNER JOIN "Turma" t ON m.turma_id = t.id
                         INNER JOIN "Disciplina" d ON t.disciplina_id = d.id
                         INNER JOIN "Professor" p ON t.professor_id = p.id
                         INNER JOIN "Usuario" up ON p.id = up.id
            `;

            const conditions = [];
            const values = [];
            let idx = 1;

            if (aluno_id) {
                conditions.push(`m.aluno_id = $${idx++}`);
                values.push(aluno_id);
            }

            if (turma_id) {
                conditions.push(`m.turma_id = $${idx++}`);
                values.push(turma_id);
            }

            if (status) {
                conditions.push(`m.status = $${idx++}`);
                values.push(status);
            }

            if (disciplina_id) {
                conditions.push(`t.disciplina_id = $${idx++}`);
                values.push(disciplina_id);
            }

            const roles = Array.isArray(req.user && req.user.roles) ? req.user.roles : [];
            const userId = this._getUserIdFromReq(req);

            if (!(roles.includes('ADMIN')) && roles.includes('ALUNO') && userId) {
                conditions.push(`m.aluno_id = $${idx++}`);
                values.push(userId);
            }

            if (conditions.length > 0) {
                baseQuery += ' WHERE ' + conditions.join(' AND ');
            }

            baseQuery += ' ORDER BY m.data DESC';

            const result = await db.query(baseQuery, values);
            const matriculas = result && result.rows ? result.rows : [];

            console.log('[MatriculaController.getAll] rows:', matriculas.length);

            return res.json({
                success: true,
                data: matriculas,
                count: matriculas.length
            });
        } catch (error) {
            console.error('[MatriculaController.getAll] Error:', error);
            return res.status(500).json({
                success: false,
                error: 'Erro ao buscar matrículas'
            });
        }
    }

    async getById(req, res) {
        console.log('[MatriculaController.getById] params:', req.params, 'user:', req.user && { id: req.user.id || req.user.sub });
        try {
            const { id } = req.params;

            const query = `
                SELECT
                    m.id,
                    m.data,
                    m.status,
                    a.id as aluno_id,
                    a.ra,
                    ua.nome as aluno_nome,
                    ua.email as aluno_email,
                    t.id as turma_id,
                    t.codigo as turma_codigo,
                    d.codigo as disciplina_codigo,
                    d.nome as disciplina_nome,
                    d.creditos,
                    up.nome as professor_nome,
                    t.dia,
                    t.turno
                FROM "Matricula" m
                         INNER JOIN "Aluno" a ON m.aluno_id = a.id
                         INNER JOIN "Usuario" ua ON a.id = ua.id
                         INNER JOIN "Turma" t ON m.turma_id = t.id
                         INNER JOIN "Disciplina" d ON t.disciplina_id = d.id
                         INNER JOIN "Professor" p ON t.professor_id = p.id
                         INNER JOIN "Usuario" up ON p.id = up.id
                WHERE m.id = $1
            `;

            const result = await db.query(query, [id]);
            const rows = result && result.rows ? result.rows : [];

            if (!rows.length) {
                return res.status(404).json({ success: false, error: 'Matrícula não encontrada' });
            }

            const matricula = rows[0];

            const roles = Array.isArray(req.user && req.user.roles) ? req.user.roles : [];
            const userId = this._getUserIdFromReq(req);

            if (!(roles.includes('ADMIN')) && userId !== matricula.aluno_id) {
                return res.status(403).json({ success: false, error: 'Acesso negado' });
            }

            return res.json({ success: true, data: matricula });
        } catch (error) {
            console.error('[MatriculaController.getById] Error:', error);
            return res.status(500).json({ success: false, error: 'Erro ao buscar matrícula' });
        }
    }

    async getTurmasDisponiveis(req, res) {
        console.log('[MatriculaController.getTurmasDisponiveis] user:', req.user && (req.user.id || req.user.sub));
        try {
            const aluno_id = this._getUserIdFromReq(req);

            const query = `
                SELECT
                    t.id,
                    t.codigo,
                    d.codigo as disciplina_codigo,
                    d.nome as disciplina_nome,
                    d.creditos,
                    up.nome as professor_nome,
                    t.vagas,
                    t.dia,
                    t.turno,
                    COUNT(m.id) as alunos_matriculados,
                    (t.vagas - COUNT(m.id)) as vagas_disponiveis
                FROM "Turma" t
                         INNER JOIN "Disciplina" d ON t.disciplina_id = d.id
                         INNER JOIN "Professor" p ON t.professor_id = p.id
                         INNER JOIN "Usuario" up ON p.id = up.id
                         LEFT JOIN "Matricula" m ON t.id = m.turma_id AND m.status = 'ATIVA'
                WHERE t.id NOT IN (
                    SELECT ma.turma_id
                    FROM "Matricula" ma
                    WHERE ma.aluno_id = $1 AND ma.status = 'ATIVA'
                )
                GROUP BY t.id, t.codigo, d.codigo, d.nome, d.creditos, up.nome, t.vagas, t.dia, t.turno
                HAVING (t.vagas - COUNT(m.id)) > 0
                ORDER BY d.nome, t.dia, t.turno
            `;

            const result = await db.query(query, [aluno_id]);
            const turmas = result && result.rows ? result.rows : [];

            return res.json({ success: true, data: turmas, count: turmas.length });
        } catch (error) {
            console.error('[MatriculaController.getTurmasDisponiveis] Error:', error);
            return res.status(500).json({ success: false, error: 'Erro ao buscar turmas disponíveis' });
        }
    }
}

module.exports = new MatriculaController();
