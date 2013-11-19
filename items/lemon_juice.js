//#include include/drink.js, include/takeable.js

var label = "Lemon Juice";
var version = "1354589337";
var name_single = "Lemon Juice";
var name_plural = "Lemon Juices";
var article = "a";
var description = "A tall glass of exquisitely sour lemon juice.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 24;
var base_cost = 39;
var input_for = [68];
var parent_classes = ["lemon_juice", "drink", "takeable"];
var has_instance_props = false;

var classProps = {
	"collection_id"	: "",	// defined by takeable
	"drink_mood"	: "-5",	// defined by drink (overridden by lemon_juice)
	"drink_energy"	: "10",	// defined by drink (overridden by lemon_juice)
	"drink_xp"	: "10"	// defined by drink (overridden by lemon_juice)
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

verbs.drink = { // defined by drink
	"name"				: "drink",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: true,
	"is_emote"			: false,
	"sort_on"			: 53,
	"tooltip"			: "",
	"get_tooltip"			: function(pc, verb, effects){

		return this.drink_get_tooltip(pc, verb, effects);
	},
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (pc.is_dead){
			return {state: 'disabled', reason: "You are dead :("};
		}

		return {state:'enabled'};
	},
	"effects"			: function(pc){

		return this.drink_effects(pc);
	},
	"handler"			: function(pc, msg, suppress_activity){

		return this.drink_drink(pc, msg, suppress_activity);
	}
};

function getDescExtras(pc){
	var out = [];

	// automatically generated source information...
	out.push([2, "This can be made with a <a href=\"\/items\/7\/\" glitch=\"item|blender\">Blender<\/a>."]);
	if (pc && !pc.skills_has("blending_1")) out.push([2, "You need to learn <a href=\"\/skills\/43\/\" glitch=\"skill|blending_1\">Blending I<\/a> to use a <a href=\"\/items\/7\/\" glitch=\"item|blender\">Blender<\/a>."]);
	return out;
}

var tags = [
	"drink"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-9,"y":-29,"w":18,"h":30},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAInklEQVR42r2Xa3MT1xnH+QZ523f5\nCJ1+gn6Bvuq0mc6EtAmdkGaaBlJCCA015Q6GAKFggw3YBIzNLdxTgwFDuQgsY4wtG8kS1mXvu+fs\n7nPO7mpvkvqsIIxoO51JIvXM\/OdoxmPpN+d5nt\/ZXbLke6zTRecnN5Xgvdt6+EkKaifSbmNs0m1Y\nk16j8V\/j1sen3MaVx9XG+gyPPym5jZ8t6cSaqjZ+PsEb\/SkWZ++ZER0tu0+vFnjqH0U3NVZyU+OC\nl7ojeqn7kpd6pFZTk1qQmiZBaoaGqXk7SuUgmnjG4+y0Wy9Pe42RyWrjd22Dw1N6kpzGqOAVTj9j\nqXMLLHUpz1LfB3ABolSBRamSG6cqXjzx1KtB83sbjTd+NGACN+HWo7NZZ6IdgKIXp55Va0LyvdNu\n4xc\/HvBljz2A2BmT\/eK3FXfuBwJO5Nx6NuPW5O96FFvnzTYA1sevLDpPH1qx+e9D8MCO4Z4RCvdp\nKDwwQ+ERZsKKhLQdCY8Bw2L9sVNzWv8n49WMol\/PJp\/b0oP4RedxKLIXcyzdwFV2YvOfelC+RwIJ\nwaSHVmRMsJglSWMm+Ys8xky5NTbv1ukzt2aUvFq54sbTkheny34tk3brxbYAJopoBbSqERtdZOmx\nIk\/frLjpO4Kbfiw9n51R5ufn1Nx8zliYzxri7Cz101krmBJ5lJWdKKu4UVZ043QC2DxBrEy7TnDF\nuBZI47mH87WaV69WhbCwuIuWSztsvfJFYEjrA6JsDqi2I7CM3QGQfYFj9gYOHAk8ZyTg3gS41Slg\nfs6g3mJBr7LpvN8o4xQPtM2BGWU0KGffDXxvoRZHtC4vrgyU0upAr6wNdLErIPKmgKrbAtPY1QTk\ntCdwrMOBx4cD378Rhv7tMArvYa4EtXg0KPmUJ5VpD2DQ+GmGSTUh\/yEC5mpJmXVxR6gLWwKtjIDC\nusCQNyLg1sDUuwOL7EXA\/QjYj4AnEXAsDPzxMAruBGF4CQEfhIUgqrdV1jNcinQyzD1vNkwAPf4o\nZubFSCuvQUAss7wBy7wlMLUEcA+Wdzj02JnQZcMh91JY4knwnItVZvY6tr6LZ1ghSirTNsDEhbLa\nC8x97DcHBa45Frvu2OwGZszRyIBNyEFOSQ+37DMOIcfANIdsi\/YxBic5s49zZvQyIq8FIn8KU65X\nb4sDW10oa31g8\/teExDBdGsYDGvkZU4CMY8DNQeB0MNAyCHMfrDoEQQ8xRmc4IwcZET5AgE\/g7Y5\nsNWFJXPUMWHMSQBtftsx7LNA7G8w5zBngCIoNYeakJT2Y3rBsgYZZ6c5hyEOpIdRZR0o2j7eNge2\nurBk3nBNdqsJ6HgzVcIvAuWXMZcwF4A2IYcxXyPcUcxBBPwaAc8i4DC3jb8jYBeIRr\/TNge2urDg\nFAL68gS9IOcTfhWocx3hRsF0LoHJvgHTPoWAQ9h\/A2DSQ68DEgRUu2CRXq22zYGtLszZs75KT8EL\nwAWfONfAdMcRcgwBryDgBQQ8\/RJwEAGxZ18BnnoJuB4K5i2\/bQ5sdeGMo0cqHYEwJlEYqSFxvkWw\nMbCcmwzcG8xk51sAB5qArSdoGjshOcF59ixsqwNfudDRIpUMQxiRKIppRJq9dxWY99BxqpOuicNi\nJoOCPWiaSQ++XmJTR0DswQwvtteBrwbF9U2VjEAUW3GEkIZ9HgiWldjJgJzDnHoxxVYyxYebU+w4\ndz3OziDgSQTshmSKp9xqPalI2wGTyVOMQfBDIYxrTk23TqH\/TjdD7BEgVqKYY+jDI0DRg5QcQA8O\nsKT\/Es2Y2jYgCNh2B7a6sEwv8O9krdEh0PHEdNwNlDRp+u8ICroP0wvE2IdDMoiiHua+P+kH3mQg\n6\/t5cit1BDCZvCK55FD7SlM1GjkKOhlsxkDvGaQfoQ7i3gOGvh+IvhvAOoaAQ9xzbnkuXPZEo6\/9\nDmx14QK9W9XIEEsAVf0QaHpfMzqC6UYvgh0AXd8LhrYbiNYNQI+y5j1sDvLkHn5OL1eTSnTs3Thr\nPvQlZW\/ThaZ13lG1A9AMnpim7QNd3QO6tgv3bjDUbWCTw4xZg81rzsA7OE+vt9+Brz0XQiGU5J1Q\nq\/l1ap5xFGUPKMpuUNUvQVMRTOnGfTvu2zCbwMYnGDCPcjC+Yoa4CuYgEyaVWNKpNcPKkShthSCo\nRJSOOLLcDUkUZTuo8jbQ5K2gIpgmbwBd7gLL2I+AfdzW9jBdXAmzLN8ZB77qQ8czBXED+H4uJPQ4\nAm6GF9kEirwRNGUzgnaBJq1DyLVA9a8Y4HOipe1guvDRi+fATjiw1YVCZR0wGPeTyGIXJDHpCVcR\nEUrZyRRpLaji55jVQNTdzCYHcEC6mFb+oHMObHXhorSXm\/SsB3DTl4S1IAmfg0mOubKwBmRhNeZT\nUCqrQBFWImA3s\/V93JD+wgRpY+cc2OrCvNjjGGqPA\/Z1XyyvgiQSAsnlP2NWglxZgfvHoJQ\/wqfn\nrczSdnNdXMPK4o7OObDVhfPquapY+gxviVFfKK0AofQxiBip9CeQS3\/EfAhyEVNaDvgyxUy1m2sI\nnVdPdM6BrS6c0674lfwHOADHPOH5HyCJ2MxykJ6\/D6qwDku6zZGLy\/AENzFT2crV0u8hp53rnANb\nXfjUnA5LC8uwtGtYpbAMyphkFzBi4T1Uy3HPJsNV6flSoPIWbsqbuPr8XchY6c468BUkVOJibikU\nF96B0sJvmynn34FKfikI+bdBWlzOpMX3mZR\/C6i4gVPpb1wpvA3TUIo76sDWd+QSm49k6Us3OblS\n7jdQxlRyb4GQ+zXmV82IC78EXfwrviwd8TwvE81VG42OOrDVhcWg8Wr53nzke3P\/kQChGi0rAdw+\nOflGxwHvWsH6FIsbM\/iDBiLgx\/+5kr8\/sbzGsUyp+H8BTNau+1NvDufEPVdFc\/wBRE\/GidcY0\/hr\nuSZD8UxeGeh\/kl\/\/5d2pH1zafwHKRo7tKxOqiQAAAABJRU5ErkJggg==",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/lemon_juice-1334211913.swf",
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

log.info("lemon_juice.js LOADED");

// generated ok 2012-12-03 18:48:57 by martlume
