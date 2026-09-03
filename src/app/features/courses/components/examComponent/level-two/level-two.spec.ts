import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LevelTwo } from './level-two';

describe('LevelTwo', () => {
  let component: LevelTwo;
  let fixture: ComponentFixture<LevelTwo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LevelTwo]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LevelTwo);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
