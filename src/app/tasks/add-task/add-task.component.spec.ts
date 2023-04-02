import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TasksModule } from '../tasks.module';
import { AddTaskComponent } from './add-task.component';

describe('AddTaskComponent', () => {
  let component: AddTaskComponent;
  let fixture: ComponentFixture<AddTaskComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TasksModule],
      declarations: [AddTaskComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AddTaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('tests for submitNewTask', () => {
    describe('if form control value defined', () => {
      const MOCK_DESC = 'MOCK DESCRIPTION';

      beforeEach(() => {
        component.taskFormControl.setValue(MOCK_DESC);
        spyOn(component.addTask, 'emit');
      });

      it('should emit form control value', () => {
        component.submitNewTask();
        expect(component.addTask.emit).toHaveBeenCalledWith(MOCK_DESC);
      });

      it('should reset form control', () => {
        spyOn(component.taskFormControl, 'reset');
        component.submitNewTask();
        expect(component.taskFormControl.reset).toHaveBeenCalled();
      });
    });

    describe('if form control value undefined', () => {
      beforeEach(() => {
        component.taskFormControl.setValue(null);
        spyOn(component.addTask, 'emit');
      });

      it('should not emit', () => {
        component.submitNewTask();
        expect(component.addTask.emit).not.toHaveBeenCalled();
      });
    });
  });
});
