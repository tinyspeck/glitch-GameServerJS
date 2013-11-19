//#include include/drink.js, include/takeable.js

var label = "Butterfly Milk";
var version = "1354598055";
var name_single = "Butterfly Milk";
var name_plural = "Butterfly Milks";
var article = "a";
var description = "A vial of butterfly milk. It has the tingly effervescence of a thousand tiny butterfly farts.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 80;
var base_cost = 8;
var input_for = [2,41,56,58,62,64,93,335,336];
var parent_classes = ["milk_butterfly", "drink", "takeable"];
var has_instance_props = false;

var classProps = {
	"collection_id"	: "",	// defined by takeable
	"drink_mood"	: "6",	// defined by drink (overridden by milk_butterfly)
	"drink_energy"	: "0",	// defined by drink
	"drink_xp"	: "0"	// defined by drink
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

verbs.shake = { // defined by milk_butterfly
	"name"				: "shake",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 53,
	"tooltip"			: "Make butter. Costs $energy_cost energy",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		return {state:'enabled'};

		if (pc.metabolics_get_energy() <= 2){
			return {state:'disabled', reason: "You don't have enough energy to do that."};
		}

		return {state:'enabled'};
	},
	"effects"			: function(pc){

		return { energy_cost : 2 };
	},
	"handler"			: function(pc, msg, suppress_activity){

		var failed = 0;
		var orig_count = this.count;
		var self_msgs = [];
		var self_effects = [];
		var they_effects = [];
		log.info('milk_butterfly this.count:'+this.count);

		if (pc.metabolics_get_energy() <= 2 * msg.count){
			self_msgs.push("You don't have enough energy to do that!");
			failed = 1;

			var pre_msg = this.buildVerbMessage(msg.count, 'shake', 'shook', failed, self_msgs, self_effects, they_effects);
			if (!suppress_activity && pre_msg) pc.sendActivity(pre_msg);
		} else {
			var duration = 2000 + 1000 * intval(msg.count / 10);

			var annc = {
				type: 'pc_overlay',
				uid: 'milk_shake_'+pc.tsid,
				item_class: this.class_tsid,
				duration: duration,
				bubble: true,
				pc_tsid: pc.tsid,
				delta_y: -120,
			}

			pc.location.apiSendAnnouncementX(annc, pc);
			annc.locking = true;
			pc.apiSendAnnouncement(annc);

			self_msgs.push("You shake the butterfly milk vigorously. Butterfly butter!");
			var val = pc.metabolics_lose_energy(2 * msg.count);
			if (val){
				self_effects.push({
					"type"	: "metabolic_dec",
					"which"	: "energy",
					"value"	: val
				});
			}
			self_effects.push({
				"type"	: "item_give",
				"which"	: "Butterfly Butter",
				"value"	: msg.count
			});

			var pre_msg = this.buildVerbMessage(msg.count, 'shake', 'shook', failed, self_msgs, self_effects, they_effects);
			log.info('milk_butterfly msg.count:'+msg.count);
			if (this.isOnGround()){
				pc.createItemFromSourceDelayed("butterfly_butter", 1 * msg.count, this, false, duration, pre_msg);
			} else {
				pc.createItemFromOffsetDelayed("butterfly_butter", 1 * msg.count, {x: 0, y: 0}, false, duration, pre_msg, pc);
			}
			this.apiDelete();
		}


		return failed ? false : true;
	}
};

verbs.sniff = { // defined by milk_butterfly
	"name"				: "sniff",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_single"			: 1,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 54,
	"tooltip"			: "Advised for curing the blues",
	"is_drop_target"		: false,
	"effects"			: function(pc){

		var failed = 0;
		var orig_count = this.count;
		var self_msgs = [];
		var self_effects = [];
		var they_effects = [];
		var sub_effects = [];

		if (pc.metabolics_get_mood() <= 40){
			self_msgs.push("Butterfly milk smells like perfume from France. You experience a momentary surge of elation.");
			var val = 12;
			self_effects.push({
					"type"	: "metabolic_inc",
					"which"	: "mood",
					"value"	: val
				});
			// effect does nothing in dry run: item/destroy
		}

		if (pc.metabolics_get_mood() >= 41){
			self_msgs.push("Sniffing Butterfly Milk only works when you're feeling down.");
			failed = 1;
		}


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

		if (pc.metabolics_get_mood() <= 40){
			self_msgs.push("Butterfly milk smells like perfume from France. You experience a momentary surge of elation.");
			var val = pc.metabolics_add_mood(12);
			if (val){
				self_effects.push({
					"type"	: "metabolic_inc",
					"which"	: "mood",
					"value"	: val
				});
			}
			this.apiDelete();
		}

		if (pc.metabolics_get_mood() >= 41){
			self_msgs.push("Sniffing Butterfly Milk only works when you're feeling down.");
			failed = 1;
		}


		var pre_msg = this.buildVerbMessage(msg.count, 'sniff', 'sniffed', failed, self_msgs, self_effects, they_effects);
		if (!suppress_activity && pre_msg) pc.sendActivity(pre_msg);

		return failed ? false : true;
	}
};

verbs.drink = { // defined by milk_butterfly
	"name"				: "drink",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 55,
	"tooltip"			: "",
	"get_tooltip"			: function(pc, verb, effects){

		return this.drink_get_tooltip(pc, verb, effects);
	},
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (pc.is_dead){
			return {state: 'disabled', reason: "You are dead :("};
		}
		return {state:'enabled'};
	},
	"effects"			: function(pc){

		return this.parent_verb_drink_drink_effects(pc);
	},
	"handler"			: function(pc, msg, suppress_activity){

		var failed = 0;

		var txt = "Butterfly milk has the delicate effervescence of a thousand butterfly farts dancing on your tongue.";
		if (this.parent_verb_drink_drink){
			var success = this.parent_verb_drink_drink(pc, msg);
			failed = success ? 0 : 1;
		}

		if (failed == 0) {
			pc.sendActivity(txt);
		}

		return failed ? false : true;
	}
};

function parent_verb_drink_drink(pc, msg, suppress_activity){
	return this.drink_drink(pc, msg, suppress_activity);
};

function parent_verb_drink_drink_effects(pc){
	return this.drink_effects(pc);
};

function getDescExtras(pc){
	var out = [];
	out.push([2, "This can be obtained by milking <a href=\"\/items\/57\/\" glitch=\"item|npc_butterfly\">Butterflies<\/a>."]);
	return out;
}

var tags = [
	"drink",
	"basic_resource",
	"animalproduct",
	"nobag_drink"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-9,"y":-40,"w":17,"h":40},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAGOklEQVR42s2YW2zbZBTHJyHxNIk3\nJASCF955RkJMvPCEkHiYEBLThATSkBB7QGIP0xiCCYEYbINtDMbW3TqWdm3Trc390rRpu61ru6Zp\nbk4cx5c4tmM7ca5r0h6+48pdqLpNSMk2S3\/5s2PFP\/\/Pd8532bGjx4ePk\/ezRj0oNVb37ngWj6Vi\nOag1V+GeUoaZvBoMcMquZwpwNJre608xaz5OgU2xcpBuNF57JgB9WWHRn6L5\/tCMPJ7KtTtB46rR\n589rTw\/UleFPh3KF0qKk5mYFOXN1Zo4675vUbiaZVQsynFd1P6ccfmJQl2PMS4608JuHFgSES2ll\naS6vZKf5QtoWpxcSkirbgpP87yNjKnnGDP2KagAmU8\/hblLsVySkxhRbUCKKJuiNZjWulgR0b5TK\nRa7F6fn5QjF7ixWZg3398eODI5I\/QevYJ3sa6oGovNNN89eneYlDGLpckdrr623inojXnqwQQzhL\nJzyhyHf\/DMXmONGQ2tD78uPOCBd5o1oy7rfqlmsYVoTzMvl4Jxzq+wH7CgLeZcV4z+GcafajhUKx\nhDCdwsSIKjq3FQ51zhPIIODtnDD+JMpIBEO6FRCdG04x9zIlQyLt\/4T4qN2RQMgQlb3RUzhHhv98\nWdY0Iq4TLsSJqU4ghBSrdR2B8fqkOxhDB88HwkzP4LwZ7YUAk88q9Yax1b3hxAZIp0JsIcmWq0Vs\nI1wH4PM9ASRwh1aKJaneajeFSk2zirGL5le263co8nu6f5naCriz+6Gl+FcWxWIN4dBBzFo8z5Bi\n\/DA4FPbFs7OLiz13cJaT+6rN+9BeW4OCXga5bEBMVpUEAX0UIOqYKxCxAI9cGbjeg9GCf5PWyrC2\nvg6N1VWoNJqgVqrmeZ5mW4NLiezD4C4txhcsONT+46c\/7jrgbV72IBgCIpQlrVoDTtVhYiUJI3eW\nmtuBdrr37RXb3Lt79r3Y3cTIirtEo9rudA9VqtVBJYAoBM0UFHAuRsG\/kqqFMlweM\/jCfHSLe6e+\n6Lp7dwUlutU9o97YhOuUTqBjXB7SogyTyUzt11EnbcEdung11PXsdaeFD6VKrblO4Or3t3dvO5XJ\nB6RFCYZ8QThjH9eP9A9SX58++0nXZysxRUvdb7XMzH2ce1s1O78AgfC0KcfEpNH10uJKcwf0esPs\ne9Xmg8TQH+MeisqxEJye2QCcCsPJc+c+6Lp7UTILbhL30MH\/416RlJ\/wnblNuBte\/1zX3Qsx4lGN\nONVqr4HRaJiyysqjwFBRKr0J5w\/PwE+nTr3T9SEtJmut5uqGc9jhEbBUr29CbCcs3AW9BBMzsyYc\nasjpHiZ\/+VyX655gQ0ewtGC2ohASIRSjYsqCsq5R6G40RW04NzUFvulZeH\/37te7PqSRvteqkaTQ\nCECpVjOFbRx7UZ1QKLyHH8ErxQdwk1Ngc3nO98C9\/C2lZECZvFCrVEwwnTgjlcqbskA3Re7hM\/PL\nURPMG5oEZ2DC2HfwyMvdXWdkhLcieRlUdKlUgiJ5sYoOkXZe1UDUdFPYzzpVwaLMciaYZyIEnuAE\nXB5z\/Nj1IY0sqBOcrIBEYApEMnm5rOuA9zB8QlE1hbCWiuRj0GksK+5AEFyBAAy7PGxPJqT+bB64\nQgEEWYY8ASoQGE6SgRELkCtIwJI2wnaqSrI7kkyB0x8Ah88PDq8PTvx59tOeTOcR8DYjQC4vElAJ\neEkCioQuzfGQ4QWghTxkyW8IjNKJc6KqgpeEdczjMdU3MDjTs\/UG7kh5kwyB5BGmjcNVLENDIstA\nksmZsBYwQ0DL1ao53o46XabsDgf88Mdf7\/VsxYbzPs9ySnfevQcTGbZ9m6Kb9+IJiBPIIumLFnCc\nzoJBshbPdocThsfGYejmGFwYtk91vaxst6x0x6hjzjsL4F6KgS\/NNW\/FErBM+plKksY6BBJ+F0kK\n24gdbMMjYLOPwtG\/L7z9xLbT0E3X0koWQb0JGoIUA+HlWCuSSECMjLXhubtw2Wbb1C+nz\/z8xDci\n0U1PkhlxLUTARabyPoqFAJVrhaMxGBp3wKVrNlMD3oCx58sDrz61HdMALb3hpdg+93LCdBOz3ZPm\n2vblZPXmSqZxNXznm2di3xkd9WfFwz5aCFoaXUp+1ot3\/QuZ+5kuH56euwAAAABJRU5ErkJggg==\n",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/milk_butterfly-1334684267.swf",
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
	"drink",
	"basic_resource",
	"animalproduct",
	"nobag_drink"
];
itemDef.keys_in_location = {
	"p"	: "pickup"
};
itemDef.keys_in_pack = {
	"r"	: "drop",
	"n"	: "drink",
	"g"	: "give",
	"h"	: "shake",
	"c"	: "sniff"
};

log.info("milk_butterfly.js LOADED");

// generated ok 2012-12-03 21:14:15 by martlume
