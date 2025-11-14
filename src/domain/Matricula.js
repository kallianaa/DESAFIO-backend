// src/domain/Matricula.js
class Matricula {
    constructor(id, aluno_id, turma_id, data, status) {
        this.id = id;
        this.aluno_id = aluno_id;
        this.turma_id = turma_id;
        this.data = data;
        this.status = status;
    }
    // Mantém a consistência com os demais domínios
    // fornece represetação padronizada de uso nos controllers
    toJSON() {
        return {
            id: this.id,
            aluno_id: this.aluno_id,
            turma_id: this.turma_id,
            data: this.data,
            status: this.status
        };
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