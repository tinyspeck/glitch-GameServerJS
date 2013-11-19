//#include include/food.js, include/takeable.js

var label = "Pottine";
var version = "1354649329";
var name_single = "Pottine";
var name_plural = "Pottine";
var article = "a";
var description = "So wrong. But so, so right.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 20;
var base_cost = 267;
var input_for = [];
var parent_classes = ["pottine", "food", "takeable"];
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
	out.push([2, "This can be made with a <a href=\"\/items\/264\/\" glitch=\"item|mike_tyson_grill\">Famous Pugilist Grill<\/a>."]);
	if (pc && !pc.skills_has("grilling_1")) out.push([2, "You need to learn <a href=\"\/skills\/40\/\" glitch=\"skill|grilling_1\">Grilling I<\/a> to use a <a href=\"\/items\/264\/\" glitch=\"item|mike_tyson_grill\">Famous Pugilist Grill<\/a>."]);
	return out;
}

var tags = [
	"newfood",
	"food",
	"foodbonus"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-23,"y":-20,"w":44,"h":20},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAHIElEQVR42u2X+1OU1xnH+Q\/8vZ2M\nmWZimzQT2oyNnU46dJJGN6mRoBPimAhNSoVJNJja4KgRrLUahyrXJmxAl3AJG5TLsiIriLsGWFhg\nL9yWBRYWWBBYLhvui1y+Pc+j7ztbg5U2yW97Zr6z8573fc\/5nO\/zPOe8GxQUaIEWaIEWaN+pTTUr\nN03WJicttOTpp+rSN1OftyY1eMKQqPcaU2J\/cICZpkwVeqs2yUACYkx7NFi6dmSElkxUnQF6tPDW\npkRSn7voYMJwWRymapO9tIAfDG688mTItOkzmrxksi65ZFj3D5U5cYfVXfIhyCV76ish9rRX4KmI\nx2pXKSa+vmjtUu5O6EhT6PvyIjDXkgyf42yJ+u2fxmYofuQarT4P4bbLa0wN+V4A7Wk7Ykd1Cbjb\nUYjZpkzQBErFj9GvjkFL5nvekqhnQIDf3L6AgeKz6Lt6AgtmFVy572Cs4h2sjWtZjel7oI78Jabq\nUlj96mjX9wLYkapQDWuiMWdTYsVRAK8xDblvPoXOrAg48o8wrC52GyoOKVD+vgKNF9\/FYkuecLNI\nAMZgvjUeK32nMaY\/yosjOFd+FC\/Ke+uTUPSUfTcnO1J2hK55itmFle40nlwXtwPtWQd4wlvxu3A5\n9CfIfn0LA5Yfehke\/QXOx7WeK5i3xGOpMw4ew1nUnNkLw4kwFEZshSUt2kspQVGhPJVy95GNHlyx\nF+lnmrP0lGPemujgFecxkKaMZ9D++V8Zgpxru3QQlJ+WT6P4Ov\/NZ\/H5q4\/BcOo1uK8c5Jwk0EVz\nJkzndkL91lYUv\/sCct54WhSTkt+duP1PdGeFs0brMkMfXbGmTyMp32jg6Tqlq+z9rd7yD38Fc1IY\nTIn72aXC\/dtkwBVHMaqO\/YGvSZRn9Yl7OYT9BQcgjeVUf8z3NQefF+G+gOkmJYebwKyJCtQlKOC2\nGTE3N+ean59XCa0PKx6IHNTGeydunePBfS1fQffRq+xMSVQIA5ILFNaBoiNYtH4BZ+EJqMIeR3H0\nr0W40jFrToKn8s+4UxbB+TZrUvIYmkPPcSQoZZbduRgqjUHVX7ay87lv\/JwXsDDqgIBjCRavULAM\nJjqtdGNm3K3qVO7hwb21yQw6qDkr59kXu58SRfEcuzReeRqrfelYvZMNnz2BHV3ryRN59zfM2+LQ\nm72bn7Ocfwlt\/3pN5ORpLDtSxJgZWGq9jBX7VVz90zbk73sWi7YC+DpLZcD7kPogCcxf1eeioI0J\nRuvF7TJo6XsvyKHUx23jiZ2qfaJKkxlwznIUc+ZLHNLmlGjk7NmC6o8ULAqhLSkc800qvk+ixfha\nv0TvlY+5sKQtyJ\/D5XJ5g0ZGRvAg4OXdP2MQaZ8jaaJ\/gYI\/Po2cvU\/K+dZXdFwUTxJchQfQnr6L\nFyNB0jNZOx+\/V933pTnwIso\/+D0DUYHQaUPvOFVvwXXlMKaHO2UG39ISLBYLgqxWK4aHhzE9MyPf\nHHN1MWRhzEugcBPgTHcG7o5dx6TtEx5cWrH+VBh0h3cywI3DClguhGOmUcmhkxZC+Sm5X\/D2M2j4\n+4vywrtUEfC0lMPn82Hp7t17EnDdPT0oKytDUENDg9dkMoFA+\/v7MTk1hZXVVdh1BVhYWMD0qAsu\nTTzGmk5iaUQDj\/U4xHEGOmFos6YCovykbURyyv5ZON+nE4fcIdWfUXDu2hK3w3xeAcOx36C7+qt7\npoh57ohI0vx2ux1GoxFarRbXrl2zBjU2NoYISBVBSrJ3dvJK1gD+pUG8g5UY70hmDVw\/wavPC38C\n2aKC1fu2iHA+JrtE1Wk89VvUnvwd55+k28cVfOpoY15GjqjeiZEhyjMYDAZUVlaioqKCRXDCPZX4\nlT9KgpqbmzcJ0FDJUbKYVkaQy8vL38pT0uyUB5PORpar4TpKj4QxYF3GSeTtfx6Xdz3B24h\/HpKo\nv744G01NTewWhfK+koRCqqqqHv4FJOBKpJD3CEj30BBmZ2fZyUWRJ+uBSnK3NzMg\/dJ167VcBqXw\nUz+lAm1T+THb5WhVV1fLgOXl5ZsfeZoIB2PpRVodATqdTvT29nIoRkdHuZi+mZ6Gx+N5qNxuNwYG\nBlim0hw59JKq1ZdkQJFnDKfRaDb2hSNeCpZeJkDSkHBxcHAQfX19cp8\/PPXTr\/89SRZ9BbJefxKG\nUjUqs1MZUBqf8s4vvKoNf8UIF\/VcLKKiJMBHiWDXAyQRGI1Xo9PK4b1x44Y\/HDkYuWFAsUFupmJp\nb2\/nCShU\/w1OctbhcPCi2traYLPZYDabOVX8dwjSzZs3\/wNuw\/nn36iqxUQqyQXao6S88oej\/vVc\n6+rqYtAHAWtqah50zioU+n9\/tAp3gru7u1VCroeF0F\/kIrkn9tdvOVdfX8\/7HOWeTqdT\/c+ubQRW\nQCSsp9bWVheF1A\/ISrl8\/xBIINGhQKLoBP6wB1qgBVqgbaz9G2d0mZLi6p4LAAAAAElFTkSuQmCC\n",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-11\/pottine-1353117751.swf",
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
	"newfood",
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

log.info("pottine.js LOADED");

// generated ok 2012-12-04 11:28:49 by martlume
