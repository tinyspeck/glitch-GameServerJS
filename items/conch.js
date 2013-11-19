//#include include/npc_quests.js, include/npc_conversation.js, include/takeable.js

var label = "Conch";
var version = "1350497311";
var name_single = "Conch";
var name_plural = "Conchs";
var article = "a";
var description = "A Conch!";
var is_hidden = false;
var has_info = true;
var has_infopage = false;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 700;
var input_for = [];
var parent_classes = ["conch", "takeable"];
var has_instance_props = false;

var classProps = {
	"collection_id"	: "",	// defined by takeable
	"music_duration"	: "45000"	// defined by conch
};

var instancePropsDef = {};

var verbs = {};

verbs.reminisce = { // defined by conch
	"name"				: "reminisce",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 50,
	"tooltip"			: "A remembering",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		var quests = this.getAvailableQuests(pc);
		if (num_keys(quests.offered)) return {state:'enabled'};

		return {state:null};
	},
	"handler"			: function(pc, msg, suppress_activity){

		this.offerQuests(pc, msg);
		return true;
	}
};

verbs.pickup = { // defined by conch
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

		if (pc.has_blown_conch || (pc.getQuestStatus('last_pilgrimage_of_esquibeth') != 'done')) { 
			return {state:'enabled'};
		}

		return {state:null};
	},
	"handler"			: function(pc, msg, suppress_activity){

		return this.parent_verb_takeable_pickup(pc, msg, suppress_activity);
	}
};

verbs.give = { // defined by conch
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

		if (pc.has_blown_conch || (pc.getQuestStatus('last_pilgrimage_of_esquibeth') != 'done')) { 
			return {state:'enabled'};
		}

		return {state:null};
	},
	"handler"			: function(pc, msg, suppress_activity){

		return this.parent_verb_takeable_give(pc, msg, suppress_activity);
	}
};

verbs.drop = { // defined by conch
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

		if (pc.has_blown_conch || (pc.getQuestStatus('last_pilgrimage_of_esquibeth') != 'done')) { 
			return {state:'enabled'};
		}

		return {state:null};
	},
	"handler"			: function(pc, msg, suppress_activity){

		return this.parent_verb_takeable_drop(pc, msg, suppress_activity);
	}
};

verbs.play_for = { // defined by conch
	"name"				: "play for",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: true,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 56,
	"tooltip"			: "Let someone else listen",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (pc.has_blown_conch || (pc.getQuestStatus('last_pilgrimage_of_esquibeth') != 'done')) { 
			return {state:'enabled'};
		}

		return {state:null};
	},
	"handler"			: function(pc, msg, suppress_activity){

		var failed = 0;
		var orig_count = this.count;
		var self_msgs = [];
		var self_effects = [];
		var they_msgs = [];
		var they_effects = [];

		var targetPC = pc.location.activePlayers[msg.object_pc_tsid];
		if (!targetPC){
			pc.sendOnlineActivity("Hey! Where'd they go?");
			return false;
		}

		var context = {'class_id':this.class_tsid, 'verb':'play_for'};

		// Start overlays
		var duration = this.getClassProp('music_duration');
		targetPC.apiSendAnnouncement({
			type: 'pc_overlay',
			item_class: this.class_tsid,
			duration: duration,
			pc_tsid: targetPC.tsid,
			locking: false,
			dismissible: false,
			delta_x: 20,
			delta_y: -120,
			width: 60,
			height: 60,
			uid: targetPC.tsid+'_musicblock_self'
		});

		targetPC.apiSendAnnouncement({
			type: 'pc_overlay',
			swf_url: overlay_key_to_url('musicblock_notes'),
			duration: duration,
			pc_tsid: targetPC.tsid,
			locking: false,
			dismissible: false,
			delta_x: 140,
			delta_y: -100,
			width: 180,
			height: 180,
			uid: targetPC.tsid+'_musicblock_notes'
		});

		targetPC.location.apiSendAnnouncementX({
			type: 'pc_overlay',
			item_class: this.class_tsid,
			duration: duration,
			pc_tsid: targetPC.tsid,
			delta_x: 20,
			delta_y: -120,
			bubble: true,
			width: 40,
			height: 40,
			uid: targetPC.tsid+'_musicblock_all'
		}, targetPC);

		if (!targetPC.conch_heard){
			var xp = targetPC.stats_add_xp(50, false, context);
			they_msgs.push("This makes you think of Esquibeth! Neato!");
			they_msgs.push("It was generous of "+pc.linkifyLabel()+" to share it!");
		}
		else if (targetPC.conch_heard < time() - (30.5 * 24 * 60 * 60)){
			var xp = targetPC.stats_add_xp(100, false, context);
			they_msgs.push("Mmmnn. This tune brings back memories.");
			they_msgs.push("It was generous of "+pc.linkifyLabel()+" to play it for you!");
		}
		else if (targetPC.conch_heard < time() - 14400){
			var today = current_gametime();
			var today_key = today[0]+'-'+today[1]+'-'+today[2];

			var heard_today = 0;
			
			var last_play = timestamp_to_gametime(targetPC.conch_heard);
			var last_play_key = last_play[0]+'-'+last_play[1]+'-'+last_play[2];

			if (last_play_key == today_key) heard_today++;
			

			if (heard_today == 0){
				var xp = targetPC.stats_add_xp(10, false, context);
				they_msgs.push("Ah, haven't heard that yet today!");
			}
			
			they_msgs.push("It was generous of "+pc.linkifyLabel()+" to play it for you!");
		}
		else{
			they_msgs.push("Good stuff, but play it too much and it gets stale, you know?");
			they_msgs.push("Still, it was generous of "+pc.linkifyLabel()+" to share it!");
		}

		if (xp){
			they_effects.push({
				"type"	: "xp_give",
				"value"	: xp
			});
		}

		var mood = targetPC.metabolics_add_mood(2);
		if (mood){
			they_effects.push({
				"type"	: "metabolic_inc",
				"which"	: "mood",
				"value"	: mood
			});
		}

		var energy = pc.metabolics_lose_energy(2);
		if (energy){
			self_effects.push({
				"type"	: "metabolic_dec",
				"which"	: "energy",
				"value"	: energy
			});
		}

		targetPC.announce_sound(this.class_tsid.toUpperCase(), 0, 0, true);
		targetPC.conch_heard = time();

		if (pc.feats_get('mihceal_conch')){
			if (!this.played_for) this.played_for = {};
			if (!this.played_for[targetPC.tsid]){
				this.played_for[targetPC.tsid] = 1;
			}
			else{
				this.played_for[targetPC.tsid]++;
			}
		}

		var pre_msg = this.buildVerbMessage(msg.count, 'play for', 'played for', failed, self_msgs, self_effects, [], targetPC, 'for');
		pc.sendActivity(pre_msg);
		var pre_msg = this.buildVerbMessage(msg.count, 'hear', 'heard', failed, they_msgs, they_effects, []);
		targetPC.sendActivity(pre_msg);

		return failed ? false : true;
	}
};

verbs.play = { // defined by conch
	"name"				: "play",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 57,
	"tooltip"			: "Put it to your ear",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (pc.has_blown_conch || (pc.getQuestStatus('last_pilgrimage_of_esquibeth') != 'done')) { 
			return {state:'enabled'};
		}

		return {state:null};
	},
	"handler"			: function(pc, msg, suppress_activity){

		var failed = 0;
		var orig_count = this.count;
		var self_msgs = [];
		var self_effects = [];
		var they_effects = [];

		var context = {'class_id':this.class_tsid, 'verb':'play'};

		// Start overlays
		var duration = this.getClassProp('music_duration');
		pc.apiSendAnnouncement({
			type: 'pc_overlay',
			item_class: this.class_tsid,
			duration: duration,
			pc_tsid: pc.tsid,
			locking: false,
			dismissible: false,
			delta_x: 20,
			delta_y: -120,
			width: 60,
			height: 60,
			uid: pc.tsid+'_musicblock_self'
		});

		pc.apiSendAnnouncement({
			type: 'pc_overlay',
			swf_url: overlay_key_to_url('musicblock_notes'),
			duration: duration,
			pc_tsid: pc.tsid,
			locking: false,
			dismissible: false,
			delta_x: 140,
			delta_y: -100,
			width: 180,
			height: 180,
			uid: pc.tsid+'_musicblock_notes'
		});

		pc.location.apiSendAnnouncementX({
			type: 'pc_overlay',
			item_class: this.class_tsid,
			duration: duration,
			pc_tsid: pc.tsid,
			delta_x: 20,
			delta_y: -120,
			bubble: true,
			width: 40,
			height: 40,
			uid: pc.tsid+'_musicblock_all'
		}, pc);


		if (!pc.conch_heard){
			var xp = pc.stats_add_xp(50, false, context);
			self_msgs.push("It reminds you of Esquibeth! Neato!");
		}
		else if (pc.conch_heard < time() - (30.5 * 24 * 60 * 60)){
			var xp = pc.stats_add_xp(100, false, context);
			self_msgs.push("Mmmnn. This tune brings back memories.");
		}
		else if (pc.conch_heard < time() - 14400){
			var today = current_gametime();
			var today_key = today[0]+'-'+today[1]+'-'+today[2];

			var heard_today = 0;
			var last_play = timestamp_to_gametime(pc.conch_heard);
			var last_play_key = last_play[0]+'-'+last_play[1]+'-'+last_play[2];

			if (last_play_key == today_key) heard_today++;

			if (heard_today == 0){
				var xp = pc.stats_add_xp(10, false, context);
				self_msgs.push("Ah, haven't heard that yet today!");
			}
		}
		else{
			self_msgs.push("Good stuff, but play it too much and it gets stale, you know?");
		}

		if (xp){
			self_effects.push({
				"type"	: "xp_give",
				"value"	: xp
			});
		}

		var mood = pc.metabolics_add_mood(2);
		if (mood){
			self_effects.push({
				"type"	: "metabolic_inc",
				"which"	: "mood",
				"value"	: mood
			});
		}

		var energy = pc.metabolics_lose_energy(2);
		if (energy){
			self_effects.push({
				"type"	: "metabolic_dec",
				"which"	: "energy",
				"value"	: energy
			});
		}

		pc.announce_sound(this.class_tsid.toUpperCase(), 0, 0, true);
		pc.conch_heard = time();


		var pre_msg = this.buildVerbMessage(msg.count, 'play', 'played', failed, self_msgs, self_effects, they_effects);
		pc.sendActivity(pre_msg);

		return failed ? false : true;
	}
};

verbs.blow = { // defined by conch
	"name"				: "blow",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 58,
	"tooltip"			: "Blow the Conch",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (!pc.has_blown_conch && (pc.getQuestStatus('last_pilgrimage_of_esquibeth') == 'done')) { 
			return {state:'enabled'};
		}

		return {state:null};
	},
	"handler"			: function(pc, msg, suppress_activity){

		var failed = 0;
		var orig_count = this.count;
		var self_msgs = [];
		var self_effects = [];
		var they_effects = [];



		var context = {'class_id':this.class_tsid, 'verb':'play'};

		// Start overlays
		var duration = this.getClassProp('music_duration');
		pc.apiSendAnnouncement({
			type: 'pc_overlay',
			item_class: this.class_tsid,
			duration: duration,
			pc_tsid: pc.tsid,
			locking: false,
			dismissible: false,
			delta_x: 20,
			delta_y: -120,
			width: 60,
			height: 60,
			uid: pc.tsid+'_musicblock_self'
		});

		pc.apiSendAnnouncement({
			type: 'pc_overlay',
			swf_url: overlay_key_to_url('musicblock_notes'),
			duration: duration,
			pc_tsid: pc.tsid,
			locking: false,
			dismissible: false,
			delta_x: 140,
			delta_y: -100,
			width: 180,
			height: 180,
			uid: pc.tsid+'_musicblock_notes'
		});

		pc.location.apiSendAnnouncementX({
			type: 'pc_overlay',
			item_class: this.class_tsid,
			duration: duration,
			pc_tsid: pc.tsid,
			delta_x: 20,
			delta_y: -120,
			bubble: true,
			width: 40,
			height: 40,
			uid: pc.tsid+'_musicblock_all'
		}, pc);


		// Rewards for The Last Pilgrimage of Esquibeth

		var xpAmt = 1000;
		var favorAmt = 150;


		var val = pc.stats_add_xp(xpAmt, true);

		var favor = pc.stats_add_favor_points("grendaline", favorAmt);
			
		apiLogAction('CONCH_BLOW', 'pc='+pc.tsid, 'xp='+intval(val), 'favor='+intval(favor));

		if (val){
			self_effects.push({
				"type"	: "xp_give",
				"which"	: "",
				"value"	: val
			});
		}

		if (favor) {
			self_effects.push({
				"type"	: "favor_give",
				"which"	: "grendaline",
				"value"	: favor
			});
		}

		pc.has_blown_conch = true;

		var pre_msg = this.buildVerbMessage(msg.count, 'blow', 'blew', failed, self_msgs, self_effects, they_effects);
		if (!suppress_activity && pre_msg) pc.sendActivity(pre_msg);


		pc.announce_sound(this.class_tsid.toUpperCase(), 0, 0, true);
		pc.conch_heard = time();


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

function parent_verb_takeable_pickup(pc, msg, suppress_activity){
	return this.takeable_pickup(pc, msg);
};

function parent_verb_takeable_pickup_effects(pc){
	// no effects code in this parent
};

// global block from conch
var available_quests = ['last_pilgrimage_of_esquibeth_reminisce'];

function getDescExtras(pc){
	var out = [];
	return out;
}

var tags = [
	"no_rube",
	"no_donate",
	"no_auction",
	"no_mail",
	"no_trade"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-23,"y":-32,"w":48,"h":34},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAH2ElEQVR42s2Ye1OT6RnG\/QZ+hH4E\nP4IfwZlOXbfd2dLWWRkBRVEQQQjI2QCBhBBOIRyEgAQSOYQcSN6cE0hIwiEJL6cgoK7WGrvtzv55\n9bmfGGRtN9qtFN6ZdxCCkx\/Xdd3X\/eQ9d+6Er52dnfP6cZXk3Fm9trbiF7UDUjTX3vnN2QQUE5Jp\nXQ9a629fPJOA+\/u7wrSu++wC7u1t4elE19kETCa3LiV3xbMLyNTTbCRWYdSfUgZdNr3M+qT7\/C\/V\nC1MwtRYNQq+VQdZQJDmFCY3pAx5TSi2vuPDxa6KYyNll9gb9djwZkp4OIFPoophYgWGcZywn8\/NX\nrw4vLHktydh6BIJlHCP9DT97na6\/vf6+8Kd\/pnKyFfwXgRQ3VgWHdQLd8gdoqS+SEVwwYE6apgfg\nWtBxe+XSEtjmx7AW9WN3O4a\/p15jnf3b5zDgx3+8Sfpcc0K3QiIM9kolQb9V9sO7N6nNRBhfJof2\np5emtB3QaVWwWQzYiIcxq+sAAZpnR2GY6IPVOIZtcQXhRQH6MSUOnu3gh3d\/RdA3j9VogL0WRV9H\nJVobivgfY559jHmD+tOAoiheEMWYEJrRwalogtBSA0dbPZzyRrg6HsGllMLd2Qx3VytcikaExvrh\ncxrgtk0itrKI19\/v46cf3+HN6+d4+XwPh\/vbmBrrgnlmCOElAYcHO9jdEWE0aDA7pUFHa9kRpPxR\nseYTcImcNZ8TC\/XlMN7JxXxJHsxlN2GpuA1r1V3Yau7BVlcKe0MZhMYHEJoeYI\/ZR+pF2JvvbK7h\n1ct9Dvf8YBdiLMxtja8FIW6s4DkD3tqMMetHeTz8bjN8LiMHZHlNZd3dBBdbDsB0\/waHM93Lh7m8\nEFbJHQ5mr7vPoRyPKuFsroKzpRph\/QjLmIcDLnqM2GIQ61Ef1iI+bKyHsBGLYG9vGwcMllSLswFa\nMI6gRyHByrIbs5MqWOdGoGqXQFpbKGQ9HjFbk0Lzww9wD26lVasthdBQDoe0kkO52mrhltfD09GA\nZDwKh0XLcmXmUHSbpjVsEKaZ1Qdc1U0xjkRsBctLTlhnB6BqK4NlbpzZ7cI4q6LZyV50yauRf+2r\nnCzHo4SEMndkK4NbIDhmJ9lIinEwBQPrbIK3S4qQtg\/J3QTM02quHsGRnbHVAL8ts0P8q8cxwzI6\nh5mJDihbSjHUW4fB7hr2\/wbYtlHzvpyZUCQ\/kb1Y0iK5i\/ni6zxz3FYOV8FVc7fXwaNs5GD+3lYE\n1O3Y8NkRDQlclYx6dO9urbOO7GBv2sm\/J4UIqK3pLs\/aYE8Nf81lM2Be3wtl6330q6qQdWppMLi1\npQWwVBbxzFHenC1VzM46rpqvp4WDLQ4osDTcif2dBNx2HWzG4SM4mmSyNeS3sgEJ8kyuhj3QPZZx\nSMO4gin7GIaxdlYp\/Sy7StRW5qGx+sYv529zM164pBtJW8uGYqG6mE+pQyrhtnqU7+H6GdyQEsGR\nbqzO6\/DixTPMTamwEnJxOAIju8nm5HacVY6fVYkagnmU\/w7llL76nTNsSCr4YD0db0edJF+4du3y\n+az5C4z2f1CvNm2tS\/aQDUIjfN3NHG6J4LQ9WH6ixi6b0PhagL85gWUUpB6kqtlMRLAcWGD29nBV\nj0eAFJcxu8lWsr206E\/Z9zUpGNBqePZoMOz1TL3mtLVe1SP4+2RYHGRwo90cboVNIKnnsU+C1t3x\nNycY2sEZ26kHCZZUpe+9goErp+6sQtGNb3Dz+pVIVvWOMuh3wkKT+7Aknb3Wh7xGfN3MWo0cS49V\nHC48NYCtoAtiYvnfhoNuwaxl2erj6hFUJOjgmbObxvjvExzdlMdbeV9LPgn3QcVYyt5Ywe2lIna1\n1fDB8Pem1Qsxa8M6DaKGYba6dnj3kb1UL5SpDGB8bQn7SZHZbmegPZjUyvnGoCrJZI6sldbdQvGN\nbz\/\/MCuKcRnlkLYFDQfVilfFKkXdxic2NN7H1dvwWrl6NBxk1zDrtONTTGB0WskodfwmSNq3BFdy\n+4\/4bPUyNq8H3B8A2aagzuPD8d7eiH4IB0wdUo9Uo+HITKbTOs4U6+Wnk4xax8Foe1AHsonFrfw\/\npLJujWxl7WYnlfSA1MPX1czzFxzp4oAJj5kX8\/GpJBVJzQyMbqSF36QsWdtUcxPV5bkou\/Pn1O2C\nbwQC+6+U+\/iwsCKYjgAzChJgeHIQW+ww6RWmeM7SAzF6lCuaXFKPLCSoekl+pOLeVQ0BFeReufDF\nnqewyvlZBmlzkMXxkJPXChWwUd\/PB4DgMgdOsk5y\/zuhvORqTv7V357c4w4CdHc08Q3i7Ux34KrT\nyOCmeG1EGSiB0ZFewdQqK\/4LCq9f0Z8o1Ec5FLx98vc92IhVhxFLXhO3lLqNlKOMpcP+++SN7y7\/\nfz\/3csDedn68SnhtfHURHPUdDcOTYSnKmWoFuZeFXx32\/83imCY8N4ntSICtqCiHo0ohW4f76nh\/\nMbjC03xsITs8TP5HOLY7U3m5v7t0anAvXuzJDtgnrgQ7qRyHUysln7fUT+p6+\/bteQanF1nP0UGT\ntgNtBoKj025h3teaU4Oj6+XLZ5Jne5uwmUZZ6cr5auLPVRrvouDaV6f7nJnUY3lLLZj17POpiVcJ\nbQVWuvhV+\/Ik1FO216Cm4jo73Rbz\/JF6p67c8SdSi76FJD1LMRqGaFOkZnSKwtPm+hfel1YiWxA0\nnwAAAABJRU5ErkJggg==",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-09\/conch-1347408749.swf",
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
	"no_donate",
	"no_auction",
	"no_mail",
	"no_trade"
];
itemDef.keys_in_location = {
	"p"	: "pickup"
};
itemDef.keys_in_pack = {
	"r"	: "drop",
	"o"	: "blow",
	"g"	: "give",
	"y"	: "play",
	"c"	: "play_for",
	"e"	: "reminisce"
};

log.info("conch.js LOADED");

// generated ok 2012-10-17 11:08:31 by martlume
