import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseInstructor } from './course-instructor';

describe('CourseInstructor', () => {
  let component: CourseInstructor;
  let fixture: ComponentFixture<CourseInstructor>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CourseInstructor]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CourseInstructor);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
