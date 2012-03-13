/*! Xquared is copyrighted free software by Alan Kang <jania902@gmail.com>.
 *  For more information, see http://xquared.springnote.com/
 */
if(!window.xq) {
	/**
	 * @namespace Contains all variables.
	 */
	var xq = {};
}

xq.majorVersion = '0.82';
xq.minorVersion = '20090423';

/**
 * Compiles regular expression pattern if possible.
 *
 * @param {String} p Regular expression.
 * @param {String} f Flags.
 */
xq.compilePattern = function(p, f) {
	if(!RegExp.prototype.compile) return new RegExp(p, f);
	
	var r = new RegExp();
	r.compile(p, f);
	return r;
}

/**
 * @class Simple class based OOP framework
 */
xq.Class = function() {
	var parent = null, properties = xq.$A(arguments), key;
	if (typeof properties[0] === "function") {
		parent = properties.shift();
	}
	
	function klass() {
		this.initialize.apply(this, arguments);
	}
	
	if(parent) {
		for (key in parent.prototype) {
			klass.prototype[key] = parent.prototype[key];
		}
	}
	
	for (key in properties[0]) if(properties[0].hasOwnProperty(key)){
		klass.prototype[key] = properties[0][key];
	}
	
	if (!klass.prototype.initialize) {
		klass.prototype.initialize = function() {};
	}
	
	klass.prototype.constructor = klass;
	
	return klass;
};

/**
 * Registers event handler
 *
 * @param {Element} element Target element.
 * @param {String} eventName Name of event. For example "keydown".
 * @param {Function} handler Event handler.
 */
xq.observe = function(element, eventName, handler) {
	if (element.addEventListener) {
		element.addEventListener(eventName, handler, false);
	} else {
		element.attachEvent('on' + eventName, handler);
	}
	element = null;
};

/**
 * Unregisters event handler
 */
xq.stopObserving = function(element, eventName, handler) {
	if (element.removeEventListener) {
		element.removeEventListener(eventName, handler, false);
	} else {
		element.detachEvent("on" + eventName, handler);
	}
	element = null;
};

/**
 * Predefined event handler which simply cancels given event
 *
 * @param {Event} e Event to cancel.
 */
xq.cancelHandler = function(e) { xq.stopEvent(e); return false;};

/**
 * Stops event propagation.
 *
 * @param {Event} e Event to stop.
 */
xq.stopEvent = function(e, returnValue) {
      if(e.preventDefault) {
    	  e.preventDefault();
      }
      if(e.stopPropagation) {
    	  e.stopPropagation();
      }
      
      if(returnValue)
      {
		e.returnValue = returnValue;
      }
      else
      {
      	e.returnValue = false;
      }
      
      e.cancelBubble = true;
      e.stopped = true;
};

xq.isButton = function(event, code) {
     return event.which ? (event.which === code + 1) : (event.button === code);
};
xq.isLeftClick = function(event) {return xq.isButton(event, 0);};
xq.isMiddleClick = function(event) {return xq.isButton(event, 1);};
xq.isRightClick = function(event) {return xq.isButton(event, 2);};

xq.getEventPoint = function(event) {
	return {
		x: event.pageX || (event.clientX + (document.documentElement.scrollLeft || document.body.scrollLeft)),
		y: event.pageY || (event.clientY + (document.documentElement.scrollTop || document.body.scrollTop))
	};
};

xq.getCumulativeOffset = function(element, until) {
	var top = 0, left = 0;
	
	do {
		top += element.offsetTop  || 0;
		left += element.offsetLeft || 0;
		element = element.offsetParent;
	} while (element && element != until);
	
	return {top:top, left:left};
};

xq.$ = function(id) {
	return document.getElementById(id);
};

xq.isEmptyHash = function(h) {
	for(var key in h) if(h.hasOwnProperty(key)){
		return false;
	}
	return true;
};

xq.emptyFunction = function() {};

xq.$A = function(arraylike) {
	var len = arraylike.length, a = [];
	while (len--) {
		a[len] = arraylike[len];
	}
	return a;
};

xq.addClassName = function(element, className) {
	if (!xq.hasClassName(element, className)) {
		element.className += (element.className ? ' ' : '') + className;
	}
    return element;
};
xq.removeClassName = function(element, className) {
	if (xq.hasClassName(element, className)) {
		element.className = element.className.replace(new RegExp("(^|\\s+)" + className + "(\\s+|$)"), ' ').strip();
	}
    return element;
};
xq.hasClassName = function(element, className) {
	var classNames = element.className;
	return (classNames.length > 0 && (classNames === className || new RegExp("(^|\\s)" + className + "(\\s|$)").test(classNames)));
};

xq.serializeForm = function(f) {
	var options = {hash: true};
	var data = {};
	var elements = f.getElementsByTagName("*");
	for(var i = 0; i < elements.length; i++) {
		var element = elements[i];
		var tagName = element.tagName.toLowerCase();
		if(element.disabled || !element.name || ['input', 'textarea', 'option', 'select'].indexOf(tagName) === -1) {
			continue;
		}
		
		var key = element.name;
		var value = xq.getValueOfElement(element);
		
		if(value === undefined) {
			continue;
		}
		
		if(key in data) {
			if(data[key].constructor === Array) {
				data[key] = [data[key]];
			}
			data[key].push(value);
		} else {
			data[key] = value;
		}
	}
	return data;
};

xq.getValueOfElement = function(e) {
	var type = e.type.toLowerCase();
	if(type === 'checkbox' || type === 'radio') {
		return e.checked ? e.value : undefined;
	} else {
		return e.value;
	}
};

/**
 * Find elements by class name (and tag name)
 * 
 * @param {Element} element Root element
 * @param {String} className Target class name
 * @param {String} tagName Optional tag name
 */
xq.getElementsByClassName = function(element, className, tagName) {
	if(!tagName && element.getElementsByClassName) {
		return element.getElementsByClassName(className);
	}
	
	var elements = element.getElementsByTagName(tagName || "*");
	var len = elements.length;
	var result = [];
	var p = xq.compilePattern("(^|\\s)" + className + "($|\\s)", "i");
	for(var i = 0; i < len; i++) {
		var cur = elements[i];
		if(p.test(cur.className)) {
			result.push(cur);
		}
	}
	return result;
};

if(!window.Prototype) {
	if(!Function.prototype.bind) {
		Function.prototype.bind = function() {
			var m = this, arg = xq.$A(arguments), o = arg.shift();
			return function() {
				return m.apply(o, arg.concat(xq.$A(arguments)));
			};
		};
	}
	
	if(!Function.prototype.bindAsEventListener) {
		Function.prototype.bindAsEventListener = function() {
			var m = this, arg = xq.$A(arguments), o = arg.shift();
			return function(event) {
				return m.apply(o, [event || window.event].concat(arg));
			};
		};
	}
	
	Array.prototype.find = function(f) {
		for(var i = 0; i < this.length; i++) {
			if(f(this[i])) {
				return this[i];
			}
		}
	};
	
	Array.prototype.findAll = function(f) {
		var result = [];
		for(var i = 0; i < this.length; i++) {
			if(f(this[i])) {
				result.push(this[i]);
			}
		}
		return result;
	};
	
	Array.prototype.first = function() {return this[0];};
	
	Array.prototype.last = function() {return this[this.length - 1];};
	
	Array.prototype.flatten = function() {
		var result = [];
		var recursive = function(array) {
			for(var i = 0; i < array.length; i++) {
				if(array[i].constructor === Array) {
					recursive(array[i]);
				} else {
					result.push(array[i]);
				}
			}
		};
		recursive(this);
		
		return result;
	};
	
	xq.pStripTags = xq.compilePattern("</?[^>]+>", "gi");
	String.prototype.stripTags = function() {
	    return this.replace(xq.pStripTags, '');
	};
	String.prototype.escapeHTML = function() {
		xq.textNode.data = this;
		return xq.divNode.innerHTML;
	};
	String.prototype.unescapeHTML = function() {
		xq.divNode.innerHTML = this;
		return xq.divNode.childNodes[0] ? xq.divNode.childNodes[0].nodeValue : '';
	};
	
	xq.textNode = document.createTextNode('');
	xq.divNode = document.createElement('div');
	xq.divNode.appendChild(xq.textNode);
	
	xq.pStrip1 = xq.compilePattern("^\\s+");
	xq.pStrip2 = xq.compilePattern("\\s+$");
	String.prototype.strip = function() {
		return this.replace(xq.pStrip1, '').replace(xq.pStrip2, '');
	};
	
	Array.prototype.indexOf = function(n) {
		for(var i = 0; i < this.length; i++) {
			if(this[i] === n) {
				return i;
			}
		}
		
		return -1;
	};
}

Array.prototype.includeElement = function(o) {
	if (this.indexOf(o) !== -1) {
		return true;
	}

    var found = false;
    for(var i = 0; i < this.length; i++) {
    	if(this[i] === o) {
    		return true;
    	}
    }
    
    return false;
};


/**
 * Make given object as event source
 *
 * @param {Object} object target object
 * @param {String} prefix prefix for generated functions
 * @param {Array} events array of string which contains name of events
 */
xq.asEventSource = function(object, prefix, events) {
	object.autoRegisteredEventListeners = [];
	object.registerEventFirer = function(prefix, name) {
		this["_fireOn" + name] = function() {
			for(var i = 0; i < this.autoRegisteredEventListeners.length; i++) {
				var listener = this.autoRegisteredEventListeners[i];
				var func = listener["on" + prefix + name];
				if(func) {
					func.apply(listener, xq.$A(arguments));
				}
			}
		};
	};
	object.addListener = function(l) {
		this.autoRegisteredEventListeners.push(l);
	};
	
	for(var i = 0; i < events.length; i++) {
		object.registerEventFirer(prefix, events[i]);
	}
};



/**
 * JSON to Element mapper
 */
xq.json2element = function(json, doc) {
	var div = doc.createElement("DIV");
	div.innerHTML = xq.json2html(json);
	return div.firstChild || {};
};

/**
 * Element to JSON mapper
 */
xq.element2json = function(element) {
	var o, i, childElements;
	
	if(element.nodeName === 'DL') {
		o = {};
		childElements = xq.findChildElements(element);
		for(i = 0; i < childElements.length; i++) {
			var dt = childElements[i];
			var dd = childElements[++i];
			o[dt.innerHTML] = xq.element2json(xq.findChildElements(dd)[0]);
		}
		return o;
	} else if (element.nodeName === 'OL') {
		o = [];
		childElements = xq.findChildElements(element);
		for(i = 0; i < childElements.length; i++) {
			var li = childElements[i];
			o[i] = xq.element2json(xq.findChildElements(li)[0]);
		}
	} else if(element.nodeName === 'SPAN' && element.className === 'number') {
		return parseFloat(element.innerHTML);
	} else if(element.nodeName === 'SPAN' && element.className === 'string') {
		return element.innerHTML;
	} else { // ignore textnode or unknown tag
		return null;
	}
};

/**
 * JSON to HTML string mapper
 */
xq.json2html = function(json) {
	var sb = [];
	xq._json2html(json, sb);
	return sb.join('');
};

xq._json2html = function(o, sb) {
	if(typeof o === 'number') {
		sb.push('<span class="number">' + o + '</span>');
	} else if(typeof o === 'string') {
		sb.push('<span class="string">' + o.escapeHTML() + '</span>');
	} else if(o.constructor === Array) {
		sb.push('<ol>');
		for(var i = 0; i < o.length; i++) {
			sb.push('<li>');
			xq._json2html(o[i], sb);
			sb.push('</li>');
		}
		sb.push('</ol>');
	} else { // Object
		sb.push('<dl>');
		for (var key in o) if (o.hasOwnProperty(key)) {
			sb.push('<dt>' + key + '</dt>');
			sb.push('<dd>');
			xq._json2html(o[key], sb);
			sb.push('</dd>');
		}
		sb.push('</dl>');
	}
};

xq.findChildElements = function(parent) {
	var childNodes = parent.childNodes;
	var elements = [];
	for(var i = 0; i < childNodes.length; i++) {
		if(childNodes[i].nodeType === 1) {
			elements.push(childNodes[i]);
		}
	}
	return elements;
};



Date.preset = null;
Date.pass = function(msec) {
	if(Date.preset !== null) {
		Date.preset = new Date(Date.preset.getTime() + msec);
	}
};
Date.get = function() {
	return Date.preset === null ? new Date() : Date.preset;
};
Date.prototype.elapsed = function(msec, curDate) {
	return (curDate || Date.get()).getTime() - this.getTime() >= msec;
};

String.prototype.merge = function(data) {
	var newString = this;
	for(var k in data) if(data.hasOwnProperty(k)) {
		newString = newString.replace("{" + k + "}", data[k]);
	}
	return newString;
};
xq.pBlank = xq.compilePattern("^\\s*$");
String.prototype.isBlank = function() {
	return xq.pBlank.test(this);
};
xq.pURL = xq.compilePattern("((((\\w+)://(((([^@:]+)(:([^@]+))?)@)?([^:/\\?#]+)?(:(\\d+))?))?([^\\?#]+)?)(\\?([^#]+))?)(#(.+))?");
String.prototype.parseURL = function() {
	var m = this.match(xq.pURL);
	
	var includeAnchor = m[0];
	var includeQuery = m[1] || undefined;
	var includePath = m[2] || undefined;
	var includeHost = m[3] || undefined;
	var includeBase = null;
	var protocol = m[4] || undefined;
	var user = m[8] || undefined;
	var password = m[10] || undefined;
	var domain = m[11] || undefined;
	var port = m[13] || undefined;
	var path = m[14] || undefined;
	var query = m[16] || undefined;
	var anchor = m[18] || undefined;
	
	if(!path || path === '/') {
		includeBase = includeHost + '/';
	} else {
		var index = path.lastIndexOf('/');
		includeBase = includeHost + path.substring(0, index + 1);
	}
	
	return {
		includeAnchor: includeAnchor,
		includeQuery: includeQuery,
		includePath: includePath,
		includeBase: includeBase,
		includeHost: includeHost,
		protocol: protocol,
		user: user,
		password: password,
		domain: domain,
		port: port,
		path: path,
		query: query,
		anchor: anchor
	};
};



xq.commonAttrs = ['title', 'class', 'id', 'style'];

/**
 * Pre-defined whitelist
 */
xq.predefinedWhitelist = { 
   'a':				xq.commonAttrs.concat('href', 'charset', 'rev', 'rel', 'type', 'hreflang', 'tabindex'),
   'abbr':			xq.commonAttrs.concat(),
   'acronym':		xq.commonAttrs.concat(),
   'address':		xq.commonAttrs.concat(),
   'blockquote':	xq.commonAttrs.concat('cite'),
   'br':			xq.commonAttrs.concat(),
   'button':		xq.commonAttrs.concat('disabled', 'type', 'name', 'value'),
   'caption':		xq.commonAttrs.concat(),
   'cite':			xq.commonAttrs.concat(),
   'code':			xq.commonAttrs.concat(),
   'dd':			xq.commonAttrs.concat(),
   'dfn':			xq.commonAttrs.concat(),
   'div':			xq.commonAttrs.concat(),
   'dl':			xq.commonAttrs.concat(),
   'dt':			xq.commonAttrs.concat(),
   'em':			xq.commonAttrs.concat(),
   'embed':			xq.commonAttrs.concat('src', 'width', 'height', 'allowscriptaccess', 'type', 'allowfullscreen', 'bgcolor'),
   'h1':			xq.commonAttrs.concat(),
   'h2':			xq.commonAttrs.concat(),
   'h3':			xq.commonAttrs.concat(),
   'h4':			xq.commonAttrs.concat(),
   'h5':			xq.commonAttrs.concat(),
   'h6':			xq.commonAttrs.concat(),
   'hr':			xq.commonAttrs.concat(),
   'iframe':		xq.commonAttrs.concat('name', 'src', 'frameborder', 'scrolling', 'width', 'height', 'longdesc'),
   'input':			xq.commonAttrs.concat('type', 'name', 'value', 'size', 'checked', 'readonly', 'src', 'maxlength'),
   'img':			xq.commonAttrs.concat('alt', 'width', 'height', 'src', 'longdesc'),
   'label':			xq.commonAttrs.concat('for'),
   'kbd':			xq.commonAttrs.concat(),
   'li':			xq.commonAttrs.concat(),
   'object':		xq.commonAttrs.concat('align', 'classid', 'codetype', 'archive', 'width', 'type', 'codebase', 'height', 'data', 'name', 'standby', 'declare'),
   'ol':			xq.commonAttrs.concat(),
   'option':		xq.commonAttrs.concat('disabled', 'selected', 'label', 'value'),
   'p':				xq.commonAttrs.concat(),
   'param':			xq.commonAttrs.concat('name', 'value', 'valuetype', 'type'),
   'pre':			xq.commonAttrs.concat(),
   'q':				xq.commonAttrs.concat('cite'),
   'samp':			xq.commonAttrs.concat(),
   'script':		xq.commonAttrs.concat('src', 'type'),
   'select':		xq.commonAttrs.concat('disabled', 'size', 'multiple', 'name'),
   'span':			xq.commonAttrs.concat(),
   'sup':			xq.commonAttrs.concat(),
   'sub':			xq.commonAttrs.concat(),
   'strong':		xq.commonAttrs.concat(),
   'table':			xq.commonAttrs.concat('summary', 'width'),
   'thead':			xq.commonAttrs.concat(),
   'textarea':		xq.commonAttrs.concat('cols', 'disabled', 'rows', 'readonly', 'name'),
   'tbody':			xq.commonAttrs.concat(),
   'th':			xq.commonAttrs.concat('colspan', 'rowspan'),
   'td':			xq.commonAttrs.concat('colspan', 'rowspan'),
   'tr':			xq.commonAttrs.concat(),
   'tt':			xq.commonAttrs.concat(),
   'ul':			xq.commonAttrs.concat(),
   'var':			xq.commonAttrs.concat()
};



/**
 * Automatic finalization queue
 */
xq.autoFinalizeQueue = [];

/**
 * Automatic finalizer
 */
xq.addToFinalizeQueue = function(obj) {
	xq.autoFinalizeQueue.push(obj);
};

/**
 * Finalizes given object
 */
xq.finalize = function(obj) {
	if(typeof obj.finalize === "function") {
		try {obj.finalize();} catch(ignored) {}
	}
	
	for(var key in obj) if(obj.hasOwnProperty(key)) {
		obj[key] = null;
	}
};

xq.observe(window, "unload", function() {

	// "xq" and "xq.autoFinalizeQueue" could be removed by another libraries' clean-up mechanism.
	if(xq && xq.autoFinalizeQueue) {
		for(var i = 0; i < xq.autoFinalizeQueue.length; i++) {
			xq.finalize(xq.autoFinalizeQueue[i]);
		}
		xq = null;
	}
});


/**
 * Finds Xquared's <script> element
 */
xq.findXquaredScript = function() {
    return xq.$A(document.getElementsByTagName("script")).find(function(script) {
    	return script.src && script.src.match(/xquared\.js/i);
    });
};
xq.shouldLoadOthers = function() {
	var script = xq.findXquaredScript();
    return script && !!script.src.match(/xquared\.js\?load_others=1/i);
};
/**
 * Loads javascript from given URL
 */
xq.loadScript = function(url) {
    document.write('<script type="text/javascript" src="' + url + '"></script>');
};

/**
 * Returns all Xquared script file names
 */
xq.getXquaredScriptFileNames = function() {
	return [
		'Xquared.js',
		'Browser.js',
		'DomTree.js',
		'rdom/Base.js',
		'rdom/W3.js',
		'rdom/Gecko.js',
		'rdom/Webkit.js',
		'rdom/Trident.js',
		'rdom/Factory.js',
		'validator/Base.js',
		'validator/W3.js',
		'validator/Gecko.js',
		'validator/Webkit.js',
		'validator/Trident.js',
		'validator/Factory.js',
		'macro/Base.js',
		'macro/Factory.js',
		'macro/FlashMovieMacro.js',
		'macro/IFrameMacro.js',
		'macro/JavascriptMacro.js',
		'EditHistory.js',
		'plugin/Base.js',
		'RichTable.js',
		'Timer.js',
		'Layer.js',
		'ui/Base.js',
		'ui/Control.js',
		'ui/Toolbar.js',
		'ui/_templates.js',
		'Json2.js',
		'Shortcut.js',
		'Editor.js',
		'Messages.js'
	];
};
xq.getXquaredScriptBasePath = function() {
	var script = xq.findXquaredScript();
	return script.src.match(/(.*\/)xquared\.js.*/i)[1];
};

xq.loadOthers = function() {
	var basePath = xq.getXquaredScriptBasePath();
	var others = xq.getXquaredScriptFileNames();
	
	// Xquared.js(this file) should not be loaded again. So the value of "i" starts with 1 instead of 0
	for(var i = 1; i < others.length; i++) {
		xq.loadScript(basePath + others[i]);
	}
};

if(xq.shouldLoadOthers()) {
	xq.loadOthers();
}
/**
 * @namespace Contains browser detection codes
 * 
 * @requires XQuared.js
 */
xq.Browser = new function() {
	
	this.language = (navigator.appName == 'Netscape') ? navigator.language : navigator.browserLanguage;
	
	// By Rendering Engines
	
	/** 
	 * True if rendering engine is Trident
	 * @type boolean
	 */
	this.isTrident = navigator.appName === "Microsoft Internet Explorer",
	
	/**
	 * True if rendering engine is Webkit
	 * @type boolean
	 */
	this.isWebkit = navigator.userAgent.indexOf('AppleWebKit/') > -1,
	
	/**
	 * True if rendering engine is Gecko
	 * @type boolean
	 */
	this.isGecko = navigator.userAgent.indexOf('Gecko') > -1 && navigator.userAgent.indexOf('KHTML') === -1,
	
	/**
	 * True if rendering engine is KHTML
	 * @type boolean
	 */
	this.isKHTML = navigator.userAgent.indexOf('KHTML') !== -1,
	
	/**
	 * True if rendering engine is Presto
	 * @type boolean
	 */
	this.isPresto = navigator.appName === "Opera",
	
	
	
	// By Platforms
	/**
	 * True if platform is Mac
	 * @type boolean
	 */
	this.isMac = navigator.userAgent.indexOf("Macintosh") !== -1,
	
	/**
	 * True if platform is Ubuntu Linux
	 * @type boolean
	 */
	this.isUbuntu = navigator.userAgent.indexOf('Ubuntu') !== -1,
	
	/**
	 * True if platform is Windows
	 * @type boolean
	 */
	this.isWin = navigator.userAgent.indexOf('Windows') !== -1,



	// By Browsers
	/**
	 * True if browser is Internet Explorer
	 * @type boolean
	 */
	this.isIE = navigator.appName === "Microsoft Internet Explorer",
	
	/**
	 * True if browser is Internet Explorer 6
	 * @type boolean
	 */
	this.isIE6 = navigator.userAgent.indexOf('MSIE 6') !== -1,
	
	/**
	 * True if browser is Internet Explorer 7
	 * @type boolean
	 */
	this.isIE7 = navigator.userAgent.indexOf('MSIE 7') !== -1,
	
	/**
	 * True if browser is Internet Explorer 8
	 * @type boolean
	 */
	this.isIE8 = navigator.userAgent.indexOf('MSIE 8') !== -1,
	
	/**
	 * True if browser is Firefox
	 * @type boolean
	 */
	this.isFF = navigator.userAgent.indexOf('Firefox') !== -1,
	
	/**
	 * True if browser is Firefox 2
	 * @type boolean
	 */
	this.isFF2 = navigator.userAgent.indexOf('Firefox/2') !== -1,
	
	/**
	 * True if browser is Firefox 3
	 * @type boolean
	 */
	this.isFF3 = navigator.userAgent.indexOf('Firefox/3') !== -1,
	
	/**
	 * True if browser is Safari
	 * @type boolean
	 */
	this.isSafari = navigator.userAgent.indexOf('Safari') !== -1
};
/**
 * @requires XQuared.js
 */
xq.Timer = xq.Class(/** @lends xq.Timer.prototype */{
	/**
     * @constructs
     * 
     * @param {Number} precision precision in milliseconds
	 */
	initialize: function(precision) {
		xq.addToFinalizeQueue(this);
	
		this.precision = precision;
		this.jobs = {};
		this.nextJobId = 0;
		
		this.checker = null;
	},
	
	finalize: function() {
		this.stop();
	},
	
	/**
	 * starts timer
	 */
	start: function() {
		this.stop();
		
		this.checker = window.setInterval(function() {
			this.executeJobs();
		}.bind(this), this.precision);
	},
	
	/**
	 * stops timer
	 */
	stop: function() {
		if(this.checker) window.clearInterval(this.checker);
	},
	
	/**
	 * registers new job
	 * 
	 * @param {Function} job function to execute
	 * @param {Number} interval interval in milliseconds
	 * 
	 * @return {Number} job id
	 */
	register: function(job, interval) {
		var jobId = this.nextJobId++;
		
		this.jobs[jobId] = {
			func:job,
			interval: interval,
			lastExecution: Date.get()
		};
		
		return jobId;
	},
	
	/**
	 * unregister job by job id
	 * 
	 * @param {Number} job id
	 */
	unregister: function(jobId) {
		delete this.jobs[jobId];
	},
	
	/**
	 * Execute all expired jobs immedialty. This method will be called automatically by interval timer.
	 */
	executeJobs: function() {
		var curDate = new Date();
		
		for(var id in this.jobs) {
			var job = this.jobs[id];
			if(job.lastExecution.elapsed(job.interval, curDate)) {
				try {
					job.lastReturn = job.func();
				} catch(e) {
					job.lastException = e;
				} finally {
					job.lastExecution = curDate;
				}
			}
		}
	}
});
/**
 * @requires XQuared.js
 */
xq.DomTree = xq.Class(/** @lends xq.DomTree.prototype */{
	/**
	 * Provides various tree operations.
	 *
	 * TODO: Add specs
	 *
	 * @constructs
	 */
	initialize: function() {
		xq.addToFinalizeQueue(this);
		
		this._blockTags = ["DIV", "DD", "LI", "ADDRESS", "CAPTION", "DT", "H1", "H2", "H3", "H4", "H5", "H6", "HR", "P", "BODY", "BLOCKQUOTE", "PRE", "PARAM", "DL", "OL", "UL", "TABLE", "THEAD", "TBODY", "TR", "TH", "TD"];
		this._blockContainerTags = ["DIV", "DD", "LI", "BODY", "BLOCKQUOTE", "UL", "OL", "DL", "TABLE", "THEAD", "TBODY", "TR", "TH", "TD"];
		this._listContainerTags = ["OL", "UL", "DL"];
		this._tableCellTags = ["TH", "TD"];
		this._blockOnlyContainerTags = ["BODY", "BLOCKQUOTE", "UL", "OL", "DL", "TABLE", "THEAD", "TBODY", "TR"];
		this._atomicTags = ["IMG", "OBJECT", "PARAM", "BR", "HR"];
	},
	
	getBlockTags: function() {
		return this._blockTags;
	},
	
	/**
	 * Find common ancestor(parent) and his immediate children(left and right).<br />
	 *<br />
	 * A --- B -+- C -+- D -+- E<br />
	 *          |<br />
	 *          +- F -+- G<br />
	 *<br />
	 * For example:<br />
	 * > findCommonAncestorAndImmediateChildrenOf("E", "G")<br />
	 *<br />
	 * will return<br />
	 *<br />
	 * > {parent:"B", left:"C", right:"F"}
	 */
	findCommonAncestorAndImmediateChildrenOf: function(left, right) {
		if(left.parentNode === right.parentNode) {
			return {
				left:left,
				right:right,
				parent:left.parentNode
			};
		} else {
			var parentsOfLeft = this.collectParentsOf(left, true);
			var parentsOfRight = this.collectParentsOf(right, true);
			var ca = this.getCommonAncestor(parentsOfLeft, parentsOfRight);
	
			var leftAncestor = parentsOfLeft.find(function(node) {return node.parentNode === ca});
			var rightAncestor = parentsOfRight.find(function(node) {return node.parentNode === ca});
			
			return {
				left:leftAncestor,
				right:rightAncestor,
				parent:ca
			};
		}
	},
	
	/**
	 * Find leaves at edge.<br />
	 *<br />
	 * A --- B -+- C -+- D -+- E<br />
	 *          |<br />
	 *          +- F -+- G<br />
	 *<br />
	 * For example:<br />
	 * > getLeavesAtEdge("A")<br />
	 *<br />
	 * will return<br />
	 *<br />
	 * > ["E", "G"]
	 */
	getLeavesAtEdge: function(element) {
		if(!element.hasChildNodes()) return [null, null];
		
		var findLeft = function(el) {
			for (var i = 0; i < el.childNodes.length; i++) {
				if (el.childNodes[i].nodeType === 1 && this.isBlock(el.childNodes[i])) return findLeft(el.childNodes[i]);
			}
			return el;
		}.bind(this);
		
		var findRight=function(el) {
			for (var i = el.childNodes.length; i--;) {
				if (el.childNodes[i].nodeType === 1 && this.isBlock(el.childNodes[i])) return findRight(el.childNodes[i]);
			}
			return el;
		}.bind(this);
		
		var left = findLeft(element);
		var right = findRight(element);
		
		return [left === element ? null : left, right === element ? null : right];
	},
	
	getCommonAncestor: function(parents1, parents2) {
		for(var i = 0; i < parents1.length; i++) {
			for(var j = 0; j < parents2.length; j++) {
				if(parents1[i] === parents2[j]) return parents1[i];
			}
		}
	},
	
	collectParentsOf: function(node, includeSelf, exitCondition) {
		var parents = [];
		if(includeSelf) parents.push(node);
		
		while((node = node.parentNode) && (node.nodeName !== "HTML") && !(typeof exitCondition === "function" && exitCondition(node))) parents.push(node);
		return parents;
	},
	
	isDescendantOf: function(parent, child) {
		if(parent.length > 0) {
			for(var i = 0; i < parent.length; i++) {
				if(this.isDescendantOf(parent[i], child)) return true;
			}
			return false;
		}
		
		if(parent === child) return false;
		
	    while (child = child.parentNode)
	      if (child === parent) return true;
	    return false;
	},
	
	/**
	 * Perform tree walking (foreward)
	 */
	walkForward: function(node) {
		var target = node.firstChild;
		if(target) return target;
		
		// intentional assignment for micro performance turing
		if(target = node.nextSibling) return target;
		
		while(node = node.parentNode) {
			// intentional assignment for micro performance turing
			if(target = node.nextSibling) return target;
		}
		
		return null;
	},
	
	/**
	 * Perform tree walking (backward)
	 */
	walkBackward: function(node) {
		if(node.previousSibling) {
			node = node.previousSibling;
			while(node.hasChildNodes()) {node = node.lastChild;}
			return node;
		}
		
		return node.parentNode;
	},
	
	/**
	 * Perform tree walking (to next siblings)
	 */
	walkNext: function(node) {return node.nextSibling},
	
	/**
	 * Perform tree walking (to next siblings)
	 */
	walkPrev: function(node) {return node.previousSibling},
	
	/**
	 * Returns true if target is followed by start
	 */
	checkTargetForward: function(start, target) {
		return this._check(start, this.walkForward, target);
	},

	/**
	 * Returns true if start is followed by target
	 */
	checkTargetBackward: function(start, target) {
		return this._check(start, this.walkBackward, target);
	},
	
	findForward: function(start, condition, exitCondition) {
		return this._find(start, this.walkForward, condition, exitCondition);
	},
	
	findBackward: function(start, condition, exitCondition) {
		return this._find(start, this.walkBackward, condition, exitCondition);
	},
	
	_check: function(start, direction, target) {
		if(start === target) return false;
		
		while(start = direction(start)) {
			if(start === target) return true;
		}
		return false;
	},
	
	_find: function(start, direction, condition, exitCondition) {
		while(start = direction(start)) {
			if(exitCondition && exitCondition(start)) return null;
			if(condition(start)) return start;
		}
		return null;
	},

	/**
	 * Walks Forward through DOM tree from start to end, and collects all nodes that matches with a filter.
	 * If no filter provided, it just collects all nodes.
	 *
	 * @param {Element} start Starting element.
	 * @param {Element} end Ending element.
	 * @param {Function} filter A filter function.
	 */
	collectNodesBetween: function(start, end, filter) {
		if(start === end) return [start, end].findAll(filter || function() {return true});
		
		var nodes = this.collectForward(start, function(node) {return node === end}, filter);
		if(
			start !== end &&
			typeof filter === "function" &&
			filter(end)
		) nodes.push(end);
		
		return nodes;
	},

	collectForward: function(start, exitCondition, filter) {
		return this.collect(start, this.walkForward, exitCondition, filter);
	},
	
	collectBackward: function(start, exitCondition, filter) {
		return this.collect(start, this.walkBackward, exitCondition, filter);
	},
	
	collectNext: function(start, exitCondition, filter) {
		return this.collect(start, this.walkNext, exitCondition, filter);
	},
	
	collectPrev: function(start, exitCondition, filter) {
		return this.collect(start, this.walkPrev, exitCondition, filter);
	},
	
	collect: function(start, next, exitCondition, filter) {
		var nodes = [start];

		while(true) {
			start = next(start);
			if(
				(start === null) ||
				(typeof exitCondition === "function" && exitCondition(start))
			) break;
			
			nodes.push(start);
		}

		return (typeof filter === "function") ? nodes.findAll(filter) : nodes;
	},

	hasBlocks: function(element) {
		var nodes = element.childNodes;
		for(var i = 0; i < nodes.length; i++) {
			if(this.isBlock(nodes[i])) return true;
		}
		return false;
	},
	
	hasMixedContents: function(element) {
		if(!this.isBlock(element)) return false;
		if(!this.isBlockContainer(element)) return false;
		
		var hasTextOrInline = false;
		var hasBlock = false;
		for(var i = 0; i < element.childNodes.length; i++) {
			var node = element.childNodes[i];
			if(!hasTextOrInline && this.isTextOrInlineNode(node)) hasTextOrInline = true;
			if(!hasBlock && this.isBlock(node)) hasBlock = true;
			
			if(hasTextOrInline && hasBlock) break;
		}
		if(!hasTextOrInline || !hasBlock) return false;
		
		return true;
	},
	
	isBlockOnlyContainer: function(element) {
		if(!element) return false;
		return this._blockOnlyContainerTags.indexOf(typeof element === 'string' ? element : element.nodeName) !== -1;
	},
	
	isTableCell: function(element) {
		if(!element) return false;
		return this._tableCellTags.indexOf(typeof element === 'string' ? element : element.nodeName) !== -1;
	},
	
	isBlockContainer: function(element) {
		if(!element) return false;
		return this._blockContainerTags.indexOf(typeof element === 'string' ? element : element.nodeName) !== -1;
	},
	
	isHeading: function(element) {
		if(!element) return false;
		return (typeof element === 'string' ? element : element.nodeName).match(/H\d/);
	},
	
	isBlock: function(element) {
		if(!element) return false;
		return this._blockTags.indexOf(typeof element === 'string' ? element : element.nodeName) !== -1;
	},
	
	isAtomic: function(element) {
		if(!element) return false;
		return this._atomicTags.indexOf(typeof element === 'string' ? element : element.nodeName) !== -1;
	},
	
	isListContainer: function(element) {
		if(!element) return false;
		return this._listContainerTags.indexOf(typeof element === 'string' ? element : element.nodeName) !== -1;
	},
	
	isTextOrInlineNode: function(node) {
		return node && (node.nodeType === 3 || !this.isBlock(node));
	}
});
/**
 * @namespace
 */
xq.rdom = {}

/**
 * @requires XQuared.js
 * @requires DomTree.js
 */
xq.rdom.Base = xq.Class(/** @lends xq.rdom.Base.prototype */{
	/**
	 * Encapsulates browser incompatibility problem and provides rich set of DOM manipulation API.<br />
	 * <br />
	 * Base provides basic CRUD + Advanced DOM manipulation API, various query methods and caret/selection management API.	 
	 *
     * @constructs
	 */
	initialize: function() {
		xq.addToFinalizeQueue(this);

		/**
		 * Instance of DomTree
		 * @type xq.DomTree
		 */
		this.tree = new xq.DomTree();
		this.focused = false;
		this._lastMarkerId = 0;
	},
	
	
	
	/**
	 * Initialize Base instance using window object.
	 * Reads document and body from window object and sets them as a property
	 * 
	 * @param {Window} win Browser's window object
	 */
	setWin: function(win) {
		if(!win) throw "[win] is null";
		this.win = win;
	},
	
	/**
	 * Initialize Base instance using root element.
	 * Reads window and document from root element and sets them as a property.
	 * 
	 * @param {Element} root Root element
	 */
	setRoot: function(root) {
		if(!root) throw "[root] is null";
		this.root = root;
	},
	
	/**
	 * @returns Browser's window object.
	 */
	getWin: function() {
		return this.win ||
			(this.root ? (this.root.ownerDocument.defaultView || this.root.ownerDocument.parentWindow) : window);
	},
	
	/**
	 * @returns Root element.
	 */
	getRoot: function() {
		return this.root || this.win.document.body;
	},
	
	/**
	 * @returns Document object of root element.
	 */
	getDoc: function() {
		return this.getWin().document || this.getRoot().ownerDocument;
	},
	
	
	
	/////////////////////////////////////////////
	// CRUDs
	
	clearRoot: function() {
		this.getRoot().innerHTML = "";
		this.getRoot().appendChild(this.makeEmptyParagraph());
	},
	
	/**
	 * Removes place holders and empty text nodes of given element.
	 *
	 * @param {Element} element target element
	 */
	removePlaceHoldersAndEmptyNodes: function(element) {
		if(!element.hasChildNodes()) return;
		
		var stopAt = this.getBottommostLastChild(element);
		if(!stopAt) return;
		stopAt = this.tree.walkForward(stopAt);
		
		while(element && element !== stopAt) {
			if(
					this.isPlaceHolder(element) ||
					(element.nodeType === 3 && (element.nodeValue === "" || (!element.nextSibling && element.nodeValue.isBlank())))
			) {
				var deleteTarget = element;
				element = this.tree.walkForward(element);
				this.deleteNode(deleteTarget);
			} else {
				element = this.tree.walkForward(element);
			}
		}
	},
	
	/**
	 * Sets multiple attributes into element at once
	 *
	 * @param {Element} element target element
	 * @param {Object} map key-value pairs
	 */
	setAttributes: function(element, map) {
		for(var key in map) element.setAttribute(key, map[key]);
	},

	/**
	 * Creates textnode by given node value.
	 *
	 * @param {String} value value of textnode
	 * @returns {Node} Created text node
	 */	
	createTextNode: function(value) {return this.getDoc().createTextNode(value);},

	/**
	 * Creates empty element by given tag name.
	 *
	 * @param {String} tagName name of tag
	 * @returns {Element} Created element
	 */	
	createElement: function(tagName) {return this.getDoc().createElement(tagName);},

	/**
	 * Creates element from HTML string
	 * 
	 * @param {String} html HTML string
	 * @returns {Element} Created element
	 */
	createElementFromHtml: function(html) {
		var node = this.createElement("div");
		node.innerHTML = html;
		if(node.childNodes.length !== 1) {
			throw "Illegal HTML fragment";
		}
		return this.getFirstChild(node);
	},
	
	/**
	 * Deletes node from DOM tree.
	 *
	 * @param {Node} node Target node which should be deleted
	 * @param {boolean} deleteEmptyParentsRecursively Recursively delete empty parent elements
	 * @param {boolean} correctEmptyParent Call #correctEmptyElement on empty parent element after deletion
	 */	
	deleteNode: function(node, deleteEmptyParentsRecursively, correctEmptyParent) {
		if(!node || !node.parentNode) return;
		if(node.nodeName === "BODY") throw "Cannot delete BODY";
		
		var parent = node.parentNode;
		parent.removeChild(node);
		
		if(deleteEmptyParentsRecursively) {
			while(!parent.hasChildNodes()) {
				node = parent;
				parent = node.parentNode;
				if(!parent || this.getRoot() === node) break;
				parent.removeChild(node);
			}
		}
		
		if(correctEmptyParent && this.isEmptyBlock(parent)) {
			parent.innerHTML = "";
			this.correctEmptyElement(parent);
		}
	},

	/**
	 * Inserts given node into current caret position
	 *
	 * @param {Node} node Target node
	 * @returns {Node} Inserted node. It could be different with given node.
	 */
	insertNode: function(node) {throw "Not implemented"},

	/**
	 * Inserts given html into current caret position
	 *
	 * @param {String} html HTML string
	 * @returns {Node} Inserted node. It could be different with given node.
	 */
	insertHtml: function(html) {
		return this.insertNode(this.createElementFromHtml(html));
	},
	
	/**
	 * Creates textnode from given text and inserts it into current caret position
	 *
	 * @param {String} text Value of textnode
	 * @returns {Node} Inserted node
	 */
	insertText: function(text) {
		this.insertNode(this.createTextNode(text));
	},
	
	/**
	 * Places given node nearby target.
	 *
	 * @param {Node} node Node to be inserted.
	 * @param {Node} target Target node.
	 * @param {String} where Possible values: "before", "start", "end", "after"
	 * @param {boolean} performValidation Validate node if needed. For example when P placed into UL, its tag name automatically replaced with LI
	 *
	 * @returns {Node} Inserted node. It could be different with given node.
	 */
	insertNodeAt: function(node, target, where, performValidation) {
		if(
			["HTML", "HEAD"].indexOf(target.nodeName) !== -1 ||
			"BODY" === target.nodeName && ["before", "after"].indexOf(where) !== -1
		) throw "Illegal argument. Cannot move node[" + node.nodeName + "] to '" + where + "' of target[" + target.nodeName + "]"
		
		var object;
		var message;
		var secondParam;
		
		switch(where.toLowerCase()) {
			case "before":
				object = target.parentNode;
				message = 'insertBefore';
				secondParam = target;
				break
			case "start":
				if(target.firstChild) {
					object = target;
					message = 'insertBefore';
					secondParam = target.firstChild;
				} else {
					object = target;
					message = 'appendChild';
				}
				break
			case "end":
				object = target;
				message = 'appendChild';
				break
			case "after":
				if(target.nextSibling) {
					object = target.parentNode;
					message = 'insertBefore';
					secondParam = target.nextSibling;
				} else {
					object = target.parentNode;
					message = 'appendChild';
				}
				break
		}

		if(performValidation && this.tree.isListContainer(object) && node.nodeName !== "LI") {
			var li = this.createElement("LI");
			li.appendChild(node);
			node = li;
			object[message](node, secondParam);		
		} else if(performValidation && !this.tree.isListContainer(object) && node.nodeName === "LI") {
			this.wrapAllInlineOrTextNodesAs("P", node, true);
			var div = this.createElement("DIV");
			this.moveChildNodes(node, div);
			this.deleteNode(node);
			object[message](div, secondParam);
			node = this.unwrapElement(div, true);
		} else {
			object[message](node, secondParam);
		}
		
		return node;
	},

	/**
	 * Creates textnode from given text and places given node nearby target.
	 *
	 * @param {String} text Text to be inserted.
	 * @param {Node} target Target node.
	 * @param {String} where Possible values: "before", "start", "end", "after"
	 *
	 * @returns {Node} Inserted node.
	 */
	insertTextAt: function(text, target, where) {
		return this.insertNodeAt(this.createTextNode(text), target, where);
	},

	/**
	 * Creates element from given HTML string and places given it nearby target.
	 *
	 * @param {String} html HTML to be inserted.
	 * @param {Node} target Target node.
	 * @param {String} where Possible values: "before", "start", "end", "after"
	 *
	 * @returns {Node} Inserted node.
	 */
	insertHtmlAt: function(html, target, where) {
		return this.insertNodeAt(this.createElementFromHtml(html), target, where);
	},

	/**
	 * Replaces element's tag by removing current element and creating new element by given tag name.
	 *
	 * @param {String} tag New tag name
	 * @param {Element} element Target element
	 *
	 * @returns {Element} Replaced element
	 */	
	replaceTag: function(tag, element) {
		if(element.nodeName === tag) return null;
		if(this.tree.isTableCell(element)) return null;
		
		var newElement = this.createElement(tag);
		this.moveChildNodes(element, newElement);
		this.copyAttributes(element, newElement, true);
		element.parentNode.replaceChild(newElement, element);
		
		if(!newElement.hasChildNodes()) this.correctEmptyElement(newElement);
		
		return newElement;
	},

	/**
	 * Unwraps unnecessary paragraph.
	 *
	 * Unnecessary paragraph is P which is the only child of given container element.
	 * For example, P which is contained by LI and is the only child is the unnecessary paragraph.
	 * But if given container element is a block-only-container(BLOCKQUOTE, BODY), this method does nothing.
	 *
	 * @param {Element} element Container element
	 * @returns {boolean} True if unwrap performed.
	 */
	unwrapUnnecessaryParagraph: function(element) {
		if(!element) return false;
		
		if(!this.tree.isBlockOnlyContainer(element) && element.childNodes.length === 1 && element.firstChild.nodeName === "P" && !this.hasImportantAttributes(element.firstChild)) {
			var p = element.firstChild;
			this.moveChildNodes(p, element);
			this.deleteNode(p);
			return true;
		}
		return false;
	},
	
	/**
	 * Unwraps element by extracting all children out and removing the element.
	 *
	 * @param {Element} element Target element
	 * @param {boolean} wrapInlineAndTextNodes Wrap all inline and text nodes with P before unwrap
	 * @returns {Node} First child of unwrapped element
	 */
	unwrapElement: function(element, wrapInlineAndTextNodes) {
		if(wrapInlineAndTextNodes) this.wrapAllInlineOrTextNodesAs("P", element);
		
		var nodeToReturn = element.firstChild;
		
		while(element.firstChild) this.insertNodeAt(element.firstChild, element, "before");
		this.deleteNode(element);
		
		return nodeToReturn;
	},
	
	/**
	 * Wraps element by given tag
	 *
	 * @param {String} tag tag name
	 * @param {Element} element target element to wrap
	 * @returns {Element} wrapper
	 */
	wrapElement: function(tag, element) {
		var wrapper = this.insertNodeAt(this.createElement(tag), element, "before");
		wrapper.appendChild(element);
		return wrapper;
	},
	
	/**
	 * Tests #smartWrap with given criteria but doesn't change anything
	 */
	testSmartWrap: function(endElement, criteria) {
		return this.smartWrap(endElement, null, criteria, true);
	},
	
	/**
	 * Create inline element with given tag name and wraps nodes nearby endElement by given criteria
	 *
	 * @param {Element} endElement Boundary(end point, exclusive) of wrapper.
	 * @param {String} tag Tag name of wrapper.
	 * @param {Object} function which returns text index of start boundary.
	 * @param {boolean} testOnly just test boundary and do not perform actual wrapping.
	 *
	 * @returns {Element} wrapper
	 */
	smartWrap: function(endElement, tag, criteria, testOnly) {
		var block = this.getParentBlockElementOf(endElement);

		tag = tag || "SPAN";
		criteria = criteria || function(text) {return -1};
		
		// check for empty wrapper
		if(!testOnly && (!endElement.previousSibling || this.isEmptyBlock(block))) {
			var wrapper = this.insertNodeAt(this.createElement(tag), endElement, "before");
			return wrapper;
		}
		
		// collect all textnodes
		var textNodes = this.tree.collectForward(block, function(node) {return node === endElement}, function(node) {return node.nodeType === 3});
		
		// find textnode and break-point
		var nodeIndex = 0;
		var nodeValues = [];
		for(var i = 0; i < textNodes.length; i++) {
			nodeValues.push(textNodes[i].nodeValue);
		}
		var textToWrap = nodeValues.join("");
		var textIndex = criteria(textToWrap)
		var breakPoint = textIndex;
		
		if(breakPoint === -1) {
			breakPoint = 0;
		} else {
			textToWrap = textToWrap.substring(breakPoint);
		}
		
		for(var i = 0; i < textNodes.length; i++) {
			if(breakPoint > nodeValues[i].length) {
				breakPoint -= nodeValues[i].length;
			} else {
				nodeIndex = i;
				break;
			}
		}
		
		if(testOnly) return {text:textToWrap, textIndex:textIndex, nodeIndex:nodeIndex, breakPoint:breakPoint};
		
		// break textnode if necessary 
		if(breakPoint !== 0) {
			var splitted = textNodes[nodeIndex].splitText(breakPoint);
			nodeIndex++;
			textNodes.splice(nodeIndex, 0, splitted);
		}
		var startElement = textNodes[nodeIndex] || block.firstChild;
		
		// split inline elements up to parent block if necessary
		var family = this.tree.findCommonAncestorAndImmediateChildrenOf(startElement, endElement);
		var ca = family.parent;
		if(ca) {
			if(startElement.parentNode !== ca) startElement = this.splitElementUpto(startElement, ca, true);
			if(endElement.parentNode !== ca) endElement = this.splitElementUpto(endElement, ca, true);
			
			var prevStart = startElement.previousSibling;
			var nextEnd = endElement.nextSibling;
			
			// remove empty inline elements
			if(prevStart && prevStart.nodeType === 1 && this.isEmptyBlock(prevStart)) this.deleteNode(prevStart);
			if(nextEnd && nextEnd.nodeType === 1 && this.isEmptyBlock(nextEnd)) this.deleteNode(nextEnd);
			
			// wrap
			var wrapper = this.insertNodeAt(this.createElement(tag), startElement, "before");
			while(wrapper.nextSibling !== endElement) wrapper.appendChild(wrapper.nextSibling);
			return wrapper;
		} else {
			// wrap
			var wrapper = this.insertNodeAt(this.createElement(tag), endElement, "before");
			return wrapper;
		}
	},
	
	/**
	 * Wraps all adjust inline elements and text nodes into block element.
	 *
	 * TODO: empty element should return empty array when it is not forced and (at least) single item array when forced
	 *
	 * @param {String} tag Tag name of wrapper
	 * @param {Element} element Target element
	 * @param {boolean} force Force wrapping. If it is set to false, this method do not makes unnecessary wrapper.
	 *
	 * @returns {Array} Array of wrappers. If nothing performed it returns empty array
	 */
	wrapAllInlineOrTextNodesAs: function(tag, element, force) {
		var wrappers = [];
		
		if(!force && !this.tree.hasMixedContents(element)) return wrappers;
		
		var node = element.firstChild;
		while(node) {
			if(this.tree.isTextOrInlineNode(node)) {
				var wrapper = this.wrapInlineOrTextNodesAs(tag, node);
				wrappers.push(wrapper);
				node = wrapper.nextSibling;
			} else {
				node = node.nextSibling;
			}
		}

		return wrappers;
	},

	/**
	 * Wraps node and its adjust next siblings into an element
	 */
	wrapInlineOrTextNodesAs: function(tag, node) {
		var wrapper = this.createElement(tag);
		var from = node;

		from.parentNode.replaceChild(wrapper, from);
		wrapper.appendChild(from);

		// move nodes into wrapper
		while(wrapper.nextSibling && this.tree.isTextOrInlineNode(wrapper.nextSibling)) wrapper.appendChild(wrapper.nextSibling);

		return wrapper;
	},
	
	/**
	 * Turns block element into list item
	 *
	 * @param {Element} element Target element
	 * @param {String} type One of "UL", "OL".
	 * @param {String} className CSS class name.
	 *
	 * @return {Element} LI element
	 */
	turnElementIntoListItem: function(element, type, className) {
		type = type.toUpperCase();
		className = className || "";
		
		var container = this.createElement(type);
		if(className) container.className = className;
		
		if(this.tree.isTableCell(element)) {
			var p = this.wrapAllInlineOrTextNodesAs("P", element, true)[0];
			container = this.insertNodeAt(container, element, "start");
			var li = this.insertNodeAt(this.createElement("LI"), container, "start");
			li.appendChild(p);
		} else {
			container = this.insertNodeAt(container, element, "after");
			var li = this.insertNodeAt(this.createElement("LI"), container, "start");
			li.appendChild(element);
		}
		
		this.unwrapUnnecessaryParagraph(li);
		this.mergeAdjustLists(container);
		
		return li;
	},
	
	/**
	 * Extracts given element out from its parent element.
	 * 
	 * @param {Element} element Target element
	 */
	extractOutElementFromParent: function(element) {
		if(!element || element === this.getRoot() || element.parentNode === this.getRoot() || !element.offsetParent) return null;
		
		if(element.nodeName === "LI") {
			this.wrapAllInlineOrTextNodesAs("P", element, true);
			element = element.firstChild;
		}
		if (!element) return null;
		var container = element.parentNode;
		var nodeToReturn = null;
		
		if(container.nodeName === "LI" && container.parentNode.parentNode.nodeName === "LI") {
			// nested list item
			if(element.previousSibling) {
				this.splitContainerOf(element, true);
				this.correctEmptyElement(element);
			}
			
			this.outdentListItem(element);
			nodeToReturn = element;
		} else if(container.nodeName === "LI") {
			// not-nested list item
			
			if(this.tree.isListContainer(element.nextSibling)) {
				// 1. split listContainer
				var listContainer = container.parentNode;
				this.splitContainerOf(container, true);
				this.correctEmptyElement(element);
				
				// 2. extract out LI's children
				nodeToReturn = container.firstChild;
				while(container.firstChild) {
					this.insertNodeAt(container.firstChild, listContainer, "before");
				}
				
				// 3. remove listContainer and merge adjust lists
				var prevContainer = listContainer.previousSibling;
				this.deleteNode(listContainer);
				if(prevContainer && this.tree.isListContainer(prevContainer)) this.mergeAdjustLists(prevContainer);
			} else {
				// 1. split LI
				this.splitContainerOf(element, true);
				this.correctEmptyElement(element);
				
				// 2. split list container
				var listContainer = this.splitContainerOf(container);
				
				// 3. extract out
				this.insertNodeAt(element, listContainer.parentNode, "before");
				this.deleteNode(listContainer.parentNode);
				
				nodeToReturn = element;
			}
		} else if(this.tree.isTableCell(container) || this.tree.isTableCell(element)) {
			// do nothing
		} else {
			// normal block
			this.splitContainerOf(element, true);
			this.correctEmptyElement(element);
			nodeToReturn = this.insertNodeAt(element, container, "before");
			
			this.deleteNode(container);
		}
		
		return nodeToReturn;
	},
	
	/**
	 * Insert new block above or below given element.
	 *
	 * @param {Element} block Target block
	 * @param {boolean} before Insert new block above(before) target block
	 * @param {String} forceTag New block's tag name. If omitted, target block's tag name will be used.
	 *
	 * @returns {Element} Inserted block
	 */
	insertNewBlockAround: function(block, before, forceTag) {
		var isListItem = block.nodeName === "LI" || block.parentNode.nodeName === "LI";
		
		this.removeTrailingWhitespace(block);
		if(this.isFirstLiWithNestedList(block) && !forceTag && before) {
			var li = this.getParentElementOf(block, ["LI"]);
			var newBlock = this._insertNewBlockAround(li, before);
			return newBlock;
		} else if(isListItem && !forceTag) {
			var li = this.getParentElementOf(block, ["LI"]);
			var newBlock = this._insertNewBlockAround(block, before);
			if(li !== block) newBlock = this.splitContainerOf(newBlock, false, "prev");
			return newBlock;
		} else if(this.tree.isBlockContainer(block)) {
			this.wrapAllInlineOrTextNodesAs("P", block, true);
			return this._insertNewBlockAround(block.firstChild, before, forceTag);
		} else {
			return this._insertNewBlockAround(block, before, this.tree.isHeading(block) ? "P" : forceTag);
		}
	},
	
	/**
	 * @private
	 *
	 * TODO: Rename
	 */
	_insertNewBlockAround: function(element, before, tagName) {
		var newElement = this.createElement(tagName || element.nodeName);
		this.copyAttributes(element, newElement, false);
		this.correctEmptyElement(newElement);
		newElement = this.insertNodeAt(newElement, element, before ? "before" : "after");
		return newElement;
	},
	
	/**
	 * Wrap or replace element with given tag name.
	 *
	 * @param {String} [tag] Tag name. If not provided, it does not modify tag name.
	 * @param {Element} element Target element
	 * @param {String} [className] Class name of tag. If not provided, it does not modify current class name, and if empty string is provided, class attribute will be removed.
	 *
	 * @return {Element} wrapper element or replaced element.
	 */
	applyTagIntoElement: function(tag, element, className) {
		if(!tag && !className) return null;
		
		var result = element;
		
		if(tag) {
			if(this.tree.isBlockOnlyContainer(tag)) {
				result = this.wrapBlock(tag, element);
			} else if(this.tree.isBlockContainer(element)) {
				var wrapper = this.createElement(tag);
				this.moveChildNodes(element, wrapper);
				result = this.insertNodeAt(wrapper, element, "start");
			} else if(this.tree.isBlockContainer(tag) && this.hasImportantAttributes(element)) {
				result = this.wrapBlock(tag, element);
			} else {
				result = this.replaceTag(tag, element);
			}
		}
		
		if(className) {
			result.className = className;
		}	
		
		return result;
	},
	
	/**
	 * Wrap or replace elements with given tag name.
	 *
	 * @param {String} [tag] Tag name. If not provided, it does not modify tag name.
	 * @param {Element} from Start boundary (inclusive)
	 * @param {Element} to End boundary (inclusive)
	 * @param {String} [className] Class name of tag. If not provided, it does not modify current class name, and if empty string is provided, class attribute will be removed.
	 *
	 * @returns {Array} Array of wrappers or replaced elements
	 */
	applyTagIntoElements: function(tagName, from, to, className) {
		if(!tagName && !className) return [from, to];
		
		var applied = [];
		
		if(tagName) {
			if(this.tree.isBlockContainer(tagName)) {
				var family = this.tree.findCommonAncestorAndImmediateChildrenOf(from, to);
				var node = family.left;
				var wrapper = this.insertNodeAt(this.createElement(tagName), node, "before");
				
				var coveringWholeList =
					family.parent.nodeName === "LI" &&
					family.parent.parentNode.childNodes.length === 1 &&
					!family.left.previousSilbing &&
					!family.right.nextSibling;
					
				if(coveringWholeList) {
					var ul = node.parentNode.parentNode;
					this.insertNodeAt(wrapper, ul, "before");
					wrapper.appendChild(ul);
				} else {
					while(node !== family.right) {
						next = node.nextSibling;
						wrapper.appendChild(node);
						node = next;
					}
					wrapper.appendChild(family.right);
				}
				applied.push(wrapper);
			} else {
				// is normal tagName
				var elements = this.getBlockElementsBetween(from, to);
				for(var i = 0; i < elements.length; i++) {
					if(this.tree.isBlockContainer(elements[i])) {
						var wrappers = this.wrapAllInlineOrTextNodesAs(tagName, elements[i], true);
						for(var j = 0; j < wrappers.length; j++) {
							applied.push(wrappers[j]);
						}
					} else {
						applied.push(this.replaceTag(tagName, elements[i]) || elements[i]);
					}
				}
			}
		}
		
		if(className) {
			var elements = this.tree.collectNodesBetween(from, to, function(n) {return n.nodeType == 1;});
			for(var i = 0; i < elements.length; i++) {
				elements[i].className = className;
			}
		}	
		
		return applied;
	},
	
	/**
	 * Moves block up or down
	 *
	 * @param {Element} block Target block
	 * @param {boolean} up Move up if true
	 * 
	 * @returns {Element} Moved block. It could be different with given block.
	 */
	moveBlock: function(block, up) {
		// if block is table cell or contained by table cell, select its row as mover
		block = this.getParentElementOf(block, ["TR"]) || block;
		
		// if block is only child, select its parent as mover
		while(block.nodeName !== "TR" && block.parentNode !== this.getRoot() && !block.previousSibling && !block.nextSibling && !this.tree.isListContainer(block.parentNode)) {
			block = block.parentNode;
		}
		
		// find target and where
		var target, where;
		if (up) {
			target = block.previousSibling;
			
			if(target) {
				var singleNodeLi = target.nodeName === 'LI' && ((target.childNodes.length === 1 && this.tree.isBlock(target.firstChild)) || !this.tree.hasBlocks(target));
				var table = ['TABLE', 'TR'].indexOf(target.nodeName) !== -1;

				where = this.tree.isBlockContainer(target) && !singleNodeLi && !table ? "end" : "before";
			} else if(block.parentNode !== this.getRoot()) {
				target = block.parentNode;
				where = "before";
			}
		} else {
			target = block.nextSibling;
			
			if(target) {
				var singleNodeLi = target.nodeName === 'LI' && ((target.childNodes.length === 1 && this.tree.isBlock(target.firstChild)) || !this.tree.hasBlocks(target));
				var table = ['TABLE', 'TR'].indexOf(target.nodeName) !== -1;
				
				where = this.tree.isBlockContainer(target) && !singleNodeLi && !table ? "start" : "after";
			} else if(block.parentNode !== this.getRoot()) {
				target = block.parentNode;
				where = "after";
			}
		}
		
		
		// no way to go?
		if(!target) return null;
		if(["TBODY", "THEAD"].indexOf(target.nodeName) !== -1) return null;
		
		// normalize
		this.wrapAllInlineOrTextNodesAs("P", target, true);
		
		// make placeholder if needed
		if(this.isFirstLiWithNestedList(block)) {
			this.insertNewBlockAround(block, false, "P");
		}
		
		// perform move
		var parent = block.parentNode;
		var moved = this.insertNodeAt(block, target, where, true);
		
		// cleanup
		if(!parent.hasChildNodes()) this.deleteNode(parent, true);
		this.unwrapUnnecessaryParagraph(moved);
		this.unwrapUnnecessaryParagraph(target);

		// remove placeholder
		if(up) {
			if(moved.previousSibling && this.isEmptyBlock(moved.previousSibling) && !moved.previousSibling.previousSibling && moved.parentNode.nodeName === "LI" && this.tree.isListContainer(moved.nextSibling)) {
				this.deleteNode(moved.previousSibling);
			}
		} else {
			if(moved.nextSibling && this.isEmptyBlock(moved.nextSibling) && !moved.previousSibling && moved.parentNode.nodeName === "LI" && this.tree.isListContainer(moved.nextSibling.nextSibling)) {
				this.deleteNode(moved.nextSibling);
			}
		}
		
		this.correctEmptyElement(moved);
		
		return moved;
	},
	
	/**
	 * Remove given block
	 *
	 * @param {Element} block Target block
	 * @returns {Element} Nearest block of remove element
	 */
	removeBlock: function(block) {
		var blockToMove;

		// if block is only child, select its parent as mover
		while(block.parentNode !== this.getRoot() && !block.previousSibling && !block.nextSibling && !this.tree.isListContainer(block.parentNode)) {
			block = block.parentNode;
		}
		
		var finder = function(node) {return this.tree.isBlock(node) && !this.tree.isAtomic(node) && !this.tree.isDescendantOf(block, node) && !this.tree.hasBlocks(node);}.bind(this);
		var exitCondition = function(node) {return this.tree.isBlock(node) && !this.tree.isDescendantOf(this.getRoot(), node)}.bind(this);
		
		if(this.isFirstLiWithNestedList(block)) {
			blockToMove = this.outdentListItem(block.nextSibling.firstChild);
			this.deleteNode(blockToMove.previousSibling, true);
		} else if(this.tree.isTableCell(block)) {
			var rtable = new xq.RichTable(this, this.getParentElementOf(block, ["TABLE"]));
			blockToMove = rtable.getBelowCellOf(block);
			
			// should not delete row when there's thead and the row is the only child of tbody
			if(
				block.parentNode.parentNode.nodeName === "TBODY" &&
				rtable.hasHeadingAtTop() &&
				rtable.getDom().tBodies[0].rows.length === 1) return blockToMove;
			
			blockToMove = blockToMove ||
				this.tree.findForward(block, finder, exitCondition) ||
				this.tree.findBackward(block, finder, exitCondition);
			
			this.deleteNode(block.parentNode, true);
		} else {
			blockToMove = blockToMove ||
				this.tree.findForward(block, finder, exitCondition) ||
				this.tree.findBackward(block, finder, exitCondition);
			
			if(!blockToMove) blockToMove = this.insertNodeAt(this.makeEmptyParagraph(), block, "after");
			
			this.deleteNode(block, true);
		}
		if(!this.getRoot().hasChildNodes()) {
			blockToMove = this.createElement("P");
			this.getRoot().appendChild(blockToMove);
			this.correctEmptyElement(blockToMove);
		}
		
		return blockToMove;
	},
	
	/**
	 * Removes trailing whitespaces of given block
	 *
	 * @param {Element} block Target block
	 */
	removeTrailingWhitespace: function(block) {throw "Not implemented"},
	
	/**
	 * Extract given list item out and change its container's tag
	 *
	 * @param {Element} element LI or P which is a child of LI
	 * @param {String} type "OL", "UL"
	 * @param {String} className CSS class name
	 *
	 * @returns {Element} changed element
	 */
	changeListTypeTo: function(element, type, className) {
		type = type.toUpperCase();
		className = className || "";
		
		var li = this.getParentElementOf(element, ["LI"]);
		if(!li) throw "IllegalArgumentException";
		
		var container = li.parentNode;

		this.splitContainerOf(li);
		
		var newContainer = this.insertNodeAt(this.createElement(type), container, "before");
		if(className) newContainer.className = className;
		
		this.insertNodeAt(li, newContainer, "start");
		this.deleteNode(container);
		
		this.mergeAdjustLists(newContainer);
		
		return element;
	},
	
	/**
	 * Split container of element into (maxium) three pieces.
	 */
	splitContainerOf: function(element, preserveElementItself, dir) {
		if([element, element.parentNode].indexOf(this.getRoot()) !== -1) return element;

		var container = element.parentNode;
		if(element.previousSibling && (!dir || dir.toLowerCase() === "prev")) {
			var prev = this.createElement(container.nodeName);
			this.copyAttributes(container, prev);
			while(container.firstChild !== element) {
				prev.appendChild(container.firstChild);
			}
			this.insertNodeAt(prev, container, "before");
			this.unwrapUnnecessaryParagraph(prev);
		}
		
		if(element.nextSibling && (!dir || dir.toLowerCase() === "next")) {
			var next = this.createElement(container.nodeName);
			this.copyAttributes(container, next);
			while(container.lastChild !== element) {
				this.insertNodeAt(container.lastChild, next, "start");
			}
			this.insertNodeAt(next, container, "after");
			this.unwrapUnnecessaryParagraph(next);
		}
		
		if(!preserveElementItself) element = this.unwrapUnnecessaryParagraph(container) ? container : element;
		return element;
	},

	/**
	 * TODO: Add specs
	 */
	splitParentElement: function(seperator) {
		var parent = seperator.parentNode;
		if(["HTML", "HEAD", "BODY"].indexOf(parent.nodeName) !== -1) throw "Illegal argument. Cannot seperate element[" + parent.nodeName + "]";

		var previousSibling = seperator.previousSibling;
		var nextSibling = seperator.nextSibling;
		
		var newElement = this.insertNodeAt(this.createElement(parent.nodeName), parent, "after");
		
		var next;
		while(next = seperator.nextSibling) newElement.appendChild(next);
		
		this.insertNodeAt(seperator, newElement, "start");
		this.copyAttributes(parent, newElement);
		
		return newElement;
	},
	
	/**
	 * TODO: Add specs
	 */
	splitElementUpto: function(seperator, element, excludeElement) {
		while(seperator.previousSibling !== element) {
			if(excludeElement && seperator.parentNode === element) break;
			seperator = this.splitParentElement(seperator);
		}
		return seperator;
	},
	
	/**
	 * Merges two adjust elements
	 *
	 * @param {Element} element base element
	 * @param {boolean} withNext merge base element with next sibling
	 * @param {boolean} skip skip merge steps
	 */
	mergeElement: function(element, withNext, skip) {
		this.wrapAllInlineOrTextNodesAs("P", element.parentNode, true);
		
		// find two block
		if(withNext) {
			var prev = element;
			var next = this.tree.findForward(
				element,
				function(node) {return this.tree.isBlock(node) && !this.tree.isListContainer(node) && node !== element.parentNode}.bind(this)
			);
		} else {
			var next = element;
			var prev = this.tree.findBackward(
				element,
				function(node) {return this.tree.isBlock(node) && !this.tree.isListContainer(node) && node !== element.parentNode}.bind(this)
			);
		}
		
		// normalize next block
		if(next && this.tree.isDescendantOf(this.getRoot(), next)) {
			var nextContainer = next.parentNode;
			if(this.tree.isBlockContainer(next)) {
				nextContainer = next;
				this.wrapAllInlineOrTextNodesAs("P", nextContainer, true);
				next = nextContainer.firstChild;
			}
		} else {
			next = null;
		}
		
		// normalize prev block
		if(prev && this.tree.isDescendantOf(this.getRoot(), prev)) {
			var prevContainer = prev.parentNode;
			if(this.tree.isBlockContainer(prev)) {
				prevContainer = prev;
				this.wrapAllInlineOrTextNodesAs("P", prevContainer, true);
				prev = prevContainer.lastChild;
			}
		} else {
			prev = null;
		}
		
		try {
			var containersAreTableCell =
				prevContainer && (this.tree.isTableCell(prevContainer) || ['TR', 'THEAD', 'TBODY'].indexOf(prevContainer.nodeName) !== -1) &&
				nextContainer && (this.tree.isTableCell(nextContainer) || ['TR', 'THEAD', 'TBODY'].indexOf(nextContainer.nodeName) !== -1);
			
			if(containersAreTableCell && prevContainer !== nextContainer) return null;
			
			// if next has margin, perform outdent
			if((!skip || !prev) && next && nextContainer.nodeName !== "LI" && this.outdentElement(next)) return element;

			// nextContainer is first li and next of it is list container ([I] represents caret position):
			//
			// * A[I]
			// * B
			//   * C
			if(nextContainer && nextContainer.nodeName === 'LI' && this.tree.isListContainer(next.nextSibling)) {
				if(prev && prevContainer && prevContainer.nodeName !== 'BODY'){
					// move child nodes and...
					this.moveChildNodes(nextContainer, prevContainer);
				} else if(!prev) {
					// insert temp paragraph
					prev = this.insertNodeAt(this.createElement('P'), this.getParentElementOf(nextContainer,'UL'), 'before');
				}
				
				// merge two paragraphs
				this.removePlaceHoldersAndEmptyNodes(prev);
				this.moveChildNodes(next, prev);
				this.deleteNode(next);
				
				if(!prevContainer || prevContainer.nodeName === 'BODY'){
					// move child nodes and...
					this.moveChildNodes(nextContainer, prev);
				}
				
				return prev;
			}
			
			// merge two list containers
			if(nextContainer && nextContainer.nodeName === 'LI' && this.tree.isListContainer(nextContainer.parentNode.previousSibling)) {
				this.mergeAdjustLists(nextContainer.parentNode.previousSibling, true, "next");
				return prev;
			}

			if(next && !containersAreTableCell && prevContainer && prevContainer.nodeName === 'LI' && nextContainer && nextContainer.nodeName === 'LI' && prevContainer.parentNode.nextSibling === nextContainer.parentNode) {
				var nextContainerContainer = nextContainer.parentNode;
				this.moveChildNodes(nextContainer.parentNode, prevContainer.parentNode);
				this.deleteNode(nextContainerContainer);
				return prev;
			}
			
			// merge two containers
			if(next && !containersAreTableCell && prevContainer && prevContainer.nextSibling === nextContainer && ((skip && prevContainer.nodeName !== "LI") || (!skip && prevContainer.nodeName === "LI"))) {
				this.moveChildNodes(nextContainer, prevContainer);
				return prev;
			}

			// unwrap container
			if(nextContainer && nextContainer.nodeName !== "LI" && !this.getParentElementOf(nextContainer, ["TABLE"]) && !this.tree.isListContainer(nextContainer) && nextContainer !== this.getRoot() && !next.previousSibling) {
				return this.unwrapElement(nextContainer, true);
			}
			
			// delete table
			if(withNext && nextContainer && nextContainer.nodeName === "TABLE") {
				this.deleteNode(nextContainer, true);
				return prev;
			} else if(!withNext && prevContainer && this.tree.isTableCell(prevContainer) && !this.tree.isTableCell(nextContainer)) {
				if (element.nodeName == 'LI')
					return null;
				this.deleteNode(this.getParentElementOf(prevContainer, ["TABLE"]), true);
				return next;
			}
			
			// if prev is same with next, do nothing
			if(prev === next) return null;

			// if there is a null block, do nothing
			if(!prev || !next || !prevContainer || !nextContainer) return null;
			
			// if two blocks are not in the same table cell, do nothing
			if(this.getParentElementOf(prev, ["TD", "TH"]) !== this.getParentElementOf(next, ["TD", "TH"])) return null;
			
			var prevIsEmpty = false;
			
			// cleanup empty block before merge

			// 1. cleanup prev node which ends with marker + &nbsp;
			if(
				xq.Browser.isTrident &&
				prev.childNodes.length >= 2 &&
				this.isMarker(prev.lastChild.previousSibling) &&
				prev.lastChild.nodeType === 3 &&
				prev.lastChild.nodeValue.length === 1 &&
				prev.lastChild.nodeValue.charCodeAt(0) === 160
			) {
				this.deleteNode(prev.lastChild);
			}

			// 2. cleanup prev node (if prev is empty, then replace prev's tag with next's)
			this.removePlaceHoldersAndEmptyNodes(prev);
			if(this.isEmptyBlock(prev)) {
				// replace atomic block with normal block so that following code don't need to care about atomic block
				if(this.tree.isAtomic(prev)) prev = this.replaceTag("P", prev);
				
				prev = this.replaceTag(next.nodeName, prev) || prev;
				prev.innerHTML = "";
			} else if(prev.firstChild === prev.lastChild && this.isMarker(prev.firstChild)) {
				prev = this.replaceTag(next.nodeName, prev) || prev;
			}
			
			// 3. cleanup next node
			if(this.isEmptyBlock(next)) {
				// replace atomic block with normal block so that following code don't need to care about atomic block
				if(this.tree.isAtomic(next)) next = this.replaceTag("P", next);
				
				next.innerHTML = "";
			}
			
			// perform merge
			this.moveChildNodes(next, prev);
			this.deleteNode(next);
			return prev;
		} finally {
			// cleanup
			if(prevContainer && this.isEmptyBlock(prevContainer)) this.deleteNode(prevContainer, true);
			if(nextContainer && this.isEmptyBlock(nextContainer)) this.deleteNode(nextContainer, true);
			
			if(prevContainer) this.unwrapUnnecessaryParagraph(prevContainer);
			if(nextContainer) this.unwrapUnnecessaryParagraph(nextContainer);
		}
	},
	
	/**
	 * Merges adjust list containers which has same tag name
	 *
	 * @param {Element} container target list container
	 * @param {boolean} force force adjust list container even if they have different list type
	 * @param {String} dir Specify merge direction: PREV or NEXT. If not supplied it will be merged with both direction.
	 */
	mergeAdjustLists: function(container, force, dir) {
		var prev = container.previousSibling;
		var isPrevSame = prev && (prev.nodeName === container.nodeName && prev.className === container.className);
		if((!dir || dir.toLowerCase() === 'prev') && (isPrevSame || (force && this.tree.isListContainer(prev)))) {
			while(prev.lastChild) {
				this.insertNodeAt(prev.lastChild, container, "start");
			}
			this.deleteNode(prev);
		}
		
		var next = container.nextSibling;
		var isNextSame = next && (next.nodeName === container.nodeName && next.className === container.className);
		if((!dir || dir.toLowerCase() === 'next') && (isNextSame || (force && this.tree.isListContainer(next)))) {
			while(next.firstChild) {
				this.insertNodeAt(next.firstChild, container, "end");
			}
			this.deleteNode(next);
		}
	},
	
	/**
	 * Moves child nodes from one element into another.
	 *
	 * @param {Elemet} from source element
	 * @param {Elemet} to target element
	 */
	moveChildNodes: function(from, to) {
		if(this.tree.isDescendantOf(from, to) || ["HTML", "HEAD"].indexOf(to.nodeName) !== -1)
			throw "Illegal argument. Cannot move children of element[" + from.nodeName + "] to element[" + to.nodeName + "]";
		
		if(from === to) return;
		
		while(from.firstChild) to.appendChild(from.firstChild);
	},
	
	/**
	 * Copies attributes from one element into another.
	 *
	 * @param {Element} from source element
	 * @param {Element} to target element
	 * @param {boolean} copyId copy ID attribute of source element
	 */
	copyAttributes: function(from, to, copyId) {
		// IE overrides this
		
		var attrs = from.attributes;
		if(!attrs) return;
		
		for(var i = 0; i < attrs.length; i++) {
			if(attrs[i].nodeName === "class" && attrs[i].nodeValue) {
				to.className = attrs[i].nodeValue;
			} else if((copyId || "id" !== attrs[i].nodeName) && attrs[i].nodeValue) {
				to.setAttribute(attrs[i].nodeName, attrs[i].nodeValue);
			}
		}
	},

	_indentElements: function(node, blocks, affect) {
		for (var i=0; i < affect.length; i++) {
			if (affect[i] === node || this.tree.isDescendantOf(affect[i], node))
				return;
		}
		leaves = this.tree.getLeavesAtEdge(node);
		
		if (blocks.includeElement(leaves[0])) {
			var affected = this.indentElement(node, true);
			if (affected) {
				affect.push(affected);
				return;
			}
		}
		
		if (blocks.includeElement(node)) {
			var affected = this.indentElement(node, true);
			if (affected) {
				affect.push(affected);
				return;
			}
		}

		var children=xq.$A(node.childNodes);
		for (var i=0; i < children.length; i++)
			this._indentElements(children[i], blocks, affect);
		return;
	},

	indentElements: function(from, to) {
		var blocks = this.getBlockElementsBetween(from, to);
		var top = this.tree.findCommonAncestorAndImmediateChildrenOf(from, to);
		
		var affect = [];
		
		leaves = this.tree.getLeavesAtEdge(top.parent);
		if (blocks.includeElement(leaves[0])) {
			var affected = this.indentElement(top.parent);
			if (affected)
				return [affected];
		}
		
		var children = xq.$A(top.parent.childNodes);
		for (var i=0; i < children.length; i++) {
			this._indentElements(children[i], blocks, affect);
		}
		
		affect = affect.flatten()
		return affect.length > 0 ? affect : blocks;
	},
	
	outdentElementsCode: function(node) {
		if (node.tagName === 'LI')
			node = node.parentNode;
		if (node.tagName === 'OL' && node.className === 'code')
			return true;
		return false;
	},
	
	_outdentElements: function(node, blocks, affect) {
		for (var i=0; i < affect.length; i++) {
			if (affect[i] === node || this.tree.isDescendantOf(affect[i], node))
				return;
		}
		leaves = this.tree.getLeavesAtEdge(node);
		
		if (blocks.includeElement(leaves[0]) && !this.outdentElementsCode(leaves[0])) {
			var affected = this.outdentElement(node, true);
			if (affected) {
				affect.push(affected);
				return;
			}
		}
		
		if (blocks.includeElement(node)) {
			var children = xq.$A(node.parentNode.childNodes);
			var isCode = this.outdentElementsCode(node);
			var affected = this.outdentElement(node, true, isCode);
			if (affected) {
				if (children.includeElement(affected) && this.tree.isListContainer(node.parentNode) && !isCode) {
					for (var i=0; i < children.length; i++) {
						if (blocks.includeElement(children[i]) && !affect.includeElement(children[i]))
							affect.push(children[i]);
					}
				}else
					affect.push(affected);
				return;
			}
		}

		var children=xq.$A(node.childNodes);
		for (var i=0; i < children.length; i++)
			this._outdentElements(children[i], blocks, affect);
		return;
	},

	outdentElements: function(from, to) {
		var start, end;
		
		if (from.parentNode.tagName === 'LI') start=from.parentNode;
		if (to.parentNode.tagName === 'LI') end=to.parentNode;
		
		var blocks = this.getBlockElementsBetween(from, to);
		var top = this.tree.findCommonAncestorAndImmediateChildrenOf(from, to);
		
		var affect = [];
		
		leaves = this.tree.getLeavesAtEdge(top.parent);
		if (blocks.includeElement(leaves[0]) && !this.outdentElementsCode(top.parent)) {
			var affected = this.outdentElement(top.parent);
			if (affected)
				return [affected];
		}
		
		var children = xq.$A(top.parent.childNodes);
		for (var i=0; i < children.length; i++) {
			this._outdentElements(children[i], blocks, affect);
		}

		if (from.offsetParent && to.offsetParent) {
			start = from;
			end = to;
		}else if (blocks.first().offsetParent && blocks.last().offsetParent) {
			start = blocks.first();
			end = blocks.last();
		}
		
		affect = affect.flatten()
		if (!start || !start.offsetParent)
			start = affect.first();
		if (!end || !end.offsetParent)
			end = affect.last();
		
		return this.getBlockElementsBetween(start, end);
	},
	
	/**
	 * Performs indent by increasing element's margin-left
	 */	
	indentElement: function(element, noParent, forceMargin) {
		if(
			!forceMargin &&
			(element.nodeName === "LI" || (!this.tree.isListContainer(element) && !element.previousSibling && element.parentNode.nodeName === "LI"))
		) return this.indentListItem(element, noParent);
		
		var root = this.getRoot();
		if(!element || element === root) return null;
		
		if (element.parentNode !== root && !element.previousSibling && !noParent) element=element.parentNode;
		
		var margin = element.style.marginLeft;
		var cssValue = margin ? this._getCssValue(margin, "px") : {value:0, unit:"em"};
		
		cssValue.value += 2;
		element.style.marginLeft = cssValue.value + cssValue.unit;
		
		return element;
	},
	
	/**
	 * Performs outdent by decreasing element's margin-left
	 */	
	outdentElement: function(element, noParent, forceMargin) {
		if(!forceMargin && element.nodeName === "LI") return this.outdentListItem(element, noParent);
		
		var root = this.getRoot();
		if(!element || element === root) return null;
		
		var margin = element.style.marginLeft;
		
		var cssValue = margin ? this._getCssValue(margin, "px") : {value:0, unit:"em"};
		if(cssValue.value === 0) {
			return element.previousSibling || forceMargin ?
				null :
				this.outdentElement(element.parentNode, noParent);
		}
		
		cssValue.value -= 2;
		element.style.marginLeft = cssValue.value <= 0 ? "" : cssValue.value + cssValue.unit;
		if(element.style.cssText === "") element.removeAttribute("style");
		
		return element;
	},
	
	/**
	 * Performs indent for list item
	 */
	indentListItem: function(element, treatListAsNormalBlock) {
		var li = this.getParentElementOf(element, ["LI"]);
		var container = li.parentNode;
		var prev = li.previousSibling;
		if(!li.previousSibling) return this.indentElement(container);
		
		if(li.parentNode.nodeName === "OL" && li.parentNode.className === "code") return this.indentElement(li, treatListAsNormalBlock, true);
		
		if(!prev.lastChild) prev.appendChild(this.makePlaceHolder());
		
		var targetContainer = 
			this.tree.isListContainer(prev.lastChild) ?
			// if there's existing list container, select it as target container
			prev.lastChild :
			// if there's nothing, create new one
			this.insertNodeAt(this.createElement(container.nodeName), prev, "end");
		
		this.wrapAllInlineOrTextNodesAs("P", prev, true);
		
		// perform move
		targetContainer.appendChild(li);
		
		// flatten nested list
		if(!treatListAsNormalBlock && li.lastChild && this.tree.isListContainer(li.lastChild)) {
			var childrenContainer = li.lastChild;
			var child;
			while(child = childrenContainer.lastChild) {
				this.insertNodeAt(child, li, "after");
			}
			this.deleteNode(childrenContainer);
		}
		
		this.unwrapUnnecessaryParagraph(li);
		
		return li;
	},
	
	/**
	 * Performs outdent for list item
	 *
	 * @return {Element} outdented list item or null if no outdent performed
	 */
	outdentListItem: function(element, treatListAsNormalBlock) {
		var li = this.getParentElementOf(element, ["LI"]);
		var container = li.parentNode;

		if(!li.previousSibling) {
			var performed = this.outdentElement(container);
			if(performed) return performed;
		}
		
		//fix invalid nested list
		if (container.parentNode.nodeName == 'OL' || container.parentNode.nodeName == 'UL') {
			if (container.previousSibling && container.previousSibling.nodeName == 'LI') {
				container.previousSibling.appendChild(container);
			}
		}

		if(li.parentNode.nodeName === "OL" && li.parentNode.className === "code") return this.outdentElement(li, treatListAsNormalBlock, true);
		
		var parentLi = container.parentNode;
		if(parentLi.nodeName !== "LI") return null;
		
		if(treatListAsNormalBlock) {
			while(container.lastChild !== li) {
				this.insertNodeAt(container.lastChild, parentLi, "after");
			}
		} else {
			// make next siblings as children
			if(li.nextSibling) {
				var targetContainer =
					li.lastChild && this.tree.isListContainer(li.lastChild) ?
						// if there's existing list container, select it as target container
						li.lastChild :
						// if there's nothing, create new one
						this.insertNodeAt(this.createElement(container.nodeName), li, "end");
				
				this.copyAttributes(container, targetContainer);
				
				var sibling;
				while(sibling = li.nextSibling) {
					targetContainer.appendChild(sibling);
				}
			}
		}
		
		// move current LI into parent LI's next sibling
		li = this.insertNodeAt(li, parentLi, "after");
		
		// remove empty container
		if(container.childNodes.length === 0) this.deleteNode(container);
		
		if(li.firstChild && this.tree.isListContainer(li.firstChild)) {
			this.insertNodeAt(this.makePlaceHolder(), li, "start");
		}
		
		this.wrapAllInlineOrTextNodesAs("P", li);
		this.unwrapUnnecessaryParagraph(parentLi);
		
		return li;
	},
	
	/**
	 * Performs justification
	 *
	 * @param {Element} block target element
	 * @param {String} dir one of "LEFT", "CENTER", "RIGHT", "BOTH"
	 */
	justifyBlock: function(block, dir) {
		// if block is only child, select its parent as mover
		while(block.parentNode !== this.getRoot() && !block.previousSibling && !block.nextSibling && !this.tree.isListContainer(block.parentNode)) {
			block = block.parentNode;
		}
		
		var styleValue = dir.toLowerCase() === "both" ? "justify" : dir;
		if(styleValue === "left") {
			block.style.textAlign = "";
			if(block.style.cssText === "") block.removeAttribute("style");
		} else {
			block.style.textAlign = styleValue;
		}
		return block;
	},
	
	justifyBlocks: function(blocks, dir) {
		for(var i = 0; i < blocks.length; i++) {
			this.justifyBlock(blocks[i], dir);
		}
		return blocks;
	},
	
	/**
     * Turn given element into list. If the element is a list already, it will be reversed into normal element.
	 *
	 * @param {Element} element target element
	 * @param {String} type one of "UL", "OL"
	 * @param {String} className CSS className
	 * @returns {Element} affected element
	 */
	applyList: function(element, type, className) {
		type = type.toUpperCase();
		className = className || "";
		
		var containerTag = type;
		
		if(element.nodeName === "LI" || (element.parentNode.nodeName === "LI" && !element.previousSibling)) {
			var element = this.getParentElementOf(element, ["LI"]);
			var container = element.parentNode;
			if(container.nodeName === containerTag && container.className === className) {
				return this.extractOutElementFromParent(element);
			} else {
				return this.changeListTypeTo(element, type, className);
			}
		} else {
			return this.turnElementIntoListItem(element, type, className);
		}
	},
	
	applyLists: function(from, to, type, className) {
		type = type.toUpperCase();
		className = className || "";

		var containerTag = type;
		var blocks = this.getBlockElementsBetween(from, to);
		
		// LIs or Non-containing blocks
		var whole = blocks.findAll(function(e) {
			return e.nodeName === "LI" || !this.tree.isBlockContainer(e);
		}.bind(this));
		
		// LIs
		var listItems = whole.findAll(function(e) {return e.nodeName === "LI"}.bind(this));
		
		// Non-containing blocks which is not a descendant of any LIs selected above(listItems).
		var normalBlocks = whole.findAll(function(e) {
			return e.nodeName !== "LI" &&
				!(e.parentNode.nodeName === "LI" && !e.previousSibling && !e.nextSibling) &&
				!this.tree.isDescendantOf(listItems, e)
		}.bind(this));
		
		var diffListItems = listItems.findAll(function(e) {
			return e.parentNode.nodeName !== containerTag;
		}.bind(this));
		
		// Conditions needed to determine mode
		var hasNormalBlocks = normalBlocks.length > 0;
		var hasDifferentListStyle = diffListItems.length > 0;
		
		var blockToHandle = null;
		
		if(hasNormalBlocks) {
			blockToHandle = normalBlocks;
		} else if(hasDifferentListStyle) {
			blockToHandle = diffListItems;
		} else {
			blockToHandle = listItems;
		}
		
		// perform operation
		for(var i = 0; i < blockToHandle.length; i++) {
			var block = blockToHandle[i];
			
			// preserve original index to restore selection
			var originalIndex = blocks.indexOf(block);
			blocks[originalIndex] = this.applyList(block, type, className);
		}
		
		return blocks;
	},

	/**
	 * Insert place-holder for given empty element. Empty element does not displayed and causes many editing problems.
	 *
	 * @param {Element} element empty element
	 */
	correctEmptyElement: function(element) {throw "Not implemented"},

	/**
	 * Corrects current block-only-container to do not take any non-block element or node.
	 */
	correctParagraph: function() {throw "Not implemented"},
	
	/**
	 * Makes place-holder for empty element.
	 *
	 * @returns {Node} Platform specific place holder
	 */
	makePlaceHolder: function() {throw "Not implemented"},
	
	/**
	 * Makes place-holder string.
	 *
	 * @returns {String} Platform specific place holder string
	 */
	makePlaceHolderString: function() {throw "Not implemented"},
	
	/**
	 * Makes empty paragraph which contains only one place-holder
	 */
	makeEmptyParagraph: function() {throw "Not implemented"},

	/**
	 * Applies background color to selected area
	 *
	 * @param {Object} color valid CSS color value
	 */
	applyBackgroundColor: function(color) {throw "Not implemented";},

	/**
	 * Applies foreground color to selected area
	 *
	 * @param {Object} color valid CSS color value
	 */
	applyForegroundColor: function(color) {
		this.execCommand("forecolor", color);
	},
	
	/**
	 * Applies font face to selected area
	 *
	 * @param {String} face font face
	 */
	applyFontFace: function(face) {
		this.execCommand("fontname", face);
	},
	
	/**
	 * Applies font size to selected area
	 *
	 * @param {Number} size font size (px)
	 */
	applyFontSize: function(size) {
		this.execCommand("fontsize", size);
	},
	
	execCommand: function(commandId, param) {throw "Not implemented";},
	
	applyRemoveFormat: function() {throw "Not implemented";},
	applyEmphasis: function() {throw "Not implemented";},
	applyStrongEmphasis: function() {throw "Not implemented";},
	applyStrike: function() {throw "Not implemented";},
	applyUnderline: function() {throw "Not implemented";},
	applySuperscription: function() {
		this.execCommand("superscript");
	},
	applySubscription: function() {
		this.execCommand("subscript");
	},
	indentBlock: function(element, treatListAsNormalBlock) {
		return (!element.previousSibling && element.parentNode.nodeName === "LI") ?
			this.indentListItem(element, treatListAsNormalBlock) :
			this.indentElement(element);
	},
	outdentBlock: function(element, treatListAsNormalBlock) {
		while(true) {
			if(!element.previousSibling && element.parentNode.nodeName === "LI") {
				element = this.outdentListItem(element, treatListAsNormalBlock);
				return element;
			} else {
				var performed = this.outdentElement(element);
				if(performed) return performed;
				
				// first-child can outdent container
				if(!element.previousSibling) {
					element = element.parentNode;
				} else {
					break;
				}
			}
		}
		
		return null;
	},
	wrapBlock: function(tag, start, end) {
		if(this.tree._blockTags.indexOf(tag) === -1) throw "Unsuppored block container: [" + tag + "]";
		if(!start) start = this.getCurrentBlockElement();
		if(!end) end = start;
		
		// Check if the selection captures valid fragement
		var validFragment = false;
		
		if(start === end) {
			// are they same block?
			validFragment = true;
		} else if(start.parentNode === end.parentNode && !start.previousSibling && !end.nextSibling) {
			// are they covering whole parent?
			validFragment = true;
			start = end = start.parentNode;
		} else {
			// are they siblings of non-LI blocks?
			validFragment =
				(start.parentNode === end.parentNode) &&
				(start.nodeName !== "LI");
		}
		
		if(!validFragment) return null;
		
		var wrapper = this.createElement(tag);
		
		if(start === end) {
			// They are same.
			if(this.tree.isBlockContainer(start) && !this.tree.isListContainer(start)) {
				// It's a block container. Wrap its contents.
				if(this.tree.isBlockOnlyContainer(wrapper)) {
					this.correctEmptyElement(start);
					this.wrapAllInlineOrTextNodesAs("P", start, true);
				}
				this.moveChildNodes(start, wrapper);
				start.appendChild(wrapper);
			} else {
				// It's not a block container. Wrap itself.
				wrapper = this.insertNodeAt(wrapper, start, "after");
				wrapper.appendChild(start);
			}
			
			this.correctEmptyElement(wrapper);
		} else {
			// They are siblings. Wrap'em all.
			wrapper = this.insertNodeAt(wrapper, start, "before");
			var node = start;
			
			while(node !== end) {
				next = node.nextSibling;
				wrapper.appendChild(node);
				node = next;
			}
			wrapper.appendChild(node);
		}
		
		return wrapper;
	},


	
	/////////////////////////////////////////////
	// Focus/Caret/Selection
	
	/**
	 * Gives focus to root element's window
	 */
	focus: function() {throw "Not implemented";},

	/**
	 * Returns selection object
	 */
	sel: function() {throw "Not implemented";},
	
	/**
	 * Returns range object
	 */
	rng: function() {throw "Not implemented";},
	
	/**
	 * Returns true if DOM has selection
	 */
	hasSelection: function() {throw "Not implemented";},

	/**
	 * Returns true if root element's window has selection
	 */
	hasFocus: function() {
		return this.focused;
	},
	
	/**
	 * Adjust scrollbar to make the element visible in current viewport.
	 *
	 * @param {Element} element Target element
	 * @param {boolean} toTop Align element to top of the viewport
	 * @param {boolean} moveCaret Move caret to the element
	 */
	scrollIntoView: function(element, toTop, moveCaret) {
		element.scrollIntoView(toTop);
		if(moveCaret) this.placeCaretAtStartOf(element);
	},
	
	/**
	 * Select all document
	 */
	selectAll: function() {
		return this.execCommand('selectall');
	},
	
	/**
	 * Select specified element.
	 *
	 * @param {Element} element element to select
	 * @param {boolean} entireElement true to select entire element, false to select inner content of element 
	 */
	selectElement: function(node, entireElement) {throw "Not implemented"},
	
	/**
	 * Select all elements between two blocks(inclusive).
	 *
	 * @param {Element} start start of selection
	 * @param {Element} end end of selection
	 */
	selectBlocksBetween: function(start, end) {throw "Not implemented"},
	
	/**
	 * Delete selected area
	 */
	deleteSelection: function() {throw "Not implemented"},
	
	/**
	 * Collapses current selection.
	 *
	 * @param {boolean} toStart true to move caret to start of selected area.
	 */
	collapseSelection: function(toStart) {throw "Not implemented"},
	
	/**
	 * Returns selected area as HTML string
	 */
	getSelectionAsHtml: function() {throw "Not implemented"},
	
	/**
	 * Returns selected area as text string
	 */
	getSelectionAsText: function() {throw "Not implemented"},
	
	/**
	 * Places caret at start of the element
	 *
	 * @param {Element} element Target element
	 */
	placeCaretAtStartOf: function(element) {throw "Not implemented"},

	
	/**
	 * Checks if the caret is place at start of the block
	 */
	isCaretAtBlockStart: function() {
		if(this.isCaretAtEmptyBlock()) return true;
		if(this.hasSelection()) return false;
		var node = this.getCurrentBlockElement();
		var marker = this.pushMarker();
		
		var isTrue = false;
		while (node = this.getFirstChild(node)) {
			if (node === marker) {
				isTrue = true;
				break;
			}
		}
		
		this.popMarker();
		
		return isTrue;
	},
	
	/**
	 * Checks if the caret is place at end of the block
	 */
	isCaretAtBlockEnd: function() {throw "Not implemented"},
	
	/**
	 * Checks if the node is empty-text-node or not
	 */
	isEmptyTextNode: function(node) {
		return node.nodeType === 3 && (node.nodeValue.length === 0 || (node.nodeValue.length === 1 && (node.nodeValue.charAt(0) === 32 || node.nodeValue.charAt(0) === 160)));
	},
	
	/**
	 * Checks if the caret is place in empty block element
	 */
	isCaretAtEmptyBlock: function() {
		return this.isEmptyBlock(this.getCurrentBlockElement());
	},
	
	/**
	 * Saves current selection info
	 *
	 * @returns {Object} Bookmark for selection
	 */
	saveSelection: function() {throw "Not implemented"},
	
	/**
	 * Restores current selection info
	 *
	 * @param {Object} bookmark Bookmark
	 */
	restoreSelection: function(bookmark) {throw "Not implemented"},
	
	/**
	 * Create marker
	 */
	createMarker: function() {
		var marker = this.createElement("SPAN");
		marker.id = "xquared_marker_" + (this._lastMarkerId++);
		marker.className = "xquared_marker";
		return marker;
	},

	/**
	 * Create and insert marker into current caret position.
	 * Marker is an inline element which has no child nodes. It can be used with many purposes.
	 * For example, You can push marker to mark current caret position.
	 *
	 * @returns {Element} marker
	 */
	pushMarker: function() {
		var marker = this.createMarker();
		return this.insertNode(marker);
	},
	
	/**
	 * Removes last marker
	 *
	 * @params {boolean} moveCaret move caret into marker before delete.
	 */
	popMarker: function(moveCaret) {
		var id = "xquared_marker_" + (--this._lastMarkerId);
		var marker = this.$(id);
		if(!marker) return;
		
		if(moveCaret) {
			this.selectElement(marker, true);
			this.collapseSelection(false);
		}
		
		this.deleteNode(marker);
	},
	
	
	
	/////////////////////////////////////////////
	// Query methods
	
	isMarker: function(node) {
		return (node.nodeType === 1 && node.nodeName === "SPAN" && node.className === "xquared_marker");
	},
	
	isFirstBlockOfBody: function(block) {
		var root = this.getRoot();
		if(this.isFirstLiWithNestedList(block)) block = block.parentNode;
		
		var found = this.tree.findBackward(
			block,
			function(node) {
				return node === root || (this.tree.isBlock(node) && !this.tree.isBlockOnlyContainer(node));
			}.bind(this)
		);
		
		return found === root;
	},
	
	/**
	 * Returns outer HTML of given element
	 */
	getOuterHTML: function(element) {throw "Not implemented"},
	
	/**
	 * Returns inner text of given element
	 * 
	 * @param {Element} element Target element
	 * @returns {String} Text string
	 */
	getInnerText: function(element) {
		return element.innerHTML.stripTags();
	},
	
	/**
	 * Checks if given node is place holder or not.
	 * 
	 * @param {Node} node DOM node
	 */
	isPlaceHolder: function(node) {throw "Not implemented"},
	
	/**
	 * Checks if given block is the first LI whose next sibling is a nested list.
	 *
	 * @param {Element} block Target block
	 */
	isFirstLiWithNestedList: function(block) {
		return !block.previousSibling &&
			block.parentNode.nodeName === "LI" &&
			this.tree.isListContainer(block.nextSibling);
	},
	
	/**
	 * Search all links within given element
	 *
	 * @param {Element} [element] Container element. If not given, the root element will be used.
	 * @param {Array} [found] if passed, links will be appended into this array.
	 * @returns {Array} Array of anchors. It returns empty array if there's no links.
	 */
	searchAnchors: function(element, found) {
		if(!element) element = this.getRoot();
		if(!found) found = [];

		var anchors = element.getElementsByTagName("A");
		for(var i = 0; i < anchors.length; i++) {
			found.push(anchors[i]);
		}

		return found;
	},
	
	/**
	 * Search all headings within given element
	 *
	 * @param {Element} [element] Container element. If not given, the root element will be used.
	 * @param {Array} [found] if passed, headings will be appended into this array.
	 * @returns {Array} Array of headings. It returns empty array if there's no headings.
	 */
	searchHeadings: function(element, found) {
		if(!element) element = this.getRoot();
		if(!found) found = [];

		var regexp = /^h[1-6]/ig;
		var nodes = element.childNodes;
		if (!nodes) return [];
		
		for(var i = 0; i < nodes.length; i++) {
			var isContainer = nodes[i] && this.tree._blockContainerTags.indexOf(nodes[i].nodeName) !== -1;
			var isHeading = nodes[i] && nodes[i].nodeName.match(regexp);

			if (isContainer) {
				this.searchHeadings(nodes[i], found);
			} else if (isHeading) {
				found.push(nodes[i]);
			}
		}

		return found;
	},
	
	/**
	 * Collect structure and style informations of given element.
	 *
	 * @param {Element} element target element
	 * @returns {Object} object that contains information: {em: true, strong: false, block: "p", list: "ol", ...}
	 */
	collectStructureAndStyle: function(element) {
		if(!element || element.nodeName === "#document") return {};

		var block = this.getParentBlockElementOf(element);
		
		if(block === null || (xq.Browser.isTrident && ["ready", "complete"].indexOf(block.readyState) === -1)) return {};
		
		var parents = this.tree.collectParentsOf(element, true, function(node) {return block.parentNode === node});
		var blockName = block.nodeName;
		
		var info = {};
		var doc = this.getDoc();
		var em = doc.queryCommandState("Italic");
		var strong = doc.queryCommandState("Bold");
		var strike = doc.queryCommandState("Strikethrough");
		var underline = doc.queryCommandState("Underline") && !this.getParentElementOf(element, ["A"]);
		var superscription = doc.queryCommandState("superscript");
		var subscription = doc.queryCommandState("subscript");
		var foregroundColor = doc.queryCommandValue("forecolor");
		var fontName = doc.queryCommandValue("fontname");
		var fontSize = doc.queryCommandValue("fontsize");
		
		// @WORKAROUND: Trident's fontSize, foregroundColor, fontName value is affected by CSS
		if(xq.Browser.isTrident && fontSize === 5 && this.getParentElementOf(element, ["H1", "H2", "H3", "H4", "H5", "H6"])){
			fontSize = "";
			foregroundColor = "";
			fontName = "";
		}
		
		// @TODO: remove conditional
		var backgroundColor;
		if(xq.Browser.isGecko) {
			this.execCommand("styleWithCSS", "true");
			try {
				backgroundColor = doc.queryCommandValue("hilitecolor");
			} catch(e) {
				// if there's selection and the first element of the selection is
				// an empty block...
				backgroundColor = "";
			}
			this.execCommand("styleWithCSS", "false");
		} else {
			backgroundColor = doc.queryCommandValue("backcolor");
		}
		
		// if block is the only child, select its parent
		while(block.parentNode && block.parentNode !== this.getRoot() && !block.previousSibling && !block.nextSibling && !this.tree.isListContainer(block.parentNode)) {
			block = block.parentNode;
		}

		var list = false;
		if(block.nodeName === "LI" && block.parentNode) {
			var parent = block.parentNode;
			var isCode = parent.nodeName === "OL" && parent.className === "code";
			var hasClass = parent.className.length > 0;
			if(isCode) {
				list = "CODE";
			} else if(hasClass) {
				list = false;
			} else {
				list = parent.nodeName;
			}
		}
		
		var justification = block.style.textAlign || "left";
		
		return {
			block:blockName,
			em: em,
			strong: strong,
			strike: strike,
			underline: underline,
			superscription: superscription,
			subscription: subscription,
			list: list,
			justification: justification,
			foregroundColor: foregroundColor,
			backgroundColor: backgroundColor,
			fontSize: fontSize,
			fontName: fontName
		};
	},
	
	/**
	 * Checks if the element has one or more important attributes: id, class, style
	 *
	 * @param {Element} element Target element
	 */
	hasImportantAttributes: function(element) {throw "Not implemented"},
	
	/**
	 * Checks if the element is empty or not. Place-holder is not counted as a child.
	 *
	 * @param {Element} element Target element
	 */
	isEmptyBlock: function(element) {throw "Not implemented"},
	
	/**
	 * Returns element that contains caret.
	 */
	getCurrentElement: function() {throw "Not implemented"},
	
	/**
	 * Returns block element that contains caret. Trident overrides this method.
	 */
	getCurrentBlockElement: function() {
		var cur = this.getCurrentElement();
		if(!cur) return null;
		
		var block = this.getParentBlockElementOf(cur);
		if(!block) return null;
		
		return (block.nodeName === "BODY") ? null : block;
	},
	
	/**
	 * Returns parent block element of parameter.
	 * If the parameter itself is a block, it will be returned.
	 *
	 * @param {Element} element Target element
	 *
	 * @returns {Element} Element or null
	 */
	getParentBlockElementOf: function(element) {
		while(element) {
			if(this.tree._blockTags.indexOf(element.nodeName) !== -1) return element;
			element = element.parentNode;
		}
		return null;
	},
	
	/**
	 * Returns parent element of parameter which has one of given tag name.
	 * If the parameter itself has the same tag name, it will be returned.
	 *
	 * @param {Element} element Target element
	 * @param {Array} tagNames Array of string which contains tag names
	 *
	 * @returns {Element} Element or null
	 */
	getParentElementOf: function(element, tagNames) {
		while(element) {
			if(tagNames.indexOf(element.nodeName) !== -1) return element;
			element = element.parentNode;
		}
		return null;
	},
	
	/**
	 * Collects all block elements between two elements
	 *
	 * @param {Element} from Start element(inclusive)
	 * @param {Element} to End element(inclusive)
	 */
	getBlockElementsBetween: function(from, to) {
		return this.tree.collectNodesBetween(from, to, function(node) {
			return node.nodeType === 1 && this.tree.isBlock(node);
		}.bind(this));
	},
	
	/**
	 * Returns block element that contains selection start.
	 *
	 * This method will return exactly same result with getCurrentBlockElement method
	 * when there's no selection.
	 */
	getBlockElementAtSelectionStart: function() {throw "Not implemented"},
	
	/**
	 * Returns block element that contains selection end.
	 *
	 * This method will return exactly same result with getCurrentBlockElement method
	 * when there's no selection.
	 */
	getBlockElementAtSelectionEnd: function() {throw "Not implemented"},
	
	/**
	 * Returns blocks at each edge of selection(start and end).
	 *
	 * TODO: implement ignoreEmptyEdges for FF
	 *
	 * @param {boolean} naturalOrder Mak the start element always comes before the end element
	 * @param {boolean} ignoreEmptyEdges Prevent some browser(Gecko) from selecting one more block than expected
	 */
	getBlockElementsAtSelectionEdge: function(naturalOrder, ignoreEmptyEdges) {throw "Not implemented"},
	
	/**
	 * Returns array of selected block elements
	 */
	getSelectedBlockElements: function() {
		var selectionEdges = this.getBlockElementsAtSelectionEdge(true, true);
		var start = selectionEdges[0];
		var end = selectionEdges[1];
		
		return this.tree.collectNodesBetween(start, end, function(node) {
			return node.nodeType === 1 && this.tree.isBlock(node);
		}.bind(this));
	},
	
	/**
	 * Get element by ID
	 *
	 * @param {String} id Element's ID
	 * @returns {Element} element or null
	 */
	getElementById: function(id) {return this.getDoc().getElementById(id)},
	
	/**
	 * Shortcut for #getElementById
	 */
	$: function(id) {return this.getElementById(id)},
	
	/**
	  * Returns first "valid" child of given element. It ignores empty textnodes.
	  *
	  * @param {Element} element Target element
	  * @returns {Node} first child node or null
	  */
	getFirstChild: function(element) {
		if(!element) return null;
		
		var nodes = xq.$A(element.childNodes);
		return nodes.find(function(node) {return !this.isEmptyTextNode(node)}.bind(this));
	},
	
	/**
	  * Returns last "valid" child of given element. It ignores empty textnodes and place-holders.
	  *
	  * @param {Element} element Target element
	  * @returns {Node} last child node or null
	  */
	getLastChild: function(element, includePlaceHolder) {throw "Not implemented"},

	getNextSibling: function(node) {
		while(node = node.nextSibling) {
			if(node.nodeType !== 3 || !node.nodeValue.isBlank()) break;
		}
		return node;
	},

	getBottommostFirstChild: function(node) {
		while(node.firstChild && node.nodeType === 1) node = node.firstChild;
		return node;
	},
	
	getBottommostLastChild: function(node) {
		while(node.lastChild && node.nodeType === 1) node = node.lastChild;
		return node;
	},
	
	/** @private */
	_getCssValue: function(str, defaultUnit) {
		if(!str || str.length === 0) return {value:0, unit:defaultUnit};
		
		var tokens = str.match(/(\d+)(.*)/);
		return {
			value:parseInt(tokens[1]),
			unit:tokens[2] || defaultUnit
		};
	}
});
/**
 * @requires XQuared.js
 * @requires rdom/Base.js
 */
xq.rdom.Trident = xq.Class(xq.rdom.Base,
	/**
	 * @name xq.rdom.Trident
	 * @lends xq.rdom.Trident.prototype
	 * @extends xq.rdom.Base
	 * @constructor
	 */
	{
	makePlaceHolder: function() {
		return this.createTextNode(" ");
	},
	
	makePlaceHolderString: function() {
		return '&nbsp;';
	},
	
	makeEmptyParagraph: function() {
		return this.createElementFromHtml("<p>&nbsp;</p>");
	},

	isPlaceHolder: function(node) {
		return false;
	},

	getOuterHTML: function(element) {
		return element.outerHTML;
	},

	getCurrentBlockElement: function() {
		var cur = this.getCurrentElement();
		if(!cur) return null;
		
		var block = this.getParentBlockElementOf(cur);
		if(!block) return null;
		
		if(block.nodeName === "BODY") {
			// Atomic block such as HR
			var newParagraph = this.insertNode(this.makeEmptyParagraph());
			var next = newParagraph.nextSibling;
			if(this.tree.isAtomic(next)) {
				this.deleteNode(newParagraph);
				return next;
			}
		} else {
			return block;
		}
	},
	
	insertNode: function(node) {
		if(this.hasSelection()) this.collapseSelection(true);
		
		this.rng().pasteHTML('<span id="xquared_temp"></span>');
		var marker = this.$('xquared_temp');
		if(node.id === 'xquared_temp') return marker;
		
		if(marker) marker.replaceNode(node);
		return node;
	},
	
	removeTrailingWhitespace: function(block) {
		if(!block) return;
		
		// @TODO: reimplement to handle atomic tags and so on. (use DomTree)
		if(this.tree.isBlockOnlyContainer(block)) return;
		if(this.isEmptyBlock(block)) return;
		
		var text = block.innerText;
		var html = block.innerHTML;
		var lastCharCode = text.charCodeAt(text.length - 1);
		if(text.length <= 1 || [32,160].indexOf(lastCharCode) === -1) return;
		
		// shortcut for most common case
		if(text == html.replace(/&nbsp;/g, " ")) {
			block.innerHTML = html.replace(/&nbsp;$/, "");
			return;
		}
		
		var node = block;
		while(node && node.nodeType !== 3) node = node.lastChild;
		if(!node) return;
		
		// DO NOT REMOVE OR MODIFY FOLLOWING CODE. Modifying following code will crash IE7
		var nodeValue = node.nodeValue;
		if(nodeValue.length <= 1) {
			this.deleteNode(node, true);
		} else {
			node.nodeValue = nodeValue.substring(0, nodeValue.length - 1);
		}
	},
	
	correctEmptyElement: function(element) {
		if(!element || element.nodeType !== 1 || this.tree.isAtomic(element)) return;
		
		if(element.firstChild) {
			this.correctEmptyElement(element.firstChild);
		} else {
			element.innerHTML = "&nbsp;";
		}
	},

	copyAttributes: function(from, to, copyId) {
		to.mergeAttributes(from, !copyId);
	},

	correctParagraph: function() {
		if(!this.hasFocus()) return false;
		if(this.hasSelection()) return false;
		
		var block = this.getCurrentElement();
		
		// if caret is at
		//  * atomic block level elements(HR) or
		//  * ...
		// then following is true
		if(this.tree.isBlockOnlyContainer(block)) {
			// check for atomic block element such as HR
			block = this.insertNode(this.makeEmptyParagraph());
			if(this.tree.isAtomic(block.nextSibling)) {
				// @WORKAROUND:
				// At this point, HR has a caret but getCurrentElement() doesn't return the HR and
				// I couldn't find a way to get this HR. So I have to keep this reference.
				// I will be used in Editor._handleEnter.
				this.recentHR = block.nextSibling;
				this.deleteNode(block);
				return false;
			} else {
				// I can't remember exactly when following is executed and what it does :-(
				//  * Case 1: Performing Ctrl+A and Ctrl+X repeatedly
				//  * ...
				var nextBlock = this.tree.findForward(
					block,
					function(node) {return this.tree.isBlock(node) && !this.tree.isBlockOnlyContainer(node)}.bind(this)
				);
				
				if(nextBlock) {
					this.deleteNode(block);
					this.placeCaretAtStartOf(nextBlock);
				} else {
					this.placeCaretAtStartOf(block);
				}
				
				return true;
			}
		} else {
			block = this.getCurrentBlockElement();
			if(block.nodeType === 3) block = block.parentNode;
			
			if(this.tree.hasMixedContents(block)) {
				var marker = this.pushMarker();
				this.wrapAllInlineOrTextNodesAs("P", block, true);
				this.popMarker(true);
				return true;
			} else if((this.tree.isTextOrInlineNode(block.previousSibling) || this.tree.isTextOrInlineNode(block.nextSibling)) && this.tree.hasMixedContents(block.parentNode)) {
				// @WORKAROUND:
				// IE?�서??Block�?Inline/Text�??�접??경우 getCurrentElement ?�이 ?�작?�한??
				// ?�라???�재 Block 주�?까�? ?�번???�아주어???�다.
				this.wrapAllInlineOrTextNodesAs("P", block.parentNode, true);
				return true;
			} else {
				return false;
			}
		}
	},
	
	
	
	//////
	// Commands
	execCommand: function(commandId, param) {
		return this.getDoc().execCommand(commandId, false, param);
	},
	
	applyBackgroundColor: function(color) {
		this.execCommand("BackColor", color);
	},
	
	applyEmphasis: function() {
		// Generate <i> tag. It will be replaced with <emphasis> tag during cleanup phase.
		this.execCommand("Italic");
	},
	applyStrongEmphasis: function() {
		// Generate <b> tag. It will be replaced with <strong> tag during cleanup phase.
		this.execCommand("Bold");
	},
	applyStrike: function() {
		// Generate <strike> tag. It will be replaced with <style class="strike"> tag during cleanup phase.
		this.execCommand("strikethrough");
	},
	applyUnderline: function() {
		// Generate <u> tag. It will be replaced with <em class="underline"> tag during cleanup phase.
		this.execCommand("underline");
	},
	applyRemoveFormat: function() {
		this.execCommand("RemoveFormat");
	},
	applyRemoveLink: function() {
		this.execCommand("Unlink");
	},



	//////
	// Focus/Caret/Selection
	
	focus: function() {
		this.getWin().focus();
	},

	sel: function() {
		return this.getDoc().selection;
	},
	
	crng: function() {
		return this.getDoc().body.createControlRange();
	},
	
	rng: function() {
		try {
			var sel = this.sel();
			return (sel === null) ? null : sel.createRange();
		} catch(ignored) {
			// IE often fails
			return null;
		}
	},
	
	hasSelection: function(ignoreControlType) {
		var selectionType = this.sel().type.toLowerCase();
		if("none" === selectionType) return false;
		if("text" === selectionType && this.getSelectionAsHtml().length === 0) return false;
		if(ignoreControlType && "control" === selectionType) return false; 
		return true;
	},
	
	deleteSelection: function() {
		if(this.getSelectionAsText() !== "" || this.sel().type.toLowerCase() === 'control') this.sel().clear();
	},
	
	placeCaretAtStartOf: function(element) {
		// If there's no empty span, caret sometimes moves into a previous node.
		var ph = this.insertNodeAt(this.createElement("SPAN"), element, "start");
		this.selectElement(ph);
		this.collapseSelection(false);
		this.deleteNode(ph);
	},
	
	selectElement: function(element, entireElement, forceTextSelection) {
		if(!element) throw "[element] is null";
		if(element.nodeType !== 1) throw "[element] is not an element";
		
		var rng = null;
		if(!forceTextSelection && this.tree.isAtomic(element)) {
			rng = this.crng();
			rng.addElement(element);
		} else {
			var rng = this.rng();
			rng.moveToElementText(element);
		}
		rng.select();
	},

	selectBlocksBetween: function(start, end) {
		var rng = this.rng();
		var rngTemp = this.rng();

		rngTemp.moveToElementText(start);
		rng.setEndPoint("StartToStart", rngTemp);
		
		rngTemp.moveToElementText(end);
		rng.setEndPoint("EndToEnd", rngTemp);
		
		rng.select();
	},
	
	collapseSelection: function(toStart) {
		if(this.sel().type.toLowerCase() === "control") {
			var curElement = this.getCurrentElement();
			this.sel().empty();
			this.selectElement(curElement, false, true);
		}
		var rng = this.rng();
		rng.collapse(toStart);
		rng.select();
	},
	
	getSelectionAsHtml: function() {
		var rng = this.rng()
		return rng && rng.htmlText ? rng.htmlText : ""
	},
	
	getSelectionAsText: function() {
		var rng = this.rng();
		return rng && rng.text ? rng.text : "";
	},
	
	hasImportantAttributes: function(element) {
		return !!(element.id || element.className || element.style.cssText);
	},

	isEmptyBlock: function(element) {
		if(!element.hasChildNodes()) return true;
		if(element.nodeType === 3 && !element.nodeValue) return true;
		if(["&nbsp;", " ", ""].indexOf(element.innerHTML) !== -1) return true;
		
		return false;
	},
	
	getLastChild: function(element, includePlaceHolder) {
		if(!element || !element.hasChildNodes()) return null;
		
		var nodes = xq.$A(element.childNodes).reverse();
		
		for(var i = 0; i < nodes.length; i++) {
			if(nodes[i].nodeType !== 3 || nodes[i].nodeValue.length !== 0) return nodes[i];
		}
		
		return null;
	},
	
	getCurrentElement: function() {
		if(this.sel().type.toLowerCase() === "control") return this.rng().item(0);
		
		var rng = this.rng();
		if(!rng) return false;
		
		var element = rng.parentElement();
		if(element.nodeName == "BODY" && this.hasSelection()) return null;
		return element;
	},
	
	getBlockElementAtSelectionStart: function() {
		var rng = this.rng();
		var dup = rng.duplicate();
		dup.collapse(true);
		
		var result = this.getParentBlockElementOf(dup.parentElement());
		if(result.nodeName === "BODY") result = result.firstChild;
		
		return result;
	},
	
	getBlockElementAtSelectionEnd: function() {
		var rng = this.rng();
		var dup = rng.duplicate();
		dup.collapse(false);
		
		var result = this.getParentBlockElementOf(dup.parentElement());
		if(result.nodeName === "BODY") result = result.lastChild;
		
		return result;
	},
	
	getBlockElementsAtSelectionEdge: function(naturalOrder, ignoreEmptyEdges) {
		return [
			this.getBlockElementAtSelectionStart(),
			this.getBlockElementAtSelectionEnd()
		];
	},
	
	isCaretAtBlockEnd: function() {
		if(this.isCaretAtEmptyBlock()) return true;
		if(this.hasSelection()) return false;
		
		var node = this.getCurrentBlockElement();
		var marker = this.pushMarker();
		var isTrue = false;
		while (node = this.getLastChild(node)) {
			var nodeValue = node.nodeValue;
			
			if (node === marker) {
				isTrue = true;
				break;
			} else if(
				node.nodeType === 3 &&
				node.previousSibling === marker &&
				(nodeValue === " " || (nodeValue.length === 1 && nodeValue.charCodeAt(0) === 160))
			) {
				isTrue = true;
				break;
			}
		}
		
		this.popMarker();
		return isTrue;
	},
	
	saveSelection: function() {
		return this.rng();
	},
	
	restoreSelection: function(bookmark) {
		bookmark.select();
	}
});

/**
 * Base for W3C Standard Engine
 * 
 * @requires XQuared.js
 * @requires rdom/Base.js
 */
xq.rdom.W3 = xq.Class(xq.rdom.Base,
	/**
	 * @name xq.rdom.W3
	 * @lends xq.rdom.W3.prototype
	 * @extends xq.rdom.Base
	 * @constructor
	 */
	{
	insertNode: function(node) {
		var rng = this.rng();
		
		if(!rng) {
			this.getRoot().appendChild(node);
		} else {
			rng.insertNode(node);
			rng.selectNode(node);
			rng.collapse(false);
		}
		return node;
	},
	
	removeTrailingWhitespace: function(block) {
		// TODO: do nothing
	},
	
	getOuterHTML: function(element) {
		var div = element.ownerDocument.createElement("div");
		div.appendChild(element.cloneNode(true));
		return div.innerHTML;
	},
	
	correctEmptyElement: function(element) {
		if(!element || element.nodeType !== 1 || this.tree.isAtomic(element)) return;
		
		if(element.firstChild)
			this.correctEmptyElement(element.firstChild);
		else
			element.appendChild(this.makePlaceHolder());
	},
	
	correctParagraph: function() {
		if(this.hasSelection()) return false;
		
		var block = this.getCurrentBlockElement();
		var modified = false;
		
		if(!block) {
			try {
				this.execCommand("InsertParagraph");
				modified = true;
			} catch(ignored) {}
		} else if(this.tree.isBlockOnlyContainer(block)) {
			this.execCommand("InsertParagraph");
			
			// check for HR
			var newBlock = this.getCurrentElement();
			
			if(this.tree.isAtomic(newBlock.previousSibling) && newBlock.previousSibling.nodeName === "HR") {
				var nextBlock = this.tree.findForward(
					newBlock,
					function(node) {return this.tree.isBlock(node) && !this.tree.isBlockOnlyContainer(node)}.bind(this)
				);
				if(nextBlock) {
					this.deleteNode(newBlock);
					this.placeCaretAtStartOf(nextBlock);
				}
			}
			modified = true;
		} else if(this.tree.hasMixedContents(block)) {
			this.wrapAllInlineOrTextNodesAs("P", block, true);
			modified = true;
		}
		
		// insert placeholder - part 1
		block = this.getCurrentBlockElement();
		if(this.tree.isBlock(block) && !this._hasPlaceHolderAtEnd(block)) {
			block.appendChild(this.makePlaceHolder());
			modified = true;
		}
		
		// insert placeholder - part 2
		if(this.tree.isBlock(block)) {
			var parentsLastChild = block.parentNode.lastChild;
			if(this.isPlaceHolder(parentsLastChild)) {
				this.deleteNode(parentsLastChild);
				modified = true;
			}
		}
		
		// remove empty elements
		if(this.tree.isBlock(block)) {
			var nodes = block.childNodes;
			for(var i = 0; i < nodes.length; i++) {
				var node = nodes[i];
				if(node.nodeType === 1 && !this.tree.isAtomic(node) && !node.hasChildNodes() && !this.isPlaceHolder(node)) {
					this.deleteNode(node);
				}
			}
		}
		
		return modified;
	},
	
	_hasPlaceHolderAtEnd: function(block) {
		if(!block.hasChildNodes()) return false;
		return this.isPlaceHolder(this.getLastChild(block, true)) || this._hasPlaceHolderAtEnd(this.getLastChild(block));
	},
	
	applyBackgroundColor: function(color) {
		this.execCommand("styleWithCSS", "true");
		this.execCommand("hilitecolor", color);
		this.execCommand("styleWithCSS", "false");
		
		// 0. Save current selection
		var bookmark = this.saveSelection();
		
		// 1. Get selected blocks
		var blocks = this.getSelectedBlockElements();
		if(blocks.length === 0) return;
		
		// 2. Apply background-color to all adjust inline elements
		// 3. Remove background-color from blocks
		for(var i = 0; i < blocks.length; i++) {
			if((i === 0 || i === blocks.length-1) && !blocks[i].style.backgroundColor) continue;
			
			var spans = this.wrapAllInlineOrTextNodesAs("SPAN", blocks[i], true);
			for(var j = 0; j < spans.length; j++) {
				spans[j].style.backgroundColor = color;
			}
			blocks[i].style.backgroundColor = "";
		}
		
		// 4. Restore selection
		this.restoreSelection(bookmark);
	},
	
	
	
	
	//////
	// Commands
	execCommand: function(commandId, param) {
		return this.getDoc().execCommand(commandId, false, param || null);
	},
	
	applyRemoveFormat: function() {
		this.execCommand("RemoveFormat");
	},
	applyRemoveLink: function() {
		this.execCommand("Unlink");
	},
	applyEmphasis: function() {
		// Generate <i> tag. It will be replaced with <emphasis> tag during cleanup phase.
		this.execCommand("styleWithCSS", "false");
		this.execCommand("italic");
	},
	applyStrongEmphasis: function() {
		// Generate <b> tag. It will be replaced with <strong> tag during cleanup phase.
		this.execCommand("styleWithCSS", "false");
		this.execCommand("bold");
	},
	applyStrike: function() {
		// Generate <strike> tag. It will be replaced with <style class="strike"> tag during cleanup phase.
		this.execCommand("styleWithCSS", "false");
		this.execCommand("strikethrough");
	},
	applyUnderline: function() {
		// Generate <u> tag. It will be replaced with <em class="underline"> tag during cleanup phase.
		this.execCommand("styleWithCSS", "false");
		this.execCommand("underline");
	},
	
	
	
	//////
	// Focus/Caret/Selection
	
	focus: function() {
		this.getWin().focus();
	},
	
	sel: function() {
		return this.getWin().getSelection();
	},
	
	rng: function() {
		var sel = this.sel();
		return (sel === null || sel.rangeCount === 0) ? null : sel.getRangeAt(0);
	},
	
	saveSelection: function() {
		var rng = this.rng();
		return [rng.startContainer, rng.startOffset, rng.endContainer, rng.endOffset];
	},
	
	restoreSelection: function(bookmark) {
		var rng = this.rng();
		rng.setStart(bookmark[0], bookmark[1]);
		rng.setEnd(bookmark[2], bookmark[3]);
	},
	
	hasSelection: function() {
		var sel = this.sel();
		return sel && !sel.isCollapsed;
	},
	
	deleteSelection: function() {
		this.rng().deleteContents();
		this.sel().collapseToStart();
	},
	
	selectElement: function(element, entireElement) {throw "Not implemented yet"},

	selectBlocksBetween: function(start, end) {
		// @WORKAROUND: required to avoid FF selection bug.
		try {
			if(!xq.Browser.isMac) this.getDoc().execCommand("SelectAll", false, null);
		} catch(ignored) {}
		
		var rng = this.rng();
		rng.setStart(start.firstChild, 0);
		rng.setEnd(end, end.childNodes.length);
	},

	collapseSelection: function(toStart) {
		var rng = this.rng();
		if(rng) rng.collapse(toStart);
	},
	
	placeCaretAtStartOf: function(element) {
		while(this.tree.isBlock(element.firstChild)) {
			element = element.firstChild;
		}
		this.selectElement(element, false);
		this.collapseSelection(true);
	},
	
	placeCaretAtEndOf: function(element) {
		while(this.tree.isBlock(element.lastChild)) {
			element = element.lastChild;
		}
		this.selectElement(element, false);
		this.collapseSelection(false);
	},
	
	getSelectionAsHtml: function() {
		var container = document.createElement("div");
		container.appendChild(this.rng().cloneContents());
		return container.innerHTML;
	},
	
	getSelectionAsText: function() {
		return this.rng().toString()
	},
	
	hasImportantAttributes: function(element) {
		return !!(element.id || element.className || element.style.cssText);
	},
	
	isEmptyBlock: function(element) {
		if(!element.hasChildNodes()) return true;
		var children = element.childNodes;
		for(var i = 0; i < children.length; i++) {
			if(!this.isPlaceHolder(children[i]) && !this.isEmptyTextNode(children[i])) return false;
		}
		return true;
	},
	
	getLastChild: function(element, includePlaceHolder) {
		if(!element || !element.hasChildNodes()) return null;
		
		var nodes = xq.$A(element.childNodes).reverse();
		
		for(var i = 0; i < nodes.length; i++) {
			if((includePlaceHolder || !this.isPlaceHolder(nodes[i])) && !this.isEmptyTextNode(nodes[i])) return nodes[i];
		}
		return null;
	},
	
	getCurrentElement: function() {
		var rng = this.rng();
		if(!rng) return null;
		
		var container = rng.startContainer;
		
		if(container.nodeType === 3) {
			return container.parentNode;
		} else if(this.tree.isBlockOnlyContainer(container)) {
			return container.childNodes[rng.startOffset];
		} else {
			return container;
		}
	},

	getBlockElementsAtSelectionEdge: function(naturalOrder, ignoreEmptyEdges) {
		var start = this.getBlockElementAtSelectionStart();
		var end = this.getBlockElementAtSelectionEnd();
		
		var reversed = false;
		
		if(naturalOrder && start !== end && this.tree.checkTargetBackward(start, end)) {
			var temp = start;
			start = end;
			end = temp;
			
			reversed = true;
		}
		
		if(ignoreEmptyEdges && start !== end) {
			// @TODO: Firefox sometimes selects one more block.
/*
			
			var sel = this.sel();
			if(reversed) {
				if(sel.focusNode.nodeType === 1) start = start.nextSibling;
				if(sel.anchorNode.nodeType === 3 && sel.focusOffset === 0) end = end.previousSibling;
			} else {
				if(sel.anchorNode.nodeType === 1) start = start.nextSibling;
				if(sel.focusNode.nodeType === 3 && sel.focusOffset === 0) end = end.previousSibling;
			}
*/
		}
		
		return [start, end];
	},

	isCaretAtBlockEnd: function() {
		if(this.isCaretAtEmptyBlock()) return true;
		if(this.hasSelection()) return false;
		
		var node = this.getCurrentBlockElement();
		var marker = this.pushMarker();
		
		var isTrue = false;
		while (node = this.getLastChild(node)) {
			var nodeValue = node.nodeValue;
			
			if (node === marker) {
				isTrue = true;
				break;
			}
		}
		
		this.popMarker();
		return isTrue;
	},
	
	getBlockElementAtSelectionStart: function() {
		var block = this.getParentBlockElementOf(this.sel().anchorNode);
		
		// find bottom-most first block child
		while(this.tree.isBlockContainer(block) && block.firstChild && this.tree.isBlock(block.firstChild)) {
			block = block.firstChild;
		}
		
		return block;
	},
	
	getBlockElementAtSelectionEnd: function() {
		var block = this.getParentBlockElementOf(this.sel().focusNode);
		
		// find bottom-most last block child
		while(this.tree.isBlockContainer(block) && block.lastChild && this.tree.isBlock(block.lastChild)) {
			block = block.lastChild;
		}
		
		return block;
	}
});

/**
 * @requires XQuared.js
 * @requires rdom/W3.js
 */
xq.rdom.Gecko = xq.Class(xq.rdom.W3,
	/**
	 * @name xq.rdom.Gecko
	 * @lends xq.rdom.Gecko.prototype
	 * @extends xq.rdom.W3
	 * @constructor
	 */
	{
	makePlaceHolder: function() {
		var holder = this.createElement("BR");
		holder.setAttribute("type", "_moz");
		return holder;
	},
	
	makePlaceHolderString: function() {
		return '<br type="_moz" />';
	},
	
	makeEmptyParagraph: function() {
		return this.createElementFromHtml('<p><br type="_moz" /></p>');
	},

	isPlaceHolder: function(node) {
		return node.nodeName === "BR" && (node.getAttribute("type") === "_moz" || !this.getNextSibling(node));
	},

	selectElement: function(element, entireElement) {
		if(!element) throw "[element] is null";
		if(element.nodeType !== 1) throw "[element] is not an element";

		// @WORKAROUND: required to avoid Windows FF selection bug.
		try {
			if(!xq.Browser.isMac) this.getDoc().execCommand("SelectAll", false, null);
		} catch(ignored) {}
		
		var rng = this.rng() || this.getDoc().createRange();
		
		if(entireElement) {
			rng.selectNode(element);
		} else {
			rng.selectNodeContents(element);
		}
	}
});

/**
 * @requires XQuared.js
 * @requires rdom/W3.js
 */
xq.rdom.Webkit = xq.Class(xq.rdom.W3,
	/**
	 * @name xq.rdom.Webkit
	 * @lends xq.rdom.Webkit.prototype
	 * @extends xq.rdom.Base
	 * @constructor
	 */
	{
	makePlaceHolder: function() {
		var holder = this.createElement("BR");
		holder.className = "webkit-block-placeholder";
		return holder;
	},
	
	makePlaceHolderString: function() {
		return '<br class="webkit-block-placeholder" />';
	},
	
	makeEmptyParagraph: function() {
		return this.createElementFromHtml('<p><br class="webkit-block-placeholder" /></p>');
	},
	
	isPlaceHolder: function(node) {
		return node.className === "webkit-block-placeholder";
	},

	selectElement: function(element, entireElement) {
		if(!element) throw "[element] is null";
		if(element.nodeType !== 1) throw "[element] is not an element";
		
		var rng = this.rng() || this.getDoc().createRange();
		if(entireElement) {
			rng.selectNode(element);
		} else {
			rng.selectNodeContents(element);
		}
		
		this._setSelectionByRange(rng);
	},

	getSelectionAsHtml: function() {
		var container = this.createElement("div");
		var rng = this.rng();
		var contents = this.rng().cloneContents();
		if(contents) container.appendChild(contents);
		return container.innerHTML;
	},

	collapseSelection: function(toStart) {
		var rng = this.rng();
		rng.collapse(toStart);
		this._setSelectionByRange(rng);
	},

	_setSelectionByRange: function(rng) {
		var sel = this.sel();
		sel.setBaseAndExtent(rng.startContainer, rng.startOffset, rng.endContainer, rng.endOffset);
	}
});
/**
 * Creates and returns instance of browser specific implementation.
 * 
 * @requires XQuared.js
 * @requires rdom/Base.js
 * @requires rdom/Trident.js
 * @requires rdom/Gecko.js
 * @requires rdom/Webkit.js
 */
xq.rdom.Base.createInstance = function() {
	if(xq.Browser.isTrident) {
		return new xq.rdom.Trident();
	} else if(xq.Browser.isWebkit) {
		return new xq.rdom.Webkit();
	} else {
		return new xq.rdom.Gecko();
	}
}
/**
 * @namespace
 */
xq.validator = {}

/**
 * @requires XQuared.js
 * @requires Browser.js
 * @requires rdom/Factory.js
 */
xq.validator.Base = xq.Class(/** @lends xq.validator.Base.prototype */{
	/**
     * @constructs
	 */
	initialize: function(curUrl, urlValidationMode, whitelist) {
		xq.addToFinalizeQueue(this);
		xq.asEventSource(this, "Validator", ["Preprocessing", "BeforeDomValidation", "AfterDomValidation", "BeforeStringValidation", "AfterStringValidation", "BeforeDomInvalidation", "AfterDomInvalidation", "BeforeStringInvalidation", "AfterStringInvalidation"]);
		
		this.whitelist = whitelist || xq.predefinedWhitelist;
		this.pRGB = xq.compilePattern("rgb\\((\\d+),\\s*(\\d+),\\s*(\\d+)\\)");
		
		this.curUrl = curUrl;
		this.curUrlParts = curUrl ? curUrl.parseURL() : null;
		this.urlValidationMode = urlValidationMode;
	},
	
	/**
	 * Perform validation on given element
	 *
	 * @param {Element} element Target element. It is not affected by validation.
	 *
	 * @returns {String} Validated HTML string
	 */
	validate: function(element, dontClone) {
		// DOM validation
		element = dontClone ? element : element.cloneNode(true);
		this._fireOnBeforeDomValidation(element);
		this.validateDom(element);
		this._fireOnAfterDomValidation(element);
		
		// String validation
		var html = {value: element.innerHTML};
		this._fireOnBeforeStringValidation(html);
		html.value = this.validateString(html.value);
		this._fireOnAfterStringValidation(html);
		
		return html.value;
	},
	
	validateDom: function(element) {throw "Not implemented";},
	validateString: function(html) {throw "Not implemented";},
	
	/**
	 * Perform invalidation on given element to make the designmode works well.
	 *
	 * @param {String} html HTML string.
	 * @returns {String} Invalidated HTML string
	 */
	invalidate: function(html) {
		// Preprocessing
		var html = {value: html};
		this._fireOnPreprocessing(html);
		
		// DOM invalidation
		var element = document.createElement("DIV");
		element.innerHTML = html.value;
		this._fireOnBeforeDomInvalidation(element);
		this.invalidateDom(element);
		this._fireOnAfterDomInvalidation(element);
		
		// String invalidation
		html.value = element.innerHTML;
		this._fireOnBeforeStringInvalidation(html);
		html.value = this.invalidateString(html.value);
		this._fireOnAfterStringInvalidation(html);
		
		return html.value;
	},
	
	invalidateDom: function(element) {throw "Not implemented"},
	invalidateString: function(html) {throw "Not implemented"},
	
	/**
	 * em.class="underline" -> u
	 * span.class="strike" -> strike
	 */ 
	invalidateStrikesAndUnderlines: function(element) {
		var rdom = xq.rdom.Base.createInstance();
		rdom.setRoot(element);

		var nameOfClassName = xq.Browser.isTrident ? "className" : "class";
		
		var underlines = xq.getElementsByClassName(rdom.getRoot(), "underline", "em");
		var pUnderline = xq.compilePattern("(^|\\s)underline($|\\s)");
		var lenOfUnderlines = underlines.length;
		for(var i = 0; i < lenOfUnderlines; i++) {
			rdom.replaceTag("u", underlines[i]).removeAttribute(nameOfClassName);
		}
		
		var strikes = xq.getElementsByClassName(rdom.getRoot(), "strike", "span")
		var pStrike = xq.compilePattern("(^|\\s)strike($|\\s)");
		var lenOfStrikes = strikes.length;
		for(var i = 0; i < lenOfStrikes; i++) {
			rdom.replaceTag("strike", strikes[i]).removeAttribute(nameOfClassName);
		}
	},
	
	validateStrike: function(content) {
		content = content.replace(/<strike(>|\s+[^>]*>)/ig, "<span class=\"strike\"$1");
		content = content.replace(/<\/strike>/ig, "</span>");
		return content;
	},
	
	validateUnderline: function(content) {
		content = content.replace(/<u(>|\s+[^>]*>)/ig, "<em class=\"underline\"$1");
		content = content.replace(/<\/u>/ig, "</em>");
		return content;
	},
	
	replaceTag: function(content, from, to) {
		return content.replace(new RegExp("(</?)" + from + "(>|\\s+[^>]*>)", "ig"), "$1" + to + "$2");
	},
	
	validateSelfClosingTags: function(content) {
		return content.replace(/<(br|hr|img|value)([^>]*?)>/img, function(str, tag, attrs) {
			return "<" + tag + attrs + " />"
		});
	},
	
	validateFont: function(element) {
		var rdom = xq.rdom.Base.createInstance();
		rdom.setRoot(element);
		
		// It should be reversed to deal with nested elements
		var fonts = element.getElementsByTagName('FONT');
		var fontSizes = ["x-small", "small", "medium", "large", "x-large", "xx-large"];
		var len = fonts.length - 1;
		for(var i = len; i >= 0; i--) {
			var font = fonts[i];
			var color = font.getAttribute('color');
			var backgroundColor = font.style.backgroundColor;
			var face = font.getAttribute('face');
			var size = fontSizes[parseInt(font.getAttribute('size')) % 8 - 1];
			
			if(color || backgroundColor || face || size) {
				var span = rdom.replaceTag("span", font);
				span.removeAttribute('color');
				span.removeAttribute('face');
				span.removeAttribute('size');
				
				if(color) span.style.color = color;
				if(backgroundColor) span.style.backgroundColor = backgroundColor;
				if(face) span.style.fontFamily = face;
				if(size) span.style.fontSize = size;
			}
		}
	},
	
	invalidateFont: function(element) {
		var rdom = xq.rdom.Base.createInstance();
		rdom.setRoot(element);

		// It should be reversed to deal with nested elements
		var spans = element.getElementsByTagName('SPAN');
		var fontSizes = {"x-small":1, "small":2, "medium":3, "large":4, "x-large":5, "xx-large":6};
		var len = spans.length - 1;
		for(var i = len; i >= 0; i--) {
			var span = spans[i];
			if(span.className === "strike") continue;
			
			var color = span.style.color;
			var backgroundColor = span.style.backgroundColor;
			var face = span.style.fontFamily;
			var size = fontSizes[span.style.fontSize];
			
			if(color || backgroundColor || face || size) {
				var font = rdom.replaceTag("font", span);
				font.style.cssText = "";
				
				if(color) font.setAttribute('color', this.asRGB(color));
				if(backgroundColor) font.style.backgroundColor = backgroundColor;
				if(face) font.setAttribute('face', face);
				if(size) font.setAttribute('size', size);
			}
		}
	},
	
	asRGB: function(color) {
		if(color.indexOf("#") === 0) return color;
		
		var m = this.pRGB.exec(color);
		if(!m) return color;
		
		var r = Number(m[1]).toString(16);
		var g = Number(m[2]).toString(16);
		var b = Number(m[3]).toString(16);
		
		if(r.length === 1) r = "0" + r;
		if(g.length === 1) g = "0" + g;
		if(b.length === 1) b = "0" + b;
		
		return "#" + r + g + b;
	},
	
	removeComments: function(content) {
		return content.replace(/<!--(\n|\r|.)*?-->/img, '');
	},
	
	removeDangerousElements: function(element) {
		var tags = ['SCRIPT'];
		for(var i = 0; i < tags.length; i++) {
			var elements = element.getElementsByTagName(tags[i]);
			for(var k = elements.length - 1; k >= 0; k--) {
				elements[k].parentNode.removeChild(elements[k]);
			}
		}
	},
	
	addNbspToEmptyBlocks: function(content) {
		var blocks = new xq.DomTree().getBlockTags().join("|");
		var regex = new RegExp("<(" + blocks + ")([^>]+?)?>\\s*?</(" + blocks + ")>", "img");
		return content.replace(regex, '<$1$2>&nbsp;</$3>');
	},
	
	applyWhitelist: function(content) {
		var whitelist = this.whitelist;
		var allowedAttrs = null;
		
		var p1 = xq.compilePattern("(^|\\s\")([^\"=]+)(\\s|$)", "g");
		var p2 = xq.compilePattern("(\\S+?)=\"[^\"]*\"", "g");
		return content.replace(new RegExp("(</?)([^>]+?)(>|\\s+([^>]*?)(\\s?/?)>)", "g"), function(str, head, tag, tail, attrs, selfClosing) {
			allowedAttrs = whitelist[tag];
			if(!allowedAttrs) return '';
			
			if(attrs) {
				if(xq.Browser.isTrident) attrs = attrs.replace(p1, '$1$2="$2"$3');
				
				var sb = [];
				var m = attrs.match(p2);
				for(var i = 0; i < m.length; i++) {
					var name = m[i].split('=')[0];
					if(allowedAttrs.indexOf(name.toLowerCase()) !== -1) sb.push(m[i]);
				}
				
				if(sb.length) {
					attrs = sb.join(' ');
					return head + tag + ' ' + attrs + selfClosing + '>';
				} else {
					return head + tag + selfClosing + '>';
				}
			} else {
				return str;
			}
		});
	},
	
	// TODO: very expansive
	makeUrlsRelative: function(content) {
		var curUrl = this.curUrl;
		var urlParts = this.curUrlParts;
		
		var p1 = xq.compilePattern("(href|src)=\"([^\"]+)\"", "g");
		var p2 = xq.compilePattern("^\\w+://");
		
		// 1. find attributes and...
		return content.replace(/(<\w+\s+)(\/|([^>]+?)(\/?))>/g, function(str, head, ignored, attrs, tail) {
			if(attrs) {
				// 2. validate URL part
				attrs = attrs.replace(p1, function(str, name, url) {
					// 3. first, make it absolute
					var abs = null;
					if(url.charAt(0) === '#') {
						abs = urlParts.includeQuery + url;
					} else if(url.charAt(0) === '?') {
						abs = urlParts.includePath + url;
					} else if(url.charAt(0) === '/') {
						abs = urlParts.includeHost + url;
					} else if(url.match(p2)) {
						abs = url;
					} else {
						abs = urlParts.includeBase + url;
					}
					
					// 4. make it relative by removing same part
					var rel = abs;
					
					if(abs === urlParts.includeHost) {
						rel = "/";
					} else if(abs.indexOf(urlParts.includeQuery) === 0) {
						rel = abs.substring(urlParts.includeQuery.length);
					} else if(abs.indexOf(urlParts.includePath) === 0) {
						rel = abs.substring(urlParts.includePath.length);
					} else if(abs.indexOf(urlParts.includeBase) === 0) {
						rel = abs.substring(urlParts.includeBase.length);
					} else if(abs.indexOf(urlParts.includeHost) === 0) {
						rel = abs.substring(urlParts.includeHost.length);
					}
					
					if(rel === '') rel = '#';
					
					return name + '="' + rel + '"';
				});
				
				return head + attrs + tail + '>';
			} else {
				return str;
			}
		});
		
		return content;
	},
	
	// TODO: very expansive
	makeUrlsHostRelative: function(content) {
		var curUrl = this.curUrl;
		var urlParts = this.curUrlParts;
		
		var p1 = xq.compilePattern("(href|src)=\"([^\"]+)\"", "g");
		var p2 = xq.compilePattern("^\\w+://");
		
		// 1. find attributes and...
		return content.replace(/(<\w+\s+)(\/|([^>]+?)(\/?))>/g, function(str, head, ignored, attrs, tail) {
			if(attrs) {
				// 2. validate URL part
				attrs = attrs.replace(p1, function(str, name, url) {
					// 3. first, make it absolute
					var abs = null;
					if(url.charAt(0) === '#') {
						abs = urlParts.includeQuery + url;
					} else if(url.charAt(0) === '?') {
						abs = urlParts.includePath + url;
					} else if(url.charAt(0) === '/') {
						abs = urlParts.includeHost + url;
					} else if(url.match(p2)) {
						abs = url;
					} else {
						abs = urlParts.includeBase + url;
					}
					
					// 4. make it relative by removing same part
					var rel = abs;
					if(abs === urlParts.includeHost) {
						rel = "/";
					} else if(abs.indexOf(urlParts.includeQuery) === 0 && abs.indexOf("#") !== -1) {
						// same except for fragment-part?
						rel = abs.substring(abs.indexOf("#"));
					} else if(abs.indexOf(urlParts.includeHost) === 0) {
						// same host?
						rel = abs.substring(urlParts.includeHost.length);
					}
					
					if(rel === '') rel = '#';
					
					return name + '="' + rel + '"';
				});
				
				return head + attrs + tail + '>';
			} else {
				return str;
			}
		});
		
		return content;
	},
	
	// TODO: very expansive
	makeUrlsAbsolute: function(content) {
		var curUrl = this.curUrl;
		var urlParts = this.curUrlParts;
		
		var p1 = xq.compilePattern("(href|src)=\"([^\"]+)\"", "g");
		var p2 = xq.compilePattern("^\\w+://");
		
		// 1. find attributes and...
		return content.replace(/(<\w+\s+)(\/|([^>]+?)(\/?))>/g, function(str, head, ignored, attrs, tail) {
			if(attrs) {
				// 2. validate URL part
				attrs = attrs.replace(p1, function(str, name, url) {
					var abs = null;
					if(url.charAt(0) === '#') {
						abs = urlParts.includeQuery + url;
					} else if(url.charAt(0) === '?') {
						abs = urlParts.includePath + url;
					} else if(url.charAt(0) === '/') {
						abs = urlParts.includeHost + url;
					} else if(url.match(p2)) {
						abs = url;
					} else {
						abs = urlParts.includeBase + url;
					}

					return name + '="' + abs + '"';
				});
				
				return head + attrs + tail + '>';
			} else {
				return str;
			}
		});
	}
});
/**
 * @requires XQuared.js
 * @requires validator/Base.js
 */
xq.validator.Trident = xq.Class(xq.validator.Base,
	/**
	 * @name xq.validator.Trident
	 * @lends xq.validator.Trident.prototype
	 * @extends xq.validator.Base
	 * @constructor
	 */
	{
	validateDom: function(element) {
		this.removeDangerousElements(element);
		this.validateFont(element);
	},
	
	validateString: function(html) {
		try {
			html = this.addNbspToEmptyBlocks(html);
			html = this.validateStrike(html);
			html = this.validateUnderline(html);
			html = this.performFullValidation(html);
		} catch(ignored) {}
		
		return html;
	},
	
	invalidateDom: function(element) {
		this.invalidateFont(element);
		this.invalidateStrikesAndUnderlines(element);
	},
	
	invalidateString: function(html) {
		html = this.removeComments(html);
		return html;
	},
	
	performFullValidation: function(html) {
		html = this.lowerTagNamesAndUniformizeQuotation(html);
		html = this.validateSelfClosingTags(html);
		html = this.applyWhitelist(html);
		
		if(this.urlValidationMode === 'relative') {
			html = this.makeUrlsRelative(html);
		} else if(this.urlValidationMode === 'host_relative') {
			html = this.makeUrlsHostRelative(html);
		} else if(this.urlValidationMode === 'absolute') {
			// Trident always use absolute URL so we don't need to do anything.
			//
			// html = this.makeUrlsAbsolute(html);
		}
		
		return html;
	},
	
	lowerTagNamesAndUniformizeQuotation: function(html) {
		this.pAttrQuotation1 = xq.compilePattern("\\s(\\w+?)=\\s+\"([^\"]+)\"", "mg");
		this.pAttrQuotation2 = xq.compilePattern("\\s(\\w+?)=([^ \"]+)", "mg");
		this.pAttrQuotation3 = xq.compilePattern("\\sNAME=\"(\\w+?)\" VALUE=\"(\\w+?)\"", "mg");

		// Uniformize quotation, turn tag names and attribute names into lower case
		html = html.replace(/<(\/?)(\w+)([^>]*?)>/img, function(str, closingMark, tagName, attrs) {
			return "<" + closingMark + tagName.toLowerCase() + this.correctHtmlAttrQuotation(attrs) + ">";
		}.bind(this));
		
		return html;
	},
	
	correctHtmlAttrQuotation: function(html) {
		html = html.replace(this.pAttrQuotation1, function (str, name, value) {return " " + name.toLowerCase() + '=' + '"' + value + '"'});
		html = html.replace(this.pAttrQuotation2, function (str, name, value) {return " " + name.toLowerCase() + '=' + '"' + value + '"'});
		html = html.replace(this.pAttrQuotation3, function (str, name, value) {return " name=\"" + name + "\" value=\"" + value + "\""});
		return html;
	}
});
/**
 * @requires XQuared.js
 * @requires validator/Base.js
 */
xq.validator.W3 = xq.Class(xq.validator.Base,
	/**
	 * @name xq.validator.W3
	 * @lends xq.validator.W3.prototype
	 * @extends xq.validator.Base
	 * @constructor
	 */
	{
	validateDom: function(element) {
		var rdom = xq.rdom.Base.createInstance();
		rdom.setRoot(element);
		this.removeDangerousElements(element);
		rdom.removePlaceHoldersAndEmptyNodes(element);
		this.validateFont(element);
	},
	
	validateString: function(html) {
		try {
			html = this.replaceTag(html, "b", "strong");
			html = this.replaceTag(html, "i", "em");
			
			html = this.removeComments(html);
			html = this.validateStrike(html);
			html = this.validateUnderline(html);
			html = this.addNbspToEmptyBlocks(html);
			html = this.performFullValidation(html);
			html = this.insertNewlineBetweenBlockElements(html);
			
		} catch(ignored) {}
		
		return html;
	},
	
	invalidateDom: function(element) {
		this.invalidateFont(element);
		this.invalidateStrikesAndUnderlines(element);
	},
	
	invalidateString: function(html) {
		html = this.replaceTag(html, "strong", "b");
		html = this.replaceTag(html, "em", "i");
		html = this.removeComments(html);
		html = this.replaceNbspToBr(html);
		return html;
	},
	
	performFullValidation: function(html) {
		html = this.validateSelfClosingTags(html);
		html = this.applyWhitelist(html);
		
		if(this.urlValidationMode === 'relative') {
			html = this.makeUrlsRelative(html);
		} else if(this.urlValidationMode === 'host_relative') {
			html = this.makeUrlsHostRelative(html);
		} else if(this.urlValidationMode === 'absolute') {
			html = this.makeUrlsAbsolute(html);
		}

		return html;
	},
	
	insertNewlineBetweenBlockElements: function(html) {
		var blocks = new xq.DomTree().getBlockTags().join("|");
		var regex = new RegExp("</(" + blocks + ")>([^\n])", "img");
		return html.replace(regex, '</$1>\n$2');
	},
	
	replaceNbspToBr: function(content) {
		var blocks = new xq.DomTree().getBlockTags().join("|");
		
		// Safari replaces &nbsp; into \xA0
		var regex = new RegExp("<(" + blocks + ")([^>]+?)?>(&nbsp;|\xA0)?</(" + blocks + ")>", "img");
		var rdom = xq.rdom.Base.createInstance();
		return content.replace(regex, '<$1$2>' + rdom.makePlaceHolderString() + '</$4>');
	}
});

/**
 * @requires XQuared.js
 * @requires validator/W3.js
 */
xq.validator.Gecko = xq.Class(xq.validator.W3,
	/**
	 * @name xq.validator.Gecko
	 * @lends xq.validator.Gecko.prototype
	 * @extends xq.validator.W3
	 * @constructor
	 */
	{
});
/**
 * @requires XQuared.js
 * @requires validator/W3.js
 */
xq.validator.Webkit = xq.Class(xq.validator.W3,
	/**
	 * @name xq.validator.Webkit
	 * @lends xq.validator.Webkit.prototype
	 * @extends xq.validator.W3
	 * @constructor
	 */
	{
	validateDom: function(element) {
		var rdom = xq.rdom.Base.createInstance();
		rdom.setRoot(element);
		this.removeDangerousElements(element);
		rdom.removePlaceHoldersAndEmptyNodes(element);
		this.validateAppleStyleTags(element);
	},
	
	validateString: function(html) {
		try {
			html = this.addNbspToEmptyBlocks(html);
			html = this.performFullValidation(html);
			html = this.insertNewlineBetweenBlockElements(html);
		} catch(ignored) {}
		
		return html;
	},
	
	invalidateDom: function(element) {
		this.invalidateAppleStyleTags(element);
	},
	
	invalidateString: function(html) {
		html = this.replaceTag(html, "strong", "b");
		html = this.replaceTag(html, "em", "i");
		html = this.removeComments(html);
		html = this.replaceNbspToBr(html);
		return html;
	},
	
	validateAppleStyleTags: function(element) {
		try {
			var rdom = xq.rdom.Base.createInstance();
			rdom.setRoot(element);
			
			var nodes = xq.getElementsByClassName(rdom.getRoot(), "Apple-style-span");
			var holder = [];
			
			for(var i = 0; i < nodes.length; i++) {
				var node = nodes[i];
				if(node.style.fontStyle === "italic") {
					// span -> em
					node = rdom.replaceTag("em", node);
					node.style.fontStyle = "";
					holder.push({node:node});
				} else if(node.style.fontWeight === "bold") {
					// span -> strong
					node = rdom.replaceTag("strong", node);
					node.style.fontWeight = "";
					holder.push({node:node});
				} else if(node.style.textDecoration === "underline") {
					// span -> em.underline
					node = rdom.replaceTag("em", node);
					node.style.textDecoration = "";
					holder.push({node:node, className: 'underline'});
				} else if(node.style.textDecoration === "line-through") {
					// span -> span.strike
					node.style.textDecoration = "";
					holder.push({node:node, className: 'strike'});
				} else if(node.style.verticalAlign === "super") {
					// span -> sup
					node = rdom.replaceTag("sup", node);
					node.style.verticalAlign = "";
					holder.push({node:node});
				} else if(node.style.verticalAlign === "sub") {
					// span -> sup
					node = rdom.replaceTag("sub", node);
					node.style.verticalAlign = "";
					holder.push({node:node});
				} else if(node.style.fontFamily) {
					// span -> span font-family
					holder.push({node:node});
				}
			}
			
			for (var j = 0; j < holder.length; j++){
				if (holder[j].className) {
					holder[j].node.className = holder[j].className;
				} else {
					holder[j].node.removeAttribute("class");
				}
			}
			
		} catch(e){
		}
	},
	
	invalidateAppleStyleTags: function(element) {
		var rdom = xq.rdom.Base.createInstance();
		rdom.setRoot(element);
		
		var len;
		// span.strike -> span, span... -> span
		var spans = rdom.getRoot().getElementsByTagName("span");
		for(var i = 0; i < spans.length; i++) {
			var node = spans[i];
			if(node.className == "strike") {
				node.className = "Apple-style-span";
				node.style.textDecoration = "line-through";
			} else if(node.style.fontFamily) {
				node.className = "Apple-style-span";
			}
			// TODO: bg/fg/font-size
		}

		// em -> span, em.underline -> span
		var ems = rdom.getRoot().getElementsByTagName("em");
		len = ems.length;
		for(var i = 0; i < len; i++) {
			var node = ems[0];
			node = rdom.replaceTag("span", node);
			if(node.className === "underline") {
				node.className = "Apple-style-span";
				node.style.textDecoration = "underline";
			} else {
				node.className = "Apple-style-span";
				node.style.fontStyle = "italic";
			}
		}
		
		// strong -> span
		var strongs = rdom.getRoot().getElementsByTagName("strong");
		len = strongs.length;
		
		for(var i = 0; i < len; i++) {
			var node = strongs[0];
			node = rdom.replaceTag("span", node);
			node.className = "Apple-style-span";
			node.style.fontWeight = "bold";
		}
		
		// sup -> span
		var sups = rdom.getRoot().getElementsByTagName("sup");
		len = sups.length;
		
		for(var i = 0; i < len; i++) {
			var node = sups[0];
			node = rdom.replaceTag("span", node);
			node.className = "Apple-style-span";
			node.style.verticalAlign = "super";
		}
		
		// sub -> span
		var subs = rdom.getRoot().getElementsByTagName("sub");
		len = subs.length;
		
		for(var i = 0; i < len; i++) {
			var node = subs[0];
			node = rdom.replaceTag("span", node);
			node.className = "Apple-style-span";
			node.style.verticalAlign = "sub";
		}
	}
});
/**
 * Creates and returns instance of browser specific implementation.
 * 
 * @requires XQuared.js
 * @requires validator/Base.js
 * @requires validator/Trident.js
 * @requires validator/Gecko.js
 * @requires validator/Webkit.js
 */
xq.validator.Base.createInstance = function(curUrl, urlValidationMode, whitelist) {
	if(xq.Browser.isTrident) {
		return new xq.validator.Trident(curUrl, urlValidationMode, whitelist);
	} else if(xq.Browser.isWebkit) {
		return new xq.validator.Webkit(curUrl, urlValidationMode, whitelist);
	} else {
		return new xq.validator.Gecko(curUrl, urlValidationMode, whitelist);
	}
}
/**
 * @requires XQuared.js
 * @requires rdom/Factory.js
 */
xq.EditHistory = xq.Class(/** @lends xq.EditHistory.prototype */{
    /**
	 * Manages editing history and performs UNDO/REDO.
	 *
     * @constructs
	 * @param {xq.rdom.Base} rdom Base instance
	 * @param {Number} [max=100] maximum UNDO buffer size.
	 */
	initialize: function(rdom, max) {
		xq.addToFinalizeQueue(this);
		if (!rdom) throw "IllegalArgumentException";

		this.disabled = false;
		this.max = max || 100;
		this.rdom = rdom;
		this.index = -1;
		this.queue = [];
		
		this.lastModified = Date.get();
	},
	getLastModifiedDate: function() {
		return this.lastModified;
	},
	isUndoable: function() {
		return this.queue.length > 0 && this.index > 0;
	},
	isRedoable: function() {
		return this.queue.length > 0 && this.index < this.queue.length - 1;
	},
	disable: function() {
		this.disabled = true;
	},
	enable: function() {
		this.disabled = false;
	},
	undo: function() {
		this.pushContent();
		
		if (this.isUndoable()) {
			this.index--;
			this.popContent();
			return true;
		} else {
			return false;
		}
	},
	redo: function() {
		if (this.isRedoable()) {
			this.index++;
			this.popContent();
			return true;
		} else {
			return false;
		}
	},
	onCommand: function() {
		this.lastModified = Date.get();
		if(this.disabled) return false;
		
		return this.pushContent();
	},
	onEvent: function(event) {
		this.lastModified = Date.get();
		if(this.disabled) return false;
		
		var arrowKeys = [33,34,35,36,37,39];
		// @WORKAROUND: Mac?�서 ?�살??up/down ?��? ??pushContent ?�면 캐럿???�다
		if(!xq.Browser.isMac) arrowKeys.push(38,40);
		
		// ignore some event types
		if(['blur', 'mouseup'].indexOf(event.type) !== -1) return false;
		
		// ignore normal keys
		if('keydown' === event.type && !(event.ctrlKey || event.metaKey)) return false;
		if(['keydown', 'keyup', 'keypress'].indexOf(event.type) !== -1 && !event.ctrlKey && !event.altKey && !event.metaKey && arrowKeys.indexOf(event.keyCode) === -1) return false;
		if(['keydown', 'keyup', 'keypress'].indexOf(event.type) !== -1 && (event.ctrlKey || event.metaKey) && [89,90].indexOf(event.keyCode) !== -1) return false;
		
		// ignore ctrl/shift/alt/meta keys
		if([16,17,18,224].indexOf(event.keyCode) !== -1) return false;
		
		return this.pushContent();
	},
	popContent: function() {
		this.lastModified = Date.get();
		var entry = this.queue[this.index];
		if (entry.caret > 0) {
			var html=entry.html.substring(0, entry.caret) + '<span id="caret_marker_eh"></span>' + entry.html.substring(entry.caret);
			this.rdom.getRoot().innerHTML = html;
		} else {
			this.rdom.getRoot().innerHTML = entry.html;
		}
		this.restoreCaret();
	},
	pushContent: function(ignoreCaret) {
		if(xq.Browser.isTrident && !ignoreCaret && !this.rdom.hasFocus()) return false;
		if(!this.rdom.getCurrentElement()) return false;

		var html = this.rdom.getRoot().innerHTML;
		if(html === (this.queue[this.index] ? this.queue[this.index].html : null)) return false;
		
		var caret = ignoreCaret ? -1 : this.saveCaret();
		
		if(this.queue.length >= this.max) {
			this.queue.shift();
		} else {
			this.index++;
		}
		
		this.queue.splice(this.index, this.queue.length - this.index, {html:html, caret:caret});
		return true;
	},
	clear: function() {
		this.index = -1;
		this.queue = [];
		this.pushContent(true);
	},
	saveCaret: function() {
		if(this.rdom.hasSelection()) return null;
		
		var marker = this.rdom.pushMarker();
		
		var str = xq.Browser.isTrident ? '<SPAN class='+marker.className : '<span class="'+marker.className+'"';
		var caret = this.rdom.getRoot().innerHTML.indexOf(str);
		
		this.rdom.popMarker(true);
		
		return caret;
	},
	restoreCaret: function() {
		var marker = this.rdom.$('caret_marker_eh');
		
		if(marker) {
			this.rdom.selectElement(marker, true);
			this.rdom.collapseSelection(false);
			this.rdom.deleteNode(marker);
		} else {
			var node = this.rdom.tree.findForward(this.rdom.getRoot(), function(node) {
				return this.isBlock(node) && !this.hasBlocks(node);
			}.bind(this.rdom.tree));
			this.rdom.selectElement(node, false);
			this.rdom.collapseSelection(false);
			
		}
	}
});

/**
 * @namespace
 */
xq.plugin = {};

/**
 * @requires XQuared.js
 */
xq.plugin.Base = xq.Class(/** @lends xq.plugin.Base.prototype */{
	/**
     * Abstract base class for Xquared plugins.
     * 
     * @constructs
     */
	initialize: function() {},
	
	/**
	 * Loads plugin. Automatically called by xq.Editor.
	 *
	 * @param {xq.Editor} editor Editor instance.
	 */
	load: function(editor) {
		this.editor = editor;
		if(this.isEventListener()) this.editor.addListener(this);
		
		this.onBeforeLoad(this.editor);
		this.editor.addShortcuts(this.getShortcuts() || []);
		this.editor.addAutocorrections(this.getAutocorrections() || []);
		this.editor.addAutocompletions(this.getAutocompletions() || []);
		this.editor.addTemplateProcessors(this.getTemplateProcessors() || []);
		this.editor.addContextMenuHandlers(this.getContextMenuHandlers() || []);
		this.onAfterLoad(this.editor);
	},
	
	/**
	 * Unloads plugin. Automatically called by xq.Editor
	 */
	unload: function() {
		this.onBeforeUnload(this.editor);
		for(var key in this.getShortcuts()) this.editor.removeShortcut(key);
		for(var key in this.getAutocorrections()) this.editor.removeAutocorrection(key);
		for(var key in this.getAutocompletions()) this.editor.removeAutocompletion(key);
		for(var key in this.getTemplateProcessors()) this.editor.removeTemplateProcessor(key);
		for(var key in this.getContextMenuHandlers()) this.editor.removeContextMenuHandler(key);
		this.onAfterUnload(this.editor);
	},
	
	
	
	/**
	 * Always returns false.<br />
	 * <br />
	 * Derived class may override this to make a plugin as a event listener.<br />
	 * Whenever you override this function, you should also implement at least one event handler for xq.Editor.
	 */
	isEventListener: function() {return false},
	
	/**
	 * Callback function. Derived class may override this.
	 */
	onBeforeLoad: function(editor) {},
	
	/**
	 * Callback function. Derived class may override this.
	 */
	onAfterLoad: function(editor) {},
	
	/**
	 * Callback function. Derived class may override this.
	 */
	onBeforeUnload: function(editor) {},
	
	/**
	 * Callback function. Derived class may override this.
	 */
	onAfterUnload: function(editor) {},
	
	/**
	 * Callback function. Derived class may override this.
	 */
	getShortcuts: function() {return [];},
	
	/**
	 * Callback function. Derived class may override this.
	 */
	getAutocorrections: function() {return [];},
	
	/**
	 * Callback function. Derived class may override this.
	 */
	getAutocompletions: function() {return [];},
	
	/**
	 * Callback function. Derived class may override this.
	 */
	getTemplateProcessors: function() {return [];},
	
	/**
	 * Callback function. Derived class may override this.
	 */
	getContextMenuHandlers: function() {return [];}
});
/**
 * @requires XQuared.js
 * @requires rdom/Base.js
 */
xq.RichTable = xq.Class(/** @lends xq.RichTable.prototype */{
	/**
	 * TODO: Add description
	 *
	 * @constructs
	 */
	initialize: function(rdom, table) {
		xq.addToFinalizeQueue(this);

		this.rdom = rdom;
		this.table = table;
	},
	collectCells: function(cell){
		var cells = [];
		var x = this.getXIndexOf(cell);
		var y = 0;
		while(true) {
			var cur = this.getCellAt(x, y);
			if(!cur) break;
			cells.push(cur);
			y++;
		}
		
		return cells
	},
	insertNewRowAt: function(tr, where) {
		var row = this.rdom.createElement("TR");
		var cells = tr.cells;
		for(var i = 0; i < cells.length; i++) {
			var cell = this.rdom.createElement(cells[i].nodeName);
			this.rdom.correctEmptyElement(cell);
			row.appendChild(cell);
		}
		return this.rdom.insertNodeAt(row, tr, where);
	},
	insertNewCellAt: function(cell, where) {
		var cells = this.collectCells(cell);
		
		// insert new cells
		for(var i = 0; i < cells.length; i++) {
			var cell = this.rdom.createElement(cells[i].nodeName);
			this.rdom.correctEmptyElement(cell);
			this.rdom.insertNodeAt(cell, cells[i], where);
		}
	},
	
	deleteTable: function(table) {
		return this.rdom.deleteNode(table);
	},
	deleteRow: function(tr) {
		return this.rdom.removeBlock(tr);
	},
	deleteCell: function(cell) {
		if(!cell.previousSibling && !cell.nextSibling) {
			this.rdom.deleteNode(this.table);
			return;
		}
		
		var cells = this.collectCells(cell);
		
		for(var i = 0; i < cells.length; i++) {
			this.rdom.deleteNode(cells[i]);
		}
	},
	getPreviousCellOf: function(cell) {
		if(cell.previousSibling) return cell.previousSibling;
		var adjRow = this.getPreviousRowOf(cell.parentNode);
		if(adjRow) return adjRow.lastChild;
		return null;
	},
	getNextCellOf: function(cell) {
		if(cell.nextSibling) return cell.nextSibling;
		var adjRow = this.getNextRowOf(cell.parentNode);
		if(adjRow) return adjRow.firstChild;
		return null;
	},
	getPreviousRowOf: function(row) {
		if(row.previousSibling) return row.previousSibling;
		var rowContainer = row.parentNode;
		if(rowContainer.previousSibling && rowContainer.previousSibling.lastChild) return rowContainer.previousSibling.lastChild;
		return null;
	},
	getNextRowOf: function(row) {
		if(row.nextSibling) return row.nextSibling;
		var rowContainer = row.parentNode;
		if(rowContainer.nextSibling && rowContainer.nextSibling.firstChild) return rowContainer.nextSibling.firstChild;
		return null;
	},
	getAboveCellOf: function(cell) {
		var row = this.getPreviousRowOf(cell.parentNode);
		if(!row) return null;
		
		var x = this.getXIndexOf(cell);
		return row.cells[x];
	},
	getBelowCellOf: function(cell) {
		var row = this.getNextRowOf(cell.parentNode);
		if(!row) return null;
		
		var x = this.getXIndexOf(cell);
		return row.cells[x];
	},
	getXIndexOf: function(cell) {
		var row = cell.parentNode;
		for(var i = 0; i < row.cells.length; i++) {
			if(row.cells[i] === cell) return i;
		}
		
		return -1;
	},
	getYIndexOf: function(cell) {
		var y = -1;
		
		// find y
		var group = row.parentNode;
		for(var i = 0; i <group.rows.length; i++) {
			if(group.rows[i] === row) {
				y = i;
				break;
			}
		}
		if(this.hasHeadingAtTop() && group.nodeName === "TBODY") y = y + 1;
		
		return y;
	},


	getTableProperty: function() {
		var prop = {
			width: this.table.style.width || null,
			height: this.table.style.height || null,
			textAlign: this.table.style.textAlign || null,
			borderColor: this.table.style.borderLeftColor || null,
			borderWidth: this.table.style.borderLeftWidth.replace(/ .*/, '').replace(/[^0-9]/g, '') || null,
			backgroundColor: this.table.style.backgroundColor || null
		};
		return prop;
	},
	setTableProperty: function(prop) {
		this._setTableProperty(this.table, prop);
	},
	getRowProperty: function(row) {
		var prop = {
			height: row.style.height || null,
			verticalAlign: row.style.verticalAlign || null,
			textAlign: row.style.textAlign || null,
			backgroundColor: row.style.backgroundColor || null
		};
		return prop;
	},
	setRowProperty: function(tr, prop) {
		this._setTableProperty(tr, prop);
	},
	getColumnProperty: function(cell) {
		var prop = {
			width: cell.style.width || null,
			verticalAlign: cell.style.verticalAlign || null,
			textAlign: cell.style.textAlign || null,
			backgroundColor: cell.style.backgroundColor || null
		};
		return prop;
	},
	setColumnProperty: function(cell, prop) {
		for (var i=0; i < cell.offsetParent.rows.length; i++) {
			this._setTableProperty(cell.offsetParent.rows[i].cells[cell.cellIndex], prop);
		}
	},

	_setTableProperty: function(el, prop) {
		for (propName in prop){
			if (prop[propName] != null){
				var value = typeof prop[propName] == 'string' ? prop[propName] : prop[propName].size + prop[propName].unit;
				
				if (propName == 'className') {
					el.className = prop.className || '';					
				} else if (propName != 'headerPositions'){
					var defaultPropName = (propName == 'width')? el.nodeName.toLowerCase() + 'Width' : propName;
					el.style[propName] = (xed.config.enableTableInlineStyle || (value.length != 0 && value != xq.RichTable.defaultPropertyValues[defaultPropName]))? value : '';
				}
			}
		}
	},

	
	/**
	 * TODO: Not used. Delete or not?
	 */
	getLocationOf: function(cell) {
		var x = this.getXIndexOf(cell);
		var y = this.getYIndexOf(cell);
		return {x:x, y:y};
	},
	getCellAt: function(col, row) {
		var row = this.getRowAt(row);
		return (row && row.cells.length > col) ? row.cells[col] : null;
	},
	getRowAt: function(index) {
		if(this.hasHeadingAtTop()) {
			return index === 0 ? this.table.tHead.rows[0] : this.table.tBodies[0].rows[index - 1];
		} else {
			var rows = this.table.tBodies[0].rows;
			return (rows.length > index) ? rows[index] : null;
		}
	},
	getDom: function() {
		return this.table;
	},
	hasHeadingAtTop: function() {
		return !!(this.table.tHead && this.table.tHead.rows[0]);
	},
	hasHeadingAtLeft: function() {
		return this.table.tBodies[0].rows[0].cells[0].nodeName === "TH";
	},
	correctEmptyCells: function() {
		var cells = xq.$A(this.table.getElementsByTagName("TH"));
		var tds = xq.$A(this.table.getElementsByTagName("TD"));
		for(var i = 0; i < tds.length; i++) {
			cells.push(tds[i]);
		}
		
		for(var i = 0; i < cells.length; i++) {
			if(this.rdom.isEmptyBlock(cells[i])) this.rdom.correctEmptyElement(cells[i])
		}
	}
});
xq.RichTable.defaultPropertyValues = {
	borderColor: '#000000',
	borderWidth: 1,
	backgroundColor: '#FFFFFF',
	tableWidth: '100%',
	columnWidth: 'auto',
	height: 'auto',
	textAlign: '',
	verticalAlign: 'top'
};
xq.RichTable.create = function(rdom, attrs) {
	if(["t", "tl", "lt"].indexOf(attrs.headerPositions) !== -1) var headingAtTop = true
	if(["l", "tl", "lt"].indexOf(attrs.headerPositions) !== -1) var headingAtLeft = true

	var sb = []
	sb.push('<table class="datatable2" style="width:100%;">')
	
	// thead
	if(headingAtTop) {
		sb.push('<thead><tr>')
		for(var i = 0; i < attrs.cols; i++) sb.push('<th></th>')
		sb.push('</tr></thead>')
		attrs.rows -= 1
	}
		
	// tbody
	sb.push('<tbody>')
	for(var i = 0; i < attrs.rows; i++) {
		sb.push('<tr>')
		
		for(var j = 0; j < attrs.cols; j++) {
			if(headingAtLeft && j === 0) {
				sb.push('<th></th>')
			} else {
				sb.push('<td></td>')
			}
		}
		
		sb.push('</tr>')
	}
	sb.push('</tbody>')
	
	sb.push('</table>')
	
	// create DOM element
	var container = rdom.createElement("div");
	container.innerHTML = sb.join("");
	
	// correct empty cells and return
	var rtable = new xq.RichTable(rdom, container.firstChild);
	rtable.correctEmptyCells();
	return rtable;
};
xq.RichTableController = {
	dialogType: null,
	initDialog: function(type, prop){
		// initial value
		xq.$("tableDialog").tableTypeField.value = '';
		this.changeType(xq.$("tableTypeDefaultValue"),'');
		
		xq.$("tableRowsField").value = "3";
		xq.$("tableColsField").value = "3";
		this.previewTable();
		
		var defaultValues = xq.RichTable.defaultPropertyValues;
		
		xq.getElementsByClassName(xq.$("tableDialog"), 'tableWidths')[0].selectedIndex = (type == 'new' || type == 'table')? 0 : 1
		xq.$("tableWidthValue").value = (type == 'new' || type == 'table')? defaultValues.tableWidth : defaultValues.columnWidth;
		xq.$("tableWidthValue").style.display = "none";
		xq.$("tableWidthValueUnit").value = "";
		
		xq.getElementsByClassName(xq.$("tableDialog"), 'tableHeights')[0].selectedIndex = 0;
		xq.$("tableHeightValue").value = defaultValues.height;
		xq.$("tableHeightValue").style.display = "none";
		xq.$("tableHeightValueUnit").value = "";
		
		xq.$("tableDialog").tableHorizontalAlign.selectedIndex = 0;
		xq.$("tableDialog").tableVerticalAlign.selectedIndex = 1;
		
		xq.$("tableDialog").tableBorderColor.parentNode.getElementsByTagName('A')[0].style.backgroundColor = defaultValues.borderColor;
		xq.$("tableDialog").tableBorderColor.value = defaultValues.borderColor;
		
		xq.$("tableDialog").tableBorderSize.value = defaultValues.borderWidth;
		
		xq.$("tableDialog").tableBackgroundColor.parentNode.getElementsByTagName('A')[0].style.backgroundColor = defaultValues.backgroundColor;
		xq.$("tableDialog").tableBackgroundColor.value = defaultValues.backgroundColor;

		if (prop) this.setDialog(prop);
	},
	setDialog: function(prop){
		if(typeof prop.width != 'undefined' || prop.width != null){
			xq.$("tableWidthValue").value = prop.width;
			if(prop.width.match(/(\%|px)/)) {
				xq.getElementsByClassName(xq.$("tableDialog"), 'tableWidths')[0].selectedIndex = (prop.width.indexOf('%') != -1)? 3:2
				xq.$("tableWidthValue").style.display = "inline";
				xq.$("tableWidthValueUnit").value = (prop.width.indexOf('%') != -1)? '%':'px';
			}
		}
		if(typeof prop.height != 'undefined' || prop.height != null){
			if(prop.height.indexOf('px') != -1) {
				xq.getElementsByClassName(xq.$("tableDialog"), 'tableHeights')[0].selectedIndex = 1
				xq.$("tableHeightValue").style.display = "inline";
				xq.$("tableHeightValue").value = prop.height;
				xq.$("tableHeightValueUnit").value = 'px';
			}
		}
		if(typeof prop.verticalAlign != 'undefined' || prop.verticalAlign != null){
			var optTextAlign = {
				'top':0,
				'middle':1,
				'bottom':2
			}
			xq.$("tableDialog").tableVerticalAlign.selectedIndex = optTextAlign[prop.verticalAlign];
		}
		if(typeof prop.textAlign != 'undefined' || prop.textAlign != null){
			var optVerticalAlign = {
				'left':0,
				'center':1,
				'right':2
			}
			xq.$("tableDialog").tableHorizontalAlign.selectedIndex = optVerticalAlign[prop.textAlign];
		}
		if(typeof prop.borderColor != 'undefined' || prop.borderColor != null){
			xq.$("tableDialog").tableBorderColor.parentNode.getElementsByTagName('A')[0].style.backgroundColor = prop.borderColor;
			xq.$("tableDialog").tableBorderColor.value = prop.borderColor;
		}
		if(typeof prop.borderWidth != 'undefined' || prop.borderWidth != null){
			xq.$("tableDialog").tableBorderSize.value = prop.borderWidth;
		}
		if(typeof prop.backgroundColor != 'undefined' || prop.backgroundColor != null){
			xq.$("tableDialog").tableBackgroundColor.parentNode.getElementsByTagName('A')[0].style.backgroundColor = prop.backgroundColor;
			xq.$("tableDialog").tableBackgroundColor.value = prop.backgroundColor;
		}
	},
	openDialog: function(type, element){
		var tableDialog = xq.$('tableDialog');
		if (tableDialog && tableDialog.style.display != 'none') this.lastTableDialog.close();
		var text = xed.rdom.getSelectionAsText() || '';
		var dialog = new xq.ui.FormDialog(
			xed,
			xq.ui_templates.basicTableDialog,
			function(dialog) {
				var isNewTable = type == 'new';
				
				//xq.$("tableDialogTitle").innerHTML = (isNewTable)? 'Insert Table' : 'Change ' + type;
				//xq.$("tableDialogSubmit").innerHTML = (isNewTable)? 'Insert' : 'Edit';
				var prop;
				if (type != 'new'){
					switch (type){
						case 'table':
							prop = xed.handleTableProperty();
						break;
						case 'row':
							prop = xed.handleRowProperty();
						break;
						case 'column':
							prop = xed.handleColumnProperty();
						break;
					}
				}
				
				xq.$("tableDialog").className += " " + type;
				xq.RichTableController.initDialog(type, prop);
			},
			function(data) {
				xed.focus();
				
				if(xq.Browser.isTrident) {
					var rng = xed.rdom.rng();
					rng.moveToBookmark(bm);
					rng.select();
				}
				if(!data) return;
				xq.RichTableController.submit();
			}
		);
		
		if(xq.Browser.isTrident) var bm = xed.rdom.rng().getBookmark();
		dialog.show({position: 'centerOfEditor'});
		this.dialogType = type;
		this.lastTableDialog = dialog;
		return true;

	},
	submit: function(){
		var type = this.dialogType;
		
		var prop = {};
		
		if (type == 'new') {
			if (!xq.$("tableDialog").tableCols.value.replace(/[^0-9]/g,'') || parseInt(xq.$("tableDialog").tableCols.value, 10) > 30) {
				alert(xed._('Please enter column value between 1 to 30.'));
				xq.$("tableDialog").tableCols.focus();
				return false;
			}
			if (!xq.$("tableDialog").tableRows.value.replace(/[^0-9]/g,'') || parseInt(xq.$("tableDialog").tableRows.value, 10) > 120) {
				alert(xed._('Please enter row value between 1 to 120.'));
				xq.$("tableDialog").tableRows.focus();
				return false;
			}
			
			prop['cols'] = xq.$("tableDialog").tableCols.value;
			prop['rows'] = xq.$("tableDialog").tableRows.value;
			prop['headerPositions'] = xq.$("tableDialog").tableType.value;
		}
		
		if (type != 'row') {
			if (xq.$("tableDialog").tableWidth.value > 0) {
				prop['width'] = {};
				prop['width'].size = parseInt(xq.$("tableDialog").tableWidth.value, 10);
				prop['width'].unit = xq.$("tableDialog").tableWidthUnit.value;
			} else {
				prop['width'] = xq.$("tableDialog").tableWidth.value;
			}
		}
		
		if (type != 'column') {
			if (xq.$("tableDialog").tableHeight.value > 0) {
				prop['height'] = {};
				prop['height'].size = parseInt(xq.$("tableDialog").tableHeight.value, 10);
				prop['height'].unit = xq.$("tableDialog").tableHeightUnit.value;
			} else {
				prop['height'] = xq.$("tableDialog").tableHeight.value;
			}
		}
		
		if (type == 'row' || type == 'column') {
			prop['verticalAlign'] = xq.$("tableDialog").tableVerticalAlign.value;
			prop['textAlign'] = xq.$("tableDialog").tableHorizontalAlign.value;
		}
		
		if (type == 'new' || type == 'table') {
			prop['borderColor'] = xq.$("tableDialog").tableBorderColor.value;
		}
		
		var currentTable = xed.rdom.getParentElementOf(xed.rdom.getCurrentBlockElement(), ["TABLE"]);
		
		prop['className'] = (currentTable)? currentTable.className : '';
		
		if (prop['className'].indexOf('dataTable2') == -1) {
			prop['className'] += (currentTable && currentTable.className)? ' datatable2':'datatable2';
		}
		
		if (type == 'new' || type == 'table') {
			prop['borderWidth'] = xq.$("tableDialog").tableBorderSize.value;
			
			if(xq.$("tableDialog").tableBorderSize.value < 1 && prop['className'].indexOf('zeroborder') == -1){
				prop['className'] += ' zeroborder';
			} else if (xq.$("tableDialog").tableBorderSize.value > 0){
				prop['className'] = prop['className'].replace('zeroborder','')
			}
		}
		
		prop['backgroundColor'] = xq.$("tableDialog").tableBackgroundColor.value;
		
		xed.focus();
		
		switch (type){
			case 'new':
			xed.handleTable(prop);
			break;
			case 'table':
			xed.handleTableProperty(prop);
			break;
			case 'row':
			xed.handleRowProperty(prop);
			break;
			case 'column':
			xed.handleColumnProperty(prop);
			break;
		}
		
		return false;
	},
	insertParagraph: function(where){
		var cur = xed.rdom.getCurrentBlockElement();
		if (!cur) return;
		var table = xed.rdom.getParentElementOf(cur, ["TABLE"]);
		if(!table) return true;
		
		var insert = xed.rdom.insertNodeAt(xed.rdom.makeEmptyParagraph(), table, where);
		xed.rdom.placeCaretAtStartOf(insert);
		xed.focus()
	},
	changeType: function(element, type){
		var anchors = element.parentNode.parentNode.getElementsByTagName('A');
		for(var i = 0; i < anchors.length; i++){
			anchors[i].className = ""
		}
		element.className = "selected"
		xq.$('tableTypeField').value = type; 
		return false;
	},
	changeSize: function(element){
		var targetElement = element.parentNode.parentNode.getElementsByTagName('INPUT')[0];
		if (element.className.indexOf('plus') != -1){
			targetElement.value++;
		} else if(targetElement.value > 1 || (targetElement.name == "tableBorderSize" && targetElement.value > 0)) {
			targetElement.value--;
		}
		this.previewTable();
	},
	previewTable: function(){
		var table = xq.$("previewTable").getElementsByTagName('TABLE')[0]
		if (table.tBodies.length > 0) table = table.tBodies[0];

		var row = parseInt(xq.$("tableRowsField").value, 10);
		var col = parseInt(xq.$("tableColsField").value, 10);
		
		if (row < 1) xq.$("tableRowsField").value = row = 1;
		if (row > 120) xq.$("tableRowsField").value = row = 120;
		if (col < 1) xq.$("tableColsField").value = col = 1;
		if (col > 30) xq.$("tableColsField").value = col = 30;
		
		row = Math.min(parseInt(xq.$("tableRowsField").value, 10), 20);
		
		var rowsValue = row - table.rows.length;
		var colsValue = col - table.rows[0].cells.length;
		
		for (var i = 0; i < Math.abs(rowsValue); i++){
			if (rowsValue > 0){
				table.appendChild(table.rows[0].cloneNode(true))
			} else {
				table.deleteRow(0)
			}
		}
		
		for (var j = 0; j < Math.abs(colsValue); j++){
			for (var k = 0; k < table.rows.length; k++){
				var tr = table.rows[k];
				if (colsValue > 0) {
					tr.insertCell(0);
				} else {
					tr.deleteCell(0);
				}
			}
		}
	},
	changeStyle: function(element){
		var target = (element.className.indexOf('Width') != -1)? 'Width':'Height';
		switch (element.value){
			case 'fullsize':
				xq.$("table" + target + "Value").value = "100";
				xq.$("table" + target + "ValueUnit").value = "%";
				xq.$("table" + target + "Value").style.display = "none";
				break;
			case 'content':
				xq.$("table" + target + "Value").value = "";
				xq.$("table" + target + "ValueUnit").value = "";
				xq.$("table" + target + "Value").style.display = "none";
				break;
			case 'pixel':
				xq.$("table" + target + "Value").value = "";
				xq.$("table" + target + "ValueUnit").value = "px";
				xq.$("table" + target + "Value").style.display = "inline";
				break;
			case 'percentage':
				xq.$("table" + target + "Value").value = "100";
				xq.$("table" + target + "ValueUnit").value = "%";
				xq.$("table" + target + "Value").style.display = "inline";
				break;
		}
	},
	showColorPicker: function(elem){
		xed.lastAnchor = elem;
		var dialog = xq.$('foregroundColorDialog');
		dialog.style.display = 'block';
		
		dialog.style.position = 'absolute'
		dialog.style.top = elem.offsetTop + xq.$('tableDialog').offsetTop + elem.offsetHeight + 2 + 'px';
		dialog.style.left = elem.offsetLeft + xq.$('tableDialog').offsetLeft + 'px';
	}
}
/**
 * @namespace UI Controls
 * 
 * @requires XQuared.js
 */
xq.ui = {};
/**
 * @namespace UI Controls
 * 
 * @requires XQuared.js
 * @requires ui/Base.js
 */
xq.ui.FormDialog = xq.Class(/** @lends xq.ui.FormDialog.prototype */ {
	/**
     * Displays given HTML form as a dialog.
     * 
     * @constructs
     * @param {xq.Editor} xed Dialog owner.
     * @param {String} html HTML string which contains FORM.
     * @param {Function} [onLoadHandler] callback function to be called when the form is loaded.
     * @param {Function} [onCloseHandler] callback function to be called when the form is closed.
	 */
	initialize: function(xed, html, onLoadHandler, onCloseHandler) {
		xq.addToFinalizeQueue(this);
		
		this.xed = xed;
		this.html = html;
		this.onLoadHandler = onLoadHandler || function() {};
		this.onCloseHandler = onCloseHandler || function() {};
		this.form = null;
	},
	
	/**
	 * Shows dialog
	 *
	 * @param {Object} [options] collection of options
	 */
	show: function(options) {
		options = options || {};
		options.position = options.position || 'centerOfWindow';
		options.mode = options.mode || 'modal';
		options.cancelOnEsc = options.cancelOnEsc || true;
		
		if( typeof options.dialogId === 'undefined' )
		{
			this._createDialog(options);
		}
		else
		{
			if(!xq.$(options.dialogId))
				this._createDialog(options);
			else
				xq.$(options.dialogId).style.display = '';				
		}
	},
	
	_createDialog: function(options)
	{
		var self = this;
		
		// create and append container
		var container = document.createElement('DIV');
		container.style.display = 'none';
		document.body.appendChild(container);
		
		// initialize form
		container.innerHTML = this.html;
		this.form = container.getElementsByTagName('FORM')[0];
		
		var submitButtons = xq.getElementsByClassName(this.form, 'submit');
		for (var i = 0; i < submitButtons.length; i++) {
			submitButtons[i].onclick = function() {
				self.onCloseHandler(xq.serializeForm(this.form));
				if(!options.notSelfClose)
				{
					self.close();
				}
				return false;
			}.bind(this);
		}
		
		var cancelButtons = xq.getElementsByClassName(this.form, 'cancel');
		for (var j = 0; j < cancelButtons.length; j++) {
			cancelButtons[j].onclick = function() {
				self.onCloseHandler();
				self.close();
			};
		}
		
		if(options.mode === 'modal') {
			this.dimmed = document.createElement('DIV');
			this.dimmed.style.position = 'absolute';
			this.dimmed.style.backgroundColor = 'black';
			this.dimmed.style.opacity = 0.5;
			this.dimmed.style.filter = 'alpha(opacity=50)';
			this.dimmed.style.zIndex=902;
			this.dimmed.style.top='0px';
			this.dimmed.style.left='0px';
			this.xed.outmostWrapper.appendChild(this.dimmed);
			
			this.resizeDimmedDiv = function(e) {
				this.dimmed.style.display='none';
				this.dimmed.style.width= this.xed.outmostWrapper.offsetWidth+'px';
				this.dimmed.style.height= this.xed.outmostWrapper.offsetHeight+'px';
				this.dimmed.style.display='block';
			}.bind(this);
			
			xq.observe(window, 'resize', this.resizeDimmedDiv);
			
			this.resizeDimmedDiv();
		}
		
		// append dialog
		this.xed.toolbar.dialogContainer.appendChild(this.form);
		container.parentNode.removeChild(container);
		
		// place dialog to center of window
		this.setPosition(options.position);
		
		// give focus
		var elementToFocus = xq.getElementsByClassName(this.form, 'initialFocus');
		if(elementToFocus.length > 0) {
			setTimeout(function(){ // @WORKAROUND: required to avoid Windows IE focus bug.
				elementToFocus[0].focus();
			},0);
		}
		
		// handle cancelOnEsc option
		if(options.cancelOnEsc) {
			xq.observe(this.form, 'keydown', function(e) {
				if(e.keyCode === 27) {
					this.onCloseHandler();
					this.close();
				}
			}.bind(this));
		}
		
		this.onLoadHandler(this);
	},
	/**
	 * Closes dialog
	 */
	close: function() {
		if(this.form.parentNode) this.form.parentNode.removeChild(this.form);
		
		if(this.dimmed) {
			this.dimmed.parentNode.removeChild(this.dimmed);
			this.dimmed = null;
			xq.stopObserving(window, 'resize', this.resizeDimmedDiv);
			this.resizeDimmedDiv = null;
		}
	},
	
	/**
	 * Sets position of dialog
	 *
	 * @param {String} target "centerOfWindow" or "centerOfEditor"
	 */
	setPosition: function(target) {
		var targetElement = null;
		var left = 0;
		var top = 0;
		if(target === 'centerOfWindow') {
			targetElement = document.documentElement || document.body;
			left += targetElement.scrollLeft;
			top += targetElement.scrollTop;
		} else if(target === 'centerOfEditor') {
			targetElement = this.xed.getCurrentEditMode() == 'wysiwyg' ? this.xed.wysiwygEditorDiv : this.xed.sourceEditorDiv;
			/*
			var o = targetElement;
			do {
				left += o.offsetLeft;
				top += o.offsetTop;
			} while(o = o.offsetParent)
			*/ 
		} else if(target === 'nearbyCaret') {
			throw "Not implemented yet";
		} else {
			throw "Invalid argument: " + target;
		}
		
		var targetWidth = targetElement.clientWidth;
		var targetHeight = targetElement.clientHeight;
		var dialogWidth = this.form.clientWidth;
		var dialogHeight = this.form.clientHeight;
		
		left += parseInt((targetWidth - dialogWidth) / 2);
		top += parseInt((targetHeight - dialogHeight) / 2);
		
		this.form.style.left = Math.max(left, 0) + "px";
		this.form.style.top = Math.max(top, 0) + "px";
	}
})



xq.ui.QuickSearchDialog = xq.Class(/** @lends xq.ui.QuickSearchDialog.prototype */ {
	/**
     * Displays quick search dialog
     * 
     * @constructs
     * @param {xq.Editor} xed Dialog owner.
     * @param {Object} param Parameters.
	 */
	initialize: function(xed, param) {
		xq.addToFinalizeQueue(this);
		this.xed = xed;
		
		this.rdom = xq.rdom.Base.createInstance();
		
		this.param = param;
		if(!this.param.renderItem) this.param.renderItem = function(item) {
			return this.rdom.getInnerText(item);
		}.bind(this);
		
		this.container = null;
	},
	
	getQuery: function() {
		if(!this.container) return "";
		return this._getInputField().value;
	},
	
	onSubmit: function(e) {
		if(this.matchCount() > 0) {
			this.param.onSelect(this.xed, this.list[this._getSelectedIndex()]);
		}
		
		this.close();
		xq.stopEvent(e);
		return false;
	},
	
	onCancel: function(e) {
		if(this.param.onCancel) this.param.onCancel(this.xed);
		this.close();
	},
	
	onBlur: function(e) {
		// @WORKAROUND: Ugly
		setTimeout(function() {this.onCancel(e)}.bind(this), 400);
	},
	
	onKey: function(e) {
		var esc = new xq.Shortcut("ESC");
		var enter = new xq.Shortcut("ENTER");
		var up = new xq.Shortcut("UP");
		var down = new xq.Shortcut("DOWN");
		
		if(esc.matches(e)) {
			this.onCancel(e);
		} else if(enter.matches(e)) {
			this.onSubmit(e);
		} else if(up.matches(e)) {
			this._moveSelectionUp();
		} else if(down.matches(e)) {
			this._moveSelectionDown();
		} else {
			this.updateList();
		}
	},
	
	onClick: function(e) {
		var target = e.srcElement || e.target;
		if(target.nodeName === "LI") {
			
			var index = this._getIndexOfLI(target);
			this.param.onSelect(this.xed, this.list[index]);
		}
	},
	
	onList: function(list) {
		this.list = list;
		this.renderList(list);
	},
	
	updateList: function() {
		window.setTimeout(function() {
			this.param.listProvider(this.getQuery(), this.xed, this.onList.bind(this));
		}.bind(this), 0);
	},
	
	renderList: function(list) 
	{
		var ol = this._getListContainer();
		ol.innerHTML = "";
		
		for(var i = 0; i < list.length; i++) {
			var li = this.rdom.createElement('LI');
			li.innerHTML = this.param.renderItem(list[i]);
			ol.appendChild(li);
		}
		
		if(ol.hasChildNodes()) {
			ol.firstChild.className = "selected";
		}
	},
	
	show: function() {
		if(!this.container) this.container = this._create();
		
		var dialog = this.rdom.insertNodeAt(this.container, this.rdom.getRoot(), "end");
		this.setPosition('centerOfEditor');
		this.updateList();
		this.focus();
	},
	
	close: function() {
		this.rdom.deleteNode(this.container);
	},
	
	focus: function() {
		this._getInputField().focus();
	},
	
	setPosition: function(target) {
		var targetElement = null;
		var left = 0;
		var top = 0;
		
		if(target === 'centerOfWindow') {
			left += targetElement.scrollLeft;
			top += targetElement.scrollTop;
			targetElement = document.documentElement;
		} else if(target === 'centerOfEditor') {
			targetElement = this.xed.getCurrentEditMode() == 'wysiwyg' ? this.xed.wysiwygEditorDiv : this.xed.sourceEditorDiv;
			var o = targetElement;
			do {
				left += o.offsetLeft;
				top += o.offsetTop;
			} while(o = o.offsetParent)
		} else if(target === 'nearbyCaret') {
			throw "Not implemented yet";
		} else {
			throw "Invalid argument: " + target;
		}
		
		var targetWidth = targetElement.clientWidth;
		var targetHeight = targetElement.clientHeight;
		var dialogWidth = this.container.clientWidth;
		var dialogHeight = this.container.clientHeight;
		
		left += parseInt((targetWidth - dialogWidth) / 2);
		top += parseInt((targetHeight - dialogHeight) / 2);
		
		this.container.style.left = left + "px";
		this.container.style.top = top + "px";
	},
	
	matchCount: function() {
		return this.list ? this.list.length : 0;
	},
	
	_create: function() {
		// make container
		var container = this.rdom.createElement("DIV");
		container.className = "xqQuickSearch";
		
		// make title
		if(this.param.title) {
			var title = this.rdom.createElement("H1");
			title.innerHTML = this.param.title;
			container.appendChild(title);
		}
		
		// make input field
		var inputWrapper = this.rdom.createElement("DIV");
		inputWrapper.className = "input";
		var form = this.rdom.createElement("FORM");
		var input = this.rdom.createElement("INPUT");
		input.type = "text";
		input.value = "";
    	form.appendChild(input);
		inputWrapper.appendChild(form);
		container.appendChild(inputWrapper);
		
		// make list
		var list = this.rdom.createElement("OL");

	    xq.observe(input, 'blur', this.onBlur.bindAsEventListener(this));
    	xq.observe(input, 'keypress', this.onKey.bindAsEventListener(this));
    	xq.observe(list, 'click', this.onClick.bindAsEventListener(this), true);
    	xq.observe(form, 'submit', this.onSubmit.bindAsEventListener(this));
    	xq.observe(form, 'reset', this.onCancel.bindAsEventListener(this));

		container.appendChild(list);
		return container;
	},
	
	_getInputField: function() {
		return this.container.getElementsByTagName('INPUT')[0];
	},
	
	_getListContainer: function() {
		return this.container.getElementsByTagName('OL')[0];
	},
	
	_getSelectedIndex: function() {
		var ol = this._getListContainer();
		for(var i = 0; i < ol.childNodes.length; i++) {
			if(ol.childNodes[i].className === 'selected') return i;
		}
	},
	
	_getIndexOfLI: function(li) {
		var ol = this._getListContainer();
		for(var i = 0; i < ol.childNodes.length; i++) {
			if(ol.childNodes[i] === li) return i;
		}
	},
	
	_moveSelectionUp: function() {
		var count = this.matchCount();
		if(count === 0) return;
		var index = this._getSelectedIndex();
		var ol = this._getListContainer();
		ol.childNodes[index].className = "";
		
		index--;
		if(index < 0) index = count - 1;
		
		ol.childNodes[index].className = "selected";
	},
	
	_moveSelectionDown: function() {
		var count = this.matchCount();
		if(count === 0) return;
		var index = this._getSelectedIndex();
		var ol = this._getListContainer();
		ol.childNodes[index].className = "";
		
		index++;
		if(index >= count) index = 0;
		
		ol.childNodes[index].className = "selected";
	}
});
/**
 * @requires XQuared.js
 * @requires Browser.js
 * @requires ui/Base.js
 */
xq.ui.Toolbar = xq.Class(/** @lends xq.ui.Toolbar.prototype */{
	/**
	 * Editor's toolbar.
	 *
     * @constructs
	 */
	initialize: function(xed, container, wrapper, buttonMap, buttonList, imagePath, structureAndStyleCollector) {
	
		xq.addToFinalizeQueue(this);
		
		this.xed = xed;
		
		if(typeof container === 'string') {
			container = xq.$(container);
		}
		if(container && container.nodeType !== 1) {
			throw "[container] is not an element";
		}
		
		this.wrapper = wrapper;
		this.doc = this.wrapper.ownerDocument;
		this.buttonMap = buttonMap;
		this.buttonList = buttonList;
		this.imagePath = "/contents/images/xquared/toolbar/";
		this.structureAndStyleCollector = structureAndStyleCollector;
		
		this.buttons = null;
		this.anchorsCache = [];
		this._scheduledUpdate = null;
		
		if(!container) {
			this.create();
			this._addStyleRules([
				{selector:".xquared div.toolbar", rule:"background-image: url(" + imagePath + "toolbarBg.gif)"},
				{selector:".xquared ul.buttons li", rule:"background-image: url(" + imagePath + "toolbarButtonBg.gif)"},
				{selector:".xquared ul.buttons li.xq_separator", rule:"background-image: url(" + imagePath + "toolbarSeparator.gif)"}
			]);
		} else {
			this.container = container;
			
			if(!this.dialogContainer)
			{
				// dialog container
				var dialogs = this.doc.createElement('div');
				dialogs.className = 'dialogs';
				this.dialogContainer = dialogs;
				this.wrapper.appendChild(dialogs);
			}
		}
		xed.addListener({
			onEditorInitialized: function() {
				xq.observe(xed.getDoc(), 'mousedown', this._closeAllLightweight.bindAsEventListener(this));
				xq.observe(document, 'mousedown', this._closeAllLightweight.bindAsEventListener(this));
			}.bind(this)
		});
	},
	
	finalize: function() {
		for(var i = 0; i < this.anchorsCache.length; i++) {
			// TODO remove dependency to Editor
			this.anchorsCache[i].xed = null;
			this.anchorsCache[i].handler = null;
			this.anchorsCache[i] = null;
		}
	
		this.toolbarAnchorsCache = null;
	},
	
	triggerUpdate: function() {
		if(this._scheduledUpdate) return;
		
		this._scheduledUpdate = window.setTimeout(
			function() {
				this._scheduledUpdate = null;
				var ss = this.structureAndStyleCollector();
				if(ss) this.update(ss);
			}.bind(this), 200
		);
	},
	
	/**
	 * Updates all buttons' status. Override this to customize status L&F. Don't call this function directly. Use triggerUpdate() to call it indirectly.
	 * 
	 * @param {Object} structure and style information. see xq.rdom.Base.collectStructureAndStyle()
	 */
	update: function(info) {
		if(!this.container) return;
		if(!this.buttons) {
			var classNames = [
				"emphasis", "strongEmphasis", "underline", "strike", "superscription", "subscription",
				"justifyLeft", "justifyCenter", "justifyRight", "justifyBoth",
				"unorderedList", "orderedList", "code",
				"paragraph", "heading1", "heading2", "heading3", "heading4", "heading5", "heading6"
			];
			
			this.buttons = {};
			
			for(var i = 0; i < classNames.length; i++) {
				var found = xq.getElementsByClassName(this.container, classNames[i]);
				var button = found && found.length > 0 ? found[0] : null;
				if(button) this.buttons[classNames[i]] = button;
			}
		}
		
		var buttons = this.buttons;
		this._updateButtonStatus('emphasis', info.em);
		this._updateButtonStatus('strongEmphasis', info.strong);
		this._updateButtonStatus('underline', info.underline);
		this._updateButtonStatus('strike', info.strike);
		this._updateButtonStatus('superscription', info.superscription);
		this._updateButtonStatus('subscription', info.subscription);
		
		this._updateButtonStatus('justifyLeft', info.justification === 'left');
		this._updateButtonStatus('justifyCenter', info.justification === 'center');
		this._updateButtonStatus('justifyRight', info.justification === 'right');
		this._updateButtonStatus('justifyBoth', info.justification === 'justify');
		
		this._updateButtonStatus('orderedList', info.list === 'OL');
		this._updateButtonStatus('unorderedList', info.list === 'UL');
		this._updateButtonStatus('code', info.list === 'CODE');
		
		this._updateButtonStatus('paragraph', info.block === 'P');
		this._updateButtonStatus('heading1', info.block === 'H1');
		this._updateButtonStatus('heading2', info.block === 'H2');
		this._updateButtonStatus('heading3', info.block === 'H3');
		this._updateButtonStatus('heading4', info.block === 'H4');
		this._updateButtonStatus('heading5', info.block === 'H5');
		this._updateButtonStatus('heading6', info.block === 'H6');
	},

	/**
	 * Enables all buttons
	 *
	 * @param {Array} [exceptions] array of string containing classnames to exclude
	 */
	enableButtons: function(exceptions) {
		if(!this.container) return;
		
		this._execForAllButtons(exceptions, function(li, exception) {
			li.firstChild.className = !exception ? '' : 'disabled';
		});

		// @WORKAROUND: Image icon disappears without following code:
		if(xq.Browser.isIE6) {
			this.container.style.display = 'none';
			setTimeout(function() {this.container.style.display = 'block';}.bind(this), 0);
		}
	},
	
	/**
	 * Disables all buttons
	 *
	 * @param {Array} [exceptions] array of string containing classnames to exclude
	 */
	disableButtons: function(exceptions) { 
		this._execForAllButtons(exceptions, function(li, exception) {
			li.firstChild.className = exception ? '' : 'disabled';
		});
	},
	
	/**
	 * Creates toolbar element
	 */
	create: function() {
		// outmost container
		this.container = this.doc.createElement('div');
		this.container.className = 'toolbar';
		
		// button container
		var buttons = this.doc.createElement('ul');
		buttons.className = 'buttons';
		this.container.appendChild(buttons);
		
		// dialog container
		var dialogs = this.doc.createElement('div');
		dialogs.className = 'dialogs';
		this.dialogContainer = dialogs;
		this.wrapper.appendChild(dialogs);
		
		if(this.buttonList.length !== 0)
		{
			var btnListLen = this.buttonList.length;
			for(var i = 0; i < btnListLen; i++)
			{
				if(this.buttonList[i] == "separator" )
				{
					continue;
				}
				
				var buttonConfig = this.buttonList[i];
				var li = this.doc.createElement('li');
				buttons.appendChild(li);
				li.className = buttonConfig.className;
				
				if(typeof this.buttonList[i-1] !== "undefined" && this.buttonList[i-1] == "separator" )
				{
					li.className += ' xq_separator';
				}
				
				var span = this.doc.createElement('span');
				li.appendChild(span);
				
				if(buttonConfig.list) {
					this._createDropdown(buttonConfig, span);
				} else {
					this._createButton(buttonConfig, span);
				}
			}
		}
		else if(this.buttonMap)
		{
			// Generate buttons from map and append it to button container
			for(var i = 0; i < this.buttonMap.length; i++) {
				for(var j = 0; j < this.buttonMap[i].length; j++) {
					var buttonConfig = this.buttonMap[i][j];
					var li = this.doc.createElement('li');
					buttons.appendChild(li);
					li.className = buttonConfig.className;
					
					var span = this.doc.createElement('span');
					li.appendChild(span);
					
					if(buttonConfig.list) {
						this._createDropdown(buttonConfig, span);
					} else {
						this._createButton(buttonConfig, span);
					}
					
					if(j === 0 && i !== 0) li.className += ' xq_separator';
				}
			}
		}
		
		this.wrapper.appendChild(this.container);
	},

	_createButton: function(buttonConfig, span) {
		var a = this.doc.createElement('a');
		span.appendChild(a);
		
		a.href = "#";
		a.title = buttonConfig.title;
		if (buttonConfig.handler){
			a.handler = buttonConfig.handler;
			xq.observe(a, 'click', this._clickHandler.bindAsEventListener(this));
		}
		
		this.anchorsCache.push(a);
		
		xq.observe(a, 'mousedown', xq.cancelHandler);

		var img = this.doc.createElement('img');
		a.appendChild(img);
		img.className = buttonConfig.className;
		img.src = this.imagePath + buttonConfig.className + '.gif';
		
		if(buttonConfig.title)
		{
			img.alt = buttonConfig.title;
		}
		else
		{
			img.alt = buttonConfig.className;
		}

		return a;
	},
	
	_createDropdown: function(buttonConfig, span) {
		// Create button
		var btn = this._createButton(buttonConfig, span);
		btn.items = buttonConfig.list;
		
		xq.observe(btn, 'click', this._openDropdownDialog.bindAsEventListener(this));
		
		// Create dialog
		var dialog = this.doc.createElement('DIV');
		dialog.id = buttonConfig.className + "Dialog";
		dialog.className = "xqFormDialog lightweight";
		dialog.style.display = 'none';
		
		var title = this.doc.createElement('H3');
		title.innerHTML = buttonConfig.title;
		dialog.appendChild(title);

		var dialogContent = this.doc.createElement('DIV');
		dialogContent.className = 'dialog-content';
		
		var ul = this.doc.createElement('UL');
		ul.className = "item-list";
		
		for (var i = 0; i < btn.items.length; i++) {
			var item = btn.items[i];
			var li = this.doc.createElement('LI');
			var anchor = this.doc.createElement('A');
			li.appendChild(anchor);
			if (item.html) {
				if (buttonConfig.className == 'emoticon') {
					var emoticon = this.doc.createElement('IMG');
					emoticon.src = this.xed.config.imagePathForEmoticon + item.html;
					emoticon.alt = item.html;
					anchor.appendChild(emoticon);				
				} else {
					anchor.innerHTML = decodeURIComponent(item.html);
				}
			}
			
			anchor.href = "#";
			anchor.handler = item.handler;
			
			for (attr in item.style){
				anchor.style[attr] = item.style[attr];
			}
			xq.observe(anchor, 'click', xq.cancelHandler);
			xq.observe(anchor, 'mouseup', this._closeAllLightweight.bindAsEventListener(this));
			xq.observe(anchor, 'mousedown', this._clickHandler.bindAsEventListener(this));
			
			ul.appendChild(li);
		}
		
		dialogContent.appendChild(ul);
		dialog.appendChild(dialogContent);
		this.dialogContainer.appendChild(dialog);
		span.appendChild(btn);
	},
	
	_openDropdownDialog: function(e){
		this._closeAllLightweight(e);
		
		var src = e.target || e.srcElement;
		this.xed.lastAnchor = src;
		var dialog = xq.$(src.className + "Dialog");
		
		if (dialog) {
			dialog.style.display = 'block';
			dialog.style.top = this.container.offsetTop + this.container.offsetHeight + 'px';
			dialog.style.left = this.container.offsetLeft + src.parentNode.offsetLeft + 'px';
		} 
		xq.stopEvent(e);
		return false;
	},
	
	_closeAllLightweight: function(e){
		if(e)
		{
			var src = e.target || e.srcElement;
			
			var linkDlg = xq.$('linkDialog');
			
			if( (linkDlg !== null && linkDlg.style.display !== 'none') || src.id.indexOf("extForeColor") !== -1 || src.className.indexOf("jscolor") !== -1)
			{
				return false;
			}
		}
		
		var dialogs = xq.getElementsByClassName(this.dialogContainer, 'lightweight');
		for (var i = 0; i < dialogs.length; i++){
			dialogs[i].style.display = "none";
		}
	},
	_clickHandler: function(e) {
		var src = e.target || e.srcElement;
		
		while(src.nodeName !== "A") src = src.parentNode;
		
		if(xq.hasClassName(src.parentNode, 'disabled') || xq.hasClassName(this.container, 'disabled')) {
			xq.stopEvent(e);
			return false;
		}
		
		var handler = src.handler;
		var xed = this.xed;
		xed.focus();
		if(typeof handler === "function") {
			handler(this);
		} else {
			eval(handler);
		}
		
		xq.stopEvent(e);
		return false;
	},

	_updateButtonStatus: function(className, selected) {
		var button = this.buttons[className];
		if(button) {
			var newClassName = selected ? 'selected' : '';
			var target = button.firstChild.firstChild;
			if(target.className !== newClassName) target.className = newClassName;
		}
	},
	
	_execForAllButtons: function(exceptions, exec) {
		if(!this.container) return;
		exceptions = exceptions || [];
		
		var lis = this.container.getElementsByTagName('LI');
		for(var i = 0; i < lis.length; i++) {
			var className = lis[i].className.split(" ").find(function(name) {return name !== 'xq_separator'});
			var exception = exceptions.indexOf(className) !== -1;
			exec(lis[i], exception);
		}
	},
	
	_addStyleRules: function(rules) {
		
		if(!this.dynamicStyle) {
			if(xq.Browser.isTrident) {
			    this.dynamicStyle = this.doc.createStyleSheet();
			} else {
	    		var style = this.doc.createElement('style');
	    		this.doc.body.appendChild(style);
		    	this.dynamicStyle = xq.$A(this.doc.styleSheets).last();
			}
		}
		
		for(var i = 0; i < rules.length; i++) {
			var rule = rules[i];
					
			if(xq.Browser.isTrident) {
				
				this.dynamicStyle.addRule(rules[i].selector, rules[i].rule);
			} else {
		    	this.dynamicStyle.insertRule(rules[i].selector + " {" + rules[i].rule + "}", this.dynamicStyle.cssRules.length);
	    	}
		}
	}
});
if(!xq) xq = {};
if(!xq.ui_templates) xq.ui_templates = {};

xq.ui_templates.basicColorPickerDialog='<form action="#" class="xqFormDialog xqBasicColorPickerDialog">\n		<div>\n			<label>\n				<input type="radio" class="initialFocus" name="color" value="black" checked="checked" />\n				<span style="color: black;">Black</span>\n			</label>\n			<label>\n				<input type="radio" name="color" value="red" />\n				<span style="color: red;">Red</span>\n			</label>\n				<input type="radio" name="color" value="yellow" />\n				<span style="color: yellow;">Yellow</span>\n			</label>\n			</label>\n				<input type="radio" name="color" value="pink" />\n				<span style="color: pink;">Pink</span>\n			</label>\n			<label>\n				<input type="radio" name="color" value="blue" />\n				<span style="color: blue;">Blue</span>\n			</label>\n			<label>\n				<input type="radio" name="color" value="green" />\n				<span style="color: green;">Green</span>\n			</label>\n			\n			<input type="submit" value="Ok" />\n			<input type="button" class="cancel" value="Cancel" />\n		</div>\n	</form>';
if(!xq) xq = {};
if(!xq.ui_templates) xq.ui_templates = {};

xq.ui_templates.basicFileUploadDialog='<form id="fileUploadDialog" class="xqFormDialog modal" method="post" enctype="multipart/form-data" target="uploadTarget" action="">\n		<h3>Upload image</h3>\n		<div class="dialog-content">\n			<div class="attachment-section">\n				<label class="label" for="searchAttachFile">Find a file</label><input type="file" class="type-text" id="searchAttachFile" name="FileData" />\n			</div>\n			<div class="dialog-buttons">\n				<a href="#" class="button-white cancel">Close</a>\n				<a href="#" class="button-gray submit">Insert</a>\n			</div>\n		</div>\n		<iframe id="uploadTarget" name="uploadTarget" src="" style="width:0;height:0;border:0px solid #fff;"></iframe>\n		<a href="#" class="cancel close-dialog"><img src="../images/xquared/dialogs/icon_close.gif" alt="Close" /></a>\n	</form>';
if(!xq) xq = {};
if(!xq.ui_templates) xq.ui_templates = {};

xq.ui_templates.basicIFrameDialog='<form id="iframeDialog" class="xqFormDialog modal">\n		<h3>Insert IFrame</h3>\n		<div class="dialog-content">\n			<p>IFrame src: <input type="text" class="initialFocus type-text" name="p_src" size="36" value="http://" /></p>\n			<p>Width: <input type="text" class="type-text" name="p_width" size="6" value="320" /></p>\n			<p>Height: <input type="text" class="type-text" name="p_height" size="6" value="200" /></p>\n			<p>Frame border:\n				<select name="p_frameborder">\n					<option value="0" selected="selected">No</option>\n					<option value="1">Yes</option>\n				</select></p>\n			<p>Scrolling: \n				<select name="p_scrolling">\n					<option value="0">No</option>\n					<option value="1" selected="selected">Yes</option>\n				</select></p>\n			<p>ID(optional): <input type="text" class="type-text" name="p_id" size="24" value="" /></p>\n			<p>Class(optional): <input type="text" class="type-text" name="p_class" size="24" value="" /></p>\n			\n			<div class="dialog-buttons">\n				<a href="#" class="button-white cancel">Close</a>\n				<a href="#" class="button-gray submit">Insert</a>\n			</div>\n		</div>\n		<a href="#" class="cancel close-dialog"><img src="../images/xquared/dialogs/icon_close.gif" alt="close" /></a>\n	</form>';
if(!xq) xq = {};
if(!xq.ui_templates) xq.ui_templates = {};

xq.ui_templates.basicLinkDialog='<form id="linkDialog" class="xqFormDialog lightweight" action="#">\n		<h3>link</h3>\n		<div class="dialog-content">\n			<p>Please enter the URL and label.</p>\n			<input type="text" name="text" class="type-text" value="" />\n			<input type="text" name="url" class="type-text" value="http://" />\n			<div class="dialog-buttons">\n				<a href="#" class="button-white cancel">Cancel</a>\n				<a href="#" class="button-gray submit">Create</a>\n			</div>\n		</div>\n	</form>';
if(!xq) xq = {};
if(!xq.ui_templates) xq.ui_templates = {};

xq.ui_templates.basicMovieDialog='<form id="videoDialog" class="xqFormDialog modal">\n		<h3>Insert Movie</h3>\n		<div class="dialog-content">\n			<p>Insert an Embed code to add a movie clip from YouTube, Yahoo video, vimeo and slideshare.</p>\n			<textarea class="initialFocus" name="html"></textarea>\n			<div class="dialog-buttons">\n				<a href="#" class="button-white cancel">Close</a>\n				<a href="#" class="button-gray submit">Insert</a>\n			</div>\n		</div>\n		<a href="#" class="cancel close-dialog"><img src="../images/xquared/dialogs/icon_close.gif" alt="close" /></a>\n	</form>';
if(!xq) xq = {};
if(!xq.ui_templates) xq.ui_templates = {};

xq.ui_templates.basicMultiFileUploadDialog='<form id="multiFileUploadDialog" class="xqFormDialog modal" method="post" enctype="multipart/form-data">\n		<h3>Upload image</h3>\n		<div class="dialog-content">\n			<div id="fileUploadContainer" class="attachment-section">\n				<p>\n					You can insert more than one file at once.\n					A file up to <strong>20MB</strong> can be uploaded. Please use the Ctrl key on PC and the Command(Apple) key on Mac to select multiple files.\n				</p>\n				<div class="dialog-buttons upload-buttons"><div id="MultiFileUploaderDiv"></div></div>\n			</div>\n			<div id="fileListContainer" class="attachment-section">\n			</div>\n			<div class="dialog-buttons">\n				<a href="#" class="button-white cancel">Close</a>\n				<a href="#" class="button-gray submit">Insert</a>\n			</div>\n			<p class="noti">\n				Adobe Flash is required to insert multiple files. <span><a href="#" onclick="xed.fileUploadController.openDialog(true)">Click here to upload files without Adobe Flash</a></span>\n			</p>\n		</div>\n		<a href="#" class="cancel close-dialog"><img src="../images/xquared/dialogs/icon_close.gif" alt="Close" /></a>\n		<div id="MultiFileUploader"></div>\n	</form>';
if(!xq) xq = {};
if(!xq.ui_templates) xq.ui_templates = {};

xq.ui_templates.basicScriptDialog='<form id="scriptDialog" class="xqFormDialog modal">\n		<h3>Insert Script</h3>\n		<div class="dialog-content">\n			<p>Script URL:\n			<input type="text" class="initialFocus" class="type-text" name="url" size="36" value="http://" /></p>\n			<div class="dialog-buttons">\n				<a href="#" class="button-white cancel">Close</a>\n				<a href="#" class="button-gray submit">Insert</a>\n			</div>\n		</div>\n		<a href="#" class="cancel close-dialog"><img src="../images/xquared/dialogs/icon_close.gif" alt="close" /></a>\n	</form>';
if(!xq) xq = {};
if(!xq.ui_templates) xq.ui_templates = {};

xq.ui_templates.basicTableDialog='<form id="tableDialog" class="xqFormDialog modal" action="#">\n		<h3 id="tableDialogTitle">Insert Table</h3>\n		<input type="hidden" name="tableDialogType" value="" />\n		<div class="dialog-content">\n			<fieldset class="table-type">\n				<legend>table type</legend>\n				<ul>\n					<li><a href="#" id="tableTypeDefaultValue" class="selected" onclick="xq.RichTableController.changeType(this, \'\'); return false;"><img src="../images/xquared/dialogs/iconTable_01.gif?1214533817" alt="Untitled Table" /></a></li>\n					<li><a href="#" onclick="xq.RichTableController.changeType(this, \'t\'); return false;"><img src="../images/xquared/dialogs/iconTable_02.gif?1214533817" alt="Column Title on top" /></a></li>\n					<li><a href="#" onclick="xq.RichTableController.changeType(this, \'l\'); return false;"><img src="../images/xquared/dialogs/iconTable_03.gif?1214533817" alt="Column Title on left" /></a></li>\n					<li class="last-child"><a href="#" onclick="xq.RichTableController.changeType(this, \'tl\'); return false;"><img src="../images/xquared/dialogs/iconTable_04.gif?1214533817" alt="Column Title on top and left" /></a></li>\n				</ul>\n				<input id="tableTypeField" type="hidden" name="tableType" value="" />\n			</fieldset>\n			<fieldset class="table-size">\n				<legend id="tableSizeLabel" class="font-variation">Size</legend>\n				<div class="wrapper">\n					<ul>\n						<li class="new-only">\n							<label>Row(s)</label>\n							<span class="controller"><input type="text" onchange="xq.RichTableController.previewTable(); return false;" id="tableRowsField" name="tableRows" value="3" class="type-text" /><span class="buttons"><img src="../images/xquared/dialogs/arrow_top.gif" alt="plus" class="plus rows" onclick="xq.RichTableController.changeSize(this); return false;" /><img src="../images/xquared/dialogs/arrow_bottom.gif" alt="minus" class="minus rows" onclick="xq.RichTableController.changeSize(this); return false;" /></span></span>\n						</li>\n						<li class="new-only">\n							<label>Column(s)</label>\n							<span class="controller"><input type="text" onchange="xq.RichTableController.previewTable(); return false;" id="tableColsField" name="tableCols" value="3" class="type-text" /><span class="buttons"><img src="../images/xquared/dialogs/arrow_top.gif" alt="plus" class="plus cols" onclick="xq.RichTableController.changeSize(this); return false;" /><img src="../images/xquared/dialogs/arrow_bottom.gif" alt="minus" class="minus cols" onclick="xq.RichTableController.changeSize(this); return false;" /></span></span>\n						</li>\n						<li class="table-width">\n							<label>Width</label>\n							<select class="tableWidths" onchange="xq.RichTableController.changeStyle(this); return false;">\n								<option value="fullsize">Full size</option>\n								<option value="content">Size to content</option>\n								<option value="pixel">Fixed size (pixels)</option>\n								<option value="percentage">Fixed percentage (%)</option>\n							</select>			\n							<input type="text" name="tableWidth" id="tableWidthValue" class="type-text height-box" style="display:none;" />				\n							<input type="hidden" name="tableWidthUnit" value="" id="tableWidthValueUnit" />				\n							<!--input type="checkbox" name="tableFixed" class="type-checkbox" /><label class="none font-valiation">Same cell spacing</label-->\n						</li>\n						<li class="table-height">\n							<label>Height</label>\n							<select class="tableHeights" onchange="xq.RichTableController.changeStyle(this); return false;">\n								<option selected value="content">Size to content</option>\n								<option value="pixel">Fixed size (pixels)</option>\n							</select>							\n							<input type="text" name="tableHeight" id="tableHeightValue" class="type-text height-box" style="display:none;" />\n							<input type="hidden" name="tableHeightUnit" id="tableHeightValueUnit" />\n						</li>\n					</ul>\n					<div id="previewTable" class="new-only">\n						<table>\n							<tr>\n								<td></td>\n								<td></td>\n								<td></td>\n							</tr>\n							<tr>\n								<td></td>\n								<td></td>\n								<td></td>\n							</tr>\n							<tr>\n								<td></td>\n								<td></td>\n								<td></td>\n							</tr>\n						</table>\n					</div>\n				</div>\n			</fieldset>\n			<fieldset class="table-alignment">\n				<legend class="font-variation">Alignment</legend>\n				<div class="wrapper">\n					<ul>\n						<li>\n							<label>Horizontal</label>\n							<select name="tableHorizontalAlign">\n								<option value="left">Left</option>\n								<option value="center">Center</option>\n								<option value="right">Right</option>\n							</select>\n						</li>\n						<li>\n							<label>Vertical</label>\n							<select name="tableVerticalAlign">\n								<option value="top">Top</option>\n								<option value="middle">Middle</option>\n								<option value="bottom">Bottom</option>\n							</select>\n						</li>\n					</ul>\n				</div>\n			</fieldset>\n			<fieldset class="table-border">\n				<legend class="font-variation">Border</legend>\n				<div class="wrapper button-style03">\n					<ul>\n						<li class="weight-li">\n							<label>Size</label><span class="controller"><input type="text" name="tableBorderSize" value="0" class="type-text" /><span class="buttons"><img src="../images/xquared/dialogs/arrow_top.gif" alt="" class="plus border" onclick="xq.RichTableController.changeSize(this); return false;" /><img src="../images/xquared/dialogs/arrow_bottom.gif" alt="" class="minus border" onclick="xq.RichTableController.changeSize(this); return false;" /></span></span>\n						</li>\n						<li class="color-li">\n							<label>color</label>\n							<span class="color">\n								<a href="#" id="borderColorBoard" class="tableDialog border" onclick="xq.RichTableController.showColorPicker(this); return false;">&nbsp;</a>\n							</span>\n							<a href="#" class="tableDialog" onclick="xq.RichTableController.showColorPicker(this); return false;" title="search"><img src="../images/xquared/dialogs/arrow06.gif" alt="search" class="search-color" /></a>\n							<input id="borderColorCode" type="hidden" name="tableBorderColor" value="#000000" />\n						</li>\n					</ul>\n				</div>\n			</fieldset>\n			<fieldset class="table-background">\n				<legend class="font-variation">Background</legend>\n				<div class="wrapper button-style03">\n					<ul>\n						<li>\n							<label>color</label>\n							<span class="color">\n								<a href="#" id="backgroundColorBoard" class="tableDialog background" onclick="xq.RichTableController.showColorPicker(this); return false;">&nbsp;</a>\n							</span>\n							<a href="#" class="tableDialog" onclick="xq.RichTableController.showColorPicker(this); return false;" title="search"><img src="../images/xquared/dialogs/arrow06.gif" alt="search" class="search-color" /></a>\n							<input id="backgroundColorCode" type="hidden" name="tableBackgroundColor" value="#ffffff" />\n						</li>\n					</ul>\n				</div>\n			</fieldset>\n			<div class="dialog-buttons">\n				<a href="#" class="button-white cancel">Cancel</a>\n				<a href="#" class="button-gray submit" id="tableDialogSubmit">Insert</a>\n			</div>\n		</div>\n		<a href="#" class="cancel close-dialog"><img src="../images/xquared/dialogs/icon_close.gif" alt="close" /></a>\n	</form>';

/**
 * @requires XQuared.js
 */
xq.Shortcut = xq.Class(/** @lends xq.Shortcut.prototype */{
	/**
	 * Interpretes keyboard event.
	 *
     * @constructs
	 */
	initialize: function(keymapOrExpression) {
		xq.addToFinalizeQueue(this);
		this.keymap = keymapOrExpression;
	},
	matches: function(e) {
		if(typeof this.keymap === "string") this.keymap = xq.Shortcut.interprete(this.keymap).keymap;
		
		// check for key code
		var which = xq.Browser.isGecko && xq.Browser.isMac ? (e.keyCode + "_" + e.charCode) : e.keyCode;
		var keyMatches =
			(this.keymap.which === which) ||
			(this.keymap.which === 32 && which === 25); // 25 is SPACE in Type-3 keyboard.
		if(!keyMatches) return false;
		
		// check for modifier
		if(typeof e.metaKey === "undefined") e.metaKey = false;
		
		var modifierMatches = 
			(this.keymap.shiftKey === e.shiftKey || typeof this.keymap.shiftKey === "undefined") &&
			(this.keymap.altKey === e.altKey || typeof this.keymap.altKey === "undefined") &&
			(this.keymap.ctrlKey === e.ctrlKey || typeof this.keymap.ctrlKey === "undefined") &&
			// Webkit turns on meta key flag when alt key is pressed
			(xq.Browser.isWin && xq.Browser.isWebkit || this.keymap.metaKey === e.metaKey || typeof this.keymap.metaKey === "undefined")
		
		return modifierMatches;
	}
});

xq.Shortcut.interprete = function(expression) {
	expression = expression.toUpperCase();
	
	var which = xq.Shortcut._interpreteWhich(expression.split("+").pop());
	var ctrlKey = xq.Shortcut._interpreteModifier(expression, "CTRL");
	var altKey = xq.Shortcut._interpreteModifier(expression, "ALT");
	var shiftKey = xq.Shortcut._interpreteModifier(expression, "SHIFT");
	var metaKey = xq.Shortcut._interpreteModifier(expression, "META");
	
	var keymap = {};
	
	keymap.which = which;
	if(typeof ctrlKey !== "undefined") keymap.ctrlKey = ctrlKey;
	if(typeof altKey !== "undefined") keymap.altKey = altKey;
	if(typeof shiftKey !== "undefined") keymap.shiftKey = shiftKey;
	if(typeof metaKey !== "undefined") keymap.metaKey = metaKey;
	
	return new xq.Shortcut(keymap);
}

xq.Shortcut._interpreteModifier = function(expression, modifierName) {
	return expression.match("\\(" + modifierName + "\\)") ?
		undefined :
			expression.match(modifierName) ?
			true : false;
}
xq.Shortcut._interpreteWhich = function(keyName) {
	var which = keyName.length === 1 ?
		((xq.Browser.isMac && xq.Browser.isGecko) ? "0_" + keyName.toLowerCase().charCodeAt(0) : keyName.charCodeAt(0)) :
		xq.Shortcut._keyNames[keyName];
	
	if(typeof which === "undefined") throw "Unknown special key name: [" + keyName + "]"
	
	return which;
}
xq.Shortcut._keyNames =
	xq.Browser.isMac && xq.Browser.isGecko ?
	{
		BACKSPACE: "8_0",
		TAB: "9_0",
		RETURN: "13_0",
		ENTER: "13_0",
		ESC: "27_0",
		SPACE: "0_32",
		SHIFT_SPACE: "0_64",
		LEFT: "37_0",
		UP: "38_0",
		RIGHT: "39_0",
		DOWN: "40_0",
		DELETE: "46_0",
		HOME: "36_0",
		END: "35_0",
		PAGEUP: "33_0",
		PAGEDOWN: "34_0",
		COMMA: "0_44",
		HYPHEN: "0_45",
		EQUAL: "0_61",
		PERIOD: "0_46",
		SLASH: "0_47",
		F1: "112_0",
		F2: "113_0",
		F3: "114_0",
		F4: "115_0",
		F5: "116_0",
		F6: "117_0",
		F7: "118_0",
		F8: "119_0"
	}
	:
	{
		BACKSPACE: 8,
		TAB: 9,
		RETURN: 13,
		ENTER: 13,
		ESC: 27,
		SPACE: 32,
		LEFT: 37,
		UP: 38,
		RIGHT: 39,
		DOWN: 40,
		DELETE: 46,
		HOME: 36,
		END: 35,
		PAGEUP: 33,
		PAGEDOWN: 34,
		COMMA: 188,
		HYPHEN: xq.Browser.isTrident ? 189 : 109,
		EQUAL: xq.Browser.isTrident ? 187 : 61,
		PERIOD: 190,
		SLASH: 191,
		F1:112,
		F2:113,
		F3:114,
		F4:115,
		F5:116,
		F6:117,
		F7:118,
		F8:119,
		F9:120,
		F10:121,
		F11:122,
		F12:123
	}

/**
 * @requires XQuared.js
 * @requires Browser.js
 * @requires Timer.js
 * @requires rdom/Factory.js
 * @requires validator/Factory.js
 * @requires EditHistory.js
 * @requires plugin/Base.js
 * @requires RichTable.js
 * @requires ui/Control.js
 * @requires ui/Toolbar.js
 * @requires ui/_templates.js
 * @requires Shortcut.js
 */
xq.Editor = xq.Class(/** @lends xq.Editor.prototype */{
	/**
	 * Initialize editor but it doesn't automatically start designMode. setEditMode should be called after initialization.
	 *
     * @constructs
	 * @param {Object} contentElement TEXTAREA to be replaced with editable area, or DOM ID string for TEXTAREA.
	 * @param {Object} toolbarContainer HTML element which contains toolbar icons, or DOM ID string.
	 */
	 initialize: function(contentElement, toolbarContainer) {
		xq.addToFinalizeQueue(this);

		if(typeof contentElement === 'string'){
			contentElement = xq.$(contentElement);
		}
		
		if(!contentElement) {
			throw "[contentElement] is null";
		}
		
		if(contentElement.nodeName !== 'TEXTAREA') {
			throw "[contentElement] is not a TEXTAREA";
		}
			
		 xq.asEventSource(this, "Editor", ["StartInitialization", "Initialized", "ElementChanged", "BeforeEvent", "AfterEvent", "CurrentContentChanged", "StaticContentChanged", "CurrentEditModeChanged"]);
		 
		/**
		 * Editor's configuration.
		 * @type object
		 */
		this.config = {};
		
		/**
		 * Show confirm dialog when user close browser
		 * @type boolean
		 */
		this.config.enablePreventExit = false;
		
		this.config.PreventExitMessage = "Document is not empty. If you want to leave, click 'Ok' button.";
		
		/**
		 * Automatically gives initial focus.
		 * @type boolean
		 */
		this.config.autoFocusOnInit = false;
		
		/**
		 * set language for l10n
		 * @type string
		 */
		this.config.lang = 'en';
		
		if(xq.Browser.language)
		{
			this.config.lang = xq.Browser.language.substr(0, 2); 
		}
		
		/**
		 * Makes links clickable.
		 * @type boolean
		 */
		this.config.enableLinkClick = false;
		
		/**
		 * Changes mouse cursor to pointer when the cursor is on a link.
		 * @type boolean
		 */
		this.config.changeCursorOnLink = false;
		
		/**
		 * Generates default toolbar if there's no toolbar provided.
		 * @type boolean
		 */
		this.config.generateDefaultToolbar = true;
		
		this._generateDefaultToolbar();

		/**
		 * Image path for default toolbar.
		 * @type String
		 */
		this.config.imagePathForDefaultToolbar = '/contents/images/xquared/toolbar/';
		
		/**
		 * Image path for content.
		 * @type String
		 */
		this.config.imagePathForContent = '/contents/images/xquared/content/';
		
		/**
		 * Image path for dialog.
		 * @type String
		 */
		this.config.imagePathForDialog = '/contents/images/xquared/dialogs/';
		
		/**
		 * Image path for emoticon.
		 * @type String
		 */
		this.config.imagePathForEmoticon = '/contents/images/xquared/dialogs/emoticon/';
		
		/**
		 * Widget Container path.
		 * @type String
		 */
		this.config.widgetContainerPath = 'widget_container.html';
		
		/**
		 * Array of URL containig CSS for WYSIWYG area.
		 * @type Array
		 */
		this.config.contentCssList = ['/contents/css/xq_contents.css'];
		
		/**
		 * Array of URL containig JS for WYSIWYG area.
		 * @type Array
		 */
		this.config.contentJsList = [];
		 
		/**
		 * URL Validation mode. One or "relative", "host_relative", "absolute",
		 * "browser_default"
		 * @type String
		 */
		this.config.urlValidationMode = 'absolute';
		
		/**
		 * Turns off validation in source editor.<br />
		 * Note that the validation will be performed regardless of this value
		 * when you switching edit mode.
		 * @type boolean
		 */
		this.config.noValidationInSourceEditMode = false;
		
		/**
		 * Automatically hooks onsubmit event.
		 * @type boolean
		 */
		this.config.automaticallyHookSubmitEvent = true;
		
		/**
		 * Set of whitelist(tag name and attributes) for use in validator
		 * @type Object
		 */
		this.config.whitelist = xq.predefinedWhitelist;
		
		/**
		 * Specifies a value of ID attribute for WYSIWYG document's body
		 * @type String
		 */
		this.config.bodyId = "";
		
		/**
		 * Specifies a value of CLASS attribute for WYSIWYG document's body
		 * @type String
		 */
		this.config.bodyClass = "xed";
		
		/**
		 * Plugins
		 * @type Object
		 */
		this.config.plugins = {};
		
		/**
		 * Shortcuts
		 * @type Object
		 */
		this.config.shortcuts = {};
		
		/**
		 * Autocorrections
		 * @type Object
		 */
		this.config.autocorrections = {};
		
		/**
		 * Autocompletions
		 * @type Object
		 */
		this.config.autocompletions = {};
		
		/**
		 * Template processors
		 * @type Object
		 */
		this.config.templateProcessors = {};
		
		/**
		 * Context menu handlers
		 * @type Object
		 */
		this.config.contextMenuHandlers = {};
		
		/**
		 * Original content element
		 * @type Element
		 */
		this.contentElement = contentElement;
		
		/**
		 * Owner document of content element
		 * @type Document
		 */
		this.doc = this.contentElement.ownerDocument;
		
		/**
		 * Body of content element
		 * @type Element
		 */
		this.body = this.doc.body;
		
		/**
		 * False or 'source' means source editing mode, true or 'wysiwyg' means
		 * WYSIWYG editing mode.
		 * @type Object
		 */
		this.currentEditMode = '';

		/**
		 * Timer
		 * @type xq.Timer
		 */
		this.timer = new xq.Timer(100);
		
		/**
		 * Base instance
		 * @type xq.rdom.Base
		 */
		this.rdom = xq.rdom.Base.createInstance();
		
		/**
		 * Base instance
		 * 
		 * @type xq.validator.Base
		 */
		this.validator = null;
		
		/**
		 * Outmost wrapper div
		 * @type Element
		 */
		this.outmostWrapper = null;
		
		/**
		 * Source editor container
		 * @type Element
		 */
		this.sourceEditorDiv = null;
		
		/**
		 * Source editor textarea
		 * @type Element
		 */
		this.sourceEditorTextarea = null;
		
		/**
		 * WYSIWYG editor container
		 * @type Element
		 */
		this.wysiwygEditorDiv = null;
		
		/**
		 * Outer frame
		 * @type IFrame
		 */
		this.outerFrame = null;
		
		/**
		 * Design mode iframe
		 * @type IFrame
		 */
		this.editorFrame = null;
		
		this.toolbarContainer = toolbarContainer;
		
		/**
		 * Toolbar container
		 * @type Element
		 */
		this.toolbar = null;
		
		/**
		 * Undo/redo manager
		 * @type xq.EditHistory
		 */
		this.editHistory = null;
		
		/**
		 * Context menu container
		 * @type Element
		 */
		this.contextMenuContainer = null;
		
		/**
		 * Context menu items
		 * @type Array
		 */
		this.contextMenuItems = null;
		
		/**
		 * Platform dependent key event type
		 * @type String
		 */
		this.platformDepedentKeyEventType = (xq.Browser.isMac && xq.Browser.isGecko ? "keypress" : "keydown");
		
		this.addShortcuts(this.getDefaultShortcuts());
		
		this.addListener({
			onEditorCurrentContentChanged: function(xed) {
				var curFocusElement = xed.rdom.getCurrentElement();
				if(!curFocusElement || curFocusElement.ownerDocument !== xed.rdom.getDoc()) {
					return;
				}
				
				if(xed.lastFocusElement !== curFocusElement) {
					if(!xed.rdom.tree.isBlockOnlyContainer(xed.lastFocusElement) && xed.rdom.tree.isBlock(xed.lastFocusElement)) {
						xed.rdom.removeTrailingWhitespace(xed.lastFocusElement);
					}
					xed._fireOnElementChanged(xed, xed.lastFocusElement, curFocusElement);
					xed.lastFocusElement = curFocusElement;
				}
				
				xed.toolbar.triggerUpdate();
			}
		});
	
		if(!this.PreventExit)
		{
			this.PreventExit = {};
		}
		
		// add PreventExit handler	
		xq.observe(window, "beforeunload", function(e)
		{
			if(xed.config.enablePreventExit === false) return;
			
			var content = xed.getCurrentContent().stripTags();
	
			if(content !== '&nbsp;' && content !== xed.PreventExit.defaultContent)
			{
				xq.stopEvent(e, xed.config.PreventExitMessage);
			}
		});
	
	},
	
	finalize: function() {
		for(var key in this.config.plugins) this.config.plugins[key].unload();
	},
	
	/**
	 * Generate default toolbar buttons, groups and map
	 * 
	 * @type Object
	 */
	_generateDefaultToolbar: function()
	{
		this.config.defaultToolbarButtonList = [];
		
		this.config.defaultToolbarButtons = {};
		
		this.config.defaultToolbarButtons.foregroundColor =
		{className:"foregroundColor", title:this._("Foreground color"), list:[
			{style: {backgroundColor:"#ffd8d8",border: "1px solid #e5d2c4"}, handler:"xed.handleColorPicker('#ffd8d8')"},
			{style: {backgroundColor:"#ffead9",border: "1px solid #e4d1c3"}, handler:"xed.handleColorPicker('#ffead9')"},
			{style: {backgroundColor:"#fef2dc",border: "1px solid #e5dac6"}, handler:"xed.handleColorPicker('#fef2dc')"},
			{style: {backgroundColor:"#fff5da",border: "1px solid #e5ddc6"}, handler:"xed.handleColorPicker('#fff5da')"},
			{style: {backgroundColor:"#eefed9",border: "1px solid #d5e4c5"}, handler:"xed.handleColorPicker('#eefed9')"},
			{style: {backgroundColor:"#dafeda",border: "1px solid #c2e4c3"}, handler:"xed.handleColorPicker('#dafeda')"},
			{style: {backgroundColor:"#d8ffff",border: "1px solid #c2e6e6"}, handler:"xed.handleColorPicker('#d8ffff')"},
			{style: {backgroundColor:"#d9f7ff",border: "1px solid #c2dfe7"}, handler:"xed.handleColorPicker('#d9f7ff')"},
			{style: {backgroundColor:"#d5ebff",border: "1px solid #bed3e6"}, handler:"xed.handleColorPicker('#d5ebff')"},
			{style: {backgroundColor:"#eed8ff",border: "1px solid #d6c3e3"}, handler:"xed.handleColorPicker('#eed8ff')"},
			{style: {backgroundColor:"#fed8ff",border: "1px solid #e5c1e5"}, handler:"xed.handleColorPicker('#fed8ff')"},
			{style: {backgroundColor:"#ffffff",border: "1px solid #e5e5e5"}, handler:"xed.handleColorPicker('#ffffff')"},

			{style: {backgroundColor:"#fe8c8c",border: "1px solid #e77f80"}, handler:"xed.handleColorPicker('#fe8c8c')"},
			{style: {backgroundColor:"#feba8d",border: "1px solid #e7a67c"}, handler:"xed.handleColorPicker('#feba8d')"},
			{style: {backgroundColor:"#ffe88b",border: "1px solid #e5d07d"}, handler:"xed.handleColorPicker('#ffe88b')"},
			{style: {backgroundColor:"#ffff8d",border: "1px solid #e6e47d"}, handler:"xed.handleColorPicker('#ffff8d')"},
			{style: {backgroundColor:"#d0fc8d",border: "1px solid #bbe17e"}, handler:"xed.handleColorPicker('#d0fc8d')"},
			{style: {backgroundColor:"#8efb8e",border: "1px solid #7ee280"}, handler:"xed.handleColorPicker('#8efb8e')"},
			{style: {backgroundColor:"#8bffff",border: "1px solid #7ee6e5"}, handler:"xed.handleColorPicker('#8bffff')"},
			{style: {backgroundColor:"#8ce8ff",border: "1px solid #7fcfe6"}, handler:"xed.handleColorPicker('#8ce8ff')"},
			{style: {backgroundColor:"#8b8cff",border: "1px solid #7d7fe6"}, handler:"xed.handleColorPicker('#8b8cff')"},
			{style: {backgroundColor:"#d18cff",border: "1px solid #bc7de5"}, handler:"xed.handleColorPicker('#d18cff')"},
			{style: {backgroundColor:"#ff8bfe",border: "1px solid #e47fe5"}, handler:"xed.handleColorPicker('#ff8bfe')"},
			{style: {backgroundColor:"#cccccc",border: "1px solid #aeaeae"}, handler:"xed.handleColorPicker('#cccccc')"},

			{style: {backgroundColor:"#ff0103",border: "1px solid #e40001"}, handler:"xed.handleColorPicker('#ff0103')"},
			{style: {backgroundColor:"#ff6600",border: "1px solid #e85c00"}, handler:"xed.handleColorPicker('#ff6600')"},
			{style: {backgroundColor:"#ffcc01",border: "1px solid #e4b600"}, handler:"xed.handleColorPicker('#ffcc01')"},
			{style: {backgroundColor:"#ffff01",border: "1px solid #e5e400"}, handler:"xed.handleColorPicker('#ffff01')"},
			{style: {backgroundColor:"#96f908",border: "1px solid #86e004"}, handler:"xed.handleColorPicker('#96f908')"},
			{style: {backgroundColor:"#07f905",border: "1px solid #03e005"}, handler:"xed.handleColorPicker('#07f905')"},
			{style: {backgroundColor:"#02feff",border: "1px solid #00e4e3"}, handler:"xed.handleColorPicker('#02feff')"},
			{style: {backgroundColor:"#00ccff",border: "1px solid #00b8e4"}, handler:"xed.handleColorPicker('#00ccff')"},
			{style: {backgroundColor:"#0100fe",border: "1px solid #0000e6"}, handler:"xed.handleColorPicker('#0100fe')"},
			{style: {backgroundColor:"#9801ff",border: "1px solid #8900e6"}, handler:"xed.handleColorPicker('#9801ff')"},
			{style: {backgroundColor:"#fc01fe",border: "1px solid #e700e6"}, handler:"xed.handleColorPicker('#fc01fe')"},
			{style: {backgroundColor:"#999999",border: "1px solid #808080"}, handler:"xed.handleColorPicker('#999999')"},

			{style: {backgroundColor:"#990002",border: "1px solid #890101"}, handler:"xed.handleColorPicker('#990002')"},
			{style: {backgroundColor:"#b65006",border: "1px solid #ad6d00"}, handler:"xed.handleColorPicker('#b65006')"},
			{style: {backgroundColor:"#bf7900",border: "1px solid #ac6e01"}, handler:"xed.handleColorPicker('#bf7900')"},
			{style: {backgroundColor:"#cca500",border: "1px solid #b89200"}, handler:"xed.handleColorPicker('#cca500')"},
			{style: {backgroundColor:"#5a9603",border: "1px solid #518604"}, handler:"xed.handleColorPicker('#5a9603')"},
			{style: {backgroundColor:"#059502",border: "1px solid #048504"}, handler:"xed.handleColorPicker('#059502')"},
			{style: {backgroundColor:"#009997",border: "1px solid #008886"}, handler:"xed.handleColorPicker('#009997')"},
			{style: {backgroundColor:"#007998",border: "1px solid #006d89"}, handler:"xed.handleColorPicker('#007998')"},
			{style: {backgroundColor:"#095392",border: "1px solid #084a84"}, handler:"xed.handleColorPicker('#095392')"},
			{style: {backgroundColor:"#6a19a4",border: "1px solid #601693"}, handler:"xed.handleColorPicker('#6a19a4')"},
			{style: {backgroundColor:"#98019a",border: "1px solid #8a008b"}, handler:"xed.handleColorPicker('#98019a')"},
			{style: {backgroundColor:"#666666",border: "1px solid #555555"}, handler:"xed.handleColorPicker('#666666')"},

			{style: {backgroundColor:"#590100",border: "1px solid #510000"}, handler:"xed.handleColorPicker('#590100')"},
			{style: {backgroundColor:"#773505",border: "1px solid #714901"}, handler:"xed.handleColorPicker('#773505')"},
			{style: {backgroundColor:"#7f5000",border: "1px solid #734901"}, handler:"xed.handleColorPicker('#7f5000')"},
			{style: {backgroundColor:"#927300",border: "1px solid #836600"}, handler:"xed.handleColorPicker('#927300')"},
			{style: {backgroundColor:"#365802",border: "1px solid #304f03"}, handler:"xed.handleColorPicker('#365802')"},
			{style: {backgroundColor:"#035902",border: "1px solid #025102"}, handler:"xed.handleColorPicker('#035902')"},
			{style: {backgroundColor:"#01595a",border: "1px solid #00504f"}, handler:"xed.handleColorPicker('#01595a')"},
			{style: {backgroundColor:"#00485b",border: "1px solid #004252"}, handler:"xed.handleColorPicker('#00485b')"},
			{style: {backgroundColor:"#083765",border: "1px solid #06315b"}, handler:"xed.handleColorPicker('#083765')"},
			{style: {backgroundColor:"#370159",border: "1px solid #300151"}, handler:"xed.handleColorPicker('#370159')"},
			{style: {backgroundColor:"#59005a",border: "1px solid #520052"}, handler:"xed.handleColorPicker('#59005a')"},
			{style: {backgroundColor:"#000000",border: "1px solid #000000"}, handler:"xed.handleColorPicker('#000000')"}
		]};
		
		this.config.defaultToolbarButtons.backgroundColor = 		
		{className:"backgroundColor", title:this._("Background color"), list:[
			{style: {backgroundColor:"#FFF700"}, handler:"xed.handleBackgroundColor('#FFF700')"},
			{style: {backgroundColor:"#AEFF66"}, handler:"xed.handleBackgroundColor('#AEFF66')"},
			{style: {backgroundColor:"#FFCC66"}, handler:"xed.handleBackgroundColor('#FFCC66')"},
			{style: {backgroundColor:"#DCB0FB"}, handler:"xed.handleBackgroundColor('#DCB0FB')"},
			{style: {backgroundColor:"#B0EEFB"}, handler:"xed.handleBackgroundColor('#B0EEFB')"},
			{style: {backgroundColor:"#FBBDB0"}, handler:"xed.handleBackgroundColor('#FBBDB0')"},
			{style: {backgroundColor:"#FFFFFF"}, handler:"xed.handleBackgroundColor('#FFFFFF')"}
		]};
		
		this.config.defaultToolbarButtons.fontFace = 
			{className:"fontFace", title:this._("Font face"), list:[
	            {html:"Arial", style: {fontFamily: "Arial"}, handler:"xed.handleFontFace('Arial')"},
	            {html:"Comic Sans MS", style: {fontFamily: "Comic Sans MS"}, handler:"xed.handleFontFace('Comic Sans MS')"},
	            {html:"Courier New", style: {fontFamily: "Courier New"}, handler:"xed.handleFontFace('Courier New')"},
	            {html:"Georgia", style: {fontFamily: "Georgia"}, handler:"xed.handleFontFace('Georgia')"},
	            {html:"Tahoma", style: {fontFamily: "Tahoma"}, handler:"xed.handleFontFace('Tahoma')"},
	            {html:"Times", style: {fontFamily: "Times"}, handler:"xed.handleFontFace('Times')"},
	            {html:"Trebuchte MS", style: {fontFamily: "Trebuchte MS"}, handler:"xed.handleFontFace('Trebuchte MS')"},
	            {html:"Verdana", style: {fontFamily: "Verdana"}, handler:"xed.handleFontFace('Verdana')"}
            ]};

		this.config.defaultToolbarButtons.fontSize = 
		{className:"fontSize", title:this._("Font size"), list:[
            {html:"Lorem ipsum dolor (8pt)", style: {fontSize: "8pt", marginBottom: "3px"}, handler:"xed.handleFontSize('1')"},
            {html:"Lorem ipsum dolor (10pt)", style: {fontSize: "10pt", marginBottom: "3px"}, handler:"xed.handleFontSize('2')"},
            {html:"Lorem ipsum dolor (12pt)", style: {fontSize: "12pt", marginBottom: "6px"}, handler:"xed.handleFontSize('3')"},
            {html:"Lorem ipsum dolor (14pt)", style: {fontSize: "14pt", marginBottom: "10px"}, handler:"xed.handleFontSize('4')"},
            {html:"Lorem ipsum dolor (18pt)", style: {fontSize: "18pt", marginBottom: "16px"}, handler:"xed.handleFontSize('5')"},
            {html:"Lorem ipsum dolor (24pt)", style: {fontSize: "24pt", marginBottom: "6px"}, handler:"xed.handleFontSize('6')"}
		]};
		
		// link
		this.config.defaultToolbarButtons.link = {className:"link", title:this._("Link"), handler:"xed.handleLink()"};
		this.config.defaultToolbarButtons.removeLink = {className:"removeLink", title:this._("Remove link"), handler:"xed.handleRemoveLink()"};
		
		// style
		this.config.defaultToolbarButtons.strongEmphasis = {className:"strongEmphasis", title:this._("Strong emphasis"), handler:"xed.handleStrongEmphasis()"};
		this.config.defaultToolbarButtons.emphasis = {className:"emphasis", title:this._("Emphasis"), handler:"xed.handleEmphasis()"};
		this.config.defaultToolbarButtons.underline = {className:"underline", title:this._("Underline"), handler:"xed.handleUnderline()"};
		this.config.defaultToolbarButtons.strike = {className:"strike", title:this._("Strike"), handler:"xed.handleStrike()"};
		this.config.defaultToolbarButtons.superscription = {className:"superscription", title:this._("Superscription"), handler:"xed.handleSuperscription()"};
		this.config.defaultToolbarButtons.subscription = {className:"subscription", title:this._("Subscription"), handler:"xed.handleSubscription()"};
		this.config.defaultToolbarButtons.removeFormat = {className:"removeFormat", title:this._("Remove format"), handler:"xed.handleRemoveFormat()"};
		
		// justification
		this.config.defaultToolbarButtons.justifyLeft = {className:"justifyLeft", title:this._("Justify left"), handler:"xed.handleJustify('left')"};
		this.config.defaultToolbarButtons.justifyCenter = {className:"justifyCenter", title:this._("Justify center"), handler:"xed.handleJustify('center')"};
		this.config.defaultToolbarButtons.justifyRight = {className:"justifyRight", title:this._("Justify right"), handler:"xed.handleJustify('right')"};
		this.config.defaultToolbarButtons.justifyBoth = {className:"justifyBoth", title:this._("Justify both"), handler:"xed.handleJustify('both')"};

		// indentation
		this.config.defaultToolbarButtons.indent = {className:"indent", title:this._("Indent"), handler:"xed.handleIndent()"};
		this.config.defaultToolbarButtons.outdent = {className:"outdent", title:this._("Outdent"), handler:"xed.handleOutdent()"};
		
		// block
		this.config.defaultToolbarButtons.paragraph = {className:"paragraph", title:this._("Paragraph"), handler:"xed.handleApplyBlock('P')"};
		this.config.defaultToolbarButtons.heading1 = {className:"heading1", title:this._("Heading"), list:[
			{html:"Heading1", style: {fontSize: "2.845em", marginBottom: "3px"}, handler:"xed.handleApplyBlock('H1')"},
			{html:"Heading2", style: {fontSize: "2.46em", marginBottom: "3px"}, handler:"xed.handleApplyBlock('H2')"},
			{html:"Heading3", style: {fontSize: "2.153em", marginBottom: "3px"}, handler:"xed.handleApplyBlock('H3')"},
			{html:"Heading4", style: {fontSize: "1.922em", marginBottom: "3px"}, handler:"xed.handleApplyBlock('H4')"},
			{html:"Heading5", style: {fontSize: "1.461em", marginBottom: "3px"}, handler:"xed.handleApplyBlock('H5')"},
			{html:"Heading6", style: {fontSize: "1.23em", marginBottom: "3px"}, handler:"xed.handleApplyBlock('H6')"}
		]};
		
		this.config.defaultToolbarButtons.blockquote = {className:"blockquote", title:this._("Blockquote"), handler:"xed.handleApplyBlock('BLOCKQUOTE')"};
		this.config.defaultToolbarButtons.code = {className:"code", title:this._("Code"), handler:"xed.handleList('OL', 'code')"};
		this.config.defaultToolbarButtons.division = {className:"division", title:this._("Div"), handler:"xed.handleApplyBlock('DIV')"};
		this.config.defaultToolbarButtons.unorderedList = {className:"unorderedList", title:this._("Unordered list"), handler:"xed.handleList('UL')"};
		this.config.defaultToolbarButtons.orderedList = {className:"orderedList", title:this._("Ordered list"), handler:"xed.handleList('OL')"};

		this.config.defaultToolbarButtons.table =  {className:"table", title:this._("Table"), handler:"xed.handleTable()"};
		this.config.defaultToolbarButtons.separator =  {className:"separator", title:this._("Separator"), handler:"xed.handleSeparator()"};
		this.config.defaultToolbarButtons.character =  {className:"character", title:this._("Character"), list: [
            {html:"%E3%80%81", handler:"xed.handleCharacter('%E3%80%81')"},
            {html:"%E3%80%82", handler:"xed.handleCharacter('%E3%80%82')"},
            {html:"%C2%B7", handler:"xed.handleCharacter('%C2%B7')"},
			{html:"%E2%80%A5", handler:"xed.handleCharacter('%E2%80%A5')"},
			{html:"%E2%80%A6", handler:"xed.handleCharacter('%E2%80%A6')"},
			{html:"%C2%A8", handler:"xed.handleCharacter('%C2%A8')"},
			{html:"%E3%80%83", handler:"xed.handleCharacter('%E3%80%83')"},
			{html:"%E2%80%95", handler:"xed.handleCharacter('%E2%80%95')"},
			{html:"%E2%88%A5", handler:"xed.handleCharacter('%E2%88%A5')"},
			{html:"%EF%BC%BC", handler:"xed.handleCharacter('%EF%BC%BC')"},
			{html:"%E2%88%BC", handler:"xed.handleCharacter('%E2%88%BC')"},
			{html:"%E2%80%98", handler:"xed.handleCharacter('%E2%80%98')"},
			{html:"%E2%80%99", handler:"xed.handleCharacter('%E2%80%99')"},
			{html:"%E2%80%9C", handler:"xed.handleCharacter('%E2%80%9C')"},
			{html:"%E2%80%9D", handler:"xed.handleCharacter('%E2%80%9D')"},
			{html:"%E3%80%94", handler:"xed.handleCharacter('%E3%80%94')"},
			{html:"%E3%80%95", handler:"xed.handleCharacter('%E3%80%95')"},
			{html:"%E3%80%88", handler:"xed.handleCharacter('%E3%80%88')"},
			{html:"%E3%80%89", handler:"xed.handleCharacter('%E3%80%89')"},
			{html:"%E3%80%8A", handler:"xed.handleCharacter('%E3%80%8A')"},
			{html:"%E3%80%8B", handler:"xed.handleCharacter('%E3%80%8B')"},
			{html:"%E3%80%8C", handler:"xed.handleCharacter('%E3%80%8C')"},
			{html:"%E3%80%8D", handler:"xed.handleCharacter('%E3%80%8D')"},
			{html:"%E3%80%8E", handler:"xed.handleCharacter('%E3%80%8E')"},
			{html:"%E3%80%8F", handler:"xed.handleCharacter('%E3%80%8F')"},
			{html:"%E3%80%90", handler:"xed.handleCharacter('%E3%80%90')"},
			{html:"%E3%80%91", handler:"xed.handleCharacter('%E3%80%91')"},
			{html:"%C2%B1", handler:"xed.handleCharacter('%C2%B1')"},
			{html:"%C3%97", handler:"xed.handleCharacter('%C3%97')"},
			{html:"%C3%B7", handler:"xed.handleCharacter('%C3%B7')"},
			{html:"%E2%89%A0", handler:"xed.handleCharacter('%E2%89%A0')"},
			{html:"%E2%89%A4", handler:"xed.handleCharacter('%E2%89%A4')"},
			{html:"%E2%89%A5", handler:"xed.handleCharacter('%E2%89%A5')"},
			{html:"%E2%88%9E", handler:"xed.handleCharacter('%E2%88%9E')"},
			{html:"%E2%88%B4", handler:"xed.handleCharacter('%E2%88%B4')"},
			{html:"%C2%B0", handler:"xed.handleCharacter('%C2%B0')"},
			{html:"%E2%80%B2", handler:"xed.handleCharacter('%E2%80%B2')"},
			{html:"%E2%80%B3", handler:"xed.handleCharacter('%E2%80%B3')"},
			{html:"%E2%84%83", handler:"xed.handleCharacter('%E2%84%83')"},
			{html:"%E2%84%AB", handler:"xed.handleCharacter('%E2%84%AB')"},
			{html:"%EF%BF%A0", handler:"xed.handleCharacter('%EF%BF%A0')"},
			{html:"%EF%BF%A1", handler:"xed.handleCharacter('%EF%BF%A1')"},
			{html:"%EF%BF%A5", handler:"xed.handleCharacter('%EF%BF%A5')"},
			{html:"%E2%99%82", handler:"xed.handleCharacter('%E2%99%82')"},
			{html:"%E2%99%80", handler:"xed.handleCharacter('%E2%99%80')"},
			{html:"%E2%88%A0", handler:"xed.handleCharacter('%E2%88%A0')"},
			{html:"%E2%8A%A5", handler:"xed.handleCharacter('%E2%8A%A5')"},
			{html:"%E2%8C%92", handler:"xed.handleCharacter('%E2%8C%92')"},
			{html:"%E2%88%82", handler:"xed.handleCharacter('%E2%88%82')"},
			{html:"%E2%88%87", handler:"xed.handleCharacter('%E2%88%87')"},
			{html:"%E2%89%A1", handler:"xed.handleCharacter('%E2%89%A1')"},
			{html:"%E2%89%92", handler:"xed.handleCharacter('%E2%89%92')"},
			{html:"%C2%A7", handler:"xed.handleCharacter('%C2%A7')"},
			{html:"%E2%80%BB", handler:"xed.handleCharacter('%E2%80%BB')"},
			{html:"%E2%98%86", handler:"xed.handleCharacter('%E2%98%86')"},
			{html:"%E2%98%85", handler:"xed.handleCharacter('%E2%98%85')"},
			{html:"%E2%97%8B", handler:"xed.handleCharacter('%E2%97%8B')"},
			{html:"%E2%97%8F", handler:"xed.handleCharacter('%E2%97%8F')"},
			{html:"%E2%97%8E", handler:"xed.handleCharacter('%E2%97%8E')"},
			{html:"%E2%97%87", handler:"xed.handleCharacter('%E2%97%87')"},
			{html:"%E2%97%86", handler:"xed.handleCharacter('%E2%97%86')"},
			{html:"%E2%96%A1", handler:"xed.handleCharacter('%E2%96%A1')"},
			{html:"%E2%96%A0", handler:"xed.handleCharacter('%E2%96%A0')"},
			{html:"%E2%96%B3", handler:"xed.handleCharacter('%E2%96%B3')"},
			{html:"%E2%96%B2", handler:"xed.handleCharacter('%E2%96%B2')"},
			{html:"%E2%96%BD", handler:"xed.handleCharacter('%E2%96%BD')"},
			{html:"%E2%96%BC", handler:"xed.handleCharacter('%E2%96%BC')"},
			{html:"%E2%86%92", handler:"xed.handleCharacter('%E2%86%92')"},
			{html:"%E2%86%90", handler:"xed.handleCharacter('%E2%86%90')"},
			{html:"%E2%86%91", handler:"xed.handleCharacter('%E2%86%91')"},
			{html:"%E2%86%93", handler:"xed.handleCharacter('%E2%86%93')"},
			{html:"%E2%86%94", handler:"xed.handleCharacter('%E2%86%94')"},
			{html:"%E3%80%93", handler:"xed.handleCharacter('%E3%80%93')"},
			{html:"%E2%89%AA", handler:"xed.handleCharacter('%E2%89%AA')"},
			{html:"%E2%89%AB", handler:"xed.handleCharacter('%E2%89%AB')"},
			{html:"%E2%88%9A", handler:"xed.handleCharacter('%E2%88%9A')"},
			{html:"%E2%88%BD", handler:"xed.handleCharacter('%E2%88%BD')"},
			{html:"%E2%88%9D", handler:"xed.handleCharacter('%E2%88%9D')"},
			{html:"%E2%88%B5", handler:"xed.handleCharacter('%E2%88%B5')"},
			{html:"%E2%88%AB", handler:"xed.handleCharacter('%E2%88%AB')"},
			{html:"%E2%88%AC", handler:"xed.handleCharacter('%E2%88%AC')"},
			{html:"%E2%88%88", handler:"xed.handleCharacter('%E2%88%88')"},
			{html:"%E2%88%8B", handler:"xed.handleCharacter('%E2%88%8B')"},
			{html:"%E2%8A%86", handler:"xed.handleCharacter('%E2%8A%86')"},
			{html:"%E2%8A%87", handler:"xed.handleCharacter('%E2%8A%87')"},
			{html:"%E2%8A%82", handler:"xed.handleCharacter('%E2%8A%82')"},
			{html:"%E2%8A%83", handler:"xed.handleCharacter('%E2%8A%83')"},
			{html:"%E2%88%AA", handler:"xed.handleCharacter('%E2%88%AA')"},
			{html:"%E2%88%A9", handler:"xed.handleCharacter('%E2%88%A9')"},
			{html:"%E2%88%A7", handler:"xed.handleCharacter('%E2%88%A7')"},
			{html:"%E2%88%A8", handler:"xed.handleCharacter('%E2%88%A8')"},
			{html:"%EF%BF%A2", handler:"xed.handleCharacter('%EF%BF%A2')"},
			{html:"%E2%87%92", handler:"xed.handleCharacter('%E2%87%92')"},
			{html:"%E2%87%94", handler:"xed.handleCharacter('%E2%87%94')"},
			{html:"%E2%88%80", handler:"xed.handleCharacter('%E2%88%80')"},
			{html:"%E2%88%83", handler:"xed.handleCharacter('%E2%88%83')"},
			{html:"%EF%BD%9E", handler:"xed.handleCharacter('%EF%BD%9E')"},
			{html:"%CB%87", handler:"xed.handleCharacter('%CB%87')"},
			{html:"%CB%98", handler:"xed.handleCharacter('%CB%98')"},
			{html:"%C2%B8", handler:"xed.handleCharacter('%C2%B8')"},
			{html:"%CB%9B", handler:"xed.handleCharacter('%CB%9B')"},
			{html:"%C2%A1", handler:"xed.handleCharacter('%C2%A1')"},
			{html:"%C2%BF", handler:"xed.handleCharacter('%C2%BF')"},
			{html:"%CB%90", handler:"xed.handleCharacter('%CB%90')"},
			{html:"%E2%88%AE", handler:"xed.handleCharacter('%E2%88%AE')"},
			{html:"%E2%88%91", handler:"xed.handleCharacter('%E2%88%91')"},
			{html:"%E2%88%8F", handler:"xed.handleCharacter('%E2%88%8F')"},
			{html:"%C2%A4", handler:"xed.handleCharacter('%C2%A4')"},
			{html:"%E2%84%89", handler:"xed.handleCharacter('%E2%84%89')"},
			{html:"%E2%80%B0", handler:"xed.handleCharacter('%E2%80%B0')"},
			{html:"%E2%97%81", handler:"xed.handleCharacter('%E2%97%81')"},
			{html:"%E2%97%80", handler:"xed.handleCharacter('%E2%97%80')"},
			{html:"%E2%96%B7", handler:"xed.handleCharacter('%E2%96%B7')"},
			{html:"%E2%96%B6", handler:"xed.handleCharacter('%E2%96%B6')"},
			{html:"%E2%99%A4", handler:"xed.handleCharacter('%E2%99%A4')"},
			{html:"%E2%99%A0", handler:"xed.handleCharacter('%E2%99%A0')"},
			{html:"%E2%99%A1", handler:"xed.handleCharacter('%E2%99%A1')"},
			{html:"%E2%99%A5", handler:"xed.handleCharacter('%E2%99%A5')"},
			{html:"%E2%99%A7", handler:"xed.handleCharacter('%E2%99%A7')"},
			{html:"%E2%99%A3", handler:"xed.handleCharacter('%E2%99%A3')"},
			{html:"%E2%8A%99", handler:"xed.handleCharacter('%E2%8A%99')"},
			{html:"%E2%97%88", handler:"xed.handleCharacter('%E2%97%88')"},
			{html:"%E2%96%A3", handler:"xed.handleCharacter('%E2%96%A3')"},
			{html:"%E2%97%90", handler:"xed.handleCharacter('%E2%97%90')"},
			{html:"%E2%97%91", handler:"xed.handleCharacter('%E2%97%91')"},
			{html:"%E2%96%92", handler:"xed.handleCharacter('%E2%96%92')"},
			{html:"%E2%96%A4", handler:"xed.handleCharacter('%E2%96%A4')"},
			{html:"%E2%96%A5", handler:"xed.handleCharacter('%E2%96%A5')"},
			{html:"%E2%96%A8", handler:"xed.handleCharacter('%E2%96%A8')"},
			{html:"%E2%96%A7", handler:"xed.handleCharacter('%E2%96%A7')"},
			{html:"%E2%96%A6", handler:"xed.handleCharacter('%E2%96%A6')"},
			{html:"%E2%96%A9", handler:"xed.handleCharacter('%E2%96%A9')"},
			{html:"%E2%99%A8", handler:"xed.handleCharacter('%E2%99%A8')"},
			{html:"%E2%98%8F", handler:"xed.handleCharacter('%E2%98%8F')"},
			{html:"%E2%98%8E", handler:"xed.handleCharacter('%E2%98%8E')"},
			{html:"%E2%98%9C", handler:"xed.handleCharacter('%E2%98%9C')"},
			{html:"%E2%98%9E", handler:"xed.handleCharacter('%E2%98%9E')"},
			{html:"%C2%B6", handler:"xed.handleCharacter('%C2%B6')"},
			{html:"%E2%80%A0", handler:"xed.handleCharacter('%E2%80%A0')"},
			{html:"%E2%80%A1", handler:"xed.handleCharacter('%E2%80%A1')"},
			{html:"%E2%86%95", handler:"xed.handleCharacter('%E2%86%95')"},
			{html:"%E2%86%97", handler:"xed.handleCharacter('%E2%86%97')"},
			{html:"%E2%86%99", handler:"xed.handleCharacter('%E2%86%99')"},
			{html:"%E2%86%96", handler:"xed.handleCharacter('%E2%86%96')"},
			{html:"%E2%86%98", handler:"xed.handleCharacter('%E2%86%98')"},
			{html:"%E2%99%AD", handler:"xed.handleCharacter('%E2%99%AD')"},
			{html:"%E2%99%A9", handler:"xed.handleCharacter('%E2%99%A9')"},
			{html:"%E2%99%AA", handler:"xed.handleCharacter('%E2%99%AA')"},
			{html:"%E2%99%AC", handler:"xed.handleCharacter('%E2%99%AC')"},
			{html:"%E3%89%BF", handler:"xed.handleCharacter('%E3%89%BF')"},
			{html:"%E3%88%9C", handler:"xed.handleCharacter('%E3%88%9C')"},
			{html:"%E2%84%96", handler:"xed.handleCharacter('%E2%84%96')"},
			{html:"%E3%8F%87", handler:"xed.handleCharacter('%E3%8F%87')"},
			{html:"%E2%84%A2", handler:"xed.handleCharacter('%E2%84%A2')"},
			{html:"%E3%8F%82", handler:"xed.handleCharacter('%E3%8F%82')"},
			{html:"%E3%8F%98", handler:"xed.handleCharacter('%E3%8F%98')"},
			{html:"%E2%84%A1", handler:"xed.handleCharacter('%E2%84%A1')"}
		]};
		
		this.config.defaultToolbarButtons.emoticon = {className:"emoticon", title:this._("Emoticon"), list: [
            {html:"num1.gif", handler:"xed.handleEmoticon('num1.gif')"},
            {html:"num2.gif", handler:"xed.handleEmoticon('num2.gif')"},
            {html:"num3.gif", handler:"xed.handleEmoticon('num3.gif')"},
            {html:"num4.gif", handler:"xed.handleEmoticon('num4.gif')"},
            {html:"num5.gif", handler:"xed.handleEmoticon('num5.gif')"},
            {html:"question.gif", handler:"xed.handleEmoticon('question.gif')"},
            {html:"disk.gif", handler:"xed.handleEmoticon('disk.gif')"},
            {html:"play.gif", handler:"xed.handleEmoticon('play.gif')"},
            {html:"flag1.gif", handler:"xed.handleEmoticon('flag1.gif')"},
            {html:"flag2.gif", handler:"xed.handleEmoticon('flag2.gif')"},
            {html:"flag3.gif", handler:"xed.handleEmoticon('flag3.gif')"},
            {html:"flag4.gif", handler:"xed.handleEmoticon('flag4.gif')"},
            {html:"arrow_left.gif", handler:"xed.handleEmoticon('arrow_left.gif')"},
            {html:"arrow_right.gif", handler:"xed.handleEmoticon('arrow_right.gif')"},
            {html:"arrow_up.gif", handler:"xed.handleEmoticon('arrow_up.gif')"},
            {html:"arrow_down.gif", handler:"xed.handleEmoticon('arrow_down.gif')"},
            {html:"step1.gif", handler:"xed.handleEmoticon('step1.gif')"},
            {html:"step2.gif", handler:"xed.handleEmoticon('step2.gif')"},
            {html:"step3.gif", handler:"xed.handleEmoticon('step3.gif')"},
            {html:"note.gif", handler:"xed.handleEmoticon('note.gif')"},
            {html:"heart.gif", handler:"xed.handleEmoticon('heart.gif')"},
            {html:"good.gif", handler:"xed.handleEmoticon('good.gif')"},
            {html:"bad.gif", handler:"xed.handleEmoticon('bad.gif')"}
		]};
		
		this.config.defaultToolbarButtons.html = {className:"html", title:this._("Edit source"), handler:"xed.toggleSourceAndWysiwygMode()" };
		
		this.config.defaultToolbarButtons.undo = {className:"undo", title:this._("Undo"), handler:"xed.handleUndo()" };
		this.config.defaultToolbarButtons.redo = {className:"redo", title:this._("Redo"), handler:"xed.handleRedo()" };

		this.config.defaultToolbarButtonGroups = {
			"color": [
			          this.config.defaultToolbarButtons.foregroundColor,
			          this.config.defaultToolbarButtons.backgroundColor
 			],
 			"font": [
 					this.config.defaultToolbarButtons.fontFace,
 					this.config.defaultToolbarButtons.fontSize
			],
			"link": [
				this.config.defaultToolbarButtons.link,
				this.config.defaultToolbarButtons.removeLink
			],
			"style": [
		  		this.config.defaultToolbarButtons.strongEmphasis,
				this.config.defaultToolbarButtons.emphasis,
				this.config.defaultToolbarButtons.underline,
				this.config.defaultToolbarButtons.strike,
				this.config.defaultToolbarButtons.superscription,
				this.config.defaultToolbarButtons.subscription,
				this.config.defaultToolbarButtons.removeFormat
			],
			"justification": [
          		this.config.defaultToolbarButtons.justifyLeft,
        		this.config.defaultToolbarButtons.justifyCenter,
        		this.config.defaultToolbarButtons.justifyRight,
        		this.config.defaultToolbarButtons.justifyBoth
			],
			"indentation": [
        		this.config.defaultToolbarButtons.indent,
        		this.config.defaultToolbarButtons.outdent
  			],
  			"block": [
				this.config.defaultToolbarButtons.blockquote,
				this.config.defaultToolbarButtons.code,
				this.config.defaultToolbarButtons.division,
				this.config.defaultToolbarButtons.unorderedList,
				this.config.defaultToolbarButtons.orderedList
  			],
  			"insert": [
  			    this.config.defaultToolbarButtons.table,
  				this.config.defaultToolbarButtons.separator,
  				this.config.defaultToolbarButtons.character,
  				this.config.defaultToolbarButtons.emoticon
  			],
  			"html": [
  				this.config.defaultToolbarButtons.html
	        ],
	        "undo": [
  				this.config.defaultToolbarButtons.undo,
  				this.config.defaultToolbarButtons.redo
  			]
		};
		
		/**
		 * Button map for default toolbar
		 * 
		 * @type Object
		 */
		this.config.defaultToolbarButtonMap = [
		    this.config.defaultToolbarButtonGroups.font,
		    this.config.defaultToolbarButtonGroups.color,
		    this.config.defaultToolbarButtonGroups.style,
		    this.config.defaultToolbarButtonGroups.justification,
		    this.config.defaultToolbarButtonGroups.indentation,
		    this.config.defaultToolbarButtonGroups.block,
		    this.config.defaultToolbarButtonGroups.link,
		    this.config.defaultToolbarButtonGroups.insert,
		    this.config.defaultToolbarButtonGroups.html,
		    this.config.defaultToolbarButtonGroups.undo
		];
	},
	
	/////////////////////////////////////////////
	// Configuration Management
	
	getDefaultShortcuts: function() {
		if(xq.Browser.isMac) {
			// Mac FF & Safari
			return [
				{event:"Ctrl+Shift+SPACE", handler:"this.handleAutocompletion(); stop = true;"},
				{event:"SPACE", handler:"this.handleSpace()"},
				{event:"ENTER", handler:"this.handleEnter(false, false)"},
				{event:"Ctrl+ENTER", handler:"this.handleEnter(true, false)"},
				{event:"Ctrl+Shift+ENTER", handler:"this.handleEnter(true, true)"},
				{event:"TAB", handler:"this.handleTab()"},
				{event:"Shift+TAB", handler:"this.handleShiftTab()"},
				{event:"DELETE", handler:"this.handleDelete()"},
				{event:"BACKSPACE", handler:"this.handleBackspace()"},
				
				{event:"Ctrl+B", handler:"this.handleStrongEmphasis()"},
				{event:"Meta+B", handler:"this.handleStrongEmphasis()"},
				{event:"Ctrl+I", handler:"this.handleEmphasis()"},
				{event:"Meta+I", handler:"this.handleEmphasis()"},
				{event:"Ctrl+U", handler:"this.handleUnderline()"},
				{event:"Meta+U", handler:"this.handleUnderline()"},
				{event:"Ctrl+K", handler:"this.handleStrike()"},
				{event:"Meta+K", handler:"this.handleStrike()"},
				{event:"Meta+Z", handler:"this.handleUndo()"},
				{event:"Meta+Shift+Z", handler:"this.handleRedo()"},
				{event:"Meta+Y", handler:"this.handleRedo()"}
			];
		} else if(xq.Browser.isUbuntu) {
			//  Ubunto FF
			return [
				{event:"Ctrl+SPACE", handler:"this.handleAutocompletion(); stop = true;"},
				{event:"SPACE", handler:"this.handleSpace()"},
				{event:"ENTER", handler:"this.handleEnter(false, false)"},
				{event:"Ctrl+ENTER", handler:"this.handleEnter(true, false)"},
				{event:"Ctrl+Shift+ENTER", handler:"this.handleEnter(true, true)"},
				{event:"TAB", handler:"this.handleTab()"},
				{event:"Shift+TAB", handler:"this.handleShiftTab()"},
				{event:"DELETE", handler:"this.handleDelete()"},
				{event:"BACKSPACE", handler:"this.handleBackspace()"},
			
				{event:"Ctrl+B", handler:"this.handleStrongEmphasis()"},
				{event:"Ctrl+I", handler:"this.handleEmphasis()"},
				{event:"Ctrl+U", handler:"this.handleUnderline()"},
				{event:"Ctrl+K", handler:"this.handleStrike()"},
				{event:"Ctrl+Z", handler:"this.handleUndo()"},
				{event:"Ctrl+Shift+Z", handler:"this.handleRedo()"},
				{event:"Ctrl+Y", handler:"this.handleRedo()"}
			];
		} else {
			// Win IE & FF
			return [
				{event:"Ctrl+SPACE", handler:"this.handleAutocompletion(); stop = true;"},
				{event:"SPACE", handler:"this.handleSpace()"},
				{event:"ENTER", handler:"this.handleEnter(false, false)"},
				{event:"Ctrl+ENTER", handler:"this.handleEnter(true, false)"},
				{event:"Ctrl+Shift+ENTER", handler:"this.handleEnter(true, true)"},
				{event:"TAB", handler:"this.handleTab()"},
				{event:"Shift+TAB", handler:"this.handleShiftTab()"},
				{event:"DELETE", handler:"this.handleDelete()"},
				{event:"BACKSPACE", handler:"this.handleBackspace()"},
			
				{event:"Ctrl+B", handler:"this.handleStrongEmphasis()"},
				{event:"Ctrl+I", handler:"this.handleEmphasis()"},
				{event:"Ctrl+U", handler:"this.handleUnderline()"},
				{event:"Ctrl+K", handler:"this.handleStrike()"},
				{event:"Ctrl+Z", handler:"this.handleUndo()"},
				{event:"Ctrl+Shift+Z", handler:"this.handleRedo()"},
				{event:"Ctrl+Y", handler:"this.handleRedo()"}
			];
		}
	},
	
	/**
	 * Adds or replaces plugin.
	 *
	 * @param {String} id unique identifier
	 */
	addPlugin: function(id) {
		// already added?
		if(this.config.plugins[id]) return;
		
		// else
		var clazz = xq.plugin[id + "Plugin"];
		if(!clazz) throw "Unknown plugin id: [" + id + "]";
		
		var plugin = new clazz();
		this.config.plugins[id] = plugin;
		plugin.load(this);
	},

	/**
	 * Adds several plugins at once.
	 *
	 * @param {Array} list of plugin ids.
	 */
	addPlugins: function(list) {
		for(var i = 0; i < list.length; i++) {
			this.addPlugin(list[i]);
		}
	},
	
	/**
	 * Returns plugin matches with given identifier.
	 *
	 * @param {String} id unique identifier
	 */
	getPlugin: function(id) {return this.config.plugins[id];},

	/**
	 * Returns entire plugins
	 */
	getPlugins: function() {return this.config.plugins;},
	
	/**
	 * Remove plugin matches with given identifier.
	 *
	 * @param {String} id unique identifier
	 */
	removePlugin: function(id) {
		var plugin = this.config.shortcuts[id];
		if(plugin) {
			plugin.unload();
		}
		
		delete this.config.shortcuts[id];
	},
	
	
	
	/**
	 * Adds or replaces keyboard shortcut.
	 *
	 * @param {String} shortcut keymap expression like "CTRL+Space"
	 * @param {Object} handler string or function to be evaluated or called
	 */
	addShortcut: function(shortcut, handler) {
		this.config.shortcuts[shortcut] = {"event":new xq.Shortcut(shortcut), "handler":handler};
	},
	
	/**
	 * Adds several keyboard shortcuts at once.
	 *
	 * @param {Array} list of shortcuts. each element should have following structure: {event:"keymap expression", handler:handler}
	 */
	addShortcuts: function(list) {
		for(var i = 0; i < list.length; i++) {
			this.addShortcut(list[i].event, list[i].handler);
		}
	},

	/**
	 * Returns keyboard shortcut matches with given keymap expression.
	 *
	 * @param {String} shortcut keymap expression like "CTRL+Space"
	 */
	getShortcut: function(shortcut) {return this.config.shortcuts[shortcut];},

	/**
	 * Returns entire keyboard shortcuts' map
	 */
	getShortcuts: function() {return this.config.shortcuts;},
	
	/**
	 * Remove keyboard shortcut matches with given keymap expression.
	 *
	 * @param {String} shortcut keymap expression like "CTRL+Space"
	 */
	removeShortcut: function(shortcut) {delete this.config.shortcuts[shortcut];},
	
	/**
	 * Adds or replaces autocorrection handler.
	 *
	 * @param {String} id unique identifier
	 * @param {Object} criteria regex pattern or function to be used as a criterion for match
	 * @param {Object} handler string or function to be evaluated or called when criteria met
	 */
	addAutocorrection: function(id, criteria, handler) {
		if(criteria.exec) {
			var pattern = criteria;
			criteria = function(text) {return text.match(pattern)};
		}
		this.config.autocorrections[id] = {"criteria":criteria, "handler":handler};
	},
	
	/**
	 * Adds several autocorrection handlers at once.
	 *
	 * @param {Array} list of autocorrection. each element should have following structure: {id:"identifier", criteria:criteria, handler:handler}
	 */
	addAutocorrections: function(list) {
		for(var i = 0; i < list.length; i++) {
			this.addAutocorrection(list[i].id, list[i].criteria, list[i].handler);
		}
	},
	
	/**
	 * Returns autocorrection handler matches with given id
	 *
	 * @param {String} id unique identifier
	 */
	getAutocorrection: function(id) {return this.config.autocorrection[id];},
	
	/**
	 * Returns entire autocorrections' map
	 */
	getAutocorrections: function() {return this.config.autocorrections;},
	
	/**
	 * Removes autocorrection handler matches with given id
	 *
	 * @param {String} id unique identifier
	 */
	removeAutocorrection: function(id) {delete this.config.autocorrections[id];},
	
	/**
	 * Adds or replaces autocompletion handler.
	 *
	 * @param {String} id unique identifier
	 * @param {Object} criteria regex pattern or function to be used as a criterion for match
	 * @param {Object} handler string or function to be evaluated or called when criteria met
	 */
	addAutocompletion: function(id, criteria, handler) {
		if(criteria.exec) {
			var pattern = criteria;
			criteria = function(text) {
				var m = pattern.exec(text);
				return m ? m.index : -1;
			};
		}
		this.config.autocompletions[id] = {"criteria":criteria, "handler":handler};
	},
	
	/**
	 * Adds several autocompletion handlers at once.
	 *
	 * @param {Array} list of autocompletion. each element should have following structure: {id:"identifier", criteria:criteria, handler:handler}
	 */
	addAutocompletions: function(list) {
		for(var i = 0; i < list.length; i++) {
			this.addAutocompletion(list[i].id, list[i].criteria, list[i].handler);
		}
	},
	
	/**
	 * Returns autocompletion handler matches with given id
	 *
	 * @param {String} id unique identifier
	 */
	getAutocompletion: function(id) {return this.config.autocompletions[id];},
	
	/**
	 * Returns entire autocompletions' map
	 */
	getAutocompletions: function() {return this.config.autocompletions;},
	
	/**
	 * Removes autocompletion handler matches with given id
	 *
	 * @param {String} id unique identifier
	 */
	removeAutocompletion: function(id) {delete this.config.autocompletions[id];},
	
	/**
	 * Adds or replaces template processor.
	 *
	 * @param {String} id unique identifier
	 * @param {Object} handler string or function to be evaluated or called when template inserted
	 */
	addTemplateProcessor: function(id, handler) {
		this.config.templateProcessors[id] = {"handler":handler};
	},
	
	/**
	 * Adds several template processors at once.
	 *
	 * @param {Array} list of template processors. Each element should have following structure: {id:"identifier", handler:handler}
	 */
	addTemplateProcessors: function(list) {
		for(var i = 0; i < list.length; i++) {
			this.addTemplateProcessor(list[i].id, list[i].handler);
		}
	},
	
	/**
	 * Returns template processor matches with given id
	 *
	 * @param {String} id unique identifier
	 */
	getTemplateProcessor: function(id) {return this.config.templateProcessors[id];},

	/**
	 * Returns entire template processors' map
	 */
	getTemplateProcessors: function() {return this.config.templateProcessors;},

	/**
	 * Removes template processor matches with given id
	 *
	 * @param {String} id unique identifier
	 */
	removeTemplateProcessor: function(id) {delete this.config.templateProcessors[id];},



	/**
	 * Adds or replaces context menu handler.
	 *
	 * @param {String} id unique identifier
	 * @param {Object} handler string or function to be evaluated or called when onContextMenu occured
	 */
	addContextMenuHandler: function(id, handler) {
		this.config.contextMenuHandlers[id] = {"handler":handler};
	},
	
	/**
	 * Adds several context menu handlers at once.
	 *
	 * @param {Array} list of handlers. Each element should have following structure: {id:"identifier", handler:handler}
	 */
	addContextMenuHandlers: function(list) {
		for(var i = 0; i < list.length; i++) {
			this.addContextMenuHandler(list[i].id, list[i].handler);
		}
	},
	
	/**
	 * Returns context menu handler matches with given id
	 *
	 * @param {String} id unique identifier
	 */
	getContextMenuHandler: function(id) {return this.config.contextMenuHandlers[id];},

	/**
	 * Returns entire context menu handlers' map
	 */
	getContextMenuHandlers: function() {return this.config.contextMenuHandlers;},

	/**
	 * Removes context menu handler matches with given id
	 *
	 * @param {String} id unique identifier
	 */
	removeContextMenuHandler: function(id) {delete this.config.contextMenuHandlers[id];},
	
	
	
	/**
	 * Sets width of editor.
	 *
	 * @param {String} w Valid CSS value for style.width. For example, "100%", "200px".
	 */
	setWidth: function(w) {
		this.outmostWrapper.style.width = w;
	},
	
	
	
	/**
	 * Sets height of editor.
	 *
	 * @param {String} h Valid CSS value for style.height. For example, "100%", "200px".
	 */
	setHeight: function(h) {
		this.wysiwygEditorDiv.style.height = h;
		this.sourceEditorDiv.style.height = h;
	},
	
	
	
	/////////////////////////////////////////////
	// Edit mode management
	
	/**
	 * Returns current edit mode - wysiwyg, source
	 */
	getCurrentEditMode: function() {
		return this.currentEditMode;
	},
	
	/**
	 * Toggle edit mode between source and wysiwyg 
	 */
	toggleSourceAndWysiwygMode: function() {
		var mode = this.getCurrentEditMode();
		this.setEditMode(mode === 'wysiwyg' ? 'source' : 'wysiwyg');
	},
	
	/**
	 * Switches between WYSIWYG/Source mode.
	 *
	 * @param {String} mode 'wysiwyg' means WYSIWYG editing mode, and 'source' means source editing mode.
	 */
	setEditMode: function(mode) {
		if(typeof mode !== 'string') throw "[mode] is not a string."
		if(['wysiwyg', 'source'].indexOf(mode) === -1) throw "Illegal [mode] value: '" + mode + "'. Use 'wysiwyg' or 'source'";
		if(this.currentEditMode === mode) return;
		
		// create editor frame if there's no editor frame.  
		var editorCreated = !!this.outmostWrapper;
		if(!editorCreated) {
			// create validator
			this.validator = xq.validator.Base.createInstance(
				this.doc.location.href,
				this.config.urlValidationMode,
				this.config.whitelist
			);

			this._fireOnStartInitialization(this);

			this._createEditorFrame(mode);
			var temp = window.setInterval(function() {
				// wait for loading
				if(this.getBody()) {
					window.clearInterval(temp);
	
					// @WORKAROUND: it is needed to fix IE6 horizontal scrollbar problem
					if(xq.Browser.isIE6) {
						this.rdom.getDoc().documentElement.style.overflowY='auto';
						this.rdom.getDoc().documentElement.style.overflowX='hidden';
					}
					
					this.setEditMode(mode);
					this.PreventExit.defaultContent = this.getCurrentContent().stripTags();
					
					if(this.config.autoFocusOnInit) this.focus();
					
					this.timer.start();
					this._fireOnInitialized(this);
				}


			}.bind(this), 10);
			
			return;
		}
		
		// switch mode
		if(mode === 'wysiwyg') {
			this._setEditModeToWysiwyg();
		} else { // mode === 'source'
			this._setEditModeToSource();
		}
		
		// fire event
		var oldEditMode = this.currentEditMode;
		this.currentEditMode = mode;
		
		this._fireOnCurrentEditModeChanged(this, oldEditMode, this.currentEditMode);
	},
	
	_setEditModeToWysiwyg: function() {
		// Turn off static content and source editor
		this.contentElement.style.display = "none";
		this.sourceEditorDiv.style.display = "none";
		
		// Update contents
		if(this.currentEditMode === 'source') {
			// get html from source editor
			var html = this.getSourceContent(true);
			
			// invalidate it and load it into wysiwyg editor
			var invalidHtml = this.validator.invalidate(html);
			invalidHtml = this.removeUnnecessarySpaces(invalidHtml);
			if(invalidHtml.isBlank()) {
				this.rdom.clearRoot();
			} else {
				this.rdom.getRoot().innerHTML = invalidHtml;
				this.rdom.wrapAllInlineOrTextNodesAs("P", this.rdom.getRoot(), true);
			}
		} else {
			// invalidate static html and load it into wysiwyg editor
			var invalidHtml = this.validator.invalidate(this.getStaticContent());
			invalidHtml = this.removeUnnecessarySpaces(invalidHtml);
			if(invalidHtml.isBlank()) {
				this.rdom.clearRoot();
			} else {
				this.rdom.getRoot().innerHTML = invalidHtml;
				this.rdom.wrapAllInlineOrTextNodesAs("P", this.rdom.getRoot(), true);
			}
		}
		
		// Turn on wysiwyg editor
		this.wysiwygEditorDiv.style.display = "block";
		this.outmostWrapper.style.display = "block";
		
		// Without this, xq.rdom.Base.focus() doesn't work correctly.
		if(xq.Browser.isGecko) this.rdom.placeCaretAtStartOf(this.rdom.getRoot());
		
		if(this.toolbar) this.toolbar.enableButtons();
	},
	
	_setEditModeToSource: function() {
		// Update contents
		var validHtml = null;
		if(this.currentEditMode === 'wysiwyg') {
			validHtml = this.getWysiwygContent();
		} else {
			validHtml = this.getStaticContent();
		}
		this.sourceEditorTextarea.value = validHtml

		// Turn off static content and wysiwyg editor
		this.contentElement.style.display = "none";
		this.wysiwygEditorDiv.style.display = "none";

		// Turn on source editor
		this.sourceEditorDiv.style.display = "block";
		this.outmostWrapper.style.display = "block";
		if(this.toolbar) this.toolbar.disableButtons(['html']);
	},
	
	/**
	 * Load CSS into WYSIWYG mode document
	 *
	 * @param {string} path URL
	 */
	loadStylesheet: function(path) {
		var head = this.getDoc().getElementsByTagName("HEAD")[0];
		var link = this.getDoc().createElement("LINK");
		link.rel = "Stylesheet";
		link.type = "text/css";
		link.href = path;
		head.appendChild(link);
	},
	
	/**
	 * Sets editor's dynamic content from static content
	 */
	loadCurrentContentFromStaticContent: function() {
		if(this.getCurrentEditMode() == 'wysiwyg') {
			// update WYSIWYG editor
			var html = this.validator.invalidate(this.getStaticContent());
			html = this.removeUnnecessarySpaces(html);
			
			if(html.isBlank()) {
				this.rdom.clearRoot();
			} else {
				this.rdom.getRoot().innerHTML = html;
				this.rdom.wrapAllInlineOrTextNodesAs("P", this.rdom.getRoot(), true);
			}
		} else { // 'source'
			this.sourceEditorTextarea.value = this.getStaticContent();
		}
		
		this._fireOnCurrentContentChanged(this);
	},

	/**
	 * Removes unnecessary spaces, tabs and new lines.
	 * 
	 * @param {String} html HTML string.
	 * @returns {String} Modified HTML string.
	 */
	removeUnnecessarySpaces: function(html) {
		var blocks = this.rdom.tree.getBlockTags().join("|");
		var regex = new RegExp("\\s*<(/?)(" + blocks + ")>\\s*", "img");
		return html.replace(regex, '<$1$2>');
	},
	
	/**
	 * Gets editor's dynamic content from current editor(source or WYSIWYG)
	 * 
	 * @return {Object} HTML String
	 */
	getCurrentContent: function() {
		if(this.getCurrentEditMode() === 'source') {
			return this.getSourceContent(this.config.noValidationInSourceEditMode);
		} else {
			return this.getWysiwygContent();
		}
	},
	
	/**
	 * Gets editor's dynamic content from WYSIWYG editor
	 * 
	 * @return {Object} HTML String
	 */
	getWysiwygContent: function() {
		return this.validator.validate(this.rdom.getRoot());
	},
	
	/**
	 * Gets editor's dynamic content from source editor
	 * 
	 * @return {Object} HTML String
	 */
	getSourceContent: function(noValidation) {
		var raw = this.sourceEditorTextarea.value;
		if(noValidation) return raw;
		
		var tempDiv = document.createElement('div');
		tempDiv.innerHTML = this.removeUnnecessarySpaces(raw);
		
		var rdom = xq.rdom.Base.createInstance();
		rdom.wrapAllInlineOrTextNodesAs("P", tempDiv, true);
		
		return this.validator.validate(tempDiv, true);
	},
	
	/**
	 * Sets editor's original content
	 *
	 * @param {Object} content HTML String
	 */
	setStaticContent: function(content) {
		this.contentElement.value = content;
		this._fireOnStaticContentChanged(this, content);
	},
	
	/**
	 * Gets editor's original content
	 *
	 * @return {Object} HTML String
	 */
	getStaticContent: function() {
		return this.contentElement.value;
	},
	
	/**
	 * Gets editor's original content as (newely created) DOM node
	 *
	 * @return {Element} DIV element
	 */
	getStaticContentAsDOM: function() {
		var div = this.doc.createElement('DIV');
		div.innerHTML = this.contentElement.value;
		return div;
	},
	
	/**
	 * Gives focus to editor
	 */
	focus: function() {
		if(this.getCurrentEditMode() === 'wysiwyg') {
			this.rdom.focus();
			if(this.toolbar) this.toolbar.triggerUpdate();
		} else if(this.getCurrentEditMode() === 'source') {
			this.sourceEditorTextarea.focus();
		}
	},
	
	getWysiwygEditorDiv: function() {
		return this.wysiwygEditorDiv;
	},
	
	getSourceEditorDiv: function() {
		return this.sourceEditorDiv;
	},
	
	/**
	 * Returns outer iframe object
	 */
	getOuterFrame: function() {
		return this.outerFrame;
	},
	
	/**
	 * Returns outer iframe document
	 */
	getOuterDoc: function() {
		return this.outerFrame.contentWindow.document;
	},
	
	/**
	 * Returns designmode iframe object
	 */
	getFrame: function() {
		return this.editorFrame;
	},
	
	/**
	 * Returns designmode window object
	 */
	getWin: function() {
		return this.rdom.getWin();
	},
	
	/**
	 * Returns designmode document object
	 */
	getDoc: function() {
		return this.rdom.getDoc();
	},
	
	/**
	 * Returns designmode body object
	 */
	getBody: function() {
		return this.rdom.getRoot();
	},
	
	/**
	 * Returns outmost wrapper element
	 */
	getOutmostWrapper: function() {
		return this.outmostWrapper;
	},
	
	_createIFrame: function(doc, width, height) {
		var frame = doc.createElement("iframe");
		
		// IE displays warning when a protocol is HTTPS, because IE6 treats IFRAME
		// without SRC attribute as insecure.
		// if(xq.Browser.isIE) frame.src = 'javascript:""';
		
		frame.style.width = width || "100%";
		frame.style.height = height || "100%";
		frame.setAttribute("frameBorder", "0");
		frame.setAttribute("marginWidth", "0");
		frame.setAttribute("marginHeight", "0");
		frame.setAttribute("allowTransparency", "auto");
		return frame;
	},

	_createDoc: function(frame, head, cssList, jsList, bodyId, bodyClass, body) {
		var sb = [];
		if(!xq.Browser.isTrident) {
			// @WORKAROUND: IE6/7 has caret movement and scrolling problem if I include following DTD.
			sb.push('<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1//EN" "http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd">');
		}
		sb.push('<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="ko">');
		sb.push('<head>');
		sb.push('<meta http-equiv="Content-Type" content="text/html;charset=UTF-8" />');
		if(head) sb.push(head);

//		if(cssList) for(var i = 0; i < cssList.length; i++) {
//			sb.push('<link rel="Stylesheet" type="text/css" href="' + cssList[i] + '" />');
//		}
		sb.push('<link rel="Stylesheet" type="text/css" href="/contents/css/xq_contents.css" />');
		
		if(jsList) for(var i = 0; i < jsList.length; i++) {
			sb.push('<script type="text/javascript" src="' + jsList[i] + '"></script>');
		}
		
		sb.push('</head>');
		sb.push('<body ' + (bodyClass ? 'class="' + bodyClass + '"' : '') + ' ' + (bodyId ? 'id="' + bodyId + '"' : '') + '>');
		if(body) sb.push(body);
		sb.push('</body>');
		sb.push('</html>');
		
		var doc = frame.contentWindow.document;
		doc.open();
		doc.write(sb.join(""));
		doc.close();
		return doc;
	},

	_createEditorFrame: function(mode) {
		// turn off static content
		this.contentElement.style.display = "none";
		
		// create outer DIV
		this.outmostWrapper = this.doc.createElement('div');
		this.outmostWrapper.className = "xquared";
		this.outmostWrapper.style.position = "relative";
		this.contentElement.parentNode.insertBefore(this.outmostWrapper, this.contentElement);
		
		// create toolbar
		
		if(this.toolbarContainer || this.config.generateDefaultToolbar || this.config.defaultToolbarButtonList.length > 0) {
			this.toolbar = new xq.ui.Toolbar(
				this,
				this.toolbarContainer,
				this.outmostWrapper,
				this.config.defaultToolbarButtonMap,
				this.config.defaultToolbarButtonList,
				this.config.imagePathForDefaultToolbar,
				function() {
					var element = this.getCurrentEditMode() === 'wysiwyg' ? this.lastFocusElement : null;
					return element && element.nodeName != "BODY" ? this.rdom.collectStructureAndStyle(element) : null;
				}.bind(this)
			);
		}
		
		// create source editor div
		this.sourceEditorDiv = this.doc.createElement('div');
		this.sourceEditorDiv.className = "editor source_editor"; //TODO: remove editor
		this.sourceEditorDiv.style.display = "none";
		this.outmostWrapper.appendChild(this.sourceEditorDiv);
		
		// create TEXTAREA for source editor
		this.sourceEditorTextarea = this.doc.createElement('textarea');
		this.sourceEditorDiv.appendChild(this.sourceEditorTextarea);
		
		// create WYSIWYG editor div
		this.wysiwygEditorDiv = this.doc.createElement('div');
		this.wysiwygEditorDiv.className = "editor wysiwyg_editor"; //TODO: remove editor
		this.outmostWrapper.appendChild(this.wysiwygEditorDiv);
		
		// create outer iframe for WYSIWYG editor
		this.outerFrame = this._createIFrame(document);
		this.wysiwygEditorDiv.appendChild(this.outerFrame);
		var outerDoc = this._createDoc(
			this.outerFrame,
			'<style type="text/css">html, body {margin:0px; padding:0px; background-color: transparent; width: 100%; height: 100%; overflow: hidden;}</style>'
		);

		// create designmode iframe for WYSIWYG editor
		this.editorFrame = this._createIFrame(outerDoc);
		
		outerDoc.body.appendChild(this.editorFrame);
		var editorDoc = this._createDoc(
			this.editorFrame,
			'<style type="text/css">html, body {margin:0px; padding:0px; background-color: transparent;}</style>' +
			(!xq.Browser.isTrident ? '<base href="./" />' : '') + // @WORKAROUND: it is needed to force href of pasted content to be an absolute url
			(this.config.changeCursorOnLink ? '<style>.xed a {cursor: pointer !important;}</style>' : ''),
			this.config.contentCssList,
			this.config.contentJsList,
			this.config.bodyId,
			this.config.bodyClass,
			''
		);
		this.rdom.setWin(this.editorFrame.contentWindow);
		this.editHistory = new xq.EditHistory(this.rdom);
		
		// turn on designmode
		if(xq.Browser.isIE){
			this.getBody().contentEditable = true;
		} else {
			this.rdom.getDoc().designMode = "On";
		}
		if(xq.Browser.isFF3) {
			this.rdom.getDoc().designMode = "Off";
			this.rdom.getDoc().designMode = "On";
		}
		
		// turn off Firefox's table editing feature
		if(xq.Browser.isGecko) {
			try {this.rdom.getDoc().execCommand("enableInlineTableEditing", false, "false")} catch(ignored) {}
		}
		
		// register event handlers
		this._registerEventHandlers();
		
		// hook onsubmit of form
		if(this.config.automaticallyHookSubmitEvent && this.contentElement.form) {
			var original = this.contentElement.form.onsubmit;
			this.contentElement.form.onsubmit = function() {
				xed.config.enablePreventExit === false;
				this.contentElement.value = this.getCurrentContent();
				return original ? original.bind(this.contentElement.form)() : true;
			}.bind(this);
		}
	},
	
	
	
	/////////////////////////////////////////////
	// Event Management
	
	_registerEventHandlers: function() {
		var events = [this.platformDepedentKeyEventType, 'click', 'keyup', 'mouseup', 'contextmenu'];
		
		if(xq.Browser.isTrident && this.config.changeCursorOnLink) events.push('mousemove');
		
		var handler = this._handleEvent.bindAsEventListener(this);
		for(var i = 0; i < events.length; i++) {
			xq.observe(this.getDoc(), events[i], handler);
		}
		
		if(xq.Browser.isGecko) {
			xq.observe(this.getDoc(), "focus", handler);
			xq.observe(this.getDoc(), "blur", handler);
			xq.observe(this.getDoc(), "scroll", handler);
			xq.observe(this.getDoc(), "dragdrop", handler);
		} else {
			xq.observe(this.getWin(), "focus", handler);
			xq.observe(this.getWin(), "blur", handler);
			xq.observe(this.getWin(), "scroll", handler);
		}
	},
	
	_dummyLink: null,
	_makeDummyLink: function(anchor, e){
		// Trident only
		var dummyLink = this.getOuterDoc().createElement("A");
		dummyLink.href = anchor.href;
		dummyLink.target = '_top';
		dummyLink.className = anchor.className;
		dummyLink.title = anchor.title;
		
		var image = this.getOuterDoc().createElement("IMG");
		image.src = this.config.imagePathForContent + 'blank.gif';
		image.style.width = image.style.height = '100%';
		image.style.border = 'none';
		
		dummyLink.appendChild(image);
		
		this.getOuterDoc().body.appendChild(dummyLink);
		this._dummyLink = dummyLink;
		
		dummyLink.style.top = (e.clientY - 5) + 'px';
		dummyLink.style.left = (e.clientX - 5) + 'px';
		dummyLink.onfocus = function(){
			this.blur();	
			return false;
		}		
				
		xq.observe(dummyLink, "click", this._handleEvent.bindAsEventListener(this));
		
		dummyLink.style.position = 'absolute';
		dummyLink.style.display = 'block';
		dummyLink.style.width = '10px';
		dummyLink.style.height = '10px';
		dummyLink.style.zIndex = '4';
	},
	
	_handleEvent: function(e) {
		if (!this._fireOnBeforeEvent) return;
		this._fireOnBeforeEvent(this, e);
		if(e.stopProcess) {
			xq.stopEvent(e);
			return false;
		}
		
		// Trident only
		if(e.type === 'mousemove') {
			if(!this.config.changeCursorOnLink) return true;
			
			var link = this.rdom.getParentElementOf(e.srcElement, ["A"]);
			if (this._dummyLink && this._dummyLink == link) return true;
			
			if (this._dummyLink) {
				this.getOuterDoc().body.removeChild(this._dummyLink);
				this._dummyLink = null;
			}
			if(!!link && !this.rdom.hasSelection()){
				this._makeDummyLink(link, e);
			}
			return true;
		}
		
		var stop = false;
		var modifiedByCorrection = false;
		if(e.type === this.platformDepedentKeyEventType) {
			var undoPerformed = false;
			modifiedByCorrection = this.rdom.correctParagraph();
			for(var key in this.config.shortcuts) {
				if(!this.config.shortcuts[key].event.matches(e)) continue;
				
				var handler = this.config.shortcuts[key].handler;
				var xed = this;
				stop = (typeof handler === "function") ? handler(this) : eval(handler);
				if(key === "undo") undoPerformed = true;
			}
		} else if(e.type === 'click' && e.button === 0 && this.config.enableLinkClick) {
			var a = this.rdom.getParentElementOf(e.target || e.srcElement, ["A"]);
			if(a) stop = this.handleClick(e, a);
		} else if(["keyup", "mouseup"].indexOf(e.type) !== -1) {
			modifiedByCorrection = this.rdom.correctParagraph();
		} else if(["contextmenu"].indexOf(e.type) !== -1) {
			this._handleContextMenu(e);
		} else if("focus" == e.type) {
			this.rdom.focused = true;
		} else if("blur" == e.type) {
			this.rdom.focused = false;
		}
		
		if(stop) xq.stopEvent(e);
		
		this._fireOnCurrentContentChanged(this);
		this._fireOnAfterEvent(this, e);
		
		if(!undoPerformed && !modifiedByCorrection && e.type != 'scroll') this.editHistory.onEvent(e);
		
		return !stop;
	},

	/**
	 * TODO: remove dup with handleAutocompletion
	 */
	handleAutocorrection: function() {
		var block = this.rdom.getCurrentBlockElement();
		var text = this.rdom.getInnerText(block).unescapeHTML();
		
		var acs = this.config.autocorrections;
		var performed = false;
		
		var stop = false;
		for(var key in acs) {
			var ac = acs[key];
			
			if(ac.criteria(text)) {
				try {
					this.editHistory.onCommand();
					this.editHistory.disable();
					if(typeof ac.handler === "String") {
						var xed = this;
						var rdom = this.rdom;
						eval(ac.handler);
					} else {
						stop = ac.handler(this, this.rdom, block, text);
					}
					this.editHistory.enable();
				} catch(ignored) {}
				
				block = this.rdom.getCurrentBlockElement();
				text = this.rdom.getInnerText(block);
				
				performed = true;
				if(stop) break;
			}
		}
		
		return stop;
	},
	
	/**
	 * TODO: remove dup with handleAutocorrection
	 */
	handleAutocompletion: function() {
		var acs = this.config.autocompletions;
		if(xq.isEmptyHash(acs)) return;
		
		if(this.rdom.hasSelection()) {
			var text = this.rdom.getSelectionAsText();
			this.rdom.deleteSelection();
			var wrapper = this.rdom.insertNode(this.rdom.createElement("SPAN"));
			this.rdom.insertTextAt(text, wrapper, "start");
			
			var marker = this.rdom.pushMarker();
			
			var filtered = [];
			for(var key in acs) {
				filtered.push([key, acs[key].criteria(text)]);
			}
			filtered = filtered.findAll(function(elem) {
				return elem[1] !== -1;
			});
			
			if(filtered.length === 0) {
				this.rdom.popMarker(true);
				return;
			}
			
			var minIndex = 0;
			var min = filtered[0][1];
			for(var i = 0; i < filtered.length; i++) {
				if(filtered[i][1] < min) {
					minIndex = i;
					min = filtered[i][1];
				}
			}
			
			var ac = acs[filtered[minIndex][0]];
			
			this.editHistory.disable();
			this.rdom.selectElement(wrapper);
		} else {
			var marker = this.rdom.pushMarker();

			var filtered = [];
			for(var key in acs) {
				filtered.push([key, this.rdom.testSmartWrap(marker, acs[key].criteria).textIndex]);
			}
			filtered = filtered.findAll(function(elem) {
				return elem[1] !== -1;
			});
			
			if(filtered.length === 0) {
				this.rdom.popMarker(true);
				return;
			}
			
			var minIndex = 0;
			var min = filtered[0][1];
			for(var i = 0; i < filtered.length; i++) {
				if(filtered[i][1] < min) {
					minIndex = i;
					min = filtered[i][1];
				}
			}
			
			var ac = acs[filtered[minIndex][0]];
			
			this.editHistory.disable();
			
			var wrapper = this.rdom.smartWrap(marker, "SPAN", ac.criteria);
			// editor lost a caret on Safari
			if (xq.Browser.isWebkit){
				this.rdom.popMarker(true);
				this.rdom.pushMarker();
			}
		}
		var block = this.rdom.getCurrentBlockElement();
		var text = this.rdom.getInnerText(wrapper).unescapeHTML();
		
		try {
			// call handler
			if(typeof ac.handler === "String") {
				var xed = this;
				var rdom = this.rdom;
				eval(ac.handler);
			} else {
				ac.handler(this, this.rdom, block, wrapper, text);
			}
		} catch(ignored) {}
		
		try {
			this.rdom.unwrapElement(wrapper);
		} catch(ignored) {}
		
		if(this.rdom.isEmptyBlock(block)) this.rdom.correctEmptyElement(block);
		
		this.editHistory.enable();
		this.editHistory.onCommand();
		
		this.rdom.popMarker(true);
	},

	/**
	 * Handles click event
	 *
	 * @param {Event} e click event
	 * @param {Element} target target element(usually has A tag)
	 */
	handleClick: function(e, target) {
		var href = decodeURI(target.href);
		var isNewWindow = target.className.indexOf('newWindow') != -1;
		if (isNewWindow) {
			window.open(href, "_blank");
			return true;
		}
		
		if(!xq.Browser.isTrident) {
			if(!e.ctrlKey && !e.shiftKey && e.button !== 1) {
				window.location.href = href;
				return true;
			}
		} else {
			if(e.shiftKey) {
				window.open(href, "_blank");
			} else {
				window.location.href = href;
			}
			return true;
		}
		
		return false;
	},
	lastLinkDialog: null,
	/**
	 * Show link dialog
	 *
	 * TODO: should support modify/unlink
	 * TODO: Add selenium test
	 */
	handleLink: function() {
		var linkDialog = xq.$('linkDialog');
		if (linkDialog && linkDialog.style.display != 'none') this.lastLinkDialog.close();
		
		var text = this.rdom.getSelectionAsText() || '';
		var dialog = new xq.ui.FormDialog(
			this,
			xq.ui_templates.basicLinkDialog,
			function(dialog) {
				setTimeout(function(){
					if(text) {
						dialog.form.text.value = text;
						dialog.form.url.focus();
						dialog.form.url.select();
					} else {
						dialog.form.text.focus();
					}
					
				}, 0);
			},
			function(data) {
				this.focus();
				
				if(xq.Browser.isTrident) {
					var rng = this.rdom.rng();
					rng.moveToBookmark(bm);
					rng.select();
				}
				
				if(!data) return;
					
				var urlRegex = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/
				if( !urlRegex.test(data.url) )
				{
					alert( this._("Unknown URL pattern"));
					dialog.form.url.focus();
					return;
				}
				
				if (data.newWindow) var className = 'newWindow';
				
				this.handleInsertLink(false, data.url, data.text, data.text, className);
				
				dialog.close();
			}.bind(this)
		);
		
		if(xq.Browser.isTrident) var bm = this.rdom.rng().getBookmark();
		
		dialog.show({position: 'centerOfEditor', mode: 'lightweight', notSelfClose: true, dialogId:'linkDialog'});
		this.lastLinkDialog = dialog;
		return true;
	},
	
	/**
	 * Inserts link or apply link into selected area
	 * @TODO Add selenium test
	 * 
	 * @param {boolean} autoSelection if set true and there's no selection, automatically select word to link(if possible)
	 * @param {String} url url
	 * @param {String} title title of link
	 * @param {String} text text of link. If there's a selection(manually or automatically), it will be replaced with this text
	 *
	 * @returns {Element} created element
	 */
	handleInsertLink: function(autoSelection, url, title, text, className) {
		if(autoSelection && !this.rdom.hasSelection()) {
			var marker = this.rdom.pushMarker();
			var a = this.rdom.smartWrap(marker, "A", function(text) {
				var index = text.lastIndexOf(" ");
				return index === -1 ? index : index + 1;
			});
							
			a.href = url;
			a.title = title;
			if (className) a.className = className;
			
			if(text) {
				a.innerHTML = ""
				a.appendChild(this.rdom.createTextNode(text));
			} else if(!a.hasChildNodes()) {
				this.rdom.deleteNode(a);
			}
			this.rdom.popMarker(true);
		} else {
			text = text || (this.rdom.hasSelection() ? this.rdom.getSelectionAsText() : null);
			if(!text) return;
			
			this.rdom.deleteSelection();
			
			var a = this.rdom.createElement('A');
			a.href = url;
			a.title = title;
			if (className) a.className = className;
			
			a.appendChild(this.rdom.createTextNode(text));
			this.rdom.insertNode(a);
		}
		
		var historyAdded = this.editHistory.onCommand();
		this._fireOnCurrentContentChanged(this);
		
		return true;
	},
	
	/**
	 * @TODO Add selenium test
	 */
	handleSpace: function() {
		// If it has selection, perform default action.
		if(this.rdom.hasSelection()) return false;
		
		// Trident performs URL replacing automatically
		if(!xq.Browser.isTrident) {
			this.replaceUrlToLink();
		}
		
		return false;
	},
	
	/**
	 * Called when enter key pressed.
	 * @TODO Add selenium test
	 *
	 * @param {boolean} skipAutocorrection if set true, skips autocorrection
	 * @param {boolean} forceInsertParagraph if set true, inserts paragraph
	 */
	handleEnter: function(skipAutocorrection, forceInsertParagraph) {
		// If it has selection, perform default action.
		if(this.rdom.hasSelection()) return false;
		
		// @WORKAROUND:
		// If caret is in HR, default action should be performed and
		// this._handleEvent() will correct broken HTML
		if(xq.Browser.isTrident && this.rdom.tree.isBlockOnlyContainer(this.rdom.getCurrentElement()) && this.rdom.recentHR) {
			this.rdom.insertNodeAt(this.rdom.makeEmptyParagraph(), this.rdom.recentHR, "before");
			this.rdom.recentHR = null;
			return true;
		}
		
		// Perform autocorrection
		if(!skipAutocorrection && this.handleAutocorrection()) return true;
		
		var block = this.rdom.getCurrentBlockElement();
		var info = this.rdom.collectStructureAndStyle(block);
		
		// Perform URL replacing. Trident performs URL replacing automatically
		if(!xq.Browser.isTrident) {
			this.replaceUrlToLink();
		}
		
		var atEmptyBlock = this.rdom.isCaretAtEmptyBlock();
		var atStart = atEmptyBlock || this.rdom.isCaretAtBlockStart();
		var atEnd = atEmptyBlock || (!atStart && this.rdom.isCaretAtBlockEnd());
		var atEdge = atEmptyBlock || atStart || atEnd;
		
		if(!atEdge) {
			var marker = this.rdom.pushMarker();
			
			if(this.rdom.isFirstLiWithNestedList(block) && !forceInsertParagraph) {
				var parent = block.parentNode;
				this.rdom.unwrapElement(block);
				block = parent;
			} else if(block.nodeName !== "LI" && this.rdom.tree.isBlockContainer(block)) {
				block = this.rdom.wrapAllInlineOrTextNodesAs("P", block, true).first();
			}
			this.rdom.splitElementUpto(marker, block);
			
			this.rdom.popMarker(true);
		} else if(atEmptyBlock) {
			this._handleEnterAtEmptyBlock();

			if(!xq.Browser.isWebkit) {
				if(info.fontSize && info.fontSize !== "2") this.handleFontSize(info.fontSize);
				if(info.fontName) this.handleFontFace(info.fontName);
			}
		} else {
			this._handleEnterAtEdge(atStart, forceInsertParagraph);
			
			if(!xq.Browser.isWebkit) {
				if(info.fontSize && info.fontSize !== "2") this.handleFontSize(info.fontSize);
				if(info.fontName) this.handleFontFace(info.fontName);
				if(info.foregroundColor) this.handleForegroundColor(info.foregroundColor);
			}
		}
		
		return true;
	},
	
	/**
	 * Moves current block upward or downward
	 *
	 * @param {boolean} up moves current block upward
	 */
	handleMoveBlock: function(up) {
		var block = this.rdom.moveBlock(this.rdom.getCurrentBlockElement(), up);
		if(block) {
			this.rdom.selectElement(block, false);
			if(this.rdom.isEmptyBlock(block)) this.rdom.collapseSelection(true);
			
			if(!this.isElementVisible(block)) block.scrollIntoView(false);
			
			var historyAdded = this.editHistory.onCommand();
			this._fireOnCurrentContentChanged(this);
		}
		return true;
	},
	
	/**
	 * Called when tab key pressed
	 * @TODO: Add selenium test
	 */
	handleTab: function() {
		var hasSelection = this.rdom.hasSelection();
		var table = this.rdom.getParentElementOf(this.rdom.getCurrentBlockElement(), ["TABLE"]);
		var li = this.rdom.getParentElementOf(this.rdom.getCurrentBlockElement(), ["LI"]);
		
		if(hasSelection) {
			this.handleIndent();
		} else if (table && !li) {
			this.handleMoveToNextCell();
		} else if (this.rdom.isCaretAtBlockStart()) {
			this.handleIndent();
		} else {
			this.handleInsertTab();
		}

		return true;
	},
	
	/**
	 * Called when shift+tab key pressed
	 * @TODO: Add selenium test
	 */
	handleShiftTab: function() {
		var hasSelection = this.rdom.hasSelection();
		var table = this.rdom.getParentElementOf(this.rdom.getCurrentBlockElement(), ["TABLE"]);
		var li = this.rdom.getParentElementOf(this.rdom.getCurrentBlockElement(), ["LI"]);
		
		if(hasSelection) {
			this.handleOutdent();
		} else if (table && !li) {
			this.handleMoveToPreviousCell();
		} else {
			this.handleOutdent();
		}
		
		return true;
	},
	
	/**
	 * Inserts three non-breaking spaces
	 * @TODO: Add selenium test
	 */
	handleInsertTab: function() {
		this.rdom.insertHtml('&nbsp;');
		this.rdom.insertHtml('&nbsp;');
		this.rdom.insertHtml('&nbsp;');
		
		return true;
	},
	
	/**
	 * Called when delete key pressed
	 * @TODO: Add selenium test
	 */
	handleDelete: function() {
		var block = this.rdom.getCurrentBlockElement();
		
		if(this.rdom.hasSelection()) return false;
		if (this.rdom.isEmptyBlock(block) && this.rdom.isCaretAtBlockEnd() && !block.nextSibling) {
			if (this.rdom.tree.isListContainer(block.parentNode))
				return false;
			return true;
		}
		if(this.rdom.isCaretAtBlockEnd()) return this._handleMerge(true);
		if(!xq.Browser.isFF) return false;
		
		var element = this.rdom.getCurrentElement();
		for(var i = 0; i < element.childNodes.length; i++){
			var node = element.childNodes[i]
			if (node.nodeName == '#text' && !node.nodeValue.length) xed.rdom.deleteNode(node);
		}
		return false;
	},
	
	/**
	 * Called when backspace key pressed
	 * @TODO: Add selenium test
	 */
	handleBackspace: function() {
		if(this.rdom.hasSelection() || !this.rdom.isCaretAtBlockStart()) return false;
		return this._handleMerge(false);
	},
	
	_handleMerge: function(withNext) {
		var block = this.rdom.getCurrentBlockElement();
		
		if(this.rdom.isEmptyBlock(block) && !this.rdom.tree.isBlockContainer(block.nextSibling) && withNext) {
			var blockToMove = this.rdom.removeBlock(block);
			this.rdom.placeCaretAtStartOf(blockToMove);
			if(!this.isElementVisible(blockToMove)) blockToMove.scrollIntoView(false);

			var historyAdded = this.editHistory.onCommand();
			this._fireOnCurrentContentChanged(this);
			
			return true;
		} else {
			// save caret position;
			var marker = this.rdom.pushMarker();

			// perform merge
			var merged = this.rdom.mergeElement(block, withNext, withNext);
			if(!merged && !withNext) this.rdom.extractOutElementFromParent(block);
			
			// restore caret position
			this.rdom.popMarker(true);
			if(merged) this.rdom.correctEmptyElement(merged);
			
			var historyAdded = this.editHistory.onCommand();
			this._fireOnCurrentContentChanged(this);
			return !!merged;
		}
	},
	
	/**
	 * (in table) Moves caret to the next cell
	 * @TODO: Add selenium test
	 */
	handleMoveToNextCell: function() {
		this._handleMoveToCell("next");
	},

	/**
	 * (in table) Moves caret to the previous cell
	 * @TODO: Add selenium test
	 */
	handleMoveToPreviousCell: function() {
		this._handleMoveToCell("prev");
	},

	/**
	 * (in table) Moves caret to the above cell
	 * @TODO: Add selenium test
	 */
	handleMoveToAboveCell: function() {
		this._handleMoveToCell("above");
	},

	/**
	 * (in table) Moves caret to the below cell
	 * @TODO: Add selenium test
	 */
	handleMoveToBelowCell: function() {
		this._handleMoveToCell("below");
	},

	_handleMoveToCell: function(dir) {
		var block = this.rdom.getCurrentBlockElement();
		var cell = this.rdom.getParentElementOf(block, ["TD", "TH"]);
		var table = this.rdom.getParentElementOf(cell, ["TABLE"]);
		var rtable = new xq.RichTable(this.rdom, table);
		var target = null;
		
		if(["next", "prev"].indexOf(dir) !== -1) {
			var toNext = dir === "next";
			target = toNext ? rtable.getNextCellOf(cell) : rtable.getPreviousCellOf(cell);
		} else {
			var toBelow = dir === "below";
			target = toBelow ? rtable.getBelowCellOf(cell) : rtable.getAboveCellOf(cell);
		}

		if(!target) {
			var finder = function(node) {return ['TD', 'TH'].indexOf(node.nodeName) === -1 && this.tree.isBlock(node) && !this.tree.hasBlocks(node);}.bind(this.rdom);
			var exitCondition = function(node) {return this.tree.isBlock(node) && !this.tree.isDescendantOf(this.getRoot(), node)}.bind(this.rdom);
			
			target = (toNext || toBelow) ? 
				this.rdom.tree.findForward(cell, finder, exitCondition) :
				this.rdom.tree.findBackward(table, finder, exitCondition);
		}
		
		if(target) this.rdom.placeCaretAtStartOf(target);
	},
	
	/**
	 * Applies STRONG tag
	 * @TODO: Add selenium test
	 */
	handleStrongEmphasis: function() {
		this.rdom.applyStrongEmphasis();

		var historyAdded = this.editHistory.onCommand();
		this._fireOnCurrentContentChanged(this);
		
		return true;
	},
	
	/**
	 * Applies EM tag
	 * @TODO: Add selenium test
	 */
	handleEmphasis: function() {
		this.rdom.applyEmphasis();
		
		var historyAdded = this.editHistory.onCommand();
		this._fireOnCurrentContentChanged(this);
		
		return true;
	},
	
	/**
	 * Applies EM.underline tag
	 * @TODO: Add selenium test
	 */
	handleUnderline: function() {
		this.rdom.applyUnderline();
		
		var historyAdded = this.editHistory.onCommand();
		this._fireOnCurrentContentChanged(this);
		
		return true;
	},
	
	/**
	 * Applies SPAN.strike tag
	 * @TODO: Add selenium test
	 */
	handleStrike: function() {
		this.rdom.applyStrike();

		var historyAdded = this.editHistory.onCommand();
		this._fireOnCurrentContentChanged(this);

		return true;
	},
	
	/**
	 * Removes all style
	 * @TODO: Add selenium test
	 */
	handleRemoveFormat: function() {
		this.rdom.applyRemoveFormat();

		var historyAdded = this.editHistory.onCommand();
		this._fireOnCurrentContentChanged(this);

		return true;
	},
	
	/**
	 * Remove link
	 * @TODO: Add selenium test
	 */
	handleRemoveLink: function() {
		this.rdom.applyRemoveLink();
		
		var historyAdded = this.editHistory.onCommand();
		this._fireOnCurrentContentChanged(this);
		
		return true;
	},
	
	/**
	 * Inserts table
	 * @TODO: Add selenium test
	 *
	 * @param {object} [attrs] Attributes of tag. If not provided, it does not modify current attribute, and if empty string is provided, attribute will be removed.
	 */
	handleTable: function(attrs) {
		if (attrs){
			var cur = this.rdom.getCurrentBlockElement();
			if (!cur)
				cur=this.getBody();
			if(this.rdom.getParentElementOf(cur, ["TABLE"])) return true;
			
			var rtable = xq.RichTable.create(this.rdom, attrs);
			rtable.setTableProperty(attrs);
			
			if(this.rdom.tree.isBlockContainer(cur)) {
				var wrappers = this.rdom.wrapAllInlineOrTextNodesAs("P", cur, true);
				cur = wrappers.last();
			}
			var tableDom = this.rdom.insertNodeAt(rtable.getDom(), cur, "after");
			this.rdom.placeCaretAtStartOf(rtable.getCellAt(0, 0));
			
			if(this.rdom.isEmptyBlock(cur)) this.rdom.deleteNode(cur, true);
			
			var historyAdded = this.editHistory.onCommand();
			this._fireOnCurrentContentChanged(this);
			
		} else {
			xq.RichTableController.openDialog('new');
		}
		
		return true;
	},
	handleColorPicker: function(color){
		var anchor = this.lastAnchor;
		if (anchor.className.indexOf('foreground') != -1){
			xed.handleForegroundColor(color);
		} else if(anchor.className.indexOf('tableDialog') != -1) {
			var anchors = anchor.parentNode.parentNode.getElementsByTagName('A');
			for (var i = 0; i < anchors.length; i++){
				if(anchors[i].id.indexOf('ColorBoard') != -1) anchors[i].style.backgroundColor = color;
			}
			
			var inputs = anchor.parentNode.parentNode.getElementsByTagName('INPUT');
			for (var j = 0; j < inputs.length; j++){
				if(inputs[j].id.indexOf('ColorCode') != -1) inputs[j].value = color;
			}
		}
	},
	handleInsertNewRowAt: function(where) {
		var cur = this.rdom.getCurrentBlockElement();
		var tr = this.rdom.getParentElementOf(cur, ["TR"]);
		if(!tr) return true;
		
		var table = this.rdom.getParentElementOf(tr, ["TABLE"]);
		var rtable = new xq.RichTable(this.rdom, table);
		var row = rtable.insertNewRowAt(tr, where);
		
		this.rdom.placeCaretAtStartOf(row.cells[0]);
		return true;
	},
	
	/**
	 * @TODO: Add selenium test
	 */
	handleInsertNewColumnAt: function(where) {
		var cur = this.rdom.getCurrentBlockElement();
		var td = this.rdom.getParentElementOf(cur, ["TD"], true);
		if(!td) return true;
		
		var table = this.rdom.getParentElementOf(td, ["TABLE"]);
		var rtable = new xq.RichTable(this.rdom, table);
		rtable.insertNewCellAt(td, where);
		
		this.rdom.placeCaretAtStartOf(cur);
		return true;
	},
	
	/**
	 * @TODO: Add selenium test
	 */
	handleDeleteTable: function() {
		var cur = this.rdom.getCurrentBlockElement();
		var table = this.rdom.getParentElementOf(cur, ["TABLE"]);
		if(!table) return true;

		var rtable = new xq.RichTable(this.rdom, table);
		var blockToMove = rtable.deleteTable(table);
		
		this.rdom.placeCaretAtStartOf(blockToMove);
		return true;
	},
	
	/**
	 * @TODO: Add selenium test
	 */
	handleDeleteRow: function() {
		var cur = this.rdom.getCurrentBlockElement();
		var tr = this.rdom.getParentElementOf(cur, ["TR"]);
		if(!tr) return true;

		var table = this.rdom.getParentElementOf(tr, ["TABLE"]);
		var rtable = new xq.RichTable(this.rdom, table);
		var blockToMove = rtable.deleteRow(tr);
		
		this.rdom.placeCaretAtStartOf(blockToMove);
		return true;
	},
	
	/**
	 * @TODO: Add selenium test
	 */
	handleDeleteColumn: function() {
		var cur = this.rdom.getCurrentBlockElement();
		var td = this.rdom.getParentElementOf(cur, ["TD"], true);
		if(!td) return true;

		var table = this.rdom.getParentElementOf(td, ["TABLE"]);
		var rtable = new xq.RichTable(this.rdom, table);
		rtable.deleteCell(td);

		//this.rdom.placeCaretAtStartOf(table);
		return true;
	},
	
	_tablePropFormSize: function(form, prop, type) {
		form[type+'Unit'].value=prop[type].unit || '100%';
		form[type].value=prop[type].size || '';
		form[type].style.display=(form[type+'Unit'].value == 'auto')?'none':'';
	},

	handleTableProperty: function(prop) {
		var cur = this.rdom.getCurrentBlockElement();
		var el = this.rdom.getParentElementOf(cur, ["TABLE"], true);
		if(!el) return true;

		var rtable = new xq.RichTable(this.rdom, el);

		if (prop) {
			rtable.setTableProperty(prop);
		}else{
			var prop = rtable.getTableProperty();
		}
		
		return prop;
	},
	handleRowProperty: function(prop) {
		var cur = this.rdom.getCurrentBlockElement();
		var el = this.rdom.getParentElementOf(cur, ["TR"], true);
		if(!el) return true;

		var rtable = new xq.RichTable(this.rdom, el.offsetParent);

		if (prop) {
			rtable.setRowProperty(el, prop);
		}else{
			var prop = rtable.getRowProperty(el);
		}
		
		return prop;
	},
	handleColumnProperty: function(prop) {
		var cur = this.rdom.getCurrentBlockElement();
		var el = this.rdom.getParentElementOf(cur, ["TD"], true);
		if(!el) return true;

		var rtable = new xq.RichTable(this.rdom, el.offsetParent);

		if (prop) {
			rtable.setColumnProperty(el, prop);
		}else{
			var prop = rtable.getColumnProperty(el);
		}
		
		return prop;
	},



	/**
	 * Performs block indentation
	 * @TODO: Add selenium test
	 */
	handleIndent: function() {
		if(this.rdom.hasSelection(true)) {
			var blocks = this.rdom.getBlockElementsAtSelectionEdge(true, true);
			if(blocks.first() !== blocks.last()) {
				var affected = this.rdom.indentElements(blocks.first(), blocks.last());
				this.rdom.selectBlocksBetween(affected.first(), affected.last());
				
				var historyAdded = this.editHistory.onCommand();
				this._fireOnCurrentContentChanged(this);
				
				return true;
			}
		}
		
		var block = this.rdom.getCurrentBlockElement();
		var affected = this.rdom.indentElement(block);
		if(affected && !this.rdom.tree.isAtomic(this.rdom.getCurrentElement())) {
			this.rdom.placeCaretAtStartOf(affected);
			
			var historyAdded = this.editHistory.onCommand();
			this._fireOnCurrentContentChanged(this);
		}
		
		return true;
	},
	
	/**
	 * Performs block outdentation
	 * @TODO: Add selenium test
	 */
	handleOutdent: function() {
		if(this.rdom.hasSelection(true)) {
			var blocks = this.rdom.getBlockElementsAtSelectionEdge(true, true);
			if(blocks.first() !== blocks.last()) {
				var affected = this.rdom.outdentElements(blocks.first(), blocks.last());
				this.rdom.selectBlocksBetween(affected.first(), affected.last());
				
				var historyAdded = this.editHistory.onCommand();
				this._fireOnCurrentContentChanged(this);
				
				return true;
			}
		}
		
		var block = this.rdom.getCurrentBlockElement();
		var affected = this.rdom.outdentElement(block);
		
		if(affected && !this.rdom.tree.isAtomic(this.rdom.getCurrentElement())) {
			this.rdom.placeCaretAtStartOf(affected);

			var historyAdded = this.editHistory.onCommand();
			this._fireOnCurrentContentChanged(this);
		}
		
		return true;
	},
	
	/**
	 * Applies list.
	 * @TODO: Add selenium test
	 *
	 * @param {String} type "UL" or "OL"
	 * @param {String} CSS class name
	 */
	handleList: function(type, className) {
		if(this.rdom.hasSelection(true)) {
			var blocks = this.rdom.getBlockElementsAtSelectionEdge(true, true);
			if(blocks.first() !== blocks.last()) {
				blocks = this.rdom.applyLists(blocks.first(), blocks.last(), type, className);
			} else {
				blocks[0] = blocks[1] = this.rdom.applyList(blocks.first(), type, className);
			}
			this.rdom.selectBlocksBetween(blocks.first(), blocks.last());
		} else {
			var block = this.rdom.applyList(this.rdom.getCurrentBlockElement(), type, className);
			this.rdom.placeCaretAtStartOf(block);
		}
		var historyAdded = this.editHistory.onCommand();
		this._fireOnCurrentContentChanged(this);
		
		return true;
	},
	
	/**
	 * Applies justification
	 * @TODO: Add selenium test
	 *
	 * @param {String} dir "left", "center", "right" or "both"
	 */
	handleJustify: function(dir) {
		if(this.rdom.hasSelection(true)) {
			var blocks = this.rdom.getSelectedBlockElements();
    		
    		var dir = (dir === "left" || dir === "both") && (blocks[0].style.textAlign === "left" || blocks[0].style.textAlign === "") ? "both" : dir;
			this.rdom.justifyBlocks(blocks, dir);
			this.rdom.selectBlocksBetween(blocks.first(), blocks.last());
		} else {
    		var block = this.rdom.getCurrentBlockElement();
    		var dir = (dir === "left" || dir === "both") && (block.style.textAlign === "left" || block.style.textAlign === "") ? "both" : dir;
			this.rdom.justifyBlock(block, dir);
		}
		var historyAdded = this.editHistory.onCommand();
		this._fireOnCurrentContentChanged(this);
		
		return true;
	},
	
	/**
	 * Removes current block element
	 * @TODO: Add selenium test
	 */
	handleRemoveBlock: function() {
		var block = this.rdom.getCurrentBlockElement();
		var blockToMove = this.rdom.removeBlock(block);
		this.rdom.placeCaretAtStartOf(blockToMove);
		if(!this.isElementVisible(blockToMove)) blockToMove.scrollIntoView(false);
		
		var historyAdded = this.editHistory.onCommand();
		this._fireOnCurrentContentChanged(this);
		
		return true;
	},
	
	/**
	 * Applies background color
	 * @TODO: Add selenium test
	 *
	 * @param {String} color CSS color string
	 */
	handleBackgroundColor: function(color) {
		if(color) {
			this.rdom.applyBackgroundColor(color);

			if(this.rdom.hasSelection()) {
				var historyAdded = this.editHistory.onCommand();
				this._fireOnCurrentContentChanged(this);
			}
		} else {
			var dialog = new xq.ui.FormDialog(
				this,
				xq.ui_templates.basicColorPickerDialog,
				function(dialog) {},
				function(data) {
					this.focus();
					
					if(xq.Browser.isTrident) {
						var rng = this.rdom.rng();
						rng.moveToBookmark(bm);
						rng.select();
					}
					
					if(!data) return;
					
					this.handleBackgroundColor(data.color);
				}.bind(this)
			);
			
			if(xq.Browser.isTrident) var bm = this.rdom.rng().getBookmark();
			
			dialog.show({position: 'centerOfEditor'});
		}
		return true;
	},
	
	/**
	 * Applies foreground color
	 * @TODO: Add selenium test
	 *
	 * @param {String} color CSS color string
	 */
	handleForegroundColor: function(color) {
		if(color) {
			this.rdom.applyForegroundColor(color);
			
			if(this.rdom.hasSelection()) {
				var historyAdded = this.editHistory.onCommand();
				this._fireOnCurrentContentChanged(this);
			}
		} else {
			var dialog = new xq.ui.FormDialog(
				this,
				xq.ui_templates.basicColorPickerDialog,
				function(dialog) {},
				function(data) {
					this.focus();
					
					if(xq.Browser.isTrident) {
						var rng = this.rdom.rng();
						rng.moveToBookmark(bm);
						rng.select();
					}
					
					if(!data) return;
					
					this.handleForegroundColor(data.color);
				}.bind(this)
			);
			
			if(xq.Browser.isTrident) var bm = this.rdom.rng().getBookmark();
			
			dialog.show({position: 'centerOfEditor'});
		}
		return true;
	},

	/**
	 * Applies font face
	 * @TODO: Add selenium test
	 *
	 * @param {String} face font face
	 */
	handleFontFace: function(face) {
		if(face) {
			this.rdom.applyFontFace(face);

			if(this.rdom.hasSelection()) {
				var historyAdded = this.editHistory.onCommand();
				this._fireOnCurrentContentChanged(this);
			}
		} else {
			//TODO: popup font dialog
		}
		return true;
	},
	
	/**
	 * Applies font size
	 *
	 * @param {Number} font size (1 to 6)
	 */
	handleFontSize: function(size) {
		if(size) {
			this.rdom.applyFontSize(size);

			if(this.rdom.hasSelection()) {
				var historyAdded = this.editHistory.onCommand();
				this._fireOnCurrentContentChanged(this);
			}
		} else {
			//TODO: popup font dialog
		}
		return true;
	},

	/**
	 * Applies superscription
	 * @TODO: Add selenium test
	 */	
	handleSuperscription: function() {
		this.rdom.applySuperscription();

		var historyAdded = this.editHistory.onCommand();
		this._fireOnCurrentContentChanged(this);

		return true;
	},
	
	/**
	 * Applies subscription
	 * @TODO: Add selenium test
	 */	
	handleSubscription: function() {
		this.rdom.applySubscription();

		var historyAdded = this.editHistory.onCommand();
		this._fireOnCurrentContentChanged(this);

		return true;
	},

	/**
	 * Change or wrap current block(or selected blocks)'s tag
	 * @TODO: Add selenium test
	 * 
	 * @param {String} [tagName] Name of tag. If not provided, it does not modify current tag name
	 * @param {String} [className] Class name of tag. If not provided, it does not modify current class name, and if empty string is provided, class attribute will be removed.  
	 * @param {object} [attrs] Attributes of tag. If not provided, it does not modify current attribute, and if empty string is provided, attribute will be removed.  
	 */	
	handleApplyBlock: function(tagName, className, attrs) {
		if(!tagName && !className) return true;
		
		// if current selection contains multi-blocks
		if(this.rdom.hasSelection()) {
			var blocks = this.rdom.getBlockElementsAtSelectionEdge(true, true);
			if(blocks.first() !== blocks.last()) {
				var applied = this.rdom.applyTagIntoElements(tagName, blocks.first(), blocks.last(), className);
				this.rdom.selectBlocksBetween(applied.first(), applied.last());
				
				var historyAdded = this.editHistory.onCommand();
				this._fireOnCurrentContentChanged(this);
				
				return true;
			}
		}
		
		// else
		var block = this.rdom.getCurrentBlockElement();
		this.rdom.pushMarker();
		var applied =
			this.rdom.applyTagIntoElement(tagName, block, className) ||
			block;
		
		if(attrs) this.rdom.setAttributes(applied, attrs);
		
		this.rdom.popMarker(true);
		
		if(this.rdom.isEmptyBlock(applied)) {
			this.rdom.correctEmptyElement(applied);
			this.rdom.placeCaretAtStartOf(applied);
		}
		
		var historyAdded = this.editHistory.onCommand();
		this._fireOnCurrentContentChanged(this);
		
		return true;
	},
	
	/**
	 * Inserts separator (HR)
	 * @TODO: Add selenium test
	 */
	handleSeparator: function() {
		this.rdom.collapseSelection();
		
		var curBlock = this.rdom.getCurrentBlockElement();
		var atStart = this.rdom.isCaretAtBlockStart();
		if(this.rdom.tree.isBlockContainer(curBlock)) curBlock = this.rdom.wrapAllInlineOrTextNodesAs("P", curBlock, true)[0];
		
		this.rdom.insertNodeAt(this.rdom.createElement("HR"), curBlock, atStart ? "before" : "after");
		this.rdom.placeCaretAtStartOf(curBlock);

		// add undo history
		var historyAdded = this.editHistory.onCommand();
		this._fireOnCurrentContentChanged(this);
		
		return true;
	},
	
	/**
	 * Performs UNDO
	 * @TODO: Add selenium test
	 */
	handleUndo: function() {
		var performed = this.editHistory.undo();
		this._fireOnCurrentContentChanged(this);
		
		var curBlock = this.rdom.getCurrentBlockElement();
		if(!xq.Browser.isTrident && curBlock && !this.isElementVisible(curBlock)) {
			curBlock.scrollIntoView(false);
		}
		return true;
	},
	
	/**
	 * Performs REDO
	 * @TODO: Add selenium test
	 */
	handleRedo: function() {
		var performed = this.editHistory.redo();
		this._fireOnCurrentContentChanged(this);
		
		var curBlock = this.rdom.getCurrentBlockElement();
		if(!xq.Browser.isTrident && curBlock && !this.isElementVisible(curBlock)) {
			curBlock.scrollIntoView(false);
		}
		return true;
	},
	
	handleEmoticon: function(fileName){
		var img = this.getDoc().createElement('IMG');
		img.src = this.config.imagePathForEmoticon + fileName;
		img.alt = fileName;
		this.rdom.insertNode(img);
	},
	
	handleCharacter: function(chr){
		this.rdom.insertHtml( decodeURIComponent(chr));
	},
	
	_handleContextMenu: function(e) {
		if (xq.Browser.isWebkit) {
			if (e.metaKey || xq.isLeftClick(e)) return false;
		} else if (e.shiftKey || e.ctrlKey || e.altKey) {
			return false;
		}
		
		var point = xq.getEventPoint(e);
		var x = point.x;
		var y = point.y;

		var pos = xq.getCumulativeOffset(this.wysiwygEditorDiv);
		x += pos.left;
		y += pos.top;
		this._contextMenuTargetElement = e.target || e.srcElement;
		
		if (!xq.Browser.isTrident) {
			var doc = this.getDoc();
			var body = this.getBody();
			
			x -= doc.documentElement.scrollLeft;
			y -= doc.documentElement.scrollTop;
			
			x -= body.scrollLeft;
			y -= body.scrollTop;
		}
		
		for(var cmh in this.config.contextMenuHandlers) {
			var stop = this.config.contextMenuHandlers[cmh].handler(this, this._contextMenuTargetElement, x, y);
			if(stop) {
				xq.stopEvent(e);
				return true;
			}
		}
		
		return false;
	},
	
	showContextMenu: function(menuItems, x, y) {
		if (!menuItems || menuItems.length <= 0) return;
		
		if (!this.contextMenuContainer) {
			this.contextMenuContainer = this.doc.createElement('UL');
			this.contextMenuContainer.className = 'xqContextMenu';
			this.contextMenuContainer.style.display='none';
			
			xq.observe(this.doc, 'click', this._contextMenuClicked.bindAsEventListener(this));
			xq.observe(this.rdom.getDoc(), 'click', this.hideContextMenu.bindAsEventListener(this));
			
			this.body.appendChild(this.contextMenuContainer);
		} else {
			while (this.contextMenuContainer.childNodes.length > 0)
				this.contextMenuContainer.removeChild(this.contextMenuContainer.childNodes[0]);
		}
		
		for (var i=0; i < menuItems.length; i++) {
			menuItems[i]._node = this._addContextMenuItem(menuItems[i]);
		}

		this.contextMenuContainer.style.display='block';
		this.contextMenuContainer.style.left = Math.min(Math.max(this.doc.body.scrollWidth, this.doc.documentElement.clientWidth) - this.contextMenuContainer.offsetWidth, x) + 'px';
		this.contextMenuContainer.style.top = Math.min(Math.max(this.doc.body.scrollHeight, this.doc.documentElement.clientHeight) - this.contextMenuContainer.offsetHeight, y) + 'px';

		this.contextMenuItems = menuItems;
	},
	
	hideContextMenu: function() {
		if (this.contextMenuContainer)
			this.contextMenuContainer.style.display='none';
	},
	
	_addContextMenuItem: function(item) {
		if (!this.contextMenuContainer) throw "No conext menu container exists";
		
		var node = this.doc.createElement('LI');
		if (item.disabled) node.className += ' disabled'; 
		
		if (item.title === '----') {
			node.innerHTML = '&nbsp;';
			node.className = 'separator';
		} else {
			if(item.handler) {
				node.innerHTML = '<a href="#" onclick="return false;">'+(item.title.toString().escapeHTML())+'</a>';
			} else {
				node.innerHTML = (item.title.toString().escapeHTML());
			}
		}
		
		if(item.className) node.className = item.className;
		
		this.contextMenuContainer.appendChild(node);
		
		return node;
	},
	
	_contextMenuClicked: function(e) {
		this.hideContextMenu();
		
		if (!this.contextMenuContainer) return;
		
		var node = e.srcElement || e.target;
		while(node && node.nodeName !== "LI") {
			node = node.parentNode;
		}
		if (!node || !this.rdom.tree.isDescendantOf(this.contextMenuContainer, node)) return;

		for (var i=0; i < this.contextMenuItems.length; i++) {
			if (this.contextMenuItems[i]._node === node) {
				var handler = this.contextMenuItems[i].handler;
				if (!this.contextMenuItems[i].disabled && handler) {
					var xed = this;
					var element = this._contextMenuTargetElement;
					if(typeof handler === "function") {
						handler(xed, element);
					} else {
						eval(handler);
					}
				}
				break;
			}
		}
	},
	
	/**
	 * Inserts HTML template
	 * @TODO: Add selenium test
	 *
	 * @param {String} html Template string. It should have single root element
	 * @returns {Element} inserted element
	 */
	insertTemplate: function(html) {
		return this.rdom.insertHtml(this._processTemplate(html));
	},
	
	/**
	 * Places given HTML template nearby target.
	 * @TODO: Add selenium test
	 *
	 * @param {String} html Template string. It should have single root element
	 * @param {Node} target Target node.
	 * @param {String} where Possible values: "before", "start", "end", "after"
	 *
	 * @returns {Element} Inserted element.
	 */
	insertTemplateAt: function(html, target, where) {
		return this.rdom.insertHtmlAt(this._processTemplate(html), target, where);
	},
	
	_processTemplate: function(html) {
		// apply template processors
		var tps = this.getTemplateProcessors();
		for(var key in tps) {
			var value = tps[key];
			html = value.handler(html);
		}
		
		// remove all whitespace characters between block tags
		return this.removeUnnecessarySpaces(html);
	},
	
	
	
	/** @private */
	_handleEnterAtEmptyBlock: function() {
		var block = this.rdom.getCurrentBlockElement();
		if(this.rdom.tree.isTableCell(block) && this.rdom.isFirstBlockOfBody(block)) {
			block = this.rdom.insertNodeAt(this.rdom.makeEmptyParagraph(), this.rdom.getRoot(), "start");
		} else {
			block = 
				this.rdom.outdentElement(block) ||
				this.rdom.extractOutElementFromParent(block) ||
				this.rdom.replaceTag("P", block) ||
				this.rdom.insertNewBlockAround(block);
		}
		
		this.rdom.placeCaretAtStartOf(block);
		if(!xq.Browser.isTrident && !this.isElementVisible(block)) block.scrollIntoView(false);
	},
	
	/** @private */
	_handleEnterAtEdge: function(atStart, forceInsertParagraph) {
		var block = this.rdom.getCurrentBlockElement();
		var blockToPlaceCaret;
		
		if(atStart && this.rdom.isFirstBlockOfBody(block)) {
			blockToPlaceCaret = this.rdom.insertNodeAt(this.rdom.makeEmptyParagraph(), this.rdom.getRoot(), "start");
		} else {
			if(this.rdom.tree.isTableCell(block)) forceInsertParagraph = true;
			var newBlock = this.rdom.insertNewBlockAround(block, atStart, forceInsertParagraph ? "P" : null);
			blockToPlaceCaret = !atStart ? newBlock : newBlock.nextSibling;
		}
		
		this.rdom.placeCaretAtStartOf(blockToPlaceCaret);
		if(!xq.Browser.isTrident && !this.isElementVisible(blockToPlaceCaret)) blockToPlaceCaret.scrollIntoView(false);
	},
	
	isElementVisible: function(element){
		var doc = this.rdom.getDoc();
		var currentParentNode = this.rdom.getParentBlockElementOf(element);
		var topLimit = doc.documentElement.scrollTop || doc.body.scrollTop;
		var bottomLimit = topLimit + this.outerFrame.offsetHeight - currentParentNode.offsetHeight;
		if (topLimit < currentParentNode.offsetTop && bottomLimit > currentParentNode.offsetTop) return true;
	},
	
	/**
	 * Replace URL text nearby caret into a link
	 * @TODO: Add selenium test
	 */
	replaceUrlToLink: function() {
		// If there's link nearby caret, nothing happens
		if(this.rdom.getParentElementOf(this.rdom.getCurrentElement(), ["A"])) return;
		
		var marker = this.rdom.pushMarker();
		var criteria = function(text) {
			var m = /(http|https|ftp|mailto)\:\/\/[^\s]+$/.exec(text);
			return m ? m.index : -1;
		};
		
		var test = this.rdom.testSmartWrap(marker, criteria);
		if(test.textIndex !== -1) {
			var a = this.rdom.smartWrap(marker, "A", criteria);
			a.href = test.text;
		}
		this.rdom.getCurrentElement().normalize();
		this.rdom.popMarker(true);
	},

	_: function(msg) {
		if (xq._messages && xq._messages[this.config.lang] && typeof xq._messages[this.config.lang][msg] != 'undefined')
		{
			msg=xq._messages[this.config.lang][msg];
		}

		if (arguments.length > 1) {
			for (var i=1; i < arguments.length; i++)
				msg=msg.replace('$'+i, arguments[i]);
		}
		return msg;
	}
});
/**
 * @requires XQuared.js
 * @requires Editor.js
 */
xq.moduleName = "Minimal"
