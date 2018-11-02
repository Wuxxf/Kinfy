export default [
  // user
  {
    path: '/user',
    component: '../layouts/UserLayout',
    routes: [
      { path: '/user', redirect: '/user/login' },
      { path: '/user/login', component: './User/Login' },
      { path: '/user/register', component: './User/Register' },
      { path: '/user/register-result', component: './User/RegisterResult' },
    ],
  },
  // app
  {
    path: '/',
    component: '../layouts/BasicLayout',
    Routes: ['src/pages/Authorized'],
    // authority: ['admin', 'user'],
    authority: [1, 2,'admin'],
    routes: [
      // dashboard
      { path: '/', redirect: '/home-page/guide' },
      // {
      //   path: '/dashboard',
      //   // name: 'dashboard',
      //   icon: 'dashboard',
      //   routes: [
      //     {
      //       path: '/dashboard/analysis',
      //       name: 'analysis',
      //       component: './Dashboard/Analysis',
      //     },
      //     {
      //       path: '/dashboard/monitor',
      //       name: 'monitor',
      //       component: './Dashboard/Monitor',
      //     },
      //     {
      //       path: '/dashboard/workplace',
      //       name: 'workplace',
      //       component: './Dashboard/Workplace',
      //     },
      //   ],
      // },
      // forms
      // {
      //   path: '/form',
      //   icon: 'form',
      //   name: 'form',
      //   routes: [
      //     {
      //       path: '/form/basic-form',
      //       name: 'basicform',
      //       component: './Forms/BasicForm',
      //     },
      //     {
      //       path: '/form/step-form',
      //       name: 'stepform',
      //       component: './Forms/StepForm',
      //       hideChildrenInMenu: true,
      //       routes: [
      //         {
      //           path: '/form/step-form',
      //           redirect: '/form/step-form/info',
      //         },
      //         {
      //           path: '/form/step-form/info',
      //           name: 'info',
      //           component: './Forms/StepForm/Step1',
      //         },
      //         {
      //           path: '/form/step-form/confirm',
      //           name: 'confirm',
      //           component: './Forms/StepForm/Step2',
      //         },
      //         {
      //           path: '/form/step-form/result',
      //           name: 'result',
      //           component: './Forms/StepForm/Step3',
      //         },
      //       ],
      //     },
      //     {
      //       path: '/form/advanced-form',
      //       name: 'advancedform',
      //       authority: ['admin'],
      //       component: './Forms/AdvancedForm',
      //     },
      //   ],
      // },
      // // list
      // {
      //   path: '/list',
      //   icon: 'table',
      //   name: 'list',
      //   routes: [
      //     {
      //       path: '/list/table-list',
      //       name: 'searchtable',
      //       component: './List/TableList',
      //     },
      //     {
      //       path: '/list/basic-list',
      //       name: 'basiclist',
      //       component: './List/BasicList',
      //     },
      //     {
      //       path: '/list/card-list',
      //       name: 'cardlist',
      //       component: './List/CardList',
      //     },
      //     {
      //       path: '/list/search',
      //       name: 'searchlist',
      //       component: './List/List',
      //       routes: [
      //         {
      //           path: '/list/search',
      //           redirect: '/list/search/articles',
      //         },
      //         {
      //           path: '/list/search/articles',
      //           name: 'articles',
      //           component: './List/Articles',
      //         },
      //         {
      //           path: '/list/search/projects',
      //           name: 'projects',
      //           component: './List/Projects',
      //         },
      //         {
      //           path: '/list/search/applications',
      //           name: 'applications',
      //           component: './List/Applications',
      //         },
      //       ],
      //     },
      //   ],
      // },
      // {
      //   path: '/profile',
      //   name: 'profile',
      //   icon: 'profile',
      //   routes: [
      //     // profile
      //     {
      //       path: '/profile/basic',
      //       name: 'basic',
      //       component: './Profile/BasicProfile',
      //     },
      //     {
      //       path: '/profile/advanced',
      //       name: 'advanced',
      //       authority: ['admin'],
      //       component: './Profile/AdvancedProfile',
      //     },
      //   ],
      // },
      // {
      //   name: 'result',
      //   icon: 'check-circle-o',
      //   path: '/result',
      //   routes: [
      //     // result
      //     {
      //       path: '/result/success',
      //       name: 'success',
      //       component: './Result/Success',
      //     },
      //     { path: '/result/fail', name: 'fail', component: './Result/Error' },
      //   ],
      // },
      {
        // name: 'exception',
        icon: 'warning',
        path: '/exception',
        routes: [
          // exception
          {
            path: '/exception/403',
            name: 'not-permission',
            component: './Exception/403',
          },
          {
            path: '/exception/404',
            name: 'not-find',
            component: './Exception/404',
          },
          {
            path: '/exception/500',
            name: 'server-error',
            component: './Exception/500',
          },
          {
            path: '/exception/trigger',
            name: 'trigger',
            hideInMenu: true,
            component: './Exception/TriggerException',
          },
        ],
      },
      {
        // name: 'account',
        icon: 'user',
        path: '/account',
        routes: [
          {
            path: '/account/center',
            name: 'center',
            component: './Account/Center/Center',
            routes: [
              {
                path: '/account/center',
                redirect: '/account/center/articles',
              },
              {
                path: '/account/center/articles',
                component: './Account/Center/Articles',
              },
              {
                path: '/account/center/applications',
                component: './Account/Center/Applications',
              },
              {
                path: '/account/center/projects',
                component: './Account/Center/Projects',
              },
            ],
          },
          {
            path: '/account/settings',
            // name: 'settings',
            component: './Account/Settings/Info',
            routes: [
              {
                path: '/account/settings',
                redirect: '/account/settings/base',
              },
              {
                path: '/account/settings/base',
                component: './Account/Settings/BaseView',
              },
              {
                path: '/account/settings/security',
                component: './Account/Settings/SecurityView',
              },
              {
                path: '/account/settings/binding',
                component: './Account/Settings/BindingView',
              },
              {
                path: '/account/settings/notification',
                component: './Account/Settings/NotificationView',
              },
            ],
          },
        ],
      },

      // kinfy start
      // 销售明细
      {
        name: 'openbill',
        icon: 'laptop',
        path: '/openbill',
        routes: [
          {
            path: '/openbill/sellinggoods',
            name: 'sellinggoods',
            component: './Openbill/Sellinggoods',
          },
          {
            path: '/openbill/salesreturn',
            name: 'salesreturn',
            component: './Openbill/Salesreturn',
          },
          {
            path: '/openbill/salesreceipts',
            name: 'salesreceipts',
            component: './Openbill/Salesreceipts',
          },
          {
            path: '/openbill/purchasepurchase',
            name: 'purchasepurchase',
            component: './Openbill/Purchasepurchase',
          },
          {
            path: '/openbill/purchasereturn',
            name: 'purchasereturn',
            component: './Openbill/Purchasereturn',
          },
          {
            path: '/openbill/purchasepayment',
            name: 'purchasepayment',
            component: './Openbill/Purchasepayment',
          },
          {
            path: '/openbill/otherincome',
            name: 'otherincome',
            component: './Openbill/Otherincome',
          },
          {
            path: '/openbill/otherexpenditure',
            name: 'otherexpenditure',
            component: './Openbill/Otherexpenditure',
          },
        ],
      },
      // 销售明细
      {
        name: 'salesDetails',
        icon: 'table',
        path: '/salesDetails',
        routes: [
          {
            path: '/salesDetails/salesSlip',
            name: 'salesSlip',
            component: './SalesDetails/SalesSlip',
          },
          {
            path: '/salesDetails/saleProduct',
            name: 'saleProduct',
            component: './SalesDetails/SaleProduct',
          },
          {
            path: '/salesDetails/returnForm',
            name: 'returnForm',
            component: './SalesDetails/ReturnForm',
          },
          {
            path: '/salesDetails/saleReturnProduct',
            name: 'saleReturnProduct',
            component: './SalesDetails/SaleReturnProduct',
          },
          {
            path: '/salesDetails/receipt',
            name: 'receipt',
            component: './SalesDetails/Receipt',
          },
        ],
      },
      // 采购明细
      {
        name: 'purchaseDetail',
        icon: 'shopping-cart',
        path: '/purchaseDetail',
        routes: [
          {
            path: '/purchaseDetail/shippingOrder',
            name: 'shippingOrder',
            component: './PurchaseDetail/ShippingOrder',
          },
          {
            path: '/purchaseDetail/purchaseProduct',
            name: 'purchaseProduct',
            component: './PurchaseDetail/PurchaseProduct',
          },
          {
            path: '/purchaseDetail/purchaseReturnForm',
            name: 'purchaseReturnForm',
            component: './PurchaseDetail/PurchaseReturnForm',
          },
          {
            path: '/purchaseDetail/purchaseReturnProduct',
            name: 'purchaseReturnProduct',
            component: './PurchaseDetail/PurchaseReturnProduct',
          },
          {
            path: '/purchaseDetail/paymentForm',
            name: 'paymentForm',
            component: './PurchaseDetail/PaymentForm',
          },
        ],
      },
      // 收支明细
      {
        name: 'balanceOfPayments',
        icon: 'wallet',
        path: '/balanceOfPayments',
        routes: [
          {
            path: '/balanceOfPayments/revenueManagement',
            name: 'revenueManagement',
            component: './BalanceOfPayments/RevenueManagement',
          },
          {
            path: '/balanceOfPayments/expenditureManagement',
            name: 'expenditureManagement',
            component: './BalanceOfPayments/expenditureManagement',
          },
        ],
      },
      // 货品
      {
        name: 'productManagement',
        icon: 'inbox',
        path: '/productManagement',
        routes: [
          {
            path: '/productManagement/productList',
            name: 'productList',
            component: './ProductManagement/ProductList',
          },
          {
            path: '/productManagement/productCategory',
            name: 'productCategory',
            component: './ProductManagement/ProductCategory',
          },
          {
            path: '/productManagement/productUnit',
            name: 'productUnit',
            component: './ProductManagement/ProductUnit',
          },
          {
            path: '/productManagement/causeOfLoss',
            name: 'causeOfLoss',
            component: './ProductManagement/CauseOfLoss',
          },
          // {
          //   path: '/productManagement/productCheck',
          //   name: 'productCheck',
          //   // component: './ProductManagement/ProductCheck',
          // },
          // {
          //   path: '/productManagement/productCheckList',
          //   name: 'productCheckList',
          //   // component: './ProductManagement/ProductCheckList',
          // },
        ],
      },
      // 客户
      {
        name: 'customerManagement',
        icon: 'credit-card',
        path: '/customerManagement',
        routes: [
          {
            path: '/customerManagement/customerManagement',
            name: 'customerManagement',
            component: './CustomerManagement/CustomerManagement',
          },
          {
            path: '/customerManagement/labelSetting',
            name: 'labelSetting',
            component: './CustomerManagement/LabelSetting',
          },
        ],
      },
      // 供应商
      {
        name: 'supplierManagement',
        icon: 'shop',
        path: '/supplierManagement',
        routes: [
          {
            path: '/supplierManagement/supplierManagement',
            name: 'supplierManagement',
            component: './SupplierManagement/SupplierManagement',
          },
        ],
      },
      // 门店管理
      {
        name: 'storeManagement',
        icon: 'shop',
        path: '/storeManagement',
        routes: [
          {
            path: '/storeManagement/employeeManagement',
            name: 'employeeManagement',
            component: './StoreManagement/EmployeeManagement',
          },
          {
            path: '/storeManagement/storeInformation',
            name: 'storeInformation',
            component: './StoreManagement/StoreInformation',
          },
          {
            path: '/storeManagement/bulletinManagement',
            name: 'bulletinManagement',
            component: './StoreManagement/BulletinManagement',
          },
        ],
      },
      // 基础设置
      {
        name: 'setting',
        icon: 'setting',
        path: '/setting',
        routes: [
          {
            path: '/setting/permissionSetting',
            name: 'permissionSetting',
            component: './Setting/PermissionSetting',
          },
        ],
      },
      // 报表
      {
        name: 'reportForm',
        icon: 'bar-chart',
        path: '/reportForm',
        routes: [
          {
            path: '/reportForm/salesStatistics',
            name: 'salesStatistics',
            component: './ReportForm/SalesStatistics',
          },
          {
            path: '/reportForm/purchaseStatistics',
            name: 'purchaseStatistics',
            // component: './ReportForm/PurchaseStatistics',
          },
          {
            path: '/reportForm/profitStatistics',
            name: 'profitStatistics',
            // component: './ReportForm/ProfitStatistics',
          },
          {
            path: '/reportForm/expenditureAnalysis',
            name: 'expenditureAnalysis',
            // component: './ReportForm/ExpenditureAnalysis',
          },
          {
            path: '/reportForm/incomeAnalysis',
            name: 'incomeAnalysis',
            // component: './ReportForm/IncomeAnalysis',
          },
          {
            path: '/reportForm/singleSalesRanking',
            name: 'singleSalesRanking',
            // component: './ReportForm/SingleSalesRanking',
          },
          {
            path: '/reportForm/lossStatistics',
            name: 'lossStatistics',
            // component: './ReportForm/LossStatistics',
          },
        ],
      },
      // 起始页
      {
        name: 'home-page',
        icon: 'tags-o',
        path: '/home-page/guide',
        component: './HomePage/Guide',
      },

      // Kinfy end
      {
        component: '404',
      },
    ],
  },
];
