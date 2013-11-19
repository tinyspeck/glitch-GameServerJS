//#include include/takeable.js

var label = "Guano";
var version = "1347912404";
var name_single = "Guano";
var name_plural = "Guano";
var article = "a";
var description = "An unobtrusive pellet from the back end of a <a href=\"\/items\/448\/\" glitch=\"item|npc_batterfly\">Batterfly<\/a>, Guano can be used as a fertilizer to boost the growth of Crops and Herbs, as an ingredient for <b>Potions<\/b>, or in the street-building trade.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 40;
var base_cost = 20;
var input_for = [225,236,245,247,248,313];
var parent_classes = ["guano", "takeable"];
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
	return out;
}

var tags = [
	"no_rube",
	"basic_resource"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-14,"y":-17,"w":27,"h":17},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAEmElEQVR42u2Xa1IbVxCFtYP8TsVB\nQgI0ktBbIFsPBiEJI6xHEkjsOIklwKZccSp2pVKp\/ArZAUvwEryEWYKWoCWwhJv7XdTD1QTIC7vy\nY25Vl4Z59bmnT58eIpFwhStc4QrXv1pHtcJoUi+dTxpF7+X2hveqVTVx0ix7nJs0Cq+PG8X8hwfW\nLLrPtyoX37eq6pdeU\/26v6V+ftjwj4mfduvq1N1QR42SmtSLU575YAAnjdIZif9OjOtF9Xgjo74o\nJdVhJT16r8BOasUoZRvXC96393Mm+U3ADssp9WQzo55Ws4p7h\/kV4uLxZub9lBwtaV1dfPcgbxgZ\n6IT8PqsVDAiO5W8Ach\/ADsqOAftlJW2e+ay4ph7l4ud3DvCFW5keN8smKQlJtp9NqH4uYY5vCpij\nvEPr3KMckRjfGbjTrfIY0f\/YeWAYkkR763H1MLO8EID+urruswxjHAvA\/WxctVMx1VuPzzrx+Ed3\nAvBNpzb7fdRWunNN+WCEZACxy0mwAQGIBvmbMmvG1G46pnacqImuPh5kV9w7sZQf2vcVgX283N40\noNDUqLDqa48ASLDE3Mf9wqiwrhl8958ZxITHtcJUOlNAEsImDIkuYVbYtYMmss\/38yteP7dyRgyy\niQXrgVWil425Leeee6vXoTkSS2dKYMBcI\/gbgJQZRtEcz6A5YVQaCZAwKU0mTcR9wQrwzKUclt76\nHkfYRsxkwOt4MSB4iehOTFh0xnVpiMFCxyZUJxVVX22k\/eeQyYutsu+jVIaKBCUimjWAeOi4UZrp\nsTQTVjhHUCKbAX55OefRGOcAJw1CcI+AsxtDNCkBMBrwta6GdLrWpw+u5US9iB7uRlfMVhKLnkiE\n90lTiPcFfQ5w9jnKQwCok7qM9hwk15GDAMS+qBS5aB6zmWT0XSv56Wgn9bGpaOSwkpqxe8AJzfgV\nSQAKUwSMkAhWSG7736iwtpBYxp0NvD0HSHVsmRyUHJ9lw1oyetFa++RqJPYzy3mdfCZilt3yiy0E\n2QGQMEP0NKu6242Wfhu0zC\/Jh4HneB9sB+c21eE6uSQ3LPoA8SO9e++ppnk3vbywGwBIKV\/tVI24\nxZQlbD2hWX5pHntj6OrzYvLaDwzKK\/fZZb7ynlzi7VGjaHZOt3Utx0eswgDgYcsWOlYj3sg3IX+f\nuhV10iyZ4L3IR8ov1mSDG17TuQse2HVirujN7iQoP7B0JLvjXLATEbsAteNNt+Y3GhugY2HZ1rs9\n230dBk16J7l0jvgpKYJH4OyaFw0tHcGu7Wk0z14m7tsJXyps4HBuP4QtA4Ly26zhDPac\/lOJZYGa\niwAQf4KZ4PgigZ1Q\/E9GnYT9fSjBtLF1CSELwOax7Sxd\/znGBVj6Zm7UlEjGmDRLMKmtp2Dp8Tg2\nyns4F5zT5vPLthgnOsMDb\/1IMEwmo9N+btUvEaWWz6nr\/u9AT4BHGsEulwj6Yn8+afA9Zu6tHwc3\nAtUPUgYx42AM8qumu9vOlXlTOpghds00iU67qZi3t77s9eah7\/PaWmc3lvKfLEYOL9Jgz\/4yGFN6\nfhKXx\/fcSLjCFa5w\/b\/XH32vkanlHADNAAAAAElFTkSuQmCC",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2010-04\/1271088616-9320.swf",
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
	"no_rube",
	"basic_resource"
];
itemDef.keys_in_location = {
	"p"	: "pickup"
};
itemDef.keys_in_pack = {
	"r"	: "drop",
	"g"	: "give"
};

log.info("guano.js LOADED");

// generated ok 2012-09-17 13:06:44 by martlume
