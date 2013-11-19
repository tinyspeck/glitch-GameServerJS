//#include include/takeable.js

var label = "Piece of Torn Manuscript";
var version = "1350087222";
var name_single = "Piece of Torn Manuscript";
var name_plural = "Pieces of Torn Manuscript";
var article = "a";
var description = "One of four pieces of paper and frame that, when stitched together, create a string of words which probably shouldn't be read.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 5;
var base_cost = 0;
var input_for = [];
var parent_classes = ["artifact_torn_manuscript_piece2", "takeable"];
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
	out.push([2, "Collecting all the unique pieces gets you the <a href=\"\/items\/1308\/\" glitch=\"item|artifact_torn_manuscript\">Torn Manuscript<\/a> artifact."]);
	return out;
}

var tags = [
	"artifactpiece",
	"collectible",
	"no_rube",
	"no_donate"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-26,"y":-22,"w":52,"h":23},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAADYUlEQVR42u2V204TYRSFfQMewShI\nVTR4PgBSLZ1CKbQzbaelxyk9zLQzlNaCElEYaEEkaKoQjzHhwsQLb3wAL\/oIPEIfoY+w3P9gjYaD\n5aA3zkpW\/jTTpl\/WXrP\/EydMmTJlypQpU8ehJc12cu1RP16XB\/C2MrD55ilnPfY\/keNDUjo6pDOn\nIoO1xJjdsBQcqMXEe7Wo\/27TiAVsSCXdyE6GoJViUOiUsx5oqT4sTfVhY8GG98v2+sdnXOHbF7Ht\n4DCyvU1NuvVsYkRXEq6qIg3X5fgwMjEnCBAEiPEQBwIEASJOQARpmAFGfFbDYW8\/4mEO6YxggDKn\nFR5qZgDzk714OWfDu2U7Pqxwm5\/Xna2lOpEUutWkp06AyI2PgiChSC4cFpA5JNxBiE6JfqtoAQM0\nR6lmUg6UMrexOtOPN2U7Pq4O1j+9cu6fqpbi61rKg+MEjNF3kyn3T7hfnStGoGWH8UjrwcaiDes0\n\/qXpXsT9XdWd6WX4wkSax1EBpbDD6KCsijuAmp5\/MobVRQFvV5xYm+3HTPYGxsUL4B0d4LmOGs+d\nLvwOpwjd+TTfOAxggj6n6Lty1g+VJbIL0PRMBEu6Hy8WR43eVaZ6UUxeQUw4z6AaPNe+KdjbPaL9\ndNsuL4XYNpkRtvJU5lYA0+yk50pO3BOIeWF+DCs6b6T0fNaKufwtqNFuBFwWiMOdW5RUVXCc6v7j\nizEpe3Uy9gSkU6FnWRqZWgjvCdRMqVpxU+EdKJd6MC1fQ5JGFxyxwOfs\/Co42iWv7dTJllfKDKVX\nkL2NHYCKF6oagPpjl+3XpbWK10hpXb+HWe0m8tJlhN1nEXKfrfudZ6psdIdewMWsXy8oPuRzfmgT\nQWj7JNRMqTzn+5nSQrEHU5ntlLahLFviiKXQ0uha2nvFSGM\/oGZKrEuvl7dTYm+cGrvEEkKUP98g\nsE3fUKe0a8GPotz9mHU3oOJ0yOjSq2WPkdLTB30opa8iPXaRlRtBl6XuZaPjOqx\/9RJXS1G9CfXk\ncdBIaaMyRFfQXZTv9xhdknxdiHjOIThq+coPnikcqOBH1cJjvsa6RHchXTd3aHTXkaM1wIBYwQOu\nzr1307\/QQ+V6gy3LhL\/L6JOxmxwd+rEV\/Kii7d3gHe0H302mTJkyZcqUqf9C3wFsc\/NpgJVLgAAA\nAABJRU5ErkJggg==",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-09\/artifact_torn_manuscript_piece2-1348253795.swf",
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
	"artifactpiece",
	"collectible",
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

log.info("artifact_torn_manuscript_piece2.js LOADED");

// generated ok 2012-10-12 17:13:42 by martlume
