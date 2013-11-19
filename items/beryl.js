//#include include/takeable.js

var label = "Chunk of Beryl";
var version = "1343271474";
var name_single = "Chunk of Beryl";
var name_plural = "Chunks of Beryl";
var article = "a";
var description = "Halfway between sparkly and dull, it's an innocuous chunk of beryl.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 50;
var base_cost = 6;
var input_for = [];
var parent_classes = ["beryl", "takeable"];
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

verbs.crush = { // defined by beryl
	"name"				: "crush",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 53,
	"tooltip"			: "With a Grinder",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (!pc.skills_has('refining_1')) return {state:null};

		if (!pc.items_find_working_tool('ore_grinder') && !pc.items_find_working_tool('grand_ol_grinder')) return {state:'disabled', reason: "You could crush this with a working Grinder."};

		if (!pc.checkItemsInBag('bag_elemental_pouch', 1)) return {state:'disabled', reason:'You need an Elemental Pouch to grind this.'}

		if (pc.making_is_making()) return {state:'disabled', reason: "You are too busy making something."};
		if (pc['!in_house_deco_mode']){
			return {state:'disabled', reason:"No crushing while decorating."};
		}

		return {state:'enabled'};
	},
	"handler"			: function(pc, msg, suppress_activity){

		msg.target_itemstack = this;

		var skill_package_details = pc.getSkillPackageDetails('refining');

		function is_working_grinder(item){ 
			if (	(item.class_tsid=='ore_grinder' || item.class_tsid=='grand_ol_grinder') && 
				item.getInstanceProp('is_broken') == false &&
				(item.getToolWearMultiplier(msg.target_itemstack.class_tsid, msg.target_itemstack.count) * skill_package_details.tool_wear) <= item.getInstanceProp('points_remaining')){

				return item;
			}
		}

		var grinder = pc.findFirst(is_working_grinder)
		if (grinder) {
			return grinder.verbs['crush'].handler.call(grinder, pc, msg);
		}

		pc.sendActivity('Your Grinder doesn\'t have enough uses left. Try repairing it or replacing it.');

		return false;
	}
};

function getDescExtras(pc){
	var out = [];
	out.push([2, "This can be mined from <a href=\"\/items\/412\/\" glitch=\"item|rock_beryl_1\">Beryl Rock<\/a>."]);
	if (pc && (!pc.skills_has("mining_1"))) out.push([1, "You'll need to learn <a href=\"\/skills\/52\/\" glitch=\"skill|mining_1\">Mining I<\/a> to mine this."]);
	return out;
}

var tags = [
	"rock",
	"basic_resource"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-13,"y":-27,"w":24,"h":26},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAHQklEQVR42s2YWVBTZxiGueqtd73t\nfVFw6VBr1djWLlZtpR2tOypW3KlgqGgVFa0KKK4QIhhI2BVIWIVgAnEFxAAuqCigsinLAbdqVb7+\n33\/Of3JOFggFp83MM8ycDHOevO\/3\/Vk8PIb4qAJOU9PfaxaB3pw6eKbw+D88LgGnuADdcBU4qIU+\nGUQ0+j7AqP9U8EJ\/lxkFESv0Okr29zY5SxOvMd7bi2DpMa5Aj4OgJE1OqN9q\/9yhOpPivaeHXCS4\nEnRFTsctCLVkKt57etIUnVXtivDKPNhy\/nTYyKcHXVZngowaNyQzW+pQDrZYMs0jKnceOO+B5JDq\nfs6lWNWbLkhurublCMqy9BceYXM\/GMH0uqPthSz9XVDe3wnl7zrB\/O4JXHUhmN1+E7ZezAKlJYMS\nQvidsNGomzeCCXZzNrFOKCNCKGV6+xhK33aA8U075cLbTrD294qpHagphqDyNEowJZ2iJGwwarNG\ndDkwLVHqDS9V\/HcbnKW0QuFrpIViJNfyXjTDZks6\/GZOIaTCJqQsFYLKbML+earZwxa0vOvUlEnE\nSogYShURoQIik\/\/qEeQJ5L56CLl\/8RgI+64bYaMpGTaakRQIFEBplF1v1N7zzY78cFiCJDXOJsan\nxKR4kQegJ+S8bKZkS4i6Ww7rTDpYT9hARBlS4dXFCQnDkOsINAqJYYX5QkoGQQglsl40wRlKI5xG\nnttQt1th7TmtgA7WIRJhPt0UUnW8z5DlTPDYu1hSpVyMl0KJzOf3IYOQ\/uyeSNqzBoqqtRpWlyZR\n1iDnkkRhlBVFzcnWIckZoWfU2detTZgaVonzlCOmJUhJZFKfNkDK07uUZKTvDiW+sw5WGRMpAUhp\nooMsE11v1gW6LVj8ui0HZw3lcL6wSkyMiTEplNEREW3fbdD23oYkSr2MlSUa+BUx8khlbaJYvZZb\nZcwc\/FMOmbdAVinKYWo4W1gjiqUICaEUCiUSCQ1XD6e4W5SEnpsyVpQkUPxLTlFWljBRjU2UVW\/W\nDf4eXfCqxYxyrNJMYb5YYryYTQol4ntuwMnuG6Duvu7AsuJ4WC6wotgmu5IgTRSrX3suafAUDa8e\nmO3lUoQqmRiTQoE4gqqrjhIrUitQB0vPngQ\/hAjaZG2iWD9Lk5ccJEX9y2aOybFKMTWsEhNjYvvb\nKmDXo4tw+HE1xHTWwglKDRy3Y0mRmnASliISWZaoPxFlaaLk8pIEbkBBBzkyZyw1rBETwxuHNJph\nc6OJsv3BeTj6xOqUX8t0sLgojqCmLJGIskTFNImkb+5x+Dk\/xs+lIJ5trFapnFqoMoZUt6flsijH\nCCfXoh9fI1RLuAYBllRYWBgHi4p4HEQFSZRdWKiC7\/WHYU7ucdfnoijXx8vFC3I4T1gjVmovx\/iz\n9QpEdVyVEWTNhQXkxgiKMll7yUXkOsoxXC4LbisuBM5cgp3csSc1EPbwgkvB0OZyiGivkrG1vgR+\nKYiF+URwvkSUl4yjM4qSC+wEZ+Qedfzekv680Tt5ALkjZKaUktlzhpKw7YGFVr6vrRL2PLwE8wpi\nCLEyUaxTKrlAqFcUNBxxfGdJfdagwMMXtxUXQiWTu0YqrBhQzl50J9nyveR\/lpg08IPhKMw2HIG5\n+TGiqFRyfgEvOCk1HCan7YWp6fs0DoJaIsjPHS+Hx8exTl4Oh36HUG9gQwlsulfqlugfZMMXW7Sy\ndObkHnOQnEfE8TlFxj74NHknTMrY0+QgmPT0jp+t2lp6nOBRgXI48DhjeNNlddkw\/2oarKkvgIBb\neYNK+l1OkwkiM6WihJnC9c\/T9lBBxFGwrz7sZI+tWpSLaKuCgx3VEEkGXinc0P+6Hn6q0FLmVaXQ\na+tuF4lsuHtWJri8IsNB0BlfZ0WJcsiU7Aj5opD0zJgennVYLc4Qq2mHZHsxNSboCkx44bUMSkCt\n3i1Blp6PLgy81CHgGRcsP7D3t1VyLL2I9kqXlWG1gwlKmVWmhulnImUy32Yfgi9PR8C0zP0iLLmx\n8VvA88QmbsypUHmCwU1mvwPkaMD02Lw5Q1qxO8w4F0tvPDF5F03ps5TdsiqlTNBsgzEqJeeTvtvb\n6UGNksGNJo4lhTKLrZmwtOYMrRa3F5dkKILTC4+4FLKX81IrreOSt3004AeGNQ2FCpwdZzdDWVwM\n++tzLifCDFMsTC86SpltiRefU+REDCo3\/tRWGK0Kzplg3O\/eb4e+FUl+vleSOHdT+qrwMEzVR8r4\nIj8aFIYoGBOnhNGxweAl\/PWMCRLFcCFw5sZqQqOH\/M1u1nmV9zfGExymIU1kZrnaQcYVE9PCqZA9\nKEuFY4I4r7gQv3\/93Xhy3kFvkkIT3mxa3kH4rjSGpuKuID0unAgiH5\/YZPVUBXkP++cPnIup+gir\nu1KM8WTonYmRmjmvhC0j\/yOmfbJTDJE\/TjVEhk3RR+RM0UeayYtoYnI+qbvAm8zWOE2oGRmfuD36\nE92OMJ\/UcD+3F0F4\/AO5VOUUP9mKGAAAAABJRU5ErkJggg==",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/beryl-1334274790.swf",
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
	"rock",
	"basic_resource"
];
itemDef.keys_in_location = {
	"p"	: "pickup"
};
itemDef.keys_in_pack = {
	"r"	: "drop",
	"c"	: "crush",
	"g"	: "give"
};

log.info("beryl.js LOADED");

// generated ok 2012-07-25 19:57:54 by cal
