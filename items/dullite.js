//#include include/takeable.js

var label = "Chunk of Dullite";
var version = "1353110963";
var name_single = "Chunk of Dullite";
var name_plural = "Chunks of Dullite";
var article = "a";
var description = "A hefty chunk of dullite. What it lacks in sparkliness it makes up for in, um, dullness.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 50;
var base_cost = 4;
var input_for = [321];
var parent_classes = ["dullite", "takeable"];
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

verbs.crush = { // defined by dullite
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

		if (!pc.items_find_working_tool('ore_grinder') && !pc.items_find_working_tool('grand_ol_grinder')) return {state:'disabled', reason: "You could crush this with a working Grinder."};

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
	out.push([2, "This can be mined from <a href=\"\/items\/415\/\" glitch=\"item|rock_dullite_1\">Dullite Rock<\/a>."]);
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
		'position': {"x":-14,"y":-20,"w":27,"h":20},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAFkUlEQVR42u2YiVJaVxzG8wY+go\/g\nI\/gIeQRn2kQjmmgSrbsIuCCiVM0yZqNDJzrVUauJRkQEd5BNdlERF9TaZsoj\/Hu+M56bq4Bi0jSZ\nqWfmG7j3Hu\/9ne+\/nIu3bt2Mm3Ez\/v0RCIdvB4OR8Ugkkv\/9wYUihmAoQlAgGE4Fw1FlPB7P++Zg\nwWCsIBAK+wAW3dyi7Z1dSbGtHcAa4ew3gQuFokVwKxSOcqDD5HGadhP7AjiV2DswJpMnRcnkacHX\nDylzRoQUTgmg+O4eMRA6ODzix3v7h\/w4I\/zevm07njBsbe1UHJ6cFH4VOGj\/IEk78QTByXBkUwLC\nJ87J58q1GdvmCxKLgQ6SRz52zJ0+Pj7O\/2w4PBjOwaGrnMokzBdui2OkgoBFaoxPTqWcTm\/u6eDb\nCBgEGByTCwUiikQ4A2eTRydpOYnrcmfxHffAdcyPbcep99kAtXZ2k773aUXOgM51N11XHu8Gd+f0\nz4\/018e\/6fjkVIKFeyJfj47\/oASbt7TiIJ2hjzRaPbV3Gai7\/7kyJziHy3VbPNRitZNpcJhemwbp\njWmIRsYm+XlRLHAJbjLH04C9Pj9tMYfgLmDjbO5GIExDI2McSi5td+81ANddRjxgcWmV3+ztb6M0\nODwmaXF5lQOIcEGRaIw7mM3dNcc6vXj9SxrY5wE63Tbc9P30LI1OTEkagyanyTK\/cK3QA27GbCFD\n\/\/OsgDpDf+6A4sZTM3M0ZZ6jabP1k2atZF9auRbgnNVGU9MzGcFQHByu7xmKxJcz4Oqak6z2ZZoX\nWvgkOCIHcHt8PAfxmQlw1mKlt0PD58BQFJ09fYDicGeApNL1FOYA6PI5nC5adcjkdHOtOc8\/fN3l\n4UUg+hvyEgsQi1hYXKYPM7P0ymhKcwzq+vkJzz8I0GptV0Kr1ebllIMer5+8G0FJHl+AA8mdQxUD\nDpWMMELIN\/vCEp+D7zg3NDxK6nYdPa6pl1RV20B1TS2k1HTwa8Ldts5u2xVV7E4JCH8wTOz1ijb8\nwXNwqFrhHOAABJCRsQkaePMrvWAaGZ+Uzpst8xJAS6uW6ptVVNPQzAHlcBBcZe4aMofX6S7KluzI\nM8Cg4foDIZ5bwrXpD2ay2Rd5W5K3JOQyrr+bNmetYMk5XY+A42rV6\/MzhNeVyNQm8CCEFJKDiZCu\nrDrIalukifczNDFl5ppkwt\/BxasAeR88A4NwzPLReDG0FWLLglsII5IeoQUk2gUSXg4H18RCbAsr\nrPKXJNlZo19kLSkTIAqCQ3ToeMiF6pvVVF3XyMWLSriINwnmTkps5HLhtSqXfueAXF5yCrFj67yd\nu44ikQOqWN4BQl40F4V53EW3250XDkd9IulFy8BeKsJpmZvnYbwM0MVAQmwx4UiMRSDIz8Fx5O3o\n7+\/SworiqG1USkAomvLKx6S4X8kqvJEaWjRczD2PQeTXEttnL+aYXCgGwCJsyytrXBffaCCREvgb\n3HeF5aKAQltpUGokUFQywtukbqO798ok3blXZvuhpLyAOzgzazFmg7pMCCEWBbdR2S63VwITQqEg\nKp0s55pUbdwpCFByR+tY6+FwJQrfnRJF+o8vNqkCnRyTcTNs7k8HXvH8gQMIoZCfvTaJdMB39LmX\nbLewsa0Q6QFoAYcQY548D1XtnbxRQwgjPrlrJWWGS5s0thl1R5dB3aFPXdW3sgmgFxcEYbFiTmVV\nzflwlpSl7paW5v5jymKx5Ol7nhTVNrXYGls0KbHaTKqub+IuwJVcFiCFUpLCWFxc\/OU\/\/JGwWKVW\np6\/QtHUolapW28OqGlsdyydFeQV\/2INH1VTDKjMbLAqhWHH\/rAgUiWu59iUDjptMg4V44I+lZUWo\nQMWDh+ecfvRTHYfDNcz5Lv6PA2DmlJJV5jjXf+XYzbgZ\/6fxD61Vz3BP4AvkAAAAAElFTkSuQmCC\n",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/dullite-1334275292.swf",
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

log.info("dullite.js LOADED");

// generated ok 2012-11-16 16:09:23 by martlume
