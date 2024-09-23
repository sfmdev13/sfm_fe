import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteDivisionComponent } from './delete-division.component';

describe('DeleteDivisionComponent', () => {
  let component: DeleteDivisionComponent;
  let fixture: ComponentFixture<DeleteDivisionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeleteDivisionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteDivisionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
