//#include include/takeable.js

var label = "Perception";
var version = "1337965215";
var name_single = "Perception";
var name_plural = "Perceptions";
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
var parent_classes = ["mental_perception", "mental_item_base", "takeable"];
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
		'position': {"x":-24,"y":-43,"w":47,"h":44},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAJ1UlEQVR42u2YeVNTaRbG\/QZ+BD6C\nf0zVVHX3jOmxR3vXtlu6tW0W2RQhQBYIZCFsQsKSQMK+3QBBZRNBdoQAssuaKIsEAglbgCYILSja\n9cz7Xmi1p6e6oKcGa6bmVp16696C+\/7qec55z8k9duz\/13\/Btd4lcVrplgbau6WGlV4SZLV3Sg3L\n7RLDUouYmW8Mc3tncPYOiXptIAJPbVr85MjH9lOGrNnYWkuDYzYeqyORWGqXYr4h1DJfFXJ0oOvN\nouMEbnh9TIlnGwV4sV2K5zvleL59G9s\/FeKnDQK5qoHDooS9SwqiJOZrQzFbIWKOBHC5TcysDUbh\n2dMCAlWG3d0avHxZT9YqAnobO1v5BDKdKJuAHyejsdwpwUJjGKxVIlhKBP9ZJZeaxXJ7lwybKxkE\npAjPn9\/Bq5dN+PnndgJZi90XpdjZJlavqLExHYc1YwTsvTIs3hfDdo+oWBaCmSL+id+8eFoxfXw2\n0VZpTVpW\/1G4xVqJ08J9sWN9Ig5bP2Zie4vYu0MUfHkPr17VEcC7eLF7m6hKFFzXYmMsAj8OhWPl\nLZvnykMwXSSw\/OblFuWk3KZdgE21hrmEOfkfAbTWiNRLbRJszCcRwDQ828wjMHpWtd2X5dh9VYLn\nu4XYeZZFclCFjfF9wO63ACuIgnohzLm8X1s9HWtyLOTbCJwVFoXZQRU9NGC1yLHcGw6HNR6b9hSS\nZxl4tkUhdcTqQrx4ocPOTi62n6VjazYGG48J4OBbCtYQi8v3ACez+ZWvXzwV2cGx5ozhieYJukNN\nKHBpR+63NYdKVltpMMdGknyRbLQ6EoGNhQRsrlLINHK0aEk1a7G9SdatdPIsGU+XlHAY5Vh7GA77\nAykWm\/dzsJRYXEgAs3hvbNb7zKrb0hdQxh+DzrUP+d+3QnfpnuUwgKNJfLm1UoSF+jDYyabrc7HY\nmFXA8SQGTycisWmOwpYtluSeihRQPDliYvbs7ZFh2UCquIFU8V1SxbeDYdYJMJnJw+uXF3hMDhur\nV6BzGwTzQyd0l5sxIGrAuORgKrYECZjecB5rD1VhmeTUyogcq2RzauH6qByORxGspTTWiXIUbpVU\nLzkvWfWovWz+FQsxlcfHRNo+4LSo9HhnVC\/MtRY0cw1oDWiGSVKPMek9dPL0SPteNZztEs\/kX1Gc\nK7wSy7npHckpJVHtK+PU+IWpG\/xFlpYgITqEPFhuBYOqON8Uym5K2hlbAGv9MqwNhLOwNOg9VY7C\nLZHjZb4ujP0\/S0kwpgsEeJLNx7gmaA\/QKMw5Z8ltxnL9KB5LKkhUsutISAmKvmWQfkmFbNcE5Lsr\nUORxA7e8olB2NQJ3fWWo8ROjgSsCBWzn8zBFrJklm1CraEUuNomxROyjICudUrYY6Ervqa2scnV7\n1tLco8XBqpfOw+OkQAMLOMzXMNaydixU9sAkKoIpVI92\/5vQOeuReTYX6eeT\/wkw0vCLgnW+YZwm\nbjCnlRfM6eDxOBNZAgPdhG5GFaF205ykoPQgppVKFaP3NOdsxFb6dywcsdbM7OXeeEoQHim5e+fx\nA0GexVzajTFdB6o9S1BwsRzZX99G1lcFyPgiA2mfqpB1OR557gqD3jPG6fdykVSe21S+gBy0QjbZ\n6aE7m9kAq9oOq+4um2cUaskQsT7fLLOa9QGsrey5R+GyCJw2CI8TAzAW4+d0LO+7eycqhO0waIfR\npOxHjnMlsr8pJXBFrHpZX2rQ6hmDBp9IHLSaJzKCLFO5fJhJLs3kaLDALMCavAprkh2zt6JJngqw\nadEt2ipCl0eUF2HUXmFtZZWjcEkBMMX6752BWV+XqQtcq9FwoxPVUgNyviHKnS9Czlc5qPohET2+\ncvRfD0PvNT66PP2cDgI4puFyaAXSRJ\/LHMBS8QLmEudJ2DCTWgFzPg8rfcnLc0X8jWEC2H3DGQ\/j\nr7C2UuWMsVzSJHz2mkSTu8jQxo1Ff3Q2emUZMFyLQ4tnFPpJ8vddD0WfrxA9V4NQfTEQKScDDtz+\nxlUBbhOJGsdS6QzmUs2wxE\/DojRjWtmHcVIAc42xk08Y4WJn5GVU8v4Gg+wCHiUEYPSGv8UU5f9m\nUOj0cEW\/QIAhcTgGgsXouRZE1ApioXquBqDb5zruOBO4D4VQ\/8X3UAd3v\/ghs9iyBFPCOIZkJrTy\nBlDs2oqHcWGYbompH0wQbLdI3NEquQBTHBejUX7DJpn\/r6eYDjdndPt6otPLA13eXujy8ibhw661\n3weA+TwEKX8LQfLJQKg+8DlwHuo9Z5yq5VaMVq2ijLffnS53IO9iI5qEiehShs01i3noi\/QnYP6O\n0Yjr\/9qd1E+SLOmfqZH+WTJbrWmfJiL1YyVSz8RA+3c5NKfCkMzhUfWQ9J77gcewIo9JeUfmPEYq\nl1EaNArGpZttn8ylOqKkHo1i6VYpN9hhlPlyfvdFqWdi3VI\/VmAv4gjYDWhPR0HzkYyFS\/mQD\/Vf\n\/R2q973OHcbeKm6\/ZeTuMoYqFlASMMSqV+m91z4fSatQERiBLHdp5YFfqDkdyaGR+lG4m\/aUWJ7y\nYQgJvjzlpN+hx2+jMP+cOa0Rq+0TsDeNYSr+PsZldSRq2fZJO1WhlwopPygC38kvuRFBJmMr7YT9\nvhHzdx5iUlFLoO7stVFxGWmhN5F9KROJX6c6HTncgEhx3CjNhr1lCEv1g5grbMMjyS3SPm+y0RtU\nBOaCDtqzmZZ3ol63vypwhqnGYl0PFqq6MJPXAGNIHtr89ChzKX7dodK\/SHUcOVyWc\/NxxqXe0Vc4\nhl4SnTkm1EX3vGmf54uReS6f7e\/01Eg9ozzaLwq535S7Vcva0cOY8CBrhPT3AVSGtLwFp0PGl9lI\n\/1zLHmd5X0ZXHilg9vlbw62aXrSnD6A1pQ\/NCV3Qe1UROD0Ll3k2h6iXBt1XiWh0j2Tb6dEWiFDk\nmGKKMJmjx6i2BG1iHapc1ahyUZFIQo2rAm3eEft9XkRaqgDd3lzOkcB1XrnsNiSTkEk4g4xMGTDG\nqViAPt9gFuZ1kHv6nO31Pv4oPss9mm8xHa7OzEMRD0ZFLExKJQbDpGTQ8GMHjp6rgW8Fl33e4eEL\n\/dkA0uMDjqaaay+6GNp9ruCBx2UMysLQHywkA4cXO3h0e18lcY1d6X3Vd1xknBaQHh9E2uj1o8nD\ntE\/imbRPk9iBo\/i7ONzzlKPcOXg\/hCi\/IEDxOSEyz4SRHh\/6S48\/1IT0b12aM1En2GGDTEJpn+zF\nmwGETkYR+wMIhSPqneSSCekqVO+7Dx9ZFdNhQ3s6mtGeibawUGQq0p6OJHDhBE5C5krRPlwAhXMk\nveehVvzJ+fixd3FpTss4mlMyJuWU2MKObWTopbbSolB\/cI1J+rPHif+JD\/D\/ABgjRR11\/nfVAAAA\nAElFTkSuQmCC",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2011-08\/mental_perception-1312586915.swf",
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

log.info("mental_perception.js LOADED");

// generated ok 2012-05-25 10:00:15 by eric
