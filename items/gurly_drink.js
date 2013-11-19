//#include include/drink.js, include/takeable.js

var label = "Gurly Drink";
var version = "1354594663";
var name_single = "Gurly Drink";
var name_plural = "Gurly Drinks";
var article = "a";
var description = "A sweet, innocent gurly drink.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 24;
var base_cost = 160;
var input_for = [];
var parent_classes = ["gurly_drink", "drink", "takeable"];
var has_instance_props = false;

var classProps = {
	"collection_id"	: "",	// defined by takeable
	"drink_mood"	: "30",	// defined by drink (overridden by gurly_drink)
	"drink_energy"	: "5",	// defined by drink (overridden by gurly_drink)
	"drink_xp"	: "10"	// defined by drink (overridden by gurly_drink)
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

verbs.drink = { // defined by gurly_drink
	"name"				: "drink",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_single"			: 1,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 53,
	"tooltip"			: "Gives $mood mood, $energy energy. Grants 'Easy Animalia'",
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
			pc.buffs_apply("easy_animalia");
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
	out.push([2, "Drinking this will give you the Easy Animalia buff (all interactions with domestic animals (except singing) do not cost energy)."]);

	// automatically generated source information...
	out.push([2, "This can be made with a <a href=\"\/items\/254\/\" glitch=\"item|cocktail_shaker\">Cocktail Shaker<\/a>."]);
	if (pc && !pc.skills_has("cocktailcrafting_1")) out.push([2, "You need to learn <a href=\"\/skills\/44\/\" glitch=\"skill|cocktailcrafting_1\">Cocktail Crafting I<\/a> to use a <a href=\"\/items\/254\/\" glitch=\"item|cocktail_shaker\">Cocktail Shaker<\/a>."]);
	if (pc && pc.skills_has("cocktailcrafting_1") && !pc.making_recipe_is_known("70")) out.push([2, "The recipe for this will become available after you use the <a href=\"\/items\/254\/\" glitch=\"item|cocktail_shaker\">Cocktail Shaker<\/a> a bit more."]);
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
		'position': {"x":-16,"y":-39,"w":31,"h":39},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAG5klEQVR42u2WWVBb5xXH9daXzOSl\nfeYpT03K5KGZTl5oyKQdt2N70thJnUlDHGN2QwREhM3CLEZsFsZsYRGr2Bct7LpwQRgwmwRIYBaB\nhNCGWCQsYTCS+Pe7eum0zXTsxqZMhzNzZu69370zv\/v\/n3O+j8U6o0CL7G20y\/inbRSN5n4u67wF\nA3ja1I\/Tum54BGKgrMPPXS2hTxv6Opm1Nw5g+lO4j\/7Pd6p+WrlBLuq6ozyVYq7nxw64C1vgzhPS\n7kfN8JSR+5qugDcKt\/+XGB\/T9Vib8Vos\/W+A7YM+p20ynNZ2wVPa7gXbKeLgoDvO9kKai5NcAVz8\nBiUDCmHvm7F+LyiVvx+WDuuX8cqfWve0DCg9NVJ4StoYQOwUxGB\/OAKHc\/F4zufDlVsPd3GbDXVS\n39er3K10HxuBs4dlwBaSjr1vudBcidBu\/5XDNX\/K9vsnm2slfp7yTr77UYvN9aABrswanCT\/CFdq\nJdy5Qi+8p1rCf2UIqcLg26XcDOhWbnKZ7FLoaIpS0KaUUvrgTiaO71fAGZWF50mFOAjNwP6tFJi+\n4MDwWTQ0fwzF8keB9PytNFomGqva6n+iPRX2wFMpgruo1aumK72KjwcNfkzTvDSUbGb\/bQaqS2WI\n7VWZU7rVluRetYUtXdq5vZDfyt69leJwxOTBGZ2Lo4QCuIqacEQAGVA7o+TNuzBci4H+6ndY+yQY\nK37fYunjYDQ+XmYrpOPJi3PZjhVxi3JFPKZSDClezdYupY7ft2zljRjgP2hw+Q\/qjvz7mdQ4\/LU5\nQt5OZLbSdvsenJwHcBU24iTxEdzcYry4W4TjlBI8C7\/vVdF4PRZr18Ix\/fFXXsC5D75EbVX\/ZYE2\nk124fsnMl0z6M1k7rGZLFBuNDfTKL1\/SUp1j2HB8+V8BzfHFbU6i2vM4Pg6jc7xqHX1PIJOL4CEK\nniQX4nlsHp5FEMDAFGxcicRESABSaz9AdeInEAT9HpWx0cmCvavmtIGbPAYuq7foRk7HmL94Zl0p\nUeg+e0kFSb3N6af7l\/fY6tHVG448Yd+LtDKHg6kzDh\/HcflwZVXihKh2TKAOY3IJMEl2DhyRPByQ\nhrF+neStw8XwEHCHfguOyBeh5e8guvldcMS++CbPB1H17zryB7N4ohnNKOPaK9nM1GCPUpdBT605\nx2UKqFppLNX1YaVcDEtxK6xk0B5lV+MFsfSIKOggcIyt1q8SQOYhjJ+yoflDCNY+CsQINwpFc0HI\nGvwbiqfiICzMg2CoE+LWTjAN160w+fzXY0Qvll\/db5HZjKIRPKWVUE0sYXhqFX3TGpC\/9mbf5CpG\nuychl05gRDKOYdEYqJ4p79rAiAq0eBwjTUOYqe3FfOMA1MEZWLgcibG0ytczlBk1NytEtC1LACcZ\nEYeiIRy2DOCIXDvL2\/HsYT32idW7RMWdCB62Q9NhDkqFiTSSISAZuhtx0JPONpNxtPE5B3MBXO1Q\nZZ\/va98tZmt6uZtxD2Eilm4\/bMA2sdh8rxSm+AKY2LkwBKdhi0DpyYhZC0rH6tfJ0BIgfeA9GBMe\nQROQhNmk0k7mh9\/YnisfUPht3CvTmgmUlVcFA9k\/t2p7sHK3FEaikuF2KrRBadAVt2E5uw7asEwY\nwzOhCU63PSmTRp3JsYlRYKm0vdN0txjagkZo63qgzq6F6bscWO7wYIzIhDqjCgv3BQQ6A0upFcrR\npiFf1lmHQiDx2+JVG1Zz6rDTLMNToth6YjH0+Y3Qf58PQ0IhRqVPolj\/y2BGhLqmR7lc0g5r6yDm\nSzqhq5BgpkJi61Fs+bHOQzCWT3WM0JuVYqwXNGGtXKRlDhjn6jjPKPlkYAaLbTSYnYh1HqN+XNM6\nptnRsM5rPJStlixZDkcvAH8O4OK2c\/zcAnYtGlsJ4OQF4AXgBeB\/6mKzc+xiDv7fANatbPuK9fZQ\n2mjPm7Y84zdMaldn9TarasdRpthx5slNjlDphu3sTzVhLfRbmXJVfLV6SzJgsFNT205KabaPjy4b\nzWaHy7xqdWxo7MfUrNVJUYZ9Uc3CZhyXpt86M8DE\/umk\/Kk1efP6LuUFJCCr9iPKeuSiDl1uavfY\nRa0fHFOKXQJotFPCJePQfUqZcGaApbPLdVXz64v1ml1Kummn5KYDap7AaAikznHshVvYO6TGLA6q\nV2+nKuY2aKFqXXhmgNdLWiIEc2trvJEFef2KZbCHQNLGA2p82+G1e4LkMIFm4BqWLYPFk09nIpv7\n2WdXhJdu\/uq9uAc\/cCSPy9Nkk2L+Y5W8dGJJXjH1VF5FspJkGbnPl6vaOR3DJe\/H5\/\/AfHO2nXLp\n0i9YV0LeZ10O9P81OzPsd\/H86A8T\/5G\/Ic+YNe87zLs\/I\/4OvihukolDp1EAAAAASUVORK5CYII=\n",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/gurly_drink-1334193726.swf",
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

log.info("gurly_drink.js LOADED");

// generated ok 2012-12-03 20:17:43 by martlume
