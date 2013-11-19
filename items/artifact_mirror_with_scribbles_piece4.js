//#include include/takeable.js

var label = "Piece of A Mirror with Scribbles On It";
var version = "1350087155";
var name_single = "Piece of A Mirror with Scribbles On It";
var name_plural = "Pieces of A Mirror with Scribbles On It";
var article = "a";
var description = "One fifth of a shattered mirror. Combining all of them will undoubtedly bring good luck at the expense of whomever broke it.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 5;
var base_cost = 0;
var input_for = [];
var parent_classes = ["artifact_mirror_with_scribbles_piece4", "takeable"];
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
	out.push([2, "Collecting all the unique pieces gets you the <a href=\"\/items\/1309\/\" glitch=\"item|artifact_mirror_with_scribbles\">A Mirror with Scribbles On It<\/a> artifact."]);
	return out;
}

var tags = [
	"artifactpiece",
	"collectible",
	"no_rube",
	"no_donate"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-15,"y":-13,"w":31,"h":14},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAF+klEQVR42u2W+VKaVxjGcwe5gP6h\nUUOMJjE2XdKq0VTHVAURlUUQQRYRFBBXUBQVN3AlwRURF4ygIu4xMYlpbiCX4CVwCU\/POW2sSf7I\ndNK00xmemWec8fvmm9953vc9L1euxBVXXHHFFVdcX6LQnCDj7b42d3GCa66TpQd01ekZ\/zlUR929\nqzb9PYXN8P07u+k+epqzMND+AP1t2TDI01EvSzs31NwJmDTf8f9VsL4uKd+s40WNmgJYdLloN2TB\nbvwRFLLbfB+djT9grCcfbnseGhV3oK1Kg0aSeq4WcRR1wqSrXwUquOhNWHjiDDhsipjNUonmBj5x\nGbO5ngeTrhhWUyGD7bX8jF6SpqsrDxvzlZgeKYZReYdApsE7XBTzOAscwn8K9O3xfu6bZ7uBlwcR\nDPXaMdz3h91OK5zdJvR36WHQ8KBXFzErpflQyfJg1majx\/wzBtpysDDGRXRFCrPqLjTSW1BXpVOf\nq76kT3fWl\/ihZd\/Z6X4EZ8e78HknGSC1d9yFKfcgA52ecMHabEJHUz1ajHLUSPIhLs+GTJgLWWUO\nS3TImguPsxCnERXMmkxoZbdht2ShVpQWE3Ov\/T3I+ZGCqy8PtqPPdzdB\/epwBweb6xh0dBJ3YWn2\nMd4822M+Ic\/dTgdJ0naRrLO7DW0mKbpaRWg1CmDWc2EzZqOvNQfbSxIcbdQgvCjG4YYcMn4SCvMS\nYoUPv\/k85KujSMLz3a3JF7tbsRd72zjdp46AlvYkGiZJuQlAN453Qnh9FCXeZcnuhdcukt1c9TPw\n3072sO53wu81wd1fi5bGYgxa8xAhgP7JUigrr0PEvYbSwkSUPkqCoDjl3SdAJ5FQxtbcBH\/DM+zY\nX1uMUoiT6CYzAWV+sbeF\/dACArOT8LiGsOCxYm\/Di8MtH6LLE4h4RzDebsAQSZaaJvo+XerdDReW\nZy0YH1BjtLcMr6JqVuZqQQpKChJQ9iiRwCVDyOOAQR1Fggk+j8ux2Nd8vjJih6\/LiOBELw7Dq6SM\nq9gPL+LZThgHYT\/5+ByDPY4EcbgZYLCXkz3ZCsJra8CKdxzL815sB5c+SJYCvj6KYGulE8EFC7YD\nSjweKISzI4fAJTJIvfwWTQ+CouTzK4NTk9EmZz+mW9QIuB0ITg7ANexAj2ccM0N2THlcmPZOIbzi\nw\/baEus7Cns52aPtDVbG97DRxcfw2\/TYnh9jrUD7lZqC0ncOyfuhQA+Cc3Lo5BkQliSD\/+gaqitS\nyURnMEv4HJQVpziu6NTKM22tnFwBIhiUMjTXKdHa0UouVx3GLBqMdjXBOjGOp8s+PPXPYoWksk7+\n7qwvkxRDpKxPEVycxZpvFmHyzuU2uJws7VGaZmh5gbSHE7PuUqjJ\/aeo4EAtuoEGkpqFTLJFfZcl\nWF6SEhMWkDtxtFd2NmSXwWaRo6FOAVWNDDVSMSSVAlTweeDzuOByS9BhMcFpt8Fha8OT0WEszXhI\nuWn511iy6\/45rC7MMNjN1SXshUh7EPi9EHkeDJDn89hdH8Rp1IwtvxhayU1Iy67TtYdmzV0G1qzN\nZNAUTlD45zWjFXGiJsUt9FnuY7LnIVYmefBPSMjNXoVBmxAtDWK0NkqgkouhUZKSqJXM9CAKqYSB\nD3R3orezHX1dHXA5ewjoNINd881gY2kGrl49\/B4J2R5C5u6mn6ASpcKouI023T20EDCjMgOy8lRS\n1uQYGZC\/dnStMCWX7MKoRsSJacU38N4d9d8yU3B35wMMtefAS5p5foRLyiNih7A3l8PaVI1qsQBq\nRTUDl1eJIBRwUVNVDEujFha9CFW85A9cL01DOwEjPyZgIluE9h4dirKilLOL5D4WXdZ0aZNEAx\/D\nUisrrrOPV\/NTLv6nFnJQR0pCDzLYloW+lny0GUogFuRDr+Kztulo+OUTQIs6kwxCJkuMgZHUyoqS\nzF+0e+nqqSpJVujlGVGd9GbsMrSqkoOPD6Qi8I2KDNSUcz4BpBN6AUYmlQ3D1xL9eBUvMZdazE0y\nS7hJjs+5vDjJIfg1WfFVweKKK6644orr\/6HfATqYgROsumeyAAAAAElFTkSuQmCC",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-09\/artifact_mirror_with_scribbles_piece4-1348251351.swf",
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
	"artifactpiece",
	"collectible",
	"no_rube",
	"no_donate"
];
itemDef.keys_in_location = {
	"p"	: "pickup"
};
itemDef.keys_in_pack = {
	"r"	: "drop",
	"g"	: "give"
};

log.info("artifact_mirror_with_scribbles_piece4.js LOADED");

// generated ok 2012-10-12 17:12:35 by martlume
