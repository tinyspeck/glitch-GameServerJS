//#include include/takeable.js

var label = "Ayn Rand Doll";
var version = "1354304030";
var name_single = "Ayn Rand Doll";
var name_plural = "Ayn Rand Dolls";
var article = "an";
var description = "Contradictions do not exist: but this doll does. Every time you cuddle your doll, you feel like it was the doll's idea, and you had no choice but to submit. Weird.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 1009;
var input_for = [];
var parent_classes = ["doll_ayn_rand", "doll", "takeable"];
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

verbs.share = { // defined by doll_ayn_rand
	"name"				: "share",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 53,
	"tooltip"			: "Share your loot with others",
	"is_drop_target"		: false,
	"effects"			: function(pc){

		var failed = 0;
		var orig_count = this.count;
		var self_msgs = [];
		var self_effects = [];
		var they_effects = [];
		var sub_effects = [];

		failed = 1;
		self_msgs.push("The Ayn Rand doll does not believe in sharing.");

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
		self_msgs.push("The Ayn Rand doll does not believe in sharing.");

		var pre_msg = this.buildVerbMessage(msg.count, 'share', 'shared', failed, self_msgs, self_effects, they_effects);
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

function getQuotes(){ // defined by doll_ayn_rand
	return [
		"Achieving life is not the equivalent of avoiding death.",
		"Ask yourself whether the dream of heaven and greatness should be waiting for us in our graves - or whether it should be ours here and now and on this earth.",
		"Civilization is the progress toward a society of privacy. The savage's whole existence is public, ruled by the laws of his tribe. Civilization is the process of setting man free from men.",
		"Contradictions do not exist. Whenever you think you are facing a contradiction, check your premises. You will find that one of them is wrong.",
		"A building has integrity just like a man. And just as seldom.",
		"A creative man is motivated by the desire to achieve, not by the desire to beat others.",
		"A desire presupposes the possibility of action to achieve it; action presupposes a goal which is worth achieving.",
		"Achievement of your happiness is the only moral purpose of your life, and that happiness, not pain or mindless self-indulgence, is the proof of your moral integrity, since it is the proof and the result of your loyalty to the achievement of your values. ",
		"Do not ever say that the desire to \"do good\" by force is a good motive. Neither power-lust nor stupidity are good motives.",
		"Every aspect of Western culture needs a new code of ethics - a rational ethics - as a precondition of rebirth.",
		"Every man builds his world in his own image. He has the power to choose, but no power to escape the necessity of choice.",
		"Evil requires the sanction of the victim.",
		"Force and mind are opposites; morality ends where a gun begins.",
		"From the smallest necessity to the highest religious abstraction, from the wheel to the skyscraper, everything we are and everything we have comes from one attribute of man - the function of his reasoning mind.",
		"God... a being whose only definition is that he is beyond man's power to conceive.",
		"Government \"help\" to business is just as disastrous as government persecution... the only way a government can be of service to national prosperity is by keeping its hands off.",
		"Happiness is that state of consciousness which proceeds from the achievement of one's values.",
		"I don't build in order to have clients. I have clients in order to build.",
		"I swear, by my life and my love of it, that I will never live for the sake of another man, nor ask another man to live for mine.",
		"If any civilization is to survive, it is the morality of altruism that men have to reject.",
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
		'position': {"x":-26,"y":-54,"w":51,"h":53},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAJlklEQVR42t2Y+VeTZxbH+x94nDmz\n1A2ICsqSACFhDUlYZQlhR9awCMquUKriEndtRamKiiigSBVXtIp16tRYW4eRtsYNq44ScbcdSU+n\nc\/qb37n30SCobfUc8IfJOfe8Sd43eT\/v9y7Pvc877\/y\/v8I8JcZgd3uTxs3eFOLhYAolm+I13hSh\nmGCK9n5uUcrxhrcKJhk5coTScVS7wnE0lE6joXK1g0ZqLyzY3UFYqIcEBIpo74nQ+zoiI8jVEu83\nyfiWlHMwyye+C88J74Ih2Xwnj0WAy7h+UJsFyexBqkL3DDTcU2IOkUtGDBucTjFBrfOZiDC5BF4T\nR8Fd8lcBp3az6wcKl49HBEElBkxCvP8kceTfsJqRpGqop6R22AD1PhNNaVoXcTOKQVJvFFjNgaqx\ne1k1tjg\/J6RqXPqNf8PXqNzGqIccTuthr6ZYQpJqsrgxxxq71c3+z4NikMH4AVg5vnYgIH9PCQU\/\n57HtQw4YqRjfHEtgDBn7DJBdyq5mJfnGrJ7tGOPjKCAHAsb6OtF5CT+YdUjhOLAprqwc6CmBzsL4\nPQNyFnMMluZHoLoyAUWGYKRMkUNHMPwgHHfsWpvxg7HaQ6ue13g9JwYHeyyBsasMIdL+mxVmhqBt\nx2wc2bcAxw4uwsdNM3Hg42o0bSjG1o9moG5VNrbXlWDjh7lorivE\/NKYoQUkCKPITlKDFbEFP8db\nFLlyM0GcPLYSPZcbybbg7vVm\/PeHQ3h8pw33\/rUd92\/sINtO75vxsKcFaxalDy2gn\/MYo1b2vBAz\nKJcQToL0aCXad8\/F348uEXD\/vr0bNy5uRt\/dPfjlxw5c6KwR1nu1AbevbUXP9W1o2VxsHlJAL8dR\nRv9nhTiQ4o1hbUlQkKbF0f0LcP4fH+F+z04ByUdW7861Jjy0tBJcIx70bIflSr2A3FlfNLRZLLX\/\nk0E+YRSXB3jT8sZJwQHP7s6fqsHBXbNx+2qzUO6auQ73yKUPCZLf\/\/x9O\/7z6CD67u0WkFfN67C0\nKqF8yMuM05g\/mKUOf4FGMVGswawkuzslUkGA1bDe24vurzcgOUyK3FgFLp1dhwc3Wwi8Eb3fbRPK\nffHpEnR+vhxKx9GyYWkSnMb80aRwtTOFq1zFWhzoTnXPZxLmzowjkCb8rX0hQqRjkUznTx9bKlz8\niFzM8di6pQRh7naYV6qDXDJy+NZjfs2eFW+Oi5AjSivD3FkJaN8zD12n1+LH+\/uwaaUBLeuLRCze\nvFSPB7278fjBfmytyUFmuCf8XcZSqIw2D4uK\/YCzk0ZUV8ZZ5r2fhJpVeZTBy9B1pk4kBmfxD727\ncPXcJty60owvP1tOsbgRP\/cdQsfeOaZhVW9Wkq96VoJ3eVGMorksyc86t4oAl+dhb0sljh9aLFzK\ncJbuBqEmxx7XQ66Dt67UW9N03vphgyuMURqKKPjLErwxI8YLBIukWF\/kZAWhub5UlJobl7eJxGjZ\nUIT5xdHY31SBzhOrcP9mi7nvfqvdsMZdod7LUhKrREncU6tOV6FoagCqqxIwtyoZzZtK8E9TDX55\n\/AkuUE2sXZSKhpoCK7nXePPmluFNipwp7oYKUqwqxR9FeoUAnJ0agKqp\/tixsRhfdSxDRZrKumZV\nbvvxgwtM575a+8nt7q36vr69wwvGr9MnG9RlqWrrvIxAzElVoZAAi8nVlcl+WJoXgpr34tF1ai0D\nm9765Ha354isffdyy7QoTxgNGpTG+WA6xV9pvBIzE31RnalBVjiVmqJolCf4vH3Aa90H2osT\/Ws5\nIRiwLN4HeZEepOBTwJI4b6HkzEQfVCT74q0Dfnu2tTZV62rieGPAYr0SGdQH5kfLCdablPQWauZG\neIjYTNW6qd8q4NWLB2oZaH5m4FMXx3ojK0wmyowtWVg9tgKCTqVxIHuK+xvPvwWUhPlT3E154e7t\nmaGv+ZDnvm7TnzvTapcVSjFGJWVhlkZA5ZKLWTmGYveycYYX07lMujaZ5w8a1LPD3fnhjDkRHmrT\nidW1h9vmmhpX5ze3bZ01qFjnhMpM3KEPtEgPh9+umb03jhq+6WwVWxZ0I1FOBGCMAtN1XiKT+Zge\n4gY9Na5x1LgyeH60J3Ii3JGkcRYmYLWuyIqU02fXfoCWzWViNk4LmmzHcwt\/x52RmucbMq2Lg+x3\nXSvW3CT5iNI4pZVj8L0UP8wgqBS6Ed84hv44mWZkBivQycnFnrCtNJz1qcGuyAh2E40t943B1OTa\nAGZmh4mGNUk1SW2bsW3nyJ5PfAAMT548MT161Gv8rttk7L3ZYey+uE\/fcXid\/viR9bKyeKWR4RYZ\ntFiZH4r8KDlCeTahP80MlQrFphNccZyC4lIu1EsjVUWMEmwuxWuUcsLAm9tMAFJHbhTqDYAPdBnX\n3A948ds2k\/nsrkG7T5fP76k1d+0y16+pkLF61RkqLM7WYklOkFAsjAalFHIbwzCgzfKiPIRyrCAX\n8qmUMDxD82D1EqDUzhKmkJh5N4wBg6TPAVXOY5\/HaPu+NbXfdB2xdJ45ZD5z+qCpq7PD\/MXJJuvJ\n4\/UyijPTnLQALMhSY2luEBYRZKLaGTqe6ILcKP6knLH9gAU6T6EkrdlIJ3X5Oh6q2L0vAmqpK\/\/Q\nmIFyajReBHytdqwqR6suyw5GJVk5ZeuKaSHgpU5PQxIrGEtHBmSbFuUxWEmKSY5LnZ+jAGSAlwC9\nndDT3YQV7yeK8xq3Z+dc7Cy\/v3pcWi+7fa3RfOvKNpw9tRqVZbFYXB5j5tIS5iUxqqR2iKQ\/ZTcz\nYAapxcsdQzHcU2WpVmYGIYEUHwTwzML9nanJXY7SdM2LD\/Dr014ftUQ3Lm5q52bTNnBzA3qxqw5t\njRWy3AhPkdkBLqNlKpmdaQoFfxJlc1qwW7+abAyeScDnzqxDRXbISy5UP9sqSaDfJdP1AwF\/c9fr\np4cHTGJH4KdPxch4\/fxG0XzeuNRgPXF4ob5uWd6g4ukvHWcgd1s41rgOMhiXH\/6cRrF553oryjI0\nrwQMljlYMsJcZNFKBxlvE\/M28qDkePF14Wyd4RIpxa3599Sy85GnMZ7Ujuyfh2MHjWLf5cTe2YMC\nmANa425fHiKXWMIpGRiOleWM\/mBhOjWtGa9WkOyN1sKOA\/ONJ44sw+fUeH554gOcOr4Cnx1egJ2N\n5SgrCteXFoaqS6aH\/Wp1Z9AA6ThjAJUPAhbZTfGKaFplXgn4OskwODHqZetq8qw7GspoCJ9DA9Ai\n7G+tQlWFDgUFIW\/UFbPr9f5O5iwa4BMCJyGc6l2QzN46sBC\/Tin5H4LBm\/daQuOwAAAAAElFTkSu\nQmCC",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/doll_ayn_rand-1334267255.swf",
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
	"g"	: "give",
	"u"	: "pull_string",
	"h"	: "share"
};

log.info("doll_ayn_rand.js LOADED");

// generated ok 2012-11-30 11:33:50 by ali
