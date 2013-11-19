//#include include/takeable.js

var label = "Red Tiger Eye Necklace";
var version = "1350441119";
var name_single = "Red Tiger Eye Necklace";
var name_plural = "Red Tiger Eye Necklaces";
var article = "a";
var description = "A necklace of 19 rich red beads, given one year during the annual festival of Alphcon to all who attended the festival or bought anything at it. No one knows why the name is given. There have never been Red Tigers in Ur, or, for that matter, Tigers with Red Eyes. So not only were no tigers harmed in the making of this necklace, no tigers existed to be harmed in the first place. Also: what are tigers?";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 0;
var input_for = [];
var parent_classes = ["artifact_necklace_redtigereye", "takeable"];
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

function getDescExtras(pc){
	var out = [];
	return out;
}

var tags = [
	"collectible",
	"artifact",
	"no_rube",
	"no_donate"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-16,"y":-17,"w":29,"h":20},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAE8klEQVR42u1Y3U9TZxz2ejdoYjaV\nak9Le\/rNOdBPKuWUfoCtQKm0ArW0BYrCQilSa0GnBcHFTUfRgTindqjocLq6D3UzWU52YWYWk2ZX\nS5YsvdrFrrr\/4BmdIcsydRQOcjGey5Oc83ve3\/M7z\/u876ZNG9jABtYfc\/7yaMJU5hIKhSXfHNG4\nztYQuYRdxhqJHa51JVYglKwRZW\/HGnE9xGDArsx+3GvG7FA3BlsbsU8vy60rwXftBHOlWYkfH32O\n+6lR+BgdFnqt+P3Xn3AyegC1UgFO0jtcd7wi5tkZW8lr61q\/szKT7qDZyfYK5phVlD8VsCLm3Yum\nSkU+3SrP7lOUImiT4XhbJT4JGTBo16FOJc6\/FoIRRpK5FmnE009TmDlYj4lD2mwDLWA9huczV1iA\nVCpl6hRE8KLfgB8eLOC9kSGELZUgCB6z5gTjBj4uD7jw+PY1hH374ZYSzMs6Pe2l8o8STZiNONGx\nWwnj9s38NSFVr5e70iE6maglqZ56KdtlEqHdakSLVgGLYPtLi97zk9Swk8LdxF7Mh0x4kKiKck7u\ncKOKSbXpcf8dH+b67LgV0aRGaoigR7LDVVe6mXrVu2PVvOhsczm+f\/wVvpgawyGbll01IZIkqbE2\nLXuxRZX57riRH9fvZK92Mvj52VMkB\/vg0SiTy\/1WjH4r6qX5ONfbiJjPDa9GtjqCW7ZsKRl3ynML\nYwF8eyaGD8MmDGh3pbpsYiR8dQhaDHDIiKJk8tG8TL+HRr1SzJYRxOqM+7pjG3PUIMCloyHMT5+F\n32HBqSEdNWITpppUZekaES9ZWESxthR1qdkZ\/3NbWhGxgI1OXepQs+MN8qSb5ue6zCRaaw1wU2SO\na1u601ckyQGrJPqR34gn8+cwE\/Fiqked6dcLo25iK8OFLSzXll6KhIHPTrfq8PXNq0j0dmGPpjzJ\npQv41MJM2CJcli39A1adIjgd0rLjFlHeb5MibNfDU0VjD1ka5IpcocbFoCZ7plmZP2goC\/6XLf3d\ntVoB9YF70UCnhvFZ3IfzfnVu\/+LW5OZt5Wwr+leNYBEeOK7blhy3S3FjagLvxyNoNOlZrg1+VTX8\n5JtUd4MUnaZyeGp0aJYTaS5lLYzOhF3MdjlWUGMp8R6zkHkPRbCdvM1Msd62XFknfZXZnipxdNk1\nFIvb2Fom3lWPjr9KEl1KvGfjIbRUSMBViD3sUDEna3e6QotBtW+PZmWjc8crLLnpV+YmzUIct0hg\nU5Vx8nMcdtLZQqS60VGdvx03pouSda0l5jRSvUjitxlSe9UtoFYi6b1uGb8QqQK7xZg8yEGkKki8\ndKgZcsrRoZPhyiErrvfWYSFMJ1ci6c0hfWq4WcE2qSV5TiLV0qEmoCeiKasQD8+P4cnDDIY9Zrxq\nNL7sUTFrlpJf6Fm6UiqsLcO1WANGw\/sRNKvhVomY0YaKR5fbqUxC+HzAW01y13TAiLuDTtzo1rAT\nNiLVZxZjKsxRSn4V7OSutK9ChAOL8vjMksxorQRzIx24dSqG2XD1X+fYE9WC\/OVhP\/74LYd4ZxvG\nD6jSEQeZ4UzSYtJ00iTE\/IkuzE2ehq\/ejNNDxmSsRYkLAR1Gu1vRYzOgqtg8xxUKnuVSCvJRhxr9\n1kqE1KJfCs876Z2udjWRs1cosnqZKLOudy11ZCl1hOYlfWpZVP3Gpu0b93Yb+D\/gT7edjUgbsALO\nAAAAAElFTkSuQmCC",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-10\/artifact_necklace_redtigereye-1350441118.swf",
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
	"artifact",
	"no_rube",
	"no_donate"
];
itemDef.keys_in_location = {
	"p"	: "pickup"
};
itemDef.keys_in_pack = {
	"r"	: "drop",
	"g"	: "give"
};

log.info("artifact_necklace_redtigereye.js LOADED");

// generated ok 2012-10-16 19:31:59
