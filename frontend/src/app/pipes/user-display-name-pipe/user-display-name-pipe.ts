import { Pipe, PipeTransform } from '@angular/core';
import {IUser} from 'e2xgrader-review-backend';

@Pipe({
  name: 'userDisplayName',
})
export class UserDisplayNamePipe implements PipeTransform {
  transform(value: IUser): unknown {
    return value.firstname + ' ' + value.lastname;
  }
}
