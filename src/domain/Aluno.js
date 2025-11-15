// src/domain/Aluno.js

class Aluno {
  constructor(id, ra, usuarioId) {
    this.id = id;
    this.ra = ra;
    this.usuarioId = usuarioId;
  }

  static criar(raw) {
    return new Aluno(
      raw.id,
      raw.ra,
      raw.usuario_id
    );
  }

  toJSON() {
    return {
      id: this.id,
      ra: this.ra,
      usuario_id: this.usuarioId
    };
  }
}

module.exports = Aluno;