//#include include/takeable.js

var label = "Signpost Permit";
var version = "1337965215";
var name_single = "Signpost Permit";
var name_plural = "Signpost Permits";
var article = "a";
var description = "";
var is_hidden = false;
var has_info = true;
var has_infopage = false;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 0;
var input_for = [];
var parent_classes = ["signpost_permit", "takeable"];
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
	return out;
}

var tags = [
	"no_rube",
	"bureaucracy",
	"no_trade"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-41,"y":-29,"w":81,"h":29},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAHGElEQVR42u2YbVSTZRjH+cCXvuSH\nOqcPvZhZvmWpRSUakp6OlVqeyjLsFGZax46Khprmy1RIOygOBoaCY7xLIDJgjI3NDYGxV9iYvGyM\nbSpoWCqd+NDHf\/d1t2fnQcpY9OIH73P+Z8+9PWf3b\/\/ruq\/7ehYVdW\/cG+MfdrNWctfCOczaRLtZ\nA1ubxthhOj\/5rgNkYEECJLkc+mFft2nlXeWew6JFvV6OorojKG9Ih8ulhd9jCQY9liS\/3zHp\/4Nz\n6CaRY02mcnx39muuVkcFqvQy1OhzOGjAa4Hfa6kOeq2J\/zlst6upuvuiAbnn9ofhbC4ll6Y1n79H\njhpMpSJYs5MDM3eDPlv8KHksK9kPkVwfdEt\/vRWYWC7Tl9GC5BSBkGuXL1ng6lLD198Mg6UE3R49\nfhjs4Nd5ygOoMeag1nASjc2FHNrRrgqDC7rks+HnH73GCcEFAh2TAx7zMH2h2VbNHSSwM5pj4VAT\nLM0FUIImkbMkYU6u07xOn4dedzOGr\/diwu6xDWAU\/2pvTwt3RVGTEga8OdSFkZs+DkruEQhJ+Jwc\np3uEnL3QWon+XjOcdt0ZtsQ0pil\/L7QsR8Rwt4scrTeeDoOQKCcJhMJNcwImOCFPS1RpcHcYMDTQ\nOTJ75rTVbJkVIcgIQ+u1zhHDNOkr4bnY\/KewLZYKnG2UoUx9lLtUqDrMgSgdSHRN6dHp0vH7dery\n0hBcXORhZSWCapuwuLtdD1VNAb7LTkVbcw0c5gbcyVna7QRMqSAWpQd9fvWSU+ze\/ZHDsfIgdk4M\nSoBFBVI+p+s7gQo7dTDYDlZO2I718FwtksukIbhZERfjLqfR6e1q5UksQDSrS1BbkA5bQzHM9YVQ\nFWWgtUaBsuxD0J7Jhr4sC\/XZ+6E+IYFO\/i2\/r6ksk7+S6H2vVc3hrg+4h0JwS5iiIwJstzYahXOW\njrTSIhl37WzqJq5DX67FqaTVaMj9Bt8f\/AJVinSUpu+GqkqOvMPJHNysKYP6VCqXrjAdtbK9\/F5T\nbQF3UOTeQxHB+SqyFD72a90lGbA3KSGASg9vR1VOCrIS4uE0nkVm4lLIkhKQu+ldFO\/dgHK2eD6D\nPv72izi1ez0Kd3yM4zvXoWTfZ\/xalXcE+VtXg6LCNpk7BBcbEZzng9hg23sLUfv6XBQvmY2yZTHQ\nsvARIC1UU5yJrLTdqJOzEtGm+j3ULXXIOpSEYhkLa9FxyLe8j4YiKZRZEqhyj4Tnuu9zUMdcHAg4\nINmXvIst91pEodVkSBSn42dhz3NTsO2Zx7i2z5mMzAXTYVIcC+eQoNrMvahM28GvTXUFaK1VsNBK\nOWxp9kEOJLgfaslYt2NmDrYI7o2\/KDvrixWahMXYNfdxJD87GWnzn8LR2GlIeWEqUpncHy1GQ843\nY3Ym7exzlXkw6CrQe7GFy2HRQMlyUZ53FE3nq9DZfh5driZ4WGhvXOvGxs\/Xbo6o5rVbGhWOrR+g\ncflz3LFjDIyczImbidxFM3GUwQaSE5D\/1nw0qsvGQFItpNqorivmYAIogZGE+eV+OzpsWl3IvQfG\nW4SNPeywJjjKO3LwxMszOCCF9is2l7JXK0v8dAZObonroLj+ebtbOWSBPB1tLC8FMBK5JzrSYsZ1\nfIlPCOX2TzjUgZgnsJfl4JGXnsTBmKnIiJsF84eLcf7N5\/HtwplhQLGoWFOo+7pNYecusNBSqAUH\nA31W4Uj7641xfbAzkVX1YfEiHZozUL8xDxc3LIPqjbnIf+Vp2FbFwrYmnr9P7u3ZuOYPj7a+HhMu\nGM5xKHJOHFbBvYDHMjTu0NIYGfbF\/3LTJ71xtWvY19PGQmaAbOF0HmoSlZiTLAdTmIubZz+Kw1sS\nx8BRmE0XlGHnxLknntPOVeQdp6I8J+JmwFhb9qBBW1lgrS8d4S6x8BIUlZhPZzyM9c88Dknyeg4j\ngFEnczo3jYebwkvzK34Hc7JtFJjgXqgovxbxcRYaVMlXrFr+6uZtS2L8B1gYd8Y9i6R5U7lrhobR\nu5ZgaGMIjYN4k\/R1tyDYZ4GltY7NrWDPG6z\/68Fby5euG3dobxuPhA5qyo0VtMOa9dVKasE1qlK2\nkGpMvpGT5B61WyTxpikvPcEe4uvx07Xfu2pSaGNMm+BzGu\/D5gigsozUlIFA+4jLrmetuH4UIAER\nmGT\/FmRI94+CpRyldkqAG\/A7\/KGCHB31D41owVVyk4rqtUvOMUWZwkqhJjfJNcpDoS+kno\/gbg31\njryzctlH7Lvu+7cef6kFiqNDfehK59DV20DFIafThU4Sgmy3asSN6ANR\/8EgR+NowcFgBwcNsqL7\nR7AE6bRr0eNqMv\/tp7MJgsZQfrYYlcorfvvQD5ddvHUSRPMr\/Xb\/kkWxC\/7P\/42iQ+7EUI5VV8hz\naaf295jdJMm+7Wvutn\/hokO5Jig66t64N+48fgPcGSFLiu+hBQAAAABJRU5ErkJggg==",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2011-11\/signpost_permit-1321583136.swf",
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
	"no_rube",
	"bureaucracy",
	"no_trade"
];
itemDef.keys_in_location = {
	"p"	: "pickup"
};
itemDef.keys_in_pack = {
	"r"	: "drop",
	"g"	: "give"
};

log.info("signpost_permit.js LOADED");

// generated ok 2012-05-25 10:00:15 by eric
