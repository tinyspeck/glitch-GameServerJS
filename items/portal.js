var label = "Hyperspacetime Portal Door";
var version = "1347943727";
var name_single = "Hyperspacetime Portal Door";
var name_plural = "Hyperspacetime Portal Doors";
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
var parent_classes = ["portal"];
var has_instance_props = true;

var classProps = {
};

function initInstanceProps(){
	this.instanceProps = {};
	this.instanceProps.target_tsid = "";	// defined by portal
	this.instanceProps.target_x = "0";	// defined by portal
	this.instanceProps.target_y = "0";	// defined by portal
}

var instancePropsDef = {
	target_tsid : ["TSID of the target location"],
	target_x : ["x of the target location"],
	target_y : ["y of the target location"],
};

var instancePropsChoices = {
	target_tsid : [""],
	target_x : [""],
	target_y : [""],
};

var verbs = {};

verbs.enter = { // defined by portal
	"name"				: "enter",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 50,
	"tooltip"			: "Enter the portal",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (!this.getInstanceProp('target_tsid')) return {state:'disabled', reason:'This portal\'s destination has yet to be created.'};

		return {state:'enabled'};
	},
	"handler"			: function(pc, msg, suppress_activity){

		this.openDoor(pc);
	}
};

function closeDoor(){ // defined by portal
	this.is_open = false;
	this.setAndBroadcastState('closing');
	this.apiSetTimer('doorClosed', 0.3*1000);
}

function doorClosed(){ // defined by portal
	this.setAndBroadcastState('closed');
}

function doorOpened(pc){ // defined by portal
	if (!this.is_open){
		this.setAndBroadcastState('open');
	}
	pc.teleportToLocation(this.instanceProps.target_tsid ? this.instanceProps.target_tsid : this.container.tsid, intval(this.instanceProps.target_x), intval(this.instanceProps.target_y));

	this.is_open = true;

	this.apiCancelTimer('closeDoor');
	this.apiSetTimer('closeDoor', 2000);
}

function getCreationTime(){ // defined by portal
	return this.ts;
}

function initPortal(){ // defined by portal
	this.is_open = false;

	var portal_group = apiFindObject(config.portal_group);
	if (!portal_group){
		log.error('Could not find portal_group');
		return;
	}

	var location = this.getLocation();
	var coords = this.getCoordinates();

	if (location.jobs_is_street_locked()){
		// Do not init portal at this location.
		return;
	}

	var ret = portal_group.set_active_portal(this, location.tsid, coords['x'], coords['y']);
	if (ret){
		this.setInstanceProp('target_tsid', ret.location);
		this.setInstanceProp('target_x', ret.x);
		this.setInstanceProp('target_y', ret.y);
	}
}

function onCreate(){ // defined by portal
	this.initInstanceProps();
	this.apiSetTimer('initPortal', 500);
}

function openDoor(pc){ // defined by portal
	if (!this.is_open){
		this.setAndBroadcastState('opening');
		this.apiSetTimerX('doorOpened', 0.3*1000, pc);
	}else{
		pc.teleportToLocation(this.instanceProps.target_tsid ? this.instanceProps.target_tsid : this.container.tsid, intval(this.instanceProps.target_x), intval(this.instanceProps.target_y));

		this.apiCancelTimer('closeDoor');
		this.apiSetTimer('closeDoor', 2000);
	}
}

function updatePortalData(location, x, y){ // defined by portal
	var portal_group = apiFindObject(config.portal_group);
	if (!portal_group){
		log.error('Could not find portal_group');
		return;
	}

	this.setInstanceProp('target_tsid', location);
	this.setInstanceProp('target_x', x);
	this.setInstanceProp('target_y', y);
}

function getDescExtras(pc){
	var out = [];
	return out;
}

var tags = [
	"no_rube",
	"no_trade"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-74,"y":-170,"w":147,"h":171},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAE5ElEQVR42u1XeUxTdxwXBA\/ccDjk\nqOWwBhYVmdOIqCw6k6lZMo1zZsuc54zZ3NhEGY5DOjUcyl2ovQsr1Gq1rS0dSGBjOiebohui2ZzI\nUUCrUCZHOV6Zn\/1+oybLsv1nS0z6ST55zXsv7336+Z5vwgQXXHDBhWcDtaj1UOPmJEoe7kweIyaP\nryrAbTMwkYpSos1HjZYADVoDywY72CqYWIr+Jj8+Hj7HBTzGRR+3ttajGC0vaNHkdxZtHDXaF+jQ\ntlgNU5QGnYvUI23zytDBpvfUOlMkiHPEFXcR6r2UMHPOEWGKa\/LV0sui98QXBTvEl4s\/VPxe+ZbO\n1r5KC1OEcqiNU4Y73tRtp4VWAUxTW9tnyS4VvCYSvnFcemyhUZ4T9YM4Z8WPwqwVV4syoytyJbsy\nztnurdUwrYs0Q\/dCsmCe5jSRJ\/DIR3m7PEqQGSURJM16ID0S9qckfyVkRWshyo5B4aG5TO4Xc9py\n5J+kV9jMq\/V4EHkSnb57AE\/H5h0JrRqYqhrsDFJWpW4RfBnWKOGG4gR\/IxTXjTD8YkSZNhl83nrw\nufMeH94\/t95o61xfaXsYox7ueknaixncFkyhUXBYeA2AlwY9IcWSDTmJu4O7jx6Yj3zFAXzfZYZ5\naAB1jVWQnooDLy3qcVosq1dWLcysGO3eeHbkQWQZ4L1Z7agwjxWHhxS9M4wwR5xIW6RL3T1zNI8b\nCZ78I1xu+Q3W4UHcaPoJck0yCjJXoiCBPZyWv6W0avT+2wZbT0yptSvwWBeeX+WIqqbhpc1XBSvL\nYOuLkWUvrRYn+kGeFg6peBOUFXmovqKB7lsh8oQ7UczbgMKD7JHD6RtVX9uaX9eOmCKMJHfpcxxi\nIK1A8nAyLYiDI+YIcfoCo\/yQPxSHWZBlvgyRYAOkJTtRxH8HcXuWoODIJuTHs5mMnG3lNUz3dj1j\njjaQQnFM\/tnDm0Xai2TQwtYwvdHionUKfiKrryTVH7KUQIhSgiBICUVW3GwkbA\/GZ9siyW\/2UKEu\nI\/s8TK\/q8MdCkoMhfGBsujxtoU8c5Fks3rT5lhQty8s7EGjJ2ceCICEA4iR\/wgDwPw9A6i4fZOz1\nxdGP\/QcLtcfTqkYt72pHeiLUZPSRLjDRof2Q5lAFmQxnStbExW7lmOK3ssE\/yIYslQ0JcVGYyEbu\n\/gDkJ3CQ+MHM\/tOtde\/rmKbFp4a7wgX98OOOOeju0H4oQqcXT5a0o1RZcOPilUsDF35ttOp\/vm49\nc7XOqvqm0qqq1FmFvH0De3dGd1aheamG6V5i6Ovz5d7EpFWOCO+\/Qdepk7cuzS+9oNt0ur7mU03D\nd0mahvPx2oaaZP2ti+m6G7Upp6\/VJGVXntqtxd1wMkn8ReiZ7nDn\/pmP9IUqq4mlZx6+okXHsnNM\n63KDzbRGP9yyrtxmfrOcaSZbjSVah\/uh9A89KTanLQzUjSw0TPsKPcGqoZbQcjSF6ZlWIrYp4gxj\nWV6FxiA1uaZF34sTnOXcfxUMbRt0Ma3G3el0aT2J275KPOIoyPZCG3ss3ayd5tz\/iBw7ct3p6l+P\nes+\/QzperrngggsuuPBsgi6g9ENoEiFdDDzt58YNdIxNIfQm9CUMJAwmnE3IIQyxn5tJOJ1wqrMF\nu9tf6kPoT8i2CwsjDCecQxhEGGC\/h7rqNt5hdrPT\/WmJ+QtvGvxmwOAdfAAAAABJRU5ErkJggg==\n",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2011-11\/portal-1322264063.swf",
	admin_props	: true,
	obey_physics	: false,
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
	"no_rube",
	"no_trade"
];
itemDef.keys_in_location = {
	"e"	: "enter"
};
itemDef.keys_in_pack = {};

log.info("portal.js LOADED");

// generated ok 2012-09-17 21:48:47 by mygrant
