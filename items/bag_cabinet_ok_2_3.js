var label = "OK 2x6 Cabinet";
var version = "1351897052";
var name_single = "OK 2x6 Cabinet";
var name_plural = "";
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
var parent_classes = ["bag_cabinet_ok_2_3", "bag_cabinet_base"];
var has_instance_props = false;

var classProps = {
	"style"	: "ok",	// defined by bag_cabinet_base (overridden by bag_cabinet_ok_2_3)
	"width"	: "2",	// defined by bag_cabinet_base (overridden by bag_cabinet_ok_2_3)
	"height"	: "6",	// defined by bag_cabinet_base (overridden by bag_cabinet_ok_2_3)
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

// global block from bag_cabinet_ok_2_3
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
	"ok",
	"no_trade"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-47,"y":-174,"w":99,"h":170},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAGB0lEQVR42r2YWU+cVRiA+Qf+gbIP\nvfXCSI0WuLEsLcwALXShtVqj3pga7cpW6AKUGWYDSllKaQF7UYUmbtXUdlrAEjQx2tq4obEX2piY\n9Ccc3+csMMVGTTzjJCffN+ecmfd5t\/O975eV9Q+fB7M7yx5c2dWRkTHbtDfrv36WhoJ7r0Uq1NLZ\nmlT6uHtpt\/q7sXb\/48YPUw1vZPn4\/DrTlFrsK1cftG1UH7aV6MH9R+3myviko1S917pRLU9t0\/Nu\n7Wranqt2nnHvfJ0aefWpJ7wA\/jLzYurqoWfVic05qrs6V52Uq7t3I1qbr5o3rVPfnwupgW0Fqqcm\nV53akqN6g+bKOC1zjGMV2epatF5l+fp8dflg6p2Dlapd\/hiwSChPQ\/YG81RfbZ7+Hpb7o8+nAVYb\nsKiso8BpAXXQAPYc2ucP8Mupl1OX9z+nWsvXrVjBWYf7eH2+vgL443hIJbcW6LXOqmx9DywDRYBl\nfuBA0B8gMXjt8NPagggOB41bEcjAMsy3bDKAgw2Fek9nVY62plMquTVfRYJm\/1y00jdgsToumoc1\nYJ4W1CdwuNnBHhcgAIcaC\/X3LrFyv0DF6\/L1vkGBTYi1+f18zDPgp0eKtUCgsEZMhMYkvnrlPhwy\nsMcqs9Xy+ZA6IxaM2jXgNJSsY02SieEd8IYAntqSawQHTVL0S3w56zBP8AOIBfts4nBlD0phVaNY\nvlqIVXkGPFqsMxhhUZu5ZwUkaa3DfIe2YK2eB5o9ZHnUDu5RCsiFuGfAlAB2i4txF1AIPNtYoAYk\nxhDMfGdljvpJAM\/tDBi3a2ubpIpZVw81Fmj4z3wD3mzeoF0GHFAIJOgHbVyRDGQngCPbTZKwN5IW\ns+zl2iVJ5R3wlgAiDDgEcfYNNRRIQhihzGMZAEd3BLT12DcgLiUOx8SqWJa93ZkAnGsxgO6oIM6G\nZbg4ZB7BAI4JIMDAs044nN9VpMZlxK1VF3xn8XzrBi0IGBICOFzpIBGsLTjhAAu0hVnnuLnQVKQh\nE1aZxYRnCy60PqNjDQFk4qjAIWjUQiYs4M8WkDUAUaJf1iaaAgIYWIlb71mcDoiAsR2FAlCor0Aw\nT3wBSKyxB8uiAN\/ZO2p\/kzFAd1QgAKEAXNhdpCF4enC0OMBha1mg3F6UwfrEZkYAAUvWGxdN7Vkv\nlguoiwCK4DMy5wDHrQWHLdTkniILGFgBvJ34HwCJKWMdE2sOkGRwgIzpF9ZrJQB3gIvJzZkCNC6e\n3L1eC3QxxRHyOMBxUWJCMpi9zsWcAhkBTNjDGQG4VrtMP1lMQvwFcLuxGt+xtEsSst27izkHOWBx\nD0I41xCIlc7YI8Wdg7jfZTGuv6CVKVxRhLJtIRNPEvf4wpJYhQEgcJGQKesBxK3AOAV0totCKMZe\n2gXv9aB71AHHcEcHAikUTOlvnsUXJT5JHOLNPW24sh8PoIh3QIoFV0JRDIzsMMIYpigwkK5YAI4y\ni33xtMrHPbO9A95sLl5pMbEGLnQCB9ZYkEObbI\/VmqIW98ftI5Jjqksq8zmfgPTFVw5XaYGuknZW\n6be1YVg3SaaaoatjHUgOc9b5zu\/YTwzGWl7xCzgrgLSNVCZDjavnme49bHdHz0LJT3PkAAHSBa4u\n980cTX\/XgX1+XXxdmiaacKrjQQtg+hMDzXyHtJ00TcBTmjlI1z+7Uo3e5lZfhee2U\/pispcAN+3j\najMEHPOu7STOdM9s286wtXLctqonRJGbvgF5s0Cgc8hiyYjthV07Sca2CyCNeyKtF3H9MSEQswp1\nZgqQYCfA4\/rtAFbL0cB0boy2CgOorWZfjzglHCzgvJtJRTIA2CvHiHu79bjXam3lBjCmm\/lcDZ\/+\nis4pdlLmb2QCkLaSDOS69r5nDaCOS\/sWLGxhw9bSKOkV8I\/rbz28P\/ua+mZ63yPjztSj37+efEn9\n\/vF+de\/t1bm7U49e3e\/uv\/+6ejh\/5EkvgMvTdak7Y9Xq28mGCR8vz28PVKvvJmrUbzO7cr0AfpEs\n7bjRW6pG3ywp8\/F\/l5pL1OfJMn8uXkqW7l2M+wN8t71ELSXKUv9m75+gDzziK3EHnAAAAABJRU5E\nrkJggg==",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2011-05\/bag_cabinet_ok_2_3-1304529888.swf",
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
	"ok",
	"no_trade"
];
itemDef.keys_in_location = {
	"o"	: "open"
};
itemDef.keys_in_pack = {};

log.info("bag_cabinet_ok_2_3.js LOADED");

// generated ok 2012-11-02 15:57:32 by tim
