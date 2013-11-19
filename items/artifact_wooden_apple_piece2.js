//#include include/takeable.js

var label = "Piece of Wooden Apple";
var version = "1350087246";
var name_single = "Piece of Wooden Apple";
var name_plural = "Pieces of Wooden Apple";
var article = "a";
var description = "A splinter of spice tree wood that makes up one fourth of a most wonderful apple decoration, fit for a mantelpiece.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 5;
var base_cost = 0;
var input_for = [];
var parent_classes = ["artifact_wooden_apple_piece2", "takeable"];
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
	out.push([2, "Collecting all the unique pieces gets you the <a href=\"\/items\/1315\/\" glitch=\"item|artifact_wooden_apple\">Wooden Apple<\/a> artifact."]);
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
		'position': {"x":-9,"y":-26,"w":18,"h":27},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAIwElEQVR42s2YW0yb9xnGucwaE7CN\nzyccDISSlFASEkhaJ5QQTuF8sDkac7Ix5mQMgQRMmoQzgdKkKeQATQ9J0zZ0S7tVvWGaNE3aTS53\nmV5U2u7QNGlarp6979+xF2nZxbQPtE\/66zNGmJ+f9\/S8X0zM\/3itjcrj1qcUG5sz8u1PF5Tbny8p\ntx+tJGz\/6q5ua2tNEfp8SRHaup\/aX5UXb4nZ62vmYmHiR1P6n75YUeHphhbf39fghw0VfvxEjfsL\naox7tRjp0mG0W4emci1qi9RorjBs7Ancxu3CxN\/90vbTH38w48cvrViZOojrQ0aE\/AaMdOrhbzYh\n0G5BsNOChjINaopUaKrQ42rwLew+3HJh4m+\/PfSXP3xvxNq0EUNuM\/pbTehrISi3BRe7E3Gpx4rL\ndJoqtKgrJuUqdRjzpWLQbdnZVbjQQEXiN3fSnv\/moQmTfiN6m+k0mTDoMmPMk4i50RSsz2bgwc2i\nP7fX6eEoVaOtxrAT7LY+73QYcO60fHcVnL+Y8afNxUQCM6GnwQhfownDFMrp4RRsLh\/Dk3un8PXd\nXAy2J79wXtDA22TBuC8ZLVU62E\/Ew54d\/2z3iiKQvjHSaUNPkxFd9QZ4CTDYYcEHU0f\/8eh2DoGd\nwvrC2wKe826g3fZvcDWFqu1dgZvypy0PuZPQ02hERx3BObkYLLgz9za+uHUSX63n4svbJykXzZR3\nGngaD764PnIEHvoS7+XKUZ6fgLxc+Y6rRic94FhXSmugPZkUM0WVGyblbl078dfPVk+A1eP74mg6\n3NU6eJx6zI+9hcu9ySi0K1ByVom6EjXyT8nRWa+XNsSzXQfj+l22HX+LlT7cIAAH28yYHUnD5o1s\nbC4dx52ZLHx8NZNai5nU1WM2mIJ7i6fRSL2PQ1v2XgLctXoUn1GiiwpFUsABly1ER4TVRer4qZVM\n9NpwZzYLN69kYnXyKD5+PxPvD6SivVaHhbHDLz5btQv1uGIZsOq8SoA1UNFIDhhw23YG26wYclFF\nNhgw4LJQKzmM+dEjmB1OxweTGZgjNT0vc3Jx\/Njf1udyRO6JwqBTmhdWjnuip0FCwInulAxuto9v\nqAlOLwpk3JuCy1SZ04E3qUFbMdUXLhwfnasDSRTubFwZPAQHqXXmZDyK7Epx\/C1GAeijDtBRry+X\nBDDoSu7\/dF6HtSm1yL++VguFN41ai1VMC3eNXuRkN6kzSuox7ONb72KI+iIXB4Nxu+H7oNsk1POJ\nFqXfkgSQQrb16zU1Qj0aARigNnPJm0rKhccZz1qG5PDODtsw4UvC+swJ+KgPcmi5elk1LpJgp1nA\nMSTlqjStZmHYsPP0lgqBNq0AHO1KpWMTs3ekKzxvebxN+Ky4NpiEuWAatZ7saPWycjXkYBiwz2UK\nqxfORWkAF0f0eLKsRMClRbfTJAAH2hJFm2GXMu61kns5KHJviu63r2RgYTwDZdSUI4CsYMU5Faka\nhqP8Q7VU04QBH88p4HVQ9TkZKoWS3SymBc\/fiHpX+pMw2WvF3eksTI8cjlYvh5gNQ3WhWgByk26u\n1KLynESAHqcFPU4NWsgqeRvI23WkiIrlXshhHn0ZZlbxSp8N92aOkaU6JOAK3lGgvlQjcq6GAP2t\nRhFifq\/0bII0gK5a288NF7QCsJtgedx5nEZhBjjMPO6iOTiUigdLOVFjwOHlXGQobtQDbaYoIDVw\naQDbahK3naVasus6miQE5U4WLcXXFDankWLhXJwdfhOPbtpF\/4sAttXoooBdDj18LcZnDEj9URrA\nxguGZQd9YGOZFm3VBso9m6jmiIqRXBztstD8TcfyRGYUsDQvgXMuCthSpRUqcrjp99IA1hRryuuK\nNXBeCKvob0miHmYQ1ciOhnORQx0gJWeDh2mCpAtTEDEI3kZDFLCenHUvTROuaMkAeVWsLdKAVRTu\nuMEqANk4REIdgZz0HyJzeghs6xmwskAl4CKAvJewoqws\/16yecw9i1Wsp9NRZ+b9QkwPAek0RiF9\nTYlYmjhODdksABgoMtr4tchDmjh85zGYlSWPkwSw8lyCnVUUO20lWy4jXFV6DNN0ueTRCkg+jhIt\nliePizmclxMvGnSXIwxYX6IRYD1NBtEPORffOR5vl0zFyvOq7arzagq1luCMtHzrcHdSgel+tVCy\nhWDWpuR4vJpCS\/pBlOQpXwsYgeP3i84o+iUDrM2Xx1UVqHY4r1oq2HhqsRJUYqhVEzYLDjUer6jw\n3UdaMUm4kiOA3RTWCCBbLnY13H6qCtUhSY1rZb6ynCuTQ+mgf9jwsrK5iXfWqvDNqgpPbijwCa2e\nXCjc7xiQD8OxaeCq5j2am7lk4+7VqywvIcRz9V+VHYYcaknAtx8m4Kt5BZ7ePSrykIorCsgbXcT2\n82HYQrtyd9bPqgL1VvX5MCSHTkyaMvXft1aUeDQjx3e3TcJysSl4VUGu3MjP\/CUlG3evuyryw0XD\nkHwvP6f\/2UOm4sMRBR5el+PhzVwsXs7kqbMj\/B\/N5FcBOZclMwyvu\/KpaIrtqt+X0BpZciZBrJN8\nd7xUlPNzOZSN+0unKe+MIh3Y3UQA+TX9zfNdf8pVcFp5y1EoR02BHHkn5agWEyMc+v7GBNoAzViZ\nOr4T6LSKMPPayurxOspmIjdzDx5qDtYf6B1vlqG\/TobBRjnG2xS45pXjwWQ85vsUYvYOuFN2eE\/u\nJ2B+usBwrOK72fGte\/IwM+Dc3zrSKNuZ88iwMRaHjfE4bF6Kw72xA1jsi8c1TxwtXrQ3dyeJfZlT\ngldSAgzF7NUVaNhnCTr3P7vWKcOyPxY3emOx4IvFSn8s1kcO4Kr3AC67FWKy8Lx+ubdsx+z1NeyQ\nhYIOGSZdMsx0yzDvjRUn2LwfFfmxyDocKyp\/gBwQTxzJTMN\/Z9P2WXoqZCF\/7f5tL52Oql88a7jw\nBhXIG8hM34+MNBlyMuPEQkWufDnm\/+W6t5qecTZnn\/2IbZ89LSm2Ms0m81EL2u50av+js\/knpXt9\n9RMCmZEAAAAASUVORK5CYII=",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-09\/artifact_wooden_apple_piece2-1348254336.swf",
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

log.info("artifact_wooden_apple_piece2.js LOADED");

// generated ok 2012-10-12 17:14:06 by martlume
