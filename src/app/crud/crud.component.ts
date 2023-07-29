import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { VirtualTimeScheduler } from 'rxjs';
import { ngxCsv } from 'ngx-csv/ngx-csv';

@Component({
  selector: 'app-crud',
  templateUrl: './crud.component.html',
  styleUrls: ['./crud.component.css']
})
export class CrudComponent {

  Tasks:any[]=[];
  History_Log :any[]=[];

  title:string="";
  desc:string="";
  due_date:string="";
  priority_levels:string="";
  status:string="";
  

  changes_id = 0;
  current_task_id = "";

  constructor(private http:HttpClient){
    this.getAllTask();
  }

  saveTask(){
    if (this.title ==='' && this.desc ==='' && this.due_date === '' && this.priority_levels === '' && this.status ===''){
      alert("Fill the Fields First");
    }
    else{
      let data = {
        "title":this.title,
        "desc":this.desc,
        "due_date":this.due_date,
        "priority_levels":this.priority_levels,
        "status":this.status
      };
      
      this.History_Log.push({'Change_Made':'Added Task'});
  
      this.http.post("http://127.0.0.1:8000/task", data).subscribe((resultData:any)=>{
        alert("Added Successfully!!");
        this.getAllTask();
      })
    }

    
  }

  getAllTask(){
    this.http.get("http://127.0.0.1:8000/task").subscribe((resultData:any)=>{
      this.Tasks = resultData.reverse();
      this.title = "";
      this.desc = "";
      this.due_date = "";
      this.priority_levels = "";
      this.status = "";
    })
  }

  setUpdate(data:any){
    this.title = data.title;
    this.desc = data.desc;
    this.due_date = data.due_date;
    this.priority_levels = data.priority_levels;
    this.status = data.status;
    
    this.current_task_id = data.id;
  }

  UpdateRecords(){

    if (this.title ===''
    && this.desc ==='' 
    && this.due_date === '' 
    && this.priority_levels === '' 
    && this.status ==='')
    {
      alert("Fill the Fields First");
    }
    else{
      let data = {
        "title":this.title,
        "desc":this.desc,
        "due_date":this.due_date,
        "priority_levels":this.priority_levels,
        "status":this.status
      };
      
      this.History_Log.push({'Change_Made':'Updated the Task'});
  
      this.http.put("http://127.0.0.1:8000/task/"+ this.current_task_id, data).subscribe((resultData:any)=>{
        alert("Updated Successfully!!");
        this.title = "";
        this.desc = "";
        this.due_date = "";
        this.priority_levels = "";
        this.status = "";
        this.getAllTask();
      })
    }
    
  }

  setDelete(data:any){
    this.http.delete("http://127.0.0.1:8000/task" + "/"+data.id).subscribe((resultData:any)=>{
      alert("Task Deleted");
      this.History_Log.push({'Change_Made':'Deleted the Task'});
      this.getAllTask();
    })
  }

  sortBypriority(){

    this.Tasks.sort((a,b)=>{
      let m = new Map();
      m.set('low',1);
      m.set('medium',2);
      m.set('high',3);

      return m.get(a.priority_levels.toLowerCase()) - m.get(b.priority_levels.toLowerCase());
    });

  }



  sortByStatus(){

    this.Tasks.sort((a,b)=>{
      let m = new Map();
      m.set('todo',1);
      m.set('inprogress',2);
      m.set('completed',3);

      return m.get(a.status.toLowerCase()) - m.get(b.status.toLowerCase());
    });

  }

  exportCSV(){
    this.http.get("http://127.0.0.1:8000/task").subscribe((resultData:any)=>{
      let options = {
        title:'User Details',
        fieldSeparator:',',
        quoteStrings:'"',
        decimalSeparator:'.',
        showLabels:false,
        noDownload:false,
        showTitle:false,
        useBom:false,
        headers:['ID','Title','Description', 'Due_Date','Priority_Levels','Status']
      };

      new ngxCsv(resultData, "report", options)

    })
  }
  exportHistoryLog(){
    
      let options = {
        title:'User Details',
        fieldSeparator:',',
        quoteStrings:'"',
        decimalSeparator:'.',
        showLabels:false,
        noDownload:false,
        showTitle:false,
        useBom:false,
        headers:['Changes']
      };

      new ngxCsv(this.History_Log, "History_Log", options);
  }
}
