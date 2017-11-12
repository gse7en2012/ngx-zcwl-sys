import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectGeoComponent } from './project-geo.component';

describe('ProjectGeoComponent', () => {
  let component: ProjectGeoComponent;
  let fixture: ComponentFixture<ProjectGeoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectGeoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectGeoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
