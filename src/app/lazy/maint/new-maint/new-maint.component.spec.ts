import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewMaintComponent } from './new-maint.component';

describe('NewMaintComponent', () => {
  let component: NewMaintComponent;
  let fixture: ComponentFixture<NewMaintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewMaintComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewMaintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
