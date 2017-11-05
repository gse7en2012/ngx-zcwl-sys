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

  private dataHash = myGlobals.dataHash;
  private stateHash = myGlobals.stateHash;

  constructor(private projectService: ProjectService, private deviceService: DeviceService) { }
  //API http://lbs.amap.com/api/javascript-api/reference-amap-ui/geo/district-cluster#render
  ngOnInit() {
    this.bigMap = new AMap.Map('l-map', {
      resizeEnable: true,
      zoom: 10,
      mapStyle: "amap://styles/grey"
    });

    this.rightChartOption = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      legend: {
        data: ['2011年', '2012年'],
        textStyle: {
          color: '#aaa'
        },
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true,
        backgroundColor:"transparent"
      },
      xAxis: {
        type: 'value',
        boundaryGap: [0, 0.01]
      },
      yAxis: {
        type: 'category',
        data: ['巴西', '印尼', '美国', '印度', '中国', '世界人口(万)']
      },
      series: [
        {
          name: '2011年',
          type: 'bar',
          data: [18203, 23489, 29034, 104970, 131744, 630230]
        },
        {
          name: '2012年',
          type: 'bar',
          data: [19325, 23438, 31000, 121594, 134141, 681807]
        }
      ]
    };

    this.leftChartOption = {
      tooltip: {
        trigger: 'item',
        formatter: "{a} <br/>{b}: {c} ({d}%)"
      },
      legend: {
        orient: 'vertical',
        x: 'right',
        textStyle: {
          color: '#aaa'
        },
        data: ['直接访问', '邮件营销', '联盟广告', '视频广告', '搜索引擎']
      },
      series: [
        {
          name: '访问来源',
          type: 'pie',
          radius: ['50%', '70%'],
          avoidLabelOverlap: false,
          label: {
            normal: {
              show: false,
              position: 'center'
            },
            emphasis: {
              show: true,
              textStyle: {
                fontSize: '30',
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
            { value: 335, name: '直接访问' },
            { value: 310, name: '邮件营销' },
            { value: 234, name: '联盟广告' },
            { value: 135, name: '视频广告' },
            { value: 1548, name: '搜索引擎' }
          ]
        }
      ]
    }

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

        districtExplorer.locatePosition(e.lnglat, (err, features) => {
          if (err) {
            console.error(err);
            return;
          }
          const cityCenter = features[2].properties.center;
          this.rightMap.emit('fire', {
            lat: cityCenter[1],
            lng: cityCenter[0]
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
