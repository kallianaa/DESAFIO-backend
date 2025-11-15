const DisciplinaService = require('../services/DisciplinaService');

class DisciplinaController {
    constructor() {
        this.disciplinaService = new DisciplinaService();
    }

    async deleteDisciplina(req, res) {
        try {
            await this.disciplinaService.deleteDisciplina(req.params.id);
            res.status(204).send();
        } catch (error) {
            if (error.message === 'Disciplina não encontrada') {
                res.status(404).json({ message: error.message });
            } else {
                res.status(500).json({ message: error.message });
            }
        }
    }

    async getDisciplinas(req, res) {
        try {
            const disciplinas = await this.disciplinaService.listarDisciplinas();
            res.json(disciplinas);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async postDisciplina(req, res) {
        try {
            const disciplina = await this.disciplinaService.criarDisciplina(req.body);
            res.status(201).json(disciplina);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    async putDisciplina(req, res) {
        try {
            const disciplina = await this.disciplinaService.putDisciplina(req.params.id, req.body);
            res.json(disciplina);
        } catch (error) {
            if (error.message === 'Disciplina não encontrada') {
                res.status(404).json({ message: error.message });
            } else {
                res.status(400).json({ message: error.message });
            }
        }
    }
}

module.exports = DisciplinaController;
