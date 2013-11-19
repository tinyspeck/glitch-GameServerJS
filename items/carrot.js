//#include include/food.js, include/takeable.js

var label = "Carrot";
var version = "1354597903";
var name_single = "Carrot";
var name_plural = "Carrots";
var article = "a";
var description = "A fresh, firm carrot.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 80;
var base_cost = 6;
var input_for = [15,55,79,92,330,338];
var parent_classes = ["carrot", "crop_base", "food", "takeable"];
var has_instance_props = false;

var classProps = {
	"collection_id"	: "",	// defined by takeable
	"energy_factor"	: "1",	// defined by food
	"produced_by_class"	: "seed_carrot"	// defined by crop_base (overridden by carrot)
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

verbs.eat_bonus_img = { // defined by food
	"name"				: "Eat • Super Bonus iMG",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 53,
	"tooltip"			: "",
	"get_tooltip"			: function(pc, verb, effects){

		if (this.getTooltip) { 
			return this.getTooltip(pc);
		}
		else {
			return this.food_eat_tooltip(pc);
		}
	},
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (this.specialConditions) { 
			return this.specialConditions(pc, "eat_bonus_img", drop_stack);
		}
		else { 
			return this.food_eat_conditions_img(pc, drop_stack, "month");
		}
	},
	"effects"			: function(pc){

		return this.food_eat_effects(pc);
	},
	"handler"			: function(pc, msg, suppress_activity){

		this.verbs['eat'].handler.call(this, pc, msg, suppress_activity);
	}
};

verbs.eat_img = { // defined by food
	"name"				: "Eat • Bonus iMG",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 54,
	"tooltip"			: "",
	"get_tooltip"			: function(pc, verb, effects){

		if (this.getTooltip) { 
			return this.getTooltip(pc);
		}
		else {
			return this.food_eat_tooltip(pc);
		}
	},
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (this.specialConditions) { 
			return this.specialConditions(pc, "eat_img", drop_stack);
		}
		else { 
			return this.food_eat_conditions_img(pc, drop_stack, "day");
		}
	},
	"effects"			: function(pc){

		return this.food_eat_effects(pc);
	},
	"handler"			: function(pc, msg, suppress_activity){

		this.verbs['eat'].handler.call(this, pc, msg, suppress_activity);
	}
};

verbs.eat = { // defined by food
	"name"				: "eat",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: true,
	"is_emote"			: false,
	"sort_on"			: 55,
	"tooltip"			: "",
	"get_tooltip"			: function(pc, verb, effects){

		return this.food_eat_tooltip(pc);
	},
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		return this.food_eat_conditions(pc, drop_stack);
	},
	"effects"			: function(pc){

		return this.food_eat_effects(pc);
	},
	"handler"			: function(pc, msg, suppress_activity){

		return this.food_eat(pc, msg);
	}
};

// global block from crop_base
this.is_crop = 1;

function getDescExtras(pc){
	var out = [];
	out.push([2, "You can grow this by planting <a href=\"\/items\/318\/\" glitch=\"item|seed_carrot\">Carrot Seeds<\/a> in a Crop Garden."]);

	// automatically generated source information...
	out.push([2, "This can be purchased from a <a href=\"\/items\/1000007\/\" glitch=\"item|npc_streetspirit_produce\">Produce Vendor<\/a>, a <a href=\"\/items\/365\/\" glitch=\"item|npc_gardening_vendor\">Gardening Tools Vendor<\/a> or <a href=\"\/items\/374\/\" glitch=\"item|npc_jabba1\">Uncle Friendly's Emporium<\/a>."]);
	return out;
}

var tags = [
	"crop",
	"croppery_gardening_supplies"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-23,"y":-18,"w":46,"h":18},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAEoUlEQVR42u2Yf0zUdRjH3233y42N\nrS2XfzjMNv9gLefcslXu1mZbK1trShgCp+KvhSdIAgLZSQQccNzJrwPRODgIENAjtcZsha1YLa0z\nZVrpeQgCyQFfwcRx\/vH0fL7fjtjamn\/k99sffLZnnx0b22vv9\/t5ns8dsHAWzn9\/nF6TOVJHupb2\nnvzq1V5nk+HN\/wWcvQPR7T0vSa7mRb6SYybiW5QvAlzerF+puXoCqrzRRIV1JiprUCryt6xio0tT\n9ZpOP5MmYPKrTHIV1ChwQs30Q8be5L0G29+lt6iuXlvP87JSAi6zyCjfEatLPzaR9aCBtqYbyGI1\nBJOsOrPqCrq8i\/zCUgEXsTbbbiRbhUmunFIjvZvLgHtF6SVNrK5ufdyfnm+QBJjIYUqGQa5d2Qba\nmfkXnNXgE6U6nKPFFFPhXUbb9ilAqXl6l7BSUUxRTdwJqYjRRL32nhc9GQVGGWZ+xsRn0Rgiexar\nvvdRczzWl4mng0UwRypgR\/SJL1+LqWldJtspYOb\/Q7JVL48XAZe45xHNQjqC6HAN0iQXpHEnaKwc\ndKsExIB0vQDU1fhkMM3G6qmg0D\/ObB1WztYgGD4aReGuNfTg1DoKf7KCwm7QBIP+agP9dBCUlabz\nx+1EtOpwrJwUblxC4W6zAnf8WZp162imEjTNav7GgJdyQCe3Q131Jh2IGSiCdKs+lkZb19FIi5kG\nq5fSEFt7rwI0xXCTpaAhtvjHTJB3M6gjCU+pBjhcAn8EbrhxDQ04oijwESt2iPNXyPYy3G3O4AgD\nnt3NMY3jLCZjlSpwoiHCbbGKpS3LaaYaNFiswF3hvF3OBQ0z7PCHoKtsrzcBVLcBd0SXq5M7z2JJ\nhhPZ42aYqQLddYFuMNBlBvJncXMwZOB9UPc20DFWr34DMlRRb9AZ7ZfzVrmEhuycNQab5posY0uL\nFbjz74Eu7AOdTgG1cfZc69GiinrBYthE3obqVtANztm1fKXGGHSM4UbZ1ksM+HUqqCVBgWt6GzZV\n4B64YZYt7VxN09ylAQ7\/1Q9A\/Xl85yrNMMgj5Yd0zttGkPstDHjfgTrPJnlT1OokAXe\/Wkd\/HGZL\nHdwQDHcxm+3cz0rmKcp54kGO9ai1rsITqsGNOvT+sabVFCrXyfNNYrhxnndXWLnzDPfNHlCnBdS+\nGUHn63hO1YE8XWXwhRpiKWCPol\/YwmtcIbuSt\/4DoE+5Eeq5S5s3wdYRp\/Iq43nnmW1eTvf4+8MI\nN0E\/j42fGWpAzDu+WxMZbiPOlb2h4oaYU+4wPFOctbtcU+XKZujnGfcdj4\/u7SDfFkjtidiqyePy\ntgOWyNq6zmNkgvM2yEP4812ghk2g48lwBbJVtnP+GgtxE9wsVNbWxQPKsj+zg5sgCZXeJA3snINz\nwyI\/k3gzhFi1s2LgJkHiZe\/p0+q7QuSMs603+fXxu115ZH6Riju18XDvfgGLNf\/dZLQEFrGyvuWZ\ndoafRp0pKPosRWPF5mythmWCF\/057k53PI7mrFVpAzxstw5wM3y\/H8ELWXhZlaX+sOc+K9fHz6IT\nO1A5addoZPzb8efA17EFryz8rLpwNDp\/Ajdg4RI4LFFGAAAAAElFTkSuQmCC",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/carrot-1334210634.swf",
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
	"crop",
	"croppery_gardening_supplies"
];
itemDef.keys_in_location = {
	"p"	: "pickup"
};
itemDef.keys_in_pack = {
	"r"	: "drop",
	"e"	: "eat",
	"t"	: "eat_bonus_img",
	"g"	: "eat_img",
	"v"	: "give"
};

log.info("carrot.js LOADED");

// generated ok 2012-12-03 21:11:43 by martlume
