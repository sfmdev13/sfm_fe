import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddRolesModalComponent } from './add-roles-modal.component';

describe('AddRolesModalComponent', () => {
  let component: AddRolesModalComponent;
  let fixture: ComponentFixture<AddRolesModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddRolesModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddRolesModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
