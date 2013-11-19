//#include include/takeable.js

var label = "Grade AAA Earth Block";
var version = "1337965214";
var name_single = "Grade AAA Earth Block";
var name_plural = "Grade AAA Earth Block";
var article = "a";
var description = "Made from the finest ingredients Currants can buy.  Grade AAA Earth Blocks are rich in color, high in fibre, and have excellent marbling.";
var is_hidden = false;
var has_info = true;
var has_infopage = false;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 5;
var base_cost = 210;
var input_for = [];
var parent_classes = ["grade_aaa_earth_block", "takeable"];
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

function onLoad(){ // defined by grade_aaa_earth_block
	log.info(this+' replacing with '+(this.count)+' urth');
	this.apiSetTimerX('replaceWith', 500, 'grade_aa_earth_block', null, this.count);
}

function onPrototypeChanged(){ // defined by grade_aaa_earth_block
	this.onLoad();
}

function getDescExtras(pc){
	var out = [];
	out.push([2, "You can make this using <a href=\"\/items\/713\/\" glitch=\"item|blockmaker\">Blockmaker<\/a>."]);
	return out;
}

var tags = [
	"no_rube",
	"no_trade"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-39,"y":-43,"w":76,"h":43},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAGN0lEQVR42u2XaVIbSRCFuYGP4Jix\nweybQWwSWgCxGYQACSQQQgYZxDLYgAfbgOWZ8MTMPx+BI\/gIOsIcgSPoCDX5VXe2GhlPzBKO8A91\nREZ3V6myXr7Ml9VqampcjatxNa7v77rejPZc5cKff84GzXU+bD4WJ8zrbLC6NdNbfpsLhf\/Ymzr5\n7cVk+d3mePnF4sAnsfJPq8Nl+b0d47kw15u4zkXDav8L0GU29vBqK1K+ykdur\/MRo\/brTsyUC1Fz\nIUD3EoPmfH3MjjP2fjtiLnNh82YjZO1qK2yNsdO1UVOY6\/feX2eCRkCbV+nR6v7SYCU303uTmer6\nZ6DfFyJ52bQqkZu3YjgFxFv3\/TLnjOn8y9SIBeCwG\/GAngl4QKi9k3XM8RvWv0yPmOfz\/SYz1W3W\nJjpNZrLr098C+7g7+el622EMBziV6LyNnU1HzdHykAeaMeaPVoY8ALCJHSQD1vjdB3mXEjC\/703B\nmh0HVH6212QF4Gq0w6SinZV7gf2yG02IQwuM1MAI7Chr\/hRfSf2dCVsK8GvGevXx4XnUGs8X2ZAF\nB2vzo0\/MRrzbAkzHOs3mdM9dgBepyQeXW+M3gKImqCeiw4nWm6YElk7rgDGHWPzvAFEGmYM1\/OOb\n9bvPnlpAAsYkQm2aWh2rAUQAgCIaNvdvzDNz9YwAXAGzKSmtZ06DwicgAUwWqLXlcLsFtD7RZQGm\nYh2WOcZ4vwswH6kAorQU8FT1Sop2d+GpudhwGDxMDtmI2QAGlFmMdw3qzUboTnCOkJw5fFGf1C2A\nSKmo1d7XhTnGAGcZjPdUa20kF6546hKHqjgYBQiphvrcdK99LwpwG3W000iP84CxLj\/bZwETHK2E\nYM\/cAI5XhqUdDVjfxcVaegEHe27tmcJ8n717AMWJBXgokbGZ9iUM57yTFgV+uBywQHaEUYIgKP09\ngNXYmP7oby+FuT67RlkDCKqFAMZ4Z6+VSHsN4MnqsMcgbHE\/EfWSGtvbJN2AQdH6OzbRoE7TTt+z\nzAhztCNMThZTcn+nBoMYQN1as8C23XeeAbcYbL2tKVgYPE5JT8tEzPFayBqsaU+DMRxwtxulx8zB\nTsIcZ6OSNmeeIAADs5QBYwR1nhmzwfpBqsGUguRZ20xW7olga00kUhu3LGAzTB3wrIwc+JggEAAe\nbUxYIBisAIjag3UbsMyfZkL3glOAiASAObcW191UJ0KttRRLT7IAYUtrhg0Bxqb1jg\/q0gbT2ElK\nThv3TFaAR3L3mK9L9WqkwywEWy0oapDUqkjmRlpqAP0FTFf3iwRThfJ87ooG8H7lk2I9Dv1rach6\nnGk90mbYiztqBlgy3GaBZl3xLIy1mumhRwll0DrBOerzH+wwor2OWtIeRyr9paDPVkzpuzXHGIZ\/\nQAEAgMokpwi1h6iYo4nTcmZHmiv2iCM92oDrC5rI6Wd+Nulna3ICLEqdwDjC8OpTwAJEu4E\/CBSv\nPVDbDQBJM62G9CYF3PRQMyo28cCjfBMfizBmoxMnfvZQc0nGUxINLCvgjXiPjRbg1Fd9ULQjP6v4\nKC4OePUNODKFSHjneINFmOOjIR54XJ0afOx8D5aSg2EWFldDZi95vwigH2coetdnAAQI4BGFVbYo\n3IJKBu4VGOA40kq+ziDHmlXtzHCzmRttKd\/5iiks9IVxxGbcAUJ09elhjHn52vUAFFzQbFR0GTlM\nB52eKACoo535fk\/F3KlBRPFs7In4cj4SUOzscAuq\/vIjNTfrAEQ9bE4dqMNSJmb215yvD02B1hug\nSDNryICeBLqWoPSMZZwAMD44UOzSuOOP+uNMX4l0VCef\/vjgC4D7SwNlCh1jUXK83TIFEKJco0fJ\nHOPKMuw4x5Xzia4qVWVrmqkngOu5XXK\/qgGFb8QQDzT\/KfcTau5egJvT3SdSlOV0rONGKK5MDz2u\nUKQsVkOtOKQWEUjRTTeWcT\/R+dLhHeCH0qDz8wM2dbBPINpimFdwAPvP\/+SIhqhwQgBqkurPy+GO\nKkcTPRKWZmQzTNJk6xLGYIlWAUAC0x6bcIPF1zf7X5yNtT1cHm+\/kW5fWRxrzfvn4oEfeticTGAA\nRADUI8+Uke1v38OlYB3AjxIE802Za1yNq3E1rn9\/\/QXB11wb84i3\/gAAAABJRU5ErkJggg==",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/grade_aaa_earth_block-1334275660.swf",
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
	"no_rube",
	"no_trade"
];
itemDef.keys_in_location = {
	"p"	: "pickup"
};
itemDef.keys_in_pack = {
	"r"	: "drop",
	"g"	: "give"
};

log.info("grade_aaa_earth_block.js LOADED");

// generated ok 2012-05-25 10:00:14 by eric
