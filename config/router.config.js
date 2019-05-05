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
      { path: '/user/create-store', component: './User/CreateStore' },
    ],
  },
  // app
  {
    path: '/',
    component: '../layouts/BasicLayout',
    Routes: ['src/pages/Authorized'],
    // authority: ['admin', 'user'],
    authority: [1, 2,'admin',0],
    routes: [
      // dashboard
      { path: '/', redirect: '/home-page/guide' },
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
      // {
      //   name: 'setting',
      //   icon: 'setting',
      //   path: '/setting',
      //   routes: [
      //     {
      //       path: '/setting/permissionSetting',
      //       name: 'permissionSetting',
      //       component: './Setting/PermissionSetting',
      //     },
      //   ],
      // },
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
          // {
          //   path: '/reportForm/purchaseStatistics',
          //   name: 'purchaseStatistics',
          //   // component: './ReportForm/PurchaseStatistics',
          // },
          // {
          //   path: '/reportForm/profitStatistics',
          //   name: 'profitStatistics',
          //   // component: './ReportForm/ProfitStatistics',
          // },
          // {
          //   path: '/reportForm/expenditureAnalysis',
          //   name: 'expenditureAnalysis',
          //   // component: './ReportForm/ExpenditureAnalysis',
          // },
          // {
          //   path: '/reportForm/incomeAnalysis',
          //   name: 'incomeAnalysis',
          //   // component: './ReportForm/IncomeAnalysis',
          // },
          // {
          //   path: '/reportForm/singleSalesRanking',
          //   name: 'singleSalesRanking',
          //   // component: './ReportForm/SingleSalesRanking',
          // },
          // {
          //   path: '/reportForm/lossStatistics',
          //   name: 'lossStatistics',
          //   // component: './ReportForm/LossStatistics',
          // },
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
