const Horario = require('./Horario');

class Turma {
    constructor(id, codigo, disciplinaId, professorId, vagas, horario) {
        this.id = id;
        this.codigo = codigo;
        this.disciplinaId = disciplinaId;
        this.professorId = professorId;
        this.vagas = vagas;
        this.horario = horario;
    }

    static criar(turmaDTO) {
        const horario = Horario.fromCodigo(turmaDTO.horario_codigo);
        return new Turma(
            turmaDTO.id,
            turmaDTO.codigo,
            turmaDTO.disciplina_id,
            turmaDTO.professor_id,
            turmaDTO.vagas,
            horario
        );
    }

    toJSON() {
        return {
            id: this.id,
            codigo: this.codigo,
            disciplina_id: this.disciplinaId,
            professor_id: this.professorId,
            vagas: this.vagas,
            horario: this.horario.toJSON()
        };
    }
}

module.exports = Turma;