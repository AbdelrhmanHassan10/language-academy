import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Allcourses } from './allcourses';

describe('Allcourses', () => {
  let component: Allcourses;
  let fixture: ComponentFixture<Allcourses>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Allcourses]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Allcourses);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
