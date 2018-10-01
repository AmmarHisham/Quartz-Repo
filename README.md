 <h1><center>OTIS Quartz Service</center></h1><font color="red"></font>
 
 <h3>Prerequisite for QUARTZ : </h3>
 1.) Node Should be installed.<br>
 2.) Angular CLI Should be installed globally.<br>
 3.) Open Node command prompt <br>
 4.) <font color="red">Run <b>npm install</b></font> command inside path\Programmatic_Microservices\quartz-service-ui.<br>
 5.) <font color="red">Then Run <b>npm run build</b></font> command inside path\Programmatic_Microservices\quartz-service-ui.<br>
 6.) Open command prompt.<br>
 4.) <font color="red">Run <b>mvn install</b></font> command inside path\Programmatic_Microservices.<br>
 5.) <font color="red">Run <b>>mvn spring-boot:run</b></font> command inside path\Quartz-Repo-master.<br><br>
 
 <font color="red">Schedule a new job tab</font><font color="white">___________________________________________________</font><font color="red">Quartz Job Deatils Tab</font>
<br>
 <img src="C:\Users\ps145598\Documents\work\Quartz-Repo-master\Quartz job Schedule tab.png" width="600" height="377">
 <img src="C:\Users\ps145598\Documents\work\Quartz-Repo-master\Quartz Job Deatils Tab.png" width="600" height="377">
 
 
 <h4><font color="black">It explains how to schedule a Simple job, Cron job, how to Pause a job, Resume a job, Edit & Delete job etc. It used</font> <font color="red">ORACLE</font> as database for storing quartz jobs and triggers.</h4>
 
 <h2>Application :</h2>

<h2>Backend Services  ( Springboot ) :</h2>  
Services are created for the tasks like - schedule a new job , Pause Job, Resume Job,
Delete Job & Edit Job.
 
 <h2>Frontend Services ( Angular 5 ) :</h2>
<h2>Schedule New Job :</h2>
•	Validation logic to be placed for  Schedule New Job like job name contains only characters , Job Name & Task Name is mandatory and by default Scheduler type is  one time       	Schedule or a single time execution job.<br>
•	Getting the task name from the server.<br>
•	Date and time it is taking according to America/New_York time Zone.<br>
•	For Scheduling New Job Job Name should be unique .<br>
•	In one Environment ( Task Name ) only once job Scheduling is allowed duplicate Task Name not allowed.

<h2>Pause Job :</h2>
•	Validation logic to be placed for Pause button according to Job Status.<br>
•	When job Status is “Paused“  button should be disabled other than these it is Enabled.

<h2>Resume Job :</h2>
•	Validation logic to be placed for Resume button according to Job Status.<br>
•	When job Status is “Resumed“  button should be disabled other than these it is Enabled.

<h2>Edit :</h2>
•	For editing a job only Date & Time modification is allowed.

<h2>Delete :</h2>

•	While pressing a delete button job is deleted from the list as well as from the DB also.
 

<h2>Quartz Scheduling :</h2>
Quartz is a job scheduling library that can be integrated into a wide variety of Java applications.Quartz is generally used for enterprise class applications to support process workflow, system management (maintenance) actions and to provide timely services within the applications. Quartz also supports clustering. Quartz is an open-source product from the Terracotta company.Quartz is a richly featured, open source job scheduling library that can be integrated within virtually any Java application - from the smallest stand-alone application to the largest e-commerce system. Quartz can be used to create simple or complex schedules for executing tens, hundreds, or even tens-of-thousands of jobs; jobs whose tasks are defined as standard Java components that may execute virtually anything you may program them to do. The Quartz Scheduler includes many enterprise-class features, such as support for JTA transactions and clustering.Quartz is freely usable, licensed under the Apache 2.0 license.


<h2>Cron Job :</h2> 
The software utility cron is a time-based job scheduler in Unix-like computer operating systems. People who set up and                            maintain software environments use cron to schedule jobs (commands or shell scripts)  to run periodically at fixed times, dates, or intervals. It typically automates system maintenance or administration—though its general-purpose nature makes it useful for things like downloading files from the Internet and downloading email at regular intervals.<font color="red">cron is most suitable for scheduling repetitive tasks.</font>

<h2>Simple Job :</h2>
When we want to schedule a job for one time execution then we Schedule a job as a Single trigger job. It will execute only once at specific time which provided by user.
