//#include include/takeable.js

var label = "Gas Plant Bean";
var version = "1354586283";
var name_single = "Gas Plant Bean";
var name_plural = "Gas Plant Beans";
var article = "a";
var description = "A vapourous gas plant bean. It can be used to grow a gas plant.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 100;
var base_cost = 150;
var input_for = [];
var parent_classes = ["bean_gas", "bean_base", "takeable"];
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

verbs.plant = { // defined by bean_base
	"name"				: "plant",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_single"			: 1,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 53,
	"tooltip"			: "Only works next to clean patch. Or, drag bean to patch",
	"is_drop_target"		: false,
	"handler"			: function(pc, msg, suppress_activity){

		//
		// find a patch
		//

		var patch = null;
		if (msg.itemstack_tsid){
			//patch = apiFindObject(msg.itemstack_tsid);
			//if (!patch.canPlant(this)) patch = null;
		}

		if (!patch){
			function is_patch(it, bean){ return in_array(it.class_tsid, ['patch', 'patch_dark']) && it.canPlant(bean) ? true : false; }
			patch = pc.findCloseStack(is_patch, config.verb_radius, this);
		}

		if (!patch){
			pc.sendActivity("Find a suitable patch to plant it in!");
			return false;
		}


		//
		// is the patch ready?
		//

		if (patch.is_messy){
			pc.sendActivity("That patch needs tending.");
			return false;
		}

		if (patch.planted){
			pc.sendActivity("That patch already has something growing.");
			return false;
		}

		if (patch.is_dug){
			pc.sendActivity("That patch has been dug. Your poor bean would get lost in there!");
			return false;
		}

		//
		// looks good to go
		//

		if (!this.trant_class || !this.trant_chance){
			pc.sendActivity("Looks like the dev didn't set up this bean correctly...");
			return false;
		}

		patch.plantBean(this.trant_class, pc);

		pc.achievements_increment('patches', 'planted');
		pc.achievements_increment('beans_planted', this.class_tsid);
		this.apiDelete();

		pc.sendActivity("You planted that bean real good. Congrats!");

		return true;
	}
};

function onCreate(){ // defined by bean_gas
	this.trant_class = 'trant_gas';
	this.trant_chance = 0.9;
}

// global block from bean_base
var is_seasoned_bean = 1;

function getDescExtras(pc){
	var out = [];
	out.push([2, "Beans can only be planted in certain regions. Like attracts like."]);
	out.push([2, "You can plant this in a <a href=\"\/items\/94\/\" glitch=\"item|patch\">Patch<\/a> in your yard."]);

	// automatically generated source information...
	out.push([2, "This can be made with a <a href=\"\/items\/261\/\" glitch=\"item|bean_seasoner\">Bean Seasoner<\/a>."]);
	if (pc && !pc.skills_has("botany_1")) out.push([2, "You need to learn <a href=\"\/skills\/15\/\" glitch=\"skill|botany_1\">Botany<\/a> to use a <a href=\"\/items\/261\/\" glitch=\"item|bean_seasoner\">Bean Seasoner<\/a>."]);
	return out;
}

var tags = [
	"bean",
	"croppery_gardening_supplies"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-13,"y":-14,"w":24,"h":14},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAADgElEQVR42u2WSU9TURTHcYjRhZho\nXLjyA7hwo2tWfgJXxgUJJpI4hBiMAwYnhFILFIGW9rWlA7RA51IKHSkgiKDSAEJCIBIBDTEh2miI\nrq73f+WVVzpQxDF5J\/mnbXrvOb97znnn3bw80UQTTTTRRBPtN9huql3\/BEkopD4U9nAlAbtiwdfZ\nSLo7GkiXpX7CZpC1c\/I75+mSA38VsM+jiYZdKiJUwKFkoJBVLx0pLjp7aj2ruZ862qWR93m4BfpJ\nNsTp8V+ufrA+ef+GQk5VAtJpqo2XFJ87kxNkn1d3MhVMII\/mI9ZsCUfLyu\/p92rJ83AneRZqT\/LV\nY21KQHa2SJfotqN5OTiO4XS8U2jQZ0iBjPi0xzP70BYK4SZHA2R+epRMjPSSIX9rwo+w1LQvSVX5\nlet0+96s2QMc+mQsamcOP62u0E9\/2kwiS8L9gEZrCNfhgGtf4gQ2M95PXvQ705YZ0jXeD1A3+ZkB\nu7gCnAqALwfcDHBqLERmJ4ZYJjKWPYOQ+fdvZxnc5\/gq8wfx\/yOOENDMVWYvMw\/otyvYSXmH0PKb\n1+TVoIcMdLdsCYY1wwEzmZsaYXDfvq6xQ8JPbNiXEbBDW00oxrHsgHYlwbx62mtKAuSFACgbHwTr\n8BsZnxoLsl5bWZoj7xZmyOqHZbI4P5m0fzRizQiob3owTTGOZB0vyKC3\/QkJOptZ8PEhb1pIPgjf\nCsgQn6VMQlWErYJK8XAes5xw9eXowYNZn+KIWx21G2Qsi3TcJJUNwJCwzMheNqh0WYfgW5g9m\/4x\nkdy9WkoR9mSfg7TM7jY5hifx2xQ5PQzoN34kbVbKiFpXr21jBqJiRmUFHpDDOb0BIm5Ob9FIGCSG\nqTCTO1XYrU6CY0NaJyUVty9d2NYFIuhQxiyaKuIw1rByoyd3AoZDCnsu8S5ukZIGyQ05Dbl\/27eQ\ngE0RM3NVzAkmPUARBAM2Fyjaz+xgaJXNYPCHsaKQ3dL99I2GXZVcapfDVEMs3I9sol\/4ID0UGC2Q\nTvzVarPcbXXsgTCpHsUryy4X0TD7dnxlwruVBo116KqJWV3JArhaa5NgswkjBIfDIY3NFfH1rOX\/\n8rsdQP1WhctJ4VCeNgoLYHzPJKyBjMqHi6raO9Kb1wpP\/JGLaNCpLKA9es\/VKtdbDbIofRJTROGN\nqrqyi\/WS0tNbzjfRRBNNNNH+T\/sOTPd4cd2owOgAAAAASUVORK5CYII=",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/bean_gas-1334602489.swf",
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
	"bean",
	"croppery_gardening_supplies"
];
itemDef.keys_in_location = {
	"p"	: "pickup"
};
itemDef.keys_in_pack = {
	"r"	: "drop",
	"g"	: "give",
	"n"	: "plant"
};

log.info("bean_gas.js LOADED");

// generated ok 2012-12-03 17:58:03 by martlume
