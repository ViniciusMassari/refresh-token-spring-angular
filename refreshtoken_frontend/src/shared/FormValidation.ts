import {
  AbstractControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';

export class FormValidation {
  static equalsTo(otherField: string): ValidatorFn {
    const validator: ValidatorFn = (formControl: AbstractControl) => {
      // otherField precisa ser passado
      if (otherField == null) {
        throw new Error('É necessário informar um campo');
      }
      // Verifica se o formulário e controls estão prontos
      if (!formControl.root || !(<FormGroup>formControl.root).controls) {
        return null;
      }

      const field = (<FormGroup>formControl.root).get(otherField);

      if (!field) {
        throw new Error('É necessário informar um campo válido');
      }
      const validationErrors: ValidationErrors = {
        equalsTo: otherField,
      };

      return <string>field.value !== <string>formControl.value
        ? validationErrors
        : null;
    };

    return validator;
  }
}
