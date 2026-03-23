import { Pipe, PipeTransform } from '@angular/core';
import {IStudent, IUser} from 'e2x-exam-review-backend';
import {getUserDisplayName} from '../../utils/UserUtil';

@Pipe({
  name: 'userDisplayName',
})
export class UserDisplayNamePipe implements PipeTransform {
  transform(value: IUser | IStudent): string {
    if(!value.firstname || !value.lastname) return '';
    return getUserDisplayName(value);
  }
}
