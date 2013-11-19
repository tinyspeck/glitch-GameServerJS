var label = "Crap 2x6 Cabinet";
var version = "1351897052";
var name_single = "Crap 2x6 Cabinet";
var name_plural = "Crap 2x6 Cabinet";
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
var parent_classes = ["bag_cabinet_crap_2_3", "bag_cabinet_base"];
var has_instance_props = false;

var classProps = {
	"style"	: "crap",	// defined by bag_cabinet_base (overridden by bag_cabinet_crap_2_3)
	"width"	: "2",	// defined by bag_cabinet_base (overridden by bag_cabinet_crap_2_3)
	"height"	: "6",	// defined by bag_cabinet_base (overridden by bag_cabinet_crap_2_3)
	"rows_display"	: "3"	// defined by bag_cabinet_base
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

// global block from bag_cabinet_crap_2_3
var capacity = 12;

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
	"crap",
	"no_trade"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-52,"y":-192,"w":104,"h":191},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAHAklEQVR42t2Yy24bVxKG\/QZZzdqv\nkF2WxmxjO7RE8U6KEiVR1sVOnGDGAYJECJLJYiYTAxmPjcTR3aLEi0haJMWLSLVI8SKSEiXZniBA\ngPgR\/Ag1\/19NCUg2GWSaWYRA4TRPV\/f5zl91qk\/3lSt\/hF9x2bnwc3MvlFc8qdKK26CVf2GHifDr\nZmpWaI3krNAH1xiFRZpLLb\/oeGAZYHnVE0w8GpZt2mO7JGHRh0Oy9a9bUt6aUitGQpJdD0ktNSO5\ntVHJrIUk+tglK\/+8KcuwpS9vyOI\/TPvu79flx9rMNUtVNKJ+OYgFpLzhhiohOd6dlnY6IJ2dUWlt\ne6QaGZL9+Jx0d8bkKOXXc62kT1o4Lm34pBr1SmHNKdFHduG9LAf8wbgt9VQIg3rlCNZOegATkOPM\nqLRTPjncssthelbhWtteExx+hD\/JhRS4mXBLed0hvNeP+xYDdgr3pf0MisEIdrobkl5uXO0IsPWt\nYalEJwHrl6O0X31bAGqnvHKan1BQXtuIu2Tp62n53mrA49y0qmMCjspZYVLVIygBqSABT0tz6B+\/\n9FMFs+OAnNS+ZtwtxadB6wG7GLQRc+igBDsvTMlJJiinDB8AO2mfnOzOy\/PKuwrSQz\/7CH+SDeo1\nCgxVj56NAXDKWsDz0uQrhofh7UGRCwXZMozHBM\/Ny1lpXgEZVvZ1ccyWPryWefi8NGU94MvytNFG\nblGZLkObx0rOArA4qSpxoXRzCG8ujFTwalg7\/Zw9QZ42405TQfj+pzI9CMApo8PFAcWoRDvN1RlU\nIyihqOB5+Y4C95CbrYQT7bhOhsfdfphflsPWAyIsBhP+GMoQsJMCRG4MSplqUqUuAE+Ls5pnx8i7\ndtqrE2DbiNkVkOXmxV7Y+jpIQIb4GAuDCmn+Ic+4AJiHWnbys3K+d0dMv9H+4vGrUUH2MeSDAnzd\nTHg0RI3oiK7gkwxKCdTpMLz4\/9K4J73CrEJoXnIiUPtsd+LSh\/AvSoMB1NAx+RtRO1ZyUOFMQI+W\nGwKele6YgCzM6Od5+tLOUAtb2+YqHghgbXNYB2A+9ZBbHcL184vhI+Dz\/feQf2NaVtqap6Yfc5Wp\n0BwU4HkRgJFhVbEOBZl7LMQEOcKgfFK8AOB55T0U7AlNhbaWm6CeZ0sfPgJ5r58ac1ctBeTs6zGn\nho+A5goOXkJw8LO9eVWwuxPsbyK8lxNhq7DY4fBelm9aedMWirE+qrZdukm4WKlse1CNWzAqyN2M\n1kpdGKMKaD7q+Cx2DQaQCtVjLuSbU58aR\/3dCVuG8ySHlZpBCHf4zHZdbhZo9LncLCS8emw5YA83\nbWAnUofpVgqD1lFujgibHpXazl2pbwekFnVJNT2PTa25maXRhy2vayLEvUEBdlFiCEgVCcgtVkfV\nC0nka5ukvsWmNeaR2GMHXg1sCsYnR5fFXScSUBsIIFdmJzMmh1EntvfDulsmIFVh8W0i79rPgtLY\n9us2n1t\/9rM0tfsbVd1tw3gvywGPc6FT7uPqyKF61ByMTxa+d7TTWKnIPZ6vQUH1ifGcH74O9a3H\n3JiET88xX60HzE4YzSRybcupA3UzIfOlSCFcujiayLuDiMP0SfpNIJ7DBC7gqPCAAMcN5tfBpkOq\nWw6EbUwHPYQy1ciIqV7cay4UtIc8BhBhGwkfwEf02mZ6DE+akPWAHQAaUOcg6ha2rX64qxj0gIpR\npTRKEVQ+jPvlMOE3QRluqLa38o5eW42iLA0KsPLUjkE8CliL+xSAx+yvJ4OAnkYO+hWwGvOJseWW\n\/Y0RaaSC8HPB3y+VdftgAJFjhrHpgloehaRVEXIC5J+8DZWCOAcggFz4GZtu9SPYfsSp\/ytPR7ig\nXlsOWEvPG3vrToQsoCooAAZlm1+8rv37EbyYb7hkb80uZYDwa8LBJlV0ooD78NLO67xSjs4Y1n9A\n2v7kQW4J776AqFyogYGpWGl1SGqJgMIVVuxSXLUD2ob\/mAAgCVyNB+AHQKRAevWe9YD5+GcLmUU7\nAIYUhINXAFdYtkl+yYZ880kJCu8u3dI2991NyS\/fMqGXh\/R7TB5tZcsvyYEARv+6kF126iCELK4O\nm7Zm7x+P6OA731xHn0Oy396Q7JMbmIRX232cY\/8+JpJcHkCIUfcWqFIBIHvrLsk9uQnQYWFeFlfs\nGtrypldB2ceJ5Fc4Aappk8zSiBQAuPfUiefxmPWAz5YnjeyKW6L\/tpv2yLTY\/2AXvryO9yhtBF9Z\nDvjlZzOpu+FbMj\/+5y8+nLsWuLS71wIf\/Ypd+D74NPDFnSmbPPjbbesVvH8\/\/MZs2PfqrbfetOHv\nn36Lff7JPdvtSY989MHE1SuD+M1M+TJ\/uffbP1lElr66Njftzw7sY\/rHH85NcpD\/CzDsezgwwPvv\nh2d+b8D\/AoPjzBLnL6cfAAAAAElFTkSuQmCC",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2011-05\/bag_cabinet_crap_2_3-1304541116.swf",
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
	"crap",
	"no_trade"
];
itemDef.keys_in_location = {
	"o"	: "open"
};
itemDef.keys_in_pack = {};

log.info("bag_cabinet_crap_2_3.js LOADED");

// generated ok 2012-11-02 15:57:32 by tim
