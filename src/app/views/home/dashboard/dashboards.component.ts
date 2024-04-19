import { Component, OnInit, ViewChild } from '@angular/core';
import { ApexChart, ApexDataLabels, ApexNonAxisChartSeries, ApexTitleSubtitle } from 'ng-apexcharts';

import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexXAxis,
  ApexTooltip,
  ApexStroke
} from "ng-apexcharts";
import { AuthService } from 'src/app/services/api/auth/auth.service';
import { ManagerDeviceService } from 'src/app/services/api/manager-device/manager-device.service';
import { ManagerFarmsService } from 'src/app/services/api/manager-farms/manager-farms.service';
import { ManagerGreenhousesService } from 'src/app/services/api/manager-greenhouses/manager-greenhouses.service';
import { ManagerZonesService } from 'src/app/services/api/manager-zones/manager-zones.service';
import { GreenhouseData } from 'src/app/models/greenhouse.model';
import { ZoneList } from '../../manager/zone/zones.component';
import { DeviceData } from '../../manager/device/devices.component';
import * as ApexCharts from 'apexcharts';
import { TelemetryWebsocketService } from 'src/app/services/websocket/telemetry-websocket.service';
import { WebsocketService } from 'src/app/services/websocket/websocket.service';
import { ManagerSensorsService } from 'src/app/services/api/manager-sensors/manager-sensors.service';
import { SensorData } from '../../manager/sensor/sensors.component';


export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  stroke: ApexStroke;
  tooltip: ApexTooltip;
  dataLabels: ApexDataLabels;
};

@Component({
  selector: 'app-dashboards',
  templateUrl: './dashboards.component.html',
  styleUrls: ['./dashboards.component.scss']
})
export class DashboardsComponent implements OnInit {

  chartSeriesDevice: ApexNonAxisChartSeries = [0, 0];
  chartSeriesSensor: ApexNonAxisChartSeries = [0, 0];

  chartDetails: ApexChart = {
    type: 'donut',
    toolbar: {
      show: false
    }
  };

  chartLabelsSensor = ["Online", "Offline"];
  chartLabelsDevice = ["Đang bật", "Đang tắt"];

  chartTitleSensor: ApexTitleSubtitle = {
    text: 'Cảm biến',
    align: 'left'
  };

  chartTitleDevice: ApexTitleSubtitle = {
    text: 'Thiết bị',
    align: 'left'
  };

  chartDataLabels: ApexDataLabels = {
    enabled: true,
    // style: {
    //   colors: ['green', 'red']
    // }
  };

  public chartOptions: Partial<ChartOptions> | any;
  public chartOptionsDevice: Partial<ChartOptions> | any;
  public chartOptionsSensor: Partial<ChartOptions> | any;
  public chartColumn: Partial<ChartOptions> | any;
  public chartLine: Partial<ChartOptions> | any;

  currentFarm: string = '';
  currentUser: string = '';
  currentGreenhouse: string = '';
  greenhouses: GreenhouseData[] = [];
  active?: string;
  greenhouseActiveData: GreenhouseData[] = [{id: '', name: '', mac: '', farmId: '', mode: '', active: false, createdAt: '', deviceProfileId: "", deviceProfileName: ""}];
  optionZoneAll: ZoneList[] = [{id: "", name: "Tất cả"}];
  filterZoneAll: any = this.optionZoneAll[0].id;
  DeviceList: DeviceData[] = [];
  devices: DeviceData[] = [];
  SensorList: SensorData[] = [];
  sensors = this.SensorList;
  listseries:any = [];

  constructor(private authObj: AuthService, 
    private farmObj: ManagerFarmsService,
    private zoneObj: ManagerZonesService,
    private deviceObj: ManagerDeviceService,
    private greenhouseObj: ManagerGreenhousesService,
    private telemetryService: TelemetryWebsocketService,
    private sensorObj: ManagerSensorsService
    ) {
    this.initChartApex();
    this.initChartDevice();
    this.initChartSensor();
    this.initChartColumn();
    this.initChartLine();
  }

  ngOnInit(): void {    
  } 

  initChartLine(){
    this.chartLine = {
      series: [
        {
          name: "Website Blog",
          type: "column",
          data: [440, 505, 414, 671, 227, 413, 201, 352, 752, 320, 257, 160]
        },
        {
          name: "Social Media",
          type: "line",
          data: [23, 42, 35, 27, 43, 22, 17, 31, 22, 22, 12, 16]
        }
      ],
      chart: {
        height: 300,
        type: "line"
      },
      stroke: {
        width: [0, 4]
      },
      title: {
        text: "Traffic Sources"
      },
      dataLabels: {
        enabled: true,
        enabledOnSeries: [1]
      },
      labels: [
        "01 Jan 2001",
        "02 Jan 2001",
        "03 Jan 2001",
        "04 Jan 2001",
        "05 Jan 2001",
        "06 Jan 2001",
        "07 Jan 2001",
        "08 Jan 2001",
        "09 Jan 2001",
        "10 Jan 2001",
        "11 Jan 2001",
        "12 Jan 2001"
      ],
      xaxis: {
        type: "datetime"
      },
      yaxis: [
        {
          title: {
            text: "Website Blog"
          }
        },
        {
          opposite: true,
          title: {
            text: "Social Media"
          }
        }
      ]
    };
  }

  initChartColumn(){
    this.chartColumn = {
      series: [
        {
          name: "Net Profit",
          data: [44, 55, 57, 56, 61, 58, 63, 60, 66]
        },
        {
          name: "Revenue",
          data: [76, 85, 101, 98, 87, 105, 91, 114, 94]
        },
        {
          name: "Free Cash Flow",
          data: [35, 41, 36, 26, 45, 48, 52, 53, 41]
        }
      ],
      chart: {
        type: "bar",
        height: 300
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: "55%",
          endingShape: "rounded"
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        show: true,
        width: 2,
        colors: ["transparent"]
      },
      xaxis: {
        categories: [
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct"
        ]
      },
      yaxis: {
        title: {
          text: "$ (thousands)"
        }
      },
      tooltip: {
        // y: {
        //   formatter: function(val) {
        //     return "$ " + val + " thousands";
        //   }
        // }
      }
    };
  }
  
  initChartApex(){
    this.chartOptions = {
      series: [
        {
          name: "series1",
          data: [31, 40, 28, 51, 42, 109, 100]
        },
        {
          name: "series2",
          data: [11, 32, 45, 32, 34, 52, 41]
        }
      ],
      chart: {
        height: 300,
        type: "area"
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: "smooth"
      },
      xaxis: {
        type: "datetime",
        categories: [
          "2018-09-19T00:00:00.000Z",
          "2018-09-19T01:30:00.000Z",
          "2018-09-19T02:30:00.000Z",
          "2018-09-19T03:30:00.000Z",
          "2018-09-19T04:30:00.000Z",
          "2018-09-19T05:30:00.000Z",
          "2018-09-19T06:30:00.000Z"
        ]
      },
      tooltip: {
        x: {
          format: "dd/MM/yy HH:mm"
        }
      }
    };
  }

  initChartDevice(){
    this.chartOptionsDevice = {
      series: this.chartSeriesDevice,
      chart: this.chartDetails,
      labels: this.chartLabelsDevice,
      colors: ['green', 'red'],
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200
            },
            legend: {
              position: "bottom"
            }
          }
        }
      ],
      plotOptions: {
        pie: {
          donut: {
            size: '65%',
            value: {
              colors: ['#00E396', '#E30000'],
            }
          },
          customScale: 0.9
        }
      }
    }
  }

  initChartSensor(){
    this.chartOptionsSensor = {
      series: this.chartSeriesSensor,
      chart: this.chartDetails,
      labels: this.chartLabelsSensor,
      // colors: ['#546E7A', '#E91E63'],      
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200
            },
            legend: {
              position: "bottom"
            }
          }
        }
      ],
      plotOptions: {
        pie: {
          donut: {
            size: '65%',
            value: {
              colors: ['#00E396', '#E30000'],
            }
          },
          customScale: 0.8
        }
      }
      
    }
  }

}