//#include include/takeable.js

var label = "Beam";
var version = "1338996857";
var name_single = "Beam";
var name_plural = "Beams";
var article = "a";
var description = "One sturdy construction beam, similar in heft and girth to a mighty Wood Tree. But then, this Beam was once some Posts; Posts made from Boards, which in turn were once a whole shedload of Planks, each hand-culled from a tender young Wood Tree. Good thing those Wood Trees didn't die in vain, eh?";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 8;
var base_cost = 800;
var input_for = [261];
var parent_classes = ["beam", "takeable"];
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

	// automatically generated source information...
	out.push([2, "This can be made with a <a href=\"\/items\/1183\/\" glitch=\"item|woodworker\">Woodworker<\/a>."]);
	if (pc && !pc.skills_has("woodworking_1")) out.push([2, "You need to learn <a href=\"\/skills\/118\/\" glitch=\"skill|woodworking_1\">Woodworking<\/a> to use a <a href=\"\/items\/1183\/\" glitch=\"item|woodworker\">Woodworker<\/a>."]);
	return out;
}

var tags = [
	"woodproduct",
	"advanced_resource"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-45,"y":-23,"w":89,"h":23},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAF7ElEQVR42tWYeVJTCRDGuYFHsGrK\nkQQQBNQpRyEEEkgkCSYsCi5hM4jIuCGMbAmLioKgAZNAwLCriDIqCMhApuYCHsEjpDxBT3\/98gAP\n8ELNq+pK\/vxVf\/193e8lJR3gM9nx+2H\/\/dOGcGeuN9h+1jvdY4yGOnOibwct0eVhh\/sg2ZKmus5m\nTHoNsaE7pynYkSM13pVLiwNFNPvISp312dGDg+s1Zkz58mL+1jMUaM+hcLeBJhhupt9Eq4FS6ryW\nTQ9qs+helf7wgcBNdhtioY5cGm07S+OduVKRXgWuoy6L2hmu5epx+qPy2EhC4eYYLtKTF5vyGgTu\nlS+PXj7IodmHZloPlQkYAO+7j1NTRSrVO\/XfEw4HKMgKSEiMmdsIlTNcJnXUZ1Mrw928mEae0hRy\n249SwuCme40xNgUxJCnynqGlQYvAPRC4LGqrzqRblcfomktPtSXJ\/KuLJARups8YC\/GczfbnK27l\n\/8vPrLQ5ocB1xuFuV6Vz5\/RUd15HVdYjK5rDjXacOTHXnx8D0NzDfOIuytx9GD4ncO08b5D1z5pM\nuns5na6XpdA1p56qHUe\/tXmyD2kK5289fWq23\/hD4Lhz8wwISMiqwqlxArjG8lTyuFLocvGv2sPN\n9+c7GebHBMMBDNKic3Dr5ngcrn4vTm4wHLrHpojdvJCaoSnc2ycF7jdPTBy+yszN9hnJz5GywG4F\nHMB4S\/wUJ4BjWbWHWx4qcC89NctmUCXFhnjPhvgartiDi8cJB7FIW+1Ipiv2IwaN4Qrd7wbNkm+A\nm39UQOxe+uQvFrgunjcB5F84FnCQtobjpLFU59YcjoumMGcMtcBwkR4jfR61CVy354TAdcXhbl9K\npxssbW2JjiHTbmkK92G40P3hWaEEMCR9PWBiQxh2O9ftyRZZAYk4AVzThTTJOs2DGHArw0USIzO9\nebT01LQrK3arCuZtOCGBDFlvMhziRHO4jy8s7r9GimjxcYEE8DLPH+SFrLL42aW+6ycVOO5cc2Ua\nNTNcA+\/Y+vN6bbMOcMtDZoYz0TRL+54lBtwqw30JlkmE9DaeFEDIyvFBzRcVODaFtnCLnHNL3K23\nnHXoHOYPplgds9Hqy1KRFXA9DAdDQFJIe70sleqcyTFN4Tg6ZOaQdTAFJIYp1gN2gYMh+m6cEsC2\n6uPSNVwnjQzntiV\/1zSIv4xZ3J\/9Vpk1RMjH5xaB2wjaaY0vYcwa4NC5lqsZfJkcozvs2MYykTXW\n5NLwfAfcl7Fz9H5IiZNPz4tYYjPDOWgtWCqzBjhAAu7eFaUaAMdbokHLzm0Git0bL8\/JrMEQ6NwK\nSwvgtYBLOgY4xMl9hoO0t6qUoxOnE3dRuy2x6rfWbgaL6R3PnOTbC4t0cT1go89jTpk1FQ5RgusE\ncQK3whT3tITbCFhrvsbhcJVg\/iDtZpDd+hNcdvyuyxRTIFJwAPAMahfEW0Gbb2vcJobAllgbtTKg\nhb6G4NY9OHVT4OiEW+UAqEjTFm57wh7hEilxlWDWVhlua9zOsp7fNQTgYApsDIDBtU2Au5T+TVO4\nHYaDIRY5fNfZHOje9oRDOueLRwlkBSgulNuXlDhBILO00QGtgvifsNI5yIr9yu6lrZCNdsIOcaua\nc\/gFHE4nRMndyxl8naRSgytFuxX275QjEg3bxRCov3n+0MnoZAnvVpfMGeAAhi6qkQJAyFvn1MfK\nTb9oA7cedIxEp0ppPVjC7nTQdthJO5Mu2ubaeVWxCwdjqKcTznUVjk8nbd8lIr5879xDE5\/oe7X4\n2ExvnhTSu2fFu46FpOhga7UCJ2HMndP8RWdpwHRouq8gxkWoSG8+qf\/nH5lpuCVHHAtpcTq1MByu\nYo9sCp22Lzrqs\/DYHNnfwf0V9haQl12LOEHn4FhsijuV6Yn7AjrTbyrZD\/V6QJEYtTRolThRHYt3\nWI9Tl\/jPs6qsak36jLvV1\/SbwDWW4zrRHcy3YzbKitrBBS61gyh8R8ZrYkNZ6kjSQT2zPUbD\/q7t\nr0B7LtU5EvCt7v\/4\/AcUAfVbBgBOkwAAAABJRU5ErkJggg==",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/beam-1334339831.swf",
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
	"woodproduct",
	"advanced_resource"
];
itemDef.keys_in_location = {
	"p"	: "pickup"
};
itemDef.keys_in_pack = {
	"r"	: "drop",
	"g"	: "give"
};

log.info("beam.js LOADED");

// generated ok 2012-06-06 08:34:17 by justinklemsz
