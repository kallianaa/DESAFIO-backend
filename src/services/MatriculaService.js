// src/services/MatriculaService.js
const MatriculaRepository = require('../repositories/MatriculaRepository');
const Matricula = require('../domain/Matricula');

const VALID_STATUS = ['ATIVA', 'CANCELADA', 'CONCLUIDA'];

class MatriculaService {
    constructor() {
        this.matriculaRepository = new MatriculaRepository();
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

        const st = status ? String(status).toUpperCase() : 'ATIVA';
        if (!VALID_STATUS.includes(st)) {
            throw new Error(`status inválido. Valores permitidos: ${VALID_STATUS.join(', ')}`);
        }

        const existing = await this.matriculaRepository.findByAlunoETurma(aluno_id, turma_id);
        if (existing) throw new Error('Aluno já está matriculado nesta turma');

        const matricula = new Matricula(null, aluno_id, turma_id, data || null, st);
        return await this.matriculaRepository.save(matricula);
    }

    async updateMatricula(id, matriculaData) {
        const existing = await this.matriculaRepository.findBy(id);
        if (!existing) throw new Error('Matrícula não encontrada');

        let {aluno_id, turma_id, data, status} = matriculaData;

        const newAlunoId = aluno_id || existing.aluno_id;
        const newTurmaId = turma_id || existing.turma_id;
        const newStatus = status ? String(status).toUpperCase() : existing.status;
        const newData = data || existing.data;

        if (!VALID_STATUS.includes(newStatus)) {
            throw new Error(`status inválido. Valores permitidos: ${VALID_STATUS.join(', ')}`);
        }

        // se trocar aluno/turma - checar conflito
        if (newAlunoId !== existing.aluno_id || newTurmaId !== existing.turma_id) {
            const conflict = await this.matriculaRepository.findByAlunoETurma(newAlunoId, newTurmaId);
            if (conflict && conflict.id !== id) {
                throw new Error('Já existe uma matrícula para esse aluno nessa turma');
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
        const deleted = await this.matriculaRepository.delete(id);
        if (!deleted) throw new Error('Erro ao deletar matrícula');
        return true;
    }
}

module.exports = MatriculaService;
