const TurmaService = require('../services/TurmaService');

class AlunoController {
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
}

module.exports = new AlunoController();