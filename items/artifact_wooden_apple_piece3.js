//#include include/takeable.js

var label = "Piece of Wooden Apple";
var version = "1350087250";
var name_single = "Piece of Wooden Apple";
var name_plural = "Pieces of Wooden Apple";
var article = "a";
var description = "A splinter of spice tree wood that makes up one fourth of a most wonderful apple decoration, fit for a mantelpiece.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 5;
var base_cost = 0;
var input_for = [];
var parent_classes = ["artifact_wooden_apple_piece3", "takeable"];
var has_instance_props = false;

var classProps = {
	"collection_id"	: ""	// defined by takeable
};

var instancePropsDef = {};

var verbs = {};

verbs.pickup = { // defined by takeable
	"name"				: "pick up",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 50,
	"tooltip"			: "Put it in your pack",
	"is_drop_target"		: false,
	"proximity_override"			: 800,
	"conditions"			: function(pc, drop_stack){

		return this.takeable_pickup_conditions(pc, drop_stack);
	},
	"handler"			: function(pc, msg, suppress_activity){

		return this.takeable_pickup(pc, msg);
	}
};

verbs.give = { // defined by takeable
	"name"				: "give",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: true,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 51,
	"tooltip"			: "Or, drag item to player",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		return this.takeable_give_conditions(pc, drop_stack);
	},
	"handler"			: function(pc, msg, suppress_activity){

		return this.takeable_give(pc, msg);
	}
};

verbs.drop = { // defined by takeable
	"name"				: "drop",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 52,
	"tooltip"			: "Drop it on the ground",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		return this.takeable_drop_conditions(pc, drop_stack);
	},
	"handler"			: function(pc, msg, suppress_activity){

		return this.takeable_drop(pc, msg);
	}
};

function getDescExtras(pc){
	var out = [];
	out.push([2, "Collecting all the unique pieces gets you the <a href=\"\/items\/1315\/\" glitch=\"item|artifact_wooden_apple\">Wooden Apple<\/a> artifact."]);
	return out;
}

var tags = [
	"artifactpiece",
	"collectible",
	"no_rube",
	"no_donate"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-15,"y":-16,"w":30,"h":16},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAHoklEQVR42u2XWVCb1xmGc9naYIQk\ntIKEBUgCzJYYsDEggnHMLolNbEIsArELsNgEWsBgMDZmhxBjExPA2wRaJ247bVqn6UUuddVrZnrV\ndOLoom1Krt5+52cSN9M27bhpmulwZs78QvzS\/5z3e7\/3HL3yyvE4HsfjeByP7\/+oKPiBZcIR73O0\nqOYyU3iW7x1gbvoPD9LPBsDTpvT1WSP92ed50KXyDgw5Qo8xT6j7n8LlvBYcFK85ieS4QNgMpzDV\nwfdP9cf4qvVSZJ3joTBbiPpSKawVMl9zpWzTapLpv1PAxJgT+njtSbx2JhD67AC423gYagxEk0nl\nnxhIQq1B5i+6KERprgiVhWI0lDFYuZ\/B2kzyhP86YKz6xMqXgF0VgRhrCcBkWyBGCLKnNhCDNjmc\nHZEY61VjqF3LgFGWJ4KpQOSrM0p9NQbJQWOZdK65SqJrqpYqv3XAM+oTvlfPBP6pozz4z3eHTmHT\nGYQtdxC2vTzsTgTjwVQwtui65uJh2SXAmxNqzDjPwNWlQUulnBSV+UwFYl95voiDrSuRorFc5msx\nyfabTVL7fwxdnHUC852B2Bg4hX8G+PgGH3u3+HhnSoibA1K4O+Vwdcr9qxNaLHjV\/nmPxj\/Wl\/BJ\nl0XJgP1VxeKDinzRQXWx2FdrkMBSIuVUfin\/2i18v9tyEhv9LwBn7TzM9wVjsZ+PlWEBloaFGLRK\n0FsvIzgZehsU6G9WYqT9NDzdEbjacxrLY+GkbuTB3Kj2YGYw1n9jJBb9tig0VYT6DW+EIOdCMHJ1\nfNQUi2ExSp5VFYnnjJcF+pJ83jcrbDfzNh2mAAzWBqHRKIC15KghqGyoLpKAfIbmCilWR4T40YIA\n760IsTEhwXCrAsPtKnh71ASowPWBSNxyarDk0WLVq6GpxbJHg43ridi7k4F786m46oiDvTGKvlvy\nxxq9+GPDJSHyswS4rOP7c9KD9ymDPekpvK83XpuZp8tPD0ROGh+FrwthvCTiACvyxagiwI5qMXYm\n+Xh3lo\/9eQGeEODT9RB4u8IIMhzuLhUm+yIxM6jB3IgWK95Y3L2egN1br2JvNQVP1lPxkzvn8NEj\nHT7ez8aHj1\/HB\/ez8dF+HnZWLuDBmg6j9lhfa3X4AakKNq9YI5\/t3b30In\/TkwOfZZzlISs1GJcu\n8FGQLf6U5Z8hJwS1VJLFQQHuTx8B\/nhJiH2afY1KDLaEc2X2dqsw5YjC7LAWa+NxmB2KwVsTiXi4\nkIL3b1\/Az+6m44OtDPxqOxMf7ujw692jyf39UIf3N87T\/bFoKpeSMCKU5YbAagqDw5bwGw7QZBQl\n5BBYXqYABVlCLpwLs8XPC7JCPs\/XSZ4XXxR\/zj7IfOi0SeFslXM+XHTJMGZXkC9VuHYlCg\/Xz8PV\nHYmOmlCCV2LRrcH2cjJuDGrx9kwSB\/qLexlfzZ+\/nYGf0ntsEUzxZbq\/vzXps8pCEQdqKQk7\/ErF\n9jq+PTczCHpS7W\/LbDbIydhSVFFI1+olaCiVcfHSXReGeacMni4Fp+KiNw6P1tPQWRtG90jRSwpv\n3krCuF0FT+dpLLhi8d5baRzM042jyV4\/oc8wuLXxaFqwhvwcAQZoKpIfdjfEffo1P47YJZvWkiCu\ntCWXRSjPE7NVoK1ahU5zBLrM7BqO9holqaSgGQa7JQxDNiWmBzTYXTmHqcEYWKlUJnrIGMGtjsVg\nkxpld+4sHiwk49FiMh4vpXDXd24mEVgMWUONaQdtBmSVztpQem4IKotCD6nb8Xdd7emRbDbqeTC+\nwbzwopsbykJhq1Kiq05FEaOGs00LV0c0+S+aQLS42qslH2px0xmDkTYVBXkEKKw5pfutSrr3NDWR\nGktuLW5PZ3y2eu3i72dHzz13d2u+YItktmDbKIMqJQ82mBJ+aypS5\/3D6Ll+RWKpKhSimPZgpmIl\nBynmIoeCmO3FaGPq1YcTbARG26M4yJnBOIqaeCpnAnVzIsHEUdlisX4tAbdJxZ3ltC\/evZOG9elE\nTJJnPeRdd4eKS4MBytUrTQrO241lisMqo\/b8N+bjtEudUJInepqnExxFTqGEOywwWDPtDnS6QWtV\nKJU8jFOJfbGDlBq2hZMvI8l7UQShxqwzlpolHlvzKbi\/koptKu\/Ocgp3vTd\/FjNDWrIIAwxHT70C\n7bXq3zlaM7P\/7Z3GnBegazTyD5xNAvSaSfoSCWqo5F+qWl\/CnW64xmmnMvUR6ADFD1OFNQ\/rcA9l\nJYuicXsE99pJ\/2NlZ9PRRLahRbaY5Gitid4qLw8Oeqk9e8vF0+1MCvZ3rvKwMiSAt13E7TCsY80G\nKQdtIqUr2Eknn4GH\/cVarjhk0I6WuD\/0WBQcCPMaawR2tbHDBi2wjg4ZZqPk2zkYb0\/wlLtTwrlH\n00L\/zmQwHA0STkH2MFvV0ZWp0UzvNVIkNZFnWTSxhVjIw2aKqppiCRdZ9aVhhwTnaXlZ1f7VeLoR\nrdxflM+96RH7191C3PYKcWc8BJsTIVjziiliQrE+GUoHikjaEtVU8ihqhHB0N8R80mHRLvS3Z0m+\ns5P5L7ejlXvLMj3t2Z79OZoLfA8dLDxL7nDPaKfWM+fJMiy6knRsHv9MPR7H43gcj\/+j8VdhKVg4\n97WnQgAAAABJRU5ErkJggg==",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-09\/artifact_wooden_apple_piece3-1348254334.swf",
	admin_props	: false,
	obey_physics	: true,
	in_background	: false,
	in_foreground	: false,
	has_status	: false,
	not_selectable	: false,
};

if (this.consumable_label_single) itemDef.consumable_label_single = this.consumable_label_single;
if (this.consumable_label_plural) itemDef.consumable_label_plural = this.consumable_label_plural;

itemDef.verbs = {
};
itemDef.hasConditionalVerbs = 1;
itemDef.emote_verbs = {
};
itemDef.hasConditionalEmoteVerbs = 0;
itemDef.tags = [
	"artifactpiece",
	"collectible",
	"no_rube",
	"no_donate"
];
itemDef.keys_in_location = {
	"p"	: "pickup"
};
itemDef.keys_in_pack = {
	"r"	: "drop",
	"g"	: "give"
};

log.info("artifact_wooden_apple_piece3.js LOADED");

// generated ok 2012-10-12 17:14:10 by martlume
