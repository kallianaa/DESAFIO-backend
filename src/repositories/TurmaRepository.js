const Turma = require('../domain/Turma');
const db = require('../config/database');
const MatriculaRepository = require('./MatriculaRepository');

class TurmaRepository {
    constructor() {
        this.matriculaRepository = new MatriculaRepository();
    }

    async findById(id) {
        const result = await db.query(
            'SELECT * FROM "Turma" WHERE id = $1',
            [id]
        );
        if (result.rows.length === 0) {
            return null;
        }
        return Turma.criar(result.rows[0]);
    }

    async findAll() {
        const result = await db.query('SELECT * FROM "Turma"');
        return result.rows.map(row => Turma.criar(row));
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

    async update(turma) {
    const result = await db.query(`
        UPDATE "Turma"
        SET codigo = $1,
            disciplina_id = $2,
            professor_id = $3,
            vagas = $4,
            dia = $5,
            turno = $6
        WHERE id = $7
        RETURNING *`, 
        [
            turma.codigo,
            turma.disciplinaId,
            turma.professorId,
            turma.vagas,
            turma.horario.dia,
            turma.horario.turno,
            turma.id
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

async listarAlunosDaTurma(turmaId, user) {
    const turma = await this.findById(turmaId);
    if (!turma) throw new Error("Turma não encontrada");

    // Admin pode ver
    if (user.roles.includes("ADMIN"))
      return this.matriculaRepository.findAlunosPorTurma(turmaId);

    // Professor só se a turma for dele
    if (user.roles.includes("PROFESSOR") && turma.professorId === user.id)
      return this.matriculaRepository.findAlunosPorTurma(turmaId);

    throw new Error("Acesso negado");
  }
}

module.exports = TurmaRepository;