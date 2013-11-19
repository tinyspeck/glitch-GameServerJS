//#include include/takeable.js

var label = "Party Pack";
var version = "1337965215";
var name_single = "Party Pack";
var name_plural = "Party Packs";
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
var parent_classes = ["party_pack", "takeable"];
var has_instance_props = false;

var classProps = {
	"collection_id"	: "",	// defined by takeable
	"party_id"	: ""	// defined by party_pack
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
	"toys",
	"party"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-37,"y":-44,"w":74,"h":45},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAJVklEQVR42u1XaU9b2Rmef1Cpf6A\/\nYT71Q\/sFqaqqVup0NBNNR01nMkkghCWE1YMBgxMgZjHGbAaMF7yBbWzjHW\/YF2NjzGL7AjbrJE5I\nAklDBk0nmagdjZ7eezxckk6lfuqXild6dM8957zvec67nHvue+9dyIVcyIVcyP+fXLalf\/HR0FzR\nR6NzRZ9MBItqpyNFm+lIkXN944sOe0xYIrMJS8ecQovXLQxFw8I516LUn\/uKWtzPUfMbEcq8mqPW\nHy5QqYdRgtMXHum3eWU1jquKcNpfBHz9M26xv5SUSGuqb1KVLa3UrfpOqorXRdXyxVR9i4S6zu97\nJZaNYGBYDPuMBDbjXYRdQiz4JAh69fBZbQjZnaCTU8gmpdhJGZD067AeGEdgbgDRmAHL2TXEsklk\n8pvYevoEs2ubcKRycGW24dk\/gvfBCYFkYZtDx\/w2htKnRYRgY1c3JWprA6\/u92gRiyGyWtHtXESv\nOw6xdwn9viS6PQnwLDHwXSk0eTJo9tIQ+DbBc9G4oovj+mwWpYHHuBl8gvLwcwyspn4CXSYMb9YG\nz5YNlpQd0qAXIrcP9IEM+\/clWKYH4Ul6IZ0NwxNXAd+\/KBAsb7lDNfIaUdt8DX0MOdbI22CNRTYn\niREW9I4UUrMa4w4lXj\/hAce38fphDTxzMnj8KtAZO\/Z2PKBXusiY1qKFJxxGYj2Jw8d7oLNpeDwi\nvP72Kfa+ymIv9SWZl1iSs6Rw8iKPw6zgnGBDxz2qT9wBfuc9qJ0KMjkcXyTK7GRWiW0nFprJGL18\nh\/SxCxxuNZC+k\/06MoftZ0mweux4YrGXkGP7z8DOYzeUSGjJezgWJHbO9G0+F7HJEay900EJmptw\nu5kHtWMCD+gOzmiGTiGyGCNtrc1JDNPrk9xiidhgwRiDGWehn14bIx4iZHbnEQ4IiBfZd9bumcdY\nW3t7ca7\/zHvR6RiOd\/nnBEt4LVRTUyPKGsqgtssRCRjh9s4ThRmLD5EZDQkPGxrWOL0RKYSBDRfT\nPiPIhpeQZkLFziPhY73y1hgh8uN8FlR6mNg927BmyoFnoSzeHNaCq+LiBj4laOGjsv4zqGbH8SDd\nC5ctRBTSqSS+WY0Wdv5jmMmTIewJeQskE\/x3SIQX3Vw+nRE6GzsjfAbzIwfM605uLGigkEvIyBhH\n8Fp9I9XWykddaytDcIwMWt1aToldhOQTS8rd9k4+ERLe\/ndInIHV+fcx1t7f1oUcRPZJLvfURjN0\n0RQmMg8RCqvOCV6t4VG8+jrcYjyotI3+x8VYck6TAtGI+qcEGU\/mXIMwz0yT91lvgJCbsbswOzCG\noFgJm2aGIzjd5oKlzUtgVHkKecuEuUUewEDmBJXRl2g2r50TLOc3UWU3K1BR8zG6hoxEUTk5SxRl\nWgsGezVQCK2kf2G+kNR321TobdNxuTnRZkF8PkHGLKo50seGf7G7Dw+Zs9WqneKKIGg2kQ3ZNVOc\n94aHFLBNWAg5FsYlyznBSxUNqK67jQrel+gZ0sPab4d1zk8U5VobKPcScvM0ASkUxqjbqcKU3Qaj\nL0rmmW1zyGZp0lY6nbD5g6Q9oDAgLhvGtHb6\/JhJM2nyjAdPYIqLTjgUwqOBHgg8q1Asz+Nlvumc\n4MfldeA31OHqrXLI5HJsOUVciEcMFuQfLHJhOMvFqvknZKcCd6ZQ7V4fNnKFtmHFgQEm3OxG2P7B\nbTXaR388rJNOhEL3kN8SkDMyuuxDYtWP0yNLoaoXeslTlMydE\/yg5DZqa6pQWl0Moc4CfXwOOouC\nLNCrnCbG8LwVco+NfIZaTRRqfAfQhmcQi3fDOtsOs1uH\/XQjnF4pki\/ikLg1kHsV0PxTh8mclcDy\nRI7tVD+ylAX3V+SECHucsFhSq+EY1zOeHMbrdD8640fnBK9XMeG9WYZrFZ+Bp3GhIX4CfGNFfldB\ndsQSPL3Pw63IM+I1nm2FvLP9rPGn+wJu5+TJeLEzGEfbYhx3wyGowi5Q2RHgRIIn9BbeRB4T3F8r\nHPLHe3fgGAxgOb6GlF6PNaUK8dxbHvy8vBKC5jpUNjSgTecA\/ey8QqnVJPIHM4RwU\/AAfNMCSWDy\n7VzuZYyK4LYPgko4sZMWYmdLje0He6j1bKPBnmIuAOvI5FaQ2Qzgzasj6G2LhNyObxcH1Byxk1sf\nx+nXh3i9myIF9XLeS+ZyBG\/WVKP42nVcKbuKCZsDb\/JbeKpR4R9He\/DF4nh+lCcKEeamIVtgDvDv\n1nD8yI78zjAhlVnrhS8kQWaLKZi\/e5BackBhiWBmeYNskNXNbG9gOb0Eg9EK+6QDC64N7M+HkV\/s\nwr64UOmP5WPc8zQWequKvyhGRUkpSsr+CLlRitOIgkx8FnFgYtiBsDqK0xerJHzPH\/Cxc7JAPBrb\n8sNiCUIeYr4WpwYSQva5FDHA64gScptHx1g\/2Cftna9ySKdpLC2swrLuRiqzRsiw+P5lHj+8ekrW\nZb9cbPTOL6zFpSi\/eQOfFV9jjpVq\/PCoGm9oHnZ2u6ESOaC0WLC2IUJmpQP9zAV0absLPzytwmbQ\ngW9DeQwmaei+08P9yg73NxqYmKuZOxbG7sEm9o8eQZE+RLlzG0vJBBQOGxzeaTgMZsyLerDZ3o6c\nVIJjegmPoj5k7tzBzpQGh+vRt4qkogLl5Tfw+Y3LqNfqoI4aCFSUjgm5Ad0LMtxLjqJx1oD6yUm0\nzIxibsaPnDWBA9MKhgyT6DvoJ+hKS9DhGUKICmA6HIPAtYYqbQwmhR+b2ihoDQWN0gQR1Yd7dBe6\njMPQ6Q3wm\/Rw6TVw6NQcOII3KsuosuJiXLn6V\/SNuLGqCCI54SdY0QcQVbjQOazGVcU06jTtkPgH\nsJIIYGrIAINYj44eFerlZtSNGQn44mFImIPZ5rHjktSGS2ITxEOTMKg0qB+cwkdiM26pW1CpacOn\n4gmYzFoEfRb4vWYOc24j3vkJuvrplerK8t9A2GuCo0tH4JTqMCtldjWhg210EvymJlzvqkXdcD0U\nvTIYJ5QwiRUwDykx1TmOKeE4tIKRVx9X38tcEgxQpiklJR2XUZV3xdSg1UN1aq1UTXuX9LfNY8I\/\n9RiFf1ZFhZ8Mu6t\/XdH+S4bCz\/\/rn9qnre3vN3ZM2scaxBSLkfpuSvZlj32kRyKVNfcIKxou3\/rw\nw19dLi39w+\/uilqLRod6Cfxu0\/sX\/7kXciEXciH\/O\/kX2eQRgUWaIM4AAAAASUVORK5CYII=",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2011-10\/party_pack-1317861528.swf",
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
	"toys",
	"party"
];
itemDef.keys_in_location = {
	"p"	: "pickup"
};
itemDef.keys_in_pack = {
	"r"	: "drop",
	"c"	: "activate",
	"g"	: "give"
};

log.info("party_pack.js LOADED");

// generated ok 2012-05-25 10:00:15 by eric
