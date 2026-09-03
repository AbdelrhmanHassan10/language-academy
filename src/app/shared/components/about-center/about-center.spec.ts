import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AboutCenter } from './about-center';

describe('AboutCenter', () => {
  let component: AboutCenter;
  let fixture: ComponentFixture<AboutCenter>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AboutCenter]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AboutCenter);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
