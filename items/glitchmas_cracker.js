//#include include/takeable.js

var label = "Glitchmas Cracker";
var version = "1337965215";
var name_single = "Glitchmas Cracker";
var name_plural = "Glitchmas Crackers";
var article = "a";
var description = "Ostensibly a seasonal cardboard tube wrapped in colored paper. But so much more than that too. Once opened, it looks like it may contain a surprise, a gift, and curious lack of party hat. You probably need somebody else to help you pull it open to find out, though.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 500;
var input_for = [];
var parent_classes = ["glitchmas_cracker", "takeable"];
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

verbs.give = { // defined by glitchmas_cracker
	"name"				: "give",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: true,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 50,
	"tooltip"			: "Or, drag item to player",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (this.isPulled) { 
			return {state:'disabled', reason:"You have to stop pulling the Glitchmas Cracker before you can give it away."};
		}
		else {
			return {state:'enabled'};
		}
	},
	"handler"			: function(pc, msg, suppress_activity){

		return this.parent_verb_takeable_give(pc, msg, suppress_activity);
	}
};

verbs.drop = { // defined by glitchmas_cracker
	"name"				: "drop",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 50,
	"tooltip"			: "Drop it on the ground",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (!this.isPulled) { 
			return {state:'enabled'};
		}
		else {
			return {state:'disabled', reason:"You have to stop pulling the Glitchmas Cracker before you can drop it."};
		}
	},
	"handler"			: function(pc, msg, suppress_activity){

		if (this.parent_verb_takeable_drop(pc, msg)){
			return true;
		}

		return false;
	}
};

verbs.stop_waiting = { // defined by glitchmas_cracker
	"name"				: "stop waiting",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 50,
	"tooltip"			: "",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (this.isPulled == true) { 
			return {state:'enabled'};
		}
		else { 
			return {state:null};
		}
	},
	"handler"			: function(pc, msg, suppress_activity){

		var failed = 0;
		var orig_count = this.count;
		var self_msgs = [];
		var self_effects = [];
		var they_effects = [];

		this.onOverlayDismissed(pc);

		this.isPulled = false;
		delete pc['!pulling'];

		pc.sendActivity("You put your Glitchmas Cracker away.");

		return failed ? false : true;
	}
};

verbs.pull = { // defined by glitchmas_cracker
	"name"				: "pull",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_single"			: 1,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 50,
	"tooltip"			: "Open the cracker!",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (pc['!pulling']) { 
			return {state:'disabled', reason:'You are already pulling a Glitchmas Cracker!'};
		}
		else if (!this.isPulled) { 
			return {state:'enabled'};
		}
		else { 
			return {state:null};
		}
	},
	"handler"			: function(pc, msg, suppress_activity){

		var failed = 0;
		var orig_count = this.count;
		var self_msgs = [];
		var self_effects = [];
		var they_effects = [];

			var annc = {
				uid: "glitchmas_cracker_"+pc.tsid,
				type: "pc_overlay",
				duration: 0,
				locking: false,
				pc_tsid: pc.tsid,
				state: 'waiting',
				delta_x: 0,
				delta_y: -140,
				click_to_advance: false,
				swf_url: overlay_key_to_url('glitchmas_cracker'),
			};


			var annc_for_others = { 
				uid: "glitchmas_cracker_"+pc.tsid,
				type: "pc_overlay",
				duration: 0,
				locking: false,
				pc_tsid: pc.tsid,
				state: 'waiting',
				delta_x: 0,
				delta_y: -140,
				click_to_advance: false,
				swf_url: overlay_key_to_url('glitchmas_cracker'),
				mouse : {
					is_clickable: true,
					allow_multiple_clicks: false,
					click_payload: {itemstack_tsids: [this.tsid], player: pc.tsid},
					dismiss_on_click: false,
					txt: "Click to help pull the Glitchmas Cracker.",
					txt_delta_y: -30
				}
			};


			pc.apiSendAnnouncement(annc);
			pc.location.apiSendAnnouncementX(annc_for_others, pc);

			pc.sendActivity("You are waiting for somebody to help pull your Glitchmas Cracker.");

			this.isPulled = true;
			pc['!pulling'] = this.tsid;



		return failed ? false : true;
	}
};

function parent_verb_takeable_give(pc, msg, suppress_activity){
	return this.takeable_give(pc, msg);
};

function parent_verb_takeable_give_effects(pc){
	// no effects code in this parent
};

function parent_verb_takeable_drop(pc, msg, suppress_activity){
	return this.takeable_drop(pc, msg);
};

function parent_verb_takeable_drop_effects(pc){
	// no effects code in this parent
};

function cancelPulling(){ // defined by glitchmas_cracker
	this.isPulled = false;
}

function crackerPull(pc, click_payload){ // defined by glitchmas_cracker
	if (!pc || !click_payload) { 
		log.error("Glitchmas Cracker: crackerPull got bad argument");

		return;
	}


	if (click_payload.player) { 
		var owner = getPlayer(click_payload.player);

		if (randInt(0, 1) == 0) {
			pc.createItemFromOffset("glitchmas_cracker_joke", this.count, {x:owner.x, y:owner.y-140}, false, null);
		}
		else {
			 pc.createItemFromOffset("glitchmas_cracker_factoid", this.count, {x:owner.x, y:owner.y-140}, false, null);
		}

		pc.sendActivity("You got a joke from the Glitchmas Cracker. Happy Glitchmas!");


		this.giveToy(owner);
		pc.sendActivity(owner.label+" got a prize from the Glitchmas Cracker!");
		owner.sendActivity(pc.label+" got a joke from the Glitchmas Cracker!");

		pc.achievements_increment('glitchmas_cracker', 'opened', 1);
		owner.achievements_increment('glitchmas_cracker', 'opened', 1);

		log.info("Dismissing cracker overlay");
		
		//log.info("Cracker overlay dismissed for "+owner.tsid);
		pc.location.overlay_dismiss("glitchmas_cracker_"+owner.tsid);

		delete owner['!pulling'];
	}


	log.info("Deleting cracker");
	this.apiDelete();
}

function giveToy(pc){ // defined by glitchmas_cracker
	var prot = apiFindItemPrototype('catalog_drop_tables');
		
	if (prot.drop_tables['glitchmas_cracker']){
		var table = prot.drop_tables['glitchmas_cracker'];

		var context = {'class_id': 'glitchmas_cracker', 'source': {}}; // For logs

		var chance = pc.buffs_has('max_luck') ? 0 : randInt(0, 100);
		for (var drop_chance in table.drops){
			if (chance <= drop_chance){
					
				var items = table.drops[drop_chance];
					
				for (var i in items){
					var msg;

					var it = items[i];
					if (it.class_id && it.count){
						var item_prot = apiFindItemPrototype(it.class_id);
						it.label = item_prot.label;
						
						pc.createItemFromOffset(it.class_id, it.count, {x:pc.x, y:pc.y-140}, false, null);
						msg = "You got "+pluralize(it.count, item_prot.name_single, item_prot.name_plural)+" from the Glitchmas Cracker. Merry Glitchmas!";
							
					}	
						
					if (msg){
						
						pc.sendOnlineActivity(msg);
					}
					
					return items;
				}
			}
		}
		
		return false;
	}
}

function onOverlayClicked(pc, click_payload){ // defined by glitchmas_cracker
	log.info("Changing cracker state for "+pc);

	var owner = click_payload.player;

	if (owner) { 
		pc.location.apiSendMsg({type: 'overlay_state', uid: 'glitchmas_cracker_'+owner, state: 'grab'});

		pc.apiSendAnnouncement({
			type: 'play_sound',
			sound: 'GLITCHMAS_CRACKER'
		});

		getPlayer(owner).apiSendAnnouncement({
			type: 'play_sound',
			sound: 'GLITCHMAS_CRACKER'
		});
	}

		
	this.apiSetTimerX('crackerPull', 3167, pc, click_payload);
}

function onOverlayDismissed(pc, dismiss_payload){ // defined by glitchmas_cracker
	if (!pc) { 
		log.error("Cracker error - can't dismiss overlay on null pc!");
	}
	else {

		log.info("Cracker overlay dismissed for "+pc.tsid);
		pc.location.overlay_dismiss("glitchmas_cracker_"+pc.tsid);

		//log.info("Cracker overlay dismissed for "+pc.tsid);
		//pc.location.overlay_dismiss("glitchmas_cracker_others_"+pc.tsid);

		delete pc['isPulling'];
	}
}

function onPlayerExit(pc){ // defined by glitchmas_cracker
	this.isPulled = false;
	delete pc['!pulling'];
}

function getDescExtras(pc){
	var out = [];
	return out;
}

var tags = [
	"no_rube",
	"glitchmas",
	"toys"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-26,"y":-24,"w":52,"h":24},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAIvUlEQVR42s2Y91eTeRbG\/Q+YXXcX\nwXEUnebMIIgONhwYkaYQpCkgkNBCCZCEFmlSBISEXhNa6KEoQYoUkQg6gAUjIIKABBFBsGSxjs7u\nefZN9sTj7vy0ZxLde849eZMfcj7n3vc+z\/1+16z5RPGPd0vklflB\/sJUj+jJwpDo1xfTfNlva\/4f\n4s3zGfKDqW5MDgswd6cFz5evg9fsgbCC\/ThVaiuRLt\/U+WRwywuD5NnxFjmc5HYzVh9dxdOly0ir\nsQczex8ETQz0C5OkUXu3b\/zocC+kE7FT4gY53N1rAvRG0LAkbsP0RB1Ccg0QmWuC4b4cZHtaI2T3\nDtFHhXv36gFfMtmDqZEWSO50YnlGhLttpXg8342p0SpE5ZuiqTkcV7pSUJflj+pML9QWeRuqHOze\nDZ7aylwr\/8FUMxbu1mDiRhEWpwV4\/OACXj+fxdLseaKifAyJMvBLVyp6mmPQUhuMzFAbuGp\/x1c5\n4NydKqEMbJIAG7\/GRdeZCNwhPmdGSrE004DVpR4sTddjoFsGdxKVJVTUl\/iimOOI1BBz1bZ5ebZO\nZ268Etd609HZyJJDNJT5oq0uBOdqmBC1xUFYGUQAF6Cwwh2uLF3QogxQnOWEwlRbFKfZqxZw+laJ\nUFDsj1aWHQoNvkbRCTvUFfsg97QdzteHozSbjPb6MAiKvDDYexpuodvBzXBEXsoRsNmHwCmyUn6L\ngWdq+G3JULosjn36cEByra8It6JpqNLVRJjWWmSQdJBiuwOnI0ioLvQgYOzRKmCirZaJyjIq8lJt\nEJSwF6H5BuKUhoNqSod7KZ0QK3RuZU6E6dlmpNU7oC2XDq7xdtxws0bWVnV47N2MSIYxmioD0VJD\nR2U+GeeqgxCdcABx2aZilqrgFDr3SNKL315MoL0\/Dmc7w9DaEYn54SZc8jyCDAKQrK0Of\/\/diEs8\nCHa8FXjpDkRFybKUXGigqhZuabYHb1fHIV3sw8PpJkyPVGF0kIuhi2nor08CRU8dew58Bovg9XDJ\n2gzTIE3YBGwBJ4Mkba0K0FEp3MPpLryRjhIWdoV4FhJyUi2HK6umooTvhYjTprDx2Apdyz\/BiaMF\n66gNMPbXgCtTG56ndMkqhVuY6sDrp7cI8x\/A4kwzZkarMTbEw9XeDBSWUuAWsR1OwdtA8vkW+g5r\ncdh5C9y99GDt+RUO0jQlKoWbn2zHyyc3MV6fg0bnI+jnRmOwLwMMtgHKKqjoJAQ6Jd0Wbkw9OIXo\nwIy2HmZ0TTiSf5BwOcesLVlaOg4pm9VUAqdYmV4+vgZxfRouZodjuCsT5QI\/9LTEQVAZIBfkGq4n\nOKdJiE78GdRYPaFJgAYO+GlID3hqbFRq5d69mnsPp1iZXj25gWVJOyTjAoxfL0FrayT8k\/aCW0RG\nnN0BRNkZopRwiLxkEspznNFATKqR1zqJoac6DCjqIiXBLW58+3JGvLoygKcL3Vie68CrZ6N4\/ewW\noXkdRCXriWWgDMP9OSiv8gUlSg\/FXApYlvsQZKaP7DhLRBjoI9V4n3wYDD3XiUyIVh8O\/QJK2Uoe\nzl6QTolL5dvI2FABAcPDyC85xECcIQaiChPDZbh5OVe+MsVwDsElXBexSRbg57iggLAvbqItOFZG\n7+3LOmKT0CZBS8c+\/ss\/XkHp4qXMmRE+eltiIRkrx5XOZJxvCEPX2UjCT0Nxj9hOxgYL5QtBUYk7\nfKJ34xhDG9lsW7CDzcH2NoUgmxL74X8qhkIpw7Ey3y0Z7OGgo4yB8kBLFJx2RIHLHiQabUV+pA3R\n1gzMT1RB1BqPhDQSHBnbQGHuREqiBWJM97xvq8piUlyFlvIQdBzaJTf+hK\/+ijGqM\/jbNMH4Wp3Y\n5aKJCuaiTciCa8h22Pl\/Dy7bDjwOkUE2qoH759ulWEU+ut+PkbNsiIgXvnrHRqR+8ze0G36Pwh\/W\nwXfDZ+CmueBMOQ3tjeFwYeghPsGUALRFLc9d+XAyKXm9OiO+P3leLiWLM9349e9jWF0exP0BASqd\nLcDU+QKpltoI2PYXWOz4MxzdtOEToA9n+ncwoa4nHONbUJN0JQ7xXxoqHW718eh\/eKt05Sp459zf\ne+vUrVoM9eaiusgbpAAtWLI+x27HtTAN1CAsSwMybTNjfJ4pg1OaOyjgpEvDYhmYwlufPRrE7TvV\nkBBHww+9tZGY3IYKOuhpenDJ3AwTX02YMzTlxv+ThzqhbRtESq+cDE5RufsTbXjxeBgL9zuRXGmF\nCTEft68Wg1fpCXryfrnx+0XsATVgh9xTD1M3geL4I8IDjORSYhWxyVDp79x\/e+vsvWbElZshimtM\nnMiKcf1SFprPhCMuzQp+0XvhFaYPN29d\/ExdJ2\/rkePfZKpkIK5eaREPXOT\/zltTakgIL9iPunNM\n3OjLxuWOZLkwN1fRUVFAQWmmE2isnZlG3howp2+AdeQmqcwZlAoYFuAqPGplCFlSXS3RWMnGm2di\n9A1ywOL+JL8vqTvLQLcgGhy3Q2BTLYlTmDeSaGZIDjiIimwnsk2MlsQufotqtM7B0lCkAFQk0\/co\nJm9W4STPHIFpe9AiPIEaNhX0XXoIMvwR\/Ozj8Nupg8SjRjhbQtuoMjhZHLMy+h3gv6t5GMImFuJy\nDqOcWDhl1xHceMf3xp8bScKZMqrq7\/O8XSzoXs6H4OFkAcoxM5CPmsLV3gTHbY0R5m+Pi+di0Vob\nIr+OKJfD2aAk4ygaSr1Vf28iCxbVQY3p5yBl+DiA7m2HQC9b0DyOwN\/dGr5kEtITKGgs80MWsRAE\nm+sjN5qEuiLPjwOniHgWhR4bRkFMCBnRwW7EgdoFJ+jHER7ojBNBTsQ75waW7T6cMN5FDIiH+JPc\nfKafovHTEmhgx\/kj5aQvkmN8kBRFxalIL2QkOCM3loQKjrP4QgNLbc2nCl5WuJCbEYbC9FDkc0KQ\nm8pETgoDOcmeqjnx\/8+APJYaPy8qk58fhQ+zPC9U+Sf+PxJleVHW\/PxIsQJQ9v1TsfwLfl+\/\/wma\nrosAAAAASUVORK5CYII=",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/glitchmas_cracker-1334267741.swf",
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
	"glitchmas",
	"toys"
];
itemDef.keys_in_location = {
	"p"	: "pickup"
};
itemDef.keys_in_pack = {
	"r"	: "drop",
	"g"	: "give",
	"u"	: "pull",
	"t"	: "stop_waiting"
};

log.info("glitchmas_cracker.js LOADED");

// generated ok 2012-05-25 10:00:15 by eric
