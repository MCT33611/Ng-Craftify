import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceCardTwoComponent } from './service-card-two.component';

describe('ServiceCardTwoComponent', () => {
  let component: ServiceCardTwoComponent;
  let fixture: ComponentFixture<ServiceCardTwoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServiceCardTwoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ServiceCardTwoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
