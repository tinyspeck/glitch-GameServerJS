var label = "Water Cooler";
var version = "1317229919";
var name_single = "Water Cooler";
var name_plural = "Water Coolers";
var article = "a";
var description = "Water dispensing devices do not get more generic than this. It is as plain as could be. Were it possible for water to be beige, beige this water would be.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 0;
var input_for = [];
var parent_classes = ["water_cooler"];
var has_instance_props = false;

var classProps = {
};

var instancePropsDef = {};

var verbs = {};

verbs.get_water = { // defined by water_cooler
	"name"				: "get water from",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 50,
	"tooltip"			: "Obtain a tiny conical cup of generic office water",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (pc.isBagFull(apiNewItemStack('cup_of_water', 1))) return {state:'disabled', reason: "Your bag is full!"};

		return {state:'enabled'};
	},
	"effects"			: function(pc){

		var failed = 0;
		var orig_count = this.count;
		var self_msgs = [];
		var self_effects = [];
		var they_effects = [];
		var sub_effects = [];

		// effect does nothing in dry run: player/item_give
		self_msgs.push("A cup of water cooler water is duly dispensed.");
		var val = 2;
		self_effects.push({
				"type"	: "metabolic_dec",
				"which"	: "energy",
				"value"	: val
			});

		return this.flatten_effects(pc, {
			self_effects: self_effects,
			they_effects: they_effects,
			sub_effects: sub_effects,
		});
	},
	"handler"			: function(pc, msg, suppress_activity){

		var failed = 0;
		var orig_count = this.count;
		var self_msgs = [];
		var self_effects = [];
		var they_effects = [];

		if (this.isOnGround()){
			var val = pc.createItemFromSource("cup_of_water", 1 * msg.count, this);
		}else{
			var val = pc.createItem("cup_of_water", 1 * msg.count);
		}
		if (val){
			self_effects.push({
				"type"	: "item_give",
				"which"	: "cup_of_water",
				"value"	: val
			});
		}
		self_msgs.push("A cup of water cooler water is duly dispensed.");
		var val = pc.metabolics_lose_energy(2 * msg.count);
		if (val){
			self_effects.push({
				"type"	: "metabolic_dec",
				"which"	: "energy",
				"value"	: val
			});
		}

		var pre_msg = this.buildVerbMessage(msg.count, 'get water from', 'got water from', failed, self_msgs, self_effects, they_effects);
		if (!suppress_activity && pre_msg) pc.sendActivity(pre_msg);

		return failed ? false : true;
	}
};

function getDescExtras(pc){
	var out = [];
	return out;
}

var tags = [
	"no_trade"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-48,"y":-172,"w":96,"h":172},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAF\/UlEQVR42u2XW2xTdRzH92AUlUjA\n6wOGRIzGxIRgNBqDTl98kz0ajQaDYBiTAIKGIHGTbmNr13Xtulu79d51l7Yb69ZuXbcztnU3d9Zd\nYRdGB4x7YBDC88\/v7y+dhRcTQw88eJJvzv\/f\/k\/+n\/P9Xc45aWmP4Mg6lLUp82DWjj0HsqxHVDlS\nqd0l6W12qchkjmuqKqVcfYn0S\/ZvUuaBLB2vS1P6AFh8368HKacgj7QVRqqw26jaU0vWhnqy1tdR\nda2bym0W0hgNdCzvOGX+vE+nKODh34\/GCvQ6MlqqyeFtpObOMAW6uyko9QgFurqoOdxBTp+XKhw2\nvhGrooBahNHk8QioAflPivRJZK93U36JhvKgE4Ziqqp1kRlrdOYqUuk02f8DJh+aMuOTDfjT4f3S\nsXwVVSK\/2nu6KNgVpoZAE1nr3GRr8KBQPORqbiZXUxNVOh10XJOvUzzEJdVmAVjb5CUPVONxiaLh\nojDDPQZ0+HxkqKlW3sGiqoqY0WYjE9oJt5YKl4Mq3X+HtKahgWwAs\/v84myu85C2qkxZwFxdkXRc\nW0ilFjO5\/D5qaGulGoS3xuMUIW7uCNKpoQEK9kjkOhlQ3kEGzFHnU6FRj5A6yIFcKyjViQLRlJVQ\nQ4ufhsfHqDPaj\/9OKg946NgRSQ0gk8tObr8fLp18ANAfbKGRcZm6B6PkDYVIbdAp26hzNAXSUVU2\n5RTmAagUjzUrleHRZkYeOnyN5GsPIbw91BQOk7XRSypt4RMY4tgohfv7Hk8OnjCU6BKA5Xb7P4B6\nrQBsbG1eBbTAwT+KNRnKtpnq6k15JdqVf3OwvfcUGW3WWNrjODIP7kvPPqGKF1eWA9JOJaYK0XZM\nbif5Qm0UgXuNgRaKL8Wtd+7c2a844L179zL8fv9KvrqQctUFVFSqJ6OpikwIuQ0NuxzjSHcX3bp1\ni27evEmKgWHDTSsrKzG4QqyFhQWKx+N0+fJlunHjBuE\/unv3Lt2+fVuI4Vi4bp0igFeuXEm\/dOmS\nAMKYrl27RtevXxdwSTACPjFnATw95XAL8YWMxfhizOVyUXFxMWm1WioqKiKNRvOAent7hXsMzfD3\nbyD1gLz5mTNnqLW1lerq6siDXGO53W4hp9NJDlT14OCgcPHq1aurYucVAZydnSW9pY7yzV7qxgtr\nZ6STwvgmqdfpyL5rF0Xw6JuYmBCh5zRgcUpAGcoAzs3S0PAQmc1m6kMriY3HaCw2Rv14MVCr1TQ8\nPEynT58WUBcvXkxWtiKAvPnU9JQAjMViND0zvaqysjLq6+ujufk5unDhAp0\/f56WlpaEME49oA5h\nnJ6eJlmWqQlPDz7LYzKNjY0JWSwWig5ExRqGO3fu3KoWFxdTD2gwGOLs4OjoqJAAvK8EJIsBGers\n2bOiT95X6r9LkGP75+bmiMWbwhXRpNktzjPOO+6NXLUMl1jLQnFJKQeEe+kzMzOikhmQXWK45eVl\nAcb9jpsy9z8G5JbEjrNwXeoBJycn06empsSG7ApDsINcEMmQrPn5eRHqhHBt6gHR37K5x\/GG7M7D\nkBxiDi\/3QHYZUKInssbHx1dSDjg0NKTiIkiGZKc4F7mVJCDZTXaZ21BCfF0qmJ6G1kMbobe8Xm8F\nVy9vyO4k8jEZkouFz4l2lKh4FsBffJRwz0GvQm9CW6FPOzo6JkdGRsTGD0MmFw3DsoO8lhWNRpcD\ngcCXyM21jxJwDfQKtBnaAm1rb2+fSGzKkMgrShRNMiTnJTvI6yKRSOf27dvfDgaDG\/Hb06kIM4Nu\ngN5FiD0tLS0yC47IeKuR29ra5FAoJANehsNyOByWBwYG5P7+fl5zCGvewE28DrfXp7xIkGtfoDC+\nR1h3wo3d2PRHbL4HykTh7IWTe+HkXjiYizAfwfp3sO41VPkaRd6mAfcZIL7C+WvoG4B+i\/l3GO9g\ncMDtxPwHaDfGnwNSmdf8pEbN4dqC3NsKx97D+H049AHmH2L+EeYfY74N408w3qz4l5wkSU9xuJBj\nzwLiecCsRW98AS1kHecY5hswfgk972UUxTP\/ZY+\/AEMk1VAIlFrqAAAAAElFTkSuQmCC",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2011-02\/1296877886-4806.swf",
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
itemDef.hasConditionalVerbs = 1;
itemDef.emote_verbs = {
};
itemDef.hasConditionalEmoteVerbs = 0;
itemDef.tags = [
	"no_trade"
];
itemDef.keys_in_location = {
	"g"	: "get_water"
};
itemDef.keys_in_pack = {};

log.info("water_cooler.js LOADED");

// generated ok 2011-09-28 10:11:59 by mygrant
