import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

import { BehaviorSubject, map, take } from 'rxjs';

import { Task } from './data-access/task.model';
import { TasksService } from './data-access/tasks.service';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss'],
})
export class TasksComponent {
  date = Date.now();

  completedExpanded = true;

  private _tasks = new BehaviorSubject<Task[]>([]);
  tasks$ = this._tasks.asObservable();

  activeTasks$ = this.tasks$.pipe(
    map((tasks) => {
      return tasks.filter((task) => !task.completed);
    })
  );

  completedTasks$ = this.tasks$.pipe(
    map((tasks) => {
      return tasks.filter((task) => task.completed);
    })
  );

  completedTaskLength$ = this.completedTasks$.pipe(
    map((tasks) => {
      return tasks.length;
    })
  );

  constructor(
    private tasksService: TasksService,
    private snackbar: MatSnackBar
  ) {
    this.fetchTasks();
  }

  toggleCompletedExpanded(): void {
    this.completedExpanded = !this.completedExpanded;
  }

  updateTasks(tasks: Task[]): void {
    this._tasks.next(tasks);
  }

  appendTask(task: Task): void {
    this.tasks$.pipe(take(1)).subscribe((tasks) => {
      this.updateTasks([...tasks, task]);
    });
  }

  updateTask(updatedTask: Task): void {
    this.tasks$.pipe(take(1)).subscribe((tasks) => {
      this.updateTasks(
        tasks.map((task) => {
          if (task.task_id === updatedTask.task_id) {
            return updatedTask;
          } else {
            return task;
          }
        })
      );
    });
  }

  removeTask(id: string): void {
    this.tasks$.pipe(take(1)).subscribe((tasks) => {
      this.updateTasks(
        tasks.filter((task) => {
          return task.task_id !== id;
        })
      );
    });
  }

  fetchTasks(): void {
    this.tasksService.getTasks().subscribe({
      next: (tasks) => {
        this.updateTasks(tasks);
      },
      error: (e) => {
        console.error(e);
        this.openSnackbar('Failed to load tasks');
      },
    });
  }

  onAddTask(description: string): void {
    this.tasksService.postTask(description, false).subscribe({
      next: (task) => {
        this.appendTask(task);
        this.openSnackbar('Added Task');
      },
      error: (e) => {
        console.error(e);
        this.openSnackbar('Failed to add task');
      },
    });
  }

  onUpdateTask(task: Task): void {
    this.tasksService
      .putTask(task.task_id, task.description, task.completed)
      .subscribe({
        next: (task) => {
          this.updateTask(task);
          this.openSnackbar('Updated Task');
        },
        error: (e) => {
          console.error(e);
          this.openSnackbar('Failed to update task');
        },
      });
  }

  onDeleteTask(id: string): void {
    this.tasksService.deleteTask(id).subscribe({
      complete: () => {
        this.removeTask(id);
        this.openSnackbar('Deleted Task');
      },
      error: (e) => {
        console.error(e);
        this.openSnackbar('Failed to delete task');
      },
    });
  }

  openSnackbar(message: string): void {
    this.snackbar.open(message, 'Dismiss', {
      duration: 1500,
    });
  }
}
