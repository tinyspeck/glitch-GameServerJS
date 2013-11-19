//#include include/food.js, include/takeable.js

var label = "Ix-Style Braised Meat";
var version = "1354594509";
var name_single = "Ix-Style Braised Meat";
var name_plural = "Ix-Style Braised Meats";
var article = "an";
var description = "A side of rich, meaty meat, braised a la Ix.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 12;
var base_cost = 234;
var input_for = [349];
var parent_classes = ["ixstyle_braised_meat", "food", "takeable"];
var has_instance_props = false;

var classProps = {
	"collection_id"	: "",	// defined by takeable
	"energy_factor"	: "1"	// defined by food
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

function getDescExtras(pc){
	var out = [];

	// automatically generated source information...
	out.push([2, "This can be made with an <a href=\"\/items\/268\/\" glitch=\"item|awesome_pot\">Awesome Pot<\/a>."]);
	if (pc && !pc.skills_has("masterchef_1")) out.push([2, "You need to learn <a href=\"\/skills\/47\/\" glitch=\"skill|masterchef_1\">Master Chef I<\/a> to use an <a href=\"\/items\/268\/\" glitch=\"item|awesome_pot\">Awesome Pot<\/a>."]);
	if (pc && pc.skills_has("masterchef_1") && !pc.making_recipe_is_known("32")) out.push([2, "The recipe for this will become available after you use the <a href=\"\/items\/268\/\" glitch=\"item|awesome_pot\">Awesome Pot<\/a> a bit more."]);
	return out;
}

var tags = [
	"food",
	"foodbonus"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-18,"y":-21,"w":36,"h":21},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAGqklEQVR42u2YWVCTVxTHfWhn+tJx\n+lTtplVwQSxWKljFrW6AVlQERAVcccOqqGMRhCCEEBICYRFDgghEWUSCRESLyKqAqNQNgSpBRYEy\nGFxf\/73nlmQEwaWDUx9yZs7kyzffvfd3\/2e5XzJokMlMZjKTmWzADcUzP+k6ZfcFObv+7KMBa9Du\nt7qk8tSWxDi3XVFvQmWiB66lb6wqkDl6\/O9wujzvMZeS16E01g3HfW2QusEC0c6jUKnahhMi57aO\nk1M\/\/6AAz58\/t3rx4oUT82R2Xfzo0aPapqYm6HQ6NOsaUacVIMdvGnL3TEH+bltkb7RFzNLROL7P\nBVqpJy4XHq+lcTSe5qH5BgLK6\/79+5rS0lJdWVkZ1Go14uPjkZCQAIVCgfyjMhRny1ClEaI6aQ3k\nrqMgXWCOZK\/xULhZIOrXUYj3skPxoa2IDfKBWCxGeno6aK5bt26R69hGNbTOuyc4MJgGXL9+vTYr\nKwtSqRQymQzR0dGIiYkxAlZkhIFCWha3HKVxbqhm139m7cDh7bMgXjQacqfROLTMEiHzRqBGHYxD\nAes4oEqlQmFhIYqKilBSUsJhr1y5gnv37pG6Tm9V7M6dO7qMjAyIRCI+YV+AacponPBzQMamCaiQ\nLoDGdyLy\/O1wTuKEEpaDmYH2CHUw5wqG2Y9ESdwOqPxW8Plont6AFRUVqKysxLVr1\/Dw4UPda4qS\naoy+trq6GiEhIRAKhf0CKg7G4ZRkCxKYOhofGyS5T4CcKaZcOQ5p3uMRu9IC5UpPKDbaQMLCHe5g\nhlyBB7LD1vP5JBIJ8vPz+wSk9WtqasBEAvEQFwekL1VVVRAIBG8FPK0IhmzxOKRvmAjV8h84nMFJ\nMcHcEbiQtAEqHztInMwQudgcmsBlyBWvhjwiEDJpODIzM98ISCG\/e\/cuhxz08uXL7eyCQ70NME8p\nQvxKWxx0GcOdoGIXj0WqhzWDtUKEozmil0\/CORbm9H2OyA2ag8KoZShN8EDegfnQMj8WtAiKcF9e\nZDk5Of0C1tbWoqurC6ReEAEGBga+EVAdL4Lc3QaJ7uOR6TOph3IG9Q6wgsgLWY3Dfm64lLoFqVtt\nkeJtjSOsJ6rWjoXSywLpm60hXToWhw5s5pumQuwPkLiMCiqVyn4B02LDuDLxzuOQtd4WChfLHnCy\nhaN4tVJL+SNuJzQRa3Bs72wI55tBxIolce1PSPaewL9HLhnDP4VsQ0r\/lUhSHOwTsL6+\/l9AdtOK\npKSm2xtQEhyAI8KdHE5kb\/aaauRiRzMEs7wTLhiDQlatSb+74rR8HeSrp0Jobw75UktWyWYIZ89x\nsG4PnTcSYUssEbfBoU\/Azs5OPH36VM+LpLy8XPfs2TN+KhyWBkO+0QnKNbOQusIGyaumcAAOMX8k\nr0pyAqaQCrrhCiK38NCGuv+M9AMuyNi\/Cn6zhhvH7p\/9Pfx\/Gc7v7ZkxzOghbGzA9K8hXvIjErYu\nRXVpEYcjnubm5mQOePLkySCifvz4MfR\/t+HSsRgcXTsdas+pSGGQKR52fBFBH07qliXuRUrACgQs\nssLmSV9CttkB+dG\/Yd9c8x4wr7rvtG\/hM3kof3775CEQLRyLQmU4Ottb0dbWxlsNi+owDsga52DW\nm\/QNDQ148OAB9Ho92pv\/wuXsRFSoRMjZ7YJUz2lMNfMecMf3sXBGb0PibmcjHLm\/0wQk7nVDyl5X\nI9Cuad9hx9RvsG3yV9hiM4Q\/F+o+C9lSP5QfO4hHTQ1ob2\/nzZqdYpSDyT2aNVPRi525IEgKNevm\nRqdkJeD681oUHZaw8K1HftQexHnPg2CBBXZNGQpf5n4sVJEOI5HmNRNxztaIdbVBhNMPCHZkVbt1\nCdR+q3E+SYyaPDVamxp5GEmQGzdu8Ny7cOGCoUB0rA8Ofu2o02q1GtoBQZLMBEeTPHnyxOgscfk9\ngn5fp\/GURq2trRyMKpWgDE6HBa3N7vd9JlOoNRrN2bq6Ov4gSW4ApLBT8nZ0dHB4WoScvY3Q+ckX\nZG8+lNivOXUImq+3G1QzwN2+fZvuv\/nNhiALCgoqDJC04\/4AW1pajFAEQYnd2NjYJ0xvv3nz5vvD\nGcza2vrTM2fOiAmSFiQlBxKQ5r148eKrcPp+w\/omy83NncNy8ixNSiADAUhKEVR3QegZbFSfBfGu\nRmqyXHFnb78tBEFw\/xWQ3qLpxOh+9ys29rmBMNol5Qhz\/luECuNdAUk1OvyZcnqmmobds\/qgP6Bo\n5wTLoDXsWkd9sz9Aploxi0DU1atXZ5j+MTCZyUz2Edo\/C1ZWNkBg4EEAAAAASUVORK5CYII=",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/ixstyle_braised_meat-1334208845.swf",
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
	"food",
	"foodbonus"
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

log.info("ixstyle_braised_meat.js LOADED");

// generated ok 2012-12-03 20:15:09 by martlume
