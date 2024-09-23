import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailDivisionComponent } from './detail-division.component';

describe('DetailDivisionComponent', () => {
  let component: DetailDivisionComponent;
  let fixture: ComponentFixture<DetailDivisionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailDivisionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailDivisionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
