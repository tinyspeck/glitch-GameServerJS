var label = "Ok Trophy Case";
var version = "1323300768";
var name_single = "Ok Trophy Case";
var name_plural = "Ok Trophy Case";
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
var parent_classes = ["bag_trophycase_ok", "bag_trophycase_base"];
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
	"ok",
	"no_trade"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-142,"y":-125,"w":287,"h":125},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAABfUlEQVR42u3Sy0oCcRTHcd\/AR\/Ah\n2kU562pRUquQNLFxjIqMilr9W0eQoWHWIirtgompjVO0kFxIihl0FzMz8Z7NI5ycGZzo8gBS5wuf\nzVn9FkehwDAMw7D\/ER8yU3WOIXWWFtWagjSpiIyk5P9U8DUZSF7gNZBck8dAsh69KCM4kKQFe0Oi\nlMA9RB5kWnK3I7l3DarkYXBGK3mO2XznGKiHGlgTvDXUjk1QPaahGqShEqChHBiBkl9SPDJCYxxU\nz+ZFlYby6RwUT2ahwM1AgZ2GPDsFr0EL5AKT8OKfgKxvHJ59Y5DxjsLToRnSHgZSBzQ87o\/Aw54R\n7ncNcOcehluXHq63dfzNlpaIA8+XenRJRx8ftWmySedAOLkmufyhP5xw\/C4uWP0qtqr5ZJdcfGfT\nhKOyPlnE2nsVXemGyGIXJY6MWanwxlQHaZV3W7d0UvEVCuRDzKpeDi6oW2ugVb0pH5L2dpWgVQYm\nnG3KVtqDYRiGYRiGYRiG\/dk+ADI6QaIj20xDAAAAAElFTkSuQmCC",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2010-08\/1282093946-5465.swf",
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
	"ok",
	"no_trade"
];
itemDef.keys_in_location = {
	"o"	: "open"
};
itemDef.keys_in_pack = {};

log.info("bag_trophycase_ok.js LOADED");

// generated ok 2011-12-07 15:32:48 by lizg
