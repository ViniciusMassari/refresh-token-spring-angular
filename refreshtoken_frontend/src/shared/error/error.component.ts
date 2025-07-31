import { CommonModule } from '@angular/common';
import { Component, input, InputSignal } from '@angular/core';
import { AbstractControl, FormControl } from '@angular/forms';
interface ErrorMessagesOptions {
  fieldName: string;
  validatorName: string;
  validatorValue?: any;
}
@Component({
  selector: 'app-error-msg',
  standalone: true,
  templateUrl: './error.component.html',
  imports: [CommonModule],
})
export class ErrorMsgComponent {
  nomeCampo: InputSignal<string> = input.required();

  control: InputSignal<AbstractControl<any, any> | null> = input.required();

  get errorMessage() {
    for (const propertyName in this.control()?.errors) {
      if (
        this.control()?.errors?.hasOwnProperty(propertyName) &&
        this.control()?.touched
      ) {
        return this.getErrorMsg({
          fieldName: this.nomeCampo(),
          validatorName: propertyName,
          validatorValue: this.control()?.errors?.[propertyName],
        });
      }
    }
    return null;
  }

  getErrorMsg(options: ErrorMessagesOptions) {
    const config: { [key: string]: string } = {
      required: `${options.fieldName} é obrigatório`,
      minlength: `${options.fieldName} precisa ter no mínimo ${options?.validatorValue.requiredLength} caracteres`,
      maxlength: `${options.fieldName} precisa ter no máximoo ${options?.validatorValue.requiredLength} caracteres`,
      equalsTo: 'Campos não coincidem',
      patternMismatch: `${options.fieldName} contém erros, verifique se está seguindo o padrão estabelecido`,
      email: `O campo precisa ser um e-mail válido`,
    };

    return config[options.validatorName];
  }
}
