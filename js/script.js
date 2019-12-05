$(document).ready(function() {

            //When page loads...
            $(".tab_content").hide(); //Hide all content
            $("ul.tabs li:first").addClass("active").show(); //Activate first tab
            $(".tab_content:first").show(); //Show first tab content

            //On Click Event
            $("ul.tabs li").click(function() {

                $("ul.tabs li").removeClass("active"); //Remove any "active" class
                $(this).addClass("active"); //Add "active" class to selected tab
                $(".tab_content").hide(); //Hide all tab content

                var activeTab = $(this).find("a").attr("href"); //Find the href attribute value to identify the active tab + content
                $(activeTab).fadeIn(); //Fade in the active ID content
                return false;
            });

        });
$(document).ready(function () {
	$('.lnb-open').click(function () {
		$('body').removeClass('hidden-lnb');
	});
	$('.lnb-close').click(function () {
		$('body').addClass('hidden-lnb');
	});
});
$(document).ready(function() {
    
    //aside
    $('li.nav-item').click( function() {
       $(this).toggleClass('open');
    });

    /**    //select box
      var classes = $(this).attr("class"),
          id      = $(this).attr("id"),
          name    = $(this).attr("name");
      var template =  '<div class="' + classes + '">';
          template += '<span class="custom-select-trigger">' + $(this).attr("placeholder") + '</span>';
          template += '<div class="custom-options">';
          $(this).find("option").each(function() {
            template += '<span class="custom-option ' + $(this).attr("class") + '" data-value="' + $(this).attr("value") + '">' + $(this).html() + '</span>';
          });
      template += '</div></div>';

      $(this).wrap('<div class="custom-select-wrapper"></div>');
      $(this).hide();
      $(this).after(template);
    });
    $(".custom-option:first-of-type").hover(function() {
      $(this).parents(".custom-options").addClass("option-hover");
    }, function() {
      $(this).parents(".custom-options").removeClass("option-hover");
    });
    $(".custom-select-trigger").on("click", function() {
      $('html').one('click',function() {
        $(".custom-select").removeClass("opened");
      });
      $(this).parents(".custom-select").toggleClass("opened");
      event.stopPropagation();
    });
    $(".custom-option").on("click", function() {
      $(this).parents(".custom-select-wrapper").find("select").val($(this).data("value"));
      $(this).parents(".custom-options").find(".custom-option").removeClass("selection");
      $(this).addClass("selection");
      $(this).parents(".custom-select").removeClass("opened");
      $(this).parents(".custom-select").find(".custom-select-trigger").text($(this).text());
    });

    //modal

 * 
    var modal = document.getElementById('modal');
    var open = document.getElementById("grid");
    var close = document.getElementsByClassName("close")[0];

    if (typeof modal != 'undefined') {
//        open.onclick = function() {
//          modal.style.display = "block";
//        }
    
        close.onclick = function() {
          modal.style.display = "none";
        }
    
        window.onclick = function(event) {
          if (event.target == modal) {
            modal.style.display = "none";
          }
        }
    }

  // datepicker
  $.datepicker.setDefaults({
    dateFormat: 'yy-mm-dd',
    prevText: '이전 달',
    nextText: '다음 달',
    monthNames: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
    monthNamesShort: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
    dayNames: ['일', '월', '화', '수', '목', '금', '토'],
    dayNamesShort: ['일', '월', '화', '수', '목', '금', '토'],
    dayNamesMin: ['일', '월', '화', '수', '목', '금', '토'],
    showMonthAfterYear: true,
    yearSuffix: '년'
  });
  
  $(function() {
    $("#searchStartDate, #searchEndDate, #contractDate").datepicker();
  });
**/
  loadingInit();

  /**
  //images upload
  let photoUpload = document.getElementById('photo-upload'),
imgUploadPreview = document.querySelector('.img-upload-preview');

photoUpload.onchange = function () {

    for (let i = 0; i < photoUpload.files.length; i++){
    // check files supported only images jpg - jpeg - gif
    if (/\.(jpe?g|png|gif)$/i.test(photoUpload.files[i].name) === false){
        alert ("this type is not supported");
        photoUpload.value = '';
        break;
    }else{

        let reader = new FileReader,
            photoFileName = photoUpload.files[i].name,
        //  get round file size By KB
        photoFileSize = Math.round( photoUpload.files[i].size / 1024),
        photoFileType = photoUpload.files[i].type,
        // file details template
        photoFileDetailsTemplate = ``;

        reader.onload = function (event){
            let previewImage  = document.createElement('img'),
            previewImageBox = document.createElement('div'),
            removeImage = document.createElement('i'),
            removeIcon =  document.createTextNode('X');
            removeImage.appendChild(removeIcon);
            previewImage.src = reader.result;
            previewImageBox.appendChild(previewImage);
            previewImageBox.classList.add('previewImage');
            previewImageBox.appendChild(removeImage);
            imgUploadPreview.appendChild(previewImageBox);
        // insert file detailes template
        previewImageBox.insertAdjacentHTML('beforeend', photoFileDetailsTemplate);
        removeImage.addEventListener('click', removeItem);
        // confirm remove item

        function removeItem (e){
            if (confirm('Are you sure you want to remove this item?')){
                e.target.parentElement.remove();
                photoUpload.value='';
            }
        }
      }


        // read file url
        reader.readAsDataURL(event.target.files[i]);
    }
  }

}
   */
});

