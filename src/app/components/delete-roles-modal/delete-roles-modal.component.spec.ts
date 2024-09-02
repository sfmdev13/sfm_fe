import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteRolesModalComponent } from './delete-roles-modal.component';

describe('DeleteRolesModalComponent', () => {
  let component: DeleteRolesModalComponent;
  let fixture: ComponentFixture<DeleteRolesModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeleteRolesModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteRolesModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
