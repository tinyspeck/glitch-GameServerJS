//#include include/food.js, include/takeable.js

var label = "Wavy Gravy";
var version = "1354598438";
var name_single = "Wavy Gravy";
var name_plural = "Wavy Gravies";
var article = "a";
var description = "One pint of wavy gravy. It's so good, you'll eat it with a spoon.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 12;
var base_cost = 75;
var input_for = [339,345];
var parent_classes = ["wavy_gravy", "food", "takeable"];
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
	if (pc && pc.skills_has("saucery_1") && !pc.making_recipe_is_known("44")) out.push([2, "The recipe for this will become available after you use the <a href=\"\/items\/269\/\" glitch=\"item|saucepan\">Saucepan<\/a> a bit more."]);
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
		'position': {"x":-11,"y":-32,"w":20,"h":32},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAHdklEQVR42rXY+VNTWRYHcP8Dan6a\nmpqyaLURURFQmh0iCQiCEFYJEvZFBdnBhDUQBEIQwhK2sC9BQGQHabaAKEKBINKAdsswpd2\/TQ2\/\nzi9T3zlJDbYzKjPAy626lVTqVd7nnfvuuefeEycO2ba8THQ3fYy51EX7\/ScfY9U3uuyz67gbniZG\nJ7TZNryN++mmOE6n\/9jd8b2ioxXgrKOeatXj4pFxKx6XMOioD61FcMjmpGqUpYsfOacx56yPeVcD\nvHC7gBXPS3jlZYRl+lwixEuuIZ67X8SEy3mMOBlggFAtdmdQbXUKMjNd7QPH2acx6aiHGULOuZ7X\nYBYINk8wldtFTLpewKizAfqvnUMPRx8dV\/XQaKtlYNTpP+iUmpzFcYF5lw2QeP6PXK0gS9yMZXKX\ny2iy0sUQ+3uMXzuLGZdvA5\/Q0Hban6Xh\/V6DKyeslGPQr7Uh3hqSsiYrb2OmIQtTxTGYyg\/G86Ig\nbEvCsFUUhk1JON7Q99W8QCyme2D8vitGM7gYFLpBmeqCmnhH5AVZiLSC25mU6Cx3pO3ONybil5dD\nmOmSQR7rgOIoOxSEWiM\/RN2t8CDYkhCWEAdaIJdvjhzqD4ItIAmzRukdWxRH2tD1lizGgZsDhaqp\n8iBsTTdjd2UMrwYrMJjvi748bzzO9URXNhedmW5oT3dFi+A6mlKdUJ\/kiNoEDqri7FEZcxVld+1Q\nelsD3JMwmQt3JyrjXyiisdwtxu7yMHaWhjFeFnp4YDRLA5SGW1F0TdcETCB\/na81WnuUhsU2If6y\nNIidxQG8Hq7EsOTmoYEVMfYURRYeRtkgP9gMWTzj5mMDP87W9s\/JQ7A1ocDOyyd4v9CL+WbB0YD3\n7FFOyNI7LEjCLZHtb7x3bOBfp+V7auDmeA1+ed6Nn+e7MF7CPxJQjSu\/x4bs7lUUETDn1mUIPC8c\nr4D4eVQKNXBjTI53c514O6vEmJR3xAiyUUEzvyyaTUB6DwOuIM3zHIsZ4EgF3qrasD3TeixgZZwj\nymIcUBTBMHB9SIZtSjGbk40a4FCKE\/oi7dATbotOyoPKpGv\/E1gZy4E83omieI2A1swCXw88xOZE\nPTbG6zAWbY\/pkB8wHmSKYXqP+vyM8NjfCI0B5gcD4xxQlXidPp0gJWBOwGXmgGv9Rdh4WoM3HRKs\nCNgYofW3l4qBR7S+ttnroZmjh65bRmiItD1wiKuTXCFPuA5ppDVE\/ibMAVd7C\/BmqBw7SjEmqO4b\npGLgc2AD1Xv1Dnpo8jE8EFiTcoOi6EJAG2aAH2ZrVXM0EX57nIH3HTl4p0jHU6pWvgasooqlyeM8\nyt0MIfMygZRrBAk9jIyGUw2UU7FQm+qOqqQbn4DHzoP7wI8dKVgXR2M1N\/pAYJX9Gcid9VBGvdJL\nHwUOpyANMNMAqxKcUHefi+pkdyoybJkFviuJwlpWJFaoHwSUmetCYnoSucZ\/Rrrhn5BjffITsDrR\nGQqBJ2pSuRogLXUMAekd3C4MxGp6KJaFIYcGloRY\/Bt4HfVCL4qipybNMArcqQjCyn0+llICDg3c\nnyTVSS5oSPeBQuhN9aEFw8ByPpaT\/LCY6AdVFBuTIm88irFBeyrd\/K41xrJ9MCDkoo5nBgnrzFeB\nNcmuaMy4CUWaL7PAZ9Xh2KDSfSXZD3vdOfhQ7IkJIQcNcbaQRZmjMPgK5NGWaElmoTbWGnLCtITa\nfgGsTb6Bpiwe6tNvMgf8OFcnWmy8h9cpLvjHyzb8cyQPf6\/gYb3QE7MFPmgTuqKJlj1JqClEPEPk\nBRhBSjfvT3P\/Ekg5sDnbHw0ZPA0wk2esYgy4luSMN6Vx+G26Gt1UGLzvE2O7O5N6Bn7qFGCjNREK\ngsgCTfA0mYNeeqAvgKluaBEFoDHTn3ngVkUAlhK8sCa9gyfZHliWRWGhOBRzBYGYEvPwojwCPSIv\n9FHBMCTyQOUtsy+AdZSkW3P4aMoOQEGIObPA1Rwu5gNZUPHtMEz73\/+exf132bQkhmFEwqMhNkc+\n\/aYGilnf\/Q6kJN2aG4RmEZ854IdntVz1nuRVthue+Vtjhmf51TTT7n4JjyLs0Mi3wAPa0O\/P4qIb\n5z4BFQRsywtGS26wBpjlZyw7fgSfKVhqoCrPF6uZrlD5mx8qD\/4HUOCB9gehaBWH7EdQxBhwpiIY\nU7QXWZB4YyHJHhNUB34LWGp3CiWcMyig4S1w1v8ErBd6QpkfTlEM0+zqGAGq2\/awZG+GNu2TMj5+\nLLmFsQJfjN53xmSWC56mO2NY4Ii+FA56Eq5CGWsHRbC5ppop45ujPMzqM6AXlAURNIt5EAf+QEPM\n0Inr7mSlaKEh9nfgEfck6hyoHuKHt+2QwzdVnWCq7UzW6WyPFK9tDkmx3pt3ZKA6xVRRRZ0farkn\n5jN8Xq0+PHo7KlP9bX0Evy4ojwSsprVYGmGzKwkz095h+np\/oWihJXVPVRuDxfaM\/w8Y70A7OgfI\notnNkigtHaB\/3lZ6JDqLysz45y1C1XRdgmq0LGp3oDgEvfn+6BLfhFLki7Ys773mDG9Vg4Croo2S\nTB7D1j3Kvf4FIYcGRR+EhkAAAAAASUVORK5CYII=",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/wavy_gravy-1334214775.swf",
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

log.info("wavy_gravy.js LOADED");

// generated ok 2012-12-03 21:20:38 by martlume
