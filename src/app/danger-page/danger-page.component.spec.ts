import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DangerPageComponent } from './danger-page.component';

describe('DangerPageComponent', () => {
  let component: DangerPageComponent;
  let fixture: ComponentFixture<DangerPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DangerPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DangerPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
