//#include include/takeable.js

var label = "Emblem of Zille";
var version = "1346119666";
var name_single = "Emblem of Zille";
var name_plural = "Emblems of Zille";
var article = "an";
var description = "Containing a gleam as if from a sense of its own importance, this Zille Emblem is worth holding on to. Why? You'll see.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 0;
var input_for = [];
var parent_classes = ["emblem_zille", "emblem_base", "takeable"];
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
	out.push([2, "This can be obtained by earning favor with Zille. The quickest way to earn favor is by donating to Shrines."]);
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
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAMBElEQVR42s1YaVBUVxr159TECajs\nAq0YA6JCggsqCsq+ryL73jQ73dDssi8CAjaLICKIyiIYFnEkxCC0oIIascmCS3TsmEnimGTSM8mk\nampqps5894GWEYmZKaqSrjrVj\/cu9517vu8797u9ZMkiff79bYfb1GC0dMlv8fOvx80h398twqmi\nzfLfHDl81877fCIJ38lSiOCW1leOV3RaQNFmvIgEzijdGU9f8MV3RhLzGDmGiS4vORs\/T+G\/NAt\/\nfCiR\/\/12PsY6ffH+CS\/5w+s5i0Pyx4fV0hs9frKFnn86EiVl5K6278PjSSHujcTJmKrP5yYjxsZM\nDwSgNX+T9GjZJqXFUY9C8fVUBh5fS4TiXmU\/e9nzz0d6PXnvn3Lrn7kYifNHnXCh1R3s+qPRBIW0\nx0c42udt8Y8\/SeTfTonx5UQirnR64njO2xaLFt53m1wsZoZC8eSGiMODS7H4cipbcftqqnT6YpTs\n3oQIX36UDcWDknn45m4h5DfTMDMWj+mhcHSWWIDNtagEG3PWG9\/q88dXtHpZbyCudvng1gU+vpjO\nwtd38jHeF4qarO0QB66ehxzBOrRL7PHZzQxuLCN6+6IAx7KN8ha1SlvyTGSfDIbgxkAQ7lxOxINr\nKehrdEeApTL2minD11wFgZaaCLLSRPBzCNijDp9dy+G14w\/Ij16PG4MC\/FmWifFef\/nwGW+lRSN4\nNF1PqaPKQn7vihDXzoUj2Y8HH\/PlREADIdZaCLddCb79SggctBHlOAt2HUn32DM2xn+3Oi3kdbQc\n2IPPp9JxdSBIyuzmh4e18q9upOOLyRTFo\/EE6RNZbt7LXOBZQbzs\/sRAhPDmuxG4NSQA30kdfhbq\nnELhdkSKyMQ66yDeVReJ7roQuvM4sOsEN13EuuhwhCNobDARDbRUQUOuGe5fFWF6OA73hwWY7g\/i\nvoeOOuBk0VZcOOEjZ6LMI\/Lgclr\/k+kC2X\/+2iZkq\/vnVy2SJ5+U4Up\/MD4cjkFW2FpSQo0jF2Gr\nQSppItpZk4isRKKbNhHTRZInD8leq36CRCLMiEaSqqE2WgizU0Nvgws+HonF6YOW6K+0wWCDHWpT\n1ktqUw0WLqDx0wGymcEwPMXVdm+8e9wNM6OxqBSbIHAPU04DYUSOT+QEjuoURjVSSB2xTkTUdSVE\n7jpEigcxERM\/R5IRZyozxRnJeC8dTJ4NwdW+IIwedyflTPFS1Z7\/SJIN8q53+0LWF4j+Kht0le3h\nJug97AS+oyaFRx1hNuqUbxooFBhj8lw8fnhUzWG0i484Zy1OyWQik7J3NUc0eS+PIyeaQxxTknKT\nkSxLNMaHFwS41OmNqiSDVzcZZbSCxmwTxfUzvpg+GwRphzdung9HLt+Aq8gQa3VKenWUi7aS9xVi\n5lISJb0dLrQF4huykZZCa8S7zKrIqefJ8pHyk1Ig3oVUI4UTaAHRTlQ8dlqIdtXG0HFPjHX7QZJs\n+MuspyJR3+1QkqHiVPEOvH\/KE7119ohy1UEQqRdK6uXyN+Kb28WY7ItAqK0qhV0J\/hZK6Dnsjqnz\nkVyohW46SPLShchDhyOcGaSPcuEWFAiMiJwmYkhpgYMWQq010Zi7A9eoSDqqLH+5N5YJ9JRqMozy\nRigHmwt3UvVpIsSKwmutigcT2fiMKjA96E0IKXxBu5WQGbKOCkAdM8OxqBKazBYMkWRqFUe\/hcey\nHO5\/Hk0m43CaKRHU5AoszEYTORHrcJkUHG73k\/1NfqR1ZixTyiCfKvl5wgNNrkJpx15IUky48AZb\nqSHZ9w18PpmK\/jpnDDR64dNRIToqHPFwXIiR9kDUpW9Hf63DbDgJMU4aFD4+7o\/EYOSkLybPBHPX\nxVEbiaAGOYEmkvbp4T0qxMFjzrjS5v0Ml1o9cCDmjZdX9A+PGoXj3cEYpo2\/KGYDESRrsVTFiVJH\n3KbqLuCvQ1epJapTtuFmTyAaMnbgaO4uKghd3OoLoKLQQTRVN992Be5cTMTJ4j3w3PY7eG7\/Pa5Q\nVMba\/KjQ1IggVT9Z0EC9AwYaHFCbYEyWY42xE54cThZvn18438sbQqbORuJsrR2GmpxRGm9MBFWJ\noApunovGh73+NLkK\/b2CCKhCQBXNWY3DLM4ctMaRDFOE2yxHffZufHw2GJ+OpaK3xgn5UUb4oC+S\nm0O8bxVXcIxgf50dPbeBtMUDp8vMUSFaJyuIXi0lyAtiVlks6alzFt6\/nJF3dyRFMnE6CO\/VO6G9\nxBzn6u0oud8ic1ZBFCX23Qsx1ImYETEVLnzxdI9ZS5qPHn1rUoFooITUvXLclVNxqp+Pi42kziFb\nfNDhhQv1jmgvMMd4iysaUk2oSNQQR+beI7FCV+UeImeBfMEqOauBp4IVR6zmLSmKXtP6xxp7DBEx\nhkvHPXC2xhZ91VaoSdkCP\/MVqE4zw0SLE3KD15BqarOmTEUgctcmg91KxNYj0VWbq9Lu4l24Sd7G\nxueHvUlb4zL47FxGLqDCmXpL5ma8V2NFea2CBLKjrgoLnCwxoyrXU+SEr56\/3e6P0OTViI1wnkg+\nRVfpbnRXmKO1yIzrSPoOkRLluxBqtQIispBK8kKh+yzBevEWFIUZcIQTyfOEHtpozTJFVdxG5IZt\nRFPGVvDtVDmk+OohO2A1xuqtyYa0kRWsj47SnWjYb0LkVi58BNgfpuOWFaqryArTBUNmGE96LGcz\nWgu3Q0iVNtnigur4dVy+1aWYopueCZmC3M6hCzGZcpKHLvdSZjNxrIodNZAb8iYahEb090pkkx2d\nKdhG6aCBi1U70Zy2CZVJb+NEoSlFyEjyP7dZR7I2y5v2m6BavBWNiRsoPLQH26tzyqXsZR2LNrdT\nMHJirzmwZoGByCY+ayJ0uJRg43P89aiYKF+daXeh\/GvJN0XT\/rcxdMybOpycVtak\/MKzSKdFc\/5O\n1IrX0wrNEEGdCDNrtg+zl7GXsi0tidRj+y5DKoP3LFL2zm51ydwerMsRTZgDM+lQGzVUkKk3pBuh\nPFYfDckmOFO6Bw1ZWxS3RtNffdq7fz0\/r6NwF8rj9HE00xjNBbtouyNztWOrp9B68DiwRkBMZJ6S\nfBHiOaJJc4hz0aZFakHkvQbdB81Rm2yIk\/k70HvQCqeLLdBZZE67z9pXNw7v1LvntZGCx3O3oSph\nLbrLzShftnJdCGuZWOv0fM8nXgDPj2ENLNdxO+vifIMjDicb4JBwPd4pt0QD5SPD0YwtOJhgCLG\/\nJu9nCXZLnKSn8szwcDQalQnrqSJpxWVmqEvbPkvSQZtrnVj3\/GKD+iKEpHTcXC+YFqCPniprHE7S\nR1EED6UxBkj215KLfNT7Rb4aefQtywimxfuovTzMbP8baQtubaW2\/CR1GkzyapERkrypzRLooil9\nAzrKrLlzBmvjo51miSaSOsK5sDOwa3aPPYt20uHOLGn+Bhgk86+I5iE\/VFsR76UqFHgvm9ekZkas\nWTjEIh9NSUnUmxTWDRzKaIVCWhWbqEBgKCsI1sSRVENcbHZGTvhGTk1GNHLuwMQIM0Lsmt3jFuHM\nQ3elHfqqzFEaQXYTqI22g\/at\/\/cpLtZTJS\/GS0XKwK6frrI8ZbMkw08H6ftUURishmMZG9AvsaRd\nwAp5fCPkRxqjYA7suiZ1OzrLrNBXuRNlfCLmp4KCsFVctTZS2zU9nC5Z1PPxYLM\/r4i\/VnEggnpB\nNxWIPZSR67ecQ1Oa4TxURulyz7L2LSN\/XIEDAn3u9xt2ius6sBtFUQZY9J\/akvdptUpiN6KHKu9I\nyiZEOS1TxDoslcU5LsWLiHdaqoi0Xtof5qAkF+3TQHqADrKCeJTL68DmYNeLTjDCVTmkIsoQ3aRA\nRYwhIlyUuVwSuK9oLQpfizrqfthezox3f+Cqn\/wiFumibMH+P8ZDRcHmSPbRWnyCNLlFWYQBGFJ9\ntBHurPzMDgSuy\/PyqdtpyTTFEfEm7vnL5hBYL1NK99VBuJOyZNEJRrmpyJK9qQ\/0UEWo4+vzzg2R\nrsrCQiJZEroWor0aCyoU6qgkE1gvUVpUcoG2rxkH27+exxDksPSlm7o3vTTTVxf5gXrgOy2T\/dxc\nv8rv1UE2Sy0SPOgMba8k\/dVILPRh6gXaLZUG2L4Wspjz\/hcehhsvGU4FBwAAAABJRU5ErkJggg==\n",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/emblem_zille-1334254169.swf",
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

log.info("emblem_zille.js LOADED");

// generated ok 2012-08-27 19:07:46 by mackenzie
