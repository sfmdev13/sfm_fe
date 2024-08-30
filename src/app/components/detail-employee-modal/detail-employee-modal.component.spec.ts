import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailEmployeeModalComponent } from './detail-employee-modal.component';

describe('DetailEmployeeModalComponent', () => {
  let component: DetailEmployeeModalComponent;
  let fixture: ComponentFixture<DetailEmployeeModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailEmployeeModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailEmployeeModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
