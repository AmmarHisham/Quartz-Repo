import { Component, OnInit, OnDestroy, ViewChild } from "@angular/core";
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Router } from "@angular/router";
import { Observable, Subscription } from 'rxjs/Rx';
import { SchedulerService } from "../../services/scheduler.service";
import { ServerResponseCode } from "../../constant/response.code.constants";
import { Task } from "../../modal/task.model";
import { AlertCenterService, AlertType, Alert } from 'ng2-alert-center';



@Component({
  selector: 'new-job',
  templateUrl: './new.component.html',
  styleUrls: ['./new.component.css']
})

export class NewComponent implements OnInit, OnDestroy {
  schedulerForm: FormGroup;
  jobNameStatus: String;
  jobRecords = [];
  jobRefreshTimerSubscription: Subscription;

  isEditMode: boolean = false;
  public loading = false;
  startTask: String = '';
  tasks = [Task];
  taskKey: String = 'Development';
  envStatus: boolean = false;

  cronFlag: boolean = false;

  constructor(public _router: Router,
    public _fb: FormBuilder,
    public _schedulerService: SchedulerService,
    public _responseCode: ServerResponseCode,
    public _alertService: AlertCenterService) { }

  ngOnInit() {
    this.loading = true;
    this.jobNameStatus = "";

    this.schedulerForm = this._fb.group({
      jobName: [''],
      year: [''],
      month: [''],
      day: [''],
      hour: [''],
      minute: [''],
      cronExpression: ['0 0/1 * 1/1 * ? *'],
      startTask: [''],
      scheduleType: ['oneTimeSchedule'],
    });
    this.setDate();
    this.getAllTask();
    this.loading = false;
  }

  ngOnDestroy() {
  }

  setDate(): void {
    let date = new Date();
    this.schedulerForm.patchValue({
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      day: date.getDate(),
      hour: date.getHours(),
      minute: date.getMinutes()
    });
  }

  resetForm() {
    this.loading = true;
    var dateNow = new Date();
    this.schedulerForm.patchValue({
      jobName: '',
      year: dateNow.getFullYear(),
      month: dateNow.getMonth() + 1,
      day: dateNow.getDate(),
      hour: dateNow.getHours(),
      minute: dateNow.getMinutes(),
      startTask:'',
      taskKey:''
    });
    this.jobNameStatus = "";
    this.loading = false;
  }

  getJobs() {
    this.loading = true;
    this._schedulerService.getJobs().subscribe(
      success => {
        if (success.statusCode == ServerResponseCode.SUCCESS) {
          this.jobRecords = success.data;
          this.loading = false;
        } else {
          alert("Some error while fetching jobs");
          this.loading = false;
        }
      },
      err => {
        const alert = new Alert(AlertType.DANGER, '', 'Error while getting all jobs.', 5000, true);
        this._alertService.alert(alert);
        this.loading = false;
      });
  }

  getAllTask() {
    this.loading = true;
    this._schedulerService.getAllTask().subscribe(
      success => {
        if (success.statusCode == ServerResponseCode.SUCCESS) {
          this.tasks = success.data;
          this.loading = false;
        } else {
          alert("Some error while fetching jobs");
          this.loading = false;
        }

      },
      err => {
        const alert = new Alert(AlertType.DANGER, '', 'Error while getting the Task List.', 5000, true);
        this._alertService.alert(alert);
        this.loading = false;
      });

  }


  getFormattedDate(year, month, day, hour, minute) {
    return year + "/" + month + "/" + day + " " + hour + ":" + minute;
  }

  scheduleJob() {
    var jobName = this.schedulerForm.value.jobName;
    var year = this.schedulerForm.value.year;
    var month = this.schedulerForm.value.month;
    var day = this.schedulerForm.value.day;
    var hour = this.schedulerForm.value.hour;
    var minute = this.schedulerForm.value.minute;
    var data;

    if (this.cronFlag==false) {
      data = {
        "jobName": this.schedulerForm.value.jobName,
        "jobScheduleTime": this.getFormattedDate(year, month, day, hour, minute),
        "cronExpression": '',
        "startTask": this.startTask,
        "taskName": this.taskKey
      }
    } else {
      data = {
        "jobName": this.schedulerForm.value.jobName,
        "jobScheduleTime": this.getFormattedDate(year, month, day, hour, minute),
        "cronExpression": this.schedulerForm.value.cronExpression,
        "startTask": this.startTask,
        "taskName": this.taskKey
      }
    }

    var result =this.checkEnvStatus(this.taskKey);

    if(result===false){
      this.loading = true;
      this._schedulerService.scheduleJob(data).subscribe(
        success => {
          if (success.statusCode == ServerResponseCode.SUCCESS) {
            this.loading = false;
            const alert = new Alert(AlertType.SUCCESS, '', 'Job scheduled successfully.', 5000, true);
            this._alertService.alert(alert);

            this.resetForm();
  
          } else if (success.statusCode == ServerResponseCode.JOB_WITH_SAME_NAME_EXIST) {
            this.loading = false;
            const alert = new Alert(AlertType.DANGER, '', 'Job with same name exists, Please choose different name.', 5000, true);
            this._alertService.alert(alert);
          } else if (success.statusCode == ServerResponseCode.JOB_NAME_NOT_PRESENT) {
            this.loading = false;
            const alert = new Alert(AlertType.DANGER, '', 'Job name is mandatory.', 5000, true);
            this._alertService.alert(alert);
          } else if (success.statusCode == ServerResponseCode.JOB_TASK_NOT_PRESENT) {
            this.loading = false;
            const alert = new Alert(AlertType.DANGER, '', 'Job task is mandatory.', 5000, true);
            this._alertService.alert(alert);
          }
          this.jobRecords = success.data;
        },
        err => {
          this.loading = false;
          const alert = new Alert(AlertType.DANGER, '', 'Error while getting all jobs', 5000, true);
          this._alertService.alert(alert);
        });
  
    }

  }

  refreshJob() {
    this.getJobs();
  }

  cronChange(cronExp) {
    this.loading = true;
    this.schedulerForm.patchValue({
      cronExpression: cronExp
    });
    this.loading = false;
  }

  cancelEdit() {
    this.loading = true;
    this.resetForm();
    this.isEditMode = false;
    this.loading = false;
  }

  startTaskChange(taskUrl) {
    this.startTask = taskUrl;
  }


  checkEnvStatus(taskKey):boolean {
    var data = {
      "taskKey": taskKey,
    }

    this.loading = true;

    this._schedulerService.checkEnvStatus(data).subscribe(
      success => {
        if (success.statusCode == ServerResponseCode.SUCCESS) {
          this.envStatus = false;
        } else if (success.statusCode == ServerResponseCode.TASK_IS_ALREADY_SHEDULE) {
          this.loading = false;
          const alert = new Alert(AlertType.DANGER, '', 'Task is already sheduled.', 5000, true);
          this._alertService.alert(alert);
          this.envStatus = true;
        }
      },
      err => {
        this.loading = false;
        const alert = new Alert(AlertType.DANGER, '', 'Error while checking the task status.', 5000, true);
        this._alertService.alert(alert);
        this.envStatus = true;
      });
      return this.envStatus;
  }

}