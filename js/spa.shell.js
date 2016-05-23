/*jslint            browser : true,   continue  : true,
  devel   : true,   indent  : 2,      maxerr    : 50,
  newcap  : true,   nomen   : true,   plusplus  : true,
  regexp  : true,   sloppy  : true,   vars      : false,
  white   : true
 */
/*global $, spa */
spa.shell = (function () {
  //+++++ Module scope variables +++++
  var configMap = {
        anchor_schema_map: {
          chat: { opened: true, closed: true }
        },
        main_html: new String()
          + '<div class="spa-shell-head">'
            + '<div class="spa-shell-head-logo"></div>'
            + '<div class="spa-shell-head-acct"></div>'
            + '<spa class="spa-shell-head-search"></spa>'
          + '</div>'
          + '<div class="spa-shell-main">'
            + '<div class="spa-shell-main-nav"></div>'
            + '<div class="spa-shell-main-content"></div>'
          + '</div>'
          + '<div class="spa-shell-foot"></div>'
          + '<div class="spa-shell-modal"></div>',
        chat_extend_time: 250,
        chat_retract_time: 300,
        chat_extend_height: 450,
        chat_retract_height: 15,
        chat_extended_title: 'Click to retract',
        chat_retracted_title: 'Click to extend'
    },
        stateMap = {
          anchor_map: {}
    },
        jqueryMap = {},

        copyAnchorMap, setJqueryMap,
        changeAnchorPart, onHashchange,
        setChatAnchor, initModule;
    //----- Module scope variables -----

    //+++++ utility methods +++++
    copyAnchorMap = function () {
      return $.extend(true, {}, stateMap.anchor_map);
    };
    //----- utility methods -----

    //+++++ DOM methods +++++
    changeAnchorPart = function (arg_map) {
      var anchor_map_revise = copyAnchorMap(),
          bool_return = true,
          key_name, key_name_dep;

      //+++ merge changes into anchor map +++
      KEYVAL:
      for(key_name in arg_map) {
        if(arg_map.hasOwnProperty(key_name)) {

          //skip dependent keys
          if(key_name.indexOf('_') === 0) { continue KEYVAL; }

          //update independent key value
          anchor_map_revise[key_name] = arg_map[key_name];

          //update matching dependent key
          key_name_dep = '_' + key_name;
          if(arg_map[key_name_dep]) {
            anchor_map_revise[key_name_dep] = arg_map[key_name_dep];
          } else {
            delete anchor_map_revise[key_name_dep];
            delete anchor_map_revise['_s' + key_name_dep];
          }
        }
      }
      //--- merge change into anchor map ---

      //+++ attempt to update URI; revert if not successful
      try {
        $.uriAnchor.setAnchor(anchor_map_revise);
      } catch(error) {
        $.uriAnchor.setAnchor( stateMap.anchor_map, null, true );
        bool_return = false;
      }
      //--- attempt to update URI ---

      return bool_return;
    };

    setJqueryMap = function () {
        var $container = stateMap.$container;
        jqueryMap = {
          $container: $container
        };
    };

    toggleChat = function (do_extend, callback) {
      var px_chat_ht = jqueryMap.$chat.height(),
          is_open = px_chat_ht === configMap.chat_extend_height,
          is_closed = px_chat_ht === configMap.chat_retract_height,
          is_sliding = !is_open && !is_closed;

      if(is_sliding) {
        return false;
      }

      //+++ extend chat +++
      if(do_extend) {
        jqueryMap.$chat.animate(
          { height: configMap.chat_extend_height },
          configMap.chat_extend_time,

          function () {
            jqueryMap.$chat.attr('title', configMap.chat_extended_title);
            stateMap.is_chat_retracted = false;

            if(callback) {
              callback(jqueryMap.$chat);
            }
          }
        );
        return true;
      }
      //--- extend chat ---

      //+++ retract chat +++
      jqueryMap.$chat.animate(

        { height: configMap.chat_retract_height },
        configMap.chat_retract_time,

        function() {
          jqueryMap.$chat.attr('title', configMap.chat_retracted_title);
          stateMap.is_chat_retracted = true;

          if(callback) {
            callback(jqueryMap.$chat);
          }
        }
      );
      return true;
      //--- retract chat ---
    };
    //----- DOM methods -----

    //+++++ event handlers +++++
    onHashchange = function(event) {

      var anchor_map_previous = copyAnchorMap(),
          anchor_map_proposed,
          _s_chat_previous, _s_chat_proposed,
          s_chat_proposed,
          is_ok = true;

      try {
        anchor_map_proposed = $.uriAnchor.makeAnchorMap();
      } catch(error) {
        $.uriAnchor.setAnchor(anchor_map_previous, null, true);
        return false;
      }
      stateMap.anchor_map = anchor_map_proposed;

      _s_chat_previous = anchor_map_previous._s_chat;
      _s_chat_proposed = anchor_map_proposed._s_chat;

      if(!anchor_map_previous || _s_chat_previous !== _s_chat_proposed) {
        s_chat_proposed = anchor_map_proposed.chat;
        switch(s_chat_proposed) {
          case 'opened':
            is_ok = spa.chat.setSliderPosition('opened');
            break;
          case 'closed':
            is_ok = spa.chat.setSliderPosition('closed');
            break;
          default:
            spa.chat.setSliderPosition('closed');
            delete anchor_map_proposed.chat;
            $.uriAnchor.setAnchor(anchor_map_proposed, null, true);
        }
      }

      if(!is_ok) {
        if(anchor_map_previous) {
          $.uriAnchor.setAnchor(anchor_map_previous, null, true);
          stateMap.anchor_map = anchor_map_previous;
        } else {
          delete anchor_map_proposed.chat;
          $.uriAnchor.setAnchor(anchor_map_proposed, null, true);
        }
      }

      return false;
    };

    setChatAnchor = function (position_type) {
      return changeAnchorPart({ chat: position_type });
    };
    //----- event handlers -----

    //+++++ public methods +++++
    initModule = function ($container) {
      stateMap.$container = $container;
      $container.html( configMap.main_html );
      setJqueryMap();

      $.uriAnchor.configModule({
        schema_map: configMap.anchor_schema_map
      });

      spa.chat.configModule({
        set_chat_anchor: setChatAnchor,
        chat_model: spa.model.chat,
        people_model: spa.model.people
      });
      spa.chat.initModule(jqueryMap.$container);

      $(window).bind('hashchange', onHashchange).trigger('hashchange');
    };

    return { initModule : initModule };
    //----- End public methods -----
}());