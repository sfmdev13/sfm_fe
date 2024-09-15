import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ErrorFormModalComponent } from './error-form-modal.component';

describe('ErrorFormModalComponent', () => {
  let component: ErrorFormModalComponent;
  let fixture: ComponentFixture<ErrorFormModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ErrorFormModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ErrorFormModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
