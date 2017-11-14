import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListGeoComponent } from './list-geo.component';

describe('ListGeoComponent', () => {
  let component: ListGeoComponent;
  let fixture: ComponentFixture<ListGeoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListGeoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListGeoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
