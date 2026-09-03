import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TranslateService } from './translate-service';

describe('TranslateService', () => {
  let component: TranslateService;
  let fixture: ComponentFixture<TranslateService>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TranslateService]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TranslateService);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
