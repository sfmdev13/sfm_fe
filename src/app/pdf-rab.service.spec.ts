import { TestBed } from '@angular/core/testing';

import { PdfRabService } from './pdf-rab.service';

describe('PdfRabService', () => {
  let service: PdfRabService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PdfRabService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
