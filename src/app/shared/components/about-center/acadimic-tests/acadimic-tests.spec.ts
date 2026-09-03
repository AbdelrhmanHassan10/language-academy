import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcadimicTests } from './acadimic-tests';

describe('AcadimicTests', () => {
  let component: AcadimicTests;
  let fixture: ComponentFixture<AcadimicTests>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AcadimicTests]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AcadimicTests);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
