//#include include/takeable.js

var label = "Piece of Chicken-Shaped Brick";
var version = "1350087081";
var name_single = "Piece of Chicken-Shaped Brick";
var name_plural = "Pieces of Chicken-Shaped Brick";
var article = "a";
var description = "A piece of brick that resembles one fifth of a chicken and is warm to the touch. All of them will likely combine to make a whole fowl.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 5;
var base_cost = 0;
var input_for = [];
var parent_classes = ["artifact_chicken_brick_piece2", "takeable"];
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

function getDescExtras(pc){
	var out = [];
	out.push([2, "Collecting all the unique pieces gets you the <a href=\"\/items\/1312\/\" glitch=\"item|artifact_chicken_brick\">Chicken-Shaped Brick<\/a> artifact."]);
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
		'position': {"x":-14,"y":-29,"w":29,"h":29},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAJFElEQVR42sWYiVZUVxaGfYM8gkIQ\nRGaKGYpiUKAQKIYqECzmUQWRyKBMJQ5ABKU13WkwIbQxJp3WBFcnq1evrG7rEXwEHoFHOH2+U3df\nbxVDt1kxzVp71eXWvef859\/\/\/vc5deLEe\/z9e73\/5Ju1Xt9P8\/7Q67mW8I83G9WL8Wq1PVRq4rOe\nop0lf6ZvuT3X8+ZBr+fE7\/X3ZrUvI\/yg9+0v9zujAMWGBqjWuorVy1st6u\/zfvXlUNn+9qB7R38X\netxV0L015ProQ4Hbh60\/agBPhzzq+ViV2uwvOQDwz30lamekTD27UhF1\/+mAW\/2pt8hcfznk3l1u\nz+v+zQDC3D\/vXrInY3Ini0z8MJh\/JKtfDLrV0+Fy9WrGp1bb89Xj7kLVW35G1bhO\/XqQ6IcIr\/WF\nwg\/6FPH9jQtRE29pBjet2LLYBAwsf95bbO4\/u1qpHg9UqntdFerJQIVauZinRs6fVc0FCaomOz70\nq4D9a6V77x9L7ernxVZFWr+dqFXPRs+rr3XEpi42nnQXqfVL+eoPXYXqu09q1cupesN2KJCrvK54\nNVaTqq7XpqlA0WnlzY7br8485XsvgKsdOb51LfIX12vsSWFko7PApGarr9jEpg5Sy3cSj\/QzAIwF\nzXtzTVmqMT9BdXnOGIBD584awMR7MamBhO+35aiFFpf662S9YdAZP0z71KupBvXN2Hn1fPScSWls\nmglYo+K\/nWlRP8y3GVD9FckmtVxLwGhnaZKqzYnfPeeKP77Ct4dLMpjwQUeeuu3PNvGox61WgsXq\nbkeR2rpao57q+HHWr0SXBHJ4PdtsFvA3vajPBsrVUtCjhr3ZqiH3YzVSnW4DaitOtK9DLdnqXmuO\n+ewoSTQpr8qKyzga4JB7I2IVxUZHSwGXulEXGZxPAX231aXTWaie9HsMcIkZX5ZJoaROIqgZElBX\nq1PM51R9ulrTc0w3ZNhMXsiJPx7k9mDpPuB4Ed2Qts\/1\/1zzuemoWgLdrVzMVRMX0q2J0tWy\/p\/3\nCYBx\/0pVitHcNW+qDZT799tyo9I9UJmsal0G5NsD4L4acPtgDz9b1hp8FCyw9fRS6474ShvwUdUr\nrK85Yr4524w1fD7FgB2tiQZIep0AWYC\/8HSE+ez4jSiAuDuskMJJnU50CEN\/0bYCuG+uVR0KzAka\n73MCpNgYb6DyrPLlfWyYFDDDmtFP2\/M0+2lRILvLzqgmXe0waRcN\/ZFWBAOseFW\/KJNsxbQzmAI4\nPZcFfa0r2W5ng6VRABdbsgyQtuLTthap5MsaKPenGzJNgTgBolFAtuuisT3yaa\/bg4cx6JJe8Z1A\njj3J9uV3xowXSoXP6BR9olf\/0CGFFxNe+z15blDrqrUoAhBmpuozjCcCpsOdqMdIjwKIDFiEaYXi\njw+DeSEZmDRcq0mzJ3o+7jVplvRRwUwMA\/jXXFOmvWnAuOW91fZc8xzjDVZGTJk0L2hdSuWiuUsa\nJGM5GQSg5ZkRgJP1mWEZOKQNGgYpFhiTFG9YDCMBWAYYLAKClKNRPp0pZjH3dDAmANEVmsNiBBAL\nwAMBCbhh3acFYF2OxaCutj1ZNZYCoO8n66IKQwBKLFsFsGQB5HknQNExmmULJp5Iu3OmlIBFdCfA\nCPRa44oLG4C3\/S4zGKs9bI9HrMVYyD0LIJVK+qVn44s712rMYrlG23SnBp1eAKJHdjNojUCjSKXT\nKiAnQJ43AAGGqO8Esg8AZHIqPBbgHd1l5rXYuX4x2WADZLEYMABhV0y\/y5NsNMjkPZotAMAc0acL\notuTpJ9JOhwgTAByXuvqiZVi2dvFmq+TwTutuWrzcpXthSyGCkVzUiR0FuQBQNhb1LZCONmSwFpg\nEqAX6c02wJasPTHoNc2kc5sllmEABVwmxr1pZtXfzTSp1\/MB44VUOuyjKZgVgEv+yIZgzJtu9oBo\nk8IYcRSDBOAASQSsjmIxmBVmsGldXTd9GRpUnln1uiX2yboM6zPdBOBu+TLVLys9ppCk0wBwtDpV\nj5FpAyQAPKqtq7ngtPa3iMcBMhYgzB0LcLYx05Q6OxcmwG7wsEXtXexsaPgDeiCEDbNfjJRHtToA\njui+u+DPtU1\/sTnLjIdBSyXHVizBPYxbAPoLEw4CDLVEHJ4VGi3oYKXCBOC5D6MAgGFnUbHB6Nbb\nrVezAdus0TWGjDRqLYCx4Hqt1uZkry4n\/h1ADSy8oFd621rxLZ3mm1bIfZkI0Bi0s6XR9DFlmOV7\nUv+oJwKcd0erI4tsKUiwWx4FQwStonACtPeSem9oAGp3D8McwISt2AAgDAKCa7nPO6Rw2Nrv0Z+5\nhxtg0ugPlngW7fosP5QApBPcRWtjYc4qYtRTdenjE+zR6tOjQMHgXOM7MABAh9LiDguYXA9GOsin\nml2eRRaMxTV+J0xK+2vUoNssoM2O76pdp8YNwFv1aR4KBDCwwzV6ZNBZB8Abmh0YBCjf8Yzxurac\nAz4pmwo5FKFrADIeQOpy421NSojuJL1RhyjnKYvPWPZkiwU4KplPWJcF4JP3rbhrNghZZrGjVmFx\n3mDsSetsgxToIrEpF3AHziXXvam7soXCRAUwA83FsCggYROQh6VaCo2UMiaMcaBa6SxRj\/vLzDNi\nzuiuMf8d0EMPTRPeNA8TD8ccbuwzhNYnbE1bWyXsBwauVqccqUccQBbN8ZOdzFpPmelAfI9pC8hO\nqze3FSXsHnnsvF6bGooFZp+4rF2uMEJwTer69HcYsdjUomVNUv1sDgAIO7A4VpsZtYhRyx004LfB\nksSMYw\/vEzUp3XKoce50Cc4SMIeRUokAJvAy4oqeCIYnHWdo0sw7AhD5iBNIkVmxsRr4H3877C1P\n8mlN7jnBMSitiOsLVrXJIfy\/Be+iQWJIFu1NDRPT9Rm7C01Z7\/9L7My5+I+GKpI3hCVJb5\/FGP8f\nB4qKJQO8g7ZYHOyZM0fZmd\/ux0s00elO3BHdkV4YjAXIxBQXeuK79uLIZlR2LtZzOzdqk09+kN+o\nO4riTgbdSWEOOOgJFp0plg2GmLLeNOzp\/d9OsDQxhEP8bj+ma2DjnaWJ+7CDf8VG0J24e6k0sfvE\n\/\/MPNnWqw5EfH+P2aOr0zdqsuA+Svv8ARCiu7eDkuioAAAAASUVORK5CYII=",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-09\/artifact_chicken_brick_piece2-1348197902.swf",
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

log.info("artifact_chicken_brick_piece2.js LOADED");

// generated ok 2012-10-12 17:11:21 by martlume
