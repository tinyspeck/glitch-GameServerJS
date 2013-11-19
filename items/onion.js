//#include include/food.js, include/takeable.js

var label = "Onion";
var version = "1354672041";
var name_single = "Onion";
var name_plural = "Onions";
var article = "an";
var description = "A patented no-tears onion.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 80;
var base_cost = 4;
var input_for = [47,64,95,101,103,329,330,335,350];
var parent_classes = ["onion", "crop_base", "food", "takeable"];
var has_instance_props = false;

var classProps = {
	"collection_id"	: "",	// defined by takeable
	"energy_factor"	: "1",	// defined by food
	"produced_by_class"	: "seed_onion"	// defined by crop_base (overridden by onion)
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

// global block from crop_base
this.is_crop = 1;

function getDescExtras(pc){
	var out = [];
	out.push([2, "You can grow this by planting <a href=\"\/items\/285\/\" glitch=\"item|seed_onion\">Onion Seeds<\/a> in a Crop Garden."]);

	// automatically generated source information...
	out.push([2, "This can be purchased from a <a href=\"\/items\/1000007\/\" glitch=\"item|npc_streetspirit_produce\">Produce Vendor<\/a>, a <a href=\"\/items\/365\/\" glitch=\"item|npc_gardening_vendor\">Gardening Tools Vendor<\/a> or <a href=\"\/items\/374\/\" glitch=\"item|npc_jabba1\">Uncle Friendly's Emporium<\/a>."]);
	return out;
}

var tags = [
	"crop",
	"croppery_gardening_supplies"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-14,"y":-31,"w":27,"h":31},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAJn0lEQVR42s2ZB1NU6RKG\/Qf+BH+C\nDDkpSM5BBZFVcWVRDCwgLrruckERQQQJSk6Sg6sDCKigDENWQUAQDMAAQxKVQSQLvre\/7wCyu1W3\nhLv3yqnqOnNmpjjPdPf7ds+wZct\/ONDps23LZj7Q5uOyuQFbT6dtdsCWvz6nyHHQG40y9dwkgD5Y\nrDthyx+3eHvOlLt6KnIcQYC2mwLwS8tpzNccF6\/Azla4YSJ3HzZNiZeavGTz1ccxW+q6jcqtmHt0\nFBN5ThJ2\/T7ZxqU\/QNdf7qel990AF596ieer3DFdejjtS6uPZK7yGKZKD7dMlRxWyIP1\/fv8dCKG\nwowl368Hn3joMahPxS6KpadeEQx2oe4kpu8d8V8VTYr99u9a5rmHbpJPxYcwVezSwsq9+MQTqDi6\n9bv333zVcTGVUvLx9gHJ5J0DUGQ7Yl7qjsUmr\/9\/SfHc23bmwU9YbDwlmZO6SxZqTsgWKFvTZUfw\nqegQJgsPMnFwBS+tA1B+x1pPXiCELMecR4Gf2vpF1fe7NgYu7lydGkvNp9NQd3Lb53oPvflqd7xP\ntcdgiAHkQfoYjjFXDF038e\/PtfIfKdrtP3rXUTxa7CAZFu9RDN3ZjaE7ezBSuBeDf9ihL9cG8j9s\nKWzQX2AFWa4FerJNURe1U1EYoJ6W7CP6tlkvJ7sYjjRV\/LXhaRZ7KjJ3+49EmKTR6xgI3QV5ghlG\nCWCkaA8G8qwwTEDv7u2ncBbOZfsxVuqEtyWOGKb39WZa402qBbpvWqAvz3IV8tVNQ5Rc0lDE\/Kz0\nbVNpPMFh6+QtZ9vZR67bvgKeXlXryA2LluE0K8gLbPD2rgMHYUGZw9Ate4yIHTBefgAfHhzA+\/s\/\ncNix0n0YpfcOF9KHKbDF6xRzdMaZ4HWaKbozTdCZugvlIZpI8FIWJ5xVWb\/w1m4zb6NNtg+lWyvk\n+QRY7MhBxisOQfHQBROPDvPHb+9S5or2EeAyKGWVZXMFcvC2HQZuWaMrwRTt143xmrLYHLsD5cHq\niPVQEv\/XYhotdpQN5FmDzgR2CB8rD2NSQkKqcsUnqSs\/s+t3JfvpQzhRhp055Pij4\/hQcQwT0jMY\nu+eK\/nwrdGeZ4XmUEdri9NEYrY3iC6qI81Te+PbUm2yxbazECf251vzG4+WHONBUtRuma45iuu64\ncK49JTxf6wVF5Rnq1YOghsNkjS8UEk8hiwXWQi9mmaI10hD113RQH6mJnHPKSPBW2tgO2p9n4\/n+\nvjP6s214SccoS1M1bpipo+ny7AI+Uyx1RGPx+TU6x9A5koMtdiRivNIPY2UuGCneSyq3pzLbkGAE\nsbzJMEJj+A7UR2jhUYga4j1Fsg31Y3+enWSMRNGXbY2Pkh9JyY6YqT2GuYYTBBSBxdZAfOlK4FBr\nY6bxPPWnCwbyyYJuU4h3c9vpy7dEb7YZARpTH+5ETag26q5pIO\/8BrI4XuGwVZ5vh1ESgCzLmvfZ\nhwcHMVn9C+Yfn8KXzti\/gbFYaAnBBImICeZdmROYTw4U2HFvZH3Ym2NGajZGa4Ie6sO1ICVFFwUo\nc1WvC3Aw396F+d1okSN6MwTAqVp3UucxLLaH\/S1zn1uDMdt4BgttYdQOrquATM3yW3aUOas\/AbYl\n6qExSgtVlzWpzCqI9xIp1gU4kGcrFiaEI14nm5MgvLHUGU+K9MJC640\/wX3pTCDgZOpPd\/5BJqUn\nOeAYAyx24CXuybAkgVhwQFbitgQBUBqsiZowVZbB9S3F\/fl2MtY\/w2TGXbGmmHsaIJSQ4EaKj3Mg\nFovtERxwpt4DMw0+ZEM\/QkH+yIyb+SEXidie9+CrFLPlHjRCa\/xONDBAymDNVQEw0Vv07TN7IN+W\nZutuPh1exJhQ6aKFbBHUSLEHgRzBfJMfZut\/JvjfqLy+PHus\/9h0YWOQjT42HgfvCGbdm22OV6km\neJNuhKaYHWggm6m6rEGAKusDHLxttZ0shhrcmczWjWaqI6YarmDpRRzmmi5gut4PfZn2gh\/WnuSG\nPVnltjxdDq5mj5V3uJAUfNt2eXEwR1cSTZN0Qzy5QT4YQYBBGqgO5SLBty8SfFWyRl+ODfVdEt3k\nFI+FtgjMPvHHROVPkOfvpTHnzEvKwBQ8cwIcE8dK9lY9cNliXt80Qnv8Luo\/bQ5YeUEDlZdF6+vB\nx\/G7tvfTgvAm1ZKXdUIaSEJxJAOOw0epB\/WY0Ge96bb4QDOYgQkLg\/MauL3L\/vc1ez1ZtDRQeZ9e\no\/6L1EJdOMEFqOPeRSUCFLWsT8U0ml7EmWL68UXMt4SjPcqEzjf4NsNmrVDG\/eSRdvx6deW6uwaO\nSst6j00Qlj1mLy9S9FEdImSvNkwNlYGquHVeiWxmnTOZ\/qisg8QxVOiEydpz1Id2ZDFnqfldKEP7\n+Fq10mc96TYcTOi5PYJqV+EsV63lWbweHl\/X4dmruiTYy8MLKsjyJUBvpfX9ctGTYyp+mWyGV+SB\nzCLelrnSumRJCv6BZ4jZx2rQNY1FnjWmWFZWVoEVuJdMtbF6JAxd7n0se5JAdS6O+wEiNou\/XSAr\nB1mBbTdtHs+uGkKWY8mz0X3TEi8TzTkEa\/6VYNdsY+nNskJPpgWfGLysBNeeYrgMt4OvWLy04eqQ\nXFKj3hMh11e0\/jG3cnSlGSk6YqhvYk34DdmN26+bkOGac2V+DWsuBPZ6T6Y5ujNIrRkmaE00wNO1\ncJECXCWNtjxfFWSfFdQbf1q0se\/ZkjBdT+b6zVcMuMGyjDA1tkUZoyvRlEOvBHuevc7XKRJD0w22\nDDAw3VU4rlqCS\/ERIe2sKnL+pY58f3WUXdHZ+G+SD69oizuTDNAcasAtopusgi2dnYmU2Thjan7h\nmj3PVMq+GDXTGGNZY4KQBpEgAtnMVSfVqiLJWxm5BFUaqoOKcF2UBGsraqN3RHSlGm4Mki2SxYEa\nkmfXybuC9fEyTQBl44pltyPWEG3RBniZaoCOZH0uBAbGjJiNsrprQlmlIaq8rJnn1VByRRvl4TrI\nDVBTPLiqE9Ecp+8vo57fcBYZZN55VXHVVS3yMLIJ+uRsln4NXdSH6VCGtGmuavFyroiBeR2btZJg\nEe+5bAIUU1ZTf1VWFAVp+kujdD17Eoz+mZ9V0n9R8XxAw70hSpOXrjZUi2dpBYgF25D5fA1R41sK\ns5KHQUrIOaOCZG+RLOtXtYgEX2Ux9Z9LRYjKP\/97D\/OrzHMqaUUBqpBeVefbCI8gdR7MfFnGGNhd\nfyUU0JRI8hYp1hpx8m+i\/\/1\/EhgouyltwpLsc8qyTF9lCCFCBkUSbcj8y\/kGvrH9G9nU246wz11Y\nAAAAAElFTkSuQmCC",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/onion-1334213043.swf",
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
	"crop",
	"croppery_gardening_supplies"
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

log.info("onion.js LOADED");

// generated ok 2012-12-04 17:47:21 by ali
