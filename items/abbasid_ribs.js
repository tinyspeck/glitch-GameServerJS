//#include include/food.js, include/takeable.js

var label = "Abbasid Ribs";
var version = "1354593053";
var name_single = "Abbasid Ribs";
var name_plural = "Abbasid Ribs";
var article = "an";
var description = "Succulent Abbasid ribs, made using a time-honored Abbasidian recipe.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 12;
var base_cost = 201;
var input_for = [];
var parent_classes = ["abbasid_ribs", "food", "takeable"];
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
	if (pc && pc.skills_has("grilling_1") && !pc.making_recipe_is_known("34")) out.push([2, "The recipe for this will become available after you use the <a href=\"\/items\/264\/\" glitch=\"item|mike_tyson_grill\">Famous Pugilist Grill<\/a> a bit more."]);
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
		'position': {"x":-24,"y":-23,"w":47,"h":23},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAJ20lEQVR42u2YeUyUdxrHX7mFObmE\nog4DeLfStBqPime9EBg8QAErgoAIKNYL3aUdtaviCfWom+hqN2vTrt2UTY1GN1VURBkRhhvGQfC+\nK97xSr77PL9xRkZp0m22+8\/6S5685Meb9\/283+f8jSS9XW\/X2\/V\/sj6WJGWkTBoWJZcSoxSSfpqv\ni366r1NhUienojkBzvn\/U5h4laSJlEu6aIWUn+jvXBTXyRUpGnekB3lgVrASMwKVSO+pRopWgVSy\nrK5u2DZrKq5fv46rV6\/iypUruHz5Mi5duoSLFy\/i\/Pnzxubm5qKWlhY9me43gyWrpNBkb8mY\/o4z\nsrQeyO6mwMKeCmR3V2DpeyrkkKWHKARYUlcZ4v1cEevliFnekrBM2t+aHIs9uQtQV2YQsGwMeuHC\nBRAkzp07h6amJphMpkKz2TzsV8MN8ZBCI5UOrTqVA1L8HLGIoNgWEGR6kAVqRmd3kGsRoXREuLyD\nzWJ8nMEqzyaVs7XumBfYEVtJ0Zs3b+LWrVu4ffs27ty5g9bWVrHHCjMoQaKhocFYX1\/\/y6D7l\/Qr\nPJk3oujHnEEte+Z8gIVhARgud8Jsgszs4opwH3eMVHfEeIWDgBkic8JHMmeMkjkgwtsVs7qrEKdV\nI7uXCmn0IbPpQ9I7uwpFN8aOh2H\/P+0A7927h\/v37+Phw4di\/+zZsyBA1NXVGdsFXD7OH4dyB+HU\n2pE2yx4cIF4wkdRkmNFyR+gUks1ivJwwv4cceQPU+KKfGokUk1aL8eso7knykmyuXxX+EZqqK98A\nfPToER4\/fowbN24wIGpra42krNIOMHeMv3FleAC2TX9lK8P9EOfZATPpJQmelpdMUUqI93USicJx\nmEmun9tDiXhSb7LGEzo\/D4xSOGO4zBET5HS\/ugMyNG6Yq7W4fQ7F9dcL09sFfPLkiQiFmpoaVFVV\n2Su5c5ZWkz\/FV78qSqHPHvZO68z33BEb4iYArQqkdXLA\/GAPbBqkxlpSjeFYrYRAFWL83UnpDjZ1\nx8gdMIFidFEfJdYM8BSx+yndz8\/gZ\/1YsKZdwKdPnwqXV1dXo7KystAOctOmTcP+9dNP2Ry4BWvz\nEB7S1eJahaNwc5J3B+R0c8eid9WIC1QjKVCBhAAP6Dyd7FzPoPH+HRGrsajKNk2jwiRvF8SwB9SS\n8EqmluAjwoTdvnbVBvj8+XNcu3aNAVFRUfEqcTbk52PLqiXYv2YyDq6Lwb6VETiyYqiIx4z+fgKU\nv54Ks+VlVFqoRgq3syWROqmUGGlaS7YnB1oUntZZjvFqF1tSJXg7Yn6gK3J7yyjjPZDWpSOygpRo\nKjfYAF+8eCHikQCLbIBbt28vWp8dizXRGpxYPdwuYb6dG4qxvm7iy60ut1qKD6lBJWVlqBJLelDN\nJFfOJLj4rkpM9nG1KRtGmT9C5YYsyvSlfVWYEaTGVFJ5It0zkf7PkFebTDZAThqj0ciQGgmAkulr\nSg9j2Vgt1k\/qivVTAoStju6EpaMUCPd3tYtJq3G9s9ZLtnnBckzzc8MEKknUiWyAUzq5IbW7WsSs\nKPIcIp1lomzx\/2dQIi5+X4PrzWYByDFKcBY3P3v2LJEBz5w5g4N\/3YC1On8BxZY1UIZPelMd9HQR\nscgZHaF0EC4fS5bka6mVqQGuSKCuEk3ubut6zuTkrh6iA83vqbQUe3J9VIASYXJnjKSMj6APYRX5\ng5cQ5KGvNuL6pYsCsLy8XC+RrHorIG3gu717wTHJtuLzz5AeMwlT+r2PicE+oj6uCA8W11FebuCu\nw64fQ3WSy4tOaVGZ96b4uJBScgHV1rgb8Ye0TayZXTyQEWTxQpSXC2Lpw\/786WwYDGVvAh47fhwU\nk9i4IQ97Vqfgh4IslGxPtotLth1JfYWSDMPqMiw\/mAET6YUJlO1pQa+Sht0b7dvRzvWT1A5Y2JsG\njhAVErUqZGhlwt3WeE8O8c6XCE7Paf5SUnEtKyvD4QOFWBDmg\/yp3UTiHP\/TUOzL6Y\/daT1FbKb3\n98BIaontJQ4X5vX9KSF6KURmM3CU2tKN2PVxVG5YxYW95Fg10AsJwZ6W0uRp6fHsdr5nqNy5xQbI\nE4YVkOsQVXTs0qdTHHrh87G+IiaXx\/TG8pQxiPtAK0oHG0OyeuFUnFlRq9u5l\/PQMZnK0mgq3pOU\nlq4kjF6eEeSOvIGeSOvlhUldVIj0tHQhfqaAVHKbdWqVfm5tFYB37959A5Bbj+HIPpQc+A77fvgW\nBVu22OIzZ14W4sIGigfGBKuwOb6PcHtkZw+RQKwmDx38f06WGQTN+ww4nRKK2+R0Uk5HCRNFHzWO\noBiQr9wquTQNljkVSmZzi+7Bgwei5fDM9jogNXAxbfztm29scHu\/3oLqfflkBTixKdouNr+aESKg\nGIhj0hqXVksNcMGC3paMnt5FhihFB7tuFElmnZgGyZyGSTw9XLl6rZUBuTfSENkuIM1tKCkpEfF5\naHcevpgQgAPLBgiog38ciD0ZfURszh8is7hJ6fhGfCb6OIhBg+31bLbG54iXqg\/2cN5t6yTmcy36\n27d\/Fg2c1WQl2wNsbGwU81uloRh\/iHxXJJF+nKeIz89i+2Jx3McY7i23xSdnNxd4q\/GcmBnojlR\/\nZxGTosy8LNTs+uGv4Fo+pDOQDZBVNDc1t96heY0BuZLz7MZqtgfI+6a6KlQcKcTB7\/+CdetW29y\/\n+csvsTZ3GeZER9jBsjGAtSNNVVEIqCxzI++FvXQrJwZP928Mrqbm5lCT+RyN5LfEzMZJw5DcF3nK\neR2Q9xppZN+xa5cA20nXUoNBjPM8kfBhaef2zdie\/CG+n2+xOf19BETbuLQOxVbl2oWzrkazWddg\nMqO55QLY5QzIozrPaXxi48MPH3ysgPw3ndhESDAQn+QYsOHgVtT8YzkM+RF2CbTtEy2iqDWOfKkk\nZ\/UrhZ2K7Nz6S8tkag6tazQV1TeacJleZj308JUPPKwoK2Q9VlqPlmwMysA7FseiYGoIjWxhosD\/\nfV5frJjgbSnuni52bh\/t71002E3S\/MdH0Nr6xvza+gbUNzSipeU8QV0XcKwkA7Y9\/7aFo3MvztZX\nY\/eKTBTMHou1SYNEcc9bvgQrcpZgaUoyclOTMSdibOFvAmu7ampModW1dUXVNXWoqq5FTV0DTGfJ\nveTaFoLhaxO52kxd6CwnDsVno+UoSRWgFkYqV6WG09TfT+DosWIUHT2Ow0VHC48cOT7sv\/pLA2Wx\npqqqJttYWW0kQ7mxCmcqKlFWbsTpMxUwlJWj9HQZThHMyVIDSk6V4sTJUyguOYljxSdajx4v3n3s\n2InEwyUlmt\/9Z5EKgq2oqNYRpJ4AhREgWZn+lIHNoC85RVZSqisuNoS+\/VXr7Xq7fuf1b9KidwRi\nZ2w8AAAAAElFTkSuQmCC",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/abbasid_ribs-1334209992.swf",
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

log.info("abbasid_ribs.js LOADED");

// generated ok 2012-12-03 19:50:53 by martlume
