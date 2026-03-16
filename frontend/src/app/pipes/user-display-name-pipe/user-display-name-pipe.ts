import { Pipe, PipeTransform } from '@angular/core';
import {IUser} from 'e2xgrader-exam-review-backend';
import {getUserDisplayName} from '../../utils/UserUtil';

@Pipe({
  name: 'userDisplayName',
})
export class UserDisplayNamePipe implements PipeTransform {
  transform(value: IUser): string {
    return getUserDisplayName(value);
  }
}
