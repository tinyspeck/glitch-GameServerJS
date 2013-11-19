//#include include/takeable.js

var label = "Rook Head";
var version = "1337965214";
var name_single = "Rook Head";
var name_plural = "Rook Heads";
var article = "a";
var description = "";
var is_hidden = true;
var has_info = true;
var has_infopage = false;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 0;
var input_for = [];
var parent_classes = ["rook_head", "takeable"];
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
	"no_trade"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-25,"y":-70,"w":47,"h":71},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAHNklEQVR42s2Ya2ibZRvH13dqD0vS\ntE2brGnSnE9P8uScNKcmTw5ND2nTpe26unXz3dxLEdxAQUXF6cvLUHjHBMGBEwuifhBE\/OAB\/SAi\niCBSEf3gp4GCXweCny+v6971xLrVD67Ppg\/8SZ42ue\/ffR3+9\/3kwIE7dK0qq+0D\/7SrU+1MrlVW\nzq9VV7YR8NN\/BOQR5Uh0tbp6eXl6eWexsAgLuQWhVWXl2mJ+cftvA1urrw1SpJZLbWjlW6DEKpCX\nclCOTsNUMCvu6X1JLl1upprtuw5HEWoXl2A2Mwu50BRkAuk9FXGGIe1PQUWevlxP1gfvDlyls7OE\n6cQJRbSygcyecHFPDAI2H3itbghNBqAaV3ZwQafuKCDV2vzUHNQSNRE5FY5gbgbMBjNQjpVQ0xC0\n+8E\/4YWpUBbm0nNlzRthpdLZXi62d5YwrY10\/RYYilDKn+zeK\/EKtLE+qQQq0bKoR\/q7z+oBv81z\nTcuIXaBam5+aF4XfSDWgmW4igNKFibmjIpVRtyzuqwlFNA7BzaRnRPOQ1JqklEv2gDapjrnk8wlv\n\/DoNTpNQSgvhvJicXtWo0KQEWomXxWLo\/1QGu+HUSHvGXZ85rc6oZlGkwbwT7uu766wYKYqIpnwJ\nAUdK+ZICjFSNV7v1mcTPUOTUKIcdofdx2Hs1rcOLD2++G3b5QXZFRENIk8FuYxBc2CF1I4ze110I\nwVGDbB1tQSYY7n6HI9ijGeCFraPXnnvkDGy\/+CxEPUEBRamN+iQopFNQzGQgH8sIABKlGyMFi9NF\n+OjNS3D1\/0\/Aw8c7IsUC3Jv4CIfVawLXd09f+dxaDT5\/6yJ8+c4l+PDKY3BmrgrNYhWOr7WhVi5A\nQo5ApTgFKSkq7ORsPQFvXzwrPv\/zd+\/D8qwC5051wGGeBLWeJad0Eoc\/uG9A2SVvDx3SwaPrVbhw\neh4eP1qGjVYTtk4fh1azCqmYDJNWmwAs57MguQLw6HwMXn\/qfvjk1adh54OX4duPX4GN+Wkw6U0C\nUDSZVPh+31Gk7Skv5a\/339sPqgIeD5w81oGHzpwQUOmEDMVcWoju85jynMsCL55R4I1nNuG9y+fg\npcdOwIjOIAApegRI3pjwxl7YVy3mw\/l3yfssQxYBZxjQw7HOogCkVwIi1SsFmC5kYXG2JhQLSRA6\nbILguAlcZtON7\/brsQaDovsJkLZJbKCrZp157Lbgkq7kYNqfPk+DJdlO0pGogPvPAxtdOJJSysHC\njALt+QY0lKJIdcwrg210Akb0wzA+fFg0FdkNRY7GpGZymB3HcCrDbUeQIMmQKS0E2KrXBCA1x27A\n3UrLklA5m+s2BEGRyLxVr4w4pK9NRtMSTjOyrzpES7iu+t2sUhGA653WLWARjwssA\/0w1nufUB0t\nhiJPgLTlqWD0nmDRhl7D4UOosX0B4g5wkTyNAJVcXgAuL8z8Ac5tHgUzQpkZzmMegxJ6Ixm62J9x\nZyGpzUGGHrQHn8fhI6jxfQGah8wRdb9NhmR48OQ6zNbKXbjQ5ARMDPSi+vi1FwpxGRJSRHyHAKkh\nKJLUIHRPJx\/9gJ7SSzvKxH6tcAg3+J9UwN0Nko2GwaHrB6e+H1wsej+HCwg5fV1AEp0f1SNZwO7\/\nilyMziOaADos9m0VcHP9SBfQO2IA7+AA+IyHwM9Kex1QLeW72yHVoRo16lw8HcGwzvhfLQGNRp2x\njFH8JWD3wqmNFQFHaSag0LAOpBEdhFmNAu7JoRvppW2PDgsERXVMsM7Djh9wTLKXmlYpJp9y2UzW\nSzQpdScB1ooFARQ16SE+aoDEmAFKwRv\/99k83WMYSX02cY87f+27r+9JerxBKZo0CV6HUA5Uwmlx\nfFPJ5yAdxVQFIzDlmoCk2QAZyyAosh9mq7\/X3l6yGMfexnEepOd81LQmNkMHGk6D3HuwdzGXTF6T\n3AF8tvBCIxuHnG0E5gppEbk\/g3NZJn9kuC0UHfdbtJOifPs2arzu4VUGUUWz2XR21Dh6lSZuKmVY\nwhNNLp68Ja2q7KPWLxhM1QZqBpWiAztqQItj4RDKg8qgmjSJ1WS9gofUXyPu4J5gVG+7oqbq3\/Sg\niCpz\/U1ocibkOrRRmnnwZU7VFkEQzG4wh9n+g25A97+b4NTozaKmOL0mrU79lOZRHjTLKaJOPK1O\nTqAEaDxkuLQHGOkEqs0LJHuZ5PrW7KLTr51TU0TNodZ3Q47oh678Cdwmp7bOZeLjuu7REvAgd5wb\nFWebmOdIbrJ9bO1Rc\/czXAOVQ0lcLr134ucZ6jgLRyDBkE2uyaMMQ6k8zrvFKltKjeEi7Kl39Jcu\nSrWVIWPsZwqDLjBQi0ugwYugtIbZVoa1Tu3NVw9vf+Oc7jB7Wo5rk4BKqAI3FC0iwE1BXfuvu\/E7\nJkHquNCpcby8bUXYimQGJzAXR3xYK8\/7q9ugkUGtDOvgaNk4yiPsoz0H\/qarh0F1XPxGloH\/fttR\n+w04hpur0isdqwAAAABJRU5ErkJggg==",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2011-07\/rook_head-1311871657.swf",
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
	"no_trade"
];
itemDef.keys_in_location = {
	"p"	: "pickup"
};
itemDef.keys_in_pack = {
	"r"	: "drop",
	"g"	: "give"
};

log.info("rook_head.js LOADED");

// generated ok 2012-05-25 10:00:14 by eric
