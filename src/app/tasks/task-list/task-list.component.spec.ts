import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TasksModule } from '../tasks.module';

import { TaskListComponent } from './task-list.component';

describe('TaskListComponent', () => {
  let component: TaskListComponent;
  let fixture: ComponentFixture<TaskListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TasksModule],
      declarations: [TaskListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TaskListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('tests for onUpdateTask', () => {
    it('should emit task', () => {
      const MOCK_TASK = {
        task_id: '123',
        description: 'Mock Desc',
        completed: false,
      };
      spyOn(component.updateTask, 'emit');
      component.onUpdateTask(MOCK_TASK);
      expect(component.updateTask.emit).toHaveBeenCalledWith(MOCK_TASK);
    });
  });

  describe('tests for onDeleteTask', () => {
    it('should emit id of task to delete', () => {
      const MOCK_ID = '123';
      spyOn(component.deleteTask, 'emit');
      component.onDeleteTask(MOCK_ID);
      expect(component.deleteTask.emit).toHaveBeenCalledWith(MOCK_ID);
    });
  });

  describe('tests for trackTasksById', () => {
    it('should return task_id', () => {
      const MOCK_TASK = {
        task_id: '123',
        description: 'Mock Desc',
        completed: false,
      };
      expect(component.trackTasksById(0, MOCK_TASK)).toEqual(MOCK_TASK.task_id);
    });
  });
});
