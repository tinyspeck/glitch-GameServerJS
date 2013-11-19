//#include include/takeable.js

var label = "Red-Green Triangle Key";
var version = "1337965213";
var name_single = "Red-Green Triangle Key";
var name_plural = "Red-Green Triangle Key";
var article = "a";
var description = "There's nothing a red-green triangle key loves more than a good door-opening. Nothing.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 10;
var base_cost = 50;
var input_for = [];
var parent_classes = ["door_key_5", "door_key_base", "takeable"];
var has_instance_props = false;

var classProps = {
	"collection_id"	: "",	// defined by takeable
	"key_id"	: "5"	// defined by door_key_base (overridden by door_key_5)
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
		'position': {"x":-19,"y":-17,"w":39,"h":17},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAEGUlEQVR42u2V60tbdxjH\/Q98tUGg\n4CiUSQsN\/ApdJ2xHra3VXhnIutHRTdddHMVRJ96qWcX7JdFIa2LVJGo1BjNrotZbcmJS46W5mZhU\njZp6qdZaclhX2N59d042Bdc3s7Toi\/OFL+d5Ds+LD8\/v+T2\/sDBevHjx4sWLl2bIFl7e0Nm1bwGV\n90foikYtMkplafsOrnfUe1GuGcaV7FJklMiY3MqGiH0DZ1sIhveMepnCPAmSU+LxZWYxcsUK574B\nnJjdkDR1W2D+JBa3ci7jUOV1pBfLIVF1i\/YczrP6Smj1reHeD79gLToaVYXf4sBgOmIrClDWoEWL\n3iLcU0Dv01dOdacBgRMfYzMhAZKKVBBbBd43ZOHnmiYou83OvTxaEdc905UUPD99GsHERNTUpIE8\nrsXRKTE+HCxAlVKPbotH1DowdbVlwEX\/1xrjND3ievLGHrYtdGWX11OvwRkcixHjM+uMXnwXz6Ki\nQnC\/nzsHaV0GyHIDiL8Oh5ylSGwXQzNsZ+z+ZwrXwgbehdV6A\/M6oG2eHpycgy8mLnS0zNmz+OPC\nBaSYq0A2W0AC9SBeKQSmHFR39qNv7DEkTdp34ht5ZYEdcDqzmzLY\/DBn3gpdjM0zZ8CwHXx5\/jyS\n6QqQNSXIohxkuhpHx4tBtPnoGfXB5F5WSJt11G5dIG1R5EuU4Fx0W50mqlY5t3IuTvouM3zHc9Zt\ncgWMehP8xz\/CGjt7G\/HxeMECcl381C0FmZeB+GpBHJUg1iIc6ElDTlcH2BvPLAQRvttZzyqTi7LL\n5AiZnbesUhm9lXPxjuL23lHRwLgPtktJeBIbi5W4OKyzkM\/ZLnKQhL0cIXNwYyUg9K8gfVn4QHUN\n+kdezG78teu3Wt4xIJJ39INzvWaQkqn76a2ci7cLG7SGCM0DKzPR2oWZY8cQiInB8smTWD11KgTJ\ndTKhLy\/UNfKwEMTIwvXngNxPR2TrNSQ1F8Oz8hLuAHNxN4Dt+hFRG3tiIevM1D2did7KuXi7sF7d\nr7BYXPCciMIcRWGedYDt4tK\/nXzKgqbe+QlkiIUcyAXpzQLpSgdRXwdRfQ9BzSWoxkbhCgQZ7nn8\n3+vMOXV10uEG5wmHRzhpdyu2c7v7nxORNmqF2qEJ+G4WwHvwIHyRkSHPsJ47fBjzR45ggXXd5WgI\n2pIhaP0GAuVXENz9AgLZ5xDcScJ7tz+DsDEVniUG1ullyVtdytWKTlpH22Fy+GG0+zH8aA7cmnkw\nPgvNkB11GgOKZJ24UVKPrzPK8WN+LW5Wt6BKpYdCZ4HOMg3L9Cociy\/gXgpizLsC46SfemuA0qbf\nKG5A2\/qsFLdmjI4ANenfpHzrf4a+fVYf1czORzlbl8HetDxxEyVmVwT3j6u3eFaFYbx48eLFixev\nN9XfgnS2rTNSnswAAAAASUVORK5CYII=",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/door_key_5-1334257925.swf",
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

log.info("door_key_5.js LOADED");

// generated ok 2012-05-25 10:00:13 by eric
