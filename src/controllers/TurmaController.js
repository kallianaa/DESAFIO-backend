const TurmaService = require('../services/TurmaService');

class TurmaController {
  constructor() {
    this.turmaService = new TurmaService();
  }

  async getTurmas(req, res) {
    try {
      const turmas = await this.turmaService.listarTurmas(req.user);
      return res.json(turmas);
    } catch (error) {
      console.error(error);
      return res.status(403).json({ message: error.message });
    }
  }

  async getTurmaById(req, res) {
    try {
      const turma = await this.turmaService.getTurmaById(req.params.id, req.user);

      if (!turma) {
        return res.status(404).json({ message: 'Turma não encontrada' });
      }

      return res.json(turma);
    } catch (error) {
      console.error(error);
      return res.status(403).json({ message: error.message });
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

  listarAlunos = async (req, res) => {
    try {
      const alunos = await this.turmaService.listarAlunosDaTurma(req.params.id, req.user);
      return res.json(alunos);
    } catch (e) {
      return res.status(403).json({ message: e.message });
    }
  }
}

module.exports = TurmaController;