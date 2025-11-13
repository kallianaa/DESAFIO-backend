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

    async save(matricula, client = db) {
        // Utiliza o client fornecido (quando dentro de uma transação);
        // caso contrário, usa o db padrão.
        try {
            const params = matricula.data
                ? [matricula.aluno_id, matricula.turma_id, matricula.data, matricula.status]
                : [matricula.aluno_id, matricula.turma_id, matricula.status];

            const query = matricula.data
                ? `INSERT INTO "Matricula" (aluno_id, turma_id, data, status)
                   VALUES ($1, $2, $3, $4) RETURNING *`
                : `INSERT INTO "Matricula" (aluno_id, turma_id, status)
                   VALUES ($1, $2, $3) RETURNING *`;

            const result = await client.query(query, params);
                return Matricula.criar(result.rows[0]);
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

    // Novos metodos para validação adicional em MatriculaService
    async atendePreRequisitos(alunoId, disciplinaId) {
        const preRequisitosQuery = await db.query(
            `SELECT pr.prerequisito_id
             FROM "PreRequisito" pr
             WHERE pr.disciplina_id = $1`,
            [disciplinaId]
        );
        // Se não houver pré-requisitos, retorna true
        if (preRequisitosQuery.rows.length === 0) return true;

        const preRequisitosIds = preRequisitosQuery.rows.map(row => row.pre_requisito_id);
        const concluidasQuery = await db.query(
            `SELECT m.disciplina_id
             FROM "Matricula" m
             JOIN "Turma" t ON m.turma_id = t.id
             WHERE m.aluno_id = $1 
               AND m.status = 'CONCLUIDA'
               AND t.disciplina_id = ANY($2)`,
            [alunoId, preRequisitosIds]
        );
        const disciplinasConcluidas = concluidasQuery.rows.map(row => row.disciplina_id);

        return preRequisitosIds.every(prId => disciplinasConcluidas.includes(prId));
    }
    async countAtivasByTurma(turmaId) {
        const result = await db.query(
            `SELECT COUNT(*)::int count
             FROM "Matricula"
             WHERE turma_id = $1 AND status = 'ATIVA'`,
            [turmaId]
        );
        return result.rows[0].count;
    }
    async possuiConflitoHorario(alunoId, turmaId) {
        const turmaResult = await db.query(
            `SELECT 1
             FROM "Matricula" m
             JOIN "Turma" t1 ON m.turma_id = t1.id
             JOIN "Turma" t2 ON t2.id = $2
                WHERE m.aluno_id = $1
                    AND m.status = 'ATIVA'
                    AND t1.dia = t2.dia
                    AND t1.turno < t2.turno
                LIMIT 1`,
            [alunoId, turmaId]
        );
        return turmaResult.rows.length > 0;
    }
    async saveAtiva(client, alunoId, turmaId, data) {
        const result = await client.query(
            `INSERT INTO "Matricula" (aluno_id, turma_id, data, status)
             VALUES ($1, $2, $3, 'ATIVA') RETURNING *`,
            [alunoId, turmaId, data]
        );
        return Matricula.criar(result.rows[0]);
    }
}

module.exports = MatriculaRepository;
