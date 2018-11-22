import { stringify } from 'qs';
import request from '@/utils/request';

export async function queryProjectNotice() {
  return request('/api/project/notice');
}

export async function queryActivities() {
  return request('/api/activities');
}

export async function queryRule(params) {
  return request(`/api/rule?${stringify(params)}`);
}

export async function removeRule(params) {
  return request('/api/rule', {
    method: 'POST',
    body: {
      ...params,
      method: 'delete',
    },
  });
}

export async function addRule(params) {
  return request('/api/rule', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

export async function updateRule(params) {
  return request('/api/rule', {
    method: 'POST',
    body: {
      ...params,
      method: 'update',
    },
  });
}

export async function fakeSubmitForm(params) {
  return request('/api/forms', {
    method: 'POST',
    body: params,
  });
}

export async function fakeChartData() {
  return request('/api/fake_chart_data');
}

export async function queryTags() {
  return request('/api/tags');
}

export async function queryBasicProfile() {
  return request('/api/profile/basic');
}

export async function queryAdvancedProfile() {
  return request('/api/profile/advanced');
}

export async function queryFakeList(params) {
  return request(`/api/fake_list?${stringify(params)}`);
}

export async function removeFakeList(params) {
  const { count = 5, ...restParams } = params;
  return request(`/api/fake_list?count=${count}`, {
    method: 'POST',
    body: {
      ...restParams,
      method: 'delete',
    },
  });
}

export async function addFakeList(params) {
  const { count = 5, ...restParams } = params;
  return request(`/api/fake_list?count=${count}`, {
    method: 'POST',
    body: {
      ...restParams,
      method: 'post',
    },
  });
}

export async function updateFakeList(params) {
  const { count = 5, ...restParams } = params;
  return request(`/api/fake_list?count=${count}`, {
    method: 'POST',
    body: {
      ...restParams,
      method: 'update',
    },
  });
}

export async function fakeAccountLogin(params) {
  return request('/api/login/account', {
    method: 'POST',
    body: params,
  });
}

export async function fakeRegister(params) {
  return request('/api/register', {
    method: 'POST',
    body: params,
  });
}

export async function queryNotices() {
  return request('/api/notices');
}

export async function getFakeCaptcha(mobile) {
  return request(`/api/captcha?mobile=${mobile}`);
}

// Kinfy

export async function logout() {
  return request('/api/logout')
}

/* ********* 起始页 start ********* */
export async function queryGuide() {
  return request('/api/index');
}
/* ********* 起始页 end ********* */

/* ********* 门店管理 start ********* */
export async function enterStore(params) {
  return request(`/api/enterStore/${params}`);
}
// 添加门店
export async function addStore(params) {
  return request('/api/store/add', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
// 删除门店
export async function delStore(params) {
  return request(`/api/store/${params.id}/del`, {
    method: 'POST',
  });
}
// 查询门店
export async function queryStore() {
  return request('/api/store/list');
}
// 门店详情
export async function queryStoreDetails(params) {
  return request(`/api/store/${params.id}`);
}
// 修改门店
export async function updateStore(params) {
  return request(`api/store/${params.id}/update`, {
    method: 'POST',
    body: params,
  });
}
// 查询行业
export async function queryIndustry() {
  return request('/api/industry');
}
/* ********* 门店管理 end ********* */

/* ********* 系统公告 start ********* */
// 查询公告
export async function querySystemBulletin() {
  return request('/api/noticestate/list');
}

// 公告详情
export async function bulletinDetails(params) {
  return request(`/api/systemnotice/${params.id}`,{
    // method: 'POST',
  });
}

// 是否已读
export async function isreadSystemNotice(params) {
  return request(`/api/noticestate/${params.id}/update`, {
    method: 'POST',
    body: {
      is_read: params.is_read,
    },
  });
}
/* ********* 系统公告 end ********* */


/* ********* 员工管理 start ********* */
// 查询员工
export async function queryEmployee() {
  return request('/api/staff/list');
}
// 添加员工
export async function addEmployee(params) {
  return request('/api/staff/add', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
// 删除员工
export async function delEmployee(params) {
  return request(`/api/staff/${params.id}/del`, {
    method: 'POST',
  });
}
// 更新员工
export async function updateEmployee(params) {
  const data = {
    email: params.email,
    is_login: params.is_login,
    mobile_phone: params.mobile_phone,
    name: params.name,
    role_id: params.role_id,
    state: params.state,
  };
  return request(`api/staff/${params.id}/update`, {
    method: 'POST',
    body: data,
  });
}
// 查询角色
export async function queryRole() {
  return request('/api/role/list');
}
/* ********* 员工管理 end ********* */

/* ********* 标签设置 start ********* */
// 查询标签
export async function queryCustomerLabel() {
  return request('/api/customerLabel/list');
}
// 添加标签
export async function addCustomerLabel(params) {
  return request('/api/customerLabel/add', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
// 删除标签
export async function delCustomerLabel(params) {
  return request(`/api/customerLabel/${params.id}/del`, {
    method: 'POST',
  });
}
// 编辑标签
export async function updateCustomerLabel(params) {
  const data = {
    name: params.name,
  };
  return request(`api/customerLabel/${params.id}/update`, {
    method: 'POST',
    body: data,
  });
}
/* ********* 标签设置 end ********* */

/* ********* 客户管理 start ********* */
// 查询客户
export async function queryCustomer(params) {
  return request(`/api/customer/list?page=${params.page}`,{
    method: 'POST',
    body: {
      ...params,
    },
  });
}

// 添加客户
export async function addCustomer(params) {
  return request('/api/customer/add', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
// 删除客户
export async function delCustomer(params) {
  return request(`/api/customer/${params.id}/del`, {
    method: 'POST',
  });
}
// 编辑客户
export async function updateCustomer(params) {
  // const data = {
  //   name: params.name,
  //   mobile_phone: params.mobile_phone,
  //   address: params.address,
  //   contacts: params.contacts,
  //   pay: params.pay,
  //   remarks: params.remarks,
  //   customer_type: params.customer_type,
  //   label: params.label,
  //   operator: params.operator,
  // };
  return request(`api/customer/${params.id}/update`, {
    method: 'POST',
    body: params,
  });
}
/* ********* 客户管理 end ********* */

/* ********* 供应商管理 start ********* */
// 查询供应商
export async function querySupplier(params) {
  const data = {
    name: params.name,
    arrears: params.arrears,
  };
  return request(`/api/supplier/list?page=${params.page}`, {
    method: 'POST',
    body: {
      ...data,
    },
  });
}
// 添加供应商
export async function addSupplier(params) {
  return request('/api/supplier/add', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
// 删除供应商
export async function delSupplier(params) {
  return request(`/api/supplier/${params.id}/del`, {
    method: 'POST',
  });
}
// 更新供应商
export async function updateSupplier(params) {
  const data = {
    name: params.name,
    mobile_phone: params.mobile_phone,
    address: params.address,
    contacts: params.contacts,
    pay: params.pay,
    remarks: params.remarks,
  };
  return request(`api/supplier/${params.id}/update`, {
    method: 'POST',
    body: data,
  });
}
/* ********* 供应商管理 end ********* */

/* ********* 报损原因 start ********* */
// 报损原因查询
export async function queryCauseOfLoss() {
  return request('/api/reportOfLoss/list');
}

// 报损原因增加
export async function addCauseOfLoss(params) {
  return request('/api/reportOfLoss/add', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

// 报损原因删除
export async function delCauseOfLoss(params) {
  return request(`/api/reportOfLoss/${params.id}/del`, {
    method: 'POST',
  });
}

// 报损原因更新
export async function updateCauseOfLoss(params) {
  const data = {
    reason: params.reason,
  };
  return request(`api/reportOfLoss/${params.id}/update`, {
    method: 'POST',
    body: data,
  });
}

/* ********* 报损原因 end ********* */

/* ********* 货品单位 start ********* */
// 货品单位查询
export async function queryUnitsData() {
  return request('/api/units/list');
}
// 货品单位增加
export async function addUnitsData(params) {
  return request('/api/units/add', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
// 货品单位删除
export async function delUnitsData(params) {
  return request(`/api/units/${params.id}/del`, {
    method: 'POST',
  });
}
// 货品单位更新
export async function updateUnitsData(params) {
  return request(`api/units/${params.id}/update`, {
    method: 'POST',
    body: params,
  });
}
/* ********* 货品单位 end ********* */

/* ********* 货品类别 start ********* */
// 货品类别查询
export async function queryCategory() {
  return request('/api/productCategory/list');
}
// 货品类别添加
export async function addCategory(params) {
  return request('/api/productCategory/add', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
// 货品类别删除
export async function delCategory(params) {
  return request(`/api/productCategory/${params.id}/del`, {
    method: 'POST',
  });
}
// 货品类别更新
export async function updateCategory(params) {
  return request(`api/productCategory/${params.id}/update`, {
    method: 'POST',
    body: params,
  });
}
// 货品类别单条
export async function queryCategoryList(params) {
  return request(`api/productCategory/${params.id}`);
}

/* ********* 货品类别 end ********* */

/* ********* 货品列表 start ********* */
// 货品列表查询
export async function queryProductList(params) {
  return request(`/api/goods/list?page=${params.page}`,{
    method: 'POST',
    body: {
      ...params,
    },
  });
}
// 货品列表添加
export async function addProductList(params) {
  return request('/api/goods/add', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
// 货品列表删除
export async function delProductList(params) {
  return request(`/api/goods/${params.id}/del`, {
    method: 'POST',
  });
}
// 货品列表更新
export async function updateProductList(params) {
  return request(`api/goods/${params.id}/update`, {
    method: 'POST',
    body: params,
  });
}
/* ********* 货品列表 end ********* */

/* ********* 报损查询 start ********* */
// 报损查询查询
export async function queryReportLoss() {
  return request('/api/reportLoss/list');
}
// 报损查询添加
export async function addReportLoss(params) {
  return request('/api/reportLoss/add', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
// 报损查询删除
export async function delReportLoss(params) {
  return request(`/api/reportLoss/${params.id}/del`, {
    method: 'POST',
  });
}
// 报损查询更新
export async function updateReportLoss(params) {
  return request(`api/reportLoss/${params.id}/update`, {
    method: 'POST',
    body: params,
  });
}
/* ********* 报损查询 end ********* */

/* ********* 开单 start ********* */
// 获取订单
export async function queryOrderNum() {
  return request('/api/salesSlip/order');
}
// 搜索货品添加
export async function searchGoods(params) {
  return request('/api/goods/barcode', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
// 添加销售单据
export async function addSaleSlip(params) {
  return request('/api/salesSlip/add', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
// 获取退货订单
export async function queryReturnOrderNum() {
  return request('/api/salesReturn/order');
}

// 获取其他收入订单
export async function queryIncomeNum() {
  return request('/api/otherIncome/order');
}
// 添加其他收入项目
export async function otherIncomeSave(params) {
  return request('/api/otherIncome/add', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
// 获取其他支出订单
export async function queryExpenditureTypeNum() {
  return request('/api/otherExpenditure/order');
}
// 添加其他支出项目
export async function otherExpenditureSave(params) {
  return request('/api/otherExpenditure/add', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
// 添加销售单据
export async function addSaleReturn(params) {
  return request('/api/salesReturn/add', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
// 获取销售收款订单
export async function queryReceOrderNum() {
  return request('/api/receipt/order');
}
// 获取销售收款
export async function queryReceipt(params) {
  return request(`/api/receipt/list?page=${params.page}`, {
    method: 'POST',
    body: { ...params },
  });
}
// 添加销售收款
export async function addReceipt(params) {
  return request('/api/receipt/add', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

// 销售收款关联单
export async function queryCustArrears(params) {
  return request(`/api/salesSlip/${params.id}/customerArrears`);
}



// 删除销售收款
export async function delReceipt(params) {
  return request(`/api/receipt/${params.id}/del`, {
    method: 'POST',
  });
}
// 修改销售收款
export async function updateReceipt(params) {
  return request(`/api/receipt/${params.id}/update`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
// 获取其他收入项目图标
export async function incomeType() {
  return request('/api/incomeType/list');
}
// 添加其他收入项目图标
export async function addIncomeType(params) {
  return request('/api/incomeType/add', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
// 删除其他收入项目图标
export async function delIncomeType(params) {
  return request(`/api/incomeType/${params.id}/del`, {
    method: 'POST',
  });
}
// 修改其他收入项目图标
export async function updateIncomeType(params) {
  return request(`/api/incomeType/${params.id}/update`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
// 获取其他支出项目图标
export async function expenditureType() {
  return request('/api/expenditureType/list');
}
// 添加其他支出项目图标
export async function addExpenditureType(params) {
  return request('/api/expenditureType/add', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
// 删除其他支出项目图标
export async function delExpenditureType(params) {
  return request(`/api/expenditureType/${params.id}/del`, {
    method: 'POST',
  });
}
// 修改其他支出项目图标
export async function updateExpenditureType(params) {
  return request(`/api/expenditureType/${params.id}/update`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
// 获取快递公司
export async function queryExpress() {
  return request('/api/expressCompany/list');
}

/* ********* 开单 end ********* */

/* ********* 销售明细 start ********* */

// 获取销售单据
export async function querySaleSlip(params) {
  return request(`/api/salesSlip/list?page=${params.page}`, {
    method: 'POST',
    body: { ...params },
  });
}
// 获取销售单据详情
export async function querySalesDetail(params) {
  return request(`/api/salesSlip/${params.id}`);
}
// 删除销售单据
export async function delSaleSlip(params) {
  return request(`/api/salesSlip/${params.id}/del`, {
    method: 'POST',
  });
}
// 修改销售单据
export async function updateSaleSlip(params) {
  return request(`/api/salesSlip/${params.id}/update`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
// 获取销售货品
export async function querySaleProduct(params) {
  const tmp = Object.assign({}, params);
  delete tmp.page;
  return request(`/api/salesSlipsInfo/list?page=${params.page}`, {
    method: 'POST',
    body: { ...tmp },
  });
}

// 获取销售退货
export async function querySaleReturn(params) {
  const tmp = Object.assign({}, params);
  delete tmp.page;
  return request(`/api/salesReturn/list?page=${params.page}`, {
    method: 'POST',
    body: { ...tmp },
  });
}
// 获取退货货品详情
export async function queryReturnDetail(params) {
  return request(`/api/salesReturn/${params.id}`);
}

// 获取销售货品
export async function queryReturnProduct(params) {
  return request(`/api/salesReturnsInfo/list?page=${params.page}`, {
    method: 'POST',
    body: { ...params },
  });
}

// 删除销售单据
export async function delSalesReturn(params) {
  return request(`/api/salesReturn/${params.id}/del`, {
    method: 'POST',
  });
}

// 修改销售单据
export async function updateSalesReturn(params) {
  return request(`/api/salesReturn/${params.id}/update`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

/* ********* 销售明细 end ********* */
/* ********* 收支明细 start ********* */
// 获取收入单据
export async function queryRevenue(params) {
  return request(`/api/revenueManagement/list?page=${params.page}`, {
    method: 'POST',
    body: { ...params },
  });
}
// 获取支出单据
export async function queryExpenditure(params) {
  return request(`/api/expenditureManagement/list?page=${params.page}`, {
    method: 'POST',
    body: { ...params },
  });
}
/* ********* 收支明细 end ********* */

/* ********* 采购进货 start ********* */
// 获取采购进货订单
export async function queryPurcOrderNum() {
  return request('/api/purchasing/order');
}
// 添加采购进货
export async function addPurchasing(params) {
  return request('/api/purchasing/add', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
// 获取采购进货
export async function queryPurchasing(params) {
  return request(`/api/purchasing/list?page=${params.page}`, {
    method: 'POST',
    body: { ...params },
  });
}
// 获取进货货品详情
export async function queryPurchasingDetail(params) {
  return request(`/api/purchasing/${params.id}`);
}
// 删除采购进货
export async function delPurchasing(params) {
  return request(`/api/purchasing/${params.id}/del`, {
    method: 'POST',
  });
}
// 修改采购进货
export async function updatePurchasing(params) {
  return request(`/api/purchasing/${params.id}/update`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

/* ********* 采购进货 end ********* */

/* ********* 采购退货 start ********* */
// 获取采购退货订单
export async function queryPurchReturnOrderNum() {
  return request('/api/purchaseReturn/order');
}
// 添加采购退货
export async function addPurchReturn(params) {
  return request('/api/purchaseReturn/add', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
// 获取采购退货
export async function queryPurchReturn(params) {
  return request(`/api/purchaseReturn/list?page=${params.page}`, {
    method: 'POST',
    body: { ...params },
  });
}
// 获取退货货品详情
export async function queryPurchReturnDetail(params) {
  return request(`/api/purchaseReturn/${params.id}`);
}
// 删除采购退货
export async function delPurchReturn(params) {
  return request(`/api/purchaseReturn/${params.id}/del`, {
    method: 'POST',
  });
}
// 修改采购退货
export async function updatePurchReturn(params) {
  return request(`/api/purchaseReturn/${params.id}/update`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

/* ********* 采购退货 end ********* */

/* ********* 采购付款 start ********* */
// 获取采购付款订单
export async function queryPayOrderNum() {
  return request('/api/paymentForm/order');
}
// 获取采购付款
export async function queryPayment(params) {
  return request(`/api/paymentForm/list?page=${params.page}`, {
    method: 'POST',
    body: { ...params },
  });
}
// 添加采购付款
export async function addPayment(params) {
  return request('/api/paymentForm/add', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
// 删除采购付款
export async function delPayment(params) {
  return request(`/api/paymentForm/${params.id}/del`, {
    method: 'POST',
  });
}
// 修改采购付款
export async function updatePayment(params) {
  return request(`/api/paymentForm/${params.id}/update`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
/* ********* 采购付款 end ********* */

/* ********* 采购货品 start ********* */
// 获取采购货品
export async function queryPurchasingsInfo(params) {
  return request(`/api/purchasingsInfo/list?page=${params.page}`, {
    method: 'POST',
    body: { ...params },
  });
}

/* ********* 采购货品 end ********* */

