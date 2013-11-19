//#include include/takeable.js

var label = "Junked Tool Part";
var version = "1338330723";
var name_single = "Junked Tool Part";
var name_plural = "Junked Tool Parts";
var article = "a";
var description = "A piece of old thing so twisted and gnarly, its impossible what kind of tool this it used to be. It's pretty easy to tell what it is now, however: it's junk.";
var is_hidden = false;
var has_info = true;
var has_infopage = false;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 50;
var base_cost = 0;
var input_for = [];
var parent_classes = ["junked_tool_part", "takeable"];
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
	return out;
}

var tags = [
	"no_rube",
	"no_trade",
	"no_auction"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-21,"y":-15,"w":42,"h":18},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAGnklEQVR42u1W20+TZxj3YslmYiSi\nCDomGe68aQlnVuiB9uu5Xw+0tAUKWqCFlh44aDnVUhCoUCjqdFOz6LagbHNCtott2QxxcVl2sZh4\nv3izRO+44A949jyvX13nwqZLzC7WJ\/nl\/U7v9\/6e3\/s8v+\/bti0XuchFLnKRi\/80Uqn3ShYXT4cX\n00t3ECBgYyG9tJ5On47\/Z8S0nFZqtzsvBwJBODU3D6mFNExOzcB4bAJOxCfZ8fRMkq6vJ5MX8mjO\n99\/fCt\/+8We4efPWsyXOG\/gwbzSDibeATmsAs9mKxE4wQkRwbDwOwyNj7Dh2IgHT08nLNG9l5fo6\nEW9tbe94ZuQsBovIbLJCBkSSyBoNJiQTR0wwckPHjsPx6AiMjI6zcXBwsOTayhcboVD\/xjMjZ1fa\n88wmywaRUqk0oFBwIJM3gkHPM7ItrjZULwaDQ8f+AiR558pHy3DkiCddL5eL6qWydYJYIkvXS2Rx\nHDsaGuRSwrvvNpb8O\/V4SwcR0Wh0oORUwJvMYLZYwWZrfqQokekfGGRjKNIPfaEw+PuCEIsn4P33\nL4Hb7ZaaHa51HucYLDbQ8mZQG3hQanXQiEmbrHbo9AXA4w2kn6ohNGrdPb3OyGquUaGElpa2Bzxv\nWuM49cWKiophVPEBEUSFwNvTC75ePxt7\/AFGeGHxNMwm5yEQCJRIGjmQNCoBFWSQ4C5osET4Jgcc\n9fYygoj1JyIXcxVLFQqVra5WfKW2um65urJ2ubS0dBhvGbIhrqtfplqkhskQJPUyWzwzOwfj2DwO\nV8s9sUQKUkySVCMFTTYHjGBDDR4fgXaPV1DQf\/kfyTU17Drcb37xrvjtHfLs62QbCwtnRMLpbkRD\nYUGhR6vRAyoN3d0+CIUjjBgp2NLmRtJ+pqIOCekxCbPdiXDhuRU4rRFOTJyEG6tfwbmpHvB3uzc8\nvj7Rk5qwaWFxKU3GSyBDTp6aZxaChb8ajUbJ494iFUlhLZaAEQko1Rqol8lBzqlBrTeC+2gnnD9\/\nEZqaXaA1WkCh1uM2q6CuQQZVtWK0qLlNIki4tnIdYrHJhwTHWvaVjLkOdKQTfb\/gaR3iOSTVQV+E\nufkFNOEUEKHZ5BxDxusIZCcDg0MbXT6fScipwdXa\/qtQQ1hTzWB1toLR2sxq7ONPrgGP5GvEEqhE\nUofKKjak1W\/ct8levj812nc\/Q3AxfRYJJqTsjR6uaDJiehFUZbv8ePoa+pTJ6+2BUfSvjFJbgbwu\nU2MDQ0NpkahCniFHsDa3oIIaEEsVjNTKp1+AC63ojbcP3S\/ct38N10voq\/K\/iTkPwHiPBpM\/xTA2\nPnHn0TZWvvp8qaE2r5yUy1yTyxX3OKUaPEe7IDF5kilFiA6PMtOlMdw\/AIFg6JGljI7F7nV2Bkqy\nCRrMNqioroOy8io4JCqHS5cug8\/nR\/9UrvC8OYVLuV4q2t3r8zjY8719EbA0NV\/kOF0N7WzUvitv\nW8i4H8L8fsbY6\/Xmdfr8YVdbx6oBO5K60mJpgs7ObgiGIqwrqeipQ\/sHhogUTCROQgjv0bP4imK7\nq+1rWuxIV++mqLzq7sFXXl+L9A\/9tnz1M0illiASGWSgrcR3D5usjrXspGieVK481ybfu9alKvrh\nkZKPZ09wOFs3TUbzJvkbEbChHZBiM7NJ9oNAypGtcErVg7LDZWSshUJXZ8B25YMLHzJC8YkpCAYj\nWDophpqaugvNjpbN7DXdHZ2AdQwHDx58J3tXKQqzv7EEFaf5KX9nvkZSL102GvgHvKAq3SPDxjJg\nxPR6Y\/DKx1dvbuUGTmfrNyOjD9WmP51gsB8cSGzHjh2hmurab6349bCR7Qjr6nWGX3Fa4+Pv2Z6V\neTE1jDBuEzIpri6vVnMKblKl1JwpO1TW3X7EM3327Pm7n19fZRaRSExPPJ61EDtdLrfU4WgLRx2v\nbhx3vgltigNLfG1+N61H75WIJVYahXUJO7f0vxs3vpSurn4VR4Sj0WRe5noXV7RO8CgLbzsa9vyk\nM\/BT86k0nDt\/AdC4NwsKCh1bEPzjy4Qdm8GwrRi61fvcgjhPHlMzpzpoUUJPT+CYoOR2IoWFCwQ6\nNlTlT3nbLbPj4xPx7ESYv6K3EoljTcXvZZeRX7cPCD5NEdjFe74j7\/xbtbaIl0kNnc5I3igSvreV\n9rqCVxwNBWeM1buXSwpe8ERM+zdbpXuXhWf+FMbKXT5KBO\/fpbmZMnLK9lR2c0XSitIXDjy1ck8b\n7bK9Sr5qt1Xo3lzkIhe5yMX\/MX4HNPHWyyz7CbgAAAAASUVORK5CYII=",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-05\/junked_tool_part-1338250532.swf",
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
	"no_rube",
	"no_trade",
	"no_auction"
];
itemDef.keys_in_location = {
	"p"	: "pickup"
};
itemDef.keys_in_pack = {
	"r"	: "drop",
	"g"	: "give"
};

log.info("junked_tool_part.js LOADED");

// generated ok 2012-05-29 15:32:03 by martlume
