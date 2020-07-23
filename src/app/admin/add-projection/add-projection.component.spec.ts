import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddProjectionComponent } from './add-projection.component';

describe('AddProjectionComponent', () => {
  let component: AddProjectionComponent;
  let fixture: ComponentFixture<AddProjectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddProjectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddProjectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
