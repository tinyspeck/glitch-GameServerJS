//#include include/takeable.js

var label = "Piggy Plop";
var version = "1339518755";
var name_single = "Piggy Plop";
var name_plural = "Piggy Plops";
var article = "a";
var description = "Piggy plop is the delicately scented excrescence of a healthy piggy. Round, brown, and mysterious, it may contain presents.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 0;
var input_for = [];
var parent_classes = ["plop", "takeable"];
var has_instance_props = true;

var classProps = {
	"collection_id"	: ""	// defined by takeable
};

function initInstanceProps(){
	this.instanceProps = {};
	this.instanceProps.seed_class = "";	// defined by plop
	this.instanceProps.seed_count = "1";	// defined by plop
}

var instancePropsDef = {
	seed_class : ["The class of seed contained within"],
	seed_count : ["The number of seeds contained within"],
};

var instancePropsChoices = {
	seed_class : [""],
	seed_count : [""],
};

var verbs = {};

verbs.drop = { // defined by takeable
	"name"				: "drop",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 51,
	"tooltip"			: "Drop it on the ground",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		return this.takeable_drop_conditions(pc, drop_stack);
	},
	"handler"			: function(pc, msg, suppress_activity){

		return this.takeable_drop(pc, msg);
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

verbs.taste = { // defined by plop
	"name"				: "taste",
	"ok_states"			: ["in_location","in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_single"			: 1,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 52,
	"tooltip"			: "Um ...",
	"is_drop_target"		: false,
	"effects"			: function(pc){

		var failed = 0;
		var orig_count = this.count;
		var self_msgs = [];
		var self_effects = [];
		var they_effects = [];
		var sub_effects = [];

		self_msgs.push("To be frank, we didn't think anyone would ever choose to taste a Piggy Plop. We're kind of at a loss here. Let's all just go about our business and pretend this never happened.");

		return this.flatten_effects(pc, {
			self_effects: self_effects,
			they_effects: they_effects,
			sub_effects: sub_effects,
		});
	},
	"handler"			: function(pc, msg, suppress_activity){

		var failed = 0;
		var orig_count = this.count;
		var self_msgs = [];
		var self_effects = [];
		var they_effects = [];

		self_msgs.push("To be frank, we didn't think anyone would ever choose to taste a Piggy Plop. We're kind of at a loss here. Let's all just go about our business and pretend this never happened.");

		var pre_msg = this.buildVerbMessage(msg.count, 'taste', 'tasted', failed, self_msgs, self_effects, they_effects);
		if (!suppress_activity && pre_msg) pc.sendActivity(pre_msg);

		return failed ? false : true;
	}
};

verbs.sniff = { // defined by plop
	"name"				: "sniff",
	"ok_states"			: ["in_location","in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_single"			: 1,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 53,
	"tooltip"			: "It can't hurt to have a little smell",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (pc.is_dead) return {state:'disabled', reason: "Your current state of croakedness prevents you from doing such a silly thing."};
		return {state:'enabled'};
	},
	"effects"			: function(pc){

		var failed = 0;
		var orig_count = this.count;
		var self_msgs = [];
		var self_effects = [];
		var they_effects = [];
		var sub_effects = [];

		self_msgs.push("Not bad, actually. You've smelled worse. Indeed you have.");
		var val = 2;
		self_effects.push({
				"type"	: "metabolic_dec",
				"which"	: "energy",
				"value"	: val
			});
		// effect does nothing in dry run: player/xp_give

		return this.flatten_effects(pc, {
			self_effects: self_effects,
			they_effects: they_effects,
			sub_effects: sub_effects,
		});
	},
	"handler"			: function(pc, msg, suppress_activity){

		var failed = 0;
		var orig_count = this.count;
		var self_msgs = [];
		var self_effects = [];
		var they_effects = [];

		self_msgs.push("Not bad, actually. You've smelled worse. Indeed you have.");
		var val = pc.metabolics_lose_energy(2);
		if (val){
			self_effects.push({
				"type"	: "metabolic_dec",
				"which"	: "energy",
				"value"	: val
			});
		}
		var context = {'class_id':this.class_tsid, 'verb':'sniff'};
		var val = pc.stats_add_xp(2, false, context);
		if (val){
			self_effects.push({
				"type"	: "xp_give",
				"which"	: "",
				"value"	: val
			});
		}

		var pre_msg = this.buildVerbMessage(msg.count, 'sniff', 'sniffed', failed, self_msgs, self_effects, they_effects);
		if (!suppress_activity && pre_msg) pc.sendActivity(pre_msg);

		return failed ? false : true;
	}
};

verbs.examine = { // defined by plop
	"name"				: "examine",
	"ok_states"			: ["in_location","in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: true,
	"is_emote"			: false,
	"sort_on"			: 54,
	"tooltip"			: "Take a closer look at this plop",
	"is_drop_target"		: false,
	"handler"			: function(pc, msg, suppress_activity){

		if (this.instanceProps.seed_class){
			var seed_class = this.instanceProps.seed_class;
		}
		else{
			var seed_class = 'seed_corn';
		}

		var seed_count = 1;
		if (this.instanceProps.seed_count){
			seed_count = this.instanceProps.seed_count;
		}

		pc.quests_inc_counter('plops_inspected', 1);

		var seed = this.replaceWith(seed_class, false, seed_count);

		var seed_title = seed.name_plural;
		if (seed_count == 1){
			seed_title = seed.name_single;
		}

		pc.sendActivity('You found '+seed_count+' '+seed_title+' in that plop!');

		return true;
	}
};

verbs.pickup = { // defined by takeable
	"name"				: "pick up",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 55,
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

function onCreate(){ // needed for initializing props
	this.initInstanceProps();
}

function getDescExtras(pc){
	var out = [];
	return out;
}

var tags = [
	"no_rube",
	"no_auction",
	"no_donate"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-14,"y":-23,"w":28,"h":24},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAFZElEQVR42u2W+09TZxjH+x+Q\/bZR\nJgWZOlFL0QzczMg2henmGHJxTJShs0BlXAfqhtbswkzMwi2LYaK7hmQDx0IWh5nbYWRbFmJSEyj3\n9kBpS7m13BF+efY+b3mPp4dTlEv9YeFNvjnpaU+fz\/l+n+c9R6HYWBtLfpnN5sBek5kTy+5wcHa7\ngxsfH+cmJia4+\/fvc7Ozs9zMzAw3PT2NR\/3k5GTsYwHsNfEGnu8Dp9MF8\/PzsLCwQI8ECubm5oCA\nAQECAgZTU1NAwIBAA4F3OZ3OQF+7pzaZeRgnBRGKgVX91QAXbt2AD3+phtyblfToGB1mYOByucgN\nOfGz3qeAPM9HWa02D7farWYKh5\/RLZPdAkduXKTQCDU2Ngajo6MwMjKCjvocMBaLiiNsMRnh8p0a\nCoZOoc43fEmhGdjw8DAMDQ2hgzk+BTTxvF6mtyhQyvclYBt2gMHUQR2svfsHhXI4HDA4OAh2ux3I\nivIpoM02qJf2FUaIQqf6bAOQXVcB5U111DUGZrPZwGq1+h6QQOjFYOIIeasFsmvL4XZ7C3WOQQ0M\nDIDFYqGg5FrfAjqGhuqlfcUirPi9Fv42tVIwhEL19\/dDX18fFQL6fA+02e2cFIxF+EPLHeoqusXA\nyFAB2ZrAZDLRG\/I9oM3GSfuKRSgH1dvbCz09PVSPx0EC6A0s68cy+LjxWw+w7u5u6Orqgs7OTmwL\n3ueA\/f0Wr24132sBo7nbA6qjowPa29vBaDTilsT5HJA1vFyM3sDa2tqgtbUVN3bfAp6PC4l6VKiG\n7yqhpvIC1FQUw8\/flMO\/TY3wz2\/1kB4dpF43oKvaMH3lu2rus5RQ10dvPQsl7+wBY+s9aL79EzQ3\n3oQ\/f62Dplu1ApjhbgvUVRRBmTYCrpzYQXUxcRt8EL+V6mxSGGRGq1xrhryerlFf02kMBA4QjBW4\ndCwcSlL3AJ5HXT4eSs9\/emoffH0lH8pyDkJVhgaqdeGCyk\/uEq7POxwCmTFBbsgY1ereDa\/rwvXi\nAliwNG0nLYCOiL9DlRwLFQDE30tvDpX7+mY3IBMBzTygKiV6+NOlSrvbrzpTw0ljYcJzzDmxmIuo\n4oStFOrSUU+wc0e2CO5lHQyG9w4Fe4Iy2GhVqnZ\/sJ9spNU6jQvhpGCr0VkCWpi0jR7xc9Gbz0Dh\nohgwgi6BdIMaEnc\/4bcE7ovTaq8F84kruW9vFwo+TEXEbQQ8hzAYLbn2zPEdgrJSQinkmVeDZCGT\n9wXUC7Fey9TwrG8+IX+EEUkjLiCR4Z\/inxdI4qPDQ87hddKeY9dq03Z5iN5s3BbQxcgDJkYqQRgI\ndE6ut3D6sL+wr9C5vOTtHoXx\/OepOz2m9mp6mGfUBIJFW7QYL4s4+5B8xCeiNkECAYx7TqlWEMcM\nq+kxdAphxNOMN1UsaYF8Mhg4EKiCN0IEuHy23Yh06pVAOPp8AIVDxUc8laNYKRi2AIKIwRBUPMly\nQqhC0aDgRIv7T3tAJYA9APSvV4htZ8VRctOMfcaeDij8vbhXsXDOa5sFx7xOqYzSXtokA6h0KZjt\nKNxwlwNcTnKRrUTJLwQsAUQp8E7XuuetFe7ky4GycPGR\/rwCf4AFlgPA6MT9gtHlHX7Q8Lo1wGHv\nJcrAueWvV9DHC\/khFsRiYrD3Y91bA54X9xZuD6x3vW0Vj6L0aJXH1Erkfm\/E5x55q8jBxws6gSAI\ni70p3buEp4RoEtcSa9JepexgJEQoSz0edWwtwsZmRKv0GTEqjrm7nsJIpQOBvUb0VXykMlUWbLmF\n0PgqhNAEuJ6A86sBO70\/EFJefNqF0SEM9lfi3iejVgy0Umg54Xdiresr\/sb6v63\/AMmqLFsO+Ttp\nAAAAAElFTkSuQmCC",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/plop-1334276434.swf",
	admin_props	: true,
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
	"no_auction",
	"no_donate"
];
itemDef.keys_in_location = {
	"p"	: "pickup",
	"e"	: "examine",
	"n"	: "sniff",
	"t"	: "taste"
};
itemDef.keys_in_pack = {
	"r"	: "drop",
	"e"	: "examine",
	"g"	: "give",
	"n"	: "sniff",
	"t"	: "taste"
};

log.info("plop.js LOADED");

// generated ok 2012-06-12 09:32:35 by mygrant
