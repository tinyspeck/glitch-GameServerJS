//#include include/takeable.js

var label = "Parsnip Seed";
var version = "1347677151";
var name_single = "Parsnip Seed";
var name_plural = "Parsnip Seeds";
var article = "a";
var description = "A packet of parsnip seeds. This can be planted to grow <a href=\"\/items\/204\/\" glitch=\"item|parsnip\">Parsnips<\/a> in a Crop Garden.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 50;
var base_cost = 24;
var input_for = [];
var parent_classes = ["seed_parsnip", "seed_base", "takeable"];
var has_instance_props = false;

var classProps = {
	"collection_id"	: "",	// defined by takeable
	"produces_class"	: "parsnip",	// defined by seed_base (overridden by seed_parsnip)
	"produces_count"	: "12",	// defined by seed_base (overridden by seed_parsnip)
	"time_grow1"	: "2.5",	// defined by seed_base (overridden by seed_parsnip)
	"time_grow2"	: "2.5"	// defined by seed_base (overridden by seed_parsnip)
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

// global block from seed_base
var is_seed = 1;

function getDescExtras(pc){
	var out = [];

	// automatically generated source information...
	out.push([2, "This can be purchased from a <a href=\"\/items\/1000003\/\" glitch=\"item|npc_streetspirit_gardening_goods\">Gardening Goods Vendor<\/a> or a <a href=\"\/items\/365\/\" glitch=\"item|npc_gardening_vendor\">Gardening Tools Vendor<\/a>."]);
	return out;
}

var tags = [
	"seed",
	"croppery_gardening_supplies"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-12,"y":-28,"w":23,"h":28},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAKrElEQVR42r3Z2VPb1xUH8PwHmU6a\ntFk6nTz0tcn0pQ99YKaTadMlTZO6mWSS1E2auK4bJ07sOLZrm7SJndjxihe8xcbE2GYHsZn1IhAg\ntEsI7fsuJNCCBAIv357fFQIhMIjpTJk5Yw2G4cM5595zfuKRR9b4mE8FWH7MJX0sE3ez9JSDpSZt\nLBk1sUR4nMVDejbl17CoT8mibhkLu6QsZJewgG2A+S39zGfqYR5DJ3Pp25lL18rsmmZmUzUwi6KO\nmWW3mUlaxVjT8ZOPbPTjbjqI\/Jif9iOT8GAm5kR6yobpqBnJCQMIiFhAi0mfClGPHBMuKcKOIQTt\ngwhY++Ez98Jr7IJ7vAOusTY4tCLY1Y2wKutgkVfDNHoTvU3H2YZwmLI\/Oj\/twzzHhXnMp4LIJH2Y\njRMy7kRqyk5IK5IRMxJhI2JBAaojqBpRrxIRjh1FyDFMWAlhxaCMwmvqhcfQTeA7BG4ncAuG7lzc\nGHA2Zi2ZoQxRaXF3JkJQAqZDHDlHn5ubDhDWj9kEgRNeAnuQjruRjrkohAw7kJoUfgEbj2Rk4ReZ\nMFEYEadfKB4y0GsLklH6uoi9dGPAqHHzTMRAJXUTyk8gH+aSXl7iWfrcLGVwJubADGVRKHdq0opU\n1EI\/yExh4qWn\/kSCyh8PjVF2dbwNqFcp1LwdJr0K3hIJwsv7b13bGDBiLE1HxnnfCbhMDhd3LeLS\nAm5yOS45UYALFuB8WVx0ARdxyyibJtRc3rOxEg+at5QOmLZgwLl9IT5Av+OfYPZt6LNtRa\/17+ix\nvI9u83voNr2LLtM76DRuxh3DX9Ax\/jba9W+hdexNtOjeQIv2dYi0r6FZ82c0qf+ERtWraFD+EfWK\nl1Gn+AOGrYdRfvyVjQHHveWlFDBGK7MRqYQhch3jExXQh69hLHQVuuAVHtrAJWj8F6H2X4DKVw4V\nfZ\/Scw5y91mKM5C5yjDqPA2p8xRGHCcxYj+BYdtxDFmPYdB0CDp3JSpOv78xYCbhZ\/PpKHIfDx48\n4HH\/\/n0e9+7dw927d3nMz89jbm6ORyaT4TE7O4uZmRke6XQaqVSKx\/T0NI9kMolEIsFD+P\/LR7Zg\nQ8C5VJTNz0z934BHdv56Y8BEQMWmw7r\/+TBM5h2GiHs0e4k7R+giH6b7cYheS+n7DCg7sGnDwFgy\npF0FJ8CMi7j4CpyacATzKZed1CXcMJ8yIYcEIZo0YccIbLoufLXjlzi287c\/3gBQiUSQgDlY1LyE\nCxfgCBYL5N9vy3HCNJlwjSzhaKoIYzBoG0CY\/s8oF+HoJy+gbO9vSooGxv0EpB9aiBsynITEsxej\nni8JpysCJ30oThh9WWAzju36FQFfKilyDisejfvkSBJgaTIY0SM9hqOjT+O85Uc4PfYMOozbeL\/V\nDm\/B0ZafY0fl91Ej2Q2\/S7JY0glnFhfK4WwCTsyXCL+F8R7UDVXjxGcv4uzBV14uCjgdlJXEvTLK\noHbZYRCAhyVP4YT6aYI+hUPiJ9GjOYg9DU9g1+3HOfC2ZCf8zsEVhyGLy2Yth\/Ob++jr5BhsLcOp\nvb9D+cFXi5vH015ZScwjRZzKVngYDrf9FF9JnsR\/en+IAx0\/QDl7gQO\/aH4OtdJdMNpa83BLh2E1\nHO2JCLvlkLSeIeDvcfHzTcUBYwScco8gTj1VeBh0Y3U42PQs9rU8gd21j2N3\/eP4quN5aC01CFIp\n1+q3gCWL8y3gvMZu6kEZhtrOouxfL+HyodeKBLpHSiddw7z5czirswEN5k2oGnsRl2S\/wOeiZ\/Hh\n9cewveIxSAxn1j0MPGuWPr685nDCEhvxatBasQdnD7yMK4ffaCwKOOkeIqCEgGp+UgOuIXwj+QlO\n65\/BcdXTODKS7b+9zU9g64XvYdzaBLeBLSypCn6tFB4GXtI8nMfQRdFJQBXaK\/fhfOkr+PbrN1nR\nwCg1+pRfxcsq11zHEelTi8BzsuchN5ZBY7yCG\/3vQm9o5Uvq7MKuOJNw0bZtpfKN5PUbrf35ONqm\nhY064lGh48Z+XPj3JlQceas4YMQ5cI2CJoKSXyM2czsODz6JK+M\/Q7thK3xOxq8Rt5nK6TXiXiaB\nu5kpvlnngDMJ2qrjDr7u86yZsiUVspbFdcBj7MGEW4nmyztw6YvXUPnNZnVRwAm7mEUcYrp05dmx\ntcpkCNqH4TCpcP9eBg\/uz1PQspCeWAGcpkwKh2IZTk8PT\/p2\/lwSditQd24Lrhx6HVUn3kWRwH5G\nseZksI5RC0z4FnDzlMH4shLngCmKiE\/Bce5FXBs9LLXyDIbpHmws\/weufv0mbp16r0igrV8dtrEs\nToB5ZCsmg0E9iOlElOOELAqPBA8DTtHsFkrqpqwJj51Owjl1LVT2PupRCZovfYCKo2+j+kyRO6GA\nC1t7V2wiE3mTwaBaAgo9mEl6HgpUy0QE7MzidFmc8GzsNfbCqhKh6eI2VB7bjNpzW9Hy7SfPrQsM\nES5k6Vllh1uaDBbdwCJwnh5LY\/QY6bGNrgC6bSMQd1fQgRIv4ESEa4Zd0wQfXdwWtQiNBLxx4h3U\nl2+jK+fT9RcGARc0d6+5JjkNdIioB+cyKZgJOyZvp6vFsQwolHaYVUHS9x0chj6etRxOeGfBZxHD\nqm6B6PJ23Dz1N4JuR9d6wIi1r0TABS29a04Gj6EXamkP0tMxBF06ugcdy0qcpD1SNlgD9Wgz4rSu\nxWim5+NsqgaeQa34Klqv7sDtsi103XyEzht7N68JDFq7SgKmTp7BtdYkYWwZ5C2Yjkd5iQt70GUZ\nQiSg4z2YituRiFo5zsZx9dR7dQjYJNANXENHxSeoOUv9d\/Vj9N7aV7o+0HgHAVPXMtzKTSQ7GSY8\n6nUPSQ5oUzdkcco6iloE6C4dG6xA53efou78NrRV7AKr3r820Gfs3Ow3dMBPWXz4mtS7bDJEaGUq\nBIZ9GkJZFoFxAbiAsyhqKWrgpwyq+y6gu2oP9d8H6KjcDXHtwbWBfmNHqd\/QDh9lsRC3uCatMraE\nr4sG9LCNi6EYaoDXProsg3HC5uOEUvutEii7Tgtlpf77kPpvD8R1n7N1gT5DG2WwO2+HW7kmrTYZ\n7BoRtNJGTAbHVymxjcOE9wPN8tvUgw0EHIS65wz6a\/bT\/fcxum\/ug6Thy7WBPkPrSd94C2Ww86E7\nXBa3MBn0S5Mhd40E6DDNJH3IpEKYpcikw9SrSoJlcSbZLSq3cM0MQN1dBnZ7P9qu7UQf\/TvUdGgd\noF7EvHq65Q13Fnc4b8EOt9rY4jhN88JJbaCrpIlvy8K+J+CsynqYZVmccbQKdm0LByo7jhLuY8rg\nDspkKaSir51rAj36ZuYZa4ZnTLTiMOT6zZXDFUwGfr\/lndRcvwlZMxNMeKtXwBmlN+Aa7+JATecx\n3Dz5V9SefR8d1z\/FcNOhteexW9fEKODWNtC20blhnHUVnKkAl8ueEOLaA7TFvEMLA02R7z6LDTZ+\n8dGaQJe2MSbgXJp60OtsOfN2OFdBv+VPhiyudtlhWMRJqzjQqb+ziHPR67arH6H+\/Fa0V+w6qaj5\n7NF15zDBmEtTx8OhqmN2ZQ1zaJqYS9\/KHDoKrYj\/GYFgzCaEqoHZlHXMIoSihpkV1cwk\/GlBiNFb\n\/E8MJlk1fb2IeUx9zGcWL4ZFUa+uPvMea7vyz4e+J\/NfUPVbNfBY0sUAAAAASUVORK5CYII=",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2011-07\/seed_parsnip-1309828941.swf",
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
	"seed",
	"croppery_gardening_supplies"
];
itemDef.keys_in_location = {
	"p"	: "pickup"
};
itemDef.keys_in_pack = {
	"r"	: "drop",
	"g"	: "give"
};

log.info("seed_parsnip.js LOADED");

// generated ok 2012-09-14 19:45:51 by martlume
