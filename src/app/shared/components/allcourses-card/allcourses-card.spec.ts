import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllcoursesCard } from './allcourses-card';

describe('AllcoursesCard', () => {
  let component: AllcoursesCard;
  let fixture: ComponentFixture<AllcoursesCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllcoursesCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllcoursesCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
