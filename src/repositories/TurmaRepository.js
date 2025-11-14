const Turma = require('../domain/Turma');
const db = require('../config/database');

class TurmaRepository {
    async findBy(id) {
        const result = await db.query('SELECT * FROM "Turma" WHERE id = $1', [id]);
        if (result.rows.length === 0) {
            return null;
        }
        return Turma.criar(result.rows[0]);
    }

    async save(turma) {
        const result = await db.query(
            `INSERT INTO "Turma" (codigo, disciplina_id, professor_id, vagas, dia, turno) 
            VALUES ($1, $2, $3, $4, $5, $6) 
            RETURNING *`,
            [
                turma.codigo,
                turma.disciplinaId,
                turma.professorId,
                turma.vagas,
                turma.horario.dia,
                turma.horario.turno
            ]
        );
        return Turma.criar(result.rows[0]);
    }

    async findAll() {
        const result = await db.query('SELECT * FROM "Turma"');
        return result.rows.map(row => Turma.criar(row));
    }

    async update(id, turmaDTO) {
    const result = await db.query(`
        UPDATE "Turma"
        SET codigo = $1,
            disciplina_id = $2,
            professor_id = $3,
            vagas = $4,
            dia = $5,
            turno = $6
        WHERE id = $7
        RETURNING *;
    `, [
        turmaDTO.codigo,
        turmaDTO.disciplina_id,
        turmaDTO.professor_id,
        turmaDTO.vagas,
        turmaDTO.dia,
        turmaDTO.turno,
        id
    ]);
        if (result.rows.length === 0) {
            return null;
        }
        return Turma.criar(result.rows[0]);
    }

    async delete(id) {
        const result = await db.query(
            'DELETE FROM "Turma" WHERE id = $1 RETURNING *',
            [id]
        );
        if (result.rows.length === 0) {
            return false;
        }
        return true;
    }
}

module.exports = TurmaRepository;