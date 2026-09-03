import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LevelThree } from './level-three';

describe('LevelThree', () => {
  let component: LevelThree;
  let fixture: ComponentFixture<LevelThree>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LevelThree]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LevelThree);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
