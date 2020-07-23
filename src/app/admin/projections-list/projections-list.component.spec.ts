import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectionsListComponent } from './projections-list.component';

describe('ProjectionsListComponent', () => {
  let component: ProjectionsListComponent;
  let fixture: ComponentFixture<ProjectionsListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectionsListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectionsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
