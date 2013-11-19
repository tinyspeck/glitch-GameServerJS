//#include include/takeable.js

var label = "Large Mysterious Cube";
var version = "1348259951";
var name_single = "Large Mysterious Cube";
var name_plural = "Large Mysterious Cubes";
var article = "a";
var description = "The people who lived under the auspices of Lem were always a curious lot, never more so than when they stumbled on something the giant had left behind when off on travels. This cube was kept on display at the house of Isabella, the great explorer, whose theories on the different numbers of prongs and holes on each face were rich, varied, and all completely wrong.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 0;
var input_for = [];
var parent_classes = ["artifact_mysterious_cube", "takeable"];
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
	"collectible",
	"artifact",
	"no_rube",
	"no_donate"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-25,"y":-43,"w":49,"h":43},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAN3UlEQVR42u1Y6U9c9xWd\/yCLV0xs\nA2bfhmFgBmZlmWEYhtWsZscYDAYMgzGr8bAazL4bMDa28YIdbGLHTmzXyWRpmlSKFDVVKqWqGqlS\n+6WV\/K1fb8+9Y6xWqfqhVfMpI\/30fjwevPPOPefc+0ah+Pnz8+fHn7\/8rufwbz9tcX31pM79YrPM\n\/fWzRvezm6XuLx7VYH9q+zdu59lH98Z9f3JgVyZzlN99fnb7209a6enNYvpw4xh9vl1ND9fy6dP7\nVfTibjk9Xi+ijSkHXR5OodVhK10aSv3rYl+ye7430b3QZx9fPJ\/kmh\/ILJ3rSjRP9dg0TzadWR9v\n1eV++7zK\/OxG3d7\/CtiHN8ryH68X3ty6lEVXRm10dSyVVi+k0FJfEl2fTKd3l7Lp1oyDZnoSaGXY\nJtdcG7PTjck0ujZup0sDFhrvMtPaiE3A35rJoGWc25zPoAVXEs2cS6CbMznfu5rM39+ezfrT0+t5\nW9vL2Vuzveb2fwuIiN68t5BvfXilZAwXvrx\/KZPuLWTQ5lw6XThjoIdXcuk2AG1M2mm800R3FzLp\nMgAv9icL8KsX8QBgcGXIStPdCTQN4K7GOLq3mEW3ZzPwQFkCbmMqjeZ6E2kRIKfxALO4bmvBQdvL\naXSuUU3NlREvX4P69dPjyt9\/eWb9+6866KvH9fTwci59slVJz2+V0N35TPxjB4AV0PqEg66Mp9G9\npUy6M5tOlwYttDhgpVnc6GK7kcbaTQJ0qS+ZpgRcIrma4qkPq79ZJ2DGzhrpQqueBprj6Vy9BteY\nwbYN90mlthMqSjEcouLMACrPCSTFH7\/pt\/7h6x73d79sp19sVtLTjWJ6Bm396v1aerSWC21V04c3\niun57VL8roQeAeQAbvRgNYeuopTrKPfVizZZO2ytgjku3VS3WYBPguXJTrOAnEU5R9sMAm7IqSdn\nhYrKMoMpPcGHCuz+lJnsC2BBsq8tCiXFl8\/K6b3rR+nZu8X00YNy2r6aT883S+nzR1X07WdOenKj\niG5NsZ7stDGB43gqDGCl+fNJAoKPH+ABPr5XQQ9Wcum9y3n0wfUiKfN7q7miv6kuZsghe2bufEMc\nHc8No+zkI5RqOEwOsw9lJHiAWXWH6KjVj\/JTj1Bhmj8pPntcLCwsD1ppA2XcXssWBu4sonwXbDTZ\nnUgzYIIXnCiAllHWBZRwCaVcA4ub89kifjbB2kgqWEqELrPAdh50mCK6G+8wyUPemk0j53EVwPlR\njsWPsi1HKCvJjzISfcgGsCWZgXQsPUAYPckMvn8LT30tG2BS8I+TaBOGWOq3wIU2ugzGlpktlGWu\nh5dZ9ixmBjwlpTPRwmAy3Zp30Dpc++AywE7b6cUmIuhBKX22hTi6kUeLg0lUhBtnJPlSZW6IAGRw\ndtNhshsPi+6KHAGUm+JHKfpDZNEdxLU+pNi+lkNLuMHmSibdnE+nzaUMuooyjrezkA00ckZPIyjL\nxTbPfhj7IaeOBqGhgdPxYMZIS0NJNAqGuk5qxAgjZw00ec5E490GujlrpbricDpREApgwSjfEWoo\nDZeyJscfxDoke14MkFmtOhpEpVmBlAU9CsAHK1l0HWWeB4Nj7Wa6hIh4vHGUroyk0CVkHTtvh7mu\n2ljqQ2RMAhA\/xOw5M12bspELYMc6DNin0ESXEW630lgnfp5IFuZqCkPBzhEBkgrWuIRpZl\/RnD76\ngJQ3E+yy7o6CRXYwl10Abi5mSG6xAW7NpMnxyqgVbKYLuAVobw4A246rqeNkHJVkBAs4ZnX0jF5c\nzWzy6qnTgHkdDeH8OIAOOOOoADetBcCyrCAqzmBm\/FBaAEVpo4L3kDHGm4zqA8JYng3GMR5C+X0p\nQeP9jeKj7SJ6dreQ7qK0T+8i5xCedy5lQOxWODrrNbjaggjqrIsXFzorVVSREwrAMdRSGUPttRqU\nORkms9EYQPHqOaWlU8VR1FWnBlu+YoQcuJMZqkG5ubw2AIxTeglgY8wBAcyaZHB6lRdplfvcijsw\nxRoYe3G\/iG6iW3zxpJSuIjSnexPozpKDhpFV9UWR1Nds8OhS9KeTmGguV1GngEuizvo4aq1UU\/fJ\nWFkXzuiQiUY61xAr2ipMCwA7\/mIOZpEZTMNiQzCwZJhCE7GPNJH75MgADWovt2K0zeieRdrPuSzi\nRDbIMthb6If2Llio\/lgk9bcYJVi5XTE4NgivAnsgMk1LMy6zAJ3oMdFwmx6gtNRRG0NDregUDTHQ\nkq+Y43heCFXBKHnIuEwwyu616DyOZQZ1UV6iR3OsNxmivSg+ar9b4WqMdw+8YmfmfCJN9SbRBDrC\nGFZ1XgR6baInTmAKblEDr8C5GrXUWRNDlSg1g5oDyA64eNAJZ3fqYTY9Wp4JholHrgVSfXEYVcKd\nDJJ\/ZlMkxb1DZo03tPYOJWnfATgvigrZQ1qwGKfcT7ERXjcVvQ3x7p56HZ5YRz31fGMd9TfFUR3K\neuGM6TU41l51fjh1ntSi7DBBi8cYzspoGCKeRgByutdIl0cTqb1GDdMl0Gm0sUGnRjTG4Mqzg8Sh\n6WCUASXHHRSQidgnYIUH7hLTqMP2kg4lVofvX1OMnjG4GcQIppT+0zopFTM36DRI7+S2xA29JCME\n5YoXYGerYwUcxw2XuPV4NPIR14LVFgC+2K6jZoBrrYqm0+VRaFv+0KG\/uDQXLpUghkn4yAC5vMxY\ndOheild5WGQtqkL2uBUrfUkuyTqUlwO5IjsUNzDTIID0A8QZ3KS2ECY5rae2ajW1VESD7VhoUyns\n8TpdFg3TRMC5sdTboCFnlYoaS5U4HyVHxIWAMEFbya+Acf4xcwbEC0cMM8ZgY8AeMxgLoyhD9q0p\npjtNLpk20BGYqe46rcxmfG4CuixnwG1GYS7V6COl6QTAZgA9BQM1AQRf01AShamETRCBvAsDY6GU\nbw8BY8GiN3asCXmnBVMMIBG6M8V4DMFHzkJ2b1jALopn\/YXvJWXwnvuK8TaD63Ubc3p02I2w7ZGl\nlZzrqImltiq1AMhM9ANALfUi56oQNUVpgQCNvonz1XnhwhovBl9XGEEnoFsGZ0OvZaa4jGwK0Z3G\nE9DsXgbKv\/Pobz\/06Y3z+14qFs8nuP55AJgAc5xnE6+MgRhC3nnyjQ1SCnZcTXo6VaKE8MOpFF0l\nNyUAOgsCMBVV5YQhoJXUiN9zRJ0EyFSAY+Y1kftFa1aUmMEZECmIEgHJx6iQ3dh7UUIs5BDjxSDd\nCoBzMbg5BPMKusEyBgceJFlrrElmdRhDQysYZFMMtRhkyGyviQNojWjwZKESZtEDZACVpIcIkxw\/\nZVkhVJYdImyx9hLAkk4C2KM5BsMgeR8dugf62yPgLPHeEjXGGAT1\/HnrMIPaWk2HOTAAdJnoIljs\nBzBuaTtxMoiwZsM0g6W2ao2Aaz8RA0erxa0FAFfsCBHXnipGeYsipD0y2B3XimMBjkGx7hgYuxUt\njSKgPQ5nNUCqwGQEIkcbgVa3tZL9ZGMuDX3UTlP8djVnp9vzdhppN4gbeUDgCaYHBuqojYObDQKq\nDdHSigfglW8LgOaUOK8C81GSoTvguCUyMEcCTzCHUd6D0NsBMQubgUvL5ggHQC4r648Bs0niuBcv\n9Ce7XU06BHQ8erJVBsvFIQsNcnkRvkVpQVJujhp2MU8yzGwzmGoAU7kp\/mDSEyvs3sqjYXQa+3KU\nthB\/m58aKCUusB9Bi+NhFKXWehzr6RZwrv\/bYg5mLjLIw546dDfZ4qHBtVGrm9njwZODuQMO7ajR\n4IU7iQZQ3ibERw2c2ADhO0y+KNUhiaJWaC8PzDWVQo8nogXUufoYOn9KjciJhE5hkiIMqvmh6MO+\n6L0+GBAOYaKRMUqA7biW2eM9B7QSAPWqfSj3PkrVe68rVoYtbn7tGwPAUUzCU2j4axfxcoP96fJo\nYa8kPRgMqYTNHIu\/GIaZacA4xTHSAYCNANVaqUSpWXth1IZ9LcB11yiRhX4CjIEyg+gQAoyNwYC4\nvfE5ffR+0WA02HOYD7ot6rfeUNxdTnfzRLw6apFxvadeKwxxy2s\/EQtdxYhTjzmC0CW4uxjQTwME\nOGcdj2JteAlqKUfnKI0E0AiwHiHlbQCDffVRwhyDiQzc7RmpXo1VseHoFsG7ZYUFvM2ao2TtgZe5\nyT4Vr1\/YH1zJcI918JhkwORhonXokONkttck8xy7tRNBzSaozA4D0GAZVHfaGDuWWeuujRYpcLyw\n\/ipzQqgJ7yJdJyKlvMyYCeYQ10Z6ugnnHjMYGbQLx10vNZF7KkY71G\/8y9ccWyuOinvLaXgPSRK2\nGkpU0GAM3uYSaRYjFPfWlgqPW5tflZz1uANuJ07YrU6w2FKOcEaJSzMwWuXgYSrCYBJvlOywOJaj\nBPkmJY0CcyoPsy4\/v7fe+I9fED1YtZsfrtqbN6Yt2yvDie610WR3Y2kUVvSfuStwOU8CTA3AVMGp\nzFIxtJlvD5LSMnM8wOYhD6sArAavlmWYnJ1loVJi1hcPDHqOEZ5Ugvf8PSxw91SI75uH\/+ev3ZrK\nYzTOWktxU0XcYH1x1JP6ItXfmDU2SG2hJ+vYsXkwTne1kioyg6gCr411ecF0tjxUQjnVeFA0hjEe\nXcX7h1CfXdr\/63eFx44d212YHp5SYA9prz8Wut1xIgr6DJRcrMTbG4MrxDtIa0kIYuWAtDWH+dDL\n0kx\/14909pN9wTlqUM52a5u7qyPWhxuU33RVh9L5GpQ+1feHXJtPc77F742fv5\/+qT\/\/AIyzr41X\nVxUGAAAAAElFTkSuQmCC",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-09\/artifact_mysterious_cube-1348197627.swf",
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
	"collectible",
	"artifact",
	"no_rube",
	"no_donate"
];
itemDef.keys_in_location = {
	"p"	: "pickup"
};
itemDef.keys_in_pack = {
	"r"	: "drop",
	"g"	: "give"
};

log.info("artifact_mysterious_cube.js LOADED");

// generated ok 2012-09-21 13:39:11 by martlume
