//#include include/takeable.js

var label = "Mazza'la Gala Party Pack Taster";
var version = "1353015810";
var name_single = "Mazza'la Gala Party Pack Taster";
var name_plural = "Mazza'la Gala Party Pack Taster";
var article = "a";
var description = "One private and transient five-room wooden party lodge. When activated, temporary party location includes DIY hearty party feast, beer, booze, and one very dark make-out room.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 200;
var input_for = [];
var parent_classes = ["party_pack_taster_mazzala_gala", "party_pack_mazzala_gala", "party_pack", "takeable"];
var has_instance_props = false;

var classProps = {
	"collection_id"	: "",	// defined by takeable
	"party_id"	: "mazzala"	// defined by party_pack
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
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAALPUlEQVR42u2YaXRU5RnH50MVK1uQ\nLWQhIRuZTLZJZt+XzGRmklmTmWQyk3WSCdk3wpIQwiIUBMHIoqAoiyAqmx6OWOrxekSUIohYlSq4\n67GtnqKittrqv899MbFK+60f+iHvOf9z7517J+9vnv1GIBhf42t8ja\/\/v9VmmpPUYYnV99hHlaA\/\neWSn\/hnSln5P10i3Y3iJJ2V4gLR\/fXT44qnDw0Pl6ZtHuoq5049v457YsYQ7ft8gN1yRzQ2RlvHy\n53CD\/tzNA\/7crqV+sX7QJ05im+mkws2re6q5u7pLuFp1DFenieEi2mlco34aFzXMwFCDAQ9uXYGh\nWhXaLbOxLCTBlsEw1kQNuLO7FE\/sWokj2\/rx9MGNOLCuESf3rcH2PgdW1Spw95IgPePG1oEQNvV4\nsLxWi4F6C8mKHXcsGtNQSxn6Gjw3qDVkhyBh2gQu4bYJMKtyMTJYj6irEM3uQizwSNDikaLFK0Vj\nSR5CRULUubWo9+jQ4NUj4jOgplQFhzYPZmUuilT5sGjEsOkKYTdIUeG2IOgpRshnR7W\/FLUVLjRU\nedEYLkNzbWBMSzpDWLW4hmlhaxBN1X5Ea\/xorL4uQV76HC51zhTwkPVOBQqEyZCIUiDJToUsN502\nz0JlaQFqCNRpzIdVkw+7TgyXkb+WwmWSw2tRorJEi6BTR8\/qESw1IOQyo9prQaTCjqZgCSIBUoWT\nzt3oaw5h4YJqbF67BIvba3Ho\/n7cvqgex4\/cjz0770BHQwXaIxXXAb1OPTe0rBUNtW4GmJ85l0Gq\n81Lht2Sj0qFCW50H7Q1erBpoRshtRKk+nwALsG64Ay8+\/yiBGeC3qUhqHHp4BC\/9\/ijOnz2GD95\/\nAZ2RAGp8Vlx8+Ul8+90VfPePd\/D6qycRDXrw\/rsv4IP3zmDt0kYG9gM+ZMfupkr0RIPXAeNjbuJ0\nMiGsBjEaXArkZiRAnp0EU2EaDOJUbNu0GH+9eh4vnztCOoqnju+EVS5CiSYPp587iM+\/uIjh\/kb4\nLHKSAhtW9+DaV6\/TBpU4xT2M3x5\/AGG3GVvvXIaPPjyDK289i6G+JrKkCysXteDatT9iz471+PQv\nF5na6wMMbgwwYfoErrRYgfpqF0K2QmSnxUGdmwxDQQpTb7OXAQ50BuAgqKufv4wKcqdVISK4V\/DW\nm7\/Dsce2wG2SwFckw6L2ML689hq8RUqsHmzFV1+\/wVwedptw4fxxvEKqK7ehOeREtMqF\/Q9uxD+\/\nfw\/f\/\/D+z6w3Bhj0WzgVWSp11i2wytIgSpkDhSgRuvxk6MXzMNQTIMBz9MtcZNE0Btta50ZDRTHB\nXsBqcvvHH58m+HyCLERfSxW++PJVOPVSbLy9F6+9egIBuxZVFAbnzz6Ob\/72JovNxkoHAZZSXJbg\n7SvP4U+fnGNx2PNLwHkzbuF6e2pgN4pRTIDC5NmQCeOhzZ0LXV4SlnWVM8DfDLdi3Yo2BlhXbiZX\ndjJrnnp2PwONVpXASWHSHQ0wQF5fXvsDHnloE8qLVahwaFlsfv3NJdR4zKgvt6IhYGMg3373NnZu\nWYWD9\/ago74cXZHAT4CipGlcEyVAOFAEmzwNmUmzoM6OJyVAk5OI\/hY3AxzVo\/s3wJCfgscObGSA\nPDAPeO\/IIFkxB12NfhaXB3bfgSuXn6GEkhAgZblDjbMvHmEuD5HLqz0mkhlPn9jDYnOosxLHdi9E\na40XbbU+BhkJl0OgEc\/jyl1a5KfEwK5IQ0biDCiz5jBIFSlSaSGIl9BSbYeOYlNNCVRUmIpLb5wg\n2I1UEtzYvnkJSyK7SoSOiI\/FJl9aeFA+071mqos2Jc68cIglUHutB1UuPerKbPjsswvYunEQe0Za\ncHhXD4vNBWE3A62t9EAgFcZzqpwE5CROhIMBToc8czYUwlioRHFjgAMdPvhMQhabxQohPvzzKURD\nDjj0mSizKpg1Q04NVi6NMouaJVksNvlML9GKUWmTs5LEu315Xz0CVJL27VqPS6+fRH\/Ug0d3dOCx\n+zrHYrOJEijsd0IgF8Wjt6cOrc0BlBBgWvw0yOfPGoOsKzfRhuewtN0DnzETGnMGjJ0S9B9sh75d\nAkutGDrTfGbRlYsjWEF6jnsIJkkmq5s7tyynjFYgYJUway5f2Ig6rxEVdhXLdL9Ng\/s2NODgPa0E\n2T4Wm3V+Oyo9Nk4gp1hrbvTBTAlSqkzD\/MRpkM2fCVnGTAZpVWRh87pu1PuUcAZyoF+rR9F2089k\n7JJCa5yPIkkqIl45WoIatFaq4dSKUKwUwaHOQRWVsBWdpdgwUI6OEA+oZLFZ4dBg\/5YmHNi2gCBb\nqGOZyfUW1JRZqV0WcwJx+kw4iyQI+ozk4lSkx0+FJH06pBkzGOiCQD6WRlXo7tPDucV0A9yoTK0S\n2D05WNxooAJMbvLJUFpOrdGbj2KvGGU2MYMM2SV0lKHMImV1k4fcNxL5EbKZxSafQGFKoPJSMydI\nj\/01hHG3QpQwETZZCtLjpkCSNh0KYxIUpiQMdmmweqUFpZv+M1hoXxC9xyi4H2lC0V0GbH9mC\/ae\nfoBdP\/\/OKbzy0QUcPv0IrBEZSqgMOc0SeChhvFTsy1wGtNQ5sPeueuwdacBDBBmm3l1DMcgfvXYD\nJyjInIPqKjvcZHKrNAUiXQK2ndrK\/jAv\/pzfjF88CA80em\/5k0PYc3b32D3++vKnl9G7qw3hVWV4\n6tJT7P61v19Dy\/YIXATlcerhIbAyrwnl5M7m+hLs3lSLPZvrGGSIsr8mRF2NCrjbouEEGXGT4feZ\nEG0qpxiah7TkqVCHheje08YgohtMbJNRKB6Q35CHdt\/vZFbkF3\/kIXnA0PpyWBqUDPCTLz5h36+v\n0WIBTTsLyIWtNHC0EGCZ24C2iA0PbAzjwTurGWRPsx3hKgeCfhtKi5ScYO70CUieeQtkOTQgFCQj\nedatUMrSsfXECAMKk2t5oMMXD41Zit+QB\/klIA\/NLEjPVK82se\/zkPxnjWssWNvvwO09dvR5DCQj\nVQg9VnYbMLLCg3vW+LFpyEXPFNOoZSP3G6m7yTlBfmYC5s+9DYWiudRrfwIctVrdniCzgm3rdUvy\nG46CsLgjMP7+aEzyP+bM5VPo3dvEnu\/c34Sue6rQtcGDNQttWFRpRI+TBt9SLZwlGvQ16RjkKtLq\nXhOWtBYhGLDCVayGzSDhBIkzb0WQiiMfG3oqwvNmT0Qh9eGmXfXMapV325hFahpyUDbiYC7mN+Zj\n898TpaJfh0hUjfBiLdo7dehq16G7XY\/OWg0WBtTo8dBcaVOgiepfDYmfoEroyENWlWmpKOup3V6P\nzTIKgWJ9IYq1Yk4wc8pN0CiyYaOpWJQ8nQHmzqcuYsqExZ2FtmA6+mp4ZUDpK4Bhje6GTDYv1sDu\nLUS1Pg\/VhnzU0ORdS8NHgOQlOWm4tZoKYDEXwkpZbLPIYLPK4eAhKaNLqU+7yKIuqomOIjks6lxY\n6BXEos7nBDMm\/YqbOfkmVFD1jo25GSmxE5E2ZxIkZEXe1TfImwd1twraZVroFyqhWyCDjmqlRiWE\nVpUFnVoEvSablAODNgdGHUkjgok+M9G1ic7N6h9FvdusFNL7TBZM8kyY5UI6CmGmWbNImU3K4dib\nHUEOJ8XG\/AQYOwnpBClMjEFexmyIhXPoNYCUxSsOBdS7papkyAoSIZUmQ54TT4qDkqTKS6CBIg6a\n3Dga2eKvavISOG1+AqfPTyQlHdUVzB02FCRfV2Fyl1GcrDeK0\/RGKUmckfdf33VjJgryYqfe\/G7q\nj4AZcaT4yVczEyZxwoTJnChxMpedNPVodvKU4VwSTT+8usRpMXpp2gy9NHOGXpYRkzf+X4PxNb7G\n1\/j6365\/AR6l9pDjrmwJAAAAAElFTkSuQmCC",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/party_pack_taster_mazzala_gala-1334259269.swf",
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

log.info("party_pack_taster_mazzala_gala.js LOADED");

// generated ok 2012-11-15 13:43:30 by martlume
