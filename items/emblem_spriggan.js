//#include include/takeable.js

var label = "Emblem of Spriggan";
var version = "1346119666";
var name_single = "Emblem of Spriggan";
var name_plural = "Emblems of Spriggan";
var article = "an";
var description = "This highly polished Emblem of Spriggan is aglow with a golden light. It's probably important, don't you think?";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 0;
var input_for = [];
var parent_classes = ["emblem_spriggan", "emblem_base", "takeable"];
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
	out.push([2, "This can be obtained by earning favor with Spriggan. The quickest way to earn favor is by donating to Shrines."]);
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
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAMOklEQVR42s1YaVBUVxr1fxgB2Xdc\nULaoAdEIYrPvyCay73SzCd3sOw0CiiK2oCIo0irIJotECG7YyuYStclijDFjZ5mYMcmkZ5JJ1dTU\nTJ357kMtHTRmpqhKXtWp+7rf63vPd77lfrcXLVqg61\/fnwq4PZoqW\/R7vP75TVvcj59U42T1OsXv\njhx+6DT5ciYbP8jziKCd9LXvK7t4UHasWUACfar3JgpfufC98SwxI8cw0xOiYO\/PU\/jPbcKfH0oU\nf\/u4Ele7wnHheIji4Y3yhSH588P9spv9EfJXPf90PEXGyE13bsM314S4P54hZ6o+H5uMGHtndjgK\n0kpbWWudrerCqEeu+PZ2Eb65ngXl\/b1DbLHnn48PBJtcOBkwdPcSHyOtvjgvDQS7\/+ByplLWHya8\nPBjK+\/sfJYrvb+fi65ksTHUFo738Ld6CuffdI\/68u2PxeHxTxOGzK+n4+naZ8uPpfNnspRT5\/RkR\nvv6gDMrPaufhu092QHGrAHevbsfsWCK6anlgcy0owZZyqzV3BiPxiKyXD0RjuicMd84n48s7pOqH\n5Rjvi8G+wvXIjjRBTqQpcqLmkBu9FOUCC3RKvPD5rSJ8e6+SI\/rxJQGOlq0WL2iWHhPbyD8ajcPN\n4Rjcm8zC\/elsdDf6IMJ5MULsFyPUQR0RTlqIctZGNCHGRYegi0gnbWzbpI6QjSoQCyxx4ywfX8mL\nMTEQqbjYF6q6YARbC5epnmrgKe5PCXH9nUSIwowQukkViV6G2JFuh6q0dajOsENZ4hokuutwSCDE\nu2kjlshGO+sgnKeJMMc\/oK3WCV\/eLsT0cIyMlZufHjYpHt0sxJ+u5Sm\/mMiUPZZXiF9WBZ4lxMu+\nnxyKF14bjsP0YBwSvDSxzVETETwNWswDX81W4OZICmaGUzB7KRuZgYZI9NBCkocm8iJWYGemHXZu\nX09kiSiRjXLWQHOFAx5MizB7MQMPLgowOxTDjWOt3jhRvR7nj4cpmCjziHw2WTD0eLZK\/u+\/dAiZ\ndf94dEzy+KM6XKXYmxmKQy7FWPhmDSK3hNynjs693pD1JiKZCCV7aaFrrw8+vCzCe6PpeG8kHV\/d\nKcN3VF4YUvyMiLgeYt10keCpjYFmf3w4no7uPS4Y2uuO0WZPNOVZSZryzV+dQBPdUfK7owl4iunO\nULzbHoDZCwJUp1khN2IlpvoTMDVAz\/rj8Tm5pq3Gg1MrmRY9UOKA8Z6EZ6jL5yHEQQ3SOk9UJL9J\nRpD7PfUQRyTTgw3JIzEcLrcHknIb8FLVnr8kOebiG73hkA9GY6jBHT11ztwEPRJPxHtoU4xZ4xFl\nb3OlG1p3uOLIDncUx1kjxVsbaX56yCDwvbRxsGQTrg\/zcW2IT8nxJjr3uKOxaBMZQUp76pBBpKSr\nDmrSrfH+eQGudIWiIdv89U1GHVnQUmajvNEXjtkzMZCdCsWtkUSUxptxrm2p4OHOaAplqDriXNUx\nJo3AyLEI5IWbYbu\/Abb76SPNVxdTfbGoobgrjrdClJMGJnuicYUU7ZH4o68xAC3lzoh31wXfVw9j\n7cG42hsBSY7lrys99VmrAvZlWypP1tjjwslgDBzwgsDfkBbSxvEaF1ztjn2ihBYp6EpJQ8T89ZG5\nxYADu69MtiY3aiHVR4dDUewqlCZYoSTOklP33PFIJHnqIoZUbKmwx3VKklMNLr++NtYJlqk2Fq0W\nj1MMtu3YRO7Q5VCVZIWqFBvkRyylhSmOyKUMB\/I3cO4tpO8n+hKR4qONgnBTHKlw4hTliNLIjOJT\nMl0g5QXeepyK5UkWmCQFL3ZGyP+qOCy9e7VYxqC4XfvLhIePbBHKTm2FJM+GSoMuZaAuLcZUMkR+\n2DL07d\/CkWMEBiTeXOxVUzH+9FIqDpc4oppvid59vi8Q7KYsL4hahfLk1dxcLGFywpbjHCXi6FE\/\nTHWEPsMVaRB2pq14eUb\/9EWLcKI3Fhdp469Os0Y0qcdnriRyWQGGNBqgrcIR\/Y1+tDi5vmoTalOt\nUZm4EvfOJaGpcCOOltujv8mfU60w0gxTPTE4VMojdXW5eTJpHr63PjKCTDF8yBvDzd5oylxDJccN\nV48HczhRs3F+4vyoaI67fYaPM02eGDvih92Za8m9ejQxI2cMUZAxRzKNAnySLK1OtsI+4VocFTug\nLHYZPjobR7G2CkNNXpB1ROBolTPeH07AYKMv4ty1uGRixTwrwIjmpPvgpRg64ImBRnfIjgWhu24z\n6kUW8qrUpTKCoirNlLeo\/4Cf8MFkkfiT8TzJTHcMzh3yRWftZrxzyBMNObbPCAoDTZAdbAIhEWSu\n3kNlYuJEEGr45lTLglBMTcL7Q1EQhZpiqnMrLh0P4z6zZ3HuLGb1OeOYkaIgE3K7EYRbl2Fgvxt6\n9joTOR4qBaYKlgNPBatJWmqyqDp1ufRsoxfGiBjDFZrwTKMHBve7oqXUniMo8CarA42RE2KKbFpA\nGGhEiaGP01QrDxVugLwvDPtEb3GjmLKYjRfbt2KaKoHAzxjpFIOMHPstZyQRZEbnUfHv3+eCE7UO\nqBIsU5YnLp2\/3ZYm6Zk05q7GCJF8ip5dTujby0O\/xI32UD0uBjMD5gjmhJiQAkacirlbjehdF0xJ\n\/YlMCG51hWA\/qc7GC0eDURRlxiUJe5cpx37L5mDhwieja9PWcOs0l9oQOYNXHwFKE4wCSuKNlSUJ\nxmAoTjCRtVXYcdaJQldQFhsg3d\/oCUFSkRZiKjJlcraRm+occeNkAIfBelduPH8kiPZpTU7p7OfI\nMWTQXEmeBlSKHHBqpz32F6yW\/O\/Naul6RWfNRhwstqfCqz+XKIFPFgmeU5GVmkR3TRzOW4uZY74v\nYKwlgCs\/rIAzcrlPyAmfxF9GoClONzijXbwOY0dDqcMpl7Im5VeeRbp4x6oc0VqyFv0NrkjxN+Us\nZiqyGGJgMZXK1TktTLT5Y7LV8wVcaJ6rjxm0uzCDnqm3xZgaBwM0FbyN9gpb7M20QHOODfp2OaO5\nxE5553Lh6097D25UiruqN6MhywLHym0oiJ2pVdLn4oa5h0sSWphPdW5wtxOuHHSdh5n2LdgeSEZR\nSZqLP1MujgXkiZwwMzLcCYfyrXGyygEDe1zRXcMDW7Mm1ez1jcPpQ4HijspNZOHbaMg0Q+9uB+zN\npsbTXZ8y2oDbCVjZaMtfjcv7ea9EU4E9Up5k8Hau9hlSb2iMkWYfHMwxpxpqhdO7XdBcYMuhtcgO\nezItqffUM\/lFgr0SX9lJKr4PL6eSC6zQkLEcvXUOOFCwkbpjPXK3Hprz38ZpsR2qE8whjlmBfoql\ni\/UOOFs79z2776915HaPFN85w9hW19\/ghoPZq1CdZIJdaeZ02NJXiMJ0hkThumIa5UWxpHaY9svd\nzPa\/8Y5YqZSy6wR1Gkzy\/aLVyA7VwW6BMY4UWqNjpwt3MIp21kK4owbt1UsQ77oE+SH66Cm1obOH\nBj1TRxaVlgPpbKexozOKLjUZqzBKxb8+1QSV8YbK7SFaQkGo+rwmtThp+atdLArTk9SmrCS3WnOo\nIwuFZBWbqEpgKa+KJeVyLTByyAOF0au4linWlQ5HrlqkrBYdBTS4MdZVkzJfm\/pGbVJbn\/ZVJ\/TX\nb8KuJAOURRuiY4+X9P8+xaUHa4rTQjRlDOz+qZW789ZJiiKMULhNC1UxWtSiW2GAAl26wxll8ZYo\no56vnFBK98WxFtiTZQspVYKu2g2oTdBDabgGqhJMuWxtKdhAh6ZCyYKej0fbIk2qk82UO5NW0n6s\nidwgNVRELOHQmm8xD\/UCI5SHq6M4VA05QUtQy1\/J\/X\/DTnE9O51QnWKOBf+rLWebvlSS\/ib6KfMO\n59lS8Ksr071V5Bk+KvhvbPdVUfLdVIYSvFUVom26KIwyQkmMCcWyBdgc7H7BCSZtUYurT6FmlBSo\nT7NEkr8aF0uCQA1pdaIZDlDrxfZyVnhLo01f+EeM76\/GY79PC9JUsjlywvQXniBNzqtLMgdDfhgd\n0v3UnpUDwZYl4srY5ThWvAGHc2255y+bQ+CmrloYTudkXzXJghNMCdCU54SyTpiy1mfxvHMDf4ua\ncAeRrKWToGir7isVivdRlQvcFqkuKLlojzfWxHotFjPEeKu8dFMPpUWLw41RGb0Myb7q8l+a6zf5\nvzrGXYWXGaSDOC9V2W9G4lUXUy\/aU0UW5fFG3ELO+x9VdDtHe818SQAAAABJRU5ErkJggg==",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/emblem_spriggan-1334254034.swf",
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

log.info("emblem_spriggan.js LOADED");

// generated ok 2012-08-27 19:07:46 by mackenzie
