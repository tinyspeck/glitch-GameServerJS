//#include include/takeable.js

var label = "Corn Seed";
var version = "1347677151";
var name_single = "Corn Seed";
var name_plural = "Corn Seeds";
var article = "a";
var description = "A packet of corn seeds. This can be planted to grow <a href=\"\/items\/147\/\" glitch=\"item|corn\">Corn<\/a> in a Crop Garden.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 50;
var base_cost = 25;
var input_for = [];
var parent_classes = ["seed_corn", "seed_base", "takeable"];
var has_instance_props = false;

var classProps = {
	"collection_id"	: "",	// defined by takeable
	"produces_class"	: "corn",	// defined by seed_base (overridden by seed_corn)
	"produces_count"	: "12",	// defined by seed_base (overridden by seed_corn)
	"time_grow1"	: "3",	// defined by seed_base (overridden by seed_corn)
	"time_grow2"	: "3"	// defined by seed_base (overridden by seed_corn)
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
		'position': {"x":-12,"y":-27,"w":23,"h":28},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAALHElEQVR42r3YeWyb9RkHcKRNg9KW\nXJSe0CFUCpvQBOoqtE2LJkQHZTAYhxCMtQworAelaikhFEK7ckzAymgptE2b9ExzNvfhOH6dxE58\nJT6S2LHjOE4c33bsHM6dfPe8r+3ETtPU2R+L9KhJo0gfP7\/n+T3P+95yyw2+pgMOJjKmhqzMZH8P\nM+43M6NeIzPq0TPDTi0z5Ghlhmxqpr+3mfH3KBi\/WcJ4TWLGY6xjXAYh42yvYRxaHmNrrWSsmlKm\nV1XE9DQXMN2KPMYsu8qYpFlMQ+E3x25Z7BeGHYiM6SEbJgcsmPCbMdbXiVGPASMuHQLONgzZNRiw\nKtFvUcDfLUVfVwO8nfVwdwjh0gvg1FXD3lYJW0sZrOpiWJTX0NOUB7M8G12yLIgLv2EWh+vrjJse\ntGA6YJsH2I0xnwljXiNG3XoMRyAHrSoM9DbB3yOHzywJQUXwdNTCZWDgbOeDsgl7awWH7WWxqkKI\ni44tDjjh60ie8OqDwBE3poddmAo4KRyYHLJT2DAxSDFgxXi\/BeP+HgqCs9n1mTHq68Jonwkj9CFG\nPB0YZsNtQIA+UMDVTh+IPhT7s4t+9hjRxMtcHHDSo9s24dFiKpRFqj\/6vpfL4ORADyb6zQTqwjib\nSTrusT7KprcjeOyEYI9+2KXFMGU24GilaAlm2KYOZtnazGWaLYlBhxb8rC+Ui8ugV5c27m7jjnUW\n14PJ\/u4b4AyEI5i7fQYXCOGG7CyOYDYV4ZQEI5wliOunUmCBmUdfxaKAZR3b0yhQbHl7Jgp73kJh\n9xsoML+O\/K7tyDNtQ27na8gxvops4yvI6ngZVwwv4bL+RVxqfwEXdX\/BBe2zON\/2DDLankZG61M4\n17IV6ZoncEa9BadVj+OU8jEUGfbi+JEtiwS2bEora\/k1SgyPzkSRfjMK9Ztwrf0RFOgeRr72V8hr\newi5rb9ETusvkN3yAK5q7keWegOuqO\/DZdW9uKRcj4vN9+BC8zqcb1qDTMUqZMhX4pxsBc7KkpAu\nTURJ21acOJK8OOCY5jlmQr4RUD\/IxbTqAYqNFBswrbyP4l5MN\/+c4h5MN63DVNNaTClWU6zElPwu\nijsxJUukiKeIw6R0OcVSTEqWUNyGycafUfwUkw0\/wWTL73H58KM4ses362MGjss2MpOK\/xOw9TEc\n37sZ3+37Q3LMwFFHMzPq0vwPzaCJbobe2Wbwd8vgo0vcZ27k7sc+kxhek4hrkjMpm3By3+OxA4dt\nzb4Rp3oW543GDV+H09ywU\/09Mm66sBd3FI4ucHba2A1ifLs3GSffXwzQ3oQRh5rL2ljofovCOcO4\nYNaGbEHcQAjXPx+uaw7OWAcPAbtUlezx4tSHT2xbRAYVGHG2zF6+M7jQ5etsjcZZw7iII50Hxx4p\nmzUPizPWElAMo7wY3x94DGdSt6bFOIcVcQGrnMavZnYyhHD+9m\/h5K+FT7gGY\/INGNUfwKBFFDUZ\nwvUWxkXW2wyOZjO7SLAZ1Dfm4YeDW3D20J9iA47YZclDvTIM21XXNYOzPpk6dz0m5WsREK3CiHgF\nAtLNGOipnacZFsAZhBQCAoqgrsnEqZQnkPHJM4sAWiQI2JTXNYNftB4T8nswVLsafdV3wV2RCD8\/\nEcOyTfCbBQs2A3ukbNbctNW4COfS18BjaoSs9DsCPonMT5+9FhvQIkse7GlEgOprbjP0iR6Et2oN\nfNWrMC5j771VGBAkYbQhEePNj8Bn4s\/fDJE4fRDHrl5sDcrLjuN06lZcPPxCbBvNoKUxbaBbTBlU\nXdcMVuZJBOrX0eV8N13OazjglHwFhusSEKi9A6PKP0bgZpshCtcexDl1PMqgBHXZR5F+6GlcOvpi\njMBucdqAWUQg5XVrkl+9Kwo4Ir4LPl4iPBXxsBctg7t0KdzSHRzOaqhApy43AldDOIK1V3M4h7aK\nalNKwH\/i3Cd\/RtYXL8cO7DfXE6g5Ahe83\/ravuKAk\/J18PHZGkzCIHMnRkSJGKmPh7d8KWVzKXzt\nGVwzfF33MNcM4SNlV39HCMc+AnipBpmLqVR\/zyH7X6\/EtjD4zXUZ\/V21wakwZzL4OssxLL4bXt4q\n6uLVoSNmZ28SzdwETDQuh6\/qdowoNnNZ+7z2fuTLds7itGFcBa395ejrbgI\/831cOPI8cr96LUag\nScj0m2qjcJGTwSf6LQaEq0MLQjRwSnoHZXIphgS3oV+9BydEv0MKby1aWjM5mENbyeFshGOfSbzd\nClSf3Uf19xLyv9kWI7BTyFBEjK3oyTCgeoeumTVUh9HA8YZ4+HnL4CpdAlvereivScCnwrXYX5mA\nU\/XPE6wqCmfVENAsB+\/Mu7jy+cu4dux1VJ\/aERcDsFbp6xTMOxl0pjPwG4swJlmLscbgEbOXNdsk\ntsLlcJctw5BwKcZES2Dh34oPmQQOeKhyI1TK9AhcCR0x1aBZBt7pnVz9Ff3nDfp+z80XBp9RADbm\nmwx5xqfQYbyIMc0W9AtWoo+3AvbiROrkBIyKw7vfMtr5boecvwSpwkQcqErAgbI1KJGkEK6Uw7GP\nmzZ69LRqa1D14z+o\/v6KkhM7IDi3LwZgRw09FgtDuOjJIDDuxte6JMhaXqAJspIu7RUYbVwRWlAT\nooDlkuVIrU3E+4TfWxKPC+I3ZnC9qiLY6MhtBKwkIFt\/ZSffiQ3Y18Gn218w75oUBn7ZkoQM6Z0w\n81dgQjYXuJzqcQm+b4jDR3VB4HslCfiP8OkQrpB7s2DXVqNHVYrqM7u5+qv4cSdqz+9feOXydQmS\nvQYevJTF+XY4Q8f5GeBnzUk4TGt9IWVpSJYUWvHj6B5cBnvBrThMD0Qs8GB1AlIq6cFJ9PcZnEVZ\nQNnjoVOai5qz73L1V3V6D+ovHky7yfHykr36KngM\/BtuIj\/oHogCfiJO5I4yS5gAU2XwHrQ0LOV+\nd6iegPwEfFy9AcWNB4LvZJoLKPJh1\/HRKckGk7EPJcffQnX6Xogvp9wc6GmvDAJvsCY16b+cF\/gB\nXSsfVcWjXBCHLtkyHJETUBT8\/8+YR1DbcJSDsS+Nupty4WgXUAZzUHthP8q+fwc15\/ahMTt1YaBH\nX7XNrSsnYE3EmhTGza5JlW1vzwtkr5T3ShNwuDyOjpgyR8BU6vYrku1RuG5FDmVQAH1dBkSXDnL1\nx2TuhyTn44wFgW5dRZpbWw63nr\/gmsSOrXLNjhsCd1+Lx56ieHxMv\/tRsgVaRXoQp8iFmXDsazeH\nvg7twjNoyEqh+tuN2osHIc1LY24KdGnLaOvgLbgmhYe9oeUCihVvzgtMK3oIddJPgzXH4YIws\/wq\n907QaaiHoS4d0pyPqP7eRf3lFCjyDy8MdGrLjznbSuDSVc3BRa9JLI57xxeaDDrlOZRKdiFX9Dpy\n6rajvH7\/TDN0z4Prkl4hYB06hKcguZrK1V9DViqaCo8uDHS0FjPO1mI4aaiH1yTXPGsSu4nYWsui\nJkOvuoh7GRns1Oh643CyWZxZkUfAWuj536GeapCrv+xDUBV95rsJsIhxtBQSoDh6h9POwbXMwanC\nuIJ5cV0sjmAm6WWYJJfod\/kc0Cg4gWv\/\/htKj79J0A+gKv584Y3GoSlk7Bq65TUFXMaCuNk1KYyz\nzsWFLt8ZXEQzzMWx\/9poirDA1oqvUXhsG3indqLuwgGf4trhvQsCbZpCn11Nt7w6n6IgmLG2yjlr\nEosLHmnkZIjCzak3kySIs9AHcrQzHM6hZ2j27kX5yR0QZr53TJHzwc1XrSAuDzYVhTIX1uZc+rko\nGqeOxt2sGdh666W\/C8PCYWvj0QX9FlOTvmvB127\/BUs2h7+6cOH7AAAAAElFTkSuQmCC",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2011-11\/seed_corn-1320964709.swf",
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

log.info("seed_corn.js LOADED");

// generated ok 2012-09-14 19:45:51 by martlume
