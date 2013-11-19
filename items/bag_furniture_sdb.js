//#include include/furniture.js, include/takeable.js

var label = "Storage Display Box";
var version = "1351898608";
var name_single = "Storage Display Box";
var name_plural = "Storage Display Boxes";
var article = "a";
var description = "For the pragmatic showoff in everyone, a box with hidden depths. Not only can you display your prized possessions, but you can tuck a virtually infinite amount of the exact same prized possession behind it, for safekeeping.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 500;
var input_for = [];
var parent_classes = ["bag_furniture_sdb", "furniture_base"];
var has_instance_props = true;

var classProps = {
	"placement_set"	: "wall",	// defined by furniture_base (overridden by bag_furniture_sdb)
	"can_flip"	: "1",	// defined by furniture_base
	"can_revert_to_base"	: "1"	// defined by furniture_base
};

function initInstanceProps(){
	this.instanceProps = {};
	this.instanceProps.upgrade_id = "";	// defined by furniture_base
	this.instanceProps.facing_right = "1";	// defined by furniture_base
	this.instanceProps.user_config = "";	// defined by furniture_base
	this.instanceProps.sell_to_owner = "0";	// defined by bag_furniture_sdb
}

var instancePropsDef = {
	upgrade_id : ["Which upgrade is applied to this furniture"],
	facing_right : ["Are we facing right?"],
	user_config : ["User customizations"],
	sell_to_owner : ["Debug prop to allow the SDB to sell to the owner"],
};

var instancePropsChoices = {
	upgrade_id : [""],
	facing_right : [""],
	user_config : [""],
	sell_to_owner : [""],
};

var verbs = {};

verbs.pickup = { // defined by furniture_base
	"name"				: "pick up",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 50,
	"tooltip"			: "Or, drag to your pack",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (this.getContainerType() == 'street' && this.container.pols_is_pol() && !this.container.pols_is_owner(pc)) return {state: null};
		if (this.class_tsid == 'furniture_chassis' || this.class_tsid == 'furniture_tower_chassis') return {state: null};
		if (this.canPickup){
			var ret = this.canPickup(pc);
			if (!ret.ok){
				if (ret.error) return {state:'disabled', reason: ret.error};
				return {state:'disabled', reason: "You can't pick that up."};
			}
		}
		if (this.isForSale()) return {state:'disabled', reason: "You have to stop selling it first."};
		return {state:'enabled'};
	},
	"handler"			: function(pc, msg, suppress_activity){

		var failed = 0;
		var orig_count = this.count;
		var self_msgs = [];
		var self_effects = [];
		var they_effects = [];

		var ret = pc.furniture_pickup(msg.itemstack_tsid);
		failed = !ret.ok;
		if (ret.error) self_msgs.push(ret.error);

		var pre_msg = this.buildVerbMessage(msg.count, 'pick up', 'picked up', failed, self_msgs, self_effects, they_effects);
		if (!suppress_activity && pre_msg) pc.sendActivity(pre_msg);

		return failed ? false : true;
	}
};

verbs.dont_sell = { // defined by furniture_base
	"name"				: "don't sell",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 51,
	"tooltip"			: "Stop selling it",
	"is_drop_target"		: false,
	"disable_proximity"		: true,
	"conditions"			: function(pc, drop_stack){

		if (this.getContainerType() == 'street' && this.container.pols_is_pol() && !this.container.pols_is_owner(pc)) return {state: null};
		if (!this.canSell(pc)) return {state: null};
		if (!this.isForSale()) return {state: null};
		return {state:'enabled'};
	},
	"handler"			: function(pc, msg, suppress_activity){

		this.is_for_sale = false;
		this.triggerUpdateCallback('furniture');
		this.broadcastConfig();
		this.broadcastStoreConfig();

		var pre_msg = "You stopped selling a "+this.name_single+".";
		pc.sendActivity(pre_msg);

		return true;
	}
};

verbs.set_sale_price = { // defined by furniture_base
	"name"				: "set sale price",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 51,
	"tooltip"			: "Start selling it",
	"is_drop_target"		: false,
	"disable_proximity"		: true,
	"conditions"			: function(pc, drop_stack){

		if (this.getContainerType() == 'street' && this.container.pols_is_pol() && !this.container.pols_is_owner(pc)) return {state: null};
		if (!this.canSell(pc)) return {state: null};
		if (this.isForSale()) return {state: null};
		if (this.is_bag && this.countContents()) return {state:'disabled', reason: "This item must be emptied before it can be sold."};
		if (this.isSoulbound(pc)) return {state:'disabled', reason: "This item is locked to you and cannot be sold."};
		if (this.income) return {state:'disabled', reason: "You have to collect the currants first."};
		return {state:'enabled'};
	},
	"handler"			: function(pc, msg, suppress_activity){

		var label = '<p class="rename_bubble_sdb_pricer_title">Price</p>';

		var args = {
			cancelable: true,
			input_focus: true,
			input_label: label,
			submit_label: "Set price",
			input_value: this.sale_price ? intval(this.sale_price) : 1,
			input_max_chars: 6,
			input_restrict: '0-9',
			no_bubble:false, // this makes the input request use the large UI
			is_currants:true
		};

		this.askPlayer(pc, 'set_sale_price', 'nothing', args);

		return true
	}
};

verbs.give = { // defined by furniture_base
	"name"				: "give",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: true,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_single"			: 1,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 52,
	"tooltip"			: "Or, drag item to player",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		return this.takeable_give_conditions(pc, drop_stack);
	},
	"handler"			: function(pc, msg, suppress_activity){

		return this.takeable_give(pc, msg);
	}
};

verbs.edit_sale_price = { // defined by furniture_base
	"name"				: "edit sale price",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 53,
	"tooltip"			: "Change the sale price",
	"is_drop_target"		: false,
	"disable_proximity"		: true,
	"conditions"			: function(pc, drop_stack){

		if (this.getContainerType() == 'street' && this.container.pols_is_pol() && !this.container.pols_is_owner(pc)) return {state: null};
		if (!this.canSell(pc)) return {state: null};
		if (!this.isForSale()) return {state: null};
		return {state:'enabled'};
	},
	"handler"			: function(pc, msg, suppress_activity){

		return this.verbs.set_sale_price.handler.call(this, pc, msg, suppress_activity);
	}
};

verbs.set_selling_price = { // defined by bag_furniture_sdb
	"name"				: "set selling price",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 54,
	"tooltip"			: "Start selling what's inside",
	"is_drop_target"		: false,
	"disable_proximity"		: true,
	"conditions"			: function(pc, drop_stack){

		if (this.getContainerType() == 'street' && this.container.pols_is_pol() && !this.container.pols_is_owner(pc)) return {state: null};
		if (!this.countContents()) return {state: null};
		if (!this.canVend()) return {state: null};
		if (this.isSelling()) return {state: null};
		return {state:'enabled'};
	},
	"handler"			: function(pc, msg, suppress_activity){

		var proto = apiFindItemPrototype(this.class_type);
		if (!proto) return false;

		var label = '<p class="rename_bubble_sdb_pricer_title">Price per '+proto.name_single+'</p>';
		label+= '<p class="rename_bubble_sdb_pricer_subtitle">Quantity: '+this.countItemClass(this.class_type)+'</p>'

		var args = {
			cancelable: true,
			input_focus: true,
			input_label: label,
			submit_label: "Set price",
			input_value: this.sale_price ? intval(this.sale_price) : 1,
			input_max_chars: 7,
			input_restrict: '0-9',
			no_bubble:false, // this makes the input request use the large UI
			is_currants:true
		};

		this.askPlayer(pc, 'set_selling_price', 'nothing', args);

		return true;
	}
};

verbs.stop_selling = { // defined by bag_furniture_sdb
	"name"				: "stop selling",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 55,
	"tooltip"			: "Stop selling what's inside",
	"is_drop_target"		: false,
	"disable_proximity"		: true,
	"conditions"			: function(pc, drop_stack){

		if (this.getContainerType() == 'street' && this.container.pols_is_pol() && !this.container.pols_is_owner(pc)) return {state: null};
		if (!this.canVend()) return {state: null};
		if (!this.isSelling()) return {state: null};
		return {state:'enabled'};
	},
	"handler"			: function(pc, msg, suppress_activity){

		var failed = 0;
		var orig_count = this.count;
		var self_msgs = [];
		var self_effects = [];
		var they_effects = [];

		this.is_selling = false;
		this.triggerUpdateCallback();
		this.broadcastConfig();
		this.broadcastStoreConfig();

		var pre_msg = this.buildVerbMessage(msg.count, 'stop selling', 'stopped selling', failed, self_msgs, self_effects, they_effects);
		if (!suppress_activity && pre_msg) pc.sendActivity(pre_msg);

		return failed ? false : true;
	}
};

verbs.edit_selling_price = { // defined by bag_furniture_sdb
	"name"				: "edit selling price",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 56,
	"tooltip"			: "Change the sale price of what's inside",
	"is_drop_target"		: false,
	"disable_proximity"		: true,
	"conditions"			: function(pc, drop_stack){

		if (this.getContainerType() == 'street' && this.container.pols_is_pol() && !this.container.pols_is_owner(pc)) return {state: null};
		if (!this.canVend()) return {state: null};
		if (!this.isSelling()) return {state: null};
		return {state:'enabled'};
	},
	"handler"			: function(pc, msg, suppress_activity){

		return this.verbs.set_selling_price.handler.call(this, pc, msg, suppress_activity);
	}
};

verbs.upgrade = { // defined by furniture_base
	"name"				: "upgrade",
	"ok_states"			: ["in_location","in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 57,
	"tooltip"			: "Change it",
	"is_drop_target"		: false,
	"disable_proximity"		: true,
	"conditions"			: function(pc, drop_stack){

		if (this.getContainerType() == 'street' && this.container.pols_is_pol() && !this.container.pols_is_owner(pc)) return {state: null};
		if (this.class_tsid == 'furniture_chassis' || this.class_tsid == 'furniture_tower_chassis') return {state: null};
		if (this.isForSale()) return {state:'disabled', reason: "Cannot be upgraded while it's for sale"};
		if (intval(this.getInstanceProp('upgrade_id')) == 0){
			if (this.class_tsid != 'furniture_door' && (this.getContainerType() == 'pack' || this.getContainerType() == 'bag')) return {state:'disabled', reason: "Drag this "+this.name_single+" into your house to upgrade it"};
			return {state:'enabled'};
		}
		return {state:null};
	},
	"handler"			: function(pc, msg, suppress_activity){

		var upgrades = this.getUpgrades(pc);

		var ret = {
			type: "furniture_upgrade_start",
			itemstack_tsid: this.tsid, // the piece of furniture being upgraded
			upgrades: []
		};

		for (var i in upgrades){
			var up = upgrades[i];
			if (!up.is_visible && !pc.is_god) continue;

			var ob = {
				id: i,
				label: up.name,
				credits: intval(up.credits_cost), // 0==free
				imagination: intval(up.imagination_cost),
				subscriber_only: intval(up.subscriber_only),
				is_visible: up.is_visible ? true : false,
				is_owned: up.is_owned ? true : false,
				is_new: !!up.is_new,
				config: {
					swf_url: up.swf,
					config: up.config
				}
			}
			
			// this but is for tower chassis. We want the upgrade configs to all have the
			// same number of extra_floors as the current upgrade, for customizing!
			if (this.getInstanceProp('extra_floors')) {
				if (!ob.config.config) ob.config.config = {};
				ob.config.config.extra_floors = this.getInstanceProp('extra_floors');
			}
				
			ret.upgrades.push(ob);
		}

		pc.apiSendMsg(ret);

		return true;
	}
};

verbs.change_style = { // defined by furniture_base
	"name"				: "change style",
	"ok_states"			: ["in_location","in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 58,
	"tooltip"			: "Change it",
	"is_drop_target"		: false,
	"disable_proximity"		: true,
	"conditions"			: function(pc, drop_stack){

		if (this.getContainerType() == 'street' && this.container.pols_is_pol() && !this.container.pols_is_owner(pc)) return {state: null};
		if (this.class_tsid == 'furniture_chassis' || this.class_tsid == 'furniture_tower_chassis') return {state: null};
		//if (!pc.has_done_intro) return {state: null};
		if (intval(this.getInstanceProp('upgrade_id')) != 0){
			if (this.isForSale()) return {state:'disabled', reason: "Cannot be upgraded while it's for sale"};
			return {state:'enabled'};
		}
		return {state:null};
	},
	"handler"			: function(pc, msg, suppress_activity){

		return this.verbs.upgrade.handler.call(this, pc, msg, suppress_activity);
	}
};

verbs.flip = { // defined by furniture_base
	"name"				: "flip",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_single"			: 1,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 59,
	"tooltip"			: "Turn it around",
	"is_drop_target"		: false,
	"disable_proximity"		: true,
	"conditions"			: function(pc, drop_stack){

		if (this.getContainerType() == 'street' && this.container.pols_is_pol() && !this.container.pols_is_owner(pc)) return {state: null};
		var can_flip = intval(this.getClassProp('can_flip'));
		if (!can_flip) return {state:null};
		return {state:'enabled'};
	},
	"handler"			: function(pc, msg, suppress_activity){

		var facing_right = intval(this.getInstanceProp('facing_right'));
		this.setInstanceProp('facing_right', (facing_right+1)%2);
		this.flipPlats();

		this.broadcastConfig();

		return true;
	}
};

verbs.buy = { // defined by furniture_base
	"name"				: "buy",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 60,
	"tooltip"			: "Buy it",
	"get_tooltip"			: function(pc, verb, effects){

		return verb.tooltip+' for '+utils.number_format(this.sale_price)+'c';
	},
	"is_drop_target"		: false,
	"disable_proximity"		: true,
	"conditions"			: function(pc, drop_stack){

		var sell_to_owner = false;
		if (this.getContainerType() == 'street' && this.container.pols_is_pol() && this.container.pols_is_owner(pc) && !sell_to_owner) return {state: null};
		if (this.isForSale(pc)) return {state:'enabled'};
		return {state:null};
	},
	"handler"			: function(pc, msg, suppress_activity){

		var out = {
			type: 'store_start',
			item_class: this.class_id,
			item_tsid: this.tsid,
			verb: 'buy',
			store: this.getStoreInfo()
		};
			
		pc.apiSendMsgAsIs(out);
	}
};

verbs.remove = { // defined by bag_furniture_sdb
	"name"				: "remove",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 61,
	"tooltip"			: "Click to remove an item",
	"is_drop_target"		: false,
	"disable_proximity"		: true,
	"conditions"			: function(pc, drop_stack){

		if (this.getContainerType() == 'street' && this.container.pols_is_pol() && !this.container.pols_is_owner(pc)) return {state: null};
		if (this.countContents()) return {state:'enabled'};
		return {state:null};
	},
	"handler"			: function(pc, msg, suppress_activity){

		if (msg.target_item_class_count){
			var removed_total = 0;
			var removed_tsids = [];
			if (msg.target_item_class != this.class_type) return false;

			var remaining = msg.target_item_class_count;

			var stacks = this.apiBagGetItems(msg.target_item_class, remaining);

			for (var i in stacks){
				var stack = stacks[i];

				var count = stack.count;

				if (remaining < count){
					var new_stack = stack.apiSplit(remaining);
					this.addItemStack(stack);
					stack = new_stack;
					count = stack.count;
				}

				removed_total += count;
				removed_tsids.push(stack.tsid);

				if (pc.addItemStack(stack)){
					removed_total -= stack.count;
					// send bubble that some of it didn't make it
					this.sendBubble("You don't have enough room for all of that!", 10000, pc);
					//log.info(this+' putting back: '+stack+', count: '+stack.count);
					this.addItemStack(stack);
					//log.info(this+" contents is "+this.getContents()[0].count);
					break;
				}

				remaining -= count;
			}

			apiLogAction('SDB_REMOVE', 'pc='+pc.tsid, 'sdb_tsid='+this.tsid, 'stack_tsids='+removed_tsids, 'class_id='+this.class_type, 'count='+removed_total);

			if (this.is_selling) this.broadcastStoreConfig();
			if (this.is_selling && this.sale_price) this.triggerUpdateCallback();
			if (!this.checkEmpty()) this.broadcastConfig();

			return true;
		}

		var contents = this.getFlatContents();
		for (var i in contents){
			if (!pc.addItemStack(contents[i])){
				if (this.isBagEmpty()){
					//if (!this.previous_class_type) this.previous_class_type = this.class_type;
					delete this.class_type;
				}
				this.broadcastConfig();
				return true;
			}
		}

		return false;
	}
};

verbs.purchase = { // defined by bag_furniture_sdb
	"name"				: "purchase",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 62,
	"tooltip"			: "Buy some of it",
	"is_drop_target"		: false,
	"disable_proximity"		: true,
	"conditions"			: function(pc, drop_stack){

		var sell_to_owner = intval(this.getInstanceProp('sell_to_owner'));
		if (this.getContainerType() == 'street' && this.container.pols_is_pol() && this.container.pols_is_owner(pc) && !sell_to_owner) return {state: null};
		if (this.isSelling()) return {state:'enabled'};
		if (this.isForSale(pc)) return {state: 'disabled'};
		return {state:'disabled', reason:'Items not for sale!'};
	},
	"handler"			: function(pc, msg, suppress_activity){

		var out = {
			type: 'store_start',
			item_class: this.class_id,
			item_tsid: this.tsid,
			verb: 'purchase',
			store: this.getStoreInfo()
		};
			
		pc.apiSendMsgAsIs(out);
	}
};

verbs.deposit = { // defined by bag_furniture_sdb
	"name"				: "deposit",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: true,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 63,
	"tooltip"			: "Add an item",
	"is_drop_target"		: true,
	"drop_many"			: true,
	"drop_tip"			: "Deposit",
	"drop_ok_code"			: function(stack, pc){

		if (!stack.takeable_pickup) return false;

		var ret = stack.takeable_drop_conditions(pc);
		if (ret.state != 'enabled') return false;

		if (stack.is_bag || stack.is_trophy || stack.has_parent('furniture_base') || stack.hasTag('no_bag')) return false;

		if (!this.class_type || this.class_type == stack.class_tsid) return true;

		return false;
	},
	"disable_proximity"		: true,
	"conditions"			: function(pc, drop_stack){

		if (this.getContainerType() == 'street' && this.container.pols_is_pol() && !this.container.pols_is_owner(pc)) return {state: null};

		if (this.class_type && !drop_stack && this.countContents() && !pc.countItemClass(this.class_type) && !pc.location.countItemClass(this.class_type)){
			var it = this.findFirst(this.class_type);
			if (!it){
				var contents = this.getAllContents();
				for (var i in contents){
					it = contents[i];
					if (it) break;
				}
				
				if (it) this.class_type = it.class_tsid;
				if (!it){
					delete this.class_type;
					this.setAndBroadcastState('empty');
				}
				this.broadcastConfig();
			}
			if (it) return {state:'disabled', reason: "You don't have anymore "+it.name_plural+"."};
		}
		else if (this.class_type && !this.countContents()){
			delete this.class_type;
			this.setAndBroadcastState('empty');
			this.broadcastConfig();
		}

		if (this.isForSale()) return {state:'disabled', reason: "You can't add items while it's for sale."};

		return {state:'enabled'};
	},
	"requires_target_item_count"	: true,
	"choices_are_stacks"	: false,
	"valid_items"		: function(pc){

		var uniques = {};
		var items = pc.apiGetAllItems();
		for (var i in items){
			var it = items[i];
			if (it.takeable_pickup && !it.is_bag&& !it.is_trophy && (!this.class_type || this.class_type == it.class_tsid)){
				var ret = it.takeable_drop_conditions(pc);
				if (ret.state == 'enabled') uniques[it.class_tsid] = it.tsid;
			}
		}

		items = pc.location.getItems();
		for (var i in items){
			var it = items[i];
			if (it.takeable_pickup && !it.is_bag && !it.is_trophy && (!this.class_type || this.class_type == it.class_tsid)){
				var ret = it.takeable_pickup_conditions(pc);
				if (ret.state == 'enabled') uniques[it.class_tsid] = it.tsid;
			}
		}

		var possibles = [];
		for (var i in uniques){
			possibles.push(i);
		}

		if (possibles.length){
			return {
				'ok' : 1,
				'choices' : possibles,
			};
		}else{
			pc.sendActivity("You don't have anything that can go in here");
			return {
				'ok' : 0,
				'txt' : "You don't have anything that can go in here",
			};
		}
	},
	"handler"			: function(pc, msg, suppress_activity){

		var remaining = msg.target_item_class_count;

		if (!(msg.target_item_class || msg.target_itemstack_tsid)) return false;

		var added_total = 0;
		var added_tsids = [];

		if (msg.target_item_class){
			if (msg.target_itemstack_tsid){
				var stack = pc.location.apiLockStack(msg.target_itemstack_tsid);
				if (stack){
					if (remaining < stack.count){
						stack.apiPutBack();
						var new_stack = stack.apiSplit(remaining);
						stack = new_stack;
					}
				} else {
					stack = pc.removeItemStackTsid(msg.target_itemstack_tsid, remaining);
				}
				if (stack){
					var count = stack.count;
					added_total += count;
					added_tsids.push(stack.tsid);
					if (this.addItemStack(stack)){
						added_total -= stack.count;
						this.sendBubble("I'm full!", 10000, pc);
						pc.items_put_back(stack);
					}

					remaining -= count;
				}
			}

			if (remaining){
				var stacks = pc.apiInventoryGetItems(msg.target_item_class, remaining);

				for (var i in stacks){
					var stack = pc.removeItemStack(stacks[i].path, remaining);

					var count = stack.count;
					added_total += count;
					added_tsids.push(stack.tsid);

					if (this.addItemStack(stack)){
						added_total -= stack.count;
						this.sendBubble("I'm full!", 10000, pc);
						pc.items_put_back(stack);
						break;
					}
					remaining -= count;
					if (remaining < 1) break;
				}
			}
			if (!this.class_type && !this.isBagEmpty()){
				this.class_type = msg.target_item_class;
				//this.previous_class_type = msg.target_item_class;
			}
		} else if (msg.target_itemstack_tsid){
			var stack = pc.location.apiLockStack(msg.target_itemstack_tsid);
			if (!stack) stack = pc.removeItemStackTsid(msg.target_itemstack_tsid, remaining);

			if (stack){
				var count = stack.count;
				added_total += count;
				added_tsids.push(stack.tsid);
				if (this.addItemStack(stack)){
					added_total -= stack.count;
					// send bubble that some of it didn't make it
					this.sendBubble("I'm full!", 10000, pc);
					pc.items_put_back(stack);
				}

				remaining -= count;
			}
		}	

		if (added_total) apiLogAction('SDB_DEPOSIT', 'pc='+pc.tsid, 'sdb_tsid='+this.tsid, 'stack_tsids='+added_tsids, 'class_id='+this.class_type, 'count='+added_total);

		//if (remaining) this.sendBubble("Could not add all "+msg.target_item_class_count, 5000, pc);

		this.broadcastConfig();
		this.setAndBroadcastState('full');
		if (this.is_selling){
			this.broadcastStoreConfig();
			if (this.isSelling()) this.triggerUpdateCallback();
		}

		return true;
	}
};

verbs.collect_currants = { // defined by bag_furniture_sdb
	"name"				: "collect currants",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 64,
	"tooltip"			: "Receive the money collected",
	"get_tooltip"			: function(pc, verb, effects){

		if (this.income <= 0){
			return verb.tooltip;
		}
		else{
			return verb.tooltip + ': '+pluralize(this.income, 'currant', 'currants');
		}
	},
	"is_drop_target"		: false,
	"disable_proximity"		: true,
	"conditions"			: function(pc, drop_stack){

		if (this.getContainerType() == 'street' && this.container.pols_is_pol() && !this.container.pols_is_owner(pc)) return {state: null};
		if (!this.canVend()) return {state: null};
		if (!this.income || this.income <= 0) return {state:'disabled', reason: "There's nothing to collect."}
		return {state:'enabled'};
	},
	"handler"			: function(pc, msg, suppress_activity){

		pc.stats_add_currants(intval(this.income), {type: 'sdb_collection', tsid: this.tsid});
		if (this.previous_class_type || this.class_type){
			var proto;
			if (this.previous_class_type){
				proto = apiFindItemPrototype(this.previous_class_type);
				delete this.previous_class_type;
			}
			else{
				proto = apiFindItemPrototype(this.class_type);
			}

			if (proto){
				pc.sendActivity("You collected "+pluralize(this.income, "currant", "currants")+" from a Storage Display Box for selling "+proto.name_plural+".");
			}
			else{
				pc.sendActivity("You collected "+pluralize(this.income, "currant", "currants")+" from a Storage Display Box.");
			}
		}
		else{
			pc.sendActivity("You collected "+pluralize(this.income, "currant", "currants")+" from a Storage Display Box.");
		}
		this.income = 0;

		this.broadcastConfig();

		return true;
	}
};

function broadcastStoreConfig(){ // defined by bag_furniture_sdb
	if (this.isForSale()) return this.parent_broadcastStoreConfig();
	var store_info = this.getStoreInfo();
	this.container.apiSendMsg({
		type: 'store_changed',
		item_class: this.class_id,
		item_tsid: this.tsid,
		store: store_info
	});
}

function canContain(stack){ // defined by bag_furniture_sdb
	return stack.hasTag('no_bag') ? 0  : stack.getProp('count');
}

function canPickup(pc){ // defined by bag_furniture_sdb
	if (this.getContainerType() == 'street' && this.container.pols_is_pol() && !this.container.pols_is_owner(pc)) return {ok: 0};
	if (this.countContents()) return {ok: 0, error: "You must empty the SDB first."};
	if (this.income && this.income > 0) return {ok: 0, error: "The currants must be collected from this SDB first."};
	return {ok: 1};
}

function canSell(pc){ // defined by bag_furniture_sdb
	if (!this.parent_canSell(pc)) return false;
	return this.countContents() ? false : true;
}

function canVend(){ // defined by bag_furniture_sdb
	if (this.isForSale()) return false;
	return true;
	//return config.is_dev;
}

function checkEmpty(){ // defined by bag_furniture_sdb
	if (!this.countContents()){
		if (this.is_selling && (!this.previous_class_type || this.previous_class_type != this.class_type)) this.previous_class_type = this.class_type;
		delete this.class_type;
		this.is_selling = false;
		this.setAndBroadcastState('empty');
		this.broadcastConfig();
		return true;
	}

	return false;
}

function getExtraConfig(ret){ // defined by bag_furniture_sdb
	ret = this.parent_getExtraConfig(ret);

	var owner = (this.getContainerType() == 'street') ? this.container.pols_get_owner() : null;

	var prev_class_type = this.previous_class_type;

	var item_sd = {
		uid: 'display_box_item_'+this.tsid,
		item_class: null,
		type: 'sdb_item_class'
	}

	if (this.class_type) {
		item_sd.item_class = this.class_type;
		item_sd.state = 'iconic';
		item_sd.item_count = this.countItemClass(this.class_type);
		item_sd.delta_x = 0;
		item_sd.delta_y = -26;
		item_sd.width = 34;
		item_sd.center_view = true;
		item_sd.fade_out_sec = 0;
	} else if (prev_class_type) {
		//item_sd.for_pc_tsid = (owner) ? owner.tsid : null;
		item_sd.opacity = .4;
		item_sd.item_class = prev_class_type;
		item_sd.state = 'iconic';
		item_sd.item_count = 0;
		item_sd.delta_x = 0;
		item_sd.delta_y = -26;
		item_sd.width = 34;
		item_sd.center_view = true;
		item_sd.fade_out_sec = 0;
	}

	var cost_sd = {
		type: 'sdb_cost',
		uid: 'display_box_cost_'+this.tsid,
		is_selling: this.isSelling()
	}

	if (this.isSelling()) {
		cost_sd.sale_price = this.sale_price;
		cost_sd.delta_y = -55;
		cost_sd.h_flipped = intval(this.getInstanceProp('facing_right')) != 1;
	}

	// Ideally we'd pass the pc we're building this config for, and not include income in the
	// messaging except if it is the owner. But for now, we only show the info in client to for_pc_tsid

	var collect_sd = {
		type: 'sdb_collect',
		uid: 'display_box_collect_'+this.tsid,
		for_pc_tsid: (owner) ? owner.tsid : null
	}

	if (this.income && owner) {
		collect_sd.income = (this.income) ? 1 : 0; // so we do not reveal the actual amount
		collect_sd.delta_x = -16;
		collect_sd.delta_y = -6;
		collect_sd.h_flipped = intval(this.getInstanceProp('facing_right')) != 1;
	}

	var special_display = [item_sd, cost_sd, collect_sd];

	// order of array governs z depth of special displays
	if (ret.special_display) {
		ret.special_display = ret.special_display.concat(special_display);
	} else {
		ret.special_display = special_display;
	}

	return ret;



	/*
	// BELOW IS THE OLD WAY THAT I WANT TO LEAVE HERE FOR REFERENCE

	// this special display will get placed on the itemstack's x/y + delta_x/delta_y 
	// if center_view:false, then the origin of the special display will be its bottom center
	// if center_view:true, then the origin of the special display will be its center
	var back_sd = {
		uid: 'display_box_back_'+this.tsid,
		item_class: null
		
	}

	var tool_sd = {
		uid: 'display_box_item_'+this.tsid,
		item_class: null
	}

	if (this.class_type) {
		back_sd.item_class = 'bag_furniture_sdb';
		back_sd.furniture = ret.furniture;
		back_sd.state = 'back';
		back_sd.delta_y = 0;
		back_sd.delta_x = 0;
		back_sd.under_itemstack = true;
		back_sd.fade_out_sec = 0;
		back_sd.fade_in_sec = 0;
		back_sd.state_triggers = ['full'];
		
		tool_sd.item_class = this.class_type;
		tool_sd.state = 'iconic';
		tool_sd.item_count = this.countItemClass(this.class_type);
		tool_sd.delta_x = 0;
		tool_sd.delta_y = -23;
		tool_sd.width = 34;
		tool_sd.under_itemstack = true;
		tool_sd.center_view = true;
		tool_sd.fade_out_sec = 0;
		tool_sd.state_triggers = ['full'];
	}


	// order of array governs z depth of special displays
	ret.special_display = [back_sd, tool_sd];

	return ret;
	*/
}

function getFurnitureBaseGeo(){ // defined by bag_furniture_sdb
	//
	// this code generated by the furniture plat editor - do not overwrite!
	//

	return { 'plats': null,
	         'walls': null
	};
}

function getStoreInfo(){ // defined by bag_furniture_sdb
	if (this.isForSale()) return this.parent_getStoreInfo();
	var rsp = {
		name : "SDB",
		buy_multiplier : 0.0,
		items: []
	};

	if (this.is_selling && this.sale_price && this.countContents()){
		rsp.items = [
			{
				class_tsid: this.class_type,
				cost: this.sale_price,
				count: this.countItemClass(this.class_type)
			}
		];
	}

	return rsp;
}

function isSelectable(pc){ // defined by bag_furniture_sdb
	if (!pc) return true;
	if (!this.isOnGround()) return true;
	if (!this.container.pols_is_pol()) return true;

	return this.container.pols_is_owner(pc);
}

function isSelling(){ // defined by bag_furniture_sdb
	return this.countContents() && this.is_selling && this.sale_price;
}

function onCreate(){ // defined by bag_furniture_sdb
	this.initInstanceProps();
	this.setAndBroadcastState('empty');
}

function onInputBoxResponse(pc, uid, value){ // defined by bag_furniture_sdb
	if (uid == 'set_sale_price') return this.parent_onInputBoxResponse(pc, uid, value);

	if (this.getContainerType() == 'street' && this.container.pols_is_pol() && !this.container.pols_is_owner(pc)) return false;
	if (!this.countContents()) return false;
	if (!this.canVend()) return false;

	value = intval(value.substr(0,7).replace(/[^0-9 ]/gi,''));

	if (uid == 'set_selling_price'){
		if (value && value > 0){
			this.sale_price = value;
			this.is_selling = true;
		}
		else{
			this.is_selling = false;
		}

		this.triggerUpdateCallback();
		
		this.broadcastConfig();
		this.broadcastStoreConfig();
	}

	return true;
}

function onLoad(){ // defined by bag_furniture_sdb
	this.onPrototypeChanged();
}

function onPrototypeChanged(){ // defined by bag_furniture_sdb
	if (this.class_type == 'pumpkin_carved_1' || 
	    this.class_type == 'pumpkin_carved_2' ||
	    this.class_type == 'pumpkin_carved_3' ||
	    this.class_type == 'pumpkin_carved_4' ||
	    this.class_type == 'pumpkin_carved_5' ||
	    this.class_type == 'pumpkin_lit_1' ||
	    this.class_type == 'pumpkin_lit_2' ||
	    this.class_type == 'pumpkin_lit_3' ||
	    this.class_type == 'pumpkin_lit_4' ||
	    this.class_type == 'pumpkin_lit_5'){

		if (this.items){
			for (var i in this.items){
				this.class_type = this.items[i].class_tsid;
				this.broadcastConfig();
				break;
			}
		}
	}
}

function onPumpkinRot(tsid, new_class, num){ // defined by bag_furniture_sdb
	this.class_type = new_class;
	this.broadcastConfig();
}

function sellItem(pc, msg){ // defined by bag_furniture_sdb
	if (this.isForSale()) return this.parent_sellItem(pc, msg);

	if (!this.isSelling()){
		log.info("not selling");
		return pc.apiSendMsg(make_fail_rsp(msg, 0, "Oops, that store is no longer selling."));
	}

	//
	// check the count looks ok
	//

	var count = intval(msg.count);

	if (count <= 0){
		log.info("positive counts only");
		return pc.apiSendMsg(make_fail_rsp(msg, 0, "You can't buy a negative/zero amount of things!"));
	}

	var store_info = this.getStoreInfo();
	if (!store_info || !store_info.items){
		log.info("no store info");
		return pc.apiSendMsg(make_fail_rsp(msg, 0, "Oops, something went wrong with that store."));
	}


	//
	// check that the store sells this item
	//

	var store_items = [];
	for (var i in store_info.items){
		var it = store_info.items[i];
		if (it.class_tsid == msg.class_tsid){
			if (count < it.count){
				it.count = count;
			}
			else{
				count = it.count;
			}
			store_items.push(it);
			break;
		}
	}
	//log.info(store_items);
	var item_proto = apiFindItemPrototype(msg.class_tsid);

	if (!num_keys(store_items)){
		log.info("store doesn't sell that item");
		return pc.apiSendMsg(make_fail_rsp(msg, 0, "Sorry, the store no longer sells that item."));
	}


	//
	// check that we have enough money
	//

	var total_cost = 0;
	for (var i in store_items){
		total_cost += (store_items[i].cost * store_items[i].count);
	}
	//log.info('total cost: '+total_cost);

	if (msg.price){
		var expected_price = intval(msg.price) * count;
		if (expected_price != total_cost){
			log.info("price mismatch: "+expected_price+" vs "+total_cost);
			return this.apiSendMsg(make_fail_rsp(msg, 0, "Oops, the price appears to have changed underneath you. Please try your purchase again."));
		}
	}
	else{
		msg.price = store_items[0].cost;
	}

	if (!pc.stats_has_currants(total_cost)){
		log.info("you don't have enough money");
		pc.sendActivity("Sorry, you can't afford that.");
		return pc.apiSendMsg(make_fail_rsp(msg, 0, "Sorry, you can't afford that."));
	}


	//
	// give them the item
	//

	msg.target_item_class_count = count;
	msg.target_item_class = msg.class_tsid;
	var start_inventory = this.countItemClass(this.class_type);
	if (!this.verbs.remove.handler.call(this, pc, msg, true)){
		log.info("could not remove");
		return pc.apiSendMsg(make_fail_rsp(msg, 0, "I couldn't sell you that thing, because I couldn't find it :/"));
	}

	var end_inventory = this.countItemClass(this.class_type);
	var amount_sold = start_inventory - end_inventory;

	//
	// Charge them
	//

	if (amount_sold > 0) { // don't charge them if the sale is going to fail

		pc.announce_sound('PURCHASE_ITEM');

		total_cost = intval(msg.price) * amount_sold;
		//log.info('total cost 2: '+total_cost);
		
		pc.stats_remove_currants(total_cost, {type: 'store_buy', class_id: msg.class_tsid, store:'item_'+this.tsid, count: count});

		if (!this.income || this.income < 0) this.income = 0;
		this.income += total_cost;
			
		if (total_cost >= 1009){
			pc.achievements_grant('big_spender');
		}
		
		if (total_cost >= 2003){
			pc.achievements_grant('el_big_spenderino');
		}
		
		if (total_cost >= 5003){
			pc.achievements_grant('moneybags_magoo');
		}

		this.triggerUpdateCallback();
		this.addCallbackQueue('sale', {
			'seller_tsid': this.container.pols_get_owner().tsid,
			'buyer_tsid': pc.tsid,
			'item_class_tsid': msg.class_tsid,
			'qty': amount_sold,
			'total_price': total_cost
		});
	}

	var stack_proto = apiFindItemPrototype(msg.class_tsid);
	if (stack_proto && stack_proto.onSell){
		stack_proto.onSell(this.container.pols_get_owner(), {count: amount_sold});
	}

	return pc.apiSendMsg(make_ok_rsp(msg));
}

// global block from bag_furniture_sdb
var is_pack = 0;
var capacity = 1000;

function getUserConfig(){ // defined by furniture_base
	return this.getInstanceProp('user_config');
}

function isForSale(){ // defined by furniture_base
	return this.is_for_sale && this.sale_price;
}

function parent_broadcastStoreConfig(){ // defined by furniture_base
	var store_info = this.getStoreInfo();
	this.container.apiSendMsg({
		type: 'store_changed',
		item_class: this.class_id,
		item_tsid: this.tsid,
		store: store_info
	});
}

function parent_canSell(pc){ // defined by furniture_base
	if (this.class_tsid == 'furniture_chassis') return false;
	if (this.class_tsid == 'furniture_tower_chassis') return false;
	if (this.class_tsid == 'furniture_door') return false;
	return true;
}

function parent_getExtraConfig(ret){ // defined by furniture_base
	var tag_sd = {
		type: 'furn_price_tag',
		uid: 'furn_price_tag_'+this.tsid
	}

	if (this.isForSale()) {
		tag_sd.sale_price = this.sale_price;
		tag_sd.h_flipped = intval(this.getInstanceProp('facing_right')) != 1;
	}

	// order of array governs z depth of special displays
	ret.special_display = [tag_sd];

	return ret;
}

function parent_getStoreInfo(){ // defined by furniture_base
	var upgrades = this.getUpgrades(null);
	var its_upgrades;

	for (var i in upgrades){
		var up = upgrades[i];
		if (!up) continue;
		//if (!up.credits_cost) continue; // 0==free, and we don't count that as an upgrade when we tell the user about it

		if (this.hasUpgrade(i)) { 
			if (!its_upgrades) its_upgrades = []; // lazy creation
			its_upgrades.push({
				id: i,
				label: up.name,
				credits: intval(up.credits_cost), // 0==free
				imagination: intval(up.imagination_cost),
				subscriber_only: intval(up.subscriber_only),
				is_visible: up.is_visible ? true : false,
				is_new: !!up.is_new,
				config: {
					swf_url: up.swf,
					config: up.config
				},
				thumb_40: up.thumb_40
				//temp: up
			});
		}
	}

	var rsp = {
		name : "Buying "+this.label,
		buy_multiplier : 0.0,
		items: [],
		is_single_furniture: true,
		single_furniture_upgrades: its_upgrades,
		single_stack_tsid: this.tsid
	};

	if (this.is_for_sale && this.sale_price){
		rsp.items = [
			{
				class_tsid: this.class_tsid,
				cost: this.sale_price,
				count: 1
			}
		];
	}

	return rsp;
}

function parent_onInputBoxResponse(pc, uid, value){ // defined by furniture_base
	if (this.getContainerType() == 'street' && this.container.pols_is_pol() && !this.container.pols_is_owner(pc)) return false;
	if (!this.canSell(pc)) return false;

	if (value === '') return true;

	value = intval(value.substr(0,6).replace(/[^0-9 ]/gi,''));

	if (uid == 'set_sale_price'){
		if (value && value > 0){
			this.sale_price = value;
			this.is_for_sale = true;
		}
		else{
			this.is_for_sale = false;
		}

		this.triggerUpdateCallback('furniture');
		
		this.broadcastConfig();
		this.broadcastStoreConfig();
	}

	return true;
}

function parent_sellItem(pc, msg){ // defined by furniture_base
	if (!this.isForSale()){
		log.info("not selling");
		return pc.apiSendMsg(make_fail_rsp(msg, 0, "That store is no longer selling."));
	}

	//
	// check the count looks ok
	//

	var count = intval(msg.count);

	if (count <= 0){
		log.info("positive counts only");
		return pc.apiSendMsg(make_fail_rsp(msg, 0, "You can't buy a negative/zero amount of things!"));
	}

	var store_info = this.getStoreInfo();
	if (!store_info || !store_info.items){
		log.info("no store info");
		return pc.apiSendMsg(make_fail_rsp(msg, 0, "Oops, something is wrong with that store."));
	}


	//
	// check that the store sells this item
	//

	var store_items = [];
	for (var i in store_info.items){
		var it = store_info.items[i];
		if (it.class_tsid == msg.class_tsid){
			if (count < it.count){
				it.count = count;
			}
			else{
				count = it.count;
			}
			store_items.push(it);
			break;
		}
	}
	//log.info(store_items);
	var item_proto = apiFindItemPrototype(msg.class_tsid);

	if (!num_keys(store_items)){
		log.info("store doesn't sell that item");
		return pc.apiSendMsg(make_fail_rsp(msg, 0, "This store no longer sells that item."));
	}


	//
	// check that we have enough money
	//

	var total_cost = 0;
	for (var i in store_items){
		total_cost += (store_items[i].cost * store_items[i].count);
	}
	//log.info('total cost: '+total_cost);

	if (msg.price){
		var expected_price = intval(msg.price) * count;
		if (expected_price != total_cost){
			log.info("price mismatch: "+expected_price+" vs "+total_cost);
			return this.apiSendMsg(make_fail_rsp(msg, 0, "Oops, the price appears to have changed underneath you. Please try your purchase again."));
		}
	}
	else{
		msg.price = store_items[0].cost;
	}

	if (!pc.stats_has_currants(total_cost)){
		log.info("you don't have enough money");
		pc.sendActivity("Sorry, you can't afford that.");
		return pc.apiSendMsg(make_fail_rsp(msg, 0, "Sorry, you can't afford that."));
	}

	//
	// Charge them
	//

	var owner = this.container.pols_get_owner();
	if (!owner){
		log.info("No owner");
		return pc.apiSendMsg(make_fail_rsp(msg, 0, "I can't sell you that thing, since I can't find the owner of this location."));
	}

	this.is_for_sale = 0;
	this.broadcastStoreConfig();
	pc.announce_sound('PURCHASE_ITEM');

	total_cost = intval(msg.price) * count;
		
	pc.stats_remove_currants(total_cost, {type: 'store_buy', class_id: msg.class_tsid, store:'item_'+this.tsid, count: count});
	owner.prompts_add_simple(pc.linkifyLabel()+' just bought your '+this.getLabel()+' for '+pluralize(total_cost, 'currant', 'currants')+'.');

	// Do something with the money
	var pile = this.container.createAndReturnItem('pile_of_currants', 1, this.x, pc.y, 50, owner.tsid);
	if (pile){
		pile.setInstanceProp('balance', total_cost);
		pile.setInstanceProp('source', pc.linkifyLabel()+' purchasing your '+this.getLabel());
	}

	if (total_cost >= 1009){
		pc.achievements_grant('big_spender');
	}
		
	if (total_cost >= 2003){
		pc.achievements_grant('el_big_spenderino');
	}
		
	if (total_cost >= 5003){
		pc.achievements_grant('moneybags_magoo');
	}

	this.triggerUpdateCallback('furniture');
	this.addCallbackQueue('furniture_sale', {
		'seller_tsid': this.container.pols_get_owner().tsid,
		'buyer_tsid': pc.tsid,
		'item_class_tsid': msg.class_tsid,
		'total_price': total_cost
	});

	delete this.z;
	pc.location.geo_remove_plats_by_source(this.tsid);
	pc.addItemStack(this);

	return pc.apiSendMsg(make_ok_rsp(msg));
}

function getDescExtras(pc){
	var out = [];

	// automatically generated source information...
	out.push([2, "This can be made with a <a href=\"\/items\/751\/\" glitch=\"item|construction_tool\">Construction Tool<\/a>."]);
	if (pc && !pc.skills_has("furnituremaking_1")) out.push([2, "You need to learn <a href=\"\/skills\/99\/\" glitch=\"skill|furnituremaking_1\">Furnituremaking I<\/a> to use a <a href=\"\/items\/751\/\" glitch=\"item|construction_tool\">Construction Tool<\/a>."]);
	if (pc && !(pc.skills_has("engineering_1") && pc.skills_has("furnituremaking_2"))) out.push([2, "The recipe for this will become available after you learn <a href=\"\/skills\/92\/\" glitch=\"skill|engineering_1\">Engineering I<\/a> and <a href=\"\/skills\/100\/\" glitch=\"skill|furnituremaking_2\">Furnituremaking II<\/a>."]);
	return out;
}

var tags = [
	"no_rube",
	"furniture",
	"furniture_interactable"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-32,"y":-58,"w":64,"h":73},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAJ0UlEQVR42rWZC1BU5xXHtTbGpmke\n47TJpA+bZjJtp9Nm2kmntsmoY2q0Nq0ZjCnFKmpQIRIVERRR3g9FEQUiUJCXyi7v98KysCzIy2UF\nVl7C8gYB4wM1Pho7ndPvf\/buldeCTZWZ\/9y5d+9+93fP+Z\/zfd8yZ87sf98QekHo+0KvS\/rJ\/ynL\nOK8JPS80d87X\/VNneS9fu+b3RX+zeffiX1b9pmmHw0pjgKedMdjH3qrs7d4zbrBdyvLcu47v99m3\nTpaX21qj0+b3jHbrlhg22i5RJsfuff1\/BqMHbYta66ISchWeFBqwifZ8+icK8V1PJwLtKPLIBgr0\nXDtB4cHmz4752rKO+\/+dTh3dRKcjnKZV3MntdMTHjqLCnClX4TvWeyl6jafr6kWzgnV0DL3V257v\n3dWUMDbQmkCabE8qyTpAtZpgqtEck2WoiJTVWhdJuHc61ZWGkDrrIOWccxVjhJC+PEweo0J1mGKO\nf0IZyQeor1VB51V+vUmRDmuswtXVNSZoNDpSpKRScVYQhYdso0LlXjLowqjDEGNVpoZY6m+Jn1a9\nxhjqboicoLbao9SuDye99hhVFgWLIHhTgOfHpNXkkq6sgEymwaXTAmZnF5BCkUHx8WcEnBO5Oa+m\n7OSdpMvzIH2pP7XWhk1QXYkfNeiCWPWlflSn9poifNei4rS9U5R6egcFHfyIDgceoszMPMrNVVFJ\niS5hWsC0tOzGuLgkiow4RZ77dtCW9UvI2eGPtHPbCpb3\/vUU6L3licnb7UPh7VU8ttcBZ0pKSqGE\nhLOUkZGXPS1gdXXDosKscMpLDaY9Tu\/Tto3L6KQwf1KMOxn1GdTVqiZTS\/GM6mpRy5rpvuZGHXW2\nN1CzXkFNFf4UfsSRoqPjKDkxnuqrc6370GQ4yR5JjHQgx03LSZV+iDpaL5BaraX09Bwy1quorSF3\nnPLoclMBdRhV1HmpiEzNxbI6m4uo45KKP29vzJO\/U63L4VSKjFFlWTpp84MoVFR9VVEA2+Zab8pS\nq4B9xmgCZMo\/nTj8kcecqEpXQGfPpnIKSgqT5AfhwQwlotXdqqGe9jIhLfVe1vIR591tGhHNEr7v\nsrGQv6ctSadz59J4vLSUKEqKcpEB4ef+lhh7q4CIHipNI1qL+2erKSxoKzXU5lBsbDxFR8WQpiCa\no9YhHsZgbaUM1Neho35TJQ10nX8kcd7fWSE+L+f7cD8i3d5YIMBO0ZmEUKrRxlPiqV0UJnooAFFs\nHfVh3jOmGIDqTA8ZEG\/dLDzYVKukFkOWDIcIAQwwQ901dKW3job7LsjC+VBPjfi8ikER1a7WEk47\nXtKSCQDGnthCNepArnxjhf\/sgDXFvhMA5bSOg8NDB7urGWSkv56uDl6kL4YahBr5iPPRgXqGxQv0\nd1ZytJHyDindFsDT4Z+QofzI7ICWFFcWeE0BbG\/MF8Yv5nT1SXB4+KgAuXalia6PXKIboy10UwjH\nGyPNfB2gw316CbKCXw5F1N6UPwXwfKHnzIAwKQDLcg5OAcRbI0XwFNIGODz82rCRoW5da6fb1zuE\nOvl469plunm1la4PXxL3NfD9eCnYAkUFP04GLEpz\/bqAeVyJiB6iMNRTy+lDhAABoC9vdtHdsR66\ne8ssnOM6PsdLjA4YhB1quZgQRWQDWbEAVgtbAfCC2ss6IKpoOkAMhLTA6AOm8zQsfIeoII2IFGDu\n3eqlB3cG6MGXg0IDdO92nwx5Y7SZfclRFNGHF+FltKrJgBX5+60DwqTTAWIgDIj0DnJ69VwMSC1S\niogB6qt7w\/TwwSh9dX+YQXH9zo1OcxRFtFFM5jSXs11QdBbAC5pAnvsfC7A022MKIKqvVwyMB4z0\n6+X0AoCjd3eQ4f7z8Dr9Wxz\/dXeIo3jnhonGvmiTAVEs8OFkQHgQE0ShYvfsgIXKPTNGcAQRvNIo\n+W9cBEXkAPfw\/ghHEOAAHB\/BIalQJgMOiOWZMu5TSk9wnhlQdHIO9QQPipZgBtRyY+YKFp6Ct2QP\nimgBCpHD8T48ONYtebCFLQFrmD1YPsWDFYX+VJzuRopYR+uANUUHebEwBVBM9pj8zQ26kq5wFRvM\nLUaKIlexiOS9270cOYYT6Ud6r6OKRUtCUx+Qqtg0qYo\/D7HndWd57n4fa3xzEUEsfyYDPuqDGja4\npUmjktHnLK0GfkRKccQ5w4kGjgoe4WYt9UGxiDBPeY\/6YLyQJstd+N\/dzxrgvJkAH7Ua8zQHs+Oh\ngEQkkW6Ajl1t4yPSisjBCuy9nkc90JLe8YAFClf2oF7j5W8NcD4A9RpvBtztuHLKXMxRRDULL+Jh\ngOTpTqQbICgcFAOEqOE6T3NYNJgq2Xu8YDCqJszFWWgvBT6Uc3YXCZsFWQN8Tpuzr1+T6c6AWIoD\nsLk+hwx1pWSoLRKrmWxOjXnK05oXDML08CRAEVG0IIhXNOI67CAvFIRFMCNdrCvmMRtr02VALLdU\nqaJR53kcsQb4UqFiTzW6OQCxHwHgeV2xvAJua1RxwTCkiKR5yVXOAKhuwAIIwjmiDM\/hPrwU4PCi\nGA8r9HJ1igyoy\/dDgVBppluoNcDvlmW537YAOmxYSod9NlJZSSElJyt4Q6MtipPnZqQb8yke3CMt\nXJFCNHM+XtZKYBr2Lu7Hy12oUvEKHWOmpXxOMWGOlJHoTMUZB6lK5SV2e64nrAG+iu0hmnR+igvZ\n275Lh\/auoeRYL0qMC6FMRSgvWsd7EoXDoJb9CG+YSvgI4TqDSUsrizKVUbyizlEGU3yEg9gDbaX0\nRDdSZ3iQSukSbg3wNUQOvRBRBKC\/hw0d9bWlz7aukOXt\/iEFir3sdBp\/3+MIY+NZ4cH\/YMD8FDcq\nSHGJmBEQlYwvuYgq9t1vQ3nnXMVKY+rG3fJLgckQLm\/gDdpAbrZVYuFp2bxjhaQvDeBVekW+J2\/i\ni8Sm\/XT4dooM2SLDAjAr2ZXK832sAr6C9GLQsux95Lh5+eh2+2UpNh+8rbS1WawURaMU0KmBB9ay\nAjxs0h5HoX62aYe916Xt2\/nn1PHav+sDpYvTytOL337D86O\/\/vYMAKEqlW+JNcCFZ6K3HT8RZBeR\nELE1etk7P3MW11YIrXrKel9oaWjg5hj\/Ax9HZiTt3mMNED9Ufk\/oR0I\/FXpL6HdCfxB65ylqsdCv\nhX4u9GMUqzXABUIvot0I\/UDoDelLvxT61VPUL4TelAIDuJetAT4j9C0pkgulm3\/4hH72nUmLpJ+D\nEZiXhL490+\/RFsjnpZsXSml\/9SnpFQnsZSkwzwk9a3W5NQ7y2XGgL0ipf1r6jgQGi80X+uZMvwJb\nIOdJoPMl2AUS8JPWAmn8ZySwedLzZ\/2zgFpg50kDPGnNGwc1d\/K\/JP4LJ5SlJpZSL60AAAAASUVO\nRK5CYII=",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-07\/bag_furniture_sdb-1343180332.swf",
	admin_props	: true,
	obey_physics	: false,
	in_background	: false,
	in_foreground	: false,
	has_status	: false,
	not_selectable	: false,
};

if (this.consumable_label_single) itemDef.consumable_label_single = this.consumable_label_single;
if (this.consumable_label_plural) itemDef.consumable_label_plural = this.consumable_label_plural;

itemDef.verbs = {
};
itemDef.hasConditionalVerbs = 1;
itemDef.emote_verbs = {
};
itemDef.hasConditionalEmoteVerbs = 0;
itemDef.tags = [
	"no_rube",
	"furniture",
	"furniture_interactable"
];
itemDef.keys_in_location = {
	"p"	: "pickup",
	"u"	: "buy",
	"c"	: "change_style",
	"o"	: "collect_currants",
	"e"	: "deposit",
	"n"	: "dont_sell",
	"t"	: "edit_sale_price",
	"h"	: "edit_selling_price",
	"j"	: "flip",
	"k"	: "purchase",
	"v"	: "remove",
	"q"	: "set_sale_price",
	"x"	: "set_selling_price",
	"y"	: "stop_selling",
	"z"	: "upgrade"
};
itemDef.keys_in_pack = {
	"g"	: "give",
	"c"	: "change_style",
	"z"	: "upgrade"
};

log.info("bag_furniture_sdb.js LOADED");

// generated ok 2012-11-02 16:23:28 by tim
