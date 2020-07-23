import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifyCityDialogComponent } from './modify-city-dialog.component';

describe('ModifyCityDialogComponent', () => {
  let component: ModifyCityDialogComponent;
  let fixture: ComponentFixture<ModifyCityDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModifyCityDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModifyCityDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
