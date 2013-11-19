var label = "Esquibeth Note 3";
var version = "1347561088";
var name_single = "Esquibeth Note 3";
var name_plural = "Esquibeth Note 3";
var article = "an";
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
var parent_classes = ["esquibeth_note_3"];
var has_instance_props = true;

var classProps = {
};

function initInstanceProps(){
	this.instanceProps = {};
	this.instanceProps.event = "";	// defined by esquibeth_note_3
}

var instancePropsDef = {
	event : [""],
};

var instancePropsChoices = {
	event : [""],
};

var verbs = {};

verbs.note_broadcast = { // defined by esquibeth_note_3
	"name"				: "note_broadcast",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 50,
	"tooltip"			: "",
	"is_drop_target"		: false,
	"handler"			: function(pc, msg, suppress_activity){

		var val = this.getInstanceProp("event");

		if (val)
		{
		   var events = val.split(',');
		   for (var i=0; i<events.length; i++)
		   {
		       log.info(")))))))))))))))))))))))))))))) RUNNING EVENT", events[i])
		       this.container.events_broadcast(events[i]);
		   }
		}
		return true;
	}
};

function onCreate(){ // needed for initializing props
	this.initInstanceProps();
}

function getDescExtras(pc){
	var out = [];
	return out;
}

var tags = [
	"no_rube",
	"no_trade",
	"no_auction",
	"no_click_sound"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-9,"y":-29,"w":18,"h":18},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAHtklEQVR42q2Zx29UVxSHB2PTDQGb\nQMCEkIhFoiCkSFlEEZBNNpFZsDVJlPwDSIkCeI+CWEfAHrLHIHoxHQNjerXpxWN68dDrze+7Omd0\nPRkzQxnpxMOb++757u+Ue99LJlPBJ4RQJauRDZGNlI2RNcgmyabLZst+LjKuNcm+kH0q+0RWJ6uV\nDZT1l\/XLvM8nARsqGyUbL5sqa5ZlQ+WfnGyZbIbBjpYNd9B3hauWDTbFxplSLa9fv86H9\/uwsPmy\nCbJ6W3xNxWoy0G4YZiudIqjl4cN\/AG2UjTU1BxCxSgBrLE\/GvHz5sunVq1e5N3nRmPDo0aOSxm8V\nfP621BlhkP3KhRXlxrx48WLe8+fPgwBLQt2+fTtcuHAhdHZ2hjNnzoSzZ8+Gc+fOFYx\/u924cSM8\nefKkJB3zy8+KspBWVVTpx4Kb+fTpU26MMA7J96tXr4aOjo5ogAFz\/vz5CHvx4sVexjWHZSHc++zZ\nswKcUifOiR9dX2i5TvRqSuXdINqA4KY9fPgwz4qZzCEJ2cmTJ8OpU6eiM5wCBsilS5fC5cuXw5Ur\nV3oZ11JQFoShKHAsXP6iH\/w9fvy42XJyWK\/qtrz7iBaQz+c7BMjg4CrevHkzHDt2LAKinMM5GMp0\ndXWFXC4Xuru7o\/Gda4AyDlCHPH36dPwdOObHD\/4QQd8brTgHx6Kx0EI8TnDLenp6woMHD+JgVnXv\n3r1w5MiRcOLEiUJYHQ7nQDhUKQOEBbAQV5IIEInr168X1MMffsVAUU4xwWoy1izrNKDx7t274f79\n+wwKqOhwqOehxQFqVAKXGpAsisURARbLooEEDn\/4xb9smeXj0IypN0FVmb1z506EQkWHw44fPx7D\nkoYWh5XCuZIsykPNYkmZo0ePxo6AevgFEA6pysZQB2CdyGeSuLdu3Yo\/MogJDhw4EAHT3HP10nx7\nFxU9F4kO5nBEEQ5ZC60HwHGSueXatWuxGFgNsu\/fvz8cPHgwrhDANLxvq54bKeG5yGIBJDqHDx+O\niwYO\/3BYfk4FcJIc5pmAi\/zITSlgmn\/vEt40zCkgUXFALIVjvL43Z0Q9M014fmxra\/sggISKsNFC\nvI1QDOQbqcQYCgW49vb2CO9w8MhaM\/rPwrRlkBu7d+9+rxCTLuRUui87GJXq+UYhAsqcAALrcNaa\nchn9Z7nvBkACBOC+ffsKReI9sNIiwTlADlUM5sUAHCoTVubEVwIXfWWkSjbdslBu165dYe\/evXFV\nyP82bYY8AsaBEqhOKdYusHaBdTMOOLqHh5VUSrdIfGUU0qzvDiQv+bdz5874N5vNhkOHDpVs1ExS\n3Khx5Aq5CSovJX9XMU62RwRssq7PUSrkSYdS26I39IyctvuRCeeEd8eOHYU8LA7zm7Y676NuUimv\n\/Jtlzy91dpwaYd8btA9\/q\/u7PaTMiUgOB1dGymQJnzsnvNu2bYt\/i1UsPiy4kjhABWuwhbxSmH+z\ncx67VXVycqq2o\/5YKTmr1KkHOLgycpr1YxTOUa+1tTX+3bNnT69iIRf7Om6hJCF2E+ABAXxum351\nH+fPuM3q3qWuGnBwAAdXRv9YgmNCiHOKY\/PmzVHFNBdpOSlk8YHVVXQT4CJTb0iZx4t6pcE3rhrz\nMj88+CIHm2kthJCL5N3GjRvDli1bwvbt2wsVXQzJ6lil52\/xgVX596sdPgeUeUDjgekzzdHuqsEB\nj7hiH2wkx3AMKG1l3bp1YdOmTYVQUzApJGN8QQ7qx3yvQrWPX3h8KBXeIkhycYKisJS5WDwcxtPK\ngIlymgMSx\/yIguvXr4+h3rp1awHSt0ByMl0UkxLm1AT4s52MKwFsUCSWmmqRg\/m18OZ4mtGF5TRl\n1OEHcm\/t2rVhw4YNvSC9sikc1ATU7\/HnDTe1ndkG2L8MYCwURWMlC2Yu5mRuVXg8zdQpZ6ajTOoU\nBVNIwu2F42oC6vd5q3JT0TTZm4OqMjlIX5wkuA4HM7FW+nmQFTTIUdaVYQDfV69eHdasWRNhyUkK\nBzUpHgelFZGf5E9qquJp9tqkqlwVazf5wcHwj29E8xM1D8p1WvEMd+aggKxatSpCUjjkJmo6KIoS\neib3k7EZDz4T7Rm33xvU4zl8vMK7yMHsDNCSPpNU+VOdBrSkqnADeYeSGCFHTUBdUcb4gdNNRbPC\nWszgMm8xRpJnmiOPP9JGvnM6UEwx9Qf4YFQcqR++VuhyQDkoN3Gz79Gpcp6zRZZXo\/7eHNS84bXe\nECvQhfhhfvyqwHo\/Fyc3cKFeXfwnhTYPgOdZMSyqeYF4kbhJvbnW\/4aUyj8LbUwr1NO8XYDhT4Ux\n316ODvtf9dveSE8aDaRUyqOUFwSTuLIpsJvA8+phc81BbR\/7r7\/ao3IbdM8KwPCjvJtnb2Fr+1I+\nk5wy6tXHvpTjBVJqsdkSKRRNYSyYJl6sv\/9oB\/nOlKst9UIygYuv9jTPX4CRMpp7rhXF8LIvM5M3\nq8Pt3DbWbu7Lxlq\/G2FhrS4BV2VvMIAbrbT4g76qIuuRin+a6sMrftNqq+1vNwywN1992UAb1784\n55Kz3yDLq1FKjTnWAdpUID\/a4mrf6jXwh\/okL+EHaQv7Sj10l+AuK5fnWKWOfOt31B8aUOGsUzgX\nCO5fgTXZ\/y0YYYqWfcv\/H7MbQJxQZzo2AAAAAElFTkSuQmCC",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-09\/esquibeth_note_3-1346982179.swf",
	admin_props	: true,
	obey_physics	: false,
	in_background	: false,
	in_foreground	: false,
	has_status	: false,
	not_selectable	: true,
};

itemDef.oneclick_verb	= { // defined by esquibeth_note_3
	"id"				: "note_broadcast",
	"label"				: "note_broadcast",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 50,
	"tooltip"			: "",
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
	"no_auction",
	"no_click_sound"
];
itemDef.keys_in_location = {
	"n"	: "note_broadcast"
};
itemDef.keys_in_pack = {};

log.info("esquibeth_note_3.js LOADED");

// generated ok 2012-09-13 11:31:28 by ryan
