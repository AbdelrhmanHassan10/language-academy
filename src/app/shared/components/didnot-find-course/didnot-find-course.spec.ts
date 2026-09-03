import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DidnotFindCourse } from './didnot-find-course';

describe('DidnotFindCourse', () => {
  let component: DidnotFindCourse;
  let fixture: ComponentFixture<DidnotFindCourse>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DidnotFindCourse]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DidnotFindCourse);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
