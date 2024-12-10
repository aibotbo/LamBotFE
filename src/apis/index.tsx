const BASE_URL = process.env.REACT_APP_BASE_URL;

const APIs = {
  followbotschedule: BASE_URL + '/bot/followbotschedule/',
  followbotscheduleupdate: BASE_URL + '/bot/followbotschedules/',
  registration: BASE_URL + '/auth/registration/',
  registrationVerify: BASE_URL + '/auth/account-confirm-email/',
  login: BASE_URL + '/auth/login/',
  resetPasswordRequest: BASE_URL + '/auth/password/reset/',
  resetPasswordConfirm: BASE_URL + '/auth/password/reset/confirm/',
  placeOrder: BASE_URL + '/partner/placeorder/',
  placeCopyTradeOrder: BASE_URL + '/partner/copytrade/',
  dashboard: BASE_URL + '/dashboard/',
  dashboardMonth: BASE_URL + '/dashboard/month/',
  dashboardMonthSum: BASE_URL + '/dashboard/monthsum/',
  dashboardReset: BASE_URL + '/dashboard/update/', // + ids
  copyTradeTotalFollow: BASE_URL + '/dashboard/totalfollow/',
  price: BASE_URL + '/price/',
  createCopyTradeSetting: BASE_URL + '/followtrade/create/',
  listCopyTradeSetting: BASE_URL + '/followtrade/list/',
  listCopyTradeSettingBlocking: BASE_URL + '/followtrade/listblock/',
  listCopyTradeSettingNonBlocking: BASE_URL + '/followtrade/listnonblock/',
  listCopyTradeSettingByFollowerId: BASE_URL + '/followtrade/listfollow/',
  listCopyTradeSettingByMasterId: BASE_URL + '/followtrade/listmaster/',
  listCopyTradeMasterFollowedByFollowerIds:
    BASE_URL + '/followtrade/listmasterfollowed/', // + follower_ids
  deleteSettingById: BASE_URL + '/followtrade/delete/', // + id
  updateSettingByIds: BASE_URL + '/followtrade/details/', // + ids
  updateSettingStatusByIds: BASE_URL + '/followtrade/updatestt/', // + ids
  updateSettingBlockStatusByIds: BASE_URL + '/followtrade/updateblock/', // + ids
  updateSettingUltimateIds: BASE_URL + '/followtrade/updateultimate/', // + ids
  allAccounts: BASE_URL + '/partner/allacc/',
  balanceById: BASE_URL + '/partner/balance/', // + id
  reloadDemoBalance: BASE_URL + '/partner/reloaddemo/',
  currentSession: BASE_URL + '/partner/current-session',
  partnerAccount: BASE_URL + '/partner/list/',
  partnerSearch: BASE_URL + '/partner/search/', // + botname
  partnerAccountDetail: BASE_URL + '/partner/details/', //  + id
  deletePartnerAccountsByIds: BASE_URL + '/partner/delete/', //  + id
  transferLiveToUSDT: BASE_URL + '/partner/transferlivetousdt/', //  + id / amount
  transferUSDTToLive: BASE_URL + '/partner/transferusdttolive/', //  + id / amount
  orderSelfList: BASE_URL + '/order/list/',
  orderCopyTradeList: BASE_URL + '/order/listcopy/',
  orderMasterList: BASE_URL + '/order/masterorder/',
  orderBotList: BASE_URL + '/order/listbot/',
  orderBotListResult: BASE_URL + '/order/listresult/',
  updateOrderListById: BASE_URL + '/order/update/',
  deleteOrderByIds: BASE_URL + '/order/deleteorder/', // + id
  deleteMasterOrderByIds: BASE_URL + '/order/deletemasterorder/', // + id
  botManagementList: BASE_URL + '/bot/budgetmanagetlist/',
  botSignalList: BASE_URL + '/bot/signallist/',
  createAutoBot: BASE_URL + '/bot/followbotcreate/',
  donateAutoBot: BASE_URL + '/bot/followbotdonate/',
  updateAutoBotInfo: BASE_URL + '/bot/followbotupdateinfo/', // + id
  updateAutoBotAccountTypeByIds: BASE_URL + '/bot/followbotupdateacctype/', // + id
  updateAutoBotUltimateByIds: BASE_URL + '/bot/followbotupdultimate/', // + id
  updateAutoBotFollowerByIds: BASE_URL + '/bot/followbotupdatefollower/', // + id
  updateAutoBotStatusByIds: BASE_URL + '/bot/followbotupdatestt/', // + id
  deleteAutoBotStatusByIds: BASE_URL + '/bot/followbotdelete/', // + id
  createBotSignalPersonal: BASE_URL + '/bot/signalpersonalcreate/',
  updateBotSignalPersonal: BASE_URL + '/bot/signalpersonalupdate/', // + id
  deleteBotSignalPersonal: BASE_URL + '/bot/signalpersonaldelete/', // + id
  botSignalBuySellList: BASE_URL + '/bot/signalbuyselllist/',
  botSignalBubbleList: BASE_URL + '/bot/signalbubblelist/',
  botSignalPersonalList: BASE_URL + '/bot/signalpersonallist/',
  autoBotList: BASE_URL + '/bot/followbotlist/',
  aim: BASE_URL + '/aim/',
  botSignalTeleList: BASE_URL + "/bot/signaltelelist/",
  botOrderDetail: BASE_URL + "/order/signal", // + id
};

export default APIs;
