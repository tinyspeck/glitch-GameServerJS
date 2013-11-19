//#include include/takeable.js

var label = "Pleasing Amber";
var version = "1337965213";
var name_single = "Pleasing Amber";
var name_plural = "Pleasing Ambers";
var article = "a";
var description = "A pleasing chunk of amber.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 10;
var base_cost = 200;
var input_for = [];
var parent_classes = ["gem_amber", "takeable"];
var has_instance_props = false;

var classProps = {
	"collection_id"	: "gems"	// defined by takeable (overridden by gem_amber)
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

	// automatically generated source information...
	out.push([2, "This item belongs to a collection which grants you the achievement <a href=\"\/achievements\/trophies\/gem-collector\/\" glitch=\"external|\/achievements\/trophies\/gem-collector\/\">Gem Collector<\/a>"]);
	return out;
}

var tags = [
	"gem",
	"collectible",
	"no_rube"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-15,"y":-31,"w":29,"h":31},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAJG0lEQVR42sWZ21dU5xnGp1EYB2RA\nFLUSRJHEUxQPrQ1ktd711q5ctBfpilddveiFf4Ltyo1BFBQ5C4N4QI2KUYnGqJNo1DYGJZqoK12J\n4AHkDDPDntkze++nz7v3zDAjQ4RKWtZ61reHGWb\/9nv+Pmy2n+EHTzcVoLNou9FR6I4VOgpb5D3b\n\/+sHgxvT0VHk0m7kw9+SGZW32QnfR5kIta0G36cKS\/\/3cLQYbz6Em3kwzqQjdGK2KbnGuTnmtXf\/\nTGjfFFiQnYXbfj6YGlu6t9K2Gbfyt6N9VYtxb+0j3F0DuLNNGFNf5ABP\/gyj4y\/AdwWW7qyC8XBj\n2IrUdLo74F6ybaTR4fY0pWB4nw1Kk30MZiJd\/S3Qfw0IdQEDZWNgYSlXl7unz2r3N7ao1\/IxUm83\nAUXissARB7RTaT8JGrr2J4SeuuMg9e83oadsBtBVlDs9gJfy6CIrfiSO\/BdzELGmaKT6NYw2JkM9\nmgL9tDMO0NeQZH5m9HRWFNBz+pd4vtOG3mr7q8cirizbgs\/yoJ5aiMDZ16F9\/Rbw7H1g5CiD\/fcI\n3f0DAleWmAARaAEWC8sqVpf3o679PN+EE\/XsmfnqbsblPJdxYQkttw5aewFC\/1wF9Uw2QoTV2\/8K\n+DoB3QN4W4Huv42LNVN9H0D7bgMGGp1RuIheDe7rvHQCDumXlgI\/vB13U\/3Br6BeXIJAUwZCrb+D\nfv\/vBKk1rYon71qwBBNLe8+vHAc2PYDuZVsl\/rTLjEFagMkCEAwPKQa6yHj4awT5AP4DGdAPZQKf\n0p3d\/4D5Q8jh41nw7rVBq7KBJcrUwO5pAjSu5LsF0PgXa1jbGhh3qNtrua4F7q4H7q0DvuV6n\/AP\nCH\/tTaB5LvDNO1aM0tLByjGwiJTyaQDE7dUFcOfDoPQby2HcWEGthHEzvLa9BeMrgt\/iysQx2gjd\nTl1camV8JB5rbAkVTZRdtv+uYOPqGy4B1K8ssyTXn3NlFupfiN6ATosZoi\/5ANeXA0wgXCbg5WUW\n4IMNFpC4d094DQMOlYYBS2xbpw53fWWuuMsgmPZpbpx0JoalpdA\/C6+XlvCzjFPC45PFMOumAN5e\nbQEx5nByIbDfHgWUuDStWGxzTR3w5ortAqidz4F2jrXvXDa0s+HVfB0Wf2d8vAhaaw4MAbuQa0nc\nHAtYQR3JAGpfiwKqFRZg907b0OAOW\/rUAG+sZGnJQ4gVP6oW0UJLLNoaX2uynrJWENRStpXJEn8R\nQBETA2VjLtarY+Jwp2375OFurdqCm6sQJFTw1AIET1In5iP0kSgLoeNhHRu71ngNvm9pAXB0rK31\n77KyFnQpWhfFJYq8N2Ur4tYalyRC8ATBCBQ8LpqH4FHRXASPiDItHeYwcDgTGlfw9zhMSS1snhcF\nHKiyi4USZnJsuWEsTq4vo23NUIjxpRJOpWVUgqlHM6Hy5ipB1IMEO5iBYJMoHcHGdGgHOJiyUIPX\ncKVboGHASKFOWG72J2Ngb7JlxWLbnZfD3V2\/GSzEAbo2wC8OHCNcs4BlWnCEUgmlEkR1Oak0qPVp\n0HmNBoLxGnWzgUpHFDDI\/h3bRaJqSAHOboC3MXvyNZGdYbt0jQBjLkC3CmCgOZNz3xwEaLUA4QJs\n+AEBa6DqUk3pAlZPsFqqmjfekwRcXzHWu89mJYRD6yYM186bvJtxb4NLY3nxMzH8dLGf7vXTgn5a\nz3+QkAfCgIQLEChAuECNA7pYjdeo4Y0rZgGlSZbLI4MFZ0jJ2ijgxwUmnHJwcdzg8FI3G9+ud6sc\nDBSWEoVJ4qeb\/Qx4PxPCf4iQMrmUJwOE9RPIX5cCP6H0\/WHAaocFyLhCGSHb143F4r4ZY9YjXKxr\nJz3dyLTiv7AYyplFFuTJ+VAIqTB7FVpRoZuVA0746WJ\/PQFrCUgoTVy8P81ycRUB9hGy3B6fLHxI\nj7S72hkMiZS4iSZWE8Yhflyfq3My6Tk4F4+rnHhcmYbHFbPxrNqJp1yfVs5GT00aergO0aVD1RRh\nhioJKXCN4SSpSQ27eaa1cgoSQN8nOSZAbMLIdaQnRwEn6s14VLg5xC\/rPZCJ3oY56KlLR3eNE11V\naegSwPJUPNnrwONSBzp329FZYsej4mT8uCMJHcV2PN01C\/17HFCrCVj8C+B8rpXNx+ebgOpXq02A\n4bLxGR0LOWFXwQ+FpX5OKMNHsjBIKw4SdMCVgf76DA7KTm5w0tBbNRvP96XieXkKugnTVToLz3bZ\nuTrQvduBZyXWa6XMbhXr2nBms3RFAEVxCRNue70l0UxuSQzYUXRnlI3ee2IhPMfmw9OchZFDczHc\nlInhxgwM1afTtU4M8oaDVanor0hBX7kDvXtnYZBuH6xIZdFNMa3YS3DvPsZivdOSDBK0YgTQt3d8\nTVSbl0bedyc8VzG451BaX4ePzd7HAcDHUuNlgvhoCS+D3ds0Bx6CeliQRxhzwwQdJqiX0KO0so9W\n9tLKHsJ6CDdM+GBdODbZ12MBpQfHATZnm3VxYsDHRVtk16VwzlOYxaNsdaPcuVmZvACjtOgoQUcJ\nOnpkHpRDUhvnmu0vyNcqQ0JlSAQaMlh6nFBq06BUS52ke\/lgkD2N9OWYXV2cm1tWQzuxYuJSI6dS\nQe4zFA6oCjdAysVcKOcXI0DgoJtDqzlNv4nguRyoHDx9rIPeBrqb9W5wjygJA6x7A8zcvpIZeL6D\nN\/rQZq28oeyFXwSUedCEa0wz66Ivpi4mjD\/937+Bxh2bxloYYDdROC17OfMNsAj3lidFAjiqnog+\njFlfkAkppUV2hIkAY1peb1nyxICSYV5OxYk21lPSC\/By3c9iHinWsZ\/1SWcJw\/maFr\/4XVviAPvq\nUl2vBPYTMt377H1zqonvGDPMduepX5DoQceXGv3eum0+xpycOk0X3BDHNPNUq+8D00NT+Fv3xOfL\njEc\/t5Dy5a\/icvlbveM9QP0ewbvvTOrBZfSf1GQtZUdAI2d54qZIjL5M8mARt5qHl0\/efemDmmA7\nbaWDJbapnRcKqHVCX4SXSg6NxJ2y3RQ4Oe3iGnvclsBaLTIcTHnbOQ60qygXnW9vDR+Wu8L\/Wng0\nDpBwxpM\/Por860GOeSWeZHMuQ4BIMrSv2LZ5Mvf9D8Kl\/mFBjsPeAAAAAElFTkSuQmCC",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/gem_amber-1334609812.swf",
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
	"gem",
	"collectible",
	"no_rube"
];
itemDef.keys_in_location = {
	"p"	: "pickup"
};
itemDef.keys_in_pack = {
	"r"	: "drop",
	"g"	: "give"
};

log.info("gem_amber.js LOADED");

// generated ok 2012-05-25 10:00:13 by eric
