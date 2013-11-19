//#include include/takeable.js

var label = "Pitchen Lilliputt Party Pack";
var version = "1353015762";
var name_single = "Pitchen Lilliputt Party Pack";
var name_plural = "Pitchen Lilliputt Party Pack";
var article = "a";
var description = "Miniature Ur for Glitchean giants in one small but perfectly formed temporary party location. When activated, this ephemeral party spot includes minables, nibbles, snacks and sammiches, and one DIY fancy-cocktail bar.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 1000;
var input_for = [];
var parent_classes = ["party_pack_pitchen_lilliputt", "party_pack", "takeable"];
var has_instance_props = false;

var classProps = {
	"collection_id"	: "",	// defined by takeable
	"party_id"	: "pitchen"	// defined by party_pack (overridden by party_pack_pitchen_lilliputt)
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
	out.push([2, "GOOD NEWS: Temporarily, parties do not require Party Permits."]);
	out.push([2, "The space created by this Party Pack lasts for 60 minutes."]);

	// automatically generated source information...
	out.push([2, "This can be purchased from a <a href=\"\/items\/1000008\/\" glitch=\"item|npc_streetspirit_toys\">Toy Vendor<\/a>."]);
	return out;
}

var tags = [
	"no_rube",
	"party",
	"pack",
	"toys"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-30,"y":-36,"w":60,"h":36},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAKrklEQVR42u2X61OTVx7H8x\/0H9iZ\n7ovd6e60M7XbVovYxXpZrR3rvmhnZ12rVQtaFQHlLvJw9wIh9wCBBEIIEMRcCOEW4BFygwAJd7mL\nKCC1Fbzj2tnv\/p6DsNudfbWzLzkzn8nhIcnzOd\/fOec5EYk222bbbJtts\/1P7euEhLfw+mEYsPx+\nZFJ62GCgMyz8ujpsctQfdmfSH3bvTiDM5GzmluZvc5YOnlP1jXMml4cbXJwrdd+\/z\/ctPeCNU\/O8\ndvzfWbCUTi5yusn5QyUzC2+zGyXl5x3r8Tm57FI99222mDtxRcJ9l6vgTolVfEz2lWC93QS10YDo\nIgNvcLbcMbU50ezh0ejtgNXrgsXVAd7vAolgcm4Mw1NDaA30QHnDAoe\/G77JcUwvzKB7cgw1\/iDK\n3b240X8b5qEJ1I9Mwjc1BXvfAIyePtzoHf4FGlcAoi8ucfxRLh2NfCPd0AfbOr4u1BH1vQHk25yQ\n1K0htbdC0dgBdasXUWU2xOjrCDtijQ1IsdzCZYKzdSC9zoXMejeyHV5cafThalMXrjV3I8\/Zg\/y2\nPkjekFvv2uiL6T1Xa1uQU+3YuC46mJDE\/yWFg1RfinCdDRGldThFnC6z43viTHk9TheacM7gQJSx\nkRFNnFEacJaIMzkRX+NEwo1WXKu2QlZrh8LsgKyqFvHF1Uw0SXcDTR4PWrxeNPHt6Oz2Ik1ngqvL\njZGxQcibPEymotUF\/PwY07Pj\/xI8cvEin5F5Gdrq8g3BOKUWbncrPG9wtjrAKQrxfVENCTbggliN\nx4\/uwtFow3mNCQmmFiSSYF+fB88ez2NmfgbzC1MYH+9HJqWRWFiBVy9+wN9fPsTr1Z\/w86tHSNVU\nQEWDWF19hMBwP\/LqeCw8mGWClW0uKPgAQ7QvLok\/m8ahpFLPUjtDHL2iwvjtXiw\/nEF6sR6DQ37W\nj1XpcKGyETKtjgku3B\/D2RwJkkgumchSqPB05T7yDdXgCsvw\/MkCbJ4uZFrakVRkxMjtfiaaojHi\nOgnlN3lRUVePf7xewdBwgMnNUHqK1h6oO\/pR0NkP0d7YRP54dBRUZSU4R+WMJM5TOV0uJ5MKl+gQ\nkSVhfZ3Figs05+rsZnT3uNHd64GsuBgpta2MHHURCd5DrlaPRF0NS9NOJb3icCPVYMHAgB+rz5eQ\nVVUPKUnI23oha\/GhMxhkkoKg6ZYHGvfgBqIjSUn8icQEmoM6RFU0IEYoIaXkcrUwqVNSHY4k57C+\nrEyPs4oyTIz1QV6gRFG5Hq1tDYjX1YIztyNLWYAny3NobmvCzUYHS7Pa4cD1Bg9Sy83o7+\/Cy2cP\nkKQogczpZ0mp2ntR097Jyj46MYKiW73QeYfeMAzRnuhYPo5LgUKvRVx1E9GMeMLV2UxS0yzJ9XJH\nZuUhTlrE+uus\/DhL88mADMuaoFB6AUG0p5dWsuEmckmQI8Fg0IcXTxeRa6ghOT+U7T2QOjqxSPNV\nmJslje3QeQZRRmL6rhGUE6L90Rf55LRkKMuKkVjTgiRakfEV9ejcEGxBpb0OiflKJFc6IKcU798d\n2VhEDxanaIFVIdvGI1O+tniuaXS4vzANk82MPCpvfiOtWhLs6\/Oyeam1N0HZ5kcBCZrbeVb23qEg\niuiazj1AgkMo9w2jwk+CB0nwbwmJEJdocJnmkcA5eRkTW\/lxBlFKPdLMbUgnMixtqHNY4aZUT2dL\nES3XwcG3oT\/oQVqlnQkKiSpvWMH7XFikRZRFCUppMWQazOilRIV5KdXpSc4PaT2Pe3fHWNmL7C0o\nFeQowXISrOgahrV\/AqI\/x1wIHo06j7xCFdItPDKsPKJV5SxBQfBCgQGZdC2LSNDWsHKbLSZcrbvF\nkJTqWanzjLXQm29S\/w7UtVaoKWkhTauzGfLmNUG\/v5MtovziUhRRetd1FbA21qOqzo7itm6Uufuh\n9wzA4BuEe+IuXqy+guiz8NM4HvEdFNoC5Ng7kFPXgQtqw0aCsSR4ja4LXMwvZHNTotHQRtrJuFSo\nR5G2iFawBllaI9SUXpa+BjmGWhTerEN+RQ1UTh9kjg7E5ikRT3uouLYRxXwPtB20IDoDKKVHWpmb\nHoOefhi89NgjQf\/MPbx+\/RqiQ+fP41xMJOTFath6R5DrcCG9yo5sbTmktJGm00abR9fEhLDpCvsZ\np78JSaMbUkLWtI6HkvJAQSgpMaOrD5VEAckVtnZRYt3QEMW8HyW3SI4o7exDGVHuCsJAchWEIDc8\ntwjP+CxevaIEd58+i8MxMbiilOHZs2cooZFJm31s3kjpprJmDyvRusCahJeJrMl4oGrxQk1Uuvsw\nPjePwOQslpeXsbKygubgbRTTfCshMS2hE8QoOUFMTwMwUHICRm8\/qnwDFNIoXrx4gZcvX64J7jwZ\ngQPHT+KqQoLnz58zyeDMHFQ0agH1Br41KJEC+ltIpZD6M\/OLTMjcNYDu8Rkmts7sgyVYA6NoHp2C\nwUVSHT1ELyVGYkQFlbbSE2QM3rmH0bkFTC0sMQ+B1dVVetSFR+DypYvIJUHBXPjHNL1JQxumhtIU\nEBJYR0iiWCgVYfMPsZQEmbmlh5haXNqQe\/jTI7in74IneYGW29Ow0xGqkYSNbhIjqrxBVFNyXRN3\n8OTJEzx9+pQhhPRGMijacSIce4+HIzkjg8UqSArwI1Nw0JdV0OgsPcN0ZhuBhYSMngAc1HdTKgs\/\nPGSC\/kAHCnRiNA0Oo23QBU+gBj2TkyjPP4zUmC9hsBqZZDdVZmo2CF\/AB0V+NMqMCriDXjx4+BMe\nP37MJP9DlBftOhmO\/RHfI0smZ4LrrKe5TB8URiR8YOnHBYzRY85arcTgaAeGJjrQ1KlFQdp+pEXu\nRGrqlxBXHUNqwVZoTMm4Gr8PmTF7adVHo9CWhBzdPsiMX6Eo768QXzqES5Gfo8AQh3vzExgY82xI\nzs5NsvtRnxftPXES4VFncU0u+4XgumT\/eCfmFiaZpNGRAVXaHiR8F4LY2A+RU\/4hrlZ8hOy4MHCR\nf0TK5U8gt4RCZt4OieFTXE\/fjaz0nZDf+COU1p1Q2XZBTVxJ3Y+c9P1ITtpNp54wiCu\/hNIUidrW\nFDp6OXEp7ygTJWFeFPLNt4g4fwZcvoRJTdwNstfllR9w5z5tnI40yEynoLMfQ3jaO8iKDwV3LhQJ\n8R9Bahb4GGJNCPKkOyDWbYesOoQkt0NeG0oHis8g1+yCongPlLrdUFbuojPgHmSpPgMn2Ql19T4U\nWv+Ea8bdSNftgqb+AC6rd+FYbCh5+NYEtx05tnwoPBw5knwmdkEahtFpF1IkX+O6MQQp2veQWPQu\nMsrew1dRv0auchslEwqxgeSMWyE1bIO0mMQqQkh2G6Un8AkRwtJcYwcUlk8JIckwJBWEILkwFGoz\nJWrch4KSL1CoPYjCqgMk+Tk0ji9Q0nAQ5s44XvTB4cNv7\/r2eJDLE8M\/0oBjGb9lUgfCf4Vo8TuQ\nWT9gRF\/\/Hb6J\/g1yqazSSiG5P0Bq+XAtRcvH7FVmIWHzVnr9mCG9+QlPokQor7Bu4xWWHRxJciqb\nwHZOafv0kLrus7A19oYVOfe89V9\/Qu75OuKt2JyzEql1Cy+Qa3qfT1T9nudK3uXl1i0WmfEjTnZt\nBycr3cop7FsYMtuWKLn5gzABdcMamz\/GN9tm22yb7f\/f\/gl+WrK4hwFCQgAAAABJRU5ErkJggg==\n",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/party_pack_pitchen_lilliputt-1334258527.swf",
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

log.info("party_pack_pitchen_lilliputt.js LOADED");

// generated ok 2012-11-15 13:42:42 by martlume
