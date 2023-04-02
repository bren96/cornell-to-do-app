import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MaterialModule } from '../material/material.module';
import { AddTaskComponent } from './add-task/add-task.component';
import { TaskItemComponent } from './task-item/task-item.component';
import { TaskListComponent } from './task-list/task-list.component';
import { TasksComponent } from './tasks.component';

@NgModule({
  declarations: [
    TaskItemComponent,
    TaskListComponent,
    TasksComponent,
    AddTaskComponent,
  ],
  imports: [
    CommonModule,
    BrowserAnimationsModule,
    MaterialModule,
    ReactiveFormsModule,
  ],
  exports: [TasksComponent],
})
export class TasksModule {}
