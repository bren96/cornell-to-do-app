import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSnackBar } from '@angular/material/snack-bar';

import { of, take, throwError } from 'rxjs';

import { Task } from './data-access/task.model';
import { TasksService } from './data-access/tasks.service';
import { TasksComponent } from './tasks.component';
import { TasksModule } from './tasks.module';

describe('TasksComponent', () => {
  let component: TasksComponent;
  let fixture: ComponentFixture<TasksComponent>;

  let snackbar = jasmine.createSpyObj('snackBar', ['open']);

  let tasksService = jasmine.createSpyObj('tasksService', {
    deleteTask: of(undefined),
    getTasks: of(undefined),
    putTask: of(undefined),
    postTask: of(undefined),
  });

  const MOCK_TASKS: Task[] = [
    {
      task_id: '123',
      description: 'Mock 1',
      completed: true,
    },
    {
      task_id: '456',
      description: 'Mock 2',
      completed: true,
    },
    {
      task_id: '789',
      description: 'Mock 3',
      completed: false,
    },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TasksModule],
      declarations: [TasksComponent],
      providers: [
        { provide: MatSnackBar, useValue: snackbar },
        { provide: TasksService, useValue: tasksService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TasksComponent);
    component = fixture.componentInstance;
    component.updateTasks(MOCK_TASKS);
    fixture.detectChanges();
  });

  describe('toggleCompletedExpanded', () => {
    describe('if collapsed', () => {
      beforeEach(() => {
        component.completedExpanded = false;
      });
      it('should set expanded', () => {
        component.toggleCompletedExpanded();
        expect(component.completedExpanded).toBeTrue();
      });
    });

    describe('if expanded', () => {
      beforeEach(() => {
        component.completedExpanded = true;
      });
      it('should set collapsed', () => {
        component.toggleCompletedExpanded();
        expect(component.completedExpanded).toBeFalse();
      });
    });
  });

  describe('tests for appendTask', () => {
    const MOCK_ADD: Task = {
      task_id: '007',
      description: 'Add Task',
      completed: false,
    };

    beforeEach(() => {
      component.updateTasks(MOCK_TASKS);
    });

    it('should add task to end of tasks', (done) => {
      component.tasks$.pipe(take(1)).subscribe((tasks) => {
        expect(tasks.length).toEqual(MOCK_TASKS.length);
      });

      component.appendTask(MOCK_ADD);

      component.tasks$.pipe(take(1)).subscribe((tasks) => {
        expect(tasks.length).toEqual(MOCK_TASKS.length + 1);
        expect(tasks[tasks.length - 1]).toEqual(MOCK_ADD);
        done();
      });
    });
  });

  describe('tests for updateTask', () => {
    const MOCK_UPDATE: Task = {
      ...MOCK_TASKS[0],
      completed: false,
    };

    beforeEach(() => {
      component.updateTasks(MOCK_TASKS);
    });

    it('should update matching task in tasks', (done) => {
      component.tasks$.pipe(take(1)).subscribe((tasks) => {
        expect(tasks[0].completed).toBeTrue();
      });

      component.updateTask(MOCK_UPDATE);

      component.tasks$.pipe(take(1)).subscribe((tasks) => {
        expect(tasks[0].completed).toBeFalse();
        done();
      });
    });
  });

  describe('tests for remove task', () => {
    beforeEach(() => {
      component.updateTasks(MOCK_TASKS);
    });

    it('should remove task from tasks', (done) => {
      component.tasks$.pipe(take(1)).subscribe((tasks) => {
        expect(tasks).toEqual(MOCK_TASKS);
      });

      component.removeTask(MOCK_TASKS[0].task_id);

      component.tasks$.pipe(take(1)).subscribe((tasks) => {
        expect(tasks).toEqual([MOCK_TASKS[1], MOCK_TASKS[2]]);
        done();
      });
    });
  });

  describe('tests for fetchTasks', () => {
    beforeEach(() => {
      spyOn(component, 'openSnackbar');
    });

    describe('if successful', () => {
      beforeEach(() => {
        spyOn(component, 'updateTasks');
        tasksService.getTasks.and.returnValue(of(MOCK_TASKS));
      });

      it('should update tasks', () => {
        component.fetchTasks();
        expect(component.updateTasks).toHaveBeenCalledWith(MOCK_TASKS);
      });
    });

    describe('if error', () => {
      beforeEach(() => {
        tasksService.getTasks.and.returnValue(throwError(() => {}));
        spyOn(console, 'error');
      });

      it('should log error and open snackbar', () => {
        component.fetchTasks();
        expect(console.error).toHaveBeenCalled();
        expect(component.openSnackbar).toHaveBeenCalled();
      });
    });
  });

  describe('tests for onAddTask', () => {
    const MOCK_NEW: Task = {
      task_id: '1234',
      description: 'Mock New Task',
      completed: false,
    };

    beforeEach(() => {
      spyOn(component, 'openSnackbar');
    });

    describe('if successful', () => {
      beforeEach(() => {
        spyOn(component, 'appendTask');
        tasksService.postTask.and.returnValue(of(MOCK_NEW));
      });

      it('should append task and open snackbar', () => {
        component.onAddTask(MOCK_NEW.description);
        expect(component.appendTask).toHaveBeenCalledWith(MOCK_NEW);
        expect(component.openSnackbar).toHaveBeenCalled();
      });
    });

    describe('if error', () => {
      beforeEach(() => {
        tasksService.postTask.and.returnValue(throwError(() => {}));
        spyOn(console, 'error');
      });

      it('should log error and open snackbar', () => {
        component.onAddTask(MOCK_NEW.description);
        expect(console.error).toHaveBeenCalled();
        expect(component.openSnackbar).toHaveBeenCalled();
      });
    });
  });

  describe('tests for onUpdateTask', () => {
    const MOCK_UPDATE: Task = {
      task_id: '123',
      description: 'Mock Update',
      completed: true,
    };

    beforeEach(() => {
      spyOn(component, 'openSnackbar');
    });

    describe('if successful', () => {
      beforeEach(() => {
        spyOn(component, 'updateTask');
        tasksService.putTask.and.returnValue(of(MOCK_UPDATE));
      });

      it('should update task and open snackbar', () => {
        component.onUpdateTask(MOCK_UPDATE);
        expect(component.updateTask).toHaveBeenCalledWith(MOCK_UPDATE);
        expect(component.openSnackbar).toHaveBeenCalled();
      });
    });

    describe('if error', () => {
      beforeEach(() => {
        tasksService.putTask.and.returnValue(throwError(() => {}));
        spyOn(console, 'error');
      });

      it('should log error and open snackbar', () => {
        component.onUpdateTask(MOCK_UPDATE);
        expect(console.error).toHaveBeenCalled();
        expect(component.openSnackbar).toHaveBeenCalled();
      });
    });
  });

  describe('tests for onDeleteTask', () => {
    beforeEach(() => {
      spyOn(component, 'openSnackbar');
    });

    describe('if successful', () => {
      beforeEach(() => {
        spyOn(component, 'removeTask');
        tasksService.deleteTask.and.returnValue(of({ message: 'success' }));
      });

      it('should remove task and open snackbar', () => {
        component.onDeleteTask('123');
        expect(component.removeTask).toHaveBeenCalledWith('123');
        expect(component.openSnackbar).toHaveBeenCalled();
      });
    });

    describe('if error', () => {
      beforeEach(() => {
        tasksService.deleteTask.and.returnValue(throwError(() => {}));
        spyOn(console, 'error');
      });

      it('should log error and open snackbar', () => {
        component.onDeleteTask('123');
        expect(console.error).toHaveBeenCalled();
        expect(component.openSnackbar).toHaveBeenCalled();
      });
    });
  });

  describe('tests for open snackbar', () => {
    it('should open message with common configuration', () => {
      const MOCK_MESSAGE = 'Hello World';
      component.openSnackbar(MOCK_MESSAGE);
      expect(snackbar.open).toHaveBeenCalledWith(MOCK_MESSAGE, 'Dismiss', {
        duration: 1500,
      });
    });
  });
});
