class Role {
  constructor(nome) {
    if (!nome) throw new Error('Role inválida');
    this.nome = nome;
  }

  toString() {
    return this.nome;
  }
}

module.exports = Role;