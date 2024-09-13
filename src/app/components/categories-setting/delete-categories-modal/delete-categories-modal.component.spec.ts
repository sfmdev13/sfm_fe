import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteCategoriesModalComponent } from './delete-categories-modal.component';

describe('DeleteCategoriesModalComponent', () => {
  let component: DeleteCategoriesModalComponent;
  let fixture: ComponentFixture<DeleteCategoriesModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeleteCategoriesModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteCategoriesModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
