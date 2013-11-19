//#include include/takeable.js

var label = "Emblem of Grendaline";
var version = "1346119666";
var name_single = "Emblem of Grendaline";
var name_plural = "Emblems of Grendaline";
var article = "an";
var description = "This lustrous Emblem of Grendaline bestows some fairly impressive abilities upon its lucky owner.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 0;
var input_for = [];
var parent_classes = ["emblem_grendaline", "emblem_base", "takeable"];
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
	out.push([2, "This can be obtained by earning favor with Grendaline. The quickest way to earn favor is by donating to Shrines."]);
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
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAMC0lEQVR42s1YaVBUVxr1f4jNDs2O\nWxAXHHdEbNlptmax2felgWbpZpOdBllEBRsUEVEB2UQUEKMiKrYbRI3QJHEdHXvixBgzmZBJZqqm\npmbqzPcegdIBNTNFVfKqTvV7996+73z7d9+8eXN0\/eu7DsHouQTFvN\/i9c+XRyJ+fFSK1tK1qt8c\nOXzfbvp8JA3fKzOJ4Lrm966f6ORhos1qDgl0cx5ez37rix8OpcoYcgxGuvxUzPoZGv7miOTvz+Sq\nvz4oxrXOQFxs8VM9u104NyT\/\/qxGcedUkPJt878filcw5Ibb\/fHyEwkeDyUpGa2+7psMMWbNeH8I\nmovXKA5VruHMjfbIFN+O5uDlrVRMPK7qY172+vxQj6\/pxVZB3\/3LcTh7yB2Dzd5g7j+\/kjKhOBUg\nudIr5P3tD3LVd6MZeDGSipudvmgq\/B1vzsx7vtGTd38gEq\/uSFk8vSrGi9GCiQfDWYrxy\/HKxyNS\nvPi8ABNPy2fgz492QHV3O+5fS8b4QDQ6y3lg9ppTgg2Fy6zGeoPxNUmv7AnFcFcAxgZj8dV4Hr59\nWIzrvZGoyd2I9BAzpAWbIi1oElJCXswStOxxxJNbmXh1X8YSfXBZhMMFK2VzGqVHZauV985F4E5\/\nGB7eSMVTemFvgzdC7NWxbRMHgbaaCLbTRchWHYTY6SB4qzZBC0FbNOG\/mQO\/TWooiPkIw6ej8Hws\nB9d7glWXuoWcOSN4KHsBp6Oap3p8U4JbZ6KRTtoJoJcHb9VDmIM+Ihz0EOGog7SARaiXOaK7Tsji\nxH4hdojXEnGGrBYCbD9EY+kWPB\/NxnB\/mIJJNz8926f6+k42vvokc+LL6ymKV8oi2WxZYDogZhsf\n6Y+R3D0fg7EBEWLd9RDE00O4vT4inbiIctZDkpcRzhwOwo+q6ll8sQLf3CtFboQlQu1Jy3ZaqCuw\nxpNhKcYvJeHJJRHG+8LY34FDfBwrXY\/BlgAVo5QZRJ7e2N73arxE+e+\/tEkY6f7x9VH5q3uVuNkX\njs8uJSIvajG9gMg5chHjzEWcqz5SfI3w4FoWvntYMo1PzyejroTP4tyxcPb5T6O5SCBBwkjbkc7a\n6Kn3xBdDYhzfbY++Kiecq3fBvsxl8n1ZFm8PoOvHQ5T3z0VhCsPtQpxvEuD+FTGqMlaTBsicjgaI\ndTVAvBsDPYwOJOPVFwXTeHYrC75bdEjDHDK9OtqrBUgQGGFfAQ\/nj25DNGk8nEgm+Rnhk9MRGO4N\nw5Umb9LcBsyqtdcvebqF7PaJQCh7Q9FX7YSuSjt2g546d8S5G9DGjNYMkeBhBLGnARpkdpRyst\/A\n6cYAhNmpk\/k1iIwmvr1XjLp8W0Q6auDpSBa5hC6NM4JyUZlqhc8GRbjaKUR1msX7m4xKkqChYPXE\n7e5AjJ8Og6JDiLtno1EUa8FqL9rFEGIPYySTqRLc9TF2XozntzPewJ7MTSSENiS+xhjqiMJXd3Nw\nkAQRC7h4OV6IUIryOD7t5WzAmnygyRfXTgRBnm75y1LPntSPBHvTLCdayzbhYqsveva7kolMWNOK\n3IyQ6m1CBA1Z8774NBcqSjuvI8l3IRL4uqjLscUfqYG4dzERiT7muNAazs7nhCxGghuXdZFIJ7JC\n0SbcoiDpqLb\/5bmxUrSAU5uzUjZEPnhkx2ZE0EbRzpPaS\/czQ4qACPL18PzWdjxViN9ABJkw3k0X\nSR5cRJKvhdppIy9yGZGTsvP+tlpIIvcQexgihixSGLMUN0iDl9qDlD+oDjbfv5arYKAaLX834f5G\nL4miYxvkmUxwcCkwDElzJizBVAFjYj2MnYnFo8G4N3CkaNLEYg99Wm+ARHKFgeZgdu5ik5B8UYe1\nQIqXMZnaCOkBC3GBAvHcYQ\/cbBNO42qzDyoSF80e0T992SC5fiIcl6jwlyYup9TAhYg\/aV6GoMTb\nmDRkgGNldng96qdwuHAzkj25rCDJpK00oSmK4tci0s2M1V6KYHKveHKZJB8z9B\/go7+ej30pVpRy\nHHGtxZfFsTLrmYHzo6o+YvR0HE7vc8FAowd2paxio5fZTOJNddbPlCWY7GlI9yYY7Q7B532hOLWX\nz\/5OYbDBC1Upq4mkIUsyhdWaIfss9TGhPUzICkaUR83Rt98FPbVOUBz1wfHKLdgjXaosSTBXEFQl\niWa8eaf2e0ie3MiRPRrKlI8cD8OFA+5oL9+CMwdcUJ2+BmEUwSL+pFlSBcbTpkulJC2mlwaRC\/jZ\ncCgVkRBCc2QELkRW0CKUxC5DIuNvtDaJNMoI9TpBVuhtC9BT44iuKjsix0OxyEzFxMCUwspizE3n\nlSYsbP641hUDRIzB1SYfnK51Rm+NAw7mWRNBPXJoLpEieDDm1sXBIjv07XVFlJMmoijHhVNSjvfQ\nQ1+dAFmBZpSkNWhOA0VxK9C3zxOyaEvWb5N\/NnEyCcoInRm0hLRvj2PlNigRLZgojDafWW7zY7im\ntRkrcZZITqFr51Z0V\/Fwcq8DW96infSxI34VOna7YajJH6PUdt1q8cJIRxBayhzQXGpPrVg4O3an\n3Rdf9EexGKcWjV3X6oeOCnu0VThBFmnBRjFTkcoTrdj31OevJnKGbz8C5EcZC\/IiTSbyokzAIDfK\nVHGkaB1OVtsh1c+cOpWPMEZVZvgwn8XJii0ojlmBy3VO02NT+LjaftbxKWQIF5A2mdTFRWORDRHf\nhJrtK+X\/e7Oav17VVrqRUs16MrMOfDdpQrBRA57r1eFtzaExDqJcdLEzbuk0osgVhDbzac18uK+b\nRDxpi\/HPOHdjqjDmVO70SXvkLlQAGAU0ydZi4LCQOpzCZqZJ+YVnkU7e0RJbNORakYQ8RPMNiJAW\n+ZoGRORrVRnWGKx3Jz9Tp9o7nxIyYet8yCgw2nfYTj7bfYgjpU5oo+dIJw41EOrUBWlRydSh\/+lS\nAK5FU9EaivalqE9fje6ddqjPWzcxdiX7\/ae9J7eLZZ3UXFanLkVj\/iryEWvszbDBHfIlBpeqbFgM\nVm3BxzWuLC7U8XH9oAs73lFsTclWiCu1dj+vs6U1fJyldXmhiyi9mKFrly0OZC1Ha4kNenY74HgZ\nD8w7yxIWv79xOHnAW9ZWvJkk3Iiq5EVoKVlPUbYcjWkrcEj6brRkWeHCzg0suvJXQ0r5s1a8jH1m\n5vx5upRW7FErXYK9kmU4ucse9dvXsDiUsw67UyyREcw1fSfBE3J3RavMBs+uJGBPsiV2isxwKHcV\nMqnYbyNfFNpoUAuvSd21FrX02tMIpmcG3tYaBE3WbyMctagaacFrvSYC6JjQWLABVUkLURJtgp2J\nFkgPNlBJA\/T6pIH6MvpV5oRTxQrQnd3MTP0bagtvbqboOkZ1lVF5jXQlpNt0URZlhJrUJTiQs4E9\nHEU46JJP6VHt1aPmQZ8ikzsJN31KwvrsWCzNMU1qJPkckw3ay2xQGm2IglDDH5J9NNNEQo0ZTWpu\nzMK3m1gawJWXxy9BdcpyFpUkoYSkEjrO4xTHLVXKQvVRl26BgQZX5Edaknb02XTB5DQRfxLxbhS1\nrpOddzSdW0RuxminHNi9y4aE5CIv2BDHdjq3\/N+nOLGvtizRT1vBgLmfknJX5lp5TpAxsv11sCNc\nF4dzlqNPzlQBB4relSiOs0LJz2Dua7Os0VnpgN6qzaiMJa0FaaMkyoyN1obtG+jQlC2f0\/PxuSPB\npqWxiycq6EAuEWgjw0cdRUGaLBq3W85AVbwJO5fnr4EMXy1UiD5iv98wp7iuiq0ojbfAnH9qS\/c3\naJaLV+AURd7BzDWId9eYEPPVlEluavhvJLurTcQ5qvVF8Tkqqb8+skOMkRdmil2ipWD2YO7nnGCM\nl3rEnnhLnCAN7Em0RIynOvtZTuSt1VwavRj7JavYWs4k3vxQsze+iMV5qvOY\/yf6aE8we6QHGMw9\nQdqcVxljAQZZAUaI9lCfTgciL01ZcfhCHM3dgIMZa9j52fYQOWpwsgONEe2uLp9zgvECbWW60IA6\nYR3qkOfPODfEealLdhDJ8sjFlJr036qhSDeOUkSZYU7JhTp\/YBXuOl\/GIIyvNmtRZ9JRbqAJikMX\nINZdQ\/muvX6V79VhTmq8FB89RLhyFL8aibddjPZCXdQUIc4fRMzlvv8B1ZdUsE4NX0sAAAAASUVO\nRK5CYII=",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/emblem_grendaline-1334253618.swf",
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

log.info("emblem_grendaline.js LOADED");

// generated ok 2012-08-27 19:07:46 by mackenzie
