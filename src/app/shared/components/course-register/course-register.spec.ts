import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseRegister } from './course-register';

describe('CourseRegister', () => {
  let component: CourseRegister;
  let fixture: ComponentFixture<CourseRegister>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CourseRegister]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CourseRegister);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
