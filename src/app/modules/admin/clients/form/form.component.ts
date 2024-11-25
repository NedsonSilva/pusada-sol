import { Component, Inject, Injector, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBase } from 'app/models/base/form.base';
import { CepService, ICity } from 'app/services/cep.service';
import { ClientService } from 'app/services/clients/client.service';
import { Client } from 'app/services/clients/clients.types';
import { states } from 'app/shared/utils/states';
import { CustomValidators } from 'app/shared/validators/custom-validators';
import { Observable } from 'rxjs';

interface DialogData {
    client: Client;
}

@Component({
    templateUrl: './form.component.html',
    styleUrl: './form.component.scss',
})
export class ClientFormComponent extends FormBase implements OnInit {
    form = this.buildForm();
    cities$: Observable<ICity[]>;
    readonly states = states;


    constructor(
        @Inject(MAT_DIALOG_DATA)
        public data: DialogData,
        private dialogRef: MatDialogRef<ClientFormComponent>,
        protected injector: Injector,
        private service: ClientService,
        private cepService: CepService
    ) {
        super(injector);
    }

    ngOnInit(): void {
        const client = this.data?.client
        if (client?.id) {
            this.form.patchValue({
                ...this.data.client,
            });

            if (client.addressZipCode) {
                this.getCityByUf(client.addressState);
            }
        }
    }

    protected buildForm() {
        return this.fb.group({
            id: [null as number],
            name: ['', [Validators.required]],
            phone: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            cpfCnpj: ['', [Validators.required, CustomValidators.cpfCnpj]],
            birthDate: ['', [Validators.required]],
            addressZipCode: ['', [CustomValidators.cep]],
            addressCity: '',
            addressState: '',
            addressNeighborhood: '',
            addressStreet: '',
            addressNumber: '',
            addressComplement: '',
        });
    }

    submitForm(): void {
        if (this.isNotSubmit()) return;

        const formData = this.form.getRawValue();

        this.form.disable();

        if (formData.id) {
            this.service.update(formData.id, formData).subscribe({
                next: () => {
                    this.dialogRef.close();
                    this.actionsSuccess();
                },
                error: () => {
                    this.form.enable();
                },
            });
        } else {
            this.service.create(formData as any).subscribe({
                next: () => {
                    this.dialogRef.close();
                    this.actionsSuccess();
                },
                error: () => {
                    this.form.enable();
                },
            });
        }
    }

    getCep() {
        const formControl = this.form.get('addressZipCode');

        if (formControl.invalid || !formControl.value) return;

        formControl.disable();

        this.cepService.getCep(formControl.value).subscribe({
            next: (res) => {
                formControl.enable()
                this.getCityByUf(res.uf);
                this.form.patchValue({
                    addressStreet: res.logradouro,
                    addressCity: res.localidade,
                    addressNeighborhood: res.bairro,
                    addressComplement: res.complemento,
                    addressState: res.uf,
                });
                this.form.updateValueAndValidity()
            },
            error: () => {
                formControl.enable()
            }
        });
    }

    getCityByUf(uf: string) {
        this.form.get('addressCity').enable();
        this.cities$ = this.cepService.getCities(uf);
    }
}
