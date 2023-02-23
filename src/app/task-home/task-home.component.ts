import { Component, OnInit } from '@angular/core';
import { TaskService } from '../task.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-task-home',
  templateUrl: './task-home.component.html',
  styleUrls: ['./task-home.component.css'],
})
export class TaskHomeComponent implements OnInit {
  public errorMessage: string | null = null;
  loading: boolean = false;
  constructor(
    private fb: FormBuilder,
    private taskService: TaskService,
    private datePipe: DatePipe
  ) {}
  tasks: any;
  addTaskForm!: FormGroup;
  showAdd!: boolean;
  showUpdate!: boolean;
  AssigneeArr: any;
  taskObj: any = {};
  ngOnInit(): void {
    this.addTaskForm = this.fb.group({
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
      status: ['', [Validators.required]],
      priority: ['', [Validators.required]],
      risk_id: [null, [Validators.required]],
      suggested_solution: ['', [Validators.required]],
      assigned_date: ['', [Validators.required]],
      closing_date: ['', [Validators.required]],
      owner: [null, [Validators.required]],
      assignee: [[1], []],
    });
    this.GetAllTaskFromApi();
  }
  clickAddTask() {
    this.addTaskForm.reset();
    this.showAdd = true;
    this.showUpdate = false;
  }
  GetAllTaskFromApi() {
    this.taskService.getAllTasks('api/task-viewset').subscribe(
      (tasks) => {
        this.tasks = tasks;
        this.loading = false;
      },
      (error) => {
        this.errorMessage = error;
        this.loading = false;
      }
    );
  }
 
  postTaskToDB() {
    this.AssigneeArr = this.addTaskForm.controls['assignee'].value.split(',');
    this.addTaskForm.controls['assignee']?.setValue(this.AssigneeArr);
    let taskObj = this.addTaskForm.value;
    // console.log(taskObj)
   if(taskObj){
    this.loading = true;
    this.taskService.PostTask('api/task-viewset', taskObj).subscribe(
      (res) => {
        // console.log(res)
        let close_Modal = document.getElementById('close_Modal');
        close_Modal?.click();
        this.addTaskForm.reset();
        this.GetAllTaskFromApi();
        this.loading = false;
      },
      (error) => {
        this.errorMessage = error;
        // console.log(this.errorMessage)
        this.loading = false;
      }
    );
   }
  }

  onEditclick(task_id: number) {
    if(task_id){
      this.loading = true;
    this.taskService.getTaskById('api/task-viewset', task_id).subscribe(
      (taskData: any) => {
        // console.log(taskData);
        this.showAdd = false;
        this.showUpdate = true;
        let formatted_Assigned_Date = this.datePipe.transform(
          taskData.assigned_date,
          'yyyy-MM-dd'
        );
        let formatted_Closing_Date = this.datePipe.transform(
          taskData.closing_date,
          'yyyy-MM-dd'
        );
        this.taskObj.id = taskData.id;
        this.addTaskForm.controls['name'].setValue(taskData.name);
        this.addTaskForm.controls['description'].setValue(taskData.description);
        this.addTaskForm.controls['status'].setValue(taskData.status);
        this.addTaskForm.controls['priority'].setValue(taskData.priority);
        this.addTaskForm.controls['risk_id'].setValue(taskData.risk_id);
        this.addTaskForm.controls['suggested_solution'].setValue(
          taskData.suggested_solution
        );
        this.addTaskForm.controls['assigned_date'].setValue(
          formatted_Assigned_Date
        );
        this.addTaskForm.controls['closing_date'].setValue(
          formatted_Closing_Date
        );
        this.addTaskForm.controls['owner'].setValue(taskData.owner);
        this.addTaskForm.controls['assignee'].setValue(taskData.assignee);
        this.loading = false;
      },
      (error) => {
        this.errorMessage = error;
        this.loading = false;
      }
    );
    }
  }
  updateTaskDetails() {
    this.taskObj.name = this.addTaskForm.value.name;
    this.taskObj.description = this.addTaskForm.value.description;
    this.taskObj.status = this.addTaskForm.value.status;
    this.taskObj.priority = this.addTaskForm.value.priority;
    this.taskObj.risk_id = this.addTaskForm.value.risk_id;
    this.taskObj.suggested_solution = this.addTaskForm.value.suggested_solution;
    this.taskObj.assigned_date = this.addTaskForm.value.assigned_date;
    this.taskObj.closing_date = this.addTaskForm.value.closing_date;
    this.taskObj.owner = this.addTaskForm.value.owner;
    this.taskObj.assignee = this.addTaskForm.value.assignee;
    // console.log( this.taskObj)
   if(this.taskObj.id && this.taskObj ){
    this.loading = true;
    this.taskService
      .editTask(this.taskObj.id, this.taskObj, 'api/task-viewset')
      .subscribe(
        (response: any) => {
          // alert('Task Updated Successfully');
          let close_Modal = document.getElementById('close_Modal');
          close_Modal?.click();
          this.addTaskForm.reset();
          this.GetAllTaskFromApi();
          this.loading = false;
        },
        (error) => {
          this.errorMessage = error;
          this.loading = false;
        }
      );
   }
  }

  deleteTaskDetail(task_id: number) {
    let confirmDelete = confirm('Do you want to delete this task?');
    if (confirmDelete && task_id) {
      this.loading = true;
      this.taskService.deleteTask(task_id, 'api/task-viewset').subscribe(
        (res: any) => {
          // alert('Task Delete Successful');
          this.GetAllTaskFromApi();
          this.loading = false;
        },
        (error) => {
          this.errorMessage = error;
          
          this.loading = false;
        }
      );
    }
  }
}
