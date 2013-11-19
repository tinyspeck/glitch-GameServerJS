//#include include/food.js, include/takeable.js

var label = "Flour";
var version = "1354597642";
var name_single = "Flour";
var name_plural = "Flour";
var article = "a";
var description = "Some ordinary white, powdery flour.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 80;
var base_cost = 7;
var input_for = [2,139,140,141,227,288,325,334,336];
var parent_classes = ["flour", "food", "takeable"];
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
	out.push([2, "This can be made with a <a href=\"\/items\/250\/\" glitch=\"item|knife_and_board\">Knife & Board<\/a>."]);
	if (pc && !pc.skills_has("ezcooking_1")) out.push([2, "You need to learn <a href=\"\/skills\/35\/\" glitch=\"skill|ezcooking_1\">EZ Cooking I<\/a> to use a <a href=\"\/items\/250\/\" glitch=\"item|knife_and_board\">Knife & Board<\/a>."]);
	return out;
}

var tags = [
	"food"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-16,"y":-27,"w":30,"h":28},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAALmklEQVR42u2Y+29a5xnH8\/N+2Z+w\n\/VBVU1Rt0+6aqm2aqqqqunbq2q5bp6bqul6y3NZGaZpeTtqkIc6ljpM4duIYHBvHl2NsDObYYAyY\nO5ibuZuLMXcwYGzABt949r6HgHGcOEmz\/TBpr\/RI6BgffXie9\/v9vufs2fP\/9V9cpjj8dioKLxmj\nQIxNZw9z9QkWd2qeLp4xRRffnEGVZQksuBZZo1ZcOdaYDVeeNe5aZhgisM8QhsP4fqYI\/OjxoNAN\n0M2GBrUx14lWUc+RS3zWXz7taHz6rfPE795tIp7Z30w8e+g68fyHLOLFY13Eyyf6iNe+4BCvnxom\n\/sYQEG+dHyfeaZQS7zeriAPXdcSRdiPx4S0b0cALNN6QJVg9usUWiWdVOhWBRlMMvvdI3TJEytJu\nmd\/8h4OXG3\/4x+PET175jPjZ66eIX73JIJ5+ewvwuUNtNOCHl7iNl\/ulrCukjNXMkbNahhSsVp6K\ndYOvZd0NeKzbRTTwQy2dqrR50LhUFNhXQOpbh+lYGbwpgNlMpfwZaAxk4aUamGEBvot+jZk94TX\/\n8s+fMp587hCx94WjBA342hfEL\/5aBbx4B7ClBhiMeONLS0FYXJyFbNYHC5kZyKSdkE7ZIRixZNvH\n9Kwj7WbiKAJk9FulTVwbNAtc0K2Kw5A5B3x7EfiONQS6iUABLNtriAbEcDJ3IfvTP33MeOKZ\/cST\nzx8h9r6IAF\/eAvz1mw01wPOdYyyR1iQNRf3xfC4MW4DeGmAqZYP5+WlIJk3g9E4FOsfNrFM9RmlD\nrx7Okwa4yDHDtVEPDJhLwJleg0HbBigCAHJvsUBZsvMTznwW7VvAe38P\/sA3JAPf\/\/27xBPPHiB+\ngACfogFPbAP8DQK0e32ulZUULC8noJCPQW4HoLsO0ALJhAkS8SmIx7SgntbEGb1G13nSSAM2Ux4g\nESBpXiu269Z6BO7yKM+UjrzxJYfE1ULNmKfC5QDdQQz5+Q3h0L0BvyZeOnyF4QsFA8ViBmjAQj3g\nXAVw4S7AJAY01gCjURWIDIbRk4MBRsOgU3pZ4At06lfMV+UrjWzDeosuDEW+MSPad4ZLvonqRLtS\nhLn2YMXiD9VOvvFJe8tTLx4jfnwHsIMnH8rls8VSaRHqAfP56BZg1l8DTKcddwHqIXYHMBJWADVl\nHjrFjxOM0QzRJF1iUO4NqS5ULqJGleTe1RPvNIyQb9PFJ2lAPGfKPD93gzctV\/hLOXyRp4s6Dzd0\ntsyGY4G1tWVYXc1BDXC5HjBUB+iBTA3Qek\/AYFgH\/pAZxI6ERuxZoyenmtuco1ybXAyIneS9i0Ly\nvQtC8h8XRiuA+KLUXUh\/cLqbeeDsbebUXCkXWSxvlsubaG1AurAO4ewqhBaKEMysQDBdgLl0HmIL\nGUgsJCGeiUM8HYVoKgyR+SCqAIQTfgjFveCLhWAmGgFHZB7MkSI9JUs4D95YHMzBxdlBS7GbtK4x\nhx2bbBoGrf2XxeT+S5WqjBjZDP7wwZlu5vGmPrY2uFFKFQCiS2VwJMr0TbEFuJIbd2odnIk1qG6L\n3coWzYE9sgAzkTB4Ix4IhVUQDknRPnVAJKJfE9riXAwonNmksBYw4KFmGXkQ1xUZSYuE9sIwZE+z\nxNw2gVVevTn2Ig8y0EQOoLS2CevrK2jUeXrUeB8WCnHILaERLwYqHkiP2EV7YGoej9gMiYQB4njE\nUQ1EI0q0B+U0YDptp6+5fdL0sDXPnvSXTVgLmOVfrUoS13GmhouDowKIPlzm6MUXe1WUEcE5kxVX\njyG47AoAUgjaf4v3AAzWAc7sCmjrI8Cm7gTr9AjMuOWg1fSDcPQaCCa4HmUAPLTnoXXspo482qYh\nm\/ge2VQYWDQg\/mO31Gc60NDLVM+WcncD5vMLaCyzSKUBJIoospVQDRBbTAYZtM0qAJNhEAz6Abr8\nPlkFMIaE4ZsAbcsBkEmYoFL2gtUyDvLJLhqQp5BrkYrTWAvEdcN3PrllID9hGcgOWURfhcZmvW\/c\nlo1hwEFN2H43YG4pSQMmEy40JjMEZjXgnZGBw0aBDXVk2swDs5FbA9Rr+0Gr7gWN6jaoFGxQTHaC\n9Ju\/04BGAx+mLSKQdH8JoraPgDtpovCWwgcHgm3f+xnbQuIi9SkHhq6dYBS+Yu5AQx+TlOi02wCX\nN9EYIzsAPe5HA5R89QpIb58EHfcS6MlzIB66CGMUGrFrnYs1gDmIfvvek70O8mSPg5xwL89vO+3g\nX3EIAbaSFOVKrNcAl5aXtwDjW4DGzs9B23oIje4gaK4dAHXzP0F1dT8or34Aiivvg6L1MCj6z4Ci\n7zRM9n4FkrNvgHSCibaCGMwmCsSiNqCEt9Ji76a8KoYzXO\/e0xw3eYp0k7pgObntuIVl3tiroT69\nOsj2xJdowHiuDPlCqg7QWddBKdit1Q4Oow4OgXFqEKZ0JOpgH+pgD6iV3aCUd6EO3qJHLJ1oR98f\nB5NRAKKxFhCIyTmsYHw2xAznhmdfbeD6yKtjQUFNwTVApJibApv88AUO04+MFAPmlgsoc+fvAPor\ngCFTHaAAbXh+HSDngYAzLhXodcM0IH9SbNLMlWNYA5jh4kjw1Qv8IHlLkZLVBFIbMTqSc9RhOwbU\nu2djC4VVKCFrwYCLjwio02wHlMu2AN0uJdqbJA04pHVS+lA5V30MaBRGTzaORkj+dMGBHzV2nKjF\n9sUYBlQaVJ51lMH3BfRvB7SYhpFAHgyoVvWCZbQN5F0EiJoPwpAm3l+NOLyuilPnrogTpMSzFsEJ\nt72D6AKOucPfcJhChdRUKma3AaZT2wEd2gEwCZrAwL8EU7xvkDovgm7oPGgGz4F64CwoSQYSydcg\nRyKRITvBIlGSZ8FuHEXAbBgTsnKUa6MWcXi1yjLkNVTquU37PZ9LcPYdb6bYNwaEVCGf3BVw5gEd\nrFoM7qCs50vaYoyGEXDYpSARtwMlHpgTeze01bRgyvN72xRLJEu9yK3G3o6FldM4oKMYrJH+hcws\nHW8YtAqYiDvqACW0gq0WHgLc8sApXT8C7K0D7NwGaLdOwMR4G\/ClYpMisFmLOJZu5VWmpkByzEUZ\n1sM9AfGXuyRe7UeXuMzUvKsOMIwAfTRgmAZU1wCxSe8GiE1adusEDeiwy1AWi2Fc2ApDKielRgqu\npkWXcfVcp2GVFHk2thJkx4iRcviGhAcDemct6W8DeL+Yk45dowENUjaM3zwKAwovLZCqGPrM8HyP\nebMDGbdj14d2sWMp9lHTMFNvkc\/dD3DWp0YiIcE4cgkMvEbQDyOBcC+AdggJhNMAqgEGEkQ1RU5V\nYq7jONjHb4FmpBmEwpslnn21FnH1S+yHn+\/6AI9\/FQbESi4U5iuA2Z2Abpdk1xxWK+\/qIIo5r0dH\nn2YocW9szL0u3pEWD7PwP33VIevv4o+L8dHq4QArMVcBrHrg7VqKSD57gfZAz4wGXeumE0Tq2zDt\nSIuHWTgXmzgG6vLtMW465dkGGI9hQCMCVCHAiUeKOQw441ajIxcLhsUSOfK62I60eKgOIokPaqP2\nY1cFzETc9tiAOEWwSWv7zoB5+DKI2z8GzpiGq6uLuEd+5TbhyMUw4IzPmM7fB9Bp5tdShBZJXYpg\nkdRSBFkMBjQZR8DlVIBAwvNwLEV2fcQ9WgfpyNssMbom+0mRRJ7Lz2\/UA4aCRvB7tzr4MDksQSN2\nONXLBqfb2WssMEUz6\/L6iPsWQoF9GPIaz0p5gglvPBlbiMT8uWjUsf4wgBpVBXBicihGyYT2Pt44\nZQ4VJ1W+FZHEs46f4LKP\/SITb2D8K02RjZIluJLUezNuuSNhlZo8apHWphyWGyRsoYrC1S3S0nV7\nQodqiuqYcPRfl0SZHfIkm2NaonjWgtgS3UgbwuV1nL2P9OLyIUEbsf1UXzSp\/KWU0ldMyjzFmMxb\njE16S3QpfKuV8q\/FVIH1NO4U\/j\/6\/Q9+BfyfBNttj9Lvmh9UjzvC\/5X1bxnRPGj0w8Z+AAAAAElF\nTkSuQmCC",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/flour-1334340497.swf",
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
	"food"
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

log.info("flour.js LOADED");

// generated ok 2012-12-03 21:07:22 by martlume
