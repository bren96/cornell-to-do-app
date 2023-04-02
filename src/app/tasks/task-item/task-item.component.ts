import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';

import { Task } from '../data-access/task.model';

@Component({
  selector: 'app-task-item',
  templateUrl: './task-item.component.html',
  styleUrls: ['./task-item.component.scss'],
})
export class TaskItemComponent {
  @Input() task: Task = {
    task_id: '',
    description: '',
    completed: false,
  };

  @Output() updateTask = new EventEmitter<Task>();
  @Output() deleteTask = new EventEmitter<string>();

  onCheckboxChange(change: MatCheckboxChange): void {
    this.updateTask.emit({ ...this.task, completed: change.checked });
  }

  onDeleteClick(): void {
    this.deleteTask.emit(this.task.task_id);
  }
}
