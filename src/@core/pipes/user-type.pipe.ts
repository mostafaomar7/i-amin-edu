import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'userType'
})
export class UserTypePipe implements PipeTransform {

    transform(userType: number): string {
        if (!userType) {
            return '';
        }
        switch (userType) {
            case 1: {
                return 'Admin';
            }
            case 2: {
                return 'Organization';
            }
            case 3: {
                return 'Instructor';
            }
            default: {
                return '';
            }
        }
    }
}
