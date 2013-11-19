var label = "Treehouse Trophy Case";
var version = "1323300768";
var name_single = "Treehouse Trophy Case";
var name_plural = "Treehouse Trophy Cases";
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
var parent_classes = ["bag_trophycase_treehouse", "bag_trophycase_base"];
var has_instance_props = false;

var classProps = {
	"width"	: "5",	// defined by bag_trophycase_base
	"height"	: "1"	// defined by bag_trophycase_base
};

var instancePropsDef = {};

var verbs = {};

verbs.open = { // defined by bag_trophycase_base
	"name"				: "open",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 50,
	"tooltip"			: "Arrange your trophies",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (!this.isOwner(pc)) return {state:null};
		return {state:'enabled'};
	},
	"handler"			: function(pc, msg, suppress_activity){

		if (!this.isOwner(pc)) return false;

		var trophy_container = pc.trophies_find_container();
		pc.apiSendMsgAsIs({
			type: "trophy_start",
			itemstack_tsid: this.tsid, // the tsid of the cabinet that was opened
			display_cols: intval(this.classProps.width),
			display_rows: intval(this.classProps.height),
			display_itemstacks: make_bag(this),
			private_tsid: trophy_container.tsid,
			private_cols: 7,
			private_rows: 10,
			private_itemstacks: make_bag(trophy_container),
		});

		return true;
	}
};

function canContain(stack){ // defined by bag_trophycase_base
	if (stack.getProp('is_trophy')) return stack.getProp('count');
	return 0;
}

function isOwner(pc){ // defined by bag_trophycase_base
	if (!this.container.owner) return true;

	return this.container.owner.tsid == pc.tsid ? true : false;
}

function onLoad(){ // defined by bag_trophycase_base
	if (this.label != this.name_single) this.label = this.name_single;
}

function onPrototypeChanged(){ // defined by bag_trophycase_base
	this.onLoad();
}

// global block from bag_trophycase_base
var is_trophycase = 1;
var is_public = 1;
var capacity = this.classProps.width * this.classProps.height;

function getDescExtras(pc){
	var out = [];
	return out;
}

var tags = [
	"house",
	"treehouse",
	"trophycase",
	"no_trade"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-154,"y":-131,"w":303,"h":132},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAC\/0lEQVR42mNgGAWjYBSMglEwCoY\/\nWDsnWX7Hiqz86T3B+9fMSQbjuf1R9Qsnx9RvXJhWP7M3on5yewjReOn0hP3Y8PyJMftn9ETun90f\njSI+d0L0\/M4av\/repqD5y2ck7F83L8V\/1cxQfrDj5k2M8wdK3C8psPs\/vSf8\/5wJUf876\/z\/9zYG\n\/u+uD\/jfWO79v6nC5399qdf\/lirf\/90NAWDcXuv3v6PWH6gmEKg+AKwHxK8t8fzfA9Q7qT30\/7yJ\n0f\/n9Ef9n9YV\/n9KR+h\/oEf\/zwWaP6sv8v\/0bqBYZ9j\/Ca0h\/zuB9vS3hPwvyXH+31jh+b+q1OF\/\neYn9+W2rMu0Zmiq8\/7fV+v7Pz7EBWwqyoCLfDSjm97+tBoFB6kCOrS5y\/19Z4AZ3eDfQMX3NQUCL\ngv8DPfq\/C2gZyCPVRR5gDGJ3AT3U2xQIdEQwmN1U6QN0iDfYnjqgffXlHv+rilzB5oA8V5zt\/D8v\nzQFEv2eICzf3L8p0OO\/hovbf2lzhiYykwBZZKYGNctKCy5XkRZbqaElsUVcWWwrDykoicLaCrPBS\nkBoQW0NVfKm2huRSLXVxsLi8jCAYg9jo+pHF1dSE98DkHG1UD0cGGf73dtX6Hxlk1J8UZZkMjmZQ\nfNcWO74vSrf9LyctsAsoNBmIq4A4n5uXpQtEUxOzsTFVwNgy8txzYGwfD7WTJZl2\/61M5TcD+Vwo\nGaWu2GFKeY7Df6DvtgK5NUAcKSvP1QSkvaiNJaS4smFsOQXuchAtKsGR4O2hdj82xPC\/rCzPFKCY\nAIoDa0sd7SMC9barKInUAbmeQKyuosUXzS\/CagRkq1IbK6jwOGjrCfoii5lbiC821pfqUFLhKwDy\nmTGKGxcXGYcATx1lIJMRhC0dxAJgbFpgBwcBAWR+gKuWgbWjRJOZnbgi1vLQ0VPC3slLUh7EBtGO\nbtL69CyPibLT3VfWH6zQh76OAwcQ0HEEHejiIsjv6StjPxA1GshuEB6t20fBKBgFo2AUjIJRMApG\nwSigFgAAXf6CLYgr5SsAAAAASUVORK5CYII=",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2010-11\/1288631694-3921.swf",
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
	"house",
	"treehouse",
	"trophycase",
	"no_trade"
];
itemDef.keys_in_location = {
	"o"	: "open"
};
itemDef.keys_in_pack = {};

log.info("bag_trophycase_treehouse.js LOADED");

// generated ok 2011-12-07 15:32:48 by lizg
