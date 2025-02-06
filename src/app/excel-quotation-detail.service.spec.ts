import { TestBed } from '@angular/core/testing';

import { ExcelQuotationDetailService } from './excel-quotation-detail.service';

describe('ExcelQuotationDetailService', () => {
  let service: ExcelQuotationDetailService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExcelQuotationDetailService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
