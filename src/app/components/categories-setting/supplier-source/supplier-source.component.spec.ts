import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierSourceComponent } from './supplier-source.component';

describe('SupplierSourceComponent', () => {
  let component: SupplierSourceComponent;
  let fixture: ComponentFixture<SupplierSourceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SupplierSourceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SupplierSourceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
