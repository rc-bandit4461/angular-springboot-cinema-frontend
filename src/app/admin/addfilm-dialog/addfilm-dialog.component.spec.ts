import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddfilmDialogComponent } from './addfilm-dialog.component';

describe('AddfilmDialogComponent', () => {
  let component: AddfilmDialogComponent;
  let fixture: ComponentFixture<AddfilmDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddfilmDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddfilmDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
