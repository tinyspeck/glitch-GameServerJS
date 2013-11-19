//#include include/takeable.js

var label = "Emblem of Alph";
var version = "1346119666";
var name_single = "Emblem of Alph";
var name_plural = "Emblems of Alph";
var article = "an";
var description = "As valuable as it is shiny, this Emblem of Alph enables special skills and abilities.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 0;
var input_for = [];
var parent_classes = ["emblem_alph", "emblem_base", "takeable"];
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
	out.push([2, "This can be obtained by earning favor with Alph. The quickest way to earn favor is by donating to Shrines."]);
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
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAMPklEQVR42s1YeVCTZx72f52CNyAk\niEURrFi8RQkgyBHkCGC4whUIZy5AkDMggiBgFBHBKoioiAp4FhUxeB8VQ2vRqtW0dtW10zY9tjM7\nO7vz7O\/9ENYdtXZ3mGkz88yX5Pvye5\/f87veN2PGjNLrn9\/tD+g\/lawb82d8\/eP5rpifvyjF3tIF\nhj8dOfywj\/\/kqho\/6LOI4MLmdz5vPCCAsdVxFAkcMrl3MeetC9\/rVWgYOYarB4MN7PnXFP7rLuWv\nj7WGn+4W48KBMJzdE2x4fKNwdEj++niL7uaRcP3b7j\/oTdIxclf2rcHza0rc703TM1VfzU1GjD0z\ncCwSzcXzdY0V801GRz0Kxbf96\/D8ugLG+9VdbLFX7\/d2iPhn9wZ0DZ5LxMlGIc40B4K9\/+y83Kg7\nIlae7wwV\/O2R1vBdfyaeXlXg8gERmgo\/FIxaeD\/euVow2B2LFzdVHL7sS8XT\/gLj3StrdQPnkvT3\nr6rw9LMCGL8s4\/DDg1J8e7cEz+5o8ESfj7uXVLh9Jgn9J2Kwf4MLmK1RJdhQ6OB4uzMCz8h7fUcU\nrhwU04IJeHwzB48+ycGJZjHKFPORFsJDWigfqaE8pAbzkExQhs3A5tzluHJMhnuXs9BPRAd7EvFR\nwVzNqFbpbo2T\/vNTMbh5TIJ7lxT44ooa+zb7Yo2LKQKWjEfgkokQOU9B8CvIS1iElhoR9lQHIl1s\nh0yJLc61SfDVrRxc7Igw9BwKNRk1go05Nib7awSG+5eVuH48HkoxDyHOEyBZZYU7fdn46fEmDs\/v\nrCdiC9DdKsWPjyq5kH8zUEjXcnJkMhF\/Dw0lLnjSn0OqSnSs3fzyuNbwjKLxl2tZxq8vynUv9EWa\nN3WBkYJ40\/dXj0mVtz6W4na3DAnCqRCvmAKxy1TsLPMdyb0hlL9EGamcjcON4dhZLuQ+S1fbkOJT\nESaYiLqCpXh4RYWBnjQ87JFhoEvCXbsbfdBSughn9ogNTJTXiHx5KbvrxUCJ\/l\/ftyqZd39\/tlv7\n4vMKXO6Kxqc9KciLs0WE6xREupohXGCGHeu98f399SNo1QZx169v5+EbKhCJjw1CBJa40JGAnrY4\nxPrw6fdmiPGcjI761bjTm4q2Te7oqvbEqXov1GY5aGvX2r29gC62ReoHT8VhGFf2heLjpgAMnk9F\ndaYTotzNIFlpDomHBaRCPq6dTMe3g0Uj8F04CbmyBdiY6UaVrEFe4gIMXlCP3N+zSYhoD3NEk430\nYCtcOxqDK50SnG8KJOUW442qvfrSZthpbrSHQd8Zha4aTxyscOMMdNQJkSi04AzHrzJH3CoL9O6P\nwfOBPAz2rcXWQk9kxX6IgKWTEbJiKqqynLl7n\/XKueswtLmukHpPQ4LXNMR6WqBC4YhPz8jQdyAU\nNWq7d28yKsiDhgIn441DYRg4KoFufyhunYxHUYIdp148GU7ypQW8LXGxPQZPqSIZ7vTIUZvnhhgv\nHqK9+FBHOGBPpXDk\/oMLKtQVepANc6T4WSFZaAkp2Ur2t0R3kwgX2sOhzbD\/fa2nSjErYLPa3rh3\nwzKc3StCxzZvJAfwEENhlflaIpWMsmt9oSueXM8cwek9ERC7T0Nx0vz\/+n57oTtES6cgjgilCK2Q\n7s+DnOwxkkzFhqJluE5Fsr\/G\/ff3xgqZjcnWdXM1vZSDu9Yvp6S2oNBOQyp5rwziI2W1FafA1U4p\nDNR6GHZvFOLWcSk14uSR7xjqClyJCJHz40ERyIeKfq8W8ZH20kahdDYukYI9+8L1Pxp2NA9eyNUx\nGPrLfpvwsZ3+St3+EGiznLjQJFDuMO+ZcaYAC1WEqzk2Kpfgq8tqPOpL43C9IwZb1rlgK6EkbSm1\nFTPKO0ukB\/CRIbJGZrA1MggKspHoY4kM8QycpkI89ZEfLreGjqCvOQjlKe+\/uaJ\/+bpBebE9Gj00\n+EtT5nCVKyNjikAeZ1xNKsiJbBKFOppCf7w+CA96kjjkJzhxxdJQQm3klBSpIlvEcurzoAq05hxk\nNlgk2O\/TgqxxbLsPjtX7oFbuSC3HAxf2iDi0bFj6euH8bKiP6T+aiKO1Xuje6YdK+TyuepkxZeCQ\n8QxahAs1qRhHi0s8LVGdtRyV6mXwXTSJ2stiPNLJ0bs3AlfbwnC6MRBJlH+pq2k+k5Pq4KFQszyU\ni6aja5sXOrZ6Qrc7CG0VLqhSzdaXJE\/XEQwlKdaCMUe2+SkfXlqn+aI3S3uV5uXp7ULsK3PB8e1e\nqMmY\/xpBFiY1hYvlUVtNIPraYpEdORuhK8yQGeVIeZgGhXg2PjmWjPP7ItCzO4Q2CMuhCBpKD6bi\nEEHK6RAbdGzxwMFqNyInQLHM2sBqYFiwDdLp\/DGlyTOaT2z1RjcRY+hrCsLRravQuWUlGvKXcQRf\nDfGrBDu0QlxsXYOzjf60IZiHwdMpqM12pqIJQEu5F3Ki7FEhX4hzBxJQFOvAqc7UHw5xVvhMHNns\njpYyZ5TIbIyF8dNfH7f5UnP+1sy5OEkkh3FwoysOVQtwRDvUvxKpSJj3wwRVpALLq8ywWbjUKkZL\niQC3O2NxqGoVlOGOOFEvotbCgyxgBsrkS\/H58VikBU4nUlZcJIaLpCzFkVunPt+JyE17+xEgP84q\nIC+WZ8yL44EhN46v21W0kPNOFfr+UJshxTJeVqEqeCgHWfNuq\/SCes1MNOQtg5gquz5PgNQgWyhD\n7VCcsggx\/vbYWuCNfFKQC2vQf9rMziJn7C9fhi3Zc7X\/+2Y1f5Fh34alqMtdxjVqFhLFyzxklZxM\nBFkLaa0Q4lC521BL8bIkEkQ+wAbpQTaQBc6kpr6SHJ770snhRm1FilrjcI0bmjS0RfsolHY4hc1s\nk\/I7zyIHBLtLVqAxbx6O1KxE0mprzmOmojKIR31tqM0UJDrhDg399YlzucnAFmZhZONQ4m6BzloR\nKfcBN7\/ZvXSuh\/K4vlqbvQRNRfNRLZ+N+gwnHNroRuovNN4+n\/Pu097DG8WaA6UuqFHMxu5CJ0pi\nN67nsbxhoWXTJMFnGvpawnCobAWnHrvH2glDdqQDuncEQqv4kDYHFtzzCmrWaf5W3KjMENuS467Y\nvnYO9pY4o2PTSrRtEICtuSHZ9t0bh8PbAzWtxcvJwyWokduivdIZ1WrKJ09zLu8Y9tJ4O6115bZf\ncTTOWHgZySrFEpyp9Uap1IHrk4ycnJFbPaR6Eil4st4XdRl22Kx0wOFKd9Rnz+fQuG4hNsntkRlh\nzv9Ngu1aoW6vxhmPzydTCBxQkzYD7RXOqF27hKvqJD9r3GgJwkYiw5SNpRCmiWxwoi4Qmmg7RLJn\nhENKs7RgqjPlsiNnkXIeqFPPIgf42Jhih4wIC4NKPLVLFWamoat+XTR1C\/GUN4eZzb\/e1ujmZqqu\nFtppMMm3qOZCHToVlTIeGrMd0FjoglzJHHTX+SHcdSq3FVsnccCJzasQQXnHNqWMDFOL9U\/2Xkph\nzo6wwylq\/lXJfBTHWhrTgycrZaHjX9uk5kpnvD3EKrG5tixpJoV1DocK8lBJXjFDJTJ7fbHEDJsV\ndqSCOzTJC7itf3XGcpyr86aZbYEoNzNOzXgixIoqnhWHHx\/t1V7orHHBRuk0FERR5W\/ybv6\/T3Gp\nokmalOBJOgb2ftjLyqwF2pwwS2rUk1AUORnb1PZoogQ\/2SiGnB0tI2YjmyZHXswcFEnnYkvWEhyo\nWInO6uWoSCBi4ZNQEmfNVWtD9mI6NOVoR\/V8fGpXBL80wdZYFk9N2H8i1AGmWBcyATkh46GVz+JQ\nq5qFHZl22Jltj+okHorCJyBvzXhkiiaiXDaL+\/+GneIOlruiNMkOo\/5XW8Yai2Zt6gc4QpW3nQ5S\nMl9TY7LX2IFU77Hg4DsWab7jOKQLxxkTPcZ1xfmYGFRrzJATaYU8CZ9yeTaYDfZ+1AlK\/U1jqpLs\n0U4KVKXY03nXlMslWeDE5lJSdptyHjfLWePNj7L+r3\/EElebCtjvU4ImGZmNDLHF6BMk44IKqR0Y\n1ootEe9nOtIOZP4TNMXRM7A7dzGFeT53\/002ZB7jTXLCaI4LTbWjTjApYJI+I5R6XtBkxPq+99q5\nIdHfVLmeSJbF2kIVYvZWhWJ9TfQyjzEmo0ouatVYx2jv9zQMEp9xbxzqobRobhgPxVE2SBCO1\/+W\nrT\/k\/2qJ5ziBPGgqYrxNdH8Yibe9mHpRXuN0kavGxoym3X8Dg+5VbBkzezYAAAAASUVORK5CYII=\n",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/emblem_alph-1334253470.swf",
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

log.info("emblem_alph.js LOADED");

// generated ok 2012-08-27 19:07:46 by mackenzie
