import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestRejectComponent } from './request-reject.component';

describe('RequestRejectComponent', () => {
  let component: RequestRejectComponent;
  let fixture: ComponentFixture<RequestRejectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RequestRejectComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RequestRejectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
