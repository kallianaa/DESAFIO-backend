const Turma = require('../domain/Turma');
const db = require('../config/database');

class TurmaRepository {
    async findBy(id) {
        const result = await db.query('SELECT * FROM turma WHERE id = $1', [id]);
        if (result.rows.length === 0) {
            return null;
        }
        return Turma.criar(result.rows[0]);
    }

    async save(turma) {
        const result = await db.query(
            'INSERT INTO turma (codigo) VALUES ($1) RETURNING *',
            [turma.codigo]
        );
        return Turma.criar(result.rows[0]);
    }

    async findAll() {
        const result = await db.query('SELECT * FROM turma');
        return result.rows.map(row => Turma.criar(row));
    }

    async update(id, turma) {
        const result = await db.query(
            'UPDATE turma SET codigo = $1 WHERE id = $2 RETURNING *',
            [turma.codigo, id]
        );
        if (result.rows.length === 0) {
            return null;
        }
        return Turma.criar(result.rows[0]);
    }

    async delete(id) {
        const result = await db.query(
            'DELETE FROM turma WHERE id = $1 RETURNING *',
            [id]
        );
        if (result.rows.length === 0) {
            return false;
        }
        return true;
    }
}

module.exports = TurmaRepository;