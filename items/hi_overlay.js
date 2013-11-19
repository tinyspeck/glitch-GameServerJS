var label = "Hi Overlay";
var version = "1355001650";
var name_single = "Hi Overlay";
var name_plural = "Hi Overlays";
var article = "a";
var description = "Hi!";
var is_hidden = false;
var has_info = true;
var has_infopage = false;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 0;
var input_for = [];
var parent_classes = ["hi_overlay"];
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
		'position': {"x":-18,"y":-70,"w":27,"h":24},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAC40lEQVR42u2Y24tNcRTHj4MJjcS4\nJJNcnohpXobkViZRI+WSeaCQGk3NPE3izaWMMA+EB5LjwUSJQiS51TnSZCYGEQ0jI2bGzJkz5y\/w\nXdP3V7\/52Xufyz777F+y6vOwO3v\/zve3fmutvdaORP4hmwCm2ypuGqglVtlYsBAcBk\/AUZvETQQ1\n4Ar4TqwRWArqQRwMgDT4AU7YIG4SaATvKUwxCK7akKki7oMhTvEIzA9L3DiwFXx0ESe8ATvCEDcG\nLAKvPMQJ\/eAimOySVFO40YLbeBDLIE7RCXY5rDGL3l3lQ8ce1txRFgUbwc8sBUqyPOYzus0Bp0Ab\nuE8ugZWsp5msmidYT4eN8t6tLMXpRx3njku4zjJw17ivD7SDe2ALK4STlYPb3HwHmKn\/uBj05ihQ\nSHLHDWApOO5yCrKZZmZ\/1KVynAY9YJjrNuhe35eHOF3kJ5AAn13uucwEjLokVhPXSBlxXqZuivkQ\nmObCQ8Yf6LQwPp3ENXNj5rOy3nZWl5FgTgfINXpQN\/HOSfDVY2MxJfBBwAKfsyxVgTU80heM+5TH\nc10qLIIWmGTy9JBeHmE2oTO3GAL9MFL0WywWKCER2Wy7wBkOMTFM9OuUx++BHrF0H+cdArtLE\/YF\nPNWuv7EtC1LkkF7cF\/C9qbzzFqynyNdgN1jButXGd3Ats9LMvGSG8pFLeYrq09sBLt5Pj04F+8Fa\n3iPT3SGwnNdLQCs31seh6iWnv+4CCDymCrU+KCXopeosO\/Aqvq6kEmxiI7uOIv3WzgqnGVi8dcdn\n8yvd0Q3GkBTo33kIjGtt3F8i5xXgK8QRNrXyvn2WR6+5zaX7KZiVcT4RO5fj0d5kp1M0O8ts72R3\n\/ctDoDQRlUF7z7Q6dts1TKSEi+ekfG0w55Fi207WWF2cePQhWB3UyJqLHWQZU16TzysXeKyhixM7\nw49Q78B1sFdLptCthNNbK4XNNt8UNnw1q+DMa5Ww\/xaq\/QEiBGH9rVNVrwAAAABJRU5ErkJggg==\n",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-12\/hi_overlay-1355001649.swf",
	admin_props	: false,
	obey_physics	: false,
	in_background	: true,
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

log.info("hi_overlay.js LOADED");

// generated ok 2012-12-08 13:20:50
