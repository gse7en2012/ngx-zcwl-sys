import { Component, OnInit, NgZone } from '@angular/core';
import { ProjectService } from '../../service/project.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Location } from '@angular/common';
import * as myGlobal from '../../global/globals';

// import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

declare var AMap;
declare var AMapUI;
declare var moment;

@Component({
  selector: 'app-edit-device',
  templateUrl: './edit-device.component.html',
  styleUrls: ['./edit-device.component.scss']
})
export class EditDeviceComponent implements OnInit {

  public bigMap;
  public deviceInfo: any = {};

  public projectId: string;
  public deviceId:string;
  public deviceInstallTime:string;
  public positionPicker: any;
  public setAddress: string;
  public deviceLng: string;
  public deviceLat: string;
  public deviceType: any = {
    special: false
  };
  public deviceTypeList: object[] = [];
  public followCode1List: any = [];
  public followCode2List: any = [];
  public followCode3List: any = [];
  public followCode1: number = 1;
  public followCode2: number = 1;
  public followCode3: number = 1;

  public deviceMasterCode: string = '';
  public deviceName: string;
  public deviceDesc: string;
  public masterCodeSuggest: any;


  public userList: object[] = [
    {
      efairyuser_nickname: '',
      efairyuser_phonenumber: '',
      id: 1
    }
  ]
  private userIndexSeed: number = 1;

  constructor(private zone: NgZone, private _location: Location, private projectSerive: ProjectService, private route: ActivatedRoute, private router: Router) { }



  ngOnInit() {
    // this.initAmap();
    this.initDeviceCode();

    this.route.params.subscribe(params => {
      this.projectId = params.proejct_id;
      this.deviceId=params.device_id;
      this.getProjectDeviceDetailsManage();
    });

  }

  getProjectDeviceDetailsManage(){
    return this.projectSerive.getProjectDeviceDetailsManage(this.projectId,this.deviceId).then((data)=>{
      this.deviceInfo=data;
      this.setAddress=data.efairydevice_address;
      this.deviceLng=data.efairydevice_location_lng;
      this.deviceLat=data.efairydevice_location_lat;
      this.deviceDesc=data.efairydevice_description;
      this.deviceInstallTime=data.efairydevice_install_time;
      this.formatDeviceUuid(data.efairydevice_uuid);

      this.deviceTypeList.forEach((item:any,index:number)=>{
        if(item.value==data.efairydevice_device_type_id){
          this.deviceType=this.deviceTypeList[index];
        }
      })

      this.initAmap(data.efairydevice_location_lng,data.efairydevice_location_lat);

    }).catch((e)=>{
      alert(e||'出错了！请联系管理员')
    })
  }

  formatDeviceUuid(uuid){
    this.deviceMasterCode=uuid.slice(0,20);
    this.followCode1=parseInt(uuid.slice(20,22),16);
    this.followCode2=parseInt(uuid.slice(22,24),16);
    this.followCode3=parseInt(uuid.slice(24,26),16);
  }

  fetchMasterCodeSuggestObservable(keyword: any): Observable<any[]> {
    if (keyword) {
      return this.projectSerive.getProjectDeviceIotCardListManageObservable(keyword).map(res => {
        let json = res.json();
        return json.result.efairyiotcard_list;
      });
    } else {
      return Observable.of([]);
    }
  }



  editProjectDevice() {
    const opts = {
      efairydevice_id:this.deviceId,
      efairydevice_uuid: [
        this.deviceMasterCode,
        Number(this.followCode1).toString(16).length < 2 ? '0' + Number(this.followCode1).toString(16) : Number(this.followCode1).toString(16),
        Number(this.followCode2).toString(16).length < 2 ? '0' + Number(this.followCode2).toString(16) : Number(this.followCode2).toString(16),
        Number(this.followCode3).toString(16).length < 2 ? '0' + Number(this.followCode3).toString(16) : Number(this.followCode3).toString(16),
      ].join(''),
      efairydevice_name: this.deviceInfo.efairydevice_name,
      efairydevice_location_lng: this.deviceLng,
      efairydevice_location_lat: this.deviceLat,
      efairydevice_description: this.deviceDesc,
      efairydevice_address: this.setAddress,
      efairydevice_install_time: this.deviceInstallTime,
      efairydevice_project_id: this.projectId,
      efairydevice_device_type_id: this.deviceType['value'],
      efairydevice_belong_system: 10
    }

    if (!this.deviceInfo.efairydevice_name || !this.deviceMasterCode) return alert('请把资料填写完整');

    this.projectSerive.editProjectDeviceManage(opts).then(r => {
      alert('修改成功！');
      // this.router.navigate(['../'], { queryParams: { type: 3 } });
      this._location.back();
    }).catch(e => {
      alert(e.msg || '设备号码已被使用');
    });



  }

  goBack() {
    this._location.back();
  }

  initDeviceCode() {
    this.followCode1List = this.fillFollowCodeList(8);
    this.followCode2List = this.fillFollowCodeList(4);
    this.followCode3List = this.fillFollowCodeList(254);

    Object.keys(myGlobal.deviceTypeHash).forEach((item) => {
      this.deviceTypeList.push({
        value: item,
        name: myGlobal.deviceTypeHash[item],
        special: (item == '8' || item == '10' || item == '14') ? true : false
      })
    })
    this.deviceType = this.deviceTypeList[0];
  }

  deviceTypeChange() {
    if (this.deviceType['special']) {
      this.followCode1 = 1;
      this.followCode2 = 1;
      this.followCode3 = 1;
    }
  }

  fillFollowCodeList(max: number) {
    const result = [];
    for (let i = 1; i <= max; i++) {
      result.push(i);
    }
    return result;
  }

  initAmap(lng,lat) {

    this.bigMap = new AMap.Map('map', {
      resizeEnable: true,
      zoom: 13,
      center:[lng,lat]
    });



    AMap.plugin(['AMap.Autocomplete', 'AMap.PlaceSearch'], () => {
      var autoOptions = {
        input: "address"//使用联想输入的input的id
      };
      const autocomplete = new AMap.Autocomplete(autoOptions);
      var placeSearch = new AMap.PlaceSearch({
        city: '',
        map: this.bigMap
      });
      AMap.event.addListener(autocomplete, "select", (e) => {
        //TODO 针对选中的poi实现自己的功能
        // console.log(e);

        const centerPoint = new AMap.LngLat(e.poi.location.lng, e.poi.location.lat);
        if (e.poi.location != '') {
          this.positionPicker.start(centerPoint)
        }
      });
    });

    AMapUI.loadUI(['misc/PositionPicker'], (PositionPicker) => {
      this.positionPicker = new PositionPicker({
        mode: 'dragMarker',
        map: this.bigMap
      });
      this.positionPicker.on('success', (positionResult) => {

        this.zone.run(() => {
          this.setAddress = positionResult.address;
          this.deviceLng = positionResult.position.lng;
          this.deviceLat = positionResult.position.lat;
        })

      });
      this.positionPicker.on('fail', (positionResult) => {
        // console.log(positionResult);
      });
      
      this.positionPicker.start(new AMap.LngLat(lng,lat));
    });


  }


}
