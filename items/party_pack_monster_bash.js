//#include include/takeable.js

var label = "Monster Bash Party Pack";
var version = "1337965215";
var name_single = "Monster Bash Party Pack";
var name_plural = "Monster Bash Party Pack";
var article = "a";
var description = "Instant party. Just add water.";
var is_hidden = false;
var has_info = true;
var has_infopage = false;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 0;
var input_for = [];
var parent_classes = ["party_pack_monster_bash", "party_pack", "takeable"];
var has_instance_props = false;

var classProps = {
	"collection_id"	: "",	// defined by takeable
	"party_id"	: "halloween"	// defined by party_pack (overridden by party_pack_monster_bash)
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

verbs.activate = { // defined by party_pack
	"name"				: "activate",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: true,
	"is_emote"			: false,
	"sort_on"			: 53,
	"tooltip"			: "Start party. GOOD NEWS: permit requirements temporarily lifted for parties",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (pc.party_has_space()) return {state:'disabled', reason: "Your party already has a Party Space going."};

		if (!this.instructions_read) return {state:'enabled'};

		if (!pc.party_is_in()) return {state:'disabled', reason: "You must be in a party to activate. Didn't you read the instructions?"};

		return {state:'enabled'};
	},
	"handler"			: function(pc, msg, suppress_activity){

		var failed = 0;
		var orig_count = this.count;
		var self_msgs = [];
		var self_effects = [];
		var they_effects = [];

		if (!this.instructions_read){
			var can_activate = !pc.party_has_space() && pc.party_is_in();
			pc.prompts_add({
				title			: 'PARTY SPACE ASSEMBLY INSTRUCTIONS',
				txt			: "1. Assemble the desired group of party attendees by clicking on Glitches in person or in chat, and selecting \"Invite to Party\" to invite.\n\n2. Continue until your party has reached Maximum Fun Capacity Level. While waiting for party pack activation, the party chat channel can be used for smalltalk and metaphorical icebreaking. \n\n3. Once Party Participants are assembled, activate party pack. Do this by clicking 'Activate' on party pack. \n\n4. Every guest in party chat will be sent an offer to create a teleportation portal that will take them directly your private party space, regardless of their current location. Party Participants have a limited time to join, so ensure everyone is ready to party. \n\n5. PARTY HARD. \n\n<font size=\"10\">SMALL PRINT: \n* A single-activation party pack gives a party of limited duration. To extend party length, insert currants into the machine inside your private party space. CORRECT CURRANTS ONLY. NO CHANGE GIVEN. Parties limited to "+config.max_party_size+" participants.\n* Please note, due to physical funness capacity, individuals can only participate in one party at a time.\n* The giants and their representatives are not responsible for the level of fun experienced at parties. No refunds for bad parties.</font>",
				max_w: 550,
				is_modal		: true,
				icon_buttons	: false,
				choices		: [
					{ value : 'ok', label : (can_activate ? 'Activate' : 'Understood') },
					{ value : 'cancel', label : 'Nevermind' }
				],
				callback	: 'prompts_itemstack_modal_callback',
				itemstack_tsid		: this.tsid
			});
		}
		else{
			log.info("Activating party pack for "+pc);
			var ret = this.activate(pc);
			if (!ret.ok){
				failed = 1;
				self_msgs.push(ret.error);
			}
		}

		var pre_msg = this.buildVerbMessage(msg.count, 'activate', 'activated', failed, self_msgs, self_effects, they_effects);
		if (!suppress_activity && pre_msg) pc.sendActivity(pre_msg);


		return failed ? false : true;
	}
};

function activate(pc){ // defined by party_pack
	var template = this.getClassProp('party_id');
	if (!template) template = choose_one(array_keys(config.party_spaces));

	if (!config.party_spaces[template]){
		return {ok:0, error:'Bad template'};
	}

	var duration = 60*60;
	if (this.class_tsid.substring(0,18) == 'party_pack_taster_') duration = 10*60;

	var ret = pc.party_start_space(template, duration);
	if (ret.ok){
		this.apiDelete();
	}

	return ret;
}

function modal_callback(pc, value, details){ // defined by party_pack
	log.info("Party pack modal call back for "+pc);

	this.instructions_read = true;

	if (value == 'ok' && pc.party_is_in() && !pc.party_has_space()){
		var ret = this.activate(pc);
	}
}

function getDescExtras(pc){
	var out = [];
	return out;
}

var tags = [
	"no_rube",
	"party",
	"pack",
	"no_trade",
	"no_auction",
	"toys"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-30,"y":-36,"w":60,"h":36},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAK2ElEQVR42u2XeVCU9xnHt+2kJiaK\nCAJyI8h9LwsLAgsshxAFEeS+BUF0YZFLEFhuRHE5PPBE1HgGRAyJ5nwTc7SxjVaTaJJOj2lz\/NFO\n0ybp3c6nv32T0GQybad\/tH\/xzHzn3d3Zmf3s93m+z\/t7FYqFWqiFWqiF+q\/rsV0uTpe63DRPHUrW\n3HztGc2Ny42aWy9MaO7emND8cKqg9s1nOwz3n+80vPtSj+GDn7xk+Oj+jOHupN\/wvbNrpA9fH5De\nf75K+s1bR6SfTCVI9464Sm+NO0t3DzhId8fshu8YrWtvGS01t4aWOck\/VhRnPTzcVSldPrFTGih1\nkjpzzKTegmXS7hJzyVhuyfGuFKZOD3JuXw5ne2OQzul45XILb7w4wQ+eaOfWNQN3nu3iF+++yK8+\nepdff3CHX9x9nHsvDHH\/uR7euzHML998gvfvXOLe9XZuT9Vwe1onrjruzO7knZcneONqP6+eb\/6G\nnj5YhCIzSCFtUirIj7Zg9mQ735\/pEerl9St93LzSz83Zfm6cb2PWmM3scA5Xh3OZG81nbqyA6cEM\nTuwI4mSDklNNoZxqDuNMSwRnd0Vyti2a8x0xXOzUcqk7gameJKb7UzjVsY6pgTQmDRu52JfO1b3p\nHGvbiLEhQ\/7M9P6rUlRs8JTyo8zIVi\/i0ngjjWl2jJbZMbbZgf3ljhzY4szw5lXoN6xme6oHRYne\nVKf6cETnzbFaP3q2xtOrT+egTilAQ2gt0zK6u5mzJ4c4bGxlcFsMLaUC8NwYN793hbfvPkPt5lxu\n\/WCO4\/u7ZKi5y8f57LP3GNtV8E3A8jRPqb0xj\/amfC4KwKQgAVi6UshWQNrLoO3Zzrz84mO8\/\/4r\nvPzSWT744FUaijQMlnnx3PWTfPjh99FnBstutlel8Nnv7zF9YYz7bz\/D+L4WDOUx4nun+dOff4z0\n7Fm6q1MY66\/jk0\/uM9zXLMNdnz3G9O70bwJuCFRIm1Pdqdrkx+OHm3g0xIatiSsZKbGRIU1uDhU7\ncNC4U0CeIW2NO9fnjmLs30F9hpeAfY1XX77Avh4dx\/X+NOYE8+lnbzO0q4g9hm28cfMKI7pIxrq3\n8Mc\/vceh\/moudcVzojWJyfEe\/vb3n\/Ppp+8w3pH\/DTgZsHitg1T2qBP60ijG29JoTrUk3HMlHZlW\njBRbz7t5YF8zv\/n4DdaHuwp3hjk8uou2ykR++7sfMby7gWeuTdBd4k99diCffPomczOHRUsv89IL\nZzmoD2e0s5w\/\/PFdDvRUcqEzlotdWvrq8\/jLX3\/K3NQhLvWuE0AbZKjHur\/aYjGDTbXpFMYuYbQh\njn355mxLWkF8gA3DRStkSJOb+4caZUCT7t+7RmOplrHdej7+7W1ZJtC63DDqs\/z53Sd3+d4rl\/jo\no9epzY\/l3C41I4Yyfv+H+0we7hbB0XCoIZbnnz4jOvA6\/duTme5LZmZgHac7U78WFkV2+CKpXsyE\nfnM0Y01aAbgMY4E5yUFWMqgJcrjYirG9Dbz4\/CRpagd06xxp2eTEDek04yOtbE724PLFEdHSKnQb\n\/QTsHeqrcmXQkX49p1pCMXaUyLN55sSgaLEGgy5DbvnR0TbOdyYIQJHyvrUYqtZxZTB13k1FVa5S\nam0qZHt+MPt3xjOUt5R9eWaUaCxJVa7AWGghZMnonnoZcEuiHYcqHdia4iS72bkjhwm9O9sLE7n1\nwxlSI71lN\/Vbsjg3uYer04foLFPRrc8QLZ8Ws9vAsaZI2neUM7anlaGaOKZ6tUz3xgvARHaWp8y7\naQJVFMSbS0XaRyhNWoqxMYGGlCW0rl9KYaQ5QS5WspvGwuVU5iXQWldARaIt41X2VKV6sSU\/hToR\nrsk6d3bluZMT5yFa7E1Dti\/dpQE05QXSLHSiScVEcygH9GpO7gxnUuzJQw1RTPdoBFgMp9tiOdIc\nj7FWzGV14rybpr2pKNvg9nFrcxk1peH06JOI9zFD6WxO+OrlBDhZYsw3Y7TYgq7sFbRn2nC4ypaj\n1fYc1zkxKnZkf8kqGjJd6Sl2Z6Lei\/Otflxo8xd\/wAdtiDc5Wj9ONquY6gplujsco07Neo2KtDi1\nWD+RnG6PZkin4XBzLM0lcfRU\/dPNqd6knymKkqypq0oWLVJyqC2JvdkPURnzCH4O5vg7WogZNGN\/\nyXIOlq\/gcKUNR7facny7PRO1zmgD7VB7OqD2ciQzyoUsjSsXd\/lweqcf6yI8iFV6Ehfixb7qYC73\niDtNq4pN8cGkRAbLkBXpYcK9KI63RHO5L4bRuhjqCmLF63hx59EKwARJUZBozdaCUBlysD6R0sjF\n1K9djK\/9MhmyJXUZBzdbMF6xQsBZc2K7HSdrHThV50RWlD0qd1vCPOy50OrJxTZvHu\/wZcoQQOV6\nDzSBq0kM8xAhCWamN5SBqmAS1f4khQfIkNsyQ8lNUjGqj2SmX7jYGM22rGjhXhzjjXEmSEmRFbWY\nvLglFCaYySHZm7WI+qQH8bEzk9WZuYzS2OXUrRMHh2prJnS2As6RgSIHdqQ7oHRbSYrKnoPbVzPV\n4cN0l2hpky81Gz1Ij3Kjo9iX\/EQvBioDOdOmYnBrCN3lSvKSgti6MYSRGjVnOgRgXxQjAnRjwhoB\nrJH1WHuspMhNsGV7RQq129IZadQylPVdauIfxHvlEqI9lqB2M5t3U+trIeDsOKqzp26DLUdqXKhM\ndqB2gxMDZW5i33lxod2HihRX2gs9iQ10IVfrLkISyNxgKOXrfSlc64MuI4C2YiVXd0cwOxDBnmo1\ns\/2RNBeq5dk0BWhKBEhIUmRELaciP4q62jyM9bEYcx5gU8hDeNk8QqDDEhJ8l3Cg3IIT21YQ4W7O\nmR12nGtyZHeJPRVJYgbdrWjOcmamy4vZXh+e6PPjeKMPfeVePDUYzMAWH3bme\/PUHpU43Sipz\/Gj\nItWPiRYVc3sixDWMthKVAF1DVoJSns3B6nCRcBNkpKRYH7qYVNUiMsVxa0jYOpL3XVSOD+Fp\/bAM\neazKnM5N5jSkWlDzqCXnGu05tcOBveIQ0ZRhT1qYDbPdHgLMh7kBP57c7SfAAri2N4jre4O50hck\nbm3BPD2k4vq+MK4NmaTmqb1qntyjFoBiDhP8GakNnZ\/NjXGmMQjjYN0aSZEebUtGrB3ZiasYrNGg\nT1wk4BZ\/oYcxZJoxqbPkjN6aqkQLqpOthJPLCFllTkKAJaFuljJkergtG9fYkRFpT0aUSHW0kzia\nuZAd60KMv6PYkW6UpXjQWujLaG0gRxqVYs6CydL6yElPCPUlIcxPhkxeE8SjUUrWaUIkhdb7W5Tl\naSnKVNNVFY3K6aGvAApZLSZs1SOoXZfIjppm08d2qRygL2fT32G5vJJMezPQeQXBq6xRutrIAQpZ\nbTufdNNKCvd2IsLHmUi\/VUT5uxItkh4T\/PlKMu1NE6gp6WsjAkmODJIUMe4KklXmlObGsTbY\/Otw\nX9PD8203QcqgXyR9HlRAmmSCNN2FTKDBX4CaIEM9\/rk3TZBrfF0+hwxwQxPkPr83591UB0iK6NWK\n2pjVio8zxSqIcP32vwH83M0vIf9Hbt6OCfKQYpSekjbES4pX+QzLD04RLgonASlFrPoPgP\/KTdul\ntwWkZJIANWnG33G5wd\/R0hDobJKVkHVakLONJsjNRqMSCnW3C\/ivHydDnb9TLFwyfFUe1ovTPC0f\n1Hwpd6sHAhYevBdqoRZqof5\/9Q8BzGJxHEnawgAAAABJRU5ErkJggg==",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/party_pack_monster_bash-1334258831.swf",
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
	"party",
	"pack",
	"no_trade",
	"no_auction",
	"toys"
];
itemDef.keys_in_location = {
	"p"	: "pickup"
};
itemDef.keys_in_pack = {
	"r"	: "drop",
	"c"	: "activate",
	"g"	: "give"
};

log.info("party_pack_monster_bash.js LOADED");

// generated ok 2012-05-25 10:00:15 by eric
