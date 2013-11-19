var label = "Sign";
var version = "1308782337";
var name_single = "Sign";
var name_plural = "Signs";
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
var parent_classes = ["sign_stake"];
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
	"sign",
	"no_trade"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-33,"y":-105,"w":67,"h":106},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAFGUlEQVR42s2Y6U4bVxTHUdVvURqp\nSiSafqiqRiKBEEPA2CzG2GDwNt6wsQ0YG+MFg7GN2RNbwxa2AG4CaRPSNEVRK7VSyyPMhz5A1Sfg\nEao+wek514wZoB+qThTNSH\/5+np853fPdo9dVfWerqijhY+5tULQ0nja310XrlLalR\/ugrS\/A+Ke\nVrDr7sEHeeive1HVu\/Uh4XXRJ3x3JnH8hg8wvV0OCD+sBIXVlBk2pqzwJG2F+bABfnwyzEt1vBIM\nHxV9elErcZM+7m7VywJ8t+pXfc\/7AaHgcMEFz2Yc8GyW5ITnc+f6GudJz+dcTIfz7oq+WfTAy8de\nwM3A8eoQjn2whptZGjVCytcOSXeLShYkAYkA5yD\/ApjnoDTNsQ2I87tZG5Ty5bnLa+zjvVFni3zA\nV7hjqUVI2QE1bE+ZYcrbBIuh9grQwbwLdnNWvMeFAHbI4X2PIrorGyK9QqsmMF5lufmXrcSN49VB\nOCqQi91s4acZK4zZ7sNasgfiXD3wMQNMB1pgcaSDgRdGO2EJxzRPllsKd8C4UwU5f8sF63271A8x\nlwZCnPr\/A\/62H9eTBcWFyV27WSssnz18Gh9KMGTN8me2ioVoTnQzWXNzsq8SCqIFycWy3HtSivHk\nNmnskfvEmKIHE0A57soJQgkkbmYvZ2fjA\/yeNDZJpRknhGxN8gB\/3o7wLx954MWCm4GRluMGZh3S\nbs7GLErj9XETwnAMeiVhhJ2MhcGS9lnyYIyyTZQ3SYBBc6M8wJ+2QicEJ1qQLFGI6mEHgeaH2yDr\na8aYtMDGhAni9nqct8BWug9S7gZUI6ynTCxe93Ajr4sDLJa3sFaupfqgEOuBQF+DIAuQirDULeSm\nDEKR1SgZxl0qBkqZvBw3VhLgcaSzsqkdTCppeRE9sZLsoxj8QxbgG95\/ciiJQVFiPFF8HkgKs+hC\n0Y2ixNgs5c\/X2Jt2yE+StXEzXxjrgcWIAYr4up2xsYfQqULJIWYtubCcOFzlfSVrz0ShIg0XisER\nuUmCFvxLmiBkITq6Xiy6IR\/QQMLxABbQvZOeRubiMVsdKz2zg1qIWuuwBuqYi8ntlNUUwzTeytgh\nG9RB2N58IguQiunlI04sMRsTvSwhSJQotIEiJhAVcHLnVtosKdjOszPcwcKCNliMYWJheyYL8Kjg\nhYtJ4rwSj1IdXGoURIleEMsOrcUnemGUU8sDLM1wwtOs7XQzbQF8vQJUwpq3L9FeznZ2cnBXGgMx\ng8mK5O6l0W75Zea\/XAlf040xlybrM6mgv7sevKigueF0MdLFl3J2fnPS\/HY5aRIuKG4S4m6N4O9r\nyH6QxpY6kiHLQwjgyWBpr4Fu9R2hSknXVFCnT\/a3wrC1CdAqygOcCxn0k\/h7JNnfBkPWh8oDnB0x\n8gQ47m1jDUC3RoGABEduJgtaO+7yigLMDHbyUwEd\/uTUMkBHZ62yABMeLT8T6mK\/MRQLmMGzVdGA\nMbeWAVILpUjACKcGPFEg4lCDXWlJQn8cESB2JwyQ093VKwoQSwxPRTrq1IC354HyAPPDXQwwjFa0\nd94Dg\/qOsgCpUE8MtDNAl+G+8gDRgieUwQTo721QHmDa3yFQgtBJQi2X4gBT3naBWi2qhYq0YMyl\nFfy9KtYLeoz1igO8Fuaaf\/dgq09tP\/0\/3ab6shfnP1IEXdhv\/CrEqUsOfe3fzq46MLfV\/Pn5zU9s\n+NFnqOtKseL16upPa2\/fvllz69a1anz\/Berj97HwP2KgSHhnHlWwAAAAAElFTkSuQmCC",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2011-06\/sign_stake-1308782390.swf",
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
	"sign",
	"no_trade"
];
itemDef.keys_in_location = {};
itemDef.keys_in_pack = {};

log.info("sign_stake.js LOADED");

// generated ok 2011-06-22 15:38:57
