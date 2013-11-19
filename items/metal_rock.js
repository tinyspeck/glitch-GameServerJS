//#include include/takeable.js

var label = "Chunk of Metal Rock";
var version = "1345748637";
var name_single = "Chunk of Metal Rock";
var name_plural = "Chunks of Metal Rock";
var article = "a";
var description = "Chunky and metally, this rock, when smelted, makes <b>Plain Metal<\/b>. Boring maybe, but it's an excellent base for more ambitious alchemical experimentation.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 50;
var base_cost = 3;
var input_for = [];
var parent_classes = ["metal_rock", "takeable"];
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

verbs.smelt = { // defined by metal_rock
	"name"				: "smelt",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 53,
	"tooltip"			: "With a Smelter",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (!pc.skills_has('smelting_1')) return {state:null};

		if (!pc.items_has(this.class_tsid, 5)) return {state:'disabled', reason: "You need at least five Metal Rocks to smelt."};

		if (!pc.items_find_working_tool('smelter')) return {state:'disabled', reason: "You could smelt this with a working Smelter."};

		if (pc.making_is_making()) return {state:'disabled', reason: "You are too busy making something."};

		if (pc['!in_house_deco_mode']){
			return {state:'disabled', reason:"No smelting while decorating."};
		}

		return {state:'enabled'};
	},
	"handler"			: function(pc, msg, suppress_activity){

		var tool = pc.items_find_working_tool('smelter');
		msg.target_itemstack_tsid = this.tsid;
		msg.target_item_class_count = msg.count;
		return tool.verbs['smelt'].handler.call(tool, pc, msg);
	}
};

function getDescExtras(pc){
	var out = [];
	out.push([2, "You can use a <a href=\"\/items\/620\/\" glitch=\"item|smelter\">Smelter<\/a> to turn these into <a href=\"\/items\/616\/\" glitch=\"item|plain_metal\">Metal Ingots<\/a>."]);
	out.push([2, "This can be mined from <a href=\"\/items\/614\/\" glitch=\"item|rock_metal_1\">Metal Rock<\/a>."]);
	if (pc && (!pc.skills_has("mining_1"))) out.push([1, "You'll need to learn <a href=\"\/skills\/52\/\" glitch=\"skill|mining_1\">Mining I<\/a> to mine this."]);
	return out;
}

var tags = [
	"rock",
	"basic_resource",
	"metal"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-13,"y":-30,"w":25,"h":30},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAIuklEQVR42u1Y2VPb1xlN92SaxnGn\n0xknNYRVYBax2sgYsZjdMiAECMQiiUUgARGbIICBIAMGu9iN3QGntuOkS1wXO3Sa1PVMHTN2bKeT\n6Qwvee3QPrVvyX\/w9TufdIWM8Sr3pRPNnAH9tnvu+c757v3phRe++Xzz2fwQ0bcY32V8n\/GiHz\/w\nf\/\/O4+73ege0brd1rawsZ\/V\/Qe57jJcYP2K8ytjJ+PHCwpThysrSZydOjN0eH+++1d5e9\/5297e2\n1pxqaqoks7mc8vL2UnJy7PrzJAeVXgYhxk8ZuxivA5cvL93t7bWTw2Ehk6mctNo42rMnejr4\/vn5\nkR0mUwlVVhYKcnMzQZA0msjVyMidO54HuVcYP2G8xghnRDKi79y51vjpp5doenqIyssLKSsrndLT\nkygpScN\/E6m+3rAGOBzmdZOpNEAwOzuVEhNjmGAERUf\/LDfUsr7sJwfFIhgaRgIjeWJi8IvR0TfJ\nbq+ngwf1pNfrSKfLoLS0JKqtLaeGhsMB1NWVU1VVkRDcty9ZCMbGvhEywZf8Zd3lJxfP0DIyrly5\n5JyYGCKPp4eVMrGCRVRYmMv+yubvldTaWkeNjVVMvoaGhx3U0mKEooRS+whGU0xM+LMTRCr9gYDn\nwqDc55\/frJubG6Oennbyekfp6NExOnJkkNUysjKHqKKiVNT0eLrorbdcNDTUQceOeeiXZ6aIw8Pn\nD1JJSQ4rHM8+jRKCERGva5+VIFrHDr968FzC4qL378PDPdTf76Tldxfp3XMnaXZugpUyU01NFdls\nDdTb285o5dA08vdaLm+FKIcSJydrKCEhmj0aQ\/HxUaxeGIUajp3+YERfv37VPjk5RC5XGx2dHafL\nH52nlT+9R2eWF8jV3cFETOR2d7K6rdTdbaeurmYps8VSId4rK9MLORBTCJXgi36CCEf08eOTX6Cc\ng4M9dPIXM\/TRJ+\/T9dsf0tnzi+TuczKxDhoYcAnBjo4mslprRcHa2rL7kqvI+RK8ey1UBdGQX7t5\nc+W9kZEe9tsAjY720cLxt+nCB6fpN5eW6MRJL5fUQePjA+y9bi5\/J6vXwqGoYfWqRL1Dh\/IoJUUT\nKO3zIogW88rXX\/8j4513vDLwyEivEIFaM1zmt6dH2Gs2JtYraXa7HeR0WqmtrYGamqrZd4aAeiCI\n5qwI+lpMaAS\/zfjhvXurHy4sjNH8sTFOpYvL6GQSdgmE3W7hdLYw8Tf5XDcT7GCP2viYhUtcI+GA\n97TaWGkrvMIIubi4SPFfSATxuXHj95lXr56ln584wr5qZP91SRldLjuHopoJNvAxF3388Qd09+4q\nXb3yK7p4cZH6+lqps7ORjMZiysxMfCAcvv4XFlpI8JmdHc5vbjaKl2D6tjYLD9zM\/5t58DJGOfuv\nTVLr8bho5qiHm7KTpqbc7MEqSk2NE\/WCyT1nggNTvh5mEJIwvt1uZn+ZuOHm8fEKKSc8Z7PVie+M\nxlJeKbSSWAANeStBX0DC\/PCtJHNz\/bkzM4PhT0vwolpH0XCbm6uFSG2tQdZcs\/mwkAYxm61GUFKi\nF48pMgcOpPPuZS\/l52cJkGg0bKXi0FD72sxM\/waPxSIYOEyxq6mpsU+2uszPe9ZA0Gw+JCShptls\n4FSmy26lsrJYvkNhm83E5W6h4uID0k5SUuJ4fc4NbBYGB9vo3LlZApHu7iaZxN69SezdP8gxr9fN\n1+sl7Yy1JyW4gV0JWsXhwwW8Y9GJ6TWaN9j4UVRamhPYoQSjrCxXjquJAdgssFqceIc0b7Qcq9VI\nN\/76ayGHCeK5qvRRUWHWxxI8u+zlmUaI0X2NFq0iMkAwPX0PFRXtv49cTU1pQDUQBNmMjEQOTHwA\nUA7PKyrS0YULx7g9WSknJyPIl2FPtss5eDBry00+xMaGS1\/zl0NUzclJl60UbIAtVvBeECgt1VNB\ngU5205gcgGdVVfmqk5WlDTyfvbvxWHLsLS3eHbYjGAyoCVVB0Om00J8\/OU9LS9NSSijD7yJSYigL\nT6pJBZdTp0vlcB2QY1DXYCjY4HumLJby+1NtNJZU8mxPNTQY1tXMkUDcCKi2ob5DBZQ9IyOBW00t\nE8iTZW2rJze9qWfvxUjjDp4kCOI8XqowsTufXabJyR4+nnzqvhebP64u0zL7Dkp0dtbLG1hRUTZv\n5TN4VvniKZBGqygo2CflwqBdXQ2iFBozgvQogpjQ1irAl3hnsVqreZXCitXKvtdwqSM23\/yYgFY9\nCFty1SqwXG31kwISjklgMvAhSof0dnVZZCCHo17uV8BktyMIi6ixCwv3yzFUS6\/P3FxpeDt+UV0E\nJTAri8VHBIqePj1JKytnuCX00diYk3tes8y4urpYrlfeauR7+vvt0kJQMnhPPReefhhBqItr0NiD\nyx4gyF\/WVRngLZTR7bbRPW6k\/\/rnbfrPv\/9GX375F0np1tKpNgTA7NuV12arFltsRxB+xiqD60AM\n4qA9BRRk9aw4Cf9gMNwEBa5duyDEbt26RL\/77UlZAYIHhXpqQo8iCCV7epqlfNsRjI\/39Vb2nPzF\nUuh\/JfWFhGXd0OlShBx6HJLq8bTx3g\/bKsNDTQ8PIih46MMIghxKDqsUFz\/oQZDBdWjm\/hXkK+wT\n+f8p+dVBo9ldqdoGQqFuxIOwUmwdEG0AQBBQbgTqUQThY4QFBNEJFEGEAH\/hOazfPnK7Kx9oyHgv\n5ROrDxrX1+MwKJowuj2S6NvZqBSXSdpxvSKIPohkY3OAEKE14Tr8xTMUQRBDyUH6qbf\/bNRc3m1M\nQW4VAHT4\/ftTAoByaC3BiiuSsAu86euZ+bI\/RJrx4o7r4DmEAAShJMaJiNgV\/tQbVniAjfsV1l08\neBMxQgQqK4LY36FdqGuys9MkjTiHEMFjaWl75B4cB8mn2rk87LNd+bcCRgdAAqoAaBHBJIKh\/IeU\nhvzzG6SPjAxz+5O17YCKlCKmEhm8lOGcasKM9ZB+1XpUyVEOtIBnBSb7f\/W7+H8B2ZKN5vxBGtwA\nAAAASUVORK5CYII=",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/metal_rock-1334275865.swf",
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
	"basic_resource",
	"metal"
];
itemDef.keys_in_location = {
	"p"	: "pickup"
};
itemDef.keys_in_pack = {
	"r"	: "drop",
	"g"	: "give",
	"e"	: "smelt"
};

log.info("metal_rock.js LOADED");

// generated ok 2012-08-23 12:03:57 by mygrant
