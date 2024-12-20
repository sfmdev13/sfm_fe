import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailStackComponent } from './detail-stack.component';

describe('DetailStackComponent', () => {
  let component: DetailStackComponent;
  let fixture: ComponentFixture<DetailStackComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailStackComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailStackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
