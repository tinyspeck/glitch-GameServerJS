//#include include/takeable.js

var label = "Purple-Orange Circle Key";
var version = "1337965213";
var name_single = "Purple-Orange Circle Key";
var name_plural = "Purple-Orange Circle Key";
var article = "a";
var description = "Purple, orange and circular, this key has everything you could want in a key. Especially since it actually opens doors.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 10;
var base_cost = 50;
var input_for = [];
var parent_classes = ["door_key_6", "door_key_base", "takeable"];
var has_instance_props = false;

var classProps = {
	"collection_id"	: "",	// defined by takeable
	"key_id"	: "6"	// defined by door_key_base (overridden by door_key_6)
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

function expire(){ // defined by door_key_base
	if (this.isOnGround()){
		this.apiDelete();
	}
	else{
		delete this.pc_can_pickup;
	}
}

// global block from door_key_base
this.is_key = 1;

function getDescExtras(pc){
	var out = [];
	return out;
}

var tags = [
	"key",
	"no_rube"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-18,"y":-17,"w":37,"h":18},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAEiUlEQVR42u2Wa0ybVRjH+W7i4j7o\np6XRaVy8DMMilCWzc4XBUKfzgzNTxhSic4oEB1KUUQkJ0BnkYgXKoIVxL5ab41IufbkMyrWlFBgb\nzsJAYLTwAi2Xqcnfc95yGdkSMzbGB\/tP\/jnnSd80vzzPOc95nJwccsghhxxy6P8n47jNWTs0lVDW\n2MukFtYw4sRsJixOxsRnlZXmXtH61XXf3LUjYA2tg7yr\/eOMcWwBNR03IM1XIzI5D2cvJCMgPB5i\nss+qaKG\/mXQmq+CxwqkadLzqtgGW6TVBruyA34kueL44gMPPGcB\/YgTv7WGg\/vJNJEsuokDdBZ1p\nDsOWf959LHAyZd0upVqrr+u8DknMNRzaPY539t6Gn6sZn7ha8CkxXftDT2EmiAcmOoDL8LD5b9Y4\nzjpvO2BmsTqhokmPAuUIydYEPnaZhr\/rDD5zncXnxGfdWM76iEDMJx7BbMTLaE0WQW+aRe8Iq99W\nOGmGipdZXIum7gl4P\/snTr5ih6NAXxEHuc2t+3p8AKyXhFiQHgEb\/jw6KopgIJDa\/lG\/bQNMVKgS\nSus7kRBtwbE9U+twXxOgb\/jzCOUvIIxvxS8ftGNRdRS2\/KOwZnpgPkmASdGrBHAGbf2j+m0E\/NXU\n1mfC+85T8HUxcyUNJIDnCZzI3YoIdxsuEA9lhGBJfQyLZV6w5RHIdCHYyH0Y1LaQDN5Cg26Qty2A\nSQoVjCMWHHpqkrsMX9Cy8ufwLd8OF3VwCdmnu7HS+RaWm32wVO0NWzEBVJAs\/ugKU46YAyxq6ENO\nrYFzocaI2q7fH8rlLQPsR+dEr68DvkEAaXnPEcDg1eyJ3RcRc3AZ1wqjcWfgOFbaCWQ9yWIJAcz2\nxHw8Acy1A9Z1DD5yS7OUpv8EjBda8NeN47jTvwpYd39A6eUKxKbkP1L7B4Yz9Azq186g3wGzvcRu\nGyWW+3Zhpeft+5Z4LnofhpqqOEB5iUaQkl\/1QI5MzNZH\/KQANY3X9tQ\/\/JyjkOZW8ugtVvzWpONu\n8Ym90\/dcEvV3ciw3+mBZ42O\/JKUbl2QqysV+i42jpq2cf1FcGhMukYGaxmt7apFEJuY+SpaXCGgf\n1BrMED4zgTMHLJvaTGVIBhYrvLBY7rWpzczF7oeuIMHeBwfGxFsBTCusYtIKq0Ftj+17allR9cZ\/\nZijVTOXVPqQkjULw5CROv2ZZb9QKv1J7xvI8ybnz4Br1XNx+GCUn0TU8TV8Stvvm7Jamm9wyDZNb\nzoCai1f31HnlzF2AqgaeskbL0rc4XTGIw+Qt\/vAl8\/pTpwmJhjVNiPlkAVjxC7iSEM61AvIWo+8W\nu+WBobm9h2lp16FZq2O5mKw0tlsftOnjwpoOZzLN6JsMI0jN6sIZMs0Inx6DcPdteBBneX8Pjb8X\n0mOjoKzvodMM+7DTTJqqxTm9pFlA17tjapmy+96q0EG0dWBcT4cAlUaPGJkKwbGX4Hv+Ik4FxyJU\nIoe8rAk1ncOs7g+bs9NOqW\/MKmgfmiotazQgtUgNcdJlhEnSQSZqU06lVrxjE7VDDjnkkEMOPbD+\nBZvPo2YbpY0MAAAAAElFTkSuQmCC",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/door_key_6-1334257965.swf",
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
	"key",
	"no_rube"
];
itemDef.keys_in_location = {
	"p"	: "pickup"
};
itemDef.keys_in_pack = {
	"r"	: "drop",
	"g"	: "give"
};

log.info("door_key_6.js LOADED");

// generated ok 2012-05-25 10:00:13 by eric
