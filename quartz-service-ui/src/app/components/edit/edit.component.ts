import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { SchedulerService } from '../../services/scheduler.service';
import { ServerResponseCode } from '../../constant/response.code.constants';

@Component({
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {
editForm: FormGroup;
jobNameStatus : String;
jobRecords = [];
isEditMode: boolean = false;
public loading = false;

  public constructor(private route : ActivatedRoute,private _fb: FormBuilder
    ,private _schedulerService : SchedulerService,)
 {

 };

  ngOnInit() {
   this.loading = true;
  this.editForm = this._fb.group({
      jobName: [''],
      groupName : [''],
      year: [''],
      month: [''],
      day: [''],
      hour: [''],
      minute: [''],
      cronExpression: ['0 0/1 * 1/1 * ? *']
    });
 	  this.route.queryParams.subscribe(params => {
    
    var time = Number(params['scheduleTime']);
    var d = Date.parse(time.toString());
    let date = new Date(time);

    	this.editForm.patchValue({
        jobName: params['jobName'],
        groupName: params['groupName'],
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        day: date.getDate(),
        hour: date.getHours(),
        minute: date.getMinutes()
      });
    
   this.loading = false;

      });

  }
  
  updateJob(){ 
    var jobName = this.editForm.value.jobName;
    var year = this.editForm.value.year;
    var month = this.editForm.value.month;
    var day = this.editForm.value.day;
    var hour = this.editForm.value.hour;
    var minute = this.editForm.value.minute;
    var groupName ='';
    
    var data = {
      "jobName": this.editForm.value.jobName,
      "jobScheduleTime": this.getFormattedDate(year, month, day, hour, minute),
      "cronExpression": this.editForm.value.cronExpression,
      "groupName":groupName
    }
    this.loading = true;
    this._schedulerService.updateJob(data).subscribe(
      success => {
          if(success.statusCode == ServerResponseCode.SUCCESS){
           this.loading = false;
            alert("Job updated successfully.");
            this.resetForm();

          }else if(success.statusCode == ServerResponseCode.JOB_DOESNT_EXIST){
            this.loading = false;
            alert("Job no longer exist.");
          
          }else if(success.statusCode == ServerResponseCode.JOB_NAME_NOT_PRESENT){
            this.loading = false;
            alert("Please provide job name.");
          }
          this.jobRecords = success.data;
      },
      err => {
        this.loading = false;
        alert("Error while updating job");
      });
  }

  editJob(selectedJobRow){
    this.isEditMode = true;

    var d = Date.parse(selectedJobRow.scheduleTime);
    let date = new Date(selectedJobRow.scheduleTime); 

    this.loading = true;
    this.editForm.patchValue({
        jobName: selectedJobRow.jobName,
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        day: date.getDate(),
        hour: date.getHours(),
        minute: date.getMinutes(),
        groupName: selectedJobRow.groupName
      });

    this.loading = false;
  }

  cancelEdit(){
   this.loading = true;
    this.resetForm();
    this.isEditMode = false;
     this.loading = false;
  }

   getFormattedDate(year, month, day, hour, minute) {
    return year + "/" + month + "/" + day + " " + hour+":"+minute;
  }

    resetForm(){
    var dateNow = new Date();
     this.loading = true;
    this.editForm.patchValue({
        jobName: "",
        year: dateNow.getFullYear(),
        month: dateNow.getMonth() + 1,
        day: dateNow.getDate(),
        hour: dateNow.getHours(),
        minute: dateNow.getMinutes()
      });
    this.jobNameStatus = "";
     this.loading = false;
  }
    checkJobExistWith(jobName){
      var data = {
        "jobName": jobName
      }

      this.loading = true;
      this._schedulerService.isJobWithNamePresent(data).subscribe(
      success => {
          if(success.statusCode == ServerResponseCode.SUCCESS){
            if(success.data == true){
             this.loading = false;
              this.jobNameStatus = "Bad :(";
            }else{
             this.loading = false;
              this.jobNameStatus = "Good :)";
            }
          }else if(success.statusCode == ServerResponseCode.JOB_NAME_NOT_PRESENT){
           this.loading = false;
            alert("Job name is mandatory.");
            this.editForm.patchValue({
              jobName: "",
            });
          }
      },
      err => {
        alert("Error while checkinh job with name exist.");
      });
      this.jobNameStatus = ""; 
  }
    cronChange(cronExp){
    this.editForm.patchValue({
        cronExpression: cronExp
      });
  }

}