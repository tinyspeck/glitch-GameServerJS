//#include include/takeable.js

var label = "Abstraction";
var version = "1337965214";
var name_single = "Abstraction";
var name_plural = "Abscrations";
var article = "an";
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
var parent_classes = ["mental_abstraction", "mental_item_base", "takeable"];
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
		'position': {"x":-22,"y":-44,"w":45,"h":44},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAALZ0lEQVR42s1YiVoUVxr1DXgEHoFH\nIMkYEx2V0cRxmYGOIHtDszd7gVsQ0AYVFRQ7KEQhQOsoyl40q8jSgLIEhOq96Y2iwQXXM\/+tjqjZ\nBDXzTX3f\/WiLa3Hq\/P8557+9YcNHXrbeeH97fxxnH0jgnENJnFOXwjlHUzj3vVTOPZ7OiZOZnPhz\nJueZyeY807mKJ3OHfTf8Ly6zNlpmHzwkuO+fwuLMJSwJP0GcKoF78jhcYzlwjabDfS8dC+MZWJjM\ngvhzNhanOdqbIywJuQF\/GTBrW7SvrTdT55nV0B+8AudIAez9Kbr5\/gTN2yy6R1O9LN7PULnHM\/mF\niUx+FeSDHLY0mM3z+bSstYf7zQ\/kiUv6RtgHj8DaJdfYu+R+63mGOJUdQCDVxCQDKS7NfCI2rW0h\nvpbOdHHJ0EbAUmDpiFIvDIZ9MAPiz1l+BFTHGPVMZys+GqCpJYoTp6ph682GuS1St9AS9knKI05l\nqWlR\/2Z+OEgGxtZ7RHQMn4KxJRysDz9V2yzMKn3c4xk6JiZxIs3\/gx5iaIriHMNnYWqPh6E5VPep\nhSfeU\/q5x9JF11j6+p89S+wZWxNF251jMNw+AGNTqOavcAfnmFLlGk0li1KuTzTC9SDO0JIAU1si\n9LdC0NCkFpQ3XXxc7TwffdnKHyi1cLvyFnw+BYv2wSTqcQUsnXIYm8OF2ff1eTE\/KZu7FiTqGyIg\nNIRA3xCMouIT2JLShd1HdZBXWhB+0QrZKaO4N9\/k\/zEA5\/viVM4RJdzjh+AYToO1OxbGxlD1725W\ntiz45PCirraVvFQThLnrMgg3voP+ZjDyTpxBQMYd7Ds6hohSPSIrbAg+a8beQgM2p\/bzXye180dv\nLa8LrKUzNoClz4p4By8eP8CS\/iLsdxOpahHCbzYn1Nn9MptcwsGuRdS1E8D6QBCLEsjx+jDsS7+J\nndkDCMyfgLzchOhKG0JKzfjXCQO2ZQ7jc3kzglSTCCwyqtYMsCtG7Zktx7OH41hZbKM4zIN9IBHm\n9ii8szG60uqbUO8Qi3tE5PUu4miHEScK83HieAFUxwsRmHoVXyV0YCc3gNAzM0iss78DcHvmEL6M\na0d4ySSV3YQ9hXp+TQC15BJDSkqWM5TbHJhYqOQwtYa\/CzCqwqpLrHegrN+DS6NLyB9agrLBiOiq\nKchpRVZMIkI9RcBMyGhyg+2NvkwAz1GJCwTqzW5sTupExNkp7D9jkkDvzjco1pZSMSLluVRaG4Ez\n81EwNARzq5u+KzEpItRWJPxkRymx1zz7GF2mFdw2PMGP9Lli5jFUY8v4nsDndIhIu+VCfK1d6sH9\nZ8z49uCEantqH7c1tYfLrbeKrC\/\/rTIScP2aSm1qDvU3toWL5vZI8tpw4R1w7AoqNoihFyyI+XEe\nx9vdqL33ED0EcNz5DP22p2iYe4xL9x8ij8qf2exG8nUnYq\/MI6zcgqDTZtnr53SZ4XemXZRYpT7E\nnoK1lXl1IOmQ86zk79wkBcpYOdhbR1Z4Wcwiho51LKBs0INcrSgtjl+QSptyw4l42hN+0Yx\/5Azq\nPpO3cJ\/Jm\/jPopuEphE30uh3rC8Di40I4MbwDdejWatXmvlIlYX\/NcB8vWZvgQFBJ404UGZB1CUb\n4mrsSLrmQOpNF9Jue1dqg0tijv0upHQOm8kPNyrasDGuTRLHwapp3CTmI3+wehkkgFtS+5F6+QEx\naeDWVOq2CI6t3zBIvSIykEx9oectUm\/FUAkZmIRah7QYayHnZrHz4CA2xfOSor9K7MDXSVocv2HC\niO05kmkP62WvN85K+7haK+tFcW1TUxjH1js3P5c3+lF58GW8FgHZOnxzaAz7CiZ11F\/cgVK9akfu\noLg1o1cCsymBx9eJWmxO7vQmyqEBnNe6cNf8DGnELuthli5MOAFZg9K+Y7dFsJd\/H7i5G8F+xrYI\n3tgarqOI9WZy\/Qz8v0poExjAv8W2SqxsSe7WbVQO+nwe2exPxiuwMkrAiCkGaquyG3uPDOFgrRFD\n86+gGX+ElP94S89sh4ltX+E0tqf3QVYwgtQquwTwfXHIBOIRLlDc5YKpWbpZ2veECzsrYHtap9RH\nm5O0EjgCrPoipkW6x5hjTDC2smuMuNDpRp\/lBXj9Co6ReFifMk9kqmb9F1xq1u3KHfPfkXXX\/3Sz\ni2dqXhNArZx\/aL5KB6zvKeYivVNTQZOHZwqOp0Q4pDFD1eJU7y8c0gXmDUCWP4z9x0eQcukByrpE\naE2vMGB7gav3HyG7bUGyGyacJI3jDXvnLeq3LSe3ziGJZS0ltjaE+JqawxX6xhD1bMsur+qTqxx8\nMD2Au0pvT6VJqnbgtNaDmrEn0Ew8Re34Cq5PPkGVbllii4FiVpNOqqaxaxWcvNImUu+tpkbNLHzK\nupfE4F\/8kDnFmsa7\/wT6sxFv9UZatRNp5H33KTH6KS1aKC3Ok98VEZCjBCKDPI\/ZDesxJX1moNjn\npGtOJBA7imoGjmZDyvG3wV2feKpTXPZOOlKikFOsCWA9AawPejO0yoqMurDTJmgpJRp1S6i748EP\nxNRJYimThoE46isGglnM23YjAbsyL0RVzK8+jPVu6Mkxf63hhe4QvQxLGZbJ\/8ybZgLjSYCqjcoW\nn\/cDDHzTq\/sKrb7fHpkWgqgP5VSOwzXzOEwZG1pmRhiVPIKanhk3m1rkVfPeVWnlXwPbktjj+3dl\nt2p7eq8upnQKdfeeIJsYZv+H+amMXn5H9hC2pfViR1Yfdmbd0fzhwaxLzs33xmlsPQppFmS2I5Vj\nc1KHuCmxi2LrHnYfm5OmkKCTJsnLWGQdKDMLYeVmVZjaxoWX2\/0YU+SFsq2p3TyzkvBTEyjh3dSn\nj5B2zeuFzKxZmuw+Oi7Njzuy+nG2ewm59U7\/3x9ao9XOYSWWDBVYNlbDOZJHY3+Y92Uiz5nEndl9\nkqUwE96a0iVuzer\/zTcGG8NafDYlaLktSZ3ittQecD+ZUDn4EDUkpKLORclqWOkl9oj9oGJBt\/vw\nCL8rd5gvbHKCCfIPFdyjEBYfFOH5ozG8erEEz1wlnb8jvPtZTgaR0jKqScU\/zAgZdVbfXwP7IraN\n26bsEiNO30dx07xk0MMUbSU0mrHh4TU41gosSULOmRSvBdMw+0pT3rX8p0KxdMfwrrFsPHbcIgYr\naS5MhrE1gn97YNDFnqdp5oIVJ9qXUD64gotDK1AP09I9ReXoU9yefopO\/TPUjD7EkdaF31GzjUpr\nEchaJPbr5uB7W3ipuzn2GCGnjMKfZnBruMLWGwcHnezsdxNg0dLJrmH\/GzXvPm72S6I31\/R5cH3A\ng8tkzEVNLmSTzyWTaJjXsQGVgXm94n+5z4aK6EtWkfVoWKl3rNJMQzFgeyXWDz+Uepk9\/8\/P37t8\n2Jnb0BKmYz\/fAfeGRZP\/nny9OqXCKiaSN8ZfsiKWlpwWSwmmYCYABoj9ZP9mwCIq3gBj2d4495Lv\nNT7HCWKZieW7syZurQPrTM1ef7beu\/GbIxOKAG6YRisddtERc8+x+5AVT\/MRxBKNYrLIi7bVh7BS\n1j+AjJVzaP4lqkaW35641euZqOeu7vZj670bs6oFlfLyDNKqZpFxRUBWtQElHaJGMwPOu16qbs29\nFHosr3DX9hIdxmcoJ2Aso1k+M0OPumxbF7h1XWxEDz5pUu8t1AuhNGWn1btQ0umBfvEVplwvMO54\njjvmFVSMLuMQnaHZkSCLSsoOUyyfY6\/YufX+TdaH7PBkaAqRzdXt810z0KBiExdSZhbZlJ3X6EIV\niegKxWJJ3yJyWt3SAJHe6PYOD\/V2Xn7V7vchpFg6ojSL00U0bp1hJzt+3Q8ILbP507ynIpFIXx4l\nEhgaJPjkaw51osahSKxb+KjvDZkXLhvPY2Eik87FkbIN\/28XK621J463dsesnqX\/C5dn11ODs7Dz\nAAAAAElFTkSuQmCC",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2011-08\/mental_abstraction-1312585738.swf",
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

log.info("mental_abstraction.js LOADED");

// generated ok 2012-05-25 10:00:14 by eric
