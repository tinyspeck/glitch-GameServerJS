//#include include/takeable.js

var label = "Egg Hunter Trophy";
var version = "1340228514";
var name_single = "Egg Hunter Trophy";
var name_plural = "Egg Hunter Trophy";
var article = "an";
var description = "This trophy is awarded to the eager egg hunter who collects all five chocolate eggs.";
var is_hidden = false;
var has_info = true;
var has_infopage = false;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 0;
var input_for = [];
var parent_classes = ["trophy_egghunt", "trophy_base", "takeable"];
var has_instance_props = false;

var classProps = {
	"collection_id"	: ""	// defined by trophy_base
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

verbs.drop = { // defined by trophy_base
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

		var result = this.takeable_drop(pc, msg, true);

		if (result) { 
			var trophies_outside = pc.home.exterior.find_items(function (it) { return it.hasTag('trophy'); });
			var trophies_inside = pc.home.interior.find_items(function (it) { return it.hasTag('trophy'); });

			if (trophies_outside.length + trophies_inside.length >= 11) { 
				pc.achievements_set("trophy", "placed_eleven", 1);
			}
		}
	}
};

verbs.examine = { // defined by trophy_base
	"name"				: "examine",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 53,
	"tooltip"			: "Have a look at the trophies",
	"is_drop_target"		: false,
	"handler"			: function(pc, msg, suppress_activity){

		var failed = 0;
		var orig_count = this.count;
		var self_msgs = [];
		var self_effects = [];
		var they_effects = [];

		var rsp = {
			'type'		: 'get_trophy_info',
			'itemstack_tsid'	: this.tsid
		};

		pc.apiSendMsg(rsp);

		var pre_msg = this.buildVerbMessage(msg.count, 'examine', 'examined', failed, self_msgs, self_effects, they_effects);
		if (!suppress_activity && pre_msg) pc.sendActivity(pre_msg);

		return failed ? false : true;
	}
};

function parent_verb_takeable_drop(pc, msg, suppress_activity){
	return this.takeable_drop(pc, msg);
};

function parent_verb_takeable_drop_effects(pc){
	// no effects code in this parent
};

function canDrop(pc, drop_stack){ // defined by trophy_base
	if (!this.container) return {ok: false};
	var loc = this.getLocation();
	if (loc.pols_is_owner(pc)) return {ok: true};
	return {ok: false};
}

function canGive(pc, drop_stack){ // defined by trophy_base
	return {ok: false};
}

function canPickup(pc, drop_stack){ // defined by trophy_base
	if (!this.container) return {ok: false};
	if (this.getContainerType() != 'street') return {ok: false};
	if (this.container.pols_is_owner(pc)) return {ok: true};
	return {ok: false};
}

function getAdminStatus(){ // defined by trophy_base
	var pc = this.apiGetLocatableContainerOrSelf();
	if (!pc.is_player){
		var location = this.getLocation();
		pc = location.pols_get_owner();
		if (!pc || !pc.is_player) return;
	}

	var ago = this.ts;
	if (this.ago) ago = this.ago;
	return pc.label+' got this trophy '+utils.ago(ago/1000);
}

function onPickup(pc, msg){ // defined by trophy_base
	pc.furniture_migrate_trophies();
}

// global block from trophy_base
this.is_trophy = 1;

function getDescExtras(pc){
	var out = [];
	return out;
}

var tags = [
	"trophy",
	"egghunt",
	"no_trade"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-18,"y":-61,"w":36,"h":62},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAFaklEQVR42s2YW1NaVxTHfexLouAF\nkZvEXLxEnUbxFhtQMZpqUECCGBQUMUqJpDGtqbfT2GhrTYJG7dhOM0xeOp3ptE6f+nhm+gX8CH6E\n8xFW9\/\/IpqdtXjrD4YSZPQcOKD\/+a6\/\/WmsXFeXhkbxd0bwVsp1shazSlwFLZjmgKy56Xx4\/r9xK\nbU3VnyX6K2lpqIqejpjos7tVJ+8F3B+7o+kXk9X0bdhGXwWtFHNV0MOBSlocNFK8p8ypOeDx\/DVx\n854FipEQsNBkd5kMCTUfuA1pzQEPY3bx0R2jDPVkuIqW2PK36eXXwc5SSXPAg1h1Cntu3m2geG8F\nrfnMFOwopVBnKfkceprprmjWWkHbdshKn35spDALb4qp+Yg9BxzWqKMkpbmK6alqAeF90Pe3ilAU\ngN5W3Zm3tWREc0jmf6eAnHaWyzazMWahdb+ZPrldSU9YAi24DdLUR+UZzWBfhu3Nq16zBItJsgVA\nDokrVMWCwhNdZafeD0sKvzcZyAiAvhg1EYMlVlFykLiH57hiv96\/WSYFWjSoNoCASUOtXWbgAMLC\nPQ65wuAfs4oTaNNnCg\/ot0jLHhO9jtfST6u9soqAZaZNC\/0G+i7ZSnszl8\/v9RpOCw64H28QdyZr\n6CB2hX5I1OdU\/NxzriQsCdCoPKg2hU+W6GXxRaRGrsvfL9QTyiBPGIQVYLhGb5XTvXZ94RVc91sy\nPDn4FQmDsKO6wCuZ3ZCvVZ\/WJkn85hTAkLnIVhg21AJcyGWkXk\/9qSZg\/NGzHXC6d8bJJ3hofGWI\nBgJNdCfhJN\/hHHXuJ6gh5ZHcl4q0A5xa7BoJLrvpZjpKbXvz1LIWpNqxDuo+XqTh6S4aaisnV+1F\nQRO49YDZCZuJJxzU8+sahf7co+m5dvIP11BNcoj6t6dooKkYgGcFg8LsseE3RXbDNvFV5Lyzno81\n0+BWgObCjbJBY7Ut9FHHUZK6HZXkqrtYGHtBadsMWs9+fNhEvz1z02HskuxzAELmIoPROOB1kjUN\naGTv3tAVBhCq7cev0+\/PB+nt4xZ6PWOXARmwPJNw78OC9wESXTZaMNUBoRyqxZvFJhlqf9pOz8et\nJCiglD6IhbEAkIF2GVC9UWDda2o+iNdJUAwLlUJZLZRweF\/IljWuIvzQVXfhRLWEYEkgocbu3Lf9\nB0q5UHdRj1Hy+D5EFZFDXHshogrgZtCcPopflb\/0XVDK5hT19jjRSMhs3EO3jRKHJOmt+8CmCuBe\ntFpElnKFlJ0yejwsQKLupphi6ag992NQ9jAOeG7o1Nt\/PKwcCFbCn2OPAQ5tFe4hpAgx\/gbvQ0G0\n+2yIElWBW\/UZbbz55CEFIM5iAABFAfmMJQxXkIcX0NwLVQNEGeMhfDVzLbf5AYwhScj63Wo21IBU\nJhJ+iKqAG2NmQakeDy1rr+QrxktAAoyNoDLQ1xO2nDfyLFYNcMVnyvB5ly\/4H89c9Hysm87NxICB\ngtys+WCPRlUVc2b7SFIqqDRkKAjAo\/nG3NSG11vj1n+0+7KCDl3+2\/z1MbOIjf4u70MYEVacy\/A9\nh8\/C85SAUBB7EAdLeVcRB0Lc95QZjHAixFCGH3nwkoaai\/2prMf4H2gk0DTk9QiEhSuNmfZpFhJf\niiVkDRhtFGosxkjATXSVySUNSuJze7MNhEkP8FASn2ETXX6b1gjbU4BDJUEo0b18M3mVNsPXZQPG\ngpL4cjmMDBCKHc5eoV+EvlxjAcVxPIcfkdfzGa+jxMkgTpZHTBKUQ98HdWDMuEI9qIjQ8rNB9tmc\n1fx7Pva16tTpaObcuuKYqzzCNrzARkoRK95nEMc7S0V4nHKxxBGTA0ZpKXs0DLDZnor\/fSbzF5M1\nCMID\/cQlAAAAAElFTkSuQmCC",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2011-04\/trophy_egghunt-1302028751.swf",
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
	"trophy",
	"egghunt",
	"no_trade"
];
itemDef.keys_in_location = {
	"p"	: "pickup",
	"e"	: "examine"
};
itemDef.keys_in_pack = {
	"r"	: "drop"
};

log.info("trophy_egghunt.js LOADED");

// generated ok 2012-06-20 14:41:54 by lizg
