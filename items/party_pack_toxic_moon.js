//#include include/takeable.js

var label = "Toxic Moon Party Pack";
var version = "1353015766";
var name_single = "Toxic Moon Party Pack";
var name_plural = "Toxic Moon Party Pack";
var article = "a";
var description = "One secluded and totally transient lunar location. When activated, temporary party spot includes ingredients for cocktails, sparkly rocks for space-mining, and a notable lack of gravity, for super-awesome-space-jumpiness.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 1000;
var input_for = [];
var parent_classes = ["party_pack_toxic_moon", "party_pack", "takeable"];
var has_instance_props = false;

var classProps = {
	"collection_id"	: "",	// defined by takeable
	"party_id"	: "moon"	// defined by party_pack (overridden by party_pack_toxic_moon)
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
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAK3ElEQVR42u2XaVRTZxrH+TbtnJmu\nfrBVoS6tgoJI2EHCHrZABAIhgQSQQEJIQgDZBEIWkB0RRSuIsqhIVcQqCGKvCGVHpe7WDtaltqen\nYvd2Zs78581rpXXmw7Qf5hvPOf\/zJrn3PPnd\/\/M8773XzGwhFmIhFmIh\/nCEK6osNslr2BrdXvbE\nSD97R3Mnu6H1OLunv5+tq+tU7z\/Sq2051qdt6zqnvXVrRjt56ZI22dhVm1V9mmk\/NcY0HR9hBqeu\nMSX7BhllVd+vquyrVVX1q5U1\/WxF1TkL+mf2wapatbaOKd55hOHGFzC+0VmMnyCH4YhymUBxAeTZ\n5Wg+sA+ynCqESbfB0HAclfvex5FTH6C2pRd1bX2oP3gW56euYfTaXYzf+BTHBq9hd8cA6toH0Hh0\nEF3nZ3Cw\/yOUtV5AwY6TKKx\/Kv2eXtQfGca2fX3Iqzo0r4rGE2jq7IeyuBFmS93SGPON6bDmpCOt\n\/Djyd3ShvXcUfRNXUbqvB4U7u7H\/\/QvIq2hGrKYacZoaSDK3Iz5rO0TplfCKUMOHr4F\/dCY4giwE\nibIREpcLrjgPYfFbEb65EJFJWkQlFyNGboBIUQKxchvi1eW\/S2aekUrGyleJVZ5K+CkasY4thrWn\nBGl5Rth6J2CDbyJY\/kmw5yTBMSAZzkEyuIbI4cZNhUdYGjx4SniGqyikL5EJMlC4BcGxOeAS0FBJ\nPjYlFiAiqYhCCmR6SLMqUFLXhEzdznmQrt4e1DUd\/G9A9iY5o87OQnrOFvjJ34Xlxlis9YijoDZe\nEqz3joetTwLs\/DYTdzRwCJDCKTAFLsEypGwxoLiyjoKaIKNTtmJ0agBj0+eotJU7qZsNB9rw40+3\n8dPPH+Pnv39CztPhoxtj+Prb26R1qtF4sBP\/wv15YH31vl8BF7PiGPdQGbn6VPjKGrDaTUQhrTY+\nhdRV1eLx3DQmLp7B5KU+dJw4NO\/mhdEePPl6hpQ3fd7Ny1fPo\/tMF9QFFfju++sQq\/TgSwsJZCuF\n3Nt+kLoZry7BnbvTuHJzHF98eQ0XxgcpkCy7BsdO9VBRQJafhGFxEsETp8KRr4VInkvKl4w17k9B\nRam5BHAK4rR8AqKksHxpDoWce3IJPQNdKN\/ZAFeuAht5KgyP9+HdtlZ487MwSlzMKK5FgDAXWYY6\n\/PDjLeSW1IOXUEh6U0uObcfc1zfxj3\/OQl24HRJVGYXSFNVTUUCX4DgmUZEKcwchbLlbIM0owtsu\nMXjHVUjdFMqfAsYq8uDHT6OAEmUB7dH7D8ewo6kJUzMDBFAFN146hgjg8EQ\/2o8dwTffXoEwzQh\/\nYT4yDTvw\/Q83kG2sR2h8EcISihCrLMHjJ9cxMHSW9qZpgOKUpc\/34KK1PEaYlAyhNAXrgzOw0kmA\nVc4CCmmSQJZDAZ9p\/GIvGRIZKdV+Cjv35CJ1UqjQwSUsgwIOjffj9t9GULN3P3xitsJXuBUZunpa\n8vr97QiJ1yI0oRhtx47RsqeQLSwqxYBoAmmadBPkMzfNPLkxTFpGKjaGxMImKB3LHaKwwjGaQpoU\nnbyFgEyiqLyKuJmPtZ4JsPGW4vqt8zBs34WEDCPOj\/SgueMQnMMyMTh2Bg2tbWg92omhibPwEhTA\nR1gEdXE9vv3uGpqPvIcgSTESMitpyXuZM9iUpEeEVI\/IZD2BNDznptmrqznM62sCscgyBOsClLCw\n5+MtAmkCNbkZ9QugQJYLS48EWHkmwTc6g7oZnlwIu0A18srqce\/BKJx42QSwD7ta2pFV0kAG6DIU\nhTvgHaOFigCaSt7U0YlAsZ4c340DnUeRmFmNsEQDgTRQUBPkb900s3EPnUvPlMGLK8A77M0wZ\/Gf\ng+RLt5ASTkEg34o15LilZzJEKh3ODZ+CDUeFDUEaeETloa65BSGb9RCqysFLLoVbZCFkBfWIVFTA\nM0YHLyLfWD384gzwJwqQGBEUb0RwghHcBAPCNhuJDM+5GZWimzVbZu0DLj8GLn7hWLQmAMvsIhAk\nVBHQSLzlKMByJyFWuorxtnsiVrOlsPSSwcpHgXX+KtgEaGAblAm7kBywuLlw4G2FI68AzhFFcOUX\nwy1KB\/doPdgxRngKjfASGQlkCZW\/uAQZhr0oqmmBsqAWxbotOHX6MGIUZb+4qUOkVMeYLV3LhkcA\nD\/FSCV5\/xxdLN0RQSHNWFCwcY+BG9rcoWRGC4\/KIwzJYeqfByldNADWwDsgifZuNDdw8sEK3wp5X\nBIdNWjhHkoGJ1MM1ygh3QQk2ErGFpfAUlcI7dht8YkvhKy5FacNhshWNonL3AWg0Saip0aLlvZPU\nybBEPXhJBPClZY542cKZyBWvrfLCEtsIKnMHAcwdY1G7qwYZGRKSQAw2PxOrvZWw8tNgLScL6wKz\nYROcR7anAtiFFYG1qRgO4Xo4RhjgzC+BS1QpXAXb4B5TBg9hOdiiMnjFVhDIcvjEleGbb+4gv+oA\nDp\/sJXeWKXzw4QXw5eUIISXnJujJVkQA31rnBr4oGrGJIry6wgNv2oZjyYYoLLMXwsJJjMaWvZDL\nBaiqyoWA3ORX+2hg6ZcJK04OrIPyYRNSiPXcImzg6WC3yQD7iFI4RG6DU1QZnKPL4RpTQeUurISH\nqBJsAuhJ5BVXgWh1PVT6Jsxcn0Ld\/qNkgLoRLq942pvxBrIdFTNmi1c5wJ8bCplCgleWu+MNWz7s\nOFIkZujhL8pBeUMz2o8fx+62DtIvTRCoKmFJ4Cw5uVgXXAhrrhbrw\/Sw5RlhF14KVmQZHPgVCE3d\nCWlhM8IUu+AqrIYbkbuoBh6x1QSymkBWwUtcBW8CKkivR2PHScSot9Pe5IiNCJQYiAjgq0tt8JfF\n1li8yp6W+g3i3pssEVhBZBB8U2FNhqFiTwuScmqhMe7Bar9srOHkwSqwED6SSmRXtGIvST46PYTP\nPpvG\/fsTdP3ii8t49OjSvL788go5Zxj9F86BGb2AXe3diM9phGdcJXXTsPMwVLom+MaVkiknQxRH\nJlm2jTFbudYBlnau2ODiCdbGYPCT87DEPg5LnRJg7pIMCzc53CPzkZRbR0pSA6FmO9493IWvvrpC\n\/ngaDx5M4O7dkd9oFLOzI\/MaG+vClStn6e93745R3bx5nq6ffjqBqzcn0Dd4HjX7jiFaVf90gMiU\nx2fWoqP7BGP250VvI1bMh09gAN5YTUA5KWBHarDMOQnmrjJYuCvgxi9EVeNhPHw0g9u3GZL8Q5J8\ndF4msGfrM8j\/BJ2dHaX6LejMTB+mp3so6IMH08T5S+gkTzHRqlp4ky2JPMEzZi8uWoUVVizwY8Lx\n0lI76l6UXItlxD3XiBzsOfQeHj40lW0CIyOdOHDASNd790Zx69YHuHy5Zx7seciR\/wlpcnJoqBN3\n7gxTyMnJU3T9+JMJ7DnYRQDLGLM\/vbZC\/eLrK+c4IYF4aQkBdJAQ9zYjr3w37t6bxOefT+Pq1TMk\nySBu3BggSQfI1Y6TXhujgDMzPb\/Lze7u3Th9upGCDg8fJRfW+5ybJt27Z3JykphxcfZEzwmGPGXX\n0henF15ZbvHColXMX4mDTqHp5DbWT5J0kCs6Qct59mwzTp5soE4+1ThJNEYhTTJ9\/gV6jkAxJpHv\nVASilgBrp6ff1964cVZLKqFuba1gm\/SHXydZHsGSj2entffvj2vb2kq0k5Pd2tnZIW1raynbpEeP\nJqjm5j6ievz4k5cXXsIXYiEWYiH+v\/FvDLfQxlfJACsAAAAASUVORK5CYII=",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-05\/party_pack_toxic_moon-1336412787.swf",
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

log.info("party_pack_toxic_moon.js LOADED");

// generated ok 2012-11-15 13:42:46 by martlume
