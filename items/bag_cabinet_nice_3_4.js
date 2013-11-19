var label = "Nice 3x8 Cabinet";
var version = "1351897052";
var name_single = "Nice 3x8 Cabinet";
var name_plural = "";
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
var parent_classes = ["bag_cabinet_nice_3_4", "bag_cabinet_base"];
var has_instance_props = false;

var classProps = {
	"style"	: "nice",	// defined by bag_cabinet_base (overridden by bag_cabinet_nice_3_4)
	"width"	: "3",	// defined by bag_cabinet_base (overridden by bag_cabinet_nice_3_4)
	"height"	: "8",	// defined by bag_cabinet_base (overridden by bag_cabinet_nice_3_4)
	"rows_display"	: "4"	// defined by bag_cabinet_base (overridden by bag_cabinet_nice_3_4)
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

// global block from bag_cabinet_nice_3_4
var capacity = 24;

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
	"nice",
	"no_trade"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-98,"y":-260,"w":195,"h":259},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAGeklEQVR42s2Y61MTVxiHHTutVtva\ndqyXBMiNBLRar3VaiCiGCgECBLkzVgUFvIwIoQKBgEEUciNXLhE7fuhUe9cpUkdbDaitY63aIqO2\ndsbpX+CH\/gFv3\/fsboimOO006zQzz+xy9rd5H86ePXs2M2bE6DNQvnxDoGKJzF2y9Lan9M3QqClF\n9lHVqhUz\/i+fg+\/J3W16xaPmzXIgaL9drzz9TCVMmxbLmjISOgXMWcoTJp3sYVOGLISCj3AfnuAR\nHWvJVDy0GZNDwnkf6BLqm9Olse3dhvT4fCwG9enxjAOb4qGBp1GXwDARGRHw7QTlDvAI5zemSVbF\nTLAmVXJiZ4oEBHalSqBGK4FarRTq1kthT5oU9hIb4qbAv3enccdrtVyezhO+Y0fKIlPMBIvXvDbP\nUaiGvi2ap0KZf5I7kqd6GPMxSF9szVVCZ47ibzmarwoLHDZMn0M58BYnhUQRtBsTYag8GQaR4col\n4CtJgmMVS6C\/LJlJCYLWXAVrC+KxIH+czqFtF+ZEEXThpbMVqCBQmgSDZUls6y\/RoCAWxv0ulKIM\ncShHzo7TP0MI5xCU8xSpYy\/o5AU9xRrsiSS29aEg9eQAX5gyTl7QX8r9E9RztB+s4LaiCh7JU4IP\nxQJ4abu368DxfioM4WUbwMLWCMFOEsSMt0gDtuoM6KlMgWA519OUcxepx0QTpMK2ah2M3PoRRr\/7\nGnry1eHCTwo6d2Ww3FnM2QvUMIzjUTRBh1EN3QZOcLi\/G879cpMV72+uZG1WvEMpQ3Rmy1ECx2fg\nMJybuMVy\/oMVrBcp1yemoLNQA6exR85P\/swkh3xWHIPJOO6mBDtQkHry9LdTuaDfysbkIbEE7ViY\nphJn2UoY\/+0uXLo\/CRew+OfffIGDXsMKU8bOC9pLV8IY5i5ijiQ\/i8jhnS6CYEEiE+w3GSGEhSMl\n2WUlQcwQFhT0NRRMm3MWJo6LJhjsroXzD+5C6ME9GEeouHtHSpTgQFdNVM61PUU8QRsW7sJH3fGA\nBUZ+nWTFx37nigewtzqzFUAZwqKXQ9DXHs4JkoPY+5RziCHYi4VpijgeaIcz9+7AWSx+AYuPo2R\/\no5GNO8oQ7XoZDHnbonLBpkKWcxjFEMznBId8Zvjy7gScuX8HRvniA4IgZggS7Pe0crl7U7khMQV7\nsDDdgYG+Zvh44uZjkgEUpHFHGaItSwYe18GoXL+pkOV6C1SXRRN0O0xw\/MY1OIkTsFA8gGOreqMS\nGrI0sFuXiKjAaWuE4Sdyg03PQLDPsh38V0PwIRY\/hcW\/wuLeKi00ZMhxKS8Ds14FtevjwN62LTpX\nrWU3UG++CIJHUZCmiL4DeeDGwv7vsfhP1+CTydt452pw3MmBMoQZL7FjvyEq5zByuR5RBHElTILu\nylXguX6FFQ\/8MAbHRj9ljzUmiBmCBO3lK8M5kqQcLWZFF\/QW4Vrw4ki4uPdYD1ukRgniU+PxXC9b\nfokmSO8SHdkK9jx141Tju3kNvNcvQ1+9gfVgW5acvW8QrZkyNmF7\/FM5X0MeTS9C7krMBbt5QVpG\n9e3NBN\/EDfBeGgHXliTWRoUp080L0vtLZM5bnMze+MQTNKjYFOHGceTCJZfvSB149+mZCPWgmQQx\nQ7RkJrActVPOv1+P4497XzGLJXiYBHH8UCHWO\/xWwIy9RhmiZXMCO06PPRe\/yqZLTm2Uw39CHEFu\nzZcY7jXautiLujpKUDhO0NijeZT1oNiCQq9E9h4JtkYINqMgCQm9bOPPIVE+dzXmgrTUoktMD3ua\nbuiGEaC\/6RhlCHoWC+2RGdqynEEpjiDdgdPR8Zig\/Kl05YggaNFjDyC04CQ69NFYeGjfmqMMC9PQ\niMxhD8d2om7LVsjasrji7Qj9imrOlLN9umwt\/C+rrZlcO0F5aqdzOnOUDMpSOxHzHzBN\/I+U9ekJ\nsG9DXJj9G+Ofyt60OKjTStk2sr36XWlxLNxeQF6qTZX+UaeNg6p3JJC77I1T2KZDSpHKebNm1iUt\nmGPB\/aqli160J86ffYj2l0vm9tAxyvDZLYa3Fp6s1ZJwHNSkSv\/Etni+xr\/+zETmIq8jktI1Cz1F\nqxcEtq6TDq6TvdqIbUakDNmG7EB28uzhof2tSAmSh+QguYtefn5bZvL8Qfou+k5sU\/M1Zv+XXnwO\nmYO8gixGEhAVkowsQ+gH8dXIWuRtnrV82wo+Q9lERMYLzUNm8R0x7ecvRg02Mkhr\/HkAAAAASUVO\nRK5CYII=",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2011-05\/bag_cabinet_nice_3_4-1304536337.swf",
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
	"nice",
	"no_trade"
];
itemDef.keys_in_location = {
	"o"	: "open"
};
itemDef.keys_in_pack = {};

log.info("bag_cabinet_nice_3_4.js LOADED");

// generated ok 2012-11-02 15:57:32 by tim
