const TurmaRepository = require('../repositories/TurmaRepository');
const Turma = require('../domain/Turma');

class TurmaService {
    constructor() {
        this.turmaRepository = new TurmaRepository();
    }

    async listarTurmas() {
        return await this.turmaRepository.findAll();
    }

    async criarTurma(turmaData) {
        const turma = new Turma(null, turmaData.codigo);
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
        const turma = new Turma(id, turmaData.codigo);
        const updatedTurma = await this.turmaRepository.update(id, turma);
        if (!updatedTurma) {
            throw new Error('Turma não encontrada');
        }
        return updatedTurma;
    }
}

module.exports = TurmaService;