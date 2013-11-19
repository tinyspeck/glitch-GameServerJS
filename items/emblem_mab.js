//#include include/takeable.js

var label = "Emblem of Mab";
var version = "1346119666";
var name_single = "Emblem of Mab";
var name_plural = "Emblems of Mab";
var article = "an";
var description = "A highly coveted, moderately burnished Emblem of Mab. If you're both smart and lucky, it may confer special skills upon you.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 0;
var input_for = [];
var parent_classes = ["emblem_mab", "emblem_base", "takeable"];
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
	out.push([2, "This can be obtained by earning favor with Mab. The quickest way to earn favor is by donating to Shrines."]);
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
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAMG0lEQVR42s1YaVBUVxr1fxgQaZR9\n0aiARjMQF0Ro2VfZm7WbvZu1aWh2EBpEFBRsBcQNwQUREAGjxBVaQHTUaBMnbqNjx0yiYyZJT5JJ\n1dTUTJ357nMZHTBmpqhKuurUu\/Xe63vPd77t3jdjxjT9\/vn14aDrg2mqGb\/G3z+etMZ\/f7caB6s\/\n0PzqyOHbDsvPL+XiW3U+EVzW\/tb3tZ18aA8tnUYCPXp3RoveuPCdoWwFI8dwqStMw96fpPCfW2U\/\nPlRqvrtdiZHOKJzdH6Z5eKV8ekj++HCb6mpvtPpNz\/8wlKpi5MY7IvDksgz3hjLVTNVXY5MRY+9M\nHI9Fe6WDanetg970qEeu+Op6MZ78Lhvae\/X9bLFXnw8dC7U8ezCo\/9Z5MU7u9seZ9mCw8c1hqVbV\nGykb7hPw\/\/ZHpebr63n48lI2LnaGoq38t\/xpc+9He9byb51KwNOrORweXMjAl9fXaW+PF6gmzqeq\n713KwZc310H7oGYS\/nJ3PTQfF+LWSBYmTiWhs4YPNte0EtxVvmjpjb4YPCbr1ceEGO+KxI0zKfhi\nohRf3anEaF8Ctpc6Ik9oPQnlElt0KH3w2cfF3LuM6O3zEuxdt0QxrVm6T2Gv\/nQwHlePi3B7VIq7\nF3PR1eiP6DW6CHPURcRqfUTzDRGzxhCxz8HG0XweBE56CHV8B+ViW1w+kYI\/qUsweixGc65HoDdt\nBHcXzdXrqHfRfKrKxHBXDLLCTCFYrYdIl1mI4RtAuMYAIjcDxLnzkEBg1zg3HndP6MojsjxEORsg\nwlkHu9c747NrBRg\/LlKxcvPDw0bN46tF+OJyvvbRqFT1VF2hmKoKvEyIqe6P9MfnjPeLMNwZjXgv\nA06xzBBrHN8rhOb6evzwaNtLfPdw82sY7UtB8zo+xAEmnKoxa2ZhW\/Fy3BmRYuJcJu6fk2CC5mbX\nU7t9caB6Oc7sj9QwUSYReTBW2P90okr9r28OyZh1f3+8T\/n001qMHI3Fxb54yKMskRFqjWun5ZQY\n1WivD0GMpwUClushYJney6s\/IZxcXpLiwL3zzb1qPP6kkiPK1BR5GOBQvSfFsgRHNruhn8aDLd5o\nzF+kbCyweXMCjR6JVd8aTMQLjHcI8FFbEG6eTUVN1mLUyZ3xmIgN9yQhI2oR8mJt0F7rh+6m8Gdo\nDn857moMR\/smPxSKbLB2uS721Hjhq1sVGGyLQIqfCVLXGuH84QiM9cZiuC2YlFuBKVV79aeU2yiu\ndEdB3SdEf4MnumpdMd4nQs92XyT5zIE0Yj5ivcwh8jLCaK8En9+oRPeOSDRWeE2JoSMJeHRtHT45\nK0VjqQs2ZK\/AE8r+y\/1iSiQDKMQ2uPZhIi50CtCQa\/P2TUYtWbBrnb32Sk8UJgZEUB0W4OOTSShP\nWsjFT5z7bJQnLsZYnwTSSFvOpRGrdSlJ9GhBXcTydV+7Cpx0EUjvFCYuxaUBCc51RENZ4owvqDYq\nC53I6NnobfaDikqXUm7380rPluyFQVtz7bQHN6zC2YOhONbkg9QgcyJnhCRvY5QlLKIMNkCipwG5\n3R6n98fi6zsbp8TF3kS0VntC4j8b4US2pcINN0+l4mhTCD45nUoVYBYa8uwxdjQGhxvcfn5trJXM\n1dtevEQxRDHYun414j1NiBDFja8JsgJNke5vjHMHRehUBqNM7ABZlC2yn+PFuCbbEVcHkqAZowJ\/\nMgVl8QvIsN\/QRiEWEx9l4OyBKGySOiA\/Zi6GaR1SV\/1Xzc72WyMlKgbN9ZqfJnx8T6BMdTgcynx7\nCN2MkexjgowAM2QHm5M7ViAz7F2qc7OJ7Byk+b2K2WTIHIi9eRC6G2KsKw4PhjPw+8FkyCMsSE1j\n3CTCTSVOUBasRFaoBU5QDx\/cG4CLhwQvcaE9BBvT3506o394tEs22h2Hc9T4q9MXQ+RuDImvGaTk\nalmwBcES2TSWBtI9UpSNc4i4PMQCOYTsIFOObKK7Pmqzl+PeuTTcPSOGeiAOKT4GkAmsUZ+7nDoR\nj7LZHMe2e+F4iy8apUup5HhgZH8ohwMbHCcnzvealvjrA2IMNHrj1J4A1Enfp\/gzRqofqRf0jEAu\nQR5qiTxCfrgVCmnBooi5KI6chyIas\/uZAcYoT1lE7VGCV0tXV50rkjyJmJ8RecUIGTRnr9KTSHpC\ntS8ER2pdsCXHVl2VZq0iaKrSrfgzepsCZPfHihV3h\/KVl46IcHqHPzpqXPDhDm80yB1eI5hLi3Pk\nwqyQH8bIzUUhkXtJMNyaM2Bn2WpMfJiM3q2+UHWIMHIwAjcHhLhCGZvowUM6dRaJrymkNEev0h1d\n9a5Ejo9KiZWG5cALwTYkW1vOqE6b135iuw9OETGGC20hGCDZ+7a5Y1fZKo4gc3E2uVdOE3LkiEgB\nAynGSDKCRXTND7fk3N6cvwyHNnpRqYrH+b1B6G0KhvpoFE40+VEJ4iFjrSkkfqbIj15ARrjhQI0T\nqiRzteVJ1pPbbVmyseX2vCU4SSRfoGvTGvTU88k6Dy5JxD5kbdB\/COaFPyf5nCC7FtB9WZAZqT0b\npVSOzraG4UZPJG1Shdx1rC0QAmdDSixyLSmYQgrWpC\/l1mkpsydypm8+ApQlmgeVJlhoSxMtwFCS\naKlqrVjGWZcjeBdJXqZktTlHUP4qQQKLQxZ3LFEyAoygSHkP6v4kXKDsLBItwpUDQejb7I5oNyMu\nwzPXslJlgmQvE+ypcMLhjauwrXCJ8n\/frJYt13RscERzySrEe5g8i0PK4FdVlIdacTEnpczNIGV2\nUTG+0R2N881eEHqa0rZLHyGOsxBF27J0SoxMcn8Wp7IZMoOtcLTBFW2KD3BqrwD3x8vb2SblZ55F\nOvn7qpyxu\/R99Da4UzmwQrL3MxW5RCGCuaGs5JhxxZuVlSMNAbhG7bGLinu0K3UeT0NOsXTK6CxS\njZUlGaeyOZUbUzQWrkRbhQPqpbZokdujZ5MrWkqXaW8MF739tHf\/SqWis9oFDdm22FduT0HsijhS\nUezLCLFyw2ohqbDWBDnhFlQzYzC60wstufakliFHmD2T0js5IVQnWQjQf7KoZkpIPXnkfDJ8DXYU\nLMbBKiccoxA4soEPtuaGtPlv3zgc3RGsOFS5mixciQbpfHTXOXHFNYFaHluAdRUWS4zcxU4Rzm91\nRoVoAfVXHudKphiLSUbqRdyyJGOuTQ2wwMkWPzTLbbBVtghH69zQUujAYXfxMmyW2iEvxtjyJwl2\nK\/1VBxVOeDicRi5YhIbMeeiudUJToSNHUuxN8DHGmdYonKlbidJoa8TTVp9lKOfKkP+EgoxIZpLq\nzLDC2IWknAeacxeiOtkSm9JtII8x0eREzunPiTJS0FVdHEfVInL21G5m\/W\/oUFx7O2XXgYpVnOTb\ncpYgVzAHdRIL7ClajMO1HtzuJt5jDtYJF1IGW9GYRwSYcmZc62MtkRX2TIrZNP9nMVcYY4NBKv5b\n0ixRmWCmzQozlEkE+pM2qSXJ897s4pxIY2VN6gJy62IOtWShjKxiE1VJ7NRVccbYWWDHLcTUENKG\nId6d+q4ntS5vIyL5LNsZWLyyxEoLsER3vTf6GlywKdmUjDLDoc0+7f\/3KS4jlKdID+OpGNj4hZV1\n+R8oi6PNqWsYQiEyxI58W9p1O2OvwoX2iXaoSH4PlSlLUCVeikrC9gJHdNa6o69+NWpTiFg0D1WJ\nVly27ipcQYemIuW0no8HW2Msq1PmazcmL6COwUNeyExURM\/isKfQbhLqUy24Z6UR+hQGBtgoWch9\nv2GnuK6Na1CdaoNp\/9QmjzBpV2a8h17KvJ35Dkj119dm+OqoM\/108N\/I8tfRij10+hN99TQ5EUYo\nijVHqciSYtkWbA42nnaCyYEz47ek2qGbFNiSbofktTO5WJIEG7RXJ81Hk+x9rpezwlsmtHrti5h4\n7Uw++396CE\/L5pBHmkw\/QZqcX5tsA4aCSDMkBcx8WQ4kgbMUlXHzsK9kBXbmOXDPp5pD4qGvVxRl\njiT\/mcppJ5gaxFPLBSbIDDFEgp\/upHODOHCmbD2RrEmYT0Xc6I0KJfjpqSUeM\/SmlZzQ652lcT66\nCgaRr86UTV1Ai5ZEWaBSOBcp\/vrqn5rrF\/leLfLU4UtD5iDeR0\/1i5F404+pJ\/TWUcV6vRM\/nfP+\nGz\/mO1sKfgqoAAAAAElFTkSuQmCC",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/emblem_mab-1334253964.swf",
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

log.info("emblem_mab.js LOADED");

// generated ok 2012-08-27 19:07:46 by mackenzie
