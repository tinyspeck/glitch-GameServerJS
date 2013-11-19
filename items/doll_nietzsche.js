//#include include/takeable.js

var label = "Friedrich Nietzsche Doll";
var version = "1354304111";
var name_single = "Friedrich Nietzsche Doll";
var name_plural = "Friedrich Nietzsche Dolls";
var article = "a";
var description = "He sure is talky, but this moustachioed little chap isn't very comforting to cuddle. But then how cuddly, exactly, were you expecting your My Little Nietzsche to be?";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 1009;
var input_for = [];
var parent_classes = ["doll_nietzsche", "doll", "takeable"];
var has_instance_props = false;

var classProps = {
	"collection_id"	: ""	// defined by takeable
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

verbs.donate_to = { // defined by doll_nietzsche
	"name"				: "donate to",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 53,
	"tooltip"			: "Offer up your Nietzsche doll to the Giants",
	"is_drop_target"		: false,
	"effects"			: function(pc){

		var failed = 0;
		var orig_count = this.count;
		var self_msgs = [];
		var self_effects = [];
		var they_effects = [];
		var sub_effects = [];

		failed = 1;
		self_msgs.push("The Giants refuse your donation.  They don't believe Nietzsche ever existed.");

		return this.flatten_effects(pc, {
			self_effects: self_effects,
			they_effects: they_effects,
			sub_effects: sub_effects,
		});
	},
	"handler"			: function(pc, msg, suppress_activity){

		var failed = 0;
		var orig_count = this.count;
		var self_msgs = [];
		var self_effects = [];
		var they_effects = [];

		failed = 1;
		self_msgs.push("The Giants refuse your donation.  They don't believe Nietzsche ever existed.");

		var pre_msg = this.buildVerbMessage(msg.count, 'donate to', 'donated to', failed, self_msgs, self_effects, they_effects);
		if (!suppress_activity && pre_msg) pc.sendActivity(pre_msg);

		return failed ? false : true;
	}
};

verbs.pull_string = { // defined by doll
	"name"				: "pull string",
	"ok_states"			: ["in_location","in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 54,
	"tooltip"			: "You suspect the doll might say something",
	"is_drop_target"		: false,
	"handler"			: function(pc, msg, suppress_activity){

		var quote = utils.shuffle(this.getQuotes()).pop();

		if (this.isOnGround()){
			pc.location.announce_itemstack_bubble_to_all(this, quote, 10 * 1000, true, {offset_y: -110});
		}
		else{
			pc.announce_itemstack_bubble(this, quote, 10 * 1000, true);
		}
		pc.sendActivity("The doll starts to speak: "+'"'+quote+'"');

		return true;
	}
};

function getQuotes(){ // defined by doll_nietzsche
	return [
		"There are no facts, only interpretations.",
		"A casual stroll through the lunatic asylum shows that faith does not prove anything.",
		"All credibility, all good conscience, all evidence of truth comes only from the senses.",
		"Although the most acute judges of the witches and even the witches themselves, were convinced of the guilt of witchery, the guilt nevertheless was non-existent. It is thus with all guilt.",
		"And if you gaze for long into an abyss, the abyss gazes also into you.",
		"At times one remains faithful to a cause only because its opponents do not cease to be insipid.",
		"Blessed are the forgetful: for they get the better even of their blunders.",
		"Egoism is the very essence of a noble soul.",
		"Fear is the mother of morality.",
		"He that humbleth himself wishes to be exalted.",
		"I cannot believe in a Giant who wants to be praised all the time.",
		"I would believe only in a Giant that knows how to Dance.",
		"In heaven, all the interesting people are missing.",
		"It is my ambition to say in ten sentences what others say in a whole book.",
		"The advantage of a bad memory is that one can enjoy the same good things for the first time several times.",
		"Many people are obstinate about the path once it is taken, few people about the destination.",
		"It is not enough to prove something, one has also to seduce or elevate people to it.",
		"You great star, what would your happiness be had you not those for whom you shine?",
		"Not by wrath does one kill, but by laughter.",
		"When power becomes gracious and descends into the visible — such descent I call beauty. And there is nobody from whom I want beauty as much as from you who are powerful: let your kindness be your final self-conquest.",
		"Some are born posthumously.",
		"What does not kill him, makes him stronger.",
		"To become what one is, one must not have the faintest idea what one is.",
		"To forget one's purpose is the commonest form of stupidity.",
		"Blessed are the forgetful: for they get the better even of their blunders.",
	];
}

function canRubeOffer(pc, rube){ // defined by doll
	if (rube.was_summoned && is_chance(0.10)){
		var contents = pc.getAllContents(function(it) {return it.getBaseCost() && it.getBaseCost() >= 1500 && !it.hasTag('no_rube');});
		if (num_keys(contents)){
			return true;
		}
	}

	return false;
}

function parent_getQuotes(){ // defined by doll
	return ['pls override this'];
}

function getDescExtras(pc){
	var out = [];
	return out;
}

var tags = [
	"collectible",
	"doll",
	"toys"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-29,"y":-53,"w":57,"h":53},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAJj0lEQVR42uWYeVCU9xnH+bdtWnMZ\nowLLzS7szR7ssrAnN+zBITeLChjQuCoYAY+NRqIdhRU8qoiSYCSoUUTjbViPYFTUNdpok9jSNJ20\n05l2\/+u\/3z6\/n4apx2Q6HTDp9J155t15Z4f3s9\/neb7P8yMk5P\/xMksiHBUmsd9tkwUKDaLxapvU\nW24RCX50MIsoUmCSRAzla+NQmCKCVR4JszQCZlkEXHohPRO6f1RAkzTCS1BBBsjA9Alh0MTPhk4U\nhlRxOAdNV0QYnzsYS59dGxcwSgQcKlNHCmZKoZOEQxkzE+q42dA+AtUKQ\/3PFa7YFjWtyJAQZAol\nxc9CdWkytnVVoruzDK3Ls1FZooEmMRSK6Nd5xIe+EnyugBUWSR9PnT4O73idGNi3EHt75mPXdjcO\nDS7F8KHlODnchoH3lmK7rw7HDzfhwf1O93NLrU0RxVNYnKtA1+ZygvJg9865+OjDhbg+2oE7t3ox\ndqUTVy9twOc3enDt0034ItCJu7c2yqYcMF8b66OagjzqdSTLBejrrUff7locPriUAwWu7+BwY1d8\nuHp5I65d\/jVuX9+M393pxDcPtnqmHFAnCvWzJoiZ9TKaPVno71uA9wiyNFeFMqMYnrI0tNamo96h\nxd7uBgzseRMH9izBV\/f68ZdvdnmnHFAdO6uPqccAPQ023hjrVxdxa0kmZfWiUJikAh7zCvXYu70B\nzILqHBoc\/7Bl6gHFEdM9iYLpEFEw9XZ0V2JlswNmnRivv\/QCIma8iLjQV5AQPh1vLc7BghoLt500\nsQD25LipBdyxrdX99sp5fVZ9AvRJEdhDnXv5wgZ8cnoNvr4\/hpa3mhAtmIW2ZQvhbavA0MHlkIsE\nCH9tGldcHjVjamtw987G8Qvn1\/NO3bK5Bt2+cgz0N+LE0RbcHD0NYWwEjy9vj6K7o5y614dTw4eg\nlCVgV7d3fMrTu7Wz3PPRgaU4d3IV1V413t9Th0HyQNaxF8704tLZYwhcGcGRwXasW+PAjatd2L2t\nAxVznPjn37+d+g5esaJ+2ro1RejZMR9nPm7D3t11ODiwGFcutoMpe\/rj1ThCae3qqObGffNqN4YP\nbsSFs3sCUwo2v0AvWFxf6N78bnPw0H4f+nqa8JutVRyCTZHrV7bgi9vbyJQ34+a1rdj\/XgN27ajh\nBn308DL09KyeumVhnssgczsNweUNxfCfeR+fXfgQ9wPHcWdsCG+vdmHnNjeOHFiG1uZCvPqrn2PG\ni79AfrYMZ0nh\/t6lqC\/TD00J2IkT2wSnjm3xVToMqMhRY0GZDVcvDuLLz0\/gwW9P4eu7pyh1u9C+\nrgAuuxKzXvkltxe2DyaRrZg00UiVRyAzKRplpsTJncMnhrscFz\/Z7a12Gjx1xSY4zTLUzjFT6jZx\n9f5w7wz+\/MCPb78ewb6972Dmyy9AFTuTw7AlNVn40LTTlVEoTk1AtVXaN2lw\/\/j9uWnXR9\/nRd08\nN2fcU5WJ3DQpyrJU2PRuE6Wul4P99Y+X8bc\/jaLIboVgxjTkamI5HFOQTQ52Z8G27IIUUZCtaJMC\n+O34SePJ4S53YYbG7anKQI0rFQ5SkKV55ZIKHOjvwKVz+zjgpvZlePmFnyFs+q9oxIXBkBjG7w5d\nPLJVMXzcGRLDaYqEg84ovkkBvPf5Qe5XS6oyh9rq7SjNSUaRTcEBq+06nDq6ExfP9uPu2FGC3Qyt\nJBqWZAmoFiCNnDEupwWV7Yq0TY+niML8kojXgqLwV4OU\/slplrHP9nnXLXLJ1r5ZEFzd4MTcgjSk\nJsUiJ1WMORlKNNUX4NaVQ7h0eg8aK7OgSRBAK45Ee1ttcFlNlnfj0hLHf\/PeyjyNzGWW\/LAd3bz2\ngW9g71rj8vm54y21eWiel4M3Si3UkUKe6qIMFTJpDlc50zB2eRAtiys4YJoyFsWZGjhtSfwHUWkE\nqXb9K2rzfWsXun6wg0syVQ6nRRZwWWWwmyXIT5M8uxSYaj2bFgdWveEYp0BLXR5YB5fmJiPfrEBD\nqRWLqSYby6wozaJ0u4ywW9UckIVOQsdNdTyMaiHyTHJkpUrhdqai0p6C9auKcf7U2sDF8ysfg11Q\nYpAxsGzqdCPVbFpSDL+HADB+990Dz8jIgPHL+373huYyn7fRhda6fK7asprsibvdokBBuoorWFtk\n5IrWk+WUZGtQkqVBiix6ApKFWhQOdaIAtmQhnVlEMGuFmFdhwPbuauzvp7NLb\/0E5BvFBj8DZGD\/\nHiFf3TsWCNw4yb+YphJ6CzPJiKtNaKgyTyi1qCKdRx6pV0Tpo2kyAcmUZd9hsOyzw6pAqjIG6oRw\nDpksJoMmOLtJgjzaslkwkPIcFSmqhlUb79fJo3zznbqnAZUxgZDhwx3eT872+kcvHfEPfvAuBvsX\n0bBvx7HDK+iU5kJVgR7VNEFq6eX5jwDnZGlRlqvDnGwtB2XARRlqWDTxKE5\/2OUFFhlsWrKYlASk\nk4ImVSyyyAedFinyTWKk64QcIkUeBSXZUQHBPQmYmhTz8Ax9eWSd7NL59gAb6Oxg8\/Cg04lP\/Rto\nGylHhkGMYkpheooYhQRS9KgJ2DMG6rKpYKQ\/6LLIqSaTUEgqOkxS\/pnBclvK03DVWPF\/X2MsrMnx\nNIEa0UgZeybg2NX9ji9ubw\/eDfTgxmdb+N7GltBro520jXTRCrUEarKOFEWMX5EgCKbrE6kWlRNq\nMmCtNBLZhgQOyCInNRGFj\/ySTR2mjsMs5YCZpOKTdXZiuBWe+RnPBjy4f5F\/5Mwa3LrWQYqtx8lj\nK3F8aAXfju\/c6ManI+uwpjWX16gocqZAFh82pKVmsOkSuYpMVRVNCAZoJ9XYrM4lQGboTMG8NDGH\na2vO54CsBp8E7OosJ3O3PRuwskQja1xgCmxon0OrexmtTflY2ZIDzyLr+IEP3vQN0Rl3xfLMxzZg\nSUyokUD9GkkUWMhpGbBoY6mu4qno4zggA7UbJRyuwqHGhXPrqVZ1eFanmrSx\/nK7uu9J+IkaZFeG\nOVFWVqL21bh1\/pJilc\/2Hwz0xLjZMnFcqJcA\/arEsKCW5q1GEs5BmaKsERhouVNDG\/YqNC3I5IAW\n+hGPQ0a7XfT+pwCV0X2TupopCFgpDPWqEsLGUxSR0NEcZmqm02Yzt1KPpsaHdfZkHZIt8YlB5eBh\nqvGgZ0lJk7T1POuSC2e7FaLQoJq2FwbKrCRFEYXvp8VTfvdjXElRL01TCEONTNXvg2Zt8KlGUUYH\nQ34qFxm19zFAgmM1+JP6J7vTKvVQWr0s9IpIQcj\/8vUvgen4ZpIe\/u8AAAAASUVORK5CYII=",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/doll_nietzsche-1334267297.swf",
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
	"collectible",
	"doll",
	"toys"
];
itemDef.keys_in_location = {
	"p"	: "pickup",
	"u"	: "pull_string"
};
itemDef.keys_in_pack = {
	"r"	: "drop",
	"o"	: "donate_to",
	"g"	: "give",
	"u"	: "pull_string"
};

log.info("doll_nietzsche.js LOADED");

// generated ok 2012-11-30 11:35:11 by ali
