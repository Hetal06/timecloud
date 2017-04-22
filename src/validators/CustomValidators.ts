import { FormControl } from '@angular/forms';

interface ValidationResult {
	[key: string]: boolean;
}

export class CustomValidators {

	public static checkFirstCharacterValidator(control: FormControl): ValidationResult {
		var valid = /^\d/.test(control.value);
		if (valid) {
			return { checkFirstCharacterValidator: true };
		}
		return null;
	}
}