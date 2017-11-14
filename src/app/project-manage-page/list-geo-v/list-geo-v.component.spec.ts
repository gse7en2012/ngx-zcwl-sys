import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListGeoVComponent } from './list-geo-v.component';

describe('ListGeoVComponent', () => {
  let component: ListGeoVComponent;
  let fixture: ComponentFixture<ListGeoVComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListGeoVComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListGeoVComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
