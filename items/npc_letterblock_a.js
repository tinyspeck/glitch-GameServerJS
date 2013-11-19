//#include include/takeable.js

var label = "Letter Block A";
var version = "1337965213";
var name_single = "Letter Block A";
var name_plural = "Letter Block A";
var article = "a";
var description = "";
var is_hidden = false;
var has_info = true;
var has_infopage = false;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 0;
var input_for = [];
var parent_classes = ["npc_letterblock_a", "takeable"];
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
	"letterblock",
	"no_trade"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-66,"y":-116,"w":137,"h":133},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAECElEQVR42u2X708bdRzHl\/jAh\/4B\n\/jF74AMfaIxm0WggIhuMzWWSgdlisrGhMDBSKHfX39f27nq9H722\/Ci0QEt\/gUMmv9zGNmRjyJia\nqMEZEd2WvL37dtxcaOKTnj65d\/JOk7ZJX\/f+\/Ph+e+iQLVu2bNmy9b\/oXCz7UqeaetWdTDZ8IqYb\n2sVJYnYkWdVjOalhUvdldazhjJA+fJpKv1hzqKP++JGTgSFPGzeyzCTiyJaSyBUUFMua6eRUDENZ\nDSO5uOnUdBzFK2MIZTI44VH33unx461O9+GawtUNKj31lIKjVAQtNGe6meJhvP9vbvEoOM0Oo6WP\nQVyjag9YP6gULgUC+HrkEtaLfbhbcmCj3P+cb2Z7cSv3OZZzTixNU6ZLaQoXghze64\/AxzuRGfNY\nA8iKNDZnndi9zeG31RAe3gji0YaI+YUxlJZKuPPNEP7aUPHknnTAhZKED5wCIgoDR4StPWB7IFpI\nak5sXRkkcL9eZ4nnZ0WzjC4tii8zFP5cj+DRXRF73wqmcwWRJKgm3Ljg91uTIBelsP0VTRL8Y40n\nP6ymoyZgW1BBBxvC5py7aoIGoKy5rAFsccmkxD8t+4AtxTSXOjgQ4\/E+8hD\/BCyWZQIoyDS6w4Ha\nAzbQFcD9BHfXKimeC8sHAHs5FmslZ9USh8RBhBPB2gM2MXJBkCncmx0gvWf04fYKR4A6Qjw+YlgT\nsJGWMJPqrzzIU2enIzjj5RDQpzg9EbRuio0En2xKpLyjuQpQMsEgrwOZgIwCKuLDd3MuAre3LiBf\njKIzFCIJaqOsRUMiUfhxwU0mdHdNwCmfgmNuFZt3irh2I4\/j3hgB7JIUtPpELE44yHcNz+nTbqwZ\nowf5eMC6BB\/MM6SnyjMSgXmfVnDcU\/30EPWdt6PvyscbUcyUo6QH40Ne9PE+6wC\/v+oiJeuVK8PR\nzDw7+hop8TnAs34eq\/lBfS8KWFsU8aGLx\/CoH62U1zrArTkKiwtDJsT2zRTuX\/WQE2Zj\/tmgnPAq\noBMKsrkoHj8Yx\/2lEPrFIGLDfjT1uS2Y4qd7MKR60ehSccxVWcy92jB+WOFJSt1R6UCZjRbQNAbX\nSm5zD+ZStHUJToy70REW0Mb4iB2eHuTFs2SqC2UF5\/WVs\/+Z4U7XAFKhj7FaoglgUKTQxXp3Xu\/y\nvFxTQIfMF6Z0uO1FjlwIHt4S8Mv1MHZWefx+mzfPXmOt\/LziIyfOvo29mZniCeDJAQ\/e6HS\/VvPL\nKqPyXzS5JHwqJdEVGzV9WRuFL50h5qYmkSjnEC\/qr\/lxaLoTxQxi+TTa9XZ41yHgzc9cFy275rex\n4ivnOfFUPa1erOY6Sh6oo5RwNTd75PCRbm\/r27HYC\/YfJlu2bNmy9d\/pb7DAgo+\/SascAAAAAElF\nTkSuQmCC",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2010-03\/1268344207-8296.swf",
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
	"letterblock",
	"no_trade"
];
itemDef.keys_in_location = {
	"p"	: "pickup"
};
itemDef.keys_in_pack = {
	"r"	: "drop",
	"g"	: "give"
};

log.info("npc_letterblock_a.js LOADED");

// generated ok 2012-05-25 10:00:13 by eric
