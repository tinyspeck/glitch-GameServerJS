//#include include/drink.js, include/takeable.js

var label = "Earthshaker";
var version = "1354595006";
var name_single = "Earthshaker";
var name_plural = "Earthshakers";
var article = "an";
var description = "A seismically upgraded earthshaker.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 24;
var base_cost = 152;
var input_for = [];
var parent_classes = ["earthshaker", "drink", "takeable"];
var has_instance_props = false;

var classProps = {
	"collection_id"	: "",	// defined by takeable
	"drink_mood"	: "10",	// defined by drink (overridden by earthshaker)
	"drink_energy"	: "30",	// defined by drink (overridden by earthshaker)
	"drink_xp"	: "7"	// defined by drink (overridden by earthshaker)
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

verbs.drink = { // defined by earthshaker
	"name"				: "drink",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_single"			: 1,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 53,
	"tooltip"			: "Gives $mood mood, $energy energy. Grants 'Impervious Miner'",
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
			pc.buffs_apply("impervious_miner");
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
	out.push([2, "Drinking this will give you the Impervious Miner buff (mining uses no energy at all)."]);

	// automatically generated source information...
	out.push([2, "This can be made with a <a href=\"\/items\/7\/\" glitch=\"item|blender\">Blender<\/a> or purchased from a <a href=\"\/items\/1000009\/\" glitch=\"item|npc_streetspirit_mining\">Mining Vendor<\/a> or a <a href=\"\/items\/431\/\" glitch=\"item|npc_cooking_vendor\">Meal Vendor<\/a>."]);
	if (pc && !pc.skills_has("blending_1")) out.push([2, "You need to learn <a href=\"\/skills\/43\/\" glitch=\"skill|blending_1\">Blending I<\/a> to use a <a href=\"\/items\/7\/\" glitch=\"item|blender\">Blender<\/a>."]);
	if (pc && !(pc.skills_has("blending_2"))) out.push([2, "The recipe for this will become available after you learn <a href=\"\/skills\/67\/\" glitch=\"skill|blending_2\">Blending II<\/a>."]);
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
		'position': {"x":-9,"y":-38,"w":18,"h":37},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAHmUlEQVR42s2Ya0xb5xnH+TBN+zZt\n0qSo07SL9mGLWm3VMm1tVHXq1G1SOkXJAumSNRhKLiRQIEkDlIsZCcniEQghkARC3HJpMiA0XAPl\nYsD4boONL8c2NscXiDHge7kkkPz3vgfSNdWk3XTIXukvH9mY89Nz+T\/PcVzcf3FUKtVPlEqlmEhC\npdVqmw0GQ9UXxTCM0Gg0iugry7LH7Xb7m3F8HwKWSG4qdrlcomAweAJAwr8rv9\/\/vtPprNJoNDUe\nj+cFXgDJPx9bWVkR\/CdgX5bFYqHRTuQFkESvRKfTDZIbSGg0vF5vERWN5vpA46k1UdKNx4dfHn2c\n+cbdp1F7+jckxWLyvSECWKJWq1\/nBdBkMjVEo9HDUql0rK2pQeepFz0xKTphbrsFg7YbenUnTHdv\nYmK4GVrZXUx2V8xNtVQb3H3N\/eFwuJlAZxD9lndAh1FrfPSxcG1dVoq1gp2IDqRi3vwBQlW\/QTj\/\nZcxd2olY3msICl+F\/9wOLKe+BN\/ErWgsYC+mgCSKe3gDxNJ825OBGsDaA4hz8FDzV0SmSxG+k4Do\n+Z0c4FLiC\/BeewNWySF4+gWInfwZvONXMWetjgWmqxtIBE\/zAuiwSmXQ3cYTqRhPWkuwJr+Ez7wV\niKoLsXRjHxaaE7B6YBtmW\/fBKTsKjy4TyydfROTMDngMlYg+aEJwqhi8Ac44B4GuQqDpLKBrxVpk\nADF3OR4VvI7gyAk8TPkewmW\/gkeTDrfmPSxV78LK299CgKQ6NFaKyEw9WFVWjLcUO6wqB6JdeLxs\nwHp0lANcXWjBuuAHeJi9AyunXsTsxCkO8EHjbqwKvo\/VjJ9jteA1rN8rhd\/eBO29XeANUK9qMcwa\ny7ASHMXjpUk8Cg1ieaYSa+W7sdIkQGAiB3PGXDzQn+ZAg87riM02IzY3hhlTHSzDWfwCGhU1WlaT\ng0X2b1hw1CLgrCUAbYjNfIiYV4yo5xbCrlqECFhwuh6e8SKuUcyDSbDL82CWpPEcwbFKiVubh4Cr\nBYvOOixOVSBgL0HQ\/mdOAZuQ2E0eHhjeJ2l+D9Pyo7ANC2AhgDZZNkzEjngF1MmaJC5VFoLuVgRZ\nMYnSVRKti4g4zxOrOY\/Q1FksWgtJmnMwo8sCq0iFfTQZzFAybNLTMPYfgabzAPR6\/e\/5iaCiqZPe\nNOS5i5DrI4TZakTYS6STRfiMKDp9gYskNW1agy7VCUxJ3yWASbCOZsLQmwhNz3Hi1fgGPxFUfCJ0\nKU8g7G1D2F2PiPs6ZzPLM2WcKGTYcQ4LlnyuUdzqNDjGUkgdJoEZScNE935+Acm6JXSp0kiKbyPi\naSBNUYMl7xU89BHNVWLZe4lL9yJTCB+pQ7c6nQAe3gCUHMV45z5o+rJjBPBrvO2DNCoB9kNEvI2k\nc2uxPHsVa\/NVWFuoxspsOZfmRauQAJ7hGoUCMhIBzAPJGO\/YjYmhIgNvCyvdQqZUZ7EwVfUM4PrC\nNawvXieAlxFlNwEnNwCdsiMcoOnTd6BrfwsTo1XtvAGS1HzFqiqDnxE9A\/jIX8VFkdZhhItg4WYE\nN1LMDCVi8v5+YjFvQS9vLOV17TcrK1nfZN4zNbjqqyC6Qq7JVuMswQJTwHnh0xpkBv8Ew\/19\/Hrg\n59NE83EDN8ama\/7RxaQ5aPRiroucF85b8jZtJo2zGcvgQRh6\/sB1sMPh+A7vD04e3Rks2ESbPljK\ngVFRsw7YiuA35WJm\/CRY5XHOqM0DxJy790I7JLLy\/mRHHjG\/blNfhs+YtzFJHBe5tFKFyK5H0+ub\nzIZXm4lpxTHYRmiDvI2Jrj3Qy27lx23FmdT2\/IWmcJ4peWYW0+bwmz7YNOl0roOtkkQY+0iD9KaD\nPHD9cEsAx8fHv+vUimK0U\/1mITc5qCgcfY\/OYTpxpqQppIPfwWRvPHSjtQ1xW3m06sHTXl02Acrm\nlgMqCjdLao9Gj24y9pEkrv50g8UhWhpbC0huyGhuGGkz0HRT0WtqzrQ5NmbwIRg\/TYRa3psR9zwO\n7ehpdQ5piAxO1JhdBI7WHo2eZeAgtCPX2LjneUyqWi+tNyq6ilG4KWIt1qHnHL3Pf69RDJZTKCo6\nNajv0c6ltTc+dAFbXnv\/7Kc401gxB0Y9j9YdTa2xLwEa6Z1P4v4fjn60PETthM5cc\/8BzvcMPXuh\nVCqfb3rb2tp+LBaL4+VD9TZz\/x+5iWHsTeDgdF0JaG1tzRAKhdu2HEwikWzr6+t7t6WlJb2urk4g\nl3zETN6P5xYCffcesjnv5haD9vb2C\/Tzmzdv\/q65ufnbWwLHsuwvnU6n3mw2d3R3d6d0dHQIhoeH\na1X9FxhVXwGjvJ9PlMfIJXd0PT09qfRzqt7e3lSFQrGXV7j4V1755rTTOeT1euF2u31k5OXKZDLB\nv5JcLk8mj5oFCulIhVGt5m\/dit++\/avp+3ftVY0OXyGABo\/H47PZbCetVmsqUTLDMIIviryXYrfb\nMywmU\/FoX3eZpKs9kfcUU8gDb7760+LMY8n3GsXHZjye\/Lm5uSyfz3eGvJ6jItdCoiIXyzpsZpOc\nwIkqiwte2tJGoaAHf\/2L7TlHD+2\/LMzNuV1z9fyXdf3iuSO5RwQ\/+l\/u83cidoXF2sXgdwAAAABJ\nRU5ErkJggg==",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/earthshaker-1334208314.swf",
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

log.info("earthshaker.js LOADED");

// generated ok 2012-12-03 20:23:26 by martlume
