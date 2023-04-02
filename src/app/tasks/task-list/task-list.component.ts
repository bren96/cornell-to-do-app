import { Component, EventEmitter, Input, Output } from '@angular/core';

import { Task } from '../data-access/task.model';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss'],
})
export class TaskListComponent {
  @Input() tasks: Task[] = [];
  @Output() updateTask = new EventEmitter<Task>();
  @Output() deleteTask = new EventEmitter<string>();

  onUpdateTask(task: Task): void {
    this.updateTask.emit(task);
  }

  onDeleteTask(id: string): void {
    this.deleteTask.emit(id);
  }

  trackTasksById(_index: number, task: Task): string {
    return task.task_id;
  }
}
