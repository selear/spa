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
          + '<div class="spa-shell-chat"></div>'
          + '<div class="spa-shell-modal"></div>',
        chat_extend_time: 1000,
        chat_retract_time: 300,
        chat_extend_height: 450,
        chat_retract_height: 15
    },
        stateMap = { $container : null },
        jqueryMap = {},

        setJqueryMap, toggleChat, initModule;
    //----- Module scope variables -----

    //+++++ utility methods +++++
    //----- utility methods -----

    //+++++ DOM methods +++++
    setJqueryMap = function () {
        var $container = stateMap.$container;
        jqueryMap = {
          $container : $container,
          $chat: $container.find('.spa-shell-chat') //$container作为总的容器, 作为root供其他元素进行使用
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
  
    //----- event handlers -----

    //+++++ public methods +++++
    initModule = function ($container) {
      stateMap.$container = $container;
      $container.html( configMap.main_html );
      setJqueryMap();

      //test toggle
      setTimeout(function () { toggleChat(true) }, 3000);
      setTimeout(function () { toggleChat(false)}, 8000);
    };

    return { initModule : initModule };
    //----- End public methods -----
}());