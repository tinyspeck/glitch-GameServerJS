var label = "Ancient Focusing Orb";
var version = "1312848287";
var name_single = "Ancient Focusing Orb";
var name_plural = "Ancient Focusing Orbs";
var article = "an";
var description = "";
var is_hidden = false;
var has_info = false;
var has_infopage = false;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 0;
var input_for = [];
var parent_classes = ["rook_hall_focusing_orb"];
var has_instance_props = false;

var classProps = {
};

var instancePropsDef = {};

var verbs = {};

function getDescExtras(pc){
	var out = [];
	return out;
}

var tags = [
	"rookhall",
	"no_trade"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-94,"y":-195,"w":189,"h":196},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAGDElEQVR42s2YaUxUVxSATauOLPMG\nZYaB2QcYh5l5DK4gjYi0qKBOUZS2GnFhc+I0iiBSRJxWcCkVhaiYEnTUWhuDC+mfqjGhi0urRlMX\nanEjWtFGsTaKtv1ze8579z0G0z8uPDrJl3vefS\/3fnPOvXeWfv1e4VW7pXLc7r0NR1q+P3rk5OnT\nh1uOf\/tN466GRf3+D6\/tO2vf3b2n7tl3PzQ\/vdF+6dlv927\/fb29retS67l\/auvXVvap3Pr1pYot\n9VVXmw5sfXzi1MGui5dbOq\/ePPP44pUTHT+dOXz\/8JEvO0tXFuX3meAKb9HcteuXP9r71YYHR4\/t\nuHv67MEHZ89\/3Xn8xwM3W1q+uObbtea6t3JZU58JVld7V5VXeJ40bP+4Y\/+hTR1HjzV2Hmyubd3h\nW31l5+7K1rr6kvMVnxT2nWCue0H58tJFT2pqy36v\/7zs2uZtJRdq6kpv7ttf88u2hvLLS4rn3shz\nz9rXZ4JZ2VmG3ILZXeWrCv\/wVrkvfLaxpH1Ntefc6nULT1as9vyaNSu9fd2GioI+kTt3oNi4PWe8\nN8eV1DZl6viuhXmZf5WvyO6orPQ8LC6e\/8jtmfNn9gfpTzfPS964JzfTKLlg04pMX+OCZOLLSyH5\n6fEkw5VMcnKmk\/nzXMQ1NYlMSHSQD1Od5NOsBOLLTfNJnr2d7lSCgtVZY4jnbQdxjYgk9kgNsRrU\nxKwOIfohQSSN1RF3ip3UzU4ijVJmsdk7wwflJTtyUzjJrXPGkqoZ8aRs6nBSODGWLE5lybK0OLJu\nZgLZlp1E8FlJs7gSZEomx5HiSbGkMNXBtXi9LN0pgtfLJw8jSyeypGgSC62TSCZYMD4GSmcjeeOs\nJC\/JShZCjGB\/QXIM15+fbCXCcwj2SyI3MnKwYuZoM8mKjwTMJHOEiUwbbiQZwwxczDHSRGaMMnMt\nPsu1cJ2fkpjc64KsjlkSa1CQWCMArUOvIE4TD\/Y5aT+L\/bR16BnCQuyKizrU64J2HeMFiIPKYcxS\nYWyx3w5CNnwGWrxvp3HGyJiW3hfUMF6bluHkbHRyLptUkDV2S6IU\/yzDZVIaQZpBTo5m6D8zqGXE\nTPIZVJBpo2zSZNCh4zPi0HULOvQ8fMyQGK1cFBOyKbmgsAHE7GEp\/UosrD8hi5KtQbuwrgwKcQ2K\ngrTMQon9N4k0GdTxgjip0xjClZk7VqigQyg9vgm\/nYzZni5piYUzjk7OZZGW\/HlBoU+yXew\/sQ02\ng3CMCKUUBWksXEsmKEjZ6eTCJwfrt4tFQSop7TkIgqLQ8xgUPTInSuoZKQW7Px1w7QmxALeJMMu6\nnqKSCMZogr0sV145B2vgY1ZYe9gPcjYtf9+m6Y5nJrDSCNrpJ4UIJ8H0uObwj4Hpox3SCOLEQyOC\nxYmtmmCxFRgaHtzdH8HHGVKcgzCxd2iEnFhAAFurRi62lgi+D+9Z1ME9rrFNjY06CUOogGDgjdft\nNggHN6kCanHCqLAgEq0O4jLJCQHR4XwfgvejMA7nwftjLLqfYYwk\/GKOxQC0gOJVZQcASiAKGKEd\nMsgXBdmJBAHEApmJRmG\/vkgVRU0J49s4g7oN\/zEB3gMmAYmAA9AB8peVC8PKAvE4aLhC1oSTmVWB\nxKQMFCXMYYEcKIMtd4\/G+Cy2lvDBt2AML1AIzAcyAPydEgcYAOZFBXGt6AEnHWiampE1m2FiI0xq\nDAURFUrw16YwPsY+IwhyfTTG1qRkOmCMGvzlCniA2UAakECTgOuz\/4sIBtJ1wgJjAVeYfOAhnFgf\nGkD0QwI4CYMygAdjBO5xKAN6xGZVyB383xP4CHAD7wMTgNFANBD6MusRF7GRZnFcSNCATZDFVhUj\nawOuqxWydqVcdlsll3UA90LlAx8AD0PlA4CB9+HeXeAOcMuoVJyCMYqAPLoOJ9KlYwXUgOxlN0oA\nHcCCG4WWewrNwAIA\/zBfCpQC5UAFLWMZUAIsxt\/7wBwgk2YtkVYG117I6zp2+tPBtFTWSTOAR8c7\ndGdOpvJIOs1SCvAWPV7sgIluvqDePrffpOdjCF3g4YCGvgEtjdV0bTGvUsJ\/AcwnRjbcAhXZAAAA\nAElFTkSuQmCC",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2011-07\/rook_hall_focusing_orb-1311899175.swf",
	admin_props	: false,
	obey_physics	: false,
	in_background	: true,
	in_foreground	: false,
	has_status	: false,
	not_selectable	: true,
};

if (this.consumable_label_single) itemDef.consumable_label_single = this.consumable_label_single;
if (this.consumable_label_plural) itemDef.consumable_label_plural = this.consumable_label_plural;

itemDef.verbs = {
};
itemDef.hasConditionalVerbs = 0;
itemDef.emote_verbs = {
};
itemDef.hasConditionalEmoteVerbs = 0;
itemDef.tags = [
	"rookhall",
	"no_trade"
];
itemDef.keys_in_location = {};
itemDef.keys_in_pack = {};

log.info("rook_hall_focusing_orb.js LOADED");

// generated ok 2011-08-08 17:04:47 by cwhitman
