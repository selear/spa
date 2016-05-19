/*
    spa.chat.js
    Chat功能模块 for SPA
 */
/*jslint          browser : true,   continue : true,
  devel  : true,  indent  : 2,      maxerr   : 50,
  newcap : true,  nomen   : true,   plusplus : true,
  regexp : true,  sloppy  : true,   vars     : false,
  white  : true
 */
/*global $, spa */
spa.chat = (function () {

  //+++++ module scope variables +++++
  var configMap = {
        main_html: String()
          + '<div style="padding:1em; color:#fff;">'
            + 'Say hello to chat'
          + '</div>',
        settable_map: {}
      },
      stateMap = { $container: null },
      jqueryMap = {},

      setJqueryMap, configModule, initModule;
  //----- module scope variables -----

  //+++++ utility methods +++++
  //----- utility methods -----

  //+++++ dom methods +++++
  setJqueryMap = function() {
    var $container = stateMap.$container;
    jqueryMap = { $container: $container };
  };
  //----- dom methods -----

  //+++++ event handlers +++++
  //----- event handlers -----

  //+++++ public methods +++++
  configModule = function (input_map) {
    spa.util.setConfigMap({
      input_map: input_map,
      settable_map: configMap.settable_map,
      config_map: configMap
    });
    return true;
  };

  initModule = function ($container) {
    $container.html(configMap.main_html);
    stateMap.$container = $container;
    setJqueryMap();
    return true;
  };

  return {
    configModule: configModule,
    initModule: initModule
  };
  //----- public methods -----
}());