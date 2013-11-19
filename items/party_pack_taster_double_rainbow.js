//#include include/takeable.js

var label = "Double Rainbow Party Pack Taster";
var version = "1353015807";
var name_single = "Double Rainbow Party Pack Taster";
var name_plural = "Double Rainbow Party Pack Taster";
var article = "a";
var description = "One ephemeral cute-as-a-button party space, perfect for private events. When activated, temporary party location includes complimentary mineables, munchables and mixables, sparkles and lollipops and glee.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 200;
var input_for = [];
var parent_classes = ["party_pack_taster_double_rainbow", "party_pack_double_rainbow", "party_pack", "takeable"];
var has_instance_props = false;

var classProps = {
	"collection_id"	: "",	// defined by takeable
	"party_id"	: "rainbow"	// defined by party_pack
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
		'position': {"x":-31,"y":-36,"w":65,"h":40},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAJxUlEQVR42u2X6VdaZx7H+x\/0T5g\/\nYDonZ07bF+lMSrov006mSdukHWvWujTiFsVd1CgiKriBLMoiICiCgAKyiQhuIBoX3KKJUaPpSU3U\najRtk+9cntRMSc+cM+9mXvg753Oey+Uens\/9PsvlvvTSUR3VUR3V\/7aaS\/THWjhmWivXSmuvc9AM\ngl6aWdxPkwpaaYFBB82rCzFH7EGmTmFnem0DzPngLHNp\/CZzIhhizk1NymYGVjz3prc922ubnt31\nHc\/jzV3P7soTiqee3bWnnr27kO1vgLl\/H7T9B\/jD7wRa6wy0pkoF2pt0EJeqUcOQoSFPCWGhBoJC\nNZrqmqFVqMDOE8OotGLEOYjRvhGEnGMYc0yjr2sQQWcI\/WYfnAY3Rh0TGHSEsDi2gNlAGJ0aE4Z7\nQpjsm8eUd+EZvnmYFTb0G0fg7QxE0aPyI0qQRRfQONcaUcsWwOuxobVeD01DBAO0\/GfoxVaoK60Q\nFelQl9tCqM9XQsGyoIVthZJjg4rTg9YqOzRcB7Q8J9pqXdDV90Lf4IFe0Edoq3eRVl5thpJneX6+\nsVxLODwXJfj6Wx\/RCrKKUVxYBrNJj4asdvCzdeBmUqmlNYOVIkZ+IhfsdAkkTCOaik0QFLRD09gN\nKVsDLaMSupQc8BkVkDXoYNLZYaGS7GTVoItRAKXIAKetH267HwP9QTAZ1QgFpsjniJC4QocHm1t4\n9GifHBteFKR\/U0CrKGaBW8WCydhB5Pg5HWCm1eBGaBoHBweEyfEweLlyyPLV4GXz8PjxY9wYDsEY\newbd334BcUkFfv75Z8yFb2L59ipWltegu5YArUiFJ0+e4OnTp1hfuwdhiQRSfjsipZQY0NXhJsf+\n3iBMYh8hSrA4kUsrz+Iig5EBg74Nwlw9RHkG5CfwMD+7SCi4xsHC\/BLUsk6YYz6HskFOpCOSvuYk\nrBi+gex6En766SeoGxvQVJ5PZA2NLHib0zDkdhNJTYMMPZnpcGZnot\/hI8kdpqcRWNHdPECIEvzz\nifdoafG5yMrKgb5DC3GhkQwlJ12K8dEpjIemwLucizaVCRNjYUhTzsPj9MNicuHu2gaCHgG+X7gC\nnZJOhE36Tkgb04mg1059N5eG6aADv\/zyC8wtzVjQZmCMmwl9dh5uLd55lp5nFDb58HOiBBO\/yqHR\nr6YhMzMbuvZWSEu6CFUZMoyNTlJMIef0JarjHiLLSY3D2uo6hgdCuDl\/CzdG\/ZhYvwChMoEIrt+9\nh1tLd0iadm8R5u4lY2L8maBJK8VyXz5umXLgFTMxOjJB0mvjqeBQBZ4TJZjzLYd25QIduXmZaG9T\nQ1FmJVQzFBgLTmJ\/f\/85dZUC1LEzyfHh3Hyw+RBN3mqUCquIoLd3iLQdnR50zEjgWCmGza0hibp6\n3Lg9W4pboXLIauvIsHud\/ei7XoE+sQluTYgQLXiRRUtLTUUqnQGtRgk1uwdqVjf4l7NIgnMzN1HP\n4qCGVQCnMRUyMZ+IaZVGMuwRQZVlHIXFKnK+orgBSzeXERweR51pAY2e+xDJbSTRbqML\/oU82O1l\nZAR2f9xDp4CL0cYqDFTUoF\/mgFd3I1ow62LpKUZyDjJSc6BpbYG20omOTC4aYxJJghHJTkUmRv3U\nvOlPhFFnIwuHRe1p1eV6DPqC8LkCKGcIiWCH2gKr2UVSrCqUwCodRHOjngiaDQ6oB\/xoaKgmibp7\nPJjo5mJGz0NAUIcBngg+7QtzkBF7nXk5\/goyGalQq+ToYCpgTMyEPDkJoYgghbLlGjr8GSgR8OCi\ntpY6pQm1HAN0dS7IRFqsrtxFUUxkroVhrBNCWsTG5I0ZCKsk6C+qpLananJjjbwWqLuXUFptQFV9\nMzo6KjEflGDGxse0jo8hvhiDfKUnSjAjtohZUpQNOj0ZKqUMptRiOAupVVuUjGqWkEpJhHppPvKV\n3ThZIsZxdhOOFdThRKkE1zMYUKV9BUleLKa0Z+FXfYWQ7izCxnPwqS5QQxeDcHUMxq5dQCC\/EB5Z\nH3qpOWY2hKHoWYBjuBnDASFmR1ow3SXBhFZCCaqiBdNjCpnxX1\/D1e\/oaFE0w5pbhkFBHkY62Bi0\ns9FmZyJdIsdxlhR\/KhZE8XYZFynCYszM0rG1dQn3ts5SnMbNtRjcoVb298vUHhmkY6k7CeF6akRy\n0+EXGtHXPg6DeR5tPVNwDYoxNqRAuF+LtYE2\/DDhiBZM\/TqfmXA+BbGxcVDIm+CvL4NOxIFSy4fe\nwgZXLcUruZzfyX1Qo8RFuZG0scpSsFxyCim+0+gg6AuA3eODIJCBkdtXqf2uAHf8TIRl2QgWl8Kv\n9lN\/JJYxvrKD0J0FzK2bsTRhwdZyH7YX3dGCyedymWlpV1GYnwGxWIBcKi337C1CstZKWHu4jTeo\noY0cR85HBCJEKiKpHJoA3xNAjsEJts1HrgncXkO5ZQwK6rnbd1eExQc83A834K6tHsuderKI9vYP\nKMFtLG2O4P6Pw9jfm8TOsj9aMOnLbGbcuXT8M+YS2OUl8PUbcVUoJR1cqDWRzmY37hOhQ7nDFCMV\naSPXGsdniaBmOEBuKHLdBPU83tnbx9jqLnoXm7CxpcCDGTnuudXYXpojkqube9Tvr2NjJ4j9R3PY\n2wxHC373JYN5\/lwcGCnZ4LBLcLA3DcWAl3QaKzVjm7rLSOeHKR4m+1tB1\/QcETrBKoNmwEGujyDz\nhTA00Qa9uwC12k9gGsmAZ6SA+ieTgxlqvkW2pUfU789v7GB9O4yd3UXq3Fq0YMLnGczk+CTQkxLB\nq6nCwf4Smvw+Ing4fH\/MKiOf84xu0h4KRmQj311sEhHBkq4epLTykaDUIa3lCnJaz6Op50M02z+G\n1P43yJyfQu48BYXrH5DaTsEaoBZjWIW+MR3WH65ie2+FEvw+WjDudDrz0hdJuHT5Aurra\/DoYA2O\nmXFwnUOQD4xB4miF29ZKRF5cKJHF83XtZQgtb0JopUFkfQti2zu\/8i4l9\/6vRCQ\/oiQ\/hszxCSX5\ndyIZocV1GgrnGXQNZ2Nu1UEJbkULXvks7VT8l2kP6YlJuE4N0aPHP2BpYxYDU3rIbGfBN74Jfvfr\nyFV9iPdK6Xi1mINXCmpwsjQH8cKzaLT8hZI7QbWHkicpubeJpISSlNjeo4hIfvAf02xxfYYW9xko\n3Z9TqeZ7fvdeEn82\/VjCpaTbldXVmLqth85\/hUi9CFdPiSreQYb8FNW+C4HlOATdbxDJRstfKYjo\nuNBC8wgtJz0i6zseSlZGiTKb7e8Tmuwfnpc6PqI941OasveTY\/\/V21tcXNzLeWWxsobu1zy\/hW95\njflbBNbXaf\/mOE3kfPXlo3ffozqqozqqo\/r\/rX8BhJNHvy21vakAAAAASUVORK5CYII=",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/party_pack_taster_double_rainbow-1334258913.swf",
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

log.info("party_pack_taster_double_rainbow.js LOADED");

// generated ok 2012-11-15 13:43:27 by martlume
