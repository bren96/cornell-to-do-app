import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-add-task',
  templateUrl: './add-task.component.html',
  styleUrls: ['./add-task.component.scss'],
})
export class AddTaskComponent {
  taskFormControl = new FormControl<string>('');

  @Output() addTask = new EventEmitter<string>();

  submitNewTask(): void {
    if (this.taskFormControl.value) {
      this.addTask.emit(this.taskFormControl.value);
      this.taskFormControl.reset();
    }
  }
}
