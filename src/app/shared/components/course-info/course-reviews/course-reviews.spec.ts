import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseReviews } from './course-reviews';

describe('CourseReviews', () => {
  let component: CourseReviews;
  let fixture: ComponentFixture<CourseReviews>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CourseReviews]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CourseReviews);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
