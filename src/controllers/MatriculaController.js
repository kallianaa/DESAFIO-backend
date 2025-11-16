// src/controllers/MatriculaController.js
const db = require('../config/database'); // exporta .query e .pool
const MatriculaService = require('../services/MatriculaService');

class MatriculaController {
    constructor() {
        this.getMinhasMatriculas = this.getMinhasMatriculas.bind(this);
        this.getAll = this.getAll.bind(this);
        this.getById = this.getById.bind(this);
        this.getTurmasDisponiveis = this.getTurmasDisponiveis.bind(this);
        this.delete = this.delete.bind(this);
        this.post = this.post.bind(this);
        this.matriculaService = new MatriculaService();
    }

    _getUserIdFromReq(req) {
        if (!req || !req.user) return null;
        return req.user.id || req.user.sub || null;
    }

    async getAll(req, res) {
        console.log('[MatriculaController.getAll] user:', req.user && { id: req.user.id || req.user.sub, roles: req.user.roles });
        try {
            const roles = Array.isArray(req.user && req.user.roles) ? req.user.roles : [];
            const userId = this._getUserIdFromReq(req);

            let query = `
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
            `;

            // Non-admin users can only see their own matriculas
            if (!roles.includes('ADMIN')) {
                query += ` WHERE m.aluno_id = $1 ORDER BY m.data DESC`;
            } else {
                query += ` ORDER BY m.data DESC`;
            }

            const result = roles.includes('ADMIN') 
                ? await db.query(query) 
                : await db.query(query, [userId]);
            
            const matriculas = result && result.rows ? result.rows : [];

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

    async getMinhasMatriculas(req, res) {
        console.log('[MatriculaController.getMinhasMatriculas] user:', req.user && { id: req.user.id || req.user.sub, roles: req.user.roles });
        try {
            const userId = this._getUserIdFromReq(req);

            if (!userId) {
                return res.status(401).json({ success: false, error: 'Usuário não autenticado' });
            }

            const matriculas = await this.matriculaService.getMinhasMatriculas(userId);

            console.log('[MatriculaController.getMinhasMatriculas] rows:', matriculas.length);

            return res.json({
                success: true,
                data: matriculas,
                count: matriculas.length
            });
        } catch (error) {
            console.error('[MatriculaController.getMinhasMatriculas] Error:', error);
            return res.status(500).json({
                success: false,
                error: 'Erro ao buscar minhas matrículas'
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

    async delete(req, res) {
        console.log('[MatriculaController.delete] params:', req.params, 'user:', req.user && { id: req.user.id || req.user.sub });
        try {
            const { id } = req.params;

            // Check if the matricula exists
            const matricula = await this.matriculaService.getMatriculaById(id);

            const roles = Array.isArray(req.user && req.user.roles) ? req.user.roles : [];
            const userId = this._getUserIdFromReq(req);

            // Authorization check: only ADMIN or the student themselves can delete
            if (!(roles.includes('ADMIN')) && userId !== matricula.aluno_id) {
                return res.status(403).json({ success: false, error: 'Acesso negado' });
            }

            // Delete the matricula
            await this.matriculaService.deleteMatricula(id);

            return res.json({ success: true, message: 'Matrícula deletada com sucesso' });
        } catch (error) {
            console.error('[MatriculaController.delete] Error:', error);
            
            if (error.message.includes('não encontrada')) {
                return res.status(404).json({ success: false, error: error.message });
            }
            
            return res.status(500).json({ success: false, error: 'Erro ao deletar matrícula' });
        }
    }

    async post(req, res) {
        console.log('[MatriculaController.post] body:', req.body, 'user:', req.user && { id: req.user.id || req.user.sub, roles: req.user.roles });
        try {
            const { aluno_id, turma_id, data, status } = req.body;

            // Validation
            if (!aluno_id || !turma_id) {
                return res.status(400).json({ success: false, error: 'aluno_id e turma_id são obrigatórios' });
            }

            const roles = Array.isArray(req.user && req.user.roles) ? req.user.roles : [];
            const userId = this._getUserIdFromReq(req);

            // Authorization check: only ADMIN can create matriculas for other students
            if (!(roles.includes('ADMIN')) && userId !== aluno_id) {
                return res.status(403).json({ success: false, error: 'Acesso negado' });
            }

            // Use service to create matricula
            const matricula = await this.matriculaService.createMatricula({
                aluno_id,
                turma_id,
                data,
                status
            });

            return res.status(201).json({ success: true, data: matricula });
        } catch (error) {
            console.error('[MatriculaController.post] Error:', error);
            
            // Handle specific error messages from service
            if (error.message.includes('obrigatórios')) {
                return res.status(400).json({ success: false, error: error.message });
            }
            if (error.message.includes('inválido')) {
                return res.status(400).json({ success: false, error: error.message });
            }
            if (error.message.includes('já está matriculado')) {
                return res.status(409).json({ success: false, error: error.message });
            }
            
            return res.status(500).json({ success: false, error: 'Erro ao criar matrícula' });
        }
    }
}

module.exports = new MatriculaController();
