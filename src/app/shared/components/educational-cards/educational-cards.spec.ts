import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EducationalCards } from './educational-cards';

describe('EducationalCards', () => {
  let component: EducationalCards;
  let fixture: ComponentFixture<EducationalCards>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EducationalCards]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EducationalCards);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
