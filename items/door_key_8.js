//#include include/takeable.js

var label = "Blue-White Hexagon Key";
var version = "1337965213";
var name_single = "Blue-White Hexagon Key";
var name_plural = "Blue-White Hexagon Key";
var article = "a";
var description = "It's been said that hexagonal keys have more fun. Usually this is the case, except when said key is blue and white. These are serious keys for serious door openings.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 10;
var base_cost = 50;
var input_for = [];
var parent_classes = ["door_key_8", "door_key_base", "takeable"];
var has_instance_props = false;

var classProps = {
	"collection_id"	: "",	// defined by takeable
	"key_id"	: "8"	// defined by door_key_base (overridden by door_key_8)
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
		'position': {"x":-18,"y":-17,"w":36,"h":18},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAEBUlEQVR42u2W3U9bdRjH+QNMmhi9\nMyExLvFK3eRKjY0svlyYLdtwiBNR59TNzLqpIWPOJmY4pnWMuWzttC1QXJQVaGHgCO0OLS8pbWl7\nLC309UApLW2BAg5Zwjxff7+2BJYtXowXMTnf5HPxJKfNJ8\/ze37n5OUJESJEiBAhG5Y6vXl3pfxX\n5ti3l8RbSswbXxQb7EGmRtOOgxXV+LDiHKp+0jIN7X35\/6mY0RHOt\/on1X3eGCoVndj+ej\/2fzyF\n7y414PiZK5BfM6BjwFcdmoFoU8UUjV2ipi6b1GDzp1t73Cg57sIjBbfx5Ks8XihegtvtganHgssN\nrVDqTBgMz6RHkrclmyJXo9KW1euYtMkVhqw2gicK\/8TjhTx27CUUEd7gYTBF4fcH4RkahtFkQbPB\nCqs\/AUcwxfX\/wW3s+axtNsDMLmJn6SIee54I7cmJFRNKCG\/xaL+ZAMeNIRTk4PMFwLJDMFtYuEIJ\n9LrCzIYKXm0z4VjVHWx7aZXcm4QDhHcIZTxk9fOIjscQGRsHFx7NdJNl3XD6xjdRcCeR2Zfr3IGs\n2I6DhA94\/HJjHonJJGIT8Ywk7eSQ20sEo5so+HL2vNGRZjpH5T4iHOZh98xjemomI0k7Scft9YzA\n6Y\/CaA+mNZ0uZr1Rttla9r336XMrgq8Qmf257r1LOJSVe\/HLv3Hr1gJm07NIJVOZLo6NRjDs9cFF\nBC2eCDyRmbsIxufAJebXBP0PhUbL\/bvgER4S+RIWMoJzSKXuFbzR58ZFTeuG8P7Rcuv9R1y2MmJl\n+yLmZucwM51GIpHERDSG0VUj7uz3cF9Vq6UPwtfn60A5db6OO1Vdq16uKSe+\/5nZU3pIfO+S0A1+\nO9dFImm0zmEqNY1kgnQvFsd4ZBzh0PosyScnZcjBHD5xTryqxpGKH6QrS3L2Dh4t4PHUrlwXS3KS\npJOBcALx+CQmJqhclCwIuWZ8QTgd7JoFL9TrQamp0zEX6lvFyzXlR40+K0heX1wvy+EL2TweLlhC\nfmFOsjg7bnqtUOi5o3cgPXs2GwuTnYw4NIUeF6d+UEFVkwEUpdbAqJpvipdrirrJmBVUKBpF6qYu\nqY5xQGcKokgSxUPbeWx7LStK77zMG2QkAPsgi6utDK73e+GN\/5V2BqfK1nLF\/d5tAaWj28J0mK3i\n5TqDaUB618NNRke+weZrYZwczqoG8MyuEETP8vC4hzEw4IBc04JK+TVoGSdco7Pr8kWj0veWqfV9\nUpW+b3e27pHQmqJs63n6vj+yBlJiz8QCp9KZUXT0Ok7XaFH6eRXKZWrU6s3ODmtga3y8GgdDUlVL\nd1py+jI+++ZiuuqKVpK31dLYZRedUfwmLa9SiPKECBEiRIiQ\/2X+AdhCmO\/xdBviAAAAAElFTkSu\nQmCC",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/door_key_8-1334258086.swf",
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

log.info("door_key_8.js LOADED");

// generated ok 2012-05-25 10:00:13 by eric
