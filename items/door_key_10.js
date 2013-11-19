//#include include/takeable.js

var label = "Blue-Yellow Circle Key";
var version = "1337965213";
var name_single = "Blue-Yellow Circle Key";
var name_plural = "Blue-Yellow Circle Key";
var article = "a";
var description = "POW! Right in the keyhole! That's what this blue and yellow circular key would say if it could speak. Which it can't.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 10;
var base_cost = 50;
var input_for = [];
var parent_classes = ["door_key_10", "door_key_base", "takeable"];
var has_instance_props = false;

var classProps = {
	"collection_id"	: "",	// defined by takeable
	"key_id"	: "10"	// defined by door_key_base (overridden by door_key_10)
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

function expire(){ // defined by door_key_base
	if (this.isOnGround()){
		this.apiDelete();
	}
	else{
		delete this.pc_can_pickup;
	}
}

// global block from door_key_base
this.is_key = 1;

function getDescExtras(pc){
	var out = [];
	return out;
}

var tags = [
	"key",
	"no_rube"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-18,"y":-17,"w":37,"h":18},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAEVUlEQVR42u2WbUxTVxjH+bIlSzQu\n+7YsWT9tLnOhkWxxc8YmW0iWMUFRB4LIHGZvyWLIsghG7LKpwDZHxUYpA4qCDAqFwkBaoFwplvJ6\nL7SU8TJ2geJAZVywCAxM\/zvntloZJoso8mH3n\/xyzpPeNP88zznPeQICJEmSJEmSpP+fHKMzclvv\neJrhSidzvtDIKFUXmCMpGuZ0rqEsv9IWW9s+uGFNjJmtPbKr3aOMw3ULxpZ+qAtMOJ5+CZ8lpeNQ\n4mkoyT63opH+xrO8W\/FEzenNrKy6ySkwnTwyS1oRHPsbXtw2hue3uPDUxllsVNhRU\/Qe0rN+xC+m\nNrD8FAYm7oQ9EXMaXe0GncnG1bb2ITGNx\/rXFiB724OgUEIYYad3ba\/+BJPNr4Kp\/FzM8MDNRcEx\nKshX3WB2sSmtooFDtuEann7Zg8AQn6lwwm7CHi+WqqO45fwAUx1bYDUfA8dPonNI4FbVnDpLL8su\nrkF9xxheeGsBrwQTM7t8piIIkX44SzzcfWFw9+zAVLscrW0l6CImbd3DsatmUKXVp5XVtSIhbZac\nt3+ZiyLsJ8R4EJfUjdmhPbg9GA53\/06Syfcx1vwmMfgXmrqHuVU0WMI32XmSuUVvacN95qIJBwgf\nET72wGr9FnOjEZgd3osZarIvFFNsEHr6rSSDIzCzPbJVMXhGq4djaALrNvnOHc3ePm\/Wgg4SDpHs\nJTsxf3M\/5sajMeeKwG1+N2ZoFh3vgLefEA0Wme3Iq+kSKax3oKbt90eivNEpRH+R8MZSg7S8e32l\npdmLI3zqQV1TOhaEWMzfICb\/jCSlJlkc2EUMvgvecVI0WNvS89hR5+r4\/zS4\/fAMFqcP+g1ee7BB\n9cUKJJ8reKzEfZnI0DPI3TuDO3wljvSXOO6kE39PxDywxNOdr6O31ygazCmtV5wruPxQHFdd4I79\npAWFxnf3lG\/O5mnV+VUyeou1vzaw4i2WbV9+SdR5xZgbiyLsW3ZJrrdt895ixzC\/kvOfkJLBJKZq\nQKHx3T0lIVWjFD9KzylV0D7Y6JjAc0F3EBi6tM2oc4owO\/Khl3ttJgzTXVvBtpz19kGnS7kSgxmF\nl5mMwmpQvLF3T9EUVfv\/M0tnYqqu2nEq8zqeIWdxU4jf5NEUs5gxEXLuaKOetm9Ft+UA2gZu0JdE\naB+cXNF0k2+oZ\/LLGVDE2LenXCpn7jOoN8t0RptA32JVfj\/WBy7gpWD\/U6crUMHdG0qacwjpfZtR\nWZEktgLyFsM+Iqx4YLA0dzCNzSwsNlYQY7LS2At3eMnHhcYWOZlmuIauIajyWHGaeXbzPNbJPSLJ\n3\/2A0twoZGpPQFfXQacZ4VGnmQx9ozyz1KKg6\/0xRaNrX14VOohanaMcHQL09RxOafSIT\/4ZMV99\nj6j4ZHydmoMcQwOMrQMC+8eMPGCtZHe5Fc2942WGK104X2SC8sxFHEnNBJmo+bwqm3LNJmpJkiRJ\nkiTpofUPEQy1BVFzGCsAAAAASUVORK5CYII=",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/door_key_10-1334258144.swf",
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
	"key",
	"no_rube"
];
itemDef.keys_in_location = {
	"p"	: "pickup"
};
itemDef.keys_in_pack = {
	"r"	: "drop",
	"g"	: "give"
};

log.info("door_key_10.js LOADED");

// generated ok 2012-05-25 10:00:13 by eric
