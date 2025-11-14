// src/domain/Professor.js

class Professor {
  constructor(id, siape, usuarioId) {
    this.id = id;
    this.siape = siape;
    this.usuarioId = usuarioId;
  }

  static criar(raw) {
    return new Professor(
      raw.id,
      raw.siape,
      raw.usuario_id
    );
  }

  toJSON() {
    return {
      id: this.id,
      siape: this.siape,
      usuario_id: this.usuarioId
    };
  }
}

module.exports = Professor;
