//#include include/takeable.js

var label = "Collectors' Edition 2010 Glitchmas Yeti";
var version = "1345152476";
var name_single = "Collectors' Edition 2010 Glitchmas Yeti";
var name_plural = "Collectors' Edition 2010 Glitchmas Yeti";
var article = "a";
var description = "A rare collector's edition stuffed Yeti for the wonderous, goodly, splendid Glitchen who helped test the world in 2010.\r\n\r\nThis item is <b>Limited Edition<\/b>: if you sell it, give it away, donate it or otherwise lose it, you will not be able to get it back.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 1000;
var input_for = [];
var parent_classes = ["collectors_edition_2010_glitchmas_yeti", "doll", "takeable"];
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

verbs.pull_string = { // defined by doll
	"name"				: "pull string",
	"ok_states"			: ["in_location","in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 53,
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

function getQuotes(){ // defined by collectors_edition_2010_glitchmas_yeti
	return [
		"Humbaba bless us, every one.",
		"This is the best Glitchmas ever!!",
		"I know who's been naughty and who's been nice. There may be a splanking in your future.",
		"GNE was better",
		"I really hope this game gets better in beta. Or at least after it launches.",
		"*fwaaap* Oh, wait. That was string, not finger.",
		"Yeti so much more huggable than Glitchmas pudding.",
		"Furry pants getting tight. New Year resolution: Lay off snocones.",
		"Is hot in here? Or just me? Maybe need strategic waxing.",
		"Getting pretty sick of people confusing me with stuffed bunny. SEE TEETH.",
		"Have yourself a very merry Glitchmas",
		"To Ilmenskie ... and beyond!",
		"My friend got hooked on Glitch, and all I got was this lousy ragdoll!",
		"One day, I'll be a real yeti! Maybe one night. As you sleep. Mwa ha ha.",
		"Happy Glitchmas, and a merry tinned beer",
		"Little yeti wuvs you",
		"Glitch your Glitch a Glitchy Glitchy Glitchmas. ™ Glitch®",
		"REQUIRES BATTERIES",
		"Oooh. It's great to be out of my box. Happy Holidays!",
		"I'm everyone's favorite abominabality this holiday season!",
		"Abominable? Never! I'm adorable!",
		"Nonexistent? No. But the yeti comes but once a year."
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
	"xmas",
	"collectible",
	"no_rube"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-33,"y":-59,"w":67,"h":60},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAIVUlEQVR42u2YaW9TVxrH+Qb5AlVT\nWtqkpdRJEWpVUVxVfW9ppFZ0kfJiNG9GM5NKs7yj0agzA2FGBGihBVrMQLMBWcliO8Q3iR3HcRYn\n3uL9esv17usskECp\/nOeA9d1KBnQ1MC86JUeObbvPed3\/s8a79jxy\/WEL7z3XlXx7be1mTffhLRv\nH4J1dYK+traJWYOhtlb99OH277fH9+5FpL4esddfR\/qNNxBlJu\/fz21NrcbqgQO48c47PRvvvlv9\nxOAKe\/dWMcXsUQamwCmg21pdnUzPPRE4tpl9OxCvSoXp3buxuGcPPK+9dj+k9rHCJerrVdvBzbz6\nKnpfegmXXngButpabg+6L1pX1\/BY4GJ1dRpyU\/lm4bfewuKnn8L4zTc4+fLLaKmuxpmdOzFYU8MB\nnfcreM+k+vrKxqOupkYz8cormGUqkQ3X1Nhbn3++0Xj+otpkNsNqtWKiqwsdH3\/MIb987jm07drF\nQVk2g54l1yuAtt277QAqF49MDaHrxRfRvmuX0LFzp4o+CxUKVZ5Awm6ZcSMYEiFJErflpSXMnD2L\nzvffx9UPPsDAwYPQf\/ghJhm89ZNPuC2cO4fbt2\/LFQNkqgjHnn22sfyz1dXVnriUQSCSxJwjBIc7\niHg8gXw+T5s\/1G5uboqVBXzmmVLh3dzc1K6srIAslclDjKcw7wrDMuOFze6H0yPCF4whGpMQX05B\nSmZLFmH3LrrZ96EE2CEbKgao\/H3nzh3NrVu3sLa2BgWyUJCRyzNLJyBFPAj6nIgnliGlcghFJCwF\n43D74\/AyqOhyhn+ezRVQLBaFisRiOSCDUzEFUQ6ZyebhW3Ih4xnAijh21yIm\/j4rzmLZMwrJZ+aW\n9glIhaaRDVsJsKciCgqHD2tNJlPj7OxsFSVHvlDExsYGB0wwt80tepF29WE9OoEbYV3JVgODyDi7\nSq95T0\/pu\/WIgNVcDD8bjlxKQe33+zE9Pd1AgMydsuJectfi1BByPgNy7h6cPnQQx\/6s2QJabso9\nfutVAqyMgswVciwWg8ViUQeiySZyqQJIsRec7UdmaRjjnZ\/jd7\/ag0O\/PrAtYMD0Lf700T5kgmby\nQGUmngJTLZ1O8\/oXiEgt5YCUINGgE6tBHVaiU3CMnEJ8to3DyP4hpL0jPB7Xki6sSQsohM1YDkwj\nn5XEx9Ly\/BFJjCTSXDkFkiwWFRHyTCPiX0Qs5EEq7odrfBCmM\/+EseVv0DUf4pZPJZFM5yDLclPF\n4QKxlIYpKAejSa5cOaAsF7kp74NeH\/R\/+Q1Mh34L2+E\/YvKvv4fw2R8QZ9leKFSovNx\/GU1O1dSc\njxdnBUSMJraAKkZhEPH54FtYhGduAb75eVYbUwiJy488ckGeV2Xd\/T0uQdsi2toeHq8js6GqRXd4\nS\/wZxqa3KKeoSdkdZUBufwxzzpA4P7+A+dkZpKMeIZuXqRM91MU\/ZKaFon8A7vELcAnn\/3tJigf6\n1V7HFc2CKyTm77mXlNS2XuPdoRyQ4jMvr2B1bR0r6SCKQSOKvkEUA3rkWZnJegZREK0opOMQE+lt\n292t+JiYdffBNvQVJvu\/FLaPPXdPk9FwlkvsDcRK6tkWvOjsGeUDQ7nbb968eXcgYK8xey9ok6Kn\n6yeWtrcj6rfDthhsNFoc6uVUTsP6s4aVNS21wRthPUhB15iWVBR3yHJK43SamkZHWpvM5u6Gy5eP\nVI2MnKky6E413ptgGhQIysS2q3oMjlg5IBl1FYKiVkidht2PoFmLvG\/4gYBkGabm1MQoKLapP5fC\nJ5vERnSUl6uZ4a+haz2i3WEydanKs4sAB\/tOaBQ4KtjKAlRqmo9fwNDoDHzhZQ5InxEU2fr6Or8v\n5J5CauEKmLv4hmlHN9b811Bc6kbBdQVhixYu2wi6ByYQiqV47NIYJ8UCUBTkgB1HVHczB1ArpoCy\nzVTlcJShBPTZ309zQDo9vaexizYoJU2xgA1pBiFrK6Jz3VyNiK0DBb8eayHWVZi6HuEsJgYvoHdo\nkk09Cb6OyxdDTrTdvX+mE8LVYw9OkA3JU10OpvReOqnbH+WAhnE7hEknH6fKXV1gkLeLEXyfnER8\n\/grGu49j2X4VPvNFHpO+yUuw9J\/kgBZDOz+o2eaBYymCmYUA0v5x5Dx98Ez8m9y7NUFuhHTa9ZBO\nVCaSQi5ZAqSMJbgvvv6OAZ6yX+zUcUBafIENogpkKivjliyyTfrhZCXi+uV\/cSUMHUdhHTzNgSd7\nj8M6cBI9bWehrKPYSlAPaaGLHegSdG3NPw4VG3GjmmJlMy6UGvxKiMVOIlSC+\/zoOZz\/6hhis52i\nru9yozDpsAtmhzxmcfHTk5rBaArrchKyl5Wh2U4eRwTINsPUwCk4zVcwyqCHW4\/IIyzWD\/3jtFqw\nOGktrdHsEAL2UYgsHOg5fXvzjzVzIzxafUPU228vb53t0q5rCAe9uNA+gHOnWuAwfstdF57uUCld\nhp28SQElNdNShD979752BCytMPWe5K5O+8Zg0rXLpeC\/77JNGNQExtzbSAfY8iUbJlu+l8wgSJpI\nkoss80IGrEhOfHHiBAxtR9WKPajbkALkpoDXwwFTLHMJkIwORsr4ZgYQTqRV\/1PPZQHcRMWRFhO6\nWuSCn7mZjVMZdz\/6LzULj9KzSUkFkOJYASSjtc3GgZ83TZP0pBDJG7B8Jyun17c1P9J\/YhRPrqVQ\nKUQo4GkNKht+lsGG\/nahYlMMQSou\/Uk8bHONTnqqJ6xumbKxHDDt7OHl47pBL+x42pdx0qGhbKRM\nprgjQALNunsxel3oeeqAlDBjI0MtVPco7uwj53jZMPWdlEnh\/5ufiqlcDLc226kGsrIhMtP88gP6\n07j+A5b9zM7k3gRbAAAAAElFTkSuQmCC",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/collectors_edition_2010_glitchmas_yeti-1334267056.swf",
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
	"xmas",
	"collectible",
	"no_rube"
];
itemDef.keys_in_location = {
	"p"	: "pickup",
	"u"	: "pull_string"
};
itemDef.keys_in_pack = {
	"r"	: "drop",
	"g"	: "give",
	"u"	: "pull_string"
};

log.info("collectors_edition_2010_glitchmas_yeti.js LOADED");

// generated ok 2012-08-16 14:27:56 by mygrant
