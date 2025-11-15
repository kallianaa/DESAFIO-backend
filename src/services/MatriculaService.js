// src/services/MatriculaService.js
const MatriculaRepository = require('../repositories/MatriculaRepository');
const TurmaRepository = require('../repositories/TurmaRepository');
const Matricula = require('../domain/Matricula');

const VALID_STATUS = ['ATIVA', 'CANCELADA', 'CONCLUIDA'];

class MatriculaService {
    constructor() {
        this.matriculaRepository = new MatriculaRepository();
        this.turmaRepository = new TurmaRepository();
    }

    // ========== CRUD ==========
    async getAllMatriculas() {
        return this.matriculaRepository.findAll();
    }

    async getMatriculaById(id) {
        const matricula = await this.matriculaRepository.findBy(id);
        if (!matricula) throw new Error('Matrícula não encontrada');
        return matricula;
    }

    async createMatricula(matriculaData) {
        const {aluno_id, turma_id, data} = matriculaData; 
        
        if (!aluno_id || !turma_id) {
            throw new Error('aluno_id e turma_id são obrigatórios');
        }
        // 1. Buscar a Turma 
        const turma = await this.turmaRepository.findBy(turma_id);
        if (!turma) {
            throw new Error('Turma não encontrada');
        }

        // 2. Checar duplicidade 
        const existing = await this.matriculaRepository.findByAlunoETurma(aluno_id, turma_id);
        if (existing) {
            throw new Error('Aluno já está matriculado nesta turma');
        }

        // 3. Checar vagas
        const matriculasAtivas = await this.matriculaRepository.countByTurmaId(turma_id);
        if (matriculasAtivas >= turma.vagas) {
            throw new Error('Turma sem vagas disponíveis');
        }

        // 4. Checar conflito de horário
        const conflito = await this.checkConflitoHorario(aluno_id, turma);
        if (conflito) {
            throw new Error(
                `Conflito de horário: Aluno já matriculado na turma ${conflito.turma.codigo} no mesmo dia/turno.`
            );
        }

        // 5. Salvar a Matrícula
        const status = 'ATIVA'; 
        const dataMatricula = data || new Date();
        const matricula = new Matricula(null, aluno_id, turma_id, dataMatricula, status);
        return await this.matriculaRepository.save(matricula);
    }
    async checkConflitoHorario(alunoId, novaTurma, excludeMatriculaId = null) {
        // Usa o novo método do repositório
        const matriculasAtivasDoAluno = 
        await this.matriculaRepository.findAtivasComTurmaByAlunoId(
            alunoId,
            excludeMatriculaId // Passa o ID a ser excluído
        );

        if (!matriculasAtivasDoAluno.length) {
            return null; // Aluno não tem matrículas, sem chance de conflito
        }

        const horarioNovaTurma = novaTurma.horario.codigo; // ex: "D2T1"

        // Procura por uma matrícula ativa que tenha o mesmo código de horário
        const conflito = matriculasAtivasDoAluno.find(matricula => {
            return matricula.turma.horario.codigo === horarioNovaTurma;
        });

        return conflito || null;
    }

    async updateMatricula(id, matriculaData) {
        const existing = await this.matriculaRepository.findBy(id);
        if (!existing) throw new Error('Matrícula não encontrada');

        // Se a matrícula estiver concluída, não pode ser alterada.
        if (existing.status === 'CONCLUIDA') {
            throw new Error('Não é permitido alterar uma matrícula com status "CONCLUIDA"');
        }

        const {
            aluno_id, 
            turma_id, 
            data,
            status
        } = matriculaData;

        const newAlunoId = aluno_id || existing.aluno_id;
        const newTurmaId = turma_id || existing.turma_id;
        const newStatus = status ? String(status).toUpperCase() : existing.status;
        const newData = data || existing.data;

        if (!VALID_STATUS.includes(newStatus)) {
            throw new Error(
                `status inválido. Valores permitidos: ${VALID_STATUS.join(', ')}`
            );
        }

        // Definir se precisamos re-validar vagas e horários
        const isChangingTurma = newTurmaId.toString() !== existing.turma_id.toString();
        const isBecomingActive = newStatus === 'ATIVA' && existing.status !== 'ATIVA';

        // Validação #1: Se for mudar de turma, checar se já existe matrícula (mesmo inativa)
        if (isChangingTurma) {
            const conflict = await this.matriculaRepository.findByAlunoETurma(newAlunoId, newTurmaId);
            // Se encontrar conflito E não for a matrícula que estamos editando
            if (conflict && conflict.id.toString() !== id.toString()) {
                throw new Error('Aluno já possui uma matrícula para esta nova turma');
            }
        }

        // Validação #2: Se mudar de turma OU reativar, checar vagas e conflito
        if (isChangingTurma || isBecomingActive) {
            const turma = await this.turmaRepository.findBy(newTurmaId);
            if (!turma) throw new Error('Nova turma não encontrada');

        // Checar Vagas
            const matriculasAtivas = await this.matriculaRepository.countByTurmaId(newTurmaId);
            if (matriculasAtivas >= turma.vagas) {
                throw new Error('Turma sem vagas disponíveis');
            }

            // Checar Conflito (excluindo a matrícula atual da verificação)
            const conflito = await this.checkConflitoHorario(newAlunoId, turma, id);
            if (conflito) {
                throw new Error(
                    `Conflito de horário: Aluno já matriculado na turma ${conflito.turma.codigo} no mesmo dia/turno.`
                );
            }
        }

        const matricula = new Matricula(id, newAlunoId, newTurmaId, newData, newStatus);
        const updated = await this.matriculaRepository.update(id, matricula);
        if (!updated) throw new Error('Erro ao atualizar matrícula');
        return updated;
    }
    async deleteMatricula(id) {
        const matricula = await this.matriculaRepository.findBy(id);
        if (!matricula) throw new Error('Matrícula não encontrada');
        
        // REGRA DE NEGÓCIO: Não permitir exclusão de matrícula 'CONCLUIDA'
        if (matricula.status === 'CONCLUIDA') {
            throw new Error('Não é permitido deletar uma matrícula com status "CONCLUIDA"');
        }

        const deleted = await this.matriculaRepository.delete(id);
        if (!deleted) throw new Error('Erro ao deletar matrícula');
        return true;
    }
}

module.exports = MatriculaService;