/*!-----------------------------------------------------------------
  Name: neXessary - neXessary
  Version: 0.0.0
  Author: fujitsu
  Website: http://fujitsu.com
  Purchase: http://fujitsu.com
  Support: http://fujitsu.com
  License: You must have a valid license purchased only from ThemeForest (the above link) in order to legally use the theme for your project.
  Copyright 2018.
-------------------------------------------------------------------*/


/*
*　業界一覧取得
*/
function getBusinessTypeFromAjax() {
  var $defer = $.Deferred();

  var returnValue;

  $finplex_core.doGet({
    commandUrl: $finplex_utils.formatString("businessTypes", $finplex_core.getApiVer()),
    funcDone: function (jsonData) {
      returnValue = jsonData;
      $defer.resolve(returnValue);
    },
    funcFail: function (response) {
      console.log("fail");
      $defer.reject(response);
    },
  });
  return $defer.promise();

}

/**
* 関連キーワード取得(業種より取得)
*/
function getTrendWordsFromBusinessType(businessType, level, limit) {
  var $defer = $.Deferred();

  //frontで取得
  var requestJson = _.cloneDeep($finplex_core.getTrendWordsProperty.fromBusinessType);
  requestJson.businessTypeCode = businessType.code;
  if (level) requestJson.depth = level;
  if (limit) requestJson.limitCount = limit;


  var returnValue;

  $finplex_core.doGet({
    commandUrl: $finplex_utils.formatString("trendwords", $finplex_core.getApiVer()),
    options: requestJson,
    funcDone: function (jsonData) {
      returnValue = jsonData;
      $defer.resolve(returnValue);
    },
    funcFail: function (response) {
      console.log("fail");
      $defer.reject(response);
    },
  });


  return $defer.promise();
}

/**
* 関連キーワード取得
*/
function getTrendWordsFromKeyword(businessTypeCode, keyword, level, limit) {

  var $defer = $.Deferred();

  var requestJson = _.cloneDeep($finplex_core.getTrendWordsProperty.fromKeyword);
  requestJson.businessTypeCode = businessTypeCode;
  requestJson.word = keyword;
  if (level) requestJson.depth = level;
  if (limit) requestJson.limitCount = limit;

  var returnValue;

  $finplex_core.doGet({
    commandUrl: $finplex_utils.formatString("trendwords", $finplex_core.getApiVer()),
    options: requestJson,
    funcDone: function (jsonData) {
      returnValue = jsonData;
      $defer.resolve(returnValue);
    },
    funcFail: function (response) {
      console.log("fail");
      $defer.reject(response);
    },
  });

  return $defer.promise();
}

/**
 * 関連キーワード保存
 * @param {*} businessTypeCode 
 * @param {*} trendWord 
 * @param {*} funcDone 
 * @param {*} funcFail 
 */
function postSaveTrendWord(businessTypeCode, trendWord, funcDone, funcFail) {

  $finplex_core.doPost({
    commandUrl: $finplex_utils.formatString("trendwords/", $finplex_core.getApiVer()),
    options: {
      businessTypeCode: businessTypeCode,
      trendWord: trendWord
    },
    funcDone: funcDone,
    funcFail: funcFail,
  });

}

/**
 * 関連キーワード削除
 * @param {*} businessTypeCode 
 * @param {*} trendWord 
 * @param {*} funcDone 
 * @param {*} funcFail 
 */
function deleteTrendWord(businessTypeCode, trendWord, funcDone, funcFail) {

  $finplex_core.doDelete({
    commandUrl: $finplex_utils.formatString("trendwords/", $finplex_core.getApiVer()),
    options: {
      businessTypeCode: businessTypeCode,
      trendWord: trendWord
    },
    funcDone: funcDone,
    funcFail: funcFail,
  });

}

/**
 * 
 * @param {*} businessTypeCode 
 * @param {*} oldTrendWord 
 * @param {*} newTrendWord 
 * @param {*} funcDone 
 * @param {*} funcFail 
 */
function putUpdateTrendWord(businessTypeCode, oldTrendWord, newTrendWord, funcDone, funcFail) {

  $finplex_core.doPut({
    commandUrl: $finplex_utils.formatString("trendwords/", $finplex_core.getApiVer()),
    options: {
      businessTypeCode: businessTypeCode,
      oldTrendWord: oldTrendWord,
      newTrendWord: newTrendWord
    },
    funcDone: funcDone,
    funcFail: funcFail,
  });

}