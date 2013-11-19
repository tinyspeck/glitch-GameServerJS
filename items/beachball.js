//#include include/takeable.js

var label = "Beachball";
var version = "1337965215";
var name_single = "Beachball";
var name_plural = "Beachballs";
var article = "a";
var description = "Beachball!";
var is_hidden = false;
var has_info = true;
var has_infopage = false;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 0;
var input_for = [];
var parent_classes = ["beachball", "takeable"];
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
	"no_auction",
	"no_trade"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-19,"y":-39,"w":39,"h":39},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAALmUlEQVR42t2YZ1BVZxrH+ZLNpx1n\ndnY\/7Gx2nCgmRsUGigIiTXpXRIqCFJGmCIrRoBfLGhtgJ4DSkaI06cLl0q50LoIgAQU00ZTNyqaY\nbMv+933ec8\/hICZjdpMvy8wzh3Ng5v7uvzzn3Kuj8\/\/6k5bXqJ+S0xASk3RHtSehWZizTaqoM42q\n3aeUqsiTDaqoU3Wl8RfrFW4x5X76O4rm\/OJQdrq6r+9Pt3c5WrxzsK+\/E4ODgxgcGMAAm\/7+fvRr\nNNCw6e3pQU93Nzo7OqBWq9Ha2oqqOpUm40az4vjV4bm\/CNypOge\/96ucnp6td0FLXwWGhoZwr6cP\nd8tvoy\/5OrrCj6Mj9Bja2bSFHEHbjni0BB+GKugQlAHvQXnkPBoS01BZUIHsG8qMFXYnfvezgB0o\n2rf+rNJZQ2BVXWnoHGjEyMgIny63aHTZRfDp1E67bTibMLRZh6J5QwiarIKhtAjCbfMAVK\/3Q+W6\nbSh3CEFO1BnERucr\/ie47owFSdU5K1FUZovOwUaMjo5ibGxMmIEh9HrsQ6\/jbvQ67OLTYx8pwRKk\nmkG2Wu9Es9WOGZAVDLLU2Ac3jLwQ7x5Xqu\/xX+SzNXVhhvraO2hPX4R77Tkcanx8HBMTExj+cAKJ\nJ1tRveV93HXbi7uue6FxjUafY9QM0Gk1Z0PeWrcVJcbeKFy7BWEOCo2+R8qcnw6XuQR36ywwOnQE\nD8eUuN0+iUslk9h4bAL2hyfhoJjEvj0q3PK\/gHse72LAfR\/6XWMk0G67SElNghTtrjXfjirTbShj\nKt5kKuav2YzTpsEaq5PP5rySrQTXVWiAoQ5nfHjXEw8GvdGijuVAzkcew+XoR3A99rE0dH5gbwva\nfE9IoBrnPRIkKXnHJoxnUmUZhHqZ1aRiEYPMM\/TAleWOp38cLn2+izp9MfpqzHG\/bxOHezjkg4n7\nfsi8lcJhNv7pKTze\/wSeJz+Vhs7p+pb4h0gLL8Cw5wEB0iWaQ4p2UyZFq+uYigQpVzHTwO2bwDcN\nVr8Ubjj3zbld+SumBtROGNbCkXIE93g0CIoMJTYzEK\/Tn8HnzGfwPfs5tiZ8zo907s2u09\/djz\/B\nkZgG9HopOGSf0x6eSdFqKk2TTEV5FnNXbcLlFY4ahvPaLMChVuuMgQ433OveiBHNJowNejG4bQwu\nEE\/GQhB6YYSDbEv8M\/zPfYGA888QeOEZP9I5Xae\/k6IEGXJQg+4th3mBqOmi1XIVa8z8+dqhRos2\nZ+m74bSeTfgMuKfj7nMHO1043LDM2smR7fh4LBifjIfxF\/djEAQUfGkKIclfShN86a8c1i\/pC\/Z\/\nnwuQx55g68F7qPE+yfMoqihmUd5o0ebrzOZsg424tsJ1KkXfarowLU3+SaJ6lL3RAVG9IDx9sBP3\nhw5xhQgi5MqXCEv5CpFpX2PX1W\/4kc4JNPDiM\/4myG7KpfPRx3A\/OIIqzxOyLAqNlpelnNks5jBn\nFQNkKp7TswmWANVNXlOz7fWT1GvvSeA2klIEs+vaN4jO\/BZ7s77jx6hrzxGe+hV2XGZKnv8LzyWp\nSKWi5jvFDqPNeZ9kM91laOU0WARKOSxmOSxY48kB0xlg6nKeRR2d8UHHZf13XDDY6YahHgbY76G1\n158DfjrB3nVPEreWVCLFCCq98R9oH\/0eBep\/IibzO65mqFZFUlvMoqPiETYceAifSDVaHGJm5LCB\n2SwvCgFSUQgwbYUT4uaZLtCpr\/NXvBxwOy\/HpxOR6OhN4i9MAASyL\/s7DDz6ns2\/+SgK\/8ZVDPvg\nK\/Z\/U9xmarsIaH3wIcz3fYiYwJJXAswwcOeAZxYzm9safVQ\/pKAAGCEAXhAUJEBSTDn4Lw5HKhIw\n2S4ACgq+DNA0ehhpm868soKJejZ5OmUVEVMEKGWQAdL+mxzxkyx+\/GA\/zxZlLIJlbU\/6cw51quzv\n\/Bid8S27\/jV\/AxQF2o9ikx1ZBsni9TEjWLdnCJaRPai33a0F\/OEMEuC5JTZqna4mR\/SppwGpxWJJ\nqMVUks8md\/EVQvYRBEGSYgRK1hIc2R\/E1o+waoQW0y3Q\/tAErN4dgykDNIm6B+PdA1B4pc1Y1uUv\nKwkDvLjUHjodKkf0tjkzQFdpD44OeGJ8eCsejQRINiuyunmTOSStGmanOCFauACmsqQes9cp\/hFs\n3huHRewoA7zPAU1238XaiF6U2ERJe1C+ZvgeXOmGD5Y7aAEbHdDT4oy77TNzKFeRdmFCQR1fH6QQ\nv4swUIKio7ikCY6yt4ndl7l6h6ftpfwZRw3COLIfRuE9CPXKFp5qZHcSWtRZBszelS5IXuaAC3p2\n0FFWu6K7ebbNpOLDIV9elo9YFksbkrkyZB+BUFMJio7y2xxZS\/uPsveiemSvcaQGa8O6sDrkDvIs\nw6UnGroX5632YA8M7hzw8jJ7tqxtoZNbEA5uc+tMFcU7CllNkBpNDLdNfJIhpby1Q+figwIpJ8JZ\nsuyJ5RDVI3sNd3Zg9Y42BHmkSfa+WJBLDDBhkc2ETmmZ30S70n6WitxqjQApKOmHnec6OQC1k2Do\nEYuONKQaPSuSrXI4slbMnnFEH1fPkKlnENQC\/QAl8tf5z7BXnr+zizeodJprbI633baDmEX5yqHC\nCJDCo1dayWXeSlKICiAOnYtglDmyVQ4nWkvZE9UzCFRh5fZ6HLaNk\/af3N7zLH\/H3zaP1SnKMdNt\nrrWFut5OsloOKdpNxenv8ecrgyBo+RIQHel8w4EHsNw\/KixkljmydRpOKMaa0E6WPTVTrxkrmXrL\n\/Wrh63J++imG2Zuy3BGXmHqJi23g8fuF+vx+XF1i2dFcZ4s7DfazICmTopoEuv\/ydQ7x4nDFGJik\nGssct1WrnAB3h8MZBCqxwr8Oy7ZWwWRz3gz1xPaeesfqifQ0cz1jfWRjtTXkkGQ3ZZKKIwetqQvn\n6hCIOHQuKiZXjTI3E66FwTVya5dvq8ZSn1tY4lUiZU+u3nsLTOIkwJSz+r+tLbP6egYky2R3s5Ok\npghKE3amSFBIqxQfBiUo1i+sEtZWXgjKHLdVBudXg6W+FdDzLsXizTek5orZS1hsDevfzP\/jjKfq\nmlILRd0tKyirGCTLJBWH2k1qiqCkKME21vtpQeTDrNQqtja8m6tGbeWF0No6E66Mwd3Eos2FkrXU\nXII7vdAiY9Znkvoiqzm3KyynCLKh0hpNNbZcTSqPCEr3bYIl+49eOSvB8GFqcSim2DRYi9DWACFz\n3NYX4Ba65\/G1Ilp78h3z59HzVr\/10k92LbVWLlXFFqgps0R9xQaupghKihIs2d+udOAR8DlUwIDa\nBSA+agbWqlWsSaZaLS8EZU6wdRpuqXMaX8p012B7D\/vnG0X+6GfjmjKLjIqb5qgutURtuZUEqqq2\nEWBrBWCaukpXOO+9IQNSCTkLmAaTVPMp54WgzIlwb7tmwcbqmJQ7nz\/oJb7SVx+Vxeaq8iJziKCk\nKFlPsGQ\/DUHTZOf5wiikkkE1cChuJcuZHIyr5lmMRR6FbAoYXC7edsnEAudr8DeK4HBb39DLZS\/9\n61cCxDOPOVXFZm2lBWYg0FsMtJJZT\/aLwPK5lrkFZjvzuY3LfCsFK2VgomqLNuVjoVs2h9NlcPMd\nU6BY6oLYeUZ17GV\/9VO\/4HqtKHtdxs1cU5RcNwPBlhUKwCK0fArybLEjTsGhlmwp4TmTwDzyBdWY\npQuc06HrdBXz7JNht24\/DuqaVLyyci\/7uZK42rsgy2SqKNsEN3JMQcDFebOHrtOcSfKCW+QJmAde\nFBRjYAvdsvCWS4ZWtVQGdwVzrZOeuy\/zjvtZvmUtStGfk3reMDU\/wxgFmcYozDIRJttE+p2u09\/z\nrhohN20tctLW4HySFQJjwuEWGgvzbUew3ucwTL3j8IZpfM7rb5jp\/uzfUxfnGK0qzDYqLcgUAOST\nTZO6Blkphsj8wBDpyYa4enkVUi8aIPmcPk7G6w1cTFiuUCstftKX6P8BWGnteAXPN2IAAAAASUVO\nRK5CYII=",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-02\/beachball-1328833780.swf",
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
	"no_auction",
	"no_trade"
];
itemDef.keys_in_location = {
	"p"	: "pickup"
};
itemDef.keys_in_pack = {
	"r"	: "drop",
	"g"	: "give"
};

log.info("beachball.js LOADED");

// generated ok 2012-05-25 10:00:15 by eric
