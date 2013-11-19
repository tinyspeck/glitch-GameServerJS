//#include include/takeable.js

var label = "Contemplation";
var version = "1337965214";
var name_single = "Contemplation";
var name_plural = "Contemplations";
var article = "a";
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
var parent_classes = ["mental_contemplation", "mental_item_base", "takeable"];
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
		'position': {"x":-20,"y":-45,"w":41,"h":46},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAJfElEQVR42sWYeVYa2xbGM4MMIUNw\nCBmCQ8gQ8s9bd90kKkZs0KjYNyiCoqKiYBONSVQUQSU2qKCCiKhBbGgKBMEG3\/f2OaXG3CQ36HW9\ne9baqwos6vzOt7+965RPnvzDYbHgmWUulTlrvZRY5i6M5pm7cSm3zF5KzLOpFzMzeG6iePL\/GhZL\nKtMyc2EjAPwqCJAixWPa8i1M5hSmzCmjyXwln5q+eskW+ShQJoKatlyqaBJBnDw9uJ8BinEFAuQx\nOZ0yPBjKRFB0Q+FmgrsT3wVlx9npcyx8TmJxOAHrhyTM05d\/C8eO+oEI5JXbkL1zZqYPZsJzSoPt\n5oZ3J\/kr5IzlEk5jAp7RGDz9J9jURbHeEcGqOoIlhQBrSxTW1hNMmy5vAS2zVxgcjqCmfhslZZuQ\nlW6i6J1bkhbc+5H4i4WlS8x9uSKYK\/wO0m46g3vsFK7RONbfx2Dvj8Gmj+HLYAJzhlPM9p3CMpLk\n97DOpzDyMYJ6hRdlFW68K9\/kgMX3A4wJo59OKQVnWLKdw3+QgncnBd\/+FXb3rmB3kGpzPwL\/Kiyz\nKVrsBUZGw2hs8kJe5UZ5pZsDlsofADjy8RQfPycwNpHExGSSDHxGqz\/nwaDNM+zzGUGeYX7xglS5\ngG0lRecM5BsYO5+YjKPPcIiaui1U1W6hrmId6pJl1JWt\/wBYnC7gBwY4RoDGJIxTIhz1NR7snH3H\n4Nk1bDFkCQwMxdA\/GCWVKL0rZ0gm\/4sW9Q7qGrbQVLECTfEc+qST6JeaKCwYkM6JKX6IggzwE00+\nzgBNIqBl9oIHO+\/VH2FoWOCAA0oH9PIZGBQb0Dc6odOF0KUTsLyaQl2tC935Y9DnfaIYhyGPAU4T\n3AwHrC1df5gHv0sxqcXSOjQcQoHMij+zpvDHqwlUF87BNhSERRfEiHIT+nIrAUxBX2bjgF8WLtBa\nMos+DjdGf5vgf++XmjngoNQKRYnjFpBVcdptZpiqkRXJp3FRxY9jceTkzdAq7XiVbcJ\/\/hyDtWMb\nUe8pvKNBrCr9mOwMoa\/zEIaSRWi1QVpgFNpC0x2479M7KP0CVbEdJeWierJ3mygscT9Pt81AVFGE\nrKl3UuVtkl\/W8MfrCbzJMeOrMUiACQTsMbh6j7HcdIgRbRi9im30KH20wCg6C81\/gTNfp9dKgPNQ\nyRx3euA9AAeGT2zvP4iQTMnCYhta24N4I5mmMONt\/jx2xoIIrMbgt0bh0gexrDiCtSmAntZ99FZv\ncUBt4cx1Wu\/CzXG4IekiGovXbtUrKnFBJvM8TQuQqtE4OBzj1dmlO+bqabsFvCL\/5VJqCotXsDUU\ngM8cIVABzt4gbI3HWGwIoLsrDEPpBvk2ToBWDiamdeY2tYPSBQK0obzEeUc9F9J+zPX1R439QycY\noKeCtvsYimYfunsjyJJYIC1aorSsY0l1APdQCBs95MG2AJYIbrE+CL0mjPdSO7WkU\/LY8i3YTVpF\nuCWoCx3fwRUU3wOwty9iJEgYBk7QSYCqtiPo9BFKrZVutEz9y4WRxn3YKK1MuRu4hboQdGoqlmIn\nB2yRrfBqFVUT08qUU+Z+wWsqtizJDLLfziOvwIF8mdOYNiCpZWRAvYYopThEgIf8vKxyjae3vHIT\njY0+mBQE1kBg13DztQIqanZRJd\/CNAdcvVZskatmyFtCKXn4TY6RYhJvsqc4aA59Ly26B6C2O2zs\n0kXQQ2nt6YtAodzngEr13q2CNfV7aGo5hq7xELrKPfRV76O9dh819Jwtq\/TQo+4UXQUrXLEh6TLa\nSCkJgWXlTNzGDWSudAV5hS552oDt2pCxk4pC2yNGSytB6KNgviyVOwiSbliwgHzy47vyDXrG7qCh\nyY\/ahn1oiiyorPVSi6I93ttF1OdakZczxYGyJeMUYzyy6JyDUmd4W7BB9rnHXpBailHTGUY79bWO\nrpsI0cbyhJ4oMQJxUk9cRVWdiwpoF2ryaFt7GPUEqieftrT56NoAsnNnuUJZTDkO9xk5uZ94cNBc\nM3LzHd48mSvjXrtoVVtApdaEqPeF0NYRgrL1GE2qY74R6B8UIYev++TIKDvGoTOESbk9lFdtkx0O\noen0k7+ob2ZPXgNOEMw8KWWjlLKjHXlFTlXave87wNaQpKU1SJvKfZp0F9X1PtQ2+lFPT4sWaiks\n7capOBVCgnvNZI7RNV8hr97h\/jOZA5TyPbzOmuYKsqKQEBT57Dbyi1y2B8GxQXAvGKBCeYSKau81\n5FfUkMcYaJ3igAc7r2nwUar3qHp3SD0Ppd4Nx3qc7Uw44GsOOEnq2TmYtIhC5vQ+GO4Wsk143tIa\netmsChhISS+DYCmsqvvKYdlR\/G6XlPNy5RhccZmT3jVCHOZNjpVSa4WEtxFSTSZG0X163u9GT2P4\naUOlx1tavmWrbzqQNFLUN\/mNpByHriJAph7beDK4yho3mlU+Dvi2wCmw\/saCNWJZscsoL9tCbYUH\njwJn7RIyRtR+Y1fDXubvlFaqA3KlOmjs7g0bCc7A2sbP0thU6c3U1O2iq8GXcW8gT0\/46aZGeOnW\nCAaXNmx0GASBQT72fyX6m31eWrhhvD387J6AEdtZIIXzEL3BTdD7LVXrZpugemxAY\/uR3KI9xjxt\nNOw9IYO7Q5C42oUXf\/sjUk1yMB5DKn6F5MEF\/O8j2KWnyVYHbadahczHgtvWCBmO7qDNqQvDoxfg\nG45ihx6pbB4XZe6XP9zUhL3Hc6dI+i8gWOPw0493e0TAjVZB8lhw3l5BiKwlcRa4RMJ3gdjWGSL2\nJA6MsRvIn8\/lahNwaI4jtHCK4Fycw21rKcUaAWuqfw7I\/E2ptMV3z5E8ukRy\/wKJnXPEXAS4ksAx\nze3pFOf76Q0IQmCQbBXsQnZkF6+rBKw0\/8YfaQyyycv9zyeI717glCATXgpSL7aeRGDqBHt9oiDu\ndq7ij4W5qhCeO5Rh77qaUqoWwRwtAlabBPljpNfVKtgCCwlEnWc4IdVONpI4cSRwRG9\/vl6B+337\nWkGy1K8F8VBjZrAslprDzx6rOEhBMMCQLYEwhbBER7KTfySCPbKTt0vMGsviY3k+7WFXChksK1\/H\n6C2QNhlHljgOJ2PYIbAdUs6rFW79xxbyGJ6\/9yC7CAzSO0gp\/RyDl1oLg\/J0fPM7g2PWWm15vLaW\n9mBeZp5mHmcgLJU34WwTfb\/G4JSCwGz25N8Y5GsVA1hrEZW6CfbZoSS4Zl6UmU\/+zWFvEDKWFYKB\nw1zHSpMg0HeqhZ8o9z81qHSsNSSvAgAAAABJRU5ErkJggg==",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2011-08\/mental_contemplation-1312586075.swf",
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

log.info("mental_contemplation.js LOADED");

// generated ok 2012-05-25 10:00:14 by eric
