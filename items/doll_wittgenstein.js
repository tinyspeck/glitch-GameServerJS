//#include include/takeable.js

var label = "Ludwig Wittgenstein Doll";
var version = "1354304084";
var name_single = "Ludwig Wittgenstein Doll";
var name_plural = "Ludwig Wittgenstein Dolls";
var article = "a";
var description = "A depressed, closeted, singularly-focused Anglicized Austrian: student, schoolteacher, professor, maniac ... genius?";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 1009;
var input_for = [];
var parent_classes = ["doll_wittgenstein", "doll", "takeable"];
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

verbs.pull_string = { // defined by doll
	"name"				: "pull string",
	"ok_states"			: ["in_location","in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 53,
	"tooltip"			: "You suspect the doll might say something",
	"is_drop_target"		: false,
	"handler"			: function(pc, msg, suppress_activity){

		var quote = utils.shuffle(this.getQuotes()).pop();

		if (this.isOnGround()){
			pc.location.announce_itemstack_bubble_to_all(this, quote, 10 * 1000, true, {offset_y: -110});
		}
		else{
			pc.announce_itemstack_bubble(this, quote, 10 * 1000, true);
		}
		pc.sendActivity("The doll starts to speak: "+'"'+quote+'"');

		return true;
	}
};

function getQuotes(){ // defined by doll_wittgenstein
	return [
		"Uttering a word is like striking a note on the keyboard of the imagination.",
		"Philosophy is a battle against the bewitchment of our intelligence by means of our language.",
		"Like everything metaphysical the harmony between thought and reality is to be found in the grammar of the language.",
		"The aspects of things that are most important for us are hidden because of their simplicity and familiarity.",
		"If I have exhausted the justifications, I have reached bedrock and my spade is turned. Then I am inclined to say: 'This is simply what I do.'",
		"Does man think because he has found that thinking pays? Does he bring his children up because he has found it pays?",
		"If a lion could talk, we could not understand him.",
		"I am sitting with a philosopher in the garden; he says again and again 'I know that that's a tree', pointing to a tree that is near us. Someone else arrives and hears this, and I tell them: 'This fellow isn't insane. We are only doing philosophy.",
		"Whereof one cannot speak, thereof one must be silent.",
		"There are, indeed, things that cannot be put into words. They make themselves manifest. They are what is mystical.",
		"It is not <i>how things are</i> in the world that is mystical, but &nbsp;<i>that it exists</i>."
	];
}

function canRubeOffer(pc, rube){ // defined by doll
	if (rube.was_summoned && is_chance(0.10)){
		var contents = pc.getAllContents(function(it) {return it.getBaseCost() && it.getBaseCost() >= 1500 && !it.hasTag('no_rube');});
		if (num_keys(contents)){
			return true;
		}
	}

	return false;
}

function parent_getQuotes(){ // defined by doll
	return ['pls override this'];
}

function getDescExtras(pc){
	var out = [];
	return out;
}

var tags = [
	"collectible",
	"doll",
	"toys"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-24,"y":-53,"w":51,"h":53},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAIaUlEQVR42s2Y+1OTZxbH\/Q\/Yzqyg\nIATCNSQhCeEO4SWQcFMIBsIlCEGKkUtCBJWoUONtFFQaUGnFy3jpRaVoioq6Ys12WevsyhSnuh3r\nrMs425md\/WXzY3\/87nkeDbW4XrozxL4z33kf3mTm+fA9zznvOVmy5P+8Rq26oEN2vcDE1i8+X\/Jb\nuAbtBZ7+Ni2GHHquQbvOO9ypd9B6dl9rHpwNWT5nY5bhnQEOtGk5yAdrc7C5PoNrmyUbu1pysccq\nYEtDFjbWpfu6alIdveYsUcAB97fnY7M5A52mFDiqU2GrUqN1dTLWlSv5uqs2DR2VarTRM2uF0hVw\nwJ3v5\/r6mnJAdw7JYKwGJYx58VgtxGHtyiTU6hLRUqYIPOAhm1axrTFrdhM5uL5CBbM+Eab8BA6m\nTRYhQxYGQRWBXGU4DLlxaCpNChzg9qYcx4GOfGyns8dCaymVo3lVEspzYqFPF6PbpsPxj5tw5kQL\nLp7rwMUzLQzcZ1KLA5PdPWsyPQyOHOSAfgdLM6NhqUnD6EgjpiZ78PXUNtzx9uLJ93tx\/MNaGIU4\nz6LDdVanuNqNag5mr0rhCcCSgp27ovQodLUX4PaNLRzOr3t3tuPxg13kYrx3UeG2NmQKVDbo0CtR\nUyDBeoJjzjE4Fl523vp3GPHtXRfuft03D8jWD7\/dhT6bbnZRAfeu0wgstF0UxupiGTrbtTAVSqEn\nODsV7M\/PrMctCu31cTvX5BedHPC6pxs7W\/Nhq0xBIBJklgE2UngdtgKU50tgohB\/fLiBw3y4rZwX\naL\/Ys7EzrWg1qNBrzZtbNDCnSR3k35QBNpvTYaL6xtxrpzrIEuPcsRbsoAzurM9EHR0BF73+PGN2\nzNzZgY76bPTZixfXwUFbvosBsoK8WpvAHdzmLIX7QC2ODNXj09NWDA5UI08ZAWNWIvq6SnHsIwvG\nqdRMnLdjb69hcQF76jNnu2vSPDYCNOulWEUFmJWVgwTFAMc+a8dhtxmlmlisVItxYHcVhgfrePiZ\ni5fpXM5MORe3FnYYVSJWaghyzijEoyQjGuuaNRzwxNEmfuYmxh3kmo2v+\/dUYf8+Ewe8emkDpm87\nFQEp1jVFMk9xhhj61Cjkp4lhpS6GQd64vImD3f\/LDnw3sxMXPu1Az8ZifOPtw82rmxAQuNFRU9Cl\n8zYYtBLkqyOx1pSG4f11\/CyeO9vKAVktZAWarUeGG+DqK8eGTr0vYO\/jw0PmuYMUOvNqNT5wruTh\nbbXmYe9u4y\/eIkxfTTrx2VAzPtnV4AkY4IkjZtHA3ir31p7S2VpTKrb3lqGNAJsp1Jcu2HH7Sg++\nPNmOs\/0WDNlX47SrHpNH299Nd+20moKOfNjnGxm2oatTj\/XUUQ8dNGNqfCPXzbHuualLm95d6z80\nsMX7cGYC\/346jdPHN1NitGHiwkGcPbZfeGdQk5NHRNcuH3IP7ra6Dg1sxtMfbuHpoyn88N01TN86\njhsTx3Bv+gvXO4G7fuWwa\/LyoVNTU6NBFZpYt0GQYLezCWWCDGeO78O9P4+he32l79bVUUvA4R5\/\n73F4p0bdbG3SiYOq8uN9GsUK5FF7z\/SHiVE8JherClX0ygs\/FXDA+zPnPcw5tm4slrnqqB9Ml4Yi\nSx7GAU8e7uVnkQMrI+YdLNPECH69aQ+TTh1UmSe1lOcm\/LoIPP37Vctfvzk7v0FjsXSuRieBRhGO\nArWIQ9kspdzBjoZi\/qwsJ8ZbnhPjYw2tX9XUQ\/ZTvfQXdaY\/3dwqrFmlUpRkxnkKUsXQKEX0T4cj\nU77C\/VZw\/3kyFfTowcX5kDUWJRoaS2So0sbzKU6gbtof5vGzA3jy8Dp2bW5AhSYOBs3PcH41UsPB\nOp+TR9fy4er0iRavUSudY2ApCaGQR4dwJZHeCvDe3U9cLLTmUomoXi911+gSfbV6CZiDDDBFshwZ\nFOps+bPzuMVWjY8GnTg90gdzsZKPoxW5z2BXZsWgIi8RJVlxqC1XobUl12WjMbZcI0GmLHwezq83\nl5Txfoe1KtW9pkg6W1+UyKH8dyZdaiTfvDAtiq+5UiKpkYgk+Ihnz+nvEmouitKj58PHnFLFLYcy\ndhmPjD4t5iVAmTjk5y4cgIgk\/PSTT\/jn3DUuSdTvRBmyULxfl4EN6wTUFCaiuiABlRRaBldBzjDH\nGEwlDU9UdlBNAzwbqth9VTbbNIyAVtBQJeJw6dIVv4CgMPoy5eFe9tlLgNEhzybBH\/9xRfGvH2fx\n+NGMY+zz\/QLTtHfQ9ceb+3zXJzbyg8w65m5q4420OTtHDJK5k5O0groaEZ+LWQgrn\/\/0UUxDfDZ9\nVkAtWXFmDH1fBkEVyV1bGMbk+OV4LeCNyRHH\/Zkx398eTLumvSMEtnVuYVdy+eIGakArYSiRU6jE\nPJRpiaFgdZCNnOynDgZYRq4VpIi4a4UU0pKsWK6V2fEcQh0f+hKgIibk9YDsOn++X8GcGxlu5CXA\n33z6xQby1hYBuQTGkkIVFzKrjA9x0N2XHL+MJwlzkonVRm1yJHduIeDCEDNJo5a+GdB\/bdxQNOef\nM04da8bkl90E3MYhd\/YZfPKYpV4Gpha\/xwu2Kmq5KDkuxMMgUxKWkavLkRQTTC5Sx50WzV1kd90L\n9e1VgGmJYW8GvPNVr6i5SXOqg4bxzo4CWGiSKymRu40VyaeqjMmvLJwMODk2xM1A5dHBSJWEIlcl\nglZNY0FKFAfWPE+UpAWAsqil3hxFhC9V8haA\/mvPHqNIr08QCrXSXzXoqOKCFTLxUocsOtjDQNWU\nAAyWALh7DHBhorDv5igjXC8BioMXvyOSRjHg4Lkkgk2Xhv1vwOf1Tp0QZmFQTPLIkMA2ufLI3wuU\nXN7XAf4mrhylaPbF961cHOxj8K\/6\/n8B5bGKqPY7A9sAAAAASUVORK5CYII=",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/doll_wittgenstein-1334267344.swf",
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
	"doll",
	"toys"
];
itemDef.keys_in_location = {
	"p"	: "pickup",
	"u"	: "pull_string"
};
itemDef.keys_in_pack = {
	"r"	: "drop",
	"g"	: "give",
	"u"	: "pull_string"
};

log.info("doll_wittgenstein.js LOADED");

// generated ok 2012-11-30 11:34:44 by ali
