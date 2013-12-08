
test("The base function exists", function() {
  ok(Venmo);
});

test("The version exists", function(){
  ok(Venmo.VERSION)
});

asyncTest("The login callback is called",2,function(){
  Venmo.init({
    'ClientID':'1455',
    'Scope':'access_feed,access_profile,access_email,access_phone,access_friends,make_payments'
  });
  Venmo.login(function(res){
	  ok(true, res['error']);
	  Venmo.logout();
	  ok(Venmo.AccessToken === null);S
	  start();
  });
});