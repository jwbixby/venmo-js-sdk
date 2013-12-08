


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