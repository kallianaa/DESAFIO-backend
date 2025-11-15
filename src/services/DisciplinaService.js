const DisciplinaRepository = require('../repositories/DisciplinaRepository');
const Disciplina = require('../domain/Disciplina');

class DisciplinaService {
    constructor() {
        this.disciplinaRepository = new DisciplinaRepository();
    }

    async listarDisciplinas() {
        return await this.disciplinaRepository.findAll();
    }

    async criarDisciplina(disciplinaData) {
        const disciplina = new Disciplina(null, disciplinaData.codigo, disciplinaData.nome, disciplinaData.creditos);
        return await this.disciplinaRepository.save(disciplina);
    }

    async deleteDisciplina(id) {
        const disciplina = await this.disciplinaRepository.findBy(id);
        if (!disciplina) {
            throw new Error('Disciplina não encontrada');
        }
        const deleted = await this.disciplinaRepository.delete(id);
        if (!deleted) {
            throw new Error('Erro ao deletar disciplina');
        }
        return true;
    }

    async putDisciplina(id, disciplinaData) {
        const disciplina = new Disciplina(id, disciplinaData.codigo, disciplinaData.nome, disciplinaData.creditos);
        const updatedDisciplina = await this.disciplinaRepository.update(id, disciplina);
        if (!updatedDisciplina) {
            throw new Error('Disciplina não encontrada');
        }
        return updatedDisciplina;
    }
}

module.exports = DisciplinaService;
