//#include include/takeable.js

var label = "Cubimal Series 2 Trophy";
var version = "1344290836";
var name_single = "Cubimal Series 2 Trophy";
var name_plural = "Cubimal Series 2 Trophy";
var article = "a";
var description = "This trophy is awarded for the cubuliscious collection of all 20 Cubimals of Cubimal Series 2.";
var is_hidden = false;
var has_info = true;
var has_infopage = false;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 0;
var input_for = [];
var parent_classes = ["trophy_cubimal_2", "trophy_base", "takeable"];
var has_instance_props = false;

var classProps = {
	"collection_id"	: "collection_cubimals_2"	// defined by trophy_base (overridden by trophy_cubimal_2)
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
		'position': {"x":-19,"y":-39,"w":39,"h":39},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAALfUlEQVR42sXYeVCU5x0HcKdpJ5lk\n0nSaTNukk5oEOURB7muBXfaAXY5d2INrF3a5YVl2WfbgEFhF7lMBUZDLO6IGPGK8VzTRRBNRazWn\nJmmazDTN2M600\/737e99OWoqKNimfWe+8yww+76f535eli1b4nXxkyLu+Vv5484beVMHj2ud2\/rV\nzq42hbO9ReFsa050NjfInA31Cc6K0nhHW1e8o7FdrB0+LOEOHBZx+8eEzy37Ia6rX1uWX75rNL37\nseHu0TMFGB7KQGO5EutMSag1JqLaIENVsQyVeinKCxNgK4iHJT8e5tw4mHJiYcyWwJgfjfIKIWrb\nw9G+k3OvfRfH2TIa4mwaCXQ2DPk51vf7aMv7X1t6Ba5\/ZdFe\/dx878odE4ZH1WiyqbChTI66UvmS\ngAadBIUZ0dAow1FgX4WOXRy0bg9B00gQBsaFeP24Al1DQseiYbe+reTe\/Lrcef0rKy5\/asKW7jQ0\nWZVosCiWBDToxMhJ5SNVGgaV3A\/aAi9YGnzQMhqK3jEezlzV4tgFLToHRRThvUfC7vx97fKP\/1Tt\nvP3HKtz8phwM8OxUPrYMKNDkkKLOnLQoIIMrSBciXRYOjcYfxlofNAyEoodQvft5cF7LwuXbBgyN\nSVlcQ6cAjqYoyGN9ly+Iu3tvrfbOvVp88l017gde\/aIMTBe\/fUuPA6fT0bNFhra2BKy1xcBqEMCs\n58NUGIWSfB7MRi7Kq7iw2CNgtoZjbWsI+vYLMTAhokTj+GUNbtL9DpxIZWEd24SoaxIgL4UHdSIH\n8pjArgWBVz61gckHn9kwddeOG1\/YcfP35bjxpY1KJlZc\/8KMa5+X4v1PS3DhVgEmb+bh5FUdDl9K\nx\/jbKTgwqcK+s3LsOZWInccTMHosFkNHxDhyMRUffWNju7N7NAbtA0K09QvQ2s+HpVA4B0yUBMwP\nvHzXxp0FzubyJ1a897EF735UhksfmvHO7VJqRRMuUvneR6VUkTJM3SnDra9s+PAPdtz5tpIqUYZr\nd00UI\/3NiKuflbA\/v3khE327YwkmmIZt5aOFUt8qgDFT9K8WFAfNP1GufGZ1HD1dhLfO6+dFXfid\nCedvGjH52xKcu2GA83oxzl7T48xUEU5fLcSp9wtw8ko++\/ncdT0u3S6hShhZ9O4jiu+hWrZEobkv\nCk2beVhrjlkc0JYnHjFpo1GQxoejOoEmRjEuEOg8gSYJdO46oa4RakpPiCKc+qAQJwl1glDHL+fh\nrfdycezdXLx5KQdHL2bjyDtZOPy2jgWOHJBNoyhNfTwW1tjLRQNl0UB7ngSzQJ0yEqYS\/mOjDtE4\nGz+fiTcmM1jg0H7pNGrzNKq+JxL13ZHY0B0Bky0Ihkz+0oFptG5t6BIugCLQJQJdJBChDhFq4j7U\nwXMajOzMwOa+FBw\/YUDb5hg0MKieaVTdpgis3xjOpqI5COoCd+jSQpYOzMoLeChq7JgWew9lYs9E\nJnZPZGD3uAZDwwTbqIEpixboZGotWypkQl8o4vxQYglmUeu6OHB0clDbGYbajlBUtQQjo9gdyUrf\nhYEOW+yUzSCEuTQSen0Y0pNCkZGz5oGum6BWGp+kljqXgb1HNLRoJ2NdqQLVJUmw5cXBkktbmy6G\n7bL7gQl8erhsDcEYVBhq2kNRzaQthF0rGWR+ccDCwIlJrXPslBqbdsmw7Y1kDB6UY+SQ\/AHUQacG\n+8+qMXYmHf1bNbDmSFCqi4ZRK4IhQwi9WsD2wv1AtSyMBWqzfKdhs6jWYFQSjOnmiqZAFFf4QCpd\nPT\/w6DtZTkenBOk0DlITQ9E2LJ0bTwec6jnUvtNpeP1UKvaeTEFzrRKWbPEjgVpFBAtMivVlUUxr\nVTIoSjnB7I2UhgDYGvyRkuNumr8Fz2eOFBgjUEAPyEvnw1DDmxe150Qydh9XYccRJdbS\/jsLTI0P\ngSjCC2LeGnCDPeYFxkX5ICPTj0WVM6hGBhWAMisHBnMQLBv8YF7vy50XeHBS4ygoC4cqLhhKinF9\n1AOoXW8pseOYAtvfVGBwjwpVRQlzQH6YJ1u5Qo0QvJCVCwIl3DXIKfJlW8ta7w9bBYf9fraKi5xC\n\/4WBXevSHVUdAqTkBUJdHIzeCQakws5jhCLQ9qNyjB5JwsjhRAwfSkTf1lTYciVzQG7wSuhUkcgi\nVEykFzQ07hYCCjmrkZHrhbI6X5RU+s4Bdbn+KKnxmh\/YYk92dLYpCCFfEDU0IcPguJQmUQK6e1X\/\nBvRAHN+H4st+1hFqIWBMpDd4YTQMzF4E8kauLogFZmb7omhhoGqcOZB2dksJI8MwoYaoHJwg0HgC\nBgjVfzAeWw\/EYcv+WHT0xH8PWEjjlnkI21XJvId2MQPkh65CeJArso2rkal3R5LUGxlFniiq9Jgf\n2GxTOhlgo1WFjk1SwsQ9gOobk2DzPjF6X4\/Bph3RsBeKlzSL7wcy3Rzm74rYeHcUlHsiw+CGPLvn\nwifqWWB9mQKtVWp0bovBlrFYAkkIJEbP3hh074nGpt0ibNwlRNdOAdZvED0WMCrUExx\/N\/AFLkgv\nJGCFJ5t8u4djUcA6sxzN6xTY2JtEJ97vozp38NGxnY\/20Si0jfBgLeOhJFP4UGAKrQqzQKblIkNd\nEa90gabYDfnlNOPtFJvHyEPfRRwGmbPWIEUNpbpYSmsclYZENJWnoblJhlbCtI3yqOSiZZiL5qFI\nNA1GoHFbOLIygx8KnN3qRISLCHSHVOmKXBtNErsHW2Zb3R79NmfWiUzmrGiYdNMxUkro8GCgmGg7\ns1tEtB3RNrUxBDWbmASjtpvSQztDRyAy5KEo1ggeAK63JFPL0bijRZwb5IFo8QpoTW7Isbkjy0yx\nuGkX9ZqZIw9bnkPrGJNsOs1kMWsalczJJpPGEJMsmp052nAUFXFQWOEN47o1FCrXe6OwcjWkSR4Q\nCd3B57ohgmZoGI0zfWY0omjhFvLcIEt9DRrDCmRb3KAtckOazANLeklPiQ2QqcSBI0pxoFMZGwQm\nCgmTQLZMEgdSgpBIpSqRoqMHmTwo7tCW0pnOzJSuSNevYJOmd0HPgAyq7NeQXuwCrdkVOpMrNGp3\npMWtRFrsyvH\/6F8eSdG+axKEPrJ4vo9Dr6bzoSqUjkOBENNgF9FSIRJ4ID7tN0jUvoIkHSXrFciz\nlkOePR1m6ahqCUJWmRsy8tygTpuDTaVJFljvHvfaXBuF+VJnDZlJMGrMgTDqqcv1XjAWeaEo3wvq\nZEIleLCw1FiPu2lxHtof5B9Im2t5DjY1vJHeGp6TyULo2awtDJ5uMUqymHYL0Qrusv\/lVV8S4Kw3\nBqLJHIzmshC0WELQbufMxaz1gzLGDXKRK5v\/G3ChFKf7zOGYFCR7TlUX+I1vqozU\/pCuH1Oetep8\neNRqXy4WmCJxA+GwozmGfu+L9NiVy\/9boJ9QXqC4UHwpEWatT3\/\/Ov5fe6sjsRhgtnwlOqjLtzeL\nkafyZsdkNGd5K93rVcrzM5Ve8vUU5SXKKgZFSaBo7bkB53a1irF\/Yzz2dcZhpEGEwQ0CdFdFYGNl\nONqsoWilsdhUGowStQ\/Kc3yxrU6AkUYxtImrpieMxP1vL77wjHnmnhyKJ+VXlCeXgvs1xZsSRVFS\nCihV98\/S\/vUCDBNwV5sEeztiMdY1jX6jR8pWgMkOarUNRs7cbFaJ3f\/x0i+eYQ4GlZR8ioLCo3jN\nNMiikE9TXqb4UASUZEoRpbrFyvnLo5aXWTwDvx8Xz3P588+efXI\/3aeDqexMpZUzjeA90yhPLbYV\nn5lBes\/UMInZsl1efq5eJnSZyE9ePVVnDPnuUVCz1p\/FSSJf\/eapJ5\/oo3vUUcoo2ZRESiTFY2Ys\nPvE4Y\/FHM9gXZ27kR4mjaGa6yPTznz5VG+7\/0mCi0GU8W+l5jkmOcpUzV7XqDDfw5UO\/fP7pqpnv\nCGYmGjM5np2590OvfwK24cfx5uU5WAAAAABJRU5ErkJggg==",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-07\/trophy_cubimal_2-1343351670.swf",
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

log.info("trophy_cubimal_2.js LOADED");

// generated ok 2012-08-06 15:07:16 by martlume
