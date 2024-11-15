import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalCreateUserComponent } from './modal-create-user.component';

describe('ModalCreateUserComponent', () => {
  let component: ModalCreateUserComponent;
  let fixture: ComponentFixture<ModalCreateUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalCreateUserComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalCreateUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
