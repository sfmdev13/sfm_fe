import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailStackQuotationComponent } from './detail-stack-quotation.component';

describe('DetailStackQuotationComponent', () => {
  let component: DetailStackQuotationComponent;
  let fixture: ComponentFixture<DetailStackQuotationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailStackQuotationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailStackQuotationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
