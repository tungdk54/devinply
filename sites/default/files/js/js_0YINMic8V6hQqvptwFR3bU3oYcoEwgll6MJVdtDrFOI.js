
(function ($) {
  Drupal.Panels = Drupal.Panels || {};

  Drupal.Panels.autoAttach = function() {
    if ($.browser.msie) {
      // If IE, attach a hover event so we can see our admin links.
      $("div.panel-pane").hover(
        function() {
          $('div.panel-hide', this).addClass("panel-hide-hover"); return true;
        },
        function() {
          $('div.panel-hide', this).removeClass("panel-hide-hover"); return true;
        }
      );
      $("div.admin-links").hover(
        function() {
          $(this).addClass("admin-links-hover"); return true;
        },
        function(){
          $(this).removeClass("admin-links-hover"); return true;
        }
      );
    }
  };

  $(Drupal.Panels.autoAttach);
})(jQuery);
;
(function ($) {

/**
 * Attaches double-click behavior to toggle full path of Krumo elements.
 */
Drupal.behaviors.devel = {
  attach: function (context, settings) {

    // Add hint to footnote
    $('.krumo-footnote .krumo-call').once().before('<img style="vertical-align: middle;" title="Click to expand. Double-click to show path." src="' + settings.basePath + 'misc/help.png"/>');

    var krumo_name = [];
    var krumo_type = [];

    function krumo_traverse(el) {
      krumo_name.push($(el).html());
      krumo_type.push($(el).siblings('em').html().match(/\w*/)[0]);

      if ($(el).closest('.krumo-nest').length > 0) {
        krumo_traverse($(el).closest('.krumo-nest').prev().find('.krumo-name'));
      }
    }

    $('.krumo-child > div:first-child', context).dblclick(
      function(e) {
        if ($(this).find('> .krumo-php-path').length > 0) {
          // Remove path if shown.
          $(this).find('> .krumo-php-path').remove();
        }
        else {
          // Get elements.
          krumo_traverse($(this).find('> a.krumo-name'));

          // Create path.
          var krumo_path_string = '';
          for (var i = krumo_name.length - 1; i >= 0; --i) {
            // Start element.
            if ((krumo_name.length - 1) == i)
              krumo_path_string += '$' + krumo_name[i];

            if (typeof krumo_name[(i-1)] !== 'undefined') {
              if (krumo_type[i] == 'Array') {
                krumo_path_string += "[";
                if (!/^\d*$/.test(krumo_name[(i-1)]))
                  krumo_path_string += "'";
                krumo_path_string += krumo_name[(i-1)];
                if (!/^\d*$/.test(krumo_name[(i-1)]))
                  krumo_path_string += "'";
                krumo_path_string += "]";
              }
              if (krumo_type[i] == 'Object')
                krumo_path_string += '->' + krumo_name[(i-1)];
            }
          }
          $(this).append('<div class="krumo-php-path" style="font-family: Courier, monospace; font-weight: bold;">' + krumo_path_string + '</div>');

          // Reset arrays.
          krumo_name = [];
          krumo_type = [];
        }
      }
    );
  }
};

})(jQuery);
;
(function($){
Drupal.behaviors.contextReactionBlock = {attach: function(context) {
  $('form.context-editor:not(.context-block-processed)')
    .addClass('context-block-processed')
    .each(function() {
      var id = $(this).attr('id');
      Drupal.contextBlockEditor = Drupal.contextBlockEditor || {};
      $(this).bind('init.pageEditor', function(event) {
        Drupal.contextBlockEditor[id] = new DrupalContextBlockEditor($(this));
      });
      $(this).bind('start.pageEditor', function(event, context) {
        // Fallback to first context if param is empty.
        if (!context) {
          context = $(this).data('defaultContext');
        }
        Drupal.contextBlockEditor[id].editStart($(this), context);
      });
      $(this).bind('end.pageEditor', function(event) {
        Drupal.contextBlockEditor[id].editFinish();
      });
    });

  //
  // Admin Form =======================================================
  //
  // ContextBlockForm: Init.
  $('#context-blockform:not(.processed)').each(function() {
    $(this).addClass('processed');
    Drupal.contextBlockForm = new DrupalContextBlockForm($(this));
    Drupal.contextBlockForm.setState();
  });

  // ContextBlockForm: Attach block removal handlers.
  // Lives in behaviors as it may be required for attachment to new DOM elements.
  $('#context-blockform a.remove:not(.processed)').each(function() {
    $(this).addClass('processed');
    $(this).click(function() {
      $(this).parents('tr').eq(0).remove();
      Drupal.contextBlockForm.setState();
      return false;
    });
  });

  // Conceal Section title, subtitle and class
  $('div.context-block-browser', context).nextAll('.form-item').hide();
}};

/**
 * Context block form. Default form for editing context block reactions.
 */
DrupalContextBlockForm = function(blockForm) {
  this.state = {};

  this.setState = function() {
    $('table.context-blockform-region', blockForm).each(function() {
      var region = $(this).attr('id').split('context-blockform-region-')[1];
      var blocks = [];
      $('tr', $(this)).each(function() {
        var bid = $(this).attr('id');
        var weight = $(this).find('select,input').first().val();
        blocks.push({'bid' : bid, 'weight' : weight});
      });
      Drupal.contextBlockForm.state[region] = blocks;
    });

    // Serialize here and set form element value.
    $('form input.context-blockform-state').val(JSON.stringify(this.state));

    // Hide enabled blocks from selector that are used
    $('table.context-blockform-region tr').each(function() {
      var bid = $(this).attr('id');
      $('div.context-blockform-selector input[value='+bid+']').parents('div.form-item').eq(0).hide();
    });
    // Show blocks in selector that are unused
    $('div.context-blockform-selector input').each(function() {
      var bid = $(this).val();
      if ($('table.context-blockform-region tr#'+bid).size() === 0) {
        $(this).parents('div.form-item').eq(0).show();
      }
    });

  };

  // make sure we update the state right before submits, this takes care of an
  // apparent race condition between saving the state and the weights getting set
  // by tabledrag
  $('#ctools-export-ui-edit-item-form').submit(function() { Drupal.contextBlockForm.setState(); });

  // Tabledrag
  // Add additional handlers to update our blocks.
  $.each(Drupal.settings.tableDrag, function(base) {
    var table = $('#' + base + ':not(.processed)', blockForm);
    if (table && table.is('.context-blockform-region')) {
      table.addClass('processed');
      table.bind('mouseup', function(event) {
        Drupal.contextBlockForm.setState();
        return;
      });
    }
  });

  // Add blocks to a region
  $('td.blocks a', blockForm).each(function() {
    $(this).click(function() {
      var region = $(this).attr('href').split('#')[1];
      var base = "context-blockform-region-"+ region;
      var selected = $("div.context-blockform-selector input:checked");
      if (selected.size() > 0) {
        var weight_warn = false;
        var min_weight_option = -10;
        var max_weight_option = 10;
        var max_observed_weight = min_weight_option - 1;
        $('table#' + base + ' tr').each(function() {
          var weight_input_val = $(this).find('select,input').first().val();
          if (+weight_input_val > +max_observed_weight) {
            max_observed_weight = weight_input_val;
          }
        });

        selected.each(function() {
          // create new block markup
          var block = document.createElement('tr');
          var text = $(this).parents('div.form-item').eq(0).hide().children('label').text();
          var select = '<div class="form-item form-type-select"><select class="tabledrag-hide form-select">';
          var i;
          weight_warn = true;
          var selected_weight = max_weight_option;
          if (max_weight_option >= (1 + +max_observed_weight)) {
            selected_weight = ++max_observed_weight;
            weight_warn = false;
          }

          for (i = min_weight_option; i <= max_weight_option; ++i) {
            select += '<option';
            if (i == selected_weight) {
              select += ' selected=selected';
            }
            select += '>' + i + '</option>';
          }
          select += '</select></div>';
          $(block).attr('id', $(this).attr('value')).addClass('draggable');
          $(block).html("<td>"+ text + "</td><td>" + select + "</td><td><a href='' class='remove'>X</a></td>");

          // add block item to region
          //TODO : Fix it so long blocks don't get stuck when added to top regions and dragged towards bottom regions
          Drupal.tableDrag[base].makeDraggable(block);
          $('table#'+base).append(block);
          if ($.cookie('Drupal.tableDrag.showWeight') == 1) {
            $('table#'+base).find('.tabledrag-hide').css('display', '');
            $('table#'+base).find('.tabledrag-handle').css('display', 'none');
          }
          else {
            $('table#'+base).find('.tabledrag-hide').css('display', 'none');
            $('table#'+base).find('.tabledrag-handle').css('display', '');
          }
          Drupal.attachBehaviors($('table#'+base));

          Drupal.contextBlockForm.setState();
          $(this).removeAttr('checked');
        });
        if (weight_warn) {
          alert(Drupal.t('Desired block weight exceeds available weight options, please check weights for blocks before saving'));
        }
      }
      return false;
    });
  });
};

/**
 * Context block editor. AHAH editor for live block reaction editing.
 */
DrupalContextBlockEditor = function(editor) {
  this.editor = editor;
  this.state = {};
  this.blocks = {};
  this.regions = {};

  return this;
};

DrupalContextBlockEditor.prototype = {
  initBlocks : function(blocks) {
    var self = this;
    this.blocks = blocks;
    blocks.each(function() {
      if($(this).hasClass('context-block-empty')) {
        $(this).removeClass('context-block-hidden');
      }
      $(this).addClass('draggable');
      $(this).prepend($('<a class="context-block-handle"></a>'));
      $(this).prepend($('<a class="context-block-remove"></a>').click(function() {
        $(this).parent ('.block').eq(0).fadeOut('medium', function() {
          $(this).remove();
          self.updateBlocks();
        });
        return false;
      }));
    });
  },
  initRegions : function(regions) {
    this.regions = regions;
    var ref = this;

    $(regions).not('.context-ui-processed')
      .each(function(index, el) {
        $('.context-ui-add-link', el).click(function(e){
          ref.showBlockBrowser($(this).parent());
        }).addClass('context-ui-processed');
      });
    $('.context-block-browser').hide();
  },
  showBlockBrowser : function(region) {
    var toggled = false;
    //figure out the id of the context
    var activeId = $('.context-editing', this.editor).attr('id').replace('-trigger', ''),
    context = $('#' + activeId)[0];

    this.browser = $('.context-block-browser', context).addClass('active');

    //add the filter element to the block browser
    if (!this.browser.has('input.filter').size()) {
      var parent = $('.block-browser-sidebar .filter', this.browser);
      var list = $('.blocks', this.browser);
      new Drupal.Filter (list, false, '.context-block-addable', parent);
    }
    //show a dialog for the blocks list
    this.browser.show().dialog({
      modal : true,
      close : function() {
        $(this).dialog('destroy');
        //reshow all the categories
        $('.category', this).show();
        $(this).hide().appendTo(context).removeClass('active');
      },
      height: (.8 * $(window).height()),
      minHeight:400,
      minWidth:680,
      width:680
    });

    //handle showing / hiding block items when a different category is selected
    $('.context-block-browser-categories', this.browser).change(function(e) {
      //if no category is selected we want to show all the items
      if ($(this).val() == 0) {
        $('.category', self.browser).show();
      } else {
        $('.category', self.browser).hide();
        $('.category-' + $(this).val(), self.browser).show();
      }
    });

    //if we already have the function for a different context, rebind it so we don't get dupes
    if(this.addToRegion) {
      $('.context-block-addable', this.browser).unbind('click.addToRegion')
    }

    //protected function for adding a clicked block to a region
    var self = this;
    this.addToRegion = function(e){
      var ui = {
        'item' : $(this).clone(),
        'sender' : $(region)
      };
      $(this).parents('.context-block-browser.active').dialog('close');
      $(region).after(ui.item);
      self.addBlock(e, ui, this.editor, activeId.replace('context-editable-', ''));
    };

    $('.context-block-addable', this.browser).bind('click.addToRegion', this.addToRegion);
  },
  // Update UI to match the current block states.
  updateBlocks : function() {
    var browser = $('div.context-block-browser');

    // For all enabled blocks, mark corresponding addables as having been added.
    $('.block, .admin-block').each(function() {
      var bid = $(this).attr('id').split('block-')[1]; // Ugh.
    });
    // For all hidden addables with no corresponding blocks, mark as addable.
    $('.context-block-item', browser).each(function() {
      var bid = $(this).attr('id').split('context-block-addable-')[1];
    });

    // Mark empty regions.
    $(this.regions).each(function() {
      if ($('.block:has(a.context-block)', this).size() > 0) {
        $(this).removeClass('context-block-region-empty');
      }
      else {
        $(this).addClass('context-block-region-empty');
      }
    });
  },
  // Live update a region
  updateRegion : function(event, ui, region, op) {
    switch (op) {
      case 'over':
        $(region).removeClass('context-block-region-empty');
        break;
      case 'out':
        if (
          // jQuery UI 1.8
          $('.draggable-placeholder', region).size() === 1 &&
          $('.block:has(a.context-block)', region).size() == 0
        ) {
          $(region).addClass('context-block-region-empty');
        }
        break;
    }
  },
  // Remove script elements while dragging & dropping.
  scriptFix : function(event, ui, editor, context) {
    if ($('script', ui.item)) {
      var placeholder = $(Drupal.settings.contextBlockEditor.scriptPlaceholder);
      var label = $('div.handle label', ui.item).text();
      placeholder.children('strong').html(label);
      $('script', ui.item).parent().empty().append(placeholder);
    }
  },
  // Add a block to a region through an AJAX load of the block contents.
  addBlock : function(event, ui, editor, context) {
    var self = this;
    if (ui.item.is('.context-block-addable')) {
      var bid = ui.item.attr('id').split('context-block-addable-')[1];

      // Construct query params for our AJAX block request.
      var params = Drupal.settings.contextBlockEditor.params;
      params.context_block = bid + ',' + context;
      if (!Drupal.settings.contextBlockEditor.block_tokens || !Drupal.settings.contextBlockEditor.block_tokens[bid]) {
        alert(Drupal.t('An error occurred trying to retrieve block content. Please contact a site administer.'));
        return;
     }
     params.context_token = Drupal.settings.contextBlockEditor.block_tokens[bid];

      // Replace item with loading block.
      //ui.sender.append(ui.item);

      var blockLoading = $('<div class="context-block-item context-block-loading"><span class="icon"></span></div>');
      ui.item.addClass('context-block-added');
      ui.item.after(blockLoading);


      $.getJSON(Drupal.settings.contextBlockEditor.path, params, function(data) {
        if (data.status) {
          var newBlock = $(data.block);
          if ($('script', newBlock)) {
            $('script', newBlock).remove();
          }
          blockLoading.fadeOut(function() {
            $(this).replaceWith(newBlock);
            self.initBlocks(newBlock);
            self.updateBlocks();
            Drupal.attachBehaviors(newBlock);
          });
        }
        else {
          blockLoading.fadeOut(function() { $(this).remove(); });
        }
      });
    }
    else if (ui.item.is(':has(a.context-block)')) {
      self.updateBlocks();
    }
  },
  // Update form hidden field with JSON representation of current block visibility states.
  setState : function() {
    var self = this;

    $(this.regions).each(function() {
      var region = $('.context-block-region', this).attr('id').split('context-block-region-')[1];
      var blocks = [];
      $('a.context-block', $(this)).each(function() {
        if ($(this).attr('class').indexOf('edit-') != -1) {
          var bid = $(this).attr('id').split('context-block-')[1];
          var context = $(this).attr('class').split('edit-')[1].split(' ')[0];
          context = context ? context : 0;
          var block = {'bid': bid, 'context': context};
          blocks.push(block);
        }
      });
      self.state[region] = blocks;
    });
    // Serialize here and set form element value.
    $('input.context-block-editor-state', this.editor).val(JSON.stringify(this.state));
  },
  //Disable text selection.
  disableTextSelect : function() {
    if ($.browser.safari) {
      $('.block:has(a.context-block):not(:has(input,textarea))').css('WebkitUserSelect','none');
    }
    else if ($.browser.mozilla) {
      $('.block:has(a.context-block):not(:has(input,textarea))').css('MozUserSelect','none');
    }
    else if ($.browser.msie) {
      $('.block:has(a.context-block):not(:has(input,textarea))').bind('selectstart.contextBlockEditor', function() { return false; });
    }
    else {
      $(this).bind('mousedown.contextBlockEditor', function() { return false; });
    }
  },
  //Enable text selection.
  enableTextSelect : function() {
    if ($.browser.safari) {
      $('*').css('WebkitUserSelect','');
    }
    else if ($.browser.mozilla) {
      $('*').css('MozUserSelect','');
    }
    else if ($.browser.msie) {
      $('*').unbind('selectstart.contextBlockEditor');
    }
    else {
      $(this).unbind('mousedown.contextBlockEditor');
    }
  },
  // Start editing. Attach handlers, begin draggable/sortables.
  editStart : function(editor, context) {
    var self = this;
    // This is redundant to the start handler found in context_ui.js.
    // However it's necessary that we trigger this class addition before
    // we call .sortable() as the empty regions need to be visible.
    $(document.body).addClass('context-editing');
    this.editor.addClass('context-editing');
    this.disableTextSelect();
    this.initBlocks($('.block:has(a.context-block.edit-'+context+')'));
    this.initRegions($('.context-block-region').parent());
    this.updateBlocks();

    $('a.context_ui_dialog-stop').hide();

    $('.editing-context-label').remove();
    var label = $('#context-editable-trigger-'+context+' .label').text();
    label = Drupal.t('Now Editing: ') + label;
    editor.parent().parent()
      .prepend('<div class="editing-context-label">'+ label + '</div>');

    // First pass, enable sortables on all regions.
    $(this.regions).each(function() {
      var region = $(this);
      var params = {
        revert: true,
        dropOnEmpty: true,
        placeholder: 'draggable-placeholder',
        forcePlaceholderSize: true,
        items: '> .block:has(a.context-block.editable)',
        handle: 'a.context-block-handle',
        start: function(event, ui) { self.scriptFix(event, ui, editor, context); },
        stop: function(event, ui) { self.addBlock(event, ui, editor, context); },
        receive: function(event, ui) { self.addBlock(event, ui, editor, context); },
        over: function(event, ui) { self.updateRegion(event, ui, region, 'over'); },
        out: function(event, ui) { self.updateRegion(event, ui, region, 'out'); },
        cursorAt: {left: 300, top: 0}
      };
      region.sortable(params);
    });

    // Second pass, hook up all regions via connectWith to each other.
    $(this.regions).each(function() {
      $(this).sortable('option', 'connectWith', ['.ui-sortable']);
    });

    // Terrible, terrible workaround for parentoffset issue in Safari.
    // The proper fix for this issue has been committed to jQuery UI, but was
    // not included in the 1.6 release. Therefore, we do a browser agent hack
    // to ensure that Safari users are covered by the offset fix found here:
    // http://dev.jqueryui.com/changeset/2073.
    if ($.ui.version === '1.6' && $.browser.safari) {
      $.browser.mozilla = true;
    }
  },
  // Finish editing. Remove handlers.
  editFinish : function() {
    this.editor.removeClass('context-editing');
    this.enableTextSelect();

    $('.editing-context-label').remove();

    // Remove UI elements.
    $(this.blocks).each(function() {
      $('a.context-block-handle, a.context-block-remove', this).remove();
      if($(this).hasClass('context-block-empty')) {
        $(this).addClass('context-block-hidden');
      }
      $(this).removeClass('draggable');
    });

    $('a.context_ui_dialog-stop').show();

    this.regions.sortable('destroy');

    this.setState();

    // Unhack the user agent.
    if ($.ui.version === '1.6' && $.browser.safari) {
      $.browser.mozilla = false;
    }
  }
}; //End of DrupalContextBlockEditor prototype

})(jQuery);
;

(function ($) {

/**
 * Auto-hide summary textarea if empty and show hide and unhide links.
 */
Drupal.behaviors.textSummary = {
  attach: function (context, settings) {
    $('.text-summary', context).once('text-summary', function () {
      var $widget = $(this).closest('div.field-type-text-with-summary');
      var $summaries = $widget.find('div.text-summary-wrapper');

      $summaries.once('text-summary-wrapper').each(function(index) {
        var $summary = $(this);
        var $summaryLabel = $summary.find('label').first();
        var $full = $widget.find('.text-full').eq(index).closest('.form-item');
        var $fullLabel = $full.find('label').first();

        // Create a placeholder label when the field cardinality is
        // unlimited or greater than 1.
        if ($fullLabel.length == 0) {
          $fullLabel = $('<label></label>').prependTo($full);
        }

        // Setup the edit/hide summary link.
        var $link = $('<span class="field-edit-link">(<a class="link-edit-summary" href="#">' + Drupal.t('Hide summary') + '</a>)</span>');
        var $a = $link.find('a');
        var toggleClick = true;
        $link.bind('click', function (e) {
          if (toggleClick) {
            $summary.hide();
            $a.html(Drupal.t('Edit summary'));
            $link.appendTo($fullLabel);
          }
          else {
            $summary.show();
            $a.html(Drupal.t('Hide summary'));
            $link.appendTo($summaryLabel);
          }
          toggleClick = !toggleClick;
          return false;
        }).appendTo($summaryLabel);

        // If no summary is set, hide the summary field.
        if ($(this).find('.text-summary').val() == '') {
          $link.click();
        }
      });
    });
  }
};

})(jQuery);
;
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
 * A progressbar object. Initialized with the given id. Must be inserted into
 * the DOM afterwards through progressBar.element.
 *
 * method is the function which will perform the HTTP request to get the
 * progress bar state. Either "GET" or "POST".
 *
 * e.g. pb = new progressBar('myProgressBar');
 *      some_element.appendChild(pb.element);
 */
Drupal.progressBar = function (id, updateCallback, method, errorCallback) {
  var pb = this;
  this.id = id;
  this.method = method || 'GET';
  this.updateCallback = updateCallback;
  this.errorCallback = errorCallback;

  // The WAI-ARIA setting aria-live="polite" will announce changes after users
  // have completed their current activity and not interrupt the screen reader.
  this.element = $('<div class="progress" aria-live="polite"></div>').attr('id', id);
  this.element.html('<div class="bar"><div class="filled"></div></div>' +
                    '<div class="percentage"></div>' +
                    '<div class="message">&nbsp;</div>');
};

/**
 * Set the percentage and status message for the progressbar.
 */
Drupal.progressBar.prototype.setProgress = function (percentage, message) {
  if (percentage >= 0 && percentage <= 100) {
    $('div.filled', this.element).css('width', percentage + '%');
    $('div.percentage', this.element).html(percentage + '%');
  }
  $('div.message', this.element).html(message);
  if (this.updateCallback) {
    this.updateCallback(percentage, message, this);
  }
};

/**
 * Start monitoring progress via Ajax.
 */
Drupal.progressBar.prototype.startMonitoring = function (uri, delay) {
  this.delay = delay;
  this.uri = uri;
  this.sendPing();
};

/**
 * Stop monitoring progress via Ajax.
 */
Drupal.progressBar.prototype.stopMonitoring = function () {
  clearTimeout(this.timer);
  // This allows monitoring to be stopped from within the callback.
  this.uri = null;
};

/**
 * Request progress data from server.
 */
Drupal.progressBar.prototype.sendPing = function () {
  if (this.timer) {
    clearTimeout(this.timer);
  }
  if (this.uri) {
    var pb = this;
    // When doing a post request, you need non-null data. Otherwise a
    // HTTP 411 or HTTP 406 (with Apache mod_security) error may result.
    $.ajax({
      type: this.method,
      url: this.uri,
      data: '',
      dataType: 'json',
      success: function (progress) {
        // Display errors.
        if (progress.status == 0) {
          pb.displayError(progress.data);
          return;
        }
        // Update display.
        pb.setProgress(progress.percentage, progress.message);
        // Schedule next timer.
        pb.timer = setTimeout(function () { pb.sendPing(); }, pb.delay);
      },
      error: function (xmlhttp) {
        pb.displayError(Drupal.ajaxError(xmlhttp, pb.uri));
      }
    });
  }
};

/**
 * Display errors on the page.
 */
Drupal.progressBar.prototype.displayError = function (string) {
  var error = $('<div class="messages error"></div>').html(string);
  $(this.element).before(error).hide();

  if (this.errorCallback) {
    this.errorCallback(this);
  }
};

})(jQuery);
;

(function($) {

Drupal.behaviors.HierarchicalSelect = {
  attach: function (context) {
    $('.hierarchical-select-wrapper:not(.hierarchical-select-wrapper-processed)', context)
    .addClass('hierarchical-select-wrapper-processed').each(function() {
      var hsid = $(this).attr('id').replace(/^hierarchical-select-(.+)-wrapper$/, "$1");
      Drupal.HierarchicalSelect.initialize(hsid);
    });
  }
};

Drupal.HierarchicalSelect = {};

Drupal.HierarchicalSelect.state = [];

Drupal.HierarchicalSelect.context = function() {
  return $("form .hierarchical-select-wrapper");
};

Drupal.HierarchicalSelect.initialize = function(hsid) {
  // Prevent JS errors when Hierarchical Select is loaded dynamically.
  if (undefined == Drupal.settings.HierarchicalSelect || undefined == Drupal.settings.HierarchicalSelect.settings["hs-" + hsid]) {
    return false;
  }

  // If you set Drupal.settings.HierarchicalSelect.pretendNoJS to *anything*,
  // and as such, Hierarchical Select won't initialize its Javascript! It
  // will seem as if your browser had Javascript disabled.
  if (undefined != Drupal.settings.HierarchicalSelect.pretendNoJS) {
    return false;
  }

  var form = $('#hierarchical-select-'+ hsid +'-wrapper').parents('form');

  // Pressing the 'enter' key on a form that contains an HS widget, depending
  // on which browser, usually causes the first submit button to be pressed
  // (likely an HS button).  This results in unpredictable behaviour.  There is
  // no way to determine the 'real' submit button, so disable the enter key.
  form.find('input').keypress(function(event) {
    if (event.keyCode == 13) {
      event.preventDefault();
      return false;
    }
  });

  // Turn off Firefox' autocomplete feature. This causes Hierarchical Select
  // form items to be disabled after a hard refresh.
  // See http://drupal.org/node/453048 and
  // http://www.ryancramer.com/journal/entries/radio_buttons_firefox/
  if (navigator.userAgent.toLowerCase().indexOf('firefox') > -1) {
    form.attr('autocomplete', 'off');
  }

  // Enable *all* submit buttons in this form, as well as all input-related
  // elements of the current hierarchical select, in case we reloaded while
  // they were disabled.
  form.add('#hierarchical-select-' + hsid +'-wrapper .hierarchical-select .selects select')
      .add('#hierarchical-select-' + hsid +'-wrapper .hierarchical-select input')
      .attr('disabled', false);

  if (this.cache != null) {
    this.cache.initialize();
  }

  Drupal.settings.HierarchicalSelect.settings["hs-" + hsid]['updatesEnabled'] = true;
  if (undefined == Drupal.HierarchicalSelect.state["hs-" + hsid]) {
    Drupal.HierarchicalSelect.state["hs-" + hsid] = {};
  }

  this.transform(hsid);
  if (Drupal.settings.HierarchicalSelect.settings["hs-" + hsid].resizable) {
    this.resizable(hsid);
  }
  Drupal.HierarchicalSelect.attachBindings(hsid);

  if (this.cache != null && this.cache.status()) {
    this.cache.load(hsid);
  }

  Drupal.HierarchicalSelect.log(hsid);
};

Drupal.HierarchicalSelect.log = function(hsid, messages) {
  // Only perform logging if logging is enabled.
  if (Drupal.settings.HierarchicalSelect.initialLog == undefined || Drupal.settings.HierarchicalSelect.initialLog["hs-" + hsid] == undefined) {
    return;
  }
  else {
    Drupal.HierarchicalSelect.state["hs-" + hsid].log = [];
  }

  // Store the log messages. The first call to this function may not contain a
  // message: the initial log included in the initial HTML rendering should be
  // used instead..
  if (Drupal.HierarchicalSelect.state["hs-" + hsid].log.length == 0) {
    Drupal.HierarchicalSelect.state["hs-" + hsid].log.push(Drupal.settings.HierarchicalSelect.initialLog["hs-" + hsid]);
  }
  else {
      Drupal.HierarchicalSelect.state["hs-" + hsid].log.push(messages);
  }

  // Print the log messages.
  console.log("HIERARCHICAL SELECT " + hsid);
  var logIndex = Drupal.HierarchicalSelect.state["hs-" + hsid].log.length - 1;
  for (var i = 0; i < Drupal.HierarchicalSelect.state["hs-" + hsid].log[logIndex].length; i++) {
    console.log(Drupal.HierarchicalSelect.state["hs-" + hsid].log[logIndex][i]);
  }
  console.log(' ');
};

Drupal.HierarchicalSelect.transform = function(hsid) {
  var removeString = $('#hierarchical-select-'+ hsid +'-wrapper .dropbox .dropbox-remove:first', Drupal.HierarchicalSelect.context).text();

  $('#hierarchical-select-'+ hsid +'-wrapper', Drupal.HierarchicalSelect.context)
  // Remove the .nojs div.
  .find('.nojs').hide().end()
  // Find all .dropbox-remove cells in the dropbox table.
  .find('.dropbox .dropbox-remove')
  // Hide the children of these table cells. We're not removing them because
  // we want to continue to use the "Remove" checkboxes.
  .find('*').css('display', 'none').end() // We can't use .hide() because of collapse.js: http://drupal.org/node/351458#comment-1258303.
  // Put a "Remove" link there instead.
  .append('<a href="">'+ removeString +'</a>');
};

Drupal.HierarchicalSelect.resizable = function(hsid) {
  var $selectsWrapper = $('#hierarchical-select-' + hsid + '-wrapper .hierarchical-select .selects', Drupal.HierarchicalSelect.context);

  // No select wrapper present: the user is creating a new item.
  if ($selectsWrapper.length == 0) {
    return;
  }

  // Append the drag handle ("grippie").
  $selectsWrapper.append($('<div class="grippie"></div>'));

  // jQuery object that contains all selects in the hierarchical select, to
  // speed up DOM manipulation during dragging.
  var $selects = $selectsWrapper.find('select');

  var defaultPadding = parseInt($selects.slice(0, 1).css('padding-top').replace(/^(\d+)px$/, "$1")) + parseInt($selects.slice(0, 1).css('padding-bottom').replace(/^(\d+)px$/, "$1"));
  var defaultHeight = Drupal.HierarchicalSelect.state["hs-" + hsid].defaultHeight = $selects.slice(0, 1).height() + defaultPadding;
  var defaultSize = Drupal.HierarchicalSelect.state["hs-" + hsid].defaultSize = $selects.slice(0, 1).attr('size');
  defaultSize = (defaultSize == 0) ? 1 : defaultSize;
  var margin = Drupal.HierarchicalSelect.state["hs-" + hsid].margin = parseInt($selects.slice(0, 1).css('margin-bottom').replace(/^(\d+)px$/, "$1"));

  // Bind the drag event.
  $('.grippie', $selectsWrapper)
  .mousedown(startDrag)
  .dblclick(function() {
    if (Drupal.HierarchicalSelect.state["hs-" + hsid].resizedHeight == undefined) {
      Drupal.HierarchicalSelect.state["hs-" + hsid].resizedHeight = defaultHeight;
    }
    var resizedHeight = Drupal.HierarchicalSelect.state["hs-" + hsid].resizedHeight = (Drupal.HierarchicalSelect.state["hs-" + hsid].resizedHeight > defaultHeight + 2) ? defaultHeight : 4.6 / defaultSize * defaultHeight;
    Drupal.HierarchicalSelect.resize($selects, defaultHeight, resizedHeight, defaultSize, margin);
  });

  function startDrag(e) {
    staticOffset = $selects.slice(0, 1).height() - e.pageY;
    $selects.css('opacity', 0.25);
    $(document).mousemove(performDrag).mouseup(endDrag);
    return false;
  }

  function performDrag(e) {
    var resizedHeight = staticOffset + e.pageY;
    Drupal.HierarchicalSelect.resize($selects, defaultHeight, resizedHeight, defaultSize, margin);
    return false;
  }

  function endDrag(e) {
    var height = $selects.slice(0, 1).height();

    $(document).unbind("mousemove", performDrag).unbind("mouseup", endDrag);
    $selects.css('opacity', 1);
    if (height != Drupal.HierarchicalSelect.state["hs-" + hsid].resizedHeight) {
      Drupal.HierarchicalSelect.state["hs-" + hsid].resizedHeight = (height > defaultHeight) ? height : defaultHeight;
    }
  }
};

Drupal.HierarchicalSelect.resize = function($selects, defaultHeight, resizedHeight, defaultSize, margin) {
  if (resizedHeight == undefined) {
    resizedHeight = defaultHeight;
  }

  $selects
  .attr('size', (resizedHeight > defaultHeight) ? 2 : defaultSize)
  .height(Math.max(defaultHeight + margin, resizedHeight)); // Without the margin component, the height() method would allow the select to be sized to low: defaultHeight - margin.
};

Drupal.HierarchicalSelect.disableForm = function(hsid) {
  // Disable *all* submit buttons in this form, as well as all input-related
  // elements of the current hierarchical select.
  $('form:has(#hierarchical-select-' + hsid +'-wrapper) :submit')
  .add('#hierarchical-select-' + hsid +'-wrapper .hierarchical-select .selects select')
  .add('#hierarchical-select-' + hsid +'-wrapper .hierarchical-select :input')
  .attr('disabled', true);

  // Add the 'waiting' class. Default style: make everything transparent.
  $('#hierarchical-select-' + hsid +'-wrapper').addClass('waiting');

  // Indicate that the user has to wait.
  $('body').css('cursor', 'wait');
};

Drupal.HierarchicalSelect.enableForm = function(hsid) {
  // This method undoes everything the disableForm() method did.

  $e = $('form:has(#hierarchical-select-' + hsid +'-wrapper) :submit')
  .add('#hierarchical-select-' + hsid +'-wrapper .hierarchical-select :input:not(:submit)');

  // Don't enable the selects again if they've been disabled because the
  // dropbox limit was exceeded.
  dropboxLimitExceeded = $('#hierarchical-select-' + hsid +'-wrapper .hierarchical-select-dropbox-limit-warning').length > 0;
  if (!dropboxLimitExceeded) {
    $e = $e.add($('#hierarchical-select-' + hsid +'-wrapper .hierarchical-select .selects select'));
  }
  $e.removeAttr("disabled");

  // Don't enable the 'Add' button again if it's been disabled because the
  // dropbox limit was exceeded.
  if (dropboxLimitExceeded) {
    $('#hierarchical-select-' + hsid +'-wrapper .hierarchical-select :submit')
    .attr('disabled', true);
  }

  $('#hierarchical-select-' + hsid +'-wrapper').removeClass('waiting');

  $('body').css('cursor', 'auto');
};

Drupal.HierarchicalSelect.throwError = function(hsid, message) {
  // Show the error to the user.
  alert(message);

  // Log the error.
  Drupal.HierarchicalSelect.log(hsid, [ message ]);

  // Re-enable the form to allow the user to retry, but reset the selection to
  // the level label if possible, otherwise the "<none>" option if possible.
  var $select = $('#hierarchical-select-' + hsid +'-wrapper .hierarchical-select .selects select:first');
  var levelLabelOption = $('option[value^=label_]', $select).val();
  if (levelLabelOption !== undefined) {
    $select.val(levelLabelOption);
  }
  else {
    var noneOption = $('option[value=none]', $select).val();
    if (noneOption !== undefined) {
      $select.val(noneOption);
    }
  }
  Drupal.HierarchicalSelect.enableForm(hsid);
};

Drupal.HierarchicalSelect.prepareGETSubmit = function(hsid) {
  // Remove the name attributes of all form elements that end up in GET,
  // except for the "flat select" form element.
  $('#hierarchical-select-'+ hsid +'-wrapper', Drupal.HierarchicalSelect.context)
  .find('input, select')
  .not('.flat-select')
  .removeAttr('name');

  // Update the name attribute of the "flat select" form element
  var $flatSelect = $('#hierarchical-select-'+ hsid +'-wrapper .flat-select', Drupal.HierarchicalSelect.context);
  var newName = $flatSelect.attr('name').replace(/^([a-zA-Z0-9_\-]*)(?:\[flat_select\]){1}(\[\])?$/, "$1$2");
  $flatSelect.attr('name', newName);

  Drupal.HierarchicalSelect.triggerEvents(hsid, 'prepared-GET-submit', {});
};

Drupal.HierarchicalSelect.attachBindings = function(hsid) {
  var updateOpString = $('#hierarchical-select-'+ hsid +'-wrapper .update-button').val();
  var addOpString = $('#hierarchical-select-'+ hsid +'-wrapper .hierarchical-select .add-to-dropbox', Drupal.HierarchicalSelect.context).val();
  var createNewItemOpString = $('#hierarchical-select-'+ hsid +'-wrapper .hierarchical-select .create-new-item-create', Drupal.HierarchicalSelect.context).val();
  var cancelNewItemOpString = $('#hierarchical-select-'+ hsid +'-wrapper .hierarchical-select .create-new-item-cancel', Drupal.HierarchicalSelect.context).val();

  var data = {};
  data.hsid = hsid;

  $('#hierarchical-select-'+ hsid +'-wrapper', this.context)
  // "disable-updates" event
  .unbind('disable-updates').bind('disable-updates', data, function(e) {
    Drupal.settings.HierarchicalSelect.settings["hs-" + e.data.hsid]['updatesEnabled'] = false;
  })

  // "enforce-update" event
  .unbind('enforce-update').bind('enforce-update', data, function(e, extraPost) {
     Drupal.HierarchicalSelect.update(e.data.hsid, 'enforced-update', { opString: updateOpString, extraPost: extraPost });
  })

  // "prepare-GET-submit" event
  .unbind('prepare-GET-submit').bind('prepare-GET-submit', data, function(e) {
    Drupal.HierarchicalSelect.prepareGETSubmit(e.data.hsid);
  })

  // "update-hierarchical-select" event
  .find('.hierarchical-select .selects select').unbind().change(function(_hsid) {
    return function() {
      if (Drupal.settings.HierarchicalSelect.settings["hs-" + _hsid]['updatesEnabled']) {
        Drupal.HierarchicalSelect.update(_hsid, 'update-hierarchical-select', { opString: updateOpString, select_id : $(this).attr('id') });
      }
    };
  }(hsid)).end()

  // "create-new-item" event
  .find('.hierarchical-select .create-new-item .create-new-item-create').unbind().click(function(_hsid) {
    return function() {
      Drupal.HierarchicalSelect.update(_hsid, 'create-new-item', { opString : createNewItemOpString });
      return false; // Prevent the browser from POSTing the page.
    };
  }(hsid)).end()

  // "cancel-new-item" event"
  .find('.hierarchical-select .create-new-item .create-new-item-cancel').unbind().click(function(_hsid) {
    return function() {
      Drupal.HierarchicalSelect.update(_hsid, 'cancel-new-item', { opString : cancelNewItemOpString });
      return false; // Prevent the browser from POSTing the page (in case of the "Cancel" button).
    };
  }(hsid)).end()

  // "add-to-dropbox" event
  .find('.hierarchical-select .add-to-dropbox').unbind().click(function(_hsid) {
    return function() {
      Drupal.HierarchicalSelect.update(_hsid, 'add-to-dropbox', { opString : addOpString });
      return false; // Prevent the browser from POSTing the page.
    };
  }(hsid)).end()

  // "remove-from-dropbox" event
  // (anchors in the .dropbox-remove cells in the .dropbox table)
  .find('.dropbox .dropbox-remove a').unbind().click(function(_hsid) {
    return function() {
      var isDisabled = $('#hierarchical-select-'+ hsid +'-wrapper', Drupal.HierarchicalSelect.context).attr('disabled');

      // If the hierarchical select is disabled, then ignore this click.
      if (isDisabled) {
        return false;
      }

      // Check the (hidden, because JS is enabled) checkbox that marks this
      // dropbox entry for removal.
      $(this).parent().find('input[type=checkbox]').attr('checked', true);
      Drupal.HierarchicalSelect.update(_hsid, 'remove-from-dropbox', { opString: updateOpString });
      return false; // Prevent the browser from POSTing the page.
    };
  }(hsid));
};

Drupal.HierarchicalSelect.preUpdateAnimations = function(hsid, updateType, lastUnchanged, callback) {
  switch (updateType) {
    case 'update-hierarchical-select':
      // Drop out the selects of the levels deeper than the select of the
      // level that just changed.
      var animationDelay = Drupal.settings.HierarchicalSelect.settings["hs-" + hsid]['animationDelay'];
      var $animatedSelects = $('#hierarchical-select-'+ hsid +'-wrapper .hierarchical-select .selects select', Drupal.HierarchicalSelect.context).slice(lastUnchanged);
      if ($animatedSelects.size() > 0) {
        $animatedSelects.hide();
        for (var i = 0; i < $animatedSelects.size(); i++) {
          if (i < $animatedSelects.size() - 1) {
            $animatedSelects.slice(i, i + 1).hide("drop", { direction: "left" }, animationDelay);
          }
          else {
            $animatedSelects.slice(i, i + 1).hide("drop", { direction: "left" }, animationDelay, callback);
          }
        }
      }
      else if (callback) {
        callback();
      }
      break;
    default:
      if (callback) {
        callback();
      }
      break;
  }
};

Drupal.HierarchicalSelect.postUpdateAnimations = function(hsid, updateType, lastUnchanged, callback) {
  if (Drupal.settings.HierarchicalSelect.settings["hs-" + hsid].resizable) {
    // Restore the resize.
    Drupal.HierarchicalSelect.resize(
      $('#hierarchical-select-' + hsid + '-wrapper .hierarchical-select .selects select', Drupal.HierarchicalSelect.context),
      Drupal.HierarchicalSelect.state["hs-" + hsid].defaultHeight,
      Drupal.HierarchicalSelect.state["hs-" + hsid].resizedHeight,
      Drupal.HierarchicalSelect.state["hs-" + hsid].defaultSize,
      Drupal.HierarchicalSelect.state["hs-" + hsid].margin
    );
  }

  switch (updateType) {
    case 'update-hierarchical-select':
      var $createNewItemInput = $('#hierarchical-select-'+ hsid +'-wrapper .hierarchical-select .create-new-item-input', Drupal.HierarchicalSelect.context);
      // Hide the loaded selects after the one that was just changed, then
      // drop them in.
      var animationDelay = Drupal.settings.HierarchicalSelect.settings["hs-" + hsid]['animationDelay'];
      var $animatedSelects = $('#hierarchical-select-'+ hsid +'-wrapper .hierarchical-select .selects select', Drupal.HierarchicalSelect.context).slice(lastUnchanged);
      if ($animatedSelects.size() > 0) {
        $animatedSelects.hide();
        for (var i = 0; i < $animatedSelects.size(); i++) {
          if (i < $animatedSelects.size() - 1) {
            $animatedSelects.slice(i, i + 1).show("drop", { direction: "left" }, animationDelay);
          }
          else {
            $animatedSelects.slice(i, i + 1).show("drop", { direction: "left" }, animationDelay, callback);
          }
        }
      }
      else if (callback) {
        callback();
      }
      if ($createNewItemInput.size() == 0) {
        // Give focus to the level below the one that has changed, if it
        // exists.
        setTimeout(
          function() {
            $('#hierarchical-select-'+ hsid +'-wrapper .hierarchical-select .selects select', Drupal.HierarchicalSelect.context)
              .slice(lastUnchanged, lastUnchanged + 1)
              .focus();
          },
          animationDelay + 100
        );
      }
      else {
        // Give focus to the input field of the "create new item/level"
        // section, if it exists, and also select the existing text.
        $createNewItemInput.focus();
        $createNewItemInput[0].select();
      }
      break;

    case 'create-new-item':
      // Make sure that other Hierarchical Selects that represent the same
      // hierarchy are also updated, to make sure that they have the newly
      // created item!
      var cacheId = Drupal.settings.HierarchicalSelect.settings["hs-" + hsid].cacheId;
      for (var otherHsid in Drupal.settings.HierarchicalSelect.settings) {
        if (Drupal.settings.HierarchicalSelect.settings[otherHsid].cacheId == cacheId) {
          $('#hierarchical-select-'+ otherHsid +'-wrapper')
          .trigger('enforce-update');
        }
      }
      // TRICKY: NO BREAK HERE!

    case 'cancel-new-item':
      // After an item/level has been created/cancelled, reset focus to the
      // beginning of the hierarchical select.
      $('#hierarchical-select-'+ hsid +'-wrapper .hierarchical-select .selects select', Drupal.HierarchicalSelect.context)
      .slice(0, 1)
      .focus();

      if (callback) {
        callback();
      }
      break;

    default:
      if (callback) {
        callback();
      }
      break;
  }
};

Drupal.HierarchicalSelect.triggerEvents = function(hsid, updateType, settings) {
  $('#hierarchical-select-'+ hsid +'-wrapper', Drupal.HierarchicalSelect.context)
  .trigger(updateType, [ hsid, settings ]);
};

Drupal.HierarchicalSelect.update = function(hsid, updateType, settings) {
  var post = $('form:has(#hierarchical-select-' + hsid +'-wrapper)', Drupal.HierarchicalSelect.context).formToArray();
  var hs_current_language = Drupal.settings.HierarchicalSelect.hs_current_language;

  // Pass the hierarchical_select id via POST.
  post.push({ name : 'hsid', value : hsid });
  // Send the current language so we can use the same language during the AJAX callback.
  post.push({ name : 'hs_current_language', value : hs_current_language});
  // Emulate the AJAX data sent normally so that we get the same theme.
  post.push({ name : 'ajax_page_state[theme]', value : Drupal.settings.ajaxPageState.theme });
  post.push({ name : 'ajax_page_state[theme_token]', value : Drupal.settings.ajaxPageState.theme_token });

  // If a cache system is installed, let the server know if it's running
  // properly. If it is running properly, the server will send back additional
  // information to maintain a lazily-loaded cache.
  if (Drupal.HierarchicalSelect.cache != null) {
    post.push({ name : 'client_supports_caching', value : Drupal.HierarchicalSelect.cache.status() });
  }

  // updateType is one of:
  // - 'none' (default)
  // - 'update-hierarchical-select'
  // - 'enforced-update'
  // - 'create-new-item'
  // - 'cancel-new-item'
  // - 'add-to-dropbox'
  // - 'remove-from-dropbox'
  switch (updateType) {
    case 'update-hierarchical-select':
      var value = $('#'+ settings.select_id).val();
      var lastUnchanged = parseInt(settings.select_id.replace(/^.*-hierarchical-select-selects-(\d+)/, "$1")) + 1;
      var optionClass = $('#'+ settings.select_id).find('option[value="'+ value +'"]').attr('class');

      // Don't do anything (also no callback to the server!) when the selected
      // item is:
      // - the '<none>' option and the renderFlatSelect setting is disabled, or
      // - a level label, or
      // - an option of class 'has-no-children', and
      //   (the renderFlatSelect setting is disabled or the dropbox is enabled)
      //   and
      //   (the createNewLevels setting is disabled).
      if ((value == 'none' && Drupal.settings.HierarchicalSelect.settings["hs-" + hsid]['renderFlatSelect'] == false)
          || value.match(/^label_\d+$/)
          || (optionClass == 'has-no-children'
             &&
             (
               (Drupal.settings.HierarchicalSelect.settings["hs-" + hsid]['renderFlatSelect'] == false
                || $('#hierarchical-select-'+ hsid +'-wrapper .dropbox').length > 0
               )
               &&
               Drupal.settings.HierarchicalSelect.settings["hs-" + hsid]['createNewLevels'] == false
             )
           )
         )
      {
        Drupal.HierarchicalSelect.preUpdateAnimations(hsid, updateType, lastUnchanged, function() {
          // Remove the sublevels.
          $('#hierarchical-select-'+ hsid +'-wrapper .hierarchical-select .selects select', Drupal.HierarchicalSelect.context)
          .slice(lastUnchanged)
          .remove();

          // The selection of this hierarchical select has changed!
          Drupal.HierarchicalSelect.triggerEvents(hsid, 'change-hierarchical-select', settings);
        });
        return;
      }
      post.push({ name : 'op', value : settings.opString });
      break;

    case 'enforced-update':
      post.push({ name : 'op', value : settings.opString });
      post = post.concat(settings.extraPost);
      break;

    case 'create-new-item':
    case 'cancel-new-item':
    case 'add-to-dropbox':
    case 'remove-from-dropbox':
      post.push({ name : 'op', value : settings.opString });
      break;

    default:
      break;
  }

  // Construct the URL the request should be made to.
  var url = Drupal.settings.HierarchicalSelect.settings["hs-" + hsid].ajax_url;

  // Construct the object that contains the options for a callback to the
  // server. If a client-side cache is found however, it's possible that this
  // won't be used.
  var ajaxOptions = $.extend({}, Drupal.ajax.prototype, {
    url:        url,
    type:       'POST',
    dataType:   'json',
    data:       post,
    effect:     'fade',
    wrapper:    '#hierarchical-select-' + hsid + '-wrapper',
    beforeSend: function() {
      Drupal.HierarchicalSelect.triggerEvents(hsid, 'before-' + updateType, settings);
      Drupal.HierarchicalSelect.disableForm(hsid);
    },
    error: function (XMLHttpRequest, textStatus, errorThrown) {
      // When invalid HTML is received in Safari, jQuery calls this function.
      Drupal.HierarchicalSelect.throwError(hsid, Drupal.t('Received an invalid response from the server.'));
    },
    success: function(response, status) {
      // An invalid response may be returned by the server, in case of a PHP
      // error. Detect this and let the user know.
      if (response === null || response.length == 0) {
        Drupal.HierarchicalSelect.throwError(hsid, Drupal.t('Received an invalid response from the server.'));
        return;
      }

      // Execute all AJAX commands in the response. But pass an additional
      // hsid parameter, which is then only used by the commands written
      // for Hierarchical Select.

      // This is another hack because of the non-Drupal ajax implementation
      // of this module, one of the response that can come from a drupal
      // ajax command is insert, which expects a Drupal.ajax object as the first
      // arguments and assumes that certain functions/settings are available.
      // Because we are calling a Drupal.ajax.command but providing the regular
      // jQuery ajax object itself, we are allowing Drupal.ajax.prototype.commands
      // to misserably fail.
      //
      // This hack attempts to fix one issue with an insert command,
      // @see https://www.drupal.org/node/2393695, allowing it to work properly
      // Other hacks might be necessary for other ajax commands if they are added
      // by external modules.
      this.effect = 'none';
      this.getEffect = Drupal.ajax.prototype.getEffect;

      for (var i in response) {
        if (response[i]['command'] && Drupal.ajax.prototype.commands[response[i]['command']]) {
          Drupal.ajax.prototype.commands[response[i]['command']](this, response[i], status, hsid);
        }
      }

      // Attach behaviors. This is just after the HTML has been updated, so
      // it's as soon as we can.
      Drupal.attachBehaviors($('#hierarchical-select-' + hsid + '-wrapper').parents('div.form-type-hierarchical-select')[0]);

      // Transform the hierarchical select and/or dropbox to the JS variant,
      // make it resizable again and re-enable the disabled form items.
      Drupal.HierarchicalSelect.enableForm(hsid);

      Drupal.HierarchicalSelect.postUpdateAnimations(hsid, updateType, lastUnchanged, function() {
        // Update the client-side cache when:
        // - information for in the cache is provided in the response, and
        // - the cache system is available, and
        // - the cache system is running.
        if (response.cache != null && Drupal.HierarchicalSelect.cache != null && Drupal.HierarchicalSelect.cache.status()) {
          Drupal.HierarchicalSelect.cache.sync(hsid, response.cache);
        }

        if (response.log != undefined) {
          Drupal.HierarchicalSelect.log(hsid, response.log);
        }

        Drupal.HierarchicalSelect.triggerEvents(hsid, updateType, settings);

        if (updateType == 'update-hierarchical-select') {
          // The selection of this hierarchical select has changed!
          Drupal.HierarchicalSelect.triggerEvents(hsid, 'change-hierarchical-select', settings);
        }
      });
    }
  });

  // Use the client-side cache to update the hierarchical select when:
  // - the hierarchical select is being updated (i.e. no add/remove), and
  // - the renderFlatSelect setting is disabled, and
  // - the createNewItems setting is disabled, and
  // - the cache system is available, and
  // - the cache system is running.
  // Otherwise, perform a normal dynamic form submit.
  if (updateType == 'update-hierarchical-select'
      && Drupal.settings.HierarchicalSelect.settings["hs-" + hsid]['renderFlatSelect'] == false
      && Drupal.settings.HierarchicalSelect.settings["hs-" + hsid]['createNewItems'] == false
      && Drupal.HierarchicalSelect.cache != null
      && Drupal.HierarchicalSelect.cache.status())
  {
    Drupal.HierarchicalSelect.cache.updateHierarchicalSelect(hsid, value, settings, lastUnchanged, ajaxOptions);
  }
  else {
    Drupal.HierarchicalSelect.preUpdateAnimations(hsid, updateType, lastUnchanged, function() {
      // Adding current theme to prevent conflicts, @see ajax.js
      // @TODO, try converting to use Drupal.ajax instead.

      // Prevent duplicate HTML ids in the returned markup.
      // @see drupal_html_id()
      var ids = [];
      $('[id]').each(function () {
        ids.push(this.id);
      });

      ajaxOptions.data.push({ name : 'ajax_html_ids[]', value : ids });

      ajaxOptions.data.push({ name : 'ajax_page_state[theme]', value : Drupal.settings.ajaxPageState.theme });
      ajaxOptions.data.push({ name : 'ajax_page_state[theme_token]', value : Drupal.settings.ajaxPageState.theme_token });
      for (var key in Drupal.settings.ajaxPageState.css) {
        ajaxOptions.data.push({ name : 'ajax_page_state[css][' + key + ']', value : 1});
      }
      for (var key in Drupal.settings.ajaxPageState.js) {
        ajaxOptions.data.push({ name : 'ajax_page_state[js][' + key + ']', value : 1});
      }

      // Make it work with jquery update
      if (Drupal.settings.ajaxPageState.jquery_version) {
        ajaxOptions.data.push({ name : 'ajax_page_state[jquery_version]', value : Drupal.settings.ajaxPageState.jquery_version });
      }

      $.ajax(ajaxOptions);
    });
  }
};

Drupal.ajax.prototype.commands.hierarchicalSelectUpdate = function(ajax, response, status, hsid) {
  // Replace the old HTML with the (relevant part of) retrieved HTML.
  $('#hierarchical-select-'+ hsid +'-wrapper', Drupal.HierarchicalSelect.context)
  .parent('.form-item')
  .replaceWith($(response.output));
};

Drupal.ajax.prototype.commands.hierarchicalSelectSettingsUpdate = function(ajax, response, status, hsid) {
  Drupal.settings.HierarchicalSelect.settings["hs-" + response.hsid] = response.settings;
};

})(jQuery);
;
(function ($) {

/**
 * Toggle the visibility of a fieldset using smooth animations.
 */
Drupal.toggleFieldset = function (fieldset) {
  var $fieldset = $(fieldset);
  if ($fieldset.is('.collapsed')) {
    var $content = $('> .fieldset-wrapper', fieldset).hide();
    $fieldset
      .removeClass('collapsed')
      .trigger({ type: 'collapsed', value: false })
      .find('> legend span.fieldset-legend-prefix').html(Drupal.t('Hide'));
    $content.slideDown({
      duration: 'fast',
      easing: 'linear',
      complete: function () {
        Drupal.collapseScrollIntoView(fieldset);
        fieldset.animating = false;
      },
      step: function () {
        // Scroll the fieldset into view.
        Drupal.collapseScrollIntoView(fieldset);
      }
    });
  }
  else {
    $fieldset.trigger({ type: 'collapsed', value: true });
    $('> .fieldset-wrapper', fieldset).slideUp('fast', function () {
      $fieldset
        .addClass('collapsed')
        .find('> legend span.fieldset-legend-prefix').html(Drupal.t('Show'));
      fieldset.animating = false;
    });
  }
};

/**
 * Scroll a given fieldset into view as much as possible.
 */
Drupal.collapseScrollIntoView = function (node) {
  var h = document.documentElement.clientHeight || document.body.clientHeight || 0;
  var offset = document.documentElement.scrollTop || document.body.scrollTop || 0;
  var posY = $(node).offset().top;
  var fudge = 55;
  if (posY + node.offsetHeight + fudge > h + offset) {
    if (node.offsetHeight > h) {
      window.scrollTo(0, posY);
    }
    else {
      window.scrollTo(0, posY + node.offsetHeight - h + fudge);
    }
  }
};

Drupal.behaviors.collapse = {
  attach: function (context, settings) {
    $('fieldset.collapsible', context).once('collapse', function () {
      var $fieldset = $(this);
      // Expand fieldset if there are errors inside, or if it contains an
      // element that is targeted by the URI fragment identifier.
      var anchor = location.hash && location.hash != '#' ? ', ' + location.hash : '';
      if ($fieldset.find('.error' + anchor).length) {
        $fieldset.removeClass('collapsed');
      }

      var summary = $('<span class="summary"></span>');
      $fieldset.
        bind('summaryUpdated', function () {
          var text = $.trim($fieldset.drupalGetSummary());
          summary.html(text ? ' (' + text + ')' : '');
        })
        .trigger('summaryUpdated');

      // Turn the legend into a clickable link, but retain span.fieldset-legend
      // for CSS positioning.
      var $legend = $('> legend .fieldset-legend', this);

      $('<span class="fieldset-legend-prefix element-invisible"></span>')
        .append($fieldset.hasClass('collapsed') ? Drupal.t('Show') : Drupal.t('Hide'))
        .prependTo($legend)
        .after(' ');

      // .wrapInner() does not retain bound events.
      var $link = $('<a class="fieldset-title" href="#"></a>')
        .prepend($legend.contents())
        .appendTo($legend)
        .click(function () {
          var fieldset = $fieldset.get(0);
          // Don't animate multiple times.
          if (!fieldset.animating) {
            fieldset.animating = true;
            Drupal.toggleFieldset(fieldset);
          }
          return false;
        });

      $legend.append(summary);
    });
  }
};

})(jQuery);
;
(function ($) {

Drupal.behaviors.menuFieldsetSummaries = {
  attach: function (context) {
    $('fieldset.menu-link-form', context).drupalSetSummary(function (context) {
      if ($('.form-item-menu-enabled input', context).is(':checked')) {
        return Drupal.checkPlain($('.form-item-menu-link-title input', context).val());
      }
      else {
        return Drupal.t('Not in menu');
      }
    });
  }
};

/**
 * Automatically fill in a menu link title, if possible.
 */
Drupal.behaviors.menuLinkAutomaticTitle = {
  attach: function (context) {
    $('fieldset.menu-link-form', context).each(function () {
      // Try to find menu settings widget elements as well as a 'title' field in
      // the form, but play nicely with user permissions and form alterations.
      var $checkbox = $('.form-item-menu-enabled input', this);
      var $link_title = $('.form-item-menu-link-title input', context);
      var $title = $(this).closest('form').find('.form-item-title input');
      // Bail out if we do not have all required fields.
      if (!($checkbox.length && $link_title.length && $title.length)) {
        return;
      }
      // If there is a link title already, mark it as overridden. The user expects
      // that toggling the checkbox twice will take over the node's title.
      if ($checkbox.is(':checked') && $link_title.val().length) {
        $link_title.data('menuLinkAutomaticTitleOveridden', true);
      }
      // Whenever the value is changed manually, disable this behavior.
      $link_title.keyup(function () {
        $link_title.data('menuLinkAutomaticTitleOveridden', true);
      });
      // Global trigger on checkbox (do not fill-in a value when disabled).
      $checkbox.change(function () {
        if ($checkbox.is(':checked')) {
          if (!$link_title.data('menuLinkAutomaticTitleOveridden')) {
            $link_title.val($title.val());
          }
        }
        else {
          $link_title.val('');
          $link_title.removeData('menuLinkAutomaticTitleOveridden');
        }
        $checkbox.closest('fieldset.vertical-tabs-pane').trigger('summaryUpdated');
        $checkbox.trigger('formUpdated');
      });
      // Take over any title change.
      $title.keyup(function () {
        if (!$link_title.data('menuLinkAutomaticTitleOveridden') && $checkbox.is(':checked')) {
          $link_title.val($title.val());
          $link_title.val($title.val()).trigger('formUpdated');
        }
      });
    });
  }
};

})(jQuery);
;
(function ($) {

Drupal.behaviors.pathFieldsetSummaries = {
  attach: function (context) {
    $('fieldset.path-form', context).drupalSetSummary(function (context) {
      var path = $('.form-item-path-alias input').val();
      var automatic = $('.form-item-path-pathauto input').attr('checked');

      if (automatic) {
        return Drupal.t('Automatic alias');
      }
      if (path) {
        return Drupal.t('Alias: @alias', { '@alias': path });
      }
      else {
        return Drupal.t('No alias');
      }
    });
  }
};

})(jQuery);
;
(function ($) {

/**
 * Attaches the autocomplete behavior to all required fields.
 */
Drupal.behaviors.autocomplete = {
  attach: function (context, settings) {
    var acdb = [];
    $('input.autocomplete', context).once('autocomplete', function () {
      var uri = this.value;
      if (!acdb[uri]) {
        acdb[uri] = new Drupal.ACDB(uri);
      }
      var $input = $('#' + this.id.substr(0, this.id.length - 13))
        .attr('autocomplete', 'OFF')
        .attr('aria-autocomplete', 'list');
      $($input[0].form).submit(Drupal.autocompleteSubmit);
      $input.parent()
        .attr('role', 'application')
        .append($('<span class="element-invisible" aria-live="assertive"></span>')
          .attr('id', $input.attr('id') + '-autocomplete-aria-live')
        );
      new Drupal.jsAC($input, acdb[uri]);
    });
  }
};

/**
 * Prevents the form from submitting if the suggestions popup is open
 * and closes the suggestions popup when doing so.
 */
Drupal.autocompleteSubmit = function () {
  return $('#autocomplete').each(function () {
    this.owner.hidePopup();
  }).length == 0;
};

/**
 * An AutoComplete object.
 */
Drupal.jsAC = function ($input, db) {
  var ac = this;
  this.input = $input[0];
  this.ariaLive = $('#' + this.input.id + '-autocomplete-aria-live');
  this.db = db;

  $input
    .keydown(function (event) { return ac.onkeydown(this, event); })
    .keyup(function (event) { ac.onkeyup(this, event); })
    .blur(function () { ac.hidePopup(); ac.db.cancel(); });

};

/**
 * Handler for the "keydown" event.
 */
Drupal.jsAC.prototype.onkeydown = function (input, e) {
  if (!e) {
    e = window.event;
  }
  switch (e.keyCode) {
    case 40: // down arrow.
      this.selectDown();
      return false;
    case 38: // up arrow.
      this.selectUp();
      return false;
    default: // All other keys.
      return true;
  }
};

/**
 * Handler for the "keyup" event.
 */
Drupal.jsAC.prototype.onkeyup = function (input, e) {
  if (!e) {
    e = window.event;
  }
  switch (e.keyCode) {
    case 16: // Shift.
    case 17: // Ctrl.
    case 18: // Alt.
    case 20: // Caps lock.
    case 33: // Page up.
    case 34: // Page down.
    case 35: // End.
    case 36: // Home.
    case 37: // Left arrow.
    case 38: // Up arrow.
    case 39: // Right arrow.
    case 40: // Down arrow.
      return true;

    case 9:  // Tab.
    case 13: // Enter.
    case 27: // Esc.
      this.hidePopup(e.keyCode);
      return true;

    default: // All other keys.
      if (input.value.length > 0 && !input.readOnly) {
        this.populatePopup();
      }
      else {
        this.hidePopup(e.keyCode);
      }
      return true;
  }
};

/**
 * Puts the currently highlighted suggestion into the autocomplete field.
 */
Drupal.jsAC.prototype.select = function (node) {
  this.input.value = $(node).data('autocompleteValue');
  $(this.input).trigger('autocompleteSelect', [node]);
};

/**
 * Highlights the next suggestion.
 */
Drupal.jsAC.prototype.selectDown = function () {
  if (this.selected && this.selected.nextSibling) {
    this.highlight(this.selected.nextSibling);
  }
  else if (this.popup) {
    var lis = $('li', this.popup);
    if (lis.length > 0) {
      this.highlight(lis.get(0));
    }
  }
};

/**
 * Highlights the previous suggestion.
 */
Drupal.jsAC.prototype.selectUp = function () {
  if (this.selected && this.selected.previousSibling) {
    this.highlight(this.selected.previousSibling);
  }
};

/**
 * Highlights a suggestion.
 */
Drupal.jsAC.prototype.highlight = function (node) {
  if (this.selected) {
    $(this.selected).removeClass('selected');
  }
  $(node).addClass('selected');
  this.selected = node;
  $(this.ariaLive).html($(this.selected).html());
};

/**
 * Unhighlights a suggestion.
 */
Drupal.jsAC.prototype.unhighlight = function (node) {
  $(node).removeClass('selected');
  this.selected = false;
  $(this.ariaLive).empty();
};

/**
 * Hides the autocomplete suggestions.
 */
Drupal.jsAC.prototype.hidePopup = function (keycode) {
  // Select item if the right key or mousebutton was pressed.
  if (this.selected && ((keycode && keycode != 46 && keycode != 8 && keycode != 27) || !keycode)) {
    this.select(this.selected);
  }
  // Hide popup.
  var popup = this.popup;
  if (popup) {
    this.popup = null;
    $(popup).fadeOut('fast', function () { $(popup).remove(); });
  }
  this.selected = false;
  $(this.ariaLive).empty();
};

/**
 * Positions the suggestions popup and starts a search.
 */
Drupal.jsAC.prototype.populatePopup = function () {
  var $input = $(this.input);
  var position = $input.position();
  // Show popup.
  if (this.popup) {
    $(this.popup).remove();
  }
  this.selected = false;
  this.popup = $('<div id="autocomplete"></div>')[0];
  this.popup.owner = this;
  $(this.popup).css({
    top: parseInt(position.top + this.input.offsetHeight, 10) + 'px',
    left: parseInt(position.left, 10) + 'px',
    width: $input.innerWidth() + 'px',
    display: 'none'
  });
  $input.before(this.popup);

  // Do search.
  this.db.owner = this;
  this.db.search(this.input.value);
};

/**
 * Fills the suggestion popup with any matches received.
 */
Drupal.jsAC.prototype.found = function (matches) {
  // If no value in the textfield, do not show the popup.
  if (!this.input.value.length) {
    return false;
  }

  // Prepare matches.
  var ul = $('<ul></ul>');
  var ac = this;
  for (key in matches) {
    $('<li></li>')
      .html($('<div></div>').html(matches[key]))
      .mousedown(function () { ac.hidePopup(this); })
      .mouseover(function () { ac.highlight(this); })
      .mouseout(function () { ac.unhighlight(this); })
      .data('autocompleteValue', key)
      .appendTo(ul);
  }

  // Show popup with matches, if any.
  if (this.popup) {
    if (ul.children().length) {
      $(this.popup).empty().append(ul).show();
      $(this.ariaLive).html(Drupal.t('Autocomplete popup'));
    }
    else {
      $(this.popup).css({ visibility: 'hidden' });
      this.hidePopup();
    }
  }
};

Drupal.jsAC.prototype.setStatus = function (status) {
  switch (status) {
    case 'begin':
      $(this.input).addClass('throbbing');
      $(this.ariaLive).html(Drupal.t('Searching for matches...'));
      break;
    case 'cancel':
    case 'error':
    case 'found':
      $(this.input).removeClass('throbbing');
      break;
  }
};

/**
 * An AutoComplete DataBase object.
 */
Drupal.ACDB = function (uri) {
  this.uri = uri;
  this.delay = 300;
  this.cache = {};
};

/**
 * Performs a cached and delayed search.
 */
Drupal.ACDB.prototype.search = function (searchString) {
  var db = this;
  this.searchString = searchString;

  // See if this string needs to be searched for anyway. The pattern ../ is
  // stripped since it may be misinterpreted by the browser.
  searchString = searchString.replace(/^\s+|\.{2,}\/|\s+$/g, '');
  // Skip empty search strings, or search strings ending with a comma, since
  // that is the separator between search terms.
  if (searchString.length <= 0 ||
    searchString.charAt(searchString.length - 1) == ',') {
    return;
  }

  // See if this key has been searched for before.
  if (this.cache[searchString]) {
    return this.owner.found(this.cache[searchString]);
  }

  // Initiate delayed search.
  if (this.timer) {
    clearTimeout(this.timer);
  }
  this.timer = setTimeout(function () {
    db.owner.setStatus('begin');

    // Ajax GET request for autocompletion. We use Drupal.encodePath instead of
    // encodeURIComponent to allow autocomplete search terms to contain slashes.
    $.ajax({
      type: 'GET',
      url: db.uri + '/' + Drupal.encodePath(searchString),
      dataType: 'json',
      success: function (matches) {
        if (typeof matches.status == 'undefined' || matches.status != 0) {
          db.cache[searchString] = matches;
          // Verify if these are still the matches the user wants to see.
          if (db.searchString == searchString) {
            db.owner.found(matches);
          }
          db.owner.setStatus('found');
        }
      },
      error: function (xmlhttp) {
        alert(Drupal.ajaxError(xmlhttp, db.uri));
      }
    });
  }, this.delay);
};

/**
 * Cancels the current autocomplete request.
 */
Drupal.ACDB.prototype.cancel = function () {
  if (this.owner) this.owner.setStatus('cancel');
  if (this.timer) clearTimeout(this.timer);
  this.searchString = '';
};

})(jQuery);
;

(function ($) {

Drupal.behaviors.nodeFieldsetSummaries = {
  attach: function (context) {
    $('fieldset.node-form-revision-information', context).drupalSetSummary(function (context) {
      var revisionCheckbox = $('.form-item-revision input', context);

      // Return 'New revision' if the 'Create new revision' checkbox is checked,
      // or if the checkbox doesn't exist, but the revision log does. For users
      // without the "Administer content" permission the checkbox won't appear,
      // but the revision log will if the content type is set to auto-revision.
      if (revisionCheckbox.is(':checked') || (!revisionCheckbox.length && $('.form-item-log textarea', context).length)) {
        return Drupal.t('New revision');
      }

      return Drupal.t('No revision');
    });

    $('fieldset.node-form-author', context).drupalSetSummary(function (context) {
      var name = $('.form-item-name input', context).val() || Drupal.settings.anonymous,
        date = $('.form-item-date input', context).val();
      return date ?
        Drupal.t('By @name on @date', { '@name': name, '@date': date }) :
        Drupal.t('By @name', { '@name': name });
    });

    $('fieldset.node-form-options', context).drupalSetSummary(function (context) {
      var vals = [];

      $('input:checked', context).parent().each(function () {
        vals.push(Drupal.checkPlain($.trim($(this).text())));
      });

      if (!$('.form-item-status input', context).is(':checked')) {
        vals.unshift(Drupal.t('Not published'));
      }
      return vals.join(', ');
    });
  }
};

})(jQuery);
;