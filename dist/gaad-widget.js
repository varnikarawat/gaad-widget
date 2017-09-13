(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports={"dates":{"2011":{"{x}":0,"{d}":"19","{th}":"th","{m}":"May","{y}":"2011","ts":1305759600000},"2012":{"{x}":1,"{d}":"17","{th}":"th","{m}":"May","{y}":"2012","ts":1337209200000},"2013":{"{x}":2,"{d}":"16","{th}":"th","{m}":"May","{y}":"2013","ts":1368658800000},"2014":{"{x}":3,"{d}":"15","{th}":"th","{m}":"May","{y}":"2014","ts":1400108400000},"2015":{"{x}":4,"{d}":"21","{th}":"st","{m}":"May","{y}":"2015","ts":1432162800000},"2016":{"{x}":5,"{d}":"19","{th}":"th","{m}":"May","{y}":"2016","ts":1463612400000},"2017":{"{x}":6,"{d}":"18","{th}":"th","{m}":"May","{y}":"2017","ts":1495062000000},"2018":{"{x}":7,"{d}":"17","{th}":"th","{m}":"May","{y}":"2018","ts":1526511600000},"2019":{"{x}":8,"{d}":"16","{th}":"th","{m}":"May","{y}":"2019","ts":1557961200000},"2020":{"{x}":9,"{d}":"21","{th}":"st","{m}":"May","{y}":"2020","ts":1590015600000},"2021":{"{x}":10,"{d}":"20","{th}":"th","{m}":"May","{y}":"2021","ts":1621465200000},"2022":{"{x}":11,"{d}":"19","{th}":"th","{m}":"May","{y}":"2022","ts":1652914800000},"2023":{"{x}":12,"{d}":"18","{th}":"th","{m}":"May","{y}":"2023","ts":1684364400000},"2024":{"{x}":13,"{d}":"16","{th}":"th","{m}":"May","{y}":"2024","ts":1715814000000},"2025":{"{x}":14,"{d}":"15","{th}":"th","{m}":"May","{y}":"2025","ts":1747263600000}}}
},{}],2:[function(require,module,exports){
/*!
  gaad-widget.js | © 2017 Nick Freear | License: MIT | NOT an official widget!

  https://github.com/nfreear/gaad-widget
  http://globalaccessibilityawarenessday.org
*/

'use strict';

var VERSION = '3.1.0-beta'; // <Auto>

var TRANSLATE_TEXTS = {
  en: require('./locales/en'),
  fr: require('./locales/fr')
};
var GAAD_DATE_LOOKUP = require('./data/gaad-dates.min.json');
// console.log(GAAD_DATE_LOOKUP);
var DEFAULTS = require('./src/configure').config(TRANSLATE_TEXTS, GAAD_DATE_LOOKUP, VERSION);
var METHODS = require('./src/methods');

METHODS.analytics = require('node-analytics-ga');
// METHODS.analytics = require('universal-ga');
// METHODS.analytics = require('./google-analytics/index');

require('./src/widget-src').run(DEFAULTS, METHODS);

},{"./data/gaad-dates.min.json":1,"./locales/en":3,"./locales/fr":4,"./src/configure":6,"./src/methods":7,"./src/widget-src":8,"node-analytics-ga":5}],3:[function(require,module,exports){
module.exports={
  "name": "Global Accessibility Awareness Day (GAAD)",
  "before": "Join us on Thursday May {d}{th}, {y} and mark the {x}th <a {at}>{g}</a>.",
  "after": "Put next year's <a {at}>{g}</a>, Thursday May {d}{th}, {y}, in your diary. See you then!",
  "url": "http://globalaccessibilityawarenessday.org"
}

},{}],4:[function(require,module,exports){
module.exports={
  "before": "Rejoignez-nous le jeudi {d} mai {y} et marquez le {x}ème <a {at}>{g}</a>.",
  "after": "Mettez le <a {at}>{g}</a> de l'année prochaine, le jeudi {d} mai {y} dans votre journal. À plus tard!",
  "url": "/gaadfr.html"
}

},{}],5:[function(require,module,exports){
/*!
  A basic Google Analytics wrapper | © Nick Freear, 06-July-2017.
*/

module.exports = {
  create: create,
  pageView: pageView,
  sendEvent: sendEvent
};

var WIN = window;
var DOC = WIN.document;
var LOC = WIN.location;

var analyticsCfg = {};
var enable = false;
var gaFn;
var sendName;

/** create
 * @public

 var config = {
   id: 'UA-XXXXX-Y', // Required.
   name: 'gaadWidget', // Required.
   fn: 'myGA' // Optional.
 };

 */
function create (config) {
  // Setup private vars.
  enable = config && config.id;
  analyticsCfg = config;

  if (!enable) {
    console.warn('no analytics');
    return;
  }

  analyticsCfg.fn = analyticsCfg.fn || 'ga';

  includeJavascript(analyticsCfg.fn);

  return createTracker();
}

/** createTracker.
 * @private
 */
function createTracker () {
  gaFn = WIN[ analyticsCfg.fn ];
  sendName = analyticsCfg.name ? analyticsCfg.name + '.send' : 'send';

  // ga('create', 'UA-XXXXX-Y', 'auto');
  gaFn('create', analyticsCfg.id, 'auto', analyticsCfg.name);

  console.warn('analytics: ', analyticsCfg);

  return analyticsCfg;
}

/** pageView.
 * @public
 */
function pageView () {
  if (!enable) return;

  var path = null;
  if (analyticsCfg.isWidget) {
    // Widgets: include "host" in the path sent to pageview.
    path = LOC.host + LOC.pathname + LOC.search.replace(/^\?/, '!');
  }

  gaFn(sendName, 'pageview', path);
}

/** sendEvent.
 * @public
 */
function sendEvent (cat, act, label, value) {
  if (!enable) return;

  gaFn(sendName, 'event', cat, act, label, value);
  console.warn('analytics.event: ', cat, act, label, value);
}

/** includeJavascript.
 * @private
 */
function includeJavascript (gaName) {
  var existingJs = DOC.querySelector('script[ src *= google-analytics ]');

  if (!existingJs) {
     /* eslint-disable */
    (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
      (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
      m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
    })(window, document, 'script', 'https://www.google-analytics.com/analytics.js', gaName /* || 'ga' */);
     /* eslint-enable */
  }
}

},{}],6:[function(require,module,exports){

// Configure | ©Nick Freear.

var W = window;
var Date = W.Date;
var queryString = W.location.search;

module.exports.config = function (TRANSLATE_TEXTS, DATES, VERSION) {
  'use strict';

  var YEAR = new Date().getFullYear();
  var GAAD_DATE = DATES.dates[ YEAR ];
  var GAAD_NEXT = DATES.dates[ YEAR + 1 ];
  var M_LANG = queryString.match(/[?&]lang=(\w{2}(-\w{2})?)/);

  var defaults = {
    id: 'id-gaad-widget',
    script: '/gaad-widget', // Was: 'GAAD.widget.', // .js OR .min.js;
    lang: M_LANG ? M_LANG[ 1 ] : 'en',
    dir: 'ltr',
    texts: TRANSLATE_TEXTS,
    url: 'http://globalaccessibilityawarenessday.org/?utm_source=github&utm_campaign=gaad-widget',
    days_before: 10,
    days_after: 10,
    embed: false,
    style_url: '/../../style/gaad-widget.css', // Was: '/../../style/GAAD.widget.css'
    theme: 'blue', // OR: 'black'
    should_show: null,
    is_before: null,
    xreplace: GAAD_DATE,
    date: GAAD_DATE,
    date_next: GAAD_NEXT,
    // Was: datefmt: GAAD_DATE.toString('MMMM dS, yyyy'),
    today: new Date(),
    xth: YEAR - 2011,
    analytics: {
      isWidget: true,
      name: 'gaadWidget',
      id: 'UA-102188521-1'
    },
    debug: /[?&]debug=1/.test(queryString),
    force: /[?&]gaad.?widget=f(orce)?/i.test(queryString)
  };

  defaults.version = VERSION;

  return defaults;
};

},{}],7:[function(require,module,exports){

// Functions: extend, setHTML, addStylesheet.. | ©Nick Freear.

var W = window;
var D = W.document;

module.exports = {

  getConfig: function (defaults, methods) {
    var scriptEl = D.querySelector('script[ src *= "' + defaults.script + '" ]');

    var data = scriptEl.getAttribute('data-gaad-widget');
    var options = data ? JSON.parse(data) : {};

    var gaad = methods.extend(defaults, options);

    gaad.log = gaad.debug && W.console ? console.warn : function () {};

    gaad.script_url = scriptEl.src;

    return gaad;
  },

  addDays: function (dateObj, days) {
    return dateObj.ts + (days * 24 * 60 * 60 * 1000); // Milliseconds.
  },

  // JuhQ (16 July 2015): https://gist.github.com/pbojinov/8f3765b672efec122f66#gistcomment-1493930
  extend: function () {
    var extended = {};
    var key;
    var prop;

    for (key in arguments) {
      var argument = arguments[ key ];
      for (prop in argument) {
        if (Object.prototype.hasOwnProperty.call(argument, prop)) {
          extended[ prop ] = argument[ prop ];
        }
      }
    }
    return extended;
  },

  // Ben McCormick (24 March 2013), SirDerpington:
  // http://stackoverflow.com/questions/15604140/replace-multiple-strings-with-multiple-other-strings
  replaceObj: replaceObj,

  setHTML: function (gaad) {
    var elem = D.getElementById(gaad.id);

    elem.lang = gaad.lang;
    elem.dir = gaad.dir;
    elem.setAttribute('role', 'alert');
    elem.className = replaceObj('gaad-widget-js {t} {e}', { '{t}': gaad.theme, '{e}': gaad.embed ? 'embed' : 'no-embed' });
    elem.innerHTML = gaad.message;  // Was: 'gaad.join'
  },

  addStylesheet: function (gaad) {
    var styleEl = D.createElement('link');
    styleEl.rel = 'stylesheet';
    styleEl.type = 'text/css';
    styleEl.href = decideStyleUrl(gaad);

    D.head.appendChild(styleEl);
  }
};

function decideStyleUrl (CFG) {
  // Support for 'unpkg' CDN short URL.
  if (/@\d\.\d\.\d(-[\w.]+)(#|_.js|$)/.test(CFG.script_url)) {
    CFG.log('GAAD: npm @version found');
    CFG.style_url = CFG.style_url.replace('/../..', '');
    CFG.script_url = CFG.script_url.replace(/(#.*|_\.js)/, '');
  }
  return CFG.script_url + CFG.style_url;
}

function replaceObj (str, mapObj) {
  var re = new RegExp(Object.keys(mapObj).join('|'), 'g'); // Was: "gi".

  return str.replace(re, function (matched) {
    return mapObj[ matched ]; // Was: matched.toLowerCase().
  });
}

},{}],8:[function(require,module,exports){

// Main widget 'run' function | ©Nick Freear.

var W = window;

module.exports.run = function (defaults, methods) {
  'use strict';

  var gaad = methods.getConfig(defaults, methods);

  var GAAD_DATE = gaad.date;
  var GAAD_NEXT = gaad.date_next;

  gaad.show_date = methods.addDays(GAAD_DATE, -gaad.days_before); // new Date(GAAD_DATE).addDays(-gaad.days_before); // Clone.
  gaad.hide_date = methods.addDays(GAAD_DATE, gaad.days_after); // new Date(GAAD_DATE).addDays(gaad.days_after);

  // gaad.diff_days = gaad.today.toString('dd') - gaad.show_date.toString('dd');
  gaad.diff_show = gaad.today - gaad.show_date;
  gaad.diff_hide = gaad.today - gaad.hide_date;

  gaad.should_show = (gaad.diff_show >= 0 && gaad.diff_hide < 0);

  gaad.is_before = (gaad.today - gaad.date) < 0;

  if (!gaad.is_before) {
    gaad.xreplace = GAAD_NEXT;
  }

  gaad.xreplace[ '{at}' ] = methods.replaceObj(' href="{u}" target="_top"', { '{u}': gaad.url });
  gaad.xreplace[ '{x}' ] = gaad.xth;
  gaad.xreplace[ '{g}' ] = gaad.texts.en.name;

  var lang = gaad.texts[ gaad.lang ] ? gaad.lang : 'en';
  var template = gaad.is_before ? gaad.texts[ lang ].before : gaad.texts[ lang ].after;

  gaad.message = methods.replaceObj(template, gaad.xreplace);

  if (!gaad.should_show && !gaad.force) {
    return gaad.log('GAAD: no-show', gaad);
  }

  gaad.log('GAAD: show', gaad);

  runAnalytics(methods.analytics, gaad.analytics);

  methods.addStylesheet(gaad);

  methods.setHTML(gaad);

  W.console && console.log('Happy GAAD! ~ http://globalaccessibilityawarenessday.org');

  return gaad;
};

function runAnalytics (analyticsFn, config) {
  if (config) {
    analyticsFn.create(config);
    analyticsFn.pageView();

    // analyticsFn.initialize(analyticsCfg.id, { name: analyticsCfg.name, debug: gaad.debug });
    // analyticsFn.pageview();
  }
}

},{}]},{},[2])
//# sourceMappingURL=gaad-widget.js.map
