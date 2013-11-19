//#include include/takeable.js

var label = "Val Holla Party Pack Taster";
var version = "1353015830";
var name_single = "Val Holla Party Pack Taster";
var name_plural = "Val Holla Party Pack Taster";
var article = "a";
var description = "Soar to new heights in this quoin-heavy party space. Grab a bunch of your closest friends, and get ready to Party Shardy!";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 200;
var input_for = [];
var parent_classes = ["party_pack_taster_val_holla", "party_pack_val_holla", "party_pack", "takeable"];
var has_instance_props = false;

var classProps = {
	"collection_id"	: "",	// defined by takeable
	"party_id"	: "val_holla"	// defined by party_pack
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
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAKQElEQVR42u2Y51NbVxqH85\/4P1jv\nl8zsbIqzKbPJZpLJZta79hgXmhu2hWmmCIsOohiEkJAQIFBDEmoISQYVLghJNBUkiuiYtR03DDZu\nKTvz23OPDCF2NrMfd2c4M8\/cq3vOcB6973nP0eWddw7aQTtoB+1\/s6W22A+lix1H0ttYnL9AaB\/n\nNPSN8c5KBylyzxSvfyLKSxPbGtNEVqbOOMy0OrwMVzXApAoNBP0u5hRhLy+5WX8ktcV4aG+yzy5X\nN\/61SMAc56v2D36NES22ESxsrKDTNY46ixcFKg9EjnEE5hchHphCg3UCFUbyOb4M29Q8vXYz07BO\nxSEeDEPni6Lb6UOZyoHsditqDS5ckPRD6poiTIKrtCOr04GrnXaUmvx7lFsCoIIfpFcyR1JL8F56\nJU7UapAq0O1Dj9MNGpxpMiC12YyLUjsypA6cE\/XhrMiKjLZBZHW5kascQh4hS+5EgWYYhT1eFBGK\n9V7w7RGIvSuQ+lbRFlhD+\/gtdE78jJwgGY5D5Imia3L9F1DBj87zmQ\/PVuH9lFIk1\/YguyeMHF0E\neYRrvREU9E6jwDANjsyFTJYOF7iGIEqtMZT1zyCTRIMjtqDaMQv+wByuyQeQ02pBrsSCTIEWNX1T\nqNYPQWy8CYl5AEKtBcWtWthHPKjXuyHzLUPUY8Z4NIBCse5tQbvfyYQXRlGrUCO5rgdZRDBbG0Yu\nEczVhZGnDyOt0YgKsQT+4CACISc6ejXIIqLFxiDq2jvAjA\/iqtRGJdVWI56\/mEd4bhQvXy2iussI\ngc6K739Yxg8\/ruLHn9aQUd6K8DxZFhE\/kdJjc3sRDi8RtvjeFvyEI2AUjn6UypRIqdfhqiaMLG1C\nMoeKhnFJ5oFp0IjI3BCuN0tw9\/4kMmracFniwHjEjac7MVxv06LSNoOkQgGePZ\/DyYJGWNz9cPld\nNJq1ci2VPF8uQYM9BK5Eh50Xy4jEJ\/D81RqKRWqS7vUEkwmo4KeZIkY5YEer0YTUBj0y1SFkkigm\nIhkikiEqKenpxujkTZyqUsBHIinTKXG6Qo4nT6M0ojq7EddNUzjJbcHOs1mUSbppNIOzI+BpvWjs\nseDV90u4LtVCOLyIZs88Grq0+Olf63AFGNSZfHQ97ocK1mstTFqNHMkVbUji94JDBDmaNyR1IYjV\nciysjECi6cLi6iga5R0oFHbSaE7PM4RhXCbFk1ajIIIzVJKNpFjXiyrbNOrVJprymk4NBMwClbyh\n7KUp57WqIBtbQ8f4OhWzRlcpiT2tTs1ElgJIrWxHUq0Bl1UhXHkteZWlJ0RSHoJI1Ynbd8fgnXRA\naenB3wvFkGoVWFzz0bXJinIaupBS1UVTLlIpsLoxjvRqOWpuzqBWacCLl3GUCGVo9MRRrHQhGg+A\nmRhCWY8HElIsUv8KFY0txzC3NpMQ\/CK\/i7F43fBFR3CyzkgEw0QwvCeZqQkiVWiHSNmJkQk7kqrU\nuEiq+WxzH0m5g6wtBZLKOmB2mtDcLce3WbU07V+dK6aiPJEcVY4Yarp7aURlei3qnXOo6dDQlBe1\nKEk0FyAaWULrKJH0rSC4MI2JeCwh2G4fZJxTw+A0KZHR3AuFe5RsxH5c3pVUB5HSbEOLsoMKprc4\nyLoM4h\/FUmxth5An7kF+bwjVbe20iM5ya4jgNP6SXgSru49GslA9gpxmFRRmPXgt7Sjt9SOfiJV3\n6FBpHodgaAHNJO3KwDyY2TlMzIUxNhdJCJ5rMjBf5HfisywxskU69A3fpJjJPsVKslFMEzuRzq0E\nt1GANBLNbCJ49FoDLpbUIE1gIftlCGf4anyTVYcz1QokVytxUWhGjoIhp4QTPBM5MfR+XFN4wDME\nSMpjZM+cQd3gLOpdc7hBCqaJSJonowjMTGE0FoR\/JpwQVLo929PLY2jUW3BFqINh6CaMzE3IBz24\npE6sxyskimcENiqa3e1FHjlBchReUjxBUuFBsleGiGSQbOghSqExDK4pjGJzGDxLBCV9EZQSykmx\nVNiiqLRHSdqj4JO1WdeQD76MbD1EtGs0hpHIBGGSSlLBSyIzNB4XKhVGIqiHgcixkiqXBxmkYC6x\nRdNmw5WcVPAuHEP90a8gJDQlHUVVLhf57QNUMve1ZD4raiSi6iEUt4hQ0CSgkry+hCgryVJpj0Fg\ntKG24jyK85MRiE1iODwBJjyO4deSVLBWP4A+\/xDUzgFwWEEix0q6x5xo6B9DBklzVtFl5B39EC1f\nvIv2j3\/3C+rPX0ChyJSIpj5IJVkKZVoUXzuO3MyjKNR4SDRDP0fTmhAVGPpQyUtDfs4puKdGCX54\nggEMBccwvTSfEPy6RIe\/lShxokxOotEPZ9BH1p8TJoZdh0MQkoIp+eYPaP709+j45PBbguwzPicH\nWSQT3EYVSvhtqCgTgH\/hNKpPfYLstC\/pKSUcnAB3vyRB5zCS6J1C3tUTGBz3wjkxCtekj4r6o69T\nnNxgwKkaNdJru8GV98PvssAkqYeqNIvSlZ8GLUntrtBIDRfhLjFcXA7WR4fwHUnFjEEJ29UUemX7\n2DE79+7QPmN2GspLLsA\/5UYg6MFkhIF8aAxG3xi0\/RoU5p5ADuc4zB7bnqRzchTrd28nBPlaB+48\nDMEX86KO3Jtzz2GEXwy2sZOxE3\/\/7CmdXPHVe3RSVkB7\/HPax35mxRcHLLDy8lB0Q4WWL9+lz1ks\nZTnIzUqCVNECq9eFvhEX2ZzdsPvc6Na1oamxEEqtFJPxaURW5jFLfnuu3NkgW9WThOCXXCU+z2sH\nR6BCq4nBY9Ix0FJFBW38Ioy18Kko21gpNjLsM1Zqv+B301OI9ffSMYaC8\/RLsX2+1gZs3L+Lxdvr\nGCFpC6\/GMb2+iMnFGbj9Tio0989VzN1OEL+zhvuPH+HZs2cJwexWA\/6c24avr4khs4zg1atXcIlq\nqJAm+RtsLsep4O6VFWDv9wuKPj5MI8ziJUL2Yg59zi6DQVJg29vbeLD5CHNEJnZriTKzsUyvrCDL\nw8eblPubD7Gzs0OhglkiPdqsNkgtfZCZh6mgX9ZIBVmJzZU4JJxkGK5fJYKtNHqsCNvHppxdDsJL\nJ2EqzYFP2ogxlRTDN8rhbarErcgUlnwMFWS59+gBoq8F94tubW\/hyZMnlKdPn1L2BNnosedwWWcP\n2kiKWcHNjTXE3Q5EBsxYCgzj5cuXsFcWQPb1+29VcVPKtzCp2+nE7LffnWiXXbldbj+4h6U7t7By\nd4PyeOvx3rg3JRMvTeSIO3ZdCoXDSgSHqOCvwUpqqrnoOvY5FRUSZJmpGDL10NTceXhv7w\/\/liDL\nIzL+156\/+eUSv6ivCE5\/lHFjO4PsX1KD+z8K7kquzkaxNj6KB2vL2FhboYuZhU3JruCbkr8l+wbb\nZByztbXFsNe9V88\/nas5\/EFaxba01\/WbgvtFX7x4QXn+\/PmeJBFbJzAs7AQEM7nn7ULm5xCO7OPw\nf\/0y\/sfUikNdVsZMJmd2ITJyAm8fpwlH9nHo4N8YB+2gHbT\/4\/Zv96d1OA0PXDgAAAAASUVORK5C\nYII=",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-09\/party_pack_taster_val_holla-1348171280.swf",
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

log.info("party_pack_taster_val_holla.js LOADED");

// generated ok 2012-11-15 13:43:50 by martlume
