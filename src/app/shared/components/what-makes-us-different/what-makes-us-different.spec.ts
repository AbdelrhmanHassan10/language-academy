import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WhatMakesUsDifferent } from './what-makes-us-different';

describe('WhatMakesUsDifferent', () => {
  let component: WhatMakesUsDifferent;
  let fixture: ComponentFixture<WhatMakesUsDifferent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WhatMakesUsDifferent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WhatMakesUsDifferent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
