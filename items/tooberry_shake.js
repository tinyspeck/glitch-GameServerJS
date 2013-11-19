//#include include/drink.js, include/takeable.js

var label = "Too-Berry Shake";
var version = "1347677188";
var name_single = "Too-Berry Shake";
var name_plural = "Too-Berry Shakes";
var article = "a";
var description = "A berry tasty too-berry shake.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 24;
var base_cost = 76;
var input_for = [];
var parent_classes = ["tooberry_shake", "drink", "takeable"];
var has_instance_props = false;

var classProps = {
	"collection_id"	: "",	// defined by takeable
	"drink_mood"	: "5",	// defined by drink (overridden by tooberry_shake)
	"drink_energy"	: "5",	// defined by drink (overridden by tooberry_shake)
	"drink_xp"	: "0"	// defined by drink
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

verbs.drink = { // defined by tooberry_shake
	"name"				: "drink",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_single"			: 1,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 53,
	"tooltip"			: "Gives $mood mood, $energy energy. Grants 'Emberried Hiccups'",
	"is_drop_target"		: false,
	"effects"			: function(pc){

		return this.parent_verb_drink_drink_effects(pc);
	},
	"handler"			: function(pc, msg, suppress_activity){

		var failed = 0;

		if (this.parent_verb_drink_drink){
			var success = this.parent_verb_drink_drink(pc, msg);
			failed = success ? 0 : 1;
		}
		if (failed != true){
			pc.buffs_apply("emberried_hiccups");
		}

		return failed ? false : true;
	}
};

function parent_verb_drink_drink(pc, msg, suppress_activity){
	return this.drink_drink(pc, msg, suppress_activity);
};

function parent_verb_drink_drink_effects(pc){
	return this.drink_effects(pc);
};

function getDescExtras(pc){
	var out = [];

	// automatically generated buff information...
	out.push([2, "Drinking this will give you the Emberried Hiccups buff (a little pep and vim, every 10 seconds)."]);

	// automatically generated source information...
	out.push([2, "This can be made with a <a href=\"\/items\/7\/\" glitch=\"item|blender\">Blender<\/a> or purchased from <a href=\"\/items\/439\/\" glitch=\"item|npc_jabba2\">Helga's Liquor Store<\/a>."]);
	if (pc && !pc.skills_has("blending_1")) out.push([2, "You need to learn <a href=\"\/skills\/43\/\" glitch=\"skill|blending_1\">Blending I<\/a> to use a <a href=\"\/items\/7\/\" glitch=\"item|blender\">Blender<\/a>."]);
	if (pc && !(pc.skills_has("blending_2"))) out.push([2, "The recipe for this will become available after you learn <a href=\"\/skills\/67\/\" glitch=\"skill|blending_2\">Blending II<\/a>."]);
	return out;
}

var tags = [
	"drink"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-9,"y":-37,"w":18,"h":37},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAIS0lEQVR42s2XWVCaaRaGramumruZ\nqslczN3cztVMdVVPdarSSSdkdUnMokbjgoAibiCuuAUVF4ILCuIuqBhxAYwIuIEkuLUJbh0kMSFG\nI3abTKaN1UlluufinQ\/iZLqrpy+mq\/44p+qv\/w6e\/33POd\/7+fn9gjI4tn9vXvk6xOT8OnZ4abPW\nsLwp8L6HF57WDv3gMSxuaIyLGzbvY1h4miMU2j7yo7JMi8+CTSueJpNzp3Dk0V6E2f0tzfDwFc3g\nfEnTr+zQ+hc8tJ55D61rfoOmnHHTWu88pLVanbTGsRVap90V3ze3JtbPu0uHFz1\/oQTQuLQxZd18\nc9668U\/a2MZb2v8CKDcv0KSGeVqX3cUnvyOlBHD8\/rOqkeWnw8aVrVGzc0dsdO7wDV9+xTc4dyL+\nG6B61h3RN\/uYr5l+yNfefVyvm39k7rY6qkxLm0JKAG2r23KPxxM4aBge6ew1LBgG73+vM69iwLiC\nXsMieobuoXvwC3TqZqDS2tGisbypbzHMd2itBuvsPWVTU9PVQ4cO\/YlywLk7d+dmute+v93sQhvX\nhFqWBhXRLbh+tQbZF0uQ7J8F5slERBylg3EiEYnnuZCLFLsSkSSVcsCtxT35omEDS7ot\/N0B3Cqf\nQ2ua4SeAcadSEH+Si8TT2eAGZ6MqX4rCuFKwjmV0DC9tDFICOGpdn1jSerBs2IJDt44JxQqUfPNP\nFEwLKkBqQC44p9ORciYPCYEpuJEtgTRNieyz1aAMcET3BM7hHbjGdnzqzXQ8QlvasA9QQldBdE2B\ngtBqZAWLwA3MR0Fwnc9idkAy6vJaIUtTI\/5EOiizeMKy4bIp1rA+9xKrxh0s9G1iXLb0s4BeBZm0\nZAhCytEhGkRNZhP8\/+xPHeBN7dS8RmyCc2wby0NbmGxx+iyWxfWjKlaN8qgWFF2VI\/eyBNnBFaiI\naYMiRY\/mTB2qBfVICk2mFrC9fcRVm94MU4cFI23TGG28h0HxHFSZo2hPN6GFZ0BDig61nB7Up\/Yj\n76rEp+C1I7HIZuYi4VICtYD1Vf22usxWmDtt6JeaoSzUQZ50E9UMNSpjOyGOVkIU0YD8y1XIvFCC\nlHMCsGipiPyMicyYbLAuxFEL2Nlnt1UmNWC06za0taPoFA5BQZSqi+uFlKlBJb0L5ZFkmkNqicVl\n4PrnkVXDQ\/TROPAjMhEbyKAWUE0AyxgyjKnt0NeNQ11kQjNXj3o2UTJOixqGBuIoJYRhcuRcFIMX\nUIiEU3zEHIsHN5S8z9J9gObFrc+pUVBzu6ScIce4egp6mQU3i0fQSvqukUN6jz0EGXMAkuhOFF9V\nIPeiBGkBQiSQSaZ\/zkbSJS7CT1xDdFA8dYBeayoY9TC22jAom0RP8RiZYhNak0bQkmgmKuqJzd0Q\nhTci71IV+IFewAwCmAB2UBJCjoSBFcYFZXGLhFJeBVOBwfoJ3JJPQlMyDmX6KJQpE2hPmkBD\/BCq\n6T0EsHkfsIjsQtJ7BJB1joPgv14GP6kYlAVWrzXSbDV6xMP7gBNQpY9BlWJFR8oksdmA6th3gN5J\n\/g8gBzEn4xD0cTBy0m88pQxw1Ln1O0WpDu0F2vcKqnwKWn5GQSEBzADjOMeXbII+voDaZp2N0tjf\nVj+yW5fS9Q7Q14NmtCV7e3DkXQ\/GqFFCejD3UiXSftCDYYcjfYCaiQUhpYCdysmhyrhW9N0YJUPi\nneJhNHGG0Zhg+NEUC8gU8wKukzWTTtYMG6GHryH8JJ26Cf53aW0unoTVgjaBdn8PDkLB1r\/fgxVR\n7b49mH2xAjz\/ArBPpiGa7MGQwxEQZFXBj+oyLX71R28f1sSr0CUk+y91gJwkfe9PkjJykhSGSEmi\nKUMqOUniSGiNOsrClU\/DUa3oG\/T7ENVBbJYwW9HI74U8WYNqppqkmS7fWVyyfxZnnC9G8rmc\/bOY\ngRh\/NvX2\/mjdpHd5KpntkHK6IIlVQkyiVVlkE4lbdRBcEoMfJETi2UwwSWCNOEJHcXGzze9D1s2B\n2fpyRuOeOLaFxP1mlEU1ojhcvh9YS32BNeE0H\/TjCeCEZe1Rdnr8bLp2fPPbhnLdrChaDlFkPYoj\nZCgkd5LcK2JibxG5OOWQixOXDEgc2vtsQr+DKO3EMlNEwkNRhJRcmKqRF3KDTK8IvKB8Ym8GCatJ\nyE2t3PV+jN9BVU2h2llAknNeqBg5l0VIDxaSG10O2Gd4oJ9gQzVol\/odZPUY70kFoaXIvlKCjIvX\nwTufh8RzGWCdSkY6qxjetXSggN6JLkqsI3CF4F3IRXJgFlEvFQwaGyVFLUt+\/w8lq9WBFyxASlAm\nOP5pRD0Ooo8zUFndLT1oto+UY3Ofqgbu7CUHpYMTwEP8mWTQaSxcOxYN45fPeg7K4l91Tz+gt8+7\nzeoHL6ZV+ulvOP6piD+bBMZpNqKO0xH2WTjG1v\/m0K+9cHQ5t7M\/2CR7F27Pivt2vmVxTnZ\/x6J5\n8tIy5HA\/EySWIytBhIz4IvAY+RDmy2D37E4bNnctqrUXlpplT3+Bce4U5YC9rvUp\/ZOt5w0LDx\/W\nLnusfQRwcvuVZX579wvXzp5ja\/e148nL144HL95Mzz9\/bTFuvrJ0rL20lM66bWnGuWlW7\/gRSgGj\nlbfOdqw+XfZCKu66VlSrnskJzyvLwovXlvW9f1iev\/3Osv36O4tr961lZudbi9b93Cqdcd3JHXVM\nsbT2Yj9\/\/19T77N\/5G+4epugack9e8O6NNU4tTw9sPDAbr7\/2G51ue2WVbfdsPLYPuh6snxzxb3M\n091RfFLSeOTDjwpRw1+mOcPrs4oSOgzN3E5jM0\/97uH2mFpTe0ySP7CuB3o\/6Jf+xb8Aqz9V7Q+E\nOpcAAAAASUVORK5CYII=",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/tooberry_shake-1334209379.swf",
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
	"drink"
];
itemDef.keys_in_location = {
	"p"	: "pickup"
};
itemDef.keys_in_pack = {
	"r"	: "drop",
	"n"	: "drink",
	"g"	: "give"
};

log.info("tooberry_shake.js LOADED");

// generated ok 2012-09-14 19:46:28 by martlume
