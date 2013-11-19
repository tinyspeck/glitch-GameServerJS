//#include include/takeable.js

var label = "Mortar Barnacle";
var version = "1351116224";
var name_single = "Mortar Barnacle";
var name_plural = "Mortar Barnacles";
var article = "a";
var description = "If clinging to things is a skill, this little fella was a champion. Once prised from a cluster (or \"Blister\") of pals, Barnacles can be introduced to the Grinder to find a new purpose.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 20;
var base_cost = 8;
var input_for = [];
var parent_classes = ["barnacle", "takeable"];
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

verbs.crush = { // defined by barnacle
	"name"				: "crush",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 53,
	"tooltip"			: "With a Grinder",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (!pc.skills_has('refining_1')) return {state:null};

		if (!pc.items_find_working_tool('ore_grinder') && !pc.items_find_working_tool('grand_ol_grinder')) return {state:'disabled', reason: "You could crush this with a working Grinder."};

		if (pc.making_is_making()) return {state:'disabled', reason: "You are too busy making something."};

		return {state:'enabled'};
	},
	"handler"			: function(pc, msg, suppress_activity){

		msg.target_itemstack = this;

		function is_working_grinder(item){ 
			if (	(item.class_tsid=='ore_grinder' || item.class_tsid=='grand_ol_grinder') && 
				item.getInstanceProp('is_broken') == false &&
				item.getToolWearMultiplier(msg.target_itemstack.class_tsid, msg.target_itemstack.count) <= item.getInstanceProp('points_remaining')){

				return item;
			}
		}

		var grinder = pc.findFirst(is_working_grinder)
		if (grinder) {
			return grinder.verbs['crush'].handler.call(grinder, pc, msg);
		}

		pc.sendActivity('Your Grinder doesn\'t have enough uses left. Try repairing it or replacing it.');

		return false;
	}
};

function getDescExtras(pc){
	var out = [];
	out.push([2, "This can be scraped from a Mortar Barnacle by using either a <a href=\"\/items\/634\/\" glitch=\"item|scraper\">Scraper<\/a> or a <a href=\"\/items\/880\/\" glitch=\"item|super_scraper\">Super Scraper<\/a>."]);
	out.push([2, "You can use a <a href=\"\/items\/427\/\" glitch=\"item|ore_grinder\">Grinder<\/a> or a <a href=\"\/items\/879\/\" glitch=\"item|grand_ol_grinder\">Grand Ol' Grinder <\/a> to turn these into <a href=\"\/items\/641\/\" glitch=\"item|barnacle_talc\">Barnacle Talc<\/a>."]);
	return out;
}

var tags = [
	"barnacle",
	"basic_resource",
	"firebogproduct"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-22,"y":-27,"w":44,"h":27},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAK2klEQVR42t2Y+Vab1xXF\/QZ+BL9B\nSdJkpV1tSuJmcpvE4BhjG8cyxkw2IEabQUjMiFGIWUJIoAEJISQmAUaAAGMmY7AhBjuJozTN6p\/l\nEXbPuRoijDxk6urqt9ZZDAJ9v2+fvc+9V8eO\/b9fPzyZjvphf1Lyz\/0pRcTam4zm+tee+8R\/Bejf\nTz3HGej7\/SnD93uTBwSB5xW9jn88cov67ssJfLsz5vPtjiu+\/a1gv388fZpu6ntVIIIRRWB4+nBU\n1DcPRvD19gi+2nYZnm7aj\/8qYNwiurn3WZgHyxaYO2XoacoTpW3Mw6yrFY\/W7SEYP5ALX205RT25\nP4zHmw5Re\/eGDvbXByW\/qJ0EonpWnbVZPcbMtfCOtmNpogvLk1qse\/TYWjDh4fIARk1KTNoasbtq\nCwHtc90bwt6GHY+41gfx5dogdtds2FkZUP1kODb1d4\/c2+Ht4pu5TNVwGasISoPV2z24N9ePrUWz\n+DpPwFadAnZ9BQa0pRjuq8TytCYMyCaAdletDIWHXHct1Akztu+YpK+ezN3xKN\/O2AF7J+ifWZca\nbmsd7s0bMDOswu6KjQB1mLDWw6KR4e60Fo\/vDePRqh3LU1pszBno5lbcJ1X7Wgv9QAImBIQtriUj\n7i8asbnYz99HvxTuKbWVfOMLmpn9o65Mx9RgIxbG2nHH3Y3poWY8uGOBsasECxPdeLBkxd6aA082\nnfhyZRDbixbsbziwvWQhtQZh1chh08qPAG0u9OGetw8bXgM25vVknV7fSwEpXdt+M\/sNPT5QR36r\nwW2CWp7sppuaCaoLzVU34DTW4qv7Lvh2xunrCEEOhwA3543YmO0T7fcMt0CeHR8A8sNwrc\/1EpRO\n1KqnByMWJRor058fGgJSPA4zMz+duasI4xYKBKnnMlYLBW26Mpz59M9ITPgYTlMtHH3VWHJrCM4O\nj1ONsQElRuih2Ar89\/MjbSglwDF6WD+MDisEtDLTg7u3tVi+rRFenXaqkJkeG7nNT9ZtUc+mS12V\njl51Hob05RgLQJqorbLceCSefweKm5eF577eGqGkDmPR3SluNEdA7MOq4ssUlArMErRSdhX23jIC\n0gSAunFnqgtLXJOd4n8X3B1YnGiPrODOitUbSheZedSsRGddBiZIDfafd6xDhGJr0YSuxmy0KTMw\nZW8WYA\/vWIXfviHPPlim78mfO+S9KXsTnP1V9JD5KM48Cysle2kyDGiig6od3vF2zI+1UbXSw6kP\njsDt3TWfeDZdJdJz6Kz3Aw73lWPG4W\/XXVKmr\/0WVqZ7yIM1WJvRixHzgObf+qyB\/n9AjCAGnKOh\nzW0uzo5D5pVTsHTL4CWg+fE2ATRHQLOjasyOqOEZacGMSwVrrwJHAAlK4U9Xv0gXt+mL2D+ivf4G\nDd1qAckh4VEyRkaedvjHDCvEw5qhGXh1RicG9wp9XaPBPetqE4kvzj6LhE\/+IB7MD9QCj8sPNEO+\nuz3cTNVE79uEgR759hFACsNBMF3rc3ryXAVSEv4KdW06PXWxmH9umnduWz35SCH8tU5zjmHM9PoC\ntZ+LwzBH83LJ3SUeiOFsulKU5JxHzMnfYcxKD+psFkDTBDTlaMTUUCMmhxrgttP7D9Zj2FTpOgRH\nUNFrgbgH09VWnYHrko\/QUH4NupZcAcWQfe03MUl+XPX00jyj1WO+n5JdSSmuEKNklJI7QUllMFbd\n2V8JdU06rsa9C+nVUwGghjCgOkxQjduUGCf4MWstRgdqDreY5o9iZUZ7KF31pdeQnHASNbIrBFWA\nEVrauFitSVJxfpRaZ2+kahKlac6hUcTrbwO1rZVWlzrx9\/rWvJB6WlWOH8hWJ2AE0AABWWpEjZhp\nCTVXwW4oOwy4NN3tFXGndC0G0mXukuH8J2+hSBqHzoYMDPXK6YaVYmTw0Oa5OKiTw9h5S\/zsMJRD\n25wLh75MgDn0CmiapOL\/4\/\/2JtIuvRdSR8BY\/DBcThO9r7FClK23FHUVKYdbTDH3iqiH0tUqWhD7\n\/mti1nGbu5uy0NOSg\/a6GzQqSsijtCEgQCcBM5CLWsl\/p6dxolVlo7Y0EelXPsSZD15H\/N9fJ+WL\n\/EAmAjIGgPoryBrlGOIi1ez0nmWFl5GSEnd4jzg3qvbOjbYeSZc85wLOnvo9ctM\/Q0tNGlTVabh+\n5QOhGivkEJCltM4Ww9CWL5S+nvghMpJOQXLuT\/j8o9epC2\/QDMx9BqgsBDSol2OQusNBsupkkOUn\nHAWccbZ4GShSugrSYnHx9NtIk7yPrOS\/I+HM26iVXxXzUUeKsrJcnPamymQkXXwX8Z++hdgPXkPy\nhXfQQ75jILuBYfxA3EZrAGigp4S2ZSWwaIthpgctyb8YWuoeb4xKaUXyHpsaalKF0mUPS5fNn66a\n4kQkxb+LpAt\/EYDy\/POQFySgqkSCElryGDz50klcoAc5TbY4d+pNlOfH+4FC6lD1hAFpGKhItN7U\nVUi7oluiM1lpMSEF1cpsr7Is2XuMYi6ZCEsXmzmYLjYzp8tIG4brlz\/Gp+9F4fOP3xB1JlAM9dnJ\nKFyKeQfVxRJxw5A6PT+qw0Cm7sIQUH\/nTfR33ERfRwEMNCnYQlmpMUeHtNtcdeJl6XL0+82sacpG\nMS2BRVlccZDnXYSKNhSR2iXU6WaYQqEOA\/UxULsfSE++5THUS6Ujn96k9yXAyLtqF03vF6Xr57Qr\nqI4AYpi2PD8QwejUOcLDPS3ZlHop6hRJkdULXsOkIpn5gM1sDzOzLdzMEdplDGtXX1i79AGgoDoM\nxGOKRxADaZqloYDx6MrL+BwZqbFRoqM2ZWQVB3tlisjqFIepUximzs0wdQ63y69OAKg5DKgxk7Zq\nmWIkddJGpINKln8h1NrtRZOUl9TMtBhvRMi6smu+xsrUX9QuP1BWGFBGGNB1UoxKmU77yTRUFH2B\nzNQYsXLMj2mjtxbMYs1\/brtv3DhzoqEq9XSwXbaeUrFk8c1e1i4e5twuAUPF6ggYqjYCaq1NE6Wu\nSYW6OoV24wkCJHwws5I0ahRZqbGnX3hw6m3NNfC6y0tZL+1mVHTzH9sVWZ3KksuH1PEDpQqg5spr\ntPxJUENVUXgJuTfOHIF75WvTYz++ONHt5V1KELCadjUvaldF8RcoybsQAmohhVqqk9FYkYTC7HNi\nADOQUEcoFCP9yWBPNz3H99ddCjou+pborBsEbKu9LjYCz2tXvSIR2emxAoJhGsuvoonAGhRXRDoD\ncNJf5UMik0au8DjbEA5YUXQZGmXKcXVNiqSlOtWnDqijqkoWcIF2HQj\/pMdKCNbLoCE4+l3o5Lg1\nHvVw2eZdmzEYFic6JTP25minsTzarCsJfRz3aM3hXRht99q0MukRBeng7Z20q+h8oRMHHt5K3ZLG\nHYq8kmCbyxOjuXhh5+Jw8Wseu\/J4MGzhvw+\/du\/YotY9BiyOd4pNL2\/VLF1FB+R7MQdblFJvV1Mu\nd05xREFu8faC+YAB+XzBkXcYynwDnQUv\/MxkZ8Uezb6lA5bvVTq1MaOPpjOMjwEHNDLUl11DQVbc\nIcUeb4z4jK05R+\/LTx4yc7CoTZHU4OvbLfcJj6tje7i\/hkZQwXZNaWLEhxm1NNFCUOatL08Ova5v\nL5Lw+wdXkSMsgRn5q17sMzonK+gQpRrSy0\/\/T3yQLibA2rCBzsfb7F1DRzGdqbNp\/EgOftas+y0u\ndV2WpKEyzVstS\/LmZ55VPS8kP\/X6Dy6l\/+QbP4F+AAAAAElFTkSuQmCC",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/barnacle-1334274672.swf",
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
	"barnacle",
	"basic_resource",
	"firebogproduct"
];
itemDef.keys_in_location = {
	"p"	: "pickup"
};
itemDef.keys_in_pack = {
	"r"	: "drop",
	"c"	: "crush",
	"g"	: "give"
};

log.info("barnacle.js LOADED");

// generated ok 2012-10-24 15:03:44 by martlume
