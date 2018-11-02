import {
  queryOrderNum,
  addSaleSlip,
  updateSaleSlip,
  delSaleSlip,
  querySaleSlip,
  querySalesDetail,
  queryExpress,
  querySaleProduct,
  querySaleReturn,
  queryReturnOrderNum,
  addSaleReturn,
  queryReturnDetail,
  queryReturnProduct,
  delSalesReturn,
  queryReceipt,
  addReceipt,
  delReceipt,
  updateReceipt,
  queryReceOrderNum, // 收款
  updateSalesReturn,
  searchGoods,
  incomeType,
  addIncomeType,
  delIncomeType,
  updateIncomeType,
  expenditureType,
  addExpenditureType,
  delExpenditureType,
  updateExpenditureType,
  queryIncomeNum,
  otherIncomeSave,
  queryExpenditureTypeNum,
  otherExpenditureSave,
  queryPurcOrderNum,
  queryPurchReturnOrderNum,
  addPurchasing,
  queryPurchasing,
  delPurchasing,
  updatePurchasing,
  queryPurchasingDetail,
  addPurchReturn,
  queryPurchReturn,
  delPurchReturn,
  updatePurchReturn,
  queryPurchReturnDetail,
  queryPayOrderNum,
  addPayment,
  delPayment,
  updatePayment,
  queryPayment,
  queryPurchasingsInfo,
  queryCustArrears,
} from '@/services/api';

export default {
  namespace: 'openbill',
  state: {
    orderNum: '', // 订单号
    salesData: [], // 销售单据
    salesFrom: 0,
    dataFrom: 0,
    total: 0,
    dataTotal: 0,
    totalProfit: 0, // 利润
    totalCost: 0, // 成本
    totalPay: 0, // 实收
    totalSale: 0, // 销售
    salesDetailData: [], //  销售单据详情
    expressCompany: [], // 快递公司
    saleProduct: [], // 销售货品
    salesProductFrom: 0,
    incomeTypeData: [],
    purchasingData: [],
    dataSource:[],
    purchaseTotal:0,
    creditTotal:0,
    payTotal:0,
  },

  effects: {
    // 获取销售订单号
    *fetchOrderNum({ callback }, { call, put }) {
      const response = yield call(queryOrderNum);
      yield put({
        type: 'queryOrderNum',
        payload: response,
      });
      if (callback) callback(response);
    },
    // 获取退货订单号
    *fetchReturnOrderNum({ callback }, { call, put }) {
      const response = yield call(queryReturnOrderNum);
      yield put({
        type: 'queryOrderNum',
        payload: response,
      });
      if (callback) callback(response);
    },
    // 获取收款订单号
    *fetchReceNum({ callback }, { call, put }) {
      const response = yield call(queryReceOrderNum);
      yield put({
        type: 'queryOrderNum',
        payload: response,
      });
      if (callback) callback(response);
    },
    // 获取支出订单号
    *fetchexpenditureTypeNum({ callback }, { call, put }) {
      const response = yield call(queryExpenditureTypeNum);
      yield put({
        type: 'queryOrderNum',
        payload: response,
      });
      if (callback) callback(response);
    },
    // 获取其他收入订单号
    *fetchincomeTypeNum({ callback }, { call, put }) {
      const response = yield call(queryIncomeNum);
      yield put({
        type: 'queryOrderNum',
        payload: response,
      });
      if (callback) callback(response);
    },
    // 获取采购进货订单号
    *fetchPurcNum({ callback }, { call, put }) {
      const response = yield call(queryPurcOrderNum);
      yield put({
        type: 'queryOrderNum',
        payload: response,
      });
      if (callback) callback(response);
    },
    // 获取采购退货订单号
    *fetchPurchReturnNum({ callback }, { call, put }) {
      const response = yield call(queryPurchReturnOrderNum);
      yield put({
        type: 'queryOrderNum',
        payload: response,
      });
      if (callback) callback(response);
    },
    // 搜索货品
    *searchGoods({ payload, callback }, { call, put }) {
      const response = yield call(searchGoods, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback(response);
    },
    // 添加销售单
    *addSales({ payload, callback }, { call, put }) {
      const response = yield call(addSaleSlip, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback(response);
    },
    // 添加退货单
    *addSalesReturn({ payload, callback }, { call, put }) {
      const response = yield call(addSaleReturn, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback(response);
    },
    // 获取销售单据
    *fetchSales({ payload, callback }, { call, put }) {
      const response = yield call(querySaleSlip, payload);
      yield put({
        type: 'querySaleSlip',
        payload: response,
      });
      if (callback) callback(response);
    },
    // 修改销售单据
    *updateSales({ payload, callback }, { call, put }) {
      const response = yield call(updateSaleSlip, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback(response);
    },
    // 获取订单详情
    *fetchSalesDetail({ payload, callback }, { call, put }) {
      const response = yield call(querySalesDetail, payload);
      yield put({
        type: 'querySalesDetail',
        payload: response,
      });
      if (callback) callback(response);
    },
    // 删除销售单据
    *delSales({ payload, callback }, { call, put }) {
      const response = yield call(delSaleSlip, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback(response);
    },
    // 获取快递公司
    *fetchExpressCompany({ payload, callback }, { call, put }) {
      const response = yield call(queryExpress, payload);
      yield put({
        type: 'queryExpress',
        payload: response,
      });
      if (callback) callback(response);
    },
    // 获取销售货品
    *fetchSaleProduct({ payload, callback }, { call, put }) {
      const response = yield call(querySaleProduct, payload);
      yield put({
        type: 'querySaleProduct',
        payload: response,
      });
      if (callback) callback(response);
    },
    // 获取销售退货
    *fetchSalesReturn({ payload, callback }, { call, put }) {
      const response = yield call(querySaleReturn, payload);
      yield put({
        type: 'querySaleReturn',
        payload: response,
      });
      if (callback) callback(response);
    },
    // 获取退货详情
    *fetchReturnDetail({ payload, callback }, { call, put }) {
      const response = yield call(queryReturnDetail, payload);
      yield put({
        type: 'querySalesDetail',
        payload: response,
      });
      if (callback) callback(response);
    },
    // 获取退货货品
    *fetchReturnProduct({ payload, callback }, { call, put }) {
      const response = yield call(queryReturnProduct, payload);
      yield put({
        type: 'querySaleProduct',
        payload: response,
      });
      if (callback) callback(response);
    },
    // 删除退货单据
    *delSalesReturn({ payload, callback }, { call, put }) {
      const response = yield call(delSalesReturn, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback(response);
    },
    // 添加销售收款
    *receiptAdd({ payload, callback }, { call, put }) {
      const response = yield call(addReceipt, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback(response);
    },
    // 获取销售收款
    *fetchReceipt({ payload, callback }, { call, put }) {
      const response = yield call(queryReceipt, payload);
      yield put({
        type: 'querySaleReturn',
        payload: response,
      });
      if (callback) callback(response);
    },
    // 获取销售收款(客户欠款关联单)
    *fetchCustArrears({ payload, callback }, { call, put }) {
      const response = yield call(queryCustArrears, payload);
      yield put({
        type: 'queryCustArrears',
        payload: response,
      });
      if (callback) callback(response);
    },
    
    // 删除销售收款
    *delReceipt({ payload, callback }, { call, put }) {
      const response = yield call(delReceipt, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback(response);
    },
    // 修改销售收款
    *updateReceipt({ payload, callback }, { call, put }) {
      const response = yield call(updateReceipt, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback(response);
    },
    // 更新销售退货
    *updateSalesReturn({ payload, callback }, { call, put }) {
      const response = yield call(updateSalesReturn, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback(response);
    },
    // 获取其他收入项目
    *incomeType({ payload, callback }, { call, put }) {
      const response = yield call(incomeType, payload);
      yield put({
        type: 'queryincomeType',
        payload: response,
      });
      if (callback) callback(response);
    },
    // 添加其他收入项目
    *addIncomeType({ payload, callback }, { call, put }) {
      const response = yield call(addIncomeType, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback(response);
    },
    // 删除其他收入项目
    *delIncomeType({ payload, callback }, { call, put }) {
      const response = yield call(delIncomeType, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback(response);
    },
    // 修改其他收入项目
    *updateIncomeType({ payload, callback }, { call, put }) {
      const response = yield call(updateIncomeType, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback(response);
    },
    // 获取其他支出项目
    *expenditureType({ payload, callback }, { call, put }) {
      const response = yield call(expenditureType, payload);
      yield put({
        type: 'queryincomeType',
        payload: response,
      });
      if (callback) callback(response);
    },
    // 添加其他支出项目
    *addExpenditureType({ payload, callback }, { call, put }) {
      const response = yield call(addExpenditureType, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback(response);
    },
    // 删除其他支出项目
    *delExpenditureType({ payload, callback }, { call, put }) {
      const response = yield call(delExpenditureType, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback(response);
    },
    // 修改其他支出项目
    *updateExpenditureType({ payload, callback }, { call, put }) {
      const response = yield call(updateExpenditureType, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback(response);
    },
    // 保存其他收入项目
    *otherIncomeSave({ payload, callback }, { call, put }) {
      const response = yield call(otherIncomeSave, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback(response);
    },
    // 保存其他支出项目
    *otherExpenditureSave({ payload, callback }, { call, put }) {
      const response = yield call(otherExpenditureSave, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback(response);
    },
    // 添加采购进货
    *addPurchasing({ payload, callback }, { call, put }) {
      const response = yield call(addPurchasing, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback(response);
    },
    // 获取采购进货
    *fetchPurchasing({ payload, callback }, { call, put }) {
      const response = yield call(queryPurchasing, payload);
      yield put({
        type: 'queryPurchasing',
        payload: response,
      });
      if (callback) callback(response);
    },
    // 删除采购进货
    *delPurchasing({ payload, callback }, { call, put }) {
      const response = yield call(delPurchasing, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback(response);
    },
    // 修改采购进货
    *updatePurchasing({ payload, callback }, { call, put }) {
      const response = yield call(updatePurchasing, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback(response);
    },
    // 获取采购进货详情
    *fetchPurchasingDetail({ payload, callback }, { call, put }) {
      const response = yield call(queryPurchasingDetail, payload);
      yield put({
        type: 'querySalesDetail',
        payload: response,
      });
      if (callback) callback(response);
    },
    // 添加采购退货
    *addPurchReturn({ payload, callback }, { call, put }) {
      const response = yield call(addPurchReturn, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback(response);
    },
    // 获取采购退货
    *fetchPurchReturn({ payload, callback }, { call, put }) {
      const response = yield call(queryPurchReturn, payload);
      yield put({
        type: 'queryPurchasing',
        payload: response,
      });
      if (callback) callback(response);
    },
    // 删除采购退货
    *delPurchReturn({ payload, callback }, { call, put }) {
      const response = yield call(delPurchReturn, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback(response);
    },
    // 修改采购退货
    *updatePurchReturn({ payload, callback }, { call, put }) {
      const response = yield call(updatePurchReturn, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback(response);
    },
    // 获取退货详情
    *queryPurchReturnDetail({ payload, callback }, { call, put }) {
      const response = yield call(queryPurchReturnDetail, payload);
      yield put({
        type: 'querySalesDetail',
        payload: response,
      });
      if (callback) callback(response);
    },

    // 获取采购付款订单号
    *fetchPayNum({ callback }, { call, put }) {
      const response = yield call(queryPayOrderNum);
      yield put({
        type: 'queryOrderNum',
        payload: response,
      });
      if (callback) callback(response);
    },
    // 添加采购付款
    *addPayment({ payload, callback }, { call, put }) {
      const response = yield call(addPayment, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback(response);
    },
    // 获取采购付款
    *fetchPayment({ payload, callback }, { call, put }) {
      const response = yield call(queryPayment, payload);
      yield put({
        type: 'querySaleSlip',
        payload: response,
      });
      if (callback) callback(response);
    },
    // 删除采购付款
    *delPayment({ payload, callback }, { call, put }) {
      const response = yield call(delPayment, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback(response);
    },
    // 修改采购付款
    *updatePayment({ payload, callback }, { call, put }) {
      const response = yield call(updatePayment, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback(response);
    },
    // 获取采购货品
    *fetchPurchasingsInfo({ payload, callback }, { call, put }) {
      const response = yield call(queryPurchasingsInfo, payload);
      yield put({
        type: 'querySaleProduct',
        payload: response,
      });
      if (callback) callback(response);
    },
    

  },

  reducers: {
    // 获取订单号
    queryOrderNum(state, action) {
      return {
        ...state,
        orderNum: action.payload.data,
      };
    },

    // 获取销售单据
    querySaleSlip(state, action) {
      return {
        ...state,
        salesData: action.payload.data.data,
        salesFrom: action.payload.data.from,
        salesTotal: action.payload.data.total,
        profitTotal: action.payload.data.total_profit, // 利润
        costTotal: action.payload.data.total_cost, // 成本
        payTotal: action.payload.data.total_pay, // 实收
        saleTotal: action.payload.data.total_sale, // 销售
      };
    },

    queryCustArrears(state, action) {
      return {
        ...state,
        dataSource: action.payload.data.data,
      };
    },

    //  获取详情
    querySalesDetail(state, action) {
      return {
        ...state,
        salesDetailData: action.payload.data.data,
      };
    },

    // 获取快递公司
    queryExpress(state, action) {
      return {
        ...state,
        expressCompany: action.payload.data,
      };
    },

    // 获取销售货品
    querySaleProduct(state, action) {
      return {
        ...state,
        saleProduct: action.payload.data.data,
        salesProductFrom: action.payload.data.from,
        total: action.payload.data.total,
      };
    },

    // 获取销售退货
    querySaleReturn(state, action) {
      return {
        ...state,
        salesData: action.payload.data.data,
        salesFrom: action.payload.data.from,
        salesTotal: action.payload.data.total,
      };
    },

    // 获取其他收入项目
    queryincomeType(state, action) {
      return {
        ...state,
        incomeTypeData: action.payload.data,
      };
    },
    // 获取采购进货单、退货单
    queryPurchasing(state, action) {
      return {
        ...state,
        purchasingData: action.payload.data.data,
        dataFrom: action.payload.data.from,
        dataTotal: action.payload.data.total,
        purchaseTotal: action.payload.data.total_price , // 进货金额
        creditTotal: action.payload.data.arrears, // 赊账金额 
        payTotal: action.payload.data.pay, // 实付金额
      };
    },

    // 添加、删除、更新
    save(state, payload) {
      return {
        ...state,
        ...payload,
      };
    },
  },
};
