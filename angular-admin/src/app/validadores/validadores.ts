import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function validadorSedeRegex(): ValidatorFn {
    const patronSede = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{3,40}$/;

    return (control: AbstractControl): ValidationErrors | null => {
        const valor = control.value;

        if (!valor || valor.trim() === '') {
            return null;
        }

        const esValido = patronSede.test(valor.trim());

        return esValido ? null : { sedeInvalida: true };
    };
}