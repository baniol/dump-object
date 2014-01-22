(function(global) {

  var objectParser = {

    html: null,
    popup: null,
    content: null,
    out: null,

    init: function (object, name) {
        this.parseStream(object, name);
    },

    preparePopup: function (object, name) {
      var pop = $('.dump-object');
      var html =  '<div class="dump-object">' + 
                  '<div class="object-header"><div class="popup-close"></div>' +
                  // '<div class="object-title"></div>' +
                  '<div class="toggle-all">Toglle All</div></div><div class="content"></div></div>';

      if (pop.length === 0) {
        this.popup = $(html);
        this.content = $('.content', this.popup);
        $(document.body).append(this.popup);
      }
    },

    parseStream: function (object, name) {
      this.html = '';
      name = name || '';
      this.parseObject(object, name, undefined, true);
      this.preparePopup(object, name);
      this.content.html(this.html);
      // this.popup.find('.object-title').text(name);
      this.bindEvents();
    },

    parseObject: function (obj, inp, arr, start) {
      var label = arr ? 'class="array"' : '';
      var count = arr ? '('+arr+')' : '';
      if (start) {
        this.html += '<ul>';
      } else {
        inp = (!isNaN(parseInt(inp, 10))) ?  parseInt(inp, 10) + 1 : inp;
        var numClass = (!isNaN(parseInt(inp, 10))) ?  'li-num' : '';
        this.html += '<li '+label+'><span class="li-label '+numClass+'" data-prop-name="'+inp+'">'+inp+' '+count+'</span><ul class="block">';
      }
      var parentObject = {};
      for (var p in obj) {
        if (obj.hasOwnProperty(p)) {
          var v = obj[p];
          if (typeof v === 'object') {
            arr = (v instanceof Array) ? v.length : undefined;
            this.parseObject(v, p, arr);
          }
          if (typeof v === 'string' || typeof v === 'number') {
            var color = (typeof v === 'number') ? 'number' : 'string';
            this.html += '<li><span class="key">' + p + '</span> : <span class="value '+color+'">' + v + '</span></li>';
          }
        }
      }
      if (!start) {
        this.html += '</ul></li>';
      } else {
        this.html += '</ul>';
      }
    },

    closePopup: function () {
      $('.dump-object ').off('click','.li-label');
      $('.dump-object ').off('click','.toggle-all');
      $('.dump-object ').off('click','.popup-close');
      this.popup.remove();
    },

    bindEvents: function () {
      var self = this;
      $('.dump-object ').on('click','.li-label',function () {
        var el = $(this);
        var parent = el.parent();
        var ul = parent.find('>ul');
        if (parent.hasClass('opened')) {
          parent.removeClass('opened');
          ul.hide();
        } else {
          parent.addClass('opened');
          ul.show();
        }
      });

      $('.dump-object').on('click','.toggle-all',function () {
        var el = $(this);
        if (el.hasClass('opened')) {
          $('li.array').removeClass('opened');
          $('li.array > ul').hide();
          el.removeClass('opened');
        } else {
          $('li.array').addClass('opened');
          $('li.array > ul').show();
          el.addClass('opened');
        }
      });

      $('.dump-object').on('click','.popup-close',function () {
        var el = $(this);
        self.closePopup();
      });

      $('.dump-object').on('mouseenter','ul li .li-label',function () {
        $(this).closest('.array').addClass('hover');
        $(this).closest('.array').find('>ul>li').addClass('hover');
      });

      $('.dump-object').on('mouseout','ul li .li-label',function () {
        $(this).closest('.array').removeClass('hover');
        $(this).closest('.array').find('>ul>li').removeClass('hover');
      });

    }

  };

  global.dumpObject = objectParser.init.bind(objectParser);

})(this);
