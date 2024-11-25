import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

interface Icep {
    bairro: string;
    cep: string;
    complemento: string;
    ddd: string;
    gia: string;
    ibge: string;
    localidade: string;
    logradouro: string;
    siafi: string;
    uf: string;
}

export interface ICity {
    id: number;
    nome: string;
}

export interface IUf {
    uf: string;
    name: string;
}

@Injectable({
    providedIn: 'root',
})
export class CepService {
    constructor(private http: HttpClient) {}

    getCep = (cep: string) => {
        const _cep = cep?.replace(/\D/g, '');
        return this.http.get<Icep>(`https://viacep.com.br/ws/${_cep}/json`);
    };

    getUfs(): Observable<IUf[]> {
        return this.http.get<IUf[]>('assets/utils/states.json');
    }

    getCities(uf: string = null): Observable<ICity[]> {
        const url = uf
            ? `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/municipios`
            : 'https://servicodados.ibge.gov.br/api/v1/localidades/municipios';
        return this.http.get<ICity[]>(url);
    }
}
