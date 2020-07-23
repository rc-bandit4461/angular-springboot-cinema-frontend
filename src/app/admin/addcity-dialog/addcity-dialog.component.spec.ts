import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddcityDialogComponent } from './addcity-dialog.component';

describe('AddcityDialogComponent', () => {
  let component: AddcityDialogComponent;
  let fixture: ComponentFixture<AddcityDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddcityDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddcityDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
