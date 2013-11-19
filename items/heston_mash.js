//#include include/food.js, include/takeable.js

var label = "Heston Mash";
var version = "1354649236";
var name_single = "Heston Mash";
var name_plural = "Heston Mashes";
var article = "a";
var description = "This is not just mashed potato, this is the fanciest, zaniest, most delicious mashed potato Ur has ever ingested. And yet, really, it's still just mashed potato.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 10;
var base_cost = 576;
var input_for = [349];
var parent_classes = ["heston_mash", "food", "takeable"];
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
	if (pc && !(pc.skills_has("masterchef_2"))) out.push([2, "The recipe for this will become available after you learn <a href=\"\/skills\/48\/\" glitch=\"skill|masterchef_2\">Master Chef II<\/a>."]);
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
		'position': {"x":-18,"y":-21,"w":36,"h":20},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAIBElEQVR42u2YbVBTVxrH\/bJf9otD\nXVtdHemL0rHWZRW7ndq6zNptt+0wpeu2a7s7I1s\/dN112k7X3bFqFRUqWi2pdFFUaBSwwFiBAhIj\nLwkveSUkgZAXEiACIQRJCISg9NN\/z3PovZsICO3a6YflzDzDzc295\/zO\/\/mf55ywaNFCW2gL7f62\nyXGZdDJcrfhmQpZ6r+eAmsWT49ffnxyvLuMxcT35B4e7c+dO7GRYBiFuh9tN4XBYIcSY3yde3w7r\nTZHPUrD3E6mP+wsVbkiZDNdJ2IBsUBtGB48i6D2IMd8xPmho5Bos1lwcL3wKxaW\/Rmf1h9CoShEa\n\/gzj\/uwoQO+ADSOBPty6dUsxMTGRSsDfG8ztdicH\/P3u0OBVeDTH0NtwmEdPfQr6W\/7EIYWBHe1p\nyJLGovTsJpgv\/BHjwWo4O\/+KS9efhMv+MVokL6M1OxmDxk\/586MBGftejY6ODgQCAbff759\/+ll6\n4ilFvkE7QoMlvPO2wn\/BciWdR3vRfmhPJkCTsQ66U4nQf\/obHtpPnoL2xAZ2\/TyHuNLwClIvx\/A4\nnr9MhJwIlIsTC4\/KYLPW4+bNm8wutYpvwsb4e8LdDrdIhJdveb\/mgKRal\/wInM0ydGkVPBy1l9FR\nlgHD2WQ0n9wC7ekXGfAT38Y63AlVwNe3Fw2q3+J03kMoOfskBxQge2r2we+8wMfx9NZApVJNeTSs\nBhNHMsOKw2Ly2N2mFiLQ93fYyt+F+eK7MGS9BlPeO1xV85d7YZDu4qHNfFaEJCWFa6P0bbQV\/ROd\nylI+OWtFFhqzX0ZJzi+hO5OEYG8+Robl4lgjfhtBKogpMq0iHHmLgO4OZ9UrUByKRe3eB2aMhtRV\nPJSHVopwOslzsMnOcbXNBbu54hSaM68ireBnuJAbh87S3VFihIJy9PZ2c0gOR6uJGRW9PV9NA3S3\nJsHRtAV65RZUZq7C9X0xswJGhuKj5REp\/280p61G7YdL+DNVH8XgavpSGJiatAgjvTnQ34CRkREQ\nG6nnViqVqJFPeYLKQySgqWo9Tl5cws1enhqD+v0PQnlwxaxwdfuWovHII5CfWoP6T+KiABsPz5yB\n+gMr+eqndIuQHiup6CYFIZfLUVjw2ZRRmcGHew\/A5\/obB1R9vgqtX61FbdXjUP37YTQdfZR1uExM\nqyFvp7h4aCHpJVtRfCaOpfABPqmSnF+gXfoGHKXb+fPUV5s8HrqLq6FIe4hHS\/Hj0OcmoOXyWgx1\np0+t8JCWFAQHJAUrK87yL+gBS+3TvBOKhozl\/G9H\/a9gK9vK1RFmrjoWzzyWyxZAOWzV52E8l8JX\nKtXDy+fXQ16ezD+bL7wOv08C+9dJUOc8LPZtLF+HugNLOKBwj4IYaEULgCav1wtz8wfw2PbA0fyS\n+CDN1li4kSvZ1\/4HWEu2chUILi8zBpnnYqAsZqv40m40HI5jNfAFsZRQuiaCBfDo9rPFsBqVdc\/A\n4\/pLFIigZH3qUm6lyPshv5wATYuCwaCUSKvKsqe9TDNzN78merIlayOsVc9BXbQGR\/OninDF6Y2w\nyy9xOAGQdgzaEukdh+0tnGf2+LxgBa+LNuXmaeMQYJNkpfjZ3vw6QmOeqUVit9tTRkdHuZwO3a6o\nF\/WFa2C5sQlDXTvRo9jGFezWv4QW2XruSU3DGxyI0htZiMMjX3C4QecODLvf4de0PZrzNsOlfWEa\nINmIskLXNs0HCIVCGB8fB8ts7KLu7u7FjY2N\/MZEeAC+Hgn3IEku+I9CdfwxXgup7Aj3ulvegj5r\nKy\/aVMAJ0FqUghHPHj4p8m17zZRFPNbt0Oc8wWriq3Bqfj8NksJpPMHhKNg+bRIL9Y0bN8ra2trA\n0s2VtMmzUZ++GdV7lolepBm2SNfxQSM7tV59k4MRoD7zd2iTJnLFvPY\/z+i3xrQ4XvPI78J9l+E9\nDPXJ+Njs4ACj0QiDwZAiAqrV6sTa2lp0dnbS6QL+3k44r52DpegIU\/NZ7kUCjPSJOGvZLg5IBwZV\n+loYcjZwxWZKJfWjPPQYXFX\/4Pu827QTo748lrkAV41lk+\/LLIKU2aj9uKKiwmSxWMCOWVQgxaBZ\nUbQWn0JrfkrUgGSDxpMr0JS2HuqMBLH8kHdnSiEBqjOehiX\/bXaO9DKwIfiH3fzYpdVqBTi0trZO\nP62zNIsqDg8PczjypeCJSFi\/twn99ix01u1Ha+4OqE48z+rjBigOxrF4hEUs\/2u59iL3mxBDro\/Z\nKaaArdABOrTyYxZZSwCjYKDT1RNaZWWllPLf1dUlrqSxsTHuTUo9Be2R9JlWPl9YDDjo62N76m64\nG69MTYKl7Ha4mys0wXaE0YCCh9djxE13FxdBCL1eL8Ixq8Fqtc5+eE1ISPgJ2\/ZM9GJ\/f\/80QFJ2\naGgIg4OD8Hg86Ovr4yr09PSwXeE8DGU5UYPPFQwmSj2z2SyZ80RdUFCwmkxKHRDM3YA+n29GQKu6\nBpovUr8TYKR6zHdl8z72Z2ZmbmKpHnI6nRxyPoBkC0X69nnDtbe3i3Am1mb13WwtJydnE3vPSJBk\n6PkAzldBSi357Vs46ff+Zbdt27blTMl9BDkwMDAnoKOjbU44trUKJSXY1NQU\/z\/\/Lk5KSvopm+0O\nh8PhJqB7AdJE5lJOo9GQ9xRs4vf3B3xRUdHPGeT7zCtuUvO7ArJUQqfTmRhY4g\/+LxAGmsx2HCnt\nOnMBkvJUPlhKY3+UfyYxuHgGmkjhcrmign3340AttIX2\/9T+AyJuOJGmUQtkAAAAAElFTkSuQmCC\n",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-11\/heston_mash-1353117184.swf",
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

log.info("heston_mash.js LOADED");

// generated ok 2012-12-04 11:27:16 by martlume
