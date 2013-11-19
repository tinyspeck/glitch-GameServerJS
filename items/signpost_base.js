var label = "Signpost Base";
var version = "1330480177";
var name_single = "Signpost Base";
var name_plural = "Signpost Bases";
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
var parent_classes = ["signpost_base"];
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
	"no_trade"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-25,"y":-25,"w":50,"h":26},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAEAUlEQVR42u2WXU\/bZhTHUYUQmpau\nQIfGWgIrUkVC7NiJ8+okjvMex3l1HBKTNklZ2aZSWiS2XkbaXXczvsE+Atdc+bZ3+wC74GIfAPUT\nnJ3HtVlg0JEo68Xkv\/SXbCfK+T3n\/J\/HmZmxZcuWLVu2PqnKxaxQkXLDWqmg1+SCXpeLulIt6c2a\nrLfqZdhulKHdqJ61m1W906zpWqt20m01hjsdpaeq6hdTB8qJolfKpYalfEYvF7JQyqUhKyYgleBB\njEchGYuAwEcgwYcgHglCIhrCz+NQzIpQlXKg1krQ3W7Ak7YCvY5y3u+oJ4OOKkwFrJBJ6sVsCiSE\nKmRESAsxA4iYgMQQiA9xEAn4IcSxEPB5gWNo8Hk9wFBbQG+5gHJv4j2FC0shYBP6mgqDnRZ6+2xX\n09YmBiykk78RKAswk4xfwFmA8VsCEgd9zCXAZ91tdHs4MWAqHr0EeBVyHEDyXZLNq4BPtebkgFjo\nd5IzCxAzCCSDlWIOZLwmWcQuQy4lYB5jFxmMhQPAhzljMSSDO636SAY\/AH7X1\/BZHWpy\/mRiQD\/m\nhmNpLBbA\/CWhLucNK5UiNMpFwF2M9+RawmclwF0MF7tYqUCnWQVNrUFPU+DlXhd+OngGP77sw4td\nDRoVCaqlPJBTYCI41uVaswADmJ2gn4VI0I+dimJnsKsZAVq1AmhNGQZaHb59omBXVCzehoO9Dhz+\n0IWj\/afwdvgCwXrw6nvNWBiZgoxTKOMUKgZg\/nwyQIoS\/gb0GoAhzgdhzFo0yGHuAjjKIMQxWwk+\nDAJmkhw5JBJkp5PxZlMJyKUFGM3xPwELMBEgQ3teTQswj\/H4GGBDkm531ADALHoePeejqV8\/FWA6\nGZOx\/ILpefSdmwAX0BvoJdbr0ccFTE4IiKfBHpYnr8AN019+DPArI4Ne6vwmwMiUAdHWWUjg\/GgR\nvYn+2gSfmUV\/dnx87CQj\/gDoObsMyPxngFI+\/RZLrqAfoyPogAm4bo7cIN1YXFx8eLFJKKrqmyqg\neC0gnoXvnQ8eqCbUhglFeByjWSQdJHCkgw6riwy91fMz9PnEgOK\/AEr5sxDHZLEUb3bOyuDsTRvZ\ncXp6+o2VQ2PUrGuN89FDhHw\/LUClKr\/rd9s\/r6yskDHSZuY8Ix28lRwjKzKMP5jwuF2\/BH3sH+MA\n4rv6T\/x\/+C7Ohw\/DHFvUNI1ZXV0NmGPlzbxZdRzjnNdz6FXSSHMEvLlaw\/fvL7QfrTtfP1pff725\n+bj35uhQe3N0pB0e7A+e7w72EzzfW1q6G8Tvuq8xgVkz8zY\/jT\/Wc+YPjfou2mvCi8vLy1mn05l1\nu90syn11AiTj04IZV6To5+h75Li6ZiHz5gJt2bJly9b\/UX8B5r1Osi4ZNwcAAAAASUVORK5CYII=\n",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2011-11\/signpost_base-1321583584.swf",
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
	"no_trade"
];
itemDef.keys_in_location = {};
itemDef.keys_in_pack = {};

log.info("signpost_base.js LOADED");

// generated ok 2012-02-28 17:49:37 by martlume
