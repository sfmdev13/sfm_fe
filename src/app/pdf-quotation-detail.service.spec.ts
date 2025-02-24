import { TestBed } from '@angular/core/testing';

import { PdfQuotationDetailService } from './pdf-quotation-detail.service';

describe('PdfQuotationDetailService', () => {
  let service: PdfQuotationDetailService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PdfQuotationDetailService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
