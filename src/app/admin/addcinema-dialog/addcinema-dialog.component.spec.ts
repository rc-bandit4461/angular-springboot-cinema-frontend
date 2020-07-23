import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddcinemaDialogComponent } from './addcinema-dialog.component';

describe('AddcinemaDialogComponent', () => {
  let component: AddcinemaDialogComponent;
  let fixture: ComponentFixture<AddcinemaDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddcinemaDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddcinemaDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
