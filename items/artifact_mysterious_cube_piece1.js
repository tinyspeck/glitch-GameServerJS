//#include include/takeable.js

var label = "Piece of Large Mysterious Cube";
var version = "1350087166";
var name_single = "Piece of Large Mysterious Cube";
var name_plural = "Pieces of Mysterious Cube";
var article = "a";
var description = "One of five small fragments that, never mind the laws of geometry, combine to make one large cube. Mysterious.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 5;
var base_cost = 0;
var input_for = [];
var parent_classes = ["artifact_mysterious_cube_piece1", "takeable"];
var has_instance_props = false;

var classProps = {
	"collection_id"	: "artifact_mysterious_cube"	// defined by takeable (overridden by artifact_mysterious_cube_piece1)
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

function getDescExtras(pc){
	var out = [];
	out.push([2, "Collecting all the unique pieces gets you the <a href=\"\/items\/1307\/\" glitch=\"item|artifact_mysterious_cube\">Large Mysterious Cube<\/a> artifact."]);
	return out;
}

var tags = [
	"artifactpiece",
	"collectible",
	"no_rube",
	"no_donate"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-16,"y":-23,"w":31,"h":24},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAItklEQVR42u1YZ1fUVx72G7gvYjbJ\nqrFFpSh96AwDQ5VhqCogDL2plAGk9zbI4NClDyKKoIgSUYwSollNVhPN2eTsnj268hH4CM8+96JG\njbqxxLzhnvM7+Ic5zMPTfndcs2b1rJ7V8+ecB3eLtQ\/uFJt\/uZG\/uDCZyNEtfj+Xufjj1czqhckE\nOT8vHqr+z3f5uke3Cj7\/IKAe3Su2+Wkxx3TjXNLS5RP7sXAmHjfPJ+PCYBTmx+Pw9ZQOAw1+6K72\nwXRfJCa7w3BnLg3XJhJwql2zfLzO1zzY6F\/dX6+W01frm\/vewF2fTNDNjx\/AybZgXBmLxcXhaJw8\nFowxPt+6kIIzXaE40RqE6xPxmD8ZS+CJuPdVNi4M7ZV\/yAnjHnRUqNBWqkRbiRca9B7LfYYQm3cC\ndXnq8LrzA\/uKZvqjlkYMARhuDkBfgz96anzRU6uGsdgLzQUeGDWGYMykwURXOE60hchnMVM9Ebg4\nEoP+xiD0NQbiWKUf6guUyE9RID\/JSflWoPoN6rXmo6HRw4agOXNLAEaPBpIZ\/vIybxSnO6GbwHrr\n1AToi+4aMT7ooqR99Wr0U14Jns8mvt5EtlqOeKEm1wMl2W5IjNoFT8UGWG\/\/qPqNgc2fzrea7Ino\nOd0RsjzRGYLTpj0YMwZJcMNN\/qB\/UJjiiN56P5gJWvisq4pTqUL1YRfU5roRuB+MlO8oQdXluaMk\nyxX6VAUOhFnBz3MzrHes43y0+LsAPfzHEd3Du8Uz\/\/2hbJkGXxJGFkYXPjJTzqFGP8nIAL8OEuAI\n2azLc5MsnjseBnMLgTf7kzk\/dFapUJKhoLzBqCZQfaoT9mssoHL7\/DGodbC1\/CsUtp\/B02n9q6X9\nfi5D++BumfnRj+XL\/\/wmHz\/f0GNxKpEyBoiUYW5UJDMBc0zodF8EznHO90cSUATO9obLZOqTHNBF\nGSe6tAxJKEfDAGhgLPdFAdnKSXKUYJ4As7f+BC72f5PSejitfzl7\/7p5WPnvW4X3CQwP75bil5t6\n\/P1CKr5hRbC\/OAkQtXGmU4OLQ1H46fohpi8aX506gKtk9fZsKiVW49uZZMmikHqyR4te4UfpOV+0\nlKiknFq\/LyQwG4uP4e64HmqPTfBy3kDmNiy72X362z68ORtnun05Ed9dScK9hUzcmU\/HrdkUiMqY\n7ouSI\/pK1MHsyH7+PBs\/zGdivD1UGp+9hVNM6NneMAwxxSIcZZkKHCtnCMpV9Jun9FxBmgKZcXaS\nvd07P6a8GxHiu1WOt+tGwd7LO+\/mbOzyt1\/GYmqQPdUZjHPDoThuYFXQW7301qmecFw9E4vbc8m4\nNhmHhal4nD0ezjf3RjunkyEQYTCVKeWz6LJj\/LfoM\/F8lFVTccgNeSlOgiUJzsnmU4ZikwQXrNoi\nGFx6pe++ntmHC6NapkuJqYEwDDTR9C2sg1ofDNF7Teyxar7BiDEAhakuNLk78nROkqXyrJWpzHJG\nbY4bGvPdYSj0RCtBiRppFcxR1litFRx3fwLXx157MgKgYNJDsf7VtbIwvRfTwxoMk7XhtgCMdQTB\nwF88OxqGhXN7Wbxq2eynu\/j9Ik901KjQRCAthR5ymvXuqM91RV2OK2oOuaAy2xkVBFzCNB\/WOeBA\nuLVMa4DXZuzx2crZhojAHYgK3gmNepuU96Xee3KuTkain4xN9AajjuwUpjij8qCrBFWv90QV2Wug\n8TurVZgZ0fAPCEBphgsMBSvgBFgxjXxNPStEAmXv6SmpCISQUDAVGbRDMvnshPptg5dig\/n1BXwm\nEgZK0lDgCbMpEONkqqPKm7KusCGHjAgpC5Kd5Ah2SjNWvhanOeFIqiOKmNzCFAcUJjsgL9kROm6F\nPT5boPX\/AvtCLJ4Dtl9jKQGT2eXXsifOldMR0sj1ZKAy2wV1+R5op4zDRn8MtVLecq6iHBdUPZau\ngkCrD648r4BXoOqg88rPsxXye6Lr4rgdwgjuRdaeTFyEldnYEPH\/r1lzp8K5P3n9GdCwOoJgZC20\ncupoeiF1HeXrqvfBQLPvUykbnpFTTC0lFYzrE+2Rtm8XsuPtydB2ydSLwGK0ljOxwRa\/\/\/43Nx6O\nXgbh2mQUzMcCpbeE+Q1iHvusgWCON\/hg5Kj6BWArwaghoznxttAwBCl7d0vmhL9eALYUE2qle+NL\nwKWTYbx7uaMsw5m+cpbgehgIc6u\/nMFmtWRNAJroDpSAJLDHrAl506OtEcSUik0RGbRTbgeR0qcA\nQy3Nb32nuzTGxc56GTCo2f5e8k2\/ZC92UvbWcqVMrZBXABw0+HIreMjXSB8SXGqUNaJYG9nxDjIM\nApyok1\/ltbwfrd6y9q0BXhwNRWGaMwws6ksntOih30SqjaWe6G8isDwPnOzwR2k611cFe7BKKYGJ\nMKRG76LnbJERa8s62YpA7y3Y+2til8lc9Ttf1aeHQhYbhO8YjBEmd8wUwO5z5dXIDyZek5oK3cmg\nD3IT7AhOJNoVRayVwwn2Mgwirf6UNyxg+zN+s1p8oyC87hhLvXQVrJcj9F+uzhHDDIKxxJO71gvj\nZK6nQYXiTGfJ2mibWq4uASwperfsuOe8JlmzyH2vn8Qqs5yUQi7hK+Gzdt5A+hpV3K2sDfZZHtdV\nJcG1U9pybhUhZyg3RJBqRU6RzliNpfadfPa6kxZjp8zYb8easJc9VsRtUJTmiFomt4Y7tibPlR9k\n3CWwMP\/tUs6na4vpfG9SvupkEWD6Pjsa3hYpnHSa\/lCcrey1bN7fsg7Yyc8MotvETo0JtVzpNM1O\n5ZoPcfKT7JT6JHsZgswYWyRH2SAx0gbpMXbSa+E0f5D3Zlm8Apzw2R8m58tOKT0oFr9Y8vk6IbUd\nwdnSY1vhw2vSSq9tWYres8MkNsEfLunLQvLkElBOoAfJmpfzRuzi5wat\/\/YlP69NpmCfzR8W1HMA\nMxQ2pemO98WVKS\/RYZF3uEXxwdli81\/+PFAvnvRoh7ViVv9PbvWsnt+e\/wH15x9ETtgg7wAAAABJ\nRU5ErkJggg==",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-09\/artifact_mysterious_cube_piece1-1348252051.swf",
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
	"artifactpiece",
	"collectible",
	"no_rube",
	"no_donate"
];
itemDef.keys_in_location = {
	"p"	: "pickup"
};
itemDef.keys_in_pack = {
	"r"	: "drop",
	"g"	: "give"
};

log.info("artifact_mysterious_cube_piece1.js LOADED");

// generated ok 2012-10-12 17:12:46 by martlume
