import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LearningLang } from './learning-lang';

describe('LearningLang', () => {
  let component: LearningLang;
  let fixture: ComponentFixture<LearningLang>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LearningLang]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LearningLang);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
