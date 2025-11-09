class Horario {
    constructor(dia, turno, codigo) {
        this.dia = dia;
        this.turno = turno;
        this.codigo = codigo;

        // Validate constraints
        if (dia < 1 || dia > 7) {
            throw new Error('Dia deve estar entre 1 e 7');
        }
        if (turno < 1 || turno > 3) {
            throw new Error('Turno deve estar entre 1 e 3');
        }
    }

    static fromCodigo(codigo) {
        if (!codigo || typeof codigo !== 'string') {
            throw new Error('Código inválido');
        }

        // Expected format: "DxTy" where x is day (1-7) and y is shift (1-3)
        const match = codigo.match(/^D([1-7])T([1-3])$/);
        if (!match) {
            throw new Error('Formato de código inválido. Use o formato DxTy (ex: D1T1)');
        }

        const dia = parseInt(match[1]);
        const turno = parseInt(match[2]);

        return new Horario(dia, turno, codigo);
    }

    toJSON() {
        return {
            dia: this.dia,
            turno: this.turno,
            codigo: this.codigo
        };
    }
}

module.exports = Horario;