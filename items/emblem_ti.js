//#include include/takeable.js

var label = "Emblem of Tii";
var version = "1346119666";
var name_single = "Emblem of Tii";
var name_plural = "Emblems of Tii";
var article = "an";
var description = "This Emblem of Tii is more than just a flashy tchotchke to add to your flashy tchotchke collection. How much more? That's for you to find out.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 0;
var input_for = [];
var parent_classes = ["emblem_ti", "emblem_base", "takeable"];
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

verbs.iconize = { // defined by emblem_base
	"name"				: "iconize",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 53,
	"tooltip"			: "",
	"get_tooltip"			: function(pc, verb, effects){

		return 'Combine 11 Emblems of '+capitalize(this.get_giant())+' to form an Icon';
	},
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (pc.countItemClass(this.class_tsid) >= 11) { return {state:'enabled'}; }
		else { return {state:null} }
	},
	"handler"			: function(pc, msg, suppress_activity){

		var failed = 0;
		var orig_count = this.count;
		var self_msgs = [];
		var self_effects = [];
		var they_effects = [];

		if (pc.countItemClass(this.class_tsid) < 11) {
			failed = 1;
		}
		else {

			// Delete this emblem.
			this.apiDelete();

			// Get 10 more emblems of the same type and delete them
			var emblem = null;
			var i = 0;
			while (i < 10) {
				emblem = pc.findFirst(this.class_id);
			
				if (!emblem) { 
					// We better hope this never happens, because if it does, we've already deleted some 
					// of the emblems.
					failed = 1;
					break;
				}

				emblem.apiDelete();
				i ++;
			}

			var giant = this.get_giant();

			// Create the icon
			if (giant == 'ti') {
				giant = 'tii';
			}
			
			var icon = pc.createItemFromGround('icon_'+giant, 1);

			if (failed == 0) {
				pc.sendActivity('*Zap!* 11 Emblems of '+capitalize(giant)+' combined to form an Icon of '+capitalize(giant)+'.');

				pc.quests_inc_counter('icons_created', 1);
			}
			else {
				// This would happen if we somehow lost an emblem between displaying the tooltip and calling this 
				// function. Not sure how that can happen, but display a nice message just in case.
				pc.sendActivity('You thought you had 11 Emblems of '+capitalize(giant)+' but you were wrong. No Icon for you!');
			}
		}

		return failed ? false : true;
	}
};

verbs.spend = { // defined by emblem_base
	"name"				: "spend",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_single"			: 1,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 54,
	"tooltip"			: "",
	"get_tooltip"			: function(pc, verb, effects){

		var achievement = this.getUnlockAchievement(pc);
		if (achievement){
			var skill_name = this.getUnlockSkill(pc);
			return 'Use this emblem to unlock the skill '+skill_name+' (the emblem will be destroyed)';
		}
		else {
			var skill = pc.skills_get_learning();
			if (skill) {
				return 'Reduces the learning time of '+skill.data.name;
			}
		}
	},
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		var skill_name = this.getUnlockSkill(pc);
		if (skill_name) return {state:'enabled'};	// spend the emblem to unlock a skill
		else {
			var skill = pc.skills_get_learning();
			if (skill) {
				var giant = this.get_giant();
				var skill_info = pc.get_skill_info(skill, giant, 1000);

				if (skill_info.speed_up > 0) {
					return {state:'enabled'}; // spend the emblem to speed up learning a skill
				}	
				else {
					return {state:'disabled', reason:"Your learning is already accelerated to the max. More emblems won't help!"};
				}
			}
			else return {state:'disabled', reason:"You are not learning a skill."}
		}
		return {state:null};
	},
	"handler"			: function(pc, msg, suppress_activity){

		var failed = 0;
		var orig_count = this.count;
		var self_msgs = [];
		var self_effects = [];
		var they_effects = [];

		var achievement = this.getUnlockAchievement(pc);
		var skill_name = this.getUnlockSkill(pc);

		if (achievement && skill_name){
			pc.prompts_add({
				is_modal : true,
				txt		: 'Are you sure you want to use this <b>Emblem of '+capitalize(this.get_giant())+'</b> to unlock the skill <b>'+skill_name+'</b> (the emblem will be destroyed)?',
				choices		: [
					{ value : 'yes', label : 'Yes' },
					{ value : 'no', label : 'No' },
				],
				escape_value: 'no',
				callback	: 'prompts_itemstack_modal_callback',
				itemstack_tsid: this.tsid
			});

			return true;
		}
		else {
			var giant = this.get_giant();
			var skill = pc.skills_get_learning();
			var skill_info = pc.get_skill_info(skill, giant, 1000);

			if (skill) {
				
				// If we have the yellow crumb flower buff, learning acceleration durations are increased
				var multiplier = pc.buffs_has('yellow_crumb_flower') ? 1.05 : 1.0;

				if (skill.data && skill.data.giants[giant]) {
				 	var secondary = skill.data.giants[giant];
					var primary = intval(skill.data.giants[giant].primary);
				}
				else {
					var secondary = false;
					var primary = false;
				}

				pc.apiSendMsg({
		  			type: 'emblem_start',
		  			itemstack_tsid: this.tsid,
					
		  			speed_up: skill_info.speed_up * multiplier,  //amount of seconds spending the emblem will speed things up by
		  			is_primary: primary,  //is this giant the primary one for learning a skill
		  			is_secondary: secondary  //is this giant secondary (passing both false means the giant isn't associated)
					});

				return true;	

			}
			else{
				failed = 1;
			}
		}

		var pre_msg = this.buildVerbMessage(msg.count, 'spend', 'spent', failed, self_msgs, self_effects, they_effects);
		if (!suppress_activity && pre_msg) pc.sendActivity(pre_msg);

		if (!failed) {
			this.apiDelete();
			pc.items_removed(this);
		}

		return failed ? false : true;
	}
};

verbs.caress = { // defined by emblem_base
	"name"				: "caress",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 55,
	"tooltip"			: "Roll it around in your hand",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (this.canUse(pc, 'caress')) return {state:'enabled'};
		return {state:'disabled', reason: "You've already caressed an Emblem of "+capitalize(this.get_giant())+" today."};
	},
	"handler"			: function(pc, msg, suppress_activity){

		var failed = 0;
		var orig_count = this.count;
		var self_msgs = [];
		var self_effects = [];
		var they_effects = [];

		var val = pc.metabolics_add_mood(25 * msg.count);
		if (val){
			self_effects.push({
				"type"	: "metabolic_inc",
				"which"	: "mood",
				"value"	: val
			});
		}

		this.use(pc, 'caress');

		var pre_msg = this.buildVerbMessage(msg.count, 'caress', 'caressed', failed, self_msgs, self_effects, they_effects);
		if (!suppress_activity && pre_msg) pc.sendActivity(pre_msg);

		return failed ? false : true;
	}
};

verbs.consider = { // defined by emblem_base
	"name"				: "consider",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 56,
	"tooltip"			: "Think on the emblem a bit",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (this.canUse(pc, 'consider')) return {state:'enabled'};
		return {state:'disabled', reason: "You've already considered an Emblem of "+capitalize(this.get_giant())+" today."};
	},
	"handler"			: function(pc, msg, suppress_activity){

		var failed = 0;
		var orig_count = this.count;
		var self_msgs = [];
		var self_effects = [];
		var they_effects = [];

		var val = pc.metabolics_add_energy(20 * msg.count);
		if (val){
			self_effects.push({
				"type"	: "metabolic_inc",
				"which"	: "energy",
				"value"	: val
			});
		}

		this.use(pc, 'consider');

		var pre_msg = this.buildVerbMessage(msg.count, 'consider', 'considered', failed, self_msgs, self_effects, they_effects);
		if (!suppress_activity && pre_msg) pc.sendActivity(pre_msg);

		return failed ? false : true;
	}
};

verbs.contemplate = { // defined by emblem_base
	"name"				: "contemplate",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 57,
	"tooltip"			: "Ponder the emblemness of this",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (this.canUse(pc, 'contemplate')) return {state:'enabled'};
		return {state:'disabled', reason: "You've already contemplated an Emblem of "+capitalize(this.get_giant())+" today."};
	},
	"handler"			: function(pc, msg, suppress_activity){

		var failed = 0;
		var orig_count = this.count;
		var self_msgs = [];
		var self_effects = [];
		var they_effects = [];

		var val = pc.stats_add_xp(30 * msg.count, false, {'verb':'contemplate','class_id':this.class_tsid});
		if (val){
			self_effects.push({
				"type"	: "xp_give",
				"which"	: "",
				"value"	: val
			});
		}

		this.use(pc, 'contemplate');

		var pre_msg = this.buildVerbMessage(msg.count, 'contemplate', 'contemplated', failed, self_msgs, self_effects, they_effects);
		if (!suppress_activity && pre_msg) pc.sendActivity(pre_msg);

		return failed ? false : true;
	}
};

function canUse(pc, verb){ // defined by emblem_base
	if (pc.achievements_get_daily_label_count(this.class_tsid, verb)) return false;

	return true;
}

function doSpend(pc, msg){ // defined by emblem_base
	var skill = pc.skills_get_learning();
	if (skill) {
		var giant = this.get_giant();
		var info = pc.get_skill_info(skill, giant, 1000);

		// If we have the yellow crumb flower buff, learning acceleration durations are increased
		var multiplier = pc.buffs_has('yellow_crumb_flower') ? 1.05 : 1.0;

		// accelerate
		pc.skills_start_acceleration(info.speed_up * multiplier);
	}

	this.apiDelete();
	pc.items_removed(this);
}

function getUnlockAchievement(pc){ // defined by emblem_base
	var giant = this.get_giant();
	var levels = [1];

	for (var i=0; i<levels.length; i++){
		var level = levels[i];

		var achievement = 'emblem_skill_unlock_'+giant+'_'+level;
		if (!pc.achievements_has(achievement)){
			return achievement;
		}
	}

	return null;
}

function getUnlockSkill(pc){ // defined by emblem_base
	var achievement = this.getUnlockAchievement(pc);
	if (achievement){
		var skills = pc.skills_get_by_achievement(achievement);
		// return the first one?
		if (skills.length) return pc.skills_get_name(skills[0]);
	}

	return null;
}

function get_giant(){ // defined by emblem_base
	return this.class_tsid.replace('emblem_', '');
}

function modal_callback(pc, value, details){ // defined by emblem_base
	var failed = 0;
	var orig_count = this.count;
	var self_msgs = [];
	var self_effects = [];
	var they_effects = [];

	var achievement = this.getUnlockAchievement(pc);
	var skill_name = this.getUnlockSkill(pc);

	if (achievement && skill_name && value == 'yes'){
		pc.achievements_grant(achievement);
		self_msgs.push('You are now able to learn '+skill_name+'.');
	}
	else{
		failed = 1;
	}

	var pre_msg = this.buildVerbMessage(1, 'spend', 'spent', failed, self_msgs, self_effects, they_effects);
	if (pre_msg) pc.sendActivity(pre_msg);

	if (!failed) {
		this.apiDelete();
		pc.items_removed(this);
	}

	return failed ? false : true;
}

function use(pc, verb){ // defined by emblem_base
	pc.achievements_increment_daily(this.class_tsid, verb, 1);
}

function getDescExtras(pc){
	var out = [];

	// automatically generated source information...
	out.push([2, "This can be obtained by earning favor with Tii. The quickest way to earn favor is by donating to Shrines."]);
	out.push([2, "This item belongs to a collection which grants you the achievement <a href=\"\/achievements\/trophies\/emblems-trophy\/\" glitch=\"external|\/achievements\/trophies\/emblems-trophy\/\">Emblems Trophy<\/a>"]);
	return out;
}

var tags = [
	"no_rube",
	"no_vendor",
	"no_donate",
	"emblem",
	"emblems_icons"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-23,"y":-47,"w":47,"h":47},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAALE0lEQVR42s1YeVRU1xn3\/1DZ92UE\nY0BUUIgagTCK7IuAyL4zMAwgDJuAKA4I6CCMAxgRFEHZUQFJRBIVRomaaMUhadyqdZo0JjVJM23S\nnNPT055fv\/tUYgooaeec5J3zO+++++679\/d999vuW7BAQ9e\/vukOnhwRKRb8Gq9\/ftma+N3dSnRU\nvq761ZHDt128z67m4VtlIRFc3f7S8eoePtSdjhokcEL7zkTxnAvfGcuRMHIMV\/vCVGz8DA3\/uVX8\nw0O56m+3y3GpJwrnjoWpHl4r0wzJHx7WK66filbO9f73Y+kKRu5KVwS+\/ECMe2NZSqbV522TEWNj\npoZj0V7urGiROmtrRnu0FV9NluDLD3Ogvlc3xBZ7\/v3YwGbeuY7goVsX0nCmJQDvtYeAtT8ez1Yr\nTkWKxwfD+X\/\/g1z1zWQBHl3NweWezWgrW8XX2PaePRzEvzWahMfXczk8uJiJR5M71bevbFNMXUhX\n3ruai0cf74T6QfUMfH13N1Q3inDr0lZMjaagp5oPNpdGCTaXLXO8ORiDL0h65UAcrvRF4uZ7qfh8\nqhRf3SnHxGASGkrXoSDOegbKhEvRJffFH2+UcGMZ0dsXhDiy00GiUS89KnFSfjKSiOvD8bjzfg4e\nfFiIweYQxHroYIurDqLcDRDnYYr4jaZIeA6xG4wR+aYewlx+g3LRMlwfEeJPyu2YGIhRnT8Rrq0x\ngi3FNtrdMr7q3mUxPnw7BfnRPES66xEBEyR6miHF2xypvuYQ+lkg3f8JWDuN+tg7NiZmvTEJshBH\n92zAZ5PFuDIcr2Dh5vuHjaovrhfj8w8K1Z9OZCseK3dJZosC0w4xW\/\/VYYH4xlkBbo4KkRpgjGi+\nMaehFB8iRWQyAy2xdZMVckKsIA7hcWDt7GArZAZZcoQFNDaBiMZ5GKBplyvuX8nF1Pks3D8vxNRQ\nPHcfbfHD8co1eO9YpIopZQaRB+8XDT2eqlD++y+dYibdP744Kn\/8iRSXhxLw0fkMlCYv4baNaYRp\nhxFjRPLDFr0QOUSYEU0jrSZ5mSHZxwgDTUH43Vgmevd5YKjOCyNNPmgsXCZv3GY3twNN9MYqb40k\n4xmudIXjbFswbo1noq7AiaR\/sqVsoSzSWN5m3jSJAgb2TMgLZbDikPsU4hBLEohtuxnNYYKsUAtc\nGYjH5VNxGG8LIc2txaxae\/6S59tJrvVHQTkYhyGZF\/qkG7gJ+uQ+EPgak\/YMkexpTPZmSouZcch6\nhiAG8+nnzAAzZASaPkGAKURPkepjjGQvY8R7GKFCZI9rw0lQdG+BLM\/u5UWGlCRo3umkvnYiClOn\n4+nDcFx7OwnbE18luyNPJYJJngZk+PoQeBsglcHnRwh9DCH0NUKteA32Eery1qI29wlqcpwgzVmF\nvdmrUJW5EhUZKzmhTx7ww3hvJOT59vMLPbU5tsH78+zVHVUuONexGSfk3hCQ5BKh46zB+P9BuJs+\nZAWraKtj0S3zmH9slApttBtKHCRjZIMtknXc1u5KXYGvKdjOB0GrtRHhpoNoCkUxfL3pe5S7Lra4\naKNTFkRBO5\/aeiiMscFF0uD5rmjlX1WH2m9d2q5gUE1Wv5jw8OFNYmYbdbmONLE+dqbY4dGNYvQ1\nbIJs2xtcuzzDGR8MJtPkZKf1QVwfw+a1Wujc54vLJ+OR4snMQZ8zgcGDIZAXuaBHFohznfFkh\/rI\nDLbA2dYgjBwJxOXO8GlcbA\/FnoxXZ\/fo7z9tFk\/0J+A8Jf5ySlfRfH3sSLLFw4lsTPRGo48ciLXb\nKtfjxhBlmKEkTFAJxfoYIly10UUETzaGUPwzJicxIYcyRWOpO3KjbNFTF4CR1ggkbiTbJWc6fcAX\nw01+aMx2pJDjiUvHNnM4XrVupuN8p2pKnDydhtONPhg9HEhSrOAIliYswd13U+eFcJeFFMj1yOMN\nUUeLXmgNgSRpCWUXI+rTQ1cNEXorGElEUBhgjqEDPhho8ILiaCh6pe7kVEuVFSJrBUFVkbGIv+DU\ngUDx\/fdLJHfHCuVXe+Px7sEAdFW74+2DPuR9KxFDW1wSa42PBmPnhfB1C5HipQ+RnzGKIngY3O+L\ngkgbioGGpDVddOz1wkmZLxE0RHqQBQbqPdFXt4HI8WnHFqmYDzxTWJXAmregUrS4\/Z0GX4wSMYaL\nbaE43eCNwfqNOFC0htNgEeXf33aRXYgcIKKYx9rZFJzHqQZsLlnN9V1o8ub6txDBflkAbp8RUFjS\nRxqFH4Z3mrfgWOUGHKvaiN7qDdwWZ1FQP7XfA8erXVEhtFGXpVjPTLc7BKa8hgIHnCGSz9C3dz1O\n1PHRTVIxJ5Gm2+LyYV+MyNZjcI8L136GMzSut3zt9HPoG1qcIOUpyxHlpstta5KnLg7kOkCa4YjW\n8vXo2OVCTmKA0kRbbp2mHU5EznzuI8COZMvg0iQrdWmyFRi2J\/MUrbtWo6fGHaJNlqgV2WKsnj8v\nHC91QleZE7rLnGegrdgZZ2rd0VrkTAQNsZ9SaDcJXF\/kIP\/5xeqONapjkjWUAVYiJ9gcFfE22E2o\nSLCexu6fwAaV01iMysTFqHp6Z9hNbfY9G8dydpq\/GW35OrRJXsfokXCqcMraWZEyz7NID\/9oxZto\nKnGgo6QbUvzMOYmTvQwpphlyBi+chhGHdPLSdH9jiKZhwoH1pZPDCDkYUVykimijEaTZK8l+HcnT\nl6Ip3wkn9m5AU+lq9c3x4pef9u5fK5f0VLrTx3ZoKV2JwxI3qmYo0XubUA1oSvWf+Y8g7WZTwJ0N\n7N3zY9MpbQp8TCAOs0bPXjc05tujo8IVA\/vIcar4YGtWiZa8vHA4eTBE0lnuhrZdb0CWvQT9Na6U\n\/Ndw9RwrUlmB+nzNVzAHnh\/DCliu4g60wpkmf7yVb4f94mU4WeOBJrJJhhaKCPuy7VEQY8p7IcF+\neYCiQ+KKh+Mi0uIyyLIWo1\/qSmFn3ROSrCakIpRVzy8rWMUUSlj9yAQrirXFKZkn3sqzRaWAh70Z\ndsiPMVPlRhoP5UaZSOiuLEkg4SONZt9mlv\/GOhPa26ksP06hgKm8nsJDXrgxaoRWOFy8nEKPJ1e4\nsjJeFPCEaA5phxHJfQrWZn3snSjAkjuzFMXYYYSCf62Ih\/IkC\/XWMEOxMFx3RpG6XbB47i3OjTSV\nV6e\/Rtu6nIOUJBSTVGyiCqG9siLBFIe22VP6CkRZygpOm4xo2tMDEyPMCLE26+OECOShv84HgzJ3\n7BWYY2ecBSsm2v\/nU1zmZgNJRpiBgoG1n0lZU\/i6vCTaEsURhhQqjHCkZDmG5CwLbIQklQJzmiMq\nnoK1G7atQ490Iwbr3CBNJWLRBqhIXsR5a3PRWjo0Fcs1ej4eaY3hVaYuUe8RvAZxsAEKQnWwK1qP\nw+Ei+xmoS7fi3pVG6NJ5RR97hLbc\/xt2iuvbsx6V6XbQ+K+2\/AizdnnmCpwizztU6ExhQ1ed6ael\nzPLXwn9ja4CWOs1TayjZT1uVG2GC4lhLlMbzyJaXgs3B2honKNikk1ibbo9+0kBthj0EQTqcLQlD\n9NsrU5bggHgll8tZ4N0Rt+gnf8TSgnT47PuMUAM1myM\/0kzzBGlyvlRgB4ZtkRZICdSZDgfCTXqS\nckpnR7evxaECZ+79bHMIPXW1i6MskRKgI9c4wfRgA2V+OB0tQ+mE579wxrkhbZOOmOXcaipQc7eY\nzKmhJH9tpdBzgbZGycV5v+KY4LtQwhDvpzVrUg+nRbdHWaE8zobKeV3li+b6Rf5Xx3tp8bNDqRjw\n1Vb8YiTmupj24ny0FLHeryRqct7\/AOXcTCnDD2d4AAAAAElFTkSuQmCC",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/emblem_ti-1334254067.swf",
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
	"no_vendor",
	"no_donate",
	"emblem",
	"emblems_icons"
];
itemDef.keys_in_location = {
	"p"	: "pickup"
};
itemDef.keys_in_pack = {
	"r"	: "drop",
	"c"	: "caress",
	"o"	: "consider",
	"n"	: "contemplate",
	"g"	: "give",
	"z"	: "iconize",
	"e"	: "spend"
};

log.info("emblem_ti.js LOADED");

// generated ok 2012-08-27 19:07:46 by mackenzie
