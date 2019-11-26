<%@ page contentType="text/html; charset=utf-8" pageEncoding="utf-8"%>

<script type="text/javascript">
var langMsg = {
        en: {
            display: {
                noData: '${msg.l00239}'
            }
        },
        ko: {
            display: {
                noData: '${msg.l00239}'
            }
        },
    };   

var excelModal;
var excelClose;

$(document).ready(function() {
    excelModal = document.getElementById('excelDownload');
    excelClose = document.getElementById("closeBtnExcel");
    
    if (typeof excelModal != 'undefined') {
        excelClose.onclick = function() {
          excelModal.style.display = "none";
        }
    }

    $('#modalSaveExcelBtn').on('click', function(ev){
        fnExcelDown();
    })

    $('#modalCalcelExcelBtn').on('click', function(ev){
        excelModal.style.display = "none";
    });    

});

</script>

  <!-- modal confirm message box -->
  <div id="confirmModal" class="modal animate">
    <!-- Modal content -->
    <div class="modal-content confir">
      <!--<span class="close"><i class="ion ion-md-close"></i></span>-->
      <div class="modal-body">
          <span class="ico-area"><i class="ion ion-ios-checkmark-circle-outline"></i></span>
          <br>
        <p class="confir-txt" id="confirm_msg"></p>
        <div class="modal-btnWrap">
          <button type="submit" class="line-button" id="confirmCancel">${msg.l00218}</button>
          <button type="submit" class="save-button" id="confirmOk">${msg.l00219}</button>
        </div>
      </div>
    </div>
  </div>
   <!-- //modal -->

  <!-- modal alert message box -->
  <div id="alertModal" class="modal animate" style="z-index: 9999999 !important;">
    <!-- Modal content -->
    <div class="modal-content alert" id="modal_alert_content">
      <!--<span class="close"><i class="ion ion-md-close"></i></span>-->
      <div class="modal-body">
          <span class="ico-area"><i class="ion ion-ios-information-circle-outline"></i></span>
          <br>
          <!--  h6 class="alert-tit"><span id="alert_errType"></span></h6 -->
          <div id="modalBody">
          <p class="alert-txt" id="alert_errMsg"></p>
          </div>          
          <div class="alert-content">
            <p class="alert-info"><span id="alert_errDescript"></span>
            </p>
          </div>
        <div class="modal-btnWrap">
          <button type="button" class="save-button" id="alertOk">${msg.l00244}</button>
        </div>
      </div>
    </div>
  </div>
    <!-- //modal 단순 메세지 박스 -->

    <!-- modal -->
    <div id="excelDownload" class="modal animate">
      <!-- Modal content -->
      <div class="modal-content">
        <div class="modal-header">
          <span class="close" id="closeBtnExcel"><i class="ion ion-md-close"></i></span>
          <h5>${msg.l00241}</h5>
        </div>
        
        <!-- modal-body -->
        <div class="modal-body">
            <div class="search-form">
            
              <div class="search-input-area" style="width:100% !important;">
                <div class="row">
                    <label for="reasonCd">${msg.l00243}</label>
                    <div class="inputWrap">
                        <input name="reasonCd" id="reasonCd" type="text" maxlength="33" size="100">
                    </div>
                </div>
              </div>            
                 
            </div>
          
          <div class="modal-btnWrap">
            <button class="line-button" id="modalCalcelExcelBtn">${msg.l00218}</button>
            <button type="submit" class="save-button" id="modalSaveExcelBtn">${msg.l00216}</button>
          </div>
        </div>
        <!-- //modal-body -->
      </div>
      <!-- //Modal content -->
    </div>
    <!-- //modal -->    
        
    <div class="loading"><i></i></div>    