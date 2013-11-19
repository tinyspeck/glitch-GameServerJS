//#include include/takeable.js

var label = "Piece of Chicken-Shaped Brick";
var version = "1350087098";
var name_single = "Piece of Chicken-Shaped Brick";
var name_plural = "Pieces of Chicken-Shaped Brick";
var article = "a";
var description = "A piece of brick that resembles one fifth of a chicken and is warm to the touch. All of them will likely combine to make a whole fowl.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 5;
var base_cost = 0;
var input_for = [];
var parent_classes = ["artifact_chicken_brick_piece5", "takeable"];
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
	out.push([2, "Collecting all the unique pieces gets you the <a href=\"\/items\/1312\/\" glitch=\"item|artifact_chicken_brick\">Chicken-Shaped Brick<\/a> artifact."]);
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
		'position': {"x":-16,"y":-28,"w":32,"h":28},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAHXklEQVR42u1Y61KTVxT1DfzdegkJ\nyCWB3EkwEkISiAkBwkUQQjCIERDFoCiIF6ICcrEOrTqtlzrpxTqtTsu\/TqftDI+QR8gj5BF29zrJ\niUFiiDaO\/vDMrCH58pGzvrX3Xnuf7NnzeX0ia65do5tr10ZvdOu3Yj2G1J3jZgJWB+oFVjLvl\/tN\nxPfQOY8m0WWt2PIaVbGSEnl5wenYDnf0SaQx8c2JBvpqyLID98OH6dlYEz0csYn3a4P1NN+po4Ue\nA93sNdCVDi1N+2pTXpNyy2dSbbaYVHvfmdSraVeMkXo17aZCeBw5QhvDVloP1gu1QOge40nELkiu\nD1poodsgCD461Sg+x70ge8lfR8NNVeQzKhPvRHJtwBJ7NmbnTRoF4uNNAtjwZdS1g+Sv5520MmCm\nOVYG4QSJb0\/axP3AzV4jh7s+q6hAyEqTHo0gOHDkEPnNqqTHoNQVJPb7jEvBxDa\/G7XxBkfo6Wl7\ndhMACjw93Ujf8\/W7Qw0CuIaHkAQRzgcc4tz\/vTdkFdckuVsDDTTu0VJvQwWIEYc5DaMyVZDky2n3\nllQFSv1yzknPzzbTYyax2GeiW8eMNNGqppHm6h04y2qAJMj\/MOEQxH6cdNHzaR\/9Md9DLy4FaLy1\nljrqy18TygOvUZnMS+5+yKKDGuKLzzgEMQls+CBso7XQEXoQcdGjMSf9POWhF+dbxOc\/TTZTfKJp\nm2q\/zfjp35UwvZjrpVtBO51yqYVikgiU62SyQHv9NpKbeQmuDpi30hZhpq+HG7bhHucLVNhaH82L\nf5ZD9PdikP68NSjw1+KQuP74nJ9GnGqRZ0BnRr1uawUN2Suz10WhZAgeNZVF8xJ8PO7ahDK5+O50\nM6tmo0mfYdsTQ4mzbQYa8xppqtNCd0fd9GTKL9SSeDjhFSSOHa4QRdBlLRffgde5xN4k2GZQKvIS\n7OMy7zSrYkjUQjmSD22m1+RzkRs6vJeqnWCcdFbvIMgGHi\/KZnyGMgfcHvAZVRseQ1nKoy+jHTCU\nFfUAUBwkwo4qOntUQ+d9tTTdVif+giyIF1Rvt2Wr+UJhr9m\/1aTeTxLNtQeycGheXxefaQ7QUYNS\nhDXYmFbtlKuG5gM6uslOAMyxcYMklETYi1av0OLNY\/gy5BVUAUACZEA0lyTQx\/eNOmtotlPPnmnN\nYonNHCQvMMF+2yGRIruadLEraFMqJlrUsTPshwgPFJLV2cphzyV4wlG9jZjEHR4kQPAitzqE1889\nuaTDw6xfG57t0BETFeEDyVyCCDkbrjBlkAGptaAlPdkwlhgIN8Ke7iCqjZISvNGj35gP6Om8N91L\npQHLXHRrFdkCOcYhvMwPc53HLeBal17kHzoSbAed472mmULrWrc+eYOnkfGMgjLEMrTIydwqRiFM\n8cNEWLEhexXnbcX\/q9pC64JXG77O4xOUALlR3lyGGOScXCxv2sxFv5bmu3SseNpeApby0lTtm2up\nx6C42qVPIv+AEfa1iZYaGnNXi8oGwRadYhu5MA8St\/tMWWuBD8LAS6bedV9t+eWOOkemMFLYBOSi\nrAYIjjM5kIT9wGpyw9vH+Scrd5GtZZbHsVB6QE0VTWDcWam7zOcKDkMCYYvxSA7MZVS6wuGZba8j\nqZoEj+wUYotAd4DdQBUUhyyQbi4cWcEAVER4ka+7hhfytnPfHXVWJfD0ADY75aoWmPSoKcoELvIX\nzmbOEgtM+moXqtFAM+xf+J8eJtHNRt2WUUyatUev4PtN27wPs6S0lV2rFr32qL4sIHotz184vKDc\n2\/npxls1ggyqFHmDv\/CsSbaFCBcE\/oLcyeZ09UIxeJ6r7mC2ilEUueRWMsbcd5hb2vua8u1ugw7e\nBq9CCKEelAJAariJK5WHAy+r467b2dbQq1u1B+OxHmNCElsdrM\/2XgwG8Mu3TsxvW6t9pr18qInj\nS0BQ5hha2WkXxnkopRL2kSGTsqv3xe3qLwP26v2Oxsp9oofeDVoD60FrUpJb584h2xoKhKufVa8W\nw+pxS2XxfXfQfmgj4q7JKKXhXKwSDRzhg3VgrHKoDyTtNfs2QCj3wUBqud8c482zqi3z6W2p3yxe\n3zxmEuGVNjPTrhXnF45G6oS9KlAUwQ6zKgWLCIlhspK66pXUoj0IYkmX9mBMKgRC8536MG8Y58NR\nEuEDoMxltg8QifHxcrE\/3W9RFNIVFjL5jHsxIKDNofqHmirDuxKEKvmAzy56NDq2hvh0W20CFgFc\nYhXyAaMTCF7hNIGCICPzT\/ZhWXggDaLcKlPD9gpHaVqcr85RCGwr0ddhNmfJgTwebIz7NjCVaXcA\nxjFxLi71NJNvcYFEZeXe7jNmQ4pfD2DkqF4YNPtmAA8E5T7IsFCIHCpXKgdAJc61VLDxULTkI1Xx\n5Czx3EkZeYYuFHGrRd8tulo\/xLrTbwrLakbeoTqP2yrk7ywJdKyPRu5eyKLjXEuhOtElMONJYl5T\nWXjPx1wzbTWKhV5j6hoPDug4bOiJ9Pm5RCezUpzsUIUAXn\/+MfxTW\/8Bd9z54ri6ZiUAAAAASUVO\nRK5CYII=",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-09\/artifact_chicken_brick_piece5-1348197938.swf",
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

log.info("artifact_chicken_brick_piece5.js LOADED");

// generated ok 2012-10-12 17:11:38 by martlume
