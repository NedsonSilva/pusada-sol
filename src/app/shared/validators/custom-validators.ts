import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export class CustomValidators {
    static cpf(c: AbstractControl<string>) {
        if (!c.value) {
            return;
        }
        const cpf = c.value.replace(/\D/g, '');
        return isCpf(cpf) ? null : { cpf: true };
    }

    static cnpj(c: AbstractControl) {
        if (!c.value) {
            return;
        }
        const cnpj = c.value?.replace(/\D/g, '');
        return isCnpj(cnpj) ? null : { cnpj: true };
    }

    static cpfCnpj(c: AbstractControl) {
        if (!c.value) return;
        const value = c.value.replace(/\D/g, '');
        const valueLength = value?.length;

        if (value?.length <= 11) {
            return isCpf(value) ? null : { cpf: true };
        } else if (valueLength > 11) {
            return isCnpj(value) ? null : { cnpj: true };
        }
    }

    static cep(c: AbstractControl) {
        if (!c.value) {
            return;
        }
        const cep: string = c.value.replace(/\D/g, '');
        const validateCep = /^[0-9]{8}$/;
        if (!cep) {
            return null;
        }
        return validateCep.test(cep) ? null : { cep: true };
    }

    static date(c: AbstractControl) {
        if (!c.value) return;
        const dateRegex =
            /^(0[1-9]|[12][0-9]|3[01])[\/](0[1-9]|1[012])[\/](19|20)\d\d$/;
        if (!dateRegex.test(c.value)) return { invalidDate: true };
        return null;
    }

    static mustMatch(
        controlPath: string,
        matchingControlPath: string,
    ): ValidatorFn {
        return (formGroup: AbstractControl): ValidationErrors | null => {
            const control = formGroup.get(controlPath);
            const matchingControl = formGroup.get(matchingControlPath);

            if (!control || !matchingControl) {
                return null;
            }

            if (matchingControl.hasError('mustMatch')) {
                delete matchingControl.errors['mustMatch'];
                matchingControl.updateValueAndValidity();
            }

            if (
                this.isEmptyInputValue(matchingControl.value) ||
                control.value === matchingControl.value
            ) {
                return null;
            }

            const errors = { mustMatch: true };

            matchingControl.setErrors(errors);

            return errors;
        };
    }

    static isEmptyInputValue(value: any): boolean {
        return value == null || value.length === 0;
    }
}

export const isCpf = (str: string): boolean => {
    const cpf = str;
    let numeros, digitos, soma, i, resultado, digitos_iguais;
    digitos_iguais = 1;

    if (cpf.length < 11) return false;

    for (i = 0; i < cpf.length - 1; i++)
        if (cpf.charAt(i) != cpf.charAt(i + 1)) {
            digitos_iguais = 0;
            break;
        }

    if (!digitos_iguais) {
        numeros = cpf.substring(0, 9);
        digitos = cpf.substring(9);
        soma = 0;

        for (i = 10; i > 1; i--) soma += numeros.charAt(10 - i) * i;

        resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);

        if (resultado != digitos.charAt(0)) return false;

        numeros = cpf.substring(0, 10);
        soma = 0;

        for (i = 11; i > 1; i--) soma += numeros.charAt(11 - i) * i;

        resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);

        if (resultado != digitos.charAt(1)) return false;

        return true;
    } else return false;
};

export const isCnpj = (str: string): boolean => {
    const cnpj = str;
    let numeros, digitos, soma, i, resultado, pos, tamanho, digitos_iguais;
    digitos_iguais = 1;

    if (cnpj.length < 14 && cnpj.length < 15) return false;

    for (i = 0; i < cnpj.length - 1; i++)
        if (cnpj.charAt(i) != cnpj.charAt(i + 1)) {
            digitos_iguais = 0;
            break;
        }
    if (!digitos_iguais) {
        tamanho = cnpj.length - 2;
        numeros = cnpj.substring(0, tamanho);
        digitos = cnpj.substring(tamanho);
        soma = 0;
        pos = tamanho - 7;
        for (i = tamanho; i >= 1; i--) {
            soma += numeros.charAt(tamanho - i) * pos--;
            if (pos < 2) pos = 9;
        }
        resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);

        if (resultado != digitos.charAt(0)) return false;
        tamanho = tamanho + 1;
        numeros = cnpj.substring(0, tamanho);
        soma = 0;
        pos = tamanho - 7;

        for (i = tamanho; i >= 1; i--) {
            soma += numeros.charAt(tamanho - i) * pos--;
            if (pos < 2) pos = 9;
        }

        resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);

        if (resultado != digitos.charAt(1)) return false;
        return true;
    } else return false;
};

