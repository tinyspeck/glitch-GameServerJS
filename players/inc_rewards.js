function rewards_init(){
	if (!this.rewards){
	//if (this.rewards === undefined || this.rewards === null){
		this.rewards = apiNewOwnedDC(this);
		this.rewards.label = 'Rewards';
		
		this.rewards_create_bag();
	}
	
	var bag = this.rewards_get_bag();
	if (!bag){
		this.rewards_create_bag();
	}
}

function rewards_create_bag(){
	// Create a new private storage bag for holding overflow items
	var it = apiNewItemStack('bag_private', 1);
	it.label = 'Private Rewards Overflow Storage';

	this.apiAddHiddenStack(it);

	this.rewards.storage_tsid = it.tsid;
}

function rewards_reset(){
	if (this.rewards){
		var bag = this.rewards_get_bag();
		if (bag){
			var contents = bag.getContents();
			for (var i in contents){
				if (contents[i]) contents[i].apiDelete();
			}
		}
	}
}

function rewards_delete(){
	if (this.rewards){
		var bag = this.rewards_get_bag();
		if (bag){
			var contents = bag.getContents();
			for (var i in contents){
				if (contents[i]) contents[i].apiDelete();
			}
			
			bag.apiDelete();
			delete this.rewards.storage_tsid;
		}
	
		this.rewards.apiDelete();
		delete this.rewards;
	}
}

function rewards_get_bag(){
	return this.hiddenItems[this.rewards.storage_tsid];
}

function rewards_has_items(){
	var bag = this.rewards_get_bag();
	
	return bag.countContents() > 0 ? true : false;
}

function rewards_store(stack, msg){
	this.rewards_init();
	
	var bag = this.rewards_get_bag();
	if (!bag){
		log.error(this+' could not get rewards bag');
		return false;
	}
	
	var remaining = bag.addItemStack(stack);
	if (remaining){
		log.error(this+' could not store '+stack);
		return false;
	}
	
	var name = (stack.count > 1) ? stack.name_plural : (stack.article + " " + stack.name_single);
	var it = (stack.count > 1) ? 'them' : 'it';
	
	this.prompts_add({
		txt		: msg ? msg : "Your magic rock is holding "+name+" for you. Make room in your pack to hold "+it+".",
		icon_buttons	: false,
		timeout		: 30,
		choices		: [
			{ value : 'ok', label : 'Very well' }
		]
	});
	
	return true;
}

function rewards_return(){
	this.rewards_init();

	var bag = this.rewards_get_bag();
	var overflow_items = {};
	if (bag){
		var returned = {};
		var overflow = false;
		var contents = bag.getContents();
		for (var i in contents){
			if (contents[i]){
				var restore = bag.removeItemStackSlot(i);
				var count = restore.count;
				
				var remaining = this.addItemStack(restore);
				if (remaining) {
					overflow = true;
					if (!overflow_items[restore.class_tsid]) overflow_items[restore.class_tsid] = 0;
					overflow_items[restore.class_tsid] += remaining;
				}
				
				if (remaining != count){
					if (!returned[restore.class_tsid]) returned[restore.class_tsid] = 0;
					returned[restore.class_tsid] += count-remaining;
				}
			}
		}
		
		if (overflow){
			var overflow_array = [];
			for (var i in overflow_items){
				var proto = apiFindItemPrototype(i);
				if (proto){
					overflow_array.push(pluralize(overflow_items[i], proto.name_single, proto.name_plural));
				}
			}
			this.prompts_add({
				txt		: "Your magic rock is holding rewards for you ("+pretty_list(overflow_array, ' and ')+"). Make room in your pack to hold them.",
				icon_buttons	: false,
				timeout		: 30,
				choices		: [
					{ value : 'ok', label : 'Very well' }
				]
			});
		}
		
		if (num_keys(returned)){
			var is_plural = 0;
			var returned_array = [];
			for (var i in returned){
				var proto = apiFindItemPrototype(i);
				if (proto){
					if (returned[i] > 1) is_plural = 1;
					returned_array.push(pluralize(returned[i], proto.name_single, proto.name_plural));
				}
			}

			this.prompts_add({
				txt		: "Your "+pretty_list(returned_array, ' and ')+" "+(is_plural ? 'have' : 'has')+" been given to you.",
				icon_buttons	: false,
				timeout		: 5,
				choices		: [
					{ value : 'ok', label : 'OK' }
				]
			});
		}
	}
}