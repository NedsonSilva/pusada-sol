/* eslint-disable @typescript-eslint/naming-convention */
import { NgControl } from '@angular/forms';

export const getErrorMessages = (c: NgControl) => {
  if (!c) return null;
  for(const key in c.errors) {
    return formControlErrorMessages(key, c.errors[key]);
  }

  return null;
};

export const formControlErrorMessages = (errorKey: string, value?: any): string => {
    const errorMessages = {
      'required': 'Obrigatório',
      'email': 'Digite um endereço de email válido',
      'email_cadastrado': 'Este e-mail já está cadastrado',
      'invalidPassword': 'Senha não atende aos requisitos mínimos.',
      'minlength': `Mínimo ${value?.requiredLength}`,
      'maxlength': `Máximo ${value.requiredLength}`,
      'min': `Mínimo ${value?.min}`,
      'max': `Máximo ${value?.max}`,
      'prazo_invalido': 'O prazo deve ser único',
      'cpf': 'Digite um CPF válido',
      'cpf_cadastrado': 'Este CPF já está cadastrado',
      'cnpj': 'Digite um CNPJ válido',
      'cnpj_cadastrado': 'Este CNPJ já está Cadastrado',
      'mustMatch': 'Senhas não conferem',
      'numero_telefone': 'Número de telefone inválido',
      'numero_celular': 'Número de celular inválido',
      'numero_celular_cadastrado': 'Este celular já está cadastrado',
      'senha_nome' : 'A senha não deve conter o nome do usuário',
      'senha_numero' : 'A senha deve conter pelo menos um número',
      'senha_letra' : 'A senha deve conter pelo menos uma letra',
      'senha_igual' : 'A senha nova não pode ser igual a senha atual',
      'senha_sequencia' : 'A senha não deve conter numeros sequenciais como 123, 321, 1234, 789, etc.',
      'numero_beneficio_inss' : 'Nº Benefício inválido',
      'validateData': 'Data inválida',
      'idade_maxima': `Idade máxima: ${value}`,
      'cpf_cadastrado_consignado': 'CPF já simulado, aguarde contato',
      'cep': 'Cep inválido',
      'numeroBeneficioInss': 'Nº Benefício inválido',
      'waName': 'O nome deve conter apenas letras minúsculas, números ou _ (underline)',
      'minOneItemArray': 'Selecione pelo menos uma opção'
    };
    return errorMessages[errorKey];
};
