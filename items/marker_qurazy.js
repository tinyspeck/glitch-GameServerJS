var label = "Qurazy marker";
var version = "1335984783";
var name_single = "Qurazy marker";
var name_plural = "Qurazy markers";
var article = "a";
var description = "";
var is_hidden = true;
var has_info = false;
var has_infopage = false;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 0;
var input_for = [];
var parent_classes = ["marker_qurazy"];
var has_instance_props = false;

var classProps = {
};

var instancePropsDef = {};

var verbs = {};

function getDescExtras(pc){
	var out = [];
	return out;
}

var tags = [
	"no_rube",
	"no_trade",
	"marker",
	"qurazy"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-19,"y":-46,"w":38,"h":35},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAACVUlEQVR42uVY22nDMBQNGAoBQz4C\nAUPBHwGBwdAPt03b9JUVskE2yAZZITNkhcyQHbJDhkh1QAJV0ZWuFTk11HB+7Cvp+L51B4P\/+pzP\n50xiLFFYwLusq0OHEvcSwoGpxEgRg0zjwYPEJLU2poFDYzDpMzmN0bUEuySnzZ3Fkis6JqcxjiF3\np\/7uFgSnnWjvdDo12+12tlwu503TvNvAe3yHXGCvulX6kYK5WkRuul6vX\/M8\/5Li3yFADvIMTdbe\nyFYRK0Jag3Y4xGxgHUObQHmhTUWuCi1eLBbzGHIaWB\/ll4p1EzLrNeQ0mOYGCjNivcLH4\/GROhDB\ngO+2PN5Ta2x5CmztrVartxhtUFrHfm0IBn3PFbF4F3J6fKfWtiHoFTocDk8uLWw2mxfOIZBzrce+\nSQgi2cYe4PtB7JuEIOVHbcpZbDRrgqLvBCd9J5j5OheKILNskTmUTVCRHFNC+\/3+2XXAbrebudKK\nWXsRIFSQYV92ufMla\/NQu4JwanVRFJ8RFqh\/NQyh9koI8cFJNb7yZgL7BcgN7WYhKheiIph1FYQ5\nfaInB1bOxpXj7JSpdEMKnwKoymGa3NcLUs1qHSJIBUtbwLyeKiQogiVHi4hcbqsfugZQLZfvHtJw\na2sKklSg+O4kgksSKQI9XYgo\/A0BQfmlIxeK5HdhEECQ2LAPd2UCh5kLzgSr6uqSDvfQ92ZHV80b\ng9xgYJRmkKQCpzRmgFWHA6Q81awwhmTtCcDyoqxdSbBtIEH2zlibG+hsFMz1UaHJ\/dWgfKimYPa8\nOq3Z+vz8ADma8LNNW95rAAAAAElFTkSuQmCC",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-05\/marker_qurazy-1335984782.swf",
	admin_props	: false,
	obey_physics	: false,
	in_background	: false,
	in_foreground	: false,
	has_status	: false,
	not_selectable	: true,
};

if (this.consumable_label_single) itemDef.consumable_label_single = this.consumable_label_single;
if (this.consumable_label_plural) itemDef.consumable_label_plural = this.consumable_label_plural;

itemDef.verbs = {
};
itemDef.hasConditionalVerbs = 0;
itemDef.emote_verbs = {
};
itemDef.hasConditionalEmoteVerbs = 0;
itemDef.tags = [
	"no_rube",
	"no_trade",
	"marker",
	"qurazy"
];
itemDef.keys_in_location = {};
itemDef.keys_in_pack = {};

log.info("marker_qurazy.js LOADED");

// generated ok 2012-05-02 11:53:03
