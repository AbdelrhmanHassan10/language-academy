import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EgyptiansRegistration } from './egyptians-registration';

describe('EgyptiansRegistration', () => {
  let component: EgyptiansRegistration;
  let fixture: ComponentFixture<EgyptiansRegistration>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EgyptiansRegistration]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EgyptiansRegistration);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
