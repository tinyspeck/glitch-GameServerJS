//#include include/takeable.js

var label = "Emblem of Humbaba";
var version = "1346119666";
var name_single = "Emblem of Humbaba";
var name_plural = "Emblems of Humbaba";
var article = "an";
var description = "Behold a dazzling Emblem of Humbaba. Keep it safe, and someday it may entitle you to wield special powers and whatnot.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 0;
var input_for = [];
var parent_classes = ["emblem_humbaba", "emblem_base", "takeable"];
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
	out.push([2, "This can be obtained by earning favor with Humbaba. The quickest way to earn favor is by donating to Shrines."]);
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
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAALl0lEQVR42s1YaVCT1xr2fx1BiwpI\nCKC44IKKO2pEWWSRPSRoCEtI2EzCjqAQKIuAYAAriyJxA0FZpFapAsYNq7Yauqi1es20081Or7m3\nvZ25c+feee57vgilVWvbYabNzDN8Od\/hfM953vd5z\/tlwoRx+vz3u9ag22cT9RP+ip\/\/fN0c\/f0n\nxThavMz4lyOHp8f5n19Pw1NDJhFcrnvlfFObAKZjruNI4KTF\/Ss5L33w\/UGVhpFjuN4eZmTzn1P4\nm2b1j4+1xn\/eK8TlNjEuHA4zPr6ZPz4kf3xco7\/VGWl42f1PBxP0jNzQ8Qh8\/a4aDwZTDEzVsbnJ\niLE5w73boCt00zeVu1mMj3oUim9v78DXN1QwPajqYQ8be3+wK5R\/4WhQz90BOd5u8sd5XTDY9YcX\nlSZ9p0h9sVso+NfftMbvbmfgy+sqXGsLRUv+EsG4hffcgS2Cu30xeHIrlcOjS8n48vYu072hLP3w\nQILhwfVUfPnhLpgelY7i6cMSDt\/eL8Lj97Lw8aUUDPfFoa1UALbWuBJszJ\/veqd7K76i3Ru6JBhq\nF+HO+Xh8MZxHBApxpTsGtXmrkSFxHEXaVgcOebI50FV64ZNr6fjmbgHuXt6OewMKHNy1SDOuLj2k\nWWr4+Gw0bvVG4f5VFR7dyER3YzC2bbREuLslxOutINlog6hNNpAStnkwWCNbuojuT0bIqknIl8\/D\njTPx+Ox2Di53Rhr7Twotxo1gU46TRWu1wPjgmho33opDeiQfovVTOBLRnraI856B+M0zoPC1I8yA\njL6z8XuXsxG0eirEG6xp\/jRErJuEhsJ13AaHeqP0rNz88LjO+NWtHHzxbqbpsytK\/RNDgeZFVWDU\nEC8av94rU79\/ToY7fQrE+09HpGA6p1ScD5Hys0NyAA\/bA+2hCiYE2SPB344j\/PTTMuTGLUbkBhvk\nSBciOdSZrq1Qk7sKD4dSMdyfgof9Cgz3RHF\/+5p8caR4Bc4fFhmZKM8ReXQ1u+fJcJHhf38\/pma7\n+\/dXh7RPPi7HtR4pPuhPQl6sM6k2nVNHTgQYMUYqPcxhFGmhfCTSeL7cDd98lI+cmMWIEFijc384\n0iQLsZVUl3pNRVf9Fnw0mIwTlRvRU+WFs\/U+qMucr63LmvtyA105sc1w92wsRjB0XIhzLUG4ezEZ\nVRlLKc\/MIZVTKFNIMUZmhFjGM6SFOHAEy1RryO05qMv3Rp58BR6RURqLvCDZZMvl6\/YwHt49HY2h\n7ihcbAkm5VbihaqN\/WjT52pudohh6Jagp9oL7eUe3AJdb\/pD7m\/LhZUpx8j9klhGuAMywx2RHuqI\npAB7IuiOz29k\/Ay1uR6Q0gZjvMwoV7nig\/MKXGoTojpt7qubjHLaQeOupaabJ8UYPh0FfasQ778d\nh4L4uZx6LOdYWEeUG0uMIYvAxlK22CM5yAlGcvxYVOcIEEtrxBNkhMRAO\/S1hOJyRyS06S6\/rfTs\nUc0J2pvmYjpasgYXjoaia99mJFLis9AyQ4zk3FhyjFiW8CcoA\/mQbbbDI33yz1CVtQ4x5PAEfx4S\nyUhMxcaCNbhBJmmt3vjba2O5wsmidscizSDlYPMbaxHtZS4lTL2xoR1LLlvoZEaEE1SUhwo\/Hq4c\nE+HBBfkoKtPdOQWTA3mkMo9TMV82D1dJwf7jkYZ\/GBt0dy\/n6hmMt0t\/nXDvgUC1vjUc2sylXFKz\nspFMi6pD+FAH8zkllUF8KLlrAht\/BhZipqCuaAPGmi4xxJnGzTnMyhEzW7poJt4hI549GIBrx4Sj\nuKQLQVnSrBc7+ofPGtVXOqTop4O\/OGkBd0KYzcHjFk8iJc21juDLwIOcFFM8AyMnJbdKve1wvikQ\nH56W4GzDFvgvt+LusTXYRhIoZVJI7d79vuit90Wd0pVKjicuHw7lcKRk9fPG+d5YH337tByn63zQ\ndyAAFcrFZvfSCTFC7Fi5HwYOizGg+wn9h0XmMUK\/ToT+Fur5WkSkjoi6HDMq1KtGCaYSQZaHSnJ9\nzz4fdNV6QX8oBCfK12NP6jxDUaKjnmAsSnIQTOjcF6B+eHWH5pPBTO31E1F4Z78\/jpeux1v7fVCd\n7jZaXlhyZ0nm4wMqQ++3hf1uVKncKO\/GEqSUCXdCV40n2qs8iJwAhQoHI\/PAiGAlMkf+hOLEmboz\ntZvRR8QYLrWE4HStN7prNqFx5xqOIDtfWf4c0Hji5pEgVKe6oSZ1GS7UB3Dfuys3obVYgEvUE7Lv\nDIWyhcgQz0FFyhK81xqG9hKBuVQ9y2UW4szI2ejcuxFHSt1RpHAy5cc5Pn\/c7pTZ8GszFuFtIjmC\n9t0bcLJKgE6tJ3Ut1lxJiCaS7CEDb3ojYKUVwtZZ46DGC0PNftQUTKN5thy2kqnYmCp0JkQCG4io\nWXiPDHdU484RZKmionxmJilNcuWeU79zKZGb8fJXgJ2xvKC8GHtTXqw9GHJj+frmguXc7lThMzkn\nS0jJi3RmNmYtp4fa0MFvi0OFXji8axWEa1kht0Mc5RgrJVcavImgEyI9zPNO7RZw82K8zKmSRPkX\n522LAwXuaC1bg5rsRdrf36zuXGE8XrIaezNXQEwHviZ+MfR1HsgWU9NAhJlSzYWeaNmxnLsvp5Ax\nFzNXs3nKEEeIiSDDmboAbp5w3XSu\/rEKkExl6lS1B1o0y9B3UEgdTr6ONSm\/8V2kTXCoaB2a8hbj\neJmASgYPTRnLMFC9lrqO1ciJXUKdiQ0psBEnClejIGEVtoc4cWFjD2fzzlR5o7fGF8WKJThKNZGR\n7q72hVo4C7GkXk3GSrQUuKFKOQ\/16UtxcrcH6vOWm+5czHn1297Dm4WatuL1qFbRP+e4Yi8tdq7C\nHefLV3Ho2OVGoaMczPcYHSuQzOJUZBgZY3hDOhvFclc0pS7ivrPeURnmhI5KAfZnLSDy7ugik52g\n\/GbPLEl0fnXjcGp\/sOZY4Vra4SqUJ80kNy9DWuQ8aqfsURI9CzvFTlyulScuwbmSZRyKo2ZxzmQ5\nlklHoYoRoXM5jmsOKDfJZGJqdpmR2vd4olY9B3vV83GqYiPqs904NFEaVCpdkLHVhv+rBDu0\/nrm\nuscXE1GR7IIyuSMact2gISWYclHP2ib2cNb6c+2\/l9mh7KxlpSSRK+w8rslgJSqGwsrCe4RU2qt0\nRhGZcXfSXKRvtTWmiqb3pIqtNfTXsENKDYlo2ovDzM6\/wWNSnY7cdYQ6DSa5Vr2QCuo0lMp4qE2d\nh4OFAs7VrLeL87HlThl2wiRtMTcByiAGe6QQwUTOOESQ5mVRTTxDJaoywR6a6Bmm5OApaoVw8nNN\naq5s5stDnCqy0ZYmzEa1cgGHctqhmnbFFipSuBiKpDZoyHLBQHMA8mMXUBtmw5UL80sTEfWbYQ4z\ny0VfO3PfF8BHR5UPGWQ9dstmYJeEjsvKzbo\/\/BaXHGqlSQqz0jOw65FdVmQu0+6I5CEnYiol\/jQc\n3LEAPVp2CmyiErQIhRT+omdg17VZq9FWvgndVWtRHk\/EIq0orA6cWxuzV9JLU452XN+PzzZv5RfH\nO5vKZLOhDrJCRoglCiKncDiQ7fIcqiiU7F5exGRkhL6OMsUc7vcb9hbXXrYBxQlzMe4\/taVH2Oq0\nyQvRSc5ryHSj3JtsSvadaEjxm4hfYrv\/RJPcc2JPrK+FMTXCGjnbeMiL4qNCMQ9sDXY97gRlgZbR\nexJc0EEK7ElygWyLJZdLiuDXdcVxztinXsyd5azw7pQ4\/OwXMfkWSwH7\/6QQKxNbI11kO\/4EaXFB\nuWwuGLJEdJ4GWI6WA0XgFE2hdCYO5a5EQ4Ybd\/9Fayg8J1vkiHmI87fUjjvBhCArQ7rQljrhqYjx\nm\/Tce4M80FL9BpEsjXFGarj1SxWK8bMwKDwnWIwrOYn3a67SzZM0DFG+E194qAvpobliexRKnBDv\nP9nwa2v9Kb9XR3lNFChDpiN6s4X+TyPxsg9TT+IzUb\/N+7Xo8Vz3\/9PIK4jfrw46AAAAAElFTkSu\nQmCC",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/emblem_humbaba-1334253845.swf",
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

log.info("emblem_humbaba.js LOADED");

// generated ok 2012-08-27 19:07:46 by mackenzie
