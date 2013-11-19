//#include include/takeable.js

var label = "Anxiety";
var version = "1337965214";
var name_single = "Anxiety";
var name_plural = "Anxieties";
var article = "an";
var description = "";
var is_hidden = false;
var has_info = true;
var has_infopage = false;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 0;
var input_for = [];
var parent_classes = ["mental_anxiety", "mental_item_base", "takeable"];
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

function canDrop(pc, drop_stack){ // defined by mental_item_base
	return {ok: 0};
}

function canPickup(pc, drop_stack){ // defined by mental_item_base
	return {ok: 0};
}

function getDescExtras(pc){
	var out = [];
	return out;
}

var tags = [
	"mental",
	"no_trade",
	"no_rube",
	"no_auction"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-23,"y":-39,"w":46,"h":40},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAJu0lEQVR42u1Y6VPTWRb1P9CWNRBI\nAggJKDth1QAqqywiiyCrIO5EwaVVNHZrjdraRtu2LadUZlRkJ6yySIjsQlTABRWl0+1Md1tOT6Vq\nqqbm45n7HuI4rTUjS03NB1\/Vq5AfyXvn3XPuufdl3rxP49P4uHEryW7+b591rpa4aRMkolkt3Bgp\nVN6Mtc2aLcCBzYHvrdG\/XqbuzZTObu3mKIGoI93N2JEqM55cKdRdiRHHzWSdF5cP6HrSHd3effb4\n6GrDQK5zyazpaY21VepPbceJ7FDUJ9mjJ9vJyBbWb1zy0WBfaa+WPDiyRjf1\/v52D8UvmuPoX+9i\nnBMNbQu11\/TeOIfvy06iP88NA7kuGNq0BIfCrDGyw139sNDD7T99\/++GUdXE73egI8VOyd4\/P5mk\n\/kt3KboznNAYZu02JyLv2eBrfNVdix\/rzqM\/1xlt2VIcJoDDBR54UOiJh7u8DGN7vNXP9srf2\/Af\nP45mPT+djtvrFhkrV3w2f+xovGH0YBRuJdqhcqmp4j19ZsuU3emOmmmB1CbaqQaUoWAgn3yzFSei\nbHAhXoL729wwonwDssgLt\/IXY2ewpaEuU6a+X+Ae1x7joDBUnle+vL5\/MmJRNkx7uJ3miIZIIUrl\nC1VTezzY6aEY+zJ6+MHBSLAkmnYktWvtDTpVOkY6atHwrQrdn0dDv9kV9wjkcIE7B1qdIUXBUks0\nZzvj7hZXLoWedBn+XPMVutKdUEdRb0uQ4GaMLSqWmqMiyFLXnSpVPDscovu5bB+en0zGva1uGFzv\nOH3qc3xMFfl+FrhUnIfx9nJMXP0CgxQxBoJOjLsE9mSUCFsCLdGaLcPQxiW4s8EFvVnOeHFpD7rX\ne6JupRUql5nTqzWqFZboXifF02MJ+NsDLZ58GckZmVXylETbqpsomyfKvsJPrVeg37EUA3kMhJTP\nP8RJcGylkIAt5snUlyNDT6YMfbmu6MqVo3a5ADf8TNCVKkN3uhRD2+T4daiZH2DyMFIQU+\/Zz\/2t\nMpG+wDeuO9Mp7r8mjDbZ3tiVvQQ\/aM5j\/MpBDGzyRhvRN3I8A4arh\/gmHUl2aF8jQWeqA3qI9m76\nf0ucCFXBFrguX4jO5EWgddC3yZ+SxxG61Mn3baslaI6yiRssCst6WXVSPXEuVzfxu3A8ORgM\/RbX\n4bsfqErvg0wUx2mTHaDfH4\/xslO4fXYvcv2t8U2iM153\/pHrcgpQNQGqDxdiMG8Jj5g2yQF9mc4E\nWoamaBs0kxbZZH\/Xh1vzCLPvjZ7I4wcfJCaYjPrWT9PUi4MEmsIAS1zYl4\/LR4tQFO+HbC9zPDmX\nh+fqDE57B0mBbVpKlJb5m1KWe2NsjxwPC70xvNUTDRE2PKJVCpYsZrjhb4KKAHMOksosJZKIg22J\nsZ1+xUmQLRAlupoiM0CMs\/s34cymeJTHiklvUrxu+w5jx9ZyK2leNZmtjFaWAOMH\/PB4lxwj271w\nh3RZG2qFqmWWqAyyQG2wEA2hErIeE\/75674LjaW+C+JmXmF8zJRHlgpQnR0IvWod1w+b9wrkeHYm\nl\/veFM1sQ5blT\/f54VGRD0a2eUKf747+zCXoSnFGRzx9NtKBA6wOtOaRv1ccP\/zsTLZu\/Fikbvyg\nn4H57NDGxcN9adPoghqjhBoWpdubgrm3MVpa48W4VxiEHrKX1tViTlldtBOef52O0eJISiIZmIaZ\nHnvTF+N2sgy34hxxM8IemmBbZubozHCFfncEl4qebIzN\/jyX6Zt3c6hA1BBhzasC000j6ao1xo5v\nyihmYBsjbTBxaS9etXyHX1ovks85c302RAj5ZzvXSNG2ahGaV9qhZqnNG5+04onDGKA1jHTQmVNd\nEyiEbp07WYYfdGmLOKiWVRJOHYvQnRxXPDueAmPPNfy1rwqjqjhoUxx4pOqWW\/PoMXobl0tQGyQi\nDZpOapDmDf+F6kqvz+ZPGxQzzlfN55Q\/l+\/VfH8uB0+\/zsJgQSA602R84yqFBbQJUgJJRp3mQvpz\nozKWgocHVnDznopgRZA52qIno1enEKPa3wZlXgJc8zYxXJMvmF65Y216T6ajanCDyzCrvaM7PHhm\n3iGdMLNtI70xcTPLYKdvj1mEjtVO0CWSURNwVl0YOGbKjDqmzfIAMzSH2aNmmRDVAQTYR4gb7lQO\nfa0NM6aUdcfdGQ6KrnWOWdpkO1VTpI2unpqAmlBLKmOmNM1QRdndFC6hKeavjEaWGCxyDNzUQSqp\nbpf6mvyLUg9LDrApQkQHsc+ak4b27u5VyoEtftxiWANQQzTdSiJdxYqgWTFZezUhQq6zpggxGlba\nojbEGlVBgrfA3k4fE5R7W\/GDNCfZG\/eumIH+3h1\/Kj1QYijZi758L27KZQGmaFm9GI\/UWzC0L4Hr\nccqo6xQiNIRIUB8sRt0yMdFrTg2rOa8mzcme\/JVlcG2oAB1Ul1nCfR5qpZpZ1PLt5v9UcXj4ddsF\nDG72oMbADtUhlhxIa4wEY6dyMHI0ndNZ8+Z5JdXrmgBbnghVvjaoUVjxAzDvHL9+CkPFqbhJUWf2\nwnrGemo49lClmXZvyDRIVcE4fnY9TxBq3Q01ywWaUu+FqlIPC2NnohNeVh6HvjCYA9eQpzGAZV6W\nKPexQpncAqVUt8vk5jzqtylSfRu98EOVGo\/Vm3nCMYovEfCdCgEllvPw9LI51UHRnyFVfKj1Kfcw\nd7u3xd34a28F7+8YVbxhIG\/j2elvhYZo8Vvab\/iYoylMgl7qcJgzPDoUjoeHoum71PyG2+BYmJBn\n\/mDeYtW8uRrjxX661+0XeZvEDLk+3AoVgQTI25T80Qb9OyM4tUyvLJLlckqsEAFvuxgYdnVgYG9R\nX1mZYIdeuqCx5veLlULFnAB8vNvbaLi4jUewPcHO0BRta2S6YlFjoHrpOsCA14UR9b4mOnquYRbF\n7itX6Sqw2dcCu5g+qVTSTRDURXPgub4WBqb9WQMcKfLF6J5l6MuWlrAOnDbR9eT78crBu5qtbgbW\nBDBjLw8w4TW2hmp6sa+Zcq27mSHL0wxHSXvsWtq51gHkt7gcK0Eh2dLATBqGf8tuAqTfLqfoyZRT\nzwbzXdR3C5fxKwCZs+7xLm8Vq0IsGSo\/4HONq6zdWmJtVXSAYZYsJavEyPY2x+mISQn050hnTnVn\nioRXmXefkZ6ymK660h1Rv8JKNVbkIXqyT\/5R2fmmMVZv9bMwtFM0Gd2FgQLDvLkcD7Z7KF6ciOW\/\nSLAfpPizQs\/h6dKlpUZ1V6BAfSREaKQ7tnJOQU6cXsuSpuQd2rMogjPu8bRps\/xt8bfjyfGUh+9q\nh2n1o66Q\/6vRmyPNmvdp\/J+NfwJD2jjcYcbFlAAAAABJRU5ErkJggg==",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2011-08\/mental_anxiety-1312585824.swf",
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
	"mental",
	"no_trade",
	"no_rube",
	"no_auction"
];
itemDef.keys_in_location = {
	"p"	: "pickup"
};
itemDef.keys_in_pack = {
	"r"	: "drop",
	"g"	: "give"
};

log.info("mental_anxiety.js LOADED");

// generated ok 2012-05-25 10:00:14 by eric
