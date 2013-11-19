var label = "Swoonerfly";
var version = "1308247240";
var name_single = "Swoonerfly";
var name_plural = "Swoonerflies";
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
var parent_classes = ["npc_swoonerfly"];
var has_instance_props = true;

var classProps = {
};

function initInstanceProps(){
	this.instanceProps = {};
	this.instanceProps.y_destination = "0";	// defined by npc_swoonerfly
}

var instancePropsDef = {
	y_destination : ["Y position to fall to."],
};

var instancePropsChoices = {
	y_destination : [""],
};

var verbs = {};

function fall(){ // defined by npc_swoonerfly
	if(!this.container) {
		this.apiSetTimer('fall', 250);
	}

	this.apiMoveToXY(this.x, this.getProp('y_destination'), 400, 'land');
}

function land(){ // defined by npc_swoonerfly
	// do a wait to let the client catch up
	if(this.overlayState) {
		this.container.apiSendAnnouncement({
			type: 'itemstack_overlay',
			itemstack_tsid: this.tsid,
			delay_ms: 0,
			duration: 3000,
			delta_x: 0,
			delta_y: 20,
			swf_url: overlay_key_to_url('rooked'),
			uid: this.tsid+'_rooked_all'
		});
		log.info("Broadcasting message to "+this.container);
		this.overlayState = 0;
	} else {
		this.overlayState = 1;
		this.apiSetTimer('land', 500);
	}
}

function onCreate(){ // defined by npc_swoonerfly
	this.initInstanceProps();
	this.setAndBroadcastState('fly-rooked');
}

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
		'position': {"x":-24,"y":-46,"w":50,"h":47},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAAHElEQVR42u3BAQEAAACCIP+vbkhA\nAQAAAAAAfBoZKAABfmfvpAAAAABJRU5ErkJggg==",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2011-05\/npc_swoonerfly-1305238807.swf",
	admin_props	: true,
	obey_physics	: false,
	in_background	: false,
	in_foreground	: false,
	has_status	: false,
	not_selectable	: true,
};

if (this.consumable_label_single) itemDef.consumable_label_single = this.consumable_label_single;
if (this.consumable_label_plural) itemDef.consumable_label_plural = this.consumable_label_plural;

itemDef.verbs = {
};
itemDef.hasConditionalVerbs = 0;
itemDef.emote_verbs = {
};
itemDef.hasConditionalEmoteVerbs = 0;
itemDef.tags = [
	"no_trade"
];
itemDef.keys_in_location = {};
itemDef.keys_in_pack = {};

log.info("npc_swoonerfly.js LOADED");

// generated ok 2011-06-16 11:00:40
