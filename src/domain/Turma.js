class Turma {
    constructor(id, codigo, disciplinaId, professorId, vagas, dia, turno) {
        this.id = id;
        this.codigo = codigo;
        this.disciplinaId = disciplinaId;
        this.professorId = professorId;
        this.vagas = vagas;
        this.dia = dia;
        this.turno = turno;

        // Validate constraints from database
        if (dia && (dia < 1 || dia > 7)) {
            throw new Error('Dia deve estar entre 1 e 7');
        }
        if (turno && (turno < 1 || turno > 3)) {
            throw new Error('Turno deve estar entre 1 e 3');
        }
    }

    static criar(turmaDTO) {
        return new Turma(
            turmaDTO.id,
            turmaDTO.codigo,
            turmaDTO.disciplina_id,
            turmaDTO.professor_id,
            turmaDTO.vagas,
            turmaDTO.dia,
            turmaDTO.turno
        );
    }

    toJSON() {
        return {
            id: this.id,
            codigo: this.codigo,
            disciplina_id: this.disciplinaId,
            professor_id: this.professorId,
            vagas: this.vagas,
            dia: this.dia,
            turno: this.turno
        };
    }
}

module.exports = Turma;