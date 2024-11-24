import { NgxCurrencyConfig } from "ngx-currency";

export const textMasks = {
    celular: '(00) 00000-0000',
    celularSemNonoDigito: '(00) 0000-0000',
    telefoneFixo: '(00) 0000-0000',
    telefone: '(00) 0000-0000||(00) 00000-0000',
    cpf: '000.000.000-00',
    cpfCnpj: '000.000.000-00||00.000.000/0000-00',
    cep: '00000-000',
    data: '00/00/0000',
    cnpj: '00.000.000/0000-00',
    nbInss: '000.000.000-0'
};


export const currencyMask: { [key: string]: Partial<NgxCurrencyConfig> } = {
    monetario: {
        prefix: 'R$ ',
        thousands: '.',
        decimal: ',',
        allowNegative: false,
        align: 'center',
    },
    porcentagem: {
        prefix: '',
        suffix: ' %',
        thousands: '.',
        decimal: ',',
        allowNegative: false,
        align: 'center',
    },
    km: {
        prefix: '',
        suffix: ' km',
        thousands: '.',
        decimal: ',',
        allowNegative: false,
        align: 'center',
    },
};
