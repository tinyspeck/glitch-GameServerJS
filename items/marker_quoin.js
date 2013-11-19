var label = "Quoin Marker";
var version = "1348272510";
var name_single = "Quoin Marker";
var name_plural = "Quoin Markers";
var article = "a";
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
var parent_classes = ["marker_quoin"];
var has_instance_props = true;

var classProps = {
};

function initInstanceProps(){
	this.instanceProps = {};
	this.instanceProps.type = "xp";	// defined by marker_quoin
	this.instanceProps.owner = "";	// defined by marker_quoin
	this.instanceProps.quoin = "";	// defined by marker_quoin
}

var instancePropsDef = {
	type : ["Type of quoin this generates"],
	owner : ["tsid of the player this belongs to"],
	quoin : ["tsid of the quoin that belongs to this marker"],
};

var instancePropsChoices = {
	type : [""],
	owner : [""],
	quoin : [""],
};

var verbs = {};

verbs.place = { // defined by marker_quoin
	"name"				: "place",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_single"			: 1,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 50,
	"tooltip"			: "Place your marker here",
	"is_drop_target"		: false,
	"handler"			: function(pc, msg, suppress_activity){

		pc.prompts_add({
			title			: 'Please Confirm!',
			txt			: "You are about to place your Quoin here. Once placed, it will not be able to be picked up again. It will stay here until its uses are exhausted. Are you sure?",
			is_modal		: true,
			icon_buttons	: true,
			choices		: [
				{ value : 'ok', label : 'Yes' },
				{ value : 'cancel', label : 'No' }
			],
			callback	: 'prompts_itemstack_modal_callback',
			itemstack_tsid		: this.tsid
		});

		return true;
	}
};

function make_config(){ // defined by marker_quoin
	return {
		owner: this.getInstanceProp('owner')
	};
}

function modal_callback(pc, value, details){ // defined by marker_quoin
	log.info(this+" modal call back for "+pc+": "+value);

	if (value == 'ok'){
		pc.location.apiPutItemIntoPosition(this, pc.x, pc.y-150, false);
		this.only_visible_to = pc.tsid;
		// onContainerChanged spawns us a quoin
	}
}

function onContainerChanged(oldContainer, newContainer){ // defined by marker_quoin
	if (newContainer && (newContainer.is_player || newContainer.is_bag)){
		var player = this.getRootContainer();
		if (player && player.is_player){
			this.setInstanceProp('owner', player.tsid);
		}
	}
	else if (newContainer && newContainer.hubid){
		var quoin = newContainer.createItemStack('quoin', 1, this.x, this.y);
		if (quoin){
			var type = this.getInstanceProp('type');

			this.setInstanceProp('quoin', quoin.tsid);
			quoin.setInstanceProp('owner', this.getInstanceProp('owner'));
			quoin.setInstanceProp('marker', this.tsid);
			quoin.setInstanceProp('type', type);
			quoin.setInstanceProp('class_name', 'fast tiny '+type);

			// TODO: Set uses_remaining
			var uses = 1;
			quoin.setInstanceProp('uses_remaining', uses);
		}
	}
}

function onModify(){ // defined by marker_quoin
	if (!this.container.hubid) return;

	var quoin = this.container.apiLockStack(this.getInstanceProp('quoin'));
	if (quoin){
		quoin.apiSetXY(this.x, this.y);
	}
}

function onCreate(){ // needed for initializing props
	this.initInstanceProps();
}

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
		'position': {"x":0,"y":0,"w":40,"h":40},
		'thumb': null,
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/missing.swf",
	admin_props	: true,
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
	"no_rube",
	"no_trade",
	"no_auction"
];
itemDef.keys_in_location = {};
itemDef.keys_in_pack = {
	"c"	: "place"
};

log.info("marker_quoin.js LOADED");

// generated ok 2012-09-21 17:08:30 by mygrant
