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
var parent_classes = ["trophy_street_creator_wood_piece1", "trophy_piece", "takeable"];
var has_instance_props = false;

var classProps = {
	"collection_id"	: "",	// defined by takeable
	"smash_green"	: "200",	// defined by trophy_piece (overridden by trophy_street_creator_wood_piece1)
	"smash_blue"	: "500",	// defined by trophy_piece (overridden by trophy_street_creator_wood_piece1)
	"smash_shiny"	: "400"	// defined by trophy_piece (overridden by trophy_street_creator_wood_piece1)
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
		'position': {"x":-21,"y":-27,"w":41,"h":27},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAEn0lEQVR42u2Y60+bVRzHC316h5bS\n0svTPpQWChU3WqBcBmPlzkYZIAgC28SxjGh0iS\/MjL7QxRivTO4Mylg3ddkL49RFmUbnk\/hKnQl\/\nAu98u+wv+Po7T08nKPGWsTSmv+STnv5O29+n53ee04tKlY1sZCMbmRleu\/Z1r12IZaxgS7BA9tp1\ncsYKjkddsmTXIWMFR6qdcsChz1zBwbBdrnAb4CnQhDNSsO+ATS53GZCxF0rPY1Y56NTDY9NMZqRg\nW0WBXEaC7LjJzGOm1KJcJBkr2FiSpxwzkk2bzEjBWsl0jwlm5GHdHBKTYdEIJhgsLtxaSNyMpVm5\ncksh8eGmwuWP7\/geqdzjLv1klWhAsEinCLbHWvD+4nUsJD7F4vpNLG98jkvJW1i79iUSH23i1Tfm\nt6dffsfyyAQjlWWfBX1OBLx2+D2FqKysRGNzB0ZPTOOVC3N\/EpyafhHDvQPbEatJDulV+39mzs5f\n255b\/QQXl29gZumGcsvu77WCM0vXMX5iClUWPSoNOSDB\/d2vZ4YmfLe\/+wmb3\/6Ir4jNNCxHsLnb\nd37G19\/fxTfyL\/hi8wc8e+48BrrjCJFghT4HQZ1qdt8EX5uenlxZSODS4voDVohlyi3NJ7A4t4YF\nYn52DXMfrGL24irefXsBZ08\/x8QQJMEyXQ4CWlUyoFI93H05YlVZ+kXTVtxnxl70MorNOMaQzDhK\n9DC8ZnQTUatOkSsl\/ESJRrVlfViSQ269b9STt9UnChj0qlNIHBoPcPo9avSJasTdavS6c3HUlYse\nZy66inJRk08rl5bT5sBHuPMMssPhYJ9E+YTw379auUzyoKjDU341xgICxomJ0hRszHJsbqREjSd9\nagwVp+TTwkw2av5drJjwGjRwuVxwOp3sO2UJ+xVB6P+tG3tX5rjDgNESDU4FBUyWCzhdIeBMKAUb\ns9zJspTwmF9QRIdJ9AkptbJMMmpJiUlMTpMD0ahTBG0221WqUcYlPYTpn4jl8gcWEe5umw7H3Roq\nxlosKIVTCCkoN8Dp9wg47tGQlAZxUYtehluHWougiHk4oiUf1N57arX6GNWoIEqJYkLkLd8zcvgy\nW9NyhBQr0Nyfivpx7nDFX\/ICo3k3z3PO1pcp+0\/ZewJhK4Tdbl+j168iKongjlY7CONe7WSrVkDY\n03LsSQdNuedHQ9b7k3USGM\/U74blniZORSWcrJUwUSNhnBirljAaljBCDFdJGDroxeABL+p8Loii\nmBaMsE9Qopzw85pOwsY7+UCOGVv4hJPvhxK+9CG\/39\/f1dWFbkZ3924ox+a6OjvRyejoQEd7O9rb\n2tDGaG1FayyG2JEjOMJoaYHX64XFYnnpbwQNTE7N25rPV69ox+oF+BNZC6oikchdViDGiu2A5Vqo\n6OHmZjQ3NaHp0CE0NjaioaEB9XV1qItGEa2tRW1NDaojEUTCYdAb\/pVeM0qE\/9BiD2+xdedeZJJa\nbmziExb+IBuXdhmNxjhdeRtEkrjKSfLcZbfTmaCNn6SjY4NYp\/ES3c7S3IzL4XiPxm8Rb9L4gtls\nHuML4eBbyspr5vNuarP\/32QjG\/+H+A1C0DbtgtSEOAAAAABJRU5ErkJggg==",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2011-01\/1294354086-7937.swf",
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

log.info("trophy_street_creator_wood_piece1.js LOADED");

// generated ok 2012-05-25 10:00:14 by eric
