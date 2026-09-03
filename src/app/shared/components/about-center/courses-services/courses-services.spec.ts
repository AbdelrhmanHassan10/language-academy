import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoursesServices } from './courses-services';

describe('CoursesServices', () => {
  let component: CoursesServices;
  let fixture: ComponentFixture<CoursesServices>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CoursesServices]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CoursesServices);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
