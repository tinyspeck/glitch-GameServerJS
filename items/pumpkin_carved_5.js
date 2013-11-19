//#include include/takeable.js

var label = "Lem the Pumpkin";
var version = "1348102174";
var name_single = "Lem the Pumpkin";
var name_plural = "Pumpkins Lem";
var article = "a";
var description = "To mark the special relationship between the Lemmites and the Zillots, the Lem Pumpkin was created by a particularly talented Lemmite carver named Myuki. Zille, apparently, was unimpressed at this sharing of her holiday. But Lem loved it.";
var is_hidden = false;
var has_info = true;
var has_infopage = false;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 41;
var input_for = [];
var parent_classes = ["pumpkin_carved_5", "carved_pumpkin_base", "takeable"];
var has_instance_props = false;

var classProps = {
	"collection_id"	: ""	// defined by takeable
};

var instancePropsDef = {};

var verbs = {};

verbs.pickup = { // defined by carved_pumpkin_base
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
	"conditions"			: function(pc, drop_stack){

		if (!this.owner){
			this.owner = pc.tsid;
		}
		else if (this.owner != pc.tsid){
			log.info('pumpkin_owner: '+pc.tsid);
			return {state:null};
		}

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
	"sort_on"			: 52,
	"tooltip"			: "Or, drag item to player",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		return this.takeable_give_conditions(pc, drop_stack);
	},
	"handler"			: function(pc, msg, suppress_activity){

		return this.takeable_give(pc, msg);
	}
};

verbs.drop = { // defined by carved_pumpkin_base
	"name"				: "drop",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 53,
	"tooltip"			: "Drop it on the ground",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		// If we have it, then it is ours
		if (this.owner != pc.tsid){
			this.owner = pc.tsid;
		}

		if ((pc.location.pols_is_pol() && pc.location.pols_is_owner(pc))||
			pc.location.is_party_space){
			return this.takeable_drop_conditions(pc, drop_stack);
		}

		var entrances = pc.houses_get_entrances();
		var near_entrance = false;
		for (var i in entrances){
			if (pc.location.tsid == entrances[i].tsid){
				if (pc.distanceFromPlayerXY(entrances[i].x, entrances[i].y) <= 300){
					near_entrance = true;
				}
			}
		}

		if (near_entrance){
			return this.takeable_drop_conditions(pc, drop_stack);
		}
		else{
			return {state:'disabled', reason: "A carved pumpkin can only be placed inside or near the entrance to your house, or in party spaces."};
		}
	},
	"handler"			: function(pc, msg, suppress_activity){

		var result = this.takeable_drop(pc, msg, true);

		if (result) {
			if (isZilloween()) {
				if (isLit()) {
					pc.achievements_increment('pumpkins_placed', 'lit');
				}
				else {
					pc.achievements_increment('pumpkins_placed', 'carved');
				}
			}
		}

		return result;
	}
};

verbs.smash = { // defined by carved_pumpkin_base
	"name"				: "smash",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 55,
	"tooltip"			: "Smash it",
	"is_drop_target"		: false,
	"handler"			: function(pc, msg, suppress_activity){

		this.apiDelete();

		pc.createItemFromGround('pepitas', 5, false);
		pc.sendActivity('"PUNKIN-SMASH! Oh! You got pepitas!"');
	}
};

verbs.light = { // defined by carved_pumpkin_base
	"name"				: "light",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_single"			: 1,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 56,
	"tooltip"			: "Light this pumpkin",
	"is_drop_target"		: true,
	"drop_many"			: false,
	"drop_tip"			: "Use all 7 fireflies to light pumpkin",
	"drop_ok_code"			: function(stack, pc){

		return stack.class_tsid == 'firefly_jar' && stack.getInstanceProp('num_flies') == 7;
	},
	"conditions"			: function(pc, drop_stack){

		function is_firefly_jar(it){ return it.class_tsid=='firefly_jar' && it.getInstanceProp('num_flies')==7; }

		if (pc.findFirst(is_firefly_jar)) {
			return {state:'enabled'};
		}

		return {state:'disabled', reason:'You need a full Firefly Jar to light a Pumpkin'};
	},
	"handler"			: function(pc, msg, suppress_activity){

		if (this.class_id == 'pumpkin_carved_1') var lit_class_id = 'pumpkin_lit_1';
		else if (this.class_id == 'pumpkin_carved_2') var lit_class_id = 'pumpkin_lit_2';
		else if (this.class_id == 'pumpkin_carved_3') var lit_class_id = 'pumpkin_lit_3';
		else if (this.class_id == 'pumpkin_carved_4') var lit_class_id = 'pumpkin_lit_4';
		else if (this.class_id == 'pumpkin_carved_5') var lit_class_id = 'pumpkin_lit_5';

		this.apiDelete();

		pc.createItemFromGround(lit_class_id, 1, false);

		function is_firefly_jar(it){ return it.class_tsid=='firefly_jar' && it.getInstanceProp('num_flies')==7; }
		var firefly_jar = pc.findFirst(is_firefly_jar)
		if (firefly_jar) {
			firefly_jar.setInstanceProp('num_flies', 0);
		}

		pc.metabolics_lose_energy(5);
		pc.metabolics_add_mood(20);
		pc.stats_add_xp(5, true);

		return true;




		var remaining = this.former_container.addItemStack(this, this.former_slot);
	}
};

function parent_verb_takeable_drop(pc, msg, suppress_activity){
	return this.takeable_drop(pc, msg);
};

function parent_verb_takeable_drop_effects(pc){
	// no effects code in this parent
};

function parent_verb_takeable_pickup(pc, msg, suppress_activity){
	return this.takeable_pickup(pc, msg);
};

function parent_verb_takeable_pickup_effects(pc){
	// no effects code in this parent
};

function checkRot(){ // defined by carved_pumpkin_base
	//
	// If it is not Zilloween, rot the pumpkin.
	//

	if (!isZilloween()){
		this.rotPumpkin();
	}else{
		//
		// Set timer to check next game day.
		//
		this.apiSetTimer('checkRot', seconds_until_next_game_day() * 1000);
	}
}

function isLit(){ // defined by carved_pumpkin_base
	return false;
}

function onCreate(){ // defined by carved_pumpkin_base
	this.checkRot();
}

function rotPumpkin(){ // defined by carved_pumpkin_base
	var container = this.container;
	if (!container) return;

	if (container.is_player || container.is_bag){
		var pc = container.findPack();
		if (pc.is_player) {

			var auction_tsid = pc.auctions_get_uid_for_item(this.tsid);
			if (auction_tsid){

				// the pumpkin is in auction		
				var ret = pc.auctions_cancel(pc.auctions_get_uid_for_item(this.tsid), true);
				pc.createItemFromFamiliar('pepitas', 5);
				pc.sendActivity('"Gadzooks! The fancy carved pumpkin you had at auction has rotted away! I guess some things really are seasonal after all. What was left has been returned to you."');
			}else{
				if (container.class_tsid == 'bag_private'){
					var s = apiNewItemStack('pepitas', 5);
					container.addItemStack(s);
					pc.mail_replace_mail_item(this.tsid, s);
				}else{
					pc.createItemFromGround('pepitas', 5, false);
					pc.sendActivity('"Gadzooks! All the fancy carved zilloween pumpkins rotted away! I guess some things really are seasonal after all. Still, you might want to check if there\'s anything left of them…"');
				}
			}
		}else{
			container.createItemInBag('pepitas', 5);

			if (container.onPumpkinRot) {
				container.onPumpkinRot(this.tsid, 'pepitas', 5);
			}
		}

		this.apiDelete();
	}else{
		container.createItemStackFromSource('pepitas', 5, this.x, this.y, this);
		this.apiDelete();
	}
}

function getDescExtras(pc){
	var out = [];
	return out;
}

var tags = [
	"no_rube",
	"zilloween"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-25,"y":-55,"w":50,"h":55},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAANXElEQVR42s1Yd1RUZx7NtsQkCkMv\n08ubERFpKqIgiqCIInbABoig0qSGJoiUoVcBKSpSREAFomAPoIgVJeiKJrqSZNN2Nwm7Oufkz7u\/\n9wbPbuJm12j27M459zzmzcz33e\/+7q883njjF3phyE1XMxLe9+xh5q43\/t9e338gFWuuuQ1rRnZA\ncz8Jz4YD6v9vyH3XIxX\/9QPFuOaKLTQ3PKAZWgPNdTc8uzz1f0\/yu3aZ7lcnmeFvzzH42wcMNJcI\nly3xrJ\/BXy8y+Oac3P9\/SvCTNkXn550MPm6X4W67AqNdKnzaw+A7IvyX0wy+Psngjx0Kl\/+uv+54\nijX3wq1\/fP9Js1T8+AiD2\/UypMcaIT9PhdqmeaioscfpGhm+7CJyJxg8aVX0\/UD1CzLd7686u2ju\nbbf+RQg+u7myXnM\/Ac9urR172s\/Uf9Mj92bv36tl6h8eZjBYK8eeBHOE7ySSRZYoLJqG9CQ+R\/zJ\nUQaPmhiMHlK4jLXJ\/b88qehkQ6+57opnd6PGvx8NEr+exyg7WT+xCcBevzvPgDyHx0cU4x9WKXGv\nVolLVXLsTpEgeKsB4mMFSEsVw9\/vbdw7JMdHDUTuIIO71cw4q\/bnHRT6M+TXXlpzwJoSadrrJdIX\nXUz9n3q0fvozXdmwfdrO4E4Fg1ulSroqMVKtJFISpGcwyC2yQmKiCBkRerh\/gOEOMLJf+717dQyn\nKEvy61PP11SMvxZBUmrskzYtKfb6hxYGD+oZDKiVuFqgxI1iJYbKlFBnykhFKUrKZ5CK5jiYYorh\nSi2xW2Xa710vVOLBIVK\/mcFY68SaBNbLr0yQVYAN0eghbajY99doo969FNpsJa7kaonm7RZCnSFD\nNhGNjjRG514RbpYQqSL6PF+JgRwl+rO0ZO\/WKDl1uTVZ1L5GlrObsIsOldO1lBn\/fYMTrpfZjfdn\nKnFxjxJ9GUSUNq5K5FOimCEh2hibfCahfbeII39ZrSXGHuhaEYOhfVo1n6\/Jqn+z\/DUI9mUw41cL\nlWOfn3LEk\/O+OFmxhGqdO1eQWT\/eJ1Vvkx87skVIitBH5DYdjuCxVBGnHh0KA6UW+KhtOv7YbaMt\n4IMe+KR7JUYOOOAyRWEgQ\/lq5ebJCan4UbN87IuTcpzMl8F3oQkyQ+0x3LkOQ81OuN3siM96ZuLP\nZPax43J0lfLRUWyOpmwTjDbKMUJZvGuVADtXiBHjy6A4dhbGLqzGl5d8MXBgDm63zMX9Vjt82S3v\nY\/f6WeRGDkj8H7XIcGe\/HJ\/S5mzd0ny4FZoHGXjcH4fKRAdUxavwoN2C6xrfnNGWIBbfnNVm\/KNW\nOWqizBC8hIftnnqIWScAO0zsT3WHnehNzLeYDHWYDT7umouHRyTjdw5KX07JwTKJ91C1FGey5GhR\nO+F8nSfud6\/SDgHstMJiaB00V53w2QkFR+op1TU2fCzYGsfee16WPjs+UfeuzYfmth\/O1S3DbOkk\n2Ivfgq3wTZwstMBokwzXqyTjvUX8f0+yJ8tM3FsgHu9IlSEnZCpcrXRgLXgTWxfr4Nt+R9w7tgDD\nba4Y7VyIu61O+OqsHZ720eaDc2iSWazF4CzuHjtAsPWObXefHWOHCAvuUNx3rrni6eVZ+PaCHEfT\nzTHSqMJguQRn1aLx9gQ93Z8k2JUq7DyVJkZFBMOFwYbIzVdNwmC1CBXRlsgLtUKMjwLJ\/tOQsX0G\nRjo8uI6guUUK3w3V4pY33bPCOLW00+TdPf4qlETZ4kaTo\/YwlGBP+xX0uRzbluhiJinpYauHgUZP\nnMtj0JrA\/9fdpT1ET7c1QYxuqmH9pTLkBRsTjHC+SIDeMgZpWxi4TpsMF9W7WEj+cbOcguPZMk4x\nzZ1NnD81D\/ZwYdRcsefGrZoYc3jM0MESisTGBWb4sMWewq8gdRW4USfCPMU7cGDDLXoLrQWuOEed\nqInaZU3Iv1DxQLjZrsYYERVZCW5USXC3Xgo2UT49QWaPUXCkFkydjEXTpsB9+hSsnq2LRzRm\/UBB\n1p\/\/pOC5QhGW2\/KwzEYXS2fo4krtDPypW4GvTilwoVgIZ+W7cJS\/DSc69ECzF7rVDKrDhCgLMnnx\nsWH\/DrO+higBysNk6M4S4E6dBKMNMjw+KsdgpQxr5+hy5BaTGknrjXCzVsplMBu2lr0K1CVZcCiJ\nEKImzhT7o0xxr0GKnhwxqsL5qN3FJz+qqBcrKLnkeNImR1WEKdSBRjiSpkRPnhLJPqYoCxGhwN+k\n7wWC+4LNcCjSHNkBYnjZ6UIdYIzeYjFGD8vw6AgtSGWjXy2nXqrg+ug1Urlwuwm87HW40LtaaLHw\nOaZqFY9ZaUCFW8iOXBg7qsAf6MCPW+R4SJk7clCKm\/slqI40xUZnXYQuF4DlkbPBBC8QLAk0RXWo\nORLX8pEbyCeVBLQ5j8jyEOVtQqczQ9AifWxzN0Kopz5WztZH4CI99JeTb\/PEKAun30eTcoSqXaZo\nof58rkCEFB8jzq\/b3A2wyUUXwe569DcPQW48LJ4xGfMpzNs9zFAcIsTuDWIUB5phL0XoBYK5m41R\nEWKGqBWmOLjLHF0Zcvg4GaElSYJe6qPqYBWivAzx4LACd2ho8GA9tU+Mj2nC2ehiyPly8XQdzgLs\nda2DHk5mSTFSJ+P8ejBWRkOCAs0JfPg6G1HolTiTK8cGZz3Uxk3DUern2VulKAgUImWV4YsEifVw\ncSAp5SvCsSQBjqfJ4TffGAMlUlwqViBoCR95Aab4PW1yPJ2GVFLmoyYFMvwlHNml1rrw\/BG87PRw\nrVKFOvJfgo8Yd2i4HaqUY91cI5xSq9CbL0GMtwEOJ1mhIYZPvlXRHkLEe+oPv0Awy8eoJHuDEdRB\nCjTFCNCWIkfUSnNczKECSpMJG6aGGCGGqf3VxqlQT3PfpX3TaTNDLlO9CCvsWOhxYK3B3ns\/z44j\nstOLyheNaoMlMiSSfdoybNGTIUI8qdWUbEn2MiN7WCB7swjh7rwXs7giUOidttYQ+2OtkB9gQqGQ\nI3WjBN3pYvRkqeBpw0NHshg3yuUojbHDiTQRTpfOgbe9HlYSVs3Ux+pZ\/8AqwsqZeugudsStfRQN\nF1NcyJ+K3jwpERTiWI4DTiQLscfPDE0pVigJMkHDntlIWW0yHmL\/E91k73rjsfIwBrVRChyIEEAd\nYoHjSUK8v3cq\/N3M8T6N9pcLpTT\/OaA1UYiLVfPhO88Ia2YbYJ2DAdbP+QfY9wGLzHChcj6uFMto\nqpHgTI4FzmRIkOgjQlfuLDRTUc4KkKBx9wyoNxqj9j1rhC7S\/+nnlKQVBv7Jqw1wKNGaS\/f8cGvs\n32mO9kQxsrZPR1O0ABeyJTiQOgdNcQJcPrgIaf4W8HE0hB+FegORfQ4\/8llhhC0u1Thzv8mPtMUp\nGnA7kkXI3WGB9rRpOED1MSvYApXhCuQEiJC5WYKguZP+\/egV56k\/VhgiQ\/E2CkOeE5JXG+HwLgGa\nU22g3mTCbXCmzAnFwXwMVDtg4MgqSgAGm5yNsZmwhRIrbBk9Amy3whX67INiK3SliGlWdEV7ggj1\nkXwcyZ6H2lA+iijpcukQBUESKlMWCJrP+89PefFLDV3ilxkgx1+IJiJVvssSNTv5aIyVIsJbALbb\nnC20w5mSOThNbfHW0aW4f3YTrrauwdlaT8Iy7j2L2+3L0Unj\/6FoGS5WuqA5mrpMrAVN4PYoDzJD\n\/EoTHKWRjt1v+0LeeNBc3ssNrqTinlgqxpkbqB6WuqI4iI8KCnnz7ulo22vDKdpf7YKO3VJO0UuV\nczB8zAuPLm7Gk0tb8fCsHy7XzMNxUqyZrQiZM9FCSVcfJUJvnTvYppC70QRHsuZBTWUq1JWHwLk8\n7581VYe78Q7FEMl0P1OcyHVEvr8JSrea4jwpcfg9Bg3RYpwuJKNT6Tka90O0xAo5v7LhbIyToSPL\nGnURLDk3lAULkO1HTSFCxZHbwZKbx3u1fzKFLOD5Ry\/VR5oPkdsph5p6ZP4WY3TlO+BwvBKNCSrk\nbjZBEvm0LoxPhzDlrqy\/Eqi+sZ2pM2cmJZoQPaXOKKIWyraxdF9TpPkKEOamN77Vifd6\/6NhsyrK\nw6A+YYUBkqjxp68zRKavMSoj5aQGHyWRlqiMs2EnECotuigNMkVNhBQVlJkVoRJUhlHWk+8yqfOw\nLYz1W7g7S0xnz0\/Wu1d5pS43tqbF++KWG+C9FfpIpM3S1higPpGKbLAE2TuskEqFPsrTAAWhltgX\nJkfGevrOWiMkTxCLXKLHJkPDSyfDS7x+TXiHYEDgE+Sr7Kf4+zpOqdnirHM21I33dTQ9scV56aMq\nxhIJRDzCk+a7HGfEL9fXkvLQ02xx1r2+3HbyPrdpk9fTGlMJEoIpQY8w6VXJ\/Y4whWAysaAFYTbB\nixBMSCGUs08Lk373q4G5zNtfrJo15enOFcKnjlN1ntD9IcI5QiOhkC0OhM2EJQQbgpIgJBgS3iX8\n6lVIvknQIRgTRAQVYQZhAWENYRshlpBOKCCUTZAuZSc4QhqBbfwBEwebR5hOYAiCCXLvvCq5H7\/Y\nRX5LeJugOxEiwYS6MoJiQhXlBAHFhELGE0R4E+FkD\/2bl930786TorTDTpwMAAAAAElFTkSuQmCC\n",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2011-10\/pumpkin_carved_5-1319852490.swf",
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
	"zilloween"
];
itemDef.keys_in_location = {
	"p"	: "pickup"
};
itemDef.keys_in_pack = {
	"r"	: "drop",
	"g"	: "give",
	"h"	: "light",
	"c"	: "smash"
};

log.info("pumpkin_carved_5.js LOADED");

// generated ok 2012-09-19 17:49:34 by lizg
