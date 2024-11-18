import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventdetailAdminComponent } from './eventdetail-admin.component';

describe('EventdetailAdminComponent', () => {
  let component: EventdetailAdminComponent;
  let fixture: ComponentFixture<EventdetailAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventdetailAdminComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EventdetailAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
