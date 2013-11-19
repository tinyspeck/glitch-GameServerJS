//#include include/takeable.js

var label = "Bubble Trophy";
var version = "1340228514";
var name_single = "Bubble Trophy";
var name_plural = "Bubble Trophy";
var article = "a";
var description = "This trophy is awarded for the plucky collection of all 4 bubbles.";
var is_hidden = false;
var has_info = true;
var has_infopage = false;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 0;
var input_for = [];
var parent_classes = ["trophy_bubble", "trophy_base", "takeable"];
var has_instance_props = false;

var classProps = {
	"collection_id"	: "collection_bubbles"	// defined by trophy_base (overridden by trophy_bubble)
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
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAIUElEQVR42r2X+W9U1xXHaaNWLS2i\napFAirwAxnjBnjEevIJXbAhgUKrQn5z4H0CKFBoopcqEUkFoKKituqgpMm1JKQhhse+YfQcDxtis\nZt9hwDa70On3czOXWlVUVR6bkY7edt89n\/f9nnPfm169YvhdvHgx4dKlSzOvXbtWT2i\/\/vz58\/WX\nL192x1evXg0zpteb\/rW2thafPXt2vyDs9u3bLm7cuGE3b940XTOBueMrV66YgO3kyZMNhw8fnvRG\n4I4fPz7jzJkz7UrcLnU6pFaHlOsQWEdLS0vHuXPnuNZ2+vTpRwJ7eOLEicjRo0cf7Nq16\/6xY8e+\nOHXq1Pd7DE4gC69fv2737t17Hffv33fbu3fv2q1bt5yabFEXNVFQapvA7MiRIybYhh6BU8Ia4LAR\nGMAePHjwOoBky\/k7d+44i6WuSVFrbm520djYaHKAqO1WOEEVeziSA\/Pw4UNrb2930dHRYW1tbS4i\nkYi77usSFYGTciaL3b5sJz7sFjip0lfWRrAM6wBEKcCePHliT58+tWfPnrl9QAEHkHGMp2EuXLjg\n1MNm7FatAhxRncbe4VIuTDd69QgsRi3gXrx4YS9fvnwNyXlvs1cRqwEDFMsJNZDt379\/YXc0Ris2\neQWxmi1WAgTgq1ev7Pnz5\/b48WN79OiRewDAGMvDAQYQKqrzTauAa5jdu3dHesW4EAcE6GxCBRIC\n6tVELSCBQ01sBxCLGUN49Zqampy1wLF\/4MABq6+vt40bNwa6DKjJa\/zCSyLUYB9IALESSGrPNwrK\neosZDxSAgGEtyw7nDh48aFobbefOnV1vluiryiUCkH0AOfbd7C0Fiv3OSw0w2Aoc9zKHt5uu3rNn\nD4DhWBQMMyE2oyT72Mwx9tEEfgskARjnUJnxwDHezwEo0GoQByibuw6oBGFUIEhEQhQkGQDect\/d\nNI9fWhjDfax7gPnw9Ye9O3bssC1btnQdUFA1vmZYw3h6rwZwvoF8Q3jlPAy1h1rUHvdyTPfSHNu3\nb7etW7fa+vXra7oMqMkDvvsIFASYhMD5Y6A49jUGiF\/veDD\/Po6ufbZt2za61zZt2hRbF0e\/Xlqx\nySfFam83W84D17mZfL1y3d\/Lllcd1gIo5YCLxLxQq9vCqOiXCR9eFbbAePsB9B0ffefavn37XGze\nvJmac3CE9mN\/k6hm+krFCLXkX1ckB5Jjv+9rs3PwYIBRb8CtWbPG1q1bZ6tWrXIWS9Hu+drWolpD\ncQNJLfrO9sDeZt8c\/hz1h6U0BcqtXbvWBYB6zYW79ZNLxV3L4kqhk5gAGJX0VeJqzJ\/DVh5o7969\nrt7oVtSrq6uzlStX0hw989EqyPChQ4eMAIDXFfsUP8dEQ0OD6f+HW4RRTW8K\/851of06Kdy3xz77\nlbBG9jjr2ALQOYBhAWYf9TZs2PC6OfQwtb3exE9WLyQhIN5CQDgHDEp5MNY6QmPqexyMr2t959XR\nCNQacEuXLrVly5a5wqdDWT5oBOptyZIlVltba8uXL3eQKokGLVeBHoHTUjFJHRyhGWgUag8FV69e\nbYsWLbJ58+bZtGnTbMqUKW47a9YsW7BggS1evNhWrFjhwBlP3cb0BfN1vw+qq8M\/nTrVpn38sf1s\n+nSbMWOG\/WLmTAt\/8onN+vRT+9Xs2TZnzhyb99lnNn\/+fJv\/+ec2d+5cm63zjJmpsdN133TdzxxT\nP\/rIPnj\/\/e6rx7zs7HqFdY78ESOsMCfHRubl2aj8fCsiCgr+EzrmPNcZx\/j\/nqPbAAPp6RYcNszY\nZmVkWHYgYCOGD7cCEitGCai8pMRGl5a6KC0qsuKRI62suNhGCrIwN\/crwFDI3Ts8M\/Orh8zKKu5W\nwJysLJeIpEWFhZanfSDGVlTYO5WVNm7MGBs3dqzbclwu2BLBFgmWhygQaEhzZAswFAzysLEDZqWn\nBzJSUy2kJ0cJLEMhEo8FSkATxo+3iRMmuC3H7ygqR492W44ZV1le7u4rHTXKcqIW52Znx\/7nnacM\nSD0sxU5UKFYSlBtdVmZjpJ6DkGoTBDlp4kSrqqqy8ePGufNcHxtVE0DuR02ckCuxd3MwLW1SjuAA\nxNJC2QugBwUSkB+\/+65Nfu89+8nkyW5bJVgPyBjgKAvgRkUbKD8Uiv1zSwUdprBzUZD6k8Ukohkq\nZNt4QVTJWm\/nRKmHYmUoJpVRukwNVBIF5H7mYT7NG\/vbJTMtLZyWnGxBdS9NUhDt2mIlIyEqui6m\ng6WUD46BA4wx1G+h4Fznq5ujdRgbYHV1dWBkbm4EBb3NPDkq+MiPrnF+uSkRDF3rlXJlITjA3DKj\nDs5S6MHdkkOOLsEl6hfIyIhkaIlJVxcTQU1MDGeJ0OTshwRMZLN8KHIEkSuoEVKIY8ZpHktLSbEU\nOZE6dKgNExxzELr2cMCAAWlK+db\/y\/ZNxfcS4uJ+PjghYd+ghIQDgxITDyUNGnQkLTX1WMawYceD\ngcDJUCjUmJuT06Q18bQUay4tKWkpLy9vqayoOFNZWdlSWlraUlRU1Jyfl3dadjZlBYOnMtPTG1NT\nUk4MSUpq0HxHNf\/hQfHxB+PefvuXyjlAwXfit\/4X3LcVP+jTp0\/K4MTER0kDBxqRnJRkqXp6VERR\nFFFCy8Z2FMM+3hbqzAK6U5EniznPdRRmfECKe0eYj3mZX7naevfuPUK54xX9FL2\/Du4biu8ofti\/\nf\/+ygfHxv06Mi\/tNYnz8woEJCb\/TRH8YMnjwnzTpX4YmJ\/81JSWlVon+Jrv+kZGR8WVmZubSQCCw\nLBgMLmOrc\/9S\/FPXl0j5v2v84qFDhizS\/V9onj9LwT9Kwd9r\/t8qz4J+\/fqNV+44xY8U3\/WW\/xtQ\nZbAccod6CQAAAABJRU5ErkJggg==",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2010-07\/1278111998-9552.swf",
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

log.info("trophy_bubble.js LOADED");

// generated ok 2012-06-20 14:41:54 by lizg
