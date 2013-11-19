var label = "Star-Jingler-low";
var version = "1343854076";
var name_single = "Star-Jingler-low";
var name_plural = "Star-Jingler-low";
var article = "a";
var description = "A star that plays a single note of low tone for your ear pleasure. Try touching it!";
var is_hidden = false;
var has_info = true;
var has_infopage = false;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 10;
var base_cost = 0;
var input_for = [];
var parent_classes = ["toy_star_2"];
var has_instance_props = false;

var classProps = {
};

var instancePropsDef = {};

var verbs = {};

function onPlayerCollision(pc){ // defined by toy_star_2
	pc.location.announce_sound_to_all("BIG_STAR_1", 1, false, true);
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
		'position': {"x":-23,"y":-41,"w":46,"h":42},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAABsklEQVR42u1YwU3EMBC8DiiBEngg\nEYcPJVwJlHAlUEJKSAnEh3jxOCUnfkiUkBKuBPA4zl0uODkTr+1FItL+Emc869md9Wr1\/zB6aike\n2YJrZLZuZP61f7m74Qmwyp8BsK7Ejh2499f7a4Dro5bZhhXAvRRPZwCr\/ADQfMRRiXYIkFWqe3HY\nI1szEIcopwAi1R9vt1fJwOHn0+yZUOpOWJizzUWAKVNtE4c91aKNnupmmz+4sXdMdcFGHDNM7nAm\nUTf18VCbJK2XWBCGYFyYKQLHwGyg6NZX5Uv9z65MDUTtUL2Mj1AuqAE5gYY76oCIUqNPAGL6zIry\nxJhxIuzAjVtWqlSOus\/nfGdIyCbAOdVLnMvYbP66mKM+xRIOyFg8KoRm0wvciM02WK2jMQb0LM4q\n1mcooowItt4vSOboEOaA1MyGLN7YfDTn3BvTrm06fuM7szgNRqYTDP2baZtFcCW7WPu5NGlveYHN\nYAJBK3RV4dw6Xkq2CQRFe8kFEYAgpaRK\/rGgAuw76OihadCZvJQ8ZI1yAD9zS0uVfBSIUmOowbtz\nSwtvwiZHvwAXoH\/2Yv4bOnW3gQegmqwAAAAASUVORK5CYII=",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-08\/toy_star_2-1343854076.swf",
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

log.info("toy_star_2.js LOADED");

// generated ok 2012-08-01 13:47:56
