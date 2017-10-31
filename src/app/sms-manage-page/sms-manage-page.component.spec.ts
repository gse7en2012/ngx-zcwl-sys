import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SmsManagePageComponent } from './sms-manage-page.component';

describe('SmsManagePageComponent', () => {
  let component: SmsManagePageComponent;
  let fixture: ComponentFixture<SmsManagePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SmsManagePageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SmsManagePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
