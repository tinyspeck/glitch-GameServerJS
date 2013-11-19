//#include include/takeable.js

var label = "A Piece of Street Creator Wood Trophy";
var version = "1337965214";
var name_single = "A Piece of Street Creator Wood Trophy";
var name_plural = "Pieces of Street Creator Wood Trophy";
var article = "an";
var description = "One fragment of a trophy (the \"Wood\" trophy) marking top street-creation activity. If you earned four more fragments similar to this, would you have a whole trophy? Yes: You = Wood.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 50;
var input_for = [];
var parent_classes = ["trophy_street_creator_wood_piece5", "trophy_piece", "takeable"];
var has_instance_props = false;

var classProps = {
	"collection_id"	: "",	// defined by takeable
	"smash_green"	: "400",	// defined by trophy_piece (overridden by trophy_street_creator_wood_piece5)
	"smash_blue"	: "550",	// defined by trophy_piece (overridden by trophy_street_creator_wood_piece5)
	"smash_shiny"	: "700"	// defined by trophy_piece (overridden by trophy_street_creator_wood_piece5)
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
	out.push([2, "This item belongs to a collection which grants you the achievement <a href=\"\/achievements\/trophies\/street-creator-wood-trophy\/\" glitch=\"external|\/achievements\/trophies\/street-creator-wood-trophy\/\">Street Creator Wood Trophy<\/a>"]);
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
		'position': {"x":-15,"y":-41,"w":30,"h":42},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAGfElEQVR42s1Y+VJadxT2n0QUZAm7\noFy2y74ogiIqiggaF0QF3FGztYmNiY01S1O0Sd2y0EyTzDQzHR6BR7iPwCPwCPcRTs8hk3amk7Yz\nGTEw85t7vXrlu+d833e+321qOufP2zmHYW+CiTY16uftuj9\/mHZwDQvwOOPmdhNmmPHK8yGd0Ndw\nAG8MdpRmvAoYNIuBVV6uNBS4CNOW7ze2gbdDCI72Vt6lFxYbCqALW+pobwEXAqwtvbCxuOjsaE2F\nLZJqhJXUAOLPpYbj4KuMg9sa0DUuwA+r3p3DlLXy3Yi+sbwwE5BJnkxai0cLTng6xcJ6XzuEzZKq\nQyswNATAEYs0Oua8AgmXHLydQvAZRODUt5btekHUJGuSfH2B6FsLtO7GmOLuGAOLIU2Jqvepgidx\nk2Q\/YfR9ldZuhjXRIVZamu1Wle4Md\/IPx03wbtkNH9Z9lXcrbu7lgp17mfXw+0lT+cIBxoxSQyag\n4r8d0heTHnnqbpwpZoJaOJixwrMUC6+zTthLGuGnKQts9bcXLhwgtXDYLoPlXg0UUnY4yXng+awN\nniO4ab8SIqwU\/MjHKZ8SgiZxJe6QcfMBZf5CQXYxIm7cLYchmxTWw+1wK9oBt4c7CdDfUwXXfLAd\ntgb0EDSK6zOjD6YshX8bcTR3g6Y2SHepqpMYFggwXs+TmpN4vhjUwJ2YESY9cog7Zfy5g\/s+ZjQc\nTFv4szlb5feM6bO2QXYyapfmcz0auIGVujmorx1XerWAKQfijisQtoihbt54K6qvHM3Z4VXWxRcz\nztLJZ4Be69caqNVUwUH24zGJ3thvkYC7U1ilqtYF3PaIzreXYMqTPgX\/Myr0l1kWjuedfHHFX3o2\nay\/sxpnC7SF9YSOsreZ61LW2ki\/2GMVVaj3NZQoTdRdEyq\/krnrlfA45dXOoA9DbAMHBLWwngcp0\nq2HAKoFebOWjCVNxxC6NUksvdJrQ+KKsR\/ayijM3gxWj834EFmDaaoolcTy5aobTtK2yHess0D2f\n+19pjyIaY6WFQD0egNpGVhJCfyNQQaPoL0uJINjrWNVXS144Rt4epW1wtuir\/rYW4F4s+rnDeTeX\nQ0NHVfPDrDRfN5MmXtExbmvjRllxDSSLqboboz+p9z62n2bzFJr2ZkQHRI1reJz0KFDVMny4tlLA\ndAHtjxkFhphVXEl75TCGqqUqEshlBLmEK4wV7UGxxDHxEBVI4d7zUjUR\/HDa8r8BdMgszK8F1cUH\nCWOtigQStwA1QLWErWv9eNS3Voge5yYcCgHYLu5oli2\/ztj\/E+hZ2h59PGGuAbMRSH1rbdFmitUI\nSnXxwVxI5ZvHxEKJ5BQT868r\/sr7zVD+CMEMYlAlhU6gGhf88tScX1lJ4ajbGTXAAIJ0agSUqsGi\nuFS\/LSjN2XGcoZj18IsZOFpwwY9XLVCYscHDCQvsJkyw2a+DRRxxKUwtCST\/3ZgB7uHf7sdN9RcA\nhYGQWcwHkPS019hGoKTE1T4t5EJaWK4tDWD1AC0D3Mgz8sBsQAWPp218eT9ZPJ5zFojHjyaY6P0x\nJnpjUB9dC2qiaZf0y1L2P2+kKtJeYwT3vFRN4lgmoK6pMoYV60U\/xMX3s9LyNlbvBL0vhA+UdMpg\nb9wML5a74AdM2gezTvgGJ9CDCRYyXcpK4ksBTnuk0Wy3qryK\/Pt0zaq8VLSpmymNkBLBj4B7GBHQ\nNbu2pTpqk3J\/bPjK71fcNWMmH2SUzdCHQBe6VVTl6mZYx63gfoX4GjfJvrz9rPxSfsQqhqWgGu4l\nTNW3G8HiPQwEWUzDEZO4ikZbpHQct8u4hYCafzplqZ4tOODNogve5FxwihXciuiqesXlQm1dad6R\nnec4cykF+XyfBoe\/ClaxEtcx11EgIPIfZ3F8ZT1wmvPC87QDDmdw77HsA4pij7CNlHQOpq1QmDRX\n6yqOpENankG+zSP55\/wKWCOgKA7i0M6oEUfYxyRDxvwYVf0AR9qASYTqNQB54bOUtb4vj4at4p0k\nCiDhkFbSCDKHokD+1JScx0XWkkclb+D5OoKfRv+zqgVgR1Messkq8z2a+r\/dGrSIolFzWxUXJOxS\nwKrS21Ogyk65r8ASRi2iwQD+vlPRDHpFM0d8o3tlF5UB+xhhPswIi\/2MqDJilVQijIgfwNRC7Ywj\n6AiGABYr1yG\/3Bhvs+jdc7CzZSfU0VIOGYS8p11QQnCppkb7dOOeo97f8Se9T657s2RPlAAAAABJ\nRU5ErkJggg==",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2011-01\/1294354093-4345.swf",
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

log.info("trophy_street_creator_wood_piece5.js LOADED");

// generated ok 2012-05-25 10:00:14 by eric
