import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WarningPageComponent } from './warning-page.component';

describe('WarningPageComponent', () => {
  let component: WarningPageComponent;
  let fixture: ComponentFixture<WarningPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WarningPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WarningPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
