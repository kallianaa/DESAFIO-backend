const TurmaRepository = require('../repositories/TurmaRepository');
const Turma = require('../domain/Turma');
const Horario = require('../domain/Horario');

class TurmaService {
    constructor() {
        this.turmaRepository = new TurmaRepository();
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

    async listarTurmas(user) {

        // ADMIN pode acessar qualquer turma
        if (user.roles.includes("ADMIN")) {
            return this.turmaRepository.findAll();
        }
        // Professor só pode ver alunos da turma que leciona
        if (user.roles.includes("PROFESSOR")) {
            return this.turmaRepository.findByProfessor(user.id);
        }
        // Alunos só podem ver suas turmas
        if (user.roles.includes("ALUNO")) {
            return this.turmaRepository.findByAluno(user.id);
        }
            throw new Error("Acesso negado");
    }

    async listarAlunosDaTurma(turmaId, user) {
    return this.turmaRepository.listarAlunosDaTurma(turmaId, user);
    }

    async putTurma(id, turmaData) {
        const existing = await this.turmaRepository.findById(id);
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

    async deleteTurma(id) {
        const turma = await this.turmaRepository.findById(id);
        if (!turma) {
            throw new Error('Turma não encontrada');
        }

        const deleted = await this.turmaRepository.delete(id);
        if (!deleted) {
            throw new Error('Erro ao deletar turma');
        }

        return true;
    }
}

module.exports = TurmaService;