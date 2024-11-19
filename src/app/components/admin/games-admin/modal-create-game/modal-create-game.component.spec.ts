import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalCreateGameComponent } from './modal-create-game.component';

describe('ModalCreateGameComponent', () => {
  let component: ModalCreateGameComponent;
  let fixture: ComponentFixture<ModalCreateGameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalCreateGameComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalCreateGameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
