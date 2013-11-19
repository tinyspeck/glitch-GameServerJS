//#include include/takeable.js

var label = "Notion";
var version = "1337965215";
var name_single = "Notion";
var name_plural = "Notions";
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
var parent_classes = ["mental_notion", "mental_item_base", "takeable"];
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

function canDrop(pc, drop_stack){ // defined by mental_item_base
	return {ok: 0};
}

function canPickup(pc, drop_stack){ // defined by mental_item_base
	return {ok: 0};
}

function getDescExtras(pc){
	var out = [];
	return out;
}

var tags = [
	"mental",
	"no_trade",
	"no_rube",
	"no_auction"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-22,"y":-44,"w":44,"h":45},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAIE0lEQVR42s2Ye1dTVxrG+QZ+BD+C\n4\/SPrqlW2jK1Ttsp2KJddZaDtTN2tTqlooC3Giqj5X5TFBCIEiDIUlLC\/RIOCAnUaML9Hk4IISHk\ncriJeJk+s98tJwsdp38QrO613pXkkMX+ned5L\/skKOg31mTfZ5HWvj3Kyf7PBQprb7hg7QkTLN0f\nKsfNIRFBr2rZeneH2oe\/kSRnAZYXOvGfJwt48tiDRw+tWHnQg+Wl2\/DOXIKl52NxwrR9y+8KR6rN\niKexsmxiQBY8eeLFr78+5pCPH03h4YM+PFjqwNJCNea8Slj7wzFyd9vvo6a199N0l\/U0lhebGaAR\nD1dGGJSDQz557OLAK8vdTME2LM1rsSCp4JtNh9gbKk2Ytm5+qXBi719Dp4a\/xOLcDdxfqOUqEQxB\nEtijlbGn6t3vwv3FJizO38KCT4k5dwbc9liM3tlmfsnq7RbddgVTpYipU8EgGlchjdzuleV7DK6T\nqatbVa8U894cSO5klo9nMNG9C47ODHg7DLBV16VvKJzl7p83TfbvYZulsE1z2ebFDELDlKzjdi8v\nCey1hX2uZ9crsSipMe8r4Or5XPHwOKMh9n0ES0cEHA3NGCu\/hdnW26KlolIaKi4NPD9F01+CJ\/v3\n8s0kd9oqZBG3m6wkWFJ1ca6cw8\/78jHnyWT59xNT7zTcju\/gNBTC0VqK6bpGTNXUQ+r8BVO1DbhX\ncA01KSmB5ado3qUgQI\/zxCpkCgO4xEDzGEwhy7VrPN84mPcy+3s6g7uwCncUs2NnOBAFAdqqamFn\ncJPaGuiv5EGt+FHMPR6zftvHzTs1rL1gdvoIg4yF16XgAJRfBENqkZ2SO5VdT2A3cQ6emZMM7nvM\n2g\/B2X0eXn0nz7+JikoMFqt5kHoNqRmo\/CkJhSdOIy86Onh9gHdD2JQIhWMigkF+yzaO4mpS8ntd\ncSx+fPo6c5aDeZzH4WY3M2v\/B2Zs++C4k8Jzj0IGNCuLYLxayBWsSUrFtVNnwFRUrAtw1Pi2cqL7\nQ9gG98A1tR8u+1cM9BueW6QSAZOVbkckAzvMVXNNRWBmQMFV89zu+B\/AvqIS1CWncbiqhGTkxZxY\nP+DwnTcjx++FQOz5BFMj4UyVvVwZgnBNfcmADz6NyUOYHf433P0ZmO3Ogs\/QxfOOXmW4oZIyv70E\nR1EWF4\/c6FjkHI8NXRfgoH7r5lHjNlhM74Ostg2GY9oSBqeVxeSnLD6DU\/wCXqPWXwwUlHeedj1m\ndK1wNup49RIkBVksA5K9DE4MqJKHu94QRo3bOaTY8zGoaGwDe5miYbCPMtDeU8\/AkWoERcpxmxko\nAVorq\/02U4H48+9YzPr7odTVFenWa6URQwhGjW9h\/N67sJg\/YNPhI267tTcM080VcAlt1IB5OJta\n\/HnH3zNY2d6eayo0pWVyuOqkVGnd1voBDV0Sbc4367gGd4eOK2JrS4XlThgcHXlcJbJUBiP1ZpoF\nv4qiRutvLxRUwbLFAcH59KbNDEaiTdyt7c\/YSNDTDVUcbu01+q5cIPSZbB29cfMZwF\/yCmRAZUCA\ns0KbWbaKVKNNqW24Wlr9apFyclHIipF6stUj6vJn2oocZG\/AY260\/JaS7n6tbTLw\/wv6Po0xGmlr\nrW3PzkFtzvfobHkH9\/TBG3P8GlGVbRlQlUo0Q9cmPam5tgGvDVKL+txaSyloatQXfwHJuY2HZ2x3\naG9RaXDAkAMqtUgVSMqQKrJ9PAcZOKlEYPJ7uYWQYmvnbn1WHFrr3vUDuof2S9ONzWjOuChUJaSu\n\/9lF3oSUke2Wg6x8XikKXcbFZ\/KtJvMsGip2Ysi8g8P5prezUfg3sBTif8+Jjl1\/sXRezo2gDVuz\nsqUXwVBFPn+N+lx90d9Rrw7n0Vy5E92dwQzsbfjsO+C1vYMZ41mMr04Vst8UqN2+pqZNQ6Xl0vNw\nBLP2WmfOVV4MLbU7WDH8iZ2mQ+CaeA\/eydWwhsAjvu9PCxubMASpPhuvCDgfxYrKCHki0D9tSs9S\nysWkV50U2kqPoOFGGBor34NBeBN3DX\/EkOktdmjdCY\/lAx7usTB4exKfNvvqOn5DusxL0KYfNjtM\nXwX+9DdYXLzZVFgU\/KLEvtP+RqRRv1UksLXR37ULnp5z7KRzBDPCz\/6xOMGKSsjKhjbpXxiq34fp\nroOSw\/B1JLnFlA3dkGeWFy2j\/g+hA23\/hAxrN+T6pwsFKUcNXO6PuktHMNl+ANOGQ7C3H4ZNiOYD\nguZ2dWLKxkMOqsoih0tv+KcJTRlqT3w+s89y9d+Mv8Dh9AX7YGk+wOGmWr+DTRcFh+46xm5qUHI2\nzpx\/7NjGPvg\/bfBqkdqIfAYkKHrkpHYln2rK4o9DX\/wJ9Oq9MGkOYqjmW0w0HsVkUwycQgk\/olEh\nqn5QSDlRsRv7Ow\/l6lCJWkExUKwWZKgW1q4MV65K2oQk5MeeiqTvGsr3B7eXHIhsVx3SdBXHiiM\/\nZ7N5r8M4U7D3ejFXuiT+vDLoZS3D5bxg\/ZWrCl3mRUVTQsKm37opq7aanZKauOrCxWyo48+jMf0C\n9DlpGFFdEYJe9ZrS1gZTGmgTkqXrZ34Qbp2PU7amJqC\/8BJGrudhJL8w4pVD3r6cq6lLzfQ3biEl\nMUJITMdQfj6GrxalB72Oq\/lCluZuRj4G80ukprSM1wvS2SxEWLX14nh5FaZrG1GZmLz+XyJexqLJ\nYtFUmnvLyl8\/OHmVn7+guXI0ij3kx2heOzh6NK09l6XJ+Tpqy2tZIKqTCqEg5pT0\/PX\/AvT0Ec5h\npEa7AAAAAElFTkSuQmCC",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2011-08\/mental_notion-1312586873.swf",
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
	"mental",
	"no_trade",
	"no_rube",
	"no_auction"
];
itemDef.keys_in_location = {
	"p"	: "pickup"
};
itemDef.keys_in_pack = {
	"r"	: "drop",
	"g"	: "give"
};

log.info("mental_notion.js LOADED");

// generated ok 2012-05-25 10:00:15 by eric
