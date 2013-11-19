var label = "Depression Button";
var version = "1335913197";
var name_single = "Depression Button";
var name_plural = "";
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
var parent_classes = ["depression_button"];
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
	"no_auction"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-36,"y":-37,"w":72,"h":38},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAEQklEQVR42u2W+09bZRjHl8XEEJJB\nYoz8hlzkIuP0TltaWrpyKzCug3JKSy\/AoLSlGwwYdAOZqKgoiokx3pYZjcl0NgO3MdQdnLjUBcVN\nh0pQfthfsL\/g6\/OeFTKjP4zASEzOk3zynrd5L5\/3ed5z0n37pJBCCimkkEIKKXYavwc94dUeT\/TX\ngEe47fcIP3e7hZ+I5W6XyA9dTiFGfN\/pFJaIbzucwmJHq3CN+LqdFxaIq15emPe2CJc9\/PS8zy7b\nsdRGwOteD\/qia0Ef\/gh68VvAizsBD37p8eCW340V4sfuNiwTN7tciBE3jrqwdNSJ651OkCAE4pt2\nB74iFnwOzPt4XPHyuEzMeVo2Zj326UsOR+r25Xp9K3+FfFgnHpXgl54WzBIX3URbs3ubgu3YS8Fo\nW\/PYtgSjzYexdqIHfw6FHp0g9Wc72\/BhSyOCOvX2BN+yWfB2lRWf8PW42h9EbDyC9XPv4+5cFBvn\n3sPazBTuPB\/B7fFh3BobwsrpASyf6sfN4T7ETh7DjcFefEfzrvf1YPFYNxZH+iFEBnCNuODvwDuO\nJkweLsdQcSG6NHJ0KLntC85UFIu8GeeN8vu8yzfgfH8vFqYmceXlCVx6cRxzZ0ZxcWwEX5wawucn\n+3F+IIxPjwfxca8fH\/V0YqqhGoPGApwwaHBcr0ZYp0JQq4S\/QLH7gtPE62VmvEa8WmrCK8RkSRFe\nshrxAjFxyIAzlkI8R9k5bdYjYtJhuEi7e4Lp6elJey3YzOWdfSg5nufNubm5G3staH02B\/n5+dHK\nysr\/\/iY2NTUlORyOFQIWiwXV8nxx870QbFNy4J7JhNVqRU1NDerr6\/\/9TWxtbT0bDocRiUQwMjIC\nu90Ok16PGpUcvbQwk9hNwU7KWp3sIIwH86BWq1FVVQWqngglCxzHaUlr\/5YgCQmDg4MYHR0Fa0Oh\nENxutyjKTlVcXAytVouCggIc0qhQoZDBrqa7o7pPk0qGI0oZGkU4NCg41BO1VIkawkAiGi4fMpkM\ncrkcejp8WVkZbDYbamtrRTFKElwul\/hcWFg4QVpPEInML5EEjjQ2NiIQCKCvr08cyPqUbnEBJlld\nXQ26I+Ki5eXl4gYlJSViadi1YIcwmUwoKiqCwWBgm0Cn04kHYy3rG41GmM1mcTybV1paioqKCtTV\n1cHpdIp70jqrSUlJKvJK3hQ8wB4oOzxNWmUyLHN7KcjWpd\/uaTSaC3G5J+PF3SpzQjylCTTIT7Kf\n0UZ3mQCTYQvspuDmGFZqKnmM3uCZlJQUC+3\/FPH4w34SE2iijWTH6CJHVSrVErX3Nu8iW5zBNmd9\nOph44ZVKJRQKhXjX6LKDPlsieXl5yM7OXqXnGLUf5OTkhNLS0rh4Yg7ES8qeH9vJ38T98WwnZGZm\n6rOysmybZGRkbJGamrpFcnLy05vViZP4QMWSHxBL+MebK4UUUkghxf8j\/gZj3zEMtzXkpwAAAABJ\nRU5ErkJggg==",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-05\/depression_button-1335898108.swf",
	admin_props	: false,
	obey_physics	: false,
	in_background	: false,
	in_foreground	: false,
	has_status	: false,
	not_selectable	: false,
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
	"no_auction"
];
itemDef.keys_in_location = {};
itemDef.keys_in_pack = {};

log.info("depression_button.js LOADED");

// generated ok 2012-05-01 15:59:57 by mygrant
