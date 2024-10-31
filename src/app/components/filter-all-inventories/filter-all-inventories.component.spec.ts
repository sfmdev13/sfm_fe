import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterAllInventoriesComponent } from './filter-all-inventories.component';

describe('FilterAllInventoriesComponent', () => {
  let component: FilterAllInventoriesComponent;
  let fixture: ComponentFixture<FilterAllInventoriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FilterAllInventoriesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterAllInventoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
