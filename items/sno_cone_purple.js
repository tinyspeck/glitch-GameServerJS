//#include include/food.js, include/takeable.js

var label = "Purple Sno Cone";
var version = "1354593731";
var name_single = "Purple Sno Cone";
var name_plural = "Purple Sno Cones";
var article = "a";
var description = "A refreshing and delicious purple Sno Cone. A sophisticated blend of Ice, Hooch and elemental additives and preservatives. Now you too can get all the social frisson of Purple but with none of the nutritional or mental expansion benefits (contains considerable iMG, though).";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 10;
var base_cost = 1100;
var input_for = [319];
var parent_classes = ["sno_cone_purple", "sno_cone_base", "food", "takeable"];
var has_instance_props = false;

var classProps = {
	"collection_id"	: "",	// defined by takeable
	"energy_factor"	: "1",	// defined by food
	"eat_min_level"	: "11",	// defined by sno_cone_base (overridden by sno_cone_purple)
	"eat_xp"	: "550"	// defined by sno_cone_base (overridden by sno_cone_purple)
};

var instancePropsDef = {};

var verbs = {};

verbs.bemoan = { // defined by sno_cone_purple
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

		self_msgs.push("Aiy! Wail!! That is an expensive lesson.");
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

		self_msgs.push("Aiy! Wail!! That is an expensive lesson.");
		var context = {'class_id':this.class_tsid, 'verb':'bemoan'};
		var val = pc.stats_add_xp(275 * msg.count, false, context);
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
	if (pc && (pc.stats_get_level() < 11)) out.push([1, "You must be at least level 11 to eat this Sno Cone."]);

	// automatically generated source information...
	out.push([2, "This can be made with a <a href=\"\/items\/7\/\" glitch=\"item|blender\">Blender<\/a> or purchased from a <a href=\"\/items\/310\/\" glitch=\"item|npc_sno_cone_vending_machine\">Sno Cone Vendor<\/a>."]);
	if (pc && !pc.skills_has("blending_1")) out.push([2, "You need to learn <a href=\"\/skills\/43\/\" glitch=\"skill|blending_1\">Blending I<\/a> to use a <a href=\"\/items\/7\/\" glitch=\"item|blender\">Blender<\/a>."]);
	if (pc && !(pc.skills_has("blending_2"))) out.push([2, "The recipe for this will become available after you learn <a href=\"\/skills\/67\/\" glitch=\"skill|blending_2\">Blending II<\/a>."]);
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
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAIq0lEQVR42s3YeVtTVx4HcN4BL8GX\n4Evgv5k+s9TO4rQz7TSttU4XlepU69hKUBYXloDsAkV2BEJCSEJYAxLIAiH7vgdIICG5IQQiKP3O\nuVdRYsS6oPU8z++5XO5N8rm\/s\/xOkpHxms09ljzkGU5meST3sj1DSbZbsil9OuhrrhFkZrzNRmNI\nwDW4Cad4AyvKB1jV\/IKlqS3YB9bh2A1hgrnuEm9QNPSt4JziBGtJto2oDkyszv8CCz+GFdUD5twm\niMPUS8HMJdEXg4W3BmNvhPxN0WDOG82mTZhg+aTJR7AdLMm2CGgN5p4YrOS4i3ZJ1qHtCEPXGcZs\nSwDTt7yYqfdhtjUIE5fS2AYShw8e17\/GtvLiJBtRWPtj0JIPn29dgaEzAit3HbNNAQK+xwCD8m3m\nfK45iLtVHkxUujBZ7cZUrRvyRj+MPRGPW5Q8dCAwh2A9y8SNeWz8dfgHH0DbHoadl8CChGRwGPAI\nSRa5CSgblzDXEoSZH4W8fgEzdX4SCxgvc2C01IaxMjukN50MVlbnha5rlTL3rWe9ZtbiLDs\/AXNv\nDJq2EJMR1c8BBvZ0OPmbmCh3P47JmyQqPEyMltgwVGTBSIn1EdTBQOkhYOylWK+Es\/TFWYbuCExk\nfBm6IqTLgpDfWsB0jQ9e0f00oLZ1FSNFdozcsDHH0WI6HBgrdUDKcTJoabmLnNsxXGxhoHO3g8xY\nNd5ZfXmksSfqobt0L8It2IK2JQxpmQtTlV7IqnyYqvBh6LoV4nxTWgwWmiG5amGu02AGW+bEGMdB\nMuuGon4RslofmUQ+ioznF5849BPRY83W92Ss7Q3lrQAGC8wQ5ZkwcNkAAVuP\/hwd+i\/tCXJO\/5++\nLrxiZO4fumZlsjte6sRIsRWiQgMGr5swXGIhUK\/0hXCu7mimti3s0bWvMuNtqspLuscFBUFZuuOw\n9ZIJUReAIEcP\/k9aCPMMJEMkU+SDBq+ZICowoJ+tQ+8PanAvzKPreyX6Ls6j+7wKbd\/JIMjVMxnl\n55KHuKzFQL6eed10nQ\/zbdFfn9ma9jDbK9xmMuUf3CHrl58sD15ICi1MxkR5RkhumCEufIjhXdKQ\nDJFM5ZG4omOi98IcOr5TovWkDFUsMeq\/HGWwPPJA9IPR70NnlfuTGgL6dXk6MonMmGrysJ+Lu3XX\nnKVoWaKUDUswdlJQN60wXUKPJeFlI4bJTJyodmK8goyncjIZOAR91YjWUzPoPKNA13+VaM+Wo\/lr\nGRP1x8dQ\/vEAKj4RouusilxXoeOMnGRVwbwf\/b50NtvOTqHjHHlNrRz5twWaZ+IAsAf1Pg2Nk1X7\nmG7dxdHjiH567gU1+nO1kBSZMFRiZo59OfNoPD6Jhi8m0HBsAvWfS5ljzafDKD3KR+mH\/Sj7qB\/l\n\/3oIrWKJUHtMgp+\/GUfz6UkSE7hNou3sXfQ2G1E7qsveD5j5YGeHopaTMEqWmSWC7tZdXM95NbrO\nkHF06mGG2k7PoOVbkiWCqf10DDWfjKL64xFUfCTBjb\/04foHveTIRdFf+1D8Nx5K\/8F\/CCUZrfy3\nCNWfDaLu+BAavpeiuUSBZr4eTVMWqm7OtX+t3tnZyd66\/wCbW\/cRXtlA91gIXS0eCAr0D3EnZ3D7\nKxmTsVuscQZV9c9hVHw4hJtHCex9Hgr+cIeJwj92o\/BP3bj2fg+DLSLYkqM8cOiMfjUMTs40ihv1\naFU40C63o2XGhqZpG\/tXJ8nW9n0NDVxPbkNNslmuiaNSE0P1SACVtRYIG0y4c1mFumNjKPu7GCUf\nCHD9z3zkv3cHV37X8SR+34m897pw89QgKk5L0HhtCu3NpBcmXKiej+CqIoycySXkjLlRMWlH87T1\n+dl7DAQO7wJjm1toMMTBUcdQPBvFdeUqhPYoPOE4nCsx2IJkSxWIQuOPoEZP7puPoYjcVzEbwoSN\nbBRsAUgtSxg1L2DI6IdY78OA1ou+eS9uKgMM8NyIByeFdhzjmtgvvFATIGcXqApspACLlCHYltdS\ngIbFCER26jGQzk7N7P5A\/rwHXLUbTQo3fhx14+SAnTrR7XrxfSI9YeKb2xQNDK5tMl28CyyUh9Bv\njaQBtf5VVGupx8A82TJqVEvPBfbMOtGpdIAjdbBfuhYnktssGhhJJDHqWU8B5k2vQLsYTQMO2VdT\ngHQXVsgXng9U2D3dc65X22XHNu5JaeAitYFydSqwZm4lDaj2htFhCKcAL44voGzaByHBPQvYoXSy\nXnk\/mNjaOkwDQ\/FNDLvWUoC5U0H0GENpQJWb4NWhFOD5ES\/YYy50zXlSgN0qh+a1d9SRxCaHBvoj\nCVSqIynASwQgc4fTgFOOZXAUwRTgWYkLp0QO5I850KFyPQJ6sl4bGCUTJrS2QS3HNiD3r6UBcycX\nMOkMpQDlrmVMO4Kon00Hfi2w4kueCdkCQ9OBfWFaiSdZNHAxmkCLfjUF+KN0AXmTfshcoTQgvcy0\nqxdxcTQVeJxnfLll5UXaciwhpYHOEKksc6EU4IVRH3KlXoxYl9OA9DIzoPcjT+p+AuwzHTnwr53R\nZPIQDfRH1qFeiKFgOhV4btiDH4bd4OoW04C7y0yTwoNzYps04021JWqDTQPpUkeveU8Dz0rcyBY7\ncWXchSHTUhpQpPNSI67om\/tlIRpFpm817tmtxWJr+JlAurbSXVkpcxPY3oV6ISvjTTc\/FT9iX3my\nWWhUB\/cFnuCbkT1gZmouAXLe2q9bImect7cWN6kD+wKP9xnxWa+eOnrQs\/Z5rc6FzF5LlNpb6riG\n4L7Az3v0RzLediueo1jtpO7uLXXdukA6kGvkZPxWrXBmhSeyppa6AeMSzoh3gSbPibfZtU+3a3PR\nzHxZgGrXBlNK3aQ9iItDdvxnwHY447du1apw1iWpH82kpD1V6tgZ70r736iPRdfaqhkvA5xxBjUZ\n71ormPA2fTtgQ8G4g5p2Rw9lvIvtG4G16Que+cB+zf8\/p7anV8EtzmMAAAAASUVORK5CYII=",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2010-01\/1262849311-1283.swf",
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

log.info("sno_cone_purple.js LOADED");

// generated ok 2012-12-03 20:02:11 by martlume
