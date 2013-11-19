//#include include/food.js, include/takeable.js

var label = "Green Sno Cone";
var version = "1354648592";
var name_single = "Green Sno Cone";
var name_plural = "Green Sno Cones";
var article = "a";
var description = "A bright green blend of ice, hooch and elements make a drink the color of days when spring is born, or nights when the northern lights perform. Packed with a modest hit of iMG, winter cannot fade it. Mainly because it's 40% elemental additives and preservatives.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 10;
var base_cost = 150;
var input_for = [319];
var parent_classes = ["sno_cone_green", "sno_cone_base", "food", "takeable"];
var has_instance_props = false;

var classProps = {
	"collection_id"	: "",	// defined by takeable
	"energy_factor"	: "1",	// defined by food
	"eat_min_level"	: "4",	// defined by sno_cone_base (overridden by sno_cone_green)
	"eat_xp"	: "75"	// defined by sno_cone_base (overridden by sno_cone_green)
};

var instancePropsDef = {};

var verbs = {};

verbs.bemoan = { // defined by sno_cone_green
	"name"				: "bemoan",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 50,
	"tooltip"			: "Grieve, for you cannot eat it",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		//if (pc.achievements_get_daily_group_sum('sno_cones_bemoaned')) return {state:'disabled', reason: "You bemoaned a Sno Cone once already today. Any more isn't very ice"};

		return {state:'enabled'};
	},
	"effects"			: function(pc){

		var failed = 0;
		var orig_count = this.count;
		var self_msgs = [];
		var self_effects = [];
		var they_effects = [];
		var sub_effects = [];

		self_msgs.push("Oy. A dropped cone is a real wasted opportunity.");
		// effect does nothing in dry run: player/xp_give
		if (this.parent_verb_sno_cone_base_bemoan_effects){
			sub_effects.push(this.parent_verb_sno_cone_base_bemoan_effects(pc));
		}
		// effect does nothing in dry run: player/custom

		return this.flatten_effects(pc, {
			self_effects: self_effects,
			they_effects: they_effects,
			sub_effects: sub_effects,
		});
	},
	"handler"			: function(pc, msg, suppress_activity){

		var failed = 0;
		var orig_count = this.count;
		var self_msgs = [];
		var self_effects = [];
		var they_effects = [];

		self_msgs.push("Oy. A dropped cone is a real wasted opportunity.");
		var context = {'class_id':this.class_tsid, 'verb':'bemoan'};
		var val = pc.stats_add_xp(37 * msg.count, false, context);
		if (val){
			self_effects.push({
				"type"	: "xp_give",
				"which"	: "",
				"value"	: val
			});
		}
		if (this.parent_verb_sno_cone_base_bemoan){
			var success = this.parent_verb_sno_cone_base_bemoan(pc, msg);
			failed = success ? 0 : 1;
		}
		pc.achievements_increment_daily('sno_cones_bemoaned', this.class_tsid, msg.count);

		var pre_msg = this.buildVerbMessage(msg.count, 'bemoan', 'bemoaned the loss of', failed, self_msgs, self_effects, they_effects);
		if (!suppress_activity && pre_msg) pc.sendActivity(pre_msg);

		return failed ? false : true;
	}
};

verbs.pickup = { // defined by sno_cone_base
	"name"				: "pick up",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 50,
	"tooltip"			: "You saved it!",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (pc.houses_is_at_home()) return {state:'enabled'};
		return {state:'disabled', reason: "You can't unscramble an egg. And once you drop a sno cone, you're out of luck."};
	},
	"handler"			: function(pc, msg, suppress_activity){

		this.takeable_pickup(pc, msg);
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

verbs.drop = { // defined by sno_cone_base
	"name"				: "drop",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 52,
	"tooltip"			: "Think for a sec: drop a sno cone?",
	"is_drop_target"		: false,
	"handler"			: function(pc, msg, suppress_activity){

		if (this.parent_verb_food_drop){
			if (this.parent_verb_food_drop(pc, msg)){
				this.apiSetTimer('onMelt', 30 * 60 * 1000); // 30 minutes

				return true;
			}
		}

		return false;
	}
};

verbs.eat_bonus_img = { // defined by food
	"name"				: "Eat • Super Bonus iMG",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 53,
	"tooltip"			: "",
	"get_tooltip"			: function(pc, verb, effects){

		if (this.getTooltip) { 
			return this.getTooltip(pc);
		}
		else {
			return this.food_eat_tooltip(pc);
		}
	},
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (this.specialConditions) { 
			return this.specialConditions(pc, "eat_bonus_img", drop_stack);
		}
		else { 
			return this.food_eat_conditions_img(pc, drop_stack, "month");
		}
	},
	"effects"			: function(pc){

		return this.food_eat_effects(pc);
	},
	"handler"			: function(pc, msg, suppress_activity){

		this.verbs['eat'].handler.call(this, pc, msg, suppress_activity);
	}
};

verbs.eat_img = { // defined by food
	"name"				: "Eat • Bonus iMG",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 54,
	"tooltip"			: "",
	"get_tooltip"			: function(pc, verb, effects){

		if (this.getTooltip) { 
			return this.getTooltip(pc);
		}
		else {
			return this.food_eat_tooltip(pc);
		}
	},
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (this.specialConditions) { 
			return this.specialConditions(pc, "eat_img", drop_stack);
		}
		else { 
			return this.food_eat_conditions_img(pc, drop_stack, "day");
		}
	},
	"effects"			: function(pc){

		return this.food_eat_effects(pc);
	},
	"handler"			: function(pc, msg, suppress_activity){

		this.verbs['eat'].handler.call(this, pc, msg, suppress_activity);
	}
};

verbs.eat = { // defined by sno_cone_base
	"name"				: "eat",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_single"			: 1,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 55,
	"tooltip"			: "Gives some iMG",
	"get_tooltip"			: function(pc, verb, effects){

		var eaten = pc.achievements_get_daily_group_sum('sno_cones_eaten');
		if (eaten > 3) return "Careful! Eating this might freeze your brain, which will cost you all your mood!"

		return verb.tooltip;
	},
	"is_drop_target"		: false,
	"handler"			: function(pc, msg, suppress_activity){

		var failed = 0;
		var orig_count = this.count;
		var self_msgs = [];
		var self_effects = [];
		var they_effects = [];

		if (pc.stats.level >= intval(this.classProps.eat_min_level)){
			var brain_froze = false;

			pc.achievements_increment_daily('sno_cones_eaten', this.class_tsid, msg.count);
			var eaten = pc.achievements_get_daily_group_sum('sno_cones_eaten');
			if (eaten == 3){
				self_msgs.push("This Sno Cone almost gave you a Brain Freeze! I would consider carefully before eating another one today.");
			}
			else if (eaten > 3){
				if (is_chance(0.5)){
					brain_froze = true;
					self_msgs.push("Aiiiiiii! Can't… feel… my brain?!? Brain freeze!");
					pc.achievements_increment("brain", "frozen", 1);

					var val = pc.metabolics_set_mood(0);
					if (val){
						self_effects.push({
							"type"	: "metabolic_dec",
							"which"	: "mood",
							"value"	: val
						});
				}
					}
				else{
					self_msgs.push("Huh! No brain freeze! Lucky!");
				}
			}
			
			if (!brain_froze){
				var context = {'class_id':this.class_tsid, 'verb':'eat'};
				var val = pc.stats_add_xp(intval(this.classProps.eat_xp) * msg.count, false, context);

				if (val){
					self_effects.push({
						"type"	: "xp_give",
						"which"	: "",
						"value"	: val
					});
				}
				else {
					self_msgs.push("You gain 0 iMG due to low mood. Unlucky!");
				} 
			}

			this.apiDelete();
		}
		else{
			self_msgs.push("You must be at least level "+this.classProps.eat_min_level+" to eat this sno cone.");
			failed = 1;
		}


		var pre_msg = this.buildVerbMessage(msg.count, 'eat', 'ate', failed, self_msgs, self_effects, they_effects);
		if (!suppress_activity && pre_msg) pc.sendActivity(pre_msg);

		return failed ? false : true;
	}
};

function parent_verb_sno_cone_base_bemoan(pc, msg, suppress_activity){
	this.apiDelete();

	return true;
};

function parent_verb_sno_cone_base_bemoan_effects(pc){
	// no effects code in this parent
};

function parent_verb_food_eat(pc, msg, suppress_activity){
	return this.food_eat(pc, msg);
};

function parent_verb_food_eat_effects(pc){
	return this.food_eat_effects(pc);
};

function parent_verb_takeable_drop(pc, msg, suppress_activity){
	return this.takeable_drop(pc, msg);
};

function parent_verb_takeable_drop_effects(pc){
	// no effects code in this parent
};

function parent_verb_takeable_pickup(pc, msg, suppress_activity){
	return this.takeable_pickup(pc, msg);
};

function parent_verb_takeable_pickup_effects(pc){
	// no effects code in this parent
};

function parent_verb_food_pickup(pc, msg, suppress_activity){
	// the child class defines this verb not defined by the direct parent, but defined by a grandparent.
	// this stub allows the child to always call the (direct) parent for any inherited verbs.
	return this.parent_verb_takeable_pickup(pc, msg, suppress_activity);
};

function parent_verb_food_pickup_effects(pc){
	return this.parent_verb_takeable_pickup_effects(pc);
};

function parent_verb_food_drop(pc, msg, suppress_activity){
	// the child class defines this verb not defined by the direct parent, but defined by a grandparent.
	// this stub allows the child to always call the (direct) parent for any inherited verbs.
	return this.parent_verb_takeable_drop(pc, msg, suppress_activity);
};

function parent_verb_food_drop_effects(pc){
	return this.parent_verb_takeable_drop_effects(pc);
};

function onMelt(){ // defined by sno_cone_base
	this.apiDelete();
}

function onPickup(pc, msg){ // defined by sno_cone_base
	this.apiCancelTimer('onMelt');
}

function getDescExtras(pc){
	var out = [];
	if (pc && (pc.stats_get_level() < 4)) out.push([1, "You must be at least level 4 to eat this Sno Cone."]);

	// automatically generated source information...
	out.push([2, "This can be made with a <a href=\"\/items\/7\/\" glitch=\"item|blender\">Blender<\/a> or purchased from a <a href=\"\/items\/310\/\" glitch=\"item|npc_sno_cone_vending_machine\">Sno Cone Vendor<\/a>."]);
	if (pc && !pc.skills_has("blending_1")) out.push([2, "You need to learn <a href=\"\/skills\/43\/\" glitch=\"skill|blending_1\">Blending I<\/a> to use a <a href=\"\/items\/7\/\" glitch=\"item|blender\">Blender<\/a>."]);
	return out;
}

var tags = [
	"snocone",
	"no_rube",
	"food"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-19,"y":-42,"w":43,"h":42},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAIjklEQVR42s3Y+VZTWRYHYN6AR\/AR\nfAT+6+7VXauG7mVXdVd1YSltdylKIQ44QBhVBAwUCAYRBJnMCAkJMwEMU0gICSSQhAyEIYSQXAiB\nCEr\/+tyDIDFiOaDlWWuvcDPcfHfvs8+5ISrqA4cp1HXEEGqP0T9tTdCH2jhjG63KV4N9zYaO6KhP\nOVgMCeg2WjC6rsDYlgKG\/7VAtynHyJoMmhehDTbT13XrCoaFfhKcLqSIZUHjaKXBwgZXxNA9k9Pj\noYAYA4yQhIg+P7QqwYBPiCFGzIK5mo+ZTU2wOVYbat6BbZPsbcoIQIT+FQEJ\/h5avdGIXm8diXp0\nLFRB7iyDYuY+uhdrCVqkGw3Kjh46bni1iTMUkEDl52NgRUgB3Z5H6PPVY2hNRCCV0D5tokD9toIe\nd7qr0OS4i0ZbMZrsJZDa76HF9QAqn8AxGpIfORSYek0aM7AicgytijGBdvR4azEclJAMttLj0c1m\nDAVFaJ1\/gDZ3BXr9dWiZL4fcxYNilgehtQB88x0ILQUQW3+l2GYnD33LDcwAI475sKwFmmLVwUb0\nMwIol2poRtoWKijs1WDLKrEX7guCcRTRqJ\/MpfF4Kh8CM5dCpY4SOgVUjDD2PXHiWJWPT+dXn68B\nHe5KtMzdR\/NMKW2IV4HK5Ud4bMlFg\/k2fWSDb82DwHoHomkuRYtthRBY7uDxJHmeZLRzsYpUpA6q\n5cfvjlT5BQ7985YwhHZTSiDVENkK0OQshsx1F00zRRTyyJgVEbWmG6ibvIn6qRwK3sEWkLKz4KIX\nF3wP8pkyhsznt28c9op25pp4b67tj5aFMtSYslFtzMTD8XRUGjio0KfigT5lL9jjCkMqfb1qIoO+\nn8WyUOE0yeIUuSgDuQDjLfAn89l5qXu7pcTPjyZX42C7UDFbBqmzhJaGRfUH+KQhhORvHv3y8rHr\nqB7PRIMpB\/XGHPplNePZBMfBPe1l8EaTcXf4AspGr4KnvYLC\/kT6Wt3ULVTq01A5lo5qQxb9HJvJ\nbm\/1bzcNaQiObuvlHGudqyDrGI9ePZux6oks1Jtuo8ZIjgmmXJdCviSDRCaq9Bk0eJpk\/Dr8C\/JV\n8eDIY5HdHkex98eu0QtjM8rGfe11PCSfq9Cl0XM22x5y34gr6zPFtM\/VMK1kmXjCkMbwVNKSsHOp\naiIdDaQTm6ZJRi1FEJoLSWm4qJm4iYKBcygeTkIRiYLBBOSqfkYeieyuOFyX\/RMpzT+gWH2eRBIK\nBxNRNJhES78zR2+hoO88ilQXca+rClkPpa8vNQBO+4RLyeJkMztl5Vvy6EnYk7Hl5GmTSWnSSUlI\nt5ry6WP5aCpu9cbhRs9JEieQrfyJPqa3\/4jkxmO40vQtie9w7QWUzWhm6wnc7j6N\/N6zyOs5i\/ye\nc+D2JaJ6hI97nfqEg4DRz7e3meUND4YX22hn1k6+xJVqL9EsFAyeo9nhkqzlq84gm2Ayun5EeucP\nSOv4Himt3+GC+BskCb9GkugbXBT\/FZckfyPYv+MqgV6XfY9U+b+Q3nIcWW1xyO0k5+0pRrmqG5VP\nJhmexnbwXr29vZ2w+ew5NjafwbPmRc2kHqU6CUq02ShSJxJUPCnff3GTZCxLeZyiUtv\/gett3+Jq\nyzEkSb7Eucd\/ppHA\/wuJL5Ao+JJiLxDsZclORlMV8Uhrz0FWtxQPB62oHbSgesCMyn4z5zebZHPr\nmY4FroW2oF0MoVAXAFe7gjy1ETkDTWjQV4E3lImsrpMUdUn6NRLFXyC+4U84XfeHvThT\/0f6XLrs\nF2TIE1HQeYdkSYBajQEloz7cHPIitXceyR12FPVaUNU\/9ebs7QGBo7vAlY1NlI+\/AI74kTO8jGaL\nHw5vANOeFZjdDEwLfuhcPpQayPtGV5BL3lc0soQesxt95gUoJ+fRaZpF24QLCsMMZGNOiEedKBh2\nU+DFDgfimy04ITJy3nqhJkDuLlC9sB4GzB1egnlxNQw4PueD1MzsAdnslI4cDGwcdUCktaNs0EEz\nGC+zMKf4tre\/T2QbJrCxxbBA9+oGinUvgTcGl9A05YsAjrmWUTLG7AEzVYsoVc+\/ESgYmUb9sBVc\npZXzzntxMLQVywJ9wRA6HWthwMx+D8bm\/BHALutyGJAtYdHg7JuBQxYHX2N7v7vslfWnShY4x6yj\nUBsOLNV4IoBapxdiozcMeLV7FgX9M2gmuNcB64anY9\/7fjC4uXmUBS4FNtBuWw0Dpj1xQzCxFAFU\n2z2oN3jCgJc6nOB02dCgcYQB+Wqr7oPvqH3BDS4LdPmCKNb6woApBKCyeyOAg7ZF1OjcYcDzrTac\nlVvJ8mRFndr2AuiI+WCgnzTM0uo6s7iyjkHXagQwrXcWvdNLEcB+qxsNY\/NIVYYDf5ZO4d8SIxKk\n45WH9oPJEwjFssA5fxANRl8Y8BoBZPa6oLItRQDZZUZqmENqdzgwTjLxbsvK24zFlaCSBbp8ayjW\nLIUBkztnkKZ0omNqMQLILjMtpIPz+uz7Mmg6\/B\/x\/lDoyC6QXaiz+8OBF9sduNxuh0g\/FwHcXWYe\nqR24qDArP9oP93lmncMC2a1OPeOPAJ5vtSNBMY2MbhvajPMRQLneyXTY\/B\/vPwt+P6JnlgOO3b1Y\nMeV9LZDdW9lSFqvsBLZ\/oZ6NifrYw8UEvrJ4Xt4syCY9BwJPNZqQIDOhcoiFurif7L9b8umAZP9e\n3GhcPBAYJ57AcaGBOXbYXfumwbMhWjjpZ\/ZvdaJx94HAnwSGr6I+9cjTMLG1496wrY6vX4gEiia4\nUb\/XuDHgkcinwrc62cQ8EhW7QKPj1Kcs7avjlsYfnaVaYGrH3GFbnZwsMVfbLPiPzHw06vceJWpv\nTIrShSrt3KtbHSfqcxlXOmdi2b327oCTAgem3bqoz21k9zgrz8jMyO62Mv12\/5Goz3Gclk5VnjzE\nG4H\/AyD4iRrtsW5qAAAAAElFTkSuQmCC",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2010-01\/1262849260-1918.swf",
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
	"snocone",
	"no_rube",
	"food"
];
itemDef.keys_in_location = {
	"p"	: "pickup",
	"e"	: "bemoan"
};
itemDef.keys_in_pack = {
	"r"	: "drop",
	"t"	: "eat",
	"o"	: "eat_bonus_img",
	"g"	: "eat_img",
	"v"	: "give"
};

log.info("sno_cone_green.js LOADED");

// generated ok 2012-12-04 11:16:32 by martlume
