import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AboutStatistics } from './about-statistics';

describe('AboutStatistics', () => {
  let component: AboutStatistics;
  let fixture: ComponentFixture<AboutStatistics>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AboutStatistics]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AboutStatistics);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
