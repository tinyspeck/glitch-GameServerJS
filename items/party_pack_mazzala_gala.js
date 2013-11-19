//#include include/takeable.js

var label = "Mazza'la Gala Party Pack";
var version = "1353015747";
var name_single = "Mazza'la Gala Party Pack";
var name_plural = "Mazza'la Gala Party Pack";
var article = "a";
var description = "One private and transient five-room wooden party lodge. When activated, temporary party location includes DIY hearty party feast, beer, booze, and one very dark make-out room.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 1000;
var input_for = [];
var parent_classes = ["party_pack_mazzala_gala", "party_pack", "takeable"];
var has_instance_props = false;

var classProps = {
	"collection_id"	: "",	// defined by takeable
	"party_id"	: "mazzala"	// defined by party_pack (overridden by party_pack_mazzala_gala)
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
		'position': {"x":-30,"y":-35,"w":60,"h":36},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAALVElEQVR42u2YaXBb5RWG9aMQShYc\n4iReY8eLbFmyLdmydlm7rH2zJC+y5UW2vMSOrThxHC9x9gYSEpwFSFgDJKQsCTCZ0qYMl4GyFBIg\nlKXQULYy7bRMAwToQAtvz\/0SzLS0\/\/qjP\/zNvHMljzT30Tnveb\/vWiCYW3Nrbs2t\/7+1ypyZN2jL\nMKSc3ynHcPrEYcMTpP3rAkMzw67psUDB9Djp6HXJ6XNPPzQ9FS7eOzNUxz3zyEHu0UNj3KlbJ7jp\nBgk3RZrkFSnnJiIVe8cjFUMbIjLDREiWx25WWyPauzXVyt047ObatGlcuy6NS+gXc12GxVzSmI6p\nTiPuPLAJU20aDNiWYzImx\/6JFmxPGnHDsAeP3r4ZJw6uw+PHd+PYzi6cvmc7bhpxYUubCvvGmugz\nfhwYj2FPKoCNbXqMd9hIdhy6fnRWU331GOkM\/ED9MScEOYvncTnXzoNFU4GZiQ4kfdXo8VejNyBH\nX6AGfcEadLkrEbOK0O7XoyNQi86gAYmQEXGPBi59JSzqClg1Uth0Mjhqq+E01qDBb0NToA6xkBOt\nEQ\/aGnzobA6iq6UePW3RWY2tjmHL+jjT2v4mdLdGkIxH0NV6SYLK4kyuMHMReMgOrwpVonzIxQWQ\nSwqhqCimm5eh0VOFOIF6TVLYdVI4a2Xwmfj3NfCZlQja1Gh069HkraXPGtDkMSLms6A1aEOiwYnu\nJjcSUVKDl177MdITw9reVuzdMYb1A2148LZ12DbagVMnbsORw9djsLMBA4mGS4BBr4GbmuxHZ5uf\nAUpLVzBIbWUhIjYJGl0arGoPYKAziC3jPYj5TfAYpARYhZ3Tg3juV\/cTmBERh4akxYP3zeDFX5\/E\n2RcexgfvP4vViSjiITvOvfQzfPX1eXz999\/j9VdPI9kUwPvvPosP3nseOzZ0MbBv8SG7Dnc3IpVs\nugSYnXYFV6sQwW6UodOnQoUwB0pJHszVRTDKCnFwz3r89cJZvHTmBOkkfn7qMOxKMdy6Sjzz1HF8\n8uk5TK\/rQsimJKmwa2sKFz9\/nW7QiKe5+\/CLU3egxW\/BgRsm8YcPn8f5t5\/E1Eg3VdKHzaN9uHjx\ntzhy6Dr85c\/nmAY6ogxuFjBnyTzOU6dCR6sPMUc1JEVZ0Fbkw1hVwLSmJ8gAx1dH4SKoC5+8hAZq\np10lJrhX8PZbv8TDD+yH3yxHyKrA6EALPrv4GoJWNbZO9OPzL95gLW\/xm\/Hy2VN4hdQedqAn5kWy\n2Yejd+7GP755D998+\/6\/VG8WsCli4zRUqcJlV8GuKIK4IBMqcS5qpfkwyFZiKhUlwDP0y3xU0SIG\n29\/uR2dDHcG+jK3U9o8+eobgpQRZjZG+Znz62avwGmqwe9savPbqY4g69WgmG5x94RF8+be3mDe7\nGl0E6CFfuvHO+afwpz+eYT5M\/TvgyvSruDWpOJwmGeoIUJS\/HApRNvQVK1BbmYfJoTAD\/Ml0P3Zu\nWsUA28MWauVqVs2nnzzKQJPNbnjJJsPJKAPk9dnF3+Cn9+5BuE6DBpeeefOLL99EPGBBR9iOzqiD\ngXz19Ts4vH8Ljt+SwmBHGEOJ6PeA4rzFXDcNQEvUCoeyCKV5y6CVZJNyoCvPxbo+PwP8Tvcf3QWj\ntAAPHNvNAHlgHvCWmQmqYjmGuiLMl8fuuh7nf\/cEDZScAGnKXVq88NwJ1vIYtbw1YCZZ8PhjR5g3\np1Y34uG71qI\/HsSqthCDTLSEIdDJVnJhnx7SgjQ4VUUQ5qZDXZbJIDWkRKONIF5EX6sTteRNLQ2Q\ntboQb77xGMHupkjw46a9Y2yInBoxBhMh5k0+WnhQftKDFspFhxrPP\/sgG6CBtgCafQa01zvw8ccv\n48DuCRyZ6cNDt6eYN3tb\/Ay0rTEAQY0om9OU56A8dz5cDHAJlKXLoRJlQCPOmgUcHwwhZBYxb9ap\nRKyayZgLHo0Q9XYVq2bMq8PmDUlWUYu8jHmTn3S3XoZGh5JFEt\/2jSMdiFIk3XP7dXjz9dNYlwzg\n\/kODeODW1bPe7KYBaol4IVCKs7Em1Y7+nijcBFiUvRjKkmWzkO1hM93wDDYMBBAylTJvrukJMcB6\nmxxutZCgC1hFN69PYBPpKe5emOWlLDcP799IE61C1C5n1dy4tgvtQRManBo26RGHDrfu6sTxm\/sJ\ncmDWm+0RJxoDDk6gJK\/1dIVgoQHxqItQkrsYipKlUAiXMki7qgx7dw6jI6RG0CRk3vQZpTTFdnh1\nJew7BlkBga+EVV6IRFCJviYd+hu18OrFqFOL4dKWo5kibNNqD3aNhzEY4wHVzJsNLh2O7u\/GsYO9\nBNlHO5aFWm9DvN5O22UdJ5AVL4XXKkdTyEQtLkRx9jWQFy9BjTCdgfZGpdiQ1GDHGhP8hmLoyJdx\nlxh7Jj3YuMoMj6qAxRGfmXw113cZsTXlQDKkgL+2DHWaMji1EoTNlQwy5pTTVUHVr2G5yUPeM5O4\nDNnDvMkPUAsNUNhj4QTFGT+GKOtqiHPmw6EoQHHWIsiLCLA4nUFO9Kqxb8qO\/RsdqDdTO8uzENSt\nRNxZhmabCG5FPosj3pv2mgL4dULmS7emhHYcIXWglKooov27Am6KIa9FjgANTJDCvt5nRF+7C3ff\n2IG7ZzpxL0G20N4dJw\/y16DTyAmqSjPR2uyEn0rO36AocyGqC69l4kHHe1QMkFdXqAIqartekslA\njZV8FF2Ko+9y87tqWpSlsOkr4KDwdtFO5XXr4COogNeAAIHVB80IUzt7Oty4a08bjuxtZ5Axmv54\njHY1CnC\/TccJhFkLEQmZkewOk4dWojBzAcEtRlXBYga5b8pKsl0GLJ\/1Jj9Aaj4v+erVFJOEMBCU\nmSpls1Qz28QILEbVSlIG9hBgL512eqmF\/XTg6CPAer8RqxIO3LG7BXfe0MogUz1OtDS70BRxwGNV\nc4IVS+Yhf+lVUJTTAaEqH\/nLroZaUcykoRbxgDOTVnbtiSmg04igJ1\/VasUw6CSw68vhIago7UQJ\nnwKDUQ3Wt+oxSQfarWvs2DZSh+1rHSQndqxzYVvKiZGAkWSihDBg87ARM5sCuHl7BHumfPSZOjpq\nkZ18JtrdlJxAWpqDkhXUUvEK2mv\/FdCoFeLGCRP2TVoY4Mb+KoRdlIUE2VRbjh5jJXrpjDie0NKE\nGkkmbB4yX9KwBVtSVhoY22VQBwMdbTQh5aWDr0fP2j7SXcsgtwzzP8iMsX4rmqJ2+Oq0cBjlnCB3\n6dVoonDkvWEgo69cPh\/V5CcesD1YjNGOUox3SzDWJcZIWwmi7hLYyPTtegmShgoG2W+XYrRFjQ2d\nWoLVYaKrFhPdvAwYjemxNqpFKkDnSocK3ZR\/cRJ\/gnLTlYdsrtdTKBtou73kzXqyQJ2hGnV6GSdY\nuugK6FQSOOhULM5fwgArSjIYYJ2xGKuaijES5yUkOCFru0ZVAj1Np09bhhiBtlA1ebUaKtFKGRmn\nqrZRy\/m2B0leOtzazVXMm3aaYodNAYddyYbHTR71kEd9VFEfZaLLqoRNSz6mRxCbVsoJ0hf8iFu6\n8Ao0UHpnpF2Jgoz5NMkLIL9cxf8kHlJLkDyolkB16tIfeNNABwcj+dNE4CadGGb6m5nem+m1RXtZ\ntHdbqBtW+p6ZBsyiFNFVBAudNa1qCamcY092BDmdl5H2PWDGAhQTpCg3DZXC5ZCJMukxgFTGK4ue\nV7JRQ\/HCS1GRC2V5NikLapKGokcryYKuIouiJ\/uCrjKH00tzOIM0l5R3srZqxbSxKv+SqvOHTLJ8\ng0lWZDDVkGTCyv\/6rJs2X1CZcc2V7xZeBhRmkbIXXijNWcCJchZy4tyFnCTvmpOS\/EXTFSQ6\/fAa\nkhWlGWqK0g01pekGhTCtcu6\/BnNrbs2tufW\/Xf8EYGp9fvNiK6UAAAAASUVORK5CYII=",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/party_pack_mazzala_gala-1334258388.swf",
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

log.info("party_pack_mazzala_gala.js LOADED");

// generated ok 2012-11-15 13:42:27 by martlume
