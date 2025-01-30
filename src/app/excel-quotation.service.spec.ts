import { TestBed } from '@angular/core/testing';

import { ExcelQuotationService } from './excel-quotation.service';

describe('ExcelQuotationService', () => {
  let service: ExcelQuotationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExcelQuotationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
