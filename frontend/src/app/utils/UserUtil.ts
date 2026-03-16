import {IUser} from 'e2xgrader-exam-review-backend';

export function getUserDisplayName(user: IUser): string {
  return `${user.firstname} ${user.lastname}`;
}
