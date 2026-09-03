import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LevelOne } from './level-one';

describe('LevelOne', () => {
  let component: LevelOne;
  let fixture: ComponentFixture<LevelOne>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LevelOne]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LevelOne);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
