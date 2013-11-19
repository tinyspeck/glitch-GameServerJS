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
var parent_classes = ["trophy_street_creator_dirt_piece4", "trophy_piece", "takeable"];
var has_instance_props = false;

var classProps = {
	"collection_id"	: "",	// defined by takeable
	"smash_green"	: "400",	// defined by trophy_piece (overridden by trophy_street_creator_dirt_piece4)
	"smash_blue"	: "550",	// defined by trophy_piece (overridden by trophy_street_creator_dirt_piece4)
	"smash_shiny"	: "700"	// defined by trophy_piece (overridden by trophy_street_creator_dirt_piece4)
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
		'position': {"x":-15,"y":-29,"w":29,"h":29},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAHqUlEQVR42s2Xa2hb5xnHj3W3HFmX\nI\/mi25F1lyVZvl9iJ2p8SWU7vsaO4xpbdp1kNnbsJSU22wJiZSzdoPhDSQntNkNHuuwChnQfBhvT\nILTuCJsoTRnb2AwrDYzBtA+hLBD473mP5CCnNnYy28mBv87R0TlHv\/N\/nvd5n5fjnnL7VleVsNxe\nsXKx2ZW82ORKLh7zJa921pJq1thv3PPchvWcdtKnSV+o0GG+rhiXj5XhbJkSg0I+pqvtWGqPrD03\nuAELFxl1SDeunvTihws9eO+1QaxeHsRyuxvxoAajfg3GwkW0L4nWcJw2ZudXmwu5VXZ8KICjbkXq\ncrMVPyawH8y0483BEK71BTFfY8C5Sh0mI3qMBvXoFo4ke\/yO5ICbR5tRggqdZPHA4aZq+PgrbhWm\n3DJcaeBxpVKB5SoFLgbleNUjw1lBhkG7Amf8Wgx4tKjVSDa6S6Ro4qUMMHHggJO1xsRZlxITLhku\n+OQi2EJIjhm\/HHE6d8YuxSkCauMl6LQX4JRTtzhslUXjvnxU6ySrB+9gnWnkrEctOsUgpz1yTHvl\nmCRHRx0yDFikiBVJcFwnQf2RPMQETZLdd6WpKN1lkaad+gPOw4udbuVktfH+gEWGYXKLgY4KGecY\nXFexFK3kXlNhHqry89Dj4TFVp4t+o16zxlKg1nAIYZ6oNo2c8WnAcqu3NCMWVuZcq0GCZoJrKJSi\ns6wQIxUmTNbok0uVisQwvUilTpo8UDhWKipVXOJla35qrIJPd1uV6DQr8HKpAjFrPmI2NU65tRgK\nGTMKaAlSh0SHK\/kSuRve7zy84OS08wHZ2ny5XBy5PRTGqEGy0arjhNZSlfBazJ0cqy4iCCOGwxmo\nqUYLlnv8ONfmTvf7ClMjYQOuxkKo0TNArm\/\/QumQ9s2Vy9JLVEZYORknwHGnDDEKZ71egs3rbsy3\nRN6crE28u9DyWDPHHYlGAmKDZTxiRluxWGZS+zhbSOMMhpWPxZACswEZ+mwy1PPMBWkyqOMiuz2j\nq1iy0WGSooFeJqSVwqeR7p973cWS9IidFV0pTtDbV+klacqflQCFdq\/PWIoFr58W5OL99bwMLfp9\nHCBsWmKVPyNp\/FmecfM7l\/pmq7QYK5PhtJVGdbEER5\/iBQ98AyB8u9uP81TIGWSfmWYYA7fIvUjb\n2+da06wCsJmGudhhyku9UIDf63EnFyOZ5mLIlinmTUe46AsDuFCpTs9VqDGRdfCkSYL+UFnqbupP\nifW7nyXufPzJ8wv5hEsaPx\/MF7scNmf3mjNdztdiLSBArN+9hzvrn+C3H\/6x79DhHjx4EJlr8aXG\nvWqxkejPdjltJir2jZ4tgMk7fzjc5cHDhw8jf7n3aZqVFdZEsKYiRsfdVpXYxHYIGty8tYa1D36N\n3\/zu93jv1m10HjtxOHn56NGj+Jdf\/he3b72Pk24T2mwFok5YCxA1q1HNq1BhKULXqV709Q9h4etL\nmF1Ywunu\/uSBw\/35b\/dX7v\/z3\/j8i3\/hr3\/\/Ah9+\/ClWf3QTy5eXMD0xhTODQxgdHUd88jxm5y9h\n+ZuvI\/H69zHx6hyiwUD6QOF+evujlZ99sI696Oe\/XMcvSG+98xOMT82iv7MXIWpuw2pu1XkQK7\/p\nsen4d69dx1517Y3rWHn7fUzEZ9BWU4tygguSQmomLhVUcfF9BQwpuQ0SjpdodlQ0u6\/h1XDRtV5V\nHnwkP4EFSFsh6Vi+e7e0Nzg5V8vWHjuphv6stiAPzToFQho5weXBTfIQ3E6QwexxOXXu\/w+bnKQP\nq7h3tgOrzoLV0cquQUOAfAHKCMxJEiFV20NuFZcu0RUmdDrdU3VAUlIBqYhkjqi4f+wGx1Z4R00a\nOBR5jyE3XcyFFEFzVKaUQK\/Tgef5NEHuKeQK5hqpuFEoDVyoDHy0U1jrCJCtixsJ8GhhBkzIAdwM\nda6TuXIQnFqlZHAwGo1sv+tii7lmJJU0CkLgrYGuz4ZdVuwFkDlpU2QAc13cDpSJnStQKkQ4k8kk\nAjLtBCbjMrVJhJtrbui4Mdz7+Y2hHsxUBjAZdGOi3InxQBle8QkY9dox4rZh2GXBsNOMIWcpmvgj\nsMnzYH8CMtfNx6AkG7ln0OtRUlKSC7jtTKMk6Ug8Cyt9+GlN\/J+dRmzUpEZbqeYrimiVsMozLm5C\nbgfK5CAZ8pWwWCybgClyctu6qCIVkgybA6JCxf1qJzhxYDwRWnFwaOk7regsBChCkiwEZlRIoVHI\nUZgjLeWciZwzm82PAcm56E5wmqx7YmgdRsOlGrsZLT7XV+V34RjpeMCNKOmlcjdOUOhbSW0hD9rD\nHjgMWpjkEmgVMuQrFOLotGRBioqKUFpaCofDAUEQYLPZRMji4uK1neqb+kn3nIJwz1VWhu3kdjrh\ncbngdbvh83jg83rh9\/kQIJX7\/QgGAgjQnv251WqF3W4XYZx0n4vuY2LH7Bz7jaBTBLyi1+u129U4\n5t6RLbnH8w27wXkIzsvgSH4C3IQrJ7hgeTlCwSDCoZD4fROEAbNj0p7nXkl2YGwJr2C3v7sX97w7\nuJcLWBEOi9eRk0nSCumZG1VJNtyKLDRzNj8b\/oKsy5psKmizL6TPpgWffTlTVixNSkilLF0o+Z+p\nW\/kf03wVIFDmdKUAAAAASUVORK5CYII=",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2011-01\/1294353857-3748.swf",
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

log.info("trophy_street_creator_dirt_piece4.js LOADED");

// generated ok 2012-05-25 10:00:14 by eric
