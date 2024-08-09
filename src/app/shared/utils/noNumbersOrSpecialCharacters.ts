import { FormControl } from "@angular/forms";

export function noNumbersOrSpecialCharacters(control: FormControl) {
    const regex = /^[a-zA-Z\s]*$/;
    if (!regex.test(control.value)) {
        return { containsNumbersOrSpecialCharacters: true };
    }
    return null;
}