(function ($) {

Drupal.behaviors.textarea = {
  attach: function (context, settings) {
    $('.form-textarea-wrapper.resizable', context).once('textarea', function () {
      var staticOffset = null;
      var textarea = $(this).addClass('resizable-textarea').find('textarea');
      var grippie = $('<div class="grippie"></div>').mousedown(startDrag);

      grippie.insertAfter(textarea);

      function startDrag(e) {
        staticOffset = textarea.height() - e.pageY;
        textarea.css('opacity', 0.25);
        $(document).mousemove(performDrag).mouseup(endDrag);
        return false;
      }

      function performDrag(e) {
        textarea.height(Math.max(32, staticOffset + e.pageY) + 'px');
        return false;
      }

      function endDrag(e) {
        $(document).unbind('mousemove', performDrag).unbind('mouseup', endDrag);
        textarea.css('opacity', 1);
      }
    });
  }
};

})(jQuery);
;
(function ($) {

/**
 * Attach views php clickable variables behavior.
 */
Drupal.behaviors.viewsPHPVariables = {
  attach: function (context) {
    $('.views-php-variables', context).delegate('a', 'click', function() {
      var textarea = $(this.href.replace(/^.*#/, '#'))[0];
      var text = $(this).text();
      textarea.focus();
      if (!isNaN(textarea.selectionStart)) {
        textarea.value = textarea.value.substring(0, textarea.selectionStart) + text + textarea.value.substring(textarea.selectionEnd);
        textarea.selectionStart = textarea.selectionStart + text.length;
        textarea.selectionEnd = textarea.selectionEnd + text.length;
      }
      // IE support.
      else if (document.selection) {
        document.selection.createRange().text = text;
      }
      else {
        textarea.value += text;
      }
      textarea.focus();

      return false;
    });
  }
};

})(jQuery);
;
