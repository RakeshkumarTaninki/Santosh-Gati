import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GAlistDetailsComponent } from './galist-details.component';

describe('GAlistDetailsComponent', () => {
  let component: GAlistDetailsComponent;
  let fixture: ComponentFixture<GAlistDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GAlistDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GAlistDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
