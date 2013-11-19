//#include include/takeable.js

var label = "Chunk of Sparkly";
var version = "1343271523";
var name_single = "Chunk of Sparkly";
var name_plural = "Chunks of Sparkly";
var article = "a";
var description = "It's a pleasantly twinkly chunk of sparkly!";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 50;
var base_cost = 8;
var input_for = [];
var parent_classes = ["sparkly", "takeable"];
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

verbs.crush = { // defined by sparkly
	"name"				: "crush",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 53,
	"tooltip"			: "With a Grinder",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (!pc.skills_has('refining_1')) return {state:null};

		if (!pc.items_find_working_tool('ore_grinder') && !pc.items_find_working_tool('grand_ol_grinder'))  return {state:'disabled', reason: "You could crush this with a working Grinder."};

		if (!pc.checkItemsInBag('bag_elemental_pouch', 1)) return {state:'disabled', reason:'You need an Elemental Pouch to grind this.'}

		if (pc.making_is_making()) return {state:'disabled', reason: "You are too busy making something."};
		if (pc['!in_house_deco_mode']){
			return {state:'disabled', reason:"No crushing while decorating."};
		}

		return {state:'enabled'};
	},
	"handler"			: function(pc, msg, suppress_activity){

		msg.target_itemstack = this;

		var skill_package_details = pc.getSkillPackageDetails('refining');

		function is_working_grinder(item){ 
			if (	(item.class_tsid=='ore_grinder' || item.class_tsid=='grand_ol_grinder') && 
				item.getInstanceProp('is_broken') == false &&
				(item.getToolWearMultiplier(msg.target_itemstack.class_tsid, msg.target_itemstack.count) * skill_package_details.tool_wear) <= item.getInstanceProp('points_remaining')){

				return item;
			}
		}

		var grinder = pc.findFirst(is_working_grinder)
		if (grinder) {
			return grinder.verbs['crush'].handler.call(grinder, pc, msg);
		}

		pc.sendActivity('Your Grinder doesn\'t have enough uses left. Try repairing it or replacing it.');

		return false;
	}
};

function getDescExtras(pc){
	var out = [];
	out.push([2, "This can be mined from <a href=\"\/items\/418\/\" glitch=\"item|rock_sparkly_1\">Sparkly Rock<\/a>."]);
	if (pc && (!pc.skills_has("mining_1"))) out.push([1, "You'll need to learn <a href=\"\/skills\/52\/\" glitch=\"skill|mining_1\">Mining I<\/a> to mine this."]);
	return out;
}

var tags = [
	"rock",
	"basic_resource"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-13,"y":-30,"w":25,"h":30},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAH1ElEQVR42u2Y+VIbVxbGeQMeIY\/A\nI\/gR\/Ag8Qv7MH7HjSU3N1FSSGadmSYKxjcexx4TVNjtCFohVSKLRvu\/72toQiCUn57tSt7VibE+S\nmqq5VV8hWk3dX39nuacZGvr\/+p1WkWg4WqHbrIlo5WddU3Q\/VqVPWbeSp\/TJ7wIWr9EIg0gMQf0U\nZ2XrTeF3vlcGPH+ex9\/+Fq4NhAPU1c+krn73tGBv\/dfhVo+CI0tmvyTFSmKjSuMtSK7edO7i6u21\nMn+fPiE6u2xqECzSwhqr3vpouNXjoLxuCRG078+QP39K4cIppapXYrN2GL6sOgpQqBsuWWPA8iUt\nmv30\/dLuvQ+HswVHNJaQvGENk9YWoTf2TuldcfLkTmlQ2NsFp+E8nE6XajSpt9L3izsfDqgJBIY1\nlrAEEJ0jSpvOKG05YwzVKVyTokVKsptKgSiCe3C1fe3YA02wlr5b2J7\/IECtNXy\/CRYjgz9JpZMz\nIVs0R7ueBB34kuKzFM7QtjvO1+KUkms0aAVTeXqmNXbAtaR7b7g3tvgI4MK5MuUrdQpmSmKTi8sr\nOgpl6cCfoqNwlmKFKrmTBdrzJmmHoQF6zNfl2qm4P1Eo05rZTY9W9\/uBfQSgPaLzp2UVyhhIkzNe\nIEskS8ZghkwtGYNpOuTvDAyM+6P5Cj9ARoR949h\/HVSHfljYvnmPfOOM3UJuWTl82NCTLApAE29s\nZvfgXKHadOikcUFJDqvE15SVKZ8IJ3\/SW8TmjzWHtGaN0JY3LTS2vPdxLm46ohPYAGGDM3AJYFIk\nR5ZonqyxfE9+ITediQK5WXiYXW+CnmpNYvPl45AKN2dwq7ALR\/5uFz+9ESBah5JzlXpDwB0zHPIx\nU66TN12i2tm5Cnd5dcXhLdHcoY8mNu1c8THa5wJSAN+4EgIIYP\/WmsVnXIOzXdUsj2lMw9fDOaK3\nd9i9GIcWS2Zn4Fyp3mj93iB3qkSedFMGdmud++PzHRc91Ttohd1CbsL5h6sHN87BG7ccvSs6gWpE\nmFCddg4nwupJyRTOVwWUL1smf7Yi5MuU6VAUS4ZsXETHnLdwHIVzUyiEXUkBPNR3y3uDj74tZ1QS\nPY4dgBNwDznnSBSFc4AL5qoUKtSEAvwZkG5+ANyDh0ERIW81lmBHQWBzhLjbWQ2nBOB+2rE1ry1s\nTwwcpayJMtmTFXKmqmRLyCL3bLECOZOycC+Qq\/AZXKOofCIESDiJ75CbWHWubDwcHnLZ7BWbAlTJ\nRQigA11d2A691ygVLDbImz3pAIzJdRXw\/LI5xoT4O7gN1xVAROPFlqQWh6JnOunasP9zabdz4G3N\nae888MOlcwoVTwUklOaqFtV+ek4udtnLzbpy2hDVj\/4JwJldmwifAoe2885iWdwZbQ\/tqOqWfEG+\n\/Bn5Cw0KsNyZGvl4DPHxZyvPSIq2PBl6aQqKwoCzSAE7f0Z4lYUTCAW3bPaJTeFie2hn9p1Cfd1U\n8lBjCgxvOmKhHU+K9Dyt+DnZL1ohU37Gi1W1x3Vr8SjYhOMCQXgj3J7QmsrsIE4hNPyXB84eAIBd\nG24lDxfMvnvLRwFa40F0wxYWY9Uh5443VVSdQMvpB6fIzEcg4FBQaDG4\/8DXzD8cmYsmb9\/WglC3\nw6GQ2l3+5tnSJ0OvDr0Sj\/LEEzNpeChNslty7YysPBQ4kPDcMl7sugbCLUoROuLXgHDpsiNX3Znm\neXwQyNJSK8TvUnshAfbLx3OjAORkLvDhXxezXYIBEVrMf8gfHFmD4Hb9eQHjSldp6Tgi8tIQKpIz\nU6cQ5zJOJGuiQuMrzVGrfWBQnIOLkOIaign612s93RufnRiaN3goV2lWIg8J7GJIOBfKlsRotc6u\n9oNbtcVbcLVmU+bjrvseR6pGz1sgcKS9zSDECuA8f\/5mcpX++OSV6ubXk2sMOBMamtt3yesc3i1H\nhJCLgFQWHJ058PRsPG3wCzgPz\/Todcg3bRvgj3wm7\/lz4p4nGqMK2O7gkw0T\/W16Q0DdfTCt6q9T\n6\/TVixX6YnyG7oxNzQ\/N7Dl1cPGV0SvesHT8\/oFwR3hyWZGCfeGCMvfC\/AmfMDnxEEiFqX2PCrft\nSaq5qAAq+svzpQ6gQbrzYEr6bGxqeGhy2zMyu+eSAfm6BQknUTRznJ+zBi9v7haFAm3xcYU3MmXF\nCxVR+cr3+Dv0TMDZ+bjsLoQvH8\/fBFD+\/OHs25Nk1sCQ+30g2UG8B6O60YKUV00jh1Xi1rLPQyng\ncA0hxj2WeFl1b1UK9ADexL27D6Z6p5lJveP29J6TlHAvmHy0xBPvCm9Sb5yrQwBgt7m3ZUsnVOSx\n384hxjU8yJ4v09Fqnnc14G9nte92bmxmdOCoNba8P\/qfLUsTksO7yhWmc8b5tTMuQqt3Q0mu2iz5\nuJG74nkR0k1HnMyRYgecMZTvcQ+VeR1cX+e6Fw7pB9y3Hq4Z6FFLk\/zy84pbgdYeJRyJLu5zXj6v\n+04+3P8Ap\/S+dv3p6eu+YHfGp++Jgrjpwisgg0oISbfgAtrA19y3vp3R4kWHftww0hyfrd0V265\/\nvNwUraPHtR9mP\/xfchi9\/\/xscRRPyD1J1wxDb3j+8Gju2iPs7\/O6nupFG\/kouEELScywoW5IAKDp\nKhrQTpBnE78KWPe6OzZ9f5CjPU2XT4Qvxqdv\/+b\/DkbVifAPENx+r+T\/X1y\/AKJElqH55fMlAAAA\nAElFTkSuQmCC",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/sparkly-1334276510.swf",
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
	"rock",
	"basic_resource"
];
itemDef.keys_in_location = {
	"p"	: "pickup"
};
itemDef.keys_in_pack = {
	"r"	: "drop",
	"c"	: "crush",
	"g"	: "give"
};

log.info("sparkly.js LOADED");

// generated ok 2012-07-25 19:58:43 by cal
