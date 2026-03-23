import {Component, inject} from '@angular/core';
import {ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR} from '@angular/forms';
import {IUser} from 'e2x-exam-review-backend';
import {ManagementService} from '../../../services/management-service/management-service';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  map,
  Observable,
  of,
  OperatorFunction,
  switchMap,
  tap
} from 'rxjs';
import {NgbTypeahead} from '@ng-bootstrap/ng-bootstrap';
import {getUserDisplayName} from '../../../utils/UserUtil';

@Component({
  selector: 'app-user-search-input',
  imports: [
    NgbTypeahead,
    FormsModule
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: UserSearchInput,
      multi: true
    }
  ],
  templateUrl: './user-search-input.html',
  styleUrl: './user-search-input.scss',
})
export class UserSearchInput implements ControlValueAccessor {
  private managementService: ManagementService = inject(ManagementService);

  protected currentValue: IUser | undefined;

  onChange: (value: IUser | undefined) => any = (value: IUser | undefined) => {};
  onTouched: () => any = () => {};

  registerOnChange(fn: (value: IUser | undefined) => any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => any): void {
    this.onTouched = fn;
  }

  writeValue(val: IUser | undefined): void {
    this.currentValue = val;
  }

  handleValueChange(): void{
    this.onChange(this.currentValue);
  }

  searchFailed: boolean = false;

  search: OperatorFunction<string, readonly IUser[]> = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      switchMap((term) =>
        this.managementService.searchUsers(term).pipe(
          tap(() => (this.searchFailed = false)),
          catchError(() => {
            this.searchFailed = true;
            return of([]);
          }),
        ),
      )
    );
  protected readonly getUserDisplayName = getUserDisplayName;
}
