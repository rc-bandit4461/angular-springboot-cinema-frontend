import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SalleDialogComponent } from './salle-dialog.component';

describe('SalleDialogComponent', () => {
  let component: SalleDialogComponent;
  let fixture: ComponentFixture<SalleDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SalleDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SalleDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
