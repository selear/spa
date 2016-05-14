/*jslint            browser : true,   continue  : true,
  devel   : true,   indent  : 2,      maxerr    : 50,
  newcap  : true,   nomen   : true,   plusplus  : true,
  regexp  : true,   sloppy  : true,   vars      : false,
  white   : true
 */
/*global $, spa */
spa.shell = (function () {
  //----- Begin Module scope variables -----
  var configMap = {
        main_html: new String() +
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
          + '<div class="spa-shell-modal"></div>'
    },
        stateMap = { $container : null },
        jqueryMap = {},

        setJqueryMap, initModule;
    //----- End Module scope variables -----

    //----- Begin utility methods -----
    //----- End utility methods -----

    //----- Begin DOM methods -----
    setJqueryMap = function () {
        var $container = stateMap.$container;
        jqueryMap = { $container : $container };
    };
    //----- End DOM methods -----

    //----- Begin event handlers -----
  
    //----- End event handlers -----

    //----- Begin public methods -----
    initModule = function ($container) {
      stateMap.$container = $container;
      $container.html( configMap.main_html );
      setJqueryMap();
    };

    return { initModule : initModule };
    //----- End public methods -----
}());