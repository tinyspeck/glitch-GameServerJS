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
var parent_classes = ["trophy_street_creator_wood_piece2", "trophy_piece", "takeable"];
var has_instance_props = false;

var classProps = {
	"collection_id"	: "",	// defined by takeable
	"smash_green"	: "200",	// defined by trophy_piece (overridden by trophy_street_creator_wood_piece2)
	"smash_blue"	: "500",	// defined by trophy_piece (overridden by trophy_street_creator_wood_piece2)
	"smash_shiny"	: "400"	// defined by trophy_piece (overridden by trophy_street_creator_wood_piece2)
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
		'position': {"x":-21,"y":-28,"w":41,"h":28},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAFFElEQVR42u2Xa2xTZRjHT9ut6y69\njXbdOaf3MXbpetvlnHXd1g62wQZzY2Mwuju7IDJQP3hJTOwXY4yJgRgTQYxNIEgMzrkQhwbMmHNM\nhLggKn7jm1\/BT378+5z2LBAyIyqQmvRJfmna0\/b5nf\/7vk9ahslUpjKVqb+tw1HrsaNR+2jaCs60\nOBcPNVmPpa3gkVbX4sudm+NpK3iIEjza5k7fBCeb7WsHo47FtBUcCfEYC1vvpq1gTGQxWM+h1W3U\np6XgWLMDXT4TWssM3WknV8FqHENhG9orjIiWGtLvoHj4fP9Ov1mSQ9itW0s7wSAJkhgaiXqnFukn\nWKyJCI4CiES1Le\/OU21+eenG6MVLq\/H5i8vx8\/OL8XOzX8fPfPJVPHHuYvzUmQvx9xPz8ZFYLBG0\n5kHCy2qe3ixcWfnBcenKdSxcWsXnC8sgQZybvQwSROLjBZw6fQEkiMGBGMosOSi3aOBzmu9Ov\/LW\n0xk1p8\/OJh5F8I23T6KjrR1BvxctLVsRDQQST1zuzNnZ8U\/nvsSjCL734Wd494NZHD9xHq++\/g4E\nlx2bNUzkicktrtxKrN74Fas3buPq9dtY+f4XfHvtZyxf+wnL30ncwjerxNUfsZTkJpZWbuIKMXPk\nJZJTwK1m7roYxvFYxU729+u7GhrnJocmMDU0ienhSRwknh2ZwqHRKTwnMTaFmbFpzIxP48iBaRwl\nnp84iBeIw6MHEOSKUZJDgoRTzcw9NrkahtF38Ia17bwWHVYtOm1a7CR22bV4xqlDN9FD7Hbp0Evz\nrrdEhz5iD9FfknoeMOQkxVxJOQUchF3N3LGqmTir0fy3NOsKmEhIp0BYr0CTQYFIoRItm5TYZlKi\nzazEdosSHcVKdLJK7OJU6OJV6Laq0EPstqkgGO+L3ZdTwEbwaiWKCgtP6HS60n\/rpxC1zJuNJNZs\n3FhspywlCfXaVdjjUKHfqcI+V+pRSs7xkJg1WwEuLwesxQKLxfK7Xq+foF66fyqncWcztfU65rf1\n5LaSYCvJtRcpsUOSY+8nJqUlye0lqQF3FgZLstBFr61LJclOyfEGHXieB8dxMBqNg9TLSViJR5qT\nasIwUe15sb+EvdfnsmC304weuwndtkJqasQuq56S06GTK6ClzUcHm0fCuZSqhsihG1AT2QgZVUmh\npJSMzbwJNptNEvzDYDBI\/1XKiRImdbI5QvtXYkr5YiFR1FdafG9fJYcBYr+HQ4wYrEox5OUw7OUx\n7OMxIjPqTzEmEeAxTsQ8FrhptHDZKWxmExwOR1KQ9l2M+viISqL0gRQtRN5GqUlyRsLc1d76Wl+T\ngD3NAvqJvREB+4iBqID9LQJixOBWEUPbRAwTI60iRttEjBHj7SIObBcxQUzuEDFFhKvKwWnzk3J2\nux0sy35BfWqJgPSrjNhC0HhkbLLgJkKVPASyXL60rPKFsvItW1BRVobKigp4KitR5fHAW1UFv9eL\ngM+HYCCA6mAQNdXVqK2pQV1tLYS6OoiCgHpRRKi+Hg2hEBoaGhCWCIdRQ++TkpPIzc3tlQbEBoLr\nCRbKTknL3AfSK5IiT8qVl8NDgutyPpLzbyRHYsKDYrJQY2MjmpqaEGluRjQSQTQahcvlgtls\/oh6\nhOQE\/Q8tMS87GGUvZj1FSTSLyJbXn5U3rHRHdvnDbmKz\/GVl8uaulBPwyvtJkBFTM56plh+TmEym\niHxSpUAK5JSkfhoiR17NLNkpU5nK1P++\/gRg8WvhGweqLgAAAABJRU5ErkJggg==",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2011-01\/1294354088-6238.swf",
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

log.info("trophy_street_creator_wood_piece2.js LOADED");

// generated ok 2012-05-25 10:00:14 by eric
