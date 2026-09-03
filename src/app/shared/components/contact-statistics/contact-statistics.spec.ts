import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactStatistics } from './contact-statistics';

describe('ContactStatistics', () => {
  let component: ContactStatistics;
  let fixture: ComponentFixture<ContactStatistics>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContactStatistics]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContactStatistics);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
