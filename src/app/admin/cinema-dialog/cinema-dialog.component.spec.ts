import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CinemaDialogComponent } from './cinema-dialog.component';

describe('CinemaDialogComponent', () => {
  let component: CinemaDialogComponent;
  let fixture: ComponentFixture<CinemaDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CinemaDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CinemaDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
