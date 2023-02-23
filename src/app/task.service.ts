import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private baseUrl = 'http://65.2.51.31:9008/';

  constructor(private http: HttpClient) {}
// Getting All Tasks
  getAllTasks(endPoint: string) {
    let GetUrl = `${this.baseUrl}${endPoint}/`;
    return this.http.get(GetUrl).pipe(catchError(this.handleError));
  }
// Adding New Task to the table
  PostTask(endPoint: string, taskObj: any) {
    let postUrl = `${this.baseUrl}${endPoint}/`;
    return this.http
      .post<any>(postUrl, taskObj)
      .pipe(catchError(this.handleError));
  }
// Getting Single Task By Particular Task ID
  getTaskById(endPoint: string, task_id: number) {
    let GetUrl: string = `${this.baseUrl}${endPoint}/${task_id}/`;
    return this.http.get(GetUrl).pipe(catchError(this.handleError));
  }
// Editing a task 
  editTask(task_id: number, task_obj: any, endPoint: string) {
    let PutUrl: string = `${this.baseUrl}${endPoint}/${task_id}/`;
    return this.http
      .put<any>(PutUrl, task_obj)
      .pipe(catchError(this.handleError));
  }
// Deleting a particular task
  deleteTask(task_id: number, endPoint: string) {
    let DeleteUrl: string = `${this.baseUrl}${endPoint}/${task_id}/`;

    return this.http.delete<any>(DeleteUrl).pipe(catchError(this.handleError));
  }
// Error Handling
  public handleError(error: HttpErrorResponse) {
    let errorMessage: string = '';
    if (error.error instanceof ErrorEvent) {
      //client Error
      errorMessage = `Error : ${error.error.message}`;
    } else {
      //server error
      errorMessage = `Status : ${error.status} \n Message: ${error.message}`;
    }
    return throwError(errorMessage);
  }
}
