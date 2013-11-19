//#include include/takeable.js

var label = "Cornucopia of Crops";
var version = "1337965215";
var name_single = "Cornucopia of Crops";
var name_plural = "Cornucopias of Crops";
var article = "a";
var description = "A cornucopicone containing the ripe essence of every Crop imaginable, it smells like wet earth and evangelical vegophila. Too packed with fibre to actually eat, this can be transformed (by someone with appropriate Piety and enough influence with Mab) into a Blessed Cornucopia of Crops.";
var is_hidden = false;
var has_info = true;
var has_infopage = false;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 0;
var input_for = [];
var parent_classes = ["cornucopia_crops", "takeable"];
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
	"no_rube",
	"no_trade",
	"no_auction"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-47,"y":-81,"w":95,"h":82},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAKEklEQVR42u1YeVCU5x32r8ZwX4tc\nCgJKIBAwgEFFOUQQBHYRlmNFFuTGRY5ld0GQBcp9uyzHLseCHAIKG0xMTIxubWKOySQkNnXacVo0\nUZM0Y7ZN05l2ptOn7\/tuIGltZ0jbJM4078wz3\/vt7O73fM\/v93t+v+\/bsOHH9f+6GsvCuJq2RK2m\n7fDKfJ8AupnCnkeGXF3xXs1UFx9ne1Mw1noYSvmhlbeXKrg\/OLF5Fd+8sTRU11kZBYremmhcmxPJ\nHxnlBurjl8fbE\/H8SBa0QxnoPhlV8siQ65RGCtskEVCcikF\/XSxeHM\/VP1JFUZkTpBts4EKrEmJh\n4ChGWxN8HymCLRXhy0vDWbg4lk3CK8SMgh\/yKKknVzdxMdqSAGopz49mY3Eo6z+q2gWlwHlxIC1k\nFfT8v\/M7cbhznWifnhQIprqScWkiFy8QFS8MZ+pnFSnrCjNNh+EWnua8Mg1Lqgw8NyxkeGWqAK8v\nluLlM3na1e+OXPR0HnvBJyQib4P5ughmJfiElAkDUZG9CxMdfEIwDy9octAnj8NIcwL5LElHKlsz\n3Z3EHWtPCJlSHnae6EwUDtTHLteKQjDRmYyZnmS0VkSAmDoG26PR27Yf093JWCS5fEFNcrpfAFUT\nT6uce0rYMeOuTyozRVT+Y9p1EYwPd5cLE3ww2Z2KV6YLsaTOxPWFUpwnf75IcvGcMp1VteLUIZzp\n5GOqmw9F\/z7U93nh2cmjTClKUJq3E0Xl28ETG4FfbYKsSgfkZXqjrMYd0vxAtIj3o683ZEU172qe\nUW3NDc\/8iX6dCj4prCnchzlFGrs4DTHtILSSp8mFzxCFniWVTX1xYSAdk8pE1C05oXrJFuLxTZjs\n40Iu2YP4PHMkSI2RVGUAJXm8zkFfVOsA0YHNkGUGspscqIvr6V50D+GeMMa6CJYc9dfQUFKoG3lM\npWFSMFSVKaIq6SQsJxcHjxKimZgaSUTpuDXyFBbIaDFDaccWCFvNkNFshsRKYxws2MgIlhSZ4XyA\nFVqSbSERO0K81xLygmB2naHxXTrBSfP1KXhcsGOlqSzMcHekUHpOHgTtw321hxgpkoOss1D7uXTx\nKORTWyE7x0FqrQmSZMaomrPD0PvboXzHDY0v20EyaA11qjUuh3KgDbTGiI856gQcHPM2gZC3lTgF\nDx3TXuvPwcMHtkGaHcTItUkOYLAhHqQfg7Y81U+5LNSzp9NwYS4dTVftIZ3nMLXS6kwhUlmiVWeP\n9p87oOeNLRi9+SS6rm\/GOZkdLu\/mYN7fCipvczQ+YfK3PH9TJPhZoaLVDTWaLeAVWayvxydFeegK\nUv1QfyKEVSIl2U1UJKMWmWJimS\/SUM+NJ5PC8IZk0g5JJJQ5XeaomLJh5C7\/Lh9vfFkF1fJT0PzK\nm5Gci7LBuK8FTnuaos7VCHlOG1F00Brt484obHPAe9fiV25dD5AvLzkK371o\/++9MjZsq2\/aIU99\naUYAIyQ+ZlCzQxbJiKqbeNDNijB2LhzSORvk91sg7oQRitVWqF60ZQSfu3uE4fSb23D2tj8LuUJm\nQ8iZocndGNItj0PgsBGCeAvktFrj\/MVk\/PVLDR6s7MWfP2\/G\/Q+4+OSmYOWzWxE9+t8Gr3nv5\/ez\nDcQzeT6amsI96K2OXiN4qiiYqUnHrqszRSidsMaJUSsIGkxxuML4Hwh2vOqI02+5oO\/trRhYdmcK\ntqlt0eBqDBkhl+PwGGKdjZApI7\/pssPnd6Lxxf0sQjCE7R\/c3o8\/fpLPjr+\/y8eDO1n6v\/zpkvaL\nj6VCA0Hig3LRXjSUhDKCtGCk2c+ghxCuL96Hlyfzia\/Zo6TJDek1VuCWGRRsuGTHCK5i9P1nWLGM\nfOCJXvVWiL0swN\/8OGI9iIrVmyAUb8L7rwXj9nsxuHczFR\/eCMYfPorCvRt78MW9WNx51w8\/W3DA\nKbXtyvKNuB7gpkHBtBjP5WOJT0GUHgAaapqL5cS3aMgp8ZmeFHa8OJaLybEERBc8joI+izUFKahq\nVEVKjp4PjQZiXhmN6d5IjLSE4UxXBDunmFVEre2vzuzESwtOePG8I85M26NYyYFC6\/FwhR8KdRMK\ned4QHXkalXm72JHmICVGQ16ZG4SFQSGmlUmMoJB44IkRK2Yt31SRhrjjJWdi8pGY6jlACiyCEZpV\nHPwafQcx9w0oVP6oGHZAudoeAxe8lucv+z\/cp2PCtzqnxDyB\/BQ\/5PJ9kU0Upf64SlBybCeqC\/YQ\nj0xCoshorVBWw0zVo+GlVayaCCTzZNgaRlpC2XGsLfwhaNrDMdIRgp6FbXrNS97yf0ludfH2b9Mc\njtyOuDA3HOU+yfKwlhQLJUhDTlWtIJ5ZKeOwjsErJ4nfZo7jg5YMJ0ed0DroRUx+NxTy3WTg2PMV\nVvfBbK+sC34I6\/LEiAhX89hQV3lcqKsm9ZAnClN3MJK0kqU5QYxkcfrT0NS5I7poI8IzH0OGyAxD\nIhc0inzQKgn8JwQwtEl3foXAr2A4b5etIhCCxo3rnxtpuOPD3ZBDQk1JSQjJ6oLdbN9cHoYLzcEQ\nl5uCJzFMLopWDu70O+JaC7EZiRdqRb4kNXzZ0QA\/BjlF8ddoKDUcq8QeEDaa6QX1xut\/SIsNddMm\nRz+BDBLqorQdrEhohStqDkKrTMUVsQ2yZCaMIMUvJoLw6bn9uKvxwTtdLlCL3VCZ7UFSwguSHAPo\nfhXf+EyfL+csC5vMIKg3Bf+UsYYvW8cwS8NNQt1DiOqSIrfrabjzkn3RRPr01ZlCXKj1h7bCmpi7\nJfrrrXClyZapeG\/CD\/ennmH7X3faY6zQERXpruQm3VEk+BqibDeckLqganALZq\/6cdMbjH0FdaYa\nfq2JnnfSaDlCts6JezXklCgvwh2049Ax\/vJkHqZqduNKqS3elW\/CjUY7BkqMqvjx7F7cnQ7B7QEX\n3FZ5GsLf6IDcGhsc67RG67yluWTYYbmo3xad59xXVq9F1UuoMhbGSo2+3QuD1QI6EuupG2nmsUma\njvJDNRF4scoDr4k5uC4x5CLFh2p3fDyzG58uROLBFQHund2D22ovMqk7IbPDAildxr4ylaV5kZKj\nL+jjYOrKDuf\/2VNgfooPt\/xYkOb4kQB9fUkYThbuxdnqIFwT2+HtalusKBzWiH62FIcHunSm6K0+\nV7w+5gIhsabV\/yIKyoXdlshXWn83737oNFSeGSAXCZ7W5ids18\/k2eEN4pM3W+3w0YgHI0hxo98F\nVye2Y3zYCVntpEefMll77hZ2WazUTbt8f++AXhVzSl4tt9FTkitqX3x0Zhf6Gu0h+ikZeHudcHLI\nEUk1JrrV72d0W5TQkH+vLwOuiy2c36zk6N6qssUvO9zxmzFXiJsdUD24GaW9tlpCEDFigznzWy3N\nN\/xQ63qZNZcUj+7WqKu2QuWoK+6y09DPE6uNNd+6Ur+PlauwWMu9GJkRd8OP6ztefwfEkr5SFCYn\nKgAAAABJRU5ErkJggg==",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2011-11\/cornucopia_crops-1321586249.swf",
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
	"no_trade",
	"no_auction"
];
itemDef.keys_in_location = {
	"p"	: "pickup"
};
itemDef.keys_in_pack = {
	"r"	: "drop",
	"g"	: "give"
};

log.info("cornucopia_crops.js LOADED");

// generated ok 2012-05-25 10:00:15 by eric
