import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserSearchInput } from './user-search-input';

describe('UserSearchInput', () => {
  let component: UserSearchInput;
  let fixture: ComponentFixture<UserSearchInput>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserSearchInput],
    }).compileComponents();

    fixture = TestBed.createComponent(UserSearchInput);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
