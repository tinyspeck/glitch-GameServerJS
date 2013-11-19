//#include include/npc_conversation.js

var label = "Firefly Whistle";
var version = "1334341175";
var name_single = "Firefly Whistle";
var name_plural = "Firefly Whistles";
var article = "a";
var description = "A Firefly Whistle, perfect for whistling at fireflies. I wonder if that's how it got its name.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 0;
var input_for = [];
var parent_classes = ["firefly_whistle"];
var has_instance_props = false;

var classProps = {
};

var instancePropsDef = {};

var verbs = {};

verbs.take = { // defined by firefly_whistle
	"name"				: "take",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 50,
	"tooltip"			: "Take the whistle",
	"is_drop_target"		: false,
	"handler"			: function(pc, msg, suppress_activity){

		// Taking the whistle destroys it and plays the following sequence:

		// A VOG overlay: "Glakkk-k-k-krhkphrmg!" which stays up for 1500ms
		// Simultaneously, Ava does hit state 1, walks 5px left, then hit state 2, then 5px right, then hit state 1, then surprise animation, during which it issues a talk bubble "Gah. I've swallowed it!"
		// 2 seconds after talk bubble appears. A broken, wheezy, whistle sound plays (2 secs). At the end, the bubble disappears.
		// After 2 more seconds pause, the achievement is granted "You have the Firefly Whistling ability!"
		// 2 secs after you dismiss the new achievement overlay, the familiar completes the quest, but reminds you that he can't bring you back.

		this.apiDelete();

		pc.announce_vp_overlay({
			duration: 1500,
			locking: true,
			width: 500,
			x: '50%',
			top_y: '15%',
			click_to_advance: false,
			text: [
				'<p align="center"><span class="nuxp_vog">Glakkk-k-k-krhkphrmg!</span></p>'
			],
		});

		pc.announce_sound('WHISTLE_SWALLOWED');
		pc.playHitAnimation('hit1');
		pc.events_add({callback: 'fireflyWhistleSwallowed', step: 1}, 0.25);
		pc.location.whistle_taken = true;

		return true;
	}
};

function onCreate(){ // defined by firefly_whistle
	this.not_selectable = true;
}

function getDescExtras(pc){
	var out = [];
	return out;
}

var tags = [
	"whistle",
	"no_rube",
	"no_trade",
	"no_auction"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-23,"y":-29,"w":46,"h":73},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAACu0lEQVR42u2WbU9SYRjH3foAfoJm\nr1pPm+uFtbSm01z4BPgwiNQDPiDkE1aaqThaR9RMpFUazpRYJAYcSHHiI6ROMDWhTHKVo9bmWmuj\n9QX+Hc6rvkAH1s613btf3G9+u67\/\/3\/dCQkxrMzM1KSEeKnt157kt4FV1fTkuNQwqPNqOlsgFgkj\ncQE3M2VND733Y8M3D6tlFDKpBHw+DxkZadLYdm1tKcm\/OqdZ8bjCY08ewjYxhiaVAvwCHvLysvUx\nGeOGz5O+ub4gCG69cn7YXceMawJasgN1VytRIydoQCWIMlGAVTDPLJUc2vGFv+wHsbbsxtyMHbNu\nG\/Q6LVqa6yEWC1GQfwny6nLcH9BCq1WrWAWcd1PGZY8L3sVJZowjBj0a6+Xg8bKYU1yUj47264FJ\nh1nqsJkErIFtbS0kht759AffdhHcXkFToxLTUxbU0uMsFOYiOzsD9XXVGBzsM7KuN5Jsk3aRbXhu\nNsBhNeHRg7u42dwAVaMCun6SASwp5kfsdpOUVVfuhTZU3w\/2nBUyCY4kHUbquRR0ke2MCcpKS2id\nEXDYTairrUJDgzydNbhN\/5Jm\/+Mb\/P71FTvBVRjp2DiTchqnTh6DooaIhi4kkiIoFTJEI0XXfyfC\nms72dtedP398QvhzAK6X4xgeGkB0ExQK81BUmIuqylJadxWwjI8E6HfnC8uonjWduaetkU3\/Iugb\nZpMBfT0a2gwKlF4phkgkgFJZgW6tGhRl0rBuBKJcxIi9p1vNmKD91jV6TV2mxylATs5FJtfM5uEA\nRT1LjsmqEpXwwyeOH8X5tLO06CshFOYwuUYQYjwe0kVi0rW\/q7e3NVGplHmzMi8wJoh2817fbVC2\np0aKMsfPV4kkW1Wd6hveCctIfIEBOPSvDwfIAXKAHCAHyAFygBwgB8gBcoAcIAf4PwP+AVXfSSHo\nRn7YAAAAAElFTkSuQmCC",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2011-02\/1296773708-1301.swf",
	admin_props	: false,
	obey_physics	: false,
	in_background	: true,
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
	"whistle",
	"no_rube",
	"no_trade",
	"no_auction"
];
itemDef.keys_in_location = {
	"t"	: "take"
};
itemDef.keys_in_pack = {};

log.info("firefly_whistle.js LOADED");

// generated ok 2012-04-13 11:19:35 by martlume
