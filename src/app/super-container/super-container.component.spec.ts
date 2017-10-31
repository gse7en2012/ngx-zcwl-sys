import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SuperContainerComponent } from './super-container.component';

describe('SuperContainerComponent', () => {
  let component: SuperContainerComponent;
  let fixture: ComponentFixture<SuperContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SuperContainerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SuperContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
