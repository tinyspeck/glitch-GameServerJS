//#include include/food.js, include/takeable.js

var label = "Hot 'n' Fizzy Sauce";
var version = "1354588342";
var name_single = "Hot 'n' Fizzy Sauce";
var name_plural = "Hot 'n' Fizzy Sauces";
var article = "a";
var description = "One jar of potent hot 'n' fizzy sauce. This combustible comestible is packed with energy and all kinds of flaming goodness.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 20;
var base_cost = 48;
var input_for = [4,8,33,60,69,305];
var parent_classes = ["hot_n_fizzy_sauce", "food", "takeable"];
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
	out.push([2, "This can be made with a <a href=\"\/items\/269\/\" glitch=\"item|saucepan\">Saucepan<\/a>."]);
	if (pc && !pc.skills_has("saucery_1")) out.push([2, "You need to learn <a href=\"\/skills\/39\/\" glitch=\"skill|saucery_1\">Saucery I<\/a> to use a <a href=\"\/items\/269\/\" glitch=\"item|saucepan\">Saucepan<\/a>."]);
	if (pc && pc.skills_has("saucery_1") && !pc.making_recipe_is_known("48")) out.push([2, "The recipe for this will become available after you use the <a href=\"\/items\/269\/\" glitch=\"item|saucepan\">Saucepan<\/a> a bit more."]);
	return out;
}

var tags = [
	"food",
	"sauce"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-7,"y":-36,"w":13,"h":36},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAH4klEQVR42s2XWVBUZxqGuUmFVQRk\n76aX03s3a7PLLiDNEiIComMGg1EDoqgoRCKLIksQBFEkstjqiCyKyL64gKASEhQ1GneZceIkRjI9\nNTU1t+\/85yDq3MzNdIN\/1Ven6lw99X7\/\/37vp6f3AZym3Z4djdtcKtuylaZ6H9p51Z+WP\/5tHNSZ\nrmjb4zs1UBrs\/OHAdW9yftmTiqfnUjBYHo5z+X7oK1umGauOXljIvI8\/zhhwlONh1WrN8\/YvcK9p\nLSYbE9FXugwDZWEYPfyJ5lZDHGfBAIuNjSsnVBG4l5eE+2c+w83jibh2NBaXDkagpyQEVw9HY0q9\nqnJB4PpUgsC9RoZQU3yMRSzH5cxwXK8lcJUqAreMafOpbPeOYxv58\/9gZvb7x86UBuNihBsKDA1x\njMdBvUSEUzGuTHvbC\/xpuIVR7lWpn\/NMcZDml8IAPM9eihYPKfYZG+OAvS0qBHwccBKgyJXSZJuZ\nzb9yf9vvy9Gol2n+MRCGXy+E4NkRP9xOdcdxFw6j5D6zxci3t5v+isMaTre3mt8X\/KxUaao5HTb1\n7ztRmBkNx4veYDw844eb25W48UdnNPtRKLEwnc796KP5t5ZsPT3T34+FTP3rBxV+vxaOv\/YF41GL\nH6bqvHAjzQUjSY4YiJVMt4XyF2aCvC4JUP9zcDn+fj0cPw8E43GrP27Xe2O8xA1XCdzQpzJNd7ho\n\/pX7Wl+fk29g0PFThgde94bi5WAInrT5406jD7476I6RDY64GCdDV5ggUKcgufr6gXn6+vl05evr\nq0kNFxgYgK4KyyWok1jjz+V+eHLaHz8e98FEFYHb6oRLK+XoiRAl6xQux9wgg6ikOWhhjsNWVqhn\ns3CKmK+ax8NJygEdMlvUcVk44WKH2+lKTGxxxWiKEy6vlKE7SqTW7eV3NFHvEyzGeWKyI77euLTU\nB32eHuhwc0WLTIw\/SUVolbLRKbNBLcsSFbaLcXGFFJfjFeiNFnXoFO7CGqE6W2GCLFKjK1X4S+pG\n3Fm9CqOq5ejwdMdpAndSImQmRJOEjfNSWzIxbFFkbooGhd1Um1KHRvy6JKhycJ2MgdslN0apJxuT\nSfEYi1LhvLsbUU4MNQFrIFUrEuKIUICjQh5aJXaoFjjga1ue7hLKq+Kg5PtZnqgOsWXgdsqMkUnq\nkAeFCx7uDNx5OR+tMj4axRTqRRSqCCA9xkr5PBTxuNApHD3kXxUF4Zd9Afg53x8HA2ywQ2qMbRJj\nlEvscYIAjjqx0Cd3QA0BO\/QGroIicHwuCricaZ0O+d+K38FNprsxcNtJZRDArWJjlIlYOEba+j7c\nNwTuKPlXJaCwh8Me1hnclfUKFHqYM3Av9izFnQx33CLW8Y2vFQO3hVS6yAi5QitUv4ErI3DFpLU0\nLA2Yw2FrtD7kH+d4T9PK\/Uoi0kuS1V7k+mE6ZymeZvlgMtUNHQmit3CbhUZIExghg1qEQj4bhwUc\n7CP3ro4oWEK+WQ5saBWOvNippzk+78H5M3DPsn3xeKc3Y7oj6xzRFM1HX6IUR4JYSCWAmyhSfCNk\n8YiaRMkaAlgvYiOfw9Kegr+VBA7PlBDl9s\/C3fjSBa1xFM7EUqgkj6NAaQF1JBd3090x9aUSkxvc\nUOFrOwtHaiMB3MAzRCqX2BHXirxie2xl2eVrBe7HXR5qoh7uZnqgOY6PqkAbxk7oB0HfORoujbSz\nM15MQqcSNzcq8X2KK3pWSjAQL8XZSAED9wXXECmkPncwRDLbYDrBTM9UK0ZM57QrKQoUeZkzflcf\nwcbzr3zxZJcPHm73YpTLkJhgYr3rLBz5jq9zwfXPnDC62hHDiXJm3q6n4TiG2Mw30ay10kIYnfO6\nF2SrOuBnifFUF+Q4m+JBpucs3A4v3EpzY+Do+0bDDa9RoDaYjcEEKUbXOGJklYKB64kRoz7AAXX+\nbNT5sP7\/SEXH7bEkBWPEY5uc0J4oZLyueQXFwD3K9MJP27xIi20ItDlubVLiB6JcW7QAea4W6Cft\nZeDi5RhaIUN\/jAS9kWSyhGspUtE57oSzHWPEc3DTu30ZO3mU6U2UU6KMwO11J8p+7sLAfUfaeoO0\ndeyNcucihWgK5aErSoQD7jbag6NPoZERqpZY4ME2T9zb4YEHOz3fwl0ldpJLVKohrexJkKAzTowJ\nAkkvPGN\/cGL2iublFHPnDvnYoTdKjFMBXO3mvSrLJVMtxPG\/FVr+l3IPSFvvbfFAf5IMdaEOZO4u\nQomX9Vs4eq+4kiBHm0qAck9bnA0T4EK4UPth9JCFRXKXowIVFhZoD+IxRjwHd3fzrNedjRUyHjeY\nIMO19+Do3WIwVoq+aDHaQqlhnSWWdrlsqlksRqGJMXpVQtzf6onvN7iiOYZCmY8NagLZGFolx7W1\nThiKl6ElgsKlOTjyKLpUQt2G0RaRyLlTLsA5IYvZ9rvCBW+nBG3E48nODBztdbUBLObONQY6YI\/C\nQvdwc+e0RJR8QiJGDZ3fCGSD3OadEa99Z8Sd0UK0kofRHyNFt0qkaQ\/mzd9u2yCikum4Xk02tMLF\npqiTWjM28v6UGPpUipPBXHRHEriFWLyreTznSgGloXPdfhtrlFsugpqsj\/R9o42YnhI5cnPdL97\/\nc7U0MzMtpbjDxaTdezls5FlbYe8SM9TI7VHrzMKZAIdkvQ\/h5LJYgXRc381hDe8ktZ1lP7zZ3mbe\n4P4DtWnTub9KFncAAAAASUVORK5CYII=",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/hot_n_fizzy_sauce-1334210036.swf",
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
	"sauce"
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

log.info("hot_n_fizzy_sauce.js LOADED");

// generated ok 2012-12-03 18:32:22 by martlume
