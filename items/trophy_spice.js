//#include include/takeable.js

var label = "Spice Trophy";
var version = "1340228514";
var name_single = "Spice Trophy";
var name_plural = "Spice Trophy";
var article = "a";
var description = "The paws of the individual holding this award are deserving of your praise, if you consider the collection of all 16 spices praiseworthy. Which you should.";
var is_hidden = false;
var has_info = true;
var has_infopage = false;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 0;
var input_for = [];
var parent_classes = ["trophy_spice", "trophy_base", "takeable"];
var has_instance_props = false;

var classProps = {
	"collection_id"	: "collection_spices"	// defined by trophy_base (overridden by trophy_spice)
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
		'position': {"x":-25,"y":-50,"w":50,"h":50},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAHt0lEQVR42s2Y+VOU9x3HN7D3LrAr\n53LuxbWwLCAICrJC7EwajcREYhLvRM6AoKIYFVHjEQREIcQDEc144KgBplc6JMVOMu2kccTEOI6x\nio098lN38he8+\/4s2GnSdqYdWzY78\/aRZ5\/jtZ\/j\/f08j0LxhJ9qq7p8s1M3vDNNN74n3TC+L8Mw\nvpvbHfx7o0O7psquCFME6lNtV3W3pOqwP8OII54QnMgJQ39uGI7lhOJwVgj2ugxoTtaOBwSyyqpu\na3JqsYcQJ2eb8bMlbny4KBUfFEficsEsDMwOQxchW9P1qHdox2ce0KbBpmQd3iLgiVwTRoqiMO6N\nwW\/KLBidOwtn80z+qDLdaOQPqbUqvTMKWGPXYINDi9Y0PTrdTC9Tey7fhKE5ZrxHOElze6YR21P1\nqOOxMw5Y79AMVzKKkmaBPEgYqTuJmqRW6nIH92\/g9ywH34ynuIWFX2\/XTFQTUiIk6W5J0WEbI7aV\nWwGXKFfb1L56m8oTkC5usGq9zQRbl8QU+mE0kNqUbaVVjbXc\/2q8ui1gNtPo0A5uTZb0hqJ3vo2p\nNbFpQmgtejQ4dFidqMbiaOXEQnOAvLDZqfdtIUxzsoEpDmG3GlFp02FNohYvx2vwUpwa5TEqlJoU\ngUmx1FazUzfezgiOvpiPM\/kR6PGYsSPVgFqbFstilb5no4PLFYH8VDB9y+OUvtUJKtabChWxSkYt\nGE9HBmG+SeFV\/BA+lVbN+OuJGqwi5PI4FV6wqPAcIX8QcJuY5s0Ona+Jpl1j1WBdghor4tV4KVaF\npTHBawIO2JbKKYaG3JrGRmHn1hFyPbt3lR9S6aswB3CaOZCm9R50GXGzqwW92WZsZ0dzxGKDaPAa\nIV+Nk5pUDQYM8JDLMHiYS9zVIgve8ZjQxihuoXE3sIMradIrGcUKNlDAALsyjb6+7DBcKozEUXco\n9nFy2UbADXYBnKpF6eqKGGVguvmw24geDgZ9HBCOcqLZT8A3meZGRnA9AV+RjvY3S8AAQ3wCeIyA\nPX5AIyOoxxsEXEvbYf3RbpRYHBWglaTLbezu9YTiWHYoI8kUs2Fk6ath\/a2gaYth\/ygyaCJgNciR\nalzspTMz5DuA1VYtDVuNZ6KVWGJRTZaZFEmBAaRB7yXUUVrMZW882t0mTtBGNNinBoa1tJrnYwM0\nLMigsCVFP7k1RY821t67OWaO+WZO1CbsZFTr2MnLGEVpkkWBWFHqrZpGmVqOZIXhVF44hmg1b7vD\nsCcjlE9yIdiSYkQNm2VFgsyEwcMzDrgqXundwKVNzLnXE4ahZ1w4V2r3R\/IQod8kfBUBX4hVY2FU\n0MxP1TVW7fhGp46jvY4gej6PGPza5J+m2Sh2AxtEjaUEXEyrCcS47+\/gDvrfyRyuJgURGCoIx+nZ\nszi0mrCLpi0RXkM\/XMo6nHlAWswusZhpwAv5Zpyn5PVHB21H4AVQHpxmFHDy86ttX312EfsWZTGl\nej4kGdFFSDFskQCL9Uh31043yXMWJUZOv4UvPzoz8eDjof+P5fz1\/ljYo9sjww9uXoEAjpzahZ3l\n+WjOjfE\/g7SlT2k7\/7+ZdbiOdVnhCMOLmbGoWlqC7t11+OWFTtz7ZMj36Ppo4\/8U7u7Hxz0PJy5N\nPLgxhHu\/O4+7v30Ptz8ZxK1fD+DacDdGzuxFf+cm9OyrR2dbLTpaq9HZWoUz3c14v78NYxcP4YsP\nB3Dn2lkCXsDDT6\/g6+tXhu+PnXjyYbb62YLys\/srfecP1eJCRx0udjbgUncTLh\/ZjKs9WzHatwM\/\nPd6GX\/Tvw9jpdvzq7GFcO9eDj7gdG+zABwMH8POTe\/ETHiPHXu1t8Z976XATTu1ZP2FXPOHEvSAy\naHI1U1WdFv5PqqUa0iPQ6IpAU0YENlGbp7WRauJ++b4uPfxfni9aEP4Eq8zcUMWc0shgPJYs\/tKR\nL8dPvdaoZhPIGwSpOWkYqT+pR9mKUcvg0ESvlGXvdT6rrEyQCXtqBFsYNXVNb0TwKG\/11H\/LpqHp\neghySy6ykJJOXD4NJjcUKLGSA\/J2lZOM2Iu8ExS7OUcN5Jr4GBDq90np6m38AY0OMXatH1TWaPnB\ncv2tTkMT76n\/T8CCKdOPo5VlvOm363mxVTTa7ZnhOJAbjbepQ7Oj0ZkXje68GBzNj8E7cyx4t8CC\n49TJwlj0T+tEoQXHuK+P3\/fwuCNUF8\/p4PntvM5Ban9OtP\/6uzls8Aef5r1jKNW\/g1NTZotakeaN\nCPr2H1PrjyJTsoipkfFJ3rmIv8kqIamTNVc87w2OWY8lUZZhQSL2GqMuIK8wA8uY4iXMhkSv7Hv3\nKDQH9ZAhUTHVOE99H85ExdoSE684bTY8VorDgWy3G\/MKC1E0dy6Ki4pQUlyMkpISLKBKFyxAWWkp\nnhaVlX1Hsr9U5PXCy2NL5s\/HfJ5fPG8eCvLykJ6SglSnE8l2+9\/vZ4mKWkmOBGoWFaSY\/sdIRRkM\nBrc9MfFT6jOC3rBbrTeddvsXyU7nl6nJyXfSUlPvutLT72Wkp9\/PzMiYdGdm\/sHj8TzKyc7+U25u\n7l+ob\/Lz8r7Jo2bL3zk5f872eP7oycr6msc+dLtcDzJcrt+70tK+Sk1JuZPidN52Ohy3HDbb57ak\npBu87\/WkuLg+stB9FBbK8Df9XvIkPHBH\/gAAAABJRU5ErkJggg==",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2010-07\/1278112465-6139.swf",
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

log.info("trophy_spice.js LOADED");

// generated ok 2012-06-20 14:41:54 by lizg
