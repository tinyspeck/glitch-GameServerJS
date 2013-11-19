//#include include/takeable.js

var label = "Showy Sapphire";
var version = "1337965213";
var name_single = "Showy Sapphire";
var name_plural = "Showy Sapphires";
var article = "a";
var description = "A somewhat showy sapphire.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 5;
var base_cost = 400;
var input_for = [];
var parent_classes = ["gem_sapphire", "takeable"];
var has_instance_props = false;

var classProps = {
	"collection_id"	: "gems"	// defined by takeable (overridden by gem_sapphire)
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

	// automatically generated source information...
	out.push([2, "This item belongs to a collection which grants you the achievement <a href=\"\/achievements\/trophies\/gem-collector\/\" glitch=\"external|\/achievements\/trophies\/gem-collector\/\">Gem Collector<\/a>"]);
	return out;
}

var tags = [
	"gem",
	"collectible",
	"no_rube"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-16,"y":-21,"w":31,"h":20},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAIZklEQVR42u3YCVCU5x3H8fd9d\/dl\nL3aX+9gFBK9gLCQ4GsIhOkTFwh4iiCKIRq1a05DRTGo1ampadRyrHdvJkNYKSoxREVQORUARNboR\ng0ZRQBDH1FoV2KioIMev\/3cXVEZoSWM6nQnvzHeEccb5zP95nveQYQaugWvg+gld9fXQ\/D\/jpNev\nY3xvfxcfD\/eAgAczOM6SybKNZoZp3MwwFuP\/GhhMzen+PSYKYbFxbSuDgh+Xu3nf62QlTSBcjwhq\nodIZpiGFYZrUPyrwWi225Odja9IsZOintTcERLSAdXsA1uk+WPU9sIrvwNpZwIoaX4A+AzfkEDiV\nsD4vY2KvUFNoWdfUVHceu32781HZmU4k\/KoNQ8e3gvN9DNbrIViPZrAuBHUgqD1B5YTkaZpc31Ah\nOXMj3YEp\/2FT1TGQrVr15M9ZWa3tdXUdWPmnTkxb0o6oeW0YZXoCTeBjcD6PwGoJ6k5QZ4JqCKmk\naUoJKm7qE6hmq6BjT1f810itFk6rPmwpSEt7hK1bH+FYaQci53eCG90B7vV2cD9rA+dPkxzaAs6P\noN4E9SSkKyEdaZqq7mVv6nXZndlyeHFl8GJPWrSMOfB74UwmDF637nGtgOtuz+77WL4GSHoPGG4g\n6CiCBhJy5BNwrxB0CEEHEVLXNc2ny05IGU3zuUMklTbBlT1FwGLqGHUCWuZ0Sr9wv1zQpt+0qeV+\nWloLtmxpxqJFdXhr\/El8tOQrzI0rxfyUKixb1YrFvwECYwkZRNMMIOgIgg7rmmb3srs1Pz1EGo97\n8NA1wM\/zItzF2fAUfQZnLhda7jABS6DjjhPy5OZ\/i1u+vG1lWlorNm5sRnJyPUJCyikzpk0qwvzY\nIsw2FGK2vhBzjMV4e\/p5LP3gARYv60SgqQOy0cKyP3m27HSI3GmPhke34s3xjXjVuxRe\/E548xnw\nlmTAS5wBDbsbKu4AHLl8uHNHaE8eg445kfPCvvz0U6g3bHiSu2L5PUydcgNhIVcQGnKJuoCJEacx\nh2BC3cAUoZhCzJx0CMnG01i44BaWfNiJsYkdGBTZjgmJ7Uha1I6Q0GoMcirAILsMDCKYj4B7Dugp\nyoA9u5fKIWguHZxDtPTF8GRKK7TMCdu+TEho9X\/3neaKqIn\/RHjot4S7TtVRNdQlJEUX9wnsbrah\nCIuSKzBv1jXEz7iFoAAzfOQ74SslmFAfQB3lxO0g4G5qH+yZA\/RnPnUYTkyJRcOURTDhIffTw0Ob\nCHeXEpA3KWGK9TBEfoW3jYXPgPregamzz+B3K2qxeNY5+LrmInhILvzk2\/sF1IrSCSQgdxFwL5RM\nNv18kCqAjC0DAVuM4aHNhLqHZ9BbGB92jSBF\/QKuXFJpBQb65UMl2YegIYV4TbuvX0AhF24bgbYT\ncCfdwLPAM0cgYk5R5nrrMo8NbbGMDX1EsPuUhWqAKaoOs4yn\/iNw7pQS\/J5wc6efg714H5SiLDgr\n9yPM\/zCGKDP7BfQQfQ45LbOEyYPYijtKHaffC2ynOjykI31saBsISj1E5LjvEG+8S92hvsVMw9e0\nz4p7Bb7\/i3Ir0NfzMJR2B6Dkc6AgqL+uAEFeOX0CteJMuIjzoBKbIRddgR13lnD7qTzCHaaKoGD+\nZjso4YP\/aowIA+E6qFZMjW7ENCvwLuIIGWcQ+gcS9FeQrC\/rAVyzrBqmSWegVByCUp4PpTQXCp42\nO78fwcMPYbAwxeeA7vxBOEpOQCmuhFxcZYuAMkrC5BMsm5AH6efd9T1uNRFvNFkE5M8nPESCsYGA\ntuIEpOGuFTlVf9tanP46EmPO4p1kM1a+XwMXl2Io7Y9AqaQpygugkOUR8iC8nPPxOk3Ry24XXPjj\nUPMXacI1UEpqaMo1hKvuAlYRsApS9gIBd1NZ9Ga8tudNe+zom+njwjsQb2jqAYwXkAYbcqpe6A5i\nCRkbcxtLUy0IfvMyFA7HodSUQKkqImQhFDRNuawAUrsjGOZbCUfFNaj4WppqLQGvEvBqF7ALKaq2\nAmVcFU2umIB0i2Im9nw+C8tsiGpGgqmRgMISNz4HtGUD3iXgHSRPb8C8+U3gXWrAO1eBdzwPmcOX\nkKlPgFeZIVF8DYmsHArVOfjpbhCwrgtISWoJeJVwV21IUQ0Bq61AO\/YS7b3N9b0+6qJfW5eeGJWH\nFOOXTxNOcrLBVpL+DBL132A69ev3\/o6hAbQ87hchd70AqXMFpE7nwDuUQaoxQ2p\/GlLlSdgpyuDt\ncQae8jK48kdpqY\/CQ5JDz+McuNEz2ZooG65CXDZ82PXwZ2JS+3wej1H4Bo4bnlo\/Y9Je6y2mt9vM\nwunHkTijEvY6urV4noW9uxkK11Ka5F6IHbdDotlFkzwEhboECvsiqGhvjnTb1+dtRkePPB9uI\/yY\nmPpXGdf+vHqtVzvxC3LGDFuBmZOzXgAuXVgBjxEXYe99HkrtWcg8iyBx\/wIS188hcf4MYqcdBM2A\nnSYHctqXClUxPOiZ7CfPfAHoLfoE3mwMHYpR9Dnw1vd9ed2WopKssLwxYjUSo7KeAidEX4Zq8GXI\nfczgvfIg0WVD4plFyD2QuO0i6E6CZlqnKXbIhFSdZ53mEMesp0AfgnlwSZAxIfStYlj9A178c2nk\nJRVq2XoEj1wN0+QCaPzpxupXCokv4XzonuW934bUEtJjz7NpunRN0yEDvPoLaNS58JFup3fAFDoI\nQQSLpq++iRNeylcdx3yzmWMqIVN8AE46jb454ul1Pq6rqfSh1F0svT0LTbElNnVlpFd\/E53SMQSb\nTE2pZJjIYS\/54\/OmkWXKLSz7EfrXx9RaagP1B+qPBEulTAfoH+N\/pC9k0Eb+bUTvraU2UJuoLV19\nQv2F2kbtoN4NG\/hPpIFr4PopXf8CiplfvdnEzTEAAAAASUVORK5CYII=",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/gem_sapphire-1334609660.swf",
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
	"gem",
	"collectible",
	"no_rube"
];
itemDef.keys_in_location = {
	"p"	: "pickup"
};
itemDef.keys_in_pack = {
	"r"	: "drop",
	"g"	: "give"
};

log.info("gem_sapphire.js LOADED");

// generated ok 2012-05-25 10:00:13 by eric
