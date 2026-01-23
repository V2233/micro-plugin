export const constantRoute = [
  {
    name: 'Layout',
    path: '/',
    component: () => import('@/layout/index.vue'),
    redirect: '/home',
    meta: {
      title: '',
      hidden: false,
      icon: 'Avatar',
    },
    children: [
      {
        name: 'Home',
        path: '/home',
        component: () => import('@/views/home/index.vue'),
        meta: {
          title: '首页',
          hidden: false,
          icon: 'HomeFilled',
        },
      },
    ],
  },
  {
    name: 'Login',
    path: '/login',
    component: () => import('@/views/login/index.vue'),
    meta: {
      title: '登录',
      hidden: true,
      icon: 'Promotion',
    },
  },
  {
    name: '404',
    path: '/404',
    component: () => import('@/views/404/index.vue'),
    meta: {
      title: '404',
      hidden: true,
      icon: 'DocumentDelete',
    },
  },
];

//异步路由
export const asnycRoute = [
  {
    name: 'Screen',
    path: '/screen',
    component: () => import('@/layout/index.vue'),
    redirect: '/screen/status',
    meta: {
      title: '数据监控',
      hidden: false,
      icon: 'DataAnalysis',
    },
    children: [
      {
        name: 'Status',
        path: '/screen/status',
        component: () => import('@/views/screen/status/index.vue'),
        meta: {
          title: '状态',
          hidden: false,
          icon: 'Platform',
        },
      },
      {
        name: 'Logs',
        path: '/screen/logs',
        component: () => import('@/views/screen/logs/index.vue'),
        meta: {
          title: '日志',
          hidden: false,
          icon: 'Calendar',
        },
      },
      {
        name: 'Stdout',
        path: '/screen/stdout',
        component: () => import('@/views/screen/stdout/index.vue'),
        meta: {
          title: '输出流',
          hidden: false,
          icon: 'DataLine',
        },
      },
    ],
  },
  {
    name: 'Dev',
    path: '/dev',
    component: () => import('@/layout/index.vue'),
    redirect: '/dev/fs',
    meta: {
      title: '开发管理',
      hidden: false,
      icon: 'Star',
    },
    children: [
      {
        name: 'Fs',
        path: '/dev/fs',
        component: () => import('@/views/dev/fs/index.vue'),
        meta: {
          title: '文件',
          hidden: false,
          icon: 'FolderOpened',
        },
      },
      {
        name: 'Plugin',
        path: '/dev/plugin',
        component: () => import('@/views/dev/plugin/index.vue'),
        meta: {
          title: '开发',
          hidden: false,
          icon: 'ChromeFilled',
        },
      },
      {
        name: 'Sandbox',
        path: '/dev/sandbox',
        component: () => import('@/views/dev/sandbox/index.vue'),
        meta: {
          title: '沙箱',
          hidden: false,
          icon: 'Promotion',
        },
      },
      {
        name: 'Database',
        path: '/dev/database',
        component: () => import('@/views/dev/database/index.vue'),
        meta: {
          title: '数据库',
          hidden: false,
          icon: 'Coin',
        },
      },
    ],
  },
  {
    name: 'Config',
    path: '/config',
    component: () => import('@/layout/index.vue'),
    redirect: '/config/bot',
    meta: {
      title: '配置编辑',
      hidden: false,
      icon: 'Edit',
    },
    children: [
      {
        name: 'Bot',
        path: '/config/bot',
        component: () => import('@/views/config/bot/index.vue'),
        meta: {
          title: 'Bot配置',
          hidden: false,
          icon: 'PartlyCloudy',
        },
      },
      {
        name: 'Plugins',
        path: '/config/plugins',
        component: () => import('@/views/config/plugins/index.vue'),
        meta: {
          title: '插件配置',
          hidden: false,
          icon: 'HelpFilled',
        },
      },
      {
        name: 'Protocol',
        path: '/config/protocol',
        component: () => import('@/views/config/protocol/index.vue'),
        meta: {
          title: '协议配置',
          hidden: false,
          icon: 'Iphone',
        },
      },
    ],
  },
  {
    name: 'Other',
    path: '/other',
    component: () => import('@/layout/index.vue'),
    redirect: '/other/permission',
    meta: {
      title: '其它',
      hidden: false,
      icon: 'Setting',
    },
    children: [
      {
        name: 'Permission',
        path: '/other/permission',
        component: () => import('@/views/other/permission/index.vue'),
        meta: {
          title: '权限管理',
          hidden: false,
          icon: 'UserFilled',
        },
      },
      {
        name: 'About',
        path: '/other/about',
        component: () => import('@/views/other/about/index.vue'),
        meta: {
          title: '关于',
          hidden: false,
          icon: 'InfoFilled',
        },
      },
    ],
  },
  // {
  //   name: 'Login',
  //   path: '/login',
  //   component: () => import('@/views/login/index.vue'),
  //   meta: {
  //     title: '登录',
  //     hidden: true,
  //     icon: 'Promotion',
  //   },
  // },
];

//任意路由
export const anyRoute = {
  //任意路由
  path: '/:pathMatch(.*)*',
  redirect: '/404',
  name: 'Any',
  meta: {
    title: '任意路由',
    hidden: true,
    icon: 'DataLine',
  },
};

// 备份下
// export const constantRoute = [
//   {
//     name: 'Layout',
//     path: '/',
//     component: () => import('@/layout/index.vue'),
//     redirect: '/home',
//     meta: {
//       title: '',
//       hidden: false,
//       icon: 'Avatar',
//     },
//     children: [
//       {
//         name: 'Home',
//         path: '/home',
//         component: () => import('@/views/home/index.vue'),
//         meta: {
//           title: '首页',
//           hidden: false,
//           icon: 'HomeFilled',
//         },
//       },
//     ],
//   },
//   {
//     name: 'Screen',
//     path: '/screen',
//     component: () => import('@/layout/index.vue'),
//     redirect: '/screen/status',
//     meta: {
//       title: '数据监控',
//       hidden: false,
//       icon: 'DataAnalysis',
//     },
//     children: [
//       {
//         name: 'Status',
//         path: '/screen/status',
//         component: () => import('@/views/screen/index.vue'),
//         meta: {
//           title: '状态',
//           hidden: false,
//           icon: 'Platform',
//         },
//       },
//       {
//         name: 'Logs',
//         path: '/screen/logs',
//         component: () => import('@/views/screen/logs/index.vue'),
//         meta: {
//           title: '日志',
//           hidden: false,
//           icon: 'Calendar',
//         },
//       },
//     ],
//   },
//   {
//     name: 'Dev',
//     path: '/dev',
//     component: () => import('@/layout/index.vue'),
//     redirect: '/dev/fs',
//     meta: {
//       title: '开发管理',
//       hidden: false,
//       icon: 'Star',
//     },
//     children: [
//       {
//         name: 'Fs',
//         path: '/dev/fs',
//         component: () => import('@/views/dev/fs/index.vue'),
//         meta: {
//           title: '文件',
//           hidden: false,
//           icon: 'FolderOpened',
//         },
//       },
//       {
//         name: 'Plugin',
//         path: '/dev/plugin',
//         component: () => import('@/views/dev/plugin/index.vue'),
//         meta: {
//           title: '开发',
//           hidden: false,
//           icon: 'ChromeFilled',
//         },
//       },
//       // {
//       //   name: 'Neumor',
//       //   path: '/dev/neumor',
//       //   component: () => import('@/views/dev/neumor/index.vue'),
//       //   meta: {
//       //     title: '新拟态',
//       //     hidden: false,
//       //     icon: 'ChromeFilled',
//       //   },
//       // },
//     ],
//   },
//   {
//     name: 'Config',
//     path: '/config',
//     component: () => import('@/layout/index.vue'),
//     redirect: '/config/bot',
//     meta: {
//       title: '配置编辑',
//       hidden: false,
//       icon: 'Edit',
//     },
//     children: [
//       {
//         name: 'Bot',
//         path: '/config/bot',
//         component: () => import('@/views/config/bot/index.vue'),
//         meta: {
//           title: 'Bot配置',
//           hidden: false,
//           icon: 'PartlyCloudy',
//         },
//       },
//       {
//         name: 'Plugins',
//         path: '/config/plugins',
//         component: () => import('@/views/config/plugins/index.vue'),
//         meta: {
//           title: '其它配置',
//           hidden: false,
//           icon: 'HelpFilled',
//         },
//       },
//     ],
//   },
//   {
//     name: 'Acl',
//     path: '/acl',
//     component: () => import('@/layout/index.vue'),
//     redirect: '/acl/user',
//     meta: {
//       title: '其它',
//       hidden: false,
//       icon: 'Setting',
//     },
//     children: [
//       {
//         name: 'Permission',
//         path: '/acl/permission',
//         component: () => import('@/views/acl/permission/index.vue'),
//         meta: {
//           title: '权限管理',
//           hidden: false,
//           icon: 'UserFilled',
//         },
//       },
//       {
//         name: 'About',
//         path: '/acl/about',
//         component: () => import('@/views/acl/about/index.vue'),
//         meta: {
//           title: '关于',
//           hidden: false,
//           icon: 'InfoFilled',
//         },
//       },
//     ],
//   },
//   {
//     name: 'Login',
//     path: '/login',
//     component: () => import('@/views/login/index.vue'),
//     meta: {
//       title: '登录',
//       hidden: true,
//       // element-plus图标
//       icon: 'Promotion',
//     },
//   },
//   {
//     name: '404',
//     path: '/404',
//     component: () => import('@/views/404/index.vue'),
//     meta: {
//       title: '404',
//       hidden: true,
//       icon: 'DocumentDelete',
//     },
//   },
//   {
//     name: 'Any',
//     path: '/:pathMatch(.*)*',
//     redirect: '/404',
//     meta: {
//       title: '任意',
//       hidden: true,
//       icon: 'DataLine',
//     },
//   },
// ]
