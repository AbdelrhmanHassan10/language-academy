import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CertificationSection } from './certification-section';

describe('CertificationSection', () => {
  let component: CertificationSection;
  let fixture: ComponentFixture<CertificationSection>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CertificationSection]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CertificationSection);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
