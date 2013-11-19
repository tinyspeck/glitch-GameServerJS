var label = "Star-Jingler-mid";
var version = "1343873559";
var name_single = "Star-Jingler-mid";
var name_plural = "Star-Jingler-mid";
var article = "a";
var description = "A star that plays a single note of mid tone for your ear pleasure. Try touching it!";
var is_hidden = false;
var has_info = true;
var has_infopage = false;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 10;
var base_cost = 0;
var input_for = [];
var parent_classes = ["toy_star_1"];
var has_instance_props = false;

var classProps = {
};

var instancePropsDef = {};

var verbs = {};

function onPlayerCollision(pc){ // defined by toy_star_1
	pc.location.announce_sound_to_all("BIG_STAR_3", 1, false, true);
	this.setAndBroadcastState('glow');
}

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
		'position': {"x":-23,"y":-47,"w":46,"h":42},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAABlklEQVR42u1YwW3DMAzMBhmhI3SE\nfvKxFKAjeISMkBE0QkbICBkhI\/TrIEC7QVRRdGsrtmLGoiw+IoAvW8bpqDuSXq1e67WeW\/aia7ng\nGvXpAFp72b4LZU8dAeCt0Sd54L7VG7LXRlPtpLG3DwHqHwAtBuCtUV8BQEmp7sQxEu6ZBICHOEBI\n9WZdUBybdRTcf6hjQfaq3TTAgqkeE8dY+PeWTrW9Vh8k9rowcsQRZVKfsOI434TrAYfk9MuWtXpg\nzAwB1wAPoA0eIHJvvTIBCArA+E1gF8yAKNEp0aWrRW\/FhMPU8zLsRMSBG5SsQqm8M\/bzRGUoyaY6\nk\/wS7+WybD5t5uBPiwnHkzFzVMjOZgq4kE1a3Z0RNVNpy8HiA8UmDUXc1SJrW58cDHN0juaAtZnN\na95qv1jn\/NeYAiv0PYkzC20waiuBa9Pu9pnsSqa19vE0wf4pNrMJBEshTYWPhZag5FGBgGnP+EEE\nQHzHwqnk4Qcd4MRBB2eOfmVKUHLIGt8AHnZLM5XcE4jJNXjDVRH505OyfgEn1wtmFu2ELwAAAABJ\nRU5ErkJggg==",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-08\/toy_star_1-1343873559.swf",
	admin_props	: false,
	obey_physics	: false,
	in_background	: false,
	in_foreground	: false,
	has_status	: false,
	not_selectable	: true,
};

if (this.consumable_label_single) itemDef.consumable_label_single = this.consumable_label_single;
if (this.consumable_label_plural) itemDef.consumable_label_plural = this.consumable_label_plural;

itemDef.verbs = {
};
itemDef.hasConditionalVerbs = 0;
itemDef.emote_verbs = {
};
itemDef.hasConditionalEmoteVerbs = 0;
itemDef.tags = [
	"no_rube",
	"no_trade",
	"no_auction"
];
itemDef.keys_in_location = {};
itemDef.keys_in_pack = {};

log.info("toy_star_1.js LOADED");

// generated ok 2012-08-01 19:12:39
