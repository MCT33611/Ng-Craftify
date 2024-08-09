import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskCompletionDialogComponent } from './task-completion-dialog.component';

describe('TaskCompletionDialogComponent', () => {
  let component: TaskCompletionDialogComponent;
  let fixture: ComponentFixture<TaskCompletionDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskCompletionDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TaskCompletionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
