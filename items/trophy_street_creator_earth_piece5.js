//#include include/takeable.js

var label = "A Piece of Street Creator Earth Trophy";
var version = "1337965214";
var name_single = "A Piece of Street Creator Earth Trophy";
var name_plural = "Pieces of Street Creator Earth Trophy";
var article = "an";
var description = "One piece of a street-building trophy. Five different pieces of this - the Earth\" Trophy - put together will make one whole ornament. Heal the earth! (Trophy)!";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 50;
var input_for = [];
var parent_classes = ["trophy_street_creator_earth_piece5", "trophy_piece", "takeable"];
var has_instance_props = false;

var classProps = {
	"collection_id"	: "",	// defined by takeable
	"smash_green"	: "400",	// defined by trophy_piece (overridden by trophy_street_creator_earth_piece5)
	"smash_blue"	: "550",	// defined by trophy_piece (overridden by trophy_street_creator_earth_piece5)
	"smash_shiny"	: "700"	// defined by trophy_piece (overridden by trophy_street_creator_earth_piece5)
};

var instancePropsDef = {};

var verbs = {};

verbs.smash = { // defined by trophy_piece
	"name"				: "smash",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_single"			: 1,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 50,
	"tooltip"			: "",
	"get_tooltip"			: function(pc, verb, effects){

		return "Smash this trophy to receive "+this.getClassProp('smash_green')+" Green Elements, "+this.getClassProp('smash_blue')+" Blue Elements and "+this.getClassProp('smash_shiny')+" Shiny Elements.";
	},
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if(!pc.checkItemsInBag('bag_elemental_pouch', 1)) {
			return {state: 'disabled', reason: "You'll need an elemental pouch to collect the pieces."};
		}

		return {state: 'enabled'};
	},
	"handler"			: function(pc, msg, suppress_activity){

		var failed = 0;
		var orig_count = this.count;
		var self_msgs = [];
		var self_effects = [];
		var they_effects = [];

		var n_green = this.getClassProp('smash_green');
		var n_blue =  this.getClassProp('smash_blue');
		var n_shiny =  this.getClassProp('smash_shiny');

		var remainder = pc.createItemFromSource('element_green', n_green, this, true);
		n_green -= remainder;
		var g_destroyed = remainder;

		remainder = pc.createItemFromSource('element_blue', n_blue, this, true);
		n_blue -= remainder;
		var b_destroyed = remainder;

		remainder = pc.createItemFromSource('element_shiny', n_shiny, this, true);
		n_shiny -= remainder;
		var s_destroyed = remainder;

		var result_string = "You smashed "+this.label+". ";

		if (g_destroyed) {
			result_string += g_destroyed+" Green Elements were created, but destroyed, because you couldn't carry them. ";
		}
		if (b_destroyed) {
			result_string += b_destroyed+" Blue Elements were created, but destroyed, because you couldn't carry them. ";
		}
		if (s_destroyed) {
			result_string += s_destroyed+" Shiny Elements were created, but destroyed, because you couldn't carry them. ";
		}

		var produced = [];
		if (n_green) {
			produced.push(n_green+" Green Elements");
		} 
		if (n_blue) {
			produced.push(n_blue+" Blue Elements");
		}
		if (n_shiny) {
			produced.push(n_shiny+" Shiny Elements");
		}

		if (produced.length == 1) {
			result_string += "You received "+produced[0]+".";
		} else if (produced.length == 2) {
			result_string += "You received "+produced[0]+" and "+produced[1]+".";
		} else if (produced.length == 3) {
			result_string += "You received "+produced[0]+", "+produced[1]+" and "+produced[2]+".";
		}

		pc.sendActivity(result_string);

		this.apiDelete();

		return failed ? false : true;
	}
};

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

	// automatically generated source information...
	out.push([2, "This item belongs to a collection which grants you the achievement <a href=\"\/achievements\/trophies\/street-creator-earth-trophy\/\" glitch=\"external|\/achievements\/trophies\/street-creator-earth-trophy\/\">Street Creator Earth Trophy<\/a>"]);
	return out;
}

var tags = [
	"trophypiece",
	"collectible",
	"no_rube"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-16,"y":-45,"w":32,"h":45},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAKJklEQVR42s2Z91PUZx7H+e3mfrjh\nT8jMnbEroiKi4tKb9Kq0pS7FXWEpQQRcCx1cmiBNEBCBVSkLi0tdFESjIESjMYmEXEwwSFlNv+Qu\n7\/s8D8FccrncYNbcPTPv+c4szHxfvD\/1WfT0dHSam5sNGhsbY1QqVUvjhaaxiQcPMPvs2cSnz55p\nSLWzz5\/LZrVaA73f8ywuLuo3Nyti1FfUj5QdnejqUr3QoGYIU48fc304M4O555+BIPFEq53\/aG6u\nYGZx8bVXCpedmxvT3t4x3ansRLfqCnp7+jDQP4jBAQ00g0MYGBhEf18\/etS9HFjVqUJ\/\/wC6r6ih\n7OxCbU0tSopLavPz83ULqlAo9OUFhRONjU38xb29fRxo+NowRq+PYnT0Bm7cuMmfI8PXMTR0lcAH\noL7Sg05lF8hxlJaWoaqqGtXVNewzrVKplOgETq0eNCgtK9O2tCigUnVzh64OXeMwt2+NYeLOJCYn\nJvHW5Fv8eWd8ArfevI2RkevQUMiZu\/19g0hIOgzP\/fvh7u0NFw8POLm6ar18fGJ+E1xVVZVLQ0Mj\n6usa0EUhYnDMobuT9\/DwwUNMf\/AhPv7oY8x8PIMnnzzhz8d\/pfyjzx+99wgP3n4AVbcaWbl58PH3\nx26BAJu3bMEm0lYjIzi6uspeGi4uKclAmpD4Te25OnS0K6FW9+DWrdscbOr9KQ7y6cynmH86D+2C\nFs8Wn\/HnwtwCh1VcvIz9AYHklicc3dyww8QEf1616idycHFpeyk4uVzxR1FU9KOg0HAcPXYcSsqj\n8dvjuH\/vPneGwc0+meVAX3z2Bb764it8\/eXX\/Pn5888xNnYHYdEHYbjd6N+gmP7y+utYvXYt7B0d\nNS8FKJHGZ\/kGCBEWEYXAkBDk5p\/CJOXau++8y8PHnGNwX37+Jb7723fAP8D1\/d+\/x7fffIu8gkJ4\n+vpxkFWrV\/+gNVi1Zg1eJ61dv4GFF24+Pivvkdnykk1+wqBv\/AKDEBoRCb\/AQJRXVOLeW\/e4eyzn\n5mbnuHP\/CresSfq9qFgpjCikzKXV69ZxrWFav56LhZ1y8uUK5KJSWeBDfz0DDAgKhm9AAKIPHcI4\nhY3lHiuExflFzFCezT6dw\/z8AhYWFvH+1Ad4+513IMvIhJObB9Zu2MC1bsNGrNvItIlr\/aZN2Efu\n+QYGrhywb2xMf\/D6DW0rNeFL1GQjxRLs9\/dDSEQE6uobOOA4tZGqc+dQVV+HptbL9HsdaFV1cclL\nSxEcGUUQm7F+82Zs4DLABgMDbOTago1UwSZ7TOEfErLyAunWXBUOUOO9RtV6g3pa3\/AIvA4cgDA0\nFDEJ8Tieng4ZKbewAKcrK1BzvgHnFS1ovHSR62hmFrz9A6iNGC7J0BCbDbcuaSvTNhhsW5K7t492\nxYBdA5oCBjV0802MUEjfpHySZWTATxgI+enTOH+RIE6exImsTOQVFaGkohxVdedQ3VDPlSWXU\/7F\nEcB2bGHazmTEq9nQiGkH19YdxjC1sERweLhgRYDK3n6NmqbEwPUb3MXROxNQ0EIwSFPj7nvv4\/7U\nFDmmQPLRoxwyh4DkJcUoLCsjuAJEHIql3ubKAZa1zXjnknbuxPadJi9kTGEOiY5eWaPuoOGvotHU\ne20EGpqtw7fHCHISt+7ew\/j9B5h8+C4SjxxBbGICklJTkXr8OI4RaLQ0DmbWNj8CmOyiKv5Bu3Zj\nx7J27+EyJtnsc0S4RLIyB1tpLJGLuKK5yvNvGfI6FcbNybu4fe9tpByTQXTwIMTSWMS9kYgjJ07i\nYHziT17ORQ4x7TTd+0ImpgKY7BVgj7kFAsPCJ1beYqhy29gG0jfwAnJw9Cau0vAfpknCQLNPyeEf\nFIQQUThE0VE4FJ8AWXYufyl7+ZLMsEvwo3abmf8gC1g57EP4QfGEKClJf8WATW1KXOzsJsheDtlN\nK1XP1WH0j4xyNztoz8umvPOgjcTHz48XT7BIhOO5p+Do7sEBGCgXFQGTqYUV115LKzh5eJHbCdMv\nBcdOw8VW\/AjZw8PNcpK5yUDTTqbD2s4ODk5OcKYFwNXTEwfj4iFNTuUAey2tsdfKGgIuGwisl2Rm\nbQszG1vEp6Zp49LSXv4KUNuk0CxDKpQqXFap0U6uMdD0nDwILMkVWpnMCMbK1hY29vaIT0mlahRz\nADMbO5jbLsseFkx2Dlyu3vuRePT4b9v\/KhuaYwgS9YrLaLzcjub2TrC8vEyThc3PLdRojYyNsZMq\nchclvamZGXspwsQxsLR3IO3jYnlm5eC4JKpWO2dXSJIOT\/\/m7fl09fnXKusvoOZCC+paLoG5eaG1\ng4PaOzpBYG5JU8EQBgTKFs7tBBubdAQRMVJY08+tHZ1hsywnF9gyObsgUBSJlMwcoU5W\/LONLU8r\n6s6j+nwTgSo4KHPU1dMLtswZCt92arwb2YylmRtAO6M0JY27ZOfixmXP5Or+QrGHU6b1dHWaWpXZ\np6vP4UxtAyrqGlHV0IQzNfXkoDOsKMds7Ow5qDXll4CqNEISi\/SCYjjQBrPP3fMXlZaVo9EZ4MO5\nuT+VVtfNF1fWgIEWnqmiinWn8FrAnIrDgqrSkgrC2nYJNlpKS0Se\/D\/CMaWkZ+kOkJ2i8hqXooqz\nYMorKYMrFcgeasCmAnMOakbOmVMrsaHCSJcXQZx4+FcBo6Tx09kVFfo6haxsaOpdhkyWnViqXBpd\nDHQPTQcGywok+UTGr8IxOVOLiUuRTWcXl+vua5CpqSn90rPnxpchs8ipnMLTkNDcNaFZy5zMIXf9\nQkX\/FXBZuaXlMTp1sW90dFN9y6V5VjAMMvVEJg+rEVUxC7G8ohou5M7PQX4JOj5Vps2vrtb9dzNj\ndA3wOeDb5kovcffy5mNut6kpttISejK\/ALE05n4Ox8BzTp+h6s3lyigsYZ8JdQqm7tfEqPsHNOr+\nQTBl5eXD3ZMAqSG70GLAKvgAXawYjIdvwE8gCyrOyphb8soawanys7r\/+q2nXyO8Q\/vfAt3emBSt\n7aisod5YWTUtjol9yqqYtZkAYfD3pbX13CVhZDR3j+lIepbuq3b5BAQHC4rLyrTsjvv4k08wefeu\ntrSyCsfSM\/EGhbO2oVEmDBNN0J2jzZR2PG+6omYVlozLy6u1zM1lMRdfCWDC4SOy5KNpOEuXoL5r\nQ1C0tyEzP49dcOC1\/wCOnchoE8cnaIqLi\/8QFBaOwODQqvik5MNmFhYyJ09PF09ff5mzp\/ergWNH\nLI2PEUulyMjL5VfLU3QpSkhOhifBGVMvpJmsEcclyC51dAilCYnYtm2bvt7veUQikX5YRJQ2NDIS\nkjgpIiUS2p79sZf6HluxfAOFEMcnxtBFXRMTF9em9784Pv7+BsFhomk3Ly840Ry2pIJwcnVDlFjy\nVYT4EIaujRSUVlRAIpUK9P6XJ19eJEzPypnIKyiiy1KB1i9QOONAa1VwuAgRYkmb3v\/bMbe1daFJ\nomUr\/x5z81f274V\/AhsbLrmRxiJJAAAAAElFTkSuQmCC",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2011-01\/1294353933-8931.swf",
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
	"trophypiece",
	"collectible",
	"no_rube"
];
itemDef.keys_in_location = {
	"p"	: "pickup"
};
itemDef.keys_in_pack = {
	"r"	: "drop",
	"g"	: "give",
	"h"	: "smash"
};

log.info("trophy_street_creator_earth_piece5.js LOADED");

// generated ok 2012-05-25 10:00:14 by eric
