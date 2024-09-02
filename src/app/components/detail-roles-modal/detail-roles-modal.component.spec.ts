import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailRolesModalComponent } from './detail-roles-modal.component';

describe('DetailRolesModalComponent', () => {
  let component: DetailRolesModalComponent;
  let fixture: ComponentFixture<DetailRolesModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailRolesModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailRolesModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
