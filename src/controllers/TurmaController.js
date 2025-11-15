const TurmaService = require('../services/TurmaService');

class TurmaController {
    constructor() {
        this.turmaService = new TurmaService();
    }

    async getTurmas(req, res) {
        try {
            const turmas = await this.turmaService.listarTurmas();
            return res.json(turmas);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: error.message });
        }
    }

    async postTurma(req, res) {
        try {
            const turma = await this.turmaService.criarTurma(req.body);
            return res.status(201).json(turma);
        } catch (error) {
            return res.status(400).json({ message: error.message });
        }
    }

    async putTurma(req, res) {
        try {
            const turma = await this.turmaService.putTurma(req.params.id, req.body);
            return res.json(turma);
        } catch (error) {
            if (error.message === 'Turma não encontrada') {
                return res.status(404).json({ message: error.message });
            }
            return res.status(400).json({ message: error.message });
        }
    }

    async deleteTurma(req, res) {
        try {
            await this.turmaService.deleteTurma(req.params.id);
            return res.status(204).send();
        } catch (error) {
            if (error.message === 'Turma não encontrada') {
                return res.status(404).json({ message: error.message });
            }
            return res.status(500).json({ message: error.message });
        }
    }
}

module.exports = TurmaController;