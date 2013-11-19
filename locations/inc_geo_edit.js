function geo_edit_log(who, action){
        if (!this.edit_history) this.edit_history = {};
        this.edit_history[time()] = who+":"+action;

	// clear up old history
	var LIMIT = 20;
	var keys = array_keys(this.edit_history);
	if (keys.length > LIMIT){
		keys.sort();
		while (keys.length > LIMIT) delete this.edit_history[keys.shift()];
	}
}

function admin_geo_edit_log(args){
	this.geo_edit_log(args.who, args.action);
}
