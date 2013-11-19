//#include include/takeable.js

var label = "Street Creator Rock Trophy";
var version = "1340228514";
var name_single = "Street Creator Rock Trophy";
var name_plural = "Street Creator Rock Trophies";
var article = "a";
var description = "The holder of this tchotchke has earned their reputation as a rock of the street-creation community. They also earned a patched-up trophy.";
var is_hidden = false;
var has_info = true;
var has_infopage = false;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 0;
var input_for = [];
var parent_classes = ["trophy_street_creator_rock", "trophy_base", "takeable"];
var has_instance_props = false;

var classProps = {
	"collection_id"	: ""	// defined by trophy_base
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

verbs.drop = { // defined by trophy_base
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

		var result = this.takeable_drop(pc, msg, true);

		if (result) { 
			var trophies_outside = pc.home.exterior.find_items(function (it) { return it.hasTag('trophy'); });
			var trophies_inside = pc.home.interior.find_items(function (it) { return it.hasTag('trophy'); });

			if (trophies_outside.length + trophies_inside.length >= 11) { 
				pc.achievements_set("trophy", "placed_eleven", 1);
			}
		}
	}
};

verbs.examine = { // defined by trophy_base
	"name"				: "examine",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 53,
	"tooltip"			: "Have a look at the trophies",
	"is_drop_target"		: false,
	"handler"			: function(pc, msg, suppress_activity){

		var failed = 0;
		var orig_count = this.count;
		var self_msgs = [];
		var self_effects = [];
		var they_effects = [];

		var rsp = {
			'type'		: 'get_trophy_info',
			'itemstack_tsid'	: this.tsid
		};

		pc.apiSendMsg(rsp);

		var pre_msg = this.buildVerbMessage(msg.count, 'examine', 'examined', failed, self_msgs, self_effects, they_effects);
		if (!suppress_activity && pre_msg) pc.sendActivity(pre_msg);

		return failed ? false : true;
	}
};

function parent_verb_takeable_drop(pc, msg, suppress_activity){
	return this.takeable_drop(pc, msg);
};

function parent_verb_takeable_drop_effects(pc){
	// no effects code in this parent
};

function canDrop(pc, drop_stack){ // defined by trophy_base
	if (!this.container) return {ok: false};
	var loc = this.getLocation();
	if (loc.pols_is_owner(pc)) return {ok: true};
	return {ok: false};
}

function canGive(pc, drop_stack){ // defined by trophy_base
	return {ok: false};
}

function canPickup(pc, drop_stack){ // defined by trophy_base
	if (!this.container) return {ok: false};
	if (this.getContainerType() != 'street') return {ok: false};
	if (this.container.pols_is_owner(pc)) return {ok: true};
	return {ok: false};
}

function getAdminStatus(){ // defined by trophy_base
	var pc = this.apiGetLocatableContainerOrSelf();
	if (!pc.is_player){
		var location = this.getLocation();
		pc = location.pols_get_owner();
		if (!pc || !pc.is_player) return;
	}

	var ago = this.ts;
	if (this.ago) ago = this.ago;
	return pc.label+' got this trophy '+utils.ago(ago/1000);
}

function onPickup(pc, msg){ // defined by trophy_base
	pc.furniture_migrate_trophies();
}

// global block from trophy_base
this.is_trophy = 1;

function getDescExtras(pc){
	var out = [];
	return out;
}

var tags = [
	"trophy",
	"no_trade"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-35,"y":-64,"w":70,"h":65},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAJNElEQVR42u2YB1CUZxrHaWbiGSUW\nVGxILyorCih1McaCCliwJAQFEQ2eFTHiCayAhSYrSEdcuiwsICwiLCwLAtI7ImJZo8bTKOLM6Z0Z\nM\/O\/9\/1gJ2rMnXfJoDN338x\/3q+85ff93+d5+BY5uf+VQ\/rqGZfq44TD39jSn5+Bqu\/lk4HiG43s\njwbuNp6zCNiADLDiXicE3ZWSjwLuFqDc96pf2vdzP3pfPcGtVwMov9sOfocY2Z0VH97FG6\/6OV0\/\nPUTHy7+i\/eUDXP3pEcT3O5DeWoLkpqLeMEnmhA8G1\/XTI1bHPx4MtPz9Pppe3EXD8+\/R8uIeCm7W\nE7hixNfl43jJOY8PBtj8\/K6EQlU\/uwnR46softTFnCc1ChFdK0BAWRL8RWfbPhhgzQspA1Q50AfJ\n0+uoeNoLcX8vImpzGDiZQipSP0wsVj27gbInPSh\/co1xsOzpNZQ+7gavvQQxDRcQXJmGExUpSGgo\nkA7\/9j69pVzefw3FDztR8mMXRM96cfFhB\/LuNyP1qhgR1dmIrMlBbH0B2e5cxNXmOQwrYMVAD7v0\nx24Sd53IulMH4cN2XPihBeelV5g2trEA3KosRFzmM6ARVfyoYQUUPe5hU5DCB21I6BEh914TMm7X\nIPlGJTKltUjrq0RYZSbCq86DezkLJ0XJw1u4yXbuTblZhfBmARKviZB9tx787+uQfrsaZ6+LEdMq\nxDHROQSL0xBwKRGcorjhBSQu5VOQsCYSZ92XkCGtYZyj0PT+6YZc+BXFIqDkLNP6FsUOL2Bir5hH\nQbit+YhsK0AqAUu\/VY34nlIG8KQkHQf5pxg4BlAYkz+sgMENfE5wQxY4krOIaLnAQJ1qFODwxSgG\nmNuQh93JxxnI\/RnB8LsYyxlWwMDaFE5gTQoOX4pGUG0mAxhH3PMtj8eJy2lwj\/PFtlgf7OIdY7Qv\nI3h4AYlz+ftyQkDlTVyjbp64kg4\/cSICJcng1ufC9Yw3Dgm48M6NGH7A\/YJQCYXbww8COWeco6Ln\n1FVaerZEfMdsMdWOeM7wxqDb2SNwiTsEp0hPbOdx4JEWwOjblKPYkx2EqM4ibE\/wYyCduV5wOuWJ\nPxwiqDB5VkjeOXaEMEP79fsAOP1PB9B75xa4Ah6OxBGXzgRjX\/gJ7A4NxF7S7o8gzoafJM\/O4Aw\/\nD5miatS2\/dBW3fqI9fpcdO6QvAQ2XSfqYrrae4Edyg5SFrSIJXf7HyK2QoDggqSirXG+rO3xh5Rz\nhHWc0qoOSK5cZVRVdxXVDT240tyLhtZeNLX1obm9D41t11Hf0ovapmvM88qh\/nQsXYPOR+WTcbom\nvjwHdx4\/QFFXjTSoLF753wJ6ZgTFCNorkdVdhajLuQgW8vDnpACpa+iBJAqYLayDTLnF9SgoaURR\nWRNKKlpQXtWKiuo2iCpbcUncDKGoCfmXGiAo+mUMXWO1jwvnMJ8rPZgaCs6FWMRduYCivgYEChN4\nvwm2J\/3EFtruTuLwQsvTEX0lH7T1zomAF+8YN7Ik7aLWAq0xtI\/tZDm2wzRFrJuhCE+2LjaqK2LD\nTEU4qilizXRF2E1VhO1kBXypogCbcQqwUJZ\/IwZ3x\/lleiWf4Lon+MJbEIFQcQaz3oG04wygb2HC\nr78hOYVxTKbtSPRz2MPzHziQfhJ7UwLgGnGAAPpLuKVpUhmgHQFcS+A2ELADNnr4RksJTppK2KSh\nxECuJvArVRWxdKICFo1XgNXnbwK6nz4kCco+LdnM3Qf3WG+yTiAOZoSQNY8xccit4v+6LJF6xdl5\nzn+vW\/wRxknb\/V+xTdZYse0PuXB3xXPwLde7UNbXbpocm4J8RYC8CKCrrhK26AxCUiepi6umKGLZ\nJAV8MYEAjn0TcKXn1zE7Y3ywyss5hq6xyN2Ocexgdjjb45w\/O1yStfed23wkN4rreT70Dfqu+7dZ\nwcXJ2BnnX\/xOwEV6cNNXYiCpk3S7qbt2BHA5AVz8DsCtZ7x5PucjUXu79Y3M3Z7ox3l7\/ff7QL3Z\nLg0uS4VnWhBLBriOAG5SH3RwM3HPWVsJXxMH17\/Lwde2mNRQNfr3uaCj6o\/7wklrFklPVWTi1IVk\nSUp8EsdklLyEJsF6AnmArcc4SUVjkiYOTaAVqgpYMhSDC0bLw9HKmpvCF3N8kmPyvbLCEF0lkAor\nuli\/C4wUZeX6vk5JiCgVvvnR8IsPQ3LCOSyd9hmToTQJ7Kd\/ivWaY7BiygjmerHKL4lhNkYe5GVg\nNFIexmozwDkZCzfOd9jJC4S\/MAEZZdUorbm+5b+CyxI2sJo7b0kLy2vhF8KFs8curHd2xTcuO3A8\nJAaRcek4cjQMThudsMLaHDbGc2HJmg0zQwOYG86CpRELjitXwZ2MOfiXkwiLTMXho6fgtM0DG7e6\nM\/OFRKegsIz8nhG18f5jQFvD2QPOX7DxtjYvZsPlSzZcl7CxdakNthG5LyNavgjbiXbYDoqeuy8n\nz8kzN9Jn65LBcVsWD87x9rzL9DX2vi+b\/OxP5DbSbZHJmGwTjSNacK3HDm4h3WKaBDTWaELYTx2M\nPZnoNS3YtB4unzwYDjSjaeG2HNp+08\/kMe9Pg2vMHSn3Xv+FGOFhtcDQevyobhkcjSE6GZ3UZgiM\nlg8KRQsyzWZaWmgN3Ewy2UVnsCbSkkMTR5bVFJa+DAWlmU1f1Fx5EHL+EKSj5pR\/+ft5pNoIOSM3\nQ+1nK6aOx6rpE7BJbxo26EyFo7Yq1mlNYrRWUwWrNSZgtfp4OKiPg8PMsbCf+Tns1ZRhNyR7meh9\nItqH6UvG0LFrNFTIPBPJfJOZuekaK6aNxzqNKbBRGf3OpPmUaNx8zZl8S11NUFnpaYKtr4VFs7Sw\neI42lhhqYxlLB7ZGOlg1Txd2xnpwMNHDWlM9rFuoj\/Vm+thgboCNFkSk3UCuHcn9tUSrSR8H0t+W\npQkLjUkwmzkRpjNUYDxtAoyIGYaTx2H2xLEwUBmUqqqqJeH5RAanSDR6zJgx2prq6pBJW1MTutra\n0NfVxSx9fcyZNQssQ0MYzZ2L+fPmwcTYGKampli4cCHMzc1haWkJKysrWFtbw5q0VuTawsICZmZm\nWLBgAUxNTGA8fz7mGRlhLosFwzlzMNvAAAZ6etDT0YGOlha0NDSYtdXV1OoJ03iiUXL\/P37n8U+a\nDjLyie84uQAAAABJRU5ErkJggg==",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2011-01\/1294352610-8853.swf",
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
	"trophy",
	"no_trade"
];
itemDef.keys_in_location = {
	"p"	: "pickup",
	"e"	: "examine"
};
itemDef.keys_in_pack = {
	"r"	: "drop"
};

log.info("trophy_street_creator_rock.js LOADED");

// generated ok 2012-06-20 14:41:54 by lizg
