//#include include/takeable.js

var label = "Emblem of Cosma";
var version = "1346119666";
var name_single = "Emblem of Cosma";
var name_plural = "Emblems of Cosma";
var article = "an";
var description = "More than just a highly cherishable gewgaw, this glistening Emblem of Cosma can confer special powers upon its holder.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 0;
var input_for = [];
var parent_classes = ["emblem_cosma", "emblem_base", "takeable"];
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
	out.push([2, "This can be obtained by earning favor with Cosma. The quickest way to earn favor is by donating to Shrines."]);
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
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAALx0lEQVR42s1YaVBUVxp1\/iYmIBJo\ndjEBERENuIwb7cLe7MgmO71AN0s3+06DgDYgtqAgKIIi4sYiSQhxwXbDqBGbZOI2Gjsxq0kmPZNM\nqqamZurMd19Hixk0ZmaoSl7VqX593+t7z\/2W8323Z8yYpusf3x4KHh9O08z4LV5\/\/7Ij8fs71eiu\nXqL7zZHDdz12Dy9n4zttHhFc2vXc9\/W9fOgPLppGAseMbl8ofObCt0ezlIwcw+Uj4Tr2\/hQLf9Uh\n\/\/GBWveXW5U43xuNU\/vDdQ+ulk8PyR8f7NBc64vRPuv5H0dTNYzcWE8kvnxXjruj6Vpm1cmxyYix\ndyaGYtFV6a5pV7kbTY\/1yBVfjxfhyytZ0N\/dNsgWm\/x8tD\/M7lR38ODNM2K81S7Aya4QsPsPzmbq\nNX1R8rMDEfy\/fqTWfTuei88vZ+FSbxg6y1\/nT5t7394TyL85koRH1xQc7p+T4fPxMv2tsXzNxJlU\n7d3LCnz+QRn092un4Js7m6G7XoCb5zMwMZKC3lo+2FzTSrCtfMGiGwOb8AXtXtsfh7EjUbhxUoTP\nJkrw9e1KXBhIQlPJCuTG2U9BuWQ+etS++Ph6EfcuI3rrjAR7y1yV05ql+5Ru2g+HE3FtKB63L2bh\n\/pU8DLSFIHa9MTauMka0hyni1lsgfoMFEiYhdp05otaYIHzlS6hMW4BrwxJ8qi3Ghf5NutPHIoym\njWB74VyjQ4183d1Lclx5IwU5MXaI8jAhAjwkeloixdsKIl8rSBj8DRD7sTF65mXJkY3hmxHZl9BR\nuxYPxwsxNhSvYXLzw4Nm3RfXCvHZu3n6Ty5kah5pK5RPU4EnCfG08ctDQvn1t4W4MSKBSGBOi5lz\ni6b4MDLWkAXYICPIlmCDTA7WdG8FWaAVUv0tISaiyd7Mwjza1Gy0VqzCvTEFJk6n495pCSYG47nP\nkXY\/HKhehpP7o3TMKFOI3L9YMPhookr7zz8dlLPd\/e2LfepHH6pwaTAB75+WoiTZgXMbs5qYrMWI\nZQbbIDvMjoMi1Ja+W2N73gqUJTlxJNMZ0QBrFMfPh5BIJhLJZB8z9LcG4g+jMhyuX4\/BbV4YbvVB\nc94CdXO+07MT6MLhWO3N4WQ8xlhPBN7uDMbNszJsy3WjODO4VOxnTQvbGkgR5CE2kAcbrCb15+F4\ncxA+1MhRFPsaud0MB+sFON8npE3xyOoGkrIwK1waiMcY4WxnCFluOZ5qtcmXOsdJefVoNLQDcRhs\n9MIR1Tpugv5dAogFhlhilmPkcsLncMj+ieBASzhKE5wg8nkFpYmOOLQ9iEJhFpI8TdC3KwiFSS6Q\n+JnR780NlvTkYWuGK94\/KcG53gg0Zjs9v8lQ0Q7aytz0V49FY+JEPDSHInD9rRRUiJw467GYY25l\nrmSWU4TYcC6VBVigtWQVvpoohbpoLd4\/lYlvbm5+gofvlWKwLRy7SI7eJVmqky+jxLJAKsXoSGcY\nzh+NgTrH+ZdJT0PWvODt2c767pqVONUdhv6dvkgLtkWCpwVElJkZlADMYiwRZIGWSCOXCr1NyVKz\nsF8lwL2LubhzLgsVaUuRGT0PGVHz0LnVF59ey0fv9gDSR2ciZ0aW5tGcPOwuX4ErlCSHGtf\/cm1U\nSeYaNRW5KkcpBjs2r0YiSUWylwW5yJIjKBXQ7sldSvFCnO2Jo8pSwuGz94rwMWVnS9kaRK56AVGr\nX0BerAPalGu58d3lHkgg7WRhIKJESSKCZclOuEgWPN0To\/2zbnfXzfPFGgbdeO3PEx7aEyTXHNoI\ndZ4bJ8Ip3jwiZYEducspoPmoSJ6HB2P5uK+RTYHuogIPrxRw+Oh85pTxawMpKIiey0mPItIe71Ai\nDu8NwKWDEU9wrisUW6SvPT2jf\/ikTX7haAJOU+GvlrpwFULEYsbfHLdOSXH3lPj\/RlG8E4SU0dIQ\nOwy1+GGo1Q\/NmYtIcjxxfn8YhwM1K6Ymzve61sTxE2KcaPbByJ4A1GUu5rJX5MNczMP1\/lhMlqLH\nGB9MxO13RFPGVZlueINUYPLY0M4ApJIqiHwtkB5qh8GdPuhv8oJmXygOqzzQoJivrUqz1xB0VdI5\n\/Bl9OwPk9y4WKe+M5qkvH47HOy0C9NR64I0WHzTmuP8bwWqJMwa2+6HvJww0BeK42h+FFGun2gPw\nwWDcE3RUeCCZZEboPRub+CZUs004iwkpSVhysQqTFW6P\/h2eOLJtHZHjo1IyR8dy4LHBaoT2djOq\n017terPJFyNEjOFcZyhONHljYMcGtJWu5Agyd6TSpAy78peS2JoghRYX+ZhyqJUtpoXNkRPtCLXC\nnYM0eA4RMedkKJ2QJuDhmGo9l2TSAFaNLJAb7UAbXY8DtatQJZmrL0+xn1puS4UWdk25rniLSD7G\nka1rcWwbH31qT+paSEq8DElSleKI\/eUrOQuk+bHFedhTwUdxnCMtzDMQIVKsovQ1CpBF1UUeYs1p\nZxbJkzprEWpIV2UBVrRpS9SkuXLrtJa6ETmrZx8BSpNtgkuSbPUlybZgKE6203RULMXxxnWcG1h5\nElGpGqznIzvclitrDIzA2c5Icr8F3Vsjm4k4EWHjQ82BKEtw5L4zMP2UCazQU7OBNsuki3SwdAUO\nbVmJHQWu6v++WS1dpuuuWk5xuARx68xQJ3XFTsXrnECnk4uY69rL+Ggnl2cSIUWoDfJoM3msBBLR\nkpi56NnsQXWaCIfaPBH4Jko8VolSqSr1qtagU7kEI3sjqMMp72JNyi88i\/Ty91Wtwe4iV3TXrCGr\nuuCEahXE\/hRPgYycJefONxv4RMSexqw4Unkb5yCXEQwhlxKxw1WruHLIkWSWpc+ccDt0V65BfZYb\n2ksWoyHDCa05bji2dR2VzKX6G2cLn3\/au3e1Utlb7cH9uKVgIQ5vXgGVxMlQQ6nHYyTL4h1wZvsa\nLh6Ze9nCeRvtDQSJLCPVkuWC4k2OnOU4FwdYcfLSKHPB0Ya12JE9HwcqV6K\/fgMO1\/DB1qxJc3h+\n43C8JUR5sHI1OsqWYWuaPdpL3UkCFlFGUzdC8sBiqCnTFc3pCwyxyCxDbmPkGLikoLFSsm5H8XLu\nPj3QmiuXYmpyB3Z4oTHdAfVkgGPUNbUWuHNoL1qK+kxn5G6ysPtZgkfVAk23kjrf02KoZPNRRyR7\nan5PXccyLmFYy5S\/0Y6y1YprWpl1Hrdgk9swhpJoe8pwwxEgn6x5lJrUZrkjqigZa1PnITvGQqeI\nMh9URPOU9KktSqB2Lsrs6W5m9W\/0YEJXF7XlBypWciZXyxdCsdEMKrEN2gsWkGatI0vyOHczi0ip\nKmSQdeShrKs2IItikI1JAwxnFNao5pJGDpP416faQplopZeFmMgjPGcwUf7dZA7Fwlef7WJFlIW6\nNtURjZkuHFRSJ8hpV5KIWUZVEmdtVQL1fnnzqWr4UyfiQh0Jibi3JXdoSiXXpQkYbLh71tyyZ6kC\nW2rtvdDXsBpbhVYoi7OmLtu3638+xcnCTJXScFMNA7tn5Nh4Xd4SdVGMDQojX8HmBDPsLXLBoJpV\ngQ1QilxRKV6Eqp\/A7pvyV5CMbMDAttVQiYhYjCm5dQ6XrW0Fy+nQVKie1vPxcMcmu2qRg36L0JEy\n1BS5ocaoiDHhsKfAeQq2kSvZs5LIWcgNm40tknnc\/zfsFHdky1pUpzph2v9qy4m07FLLFqKvbj12\n57mT+2bpZX4zten+M\/GfyBDM1Is9Zw4m+xnpFJE8aigoYeLtUCeZDzYHu592gsIg48SGVGccJQs0\nSJ0hDDTmYkkSMrurOsUBO+WLuVrOhLc0bs6\/\/SMmDjTms99LQ031bI6cKMvpJ0iT81VCJzDkR1kj\nJcD4iRxIgkyUlQmvYh\/p3u5cd+750+aQeM4yKoy2QYrAWD3tBFODTbU5EVRJQl9Bkv\/LU84N4iBj\n+WYiWZvkQNLEe6aFkvyNtBKDxEzfFef94qIE35eVDPF+M59a1JmuFUfbojJuLkSCWdqfm+tX+b86\n3msmPzPUHIm+RppfjcSzLma9OJ+ZmljvFxOnc95\/AQ6LOdFyiGvjAAAAAElFTkSuQmCC",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/emblem_cosma-1334253505.swf",
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

log.info("emblem_cosma.js LOADED");

// generated ok 2012-08-27 19:07:46 by mackenzie
