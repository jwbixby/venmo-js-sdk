var eventObject = new Events();

test("The Events exists", function(){
  ok(eventObject)
});


asyncTest("Able to create a new listener",1, function(){
  
  eventObject.addListener('login',function(event){
  	ok(true);
	start();
  });
  
  eventObject.fireEvent('login',{'error':'User denied your application access to his or her protected resources.'});
  
});


asyncTest("Check event data",2, function(){
  
  eventObject.addListener('test',function(event){
  	ok(event['true']);
	ok(!event['false']);
	start();
  });
  
  eventObject.fireEvent('test',{'true':true,'false':false});
  
});

asyncTest("Remove event and fire removed event",1, function(){
  var assert = true;
  
  var callback = function(event){
  	assert = false;
  };

  eventObject.addListener('test2',callback);
  eventObject.removeListener('test2',callback);
  
  eventObject.fireEvent('test2',{});
  
  setTimeout(function(){
	  ok(assert);
	  start();
  },100);
  
});


asyncTest("Remove event and fire removed event",1, function(){
  var assert = true;
  
  var callback = function(event){
  	assert = false;
  };

  eventObject.addListener('test2',callback);
  eventObject.addListener('test2',callback);
  eventObject.removeListener('test2');
  
  eventObject.fireEvent('test2',{});
  
  setTimeout(function(){
	  ok(assert);
	  start();
  },100);
  
});