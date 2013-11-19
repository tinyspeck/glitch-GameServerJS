//#include include/takeable.js

var label = "A Piece of Street Creator Wood Trophy";
var version = "1337965214";
var name_single = "A Piece of Street Creator Wood Trophy";
var name_plural = "Pieces of Street Creator Wood Trophy";
var article = "an";
var description = "One fragment of a trophy (the \"Wood\" trophy) marking top street-creation activity. If you earned four more fragments similar to this, would you have a whole trophy? Yes: You = Wood.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 50;
var input_for = [];
var parent_classes = ["trophy_street_creator_wood_piece4", "trophy_piece", "takeable"];
var has_instance_props = false;

var classProps = {
	"collection_id"	: "",	// defined by takeable
	"smash_green"	: "400",	// defined by trophy_piece (overridden by trophy_street_creator_wood_piece4)
	"smash_blue"	: "550",	// defined by trophy_piece (overridden by trophy_street_creator_wood_piece4)
	"smash_shiny"	: "700"	// defined by trophy_piece (overridden by trophy_street_creator_wood_piece4)
};

var instancePropsDef = {};

var verbs = {};

verbs.smash = { // defined by trophy_piece
	"name"				: "smash",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_single"			: 1,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 50,
	"tooltip"			: "",
	"get_tooltip"			: function(pc, verb, effects){

		return "Smash this trophy to receive "+this.getClassProp('smash_green')+" Green Elements, "+this.getClassProp('smash_blue')+" Blue Elements and "+this.getClassProp('smash_shiny')+" Shiny Elements.";
	},
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if(!pc.checkItemsInBag('bag_elemental_pouch', 1)) {
			return {state: 'disabled', reason: "You'll need an elemental pouch to collect the pieces."};
		}

		return {state: 'enabled'};
	},
	"handler"			: function(pc, msg, suppress_activity){

		var failed = 0;
		var orig_count = this.count;
		var self_msgs = [];
		var self_effects = [];
		var they_effects = [];

		var n_green = this.getClassProp('smash_green');
		var n_blue =  this.getClassProp('smash_blue');
		var n_shiny =  this.getClassProp('smash_shiny');

		var remainder = pc.createItemFromSource('element_green', n_green, this, true);
		n_green -= remainder;
		var g_destroyed = remainder;

		remainder = pc.createItemFromSource('element_blue', n_blue, this, true);
		n_blue -= remainder;
		var b_destroyed = remainder;

		remainder = pc.createItemFromSource('element_shiny', n_shiny, this, true);
		n_shiny -= remainder;
		var s_destroyed = remainder;

		var result_string = "You smashed "+this.label+". ";

		if (g_destroyed) {
			result_string += g_destroyed+" Green Elements were created, but destroyed, because you couldn't carry them. ";
		}
		if (b_destroyed) {
			result_string += b_destroyed+" Blue Elements were created, but destroyed, because you couldn't carry them. ";
		}
		if (s_destroyed) {
			result_string += s_destroyed+" Shiny Elements were created, but destroyed, because you couldn't carry them. ";
		}

		var produced = [];
		if (n_green) {
			produced.push(n_green+" Green Elements");
		} 
		if (n_blue) {
			produced.push(n_blue+" Blue Elements");
		}
		if (n_shiny) {
			produced.push(n_shiny+" Shiny Elements");
		}

		if (produced.length == 1) {
			result_string += "You received "+produced[0]+".";
		} else if (produced.length == 2) {
			result_string += "You received "+produced[0]+" and "+produced[1]+".";
		} else if (produced.length == 3) {
			result_string += "You received "+produced[0]+", "+produced[1]+" and "+produced[2]+".";
		}

		pc.sendActivity(result_string);

		this.apiDelete();

		return failed ? false : true;
	}
};

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

function getDescExtras(pc){
	var out = [];

	// automatically generated source information...
	out.push([2, "This item belongs to a collection which grants you the achievement <a href=\"\/achievements\/trophies\/street-creator-wood-trophy\/\" glitch=\"external|\/achievements\/trophies\/street-creator-wood-trophy\/\">Street Creator Wood Trophy<\/a>"]);
	return out;
}

var tags = [
	"trophypiece",
	"collectible",
	"no_rube"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-15,"y":-29,"w":30,"h":30},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAIyElEQVR42s2XeVCU5x3Hl4SFBRZ2\nl91l75NlOeWQlUthAblvkRUQBVGDt3hGDSYQ06Qaa6g1MYqJ9hgdpTU08YiJ1U2ixTOliTWd\/rXN\ndLT2ms1kzHTG\/vHt73l9F7cpUQSMvjPfedmXfZ7n835\/x\/OsQDCOq6PIKlldau1cXWpxdxaZ3Yvz\nDe6FuQb37GztwMxMZYzgcV8by6Ld+9fW4N1XF2FgWwd6XJOxcKoOjQ41GrM0lx8r3I75uQeuv78H\nfx48MqyDm5uwvjwai\/KNaMpUozBW4rJIBaaaHPuBPFtEb7pMIPle4FaVmN\/uW17CQX16sAfndnbg\n3a4a7Jw7GV3VMegstmBergHT42WeqQn6odnTbCiOjkCy9KnOCYPomzvJuaMhrvuFKlv3ynxjm+95\nV1OSYU2p5cbLdXbsa03GyY2lGNw2G4eXZGJnYyK6KsjBPANac3SYMVmFJHWIZ7ZD5amMk6IoTto9\nbrC9Lqvk9ebE3tdmJeClWjueLbVicZ7B4\/t\/Z5kleWWRBd1VNuxsSsRP21NxsMOBvrnJ2DYzDutL\nLGgnuOokOapSFMiLkfauLzY7X5mZCFe68vi44LZU2VNerov1kNBFuTQnQ41ievPpsVJvkVXG5c\/C\n6RbV0ukmrCky48WaGGxviAd7ma31sZx7S52Ufw42ToY0fSjy42RuNu7g8jwvjbmdqhaZxwy4tsjs\n2cA5pmdQKImXoXqSAvWpSrhSlcP5s6jQdKiDwriy0MQ5xsYw4CX0rCVDg0pyL8cSjvgoEeocWrQ7\npLXnXmkcYC9TliB7dUxwczKiUliLmJ+jRRHBlSVEcmCzp6gxL1vLng\/5vutKl0na8wzeVnrelkUA\ndJ+bqYFrchTKE+WYRgWRSYAl7OUcKrSnyzzunrruzZU2lMbfdfShLxeFkICG8m0SLjwzCG4OLdqR\nq8fKAhNWk0OkWvZdu1zYNsUs7p1fYB5qnaZDC+VcM4G6pmhQmxaFaiqOmnQVd29OV6AxWYqjG2s9\nKwuNKBxPobA8o7B6qyhEzeTcM9P0WD3djOcoH3uoffRU27w51ohu1tt8Y55rSOpeXm7zNmbrUEqO\nFTEHY6RoyNIRpA4VcRGe1kwttrc44HJEIdcmdo6rUArs0pSKxEgvC+3yAiM2ERwrmh2ueGyqMFPe\n6Ud04HnXJGffitxh1aWqOlkuVhAwCz+LRmVS5NCE9MBplrAUCrWXEprcs3IVuqpIh6YMGZbkq9tG\nO8+CHK1nFuVlfowEWeZwREuDaiesUafpwlIcRrF3PuXXhjIz2nIUWFGo9bICGe0cm2vsPbRfc6lS\nl6xEeUKkZ0K3NLtUmJKqD\/VuqbFT045hjbjtYcb\/sN4+ZVd7BtfwWZGxFsRSaEIhWUHYFIFO6xg3\n+oOrCj27W5K4IltEHYH6aq\/gSbo+7l3g\/sWCNMrjOKygdlWfGuV5ogBPvuhyvzUvBVtpn+6knaeB\niiaDivCJgGMHj710iNjVnMTt20udBm4DyDCKux8r2M1b\/+r88i+38N7+H+MHM2I5uHXsjEhbIuuL\njZWFOPPJVXxw9jJaq2fUfq9wf\/+H98DNW\/8EA3xhTiFW0cmHNfz5tM\/PpG0wm\/bo4pzUYcBNG7ph\nDha4HzlYf3+\/8tLlq58N\/Po97N7Thw1rV3FusZCyQwf7O8siRqImBHHaiGHALVtfh8NqhjlQ4Hxk\ncLdv30k9f\/63f9r31ttYs3YdmppbUFzgRHaCCVk2yjlTBJ0NxYhXhSDVpkNrkwtHjp7A4aOnsHjZ\ns7CJRTAJH5GLAJx37vzH+803\/8bNv\/4Nn1\/7AucHL+Fw\/1Hs6duPN3bvw5t792P\/zw7h5Ck3zn50\nERevXEP\/oXfQsXAZnOkOmIMCYCLpJ9rFI8cvtLkHr+Ps+T\/gN+eu4fQnn+PDjz\/DBx\/9Hu+7h3Dy\n7O9w4synOH76Ko6dvoJjHzJdxuF3zqB9wVKUF5YMwxkZoFAwNKFw\/ccuYLT65fEL+NWJi\/jRrp\/j\nmWXrMKPWdTe0PJyBAwyANlAwMG64dIFAEhskQGLo08iOCr+vclR37xYhfV8hhcNiQrrZxDnn754P\nUEdSScIHZDLZ2H9Dp4oEbWkhAfguTQ4NgIM0JSwASfTZFhwAKy9L8D0wLu\/CQ6FVyKGRR0JNUimV\niIqKgkIxtj37aVL4JJHg8IhgpKyIICTSPdEPzOIH9j9wchm0Wi00Gg0ntVoNlUrFAZK+pLXCHgZO\nRIoiacnBr0Z0LTyQA7CMAOUPxhWEOAQ6nY4D9EES3A2pVDpPJBIV0jo2ttZoXYsgqbLNmrj2pJhT\nIznH7v4QI8noyzdRIPQEpdfrOUgCO0sh3S0Wi+tpnVhSNIn9fhY+CC6YFMngskya+J\/UlV9viTOP\nGFp78D2AkcSKwBAaBIM4FHq1CgaDgcF9TWDP0\/yTSAnsjMzDsR9lofcDe4okJskZ3LKpmcVv1Fdd\nf3NmFVzRepRpI1GqkaFELUOxWooilQRG4d0qNAjvwRgVMhgJxkROmc1mmEwmGI1GTuTe1xKJZBbN\nn0iK40NqIRlIIfeDY7ZKfXDUPDMI5KtKvQIVOjnKtfL\/AyzQyLn24JM+IgwGgmJATAzOH5C5p1Qq\nu2j+eN41K++aho\/ad15BfL5F+goiWSQYvF9LSQ+9G0KtkFdIEAfgc8oHycPdIOcuU2gvUTHU+OWa\ngV\/zqQflWzjvnoKkNkrEDVMt+gsFsdaLpEv5sdbLpCvZNjNyYizIsVuQpoiAOjAA6pBgaKUSLvGZ\nGCTpBrWO7Xwok\/wc8weL4juE4EFhDf22exaTaTDaYsFIslmtiImOHm4R7M4qkokBUmXuoTmS\/XIs\nxi+UepJyNGC+ghDxRTGce3K5PPNBcHabjWuuPkAfJH3+I1+VsX7JbyTpeLDgh90dQr4VXo3RYHht\ntID+kHT\/QigUpvm5ZeAbrpzP8TFfDDSQn0TMh1vKh1zBh13NL6bnHTFTH3MQoJNXAT8mgn\/hMD51\nhGOF+i8Ff2qD9lvJEAAAAABJRU5ErkJggg==",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2011-01\/1294354091-8062.swf",
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
	"trophypiece",
	"collectible",
	"no_rube"
];
itemDef.keys_in_location = {
	"p"	: "pickup"
};
itemDef.keys_in_pack = {
	"r"	: "drop",
	"g"	: "give",
	"h"	: "smash"
};

log.info("trophy_street_creator_wood_piece4.js LOADED");

// generated ok 2012-05-25 10:00:14 by eric
