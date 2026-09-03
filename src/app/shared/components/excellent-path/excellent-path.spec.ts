import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExcellentPath } from './excellent-path';

describe('ExcellentPath', () => {
  let component: ExcellentPath;
  let fixture: ComponentFixture<ExcellentPath>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExcellentPath]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExcellentPath);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
