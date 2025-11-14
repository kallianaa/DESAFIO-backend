const TurmaService = require('../services/TurmaService');

class TurmaController {
    constructor() {
        this.turmaService = new TurmaService();
    }
    async listarOfertas(req, res) {
    try {
      const ofertas = await this.turmaService.listarTurmas();
      return res.json(ofertas);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'Erro ao buscar ofertas.' });
    }
  }
    async deleteTurma(req, res) {
        try {
            await this.turmaService.deleteTurma(req.params.id);
            res.status(204).send();
        } catch (error) {
            if (error.message === 'Turma não encontrada') {
                res.status(404).json({ message: error.message });
            } else {
                res.status(500).json({ message: error.message });
            }
        }
    }

    async getTurmas(req, res) {
        try {
            const turmas = await this.turmaService.listarTurmas();
            res.json(turmas);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async postTurma(req, res) {
        try {
            const turma = await this.turmaService.criarTurma(req.body);
            res.status(201).json(turma);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    async putTurma(req, res) {
        try {
            const turma = await this.turmaService.putTurma(req.params.id, req.body);
            res.json(turma);
        } catch (error) {
            if (error.message === 'Turma não encontrada') {
                res.status(404).json({ message: error.message });
            } else {
                res.status(400).json({ message: error.message });
            }
        }
    }
}

module.exports = new TurmaController();