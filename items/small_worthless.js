//#include include/takeable.js

var label = "Small shiny object with no intrinsic value";
var version = "1340402910";
var name_single = "Small shiny object with no intrinsic value";
var name_plural = "Small shiny objects with no intrinsic value";
var article = "a";
var description = "Shiny, but you can barely see the shine so it ends up a little dull. Totally worthless: it has no purpose. Holding on to this little object simply cannot be recommended.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 0;
var input_for = [];
var parent_classes = ["small_worthless", "takeable"];
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
	"no_auction",
	"no_trade",
	"quest-item"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-14,"y":-19,"w":25,"h":19},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAHBklEQVR42u2YB1IUWxSG2YFLYAks\ngSW4BBZgwKyg0KIgoiiYFcMYERDFBCoiLeY8mAPoIChmxxzKos4735EzrxmBh6\/wVb0quuoUY3fP\n3K\/\/\/4TbZmSMHWPH2PHnj71792bV1dVl19bW5uzevTvYsWNHEIvFgo0bNwbr1q0LVq9enVNeXp75\nn0IdPXo068iRI7HDhw8nT548KQcOHJB9+\/bJnj17pKamRnbu3Clbt26VTZs2iULKqlWrZPny5fEl\nS5bkLl68eNwfAzt16tR4BUq0trYKcfHiRXn69KncuXNHzp49a3HhwgU5d+6cnDlzRvR+CcNQjh07\nJqqwbNmyRcrKyhKLFi3KHlUwXTBbF4+zMHHp0iW5e\/euPHz4UJ49eya3bt2S48ePS2Njo6mpthvQ\nrl27TElXtLq6WjQF7LMqGRsVOFUpAOjKlSty48YN6ezslO7ubnn8+LEkEglTD9VQtLm5WZqamlKQ\nbrfmpFRVVcmaNWtkxYoVsnTpUvs8f\/78+IIFC7L+FZgCjdMIr127Jrdv35aOjg7p6emR3t5eefLk\niQXAwJ8\/f15Onz5tdkaVrK+vFy0c2b59u2zevFnWr1\/v+YjVsnDhQoP87bxU1bIULnHz5k1T7Pnz\n5\/L69Wt58eKFBbZynuvxeNzURUUgUZKc0wKShoYGKxy3GhXXrl1rKmrBiOaiqIIG+VvKXb16NU5e\nPXr0yOwkUC9qLYreu3fP8s8hUZLCaGlpEa1yOXTokFmdruLKlStl2bJl5KGpWFRUBGQwIrjLly8b\nHBBRMP5SsQSfAaVI7t+\/n4LEbiqZ1kM+YvX+\/ftF+6SpSNtxsH7lpLi42D8n9XPmP1nbQF6hHADk\nGXDk3atXr1KBzYByD0pS0XxPlf9FxYMHD1ou0mJcsXnz5sns2bNl2rRpMmnSJAPtVzE2HFwOBcGC\nLAzEmzdvUn+TyaR8+PBB3r17Z\/8GFEiUfvDggRUSKtIbPRe1oZvNVHJFRUWqMAoLC2XOnDkyffp0\nmTx5suTm5qYg586d+6uKakum2pNECdSjCAB4+\/atfP78Wb58+SKfPn2Sb9++ydevXw0USIoHhSkY\n2k17e7toipjNVDQ2M2GYJpWVlVYYJSUlBpiXl5cCnDBhgqk5pIpqSez69eumBPnlgKgFHGDfv3+X\nvr4++fHjh0EDj7pRQH7DAT0PKY6RABKqnimp9v\/ddk6cOJFJ3pDoLETeRQGBQTUCUOLjx4+DKpgO\nSA5SuSMFxGpU1Os5KUBtrDFyhxwinxwQdVAJGCDfv39vnwnykQegeLxQ+D4WU8nMYSwm\/6hceh+A\nQ+WgAxJcC4IgdLhx+qRJfhgFWcynBYBAoBRNmuCzFwj3cC85Sz+kaVNkXiTqjFWwbrtsrDE9hqri\nKOCsWbMA\/GmzdvscnpYfxiIUZOGXL1+aivwFBlU57+G9EDhXz+0lXdra2qzNMO42bNhg443+V1pa\naj0PQEAAnDhx4gDAqVOnGqDZrE8YY3dC\/wKQBbGV3APQg\/NdXV2msE8S8o6i4nv0wKh6XsFYTP4x\n2nTTavlHEVAMM2fOtJyLwhFTpkwxQI1Yhnb5OE\/MmMJiJoMDYjHKuYUoRQBF0JJQzuF8iqAeGwZv\n0lic3gMpkBkzZvySf2mAIdt1G\/L8OBahCvZhqysFAAGMBw\/DOXIX9VEOJ9xa3yww5mjSqBe1d6j8\nSwOUDGYkP8oC5A9KAekzFnDOA4FKVDvBvwmu84CuHIUBnM9g325hMfayKOoNZa837BQgO1xGEjYD\nyaK+dWJB8glluM65aHAeMOYuPQ\/lGG3RXbVvWLGZ\/ubqDdZePLieAty2bVuCPGEhhyS5WYgFgWdx\nYAGJBucoBu7jO+Sc2+pbft\/qA0ju5efnD6seFV1QUOCAiQzt8jG2QSgFJC2HBag+lAAUy4BIDwqB\na4BxLw\/KBhVbo292TBJ99bTK9dYyEvWsirXLZ\/IDPLFvLtkBM+ABZVFUAYB3jWhwju84mKtGzjkc\nO2gmSP98HdbaaHEQquTPdxVtpBWMI15seONCURQAFDWABQDgaDgU91BsgPFdTRuzlBcjwMg7xhpt\nZShrgY5YSzQM2M1oM43xtAQbS3YgqEARAYsyQESD8wT3cK9bCRj9joWw1eFQKH1q+ORIg4sP2M34\nofMyiA51ehcLco73CEZWNJgQvFvQhJmxvAD1v6VZQQCHra6cwwFKoZCP3BO1lbwbFM4PBcrUqFCo\nJFD+LusgzFN\/p6DxAkV\/8\/cLwLDUAfmLOpxLAxkANWB7NZIDUG2uuTrkEwCiIopFg3NcQ2V\/AHYs\nKM++jwdwRdOA4gpUoTF+VP5nQRXL0sUDtb5BI\/TQcxZ6PVSoUNMiVGVDVTTUt7NQwULmqYIEKKRK\nZo\/9X+DY8X87\/gJLA7O6Ny0wfAAAAABJRU5ErkJggg==",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2009-12\/1261531551-3616.swf",
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
	"no_auction",
	"no_trade",
	"quest-item"
];
itemDef.keys_in_location = {
	"p"	: "pickup"
};
itemDef.keys_in_pack = {
	"r"	: "drop",
	"g"	: "give"
};

log.info("small_worthless.js LOADED");

// generated ok 2012-06-22 15:08:30 by martlume
