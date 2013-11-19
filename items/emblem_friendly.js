//#include include/takeable.js

var label = "Emblem of Friendly";
var version = "1346119666";
var name_single = "Emblem of Friendly";
var name_plural = "Emblems of Friendly";
var article = "an";
var description = "Radiantly important and importantly radiant, this Emblem of Friendly can unlock special talents.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 0;
var input_for = [];
var parent_classes = ["emblem_friendly", "emblem_base", "takeable"];
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
	out.push([2, "This can be obtained by earning favor with Friendly. The quickest way to earn favor is by donating to Shrines."]);
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
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAMD0lEQVR42s1YaVBUVxr198QJi0jT\nrK4RUXGPwa1lk32XfWmgm6bZuqHZ1wYRRQFbUBFBIcomyKJGghu2irhQYpNEokbHjk40YyaTnkkm\nVVNTM3Xmuw+1zIAxM0VV8qpOvdfvvr7v3G8533fftGlTdPzr21afkT6petpv8fjn14eE398rxdHS\nVdrfHDl812L15FoavtNkEMHVTW99XtcmgK556RQS6NS7eyX7jS++OyBTMnIM144FaNnzEyz8p0Py\nHx+ptH\/7vBiX20Jw7sMA7aObhVND8sdHe9TDXaGaN41\/MRCvZuSGWoLw9XU57g8kaZhVX49NRow9\nM3oyHE3FK9UHy1fqTY31yBXfjOTg6xsy6O5X9rKXvT4+0O1vde6oT+\/YhTicPuiBs02+YNefXkzR\nqbuC5Rd7AgV\/\/4NK++1IOp5ek+Fqmz8aC5cLpsy9H9d7Ccb6o\/F8OJXDw0uJeDpSoPt8KFM9eiFe\nc\/9aKp5+WgDdw7IJ+PO9rdDeysLY5WSM9seirUwANteUEqwrXLT0dk8YntHqNd0RGDoWjNtnxfhq\nNA\/f3C3GlZ5oVOfZIT1i9gQUShaiReWKL2\/lcM8yop9fkKChwFY5pVl6WLlCc6dPiOGTkbg7KMPD\nGxnoqfNFuIM+tqzTR8hGI0Q48BHpyEfUawi35yF4gyEC1v4exdJFGO6T4I+aXFzpDtOe7wzUmzKC\nB7Pn6LVWCbT3r8px41QsFKFWCNpogDAiEOXER8xmU4hcTSFxM0e8+zjYdZyrGWI3m0HoZIqwTTxa\nyLs4vN0eT0ayMXQyUs3k5odHNdpnw9n46nqG7vGVFPVzTZFyMhV4lRCT3b92UiS\/9bEIt\/slEHvw\nECrgIdLBhIjxIXYzhdTDDIle5pD5WEDua8Uhha6TvC0g9SSibmbcIpiFIxyMUFu0Dg+GUjF6PgkP\nzksw2hvJnfsPuuFI6fs4+2GwlhllApGHg1m9z0dLNP\/+S7Ocre4fzw6rnt8px9XeKIyekyJXOI8s\nYcy5L9bZhKzEx\/78TRwxhlQ\/KygCZnFI9WdELTikB89FvMe4laOdTRHjYozuWi98NpCI9l0O6K10\nRl+tC2oyFqlqMq3fnEBX2sM1Y30xeImhlkB83OiDsYuJqFAs52Iq0pFHbiPLufLIlTxoziqwK2UF\nkrxMiaAFFESMIZWIJXuboSxxBTqr\/blxZmkJuZ+RTA6wwPUTQgz1ROJioy9Zbg0mtdrrh0phrbzZ\nEQJNTwR6q5xxrNyem6B7nwfE7nzOrRmh1ujd7w+lyAbJvmb47oudaN21meLNGEmeppAzN\/tZQuZt\njgRPE6iPxWGwU4gEDz5S6F6ytyUXn4xkuWwpPjkrwaW2QFSlWb+9ySinFdQVrNDd7AzB6IlIqFsD\ncet0LIrE1pz1op35RISPYMra9mo\/soAEzzQFJM5bEONkiNyI97A73Q7ZwXOQ7MnnSD8ZUWKwKxbx\nbjwke5lx7k\/ysoDIxQxSItzf6I\/LHaFQKWx+mfRUyBb47E6z0R3dthbnjvqje68rpD6WXNyJXPi0\neh7ELjMR7cIj60rwJQn14xsKPL2dx\/2uyVkPReBccqcJqnM24MlwJvdMnNtMImjKuZ8lkdRj3Ip1\nRWtxg5Kktcrhl2tjuWSOXnWOrXKAYvDQ1vUQssAmxFPGpgXOwkcNYfh2bDueXM\/AIxJfBnVLGPzX\nGSOckiiRrCch651ping1zhbF4jDN3+onViwULcQgWfB8S6jmr9oDTWOXc9UM2pGynyd8st5brm7d\nAlXGCk6ERS7jQd5V44sOlSf2ZK1HZqQNnt7KR6F4GbKEtuip9qBYM+GSR+xihIdX0vBgQMohTDCD\niBNBis+0gHEZEpP8KCjDz1Ai9jV44mpz4CtcavLD9oR5k2f0D4\/r5Fc6onCeCn9pwmJOv5joJlIM\nxbqY0MuJwGYjkhpDPL6WiTgiHuc6k9O6FB9zSIlgXZE97p+L53DvjBihGwwgpfBIocxmyZJEiKOQ\nSfS1RO8+V5ysdUNNylKSHCdc\/tCfw5FtdhMT53ttrXDkRBxO1Ligv94TO1OWcfEncRufOIXkg5Fg\nlsqNWIDhXjHJDo9zq4zuJ5OV4sh6n51JwtjpaDy8msOdg9cbkBeMkLrFEnsy7LgYFdFikyi+u\/Y4\no7vaGerDfmgv34iK1IWaEulsNUFbkjBLMK1rr6f8wWCO8t5AhupaeyTO7PdAS9lGnNrvgirFylcE\nZb7j7lG8EOHskLmoybIjwmZc1rIkiHej2GsMx52PhPj0RAR6DoRw56D1+jjbGEyxFo1BSj523p6w\nFEmUMJ1VDjhWaU\/kBCiWzNKyHHhpsG2i2VbTSqVzmz6qdkU\/EWO41OiHE9Wb0bPHEXX5a18QNB8n\nSOTS\/C05vZN5M9fykEAayYil+lug\/3A4PiEd1RwPQUa4DYZPJWGoOYAsqIetElvcORXNje3P\/gB+\naw0h2zIbHRWbcKRsHUokc3SFsbMnltt8Ed+qOt0Wp4nkSxzbsQmdlQJ0qZy4JBFTmWJxI2MufiHC\n8e6s3M1EJlmytzYI9y7IcKt9CwabfFAQswThTpQoF2Uk+I60SH0UxiyimEzknmkqZAs3oues0b5z\nA2rzVxA5szdvAfJjLHzyoi11eTGWYMiNsVIfKlqNrt0OkG+ZSzJDViRLsYrAtLBIvIRIBeJ6hxD3\n+uMx3OyLMxTspfHLSG4MEbj2d9iVtoYjsydtFf1\/BhqK7RHrYQGvNYaQeM0igsaozlyN5m12pAq2\nqv+9Wc1\/X9tCf95L7ohyYDXYhLLTETe6RBg9HobrjZ6vcPlICKqyHHCgYCMREaBBKcCN9ghuTEiN\nRRyFAEssiZsJZTmfIyeiuG7ZsR6NylXobwikDqewiTUpv3Av0iY4XLIBB\/OWobPCHnHuFvTyTWgt\nFeAoqX9n2QZcrXd9K8opEWKcSbxZLfYZV4F4DzNusbsVq1CfvxyVKQtRq6CmYoc9avNW625fzH77\nbu\/BzWJlW+lGVMkWooEmqaceLkQwk7JxBgIJPh8YwHuNAZyW63Fw5qD\/E2xebkCNrRE1EfxX7Vgy\n9YhMERRB83CcYnxfxiIcLVmH7l2OaN8mAHvnNun8tzcOx\/f7KpuLyfxFH6AyaR5tyNdQ67SMEsaY\naii5h3o6CZckPA4si18Hu5dA44le4+KdShWEkeM6bk9LnK51xz6FNXbLF+H4TgfUZq3kcDBnNbVv\nNkgP41v9LMEOlYf6qHIdHl2UkgsWoTJxDtrL7KjreB9CRxOucZC6m5JAm48L+CSQvWhYWVlLZJYj\nclnhC9BV5YR9aQtQKrLCjgRrKMJMtanBvN7UEBMlnTU5UZZUAo0ndzOrfwPNUU1N5NIjFGvM5HtS\nbalJ4GGnxBL12YvRWu7E7TO4lom6Elb4ZVQR5OTC1Bdg1+weG5NS5oqpVGaFWaOPxL9CaoXiaHNd\ncsBMuSTQYEKTmiua+2YXpwbzVWXx76EqZTGHclqhnFbFJiqR2GhKovg4kGmDC4c8URi7hGuZGNG4\nFxsmRpgRYtfsHrcITyt0VLqgp2ojdojMUBBhjuZdrk3\/9y4u0d9ImRBgpGZg1y9XuTNjlSonlEpc\n0ExsjTJGQ85i9KocqAo4Qim2RXHcUpS8ALuuzrRDG4l0T+V6lIuJWKgRSmJmcdlal7WGNk3Zqind\nH\/cdCrMqFc\/XbRe9R6XOCOl++igKNeRQn2UzAZXxltxYXpAB0v1nYLtkAff9hu3ijm3fRKJujSn\/\n1KYIMm1SJS5BF2XegYyVpGkGukS36Zok9+n4byR7TNfFOU3vjXHT06YGmSA73AJ5kVYUywvB5mDX\nU05Q5K0vrIi3QQdZoCLBBiIvfS6WJL4zmkpj52OvfBlXy5nw5kfM+skXsTgvfQH7f4KfkY7NoQg2\nnXqCNLmgXGQNhsxgc8R66r+SA4m3obI4ai4O567BgfSV3Phkc0icDPSyQyyoLuurppxgvI+RRhFI\nnY0fbZzc352wb4jz1pdvJZJl0fOpOTV5o4Wi3fU0EqdpelNKLmLzO0ujXN9VMkS6TZ+0qAfSS3ND\nLFEcMQdiDwPNz831q3yvjnSeLkjx40Hoqqf+1Ui86WDWi3CZrg7f\/I5wKuf9DwdpKjTBd\/KdAAAA\nAElFTkSuQmCC",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/emblem_friendly-1334272963.swf",
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

log.info("emblem_friendly.js LOADED");

// generated ok 2012-08-27 19:07:46 by mackenzie
