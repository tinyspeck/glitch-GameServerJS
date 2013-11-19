//#include include/npc_quests.js, include/npc_conversation.js, include/takeable.js

var label = "Play Cube";
var version = "1351620648";
var name_single = "Play Cube";
var name_plural = "Play Cubes";
var article = "a";
var description = "Play Cubes are famous the world over. Re-live some of your favorite quest memories with one simple click. Don't waste another minute, play with your cube now!";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 0;
var input_for = [];
var parent_classes = ["play_cube", "takeable"];
var has_instance_props = false;

var classProps = {
	"collection_id"	: "",	// defined by takeable
	"got_quest_text"	: "Reminisce?",	// defined by play_cube
	"cancel_quest_text"	: "None of them!"	// defined by play_cube
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

verbs.activate = { // defined by play_cube
	"name"				: "activate",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 53,
	"tooltip"			: "SHALL WE PLAY A GAME?",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		var quests = this.getAvailableQuests(pc);
		if (num_keys(quests.offered)) return {state:'enabled'};

		return {state: 'disabled', reason: "There is nothing available to reminisce at the moment"};
	},
	"handler"			: function(pc, msg, suppress_activity){

		this.offerQuests(pc, msg);
		return true;
	}
};

function onContainerChanged(oldContainer, newContainer){ // defined by play_cube
	if (newContainer && !this.isSoulbound()){
		var root = this.getRootContainer();
		if (root && root.is_player) {
			if (!root.has_play_cube && root.getQuestStatus('puzzle_level_color_blockage') == 'done') {
				this.setSoulbound(root);
				root.has_play_cube = true;
			}
		}
	}
}

function onLoad(){ // defined by play_cube
	if (!this.isSoulbound()) {
		var root = this.getRootContainer();
		if (root && root.is_player) {
			if (!root.has_play_cube && root.getQuestStatus('puzzle_level_color_blockage') == 'done') {
				this.setSoulbound(root);
				root.has_play_cube = true;
			}
		}
	}
}

// global block from play_cube
var available_quests = [
	'puzzle_level_color_blockage_rem',
	'puzzle_level_light_perspective_rem',
	'radiant_glare_rem',
	'mental_block_rem',
	'le_miserable_reminisce',
	'join_club_reminisce',
	'btc_room_3_reminisce'
];

var no_chat_echo=true;

function getDescExtras(pc){
	var out = [];
	return out;
}

var tags = [
	"no_rube",
	"no_trade",
	"no_auction",
	"toys"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-18,"y":-32,"w":37,"h":32},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAALYklEQVR42u2Y6VNUZxbG\/Q\/yJ\/hl\npmpqUlNOTcZUZaIDuCRAIBoTg0aRCCi7rMrS2NgsTbM2jez7vkOziUADzQ4Cyr7Kvi9ig+KSxJln\nzvtityyaSaYyyZfcqqduL7fv\/d1zz3nOefvAgd+337cf3yZcT7w3l+Aun010V05H2CmnZTZK9noh\nw0e5mC1RPqrPU6435HstJggO\/jaAft+oxjwNMSb4TKOHwlOYCjTBTLgNFlKEGs3HOB36VaD6V1SH\nhlY37Wc3trqv6\/wJmaY6aHE9jWYXA3S6fY5OF110Op3kUtrqoMZaG4WXP8bQ2lMttX5xqNGVrUOj\naxvS+c2tqeWtl1h7+QrjjzZg8dEfYHvkj\/D85M+4pfs+ks5\/+E7VP+jDwPwy+meX0DuzgJGlR0wq\neVePKrO9G5I7tXBMy1NZxKQovw2LVl4KlpnsA0kYmjwouFPL86VvWXVqYv1J8uzms6mFre+wSlAz\nz98oOisHX3\/8F1gSJIskg5Se\/ivijQ7vAmPvb+j\/DTeDglHXPwpFzxCqHgxA0T2AlsFR1Hb1IrWm\nEd6F5bggCYWB4w0cN7fiew4V2PpA62apQuqYVdhtl5INu6RMDCyrVD3zKximOx5ZXMXE6mMsbb3A\nvOoJlgl08vFTjKw\/QcfELMqa2xEYKIatlRncLIwhsDKGl\/UleNuaIOymE9Jyc1DScg\/1gw85YM\/k\nLHrGp9A7MY2qrj40jk0jtKwaF7wlHEwtDii71+8lqqyHc3YRSY4rUYmwiE2BeWQChKnZGFrdwIPZ\nZa7WhzNc\/CLT87g3MoGh2QV0jNKebqR7ag7Di2u0n8cY3VDj0EMMLqyif24Jg+xG6diF9Q3cn5hB\n99wK+hYf8WhG5cq5Lt3yw5dOrrgWIMVp2nPA69ly1TkiV8tcFr299w3A8MIKJh5tgvIO06qnoMfN\ngffqbTfA1DY6xW9kkACVPYPIaLqHgs4+fmxxSycSSysRJ78DaVoOB2Sv1XIIi9oGdMsv1cCdF4nh\nHpMEaWEZsutbcG96Ee1TC9uanEcvPfJBetzjFJ2R5XXMPH6C8bUNLGw+4zdwj44LLqmEiM7J8mmn\nHFNzYJOYgbNCX4jiUnbBvA3QJTxmN+BlnwD+RVplHTIVDVz5DW3IqWtGSWsXyu51Q9E7jNqBMbRO\nzKF1fBYtTBQxpjbKxSxls+YpmIfHwiYhHV5UmTbxaTCkR8byStfSDr4JaT8P8CtPb\/4jBrc3am2k\nhpFJDlfa\/oA\/mszqemS8Vq6yBXL6rIKSPalKCUF8KixDbuOibyCHtSW4c7fEGriIvOJdIDsB\/WOT\nIMvM45+FZRdCGJ96igOe8bjFAYuaOwhkCKLwKFy2d4adp4j\/yC8qnk5QhLiCEhTUt6KOosii1kyq\n6h7kcOy3WWQVqRU1\/AIyuiAD\/DY4XAPoTlHZCxeUlA73gFA4UoF4BErh7C1+831RhdYBB7IVdiJh\ndCKqqKKKGtth5ngdiemZaG5tx0XzqxAIhfASS2DibA0zF0ecN7OAmYMLbvgFQByTiAi66+TSu2ik\nomikaFfe70dCyV3YUqLz\/H4NuBdOKI3AzdDb8ItOQEhKJkKSM+EZLNN8H5BVZHIAgJaiq4efUNE3\nAjlFws0\/CEJfMSLi4lFZ34iaB42QVcRwhVRHwl8RDml6JET+frC5dg1nvyX\/EwdBQtFuJsiG4QmU\nd\/TwgnsXoJi+c5OEbD\/e\/JI30ATM9nZBMpwViHBA+XDKi1Umy7U2Sv4Syif2w1x6XOUtHdj64RVZ\nDfnX5jp\/3T03jKbJLmy8eInVjQ1E0U0Ym11BXiH5KD2mfrKV+qFxVFKnUAMaOGx3hp3FwQBZ5PZF\n9TUg80ReJMLyGliSKYuzCnh1lrV10UERFPIsNFDvfP7q31zPXv3rjX7Y1uOt5\/AUecPU2hbhMXEU\nwURMra5zQCY1oK6NA8zogtLM\/F2ATOx1JOWr+v0+QLXNWJF7M+soJzvxjYjjgKPk\/Fvfv8Lm2nMs\n1c5hffixBpjpft8AbngIYOniiuSyKkjikjmgkloaUwHZVFnTtvZGisG4+gfzPSsU9efqHNwHeFUc\nzH2tgnInMD6FAy5RWxqQ92Eovxf9iV2YaZnB2owKT158j6cvf0CevJgDmlHFs+ODkzI0gKV0oxlk\nQRUd3Sisa4QzRWZnFe+MILeVjDw4CH0gpmJ9K+Al+pJZx12yjLC0bH7BqdE5VAaUQRFUgbqQKjSE\n1aA1uhHrT7ZIz3j+7QQMo4SfWnnEbYjZC\/NAdn6Jsg2mlDbnbnjuA2Q2ZnVDAFcqssDEdI1NvRWw\nmaYKNgZF5RTyC84trWJ+eRXZnmnIE2aiUJSDirAyDLQMYfmRCoGh0l2AEZTHkwyQ+vDO\/m5HHYUV\nyU5AHrX0XJ4WDIwZNavo\/wpYTcabUFTOLzhM00h\/7wjC7aSIsg9HrGMkElxiIJcVYW5xZR9gDNkF\nA6z9iYB7O8lbAXkreg3YRB5WQy0t7Y5iu4oph24aeyBNlo68uHzcdguHzDkUzbVtGKV5bi9gAp2Y\nA5Kfvg2QtbofA\/SljsUAowpK8am1wzagJc1\/asBqNgzQ3WfToMAuWF6lQKQkCiU0jTS1tCHaPxoC\nE3e0d9xH5\/3ufYApVMkTy2uo2QN4Ofi2Zgh9F2AodRI1oDsVimZg3QnIWhSrwEKyB1e\/QBSX3UFx\naRlKaV9ecRcVd6tQWa1AtaIWilolbkfH7AJMv1u7DUg3uhPQ2D\/kRwGZ\/AjK53YsB2STzD5ANjB4\n0EHMYEuo3QVHxiAjMxupaWlIz8hEUGgyQqQpyMnLR35BIQqK5IjeU8XZ1H0YIJuSfy4gk4jA3gnI\nZOjsRvkzSrk4jejsAoSRgV738ISjsxD2ThG4fEUGsX8k4hMSkZSUjNj4BA5oZHoFvrJI5NPsOEGV\nX70H0Ck9TwN4SXDrnYDsEcdS\/pmS5bBj9eyc5RzQgIZJfXsXDljSRvk1s8TbXhGN6MxyhCEyWDi7\n4qzxZegaGkHr+Jdwue4KP7EYbgJPGBmbUESLUUxT+DgBBuQUvRPwXZUckJAKAXWRJMpjc+pqJy1s\nVWcEvgcPfE2TRlRKGhSNTTykKeXVaKJppH2CFj40zo+uP8X45guMqJ6jf3WTzHyWz4QRGbm44eMP\nYwtruNzyQXR6NjqnlzjgTrifCqiOoCQ2Gce++EqlY\/TNKb7kPOcdANdb3giNiqEIuiOCIsamZ9YN\nmOHWvhZbid2fWUTvwhomN55hjtbFcy+B6R1a+g58mvlfAG\/TBG1sZYdjn32e\/MEHJ97TLNS5DVBI\nL\/kF8UcclSdHPa3AmgZG0dg\/gjIa85ltcBG4Qi3Kszr6rPMhrdxmlzBAy8sRWgWyTsTO+am1PWz9\nA2FMq8OrNHwYe3ihvG8YF2lK3wt27aYIh49oKz88orP\/v5vzokAtI5HE\/rTDdehdtYGFiztv2Mx0\n88mom1+DNvUNceg26i6NtCxoHBzj6xM28jMoJjYDFlDeMkdwDwpBb38\/3Gj5YCqNhLWbAPLScliG\nRmrgPILCcNzg9NTfj+qc+kn\/vxzT1z+oo2eopa1v4KWtZyD\/50m9bkOjC7hoaYsrVCReNKJHUgrk\nUrXW9Qygc2wSDbTvGBlHTWc3WvqHaSFVh3O0QrTx8kZASCicqcCMJaE4R8sIJz8JvnH3IjuJxukL\nJqoPj2h7\/SJ\/HOl8YnBIR9\/wFAM\/elJX+Y9jJ6ZOnTfG+StWsHEXQkzJ7U+TSSGtZyKoj5\/3CYQ5\nTS\/WvhJc9Nm2L5Z\/OqYWOHrGCIePau\/Os\/\/XxqOt+5mJtp6hlCKu1NY3VBlcMMEZSpOz5HfqIvnC\n7Sa0L17Gxwan355nv+Z24sSJ9zi4noE9AScz8I+0j8sPH9XR+v3\/6N9i+w\/r51NzvEeakAAAAABJ\nRU5ErkJggg==",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-10\/play_cube-1349819607.swf",
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
	"no_auction",
	"toys"
];
itemDef.keys_in_location = {
	"p"	: "pickup"
};
itemDef.keys_in_pack = {
	"r"	: "drop",
	"c"	: "activate",
	"g"	: "give"
};

log.info("play_cube.js LOADED");

// generated ok 2012-10-30 11:10:48 by mygrant
