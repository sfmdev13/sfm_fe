import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailQuotationComponent } from './detail-quotation.component';

describe('DetailQuotationComponent', () => {
  let component: DetailQuotationComponent;
  let fixture: ComponentFixture<DetailQuotationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailQuotationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailQuotationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
