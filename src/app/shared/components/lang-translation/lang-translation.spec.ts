import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LangTranslation } from './lang-translation';

describe('LangTranslation', () => {
  let component: LangTranslation;
  let fixture: ComponentFixture<LangTranslation>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LangTranslation]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LangTranslation);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
