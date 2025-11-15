class Disciplina {
    constructor(id, codigo, nome, creditos) {
        this.id = id;
        this.codigo = codigo;
        this.nome = nome;
        this.creditos = creditos;
    }

    static criar(disciplinaDTO) {
        return new Disciplina(
            disciplinaDTO.id,
            disciplinaDTO.codigo,
            disciplinaDTO.nome,
            disciplinaDTO.creditos
        );
    }

    toJSON() {
        return {
            id: this.id,
            codigo: this.codigo,
            nome: this.nome,
            creditos: this.creditos
        };
    }
}

module.exports = Disciplina;
