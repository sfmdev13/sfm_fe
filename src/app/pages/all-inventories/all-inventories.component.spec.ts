import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllInventoriesComponent } from './all-inventories.component';

describe('AllInventoriesComponent', () => {
  let component: AllInventoriesComponent;
  let fixture: ComponentFixture<AllInventoriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllInventoriesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AllInventoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
