import {IStudent, IUser} from 'e2xgrader-exam-review-backend';

export function getUserDisplayName(user: IUser | IStudent): string {
  return `${user.firstname} ${user.lastname}`;
}
