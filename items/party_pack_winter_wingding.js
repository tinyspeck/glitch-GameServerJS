//#include include/takeable.js

var label = "Winter Wingding Party Pack";
var version = "1353015777";
var name_single = "Winter Wingding Party Pack";
var name_plural = "Winter Wingding Party Packs";
var article = "a";
var description = "One temporary wonderland, perfect for holiday get-togethers and winterly fun. When activated, this icy private party spot includes trees for decorating, ingredients for heart-warming drinkables and a DIY pie bar.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 1000;
var input_for = [];
var parent_classes = ["party_pack_winter_wingding", "party_pack", "takeable"];
var has_instance_props = false;

var classProps = {
	"collection_id"	: "",	// defined by takeable
	"party_id"	: "glitchmas"	// defined by party_pack (overridden by party_pack_winter_wingding)
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
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAKFElEQVR42u2Y6U9bVxrG\/V+082G2\nqjMjjUZDKlVtoiaQ0IQlhJI0JCUJCYR9C4awYxyD2cEGr2AbDBiDAbObHQzX7PtO2BOaQEKTVKVr\n2tF05pmXqxp1Mk2XmW8jjvTo+lr3nvO7z7uca3M4h+NwHI7DcTj+qxGo6rTx17Tb+Wu6WW1sb9mZ\nJhbs1F1TXuLmUUGAuofUJSjtnRSsbW8J\/ArbBJHaTqZ3boGp6BtjCtsGGF95Hcl4IB9Zbb6PvFZw\nU2a0C9N22rAL2bqez7\/gz2UuCFSMl6T6hRvqZku6h7H6YBO5jf3wL2yD0GiBqGkYBAFNzzR65tdQ\nPbwE88I6Crrn0Dq9itzWGYSouyCs6kH9yCK65zch75oDr2YEipZBqDpGUGGZIc1Ca55Ggq4LCWUd\nMM+sstIPbyGvewN55i1wXn3jJPPKkeOwOXUWERIdPLPKcD1bhxs55biRq4eXqBL+snqEqVrglU3n\nORW4KTIgrKAZ4apWBEjr4Z1dAZ\/cKvquBVHabsSU9SJB34+kyiE0ja5idvMR0humkWWaR07rEsQd\nK8jvXIOkex3Snk3Ieu9D3ruFJ3tf4Pnz57CsPkNB\/w6U\/dvg2F3yZP5o64xXbN6BGzcFjpHZcI7K\nxbnYfLwXL8MFngLufBUuJWtwJbUE19LLcCNLD+8cA3xFNQiQ1CNI1ojQAhPC1e2ILOoiyB7EljGI\npHMeQQpqRgl2kFzqQ5LeAoFhCEL6LqGkC\/zyPkjN9yBqW0Z6qQlZpY3IrhuB0rINBfMQnHSliFla\nZ1BSo4G9byxSioy4mqzE2WgxzsVJcSY8CycDUmDndwf2dHSi86uppQRZiSt8JcIz5biaJEOQvIkg\nW5EgL0FZUz10pgaojLXwFaqQUD4AmcGIubUxLKxP4N72HPhKPZbvz+DB7hISS8l1lQkrW3N4ureG\n+OIOyJkHrDi\/O36OuRAQAjdff9h6R2HuLuVQeROcosRwiclHgkSBT\/amsffpDB4+GkP\/ZBeBCuGZ\nWQGhSotPP5tHnq4cvvm1CFaYEJmjxBdf3kVrfweYCTMmlwYRIK6BRF+F1a1JfPO3DfSOM4iVG8DN\nq8DnX20Q6CxydEb8E9vQNrVCTG6WDj1A5SiF+Pd255lbAj7qOyoJMBqnwtJxmpsFh8hcOEfn4S3P\nOBZQqi+DQ0gKVjYHwJcX4n1eAWq7GrCzO4GZZQsu3ylCoKwJ70WK8PkXi7idW4CLFIEvv1pGnEIP\nLhUYT6bF19+sI6OsDokVg0gxjkNqaMC3\/\/gQTz5ZYd1T1HRBO\/ghhtaeYnN3D5z43CzGPYSL3xxz\nhu3NGJwMTcO7FMbTETlwjBLhuJ+AAKcgKS+FfXA6mPF2yCt1OBUoxPRSH5QGPdbuD8MrWUEuNsAl\nPAeffb5ATipwOVbEuikoqkKsbgDxkiI8\/3oNaSVGJNdOIbVhFonlFvRN9OPv325BU9+MxrFNFPbd\ng3ZgC1VjD+9z\/nDag2nsroF3dDRsfWJhR4Anb2WwkObRaXjE57GAfWNtBFlCYR5FukaDM0EC1tkp\ngtx+PI4cbQl1gEo4hWWxgPvad3J+dQh+1BmiyiyIzVPjq+crSNOUg18zDgFBhkkpCk8W8Pgp5WKx\nHuJOSpnOVbbCNZZ7i5yj7v6MecSEzMJ8uN9OhcTQAneeFKcIMFRUBvsgIQu4vGFhIYvqKnAyMBUR\n2dKD3Pxkb4Z10y1OAYfQDMrLOYjLdCxkmlqLYLkJ3GIzokSFbMjLmuuRaKAqrhiGvLqODXuBsQGS\n9npomGpkt96FrGuEnFxf5Lj4RTIe4TF4zfY8QoRS7OzsoKl3hHXRPjwbb3hEE8AkLajFcX+q4mgp\n5aaEdbOFaWJhzwQls6CXY3NwOiiNPs8iJC0fg9M9mFsZgEdyCW6pew4KqJSqPFzVCd9sAx48nmUV\nTEWm6VOjbpIHcfsAygZKoOheXeA4+0XO3k7PgJN3MEJSZXj06BEq2y2wDU0nyEwc8YiiBacIsBjO\nMTKcjVfAjnLRGnLXeCWcb+djcsGMzKIiHPfmsYBBQjF0zUbWzQiRCiGqDvgJxBid66PrShGqbIVP\nsox1k1+ghrC2DYaRJNSMxaNyJA3VY5nIa19c4Jz2jkCTuQ7ljTq4R6VTiE1wi83DiZA0gszAXy\/f\nZgFFBOgQJYFTrAxHvZOotWjhFHwH7wuKcZ5fDNewZFyJy6B+mQwuAblRgTlxRTgTkgHXqHwEKtqo\nf+rwAVX7jcxKRGj7oOrhI05vhrhFg\/LBOBT3ZUPXGoOiPimM44m0PRoZjmesAMvUOrhCIex84\/G2\n\/x0co4bsEBqHE+Ti2z538Ob1RGSoq9jwzy2vIUvXjHdpccfbErgR3AVBCdxTynA5tRwe6RW4kmmA\nZ04NMg1mSBsG4Ctpou2yhYUMLmhHuKYFtzTd0LTdAq+8GpJWEfSDETAOV2BitA8L9y2oskTTvp7L\ncI5+EALXgEgW0HYfkHYM28BESHl\/xo3Im+DGnAdfUwtLnwkLc5PYoabaUBoJZyoIl4RCuPLU8OCL\nWciLBHkpVY8PMmiXyaxCtXkCus4xeIvr4UOQft9BSttiKCdbUNw6hKXVdUyvdcPUJsbTp0\/x7Nkz\nfPzxx3j44cb+keH85Zwv\/uRwDTYuV6jNxONNnyS8RZAnAnkQxL0Dx7AEJKmNbG7ua+duE0w1cSgo\nCAU3MwVXEoXIEDghWuBPW6SEhbycpkduNVWt2oRr2TX00lHHQgZKKhBFW1xlUwXm765gd3cXH330\nEasnT56wskJ+B0ohjubj4e44yht0OOETxwJ2j0zBN12NY9SMfSOvwocvwPzy+gFkddcwfPlJCEgI\nRSDvFtwTc3COp4HbHS05WYqLQh24ygZ686lmnbyaVQN\/auLqlmFs3dtg53j8+DGrl0F+J4bz1sUA\n7LcZpV4FL14uxJXNuJlWSFteGo5SLqaVNuDe2szBhPVGFTY2VtlFwiQGOMYq4JxQAJdENVyTNGxO\nnmfDTUVHOZla3onG\/ik2f\/dlfUirrJA\/BEpiOCevheB1+0s49v4NajNSlnxhdQPxSgNOUS+03mzV\nfi4uLkyxkyvqeuAQI4djHLWa+H1Iei1LKUG6vh36jmHMr2wcgL2oFyF\/yE06MhwPbiwVSAoyC\/Ko\nUUu+b6\/1IlZWwKXFKWxurrETmizjBNkNZZ0Z5rE5qvD1A4Dt7W1WLwP8mW4ynNdPXULPUBMylCK4\nB0X\/G6AV0gq6f2M\/Y2Ih9z9bn\/z7i7wI+FOQP+Emw3nN9gIcrvuhe7AB57yC\/wPwx9z8Kcj\/1U0S\ns\/\/Cyv312457afJsuFwPfCngD7n5c0F\/gZuzJMYqmi+f\/WX3qzfsf\/vqETvmrKf\/jwK+zE2aaHb\/\naQnKqkaS4AW50bV2BMmKAGx+8W\/da6GRXtQgBd8XNUs3OtpZRXA2h\/8KHI7DcTj+j8a\/AMv16cfF\nJL58AAAAAElFTkSuQmCC",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/party_pack_winter_wingding-1334273457.swf",
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

log.info("party_pack_winter_wingding.js LOADED");

// generated ok 2012-11-15 13:42:57 by martlume
