import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserModalsComponent } from './user-modals.component';

describe('UserModalsComponent', () => {
  let component: UserModalsComponent;
  let fixture: ComponentFixture<UserModalsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserModalsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserModalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
