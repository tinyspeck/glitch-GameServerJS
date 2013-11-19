//#include include/takeable.js

var label = "DR Music Trophy";
var version = "1340228514";
var name_single = "DR Music Trophy";
var name_plural = "DR Music Trophy";
var article = "a";
var description = "Let it be known that this here plaque award thingummy honors the finding and collecting of all 5 DR Music Blocks.";
var is_hidden = false;
var has_info = true;
var has_infopage = false;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 0;
var input_for = [];
var parent_classes = ["trophy_music_d_red", "trophy_base", "takeable"];
var has_instance_props = false;

var classProps = {
	"collection_id"	: "collection_musicblocks_dr"	// defined by trophy_base (overridden by trophy_music_d_red)
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
		'position': {"x":-25,"y":-50,"w":50,"h":49},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAJYklEQVR42rWYd1DUZxrH9+KQm1Mv\nOSxgL6CIdJalbWGBBZYivSwd40kkylniZC4SBBSwETyNZ4I9N8oZxS7RU+dEUZEqRbE3VGKLZzK5\nmZv74+Z7z\/OyPySWGBZl5jPL7O\/3\/t7P+zxveX4rk73iT6PRaNVqdf7bRqVSZchM+ePG3u7uUHp5\nvVWojyqTBY0PeGuovL37Ljg9PQ0P797Eo3u3BA\/v3RQ8uHtDcP\/OdcF3HdcEnbe7uHfrahc3r+Au\nc+My7jDXL6GDKCle3OcI7pUEH3d24OuN67Fl47ouNkiUCTavf8YmwVddrJP4EhvLntHWVIsVRkGl\np+dTkwQp\/FWcAkkwLjr6F9H5+QnCw8Jee2\/VscM9BdFnwUedt3+xwyhdAK7J\/XBf7o8TnjpER0a+\nXrBoUfdCMVmQG\/\/xNYKR4eHYr9CiSe6LvXIftJPoJt9gxMfEvLLN8aOHcWDXN29GcMH8eXj83ctT\nnEASWUoffC\/XYZ1cjQZtOHZpQ\/FUHoA5oeGIiYhAkE4HjVIJd1dXOE6eDPtJk7B3Rzn2k6DYxvqS\nYhZcuXwJLrWde0HMEBeHmCA9zlPkWChH7o3H9LnSVYUfh9qj9XejoHFwhKujI5wdHLrlmLI1q0hw\nex8FvbyquDELnqo69kwuNhaJ8fEihesVGhG9H0isbLgNlr47GOUDRuIn2TD8S2aJzQNHQEGRc3N2\nhguJOtnZwcHWFosX5mB\/xXZ4KRSmC1LD5ucFDSyXkIAUgwFZal88oEXxyEqBq7KhmCcbgIWy3+MJ\nyUmCD2QW+HD0BHi4ucHNxQWuTk5wsrcnwc+wjyKo9PAQc9DNze39Xgt6k5w3Nf7LiqU4dfyYSCtH\njuUiaGGcdFLj7sBxuCAbgrwBw3DL3AbfWNjg3yT3I\/E9Cd4nwfOywQixdxKSCpakSBbmkSBFkAMg\nNmtvb22fBKtJkOdcMsklEUvH2+FaPwvcpshtkf0Bu8wssE1mjrlm5vjKfCxKZO\/hIcndk3Xdc+S3\nlnCXy7sjWZifKwRVfRHk0bHkqpLlqKYUJ1FqOb36sVYiKpcpcjeI7SS4yXwc1sjex8kBo3FINgi5\nlOpOkusgOb6H7y0YOgZelFIWLcpf2CUoFQymCjKrP19BKT4qFoUDTfJyik4LSbST5BXqmD8\/MRuE\ncopiGS2QZWZDBLeNctI9rdQmeaIdPGlhFBUsRHtLA9R0EKj6Lrhc7Py84pL69UcdpbKJOms1SnJ0\nOKK1Fraos5iMrebjcdlsOK4ZIyfJcZuD\/QZB4+SM4kV5aG+u7xLsqmhMEDSek6tKlqFybwWchlqi\nktJ4hlLaU\/ICCVwkiihqO0nuW0rzTfMJ4rsLPeTqqU0NsWyENYoL8nChuQ5q2sA5gu4mCxoXycE9\nO\/DR2Ik4QXLVhCTZSB03G0V3mlth2ygHVNBnm1GMr\/E9dUY5bvtpUKiI4PlzdeKE4Qj2WtDDw8NZ\niuDh\/buxtLBATO697w4RkieJ08RZ6rTeKMpROmekySjG12qJM8Y2O0fYIJqOv7SkRJynkstXrRaC\nnu7uc3q3xdCklSJ4aB8JLs4XZ2mcSoO88GgsioxFYXQ8lsQlYllCMlYkpqI0OQMrU6cKSlMyUJKU\nhuWGFCyle4piDVhE989LShFCLNjWdBZaoyAFJN80QYrgt\/t2YQkJ8pHlyWU6fc8P9vf1RWBAAEL0\neoSFhorNO4rKLCaSojSF6sKQ4GAEBQaKOtFXoxFzzpu2mtREA1obSVClEs\/rkyAvEJ4zvMHyRsvf\naejBvj4+0Pn7CwEhGRIipBgWZjl9UBACqJrx02rhw9GiZ\/IgUwwJaG2oQXCATkTQyyRB4zZTuadC\n7Ft8jvI89DJGkTvkjoUkRZJlgklUQP+zeABd40hre0SPB5mcEIeWhjOYlp4qppGXyRGkBx7cs5N2\n\/ly4UMkkRZE74j2MJedmBWP2dD2y04MwMyUAHyb6YVq8BjPokwfAcrxaebC8SfNUSYyLRXP9GXyQ\nliKOU6WpgixyYPcOUX1wqcQHvaKHZGy4D540paDzWCyqlinRVuaP2tVK\/LPEFY1rfJAa4SMGIsnx\nQpNTJgwx0ThXdxpTU1OgNEWQ3\/ZF6CmdXJpz\/cZ1HJdKnGqWLJgbhOtHk\/DfO9PxU2s6ihMdsfaD\n8fjrDAV259niwtc6dO6Mx9bSuGdyVBdy8RofHSkEM5KToOQBeHltMemdmAW58mVBroS7JSmSZYVh\neHIqCf97mCUE180Pw9WtetRvCMQXmXJcqUjG00NpOLA2tqvMooFJlXVsZASaak8hnbYbFqQ0V5kk\nyCX5voq\/Y9aMzO5yXUhSur9cFPJzwWxPIdi4Xo1V6SNx8\/DHQvBoebqopp1pYNyWn6FVKdF4thpp\niQlQdR13pguePn4ECdFR3YISawv06NgX1S1YlmklBCsXO2PzJzpcLI\/A4wPJOLIt7WfvIxIsmGp4\nA4KX2hppzrwoqFM5omi+Lx7WJArBo2vS8Y\/VqThUGoXqDcFiDh4pDUNilOcLbZmGmpPInJohFgm\/\noJk2B2lyX2xteKkgY2djg8\/z\/FCyQIvimd7In6bAp2lOdKTZIifdFRF+Li9tx9SfOYFFuQv6KEjb\nycWWBrHqXtWRqbBgwWcLxEnS6xQrlcp8cQSRYHtLPdVuBJVHXCJxFcI\/\/rTRWcrnKR9ZLQxtvLz5\n8vbB8Cptqq0Wc63x7EmR0oaaE0KMqTtd1SXIJ0xvf+ESv8tQQxZcQufwEiowi+m4k+B3Cj5dJArz\ncsWbmgRv7Lw1CXJzKJU5Ip0MS0lIi6TXP39Igm\/711VGTYVHrwXDVPLmJI0jcoLtkKOfhFCVHCEq\nxRslWy\/H4jA7ZOvsEKx0w58DrH79y\/sc3wlV8\/wm3PrYfyKytdbIVI77YZaPdc1Uz7HIeI4stVUD\n0SgxQ23VxPD\/szTWnfQs9ISed2+21rq9cIo9+PkMfd+c7Tfe+de4DSRGElbEZMKF8CR8rIf0nzHF\ncThC7YdBP9kSAbYWUFkN7qBrmUQWMZP4EzHb+JltYzFgpcFtFJIVo5HmMQY8QIN8VC1dm0IEEb5c\nmxBuhAMxkRhDmBO\/eV7uPcKSmEQ48asJixGBRHiM8\/DKTOV4TPMeJyKXSh16jDWvpGuFRAnxBbGe\n+BuxkVhLlGqsh\/zHf5IFAmlAejtLMcD+Zu98RNcMRBQR3EPU0Sg4zCj5zv8BcR2Ifzmb2L4AAAAA\nSUVORK5CYII=",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2010-07\/1278112443-8940.swf",
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

log.info("trophy_music_d_red.js LOADED");

// generated ok 2012-06-20 14:41:54 by lizg
