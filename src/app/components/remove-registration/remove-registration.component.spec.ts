import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RemoveRegistrationComponent } from './remove-registration.component';

describe('RemoveRegistrationComponent', () => {
  let component: RemoveRegistrationComponent;
  let fixture: ComponentFixture<RemoveRegistrationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RemoveRegistrationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RemoveRegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
