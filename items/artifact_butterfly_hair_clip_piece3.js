//#include include/takeable.js

var label = "Piece of Butterfly Bone Hair Clip";
var version = "1350087064";
var name_single = "Piece of Butterfly Bone Hair Clip";
var name_plural = "Pieces of Butterfly Bone Hair Clip";
var article = "a";
var description = "One of four fragments that make up Gwendolyn's long-forgotten hair-clip. Acquire them all to remember it again.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 5;
var base_cost = 0;
var input_for = [];
var parent_classes = ["artifact_butterfly_hair_clip_piece3", "takeable"];
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
	out.push([2, "Collecting all the unique pieces gets you the <a href=\"\/items\/1310\/\" glitch=\"item|artifact_butterfly_hair_clip\">Butterfly Bone Hair Clip<\/a> artifact."]);
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
		'position': {"x":-12,"y":-12,"w":24,"h":12},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAFsUlEQVR42u1Wa1NTVxTlH\/AT+An8\nhHzpp1aaolUsDyMEwit4CQTCKwkJwUBCuAZCHgQICe+HJAEBAfUW0UqVTrQKtXY6dzrS9lvvT9g9\n69hQpFVpZ1o70+yZPTePc89Ze+21171ZWZnIRCYykYlMvJf4+WBZ9XI\/ETl8lpCQ+PzyICn88v1W\n9r8OBof+uJ+0IgEitR3VyI+vKztrAZKWfYTr0\/uTdLifpJfPEvLh05Xcv3rG4bOkBvvvbo4IbwUC\nZtL508FqztyITQMQKzMuWoxepaUJJz26PfYKzH4inpzqUceGzapo0KJOTDiVR3dGAVJBEacFx4Cp\nsd8PX8dpfsxBC1GH+g+Lnu\/OqndWAzLYYJun2VCWYk5yWmrI0V4phb0t1oGeBoUlRf1mvu7JzsRR\nxQA5EbRwVnH\/t3tzbwW5tRXKlpI+zc0FUZkN22nE20r9jivkddZbX1t4b82vmQxZydWp52BwHRZb\naGvJS998OUOJKVckvRbgvD0GyW3Tp0Kiibf3+P+xgFkEyHT7J0MWzXGmnj+cjRzszkiQCIpApj4f\nJwaU1uY85Hcbyagv\/B3g3TW\/an2+n9x2vVxVdtaaTn3Feamprpj6uwVaX\/BQcqo3NR8yZQPgYG+D\nVac7n910pVgRu+sJvwVFEweJNdPhTloc76blaRfdWvIqj7ejyou9OXrOin2yE+N590aAFiLdNDvS\nxa9sHdcx1n2xMSwfDdueNBr39xmVUI\/ptenratFZays+pZryc7LTUk1jvnaKBSwpn6sRDHKNVJfm\na4TqixxgwNNMQU9zfMhtTPVYa4hdKXythbXLwDPUb2Jg7LSxIHK2mJwIxPTZ6\/j9owNtdH89RLub\nYZ4ozuMQpKzpsA36Ek\/qI9jXJKCFEV+7yBglc1MZbz+yu6NSwABtLPSL0CjkACbW5j20ef0aa2+Q\nvvtqntItfLAxTL7ehpTbXidG\/RZNPOaU0U4ARUtry8+RtVmroJCpUCdPgO5qq5SzUKled8F6Urzb\nN4YktAE6AvV7UoRW2abzEYfyYDOsoFqAwqZtBg1nCCJnBfFJXJl287ZtrwzRw1uj9PTepMwnPmiO\nsCHg982wwQDIjsbLgu78B9llxWeszo4qKySEK\/uemyV2CxI0dxzgFJtGUG42llJbg4bGfR2cdmgH\ngsbwLI5fhS655eD3gwfTdG89yOyoDxYj3Fn2q8YGWlU+t1GKDpk5WLR1ZKCV2tmeVZfzqVFfGOct\nT\/jEN466uaEst053IZ72QTwRXjyakwGCtZJqtGep01TO2YoxazEwzQEwGEpM9nLWkLAJHIYC2ITS\nzetihGlWGWYygXV4uq7we1ydtbK2+AxnjFvTkFmWEoPKW42ysjRfbTLpsjGpsJW0djC9YBGgfC4j\nb0tVaT4DrEVbFEvT5SMPtLVWqPrs+ri9tYIGmX4gC3yGvsqK85SyoryI21ansCGTj5+NVqL4d7q5\nualUNeJtIXgYnho3F0U2tWaIlyouqblomT9RecnHsBm+7mSCLUxlfVUBRQbbaWbYJmuLPtKk2UJB\n2GfAZVAdB4jf3gkQDDradNTDLIW1gV8BrqHmM6rUfHIErtVwKe32R4nvuLeZ+aZQeUGuLjsrmoSS\nOAbg9qovJ31GaUme6iRA5iAyG1TpVM\/E+qqLVnYAtQgl\/LAaZi\/4ri3O4wmQAI3EGiTaD8GzFop8\n6n4LbeGHObALKTl4JIPSwjw1AM6P2ThAQ2WBwGSj+Poac079VlFfXSCCMQDCNf35ZEJXTOxxtBBg\n\/myvfodAo4NtRw5Rqz0nsalWYGOwFK7NY0WdOhzt2hy04015mk2hu\/RjkTPKJhcDNxGwWLEHCnuv\nL7SdzeVc\/BNBcy7AgK2muqLIf+JtGy1nHqqwR6UEtl+182+08p8ILoGiMylDdUHq5AvIew\/oDgDT\nvpeJTGQiE5n4H8Sv1sueqRgVib0AAAAASUVORK5CYII=",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-09\/artifact_butterlfy_hair_clip_piece3-1348197853.swf",
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

log.info("artifact_butterfly_hair_clip_piece3.js LOADED");

// generated ok 2012-10-12 17:11:04 by martlume
