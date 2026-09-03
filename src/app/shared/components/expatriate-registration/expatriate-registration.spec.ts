import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpatriateRegistration } from './expatriate-registration';

describe('ExpatriateRegistration', () => {
  let component: ExpatriateRegistration;
  let fixture: ComponentFixture<ExpatriateRegistration>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExpatriateRegistration]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExpatriateRegistration);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
