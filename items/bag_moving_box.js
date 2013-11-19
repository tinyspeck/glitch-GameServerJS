//#include include/takeable.js

var label = "Moving Box";
var version = "1345048749";
var name_single = "Moving Box";
var name_plural = "Moving Boxes";
var article = "a";
var description = "The Glitch Advanced Moving Service (GAMS) will pack up your belongings and transfer them to your new home for you.";
var is_hidden = false;
var has_info = true;
var has_infopage = false;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 0;
var input_for = [];
var parent_classes = ["bag_moving_box", "takeable"];
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

verbs.unpack = { // defined by bag_moving_box
	"name"				: "unpack",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 53,
	"tooltip"			: "Open 'er up",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (this.container && this.getContainerType() == 'street' && pc.location.pols_is_owner(pc)) return {state:'enabled'};
		return {state:null};
	},
	"effects"			: function(pc){

		var failed = 0;
		var orig_count = this.count;
		var self_msgs = [];
		var self_effects = [];
		var they_effects = [];
		var sub_effects = [];

		// effect does nothing in dry run: player/custom
		// effect does nothing in dry run: item/destroy

		return this.flatten_effects(pc, {
			self_effects: self_effects,
			they_effects: they_effects,
			sub_effects: sub_effects,
		});
	},
	"handler"			: function(pc, msg, suppress_activity){

		var failed = 0;
		var orig_count = this.count;
		var self_msgs = [];
		var self_effects = [];
		var they_effects = [];

		this.unpack();
		this.apiDelete();

		var pre_msg = this.buildVerbMessage(msg.count, 'unpack', 'unpacked', failed, self_msgs, self_effects, they_effects);
		if (!suppress_activity && pre_msg) pc.sendActivity(pre_msg);

		return failed ? false : true;
	}
};

function canContain(stack){ // defined by bag_moving_box
	if (this.is_packed) return 0;
	return stack.getProp('count');
}

function canDrop(pc, drop_stack){ // defined by bag_moving_box
	if (!pc.houses_is_at_home() && (!this.owner || !pc.location.pols_is_owner(apiFindObject(this.owner)))) return {ok: 0, error: "You can only place Moving Boxes at home."};
	return {ok: 1};
}

function canGive(pc, drop_stack){ // defined by bag_moving_box
	return {ok:0};
}

function canPickup(pc, drop_stack){ // defined by bag_moving_box
	if (pc.location.pols_is_owner(pc)) return {ok: 1};
	return {ok: 0};
}

function consume(type){ // defined by bag_moving_box
	if (!this.container) this.apiSetTimerX('consume', 500, type);

	var items = this.container.getItems();
	for (var i in items){
		if (i == this.tsid) continue; // necessary?

		var it = this.container.apiLockStack(i);
		if (!it) continue;

		if (!it.itemIsPackable()) continue;

		if (type == 'inside_2' && (it.x < 0 || it.y > -533)) continue;
		if (type == 'inside_1' && (it.x < 0 || it.y <= -533)) continue;
		if (type == 'inside' && it.x < 0) continue;
		if (type == 'backyard' && it.x >= 0) continue;

		if (it.class_tsid == 'npc_piggy'){
			var new_it = apiNewItemStack('piggy_egg', 1);
			new_it.setInstanceProp('insta_count', 1);
			this.addItemStack(new_it);
			it.apiDelete();
		}
		else if (it.class_tsid == 'npc_butterfly'){
			var new_it = apiNewItemStack('butterfly_egg', 1);
			new_it.setInstanceProp('insta_count', 1);
			this.addItemStack(new_it);
			it.apiDelete();
		}
		else if (it.class_tsid == 'npc_chicken'){
			var new_it = apiNewItemStack('chicken_egg', 1);
			new_it.setInstanceProp('insta_count', 1);
			this.addItemStack(new_it);
			it.apiDelete();
		}
		else if (it.is_cabinet || it.class_tsid == 'bag_furniture_sdb'){
			var contents = it.getFlatContents();
			for (var j in contents){
				var it2 = contents[j];
				if (!it2) continue;

				this.addItemStack(it2);
			}

			if (it.class_tsid == 'bag_furniture_sdb') it.apiSetTimer('checkEmpty', 500);
		}
		else{
			this.addItemStack(it);
		}
	}
}

function store(pc){ // defined by bag_moving_box
	pc.apiAddHiddenStack(this);
}

function unpack(){ // defined by bag_moving_box
	var contents = this.getContents();

	var range = Math.max(Math.min(200 * this.countContents()/10, 600), 200);
	var center = this.x;
	if (this.container.geo.r-150 < (center + range)){
		center = this.container.geo.r-150-range;
	}
	else if (this.container.geo.l+150 > (center - range)){
		center = this.container.geo.l+150+range;
	}

	for (var i in contents){
		var it = this.removeItemStackSlot(i);
		if (it){
			var p = this.container.upgrades_fix_location(center+randInt(range*-1, range), this.y);
			this.container.apiPutItemIntoPosition(it, p[0], p[1]);
		}
	}
}

// global block from bag_moving_box
var capacity = 1000;
var is_pack = false;

function getDescExtras(pc){
	var out = [];
	return out;
}

var tags = [
	"no_rube",
	"no_trade",
	"not_openable",
	"no_auction"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-39,"y":-84,"w":78,"h":84},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAJbklEQVR42r2Y+VKTWRrGvYO+hL4E\nq6v1jxm7BVkSErKHsGYhJIQtK4GEbIRN2UWhVVAQRUBRARGdbkCM3W31TPdUjZfgJXAJ75znJCd8\nWUhhV8+k6qmTfHzk\/L7nfc973pwLF77gNdKrvzgc0PmGeg1JqRZGrcm3j\/pX\/3gzlvrX3nDq485Q\n6vfXoyl8\/rg7NJfaitmO14NfX\/grXr+8iGl\/fhFNQh+2InNMKehgvf\/Tzn0vvVr209KEne5PtNGN\nkInGwybq61BS1K2mQZ+OhnsNtDBipY35Ltpe8tHBkxD9xPTjWh\/943Ef7T7wneyt+FMHG6HkLzuJ\nsnODvdsM2VJb0U\/vn0Xo\/bMB+vA8mqN3m2E63AixCfvpcD3EdczuS21F+N\/xt5eLHg4\/HWskr72a\nettryNcmo0iPim4PmenxTRe9WQ3S1p0e2mQPgPH1wyAdrA+k\/vl6ZO4\/+yMXzwTEEx2wSY82wvTr\nyzj9tjNIH7cTdPx0gD85vhgj9PZRkOv1SoD2H\/Zy4Tr+XwBj\/Ik9zMRAPSV8WnLbqqjHWknhrloa\nCRppfsjCo\/CIQT+51UkPp520dddNP7+Ifz7eiiYnwqavcgD3V\/xJTPTjWj+fSOjX7Tj9sT9M\/2b6\nfW+IPmxFORgAAXC4EeY6Yg4DChFIp0EbzY9Y6O51G90etlBH8zVy1F\/lshm\/I4v+Cl1nKXJnzMbu\naaV5ds9c0sw1E2+mG\/2m3PC\/Xe1NChcwoRRSKjj62+4gB3m3OZC9vr3kpc2Fblq8Yac15sjjuQ7+\n+f6kg6uz5RqHbG8sozbTVbIarrC81dBUrIluDrZk4aDJaGNxQIQRzmRBGcC7pzGmaFaHGwMF0LsP\n\/DkT5GtioIE6zRXkairnDsI9KOCsoYlIQwEgriUC+rKCEAtAhC4fIg17Cnq0GeHXDtbDtH6760y4\nWTb5aF8dBdsV5G2tJr9DTgPdKhoKGGiKOQUHp+NNNJNoplkm\/M84e6C4V5MsmoNiIRQLL9yTgh4\/\ni9PxVpw2f3AXh2MTIlxi4vMIsHigooBwEDULIEdPIzmOldLGQs+ZgOcFg9MILRZOgtXTkg4ifO+e\nxYrmWzGVCnEpIffgGMBuhOt5+Yl7tRnlAYpFki41fQUOIrQ8xBL9GUC4irxDngEKjmH3gWuDfl3G\nvSKAolCXEmqktFiLxXQeQNQ25CPcgvB+HK71GWms38RhAY6\/AbgAENWb7yTMuffPB3ny4\/0pXBoM\nDqNQQ69YecFn7ASlwphfRsT1cbbLAAwS90zHzlgkqefJXZSM0xUb5oBCwkGkgYATwnb1pfmHUAs4\nCA6LVYywF3EwkeKubUZKhhlhzQd8wHYKhExMcp7FgVAipKIOzmYcxGeEvABwbyVwghLz\/nmCh\/ho\nM8pLTr7SCwYPwZqItRALez9zsIN\/MZxAeMaYA5ORNPDMl5Qadi\/A06s5D3COPQHaob3lAAsp60Ze\nJLNi7ubuIJkVLLqc1dn2gpoGMKlmi+RhvsQiwmpmgL4cwHuso8BEa2yTf\/ZDDwk3BSRcRW0UYAIO\nejjTTkm\/njuHJM+feIo5ORJq5KPdquXC54I9m8Fh4fBy41Hn7sXIpResH3t5z8NGDy1et\/Pysc8A\npNtaWomcXMV9Iq+ExN46GGzgQFF\/PTU1qklvqOWf1Tolv5YPiDQpCniwwSbMCPmHwoy+bmXKydsm\nlJmzFg4azVKhA4zJpOKjpUXDQQUkHkDcJ8pOUUBpzkkltjwAFutyoJ37vpKAABJwGCHhJEaEGzkq\nSg52kkIHpR3LhqRjyYRU5GDh\/hwuCYgwAkiEVwBCOoOSOtt01O+uy1aBMwFRhM\/qBXN7whgHRU4e\nZjrqbQYo6hcWSzKg5+UGBbepQcml0cpJqZKlpZZnR4\/LkO0BATfWX8cBA\/bqvI76UTC7jWEXyW2p\nYtxBadjFroMH2rrj5iUCkLxU8MlMHBBqrFdQraaGVEzCvVoGh2tuBjgj2VUAF\/NoCgHFvipGaddy\nWmoSBSFGbr5c9JbMQW+HMSe0wkkAdju0Wbh0k6BlP1PVxQGlgpOocekVHaM3j05Dz\/tF5ipGAML9\nUoB9PUbumEqrYKtZSb1dOnJYVaSoraYOuzq7A+HnaUnAmSEHLY47+I4CPWH1LX1C4OVhFwsGcAgx\nwoud51WRH00zmXZ\/MGDkQOYmJQdCuDHWGWv4aG5UZgFFs3oWYGp8sJ2Ent\/zZt3kjWxm1xDNrOhu\nROMgOhHe52XqWY9DwyEEkE4n50DCOQEsQpzuYrTFF8nLRU\/q7mQXzYy4aCTqIPEesBsLnoLQI0\/3\nlk9TQtrCi45ZpZZlASFbS20WrBigyEGov0uRC7g86UjF+8y0MNZGGG8O26nLVU+RQAtdj1rJ5WSt\nedjCOpdOtrV18nOV7UVvDuBMXo8HxwScsraKQwFarqgkV6uqJGBBHVyasKfiwWZannJQLNjCAXs9\nTRwS78fjrTQ\/5qRI0EJLky6+b+8s+TgcRimYEPKvuUFBdQYZuZ1qktVUUJWsnOrrajhsyK2nqNdw\nChg8BYx51docwOlo42q308AcYxt8uJXuTXRwrd3q5uPssJNrda6HHsx056x4wErBUGwxWbpt0mZX\nZ2+nhhpMNdxBwCLk4l4UeAGHH\/ahTmVuP2is+dbmaqkiN6tLHpeRu3Zr1MndGYu1UchvJovNxBy0\ncmDhHoQWTboL5AuAna1Kaq5n9U95jRTKCtJqKqmyuowGejTU16mm3nYFP67DsR3kb5MlC47gDMpv\nvrYYrqzGPVr29HUU85ko7KmjoLuBpgetNBG30VTCSrdG2rLnewBcmXZwFwB4+rMxV3ptJalVFRRk\nMOKaTF7OIcvKr5CjqfIUziFnku2eeVZoqvr2q9a675JuW\/VJzKPnsD1OPU1EW\/iZHmCfshYs3Tu6\nCc0uJsQeXAxOAGrV1zLhq+VytFSTxVRBLnNVBkrOD5mcTeWfLborc+c6eUXoGegnj11BLpuGrM0q\nSvhNdGfUyhcUunC8D3XV8gIrlTSnbA2VZDZdy4JAcMuFI7mm8pS17vs5vfySFlH8U2fX+Ed8iadV\n9hkJPYUfRazeLQxb+CidGAq6FPxES3oNp6xd5orP3ZbK1Wbd33x6xeWyC\/+LF77YUX911d8mPxno\nVvPD9HzAbmslORrKyG76PmU2\/D0Jd5A6F\/7fL8Aaai6vGhWXyaC4dGJUXNo1yi\/79LJvLv4V3\/9f\nbrPe5qF14qAAAAAASUVORK5CYII=",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/bag_moving_box-1334254853.swf",
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
	"no_trade",
	"not_openable",
	"no_auction"
];
itemDef.keys_in_location = {
	"p"	: "pickup",
	"u"	: "unpack"
};
itemDef.keys_in_pack = {
	"r"	: "drop",
	"g"	: "give"
};

log.info("bag_moving_box.js LOADED");

// generated ok 2012-08-15 09:39:09 by mygrant
