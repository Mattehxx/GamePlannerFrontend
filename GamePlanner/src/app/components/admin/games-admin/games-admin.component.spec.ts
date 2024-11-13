import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GamesAdminComponent } from './games-admin.component';

describe('GamesAdminComponent', () => {
  let component: GamesAdminComponent;
  let fixture: ComponentFixture<GamesAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GamesAdminComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GamesAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
