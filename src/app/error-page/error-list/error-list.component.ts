import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ProjectService } from '../../service/project.service';
import { DeviceService } from '../../service/device.service';
import * as myGlobals from '../../global/globals';
@Component({
  selector: 'app-error-list',
  templateUrl: './error-list.component.html',
  styleUrls: ['./error-list.component.scss'],
  providers: [DeviceService]
})
export class ErrorListComponent implements OnInit {

  public alarmList = [];
  public alarmListPageShow = [];
  public alarmListSearch = [];
  public total: number = 0;
  public loading: boolean = true;

  public pageSize: number = 15;
  public page: number = 1;
  public jumpPage: number = 1;
  public pageMax: number = 1;
  public projectId: string;
  public keyword;
  
  public agencyId: string;
  public agencyName: string;


  public project: any={
    efairyproject_name:''
  };
  // public stateHash = ['离线', '报警', '预警', '故障', '启动', '屏蔽', '正常'];
  public stateHash = ['离线', '报警', '预警', '故障', '启动', '屏蔽', '正常'];
  public dataHash = myGlobals.dataHash;
  public stateHashList = myGlobals.stateHash;



  constructor(private deviceService: DeviceService, private route: ActivatedRoute, private router: Router, private projectService: ProjectService) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      if (params && params.branch_id) {
        this.projectId = params.branch_id;
        this.agencyId = params.agency_id;
        this.getData();
      }
    });

    this.projectService.getProjectList(this.agencyId).then((data) => {
      this.agencyName = data.lv2_agency_info.efairyuser_nickname;
      data.project_list.forEach((item)=>{
        if(item.efairyproject_id==this.projectId){
          this.project=item;
        }
      })      
    })


  }


  getData() {
    this.projectService.getProjectAlarmData(this.projectId,3).then((data) => {
      this.alarmList = data.project_alarm_data_list;
      this.total = data.total_rows;
      this.loading = false;
      this.alarmList.forEach((item)=>{
        // item.label=this.dataHash[item.efairydevice_alarm_pt][0];
        item.state=this.stateHashList[item.efairydevice_detail_state];
        // item.efairydevice_alarm_rtv=(item.efairydevice_alarm_rtv*this.dataHash[item.efairydevice_alarm_pt][1]).toFixed(2)+this.dataHash[item.efairydevice_alarm_pt][2]
        // item.efairydevice_alarm_thv=(item.efairydevice_alarm_thv*this.dataHash[item.efairydevice_alarm_pt][1]).toFixed(2)+this.dataHash[item.efairydevice_alarm_pt][2]
      })

      this.pageMax = Math.ceil(this.total / this.pageSize)
      this.renderData();
    })
  }

  renderData() {
    this.alarmListPageShow = this.alarmList.slice((this.page - 1) * this.pageSize, this.page * this.pageSize);
  }

  prevPage() {
    if (this.page <= 1) return false;
    this.page--;
    this.renderData();
  }

  nextPage() {
    if (this.page >= this.pageMax) return false;
    this.page++;
    this.renderData();
  }

  changePage() {
    this.page = this.jumpPage;
    this.renderData();
  }
 

  search() {
    if (this.keyword !== '') {
      this.alarmListSearch = [];
      this.alarmList.forEach((item) => {
        if (item.efairydevice_name.indexOf(this.keyword) !== -1 || item.efairydevice_id.toString().indexOf(this.keyword) !== -1)
          this.alarmListSearch.push(item);
      })
      this.alarmListPageShow = this.alarmListSearch;
    }else{
      this.renderData();
    }
  }

}
