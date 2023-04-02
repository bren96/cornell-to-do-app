import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { Task } from './task.model';

@Injectable({
  providedIn: 'root',
})
export class TasksService {
  apiUrl = 'https://595pnpogph.execute-api.us-east-1.amazonaws.com/v1/tasks';

  headers = new HttpHeaders({
    'Content-Type': 'application/json',
  });

  constructor(private httpClient: HttpClient) {}

  postTask(description: string, completed: boolean): Observable<Task> {
    return this.httpClient.post<Task>(
      this.apiUrl,
      {
        description,
        completed,
      },
      {
        headers: this.headers,
      }
    );
  }

  getTasks(): Observable<Task[]> {
    return this.httpClient.get<Task[]>(this.apiUrl, {
      headers: this.headers,
    });
  }

  putTask(
    id: string,
    description: string,
    completed: boolean
  ): Observable<Task> {
    return this.httpClient.put<Task>(
      `${this.apiUrl}/${id}`,
      {
        description,
        completed,
      },
      {
        headers: this.headers,
      }
    );
  }

  deleteTask(id: string): Observable<{ message: string }> {
    return this.httpClient.delete<{ message: string }>(`${this.apiUrl}/${id}`, {
      headers: this.headers,
    });
  }
}
