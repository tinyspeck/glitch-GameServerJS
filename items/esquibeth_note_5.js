var label = "Esquibeth Note 5";
var version = "1347561121";
var name_single = "Esquibeth Note 5";
var name_plural = "Esquibeth Note 5";
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
var parent_classes = ["esquibeth_note_5"];
var has_instance_props = true;

var classProps = {
};

function initInstanceProps(){
	this.instanceProps = {};
	this.instanceProps.event = "";	// defined by esquibeth_note_5
}

var instancePropsDef = {
	event : [""],
};

var instancePropsChoices = {
	event : [""],
};

var verbs = {};

verbs.note_broadcast = { // defined by esquibeth_note_5
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
		'position': {"x":-11,"y":-31,"w":18,"h":18},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAH2klEQVR42q2YSWxVVRjHW4FCKZQW\nWrC0BYFoIiLogsREkDWIC01MjGDEhQsSt6SRtUpYCkjcuMC4NbApY8s8vpZ5KvPUV+bpMo\/X\/+\/m\n+8p5t7elgC\/557137z3f+Z1vOue9oqJevOI4fkvqJ5VK5VKVVCPVS+9IY6VxKY21e\/X2bJWNxUZf\nqbjoTV8BWJk01CZi0lnSAin3\/PnzKO7mZfdy0hIbM1p6W6qQBr4RqAb2sdVWGNhUaZmUj1\/\/lTfY\nidII82h\/HPEqYMW2sjILywRpeU+eek3QX6U6iwze7NNbOEI62Fb42bNnz\/5PsPQrZ96sMof07Q0c\nbq95+vTp3MePH0cCzLT84MGD+ObNm\/GVK1fijo6OTHHv1q1b8cOHD7vL0Vjz5J88eTJdX4dZShV3\nB+ieq5HBhkePHsUaGAOIIV58v3v3bnzx4sVuoXqCvXfvXgEgtrGpuYjSJ9KQTC9aQQwirPfv32+Q\nklXLg52QXHsdsLSuXbvWuWh5L5kDZ0jk5HCKJquV4NpqQc28c+dOslJCyEAMRFEUX7hwIc7n828M\niC5fvpw4gMVjn8+ar9l6ZllWaCsE86HyJQ8MYXQvkmfnzp2Lz58\/H7e3t3eBZLLr168ni0iL6z15\nPYBjzsiae0VB27HqGSmQZST07du3Y\/ci4Th9+nR89uzZBBIvOiSTY\/hlL7yEnRCM8djBEdhgLj4L\n9gur6D4h4FA9NBUjN27cSKqO1fP51KlTic6cOVMAiXe9cHr7ck86HHZYJLaAwymS52HfEHDk1atX\nl1NlDCCkQAJ24sSJ+OTJk52QGMYgXiHBPdm7g\/V7PIengAOMdGGxOMXhLHKLuwAq9yZqYHTp0qVY\noAkkK21ra4uPHTvWCYlBQuGF4xUOqMOmxXWe8WIgKthBRMTTiXecos9zLcQvAJXkc1kZISDhgQTu\n6NGjnZB4D0N4D0+Q2IDqPdLkSwXyvfSdNNvE5x8F1ehthDF4CzDsMV8IJ8dEOMt64YsiEdwSbyEM\nIoyHDh2KDx8+nEACaKtLJsCLBvqPDH0sjbLDBKGpNnFieVea5lXKGMZSdHjQC5J3PCvA5aSb7csv\ndhM9nGMAYIQWAwcOHOiE9O0KY9Y+Ik0438CGWYPvb+2qr6nUJvsAKK9ShH3SCJvkO3DkohYwxQ4O\n\/Qr6oNyd8woF8vjx4\/H+\/fsTSELh1e3Fo8mAq7U9uyR9VLI9fQCACu8cLwIWx3hfMPYAJaVkf7F5\nvazL0UsryoW9jrDu27cvWSmFg0EvHnlxqXX7cvNYcQYc0JU0XUG1AuahDMFYOHZlf4Udu8q7eI+X\nKrSJKgUIj3mv8x0DSIpHhjyJKw2iuIfTUJ08tzCEsjwLwbDdJpsTzGb\/zJOMPDePsIb9LtzagKR4\n5IVvrQBKXwI3Us8ucKAQKgDDZptS4CMLbaWNdQ2yefphvEa97l8g6XlZO4c8OM8OsIPSxyE7CQ2w\nPbROcD85jAMhomBgRCcS3GT7fVNrGmXf\/Rr9cHCR9Z2RAvtdfS9ySGsHTcqhKQY3xFpAiQENtPNj\npXlhjDy1EIi0wgODohIp5F\/5Lz95eibzUAuKYh5HWf\/9i9ZVZLEvt\/CRrGMyfjIODzTCWkidrXqc\nFvGlIFrSpxXy2Pde33+1iB805j36pO79jCNILxxDzwXuyJEjSYvTva\/DH0kDLIQV1t+84QIyWkk\/\nSd6YJaOLpT+kpZqwRbnaxsTdyfddJOg\/Zet9AAU83\/d79xodBDB68MGDB\/m+KOt07b\/ogKyX4Qat\nsNmLyMNPnnquuhzEn\/FtzdQhe5Ok8crJOQ6W9hpg9GBana43ZB39gavW6qdrQHu4J3shhaecEBox\nSWtra2fBueS9X2R3suC+IdexGYLt3bs3gWOTAG7Pnj2Mm5W1AwwDjlUwwLc8DIWwDuxe4NmWlpZ4\n586didxDLn5OkH8afwc7DoZ9FrRjx44EDNDdu3cn16iFtPcolnrRRzzsW56D8t0H8w7Irl274m3b\ntsXbt28vEM+7lxwohPJQsqiNGzcmNvEa71yTfX6j1IWAtI9qGWlwAAawolwuF2\/atCnesGFD8o42\nb96caMuWLQXaunVrIiYBxoEcysFYLPMAxzgHYy4WrWcakjYTANK5a\/VQjod4mEF4qampKW5ubk60\nfv36BBRhHDl0WiwOGAfy\/OI69rGFTeZwMEIt5e2PpvL0j6c6haedhzx8gKxduzbRunXrElgHZoJQ\nDh4uABsAEQ1EZEgJxmOPdHAwPnNPi2iwnlsaArIz1OqhHCEK8wpDq1evjtesWVMAGwKH4K70PR\/j\nNpjHwTw1NG8uON0U\/HhiR6nWahYRnjCfgGWCVatWJXJYl0\/Yk8LnsYV97GKfz+SzPB5pz55oB9fC\n04016HJtWeMFeNRzywsBQ3ilsbExXrlyZSIHDsHTCu8Dh70QijmYSykRqUA\/tx1sYJeDa9gHVXnT\nBRN5XoWFgFGuuUcBfpkAY0wGVCLNA9wMy7uybv8rDHcSVd4MQeTDgsiqXt55Jh1SrjHGn0kBdeap\noP\/WrvRpr\/4jTO3FVTocTJCxpqwKDqs4Xb0hiCssHCsUNoPZVhCV\/uf6q\/4\/zcBabfTTZDyX9pJX\nZVY1h\/dSY\/Kq2t+szw23M2XJK\/1PHfwtV2JHMNw\/So17bhZoLxQpxCsYb+dMPwC\/1Gv\/Acvm9vho\nPyjrAAAAAElFTkSuQmCC",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-09\/esquibeth_note_5-1347042801.swf",
	admin_props	: true,
	obey_physics	: false,
	in_background	: false,
	in_foreground	: false,
	has_status	: false,
	not_selectable	: true,
};

itemDef.oneclick_verb	= { // defined by esquibeth_note_5
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

log.info("esquibeth_note_5.js LOADED");

// generated ok 2012-09-13 11:32:01 by ryan
