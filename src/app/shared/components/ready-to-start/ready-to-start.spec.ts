import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReadyToStart } from './ready-to-start';

describe('ReadyToStart', () => {
  let component: ReadyToStart;
  let fixture: ComponentFixture<ReadyToStart>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReadyToStart]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReadyToStart);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
