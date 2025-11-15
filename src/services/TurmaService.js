const TurmaRepository = require('../repositories/TurmaRepository');
const Turma = require('../domain/Turma');
const Horario = require('../domain/Horario');

class TurmaService {
    constructor() {
        this.turmaRepository = new TurmaRepository();
    }

    async listarTurmas() {
        return await this.turmaRepository.findAll();
    }

    async criarTurma(turmaData) {
        const {
            codigo,
            disciplina_id,
            professor_id,
            vagas,
            dia,
            turno,
            horario_codigo
        } = turmaData;

        if (!codigo || !disciplina_id || !professor_id || !vagas) {
            throw new Error('codigo, disciplina_id, professor_id e vagas são obrigatórios');
        }

        let horario;

        if (horario_codigo) {
            horario = Horario.fromCodigo(horario_codigo);
        } else if (dia != null && turno != null) {
            const codigoHorario = `D${dia}T${turno}`;
            horario = new Horario(dia, turno, codigoHorario);
        } else {
            throw new Error('É necessário informar dia/turno OU horario_codigo');
        }

        const turma = new Turma(
            null,
            codigo,
            disciplina_id,
            professor_id,
            vagas,
            horario
        );

        return await this.turmaRepository.save(turma);
    }

    async deleteTurma(id) {
        const turma = await this.turmaRepository.findBy(id);
        if (!turma) {
            throw new Error('Turma não encontrada');
        }

        const deleted = await this.turmaRepository.delete(id);
        if (!deleted) {
            throw new Error('Erro ao deletar turma');
        }

        return true;
    }

    async putTurma(id, turmaData) {
        const existing = await this.turmaRepository.findBy(id);
        if (!existing) {
            throw new Error('Turma não encontrada');
        }

        const {
            codigo,
            disciplina_id,
            professor_id,
            vagas,
            dia,
            turno,
            horario_codigo
        } = turmaData;

        const newCodigo = codigo || existing.codigo;
        const newDisciplinaId = disciplina_id || existing.disciplinaId;
        const newProfessorId = professor_id || existing.professorId;
        const newVagas = vagas || existing.vagas;

        let newHorario = existing.horario;

        if (horario_codigo || dia != null || turno != null) {
            if (horario_codigo) {
                newHorario = Horario.fromCodigo(horario_codigo);
            } else {
                const novoDia = dia != null ? dia : existing.horario.dia;
                const novoTurno = turno != null ? turno : existing.horario.turno;
                const codigoHorario = `D${novoDia}T${novoTurno}`;

                newHorario = new Horario(novoDia, novoTurno, codigoHorario);
            }
        }

        const turmaAtualizada = new Turma(
            id,
            newCodigo,
            newDisciplinaId,
            newProfessorId,
            newVagas,
            newHorario
        );

        const updated = await this.turmaRepository.update(turmaAtualizada);
        if (!updated) {
            throw new Error('Erro ao atualizar turma');
        }

        return updated;
    }
}

module.exports = TurmaService;