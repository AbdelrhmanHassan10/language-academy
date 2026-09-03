import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WhyOurServices } from './why-our-services';

describe('WhyOurServices', () => {
  let component: WhyOurServices;
  let fixture: ComponentFixture<WhyOurServices>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WhyOurServices]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WhyOurServices);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
