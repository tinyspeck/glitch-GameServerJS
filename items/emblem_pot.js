//#include include/takeable.js

var label = "Emblem of Pot";
var version = "1346119666";
var name_single = "Emblem of Pot";
var name_plural = "Emblems of Pot";
var article = "an";
var description = "Gleaming as if lit from within, this Emblem of Pot looks like the kind of thing you should hold on to. It may just come in handy down the road, hm?";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 0;
var input_for = [];
var parent_classes = ["emblem_pot", "emblem_base", "takeable"];
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
	out.push([2, "This can be obtained by earning favor with Pot. The quickest way to earn favor is by donating to Shrines."]);
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
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAALRElEQVR42s1YeVRTVx72\/1oBDbIG\nFJWidtSKoqISQfZ9MYR9SSAkYEiIKJsQkEVUMIIFcQGURRFZpCPiUogi4FIxtCMuozWtU9vaLTPt\n9Jw5c2bON7\/3HO0iVFtzTvvO+U7e413u\/e73W++bMsVA13++ag0a7ZVopvwRr39\/dij+2zvFaCpe\npvvDkcM3LbYPRzLwjTaTCC5vfOF4\/VEe9M2LDUig3ej2YNakC9\/uT1cx5BiMtIXpmPHPKfz5Ifn3\nD9S6f9wqxMWjETh3OEz34Gq+YUh+\/2CP5lpHpHay93\/tT9Ew5IZbwvHZZTnu9qdpGVV\/7JsMMWbM\nWE80GgsdNfvLHY0Mox6Z4ovRbHx2JR36uxXdzGI\/ft\/fGWp7rimoe\/zdZJza74ezjcFg7j8YkOk1\nHQL5QBef988P1bqvRjfh0Ug6ho6GoiH\/LZ7BzHv6QABvvC8Bj68pWNy\/kIpHo1v1t4Y3a8beTdHe\nHVHg0Qdb8dWdbfh8XPVT3FRBd30Lxi9uxFifEEdLeWDmMijBuvyFi290ReFT2r22MwbDbQLcOJuE\nT8Zy8cXtQgx2JUCdvQKKSFukC7iQhVuzkNN9rsgeTZWe+Oh6NjuWIXrrXTEObl2kMmiU1quWam\/2\nxuNaTyxuX0rH\/SuZ6KoLRrSbMTasNkbE2hmIXmeKJF8rNJYHoG1vOJL8rBC1joPwNcYIc34dhZKF\nuNYrxt+0ORjsjNKdb+cbGYzg\/iw7o9ZKnu7ukBxX3hFCSWoJXKYj2tUc8e6WSHS3QIL7TAydTMOX\npNSXt1RorfRBoocZEjws2DFR68wQ4TIN9WWueDiaheGeWA2Tbr57UK379FoWPrmcqf94UKZ5rC1Q\nTZQFngXERH8f6RHJr58W4UafmJQxQyTPDHHrLZDoaYlkHyske1sgydsMX98pRXtNKE4ejMJHVzfT\nOzOIfS0gpjEiLyvEEdEYNw5qC1bj3rACY+fTcO+8GGPdsexv334fHCl2wtnDAh0jynNE7l\/a0v14\nrEj736+b5czu\/vVpvfrxzXIMdcfh\/fNS5CbOI9XMWEWSvCwhITOmBVhB6mdOBDi4dUGO3dlrsU26\nhEhGEEFTpAZYYGMAF1J\/a3q2JkVJca+Z6KwNwF\/6U3Fspxu6KzzQW+uF6syF6urNDpMH0OCxaO14\nbyKeYriFj9MNQRgfSEXFpqW0+ycmZRZKpUVlQdZE0BKF4kUY7k7F\/cu50J7PJF+TkZ9JMdAaB3mI\nNTYGWkEezKWxXFL0CcmNYVxcPhmP4a5YDDQEk3IrMKFqP77USgfV1eMR0HbFoLvSA23lruwEnW\/7\nIdnPkjVrsjepFmgDRYgNu3BJyhI8GtuGh1eUE6Kz2o\/dRHqwNTJCbel\/bMjkT0iWpy\/G+2fFuHCU\nj8oMhxc3GeW0g7qtS\/VX2yMwdjIWmlY+rp8SoiDJgVVPSH6U6s9lF3pKcKhDDB0Fz74iD8gEDhg6\nHoOb56Qola\/CUHsC+05GKsqCrKAItYEybBarJOOTkkBr9DWE4uLxSKiVC14u9exKfyNod8YCfVOJ\nM841haJzrzckQTasaRnzyIIYgjZIJ\/NK\/c3RXOaGWpU7RagJRbIxisQLKKW8hRhXY+xWOuJDyn21\nOatZX2TMzGxOHmxL\/vtExboCZ1yhIGmtdHv53FgutjOqyl6k6icfPLRtDeJpIqHnD+qlB3FZs6X4\nzKRFZiB8rQmlmulE0ITGzaDNMDBG\/HpjStj2SCSTpvia\/d8XbZARZvtMxXzRfFwiBc+3RGr\/rtvX\nOH4xR8NAN1r6y4R7DgTKNa0boM5kgoNJI1as\/zzzPYrUB8NZ+GhYyaI2xwnNuwLw8L0CfD5WiNFT\nEkgCzCjANrPP7\/Uk0wbNWeUVrAVs2GBTCubgDAVi70F\/DDXzn+FCYwjKpHMnjujvPq6TDx6Pw3kq\n\/MXSNxFLwSFmCJJyrHr+FuQ3Qtw6LUTrTm9U57iw9z\/HB6dEuHM2+dlzVcZbrPKMivIQW1KVskDI\nLPTU+KCn1gfVssWUctxx8XAoiyMlq54PnG91tfGjJ5NxstoLfQf8sUO25En0+lBqCGTSiyWb33pq\ngtGy3ROBTtMoN76OutxVOKhyRWroHBabohxw8QgfXXv8oIiYj5vvxKO3xg8SX3M2PTEkGT+Uhc5G\n914vdFZ5QFMfgmPlLtilmK8tkszWEHRF0lm8KR17\/eX3LmWr7vRnqkeOxeIMTdRS6oJ3arxQSY7+\nlGAqpZqdGSvQUROOZvUGHK7cQHU3DG3VoTheHYZdWW4okiymIHmCMvky7Ct0xw6FE0vwzP4QpIdy\n2U0ylmAUlG+wQ+ced7RVuBI5HuXUWTomBp4KViKabTulWDKn8c9V3ugjYgwuNITgZJUn7X496vKc\nWYJJXhY0oTkuHUuA9kTEhHif8ufds5IJwbxjcIKqhoQqTxr5MVMCMyPt0bHbDUdKV1MGsNPnC2c\/\nX27zRBa2VZsW4RSRfIq27evQXsFDh9qdDRIhFf4k75m4r5FjtI3\/SmA2KiVriLwtUSpdzK5Tm7eU\nyFlNfgTIS+QG5SbY6HMTbcAgJ9FWc6hgObs7BX8upQ0z6k5McetUEt5rCX0lbAq3Y5sLoacFDlDj\n0FrmjD1bFql\/fbOa56RrKVmFt3OcEes2k0hySAEBrhwOfCVUUrQKPWdSJeHiRKUrGlTL0HeQTx1O\nfiPTpLzkWeQor75oLfbnLkFH5XpqRrnki6Y487Y3Rur9Xgm5sfa0WVNUKBzRUOCICtl81CqXon27\nK2pzl+tvDGS9+LR372qh6mixCyrT56M+fykOqNZQB22K\/Lg5GDrg\/UoQuHCQRmmmtWwNaja\/iaai\n1ejcuR7HSnhg1iyRzHtx43CiJljVXLiGdriSTDKPJluJYskiqrEc1GQswWCtx29CVpQ9JX5TquEu\nqJLbY7d8IU7soHq+xZHF\/uzl2ClbQHnUwvYXCR5X+2maVKvxYEBCJliIilQ7HClyQlnqEuqoZyAr\nwg6aateXRhelkS2Rc5FI3XddrhMq0+Zim9AG26UOUEZZ6hQCs25FhLmKfrXZcdT1CGZObGam\/vU3\nxzU2UnQdoU6DkXyPYhEy+GbYnsTFXoUDarJXUvXg0IGJgxLRApwqX41+tcuE6Ni2kh0T4jyD\/NgS\nDYX0LLRGQbylfmOYqVzMN3muSc0RzZncxAqBhbo0xZ7M+iaLctqhnHbFTEStlFYVa06meQPtu9Yh\ngwp9JG86glaakF+Zst2JyPsHRFEPGehkgggeB3s2LcOhfEcUxVkgN8oSTeWejb\/5FJcaylFJwzga\nBsz9013uyFymzo7kYgufA1U0B3szHEiRFVQOlxFZOyjDnyAjfDb7nE\/KqTc54tDWpSiKN0dO+Ayo\n4m1xvGwd6rasoENTltqg5+PeQ1G2xUnz9GV0IJcHcaAMNsJWgQnywk3I9PaoSp+HPTIGc9nfMqEV\nculd1gZjKEOmozTZnv1+w5zi2ohkcYoDDP6pTRlu2ahO\/RM6KPL2ZToixc9En+ozVZvmOxU\/x0a\/\nqfpk96ndiT5GOkW4ObKiuZQDbbFDPB\/MHMy9wQmKAo3jd6UsYM20S7oAogBj1pfEwTMai4XzsFe+\nhK3lTOLNi5n1ky9iyQHGPOb\/pSEcPTOHUmBpeII0Oa9c5AAGmwXWEPobP0sH4sDpqkJK5PU5K7CP\nfI95P9EcYncTo6wILoR+xmqDE0wJ4miVfEvqhE2R4DvtuXNDcqCxfBuRLE2YB8UG80kVSvA10ord\npxgZlFyM52uL47ynqRjE+kydsKjzadGcCBsUxlDH4mei\/aW5fpfv1bEeU3myEDPEextpfjcSk12M\nejFeUzXRnq\/FG3Le\/wEwQYjaPTd+KwAAAABJRU5ErkJggg==",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/emblem_pot-1334253998.swf",
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

log.info("emblem_pot.js LOADED");

// generated ok 2012-08-27 19:07:46 by mackenzie
