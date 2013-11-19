//#include include/takeable.js

var label = "Glitchmas Present";
var version = "1337965214";
var name_single = "Glitchmas Present";
var name_plural = "Glitchmas Presents";
var article = "a";
var description = "Merry Glitchmas!";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 1;
var input_for = [];
var parent_classes = ["glitchmas_present", "takeable"];
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

verbs.unwrap = { // defined by glitchmas_present
	"name"				: "unwrap",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 53,
	"tooltip"			: "I wonder what it is! I wonder what it is!",
	"is_drop_target"		: false,
	"handler"			: function(pc, msg, suppress_activity){

		var failed = 0;
		var orig_count = this.count;
		var self_msgs = [];
		var self_effects = [];
		var they_effects = [];

		self_msgs.push("Oh how nice! They made you a present.");

		var pre_msg = this.buildVerbMessage(msg.count, 'unwrap', 'unwrapped', failed, self_msgs, self_effects, they_effects);
		if (!suppress_activity && pre_msg) pc.sendActivity(pre_msg);

		this.replaceWith("collectors_edition_2010_glitchmas_yeti");

		return failed ? false : true;
	}
};

function getDescExtras(pc){
	var out = [];
	return out;
}

var tags = [
	"xmas",
	"collectible",
	"no_rube",
	"no_auction",
	"no_vendor"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-22,"y":-41,"w":44,"h":42},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAMIUlEQVR42uXYeVQT1x4HcP9TyUIg\nERCQkLAHWYSAbIILFpdSF6wLKggIbrXU4o4Q94KgIIpUEUVBgQAGRHY0KIsbCoqy1tK61K5it9e+\ntu99351JMjLq++O90772nJdzPofJZDJ8f\/fO3Hsnw4b9P7x6SwUuPaUCNYVsp\/2lwm2Kkeo\/qrMc\nfFwnxeN6KZ7UW+EvFXB9pGVa9wV3\/HjLl\/DD3277\/XkBHygN9HtUgthelUChU5lhpCrYZ4mnanc8\nv+aJZ63ygX93LKXnnGDWHxbwWb1U\/\/NLdvhcbY8vGh1wJ9sGN2LE7ZX7JLhbYo27hYZoVo0ZyE+x\nSzuSIB7M3GraXphkom7IEqkf11lrvqd2wLMWB\/HvFurjrhli9C8NQH+Y4h99oe2\/dE7FL3en4KMa\nbxxNMEVpqjGac4ToLjVAn0qIvjIh+stEqMsywaHNJihKNkFD1ig8v+6FX+9pvntf6afuivAO6IqY\nEPBfheonX2xd4ZzWdNJroKc6CM+Lg\/Fj\/Vz81rkYg9cCUZFmiPT3uYhfLsCBOAN81eSCwVY3DF4l\n3Uy5Jse31zxQkGyB9DgezqXo4\/x+Hu3uDim6l3mhO8IX3VH+6F4+Cd3Rgbi9a4r6euYUdf1137T6\n636Kzs2zFZfn+yg0gaKnBvQvn6zoi5qo7o\/0R0eCLzq2eaMj3gs3ksajf4s3epe4onexM+5HOqEm\nYxzaKvzRVRlAt+QPbX74\/qYv4YPvbnjjW9Ja314bj5wdZgibOZwRHzkS3RmO6Ix1wr0VHri3egJu\nbw9A025vXCz3gbrOHy1HfdCwYiyK\/I1xzJ2DYR+FueLjCE\/0r\/NFzw5\/XM71xKUqH1wp8MHNZC90\nRXvgwTvj8TRlEr6vmIXf7i4C+oje+UQIfr47DS0njFCWyoOKksJD4V4uMt\/hoWi9OS4nSaDONsWd\nAiPcLRCg7bQALTn6UH\/IR20GH+q0UejIFOPWBmtUTx2DD904ODKOg0zikCsVcLH9wIMlDtAZWCrD\nk2WueBzhjsfvu+FxqQu+b5uKH9tn0H7rXkgChhILSMB5+K5sCh4lOqNmrglq5hjRroaY416YFdrW\nO6JtA2mtyLHojnHE\/Vh73Im3RnuyGG15AvSUivBRuQi95wxQFcunAx104SCNOODMQaoTCdiz0E7d\ns8gOvZRQO\/K\/7dG\/WCtWSn\/5dZ4oHfD0XTk+C3fFp6SwO1FS3HzPBvUbraCs9Ybyhj9qznqidbcL\nuqKc8CjCA32L3dAUbIOL4abkRhKyzpc\/n0sH2kckj+XgA0cO9hDDOuZZq+++TYaI+Tbo1Lq3wAb3\nF9iia62E3JmGQwhfOGrCFPMwzAlfRLrjWbQXBomnpAe+ipSTfZ7oWuCMhiAJcscb0q2TTpwNEWDg\ngjF9t+tkv8nDHhkHu4gdDhzE2+oh0Z4TPuzmbKni5lwp2rRuhVjRbhMd4RI8qDB+iQmtL9uMLoQp\nZqFGN4X0xk+rJ73SXSna1jkWpI+H1Wb4+MJoxpGZfCoQ1lmPRLR0BBJlIzUzUmuweUDLWxaKC2+Y\nDlx+0wKtsyxxlTLbEtdmS\/BJlflr9R60YAq5Pc8K7QTpDXSQ3rhDPI\/xwz4SJmlId+0mrbOTtM52\n4kmdBR7W6IixO4iPZZLh2OowElluejgu57CnzLJZInV2ohhpUw1xwk+EssDRoAI\/qpMwHg9xf7el\nphhtIZTrcyS4ofVkmZzpru2kZajWSbCjuo6DLcTTi1Z40mDNSCXj4wcLTOhglGx3vQFWwCsLjNXl\nzeNQle+AxhkinJtsgFN++uREtmyXNDp3S9A40wKNpAiqkCvBGk3BYjS\/JSbXpzO2kUBbtYE22XCw\n0ZqDtVI9RFmOwJdqO3q61MnIdMCuFRZMQELNClibYqUua3NHedM4NM8UoeXNUbQvL8sIx1c0JYhx\n3EeI4knGqA4yRf10czRoXZxhTrreDhtIoPVaq6QjESYejqWWw5FArq+vr8jwdZMz7ZtmF5yKM0PG\nZAE9OGcHj8ZRb312wMpCmYoKWHZlHNShxrhCWrGJeFIqIydw1Wh5oZ10cekkAd3KaXIutpMbINWd\nz4Sunz4G71npIUYyEqEk2BpXLtastkRcgh0yx3Mx2OJCpkU5ozhiFD1I0wN1ENke91ILVidLFcpk\nCUpy7VG\/0gyN04W0J4Vj6Xn1Zb3J1nQRukIaFxkj77QDjuyUYL8vH7F2I7CEtNYm+5HY76yHZHJM\n7A4HGrX97TV3\/HDTm1GywIiePSibyfCWEmjADnjxDUPF+WkGqAkyxKVpQsZnShcy1\/q8om+fLVME\npSpRgqJmd1rDMnKDkRAnPHn07EBJWGKGbdFmSPEX0O+\/qJXjp3Z\/rQAS0ITen056I3arLfbMEA2y\nAtaTgAQahujY6ojPS92ZkwzVl+LAKqTktCPOXnan1cSYQU32Hffg0WOhTrrXi+1PlB74tTOQUbxw\nNL1\/T5AIaxLsER9qxh5magMNFbVkiKHUaTVutEZfqgy\/dE5h6E7Yn+rIFFIXLELVclOciTFG\/kEb\nlO20wsUgIY7KefQg\/ToPS7zxz+7pDOVCU3p\/4ixjrI63w6Ywc3bA6skCRfUUA1QHalwgN0reBVfc\nL\/bAP7umvaL\/gBO6UuRMMRQlmSEq3zAA1ROULHcuDs2zoGeRlz0olOPvdybTfr4zCQXzTej9G5aY\nY22cFdbFWLIDVpKAlWTs0ylOlCK31h23L3mTlgukV8JD9aTIUJhqi6qZQtSQgnRqdUjgTDcudvkI\n6BnlZffPOtFrR538ECN6fxzp2tRpXHqbFbBiokBRQYYNSvk0Q+QdtEdOlRzXLnvRC1IdzcLUF7fy\nnHG8Uo6StRaoIi0\/VLXWvkAhVqyRYA8ZYpK00x6Fet+mtMNXV1wYuXNEzOfJrpq\/rIDl\/nxF+UR9\nUFTkTj6Z44TsCjmaG+TkIced5ZtmN7SWOOPYeTlyMx1xgRR1YTJbBSkyYbEZIuJssG2CAT0X62yX\n89GitCHP0XYadbY4SS6pocfQS62hLxUJqPIn4YiSYCHOrjLHYTI3NxXJyNOYI5ne2CrJ9ZmlkiPn\nkCPOTxSwkcCqt0RYv8oS4eussSFQRM\/LOpsmGqI1ZwxZFVkwTiw1YR1DYQUs9eMrWtc7oHQCn5Eb\nyMPV+NH4tMbqhWoprVDlgswSOY6cGQdVgD7KXpL3rhhrEu0RFmuNjf6G9KJhqKvpo9BdMgpdJSLa\n3pUmrxzDClgwzVDxYZoMRaR7iv34jKaNZEFZbsbSV2aKmkUGSJ\/DQ37YaBTMHYVS0vLnhji+3Rar\nyHARFWmBlSGm9GpmN5kGE7Urm6b9Qtw5K2DEbzTHFlc+8zmFFTDnPUvFQXLr56y2QJEvj6F+X0Ce\nY4WEIUvlAn2cCeCxiimZoKGcIkD2ZivELzHFXm8OvaqhJM00Y7Yb9wlx85SAsVthhjgvA+ZzCitg\nZopMceCMB7K22eKsNw8FPho1K\/noOCNgtGuVv81jFUIXs8oaSjIPK\/00DpJpa5tMs+SixMw0xiYZ\nl95uyhDST3ctxzUO7DTBqiAj5titNnonWQH358kVqac9kE4G4HwvLs5onQvh4cYpfbZccjPN5bEK\noRzeYotC8lcn3YWLzWQdSIlz4mH+CinWehvS77tKjelHT519ChMsCR2DzdYc9RbrEa\/+4pC2R6ZI\nSZIhNYOMSaSbTpMlUR5RPJvLqlSnZA6XVUjOXCMk5XjgWJgZHZyy35lLrwkp78gFmBctwfJAI\/p9\np9IYtYf4jJMx3PYNrwume+WPGyE+OpETnjNdqCIBB6mAlKJZXDSSCnV0FZ+L0HyuK+RAvD32HCM9\nsMEGeV6a8KnOLxasUVOMMDdKgtAQM\/o9FbCGPLjXHOSpi+N5\/\/kvXnmeHJdT4zmxhcFcdd1hPlhI\nxeeieUzA42S5lbTHCbuyPLA3xYXZTz1i6gIuCzKmA84LF2OdHRetJ4WqugxuwO\/2K9fFwyPEpNpZ\npDsUNRk8VXEYb0AXJGueCXYecMP2wyTgTicm4BG3FwHDZppgTajx4PKJorQ4yQjx\/+QHTaX7MP3T\nHtyAPE+u4mjwKHVamOlg6jpbZJO14NCAcVacwRgfQ8Um6TD9P\/0nYepaPuXJCT\/twUkjy3f1emu9\nv0awP+r1Lwm2NIaLCETvAAAAAElFTkSuQmCC",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/glitchmas_present-1334254948.swf",
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
	"xmas",
	"collectible",
	"no_rube",
	"no_auction",
	"no_vendor"
];
itemDef.keys_in_location = {
	"p"	: "pickup"
};
itemDef.keys_in_pack = {
	"r"	: "drop",
	"g"	: "give",
	"u"	: "unwrap"
};

log.info("glitchmas_present.js LOADED");

// generated ok 2012-05-25 10:00:14 by eric
