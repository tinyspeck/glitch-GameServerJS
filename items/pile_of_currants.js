//#include include/npc_conversation.js

var label = "Pile of Currants";
var version = "1343429856";
var name_single = "Pile of Currants";
var name_plural = "Piles of Currants";
var article = "a";
var description = "";
var is_hidden = false;
var has_info = false;
var has_infopage = false;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 0;
var input_for = [];
var parent_classes = ["pile_of_currants"];
var has_instance_props = true;

var classProps = {
};

function initInstanceProps(){
	this.instanceProps = {};
	this.instanceProps.balance = "0";	// defined by pile_of_currants
	this.instanceProps.source = "";	// defined by pile_of_currants
}

var instancePropsDef = {
	balance : ["How many currants does it hold?"],
	source : ["Free text description of where this came from"],
};

var instancePropsChoices = {
	balance : [""],
	source : [""],
};

var verbs = {};

verbs.collect = { // defined by pile_of_currants
	"name"				: "collect",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 50,
	"tooltip"			: "Add to your currants balance",
	"is_drop_target"		: false,
	"handler"			: function(pc, msg, suppress_activity){

		var balance = intval(this.getInstanceProp('balance'));

		var article = "are";
		if (balance == 1) article = "is";

		var rsp = "Here "+article+" "+pluralize(balance, "currant", "currants");
		var source = this.getInstanceProp('source');
		if (source != ''){
			rsp += ' from '+source+'';
		}
		rsp += '.';
		var choices = [{txt:'OK', value:'ok'}];
		this.conversation_start(pc, rsp, choices, null, {currants: balance});

		return true;
	}
};

function onConversation(pc, msg){ // defined by pile_of_currants
	this.conversation_end(pc, msg);

	var balance = intval(this.getInstanceProp('balance'));
	pc.stats_add_currants(balance, {type: 'store_buy'});

	var rsp = "You collected "+pluralize(balance, "currant", "currants")+".";
	var source = this.getInstanceProp('source');
	if (source != ''){
		rsp += ' (From '+source+')';
	}
	pc.sendActivity(rsp);

	this.apiDelete();
}

function onCreate(){ // defined by pile_of_currants
	this.initInstanceProps();
	this.apiSetHitBox(400, 400);
}

function onPlayerCollision(pc){ // defined by pile_of_currants
	if (!this.container || !this.container.pols_is_owner(pc) || this.getInstanceProp('balance') == 0) return;

	var balance = intval(this.getInstanceProp('balance'));
	var msg = 'I have '+pluralize(balance, 'currant', 'currants');
	var source = this.getInstanceProp('source');
	if (source != ''){
		msg += ' from '+source;
	}
	msg += '!';
	this.sendBubble(msg, 5000, pc, null, null, true);
}

function getDescExtras(pc){
	var out = [];
	return out;
}

var tags = [
	"no_rube",
	"no_trade",
	"no_auction"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-19,"y":-44,"w":34,"h":40},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAIYUlEQVR42sVYZ1dTaxZm3buc8aoQ\nilghAUQgBZIQQIYWCAGugPQmBEIRQiDSezEixNBDu7briDo2UIxlypoPM\/yE\/ATXfJqP\/IQ9e7\/x\nxCQwKIw38671rJOccDjP2uV59vt6eX2n9Zc1leDjqspoXUyzvV1Ihqe3FOsvzXHGrbk448aMQuv1\n\/1wfV7M63y2mwuvpOAf+NKkgkvB+KQO25hLBupDy6f1yRqHHyb1dzCi0Lip3Xs\/EuRB8boqDB2Ny\neDuf5Lj3ZjYBvydve4zch5Usy9b8H+ANRsiZHEfw\/ojM5d6r2wp23ZwO43kuvSvZ0tez8bYnE7Hs\n5RtmBSP3ZEIBd4ftBDfx3kuTAv544\/N1XC71aJopIr+OyXaIzDOsvccTmN5ROcx2iOFXTPOTW3Gw\nflMBy30x7LdNc4LNo1GkNdEs3m65wofBunCY0otAXxoCnVVhsDYQg5GUw+12EYvgC1M8vFtSwXKv\npNNj5FrUYbyy1LM7mZITkBd3HCrSzjBo1MHQmMeH+rwgMLWJ4D5GdbFbApZe8aeGvPOekZ7seK\/g\nOnXAvyvTfUBffA402TwoT\/OFn+N5UJDoD0WXAqAkJRDqcoN2DJVhnotaudqL15jj89e2goCdqoxj\n0JDrB8amUGjM9wVD6WmY65RgqqOg7vJZyL\/kC8mRx2werbnWK\/7\/utEUAjVZ3lCefgx+GRCBSR8J\nuiI\/mL0eCaP1YawxHozKwFAugLZSwSePENtaSJF+WFHbxhovAsHYHA7Pp+xystInhWu5PBjVBoEm\nx4d19PMpBWsUS080TLaK1n9b11hO06Kt7fx5LRs4WBdTHEJMljalCwFjAx8mdKFME1+g7j0YkzGS\nc13RMNchMf4m5JCM1pkYh609XMQdT1EH7wzZSU5fl8Cd\/mjldyX3Zj5xT3IfV9VfJUcuwgk3l2pj\ni9D63ci9mpZL31mUbCqhdDqDGwQolSZ9DHRWBGG0YmGlXwpDdaGw2idhtudO8KZODKNNoYLvYmGb\n5lgbDQTukSFPfXQjFh6ilS10yWCw9gJamwgejitgUBMO9T\/7MbJPJ+02x6WY5Ke7+gK0FJ3\/3xtm\nwxxrcR+jqDPnO2UoIxHQVx0KPVft6EUM10XAeEMEaLJ4cHdIyv6eokcgm+MI9mouYpefhmfzwsNH\ncXNWrnSPGqVyxhANXRV80BedgWv5J6GnCrUw0xt0BafxswB68ftofbjjGXeCNDAYW8RQmh5IJA\/v\nLDRCuRNc6JZCR3kQaHP8oP5yIOqaEFPpj8IshJnrYkacoZKPqd87ggSzQQwD2ghoLjxnO3T0UIxd\nU4tS0VkRDIaSc1CPBO8MSmAA664uxxd\/i8WmCEcPPgqVSrQ9JD+DpO0E7V1MdcgR5KKoLxEcbni1\nWlLXSUaoe0nn3szE4wtFLK0tBaew9gSw2BUDlWhxy70iEl+oyjgBk7rI3Ro4+SWKvwxKXaI4fk2I\nNRtycE0kK3PXvAFNCCNXiw0w3yGEbqy32ixf7GQZS3t1Jg9tLXZfgvdGZA6CC912uRnU8A9ehx+W\nVbtEuQvT25yPha32BnO7BK5c+hHW+sUwrA3Bcer3rA6didH\/IJ3kJmzCw\/FYB0FTm5gRLErxNx7G\n1lzIvZ7LgPaSs6xrm\/L8GdnqTF+cYMT4PQBq1L7wyqT4snvDkqDnSNzJi90bZak3mtUgpbgo1d9y\nQHFW8PYi2HiZOteO\/IQfUHhjsBb5UJJ0BFb7ox3i\/WwylhGj5yiKtJPbK4LzXfYUa3MP2MnP5pME\nH1YyXQnOq1gEtdixhLpsP3g0kfg5ooGOyI1ow6C18DQM1YbBvdEE+7PTe9cgYRabqwtdJTfp6LcL\n9tMJFOiZxF01aECCtdk+DOM0BzZFQIXyqCN6JCPNSLgBLU6Dwm3Si2mT7kixs8xwIFehVF\/NDNQe\niCAV9vuldBeCt9uE6BgnGKhRKOW6gkB4aU5F+VBgXQZhZH3syPLBdMocgwJH8JHRDiK30h8Dt1pF\njGBbmcB2IIJs7zqdwMYpx2C6lImizINq1XE7Mo+jzJDFnWJR44hXoFj3V4cwcgTnLiYQQSI3qbeT\nI4w0REFxiq\/0WwcEI6k\/Hf7QWQpHcn0iCUpTjkBx8hEU6J9QmO24qjrGQKQLEn+ENnQammK+HHfE\nuRCkOqQuprGLwDVLddapb5tucLxap86j0wDuwIdIjjWE4R43ENYwnWWpv4PcOC+GPER+\/A9QrvTG\nl4l3ibWzzBDoOMS9FidRExsLgnfUCi\/eVzpYKKDxioqbiDlPMRr1CRjBKcXSI4O8BC\/mBHT+8vim\nnMFZB12n6d0p3qtZWtGXi5MDtF\/TQCsXMQI1CnnxvaFoyJF7sS1kf40AqlTeLmncC1wWOGJ0RkND\nK03W7nJDNUnTTZny5P7NQnXnsConLdyYSYVpgxDWx2OgKd8PDGXB\/3X\/QWJNV2dy7oOC82dn67te\nGQb5+zXLnUHpDh2j0Qvohe5S886SCl9OsFxTx4HrXud7zrPgXqCmmdCJcD7k7+\/Ni91Rypu6yG16\n4MXnSJDh09hFKf\/b3csssnRv8\/Oel5MSulLHcrs4Z3D7EW6KIWkhmaGoETi5qcg8tX8EudV9NUTZ\nUxNuo\/M9agR6+YY5HkmqmM9uPy6Hfz4ug388Koa\/389Fz01nv3MnqyTKFLUHrO6kjjojWbnRHIX+\nex6K005itAK2NTlntluK+EbCgSyPlqEyVDpcf9Fibhd9WsIpmF5GJcB2a25YN8rRPeSsvkjbyGcJ\nt9vFzDGGGyKhuYi\/U6E6af1mUT7oGm8OV07pRIXmtijjbKfEau4Q20ztYkeqCGNNQrZrI\/Qhemou\n7OhLBdYrqb6FX9W5PdZ\/ABDjt2JTOlU2AAAAAElFTkSuQmCC",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-07\/pile_of_currants-1343429856.swf",
	admin_props	: true,
	obey_physics	: true,
	in_background	: true,
	in_foreground	: false,
	has_status	: false,
	not_selectable	: false,
};

itemDef.oneclick_verb	= { // defined by pile_of_currants
	"id"				: "collect",
	"label"				: "collect",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 50,
	"tooltip"			: "Add to your currants balance",
	"is_drop_target"		: false,
};

;
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
	"no_trade",
	"no_auction"
];
itemDef.keys_in_location = {
	"c"	: "collect"
};
itemDef.keys_in_pack = {};

log.info("pile_of_currants.js LOADED");

// generated ok 2012-07-27 15:57:36
