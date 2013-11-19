//#include include/food.js, include/takeable.js

var label = "Tasty Pasta";
var version = "1354595637";
var name_single = "Tasty Pasta";
var name_plural = "Tasty Pastas";
var article = "a";
var description = "A bowl of extra-long noodles with rich bolognese sauce.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 12;
var base_cost = 338;
var input_for = [];
var parent_classes = ["tasty_pasta", "food", "takeable"];
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
	if (pc && pc.skills_has("masterchef_1") && !pc.making_recipe_is_known("30")) out.push([2, "The recipe for this will become available after you use the <a href=\"\/items\/268\/\" glitch=\"item|awesome_pot\">Awesome Pot<\/a> a bit more."]);
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
		'position': {"x":-18,"y":-21,"w":36,"h":20},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAI3ElEQVR42u2XaVRU5xnH\/dIviWVm\nYtV42nPaL21zUjeCSiSuxKVuoRppI4kQkS0QxRBAIwEiAsrozCggyCYgu+zIogIOyjIDAgOOrMO+\nDaCIAurHf5\/nkuE0jcYkx7Q9p7znPOfO3Lnzvr\/7f\/7Pc987Z87smB2zY3b8742ENeJl8WvErhS+\nsRRRZmKLyNXi9RwRJhLRfxUue9N8xbXtv8WNHb+bifT3FyDyPQkSN8wXvudsWYTQ1ZLu\/zhshvm8\n7IK\/LkL+1um4SpG5aSFi1kgEwKJt0+Ap5gsQYCKC1zIjJNlvUzYWpCqVF0761mXG+j558sTilQHx\nZBS+Dx480DRmxyN1vQTJFInrJLi8VoI4iksEF7v2DcStm4eLZhKEUchXieG5xEgADDObh6zNi4S4\nsulNhO9aiprCTPCcPPfPAn727Nn6qakpZVVVFSIjI6FQKJC413gGMNhUBG9aXLZKhNwtbwqqJW1c\ngKAVIpymOGcqpqMYpygS6bzBCpz6ABMJPJYaIcR+NyoqKtDU1ASC1PCaLwUjqGV0cfadO3dw4cIF\nSKVSyGQyhHm5Io0UyDT\/DfK2LET8WjEurhaTgm9Mp3TjfAStFBGQCIEU5D9IV4rh944IMlMJEjYs\nQDqpd2aVBJ4E57rYiCBFCHPcg\/LycqjVanR1deHRo0fZzPBcuKdPn7oODQ0hIiICgYGBOON\/AunW\n65C\/8w\/INp+HuDViQcGEdWIEmpACpGLyhnnIoAKREhwDGlLMgMHvSnCO4jSBBpiIISW4r5eLBPXc\nKbyNxfCiCLXdjsrKSgGytrYWo6OjYJZ\/91os30FQUBD8\/f1xRuqPa4dWC2AMdZng4t4TI8ZMBGor\n3\/Ng9LdFcoFUlVN62YMGQK\/lBENgp79V9BtjEU68Q58p1T509CQlY45ZC4A1NTUCJAvFTDPKjY2N\nCar5+fkJgCmxPlCeNEfS4fUIOfgBhQUibM1w2W4ZglcZvRCQU8wp9CYo9lseVflZgj2+ZC7c3n4d\n4U7vItZ9M+T7zOD859fg+KfXYP\/H1+CyVIJb6V7obinAYNdtaOrUuH\/\/\/rSSlPPusrIyxIR7oaM+\nFBPDSkyM3MZISzAGtArkJXohJ9oFxQkH0VkbhLQDpoKKuZsXCv4Lo3SeJ9UYkI\/sQYOCp6jVHFs8\nFx5\/eR1nP15M84VjYrQORXEOkNkbI2DfW4h2M0Nh5IdQpn4MbdlhdKoPo6PmBHQ6HZiN0wtl6TUM\nNAbg8VAJHutvYrQ9CvqmIIKUY1ArR2GMDXRVPijPcUZ+yF4oVhoJRRJBfju7wghn6buCKlpGPvQ3\nNoLf8l\/Da+lcfEXK+ayej2TfbajM\/gIjPZU0Xyiqcg6jINYKUX6UJcVWNFy3R0\/NETSVOUGljISm\nxBm92ihOMwRAzn9b1ZfoqzuG9Fg35FxyRu21oyhNdkBN\/hHo7wWhXf011Ffd0Xz7JPKkuxBt9RYS\nrE0R\/dFypLruQI7PTpTIDqJY7oBs372I\/twUWTIL3MqyQ0mqDYouW2G0KxdVVx0xqovFSFc+qgv9\nUZZ+iMBcBMA2ta\/gwTvVSrQ3q6YBud+xB1PjfNFb64n0GCcknt2BG0m2KEmxpTv9B3pqvVBf6g6t\n0htFCVYoTvlEOF9b5E6KhKOvMQQj7fHoqgvB1GgVnozVo68hDD2aUHTUXoQqzxU3Euygq5YiLmAr\nEqU7UXfdBTqVO7rrT6Jf4yMAclSry1FfXy94kNnmNDY2WjNpQ0MDMuLc0FntgaZbR6AucERulCVq\nrtqTAlbIDt+LjjtSTI7dQ5e2CI03A2mBU2SHCLSq\/NGvjcbjvhT6Ho3BpghM6QvRXO6LLvLtA91F\n9NRJ0VkThIRT26HKOoCGYnsqDCsUxHyIDtURtNz+jJR0RFTgAbS3Cs2bq1kxx9LSUkQpnhIga24h\nSW6B8uxP0V7lQSn\/Cg0ljmgo\/QKqfGdK10GUZ31G\/pRh8O4ZtFb6kBJHMKxLxsP+QlRfPYS8cEuU\nJNticjAbxZSFVPkHSD+3G6qcz4XC02sDcSvDBvFBWyB1MYWuIR3qwqOksjXyY3fhetp5AU6v16Ot\nrW26aV+5ciWN++Dk5CSGBnqRF++D0OPm6FK7Uhrt0Fl3HsOtl6C84on73bl07hCuJ+ynG3FCS+U3\neNCZiMosR+TH7KObcMCNRBtSMxU3U50oC39HesjfyMsO6K33Q0UWFUStN64nfQS\/g8bwsV4C7\/1L\nkCCzRdvdCgGur68Pra2typlGLZfLVyiVSnR0dGB4eHj6Dgb70N2UQz6SIU2+CxWZDuQRN5QmfYo0\nhQUyQ\/fgZood9C2hpLA7rsXvpwJwQW+DnJQ9hfGey7id4Up28afr9yAvei\/Z4kvy9zZEem+ionSD\nMt1ZUKxFUy6sOTIygrq6OlaOAb+7iWAV2Zz8Iz9uyKBC8B8fjfVjUJeDhvJgoe2ocg9DU+yBXs1p\nWsgbORctkRGyG\/lRn1CaPXAz2QljnVGkqiuifN5H+PGNdJN7qMg8UZpxlPqqN\/R90z4bHx9HZ2cn\nqBaER969e\/e+q55hBAcHzy8uLh5nwPb2dkxMTAiAfOTg9POEHFOTDzExpkNLbRZqSi59L7RVKXik\nrxBifKhcuHbysX7m\/wzFIjQ3NwtQhuAWQ3DjZLffP3fDkJaWtkmlUgkq9vb2zgDSLgMPHz4EtyPa\nxwmfeRE+z8GfOfj884Jh2PQ9PT2CjXh+Dl7LAMe9uKWlhc\/b\/OCWq6CgwJXl5gn4of2vgAzHi7FP\nBwcHMTAwINxId3e3kCZ+PBkWf1kYUsrB+06GI\/Vcf9SGtbCw0N0AyUC\/BKBBPYbjTSud8\/1Ju+q8\nvDw7gpziyTg9rxKQK9UAR0Ux\/tK0vmhQZb999+7dNJ60v7\/\/lQAaUsueo7ljX1gQP3aYmJj8SqvV\n2nF1sckZ7ucC8uOU4eiVYpw8Z\/NKXznJl\/NpEQW1oHHu9D8FkAuAWwipNk7pVdC1v+z7Mnd5guH0\nCKr+EKBGo3lMb2+JBGcxZ3bMjtnxfzj+CUY0enhTIwgTAAAAAElFTkSuQmCC",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/tasty_pasta-1334209340.swf",
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

log.info("tasty_pasta.js LOADED");

// generated ok 2012-12-03 20:33:57 by martlume
