//#include include/takeable.js

var label = "Small Petrified Rock";
var version = "1350426666";
var name_single = "Small Petrified Rock";
var name_plural = "Small Petrified Rocks";
var article = "a";
var description = "A once-modest small rock, frozen into a state of petrified awe when it witnessed a truly epic feat, then drawn, like a magnet, to the contributors of whatever act of rock-debilitating awesomenity petrified it. When cracked open, a small selection of rare delights may be found.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 5;
var base_cost = 0;
var input_for = [];
var parent_classes = ["petrified_rock_small", "petrified_rock_base", "takeable"];
var has_instance_props = false;

var classProps = {
	"collection_id"	: ""	// defined by takeable
};

var instancePropsDef = {};

var verbs = {};

verbs.pickup = { // defined by takeable
	"name"				: "pick up",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 50,
	"tooltip"			: "Put it in your pack",
	"is_drop_target"		: false,
	"proximity_override"			: 800,
	"conditions"			: function(pc, drop_stack){

		return this.takeable_pickup_conditions(pc, drop_stack);
	},
	"handler"			: function(pc, msg, suppress_activity){

		return this.takeable_pickup(pc, msg);
	}
};

verbs.give = { // defined by takeable
	"name"				: "give",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: true,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 51,
	"tooltip"			: "Or, drag item to player",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		return this.takeable_give_conditions(pc, drop_stack);
	},
	"handler"			: function(pc, msg, suppress_activity){

		return this.takeable_give(pc, msg);
	}
};

verbs.drop = { // defined by takeable
	"name"				: "drop",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 52,
	"tooltip"			: "Drop it on the ground",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		return this.takeable_drop_conditions(pc, drop_stack);
	},
	"handler"			: function(pc, msg, suppress_activity){

		return this.takeable_drop(pc, msg);
	}
};

verbs.crack = { // defined by petrified_rock_base
	"name"				: "crack",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: true,
	"include_target_items_from_location"		: false,
	"is_all"			: 1,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 53,
	"tooltip"			: "Crack it open",
	"is_drop_target"		: true,
	"drop_many"			: false,
	"drop_tip"			: "Crack {$item_name} with a {$stack_name}",
	"drop_ok_code"			: function(stack, pc){

		if (in_array_real(stack.class_tsid, this.valid_tools) && stack.isWorking()) return true;
		return false;
	},
	"conditions"			: function(pc, drop_stack){

		for (var i=0; i<this.valid_tools.length; i++){
			if (this.valid_tools[i] && pc.items_find_working_tool(this.valid_tools[i])) return {state:'enabled'};
		}

		return {state:'disabled', reason: "You don't have anything to crack it with."};
	},
	"requires_target_item_count"	: false,
	"choices_are_stacks"	: false,
	"valid_items"		: function(pc){

		var uniques = {};
		var items = pc.apiGetAllItems();
		for (var i in items){
			var it = items[i];
			if (in_array_real(it.class_tsid, this.valid_tools) && it.isWorking()){
				uniques[it.class_tsid] = it.tsid;
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
			this.startMoving();
			pc.sendActivity("You don't have anything to crack this with.");
			return {
				'ok' : 0,
				'txt' : "You don't have anything to crack this with.",
			};
		}
	},
	"handler"			: function(pc, msg, suppress_activity){

		var failed = 0;
		var orig_count = this.count;
		var self_msgs = [];
		var self_effects = [];
		var they_effects = [];

		if (msg.target_item_class || msg.target_itemstack_tsid){
			var tool;
			if (msg.target_itemstack_tsid){
				tool = pc.removeItemStackTsid(msg.target_itemstack_tsid, msg.target_item_class_count);
			}
			else{
				tool = pc.removeItemStackClassExact(msg.target_item_class, msg.target_item_class_count);
			}

			if (tool){
				if (tool.use) tool.use(this, 1);
				this.apiSetTimerX('onCrack', 2000, pc, tool);
				
				pc.announce_sound('PETRIFIED_ROCK');
				var annc = {
					type: 'pc_overlay',
					uid: pc.tsid+'-'+this.class_tsid,
					duration: 2000,
					pc_tsid: pc.tsid,
					locking: true,
					delta_x: 0,
					delta_y: -115,
					swf_url: overlay_key_to_url('petrified_rock_open_overlay')
				};
				pc.apiSendAnnouncement(annc);

				var anncx = {
					type: 'pc_overlay',
					uid: pc.tsid+'-'+this.class_tsid+'-all',
					duration: 2000,
					pc_tsid: pc.tsid,
					delta_x: 0,
					delta_y: -110,
					bubble: true,
					width: 40,
					height: 40,
					swf_url: overlay_key_to_url('petrified_rock_open_overlay')
				};

				pc.location.apiSendAnnouncementX(anncx, pc);

				//this.onCrack(pc, tool);
			}
			else{
				failed = 1;
			}
		}
		else{
			failed = 1;
		}

		var pre_msg = this.buildVerbMessage(msg.count, 'crack', 'cracked', failed, self_msgs, self_effects, they_effects);
		if (!suppress_activity && pre_msg) pc.sendActivity(pre_msg);

		return failed ? false : true;
	}
};

function onCrack(pc, tool){ // defined by petrified_rock_small
	/*
	'crack' verb on Small Petrified Rock gives the following:
	* 20% chance of an artifact piece - 20% chance to run drop table "artifact_pieces" http://dev.glitch.com/god/drop_table_edit.php?id=91
	* 10% chance of a gem - 10% chance to run drop table "gem_equal_chance" http://dev.glitch.com/god/drop_table_edit.php?id=95
	* 10-250 currants - run drop table "petrified_rock_small_currants" http://dev.glitch.com/god/drop_table_edit.php?id=92
	*/

	this.apiConsume(1);

	var results = [];
	results = pc.runDropTable("petrified_rock_small_crack", null, null, null, null, results);
	if (is_chance(0.10)) results = pc.runDropTable("gem_equal_chance", null, null, null, null, results);
	results = pc.runDropTable("petrified_rock_small_currants", null, null, null, null, results);

	if (results.length){
		var msg;
		if (results.length > 1){
			var last = results.pop();
			msg = "You got "+results.join(', ')+", and "+last+"!";
		}
		else{
			msg = "You got "+results.join(', ')+"!";
		}
		pc.sendActivity(msg);
	}
}

// global block from petrified_rock_base
var valid_tools = [
	'ace_of_spades',
	'class_axe',
	'fancy_pick',
	'grand_ol_grinder',
	'hatchet',
	'high_class_hoe',
	'hoe',
	'ore_grinder',
	'pick',
	'shovel'
];

function getDescExtras(pc){
	var out = [];
	out.push([0, "Petrified Rocks are awarded for contributing to <a href=\"http:\/\/www.glitch.com\/feats\/\" glitch=\"external|http:\/\/www.glitch.com\/feats\/\">Feats<\/a>."]);
	return out;
}

var tags = [
	"no_rube",
	"no_trade",
	"no_auction",
	"collectible",
	"petrified"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-10,"y":-14,"w":20,"h":15},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAACdklEQVR42u2W7U5ScRzHvYMuIJtj\nTDNPRgwfQUN8ShQ9eFQU5SBoItISZ0Yhj0IMU7GjWcNScZOU1IlWcy2dVFtvWO+6AC7BS\/jmOVtu\nXQD4ov9n+7z6v\/nst\/9TXh6BQCAQCATCf0n67KPyKDpLH0bDsS\/xlfOv22\/A++NoC+nTw9Sv06PB\nKwn7ntyyfzvYxPEmh13Oc2nksQWcw4r43DPsL\/uF9bO99cznjcXchv7+eeJLnxzgNBHFp7U5HLwO\nCm5HPEgsBZCMhhELTQm+9U9gPTiJD5w7s7fkpXMS+H7e7dt\/FcZxfBUnuxuXJlZm8dI5Ds8DPaaH\nesG57NhZDmEnMi1MmA91WQZiWQ+0MG2B8d4OOIzdgk\/YLjjNOsyMGmDrbsMoo8aEXovkGofDd4tI\ncDPYWvDA1quBulGFrAcu2IfPnSadEMdPim2th0GtgmuoD76Rfli7WmG5iLSwfbDZrLBaR2E0sujs\n1KJaJs1kPXB1aSGzuboCv3MKkXAAL4Lef5x8NAb7+EOYzCbQnQzqm1pQpbgHqlSCYupu9g+MY2x4\nMPh0AiGXQwianwvD7ZnG81AAbq8bBqMR5ZVVqKqtR7uWgVrTAbmiBqUUFcvJIZm19FzTMfR5IOiH\nd8YHXT8LubIBtQ0tkNc1CWEVCiW6enRgWQNojRrS4kJQouuSnF01FSVFvgqqCA3lEpi0aozpGYzo\naAxo7qNdVYs6WSn4dV6V7E6mMD+\/Mqd3ofSWqOBvAB\/ZpigHo5Kjp7EGLdUytCrKoG9WJs0dzVfz\nmvCUlYhpfpKym+KkpFCUui0uSFGiG6mL6EF+G5DPAIFAIBAIBALPH+IUXaSPU1SUAAAAAElFTkSu\nQmCC",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-10\/petrified_rock_small-1349210520.swf",
	admin_props	: false,
	obey_physics	: true,
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
	"no_trade",
	"no_auction",
	"collectible",
	"petrified"
];
itemDef.keys_in_location = {
	"p"	: "pickup"
};
itemDef.keys_in_pack = {
	"r"	: "drop",
	"c"	: "crack",
	"g"	: "give"
};

log.info("petrified_rock_small.js LOADED");

// generated ok 2012-10-16 15:31:06 by mygrant
