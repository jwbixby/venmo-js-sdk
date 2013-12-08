

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