//#include include/takeable.js

var label = "Piece of Wooden Apple";
var version = "1350087240";
var name_single = "Piece of Wooden Apple";
var name_plural = "Pieces of Wooden Apple";
var article = "a";
var description = "A splinter of spice tree wood that makes up one fourth of a most wonderful apple decoration, fit for a mantelpiece.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 5;
var base_cost = 0;
var input_for = [];
var parent_classes = ["artifact_wooden_apple_piece1", "takeable"];
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
	out.push([2, "Collecting all the unique pieces gets you the <a href=\"\/items\/1315\/\" glitch=\"item|artifact_wooden_apple\">Wooden Apple<\/a> artifact."]);
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
		'position': {"x":-18,"y":-28,"w":35,"h":29},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAIqklEQVR42u2XWVBb5xXH\/VI3Mzba\ndwFCAoyRzS6bXWwCIwkQAgSSWCRAEDCrWb0RbBMvgdjEJraD7Rg3cZy4uCGepsl0OqlmOpOXvjDT\nh3b60PopfeWpff33nA\/bE8+43sJM3anvzJmr++nqu7\/vf\/7nfFfbtr053hz\/p4fbrlqsLlaiIl+O\nYpsMRTlSFGZJo\/Zcueu\/DtdQLjOV7pcjP0uKzNSYv+9N3jGRFL\/d+tqoV1UoC5XslyFj9w6kJb1V\n8lqlttcnl7pL1Q84rekpO0BDP3ut4IJ12vUDRQqRXmvSzq9eK\/VaPbooF4Z9H6XXKrlPQ9uf+6Ni\nm2QxWGeYnYgkenxOVUmXV5PB4\/OTaSWXZtK2zB+ttboVV4mSKlaK9FT5e1ardfsL\/TDTuhPN1Xr0\nN5kQrjOCzVu8T\/7PFrcBBwMJGGkzY6oreX28O3lkrMuc8UpwddrF+ko1CqmVZKerj77UjwuyZT+4\nS1ToajChz0dAATNanDocoFQ4ChWoKJCjis615So0VGnR5jHig8P66PLJ+NCLzD83YZltcWthp4Xv\ny1R\/+NKrK81VLBSTJ+orNQIgRABToSQMBkzo8Bjgc2oIyoBAjR6NBzQYbVXi8pQUt+fk+Pqq+sHa\nknZkutcifdrcv72bOTvWoUa1XYncTNm\/cnPN2pcGLEjXasrzFT9wZbFa3NmddhUijXE41rML3Y2x\nCHmN6KTrMH1emlbi5qwU145L8eUFJb5Z1uDuov7BtTOxT\/j1++\/KTSsnFRshrxaF2RIU2jQXXtnA\nhdmK5iKbNFqWJ4uW58k4Jev+Gh2G2iyYjuyicwLa6vWkog7jYTU+mFKIuEUqri4ocHdeiaH2OIyE\nLSuP5ry\/pB85HNGS6pveczqdP9+Samt2aWb9NVq01unQTlA9LfEYDSfiWF8KDgYp7fUGBGt14HuC\ntRpagI5Cj+sn1Bjr1KMvEBvlfnfrlGJ9sltH6VWgNE8b3bJe5a3S\/62pWkNqaQlGT6k1oKvJgEiz\nEcMdVEQhMyllJpA4BGq1cJAt\/G4ljvYqCNAgxgZaJSt35uU4c0hHdlFwgcxu3UbuyjL5qvX\/aHFp\n6cGkJKnV2ajHiQEtbs6pMTugx0BbHAYppQNtsQRuQL1DJfxbW7F5HuuUYnVRieunNHCXKlGaK4tu\nacdv9+flBmoT\/sJwbR69SHW7RyfU7G0xoj8Yi0GCZN+NhuNI2TixCIappGKb7pXjznkFPj+vpO6g\nQjkVHnlxpNOrK3kU3Q1600+CHB0dlQW9KecCtXEbbeRHTnfIu5lyvmaPtnk2gxoxglRArlIFDlBK\nhztUuLOowI0zKpEFv1uGmUEJzUHfFytYURHkzwf1DnXUW6UOvTLo7GF\/wngk7RZ7jmHYmwzDRVJD\nitWUKVFHqeVw0TVHxGckZbUY6zKggxY1\/bZUpL2yUC48y62sIl8GN219fG3fJ6VNQbrRXhezUuuQ\neV4JdGYo8eKRPgOO9hswGWEfaijVGrS4NMKD7D8R5ZstJ0gLYH\/2kCWanQpRzaxeFVnAQaDsVU49\nK8m7jKNAguHQTrLOTlI6ZsPnilkJ1sY8H\/ZXl2QZtxcU66tLKqxdpVhW4UuKX15WYWVeJSq8+2GE\nvDrhuQbqfbwDddSTbxv0QmWhLinGFqgi0MqHkKxm2UPI0lwJVb2EFiIhL8egyCbBfwT7\/WqC59vP\nLOt\/uGfA736hxrcraiyd1FCR6NFLyvT5jdROYtHi1gggbshN1WqECMhfowH5Co3Vm1H3UFkPndkW\n3HrcZZsFxZBcXLVlKqFsyX6paOwF2VJkpT4D8PpZ08a5iTicHovFO4MG8pNRVOtkxERVmoDJHpMA\naXKyWmp0+\/TUI+NElfOYgCNohmdVPWQD9jB3A7720tsNbQoCmtPPinoqCLxEgbRkCVLNElgtzwCc\n6N4tgEZD8eLBE90mHD9oxokhC94ZoDceguMHsIIdlNoZ+o691xcwinGOMLWeg6QytyBu4BGyAc\/F\naefveZzDRxvDQFCFG2dTyKOx2JMoFWFNlK49FW68O8s02Z2FQ2ETgcVjhoDOH0vFx+9n4cqZDKEE\nqxfgoAcf70\/Au6OJGKd7h0ObOwxDnx1PwqmRRBx+OwGtHq1QlwG5d0Z8BnEP99Qessz1Odr7Q9mP\n4TYj5untZ6wrK2O8K4dWvwunx9Owes2OtZUifLq0X0zKAPTfQjyUH3ZuIgnzk8kCZqwrnl4stPS7\nRFyaScHisRQxPkL3sWf5e87GoXC8ULKL+upU726MRWxPwFkt0gfPrF4GDDclgc9+dyKOD9kw1JEo\n4BisnSq0128QKi1MJ+Pm2TRcPJ5CHo0nf8bjk4VM3H4\/G1dOpuLCkV04SiqOMxx5eKqHP5sEcKsn\nCeV5cbDtoT9SGarHcHvMO5799j4azlxkwMH2dDK1EZX5OgyHbTg9bRcqclqO9iXgo3f34IvLNnzz\ncSGW56w43GvCRVLuq6v5uP9RAVaXcnH9TJpQ+QhBHus3i5SfGKF5HfEoylaLue05amSkyBgwarFs\nkz63\/\/nolam9wbzR6UtGkytOTMLhdyfj0lwT7i034utPO\/HXP47jz9+P4U\/fjeD2JS9uLHhw70Yz\nvrjSiPufHMRvPjuEX98exufLvbj6XgArF0NYnm8mv+0T81XkapGTKhfKpVokIy+1e7R4jRnBetPG\njwE5qgpoD663iPQfCmdRQ06Gy06vWq5EMTbUlvHE\/RxZuzch9iZJUWrTiDGnXY8cSi2ldD3V\/Nar\nvTywko3VsdEfP8zjMKLVmyBgWGFahAge62\/dI2zxaIyjuliP9GSRvsdwrJxtr2KDet1Pf1d05Mil\njlytx1msX3PRqv118aKAegOpT4A8ioG2veLMyteUGVCYSea3SDeydsuijjydiGyrYuWFvLYVB6sc\n8MaWEJCn4UDsms+ZAF7Iph20awWZSs+2N8eb43\/0+DcIocIxdNtDZQAAAABJRU5ErkJggg==",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-09\/artifact_wooden_apple_piece1-1348515730.swf",
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

log.info("artifact_wooden_apple_piece1.js LOADED");

// generated ok 2012-10-12 17:14:00 by martlume
