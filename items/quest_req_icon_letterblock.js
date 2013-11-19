var label = "Quest Log icon: Four Letter Words, Word Up";
var version = "1332284004";
var name_single = "Quest Log icon: Four Letter Words, Word Up";
var name_plural = "Quest Log icon: Four Letter Words, Word Up";
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
var parent_classes = ["quest_req_icon_letterblock"];
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
		'position': {"x":-61,"y":-117,"w":122,"h":116},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAHVElEQVR42tWZ+VITWRTGeQMfwUfw\nEfxHBamRiaMgAQUUFShhEGtYVYSIArKL7EgMizAsBghLIKwhwABhiSyyGkoEFEQUURx06kyfC7fp\nTncSok5NadVX3VQnN7977j3fObe1s\/uZ\/3W7uR3slEo9O6TSlMFI\/+HRpGCYeBAOeB0I9ftu4Tjz\nVfGwqL4PLxtSyd89vueh080N2lxdoVwiUfKAtFLpYeZhIAOk7LrgYRyKDIDJvJvwcaYCviw0kOvG\n5GNyFRM+ezdeuG99mCqDrelqWNUUwGTKLdBd8II2qXS9QiJZzzt+HHIcHMCu3Nn5wJOTJz1rT51a\nZwTWpGLU6OxsVU0uLtBy5oxVMSsEXUzEUHXM2Pm7YHlOv4D8pBPYKSWSQAYQ\/i\/VuDqDxs8TehjA\nkhMnCFyp3znQVcVB7e9eYFclkRjph6vdXaAmyANqQrwsqtrXDZTerubl6WIzaD0TPbmjI1SFXobe\nuiQiAsjO5JwrNBeFwWBtNEy23oPp9gSbpK+Jgt6qm\/tWjzwUamMukQhSBoyeJuc6gRtvT+cDtiaH\nQFNhCMzrUuHdaD7Rm5Ec9v7DMzl8nHzE12w50cZ0GbPpFfB5tgi254rh05SCXM1pa7qQjPf2aR7o\nU4MFgCsjD6E92n8nSejDjrxIArhmyCM\/ZAqzMVFAQP+ZLwV4UQawpgPYMLBamW6Ezfm6nWc2aKX1\nvgDw\/YSCRE8UEEHejz1kI0eFs10z5BLA+YpY3v5RXzoPBlUi9DemkWhaip6pFpuSyRhNvh4s4Bfj\nY5LBBBD3AD7kAuIS0KXiRhEjuzlWACo3fhLg3+s9WdDPZN5AYzJsMp\/lQoitCNVCQ6IgghhZvGcj\n+KxURjYmAq4O5\/CEUaNRRPip4mjRLNQGXwblmdPQVXoHprTp37XEAkDuEltbkrGsCLOAGMk6Py+y\n1CvM5P4TQHNLQWV4EGbV03CsHmUMrD\/Ntzrei\/oEAeDmVOEeYL2XGw\/Q2oz1sUFWARtDfKC7NgFm\nOpK+OYvNAmKCfGWyyNyArf7n91UZcC9qK6PJtvihNoN2QpODa86YiVsTj\/ZdutQ3rpAozmlTbAZc\nG5UTQNIsoM2gTJcYo2hqNeYyWEyY0d1Mr6d7cpt1AZy0qUvMKGMFgAsDuQRQfcN3Z4m5PohfMjVp\nql5ZADtYa6AfVAectQiJ5ROj+GYk16YIUsC2+CDhEiMgrcF0ialxcwv7YN5dqM8PhIYIb\/OtFNOA\noL8ONSYIIseNII670J66P0Ba8E0TxbS8jakzCeBY\/V1BZTGNoq4mHjbGC9ixuL663JwCrVe94a+4\nqyzg0mA+VF50EwfEaiGWeWjErCmHB8FISzoBxGgbUkNFjVvt7Q613mdJFEc1CWw1wn395XkJu8QI\nKGYzLCDuQ0s+yN0nqPl6Bb+T6asRBVys26mzWkU09FTHik58X4DcCHKTgtbhHqY34wFWJYI+4TqJ\nJAq7GWvGjVE06tLIvub+hlEVD9SLKeDn2WLzgKYz3Bx+KPQ4Zulsaeep5fSp4nhj0z3IzeJ25hS5\n2p1pHhB7Qa45DyUH\/5DDUbMskFjOGlMIuJCfxuU8wL5iGSxqdjK6Pvii5QhiJu+3tFk9ve1azkDd\nXTJ5miQYRXq6o4CTZTHknncmETNqrBzc5VS5S6GZ2Y+iJz00beffLEK2Z0TAgDoN3u2uEmY0XjFJ\nsCelgPqMMHKPViMARFMm5mxUgvqiB+8HJhRpsGCohLaSMFjWZ8JSfwa86L3Pqj8hRACFHokdEGb0\n00dRMKTJgPU5FcCikqwQJg0enKhRD5bGQHfCNXJf4n5aPIu3F1SgTxLWXX1i5J69MD+AE6HZ\/rpf\nAb23w8UbB2YVqJnjuH8v98Hmko40JrjndVH+JJMRaqT8DjnRFThLQCPzFwJix2xaGSZybrAdMy7z\n5lwnbM9X8ParrZmtK4phbCeFAHJtBrN4gjnXdD6O2clibBS4gNQ0LWmwNA7U8iB41hJPIrjclmZ7\nVueFkEq0PJBJIig4uGvSxPfgdInMsqd5u5KBUc+79nq93kj\/\/cExiVQn82HHeD2YJQDEtwrk4G5v\nP8wD1JREkMx6pUuHl41J0J0bDKp4nz0l+bEDjzTECEoXmvosU9I6M6\/xvyfyfW1ZONPMJsN83T3o\nDPNhAXsUUaBlGodse\/v1fEfHg6QfXO59APoncdDFtD6L\/VlsR8MVZhsmA06A+hdmPPoZ93PWDkli\n52LaxiGgOuwyuTKAv5KXlkiPgNrIK9D35z3YXu2D7VcdsL2oFghWWuDrcjN8ftkI76fKYet5JcBS\nLXyaq2Df01B9mC7l1VxuheJqJD2UV0l2dYt9q6pP\/aOdfgATBjtl2gSYkyErnngiVzMVOaSrsUU4\nDu2mWEB7e\/5r36ki2aFaqYuR+0KR2zn\/iBeUlp5RuDInJ8h2cDDmHDlyQPCy\/K0+B18DHx6XR97S\nBHilVEkk7d8g47dMgNicRLKeffSoPPvYsUM\/3f80\/As4Z10u6c8EiAAAAABJRU5ErkJggg==",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-01\/quest_req_icon_letterblock-1326246669.swf",
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
	"no_trade"
];
itemDef.keys_in_location = {};
itemDef.keys_in_pack = {};

log.info("quest_req_icon_letterblock.js LOADED");

// generated ok 2012-03-20 15:53:24 by martlume
