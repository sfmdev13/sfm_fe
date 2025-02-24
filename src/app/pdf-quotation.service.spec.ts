import { TestBed } from '@angular/core/testing';

import { PdfQuotationService } from './pdf-quotation.service';

describe('PdfQuotationService', () => {
  let service: PdfQuotationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PdfQuotationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
