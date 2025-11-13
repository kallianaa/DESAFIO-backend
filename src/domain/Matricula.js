// src/domain/Matricula.js
class Matricula {
    constructor(id, aluno_id, turma_id, data, status) {
        this.id = id;
        this.aluno_id = aluno_id;
        this.turma_id = turma_id;
        this.data = data;
        this.status = status;
    }

    static criar(row) {
        if (!row) return null;
        return new Matricula(
            row.id,
            row.aluno_id,
            row.turma_id,
            row.data,
            row.status
        );
    }

    // Mantém a consistência com os demais modelos de domínio e
    // fornece uma representação padronizada para uso nos controllers.
    toJSON() {
        return {
            id: this.id,
            aluno_id: this.aluno_id,
            turma_id: this.turma_id,
            data: this.data,
            status: this.status
        };
    }
}

module.exports = Matricula;