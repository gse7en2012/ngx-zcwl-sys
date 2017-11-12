import { Component, OnInit, NgZone } from '@angular/core';
import { ProjectService } from '../../service/project.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Location } from '@angular/common';
import * as myGlobal from '../../global/globals';


declare var AMap;
declare var AMapUI;
declare var moment;


@Component({
  selector: 'app-new-project',
  templateUrl: './new-project.component.html',
  styleUrls: ['./new-project.component.scss']
})
export class NewProjectComponent implements OnInit {

  public bigMap: any;
  public positionPicker: any;
  public projectInfo: any = {
    efairyproject_name: '',
    efairyproject_user_name: '',
    efairyproject_user_phonenumber: '',
    efairyproject_address: '',
    efairyproject_location_lng: '',
    efairyproject_location_lat: '',
    efairyproject_description: '',
    efairyproject_fee_type: '1',
    lv2_agency_id: ''
  };

  constructor(private zone: NgZone, private _location: Location, private projectSerive: ProjectService, private route: ActivatedRoute, private router: Router) { }


  ngOnInit() {
    this.initAmap();
    this.route.params.subscribe(params => {
      this.projectInfo.lv2_agency_id = params.agency_id;
    });
  }

  addNewProject() {
    console.log(this.projectInfo);
    this.projectSerive.addProject(this.projectInfo).then(() => {
      alert('添加成功');
      this._location.back();
    }).catch((e) => {
      alert('添加失败，请联系管理员!')
    })
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
          this.projectInfo.efairyproject_address = positionResult.address;
          this.projectInfo.efairyproject_location_lng = positionResult.position.lng;
          this.projectInfo.efairyproject_location_lat = positionResult.position.lat;
        })

      });
      this.positionPicker.on('fail', (positionResult) => {
        // console.log(positionResult);
      });
      this.positionPicker.start();
    });


  }

}
