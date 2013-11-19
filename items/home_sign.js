var label = "Home Sign";
var version = "1337205008";
var name_single = "Home Sign";
var name_plural = "Home Signs";
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
var parent_classes = ["home_sign", "sign_stake"];
var has_instance_props = false;

var classProps = {
};

var instancePropsDef = {};

var verbs = {};

verbs.talk_to = { // defined by home_sign
	"name"				: "talk to",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 50,
	"tooltip"			: "Find out what you can do to your yard!",
	"is_drop_target"		: false,
	"disable_proximity"		: true,
	"handler"			: function(pc, msg, suppress_activity){

		var costs = {};
		if (this.container && this.container.homes_get_expand_costs){
			costs = this.container.homes_get_expand_costs();
		}

		pc.apiSendMsg({
			type:'houses_upgrade_start',
			sign_tsid: this.tsid,
			costs: costs,
		});

		return true;
	}
};

function getDescExtras(pc){
	var out = [];
	return out;
}

var tags = [
	"no_rube",
	"no_trade",
	"sign"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-27,"y":-56,"w":53,"h":58},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAGxElEQVR42uVY3U9TZxgn0S1ZvHAT\nEGkp\/YS2AgLK1CHYUgqUD1sotkBLWwoIQlFgtCAUKN\/gyNa5LdH5rct0cVncxXazZDsXu9wSkv0D\nXO2aZP\/As+d529Oc1qJSmJKsyS\/nPT1vz\/md5\/k9v+d9m5b2f\/ksOeRSf4vS4q3J0fWd+uCw8NpC\nZ37xokfDLTojWMbxvFPNXbuo4jr1Yq6rWsJ1GXLD\/xm5n7+9MXwn5NgKuUphsFEOreXHNutK0i38\n9RWXRhdyaOCaLQ9CDjXMtOdDoFUFAasKXFU54DVKgUjuObEJo+JweNLx\/PE338HXt+\/DyFA\/dNfk\nIkkZ9JtkQFExKiLR9COZsRYFI3apThqDU5\/D0KnPeb6n5Gba5MWrXcc3bkzYYWlpDT5ZD0Ov1wtV\nxVksMgR7hQgaT2Zu1X+YoVt0aVkEE0Ev1Icv02vKDe0ZOUelyDJqUWx9jBG5apaDz3Icei6UgKlM\nhOnNjiPg1IvBfDoLptvyYfyi6gWC9kpRJMWGnL0huOLWeJbcGpjtUEMQH5qIoSY5i56QBL3EsEWO\nkcrFtMaj5aNsluo9IYgpfbDQqY2lkPREBGLnUUwkRGoc5xGm7HnsN0F7fuR7nGc+k8UiSNWfMjEb\nCj3UruYWnJqkOtoNGk8d3R3BWYfaEnLkb9HbjlkVQLojjGDKCOOtqtcmQ5GlCF+9oAAfVjqlnAi6\nDbngrZJYdkxu0aV5MI9Ro9TwD1kfPAMrl04xYgvdJ2HSrgE0aIbRZgXMd5fCF349G\/MgDdLRH9Xm\nFKZ4IppiIthYlrUzDa7ZFIeR1AbdWIgZdzH8\/sMow+3Zenb85XEfI7TYcxK+\/7wdvgpUwU93vexI\n1+hlaN6850TSqBLpPuaZkueJHSjph9rSglu7Md2uTnpDiiAhPFLBSPARJQL8d\/xY+P3LUj+F8Bpz\nWQciz9yWnFsv9viwVZE+CBS1ZFUpxCSCWhevTbIf8jz6rd+qjFQ5yoHGwrQT6L6T0XvQ70ablZGC\nqRZ7XvQ37JerXQVbS24t65c8ktkIbzHCc9Jiov+9Lsg\/6Vlr3gKWcrdBgh1G8iCOYH+jLNxvknL9\n9dKNPjROAp7DAOJKk4xV3pSjEJ6ut8K9UANcs6vhWbgdfrzphntzDfDb0yGmObpOD6XvKL2ky2mH\nls0T6nAyehxokMWBUs0KB\/FKPfqbldwYVadFwQjOdZUywf\/6xMei9QwffmNMzwrm\/qIZ7iJxGq9e\nPsPm0PjWdD0EnYVsPGyOyOcyvjTBVSWOVXFKHhhsy+O28zKWVjwnvQlBXYK3JX4u6Y0nN1AvjbW5\n9vOi3RHEReVmKpoiUuSTpNPpqL6ofwsxjYXlw77twKXWhdMpEuQrMmKukZ66PlTOzJit7aw77yJ8\nBVNESW+O6Hpw5+s9m0pHC89IB1Cymz9cNjMNUgEQWRrfDJrg\/nILfDZmgIfXbTDZeQJWr1TAncVm\nWOhDzxytgvG246wtCquepOC35kFvnYwZ9c7bnFPjmYtaDb+8evapjZH6MqCHOaxIGpNRU\/XSkYjf\nCtawSqZrNKYjmfejZUtcFVNGrpoVYMNFbUoRHGqQhbxGCS7FRTFRD0YbPLMfFDsflbXLp2HWVcQ6\nR6I\/8uB7NaWWHIGcYQRBaR5qUkIKaz9NiNffq\/RECET3HCM4flnxCH\/TWyvFShanFsHxZkWIdEYP\nTWxRBL5I+EXrXK8e+i9WQIchL46w8AWEoJXMAGaEUtyBJFOK4IpHC3OCtseDIitM5Xx3OTx6\/ATu\n3H0IMzMLbB8SF7mEtFOfJnlcMZPNiNlWNWWCwSRppsjwhkt6pE3T6tISBIMh8A36wKETxdaA24F0\n6DbksBQPm1PQ4ARuK\/3NqtCEVRUesSi57RCwKjenbLSaUbLNT0+tBOicB20TcC8TZ9KUFUKgNY\/5\nYGNZ5t5v2l\/Yt5wTc26jHLpr5eCqloL+RAacLzwSor3Gy9BjyJa+kf9mPNVyrgdN11MjB8vZYzGC\n++bPo36TknNW5UCHjnrrPiTYV6\/YbEdy7upcsJaL9h9BN+qOCHpRg2143HcEO3Fv24EV2VMnh+b9\nqEGXQQYURSJpq4hGsOhIeF+QG7Nqpb0mFbhws2OvFCNJCSOoK0zn9gXBgK1I112HBKsl0HpOBG6j\nLEKwKH0LL2cj0hHvvQ1u7yKk9WUSr71SwiJI+nOiHg3FGVBZkP73oYNpRpyjR2ii89\/Ih6KhQlQi\nmkpkh4brSjK5hrKjf9UWZ\/xZW5r5T7n6\/T\/E6Qcn3zmQdgnnmBEF9DKIA28z20cRxYiziBqEdrc3\n\/BciteP6frQgRgAAAABJRU5ErkJggg==",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/home_sign-1334015241.swf",
	admin_props	: false,
	obey_physics	: false,
	in_background	: true,
	in_foreground	: false,
	has_status	: false,
	not_selectable	: false,
};

itemDef.oneclick_verb	= { // defined by home_sign
	"id"				: "talk_to",
	"label"				: "talk to",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 50,
	"tooltip"			: "Find out what you can do to your yard!",
	"is_drop_target"		: false,
	"disable_proximity"		: true,
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
	"sign"
];
itemDef.keys_in_location = {
	"t"	: "talk_to"
};
itemDef.keys_in_pack = {};

log.info("home_sign.js LOADED");

// generated ok 2012-05-16 14:50:08 by eric
