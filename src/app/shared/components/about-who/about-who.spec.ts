import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AboutWho } from './about-who';

describe('AboutWho', () => {
  let component: AboutWho;
  let fixture: ComponentFixture<AboutWho>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AboutWho]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AboutWho);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
