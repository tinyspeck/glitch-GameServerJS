//#include include/takeable.js

var label = "Ixite";
var version = "1338860335";
var name_single = "Ixite";
var name_plural = "Ixite";
var article = "an";
var description = "A compound made out of red, green, blue and shiny.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 500;
var base_cost = 4.3;
var input_for = [171,235];
var parent_classes = ["ixite", "compound_base", "takeable"];
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

// global block from compound_base
this.is_compound = 1;

function getDescExtras(pc){
	var out = [];
	if (pc && (!pc.checkItemsInBag("bag_alchemistry_kit", 1))) out.push([2, "Compounds are much easier to manage if you have an <a href=\"\/items\/497\/\" glitch=\"item|bag_alchemistry_kit\">Alchemistry Kit<\/a>."]);

	// automatically generated source information...
	out.push([2, "This can be made with a <a href=\"\/items\/463\/\" glitch=\"item|test_tube\">Test Tube<\/a>."]);
	if (pc && !pc.skills_has("alchemy_1")) out.push([2, "You need to learn <a href=\"\/skills\/51\/\" glitch=\"skill|alchemy_1\">Alchemy I<\/a> to use a <a href=\"\/items\/463\/\" glitch=\"item|test_tube\">Test Tube<\/a>."]);
	return out;
}

var tags = [
	"alchemy",
	"compound"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-11,"y":-19,"w":22,"h":20},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAH+UlEQVR42u2Ye1BU9xXH76RJY6fG\nXdj3i+WhVOSxIs+FxdXE1qSxxZhnnzvTNum0My1JZhpNH9moLeIDtwhDxQcrqTE+ApvYYnxgL0hi\nRJAFBOV9kQUEhL1EpRXHzuk5v2U36SST+Adm+SO\/mTPs3v2x9zPn\/O75nu9y3FcriCupIUSyol5v\nf7xZz69uN\/BPdBr47EsG18oWbXbQ4RJPa4zWWp34qFsPT3SGwQ88Rvjx1XB4ts8I379kgBX1OkfQ\n4CIPh0hST2jcyz7QwXebDfBkdxj8ZDgcfj4RAT8cMMLqjjBYeUEPmTVqW1AA48sVjtTjGsAMAssg\nAj3Xb4QfDYbDM4Ivg9+u14OlWismVmqMXzpgzCGVkFSpBguvhUfqdPB4iwFWt4exUhPcYwi9\/KwO\nzFUaWPxuELIY\/aYSTC41YJkhqwYhz+lYSR9t1MN3GnxwmQifXKmBuHKl\/UsHjHAqIOagirIDVOrM\nf2lh6RmMWi0DNlch3DENJFSoIPqtIADqdsr5qDIfJEEs+YeaAaW8p2FZSzyqhri3VfCtA0oIL5Vb\n\/f8XXgHWiHL43DOpKwdT5GGQBC7siYkwlsaHW\/fERtn2xkXad8dGOvbERfEUe2MjTJ\/1JbICaTZC\nQkSpAhbsVzLQ2CMqiMOIPayChW8pYf4bSjDuVrhpf0gJSJS7Jp1a539Av\/82GA\/e4RHW9kkQ6Tav\nUV4wwat3TYL+jVti+NuQwz7ozkzj98XPhzcTFsAhUzQcWxLDojYlDqqTYp20Zygjw3jZvASa0kzs\nhqkblCa5QwaaIjkYSuQQvlcBkVj2yH0KBm3cowDt3+SgKpK7pXlF2ZJNo0LINi\/ICiZAWXwD1Lsn\nQbvvFoTia+6FHgn3q27bg2s9MHf9MEi3jIO88CO2J6TwusB5LOn2NnMyHEa4+tQEN0K4OjKSoTnd\nBBdTY1kG+7PMDk+WGS6mL2aQxWsWiMv+oHVKt4TmyLfLQLVDBuoiCjmoC2Wg+GuoW1okNcq2WsT7\ncwSY8+oAfPO1q\/DQxhGQ5I1BaL4XHrQPA7fhGnC\/H7FzL3TZuZw+uG\/dIHxjeu8D+Jd7fRRYFj0W\ns+tc6mLA8roHMtNtvZmp0ISABNtijrf2W9KFo4kxcDkjRWSQ+FnJikhWnjl\/lhrn5Ulz5m0OtVM8\ntFkaaCuyrRnZeHPgXu6H+9YOwAOveGDOugH42stXEOwqcLle4H6HIL\/sBu5FvLZhDLiNGL\/uAe7V\nIeA2iT5Ab1KSpN9idvPJCdCakSy2mhMRLsGBIEIblrYzI5XghQFLqqnPkiZSdpvTE+6uv00Dcusx\nW9s+Au4lBHkJ3782AtyWCeDyrztxjzMAmCf69lP2HDcg8D10cyylOJ09ga4RRE9mCpxKioMjpmg3\nvrfjZzx9jtkV\/Ufgc9fznTy7OQHlX8e\/eONXBnww2xFg15SLe77Lyr3YJ7Jrm0Vf9gi0+Jbr\/76r\nPystu82cyLekxWf7M9ubmQb0EFUlLWJxNHEhe5iccVFAT\/9dADq53\/YB90c8c1sxg38Z\/7i8BTdF\nrvSOrxJrvRI8kw625\/VRgds++cUTEZ1HOpvYcvzBTweVnD3h6VVqG+kuSd3TqMNrUO5QnwPN+evr\nqhFQ8EFtnpjO4gi9FridU5+uQP5NE5fnldx1U65IXGilXvnJayVJkZLf\/MLAZ5apbTQQPNakZ0PC\nz8QINnatumggnbYvOrjUqS7caL\/\/T2et3NoBE5c77uB2TIrc+jGeywPJPVWT5aXabJNLxWSOdHhN\nVxgbtZ7uNbIRLKuGVEVt54K1kk6FSBYdUkEKajHNhTTBfK\/VwOAexuEh\/ZQG4ivkVi6YK6pMybTY\nP9Use1\/HhgaCo0Fi\/oEgA2qLZS7SXNJgAlryTzUk4uAQX65CjVaIQfcl0nypSVMkE0mLCZQGh\/l\/\nVzI91hXLbNysWHkhEnm+jPfpMQ4IO1CHEXzWWdC5uaGOebkhIjdb17xNOChsCuFnl3HHVoNPrXNl\no14kJXkKeyBZ0FVteveK+llg3tNOalwPf6iDVdj\/nkHD\/tPRcGbeqWmTHbXUKj91FivOd1mP1nc4\nai9fEbtHvUL3qJjT4\/XOvKokVChs1O\/8gPSLgu3ax4DUuJee0Qj+\/eV1HaaKunbedb4d3nN3Q0Pv\nEAhjEyx6rokgjIs5JacaZg409ojSzcz7+z4VoV8TaFh4qge9cdu0cUfrufhdFSt15YUuoDjW2AXH\nEfCiZxRu3JqCm1O34fad\/7LYdfL8zDV2MkbUlDNOa1kWyROTgSepI29MvzqkocLEHMT+iL2x8kIn\nyxxFVUsvAxy5fjMA149ZnFFAkjlSEPqFgSDJEy9HTSZdJtnD88nUhUw+AbrqLjO4k8098EFHP7QN\nXmPl9UPOOKC+RO6mG5PdJB9Mnpg0mcpO0KZ31MyORpYpcqLKZNnlH7ax0p65dAXqugehfWgscAYJ\nsql3cGYBFQUyG1lOMvBk0MkPk1mniMEpJxplDyUw8JDsr3ZjmTvgbKcHGoWr0Dk8HgBs9YzAmTZh\nZgFpyR2hbm2xHMJ2+\/ww+WLyx6TNmGFQocH37y073SCUn20F17k2OOHuhOrWXnALQ9CBmRT\/PQXn\nuzzCjD7FgYFhS6iTvLGyAP1xoc8joy8WP0uPS07U2Q7UNLldVO7GDgbWcmVYPOHust8TOP8ibzw3\nV2r1xxft33m8zrSvqoE\/VNNsu6dgXy1c\/wPv3ySqBmD9zwAAAABJRU5ErkJggg==",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/ixite-1334267295.swf",
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
	"alchemy",
	"compound"
];
itemDef.keys_in_location = {
	"p"	: "pickup"
};
itemDef.keys_in_pack = {
	"r"	: "drop",
	"g"	: "give"
};

log.info("ixite.js LOADED");

// generated ok 2012-06-04 18:38:55 by kristi
