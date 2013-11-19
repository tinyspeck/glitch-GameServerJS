//#include include/food.js, include/takeable.js

var label = "Lemon";
var version = "1354589338";
var name_single = "Lemon";
var name_plural = "Lemons";
var article = "a";
var description = "One half of a nice pair of lemons.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 100;
var base_cost = 5;
var input_for = [27,50,53,64,66,76,94,101];
var parent_classes = ["lemon", "food", "takeable"];
var has_instance_props = false;

var classProps = {
	"collection_id"	: "fruits",	// defined by takeable (overridden by lemon)
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
	out.push([2, "This can be made with a <a href=\"\/items\/265\/\" glitch=\"item|fruit_changing_machine\">Fruit Changing Machine<\/a>."]);
	return out;
}

var tags = [
	"food",
	"fruit"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-11,"y":-16,"w":21,"h":16},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAGmUlEQVR42u2XW0xUVxSGly01NrWp\ntdY2aRNM++KDjbb1oWlICKbaB2NtUjUVI6TUtGmIEvXFNjb2wfhUYtKUpBoFi6K1XvACOkp1gBEQ\nkctwmeEOwwADDMPcmDNnzsxkda29zxmxiQEV+yI7+TNnbmd\/+1+XvQ\/A3Jgbc+M5H2EbpCqtYGaF\nmsE8aSU1SQUawDxUCQXOCsjpvQXJ\/xtUlKBUGxSTUMg+H9WOpRjuSMZw9ypUbEtx0pqEwSZAgkR3\nDaDjNmDndWjsugmpz9KtZJWcihBUxJ6EmnMtxoKFGAubMKaWYyxqFYr681Eb24+q81sMdaVgsG05\n+uoX4IAZ0HoJ0FYC5p4yeG1W4Sh8G8Ot4I3YCGxoE0aD+RhTijEWITCtVlzH0YnRUDFGA\/kYGcoi\nwHQMO9Ix1LuBQNehv3U5uqsB6\/4GrP0LKixF8PrsOGeFTIKjcL6C2vDX0jEGUk0Yj1kFmKHoRC5q\no3sx4srGyHA2qq59qDi2o9KfjpOdaehvWYEuC2DzJQHa9NROsnNKC2C4bT5qriwZSoYi54TinQIy\nNpaNUZI2vh81936MDKYLqQPkYN9X5GCaAAy0p6DnLmB\/GWD9OcCOa1D8VDlH1ehVWl5AbWSXCJ8I\nKzkYZweDeRh3ZwnIWCAPo75csQhtOEuEWDg4kEEOZmKoe50ADHak4UTdInRXAbaXAtacAbSXwoEn\nAgw0QgG1DarMj2QBsHsMM3kG4+RWnKDiIbr252JsfC9GXemUn1IPOdi9Roa4e30CcJxyccgsQ91c\nDNhYDMsez70GSA42ArWLBeRGJmqUWzHFhJrnoCwKghQi0ATcaLYEZAcZcDgHlb6NAi5EcMLB9jT0\n3FsoAMfuALZdBawuIidPQ7npGCyeMaC\/Hg5wD1O6U2gyOSEnP+eXNpyOURbn3UiWkDZG343kPAgv\nKezYQv9fQ1X8ZSK8ATvlIPVFtw7IudhrAuy6Rk5eBF\/9WfhlRoC+OugTgL1fiHYR4cqkSbWRbOEi\nOyUqVnfMCK10L4P0DQFuFXBGgTCgr+FdHGdAykFXBTVvAuu9AThM4R6iZt54HizTwnlrYaXvPmDQ\n\/iElOPUyyiMBya2DJMAYcirY6L4pebcZwz1ryb00Ci2J4biC21aLCubwuioBRy0Szk5htl0BbKV8\nLD8Bp2cCeMBbB9QetqI6ehDVsYMYdsrGa0BIZchw6nDq4DZ6\/Z7g0jDct1m4Fx7cNaV6F0r39AIZ\nIciOEtpdLhJYPmDVSfD9tAPemhaQVmn2W5eh4swWUt25qAxmi11BFW4SmGu3vltsQbV\/I6p9n9N3\nmagQnNKzXjo3Jfe8DW8n3OPcGy4HHLhF7pVI9+6fFdVcSdPPmwkgdfwPUPXkSUhHlv7KW1cGaRtV\n5iYRRnYrAWaElGXkXecUOD33OLQMyO4Z4WU1nYc908KR\/al8I3\/bpzjZtQG14GWC24khxw7hiEJh\nDxkOGRLv14nXsPMH+p9syoG2VSKsCbhqearh0HZdf+Ce9YIoDrxbBB9PC0irK+ZVeu4voZbADlD\/\n6s8UYeJJudlyT2MYhfOMnBJ9rlN3zL4a\/c3L0Fu3ACdq4SE4Dq2LnBvUQ0sHBrx9HPDWMaHpw0tw\nK702mniEcm70V5x07EKfdTn6bSmiwTJksIt2A92hYPsn5NIKDBCQr2EReu8lkUCA\/ReOF82AnHcc\n2pZLsjAYruIEYNlR+Gxa93784w3zP1few0DPdxj2nMBA93b01L4qJuHmyhMakwvd01X7MJQBxgXB\n4RwjuBHqeY4yCUcNWUDV6Q7ePAp5MyqOn\/OXpJ47+zK6qhYjOzle9464Oa+eJxOTToF1658ZUJ6a\nB2BuvdcN6dXafV3mG8PV0NZm+VNCkoPNNPWLM97iTh5\/aSXdZA9tPX09JpnMXHUGqHDDokPoYRPw\n1fI7BjI+H7wt\/8+nFrvuHIfVyLsbR6D50E5480lPW\/OoBRTYrsp9sssk981Bs9ToHQmRgK6UW5eT\n3Oq9KaFYLXRSaaAKrTolodg9do7gqp4GLjE6S6GAV29M2FEqDpmPlPG79hLpGvc5biPVpxLVygVR\nSLdOmrXnEXLwcPtVOZmAfYTsU6DY+QY6MVsKZVjZNXM++IoOwbYZFcTjjj56XKQkP0zHdC9XX+MF\nHZjUelm+ZyB26k6hlOEaX5uOwO\/XfoP3n\/kz8QQ95FjPQw5BFhBAI+cUg3BVsvia91XaFXzk2mU6\njO6etae3uTE35sbceA7Hv9XVbt3xuMDVAAAAAElFTkSuQmCC",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/lemon-1334598316.swf",
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
	"fruit"
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

log.info("lemon.js LOADED");

// generated ok 2012-12-03 18:48:58 by martlume
