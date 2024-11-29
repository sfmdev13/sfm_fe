import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuotationComparisonComponent } from './quotation-comparison.component';

describe('QuotationComparisonComponent', () => {
  let component: QuotationComparisonComponent;
  let fixture: ComponentFixture<QuotationComparisonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuotationComparisonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuotationComparisonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
