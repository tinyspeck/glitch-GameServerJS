//#include include/takeable.js

var label = "Winter Wingding Party Pack Taster";
var version = "1353015834";
var name_single = "Winter Wingding Party Pack Taster";
var name_plural = "Winter Wingding Party Pack Taster";
var article = "a";
var description = "One temporary wonderland, perfect for holiday get-togethers and winterly fun. When activated, this icy private party spot includes trees for decorating, ingredients for heart-warming drinkables and a DIY pie bar.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 200;
var input_for = [];
var parent_classes = ["party_pack_taster_winter_wingding", "party_pack", "takeable"];
var has_instance_props = false;

var classProps = {
	"collection_id"	: "",	// defined by takeable
	"party_id"	: "glitchmas"	// defined by party_pack (overridden by party_pack_taster_winter_wingding)
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
	out.push([2, "The space created by this Party Pack lasts for 10 minutes."]);
	return out;
}

var tags = [
	"no_rube",
	"party",
	"pack",
	"glitchmas",
	"toys"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-30,"y":-35,"w":60,"h":36},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAKkElEQVR42u2Y+VNb1xXH9Vc06Uzb\ntJm0mXY6ddJmEntig01sFmMHY2MHYjaD2TEgNgFCFgjEKkALEhIgkBAIIzYhY8wieGITYPbF7Dax\nwXZsZ+IkTpx0mvbb+25GTOI4mbY\/djgz33lXj6t7P\/qee86T4HD2Yi\/2Yi\/24n+KCHX3vrDKLuew\nyl6qje0tZ8uNBWdNz1RQSceYMFzTR9QjrO2fFK5tbwkvVlwTcrXdTP\/cAlM\/MM5UXBtiQhUtRKZd\nhciby0IUzcILcpNzrLZ7H93I6eSpMu+weMZbqGaCpFeee0PLbE3vKFbvbKK4fRBhFdcgMtkgMY+C\nQKCybxp982u4MroE68I6VL1z6JxeRXHnDKI1PRA19qHVvoje+U0oeubAb7Kj\/Oow1NftqLfNEM1C\na51Gur4H6brrsM6sUhlGt1Dau4FS6xY4L795mHnpjYPYd+Q4EqR6+BfoEFCoR2BRHQKLDQiSNCBM\n3opY9VUEFZLXRfW4IDEiVtWBOHUnwmWtCC6sR0hxI7l3FUnaXqTo+pFuGERmwwjMY6uY3bwHcds0\nCizzKOpcQsn1FZR1r0Hauw5Z3ybk\/beh6N\/CwydP8ezZM9hWH0M1uAPl4DY4zmf9mT84eeClfe\/C\nKz4bbtxCeCQV40RqGd5Pk8ObXw4fgRpnsyrhl1OD82IdAgsMCC4yIlTShHBpKyLl7YhRWRCn6QK3\nqodA9iFVx4BLXvMJpLBpjMAOE5cGkGmwQWgcgYjcS6\/pgaBuADLrLUiuLUNca0FBbTsKW+xQ2rZR\nztwFR6yUMEvrDGqaKuESmorsKhM+zFLieHIJTvBkOBZXgMPh2XC+eBku5OpOXn+YU0sgG+AnUCIu\nX4EPM+WIVJgJZCfSFTXQmVuht7RBbWpGqEiN9LohyI0mzK2NY2H9Bm5tz0GgNGD59gzuPFhCRi1x\nXW3BytYcHj1ZQ1r1dSiYO1Sc3x48wXiHR8MrNAxOwUmYu0nOUJ0Z7kkl8EwpQ7q0HJ8+mcaTz2Zw\n9944Bid7CKgI\/vn1EKm1+OzzeZTq6xBa1oyocgu4RUo8\/fImOgevg7lhxeTSMMJLmiA1NGJ1axLf\n\/H0D\/RMMUhVGxJfW44uvNgjoLIr0JvwL29CaO1FC3KwduYOGMZLi3zmfYi4JBWi93kAAk3EkVoyj\n8QVw5RbDI7kUb\/vzKKDMoINrdDZWNocgUFTgNF+F5p427Dy4gZllG85drkKE3Iz3uRJ88XQRicUq\nnCEZ+PKrZfDKDYgnBcaXa\/H1N+vI07Ugo34Y2aYJyIxt+PafH+HhpyvUvfKmHmiHP8LI2iNsPngC\nTlpxAeMTHY\/fHPCA04UUHI7JxXskjUcTiuCWJMHBi0ICOAVpXS1cosRgJrqgaNDjSIQI00sDUBoN\nWLs9iqCscuJiGzzjivD5FwvEyXKcS5VQN4VVjUjVDyFNWoVnX68ht8aErOYp5LTNIqPOhoEbg\/jH\nt1uobO1A+\/gmKgZuQTu0hcbxu7c5vz\/qy7T3NiE4ORlOIalwJoCHL+VRSOvYNHzTSingwPg1AllD\n0jwGcWUljkUKqbNTBHL7\/gSKtDWkAzTAPbaAArJinZxfHcFF0hmSdDaklmrw1bMV5FbWQdA0ASGB\njJWRLDxcwP1H5CxWG1DSTY5M9yqt8ErbrUXOfp8wxmq3IL+iDD6JOZAar8KHL8MRAhgj0cElUkQB\nlzdsFLKqpR6HI3KQUCjbPZufPpmhbnrxyuEak0fO5RxKdHoKmavRIkphQXy1FUmSCppyXUcrMoyk\niutHobjSQtOuMrVB2tWKSuYKCjtvQt5jJ06uL3I8L3IZ37gUvOp0CtEiGXZ2dmDut1MXXeIK8aZv\nMgGYJBtqcTCMVHGyjJxNKXXzKmOmsMcisyjoudQiHI3MJeNZROeWYXi6D3MrQ\/DNqsElTd9uAdWS\nKo9TdyO00Ig792epokiRVQ5o0DLJR0nXEHRDNSjvXV3geFzkziaK8+AeHIXoHDnu3buHhi4bnGLE\nBDIfb\/gmkQ2nCGA1PFLkOJ5WDmdyFh0pP5mmhEdiGSYXrMivqsLBYD4FjBSVQN9hom4mSNRILFAj\ngZcI+3AzmVeLGGUnQrLk1E2BSgNR8zUY7ZloGk9Dgz0XV8bzUdq1uMA5GpwAs7UFde16+CSJSYot\n8EotxaHoXAKZh7+cS6SAEgLomiSFe6oc+4MzSWvRwj3qMk4Lq3FKUI2TsVnw4+WRfpmFeALkRQrM\nPV4Cn5AEJJ49BoXnK5C6\/wp5J\/6IxIDTSNAOQN0nAM9gRcnVStQN81A9UAh9ZwqqBmQwTWSQx6OJ\n4finCrFMWke8SATn0DS8E3YZB0hDdo3h4RBx8Z2Qy3grIAN5mkaa\/rnlNRToO\/Ae2dwtUQovAuct\nrIFPtg7ncurgK66HX74R\/kVNiMuTQRxwDCq3X\/xIuTEB0LRGgl93BdJOCQzDCTCN1uPG2AAWbtvQ\naEsmz\/VihrP\/g2icDOdSQCcWkDwxnCIyIOP\/CYHcC4hPOQVBZTNsAxYszE1ihzTVtlouPEhBeKZX\n4CRfA19BCYU8QyDP5hjwQR55yggroI98MZxDJX770S4ToL7gFDQ8J0y3azFtUmK0RoyVSRs++eQT\nhvPnE6F43fU89nn6kTaThrdCMvE2gTwUwYeQ9y7cYtORqTHRs8lq56YZliYeVKoYxOdnwy9DBDHX\nBYkhfqjNSaTKuhQCTXoYhiv4FMQQ+DfszI\/ghqEITVFHsNLbSNWVFYjHm4v0b\/2SS5hv09Axe2+k\nOvc7QP9kAe4+mEBdmx6HQngUsNc+hVCxBgdIMw7lfogQgRDzy+u7kFd6RhEqyER4egwi+JcQmJwB\nrYhLF2c31iafp1c2WDh2zMKxECwwO2bFjtloT\/8AqxM2CszOZdex15fi0aNHDOftM+Fg24zSoEYQ\nvxglDR24kFtBHnm52E\/OYm5tG26tzeD+\/ftUrSY1NjZWKWis1Ai31HJ4pKvgmaHZ3ZgX5E1duD3a\nRV1hwb55+hl170WALJA5w5feY+ex19muRjx8+JDhHD4fjddczuLA6UDSZmQsNRZWN5CmNOII6YUP\nHjz4gdizuLgwRQHLW\/rgmqKAG4+0mjTV7saN\/At0U9YRdsPq069ROPbe84AOIEbO272\/3G1EB98P\nH3\/8McPxjU8lBZKNfFUpadRSCugQ+QTsJCoH4NLiFDY316ibFtsEgeyFssUK6\/gcZlsqdlPZUxAF\nqzKTjllQBzALZSaFd+1yAPpVAvTLUuh5YyqEGNYVY7xZjU2yx63F6e8AXztyFn0jZuQpSc+KTP4B\noAPSAcoCDjIWCsmOHWl3nM2xpgpMWgyYs5qxNGrFtJ1BWdh7L67ghDPYWl+hrcvxflaONdn1KeCr\nTt5wDbiI3uE2nAiK+hHgz7n5Ikha6WRTh2bGGNRJeFCf\/yvK3F6GxPt1VORc+sGc5yG\/B8qwX1jj\nf\/2O25NcRSE8AyJ+EvBFbv6noNvb27DbB9GgU1Dg5+G+p1kixiGyXhn9ZffLN11eefkNZ+a4f9jP\nAv6Um2ShWfbTEiiH2omEz8mLzHUmsFQEYN9\/\/Vv3fAw36PHjx8LvizRLL3J1dojA7dv7r8Be7MVe\n\/B\/FvwEAcJFHSYF6vAAAAABJRU5ErkJggg==",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/party_pack_taster_winter_wingding-1334259428.swf",
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
	"glitchmas",
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

log.info("party_pack_taster_winter_wingding.js LOADED");

// generated ok 2012-11-15 13:43:54 by martlume
