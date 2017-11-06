import { Component, OnInit, NgZone } from '@angular/core';
import { ProjectService } from '../../service/project.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Location } from '@angular/common';
import * as myGlobal from '../../global/globals';

declare var AMap;
declare var AMapUI;
declare var moment;

@Component({
  selector: 'app-new-device',
  templateUrl: './new-device.component.html',
  styleUrls: ['./new-device.component.scss']
})
export class NewDeviceComponent implements OnInit {

  public bigMap;
  public deviceInfo: any = {};

  public projectId: string;
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

  public deviceMasterCode: string;
  public deviceName: string;
  public deviceDesc: string;


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
    this.initAmap();
    this.initDeviceCode();

    this.route.params.subscribe(params => {
      this.projectId = params.proejct_id;
    });

  }

  addUserToUserList() {
    this.userIndexSeed++;
    this.userList.push({
      efairyuser_nickname: '',
      efairyuser_phonenumber: '',
      id: this.userIndexSeed
    })
  }

  removeUserFromUserList(user) {
    this.userList = this.userList.filter((item: any) => {
      return item.id !== user.id;
    })
  }

  addProjectDevice() {
    const opts = {
      efairydevice_uuid: [
        this.deviceMasterCode,
        Number(this.followCode1).toString(16),
        Number(this.followCode2).toString(16),
        Number(this.followCode3).toString(16)
      ].join(''),
      efairyuser_info_list: [],
      efairydevice_name: this.deviceName,
      efairydevice_location_lng: this.deviceLng,
      efairydevice_location_lat: this.deviceLat,
      efairydevice_description: this.deviceDesc,
      efairydevice_address: this.setAddress,
      efairydevice_install_time: moment().format('YYYY-MM-DD HH:mm:ss'),
      efairydevice_project_id: this.projectId,
      efairydevice_device_type_id: this.deviceType['value'],
      efairydevice_belong_system: 10
    }

    this.userList.forEach((item: any) => {
      if (item.efairyuser_nickname != '' && item.efairyuser_phonenumber != '') {
        opts.efairyuser_info_list.push(item);
      }
    })

    console.log(opts);



    if (true) {
      this.projectSerive.addProjectDeviceManage(opts).then(r => {
        alert('添加成功！');
        // this.router.navigate(['../'], { queryParams: { type: 3 } });
        this._location.back();
      });
    }


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

  initAmap() {

    this.bigMap = new AMap.Map('map', {
      resizeEnable: true,
      zoom: 13,
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
        // console.log(positionResult);
        this.zone.run(() => {
          this.setAddress = positionResult.address;
          this.deviceLng = positionResult.position.lng;
          this.deviceLat = positionResult.position.lat;
        })

      });
      this.positionPicker.on('fail', (positionResult) => {
        // console.log(positionResult);
      });
      this.positionPicker.start();
    });


  }

}
