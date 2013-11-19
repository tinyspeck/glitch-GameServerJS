//#include include/takeable.js

var label = "Figment";
var version = "1337965214";
var name_single = "Figment";
var name_plural = "Figments";
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
var parent_classes = ["mental_figment", "mental_item_base", "takeable"];
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

function canDrop(pc, drop_stack){ // defined by mental_item_base
	return {ok: 0};
}

function canPickup(pc, drop_stack){ // defined by mental_item_base
	return {ok: 0};
}

function getDescExtras(pc){
	var out = [];
	return out;
}

var tags = [
	"mental",
	"no_trade",
	"no_rube",
	"no_auction"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-18,"y":-37,"w":37,"h":38},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAFgklEQVR42s1Y7VIaVxj2DrgEL8FL\n8BJ6CbkELoE\/nSadTsbJNENMm44SzRixiqY1jQO6jcTPEslHRZAo0QTUfLCImmhkPT3PYV\/ycthd\ngilOduaZXXbPnvc5z\/t1lo6OcxwZYXalhNnNgfs4r1lmX6pSNFKW2bNWMS+lRLGz46IOENuyDo1t\n61AAu9YHQdfrlVJOkhNOSFXMyIYo+gBJPrd6+l7M7WVz8ULanyhu+P43cptW2SyffRIfziriRFgK\nuC6endShJMeUbbyzjsWWdQCSSRAl0snDgogXMmJydck4FyF7tQZXAkpxcsDh2WkduX1JSn\/+1vrY\noOqTo11F8H5qWYTnZ7pbJmjHU92keetIqXIgjeKsK0c4ks+xEKBkj+PzPD9+I+bfbIiHr9fEeDJu\nhhNRX2sJIF0hg9ykCaGAG5kvgZOCwOLbTTHz8rlUMGZ+uXKSWFq+XJBqIX7IiNmEBCUN4ZX8LWNW\n3c9aJZGRwDXOpOLcbla5+Y9n82J02VBEhxdilzwJ4uWXMqjhJh5LB1qscey5KMSBBWMsFg3CyGQk\nCpEEHqQTIrwQE6Nz051NCJbryAH7HjEHtfDeC2tfIa2Rg3KI2WMZk\/AExtAzVXJsksb2qiI4PB\/t\ncSQnJ\/ZT7MGoaZeMkktcUQ3M2u6jZ1CLCMDNlDhYaEkjSLFIKlYJxgyn2OvhL71iBp2AOOPj9WeI\nMdxHDfxcH6tnikMCMhrkkNUgGF6I9jUSZDUPq26WueRWAAryZzn5\/uP91yrGOBHcB6hQY8xycatG\nbizxkFycG1mMfqfHXoAm4tnrBt1NUApupvtkGNf\/fnqnyPDx1En0BOG4uzTTZRflYidaETfGSepq\n5lmMOQHufbSzrvBPaVudQZiPefZxr0YOZFfKeZUsqrPUSNqulo070KxMUIbq8UOAQiCDMwhxdZbe\n51S28vGkMEjp91RN5Mkym08byCRMDsAlzQgTacpktaM5KSplnAjy96AWPcOiSHW6N74SbyDYxyeE\nkWbkcnb5cGppvGwQkKk8KdyAZBlZnCaCkaqLC5udkqRJg2CAF1I9wBVOi6qD6NnrRtAL6Mexzaci\n+iJZy2QF2uXEdzKBZpOQAgCuEdhpl9jUXdwME0\/mFKE7s3+J0PQ9MfD3ZKRuC8bVg3EqnF5AcFMx\n5tmLeNMX5TUftTeg989hcTl0Q\/zQH6xvdbP5TJJewEYSbm1FAScgEXiY0H2UEexecAa4S69HBhXB\ny\/036lvd7E62u5lBuI2ym+9AnKB3EE5wan2llgQcA8ak+HHgZlXBULBxyxXfy3QhFqfWH+ec3EDq\n0lbdy\/Vu23sOJASIDT2aErcejNXINainH6jeqEPkAgQwJmvFvSgllFDUSdwI8uSAi2X8ee+u0f+w\ns+XygyjVKJSDr43P2seS5uZrv9+uuvh20PsjCjvakYXpACq5ThaKuhkFedQ0r4zFGADtDHHXFx1X\n2Xv17m+UwWZLX3eh2ISfE0SAkxHsQDhhZCcRVF9sMlQofnm9I\/SE+4lURJ4DwPeD11v7J+JK+Kbv\n6nBfDpMBcAMZQIBDBfoNglwx9X0hlQJJ9fWmuRSqQTHY+Kp\/FTDBlVCvHyvEajEpVg4DCHAyCNWc\nksAJeE+RG+jtasv\/NGjkulG4n4qwU63jyrOYS7aFIJLISyEvICwAam3fHMGWy8p5DtRLfNycl9wv\n90eUgsF7Q+1xseo6iagP2yLaGqm62SJRx2\/gthJejPlhlCALcRLF2J0gvODwHXxRh2qdGqngxJBy\nLy9RHD+PDRoXSvLW1GgOmwEihAxGcoAkkYLKuI8xbctstwNbKBj96c6vqhvVtlYMKNp2y1O\/0Rgu\njCC6BfVaAMa92huR7PhWD3yTEMH\/AKwJ4km0\/k6YAAAAAElFTkSuQmCC",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2011-08\/mental_figment-1312586364.swf",
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
	"mental",
	"no_trade",
	"no_rube",
	"no_auction"
];
itemDef.keys_in_location = {
	"p"	: "pickup"
};
itemDef.keys_in_pack = {
	"r"	: "drop",
	"g"	: "give"
};

log.info("mental_figment.js LOADED");

// generated ok 2012-05-25 10:00:14 by eric
