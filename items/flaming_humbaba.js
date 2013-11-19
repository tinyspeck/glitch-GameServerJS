//#include include/drink.js, include/takeable.js

var label = "Flaming Humbaba";
var version = "1347677194";
var name_single = "Flaming Humbaba";
var name_plural = "Flaming Humbabas";
var article = "a";
var description = "A 5-alarm flaming Humbaba.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 24;
var base_cost = 168;
var input_for = [];
var parent_classes = ["flaming_humbaba", "drink", "takeable"];
var has_instance_props = false;

var classProps = {
	"collection_id"	: "",	// defined by takeable
	"drink_mood"	: "5",	// defined by drink (overridden by flaming_humbaba)
	"drink_energy"	: "20",	// defined by drink (overridden by flaming_humbaba)
	"drink_xp"	: "2"	// defined by drink (overridden by flaming_humbaba)
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

verbs.drink = { // defined by flaming_humbaba
	"name"				: "drink",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_single"			: 1,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 53,
	"tooltip"			: "Gives $mood mood, $energy energy, $xp iMG. Grants 'Flaming Grinder'",
	"is_drop_target"		: false,
	"effects"			: function(pc){

		return this.parent_verb_drink_drink_effects(pc);
	},
	"handler"			: function(pc, msg, suppress_activity){

		var failed = 0;

		if (this.parent_verb_drink_drink){
			var success = this.parent_verb_drink_drink(pc, msg);
			failed = success ? 0 : 1;
		}
		if (failed != true){
			pc.buffs_apply("flaming_grinder");
		}

		return failed ? false : true;
	}
};

function parent_verb_drink_drink(pc, msg, suppress_activity){
	return this.drink_drink(pc, msg, suppress_activity);
};

function parent_verb_drink_drink_effects(pc){
	return this.drink_effects(pc);
};

function getDescExtras(pc){
	var out = [];

	// automatically generated buff information...
	out.push([2, "Drinking this will give you the Flaming Grinder buff (refine any ore without using energy)."]);

	// automatically generated source information...
	out.push([2, "This can be made with a <a href=\"\/items\/254\/\" glitch=\"item|cocktail_shaker\">Cocktail Shaker<\/a> or purchased from a <a href=\"\/items\/1000009\/\" glitch=\"item|npc_streetspirit_mining\">Mining Vendor<\/a> or a <a href=\"\/items\/431\/\" glitch=\"item|npc_cooking_vendor\">Meal Vendor<\/a>."]);
	if (pc && !pc.skills_has("cocktailcrafting_1")) out.push([2, "You need to learn <a href=\"\/skills\/44\/\" glitch=\"skill|cocktailcrafting_1\">Cocktail Crafting I<\/a> to use a <a href=\"\/items\/254\/\" glitch=\"item|cocktail_shaker\">Cocktail Shaker<\/a>."]);
	if (pc && !(pc.skills_has("cocktailcrafting_2"))) out.push([2, "The recipe for this will become available after you learn <a href=\"\/skills\/45\/\" glitch=\"skill|cocktailcrafting_2\">Cocktail Crafting II<\/a>."]);
	return out;
}

var tags = [
	"drink",
	"alcohol"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-15,"y":-45,"w":30,"h":45},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAGJUlEQVR42u2Xa0xTZxjH+23J9mHJ\nEr+ZzA9bsoRNRpCLAgMxQhDxBrroFIKdFwRkMMHpvA+dQ7lJxmUITBEKSGlL7+2x5doWoZQitJxe\naA9I5d7SCy2oefYeNr\/tw7xhl\/gkv7znNE3O7\/mf97znPRTKW6p4Cfhs74MPKd5YeyQQu1vynE7x\n1ooTLPnEip\/ejRUtp21v9dIUY3iwJlrwPCda8IweLVhOI8+9UnQzZ5lOEsFdLgtjLwf6e0uipEgU\nz3NqC9fNDWUt0VdgLiWHtC5dXnWZgOYln69p7nUb6J6cILrnZmCzm04SzlrkRvHcD8jj4BZP2aaW\npXvBLUv0YIZ73arJ+TU51vg1LNJ9aYtl5EgS0LTIimC7xXEid08QfZHt14h+R2zmIlm6i+1b7\/B5\n4yJC3P4F75ElkTM0mckZtGS2kqgsmYd4tsa9fKc5stmh3tJsH9zNc+oPtzktWT2uuXiB0xjWZO8J\nu2\/viRcv6uPFLjy8xSE6KZpO\/Qw19tpS3H7Lp\/zhyZM87Uw+f2Q2j290Ufl6O5UzYqW2auaoR4UL\nxRsb7co4tguPZjqHd3Odxn1CF5Emt0\/\/2OuaOyixPw6qtymD6+aVITSrahMiqG5OmcsbPntH8iiv\nQabLuy\/X7RH3zX\/80nIclblQhFtLJOPPqJh5mSo0u6mkIG3YkZKO2fPCGhakAXULyg0k9QvKGJYD\nTxC4CJQacabXNZs74LL9gjjWvvB4K9OmjWRaR\/xr55T+tbPKNIbufFFrD7UAcYMhozbK8CZe\/3j4\nSwmyVWar2Oi49EJwF8teF39bI40qHjDFFiksuyrUlsRyuf1ghcKe3vRo8TJnCPKlOiiVm6BaNQGV\nAxNQrp56WoooUk97UsTj87HVSkvkn1pD6B1Cdrxx5PwLQXqPrp+tIjJeTrD\/sS9HRXDRvBMJKqtZ\nB87SniaerYPjBWJI\/0MOabcVUMAfBgaS4Y9MA0czBa2aSWAhGIhmxH3tJDRqLEBDVKnHgVonheQq\nFiTXsCGxtn2mpVNBa3loUHBVxMVXnodkZx1NjcARyaAGG4Y77fgKhSixBpkR2kaeQLd+Gjr1U9Cu\nm4I2fAokaMTQKNQ+Ab5mAngIhnoMarpxqG4fArqYBQ+6xSDoG2S80vz7tzQHrmarxg4Ewti5w6Ct\nKgA57S60MVnA52PA5wqBx+Eh2MDlIvhs4Ag4wBVxQMyjQVtLASiZv8KwsBCMDQdgkJEB0k5uxhtd\nZshOO+rrC\/VHooDISoCxq2lgvpAM5p\/2gilrG5h+2AyjaUFgzAiC0cxgMOYEgyF1AxjSA0CXEQr6\nS4cAP7oRHuZmqMiG39rCLBFIdqqvpFnNRyPAdC4RzDkJYEqNhtHDIWDc7wuGb78Cw74vQb\/PB\/R7\nfUC33w\/wIxEwdGQLdFSV1byRW\/pf1kdZXYXUmB0F5ot7kOhOMJ2K\/DvBEwFgTEHJpfij9EJAj1Bd\nSbIKpV1Jq\/4OxtrlSYOV2VbiWiwQ17aB+VI4mC58A6bzYTCK0F+Ogk5mLYNs6J3tWsiL9zEKVGMl\nMUCURIP5Fkq1eCtobidDO8bOoHhDkfNKKSxiELSdYK7fARr6CatEJgqneFORkl0yhqm3qxJUXaVJ\nFG+sWpkhGy3WWq\/9WCoUaVL7CKvCqwX7LVatlwsujHi5oM34XvC94HvB\/\/NT3DduU3qdGLlDJj8b\nK6R4fi8xPyDBLVlC3WSQcBI+eqfbrMp29SWWfqavzbKA9VqsXQrjjAGfdhL6WYdSY3VjbabZAY5m\ngsdUmb9b9Z1LgaBHXqkmJBzChsmmHNiIzY2NWV2dnuVnnXOLy9LRBQ+mnHZi4gkbViztF2U3iz5f\nNcE7nXgobRCfrBggJEzCinWgBAdnnZjZ4cEmXUvYY6dnRbhnyonxx2zY791qxT219udVE1yf\/tva\n\/LZe\/FaHUls1MCrlIQlSshclpkai\/QgyVTK9uuExyS30X2oNI25Vb\/P6UzeCEm7dqzx9X9h3pVWq\nKBTJZaUPFLJyiWJlLMHksuv87ocpNS2CwDOFx97NkxIT8wFlx3E\/\/9M3M2KuVdTGXq+sjfuHrbll\n5Z8cyommxHy\/9nUu8RcEOIo+4XdXUQAAAABJRU5ErkJggg==",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/flaming_humbaba-1334193679.swf",
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
	"drink",
	"alcohol"
];
itemDef.keys_in_location = {
	"p"	: "pickup"
};
itemDef.keys_in_pack = {
	"r"	: "drop",
	"n"	: "drink",
	"g"	: "give"
};

log.info("flaming_humbaba.js LOADED");

// generated ok 2012-09-14 19:46:34 by martlume
