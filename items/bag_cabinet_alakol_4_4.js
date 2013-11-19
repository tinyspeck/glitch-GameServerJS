var label = "Elegant 4x8 Cabinet";
var version = "1351897052";
var name_single = "Elegant 4x8 Cabinet";
var name_plural = "Elegant 4x8 Cabinet";
var article = "an";
var description = "";
var is_hidden = false;
var has_info = false;
var has_infopage = false;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 0;
var input_for = [];
var parent_classes = ["bag_cabinet_alakol_4_4", "bag_cabinet_base"];
var has_instance_props = false;

var classProps = {
	"style"	: "crap",	// defined by bag_cabinet_base
	"width"	: "4",	// defined by bag_cabinet_base (overridden by bag_cabinet_alakol_4_4)
	"height"	: "8",	// defined by bag_cabinet_base (overridden by bag_cabinet_alakol_4_4)
	"rows_display"	: "4"	// defined by bag_cabinet_base (overridden by bag_cabinet_alakol_4_4)
};

var instancePropsDef = {};

var verbs = {};

verbs.open = { // defined by bag_cabinet_base
	"name"				: "open",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 50,
	"tooltip"			: "Inspect your storage",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (!this.isOwner(pc)) return {state:null};
		return {state:'enabled'};
	},
	"handler"			: function(pc, msg, suppress_activity){

		if (!this.isOwner(pc)){
			log.error(this+" not owner and has no key. Bailing.");
			return false;
		}

		if (this.capacity != (intval(this.classProps.width) * intval(this.classProps.height))){
			log.error(this+" capacity mismatch. Deleting.");
			delete this.capacity;
		}

		if (this.capacity != (intval(this.classProps.width) * intval(this.classProps.height))){
			log.error(this+" capacity mismatch. Bailing.");
			return false;
		}

		pc.apiSendMsgAsIs({
			type: "cabinet_start",
			itemstack_tsid: this.tsid, // the tsid of the cabinet that was opened
			cols: intval(this.classProps.width),
			rows: intval(this.classProps.height),
			rows_display: intval(this.classProps.rows_display),
			itemstacks: make_bag(this),
		});

		return true;
	}
};

// global block from bag_cabinet_alakol_4_4
var capacity = 32;

function canContain(stack){ // defined by bag_cabinet_base
	if (stack.class_id == 'contraband') return 0;
	if (stack.getProp('is_element')) return 0;
	if (stack.getProp('is_trophy')) return 0;
	if (!stack.is_takeable || !stack.is_takeable()) return 0;
	if (stack.hasTag('no_bag')) return 0;
	return stack.getProp('count');
}

function isOwner(pc){ // defined by bag_cabinet_base
	if (!this.container.owner) return true;

	var is_owner = this.container.owner.tsid == pc.tsid ? true : false;

	if (is_owner) return true;

	return this.container.acl_keys_player_has_key(pc);
}

function onCreate(){ // defined by bag_cabinet_base
	this.capacity = intval(this.classProps.width) * intval(this.classProps.height);
	this.is_pack = false;
	this.is_cabinet = true;
}

function onLoad(){ // defined by bag_cabinet_base
	if (this.label != this.name_single) this.label = this.name_single;
}

function onPrototypeChanged(){ // defined by bag_cabinet_base
	this.onLoad();
}

function getDescExtras(pc){
	var out = [];
	return out;
}

var tags = [
	"cabinet",
	"alakol",
	"no_trade"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-102,"y":-253,"w":211,"h":252},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAADCElEQVR42q3VSU9aURjGcb\/ZWXVh\nGpLSaBNaWRjLwqQ2ISkLmmBjB6xIcSyKiiMKWOtQ61hHEMsMFxCc57Yf4+m5t4vaxbnJvW9J\/tE3\nIU9+wcitqrrzMlTfY+FQPyi9tD8HdaNK9JKByfgyKLW3OUDdEAMNHJhYASW3qxnUDSHQyIGp5Coo\nfXC\/AnVDBVjN0sk1UPK4W0DdEAON1SyTWgelTs9rUDeEwFqjgWXS30Cps+MNqBtiYK2BZTMboNTd\n+RbUDSHQxIE5\/gZKPV3vQN0QA01Gls9uglJvjxPUDVWglNsCJW9vK6gbQqBZBua3Qcn7sQ3UDTHQ\nXMsK+R1Q6ve6QN0QAus5sCjtgpKvrx3UDTGwngMLEVAa8LlB3VABmlipEAWlQZ8H1A0h0MKBB8Uo\nKA0NekDdEAMtJlYu7YHS8FAHqBsqQDOrHMRAacTfBeqGENjYKAP3QWl0uBvUDRVgPTssf4fWilIE\nifia8vvYaI\/yMxZdgp4tOSGwiQOPKnFoLZPahJSNKP+B42O9\/Hm6w4Er2NqYhZ49MbCpnh0fJqA1\nKbeLq3MJ25vzCIx7lfuwnMDC3Dj07KkALSTgsL8bgYm\/wH7+VPmvQKvVwk6OktCalIsoQNuLZ5gK\n9Cm3DJRvPXuqwNPjFLRWyP8BmuseITjlU24Z+LShDnr2hECbtZGdHaehtWI+qgAfPriP0NSAcstA\nc10N9OyJgTYOPMlAa0VpTwE+eVyDcGhQuWVgA\/8E9eypAs9Ps9BaqRBTgK1OB6bDQ8otA9+3NkPP\nnhBotzexi7MctFY5iPPvvl1Mh\/yYmfbz77Ik0qktBCcHoGdPFXh5loee4rF1ZNPb+PxpRLn3o6vK\nrWdLCHTIwHP+Jp3Jf57ZmZF\/bj07YqDDyq4uJFCamx0DdUMVeH1RAKV5\/nijbgiBLS02dnNZBKUv\n8xOgbqgCb69KoLS4EAB1Qwh0Ojnw+gCUvi5OgrqhArSzH9dlUFpaDIK6oQr8eVMGpeWlIKgbQqDL\nZWe\/biugtLocBnXjruk32xLIi24qaNAAAAAASUVORK5CYII=",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2011-06\/bag_cabinet_alakol_4_4-1306970538.swf",
	admin_props	: false,
	obey_physics	: false,
	in_background	: true,
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
	"cabinet",
	"alakol",
	"no_trade"
];
itemDef.keys_in_location = {
	"o"	: "open"
};
itemDef.keys_in_pack = {};

log.info("bag_cabinet_alakol_4_4.js LOADED");

// generated ok 2012-11-02 15:57:32 by tim
