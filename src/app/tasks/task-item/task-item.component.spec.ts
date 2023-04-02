import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCheckbox, MatCheckboxChange } from '@angular/material/checkbox';

import { Task } from '../data-access/task.model';
import { TasksModule } from '../tasks.module';
import { TaskItemComponent } from './task-item.component';

describe('TaskItemComponent', () => {
  let component: TaskItemComponent;
  let fixture: ComponentFixture<TaskItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TasksModule],
      declarations: [TaskItemComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TaskItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('tests for onCheckboxChange', () => {
    it('should emit task with updated completed state', () => {
      const MOCK_CHANGE: MatCheckboxChange = {
        source: jasmine.createSpyObj<MatCheckbox>('MatCheckbox', ['id']),
        checked: true,
      };

      const MOCK_TASK: Task = {
        task_id: '123',
        description: 'Mock Desc',
        completed: false,
      };

      spyOn(component.updateTask, 'emit');
      component.task = MOCK_TASK;

      component.onCheckboxChange(MOCK_CHANGE);
      expect(component.updateTask.emit).toHaveBeenCalledWith({
        ...MOCK_TASK,
        completed: MOCK_CHANGE.checked,
      });
    });
  });

  describe('tests for onDeleteClick', () => {
    it('should emit task id', () => {
      const MOCK_TASK: Task = {
        task_id: '123',
        description: 'Mock Desc',
        completed: false,
      };

      spyOn(component.deleteTask, 'emit');
      component.task = MOCK_TASK;

      component.onDeleteClick();
      expect(component.deleteTask.emit).toHaveBeenCalledWith(MOCK_TASK.task_id);
    });
  });
});
