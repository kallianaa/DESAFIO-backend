// src/domain/Turma.js
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

    static criar(row) {
        if (!row) return null;

        // Banco traz dia/turno → montamos o código aqui
        const dia = row.dia;
        const turno = row.turno;
        const codigoHorario = `D${dia}T${turno}`;
        const horario = new Horario(dia, turno, codigoHorario);

        return new Turma(
            row.id,
            row.codigo,
            row.disciplina_id,
            row.professor_id,
            row.vagas,
            horario
        );
    }

    vagasDisponíveis(alunosMatriculados){
        return this.vagas - alunosMatriculados;
    }

    toJSON() {
        return {
            id: this.id,
            codigo: this.codigo,
            disciplina_id: this.disciplinaId,
            professor_id: this.professorId,
            vagas: this.vagas,
            horario: this.horario.toJSON() // { dia, turno, codigo }
        };
    }
}

module.exports = Turma;