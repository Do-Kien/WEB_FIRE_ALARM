import { INavData } from '@coreui/angular';

export const navItems: INavData[] = [
  {
    name: 'Home',
    url: '/home',
    iconComponent: { name: 'cil-home' },
    badge: {
      color: 'info',
      text: ''
    },
    children: [
      {
        name: 'Dashboard',
        url: '/home/dashboards',
      },
      // {
      //   name: 'Điều khiển',
      //   url: '/home/controls',
      // }
    ]
  },

  // {
  //   name: 'Cài đặt',
  //   url: '/setting',
  //   iconComponent: { name: 'cil-settings' },
  //   badge: {
  //     color: 'info',
  //     text: ''
  //   },
  //   children: [
  //     {
  //       name: 'Lịch',
  //       url: '/setting/schedules',
  //     },
  //     {
  //       name: 'Kịch bản',
  //       url: '/setting/scripts',
  //     },
  //     {
  //       name: 'Luật điều khiển',
  //       url: '/setting/rules',
  //     },
  //   ]
  // },

  {
    name: 'Quản lý',
    url: '/manager',
    iconComponent: { name: 'cil-layers' },
    badge: {
      color: 'info',
      text: ''
    },
    children: [
      // {
      //   name: 'Nhà kính',
      //   url: '/manager/farms',
      // },
      {
        name: 'Gateway',
        url: '/manager/gateway',
      },
      // {
      //   name: 'Khu vực',
      //   url: '/manager/zones',
      // },
      // {
      //   name: 'Cảm biến',
      //   url: '/manager/sensors',
      // },
      // {
      //   name: 'Thiết bị',
      //   url: '/manager/devices',
      // },
      // {
      //   name: 'Tài khoản',
      //   url: '/manager/users',
      // },
    ]
  },
];
