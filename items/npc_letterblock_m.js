//#include include/takeable.js

var label = "Letter Block M";
var version = "1337965213";
var name_single = "Letter Block M";
var name_plural = "Letter Block M";
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
var parent_classes = ["npc_letterblock_m", "takeable"];
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
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAEBklEQVR42u1XWU8bVxjNW39EHvoz\n+gP61IcqVaIqUkOgpVlI0jTKViW0Ii2YsgRIPB57xtt4m9UrtmMbg23MEihQQCJAKQRQUfsUqSEJ\nLWlS9XTmjmxkBal98LQvc6TzMFce3ePzne+7d44cMWHChAkTJv43XA2kj1qU1AlHPN50nc8Tfilm\nmzzJ+KEcHeWb4nmlqU3KnrzCZd6pu6DGgfDRs67ElQvupHQ7mNjm0lGUxlWWFZTHI4Qj5Qjiw2EM\njkSQLESrzI1GUXiYw71EBs2UuH\/Cwjytu8AGq\/yogZJxlgrgvM1fZTMVgrb+T2xhFbQ4wrhto+AK\n0ai\/QHUTB9eP5eEubJT7sDU+UMPNsX6sDHdjpdCLhSJV5XyBwnCawgVGxMleH0qp+7jndxgjMCVa\n8GSRxd4PPjxf4fBs2Yu\/fpKAHblK7fnPbfENMnEJp\/s5LJRZNN9l6i+wleORkzuwNetBrJhCpJgh\nnJuJ49mqDy83gthf1zn9UFYzlyZcXMzg+ZoAR0wgDi5PunG8wwAHGykJDyQLaJkjmbrs0nIl46KD\nx\/oEjd\/W\/ETcxgKPRttB9k6r700lO1UH9RIvTbiMEXjGLpES72+KsIi1DRCUaNXBEClxn3KwHh6S\nYff0YmfKCjYhEYHzJRYfdRnkoCbwhZq\/xBBfI\/CGM4D1cYq4V1k7x8jokWUUoxbibKXEMyMO3LCz\n9RfYonahJvDXJTcGc8Eagde8MgKSHbd84hvjZTLWTsrPRHlcpj2YytO463ca18XaZtG89K9mn8bZ\ndCf+eBwCnxZw1e4hDn7tMsDBj216iV9t8uCSulN9Xjs+tcv4Kngg6JaDqRE4n+km74SzvJ7BURZf\n2BnjHPz9xwDJU+XZFpPR6tfF3GQ8iAhdNQKLiR683hLgTuhdPF1y45rNQIFa4DsF3cG09C0mxw7y\nGPC2o5h31gjMR7vJjEzmeVyyeZDLuXF+gDVO4NKMgE9ofXNxKIm9zShucmonsxwmlFa443x1Tmrr\n07MZ7K6GMDXmQ4fXhfCgC2f6DBgzzbSeQS5x4FiLzYdy+A6+n1IdUrqxM8vikrO2ST6jvZhLtWOk\nGCAlzicp8AptlIOdpIs17i57yMjRGqByDmtn7stNAT8vhfBYPRLXv3PhlxkaT9XfjRR0gZkEhc+t\n7FzdBXJxP4YGrdhdk\/FqWyHcWxfUk0VSGydIhGr5rPyBCl+scuRiYVX0Lr54n3ly3EK\/XXeBXXxw\nThvWHcogLOFUlX3xB3Bmc4RCcRix8QIipRxipQyio1nEyjkE82ly3fqwx\/v6g2\/odw254r9HZd9q\nCwjHLjrF6w025c5hPGWVmFOU7DuM5xyi+\/026zHzY8mECRMmTPx3+Bu4xl0ku\/RYkAAAAABJRU5E\nrkJggg==",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2010-03\/1268375191-9791.swf",
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

log.info("npc_letterblock_m.js LOADED");

// generated ok 2012-05-25 10:00:13 by eric
