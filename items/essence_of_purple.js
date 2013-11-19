//#include include/takeable.js

var label = "Essence of Purple";
var version = "1348002530";
var name_single = "Essence of Purple";
var name_plural = "Essences of Purple";
var article = "an";
var description = "You thought Purple was purple? This is seriously purple. Seriously: The purplest.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 20;
var base_cost = 491;
var input_for = [239,245,248,306,307,312];
var parent_classes = ["essence_of_purple", "tincture_base", "takeable"];
var has_instance_props = false;

var classProps = {
	"collection_id"	: ""	// defined by takeable
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

verbs.imbibe = { // defined by essence_of_purple
	"name"				: "imbibe",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_single"			: 1,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 53,
	"tooltip"			: "Drink to see how deep the rabbit hole really goes",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (pc.is_dead) {
			return {state: 'disabled', reason: "Nope, it's probably for abusing things like this that you wound up in hell in the first place."};
		}
		if (pc.buffs_has('purple_journey')) {
			return {state: 'disabled', reason: "More? Are you insane? Wait, what if you are? What if this isn't the drugs? Maybe this is just your life now, forever."};
		}
		if (pc.buffs_has('purpled_out')) {
			return {state: 'disabled', reason: "Ugh, you don't even want to look at this right now, much less drink it."};
		}

		return {state:'enabled'}
	},
	"handler"			: function(pc, msg, suppress_activity){

		if (pc.taken_purple) {
			pc.sendActivity("Nope, nothing.");
			this.apiDelete();
		} else {
			pc.taken_purple = true;
			pc.sendActivity("Hm… tastes strangely woody, and a little sour.");
			pc.apiSetTimerX('begin_purple_journey', 15 * 1000, 0);
			this.apiDelete();
		}
	}
};

function getDescExtras(pc){
	var out = [];

	// automatically generated buff information...
	out.push([2, "Imbibing this will give you the Purple Journey buff (it cannot be described... only experienced)."]);

	// automatically generated source information...
	out.push([2, "This can be made with a <a href=\"\/items\/980\/\" glitch=\"item|tincturing_kit\">Tincturing Kit<\/a>."]);
	if (pc && !pc.skills_has("tincturing_1")) out.push([2, "You need to learn <a href=\"\/skills\/132\/\" glitch=\"skill|tincturing_1\">Tincturing<\/a> to use a <a href=\"\/items\/980\/\" glitch=\"item|tincturing_kit\">Tincturing Kit<\/a>."]);
	return out;
}

var tags = [
	"tincture",
	"tinctures_potions",
	"no_rube"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-9,"y":-39,"w":17,"h":39},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAHDUlEQVR42t3Y60+TWR4HcP8D\/4R5\nM++cxImzm8062WUya9R1Z2RRwIm7I64zKAzr4BUXRCojyP2iMqByv7VQboVyp\/da6OXpDVoopXeg\nhRYpYEFAzXdPH9dOzE58sUlLsk\/yzXOavugnv\/P8znNO9+37f73Y+XH724piox9lnGRUMf4qbMyL\nFbIK4kKhPxfFM3KuHoveE2Bn+TfC\/p+\/RXvRGbAK4+k8zY4JjRtyT6PqzklUZn6Nb45\/wog4sLUk\nlkGC3oqzaCuORxMBBfOUcRLVjGhUZZ1EVsoRXIz9DOe+\/jR6T4DF6X\/BIwJqLDyF6nvRKE07jqLr\nx5D1w5e49Y\/Pcf3c73E++lOkJ\/4hKuJAZmlcVHNRLFqKY3E9kYCSjqAmJ5oGlv\/rBH0PAi\/\/7Xdo\nLok5GHFgYfqfo+ryYnD3ylH8TKa0JucUglPekB\/ztorJX+LaucP47vQh7EmTiBUyRrBijQVvYcE0\nF51GZdZXKLh2FJmJf6QrGAS2a\/UJEcUZrfb6wPY27lyKwv3UI3iQfoJ+BgtI5YK43Mt\/onGXSIMk\nJcWBO2dFtVgauU62zC9g5\/VrPBMP+TNT43Ej4TBukqa4RlApZ36L708dQvyxA4g9cQhNfR3gOVyo\nH5cLIwbUzZqFuwS4+\/oNNnd3oTFowZeJMCjho080ii7BCNp5QxgzmaBZ9kLkdEW2gmMUtd\/q8dSv\nBTaxsb0DdyAAx\/oGzKt+GHwr0Cx5IXd7ICGVljhdfpZKzdiTRpmyWhmbOzvwEqD7RQBzBDhFgJRn\nGdL5RUwQYOOEImHfXl0mh6Ps1Zs32Hr1CosEaPGv0UClZwki1wImFt1oVlGle4KTzs4enPd67R8C\nipzz4BpnVpmRrOKwQnHQtrws9G9twUeeu93\/AN2\/AhyxOTBKwrM7wdbphU\/GqP1hxfE1mo\/sbo9\/\nc+MVVqzbcI4H4Jnahm+BNMr8S1jmAjAa1jAh8oLHdEH02ANB0QomelcgNiyiRUVpwwocVSqjjGIf\nnMJtLOl3YX\/2giSARe0OnNQ2bBMvYRzZgqZjHZJKL4RlXvDzfZio8kNSsooW5iTCDlSyPZDlrGGy\naROW4S04JC9hk27DzNvCJGcDGtY6NG0voKhbh7TCD0Hec4xk+tBzfgnMSkP4geOtLkjvrWL8\/gbG\nC9egbQpgkhWAnh3A4B0b+LkLkD7wkqxB8NNzDKR4MZy0guErXrT168MPFNbYoGnyQfV4FbKCVYL1\nQ\/PwJajyLVBlm1CVbkJZsglF4SZEd1cxdtuLnhQXamKMaGBTYQbK5akUcwk2sQkzgzYI8xfA+rsZ\n7RcsYH9vRcdFcr9kRXviHFjfzaElwYyuVB0EZQoa2NQwiUqBIHyb1zGFgsFjuLDhFmLZOgAL1QMN\nlwslpxsTXWyMd7VB1tmGiZ4OGOQNMGuYcBp7sGwbQW3sNBpK9eEHqqrtIaBV3YNZdSt04iZoJU+g\nFlXS0Uqf\/heQc4tMcXkEKqhnWmmgUzMKeZ0MCtYohA8lUPNqMZIjp4HSRi4N1Pb3h4D8YjLFFVPh\nB06y31bQLBKCmzqHPpL+G9MYYqjBSbZD9GQAvT+aCVpKf\/cOqKieQ+tjQ\/iBhi5HaIoH00w06kN5\nBxQ8nAGzOgJAj9YcAmo6hB\/E8fPVIaCuVw9WrTECQN0vQIehE8+qJb+KG8yYwuQYJwTUcyfBqgsz\nkJo29czLTe8Bg12s7OkmDaJA+00BhrIojBXKoJc0v9fFQWDHIyuq+MLw7a6DZxEzeV29A2aXHEXe\ng6+gElfSy0xV9behZWaIm426psQQ0DiiQ0dJBIBuigoB5ZKHSL79CckBdLJvIDP\/C7S0pCAp4wAu\npH2Mq9m\/CQGdlBLsQkv4gU6p+r0plvCKcSv3MA16Bwvmyt3PIOWXhICWZxTYeREA8rIceG7RvvcM\n8ofykFNynK5gMPWNF0FJHoeewRmhDD3pc+gsCDNQRrbtsnIPxIVusqOZh4lnhFEghI7HgWqgE8p+\nNhQkykEy7h0hbxQVhgrIhuGmDX137GRnvRBeYHCZmerzYW5sHapaL8TFbrLWzYOX68Jo7jxG75Nz\nSN4Chsl4INuFvgwHum\/Y0P5PCwZ\/cmB4YDa8y8yIQpGgFjthHvZjsuM5qeQi+tLMmOldx0C6A\/3p\nLvTfdqKPjDuvkNdgGtmCEVzLBTO4GXaweFpU8PkfhfUfBaVuFrNDfuhafej70Y62C7PgEEzXDxZ0\nX7bR6UyxgnPVjPEHPvDuLaD+zAzarpvROK4I76GJPtmp1PX67iDOhsFbDrScmQXzrBnMBLJJPf9L\n2MkzGM5ygkumuPbUNFofTaNGKA7\/+ThYRa3OUUZx3JA\/WcJ4hYeGdiVbwDxnRstZE5riZ9AYZ0J9\nnAG1p41g5s\/4W4ep1P\/l9\/4NdSoeCG1ek5AAAAAASUVORK5CYII=",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/essence_of_purple-1334273991.swf",
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
	"tincture",
	"tinctures_potions",
	"no_rube"
];
itemDef.keys_in_location = {
	"p"	: "pickup"
};
itemDef.keys_in_pack = {
	"r"	: "drop",
	"g"	: "give",
	"e"	: "imbibe"
};

log.info("essence_of_purple.js LOADED");

// generated ok 2012-09-18 14:08:50 by tim
