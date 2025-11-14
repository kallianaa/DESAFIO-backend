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
        const codigoHorario = `D${turmaDTO.dia}T${turmaDTO.turno}`;
        const horario = Horario.fromCodigo(codigoHorario);
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
            horario: {
                dia: this.horario.dia,
                turno: this.horario.turno,
                codigo: this.horario.codigo
            }
        };
    }
}

module.exports = Turma;