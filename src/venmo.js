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
