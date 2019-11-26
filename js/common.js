var global_opener_grid;
var global_opener_recid;

//공통코드 콤보박스 item조회
var getCommonCodes = function(LGRP_CD){
    var result = [];
    $.ajax({
       type : 'GET',
       url : '/admin/system/commonCode.do?method=getCommonCodes',
       data : {LGRP_CD:LGRP_CD},
       dataType : 'json',
       async:false,
       success : function(data, status, xhr){
           result = data.records;
       },error : function(jqXHR, textStatus, errorThrown){
           console.log(jqxXHR.responseText);
       }
    });
    return result;
}

//그리드 crud 아이콘표시
var setCRUDFlag = function(gridObj, rowKey, status,updateYn){
    
    var icon="";
    var oldStatus = gridObj.getValue(rowKey,'status',false);

    if(status == "I"){
        icon = "<span class='ico-cell' title=''><i class='ion ion-md-create'></i></span>";
        gridObj.setValue(rowKey, 'userSet', icon);
    }else if(status == "U" && oldStatus != "I"){
        icon = "<span class='ico-cell' title=''><i class='ion ion-md-checkbox-outline'></i></span>";
        gridObj.setValue(rowKey, 'userSet', icon);
    }
    if(updateYn == true && oldStatus != "I"){
        gridObj.setValue(rowKey, 'status',status);  
    }
    
}


function openPopup(layout, grid, form, callbackFunc) {
    w2popup.open({
        title   : 'Popup',
        width   : 900,
        height  : 600,
        showMax : true,
        body    : '<div id="main" style="position: absolute; left: 5px; top: 5px; right: 5px; bottom: 5px;"></div>',
        buttons   : '<button class="w2ui-btn" onclick="eval('+callbackFunc+')()">적용</button> '+
        '<button class="w2ui-btn" onclick="w2popup.close();">닫기</button>',

        onOpen  : function (event) {
            event.onComplete = function () {
                $('#w2ui-popup #main').w2render(layout.name);
                layout.content('left', grid);
                layout.content('main', form);
            };
        },
        onToggle: function (event) { 
            event.onComplete = function () {
                layout.resize();
            }
        }
    });
}

var cmmSetCellValue_Grid = function(popGrid, targetKeys){
  var popSel = popGrid.getSelection();
  if(popSel.length == 0 ){return;}
  
  var popSelIds = popGrid.get(popSel[0]);
  global_opener_grid.select(global_opener_recid);
  var parentSelIds = global_opener_grid.getSelection();
  var keyStr = "";
  var arrKey = targetKeys.split(",");
  for(var i in arrKey){
      keyStr += ", "+arrKey[i]+": popSelIds."+arrKey[i];
  }
  
  eval('global_opener_grid.set(parentSelIds[0], {w2ui:{changes:{recid : parentSelIds[0], CRUD:"U"'+keyStr+'}}})');
  setCRUDFlag(global_opener_grid, "U");
  w2popup.close();
}

var cmmSetCellValue_Form = function(popGrid, targetForm, targetFormKeyValue, targetGridKeys){
    var popSel = popGrid.getSelection();
    if(popSel.length == 0 ){return;}
    
    var popSelIds = popGrid.get(popSel[0]);
    
    var arrFormKey = targetFormKeyValue.split(',');
    for(var i in arrFormKey){
        var split_ = arrFormKey[i].split('=');
        targetForm.record[split_[0]] = popSelIds[split_[1]];
    }
    
    targetForm.refresh();
    
    var parentSelIds = global_opener_grid.getSelection();
    
    var keyStr = "";
    var arrKey = targetGridKeys.split(",");
    for(var i in arrKey){
        keyStr += ", "+arrKey[i]+": popSelIds."+arrKey[i];
    }
    
  //값이변경된경우 이미추가된건에 대해서는 'U'(수정) 으로 바뀌지 않음
    var selIds =global_opener_grid.get(parentSelIds[0]);
    var crud = "";
    if(selIds.CRUD != "C"){
        crud = "U";
    }else{
        crud = "C";
    }
    
    eval('global_opener_grid.set(parentSelIds[0], {w2ui:{changes:{recid : parentSelIds[0], CRUD:"'+crud+'"'+keyStr+', validate : targetForm.validate().length, }}})');
    setCRUDFlag(global_opener_grid, crud);
    w2popup.close();
  }

var cmmAdd = function(grid, pInitItems){
    grid.selectNone();
    var len = grid.records.length;

    //아이템 기본값
    var initItems = { CRUD: 'C', recid: len + 1 };
    if(pInitItems != undefined){
        var splt = pInitItems.split(',');
        for(var i in splt){
            var split_ = splt[i].split('=');
            initItems[split_[0]] = split_[1];
        }
    }
    
    
    grid.add(initItems, true);
    //행 추가후 추가된 행 select
    setTimeout(function () {
        $("#grid_grid1_rec_"+(len+1)).trigger("click");
        grid.select(len + 1);
    }, 150);

    setCRUDFlag(grid, 'C');

}

var checkDuplicate = function(data, url){
    var result = [];
    $.ajax({
       type : 'GET',
       url : url,
       data : data,
       dataType : 'json',
       async:false,
       success : function(data, status, xhr){
           result = data.data.duplicate;
       },error : function(jqxXHR, textStatus, errorThrown){
           console.log(jqxXHR.responseText);
       }
    });
    return result;
}

//폼객체가져오기(input)
var getFormInput = function(form, id){
    return $("div[name='"+form.name+"']").find("input[name='"+id+"']");
}

//폼객체가져오기(input)
var getFormTextarea = function(form, id){
    return $("div[name='" + form.name + "']").find("textarea[name='"+id+"']");
}
//폼객체가져오기(select)
var getFormSelect = function(form, id){
    return $("div[name='" + form.name + "']").find("select[name='"+id+"']");
}

//폼객체가져오기(select)
var getFormCheckbox= function(form, id){
    return $("div[name='" + form.name + "']").find("input:checkbox[name='"+id+"']");
}

//폼객체에 에러메시지띄우기
var showErrorMsg = function(cssSelector, errorMsg){
    $(cssSelector).w2tag(errorMsg, {class:'w2ui-error'});
    $(cssSelector).addClass('w2ui-error');
}

var removeErrorMsg = function(cssSelector, errorMsg){
    $(cssSelector).removeClass('w2ui-error');
}

var nvl = function(obj){
    var rtn = "";
    if(obj == "" || obj == null || obj == undefined){
        rtn = "";
    }else{
        rtn = obj;
    }
    return rtn;
}

/*
@File Name   : comUtil.js
@Description : 문자열 변환, 유효성 체크, 팝업 등 관련 공통 함수를 제공한다.
@modification Information
@
@  수정일            수정자      수정내용
@ -------     ------   --------------------
@ 2016.04.20    나명호     최초작성
@author  : 나명호
@since   : 2016.04.20
@verson  : 1.0
*/



/** IE8 trim 않먹어서 추가*/
String.prototype.trim = function() {
   return this.replace(/(^\s*)|(\s*$)/gi, "");
};


/*******************************************************
함 수 명 : gfnIsNull
설    명 : 입력값이 null인지 체크 
인    자 : sValue    입력값 
리    턴 : true/false
*******************************************************/
function gfnIsNull(sValue)
{
   if( new String(sValue).valueOf() == "undefined") 
       return true;
   if( sValue == null )
       return true;
   if( sValue.toString().trim().length == 0 )
       return true;
   return false;
}

/*******************************************************
함 수 명 : gfnLpad
설    명 : 문자열을 지정된 길이만큼 지정한 문자로 왼쪽을 채움 
인    자 : sValue    입력값
          nLength    출력될 문자열의 길이
          Char        채울 문자
리    턴 : 문자열
*******************************************************/
function gfnLpad(sValue, nLength, Char) {
   
   if (new String(sValue).valueOf() == "undefined")
       sValue = "";
   if (gfnIsNull(sValue))
       sValue = "";

   var strRetVal = new String(sValue);
   var strChar = "";
   var nIteration = nLength - gfnGetLengB(strRetVal);
   for (var i = 0; i < nIteration; i++) {
       strChar = Char + strChar;
   }
   return (strChar + strRetVal);
}


/*******************************************************
함 수 명 : gfnGetLengB
설    명 : 문자열의 길이를 Byte단위로 계산하여 Return
인    자 : sValue    입력값
리    턴 : 문자길이
*******************************************************/
function gfnGetLengB(sValue)
{
       var v_ChkStr = sValue.toString();
   var v_cnt = 0;

   for (var i = 0; i < v_ChkStr.length; i++) {
       if (v_ChkStr.charCodeAt(i) > 127) {
           v_cnt += 3;
       } else {
           v_cnt += 1;
       }
   }
   return v_cnt;
}


/*******************************************************
함 수 명 : gfnToday
설    명 : 오늘일자세팅
인    자 : 없음
리    턴 : yyyymmdd
*******************************************************/
function gfnToday()
{

   var d = new Date();

   var s = d.getFullYear() + gfnLpad((d.getMonth() + 1) + "", 2, "0")
           + gfnLpad(d.getDate(), 2, "0");

   return (s);
}

/*******************************************************
함 수 명 : gfnGetHHMM
설    명 : 현재시각(시,분) 반환
인    자 : 
리    턴 : HHMM
*******************************************************/
function gfnGetHHMM()
{
   var cDate = new Date();
   var cHour = cDate.getHours();
   var cMinute = cDate.getMinutes();
   if(cHour < 10) cHour = "0" + cHour;
   if(cMinute < 10) cMinute = "0" + cMinute; 
   return cHour + ":" + cMinute;
}


/*******************************************************
함 수 명 : gfnPatternDay
설    명 : 일자 포맷변경
인    자 : 일자(yyyymmdd) / 구분값(-)
리    턴 : yyyy-mm-dd
*******************************************************/
function gfnPatternDay(sYmd,sGbn)
{
   var sRtn = "";
   
   if(!gfnIsNull(sYmd))
   {
       sRtn = sYmd.substr(0,4)    
            + sGbn
            + sYmd.substr(4,2)
            + sGbn
            + sYmd.substr(6,2);
   }

   return sRtn;
}


/*******************************************************
함 수 명 : gfnGetAddDate
설    명 : 입력한 일자에 지정한 일수를 계산. 
인    자 : sDate 일자(yyyymmdd) 
         iDay 일수
리    턴 : iDay 후  일자
*******************************************************/
function gfnGetAddDate(sDate,iDay) 
{
   var iTmpYy = parseInt(sDate.substr(0, 4), 10);
   var iTmpMm = parseInt(sDate.substr(4, 2), 10);
   var iTmpDd = parseInt(sDate.substr(6, 2), 10);
   var dTmpDt = new Date(iTmpYy, iTmpMm - 1, iTmpDd + iDay);

   var s = dTmpDt.getFullYear()
           + gfnLpad((dTmpDt.getMonth() + 1) + "", 2, "0")
           + gfnLpad(dTmpDt.getDate(), 2, "0");

   return (s);
}

/*******************************************************
함 수 명 : gfnStr2Date
설    명 : 입력일자를 Date type으로 변환
인    자 : inDate 일자('yyyyMMdd' 형태로 표현된 날짜.) 
리    턴 : date
수정정보 : 2016.04.01  나명호  최초작성
*******************************************************/
function gfnStr2Date(inDate)
{
     var date = new Date(parseInt(inDate.substr(0, 4)), parseInt(inDate.substr( 4, 2)) - 1, parseInt(inDate.substr(6, 2)));
   return date;
}


/*******************************************************
함 수 명 : gfnJsDateCalculation
설    명 : 현재일자를 기준으로 이전 날짜 반환
인    자 : 현재일자,기간
리    턴 : date
*******************************************************/
function gfnJsDateCalculation(date, term) {
   var selectDate = date.split("-");
   var changeDate = new Date();

   if (term == 'day') {
       // 하루전
       changeDate.setFullYear(selectDate[0], selectDate[1] - 1, selectDate[2]);
   }

   if (term == 'week') {
       // 일주일전
       changeDate.setFullYear(selectDate[0], selectDate[1] - 1, selectDate[2] - 7);
   }

   if (term == 'month') {
       // 한달전
       changeDate.setFullYear(selectDate[0], selectDate[1] - 2, selectDate[2]);
   }

   if (term == '3month') {
       // 석달전
       changeDate.setFullYear(selectDate[0], selectDate[1] - 4, selectDate[2]);
   }
   
   if (term == '6month') {
       // 석달전
       changeDate.setFullYear(selectDate[0], selectDate[1] - 7, selectDate[2]);
   }

   if (term == 'year') {
       // 일년전
       changeDate.setFullYear(selectDate[0] - 1, selectDate[1] - 1, selectDate[2]);
   }
   
   if (term == 'year2') {
       // 일년전
       changeDate.setFullYear(selectDate[0] -1, selectDate[1], selectDate[2]);
   }

   var y = changeDate.getFullYear();
   var m = changeDate.getMonth() + 1;
   var d = changeDate.getDate();

   if (m < 10) {
       m = "0" + m;
   }

   if (d < 10) {
       d = "0" + d;
   }

   var resultDate = y + "-" + m + "-" + d;

   return resultDate;
};


/*******************************************************
함 수 명 : gfnJsDateCalculationAft
설    명 : 현재일자를 기준으로 이후 날짜 반환
인    자 : 현재일자,기간
리    턴 : date
*******************************************************/
function gfnJsDateCalculationAft(date, term) {
   var selectDate = date.split("-");
   var changeDate = new Date();

   if (term == 'day') {
       // 하루후
       changeDate.setFullYear(selectDate[0], selectDate[1] - 1, selectDate[2]);
   }

   if (term == 'week') {
       // 일주일후
       changeDate.setFullYear(selectDate[0] , selectDate[1] -1 , selectDate[2] -1 + 7);
   }

   if (term == 'month') {
       // 한달후
       changeDate.setFullYear(selectDate[0], selectDate[1] - 1 + 1, selectDate[2]);
   }

   if (term == '3month') {
       // 석달후
       changeDate.setFullYear(selectDate[0], selectDate[1] - 1 + 3, selectDate[2]);
   }

   if (term == 'year') {
       // 일년후
       changeDate.setFullYear(selectDate[0] -1 +2, selectDate[1]-1, selectDate[2]);
   }

   if (term == 'year2') {
       // 일년후
       changeDate.setFullYear(selectDate[0] -1 +2, selectDate[1]-2, selectDate[2]);
   }

   var y = changeDate.getFullYear();
   var m = changeDate.getMonth() + 1;
   var d = changeDate.getDate();

   if (m < 10) {
       m = "0" + m;
   }

   if (d < 10) {
       d = "0" + d;
   }

   var resultDate = y + "-" + m + "-" + d;

   return resultDate;
};

/*******************************************************
함 수 명 : gfnFtlPwdChk
설    명 : 포탈용 비밀번호 검증함수
인    자 : id1 : 비밀번호 textbox id
         id2 : 비밀번호 확인 textbox id
         id3 : 회원id textbox id
         id4 : 생일 textbox id (yyyymmdd)
         id5 : 핸드폰번호 textbox id ('-'포함)
         id6 : 전화번호   textbox id ('-'포함)
리    턴 : boolean
수정정보 : 
*******************************************************/
function gfnFtlPwdChk(id1, id2, id3, id4, id5, id6){
   //필수값
   var pwd = $("#" + id1).val();
   var chkValue = $("#" + id2).val();
   var chkId = $("#" + id3).val();
   //선택값
   var chkBrthDe = $("#" + id4).val();
   var chkMblPhone = $("#" + id5).val();
   var chkPhone = $("#" + id6).val();
   
   var chkId1 = chkId.substring(0,4);
   var chkId2 = chkId.substring(chkId.length-4,chkId.length);
   
   //선택값
   var chkBrthDe1;
   var chkBrthDe2;
   if(!gfnIsNull(chkBrthDe)){
       chkBrthDe1 = chkBrthDe.substring(0,4);
       chkBrthDe2 = chkBrthDe.substring(chkBrthDe.length-4,chkBrthDe.length);
   }
   
   var chkMblPhone1;
   var chkMblPhone2;
   if(!gfnIsNull(chkMblPhone)){
       chkMblPhone1 = chkMblPhone.substring(chkMblPhone.indexOf("-")+1,chkMblPhone.lastIndexOf("-"));
       chkMblPhone2 = chkMblPhone.substring(chkMblPhone.lastIndexOf("-")+1,chkMblPhone.length);
   }
   
   var chkPhone1;
   var chkPhone2;
   if(!gfnIsNull(chkPhone)){
       chkPhone1 = chkPhone.substring(chkPhone.indexOf("-")+1,chkPhone.lastIndexOf("-"));
       chkPhone2 = chkPhone.substring(chkPhone.lastIndexOf("-")+1,chkPhone.length);
   }
   
   var chk_num = pwd.search(/[0-9]/g);
   var chk_eng = pwd.search(/[a-zA-z]/ig);
   var chk_spcstr = pwd.search(/[~`!@#$%&^*()\-_=+\\\|\[\]{};:\'",.<>\/?]/g);
   
   if(pwd.length < 10 || pwd.length > 20){
       alert('비밀번호는 10자리 이상, 20자리 이하로 입력하여야 합니다.');
       $("#" + id1).val("");
       $("#" + id2).val("");
       $("#" + id1).focus();
       return false;
   /* 2016-08-06 김홍은 수정 chk_num + chk_eng + chk_spcstr < 0  */
   /* 2016-08-06 박진성 수정 chk_num < 0 || chk_eng < 0 || chk_spcstr < 0 2가지만 혼용해도 가능*/
   }else if(chk_num + chk_eng + chk_spcstr < 0){
       alert('비밀번호는 숫자와 영문자 특수문자를 2가지 이상 혼용하여야 합니다.');
       $("#" + id1).val("");
       $("#" + id2).val("");
       $("#" + id1).focus();
       return false;
   }else if(/(\w)\1\1\1/.test(pwd)){
       alert('비밀번호에 같은 문자를 4번 이상 사용하실 수 없습니다.');
       $("#" + id1).val("");
       $("#" + id2).val("");
       $("#" + id1).focus();
       return false;
   }else if(pwd != chkValue){
       alert('입력된 비밀번호와 비밀번호 확인 값이 일치하지 않습니다.');
       $("#" + id1).val("");
       $("#" + id2).val("");
       $("#" + id1).focus();
       return false;
   }else{
       var max = 4; //4회 이상 같은 수가 입력될 수 없도록 4를 지정함.
       var ptn = "";
       for (var i=0; i<pwd.length; i++) {
         ptn += "["+i+"]{"+max+",}|"; //연속된 숫자를 체크하기 위한 정규코드를 만듭니다.
         ptn += i+""+(i+1)+""+(i+2)+""+(i+3)+"|"; //0123 혹은 1234 혹은 2345 등등 이런식도 체크합니다.
       }
       ptn = new RegExp( ptn.replace(/.$/, "") );
       if(ptn.test(pwd)){
           alert('비밀번호에 연속된 숫자는 사용하실 수 없습니다.');
           $("#" + id1).val("");
           $("#" + id2).val("");
           $("#" + id1).focus();
           return false;
       }
       if(!gfnIsNull(chkId)){
           if((pwd.search(chkId1) > -1) || (pwd.search(chkId2) > -1)){
               
               alert('비밀번호에 아이디는 포함 될 수 없습니다.');
               $("#" + id1).val("");
               $("#" + id2).val("");
               $("#" + id1).focus();
               return false;
           }
       }
       if(!gfnIsNull(chkBrthDe)){
           if((pwd.search(chkBrthDe1) > -1) || (pwd.search(chkBrthDe2) > -1)){
               alert('비밀번호에 생년월일은 포함 될 수 없습니다.');
               $("#" + id1).val("");
               $("#" + id2).val("");
               $("#" + id1).focus();
               return false;
           }
       }
       if(!gfnIsNull(chkMblPhone)){
           if((pwd.search(chkMblPhone1) > -1) || (pwd.search(chkMblPhone2) > -1)){
               alert('비밀번호에 핸드폰 번호는 포함 될 수 없습니다.');
               $("#" + id1).val("");
               $("#" + id2).val("");
               $("#" + id1).focus();
               return false;
           }
       }
       if(!gfnIsNull(chkPhone)){
           if((pwd.search(chkPhone1) > -1) || (pwd.search(chkPhone2) > -1)){
               alert('비밀번호에 전화번호는 포함 될 수 없습니다.');
               $("#" + id1).val("");
               $("#" + id2).val("");
               $("#" + id1).focus();
               return false;
           }
       }
   }
   return true;
} 

/*******************************************************
함 수 명 : gfnIsNumberChk
설    명 : 숫자만 입력되도록 제한
인    자 : 입력값
리    턴 : boolean
*******************************************************/
function gfnIsNumberChk(control) {
   
   var val = control;
   var Num = "1234567890";

   for (var i=0; i<val.length; i++) {
       if(Num.indexOf(val.substring(i,i+1))<0) {
           return false;
       }
   }
   return true;
}


/*******************************************************
함 수 명 : gfnReplaceAll
설    명 : 동일문자를 변환하여 반환
인    자 :  str : 문자열
          searchStr : 변경 할 문자
          replaceStr : 변경 될 문자
리    턴 : 변환 문자
*******************************************************/
function gfnReplaceAll(str, searchStr, replaceStr) {
   return str.split(searchStr).join(replaceStr);
}

/*******************************************************
함 수 명 : gfnChkNumOnly
설    명 : 입력창 입력제한(숫자만 입력가능) 
인    자 :  obj - input id
리    턴 : 변환 문자
*******************************************************/
function gfnChkNumOnly(obj){
   var lkeycode;
   e = window.event;
   if(window.event){ 
       
       lkeycode = e.keyCode; 
   } 
   else{ 
       lkeycode = e.charCode; 
   } 
   
   if(lkeycode != 0){
       if(!(lkeycode >= 37 && lkeycode <= 40)) {
           $(obj).val( $(obj).val().replace(/[^0-9]/g, ''));
       }
   }
   
}

/*******************************************************
함 수 명 : gfnChkEngLowNum
설    명 : 입력창 입력제한(영소문자, 숫자만 입력가능) 
인    자 :  obj - input id
리    턴 : 변환 문자
*******************************************************/
function gfnChkEngLowNum(obj){
   var lkeycode;
   e = window.event;
   if(window.event){ 
       
       lkeycode = e.keyCode; 
   } 
   else{ 
       lkeycode = e.charCode; 
   } 
   
   if(lkeycode != 0){
       if(!(lkeycode >= 37 && lkeycode <= 40)) {
           $(obj).val( $(obj).val().replace(/[^a-z0-9]/g, ''));
       }
   }
   
}

/*******************************************************
함 수 명 : gfnChkId
설    명 : 입력창 입력제한(영소문자,영대문자, 숫자만 입력가능) 
인    자 :  obj - input id
리    턴 : 변환 문자
*******************************************************/
function gfnChkEngLowNum(obj){
   var lkeycode;
   e = window.event;
   if(window.event){ 
       
       lkeycode = e.keyCode; 
   } 
   else{ 
       lkeycode = e.charCode; 
   } 
   
   if(lkeycode != 0){
       if(!(lkeycode >= 37 && lkeycode <= 40)) {
           $(obj).val( $(obj).val().replace(/[^a-zA-Z0-9]/g, ''));
       }
   }
   
}

/*******************************************************
함 수 명 : gfnChkPwd
설    명 : 입력창 입력제한(비밀번호필드) 
인    자 :  obj - input id
리    턴 : 변환 문자
*******************************************************/
function gfnChkPwd(obj){
   var lkeycode;
   e = window.event;
   if(window.event){ 
       
       lkeycode = e.keyCode; 
   } 
   else{ 
       lkeycode = e.charCode; 
   } 
   
   if(lkeycode != 0){
       if(!(lkeycode >= 37 && lkeycode <= 40)) {
           $(obj).val( $(obj).val().replace(/[^a-zA-Z0-9~`!@#$%&^*()\-_=+\\\|\[\]{};:\'",.<>\/?]/gi, ''));
       }
   }
}


/*******************************************************
함 수 명 : gfnChkKo
설    명 : 입력창 입력제한(한글만입력) 
인    자 :  obj - input id
리    턴 : 변환 문자
*******************************************************/
function gfnChkKo(obj){
   var lkeycode;
   e = window.event;
   if(window.event){ 
       
       lkeycode = e.keyCode; 
   } 
   else{ 
       lkeycode = e.charCode; 
   } 
   
   if(lkeycode != 0){
       if(!(lkeycode >= 37 && lkeycode <= 40)) {
           $(obj).val( $(obj).val().replace(/[a-z0-9\s~`!@#$%&^*()\-_=+\\\|\[\]{};:\'",.<>\/?]/gi, ''));
       }
   }
}


/*******************************************************
함 수 명 : gfnChkEmail
설    명 : 입력창 입력제한(이메일)
인    자 :  obj - input id
리    턴 : 변환 문자
*******************************************************/
function gfnChkEmail(obj) {
   var lkeycode;
   e = window.event;
   if (window.event) {

       lkeycode = e.keyCode;
   } else {
       lkeycode = e.charCode;
   }

   if (lkeycode != 0) {
       if (!(lkeycode >= 37 && lkeycode <= 40)) {
           $(obj).val($(obj).val().replace(/[^a-zA-Z0-9._-]/g, ''));
       }
   }
}

/*******************************************************
함 수 명 : gfnChkEmailId
설    명 : 입력창 입력제한(이메일@포함)
인    자 :  obj - input id
리    턴 : 변환 문자
*******************************************************/
function gfnChkEmailId(obj) {
   var lkeycode;
   e = window.event;
   if (window.event) {

       lkeycode = e.keyCode;
   } else {
       lkeycode = e.charCode;
   }

   if (lkeycode != 0) {
       if (!(lkeycode >= 37 && lkeycode <= 40)) {
           $(obj).val($(obj).val().replace(/[^a-zA-Z0-9@._-]/g, ''));
       }
   }
}

/*******************************************************
함 수 명 : gfnChkEmailFormat
설    명 : 이메일 포멧 검사 
인    자 :  obj - document.getElementById('input id')
리    턴 : boolean
*******************************************************/
function gfnChkEmailFormat(obj)
{
   var str = $(obj).val();
   var myRe=/^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/;
   var checked = myRe.test(str); 

   return checked;
}

/*******************************************************
함 수 명 : gfnChkTxtEmailFormat
설    명 : 이메일 포멧 검사 
인    자 :  txt - text
리    턴 : boolean
*******************************************************/
function gfnChkTxtEmailFormat(txt)
{
   var str = txt;
   var myRe=/^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/;
   var checked = myRe.test(str); 

   return checked;
}

/*******************************************************
함 수 명 : gfnFormatNumber
설    명 : 숫자에 , 처리 
인    자 : 숫자
리    턴 : 콤마 숫자
*******************************************************/
function gfnFormatNumber(val)
{
   if( new String(val).valueOf() == "undefined") 
       return "0";
   var returnVal = val+'';
   
   returnVal = returnVal.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
   
  return returnVal;
}

/*******************************************************
함 수 명 : gfnGetIeVersion
설    명 : 현재 접속 ie 체크 (Explorer 만 해당 )
인    자 : 
리    턴 : Version
*******************************************************/
function gfnGetIeVersion()
{
   var rv = -1;
   if (navigator.appName == 'Microsoft Internet Explorer') 
   {
       var ua = navigator.userAgent;
       var re = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
       if (re.exec(ua) != null)
           rv = parseFloat(RegExp.$1);
   }
   // 추가 부분 
   if (rv < 8) 
   {
      var trident = navigator.userAgent.match(/Trident\/(\d.\d)/i);

       if (trident != null)
       {
           rv = trident[1]*1 + 4;
       }
   }
   return rv;
}


/*******************************************************
함 수 명 : gfnPopupLoc
설    명 : 팝업 위치값 구하기
인    자 : setGbn      top / left
         argPopParm[0]  팝업위치코드 (209001 = 왼쪽상단 , 209002 = 중앙 , 209003 = 오른쪽상단, null = 직접입력)
         argPopParm[1]  팝업 top  위치
         argPopParm[2]  팝업 left 위치
         argPopParm[3]  팝업 width size
         argPopParm[4]  팝업 left size
리    턴 : true/false
*******************************************************/
function gfnPopupLoc(setGbn,argPopParm)
{
    var dualScreenLeft = window.screenLeft != undefined ? window.screenLeft : screen.left;
    var dualScreenTop = window.screenTop != undefined ? window.screenTop : screen.top;
    var width         = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width;
    var height        = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height;

    var popupLctnCd   = argPopParm[0];
    var popupLctnTop  = argPopParm[1];
    var popupLctnLeft = argPopParm[2];
    var popupSqr      = argPopParm[3];
    var popupHg       = argPopParm[4];

   //## 팝업위치
    //왼쪽상단
    if(popupLctnCd == "209001")
    {
        popupLctnTop  = "0";
        popupLctnLeft = dualScreenLeft; 
    }
    //중앙
    else if(popupLctnCd == "209002")
    {
        var popupLctnTop  = ((height / 2) - (popupHg / 2)) + dualScreenTop;
        var popupLctnLeft = ((width / 2) - (popupSqr / 2)) + dualScreenLeft;
    }
   //우측상단
    else if(popupLctnCd == "209003")
    {
        var popupLctnTop  = "0";
        var popupLctnLeft = width + dualScreenLeft -popupSqr ;
    }
    //직접입력
    else{
        popupLctnTop  = gfnIsNull(popupLctnTop) ? "0"  : popupLctnTop;
        popupLctnLeft = gfnIsNull(popupLctnLeft) ? "0" : popupLctnLeft;
    }
    
    if(setGbn == "top")
    {
        return popupLctnTop;
    }
    else if(setGbn == "left")
    {
        return popupLctnLeft; 
    }
    else{
        return "0";
    } 
}

/*******************************************************
함 수 명 : gfnGetNumberOnly
설    명 : 숫자만 리턴
인    자 : string
리    턴 : number string
*******************************************************/
function gfnGetNumberOnly (str) {
   var len      = str.length;
   var sReturn  = "";

   for (var i=0; i<len; i++) 
   {
       if ( (str.charAt(i) >= "0") && (str.charAt(i) <= "9") ) 
       {
           sReturn += str.charAt(i);
       }
   }
   return sReturn;
}

/*******************************************************
함 수 명 : gfnFileSizeCheck
설    명 : 파일 사이즈 체크    5MB 이하의 파일만 등록 할 수 있다.
인    자 : file
리    턴 : true/false
*******************************************************/
function gfnFileSizeCheck( file )
{   
  var f = $("#"+file).next().find('.textbox-value');
  
  if(f.length == 0)return true;
  
  if (getInternetExplorerVersion() != 9){ 
  
      var tt  = f[0].files;
      var ext = $("#"+file).filebox('getValue').split('.').pop().toLowerCase();
      
      var array = "exe,pif,application,gadget,msi,msp,com,scr,hta,cpl,msc,jar,bat,vb,vbs,vbe,js,jse,ws,wsf,wsc,wsh,ps1,ps1xml,ps2,ps2xml" +
                  ",psc1,psc2,msh,msh1,msh2,mshxml,msh1xml,msh2xml,scf,lnk,inf,reg,docm,dotm,xlsm,xltm,xlam,pptm,potm,ppam,ppsm,sldm";
      var rArray = array.split(",");
      
      for(var i=0; i< rArray.length;  i++){ 
          
          if(ext ==rArray[i]){
              $.messager.alert("확인", "허용된 파일만 Upload 업로드 할수 있습니다.","warning");
               return false;
          }    
      } 
       
      if(tt.length > 0){
          if(tt[0].size > (1024 * 1024 * 5)){
              $.messager.alert("확인","5MB이하의 파일만 등록할 수 있습니다.","warning");
              return false;
          }else{
              return true;
          } 
      }else{
          return true;
      }
  }else{
      return true;
  }   
      
}

/*******************************************************
함 수 명 : gfnIsIE
설    명 : 현재 사용중인 브라우저가 IE인지 아닌지 판단
인    자 :  
리    턴 : true (IE) / false (그외 Chrome, FF 등)
수정정보 : 
*******************************************************/
function gfnIsIE(){
   var rtn = false;
   var agent = navigator.userAgent.toLowerCase();
   
   // (navigator.appName == 'Netscape' && navigator.userAgent.search('Trident') != -1) ====> IE 11
   // (agent.indexOf("msie") != -1) ====> IE 10 이하
   if ((navigator.appName == 'Netscape' && navigator.userAgent.search('Trident') != -1) || (agent.indexOf("msie") != -1)) {
       rtn = true;
   }
   return rtn;
}

/*******************************************************
함 수 명 : gfnRtrim
설    명 : 오른쪽에 있는 공백을 제거한다. 
인    자 : sValue    입력값 
리    턴 : string     변경된값
수정정보 : 
*******************************************************/
function gfnRtrim(value) {
   if(gfnIsNull(value))    return "";
   return value.replace(/\s+$/,"");

} 

/*******************************************************
함 수 명 : gfnChangeNull
설    명 : 입력값이 null이면 ''을 리턴& RTRIM 
인    자 : sValue    입력값 
리    턴 : string     변경된값
수정정보 : 
*******************************************************/
function gfnChangeNull(sValue)
{
   if( typeof sValue == "number") 
       return sValue;
   if( new String(sValue).valueOf() == "undefined") 
       return "";
   if( sValue == null )
       return "";
   return gfnRtrim(sValue);
}

/*******************************************************
함 수 명 : gfnPatternTime
설    명 : 시간 포맷변경
인    자 : 시간(sHhmmss) / 구분값(:)
리    턴 : hh:mm:ss
수정정보 : 
*******************************************************/
function gfnPatternTime(sHhmmss,sGbn)
{
   var sRtn = "";
   if(gfnIsNull(sGbn)) {
       sGbn = ":";
   }
   if(!gfnIsNull(sHhmm))
   {
       sRtn = sHhmm.substr(0,4)    
            + sGbn
            + sHhmm.substr(4,2);
       if(sHhmmss.length>4) {
       sRtn += (sGbn
           + sYmd.substr(6,2));            
       }
   }

   return sRtn;
}

function gfnZero4null(num) {
   if( typeof sValue != "number")  return '';  
   if( sValue == null )
       return 0;
   return num;
}

/*******************************************************
함 수 명   : gfnAddOption
설    명  : 콤보박스에 option을 추가한다.
사 용 법   :
           var obj = document.getElementById("schGroupCd1");
           gfnAddOption(obj, "전체", "0000");
리    턴  : hh:mm:ss
수정정보    : 
*******************************************************/
function gfnAddOption(obj, text, value) {
   var objOption = document.createElement("option");        
   objOption.text = text;
   objOption.value = value;
   obj.add(objOption);
}

/*******************************************************
함 수 명   : gfnStrToByte
설    명  : 한글 3 바이트 영문/숫자 1byte
사 용 법   : 
               gfnStrToByte($('#text'), 100); >>> 100바이트까지만 표시
               gfnStrToByte(event.target, 100);
               
리    턴  : 파라미터 오브젝트의 스트링값에 바로 적용
수정정보    : 
*******************************************************/
function gfnStrToByte(obj, len) {
   var val = obj.value;
   /*for(valLen=i=0;byteLen=val.charCodeAt(i++);valLen+=byteLen>>11?3:byteLen>>7?2:1);*/ //한글3바이트
   for(valLen=i=0;byteLen=val.charCodeAt(i++);valLen+=byteLen>>7?3:1); //한글 2바이트
   if(valLen > len){
       $(obj).val(val.substring(0, val.length-1));
   }
}


var circles = [];
var drawTickerI = 0;
var context = "";
function loadingInit() {
    //if($('.loading') != null) return;
    //$('body').append('<canvas width="70" height="70" id="loading" name="loading" style="display:none;"></canvas>');
    //$('body').append('<div class="loading"><i></i></div>');
}

function loadingShow(){
    if($('.loading') == null) {
        $('body').append('<div class="loading"><i></i></div>');
    }
    $('.loading').show();
    return;
    /**
    var canvas = document.getElementById("loading");
    if(canvas == null) {
        $('body').append('<canvas width="70" height="70" id="loading" name="loading"></canvas>');
    } else {
        document.getElementById('loading').style.display='block';
    }
    drawTickerI=0;
    requestAnimationFrame(drawTicker);
        **/
}

function loadingHide(){
    $('.loading').hide();
    //document.getElementById('loading').style.display='none';
}

function drawTicker() {

  var radius = 6;
  var pathradius = 25;
  var y = Math.sin(drawTickerI/10 - Math.PI/2) * pathradius;
  var x = Math.cos(drawTickerI/10 - Math.PI/2) * pathradius;

  if (drawTickerI % 3 == 0) {
    circles.push([x, y, drawTickerI]);
  }

  var canvas = document.getElementById("loading");
  context = canvas.getContext("2d");

  context.clearRect(0, 0, 70, 70);
  context.save();
  context.translate(35, 35);
  context.beginPath();
  context.arc(x, y, radius, 0, 2 * Math.PI, false);
  context.fillStyle = '#EEEEEE';
  context.fill();
  context.restore();
  drawTickerI++;

  drawCircles(drawTickerI);
  requestAnimationFrame(drawTicker);
}

function drawCircles(currentTime) {
  for (var i = 0; i < circles.length; i++) {
    drawCircle(circles[i][0], circles[i][1], circles[i][2], currentTime);
    if (currentTime - circles[i][2] >= 100) {
      circles.shift();
    }
  }
}

function drawCircle(x, y, makeTime, currentTime) {

  var opacity = 1 - ((currentTime - makeTime) / 100);
  context.save();
  context.translate(35, 35);
  context.beginPath();
  context.arc(x, y, 5.5, 0, 2 * Math.PI, false);
  context.fillStyle = 'rgba(187, 22, 43, ' + opacity + ')';
  context.fill();
  context.restore();
}

/*******************************************************
함 수 명 : $.ajaxSetup
설    명 : ajax 기본 설정
수정정보 : 2019.06.19  ehLee  최초작성
*******************************************************/
$.ajaxSetup({
    type : "POST",
    dataType:"JSON",
    async : false,          // 동기
    timeout : 1000000,
    beforeSend : function() { // 전송전 호출할 함수
        loadingShow();
    },
    complete :  function(jqXHR, data) { // 완료후 callback (complete or always)
        //setTimeout(function () {
            loadingHide();
        //}, 2000);        
        searchingFlag = false;
    },
    error: function(jqXHR, exception, error) {
        //setTimeout(function () {
            loadingHide();
        //}, 2000);        

        var errMsg = gfnMsg.unExpectedError;
        if (jqXHR.status === 0) {
            if (exception === 'timeout') {
//                alert('Time out error. [Timeout]');
            } else {
//                alert('Not connect.\n Verify Network.');
            }
        } else if(jqXHR.status == 900){             // 세션끊김
            gfnAlert("", gfnMsg.noSession, function() {
                location.href = "/login.do";
            });
            return;
        } else if (jqXHR.status == 400) {
//            alert('Server understood the request, but request content was invalid. [400]');
        }
        else if (jqXHR.status == 401) {
//            alert('Unauthorized access. [401]');
        }
        else if (jqXHR.status == 403) {
//            alert('Forbidden resource can not be accessed. [403]');
        }
        else if (jqXHR.status == 404) {
//            alert('Requested page not found. [404]');
        }
        else if (jqXHR.status == 500) {
//            alert('Internal server error. [500]');
        }
        else if (jqXHR.status == 503) {
//            alert('Service unavailable. [503]');
        }
        else if (exception === 'parsererror') {
//            alert('Requested JSON parse failed. [Failed]');
        }
        else if (exception === 'abort') {
//            alert('Ajax request aborted. [Aborted]');
        }
        else {
            errMsg = jqXHR.responseText;
        }
        
        gfnAlert("", errMsg);
    }
});     

/////////////////////////////////////////////////////////
//ajax 공통 처리
/////////////////////////////////////////////////////////
function gfnAjax(url, data, successCallback, isFormData){
    
    loadingShow();
    
    if(isFormData == null || isFormData == undefined){
        isFormData = false; 
    }

    var ajaxObj = new Object();
    ajaxObj = {
            url: url,
            data : data
    };
    
    if(isFormData){
        ajaxObj.processData = false;
        ajaxObj.contentType = false;
    }
    
    if(data != null){
        ajaxObj.data = data;
    }
    
    if(successCallback != null) {
        ajaxObj.success = function(res) {
            successCallback(res, url);
        };
    } else {
        ajaxObj.success = function(res) {
            console.log(res);
        };
    }
    $.ajax(ajaxObj);
}

//use this transport for "binary" data type
$.ajaxTransport("+binary", function (options, originalOptions, jqXHR) {
    // check for conditions and support for blob / arraybuffer response type
    if (window.FormData && ((options.dataType && (options.dataType == 'binary')) || (options.data && ((window.ArrayBuffer && options.data instanceof ArrayBuffer) || (window.Blob && options.data instanceof Blob))))) {
        return {
            // create new XMLHttpRequest
            send: function (headers, callback) {
                // setup all variables
                var xhr = new XMLHttpRequest(),
                    url = options.url,
                    type = options.type,
                    async = options.async || true,
                    // blob or arraybuffer. Default is blob
                    dataType = options.responseType || "blob",
                    data = options.data || null,
                    username = options.username || null,
                    password = options.password || null;

                xhr.addEventListener('load', function () {
                    var data = {};
                    data[options.dataType] = xhr.response;
                    // make callback and send data
                    callback(xhr.status, xhr.statusText, data, xhr.getAllResponseHeaders());
                });

                xhr.open(type, url, async, username, password);

                // setup custom headers
                for (var i in headers) {
                    xhr.setRequestHeader(i, headers[i]);
                }

                xhr.responseType = dataType;
                xhr.send(data);
            },
            abort: function () {
                jqXHR.abort();
            }
        };
    }
});

/*******************************************************
함 수 명 : gfnGetMsg
설    명 : 메시지 중간에 파라메터를 박아 리턴한다.
수정정보 : 2019.06.28  ehLee  최초작성
*******************************************************/
function gfnGetMsg( message , arg1 , arg2 , arg3 ){
            if(gfnIsNull(message)) {
                return "";
            }
            if( arg1 ){
                message = message.replace("{0}" , arg1 );
            } else {
                message = message.replace("{0}" , "" );
            }
            if( arg2 ){
                message = message.replace("{1}" , arg2 );
            } else {
                message = message.replace("{1}" , "" );
            }       
            if( arg3 ){
                message = message.replace("{2}" , arg3 );
            } else {
                message = message.replace("{2}" , "" );
            }       
            return message;
}

/*******************************************************
함 수 명 : gfnIsIE
설    명 : 현재 사용중인 브라우저가 IE인지 아닌지 판단
인    자 :  
리    턴 : true (IE) / false (그외 Chrome, FF 등)
*******************************************************/
function gfnIsIE(){
    var rtn = false;
    var agent = navigator.userAgent.toLowerCase();
    
    // (navigator.appName == 'Netscape' && navigator.userAgent.search('Trident') != -1) ====> IE 11
    // (agent.indexOf("msie") != -1) ====> IE 10 이하
    if ((navigator.appName == 'Netscape' && navigator.userAgent.search('Trident') != -1) || (agent.indexOf("msie") != -1)) {
        rtn = true;
    }
    return rtn;
}

/*******************************************************
함 수 명 : 파일저장
설    명 : Grid내용을 파일로 저장한다.
          include 해야함.
            /js/jquery.base64.min.js
            /js/jquery.battatech.excelexport.min.js
인    자 : 
리    턴 : 
*******************************************************/
function downloadExcel(obj, targetId, SaveFileName) {
    if( obj.getRows().length <= 0 ) {
        alert(msg.get( commonMessage[gLocale].noData4Export));//자료가 없습니다 조회후 이용하세요.
        return false;
    }
//  alert(msg.get( commonMessage[gLocale].loadingExcelFile));//Excel 화일로 변환중, 잠시만 기다려 주세요 ...
    // ie 구분
    if (gfnIsIE()) {
        // 스타일 변경 수동 적용 가능
        var cssText = '<style type="text/css">';
        cssText += '.aaaa {font-size:11px; color:#333333; border:2px solid black; padding:10px 5px 8px 5px; background-color:#F3F5E0;}';
        cssText += '</style>';
        var output = document.getElementById(targetId).outerHTML;
        output.replace("hidden=true", "");
        if (!SaveFileName) {
            SaveFileName = 'download';
        }
        var oWin = window.open("about:blank", "downloadLink");
        oWin.document.write(cssText);
        oWin.document.write(output);
        oWin.document.close();
        // success = true, false
        var success = oWin.document.execCommand('SaveAs', false, SaveFileName+".xls");
        oWin.close();
    } else {
        var cssText = '.aaaa {font-size:11px; color:#333333; border:2px solid black; padding:10px 5px 8px 5px; background-color:#F3F5E0;}';
        $("#"+targetId).btechco_excelexport({
            containerid : targetId,
            datatype : $datatype.Table,
            cssStyle : cssText
        });
        /**
        var a = document.createElement("a");
        a.href = downloadUrl;
        a.download = "유형코드별 회의안건 LIST.xls";
        document.body.appendChild(a);
        a.click();
        **/
    }
//  alert(msg.get( commonMessage[gLocale].downloadCompleted));//화일 변환이 완료되었습니다.
}

/*******************************************************
함 수 명 : gfnAlert
설    명 : alert
인    자 : type: ERROR, INFORMATION, WARNING
리    턴 : 없음
수정정보 : MAC 주소 정보 세팅 후 로그인 처리!
*******************************************************/
function gfnAlert(height, msg, alertCallback, descript) {

    fnAlert(height, msg);
    
    $('#alertOk').click(function() {
        $("#alertModal").fadeOut();
        if(typeof alertCallback == 'function' ) {
            alertCallback();
        }
    });
}

function gfnConvertToBr(text) {
    var ret = "";
    for (var i=0; i<text.length; i++) {
        var code=text.charCodeAt(i);
        if(code == 10 || code ==13) {
            ret += "<br />";
        } else {
            ret += text[i];
        }
    }
    return ret;
}

function fnAlert(height, msg) {
    if(height != '' && !isNaN(height)) {
        $("#modal_alert_content").height(height + "px");
    } 
    
    if(gfnIsNull(msg)) {
        $("#alert_errMsg").text("");
    } else {
        var msg1 = gfnConvertToBr(msg);
        $("#alert_errMsg").html(msg1);
    }
    if(typeof descript == "undefined") {
        $("#alert_errDescript").text("");
    } else {
        $("#alert_errDescript").html(gfnConvertToBr(descript));
    }

    if( isNaN(height) || height == '' ) {
        var msgH = document.getElementById("modalBody").clientHeight;
        $("#modal_alert_content").height((328+(msgH/27)+10) + "px");
    } 
    
    $("#alertModal").fadeIn();
    $("#alertOk").focus();
}

function gfnAutoCloseAlert(height, msg, alertCallback, descript) {

    fnAlert(height, msg);
    
    setTimeout(function () {
        $("#alertModal").fadeOut();
        if(typeof alertCallback == 'function' ) {
            alertCallback();
        }
    }, 3000);    
}

/*******************************************************
함 수 명 : gfnConfirm
설    명 : gfnConfirm(msg, confirmCallback);
    function confirmCallback(confirm) {
        if(!confirm)    return false;
        // TODO
    }
인    자 : 
리    턴 : 없음
수정정보 : MAC 주소 정보 세팅 후 로그인 처리!
*******************************************************/
function gfnConfirm(msg, confirmCallback, param) {
    if(typeof msg == "undefined") {
        $("#confirm_msg").text("");
    } else {
        $("#confirm_msg").html(gfnConvertToBr(msg));
    }
    document.getElementById('confirmModal').style.display='block';


    $('#confirmCancel').off("click").on("click",function(e){
        e.preventDefault();
        e.stopImmediatePropagation();
        document.getElementById('confirmModal').style.display='none';
        if(typeof confirmCallback == 'function' ) {
            confirmCallback(false, param);
        }
    });

     $('#confirmOk').off("click").on("click",function(e){
        e.preventDefault();
        e.stopImmediatePropagation();
        document.getElementById('confirmModal').style.display='none';
        if(typeof confirmCallback == 'function' ) {
            confirmCallback(true, param);
        }
    });
}

/*******************************************************
함 수 명 : gfnDatepicker
설    명 : jquery datepicker 공통
인    자 : id
리    턴 : 
수정정보 : 2019.07.12           최초작성
*******************************************************/
function gfnDatepicker(id)
{
    $('#'+id).datepicker({
        dateFormat      : 'yy-mm-dd',
//        showOn          : 'both',
//        buttonImage     : '/images/com/calendar.gif',
        changeMonth     : true,
        changeYear      : true,
        nextText        : 'Prev.',
        prevText        : 'Next.',
//        dayNames        : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
//        dayNamesMin     : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'], 
//        monthNamesShort : ['1','2','3','4','5','6','7','8','9','10','11','12'],
//        monthNames      : ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'],
        showMonthAfterYear: true,
//        yearSuffix: '년'
    });
}

//window popup
function gfnWindowPopup(windowWidth, windowHeight, windowOuterHeight, url, wname, features) {
  var centerLeft = parseInt((window.screen.availWidth - windowWidth) / 2);
  var centerTop = parseInt(((window.screen.availHeight - windowHeight) / 2) - windowOuterHeight);

  var misc_features;
  if (features) {
    misc_features = ', ' + features;
  }
  else {
    misc_features = ', status=no, location=no, scrollbars=yes, resizable=yes';
  }
  var windowFeatures = 'width=' + windowWidth + ',height=' + windowHeight + ',left=' + centerLeft + ',top=' + centerTop + misc_features;
  var win = window.open(url, wname, windowFeatures);
  win.focus();
  return win;
}