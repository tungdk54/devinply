jQuery(document).ready(function($){

	if($('form#search-block-form--2').length > 0 ) {
    $('form#search-block-form--2 input[type="text"]').attr('placeholder', 'Search the site');
  }
  if($('body.page-search form#search-form .form-item-keys input[type="text"]').length > 0) {
  	$('body.page-search form#search-form .form-item-keys input[type="text"]').attr('placeholder', 'Search the site');
  }

  /*Wrap pager of main slideshow*/
  if($('.slideshow-homepage-block').length > 0) {
  	$('.slideshow-homepage-block .views-slideshow-controls-bottom .views-slideshow-pager-fields').wrap('<div class="control-slideshow-pager"></div>');

    /*Show control main slideshow*/
    $('.slideshow-homepage-block').hover(function() {
      /* Stuff to do when the mouse enters the element */
      $('.slideshow-homepage-block .views-slideshow-controls-bottom .views-slideshow-controls-text .views-slideshow-controls-text-previous').css('display','block');
      $('.slideshow-homepage-block .views-slideshow-controls-bottom .views-slideshow-controls-text .views-slideshow-controls-text-next').css('display','block');
    }, function() {
      /* Stuff to do when the mouse leaves the element */
      $('.slideshow-homepage-block .views-slideshow-controls-bottom .views-slideshow-controls-text .views-slideshow-controls-text-previous').css('display','none');
      $('.slideshow-homepage-block .views-slideshow-controls-bottom .views-slideshow-controls-text .views-slideshow-controls-text-next').css('display','none');
    });
  }
  
  /*Scroll contens of Khach hang block*/
  if($('.tin-tuc-sidebar.khach-hang-block').length > 0) {
    $('.tin-tuc-sidebar.khach-hang-block .view-content').mCustomScrollbar({
      theme: "dark-thick",
      verticalScroll: true,
      mouseWheel: true,
      //set_width: '600px',
      set_height: 200,
      scrollInertia: 150,
      scrollButtons:{
        enable:true
      }
    });
  }
  /*Scroll contens of Doi tac block*/
  if($('.tin-tuc-sidebar.doi-tac-block').length > 0) {
    $('.tin-tuc-sidebar.doi-tac-block .view-content').mCustomScrollbar({
      theme: "dark-thick",
      verticalScroll: true,
      mouseWheel: true,
      //set_width: '600px',
      set_height: 200,
      scrollInertia: 150,
      scrollButtons:{
        enable:true
      }
    });
  }

  /*Add link for block-titles of block in right sidebar*/
  if($('#block-views-du-an-right-sidebar-block h2.block-title').length > 0) {
    $('#block-views-du-an-right-sidebar-block h2.block-title').wrapInner('<a href="/du-an"></a>');
  }
  if($('#block-views-tin-tuc-view-block-1 h2.block-title').length > 0) {
    $('#block-views-tin-tuc-view-block-1 h2.block-title').wrapInner('<a href="/tin-tuc-cong-ty"></a>');
  }
  if($('#block-views-tin-tuc-view-block-2 h2.block-title').length > 0) {
    $('#block-views-tin-tuc-view-block-2 h2.block-title').wrapInner('<a href="/doi-tac"></a>');
  }
  if($('#block-views-tin-tuc-view-block-3 h2.block-title').length > 0) {
    $('#block-views-tin-tuc-view-block-3 h2.block-title').wrapInner('<a href="/khach-hang"></a>');
  }

  /*Disable Tin lien quan chua class active*/
  if($('body.page-node- .bai-viet-lien-quan .item-list ul li a.active').length > 0) {
    $('body.page-node- .bai-viet-lien-quan .item-list ul li a.active').parents('li.views-row').css({
      display: 'none'
    });
  }

});
