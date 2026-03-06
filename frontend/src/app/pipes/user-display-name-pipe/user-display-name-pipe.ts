import { Pipe, PipeTransform } from '@angular/core';
import {User} from 'e2xgrader-review-backend';

@Pipe({
  name: 'userDisplayName',
})
export class UserDisplayNamePipe implements PipeTransform {
  transform(value: User): unknown {
    return value.firstname + ' ' + value.lastname;
  }
}
