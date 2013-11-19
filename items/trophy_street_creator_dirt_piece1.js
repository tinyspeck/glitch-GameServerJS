//#include include/takeable.js

var label = "A Piece of Street Creator Dirt Trophy";
var version = "1337965214";
var name_single = "A Piece of Street Creator Dirt Trophy";
var name_plural = "Pieces of Street Creator Dirt Trophy";
var article = "an";
var description = "One part of a trophy for contributing to street-building. Four more parts like it, you might have a whole trophy! A Dirt Trophy. Like they say: where there's muck, there's brass.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 50;
var input_for = [];
var parent_classes = ["trophy_street_creator_dirt_piece1", "trophy_piece", "takeable"];
var has_instance_props = false;

var classProps = {
	"collection_id"	: "",	// defined by takeable
	"smash_green"	: "200",	// defined by trophy_piece (overridden by trophy_street_creator_dirt_piece1)
	"smash_blue"	: "500",	// defined by trophy_piece (overridden by trophy_street_creator_dirt_piece1)
	"smash_shiny"	: "400"	// defined by trophy_piece (overridden by trophy_street_creator_dirt_piece1)
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
	out.push([2, "This item belongs to a collection which grants you the achievement <a href=\"\/achievements\/trophies\/street-creator-dirt-trophy\/\" glitch=\"external|\/achievements\/trophies\/street-creator-dirt-trophy\/\">Street Creator Dirt Trophy<\/a>"]);
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
		'position': {"x":-26,"y":-36,"w":52,"h":36},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAGjklEQVR42u2X209b2RXGDRgMGbB9\nuATfjY3vNjbGxhBjMJfhZmwwGAgQExwSICZiGGJDQsCxo2Rm0kgzqCP1odOpmFsvc5FGvWumal2p\nfWmTNlLVUaW+9KXqKxr1D\/i69oGkTKJWbTWVU4ktfdr77L32Oj9\/Z+2jY4HgpJ20k3bS\/mnb2bmj\nZXpmAXd3c1nSx8+ug7u5P2\/fyOBqemtvbWMjuLG5GUxtbS1cv36DgWdv3sxlu7t6swWBy2RuBXcz\nOWxcTePK2gtIpTd5bV3bBpu\/mb2FpaUVDPQPPiyMe5ncPnPvSbid3SwPmN68hpFQBJ2dPcFC1V8+\nld7CC+svPgXHwKNjE+gKdGcLVn\/kUH7jaop3ikE9UuZmDufnE+jpeT5f0AOSSqfz6c2tx6490pUr\na3zdeTzPSwoKeP36Tv44GFMqtYXQcPggEOhxPROvmOOPdWcng9FItPBwb6as2reute49gsvduo00\nHZaCw91d1kteT1qCb2868tmVHiQSF\/mTOjk5jYWJboy21R3EOmoWCgb48gVD8JVFI15dNuGVhB5r\nU04sRV24d9GAy8MyDLZI0d0kRpdDvF4QwNvn9esvXzDi9oIBdxcNuDGtRjIk53W2sw4xfw0G3FIE\nHQWAfClhyN+ab8SNGR0vBpqL67HQJ0NyRIOVkJofz3TVoc8lYZAHfmv5\/\/4r5+Dzv2W\/fnshn4s3\nIjOnx\/ZZHdiY9exRp2NapMY1WB5W8YAX+hXodYp5F0M+xf6XDrSs5ySrjdKxeIM4uzo2+PFnv\/8D\n7j\/8I+5di2N7zspDske8O6vHV5NmZM6ZsD6m4V28NKhEvKeer0MGqKkT\/YpSLn4pYElj9d6qsfrh\nqqkGK4ZqXNJzSDRIDuwVReizW3A5nsCrr797cC9z5SC3YOcdvEsH5vKwElOBOpzvldEprn7snlFR\n\/hml\/b5QIOj6r6F0AoG2tVIYvKiX7i8bOALjwPpLjRwu6KQ4r5VgTl2FgdpyeCuF8MhP00fAV\/Da\na1\/Di9PNSMa8WIn5MDvShqmhNiSXFrG9nUXuzh5cbt+vuWLBgby0CPXFgv\/8wKyYpK7+ugp0SsuQ\n0El4oEW9lO\/ZNYM7pxHjrKoKk4pKRGWnMHD6FNxcBVaX1vFJ\/gE+\/cXvqP8tfvLzB\/jxzx7ghz+9\njx98eh\/f++Q3sKhUf9GWFUEnKoKmVLB\/WiD491\/gnubm\/bixHm5ypYsrQ1wrxrz2EIr17DphrEXS\n04CLLhXOWesx75BjLWDGvFOJAcVzCBE80\/CRhtRiDKrEGCD1K6vQyolgKi+ClUrESL2mQgi5uHKP\n47h\/\/QHh9\/n2A3olJugmZtrorRJihlyaVf9Da+1UW206zFmqEVGUYFRZgqiqBOPqL4rNjZEitB6m\nuJC8GEP1xeR0MXprS2Gh\/M5TRWjkqqDVaKBSKNh\/FzmphlT0FNxEKKRtdjrRr+IwLn8OkfoKPklf\njQiTykpMkRYdSnKsmr\/5hKYEUw0lmNEJMdcoRNwgxLzxUGx8juZm9UJMU0xMewjNfswIwQ7LiuGm\nH89c1Mpl0KjVfxUcPmYzSU162sno0FD3xOgogoEAehQchqj4\/VIRehV0GAy1WHSqkCT3wgoRuVJG\nKsWYUkiwQrq5EDENUwkmtQxIiAn14fwYrY9SLIsfUZSRkyIMk4Zk5XCKy3j3FDLZdwmhhWQlNZDq\nSWVfAAz193uj4fAvJ6NRtHs9CEpLMedQI6Kvw4xNgRm7AhFtDakaYS2HsEaKESa1BKHHEh\/p8Jqt\njWgkfGxYw\/H72P5IQw1GG2pJdfA3KKCUy3\/Eyp9kOwYoftJEEbO2Nxgcj0Wjn\/c0O9DvsmC42YRQ\nixlhjxmjXgvGWi0Y91kw0WbFZLsVU2dsmPbbMNNhw2zAhjnSLI3PdhzOs5gYie2JkliOiMeCEcoZ\ncpvQ57ZBrVL96QjwkYN0sAVVpOLjgGVH1KcJcqmvuxvOpia4qC7dzc1ocbvh9XjQ6vXC5\/Ohva0N\nZ86cgd\/vR0dHBwJUGp2dnYeiMbvuoDU\/xbS3t6ON4n2trfDSfk9LC5+v2eXi8+t1OkgkkuljNcgO\nyqknHSw+gmQLYpvVesdkMLxhNpm+YTabv2mxWPatVutbNP+OzWZ7z263f8vhcHynyeF4v6mp6QOn\n0\/mhy+X6iImNSR\/Q\/Pt8jN3+bQftoX3vUI63bSwX5aS8b5pMpjcI8CWRSNRI9+WOnCt\/0r2TdtJO\n2v9r+ztkBzptkT8YNgAAAABJRU5ErkJggg==",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2011-01\/1294353832-6878.swf",
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

log.info("trophy_street_creator_dirt_piece1.js LOADED");

// generated ok 2012-05-25 10:00:14 by eric
