//#include include/takeable.js

var label = "Tangled Pair of Sock Garters";
var version = "1354936141";
var name_single = "Tangled Pair of Sock Garters";
var name_plural = "Tangled Pairs of Sock Garters";
var article = "a";
var description = "No giant in the history of giants prized sock-garters like Tii.  To be fair, none of the other giants (or any other living soul) could work out or knew what they were for. Nevertheless, at one point, all born under the auspice of the mighty Tii were expected to have sock garters with them at all times. Like this tangled example, owned by Elaine Melange, they were barely ever removed from a pocket, never worn, and lost in the woods before too long.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 0;
var input_for = [];
var parent_classes = ["artifact_sock_garters", "takeable"];
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
	"no_trade",
	"no_auction",
	"artifact",
	"collectible"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-19,"y":-42,"w":37,"h":43},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAIW0lEQVR42u2YWVOb5xXH8w180elV\nUywwttkFSGhBaJdAG2hfAIEkQGwCiU2A2SQWmd3YYKgXXAxecBzX4ODGxI1D62x20wn1TNJe+iPw\nEf59nseBqWd6Ebz2ws\/MmffVeyH95n\/O\/5zz6qOPPpwP53Dnh7\/cM8eb\/Runass3euqdR\/5vwHZ3\ntiLri1PPxyJBJFpqWEy31+\/OhGqPvlewf\/346OjtC7M7s90hxBurMU+ulwbacSXWhbXTA1hN9O9N\nhmt97wXu2dcPYovxbiz2tmJ5qBOXBztYrI32YnWkhz1b6GlBl8+B9wC3HXmwfgXnos1MLarcHLlf\niUfZ5+tEvavD3Vge7kRzhQXKgmz5O4P799Onv\/npyc7ek+27WJ8ZxPXJXlyOdzC1Fk+FmXproz24\nMdmHe388C49JC5WIH3tngD8\/2Vl59s0X+PGv9\/GPR\/ewvbZEau0U1ueG8eUny\/j2\/jq++\/MtfHXv\nJrpCtVDyc6BTyp6\/G1P8\/Sv59w9uY\/vaPB7eXMKDtQVsXTqDhzf+gJ+f7uDx5g2snj2Nka4Q6txm\nqAgcBZQXCiFV6t9+mp99+3Dn7tIYPj03RCDPY+vyHLs+un0ZW6tLiHjKECjVHoRVWQiVIBcatQoZ\n2bkrb129x5truH12ELfnYkw5CkeV3Lw4iYlwLYYbvBio9aDRbkCduRilUgFcVjMkRVJkZOXsaXgp\nb695\/\/Px9sad+TjuzI+wVD7Z\/hO+\/uwGbs3FMdbsY3D7QSFNBE7M46K83ANufgFy83lQK2RvpycS\nU\/i2lqdwdylBVFsgtTcPCnthKPwS2H4ketpQolFBo1GjSK5EVi4fAqEISkHe3huHuzYbX9m8OI4N\nUnufX51jYO0+O8YiASz2t7wM11SN8aFeJE6PwuV2o0ihRl5BIQNUq9XMMAp+9twbgxtv9c8lWvyY\naq\/D1vL0i\/oj0VJpxmxPI66MD2C+v+MAbnp8BP0Dp+CtqgJfLIVIqmKh0urhspmhIYZhkLyc1091\n0KqV15QVw2dUY6EvdABHg6r5xc1LWD2TwNlTbQxwJhFDe3sb5AoFUtMykS+QMDiJQoNgfRCVbgcs\nCjGKcjMo4Osbxigp2LWRNhFr8jKo+1dmmIqfXZ7GrYVxXEoMsBgP1+HcxAhWV1dQUxtARk4ejqdl\nQFOsR6W3Ci0tIbS1heG0WUC\/j5ee+kuqc159ulgVIl\/QqkNXwImpaJAZ47vPP8EG6XvL44MHcFS9\n6cEorl1bxfnFeYwmRlGkKoFQJILL5UQ43MLgfL4qKJQK0nZIw87NBD\/9+OupaJTwn18Z7cDyWCdu\nzvbh+wef4tqZMQY110Oc2+zHKIlEtBUzZ2Zx8dIFzMxOoW9wAGaHG0oCU1lZAb+\/GvUOEyp0CtjN\nJlaDJDPIOnYUwqyT1DA7h4YTZJ7g1llKsDrRw5rwN1s3cW\/lPC6M9jEo2oSH6iowSlI7NDSA\/qFh\nnJufOwCs9PmhUinh8bhR5XHBqSlCeYmcNOwySLjpKMxJB\/kNZKYkvZqrnRreEQpxZ2kcP3y5ib9t\nXj+Aqzao0Ot3obvagb6uCNqjUYydnmBwNL0agxl6YyksFjPcbhfZZIphVxWy2nPbLVAUiRlYftox\n5J1M2Qc8vIp+k\/qn9fkE63lXJ\/vJpHgB5zdpmGNpmrzeCjS1hjEQizPA8cnT0JVaYXc44HQ60Noa\ngtugZep59UpUuuwMkjqZwnGPJzNAGqq89MO9GvhLNRvzg23MvZNtQaaaRS46AAxXOdHTG0VNsAGh\nSAcDnJqegNnmgF6vI+l1MXPUOEqZgg02PZrq\/GzsOY0lUBdwWR1SNbNTOcg5zokcCrDKoFoZjdSw\naUGBWl2lLwGycTYSg9XhRKFcg0hbBC1EMQqn05Ww9DY0BNHgsTLXFmScQGt9DaqrqxmkmzhcLS2E\nmNRj7okUZKT8fuNXw+mleb+1qyR7tQ49FgZbEK2yo4nUpJWkxqWRMoOEPWbm4HCklY2yApEENruN\n1R51bmNjAwIBPwL2Uoiy0xigt6wEjXUBaEt0UGmK2WwWCQUQEDencT7+9buiWyuL0F3Oa1KjxWtB\nNbnWk55I1aOA9L7JYWSjbWIshsbmZsi1BujLbGjraGfO7uvrZSkONTdCKeZDlpcJp7qImcVeooTL\nYkIRWcH4AhHKjMbDjT2vXhGhNUPbw7nhKLrrq0DbTl\/AzeAoJIWlSu4vB7S9lDnLYbC6MDQcYzUZ\nJ9eGhnrWD60laujE+TAU8lmzpkG3neyc\/FdbHOqt+l0KWOs0opOAVOgVB7W3D+kpliHkNLFnI6EA\nRrojCFR5YXNVMMDOrk4y7nSw2YizSfoNWhWKiJLUtbK8LBQKC\/BxEufVxl29U3NExcvekHAz0OA2\nIUpGXmellalIo7xYziBp7EPuL6qdVQ4EKlwMSlwkJ5uMjhmDfpaIRfQNj9TkcQj5vFcHPJjJUqE5\n3lq95yiWshraB6QbDoUjZmLm8WhlrCSI+5mpBttDrBZ1JjNbuxwOO4xGAyQSCYq1GjKLU8Hn8cDh\ncMyvvXbV2nW+CtJoabPt8toYwH8rSIM28bZyC6tLqmJHvR8+vw\/pWbnIyskly6oKcrkcIrJECLmZ\nEORxKeCbexUlKj13a1\/UnZ4UOh36tC8GfzHPfrRX2hDwErMY9OCkpCKZhEAgYGA0CrhZ4GeehFAo\n3CPPuW8MUC8ukCt5OSw1dEzRTcShlrAJQSNoeWEcY7EGMpkMycnHdlI4nFj2yWNmXkrKu\/kbLjft\nmC8zOWmPjica9KWcjjEaZlKHGqWM1FjhrlgqfXf\/w\/yvk5n8O24mJ8mXkZIUy0hO2qWwOamcvfy0\n1NhHH86Hc7jzH3bgo+TOlDrsAAAAAElFTkSuQmCC",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-12\/artifact_sock_garters-1354841461.swf",
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
	"no_trade",
	"no_auction",
	"artifact",
	"collectible"
];
itemDef.keys_in_location = {
	"p"	: "pickup"
};
itemDef.keys_in_pack = {
	"r"	: "drop",
	"g"	: "give"
};

log.info("artifact_sock_garters.js LOADED");

// generated ok 2012-12-07 19:09:01 by ali
