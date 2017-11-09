import { Component, OnInit } from '@angular/core';
import { ProjectService } from '../service/project.service';
import { DeviceService } from '../service/device.service';
import * as myGlobals from '../global/globals';

declare var AMap;
declare var AMapUI;
declare var moment;

@Component({
  selector: 'app-dashboard-page',
  templateUrl: './dashboard-page.component.html',
  styleUrls: ['./dashboard-page.component.scss'],
  providers: [ProjectService, DeviceService]
})
export class DashboardPageComponent implements OnInit {

  public bigMap: any;
  public rightMap: any;
  public bottomMap: any;
  public projectList: object[];
  public locationPointLngLat: string[];
  public deviceAlarmData: any;
  public rightChartOption: any;
  public leftChartOption: any;
  public servicePlaceTime: string;
  private dataHash = myGlobals.dataHash;
  private stateHash = myGlobals.stateHash;

  constructor(private projectService: ProjectService, private deviceService: DeviceService) { }
  //API http://lbs.amap.com/api/javascript-api/reference-amap-ui/geo/district-cluster#render
  ngOnInit() {
    this.bigMap = new AMap.Map('l-map', {
      resizeEnable: true,
      zoom: 12,
      mapStyle: "amap://styles/grey"
    });




    this.rightMap = new AMap.Map('r-map', {
      zoomEnable: true,
      dragEnable: true,
      zoom: 6,
      zooms: [4, 12],
      features: ['bg', 'point'],
      mapStyle: "amap://styles/darkblue"
    });


    this.rightMap.on('fire', (data) => {
      this.bigMap.setCenter([data.lng, data.lat])
    })
    // AMap.event.addListener(this.rightMap, 'click', () => {
    //   this.rightMap.emit('fire');
    // })


    // this.testRenderMapPolygon();
    this.testMapCluster();
    this.testClickMap();
    this.getAllProject();

    this.getLastAlarmDevice();
    this.getProjectReport();
  }

  testRenderMapPolygon() {
    AMap.service('AMap.DistrictSearch', () => {
      const opts = {
        subdistrict: 1,   //返回下一级行政区
        extensions: 'all',  //返回行政区边界坐标组等具体信息
        level: 'city'  //查询行政级别为 市
      };
      const district = new AMap.DistrictSearch(opts);
      district.setLevel('district');
      //行政区查询
      district.search('中国', (status, result) => {
        var bounds = result.districtList[0].boundaries;
        var polygons = [];
        if (bounds) {
          for (var i = 0, l = bounds.length; i < l; i++) {
            //生成行政区划polygon
            var polygon = new AMap.Polygon({
              map: this.rightMap,
              strokeWeight: 1,
              path: bounds[i],
              fillOpacity: 0.7,
              fillColor: '#CCF3FF',
              strokeColor: '#CC66CC'
            });
            polygons.push(polygon);
            AMap.event.addListener(polygons, 'click', () => {
              this.rightMap.emit('fire');
            })
          }
          this.rightMap.setFitView();//地图自适应
        }
      });
    })
  }


  testClickMap() {
    var colors = [
      "#3366cc", "#1cc3d7", "#482dbb", "#109618", "#990099", "#0099c6", "#dd4477", "#66aa00",
      "#b82e2e", "#316395", "#994499", "#22aa99", "#aaaa11", "#6633cc", "#e67300", "#8b0707",
      "#651067", "#329262", "#5574a6", "#3b3eac"
    ];

    AMapUI.load(['ui/geo/DistrictExplorer', 'lib/$'], (DistrictExplorer, $) => {

      //创建一个实例
      var districtExplorer = new DistrictExplorer({
        map: this.rightMap
      });
      this.rightMap.on('click', (e) => {
        console.log(e);

        districtExplorer.locatePosition(e.lnglat, (err, features) => {          
          if (err) {
            console.error(err);
            return;
          }
          const cityCenter = features[2].properties.center;
          this.rightMap.emit('fire', {
            // lat: cityCenter[1],
            // lng: cityCenter[0]
            lat: e.lnglat.lat,
            lng: e.lnglat.lng
          });
          renderFeatures(features);
        }, {
            levelLimit: 3
          });
      })
      function renderFeatures(features) {
        //清除已有的绘制内容
        console.log(features)
        districtExplorer.clearFeaturePolygons();
        for (var i = 0, len = features.length; i < len; i++) {
          var strokeColor = colors[i % colors.length];
          var fillColor = strokeColor;
          districtExplorer.renderFeature(features[i], {
            cursor: 'default',
            bubble: true,
            strokeColor: strokeColor, //线颜色
            strokeOpacity: 1, //线透明度
            strokeWeight: 1, //线宽
            fillColor: fillColor, //填充色
            fillOpacity: 0.35, //填充透明度
          });
        }
      }
    });
  }


  testMapCluster() {
    AMapUI.load(['ui/geo/DistrictCluster', 'lib/$'], (DistrictCluster, $) => {
      const distCluster = new DistrictCluster({
        map: this.rightMap, //所属的地图实例
        excludedAdcodes: [810000, 820000],
        autoSetFitView: false,
        renderOptions: {
          featureEventSupport: true,
          clusterMarkerEventSupport: true,
          featureClickToShowSub: true,
          //标注信息Marker上需要监听的事件
          clusterMarkerEventNames: ['click'],
          featureStyle: {
            lineWidth: 1,
            strokeStyle: '#999'
          },
          featureStyleByLevel: {
            // country: {
            //   fillStyle: 'rgba(51,102,204,0.35)'
            // },
            province: {
              fillStyle: 'rgba(51,102,204,0.35)'
            },
            city: {
              fillStyle: 'rgba(23, 26, 30, 0.6)'
            },
            district: {
              fillStyle: 'rgba(199, 233, 192, 0.5)'
            }
          }
        },
        getPosition: function (item) {
          if (!item) {
            return null;
          }
          var parts = item.split(',');
          //返回经纬度
          return [parseFloat(parts[0]), parseFloat(parts[1])];
        }
      });

      distCluster.setData(this.locationPointLngLat)
    });
  }


  getProjectReport() {
    this.projectService.getProjectMonitorData().then((data) => {
      console.log(data);
      this.setServiceChartDataOpts(data.service_data);
      this.setServiceChartRightDataOpts(data.alarm_record);
    })
  }

  setServiceChartDataOpts(serviceData) {

    this.servicePlaceTime = Array.prototype.slice.call(serviceData.efairyfieldservice_times.toString()).map(item => {
      const klass = {};
      klass['num' + item] = true;
      return {
        klass: klass,
        v: item
      }
    })


    this.leftChartOption = {
      tooltip: {
        trigger: 'item',
        formatter: "{a} <br/>{b}: {c} ({d}%)"
      },
      legend: {
        orient: 'vertical',
        x: 'right',
        itemWidth: 14,
        itemHeight: 14,
        textStyle: {
          color: '#eee',
          fontSize: 14
        },
        data: [
          '未处理报警 ' + serviceData.efairyalarmrecord_unhandle_times + ' 次',
          '排除电气隐患 ' + serviceData.efairyhiddendanger_fixed_times + ' 次',
          '待排除电气隐患 ' + serviceData.efairyhiddendanger_number + ' 次',
          '维护 ' + serviceData.efairymtrecord_times + ' 次',
        ]
      },
      series: [
        {
          name: '数据详情',
          type: 'pie',
          radius: ['46%', '70%'],
          center: ['35%', '50%'],
          avoidLabelOverlap: false,
          label: {
            normal: {
              show: false,
              position: 'center'
            },
            emphasis: {
              show: true,
              textStyle: {
                fontSize: '18',
                fontWeight: 'bold'
              }
            }
          },
          labelLine: {
            normal: {
              show: false
            }
          },
          data: [
            { value: serviceData.efairyalarmrecord_unhandle_times, name: '未处理报警 ' + serviceData.efairyalarmrecord_unhandle_times + ' 次' },
            { value: serviceData.efairyhiddendanger_fixed_times, name: '排除电气隐患 ' + serviceData.efairyhiddendanger_fixed_times + ' 次' },
            { value: serviceData.efairyhiddendanger_number, name: '待排除电气隐患 ' + serviceData.efairyhiddendanger_number + ' 次' },
            { value: serviceData.efairymtrecord_times, name: '维护 ' + serviceData.efairymtrecord_times + ' 次' },

          ]
        }
      ]
    }

  }

  setServiceChartRightDataOpts(data) {
    this.rightChartOption = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      legend: {
        // data: ['2011年', '2012年'],
        textStyle: {
          color: '#aaa'
        },
      },
      grid: {
        left: '5%',
        right: '7%',
        bottom: '8%',
        top: '8%',
        containLabel: true,
        backgroundColor: "transparent"
      },
      xAxis: {
        type: 'value',
        boundaryGap: [0, 0.01],
        splitLine: {
          show: false
        },
        // splitArea: {
        //   show: true
        // }
      },
      yAxis: {
        type: 'category',
        data: [
          {
            value: '接入点位',
            textStyle: {
              color: '#d78716',
              fontSize: 14
            }
          },
          {
            value: '报警点位',
            textStyle: {
              color: '#d11e5b',
              fontSize: 14
            }
          },
          {
            value: '报警数',
            fontSize: 14
          },

        ]
      },
      series: [
        {
          // name: '2012年',
          type: 'bar',
          barWidth: '35%',
          data: [
            {
              value: data.efairydevice_number,
              itemStyle: {
                normal: {
                  color: '#d78716'
                }
              }
            },
            {
              value: data.efairydevice_alarm_device_number,
              itemStyle: {
                normal: {
                  color: '#d11e5b'
                }
              }
            },
            {
              value: data.efairydevice_alarm_times,

            },

          ]
        }
      ]
    };
  }

  getLastAlarmDevice() {
    this.deviceService.getLastDeviceAlarmData().then((data) => {
      this.deviceAlarmData = data.device_alarm_data_list;
      this.deviceAlarmData.forEach((item) => {
        item.blueTime = moment(item.efairydevicefiredata_time).format('MM-DD');
        item.spanTime = moment(item.efairydevicefiredata_time).format('HH:mm');
        item.state = this.stateHash[item.efairydevicefiredata_state];
        item.ss = this.dataHash[item.efairydevicefiredata_parameter][0]
      })
    })
  }

  getAllProject() {
    this.projectService.getAllProjectList().then((data) => {
      this.projectList = data.project_list;
      this.locationPointLngLat = this.projectList.map((row) => {
        return [row['efairyproject_location_lng'], row['efairyproject_location_lat']].join(',')
      })
      return data.project_list;
    }).then(list => {
      this.drawMap(list);
    });
  }

  drawMap(pointList) {

    pointList.forEach((point, index) => {
      if (index === 0) this.bigMap.setCenter([point.efairyproject_location_lng, point.efairyproject_location_lat])
      const pointMaker = new AMap.Marker({
        map: this.bigMap,
        position: [point.efairyproject_location_lng, point.efairyproject_location_lat],
        title: point.efairyproject_name,
        icon: new AMap.Icon({
          size: new AMap.Size(30, 30),  //图标大小
          image: "assets/image/building_green.png",
        })
      });
    })

  }

}
