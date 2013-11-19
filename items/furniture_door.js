//#include include/jobs.js, include/furniture.js, include/takeable.js

var label = "Door";
var version = "1345763869";
var name_single = "Door";
var name_plural = "Doors";
var article = "a";
var description = "That which brings you down can also lift you up. This is true of many things, but never more so than in the case of this magical-handled uppy-downy between-floor-device. Or 'Door'.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 2500;
var input_for = [];
var parent_classes = ["furniture_door", "furniture_base"];
var has_instance_props = true;

var classProps = {
	"placement_set"	: "bookshelf",	// defined by furniture_base (overridden by furniture_door)
	"can_flip"	: "0",	// defined by furniture_base (overridden by furniture_door)
	"can_revert_to_base"	: "1",	// defined by furniture_base
	"job_class_id"	: "job_proto_door"	// defined by furniture_door
};

function initInstanceProps(){
	this.instanceProps = {};
	this.instanceProps.upgrade_id = "";	// defined by furniture_base
	this.instanceProps.facing_right = "1";	// defined by furniture_base
	this.instanceProps.user_config = "";	// defined by furniture_base
	this.instanceProps.door_direction = "up";	// defined by furniture_door
}

var instancePropsDef = {
	upgrade_id : ["Which upgrade is applied to this furniture"],
	facing_right : ["Are we facing right?"],
	user_config : ["User customizations"],
	door_direction : ["'up' or 'down'"],
};

var instancePropsChoices = {
	upgrade_id : [""],
	facing_right : [""],
	user_config : [""],
	door_direction : ["up","down"],
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

verbs.replace = { // defined by furniture_door
	"name"				: "replace",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: true,
	"include_target_items_from_location"		: true,
	"is_single"			: 1,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 51,
	"tooltip"			: "Swap doors",
	"is_drop_target"		: true,
	"drop_many"			: false,
	"drop_tip"			: "Swap doors",
	"drop_ok_code"			: function(stack, pc){

		if (config.is_dev) return stack.class_tsid == 'furniture_door' && stack.tsid != this.tsid;
		return stack.class_tsid == 'furniture_door' && stack.tsid != this.tsid && stack.getContainerType() != 'street';
	},
	"disable_proximity"		: true,
	"conditions"			: function(pc, drop_stack){

		if (!pc.houses_is_at_home()) return {state:null};
		if (this.has_job) return {state:null};
		return {state:'enabled'};
	},
	"requires_target_item_count"	: false,
	"choices_are_stacks"	: true,
	"valid_items"		: function(pc){

		var possibles = [];
		var items = pc.furniture_get_bag().apiGetAllItems();
		for (var i in items){
			var it = items[i];
			if (it.class_tsid == 'furniture_door'){
				possibles.push(it.tsid);
			}
		}

		if (config.is_dev){
			items = pc.location.getItems();
			for (var i in items){
				var it = items[i];
				if (it.class_tsid == 'furniture_door'){
					possibles.push(it.tsid);
				}
			}
		}

		if (possibles.length){
			return {
				'ok' : 1,
				'choices' : possibles,
			};
		}else{
			pc.sendActivity("You don't have any other doors.");
			return {
				'ok' : 0,
				'txt' : "You don't have any other doors",
			};
		}
	},
	"handler"			: function(pc, msg, suppress_activity){

		var failed = 0;
		var orig_count = this.count;
		var self_msgs = [];
		var self_effects = [];
		var they_effects = [];

		if (msg.target_itemstack_tsid){
			var door = pc.furniture_get_bag().removeItemStackTsid(msg.target_itemstack_tsid, 1);
			if (door && door.class_tsid == 'furniture_door'){
				door.no_job = true;
				door.setInstanceProp('door_direction', this.getInstanceProp('door_direction'));
				pc.location.apiPutItemIntoPosition(door, this.x, this.y);

				this.reset();
				pc.furniture_get_bag().addItemStack(this);

				pc.location.homes_replace_door(this, door);
			}
			else{
				door = pc.location.apiLockStack(msg.target_itemstack_tsid);
				if (door && door.class_tsid == 'furniture_door' && config.is_dev){
					var our_direction = this.getInstanceProp('door_direction');
					var our_position = [this.x, this.y];

					//////////

					this.setInstanceProp('door_direction', door.getInstanceProp('door_direction'));
					pc.location.apiPutItemIntoPosition(this, door.x, door.y);
					door.setInstanceProp('door_direction', our_direction);
					pc.location.apiPutItemIntoPosition(door, our_position[0], our_position[1]);

					pc.location.homes_replace_door(door, this);
				}
				else{
					failed = 1;
					self_msgs.push("Could not find that door");
				}
			}
		}
		else{
			failed = 1;
			self_msgs.push("You didn't drag pick a door?");
		}

		var pre_msg = this.buildVerbMessage(msg.count, 'replace', 'replaced', failed, self_msgs, self_effects, they_effects);
		if (!suppress_activity && pre_msg) pc.sendActivity(pre_msg);

		return failed ? false : true;
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
	"sort_on"			: 52,
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

verbs.set_sale_price = { // defined by furniture_base
	"name"				: "set sale price",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 52,
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

verbs.upgrade = { // defined by furniture_base
	"name"				: "upgrade",
	"ok_states"			: ["in_location","in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 53,
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

verbs.change_style = { // defined by furniture_base
	"name"				: "change style",
	"ok_states"			: ["in_location","in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 54,
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

verbs.give = { // defined by furniture_base
	"name"				: "give",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: true,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_single"			: 1,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 55,
	"tooltip"			: "Or, drag item to player",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		return this.takeable_give_conditions(pc, drop_stack);
	},
	"handler"			: function(pc, msg, suppress_activity){

		return this.takeable_give(pc, msg);
	}
};

verbs.create = { // defined by furniture_door
	"name"				: "create",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_single"			: 1,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 55,
	"tooltip"			: "Add a floor",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (this.has_job) return {state:'enabled'};

		return {state:null};
	},
	"handler"			: function(pc, msg, suppress_activity){

		this.offerJobs(pc, msg);
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
	"sort_on"			: 58,
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

function canDropAt(loc, x, y){ // defined by furniture_door
	if (!loc.homes_can_add_door(y)) return false;
	return true;
}

function canPickup(pc){ // defined by furniture_door
	if (this.hasInProgressJob(pc) || !this.has_job) return {ok: 0, error: "You can't pick up placed doors."};
	return {ok: 1};
}

function getDefaultUpgradeConfig(){ // defined by furniture_door
	var direction = this.getInstanceProp('door_direction');
	if (!direction) direction = 'up';

	return {
		door: 'door_'+direction+(this.has_job ? '_job' : '')
	};
}

function getUserConfig(){ // defined by furniture_door
	// this will have the door asset to use
	var def_config = this.getDefaultUpgradeConfig();

	// in case we ever have actual user configs for doors
	var user_config = this.getInstanceProp('user_config');

	// no user config? just return the default one
	if (!user_config) return def_config;

	// bad value? just return the default one
	if (typeof user_config === 'string') return def_config;

	// make sure we use the proper door from the default!
	user_config['door'] = def_config['door'];

	return user_config;
}

function onContainerChanged(oldContainer, newContainer){ // defined by furniture_door
	if (!newContainer || !newContainer.pols_is_pol || !newContainer.pols_is_pol()) return;
	if (this.no_job) return;

	if (!this.container.homes_can_add_door(this.y)) return;

	var id = 'proto-'+this.tsid;

	log.info(this+' setting street data');
	this.container.jobs_set_street_info({id: id, type: 1});

	log.info(this+' setting class ids');
	var job_class_ids = {};

	var class_ids = this.getClassProp('job_class_id').split(',');
	var phase = 1;
	for (var i in class_ids){
		var class_id = class_ids[i];
		job_class_ids[class_id] = {in_order : phase, class_id: class_id, delay_seconds: 60};
		phase++;
	}
	this.container.jobs_set_class_ids({ id: id, job_class_ids: job_class_ids});

	if (class_ids[0]) this.updatePlayers(id, class_ids[0]);

	this.has_job = true;
	this.no_post_project_delete = true;
	this.broadcastConfig();
}

function onJobComplete(job){ // defined by furniture_door
	this.container.homes_add_floor_at(this.x, this);
	delete this.has_job;
	this.broadcastConfig();
}

function onPlayerEnter(pc){ // defined by furniture_door
	var jobs = this.getAvailableJobs(pc);
			
	for (var i in jobs.given){
		var qi = jobs.given[i];
		if (qi){
			var status = this.buildJobStatus(pc, qi);
			status.is_update = true;
			status.spirit_id = this.tsid;
		
			return pc.apiSendMsgAsIs(status);
		}
	}

	for (var i in jobs.open){
		var qi = jobs.open[i];
		if (qi){
			var status = this.buildJobStatus(pc, qi);
			status.is_update = true;
			status.spirit_id = this.tsid;
		
			return pc.apiSendMsgAsIs(status);
		}
	}

	for (var i in jobs.delayed){
		var qi = jobs.delayed[i];
		if (qi){
			var status = this.buildJobStatus(pc, qi);
			status.is_update = true;
			status.spirit_id = this.tsid;
		
			return pc.apiSendMsgAsIs(status);
		}
	}
}

function reset(){ // defined by furniture_door
	delete this.has_job;
	delete this.no_post_project_delete;
	delete this.no_job;
	this.setInstanceProp('door_direction', 'up');
}

function broadcastStoreConfig(){ // defined by furniture_base
	var store_info = this.getStoreInfo();
	this.container.apiSendMsg({
		type: 'store_changed',
		item_class: this.class_id,
		item_tsid: this.tsid,
		store: store_info
	});
}

function canSell(pc){ // defined by furniture_base
	if (this.class_tsid == 'furniture_chassis') return false;
	if (this.class_tsid == 'furniture_tower_chassis') return false;
	if (this.class_tsid == 'furniture_door') return false;
	return true;
}

function getExtraConfig(ret){ // defined by furniture_base
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

function getStoreInfo(){ // defined by furniture_base
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

function isForSale(){ // defined by furniture_base
	return this.is_for_sale && this.sale_price;
}

function onInputBoxResponse(pc, uid, value){ // defined by furniture_base
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

function sellItem(pc, msg){ // defined by furniture_base
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

function onCreate(){ // needed for initializing props
	this.initInstanceProps();
}

function parent_getUserConfig(){ // defined by furniture_base
	return this.getInstanceProp('user_config');
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
	"furniture"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-59,"y":-166,"w":117,"h":168},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAG10lEQVR42rWY6VIbRxDH\/TqOjS\/s\nxI7NoQvdgMBgA+ISiBsBknUhCSGuxZYJTlx2KkklqVQqH\/Ipj+CkkvKb5Dkm\/e\/dHtZCONGKbFXX\n9PT0zPy259qdK1cueIpJX0893V\/9bucpy+vC4+oJ5X86jGtbo3y9PVo11gLVU\/L7+XCq+ms9oQX5\nN4WhpvJFJjZ9pdXHSEWqlaRP7Sz0qYOVgDpaC6mTzKAiuzomeb4R1fIyE1MvtgbM\/GY\/+0KOLV\/o\ne8t+VZrzqPyMSxVn3dwupLroV\/XN6DtHgAerIbU48kiNh+6qseC\/yxP\/bfU00PmffCHxyD11uBZW\nxxsRB4BroSrePua5pfp7r6toz7Wm6YCrQ0W6rnLeXtboJ2Iv8z\/8RL3KDjkDxJzDkAHwSd9tNeK9\n2TQdC3aqYXcH58X22HNDjfbdomje0TYR9vOZtrYAv8wNacBpGoqp8N0P0slQJ+uzA\/fVROC2abPK\nJI9y+EEXkfoQAaRhbh0QqwsTH4DJ2H21MPy5TiHzpEOWR7tUPHhH2yGJ\/nu6fN5WR+pxW0MPNGBp\nzts64Dfl0eqr3DBN\/E61\/rRLpca6KH2kNsZ7OE2NdXOannQTUCfbRVZGHuhyqSMCu7QRfHSNAWll\ntw6IfQ1DjNWWm\/GoZ5O9LKJLmp\/1qhR1lp12sw2yNd6lslMuVaAy+BQSPl0mkon30AK7wYCVRX+b\ngLMEM9XLYuquM53ANie6dT4741ZbE12cL8z5dIoy09\/FKXwEcH852DrgL8aMBiwkvBQhFwt0ySPd\niveqbQLYGO9WcdovJ2hVbyKCVnljnczUmV0AD5wsEhxPdsA8IkCNlpJ+GiI362ZHblWc86qV0Yfq\ntECdrYdVOeljH0Q3TUMpgKgDm+gMmKMIrrYJWKQIQbKTPaq8EOBO8zNutm1SBNdoESUGP1MGHXOw\n5fkF3CpEqzT88Kr1Ej5dR3QA7i4FVW054AzwiKLBEaSzE8OIt64Q4LNJF3cAHXtfkc5YRHFvNcx+\nKEvRSh3s7aBN\/AbPOdi3rTkpbQEwTW2dZmPOFgkOeQCiwQJ1AtlZDKoMVibppfk+NU6nhb0MNnwQ\nIB313VLjdD5DF0E0OSXQM8Dh9gBLyT5VTHhYygt+jsJ4kE6LKJ0MdCJI2Q4NF3xz072U+lSMzltE\nELbKYsAsw4tZ7Qmgo6PODgiobRpCCPY97HFLtChgRzSlrLocYhsiuEs6XiRP0wM2lMHHjKSP9UsD\nrFiAZXpzrEDMtyJ1UrEApRxQFQ0Y1OCw7VqA2F7EDkBMH8eA+\/ShCsAd+qgszXs5LSbMVARRQoqt\npbYSYr\/CrEvXkXpShgW0PedhW\/uA9BUMwCrNn0qyj1MAIhXBcNvzZYosvphFh0DfWwmzDiCxXQrg\nSN8d2qsCWgoUAXsek71Gwwl9x\/pF2E6YPvhlgECnzZj10tyZDYCo6xjwcDXIn1uYTyJZWqFIMUQV\n\/FOg87WIHnLkGRA+VA4f6PCBjkUiNgAe02HQ1iIB4MF6hN8Ugi1EdACwvmLq1SU\/C36OxKe6aPqg\nDfHnHzHKXxrg4XqU5lCQJU+AoqNzpBi+nQUaNoogpDzv0T7Ii4\/oUu\/SAI9SUeogxFJJevH1wTqd\nobqsRpFDnqGWBCp0TlAGQRsArKdjzgHxVxfuvk7\/DBF1wBBYCF7WJW+k+q18mCH3CUzSI4q8+EL2\nls0yCPJtA8pPE\/5dIXuIEMnxRr+2GRRB0e0+5v\/umV89H1cnhyX1w1c1hj+0RdBYd\/jTdCHg5oC2\nQUc0JM86LQCOIOBJh\/3b18fKMAz19s3rc4A0D9uLID67IOgcp8vRujnksD0nQCkXaWY7ys0wXDm3\nwW3sW4vE8RB\/vxf\/TQANArLLEYaWUgzhi63Bc+XNbBB8kuEUOUB0rQjiLqe+NdA64I+1+DtcFEXp\no1MugUSwgfP2gPwG5uDZRRE6pDl13r9JHoAGveTLzKAzQGwzoa5rH9xkPbfA6ulBrcNPdPzs48V4\nqMmGvJSLSBkAcbJcOqC+akNn1lWb6Ha7XM01AopEezr4\/8TRHBTAmOemfmMRiR7fBWIBNADKUONF\n4NsMEPWwx74gP+eA1Mhk5NMLIyBD2giIFJGz+zXWNaw5eJIZaC+CuL26CBB23N8YFsBFgE3r0stj\niE\/S\/f8PIDrAaoSIDd+PjYBGk+hJVPl2K4frt+Dvre+DuxN\/fBSQbPUtOodX\/Bq4GaDcVTerD8C3\npSf0ERF83zLgq+zQn2joY4CnfPHj5ygiFUCZm+dWtm2xCSDmYG3Z\/3fLgNTYXxqwYRXLTT7O0xp9\n20G3A9q3IvsQ22EP6KUAKJG\/iOMfIYszGOQmzOkAAAAASUVORK5CYII=",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/furniture_door-1333673263.swf",
	admin_props	: true,
	obey_physics	: false,
	in_background	: true,
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
	"furniture"
];
itemDef.keys_in_location = {
	"p"	: "pickup",
	"u"	: "buy",
	"c"	: "change_style",
	"e"	: "create",
	"o"	: "dont_sell",
	"t"	: "edit_sale_price",
	"h"	: "flip",
	"j"	: "replace",
	"k"	: "set_sale_price",
	"n"	: "upgrade"
};
itemDef.keys_in_pack = {
	"g"	: "give",
	"c"	: "change_style",
	"n"	: "upgrade"
};

log.info("furniture_door.js LOADED");

// generated ok 2012-08-23 16:17:49 by eric
