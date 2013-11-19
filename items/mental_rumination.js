//#include include/takeable.js

var label = "Rumination";
var version = "1337965215";
var name_single = "Rumination";
var name_plural = "Ruminations";
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
var parent_classes = ["mental_rumination", "mental_item_base", "takeable"];
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
		'position': {"x":-20,"y":-45,"w":40,"h":46},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAHuElEQVR42s2YiVYaWRrH8wY+Qh7B\nR+AR8gZxeqZPZjoZO0knLokLKkZFWWKCCm4YTVxQxCUICFosikpARHYJlMgiyFLRkKDZ\/lNgJznd\ndjpz1JDcc\/6H4tbl8jvfd7+l6sKF7zxE\/nTRMEnJVLFXxOTOPiF0xmXfBaTF7C8a9CUYpkSW0etK\nX\/w43+mIl9heHOLoAxA\/eo\/pIAXusx1+wQHbzeGStVQWhzRInzeBxuVAHlJgixJLe6+gTGShib9C\nn2cPHFOQKjgg91mIqYm+hDyaQacjhnq9j3E8vyPudsXRu5VEtzuBB9YImpYCKDhgk5FkcEw74FvC\nOQCqSu7KW7DBEChuWwuCZw4hdz8HV6P2FNbFXTspvjBMFX\/pfq3GW1Kv3bIyFzzkHZW7pKBw3aHQ\n9Z7IPvNr6zp9JIPrdDMLCtcbWL\/YE92nRGkUfW2twOvj85yeSwUFFId84r7466+ep9FwuLjD+5wo\neGAMRCJUX\/yo+O\/WzMbDxY+D24TI7y8qKJxkd5MxEN0j\/26NkooXj0dCpCAQvVhw600mXIze6Isv\nuk13EC+ZTUTJPtq93wTgkTdZEj98R1hSrwkeXSVOuC7hZYrCJwHNSBfpX+6JFam4dSgcz8Plqooi\ncgArXfL+aq9TjbmdFyBfv8N0+CU4a9vWO\/MuRuv6LqM7lGV0ki8ZgyQpFu6kTrhYexAnppN7VK5J\n+FSn1f4iSSBNjQb3wV0Lnk+q6bFFKLrzgMC2i7oFr7V81sZsMPjF7PUIwTZHrEzCB7aVRGeIYnz8\njYraLZHGYxCQsRPphLXkLWle9jMrlPbzcXkNbTGWzsesI3zMitmTmz60epmNK250bMdIUfrYWlPx\nMNlB7uKvgoJr9xYXNEhyZ20kGqIE\/jAe+iPi3NxQKHcdwude0F\/E8\/gucR0ePsflKnwkK6gI84Ev\niJx6yCCzfzuI+97tfOC002A81xbFdbgprt1efOF7jJwVB4Lb1H1vAA+3AujxB8B3+6x8l0\/Gc3nB\ncbpkLYVO0H8e8lSISVsKrRur4NtNaLFsgutwUW1O56ULP8ro9nlJNtEMrvkpOHYn2jYd\/As\/0pDF\nnl9v29xEqy0nG9g2G\/OHAlzMhIt7nztQvzQB3rqOzo\/PzteCxiz9NPaWYqz\/rtx1bs6Qif\/f0Tce\n9aDZ8gxNZhM4ttXzaa20B2G+PhMljdk49NkYtIcxmI6SMLzexcJBCLqDMGaTPmphP\/RVl80kvLhn\nWkGjyQiubZk8E5g67S\/SvNiWmTNxOLJJ+N\/sI\/Qug8DbA2gyYaxlorC83AWRDEAWcUDkW4I86bMq\nqUDxl\/abirvBWjWgYUWP+3bj2Z7alCm\/WLbnhiuzh9ibDDLv3+A9PiDz4Q1ib1\/Bl03nAYdCVnQ9\nN+KhRweuXYPJXReVg\/nzftNxb4nAsYr6ZSIv\/uYSzpC3fMzh0AaM6SDcmQRCRwdIvc1i\/\/0RUu+y\n+e\/uV0ksJbfwwNiK9lU+WsxjaFqfA8+mwVTce+LVxcjOJsk0aHAsNQTO5dMDjoRt1DBpgSFJwrof\nxRYNEzx8gTANFjzcx9brFBZSftTKLqPbUAmVtwdtq0I0muWoW5nCcHAd0vTnuiqNOcUtpkU0aZrw\nyCIESydFh\/uUgJMx5yWBRw9pcAPzux4sJ7dhoS25seeCI+GCLeGGIbWNDtII9oYEHOsoOOvH1msw\nzYC5PAmBg4Bk15VvsSSRTTHHTKBqQQbuQjXGra1gaYfR6z9lFA9tW2QtFgUGfauQBW1Q0ZAanwIr\nfjksQQ1MpBICSz94Xi04rkW02tVotirovKYEi4YrV4jBtaghdC0TIrfR2mhU4o5mGpXKfrTM\/Qye\nphz1Ogldk1dOl6hF3iUri7ZEp12Lwa1VPN6Uoc9QC\/FKLRTuHqjc\/RAYm9Hq0IC9OY8mGq5aN4bS\n8Ye43NOQ1+25EVQox1Ghmvhd0j+ocUVOd9Pm0zUIAieB2mUpWp7JwbWqUEe0gTt\/FYNr9ZC7OiFZ\nZ6NZfQssPR+NRjGqtQOfwD7qV1kfyuZGj6UYy6v846cyfxwYp3+H4tJbq2iL1NIlqc4ooyVBs\/yf\nEOrK8pCs2cu0q\/6FvuUq9BurcXOkLA\/1U285bo3+BtbTOgyZu9C\/2oKq6XLwCA7uKnpxWz58LMXI\n2WrwUNB6vUYrwV1iFNV6SR60ZqEdrEXacjoOqmev4b6mFJM2Hqbs7bg2VJMH\/EfvXdx7+lMefGKD\ng4EVJu5M3QZLxcatmX78NjNIAz4+e3mTpM1F921qqnx+CJULw3nQKu0Yfc4keeAq7RDqNK1o0z+g\n1Y4rg59de2XgFsokZaibu4fKGQ5u0K6+MdWf1y35oKzFrD6fxlTo0V+qWhwBc3EUdzXDqFA\/RqXm\nySdV5ETPlakG8ctY+x\/O35UnfJROCFEqFeFXWqUTItlNef\/5N6a1urGSm7N9VBMxDrZ+krbWFHhL\nM7SraUvOP0GNehhtOhkq5h7hP6Pt+HmoDf9+wsO1MQGuSTpwdaxDdnVc8G075isSUVGpTCgufzpA\nMVXDaFCPolEzBjYhRfPiOBrVY6hTPsENKV0dDJO53MY\/dfo46\/hlspNxVdrFvCbtEl+fFFKl0i78\nd7wTFYpHqNdPEN2kkfGt\/vt\/xBlfjf6e9GcAAAAASUVORK5CYII=",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2011-08\/mental_rumination-1312587023.swf",
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

log.info("mental_rumination.js LOADED");

// generated ok 2012-05-25 10:00:15 by eric
