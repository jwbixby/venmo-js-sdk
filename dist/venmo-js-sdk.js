
(function(root, undefined) {

  "use strict";




var Utilities = function(){};

Utilities.queryParser = function (str) {
    var result = {};
	var queryString = str.slice(1);
    var re = /([^&=]+)=([^&]*)/g, m;

    while ( (m = re.exec(queryString)) ) {
        result[decodeURIComponent(m[1])] = decodeURIComponent(m[2]).replace(/\+/g,  " ");
    }
    return result;
};


Utilities.ajaxRequest = function(){
	
	var events = new Events();
	
	var XMLHttpFactories = [
		/* jshint ignore:start */
	    function () {return new XMLHttpRequest();},
	    function () {return new ActiveXObject("Msxml2.XMLHTTP");},
	    function () {return new ActiveXObject("Msxml3.XMLHTTP");},
	    function () {return new ActiveXObject("Microsoft.XMLHTTP");}
		/* jshint ignore:end */
	];
	

	function createXMLHTTPObject() {
	    var xmlhttp = false;
	    for (var i=0;i<XMLHttpFactories.length;i++) {
	        try {
	            xmlhttp = XMLHttpFactories[i]();
	        }
	        catch (e) {
	            continue;
	        }
	        break;
	    }
	    return xmlhttp;
	}
	
	
	this.get = function(url){
		var req = createXMLHTTPObject();
	    if (!req){
			return this;
	    }
	    req.open("GET",url,true);
	    req.setRequestHeader('User-Agent','XMLHTTP/1.0');
	    req.onreadystatechange = function () {
	        if (req.readyState != 4){
				events.fireEvent('failed',req);
				return this;
	        }
			if (req.status != 200 && req.status != 304) {
				events.fireEvent('failed',req);
	            return this;
	        }
	        events.fireEvent('complete',req);
		};
		if (req.readyState == 4){
			events.fireEvent('failed',req);
			return this;
		}
		return this;
	};
	
	this.post = function(url,data){
		
		var req = createXMLHTTPObject();
		if(!req){
			return this;
		}
		req.open("POST",url,true);
		req.setRequestHeader('User-Agent','XMLHTTP/1.0');
		if(data){
		    req.setRequestHeader('Content-type','application/x-www-form-urlencoded');
		}
		req.onreadystatechange = function () {
			if (req.readyState != 4){
				events.fireEvent('failed',req);
				return this;
		    }
			if (req.status != 200 && req.status != 304) {
				events.fireEvent('failed',req);
		        return this;
		    }
		    events.fireEvent('complete',req);
		};
		if (req.readyState == 4){
			events.fireEvent('failed',req);
			return this;
		}
		req.send(data);
		return this;
	};
	
	this.complete = function(callback){
		events.addListener('complete',callback);
		return this;
	};
	
	this.failed = function(callback){
		events.addListener('failed',callback);
		return this;
	};
	
	return this;
};



var Cookie = function(){};

Cookie.get = function(name){
	var value = root.document.cookie;
	var index = value.indexOf(" " + name + "=");
	if (index == -1)
	{
		 index = value.indexOf(name + "=");
	}
	if (index == -1)
	{
		 value = null;
	}
	else
	{
		 index = value.indexOf("=", index) + 1;
		 var end = value.indexOf(";", index);
		 
		 if (end == -1){
			 end = value.length;
		 }
		 value = root.unescape(value.substring(index,end));
	}
	return value;
};


Cookie.set = function(name,value,expires){
	var data = root.escape(value) + (( expires === null ) ? "" : ";expires=" + expires.toUTCString()) + ";domain=" + root.document.domain + ";path=/";
	root.document.cookie = name + "=" + data;
	console.log(name + "=" + data);
};


Cookie.remove = function(name){
	var expires = new Date();
	expires.setTime(expires.getTime() - 1);
	Cookie.set(name,null, expires);
};




var Events = function(){
	var Data = {};

	this.addListener = function(action, callback){
		if(!(action in Data)){
			Data[action] = [];
		}
	
		Data[action].push(callback);
	};

	this.removeListener = function(action, callback){
		if(callback !== undefined){
			var index = Data[action].indexOf(callback);
		
			if(index !== -1){
				Data[action].splice(index,1);
			}
			return;
		}
		Data[action] = [];
	};

	this.fireEvent = function(action, event){
		for(var key in Data[action]){
			Data[action][key](event);
		}
	};
	
	
};

//root.Events = Events;

/* Venmo-js-sdk main */


if( root.opener){
	var urlQuery = Utilities.queryParser(root.location.search);
	var result = {};
	var values = ['error','access_token'];
	for( var key in values ){
		if(values[key] in urlQuery){
			result[values[key]] = urlQuery[values[key]];
		}
	}
	
	root.opener.Venmo.Events.fireEvent('login',result);
	root.close();
}

// Base function.
var Venmo = function() {
	return true;
};

Venmo.init = function(settings){
	Venmo.AccessToken = Cookie.get('venmo_access_token');
	
	for(var key in settings){
		Venmo[key] = settings[key];
	}
};

Venmo.Events = new Events();

Venmo.AccessToken = null;

Venmo.login = function(callback){
	
	
	Venmo.Events.addListener('login', callback);
	
	if(Venmo.AccessToken !== null){
		var result = {'access_token':Venmo.AccessToken};
		Venmo.Events.fireEvent('login',result);
		return;
	}
	
	var dualScreenLeft = root.screenLeft !== undefined ? root.screenLeft : root.screen.left;
	var dualScreenTop = root.screenTop !== undefined ? root.screenTop : root.screen.top;
	var left = ((root.screen.width / 2) - (400 / 2)) + dualScreenLeft;
	var top = ((root.screen.height / 2) - (500 / 2)) + dualScreenTop;
	
	var strFeatures = "menubar=no,location=no,resizable=no,scrollbars=no,status=yes,height=580,width=400,left=" + left + ",top=" + top;
	var loginURI = "/oauth/authorize?client_id=" + Venmo.ClientID + "&scope=" + Venmo.Scope + "&response_type=token";

	var popup = root.open(Venmo.API_DOMAIN + loginURI, "Test",strFeatures);
	popup.focus();
	
	Venmo.Events.addListener('login', function(result){
		if( 'access_token' in result){
			var expires = new Date();
			expires.setTime(expires.getTime() + ( 30 * 60 * 1000));
			
			/*jshint camelcase:false */
			Venmo.AccessToken = result.access_token;
			Cookie.set('venmo_access_token', result.access_token ,expires);
			/*jshint camelcase:true */
		}
	});
};

Venmo.logout = function(){
	Venmo.AccessToken = null;
	Cookie.remove('venmo_access_token');
	return true;
};

Venmo.api = function(url,callback){
	callback({'url':url});
};

Venmo.API_DOMAIN = "https://api.Venmo.com";

// Version.
Venmo.VERSION = '0.0.1';

// Export to the root, which is probably `window`.
root.Venmo = Venmo;


}(this));
