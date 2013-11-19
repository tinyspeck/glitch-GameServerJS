//#include include/takeable.js

var label = "Onion Seed";
var version = "1347677151";
var name_single = "Onion Seed";
var name_plural = "Onion Seeds";
var article = "an";
var description = "A packet of black onion seeds. This can be planted to grow <a href=\"\/items\/200\/\" glitch=\"item|onion\">Onions<\/a> in a Crop Garden.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 50;
var base_cost = 15;
var input_for = [];
var parent_classes = ["seed_onion", "seed_base", "takeable"];
var has_instance_props = false;

var classProps = {
	"collection_id"	: "",	// defined by takeable
	"produces_class"	: "onion",	// defined by seed_base (overridden by seed_onion)
	"produces_count"	: "12",	// defined by seed_base (overridden by seed_onion)
	"time_grow1"	: "1",	// defined by seed_base (overridden by seed_onion)
	"time_grow2"	: "0.5"	// defined by seed_base (overridden by seed_onion)
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

// global block from seed_base
var is_seed = 1;

function getDescExtras(pc){
	var out = [];

	// automatically generated source information...
	out.push([2, "This can be purchased from a <a href=\"\/items\/1000003\/\" glitch=\"item|npc_streetspirit_gardening_goods\">Gardening Goods Vendor<\/a> or a <a href=\"\/items\/365\/\" glitch=\"item|npc_gardening_vendor\">Gardening Tools Vendor<\/a>."]);
	return out;
}

var tags = [
	"seed",
	"croppery_gardening_supplies"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-11,"y":-27,"w":23,"h":27},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAALWElEQVR42r3Y+VPTdxoH8P4Hzs7s\nTmennd3O7my71rZaV2tLD9Zdu7W3dnuvLdvLtlprqfVuRavFAynIJaIcisqpHHIIBEI4hIRALpKQ\n+75IQoCAIGDe+3y\/AQJVIOwPzcwzhOCMrzyf5\/k8T3LPPXM8cNOJmREYsmNi0ILxfiNu9ekw6lFj\npFeJYVc3hhxSDNpEGLAI0W\/io89wA15dM9yaRvSq6uFS1sEhvw67rBJWSTksohKYO4th7CiAgX8Z\ncm5GyT2LffyaQAnnDHdxuD7dksCQDQEW52IjMOzEhN+G8QELxliknpBa3PSoMEzQIaccfhYqJmgX\n+s0d6DPy4WWxrYRtQq+6Ec6eejgVQbBNVgWrtAKC6+mLA477NJHjXhWh7MCIm6C9uD3soiDkkIPC\njnE\/xaANYyzYTGHCLQbuM2LUZ8AovYERrxYjHg29CQq3GsNu5s30UNYp88zvvfQ7vUm1sGpxwAmP\nMmrco8Btv4VF3qZs3vZb2SOeGDRTFo0EMmDMp2eP+1afFqNeTfDYCcEc\/c1eBSVejmEnUwIytgz8\ndgn8lOFBWxcGrZ1sSfidCjSVJIkWl0GvMmbMLWfrLoQzY2LANAdOTTiCuXumccOzcASziwknIhjh\nLEHcAJUBAyxI3IpFAbOVETFZighk6J+bjnTdMzitjUCa5kmkqNcgWbUaST1\/Q6LycSQoV+BnxWM4\nKX8Ecd0P44RsKY5JH8JRyV8QK\/4zjoj\/hMOiB\/Bj1x9wsPN+xAjvw4GO3+N7wb3IUbyFsz+\/vThg\npy05RmhLgrAvazo6vOcg8GRA4E4HvzcN7b2paHclo82ZiBuOBIp4tNrj0GI7jhbrMTRbYtFkPoIm\n04\/gmQ6i0XgAjYbvwdXvQ4NuL8Vu1Gt3QmhJxdmsjdgr+G3kbuFvloQFvDVg5Y4PezD1CAQCFBMI\n3B5DYGIUgfGbFMMIjPkRuNWPwKiPwosA21BMxzso6BYYohr2mxAYNFDoEBjQINBPzedTUlAJ9cno\nNS0uHv8vUrZG\/DHsDI4N9XInRvp\/JaAO6ftfR1L02siwgaPOLu5or\/T\/aAbp7Gawhpqh3ySg7u2k\n1zqoSei5mU+vt9E1pEbKzheQthjgTXuXb8QlCeG8s3E378BJ5+zUfrOAnS4+YztFGztl+vStdHm3\nsNPGoW5F4vbnkLbz+UUAHZ0YcUnZrN2avN9m4VxTuGDWhuxB3OAkbuBuOMMvcNomeAhokTcyx4sz\ne9dHLSKDQgLKQpfvNG7y8qX5Owtnm8LNONI5cc3wMDgtj4CtMMs4SP3unzi776WYMOewcMmwrYP2\nA2loMszEOUO4u02GqXqbwk3D9C0hnIbHLhIeyqSqrRind\/0Lmd+\/Eh5wxCGIHLIKcNMhntUMXdYE\nlBk2oUG7m8U5rBzoLPlwWGrvwPkWwtHS4FY3sEBJfQ7O7FmP7AOvLQJoaccwAWc2Q4H8HRxvexiH\nGh5EY\/dPiBc+iiTpcpzuWYk248EFm4HBMVlzq7m01TSwa5hH3wZR3TkCvoicgxvC2wlHLIJIP7X\/\nMGUp1AzdUGguY1fZA\/i64H7sKKGRVf8gYpv\/ijj+MiSKHoPVUDV3M2h5IZwqiHP1cNga7KhMRsbe\nl5B76M3wNhq\/pS1m0NSKYerKmc1gMpUjtvxZfJzxO2zLuw+HK1fBrK1kM2fWVdDzijmbYRauJ4hz\nKWspg+1oKjiCc\/tfwcUjb4UJNLXGDBpbqDtF07gm014kih\/D4caHsLP0AWzOvhdFjdFhN0MQV084\ngvXUsTinoob+LR8tRbHI+uE15B19N3zggLGZurOLxXltbcjUr2aBiS1PI4XzMo6XrsOpkrfDboap\nI2VWf+ckjtmovVSD3Nx9VH8bUXD8\/fA2mn5jU\/aAgTdrMjDANMka9Bp5k53Kh4azB\/62PTBf+xi6\nK+\/BVvkxHNWfwlL+AYzFb0ObtxFGziFY+ZkhnCKEc3RXoc\/UCU7OTlz48d8oivsgTKC+kTug580a\nW9WGT5Hf\/dZ0pzrllRjsiMWQOBlDnT\/Bw90OZe6r6Ex9GrKza6Er2Ahd3gb0nF8PVWEUYSpYmFNB\nMHk1i2M+QHlNQtRlRjP1hyvxUWECdY1cihljSwi3iQehJmG63pztqbhtLcOI+jL6hcnwixLgJaSr\n5nN0Z64DP+4RyM9GQnXhRcjPrUVP8eZg1ghnn8TZpAQ0duD66S9wOfZdlCR8hLozm5eEAeSJfLqG\neSeDl38SE9ZKjJnK4LkRR8PnFLy87+AkoO1aFLSXX0dnwgrI0tawQMnpZ6DnnJiBu0ZZpBo0ClCb\nsYWtv7JTn9DzbQsvDD5tA3w67pyTwd1zHf6OYxgzluKWoQTDygtQZa2D8\/pnbFjLP2RrkDnerkRC\nnnkW4tSn0H1pE+EqWBzz2djeXQ2boh416V9S\/W3CtZTNaMiKDgOoqaePxY0h3C8mQ6\/4AgYEcRjV\nFWNEW4QB4TEY8l6BNO0p2Ks+gaVsEwxFb0Jz6VXKXAQkKasgTlkDadYGmNrPsziruAx2eQ3M4gpc\nJyBTf5VpX4QH7NNw6PZvmHNNst+IR1\/bUQzIMjFE2fM2BmtPnLwK0oy1MF19j5rkDahzX6Lj\/QdE\nicvRlbwakszXYWjJIFwp+82Cgz68G0XlqDv7FVt\/1elbwDu\/Y\/6Vy2doiPSqa+GlLN4Nx9xvuspo\neAjoESTBJ4xHb92X7NEyx3rjxKPoyX2ZavA1OuIX2PrrOrWSDdG5V6FvTmdxFtFV2OnK0fGLUJ\/5\nNVt\/NRnb0Jy7K2aB462N9Kpq4FFzgri7XL6qki1w8fbD2nAYntZD7LFaqTHMpe9DTrXYenIFVJQ9\nBT1n6q8zcSWECcshytwAY3suzF1XKa7AoeRA3Xwe3OxoXEv+DHXntqP10p6FgR5qAo+6fs7JoL72\nHQxln8BUewCm8mDNMcfK1B1z9wmTn4QgaQ26z\/4dEqrLjoTH2egu2hLEdRbD1FkEZ08DVM054F3Y\ngcrUL1CfFY22gn3zAz2qmii3sooFzlyTpnDMmmRoTqGCfxF27kGIzjwPXf4b0FPNMVcLU3fK7OfR\nfIIyRp3L1F573KMQpkRCx0ubxpmEhZTBBqibstFycRdbf9ycHWgv\/CF7XqBbWR3jVlTBreLMuyZJ\nct+HuuAd9OT\/B03HlqEr7Rn2WmGOlckcc600xi6jo10BfvxKyK9GB3HCIhgJx3zt5lQ1QVGXght5\ne6j+vgIvdxf4xTHcBYG9ikq662rnXZPM\/Bx0pK2FIvsFiNOfQ\/2RpeAcXor2hFV0rBEQJT8BQfxy\nmijL0HJ0KaoPPx7EEczYkQ+DIA8udTOUnCTwC\/dT\/X2N5kt7ILxyaH6gS1GV4JJfI0zNXXChNYkZ\nW2b6z8S5m9CVGgFp+rPgE66NGqTt5HJqjNU0k9dBdXoVWo89DGHetlk45ktLl7oJqvoUtOfvY+vv\nRt4+dJYemR\/o7C7nurrLCXJ9ek2a2uFmrkmObmamVrKTgbnbZFe+hazgcyhLvoGqYj80dSdgu7we\nmrz3ICvccgfOKCwmIA\/Kmni6nLeDk\/kN2gt+gLjsJ98CwDKuU1ZGgPI5dzh2E5nETY0tq6QMFvYC\nDl4hM5uBxQnyWZiefwn69ov0tyssUFV7EqUJH6Ii+VPq5p0Ql8fOv9E4paVch4xueelVFhXa4Wav\nSbaZOPHdcVPNYPgFjvlppynCAAVUf6UJUbQkbEVT7k6fsOTQ9nmBdmmpj8HZJVcorrIZm8LZZ+GC\nWZsaW7Nw050aOtIpnFlUSvcfl8U56I030BSpTtuMxpxvE4SFuxdetRySSZy4GHZREWxdRbBLy2as\nSXPjTCyu8I56YzLIXNDMcsDApoLBlp\/6iFt\/buu8X7v9D007\/INMXouNAAAAAElFTkSuQmCC",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2010-01\/1263353237-8868.swf",
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
	"seed",
	"croppery_gardening_supplies"
];
itemDef.keys_in_location = {
	"p"	: "pickup"
};
itemDef.keys_in_pack = {
	"r"	: "drop",
	"g"	: "give"
};

log.info("seed_onion.js LOADED");

// generated ok 2012-09-14 19:45:51 by martlume
