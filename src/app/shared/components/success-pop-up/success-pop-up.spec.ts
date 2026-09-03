import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuccessPopUp } from './success-pop-up';

describe('SuccessPopUp', () => {
  let component: SuccessPopUp;
  let fixture: ComponentFixture<SuccessPopUp>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SuccessPopUp]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SuccessPopUp);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
