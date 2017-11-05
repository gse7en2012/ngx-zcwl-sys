import { Component, OnInit } from '@angular/core';
import { ProjectService} from '../../service/project.service';
import { Router, ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss'],
  providers:[ProjectService]
})
export class DetailsComponent implements OnInit {

  public loading: boolean = false;
  public tabIndex:number=1;
  public projectId:string;
  public proejctInfo:any={};
  public gmList:any;
  public deviceList:any;

  public addGmNickname:string;
  public addGmPhone:string;

  public isAddingGm:boolean=false;

  constructor(private projectSerive:ProjectService,private route: ActivatedRoute, private router: Router,) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
        this.projectId = params.proejct_id;
    });
    
    
    this.getProejctInfo();
    this.getProjectGmList();
    // this.getProjectDeviceList();
  }

  editGm(gm){
    gm.isEdit=false;
  }
  deleteGm(gm){
    if(confirm('确定删除？')){
      this.projectSerive.deleteProjectGm(this.projectId,gm.efairyuser_id).then((r)=>{
        this.getProjectGmList();
      }).catch((e)=>{
        alert(e)
      })
    }
  }
  cancelEditGm(gm){

  }
  addNewGm(){
    this.isAddingGm=true;
    
  }
  ensureAddNewGm(){
    this.projectSerive.addProjectGm(this.projectId,this.addGmPhone,this.addGmNickname).then((r)=>{
      this.getProjectGmList();
      this.isAddingGm=false;
    }).catch((e)=>{
      alert(e)
    })
  }
  cancelAddNewGm(){
    this.isAddingGm=false;
  }

  getProejctInfo(){
    this.projectSerive.getProjectDetailsManage(this.projectId).then((data)=>{
      this.proejctInfo=data.project_info; 
    })
  }

  getProjectGmList(){
    this.projectSerive.getProjectGmListManage(this.projectId).then((data)=>{
      this.gmList=data.gm_list;
    })
  }

  getProjectDeviceList(){
    this.projectSerive.getProjectDeviceListManage(this.projectId).then((data)=>{
      this.deviceList=data.device_list;
    })
  }

  changeTab(index){
    this.tabIndex=index;
  }


}
