import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UiUpsertFormComponent } from './ui-upsert-form.component';

describe('UiUpsertFormComponent', () => {
  let component: UiUpsertFormComponent;
  let fixture: ComponentFixture<UiUpsertFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UiUpsertFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UiUpsertFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
