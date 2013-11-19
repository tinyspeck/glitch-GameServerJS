var label = "Bottletree Trophy Case";
var version = "1323300768";
var name_single = "Bottletree Trophy Case";
var name_plural = "Bottletree Trophy Cases";
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
var parent_classes = ["bag_trophycase_bottletree", "bag_trophycase_base"];
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
	"trophycase",
	"bottletree",
	"no_trade"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-144,"y":-132,"w":292,"h":132},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAACeUlEQVR42u2US0wTURSG0cSFCxOI\nihRoCwXbNC0d+nCm0xeNCJbyakWo1NJaoFgepZZHC6IUMERiUMAHoQQT0ATi1pULk65NTFy4cDlL\nXLlz4+b3dggmBmN0YRfmfsmXc8+dufecyczcggIKhUKhUCiH7AxHlKKRn+NmJCi60Mvy82F93d1w\nTd1hXOv1an+sO2Lw9B8XXwzYJSm\/bnAqoM3eCeo+p\/sYLPQzWByoxVLUgOUREx7GTFiNX8CTBIun\nxPVxFhuTZmRSZmxN8dhMmrFB5jLjHDKTHDYmiGT8bIzcP8ZhNWbE8pAR9yN60XthBnM3GMz21GA2\nVANSF9MBLZJ+zbtUj2ZlwFNdJTY30+m03WxVfx1uVyHmUSHRocaET4tpP1nUo8NivwEPBk14NMxi\nZYQ0eIvD+hhpaNKC5ykrdm7b8WLGit20A7uzDryac2KPxFz+csaG7WkrtpIWZCZ48lA8HifM4j5L\npMl0iMGUT4OEV43RVhWGmpSIEnvrFQg6Fd\/EBt0mefel2rJszga9BF6LFI2G0n2SC5cNZYKL6DZK\nhWZiOycXvGa50M4exA5LpWiXVSH4bAqhSxxXCj6S52Iuv8JXCF7+4H4PsY2TCW6yZ7NRJjSRPV36\ngzr1TKlw1SqDh5eihZWSa+XZI6\/aWVv0oc9djlCzbJ\/TFL0hU\/P5UFlxarurvvRT90UJIi3laLEV\nM7\/8FlvtJXXRTgVGA+cx4pVDpyp8TaZd\/1p\/k\/RL7FoVkiEl4ters7\/9YSzqQnmbQxJv4M99LDl7\nci8fJ4STLX7vMJx526gvZP5m3THiiTydYsfzWItCoVAoFAqFQqFQ\/g++A7bJMLY0cF3HAAAAAElF\nTkSuQmCC",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2011-06\/bag_trophycase_bottletree-1308950615.swf",
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
	"trophycase",
	"bottletree",
	"no_trade"
];
itemDef.keys_in_location = {
	"o"	: "open"
};
itemDef.keys_in_pack = {};

log.info("bag_trophycase_bottletree.js LOADED");

// generated ok 2011-12-07 15:32:48 by lizg
