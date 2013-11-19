//#include include/takeable.js

var label = "Yellow-Purple Triangle Key";
var version = "1337965213";
var name_single = "Yellow-Purple Triangle Key";
var name_plural = "Yellow-Purple Triangle Key";
var article = "a";
var description = "As purple as it is yellow, this tri-pointed key has never met a door it didn't like.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 10;
var base_cost = 50;
var input_for = [];
var parent_classes = ["door_key_1", "door_key_base", "takeable"];
var has_instance_props = false;

var classProps = {
	"collection_id"	: "",	// defined by takeable
	"key_id"	: "1"	// defined by door_key_base (overridden by door_key_1)
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

function expire(){ // defined by door_key_base
	if (this.isOnGround()){
		this.apiDelete();
	}
	else{
		delete this.pc_can_pickup;
	}
}

// global block from door_key_base
this.is_key = 1;

function getDescExtras(pc){
	var out = [];
	return out;
}

var tags = [
	"key",
	"no_rube"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-19,"y":-17,"w":39,"h":17},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAEJElEQVR42u2W20+bdRjH9x9wv0TY\nhTFGL\/A4DhqbmEydc6A4hoxl1agbLDp0hw4UqA4HFISSLouUMArDQde0MgoFSmlfDgJt6Yke2KB0\nhQJCx9qXQ6GMm6+\/twskuBtZtsDF+02+6e9pnotPnuf3e5533z5WrFixYsWKlUxjiiqrkVOXS8RR\nexKw7k4vVXZDAV6xWLjn4FQDrmSxrBtnc8rBKxEjv6KWs2fgTJ5gVNuAixZLClH0TSVOnRPi53KJ\nt0Sm2RutNoz5hbUt\/Zg0vAd5oQRJb+twoUiM8ro7u99qx0wodnD0H6hVWQjdT4Lq9waceWkRJ483\nQ1CjwE1l3+622jUbsjZr2hAY+wjhmTSohY3ISwjh2wMB8IqaUNfS593N1vKZ6jmGTmBtNhXr\/gzo\nRDL8lhhGQdwqMt\/wkTa3oqXfwf9TPcJtUNuo\/1qmc1K9tsmndrfJ05xbWv1kl7SW+zH6e3N0h1aC\ntamPEZ7PwKPAKfRdl6MscR3FBPLiyyH8mG5AU9cwbXbPS2weP56Hpa1a+klA0wSlG7Zi3vlBpLXr\nDzKwQXMhy3Ki8p0NCAjklcQ1nIkJ4lodhfahuxDWKp6Lz+cLtl8jZZ+dozW5YdPnkYdx9DEgae9G\nkAtppgMViY9QQir4KwG8+NoyTid6oOx3osfuk4huKjk79RVRg6RAWAfGV69Ls\/mV9dbNmDmnnr4c\ntW2dtfTYvL3GXiw7ErDqScGa7zjCc+lYXziJikOBSHsLCVxBwipyElbAPUCjTGDFyNQS7Qlix7Mx\nRyDm5wrEiJjct5ySKmozZs7bkptUA3y1fhRT+hSsjB5FaPxTrHqPITydFoH8hUAxzicvOZfAXYhf\nxvdxNI69OAulzo0x\/3rzTgHFt9V88e1OMK6WdXGqpJ3UZsyctxJrFNoYWccg7bDdAm16l1TwCFbu\nJSE08RmB\/DxSSeEXrkjVePEM3BLOxS0ikwCmv\/IQ2V+Nwe5bhN1LJ+8EsKm1l9\/Y2oOIyVy9peyh\nNmPmvJVYLe2U\/G2xwW98H4vWD7FkO4xlJ4G8mxSpZGgiBfU8FX4gYNkE7DsCxsB9fTAA7sEFHNo\/\nD6ncB5s3SDPr8X+PM+sI12ixg7HB4og1mu2Srdhsf9wR0Q1FrEJjwLSrGEH9qwgaXo+YNr6JRctb\nWBqJw5I9Hl2in5AWE0Bq9EOkRC8gOfoBPnnBjyPRfhze78eJuFk4pmgMOn3Pdg1WSuSUkjKjx+KG\nzuxG9\/A4uozj6NCPQaYx4w+ZFler5DhfXI0vL5Uiq+Aa8iobUF7fivq2AWhMEzB5AnBML2NkMogh\n1zR0RvezW4Oi2r84zAVtbB\/kMGNGZ\/FyjO4FzuhcOPLbPjjKYfZuKcm7RF4a87lVQUYE8x+T3++Y\niWU\/6VmxYsWKFaun1r9quu0KAZdLDAAAAABJRU5ErkJggg==",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/door_key_1-1334257767.swf",
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
	"key",
	"no_rube"
];
itemDef.keys_in_location = {
	"p"	: "pickup"
};
itemDef.keys_in_pack = {
	"r"	: "drop",
	"g"	: "give"
};

log.info("door_key_1.js LOADED");

// generated ok 2012-05-25 10:00:13 by eric
