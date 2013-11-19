var label = "Door";
var version = "1343671349";
var name_single = "Door";
var name_plural = "Door";
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
var parent_classes = ["newxp_door"];
var has_instance_props = true;

var classProps = {
};

function initInstanceProps(){
	this.instanceProps = {};
	this.instanceProps.target_tsid = "LIFD0KCDEJ53L7K";	// defined by newxp_door
	this.instanceProps.target_x = "-2769";	// defined by newxp_door
	this.instanceProps.target_y = "-2000";	// defined by newxp_door
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

verbs.open = { // defined by newxp_door
	"name"				: "open",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 50,
	"tooltip"			: "Open Door",
	"is_drop_target"		: false,
	"handler"			: function(pc, msg, suppress_activity){

		this.setAndBroadcastState('opening');

		pc.sendActivity('The door draws you in …', null, false, true);

		this.apiSetTimerX('setAndBroadcastState', 0.3*1000, 'open');
		this.apiSetTimerX('teleportPlayer', 1.0*1000, pc);
	}
};

function teleportPlayer(pc){ // defined by newxp_door
	delete pc.newxp_step;
	pc.teleportToLocation(this.instanceProps.target_tsid, intval(this.instanceProps.target_x), intval(this.instanceProps.target_y));
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
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-06\/newxp_door-1340043779.swf",
	admin_props	: true,
	obey_physics	: false,
	in_background	: false,
	in_foreground	: false,
	has_status	: false,
	not_selectable	: false,
};

itemDef.oneclick_verb	= { // defined by newxp_door
	"id"				: "open",
	"label"				: "open",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 50,
	"tooltip"			: "Open Door",
	"is_drop_target"		: false,
};

;
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
itemDef.keys_in_location = {
	"o"	: "open"
};
itemDef.keys_in_pack = {};

log.info("newxp_door.js LOADED");

// generated ok 2012-07-30 11:02:29 by mygrant
