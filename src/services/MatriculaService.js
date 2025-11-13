// src/services/MatriculaService.js

// Importa database para transações
// e TurmaRepository para validação de turma existente
const db = require('../config/database');
const TurmaRepository = require('../repositories/TurmaRepository');
const MatriculaRepository = require('../repositories/MatriculaRepository');
const Matricula = require('../domain/Matricula');

const VALID_STATUS = ['ATIVA', 'CANCELADA', 'CONCLUIDA'];

class MatriculaService {
    constructor() {
        this.matriculaRepository = new MatriculaRepository();
        this.turmaRepository = new TurmaRepository();
    }

    async getAllMatriculas() {
        return await this.matriculaRepository.findAll();
    }

    async getMatriculaById(id) {
        const matricula = await this.matriculaRepository.findBy(id);
        if (!matricula) throw new Error('Matrícula não encontrada');
        return matricula;
    }

    async createMatricula(matriculaData) {
        const {aluno_id, turma_id, data, status} = matriculaData;
        if (!aluno_id || !turma_id) throw new Error('aluno_id e turma_id são obrigatórios');

        // Normaliza o status enviado
        const st = status ? String(status).toUpperCase() : 'ATIVA';
        // Só valida se o usuário enviou status
        if (status && !VALID_STATUS.includes(st)) {
            throw new Error(`status inválido. Valores permitidos: ${VALID_STATUS.join(', ')}`);
        }
        // Verifica se turma existe
        const turma = await this.turmaRepository.findBy(turma_id);
        if (!turma) throw new Error('Turma não encontrada');

        const existing = await this.matriculaRepository.findByAlunoETurma(aluno_id, turma_id);
        if (existing) throw new Error('Aluno já está matriculado nesta turma');

        const preRequisitoOk = await this.matriculaRepository.atendePreRequisitos(aluno_id, turma.disciplinaId);
        if (!preRequisitoOk) {
            throw new Error ('Aluno não atende os pré-requisitos para esta disciplina');
        }
        const vagasOcupadas = await this.matriculaRepository.countAtivasByTurma(turma_id);
        if (vagasOcupadas >= turma.vagas) {
            throw new Error('Não há vagas disponíveis nesta turma')
        }
        const conflito = await this.matriculaRepository.possuiConflitoHorario(aluno_id, turma_id);
        if (conflito) {
            throw new Error ('Conflito de horário com outra matrícula ativa');
        }

        const client = await db.pool.connect();
        try {
            await client.query('BEGIN');
            const matricula = new Matricula(null, aluno_id, turma_id, data, st);
            const novaMatricula = await this.matriculaRepository.save(matricula, client);
            await client.query('COMMIT');
            return novaMatricula;
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    }
    async updateMatricula(id, matriculaData) {
        const existing = await this.matriculaRepository.findBy(id);
        if (!existing) throw new Error('Matrícula não encontrada');

        let {aluno_id, turma_id, data, status} = matriculaData;

        const newAlunoId = aluno_id || existing.aluno_id;
        const newTurmaId = turma_id || existing.turma_id;
        const newStatus = status 
            ? String(status).toUpperCase() 
            : String(existing.status).toUpperCase(); 
        const newData = data || existing.data;

        // Verifica conflito primeiro
        if (newAlunoId !== existing.aluno_id || newTurmaId !== existing.turma_id) {
            const conflict = await this.matriculaRepository.findByAlunoETurma(newAlunoId, newTurmaId);

            if (conflict && conflict.id !== id) {
                throw new Error('Já existe uma matrícula para esse aluno nessa turma');
            }
        }

        // Só valida status se o usuário enviou um novo
        if (status !== undefined && !VALID_STATUS.includes(newStatus)) {
            throw new Error(`status inválido. Valores permitidos: ${VALID_STATUS.join(', ')}`);
        }

        const matricula = new Matricula(id, newAlunoId, newTurmaId, newData, newStatus);
        const updated = await this.matriculaRepository.update(id, matricula);

        if (!updated) throw new Error('Erro ao atualizar matrícula');
        return updated;
    }

    async deleteMatricula(id) {
        const matricula = await this.matriculaRepository.findBy(id);
        if (!matricula) throw new Error('Matrícula não encontrada');
        const deleted = await this.matriculaRepository.delete(id);
        if (!deleted) throw new Error('Erro ao deletar matrícula');
        return true;
    }
}

module.exports = MatriculaService;
