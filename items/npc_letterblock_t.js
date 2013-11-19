//#include include/takeable.js

var label = "Letter Block T";
var version = "1337965213";
var name_single = "Letter Block T";
var name_plural = "Letter Block T";
var article = "a";
var description = "";
var is_hidden = false;
var has_info = true;
var has_infopage = false;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 0;
var input_for = [];
var parent_classes = ["npc_letterblock_t", "takeable"];
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

function getDescExtras(pc){
	var out = [];
	return out;
}

var tags = [
	"letterblock",
	"no_trade"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-70,"y":-116,"w":137,"h":133},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAELUlEQVR42u2XW2\/bZBzGd8cFH4EL\nPgQfgSuuBgM0iZWVFba1HRtirYbGpqGSjGotaxfbiZ2mcVLHseM0x6aJ5zaHJq16UNcioO3W9cRh\nCEElGG1HRgt7sN8saashcRPDjf\/So1dOFL0\/P\/\/D++bIESussMIKK6z43+LDgdQLdmXodVcs1tgm\nakRXpExjfzL2jyoUxMaYpjRekzPH2\/zDL9Ud6BUq89wZLnauxZOULwvxDT4VQb4UQbYgY6w0iEIx\nDC0nIzYSRmJ0EMlspCa1EMHkrAouNYwmOrj9hp0r1x3whCM01UCFcJoawFnaX1MTFYDx+b+pmVPQ\n7ArjMk2hL8Cg7oDGJi7+Jha0Tiznu7Ey9jlWizexXurB+ngvNiZ6cTd7A4vZLsznqJrmshRGUhRa\nWAnHu3zIJm+BCbDmAA5Jdvy24MXOXR92lkU8WlXw5PsI8F2opj83JOyuidhdlyvrU7ExGW\/f5DE\/\nxqGp2wTAj3kRasiGrUUeSzN+XFfioFNpuDMqineyUKeyiJYqChVGwKUzUBMMtpb8KN8X4IoGiYML\nEx4cs7nqD3iSkjEs28mGl3iZ1NUpJoSTdGVt5p6tu\/fZAJZLTuIqG6uk+KvxPnMA33PKJMVzM3IN\n4IKTJ41yVdiHOucSDjVOWOrGQ70suLhMAOfyHN7qNMlBA7A0JpCNW2kfhrzt+MzrJg5WgeSEHxGl\nhzhrPEtCJ2mkaopnRl1od3L1B2zWu9AA3PzSA1XjkR38VO\/eysYH03p7PI01HSit+UH7HMj42vDT\nHAs2IuI8049JjUG3321eF\/++PIC9jWCta92Jw3U3XEiQ8bNzz0+6\/ZG+\/rEagDQs4gMdcHrUCVu\/\nCQ6+Q1dSbIwMY0OjMx+vCLCJ8iHA4ngUP95xEfiDY8YArNbgJaeJc3Bbd8UAfPKtTCDs0j7cR74Q\nxidi+Hmeq33\/1zcS9taD8MQrXTyV9+AizZqb4rLuXNWZdu++g+f7QpicHsKDaYo4XJXxQklNxBmH\nF6rqwdkezjzArUUvSW15JaDDRJ+ZfcHcCHZ\/0HTXJDzWwQwZLzVZ9MHm7UM40YdTXSaMmSamUoNb\nSzxR8em4qQ5sI9XvOivPTiWABzPMgeMviNHcAEmxlqQgKoxZDl4nXWmktrwiIjMq6HOQQzvD4iLj\nJupw9SLMXyWjpppi4ze5nJ8ApuMULji42boD8jE\/bicceHhP784NhWjnfhDlNRm\/ft1PTotf9Bm5\n+YWbNJIBZWjbcFw\/v+lwgAC23mI3j9mZF+sO2CkKsy36eWtTErCHh2rqiafIhcGQUX\/GZWEwryKa\nTyNSyCA6pkLQUmjSj8o3b3j3Xu1gXjblit8tCM9fGwgebWWlKw208klV+kW28wQV8h2UXg7xBkeo\ncFCnnUHfax2Oo9afJSussMIKK\/67+BvASnDjYvSOpQAAAABJRU5ErkJggg==",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2010-03\/1268375217-4592.swf",
	admin_props	: false,
	obey_physics	: true,
	in_background	: false,
	in_foreground	: true,
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
	"letterblock",
	"no_trade"
];
itemDef.keys_in_location = {
	"p"	: "pickup"
};
itemDef.keys_in_pack = {
	"r"	: "drop",
	"g"	: "give"
};

log.info("npc_letterblock_t.js LOADED");

// generated ok 2012-05-25 10:00:13 by eric
