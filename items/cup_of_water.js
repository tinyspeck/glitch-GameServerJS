//#include include/takeable.js

var label = "Cup of Water";
var version = "1348684033";
var name_single = "Cup of Water";
var name_plural = "Cups of Water";
var article = "a";
var description = "This water is so plain, it has no Brownian motion, but Beigien motion instead. Drink at own risk.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 1;
var input_for = [];
var parent_classes = ["cup_of_water", "takeable"];
var has_instance_props = false;

var classProps = {
	"collection_id"	: ""	// defined by takeable
};

var instancePropsDef = {};

var verbs = {};

verbs.pickup = { // defined by cup_of_water
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
	"conditions"			: function(pc, drop_stack){

		return {state:null};
	},
	"effects"			: function(pc){

		var failed = 0;
		var orig_count = this.count;
		var self_msgs = [];
		var self_effects = [];
		var they_effects = [];
		var sub_effects = [];


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


		var pre_msg = this.buildVerbMessage(msg.count, 'pick up', 'picked up', failed, self_msgs, self_effects, they_effects);
		if (!suppress_activity && pre_msg) pc.sendActivity(pre_msg);

		return failed ? false : true;
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

verbs.give = { // defined by takeable
	"name"				: "give",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: true,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 54,
	"tooltip"			: "Or, drag item to player",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		return this.takeable_give_conditions(pc, drop_stack);
	},
	"handler"			: function(pc, msg, suppress_activity){

		return this.takeable_give(pc, msg);
	}
};

verbs.drink = { // defined by cup_of_water
	"name"				: "drink",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: true,
	"is_emote"			: false,
	"sort_on"			: 55,
	"tooltip"			: "Imbibe the plain water from this generic cone-cup",
	"is_drop_target"		: false,
	"effects"			: function(pc){

		var failed = 0;
		var orig_count = this.count;
		var self_msgs = [];
		var self_effects = [];
		var they_effects = [];
		var sub_effects = [];

		var val = 5;
		self_effects.push({
				"type"	: "metabolic_dec",
				"which"	: "mood",
				"value"	: val
			});
		self_msgs.push("Ewww. That water tastes really … bureaucratic-y.");
		// effect does nothing in dry run: player/custom
		// effect does nothing in dry run: item/destroy

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

		var val = pc.metabolics_lose_mood(5 * msg.count);
		if (val){
			self_effects.push({
				"type"	: "metabolic_dec",
				"which"	: "mood",
				"value"	: val
			});
		}
		self_msgs.push("Ewww. That water tastes really … bureaucratic-y.");
		pc.quests_offer('stale_but_necessary', true);
		this.apiDelete();

		var pre_msg = this.buildVerbMessage(msg.count, 'drink', 'drank', failed, self_msgs, self_effects, they_effects);
		if (!suppress_activity && pre_msg) pc.sendActivity(pre_msg);

		return failed ? false : true;
	}
};

function parent_verb_takeable_pickup(pc, msg, suppress_activity){
	return this.takeable_pickup(pc, msg);
};

function parent_verb_takeable_pickup_effects(pc){
	// no effects code in this parent
};

function destroy(){ // defined by cup_of_water
	this.apiDelete();
}

function onContainerChanged(oldContainer, newContainer){ // defined by cup_of_water
	if (newContainer && newContainer.hubid){
		this.not_selectable = true;
		this.apiSetTimer('destroy', 5*60*1000);
	}
}

function onLoad(){ // defined by cup_of_water
	this.onPrototypeChanged();
}

function onPrototypeChanged(){ // defined by cup_of_water
	if (this.container && this.container.hubid && !this.apiTimerExists('destroy')){
		this.not_selectable = true;
		this.apiSetTimer('destroy', 5*60*1000);
	}
}

function getDescExtras(pc){
	var out = [];
	return out;
}

var tags = [
	"drink"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-21,"y":-29,"w":43,"h":30},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAF\/UlEQVR42s2Yd1ZaXxDH3w5cgktw\nCS7BJbiELIF\/fyW\/mCKoKCUqRUApgiggT8XeUMSCKc+anhBNPTlJvpm58fJDmpCgZs6Zw+HVz507\n9ztzn6LUYKenpy3v3r3TnZyc6N6+fet98+aN+vr1a\/XVq1fCX7x4oT5\/\/lx99uyZ8CdPnqjHx8fq\n0dERe9vh4aFuf3\/\/Bh1vVH7XADR8+fKl9ePHj20fPnzQCAiPHz\/Gzs4OMpkM0uk01tfXsbGxgc3N\nTWxvb4tzu7u7ePjwobh2b28PBAQCA4GCwPD06VPxy8c1TfOS68hbaoJjsM+fP2fpRkxPT8Pn82F4\neBgjIyMYGxtDLBZDPB7H5OSkOD83N4fFxUWsrKxgbW0NqVRKQDPwgwcPBKwEZTiKMijiyGazePny\nJSi6PCiVrm2uCPbt2zfd+\/fvs\/yCwcFB2O12OJ1OuN1uDA0Nwe\/3IxgMIhwO50BVVcXU1BRmZmaK\nQDm6W1tbRaAMVAjKzsfoOo28pXA6mwgue3BwgL6+PhiNRphMJlitVvG\/VtD5+XksLS0VgXJqyOmX\noDzllLugXAanEYNyalCqJB89etQgcu379+9ZvlGv1+e8s7MT3d3dMJvNOVCXy4VEIoFIbByRuIr4\n1DSWkmvk61heY09hZZ19A6upDSQ30sLX0pvkW9jK7ELb+wnG0y1ztBQoH6cBqQyoI0ARoXzAfNBQ\nKIT+AQ\/uDwyi1zWEPrcXtkEf7EN+OLwBOH3DGPAH4QqE4B4egScYxmBoFN7wGHyjEfjHoghExjEc\njSMYUxEan8D49CxSm9sClGF49nghSVCefl5wDNjGgAxRCNdrs8NDL+4nIKuzvoAj8UmE1SmMTiSw\nkkrj8OhYQEpQBpeALQxYOMUdxh6YbAMw212wONxFgFaKKHuPzQkTXWN2usX\/+y66xk3XeHyw0QDs\nNAAHDcBJ8B6C9hNoIWCEUiWamEF6J8PSI5x5BODZ6k2SC2kQ09pjQU+\/syRgu+k+bnUYcdNgxK3O\nbrR19eB2txl36Z57dE5v6YXB2oeOXhu6+uww0nO67QMw0TPM9AwLDdDhC1JUY0WAMZr2VcphBmMn\nNbEIwE+fPjWSvODr16+g6oDE3AIBuc8B8u9NQxf+uqsX\/k97B\/7Vd+K\/Dglqwh0Japag\/WegjvOg\nHH0C9Y3GcoCck8u04Hilc6BYd9vb2\/+vODTvFk5OBiWhxsnpKdLbGYzRKDkH7xhNOTjpf98zFIMa\nJaj1HGinBKWU6KHBMqjN68fs0gqStOIzFDGWIpaurq4unknLOS3k+sjJKVeSXO5U5kDlDtr+ARZX\nkxifSiA2mYA3FKYpdwvXm60\/QSnCEvQ2gRoIzkF56KQ8DIxGEaN7+f4kTSNpnMg1LpGsn4FAQIIJ\nPxe9\/ChKyHzncsQCysDUMICahZyockrwYLgi8HVSIqhZyNVdfobUPgnFIs7RcjgcQmfz4ch1JUsd\nR5EelC0Fme\/8YqlXpYAYhuWCYThSXOq4seBSODExgWg0KmSNq5IEZL09i1yWYBvK1mMC0F0EKJ1h\npMsoMRhXCJYJBuOEZzgufbOzs+cAZb23WCw5QPIbFRsGmrKGaqL4O4CRSETU8kJAip5WVbtVbRRr\nBeRGohKgwWBorronpJdp9QDkxpY7mioA1ZqaVnpZ668CylJVI2BTzW3\/RVGsI6Dll\/YlJBvN9QLk\nTpsBubHNB7TZbJVlpYoFY7lkwBu\/tburJDuVAHkPchGgx+NJKvWwcrLzq4C8j+FuhfY4LUq9jACS\n5QC5xFUDyFtUCUjNgarU00otmGoBk8lkESCVukal3safL2oB5K6lDKBOuQw7WzBaOUBupy4CjMfj\nGjULDcplGYG0lFskVQI2K5dtBOOtFpC\/KjDgwsICb\/q9ylWYbGzLAfKnjULA+fn5LMlMo3JVxs1E\nLYAUwVblqo0\/TlYDuLq6qirXYbyqCUyrBEibb215eblBuS4jiWktBchfBs4Am5XrNgL0lgG0KH+C\nSQHPB8xkMpryJxkBNuUBZgmwSfnTjKXnTKjr1kb9AGjXJ2xJW3CAAAAAAElFTkSuQmCC",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2011-02\/1296877952-8312.swf",
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

log.info("cup_of_water.js LOADED");

// generated ok 2012-09-26 11:27:13 by mygrant
