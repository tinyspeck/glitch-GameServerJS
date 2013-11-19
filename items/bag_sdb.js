//#include include/furniture.js

var label = "Storage Display Box";
var version = "1331922835";
var name_single = "Storage Display Box";
var name_plural = "Storage Display Boxes";
var article = "a";
var description = "";
var is_hidden = false;
var has_info = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 0;
var input_for = [];
var parent_classes = ["bag_sdb", "furniture_base"];
var has_instance_props = true;

var classProps = {
	"placement_set"	: "wall",	// defined by furniture_base (overridden by bag_sdb)
	"can_flip"	: "1",	// defined by furniture_base
	"can_revert_to_base"	: "0"	// defined by furniture_base
};

function initInstanceProps(){
	this.instanceProps = {};
	this.instanceProps.upgrade_id = "";	// defined by furniture_base
	this.instanceProps.facing_right = "1";	// defined by furniture_base
	this.instanceProps.user_config = "";	// defined by furniture_base
}

var instancePropsDef = {
	upgrade_id : ["Which upgrade is applied to this furniture"],
	facing_right : ["Are we facing right?"],
	user_config : ["User customizations"],
};

var verbs = {};

verbs.change_style = { // defined by furniture_base
	"name"				: "change style",
	"ok_states"			: ["in_location","in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 50,
	"tooltip"			: "Change it",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (this.getContainerType() == 'street' && this.container.pols_is_pol() && !this.container.pols_is_owner(pc)) return {state: null};
		if (intval(this.getInstanceProp('upgrade_id')) != 0) return {state:'enabled'};
		return {state:null};
	},
	"handler"			: function(pc, msg, suppress_activity){

		var upgrades = this.getUpgrades();

		var ret = {
			type: "furniture_upgrade_start",
			itemstack_tsid: this.tsid, // the piece of furniture being upgraded
			upgrades: []
		};

		for (var i in upgrades){
			var up = upgrades[i];
			if (!up.is_visible && !pc.is_god) continue;

			ret.upgrades.push({
				id: i,
				label: up.name,
				credits: intval(up.credits_cost), // 0==free
				imagination: intval(up.imagination_cost),
				subscriber_only: intval(up.subscriber_only),
				is_visible: up.is_visible ? true : false,
				config: {
					swf_url: up.swf,
					config: up.config
				}
			});
		}

		pc.apiSendMsg(ret);

		return true;
	}
};

verbs.upgrade = { // defined by furniture_base
	"name"				: "upgrade",
	"ok_states"			: ["in_location","in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 51,
	"tooltip"			: "Change it",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (this.getContainerType() == 'street' && this.container.pols_is_pol() && !this.container.pols_is_owner(pc)) return {state: null};
		if (intval(this.getInstanceProp('upgrade_id')) == 0) return {state:'enabled'};
		return {state:null};
	},
	"handler"			: function(pc, msg, suppress_activity){

		var upgrades = this.getUpgrades();

		var ret = {
			type: "furniture_upgrade_start",
			itemstack_tsid: this.tsid, // the piece of furniture being upgraded
			upgrades: []
		};

		for (var i in upgrades){
			var up = upgrades[i];
			if (!up.is_visible && !pc.is_god) continue;

			ret.upgrades.push({
				id: i,
				label: up.name,
				credits: intval(up.credits_cost), // 0==free
				imagination: intval(up.imagination_cost),
				subscriber_only: intval(up.subscriber_only),
				is_visible: up.is_visible ? true : false,
				config: {
					swf_url: up.swf,
					config: up.config
				}
			});
		}

		pc.apiSendMsg(ret);

		return true;
	}
};

verbs.flip = { // defined by furniture_base
	"name"				: "flip",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"is_single"			: 1,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 52,
	"tooltip"			: "Turn it around",
	"is_drop_target"		: false,
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

		return true;
	}
};

verbs.remove = { // defined by bag_sdb
	"name"				: "remove",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 53,
	"tooltip"			: "Remove an item",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (this.getContainerType() == 'street' && this.container.pols_is_pol() && !this.container.pols_is_owner(pc)) return {state: null};
		if (this.countContents()) return {state:'enabled'};
		return {state:null};
	},
	"handler"			: function(pc, msg, suppress_activity){

		if (msg.target_item_class_count){
			if (msg.target_item_class != this.class_type) return false;

			var remaining = msg.target_item_class_count;
			do {
				var stack = this.removeItemStackClassExact(this.class_type, remaining);
				remaining = remaining - stack.count;		

				if (pc.addItemStack(stack)){
					// send bubble that some of it didn't make it
					this.sendBubble("You don't have enough room for all of that!", 10000, pc);
					stack.apiPutBack();
				}
			} while (remaining);

			if (!this.countContents()) delete this.class_type;
			this.broadcastConfig();
			return true;
		}

		var contents = this.getFlatContents();
		for (var i in contents){
			if (!pc.addItemStack(contents[i])){
				if (this.isBagEmpty()) delete this.class_type;
				this.broadcastConfig();
				return true;
			}
		}

		return false;
	}
};

verbs.deposit = { // defined by bag_sdb
	"name"				: "deposit",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: true,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 54,
	"tooltip"			: "Add an item",
	"is_drop_target"		: true,
	"drop_many"			: true,
	"drop_tip"			: "Deposit",
	"drop_ok_code"			: function(stack, pc){

		if (!stack.has_parent('takeable')) return false;

		var ret = stack.takeable_drop_conditions(pc);
		if (ret.state != 'enabled') return false;

		if (stack.is_bag) return false;

		if (!this.class_type || this.class_type == stack.class_tsid) return true;

		return false;
	},
	"conditions"			: function(pc, drop_stack){

		if (this.getContainerType() == 'street' && this.container.pols_is_pol() && !this.container.pols_is_owner(pc)) return {state: null};

		if (this.class_type && !pc.countItemClass(this.class_type)){
			var it = this.findFirst(this.class_type);
			return {state:'disabled', reason: "You don't have anymore "+it.name_plural+"."};
		}

		return {state:'enabled'};
	},
	"requires_target_item_count"	: true,
	"choices_are_stacks"	: false,
	"valid_items"		: function(pc){

		var uniques = {};
		var items = pc.apiGetAllItems();
		for (var i in items){
			var it = items[i];
			if (it.has_parent('takeable') && !it.is_bag && (!this.class_type || this.class_type == it.class_tsid)){
				var ret = it.takeable_drop_conditions(pc);
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

		if (msg.target_item_class || msg.target_itemstack_tsid){
			var remaining = msg.target_item_class_count;
			do {
				var stack = pc.removeItemStackClassExact(msg.target_item_class, remaining);
				remaining = remaining - stack.count;		

				if (this.addItemStack(stack)){
					// send bubble that some of it didn't make it
					stack.apiPutBack();
				}

				if (!this.class_type && !this.isBagEmpty()) this.class_type = stack.class_tsid;
			} while (remaining);

			this.broadcastConfig();

			return true;
		}

		return false;
	}
};

function canPickup(pc){ // defined by bag_sdb
	if (this.getContainerType() == 'street' && this.container.pols_is_pol() && !this.container.pols_is_owner(pc)) return {ok: 0};
	return {ok: 1};
}

function getExtraConfig(ret){ // defined by bag_sdb
	// we always want to pass the uid and item_class (null item_class tells client to remove any previous)
	var sd = {
		uid: 'display_box_'+this.tsid,
		item_class: null
	}

	// this special display will get placed on the itemstack's x/y + delta_x/delta_y 
	// if center_view:false, then the origin of the special display will be its bottom center
	// if center_view:true, then the origin of the special display will be its center

	if (this.class_type) {
		sd.item_class = this.class_type;
		sd.state = 'iconic';
		sd.delta_y = -26;
		sd.delta_x = 0;
		sd.width = 34;
		sd.under_itemstack = false;
		sd.center_view = true;
		sd.item_count = this.countItemClass(this.class_type);
	}

	// special_display should always be an array now! 
	// order of array governs z depth of special displays
	ret.special_display = [sd];

	return ret;
}

// global block from bag_sdb
var is_pack = 0;
var capacity = 1000;

function onCreate(){ // needed for initializing props
	this.initInstanceProps();
}

function getDescExtras(pc){
	var out = [];
	return out;
}

var tags = [
	"no_rube",
	"no_trade",
	"furniture",
	"furniture_interactable"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-03\/bag_sdb-1331066085.swf",
	admin_props	: true,
	obey_physics	: false,
	in_background	: false,
	in_foreground	: false,
	has_status	: false,
	not_selectable	: false,
};

itemDef.oneclick_verb	= { // defined by bag_sdb
	"id"				: "remove",
	"label"				: "remove",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 53,
	"tooltip"			: "Remove an item",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (this.getContainerType() == 'street' && this.container.pols_is_pol() && !this.container.pols_is_owner(pc)) return {state: null};
		if (this.countContents()) return {state:'enabled'};
		return {state:null};
	},
};

;
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
	"no_trade",
	"furniture",
	"furniture_interactable"
];
itemDef.keys_in_location = {
	"c"	: "change_style",
	"e"	: "deposit",
	"g"	: "flip",
	"o"	: "remove",
	"u"	: "upgrade"
};
itemDef.keys_in_pack = {
	"c"	: "change_style",
	"u"	: "upgrade"
};

log.info("bag_sdb.js LOADED");

// generated ok 2012-03-16 11:33:55 by eric
