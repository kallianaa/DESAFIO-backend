// src/repositories/MatriculaRepository.js
const Matricula = require('../domain/Matricula');
const Horario = require('../domain/Horario');
const db = require('../config/database');

class MatriculaRepository {

// ===== Consultas Básicas ===== //
    async findBy(id) {
        const result = await db.query(
            'SELECT * FROM "Matricula" WHERE id = $1',
            [id]
        );
        if (result.rows.length === 0) return null;
        return Matricula.criar(result.rows[0]);
    }

    async findAll() {
        const result = await db.query(
            'SELECT * FROM "Matricula" ORDER BY data DESC'
        );
        return result.rows.map(row => Matricula.criar(row));
    }

    async findByAlunoETurma(alunoId, turmaId) {
        const result = await db.query(
            'SELECT * FROM "Matricula" WHERE aluno_id = $1 AND turma_id = $2',
            [alunoId, turmaId]
        );
        if (result.rows.length === 0) return null;
        return Matricula.criar(result.rows[0]);
    }
    async countByTurmaId(turmaId) {
        const result = await db.query(
            'SELECT COUNT(*) FROM "Matricula" WHERE turma_id = $1 AND status = $2',
            [turmaId, 'ATIVA']
        );
        return parseInt(result.rows[0].count, 10);
    }

    async findAtivasComTurmaByAlunoId(alunoId, excludeMatriculaId = null) {
        let query = `
            SELECT 
                m.id AS matricula_id, m.status,
                t.id AS turma_id, t.codigo, t.vagas, t.dia, t.turno 
            FROM "Matricula" m
            JOIN "Turma" t ON m.turma_id = t.id
            WHERE m.aluno_id = $1 AND m.status = $2
        `;
        
        const params = [alunoId, 'ATIVA'];

        if (excludeMatriculaId) {
            query += ` AND m.id != $${params.length + 1}`;
            params.push(excludeMatriculaId);
        }

        const result = await db.query(query, params);
        
        return result.rows.map(row => ({
            id: row.matricula_id,
            status: row.status,
            turma: {
                id: row.turma_id,
                codigo: row.codigo,
                vagas: row.vagas,
                horario: new Horario(row.dia, row.turno, `D${row.dia}T${row.turno}`)
            }
        }));
    }

// ===== Save ======// 
    async save(matricula) {
        const result = await db.query(
            `INSERT INTO "Matricula" (aluno_id, turma_id, data, status)
             VALUES ($1, $2, $3, $4) RETURNING *`,
            [matricula.aluno_id, matricula.turma_id, matricula.data, matricula.status]
        );
        return Matricula.criar(result.rows[0]);
    }
// ===== Update ===== // 
    async update(id, matricula) {
        const result = await db.query(
            `UPDATE "Matricula"
             SET aluno_id = $1,
                 turma_id = $2,
                 data = $3,
                 status = $4
             WHERE id = $5 RETURNING *`,
            [matricula.aluno_id, matricula.turma_id, matricula.data, matricula.status, id]
        );
        if (result.rows.length === 0) return null;
        return Matricula.criar(result.rows[0]);
    }
// ====== Delete ===== // 
    async delete(id) {
        const result = await db.query(
            'DELETE FROM "Matricula" WHERE id = $1 RETURNING *',
            [id]
        );
        if (result.rows.length === 0) return false;
        return true;
    }
}
module.exports = MatriculaRepository;