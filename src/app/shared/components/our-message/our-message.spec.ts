import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OurMessage } from './our-message';

describe('OurMessage', () => {
  let component: OurMessage;
  let fixture: ComponentFixture<OurMessage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OurMessage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OurMessage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
