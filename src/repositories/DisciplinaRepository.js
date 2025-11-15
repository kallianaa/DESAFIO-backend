const Disciplina = require('../domain/Disciplina');
const db = require('../config/database');

class DisciplinaRepository {
    async findBy(id) {
        const result = await db.query('SELECT * FROM "Disciplina" WHERE id = $1', [id]);
        if (result.rows.length === 0) {
            return null;
        }
        return Disciplina.criar(result.rows[0]);
    }

    async save(disciplina) {
        const result = await db.query(
            'INSERT INTO "Disciplina" (codigo, nome, creditos) VALUES ($1, $2, $3) RETURNING *',
            [disciplina.codigo, disciplina.nome, disciplina.creditos]
        );
        return Disciplina.criar(result.rows[0]);
    }

    async findAll() {
        const result = await db.query('SELECT * FROM "Disciplina"');
        return result.rows.map(row => Disciplina.criar(row));
    }

    async update(id, disciplina) {
        const result = await db.query(
            'UPDATE "Disciplina" SET codigo = $1, nome = $2, creditos = $3 WHERE id = $4 RETURNING *',
            [disciplina.codigo, disciplina.nome, disciplina.creditos, id]
        );
        if (result.rows.length === 0) {
            return null;
        }
        return Disciplina.criar(result.rows[0]);
    }

    async delete(id) {
        const result = await db.query(
            'DELETE FROM "Disciplina" WHERE id = $1 RETURNING *',
            [id]
        );
        if (result.rows.length === 0) {
            return false;
        }
        return true;
    }
}

module.exports = DisciplinaRepository;
