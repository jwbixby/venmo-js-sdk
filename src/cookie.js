

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