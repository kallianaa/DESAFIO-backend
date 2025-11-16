// src/repositories/MatriculaRepository.js
const Matricula = require('../domain/Matricula');
const db = require('../config/database');

class MatriculaRepository {
    async findBy(id) {
        const result = await db.query('SELECT * FROM "Matricula" WHERE id = $1', [id]);
        if (result.rows.length === 0) return null;
        return Matricula.criar(result.rows[0]);
    }

    async findAll() {
        const result = await db.query('SELECT * FROM "Matricula" ORDER BY data DESC');
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

    async findByAlunoId(alunoId) {
        const result = await db.query(
            'SELECT * FROM "Matricula" WHERE aluno_id = $1 ORDER BY data DESC',
            [alunoId]
        );
        return result.rows.map(row => Matricula.criar(row));
    }

    async save(matricula) {
        try {
            if (matricula.data) {
                const result = await db.query(
                    `INSERT INTO "Matricula" (aluno_id, turma_id, data, status)
                     VALUES ($1, $2, $3, $4) RETURNING *`,
                    [matricula.aluno_id, matricula.turma_id, matricula.data, matricula.status]
                );
                return Matricula.criar(result.rows[0]);
            } else {
                const result = await db.query(
                    `INSERT INTO "Matricula" (aluno_id, turma_id, status)
                     VALUES ($1, $2, $3) RETURNING *`,
                    [matricula.aluno_id, matricula.turma_id, matricula.status]
                );
                return Matricula.criar(result.rows[0]);
            }
        } catch (err) {
            if (err.code === '23505') {
                throw new Error('Aluno já está matriculado nesta turma.');
            }
            throw err;
        }
    }

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
