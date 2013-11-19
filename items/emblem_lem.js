//#include include/takeable.js

var label = "Emblem of Lem";
var version = "1346119666";
var name_single = "Emblem of Lem";
var name_plural = "Emblems of Lem";
var article = "an";
var description = "Almost blinding in its glory, this Emblem of Lem may allow you to do some seriously fancy things.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 0;
var input_for = [];
var parent_classes = ["emblem_lem", "emblem_base", "takeable"];
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
	out.push([2, "This can be obtained by earning favor with Lem. The quickest way to earn favor is by donating to Shrines."]);
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
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAMbUlEQVR42s1YaVBUVxb2f4zsS4PQ\noKKARo3EXWkRkX3fEZqloVmbZpVVGgQUFWzAAIIsURBBWUSjxAVaUSAu2GiCSzT2mDE6Jpn0JJlU\nTU3N1DfnPkbLGTBmpqhKuurUe9339b3fPed83zn3zZo1Q59\/fHfUc+xMnGLW7\/Hz9+eN4T\/eL8aR\n4g9Uvztw+L6N\/9VIKr5XZhDAlS1vfV7dLoC6ddkMAjiucW8o640L3xtIljFwzEY6fFXs+Ske\/lOj\n9OfHctUPdwtxuT0I5z\/yVT2+tmNmQP78uFJxvStY+abxLwZiFQzccFsAno9K8WAgUcm8+npuMmDs\nmfG+bWgptFHUl9lozIz3KBTfjGXj+afJUD8o72WLvT4+0O3DP3\/Es3fiYgw+rnfFuRYvsPs7gxK1\noitQOtjjL\/jrl3LVd2Pp+HokGVfbfdC8433BjIX3bIO7YKI\/Ai+up3D26FICvh7LV98dzlSMX4xV\nPhhJwdd38qF+VDrFvr2\/E6qb2zFxOQnj\/VFoLxWAzTWjAA\/uWLzsVk8IntHuld2hGO4IxK1z0Xg6\nnotv7hViqCcCVblrkR5qPsV2iK3QJnfCH25mc88yoHcvinEof6lsRlnaJFuh\/PxMOK73heHukAQP\nR9PRXeeJEDsN+K7TQJCtLkI38xBmz4PwNdtmZ4DAjdr0zLsojFuM62fE+KMyB0PdIaoLx\/01Zgxg\nfdY8jaMVAtWDq1IMdYVBGjAXARu0ECLQR9hmQ0Q48BDtaASx81zEukwau49xMkbUVmOEbzFCyCYD\n2sgcNO2yw1djWRjuC1MwufnpcbXq2fUsPB3NUD8ZkiheKAtk06nAK0JM9\/tIn0h686wIY2djEOWs\nT17RRZZwCYHTo8X1CYgh4lyNkeQxF8meppPmZQoJXRPcTTjAIkdjCAlo6GZd1Basx8PhFIxfSMTD\nC2KM94Zx1\/56ZxwuXoVzHwWqmFOmAHl0ZXvvi\/Ei5T\/\/3Cplu\/vbsyb5i8\/LcLVXiNsX4pETsQDB\nm3QpdLp4PlGCL6\/loLPaE8neJohz4SHR3YhAmSDF2xSpPnyk+ZpxluzF54DGkFcjHIwQ6aiP7lp3\nfDaQgGN7N6O33AFnah1RnbFYXp1p+WYCDR3bppw4E4mXNtzmj7PNnpgYTEB5+goup0Lt9JAaaIEf\nHu\/F2Hkpx9Znd2Q4Ue2NnNBFSHTjkQfnIoU8mPYaSAY4ycMUYpdJkEm+Jhg9GY7hnjAMNnuR51Zj\nWq+9\/pGnWcqudQZB2ROK3goHdJTZcRN0f+iKGFcWHgOE2+ujcrstviXhFbmZItLFFDWFxNQbOXiq\nLEDbPnckkSdTyYvpvnyk+5nR1ewVUA7kvz1ZlrwMt8+JcandHxWplm9vMspoBwfzV6ivHQ\/C+Mkw\nKI764+bHUSiItiRwk2SIctDH6cZgfDmSgW2btAiwJuWiFgoT1+DJjXzud5Z\/qWQZBCjDz3wKyEQK\nN8vJOMrZ\/mYfXO4MhjzN+tdJz77kRZ77U63VR0rW4fwRH3QfcEIcJTtjosiRR6aPa6fiCHgcEjyN\nCLAORGQPr2bhi8spiPacT4zWpzAbU4hNOU+msqvvZMhTyauMRHGuk148WLAOnxJJjlZs\/vXaWCae\np1GVvVQ2QDnYuHMDwmkiJhdiZx4x0hD3FGl4MpqGvloPYrAeZ6fqfHB3IJHIYEgAdRHvasiFOoFy\nMsHNiLzGmzQPYyLSXBonslBE8qMscYU8eKEtWPkXVV3LxOUcBTPVWOkvA+5r8JAqjvpBnrGCE+Fo\n0jQmJfG02NMb2bjWG4nHJNqZQXzEkMfKJDZQkU5WpdugNl+AY\/vd0LHfHR0VbqjMXIO90lXI2raQ\n2G5A4Hgc60WknakB8\/AJEfHMITdcbfV\/ZZdavLErfsH0jP7pyUHpUKcQF6jwF8cv4SoES+xEd2bG\nKI5bjvCtBhg+LkRPlRPETvo0ro+J8xLc6A5DrnAhHg7ET2tfjWbi\/sUkpAWY06bJu9589NU4UzSc\nUS1ZRpKzBZc\/8uHscMnaqcT5UVUbPnYyBierHdHf4IY9kuVc2WJiK\/Ewofwx4aSEAeosd8K9T6Ih\n8eKRF\/XQUurAfS9Leg\/H9zvhFKWA+ypNeKzWRKKfBRJ8F9AmkjBGuhqxRY9SgdLAxwy9BxzRXeUA\nRZM3jpXZYl+KlbIozlxBpiqKNxPM6jrgJn14JVt2fyBDPnIsDJ\/UuKKt1BanahxRkWbzCiBLbqZn\nUi8TLq9yQhfi89PhqNm+ksiijUQize1TERQiPwx3x3JjJTGWHJEiaTw10ByPFMno3LeVwqvHkS6Z\nWN5duQUd5XYEToBCsZmKceClw0pE5vxZxXHzW05TqPoJGLNLzd44WbUVPZX2OJi3jgPIQszkg5MK\nAikhiYgnwlw54o+L9W4I36xJOWqIvkYhnoxk4bO+cAySR9IDFnApINqqi\/oiB9zu2UYefp+IpU8e\n5CE9yAJd+zfjcOl6FInnqXdEmU8tt3kiHr8qfSk+JpAvrWP3JhwvF6BLvoUjCSv8rLZOVgVTElxj\n8qoBmmUbcaszAAdyN0L1aR4+Oynkvu9PXQ2\/jTqkk9rIDF5AkqKN1j3O3JjE24zmM+BIUhq\/jFun\nNm8FgTN+8xEgL9LEMzfCVJ0baQpmOZF8RWPBSm53Kf4LOJlh9ZSFmHmSyQfLu5IEGzy+lMoBu9FG\nOVRqB19b1mbNQXaEJbVnebhzSkT\/M8a55kAMNbpTF6TLaWXkVh4aqHE4umsdVael8v+9Wc1bpWor\nWYsPc9ZxQs0RhUjCdCzVn4+LR0VQDWVgtMUdg3XOyA5bDPeVcwjAu2gpc8G9C1Jcb\/XmxhUHnTDU\n4otDueuIvSz\/DEno+ThRYUdR+AD9h\/ypw9nRwpqUX3kWaRc0FW1Efe5ydFXYI9bdjCtP8W7GnNT0\nNwVjtNkdVxucUEZhclulA\/\/17yKZKsYIEWScum82dpqSP8HLHIeyV3LfCyOtKB8NiDQGqMpcjeYC\nG5RLrFCbtgLHd9uhNnel+tZg1ttPew+vFcrai21RkWyFph0rKIntuH6OCXasixG1TjzISYLc1xrA\nY5UG1eU5aK\/wxKMBKQfkco09CiKs4bdBh2q1NnXf2qhMXg4xiX0k1fNk33m08U2oyVyCI0Xr0b3X\nHsdKBGBrlsRZvL1xOFHjJWst3EA7XIMKiQU696xHeeoq0i8eJw9ialIDqHEVEgliqbzdOksntgYX\nDFQK0LjdBkGbeBRqHU4vxc4GHMPD7PUQbEv652xECuGAD9MssV+6GCf2bEYt\/YdZPXl6r8Qa6SE8\n\/i8C7JS7Ko7I1uPxYByFYDEqEuejs2w9qqlshdsbcgxkTJSQJt49J8GAfBNOlaymWmsGzzVapH16\nXFlk+coqUCx5LtrJiGRlPpHCFtVSCxSL+Ngdb4m0ECNVSqBBb0qQoYyuymwhqUWg\/vRhZvVvoFXY\n0kLsOkydBnN5ZcpSIoUB9ohN0ZC1BG277Qkkj7xpSOzWR++ujcihhVkeCu3Ja04GXDOQ4DaZs5Mt\nvxHJzSKcPuCAPbGmKAw3Vif56knF\/lpTmtQc0fw3hzglkCcvjV1IYV3CWRntUEq7YhMVia2VRUIe\n6jKtcbHRjVhrRfmlT+VMhw5ROlz5YoBjnFiOGnHayfV9bnwqi47oqbDFbpEx8kPnonWvU8v\/fYpL\n8NGVxfvqKpix+5e73JPxgTw72ARZAXrYKdRHbTqde6kC1JB0ZIdZIkdohR2RiyETvQdZ9FJi6Vq0\nl9mjp3wDyqIJWLAuiiLNOLYe3L6aDk1Z8hk9H59pDOEXR1uod4kWQuqpizQvDeQHaXFWl2HJWX2m\nFRq2W3NWTqEsCNZGboAW0n10sEu8iHt\/w05xHbs2oTjWEjP+qi0twKhFnvAeuoh5dRk2lPxa6gTn\n2cpEl9n4b0tyna2O2TK7N9JZQ5USYEj9oAlyw\/iUy1Zgc7D7GQco8tAM3xdrjU7ywL54a4jcNblc\nEnvptBRHWeCAdDlXy5nw5oWa\/ccbsRh3TQH7f7y3rprNkRZoNPMAaXJBmcgSzDID5yLKTfOVHIg9\ntGWFwvloylmNOuqs2fh0c4i3aGlkBZkgylVTPuMAYz11lWn+dMbw1kOEy5wp54YYD03pTgJZGmGB\nFD\/DN3oowkVDKd4yS2NGwYVufWeZ0GmOjFmY8+xpi7o\/LZoTRDoXOg\/RrlrKX5rrN3lfHeYwWyDx\npgO+k4biNwPxpg\/zXqjjbMW2re+Ez+S8\/wJs\/Dh9XoFg3AAAAABJRU5ErkJggg==",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/emblem_lem-1334253890.swf",
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

log.info("emblem_lem.js LOADED");

// generated ok 2012-08-27 19:07:46 by mackenzie
