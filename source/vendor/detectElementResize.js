/**
* Detect Element Resize.
* Forked in order to guard against unsafe 'window' and 'document' references.
*
* https://github.com/sdecima/javascript-detect-element-resize
* Sebastian Decima
*
* version: 0.5.3
**/

// Check `document` and `window` in case of server-side rendering
var _window
if (typeof window !== 'undefined') {
  _window = window
} else if (typeof self !== 'undefined') {
  _window = self
} else {
  _window = this
}

var attachEvent = typeof document !== 'undefined' && document.attachEvent;
var stylesCreated = false;

if (!attachEvent) {
  var requestFrame = (function(){
    var raf = _window.requestAnimationFrame || _window.mozRequestAnimationFrame || _window.webkitRequestAnimationFrame ||
              function(fn){ return _window.setTimeout(fn, 20); };
    return function(fn){ return raf(fn); };
  })();

  var cancelFrame = (function(){
    var cancel = _window.cancelAnimationFrame || _window.mozCancelAnimationFrame || _window.webkitCancelAnimationFrame ||
                 _window.clearTimeout;
    return function(id){ return cancel(id); };
  })();

  var resetTriggers = function(element){
    var triggers = element.__resizeTriggers__,
      expand = triggers.firstElementChild,
      contract = triggers.lastElementChild,
      expandChild = expand.firstElementChild;
    contract.scrollLeft = contract.scrollWidth;
    contract.scrollTop = contract.scrollHeight;
    expandChild.style.width = expand.offsetWidth + 1 + 'px';
    expandChild.style.height = expand.offsetHeight + 1 + 'px';
    expand.scrollLeft = expand.scrollWidth;
    expand.scrollTop = expand.scrollHeight;
  };

  var checkTriggers = function(element){
    return element.offsetWidth != element.__resizeLast__.width ||
           element.offsetHeight != element.__resizeLast__.height;
  }

  var scrollListener = function(e){
    var element = this;
    resetTriggers(this);
    if (this.__resizeRAF__) cancelFrame(this.__resizeRAF__);
    this.__resizeRAF__ = requestFrame(function(){
      if (checkTriggers(element)) {
        element.__resizeLast__.width = element.offsetWidth;
        element.__resizeLast__.height = element.offsetHeight;
        element.__resizeListeners__.forEach(function(fn){
          fn.call(element, e);
        });
      }
    });
  };

  /* Detect CSS Animations support to detect element display/re-attach */
  var animation = false,
    animationstring = 'animation',
    keyframeprefix = '',
    animationstartevent = 'animationstart',
    domPrefixes = 'Webkit Moz O ms'.split(' '),
    startEvents = 'webkitAnimationStart animationstart oAnimationStart MSAnimationStart'.split(' '),
    pfx  = '';
  {
    var elm = document.createElement('fakeelement');
    if( elm.style.animationName !== undefined ) { animation = true; }

    if( animation === false ) {
      for( var i = 0; i < domPrefixes.length; i++ ) {
        if( elm.style[ domPrefixes[i] + 'AnimationName' ] !== undefined ) {
          pfx = domPrefixes[ i ];
          animationstring = pfx + 'Animation';
          keyframeprefix = '-' + pfx.toLowerCase() + '-';
          animationstartevent = startEvents[ i ];
          animation = true;
          break;
        }
      }
    }
  }

  var animationName = 'resizeanim';
  var animationKeyframes = '@' + keyframeprefix + 'keyframes ' + animationName + ' { from { opacity: 0; } to { opacity: 0; } } ';
  var animationStyle = keyframeprefix + 'animation: 1ms ' + animationName + '; ';
}

var createStyles = function() {
  if (!stylesCreated) {
    //opacity:0 works around a chrome bug https://code.google.com/p/chromium/issues/detail?id=286360
    var css = (animationKeyframes ? animationKeyframes : '') +
        '.resize-triggers { ' + (animationStyle ? animationStyle : '') + 'visibility: hidden; opacity: 0; } ' +
        '.resize-triggers, .resize-triggers > div, .contract-trigger:before { content: \" \"; display: block; position: absolute; top: 0; left: 0; height: 100%; width: 100%; overflow: hidden; } .resize-triggers > div { background: #eee; overflow: auto; } .contract-trigger:before { width: 200%; height: 200%; }',
      head = document.head || document.getElementsByTagName('head')[0],
      style = document.createElement('style');

    style.type = 'text/css';
    if (style.styleSheet) {
      style.styleSheet.cssText = css;
    } else {
      style.appendChild(document.createTextNode(css));
    }

    head.appendChild(style);
    stylesCreated = true;
  }
}

var addResizeListener = function(element, fn){
  if (attachEvent) element.attachEvent('onresize', fn);
  else {
    if (!element.__resizeTriggers__) {
      if (getComputedStyle(element).position == 'static') element.style.position = 'relative';
      createStyles();
      element.__resizeLast__ = {};
      element.__resizeListeners__ = [];
      (element.__resizeTriggers__ = document.createElement('div')).className = 'resize-triggers';
      element.__resizeTriggers__.innerHTML = '<div class="expand-trigger"><div></div></div>' +
                                          '<div class="contract-trigger"></div>';
      element.appendChild(element.__resizeTriggers__);
      resetTriggers(element);
      element.addEventListener('scroll', scrollListener, true);

      /* Listen for a css animation to detect element display/re-attach */
      animationstartevent && element.__resizeTriggers__.addEventListener(animationstartevent, function(e) {
        if(e.animationName == animationName)
          resetTriggers(element);
      });
    }
    element.__resizeListeners__.push(fn);
  }
};

var removeResizeListener = function(element, fn){
  if (attachEvent) element.detachEvent('onresize', fn);
  else {
    element.__resizeListeners__.splice(element.__resizeListeners__.indexOf(fn), 1);
    if (!element.__resizeListeners__.length) {
        element.removeEventListener('scroll', scrollListener);
        element.__resizeTriggers__ = !element.removeChild(element.__resizeTriggers__);
    }
  }
}

module.exports = {
  addResizeListener : addResizeListener,
  removeResizeListener : removeResizeListener
};
