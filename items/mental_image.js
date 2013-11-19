//#include include/takeable.js

var label = "Image";
var version = "1337965215";
var name_single = "Image";
var name_plural = "Images";
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
var parent_classes = ["mental_image", "mental_item_base", "takeable"];
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
		'position': {"x":-22,"y":-45,"w":44,"h":45},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAKT0lEQVR42s2Y+VYaWR7H+w18hH4E\nH8FH6L\/mnD4zk6BRMW7BJUo0KipIjIO74i4ucUVEQUAFxAV33BdcGzVRY+yEJEYEqpjv3FuYdEyb\ntrvH9Ol7zvdQIbfu71O\/tfC77\/7ixZxKg5gzqRpvcgO++zsu92mOmj3Phft1juBvCeg6lsDzWooP\nB9mOv8TgBQmZ913u7\/LG2XZW0Id9Md5uZmCzKQLY\/cZhpgZcLyVOhoTM+7OUd9N+R2+84MAQD7uC\nj9WqcGy3RgZ9U8D3m1m880MJzknYXtlSF27av1geql6pCAfVC3MSnAsZ3zYPDzQxlv3eWNjr+Zgv\nDsO4JPT739q\/q4p37qrjcTKRitdzGXg1la74ZnBvxh9\/v93MxwaBox5ZronEsTXlq2F+0S8MfDn8\nGK\/G0\/BqMh2vJtKwp3lo+WaAz3VJgj1NPPa0RLpEvJpJx+l0mvqrgH0pvMOBFBybU3FseYx9bTIm\nn4TimwEe6lPULy1XPbJcE4P12uhrw7ynTFI81wix0STASlUMrNn3MJp5j6RG1A+3DrfbKQw46BHi\n0JCCI1MqnhuEmC+PhOVxCAYSgkXX3WNODV4YTg\/BiOgeJ3ptlYTB0Z50+3loK+DzFksjsFh2Hwul\n9zGR4zdqEoagPyHY+eV+o5AfYEwOhjklBEOpfo1lhWG7KQE7DQm337DHxfcUk9JQUI1L\/KGiRiel\nEdiqT8B2ffyV\/jafFxlkexqF6SeRmH0aiYXCaOwoEsm+RGxVJ2AoKSTo\/2rGnpPswM+\/WyqIWZiX\nRWK+IArzhUQlxGBnIvZVyZzBOVmWxaG5CNq+1EpJnmK9SICNsjjisURsVsb7JY\/HaBofGkHsnwuz\nkf+PgJlCvnOjPQYn00IOcqfDwVvNe4CPBjcr4vGzLZ0Mfyl9AcB0ThQ6wx6grfw5lJWH2NC6YZOV\nYyU3FptV8XAdSXBxIsFGhQAz4iio+XehThJDrzyHrut8waz3WSwGiIb6EXgj4IuBFN6bRRHOfsrG\nVofQsdPrcm40L2M2IxK2bOJBaRRWih7g\/XY2MZoD989S7A+noOXHf0Mu2+W00HOO\/tQCaCJ4sLfE\n43SetJg+AWbzQ9Eddhdd9+6iPTic21tZ4MCQ4b+cCOjNuTkmjlQvVsVijhTCbAFJapUVuxoXDAn3\noRfwOK0To2\/XMnHmEJM3FDH2DQloT5RyBpXVh9ga8WKychLK4DskV0NgI+dstETjeDQFA4\/C0HHn\nDuoT6z4BGvuYT5C\/3Upy+QGzT2MwI4vGojwGe6okrDZkob5oD33l65gp0cIiKiC5JwBt2Pv6BKzW\nRWCukIw8eS6Gn73mwms3uLGqI2p5BkdPEo4sKSQlMrjeudiciSqRiYOrKd6HvvviEs4HWc7S1wFt\nRgRYsqvVy3mx2KpJ4BLbXimANTMc1U\/nuAM31B+w0baEWVko5ovCuFm8KI\/ATz2J3KTY0tphJ4Br\nRCt9HsyXZZAmHY8dZSJ2VQ9hb47DqDgWY73vMaL3wUJE4UYGfCiQLkFwX399iKe1CFw0excmu7bR\nFP4Ebf+8g+7wu9BG89CSVs\/BtclPsK29wK5SBTodjgZTQacKnbV0lO1rkmGT13Fw9lEvJuqXuVzr\ni+FhIDEYtCeaHtG2RFKnWfcLoM6F7MdWAme4HnBK5xVM9THOuQEGO2s+bMyymNW7MNb5HtaOd5jr\n\/sB5ZUlNDKtfY7tRDEdHEuhUeaF7hIPeZKwpBBjOCIUhLhjLfU6sE8C56kGsFwi41rJDeh+NyHZd\nAtdmBh8loUF+iMHeC6Qn6xAV2n0JaLga4jEdoxjXsRjXMrD2MpjVkYP7vFggWiQhWiaioVolgOuD\nHsw2DWMwKZhr0HRsUVnSQjjP9BMvmYShmKntxwh5uI74WrT9eBfmhHAMP+JjNDUCI+RTez8EdQ\/K\nUFf6HNrOU\/zrH+WIixxAUoxFfQVwWOdTjOpZtFX7rsjcyVyBXCJaN3uxOc1gurAW4xkRmJLcx0wu\nmRB5ftFpMZcXDXtxHEae5H5qNxqxBn1iJVQPxOiOk0BF1FNoharZiTESMWnGFO7+WIPs1DXnwwej\nPwgi9P6RadGDR+NP80Db+gukuoGFiQAOtPkh5zlQD3aWfRzoaFomliUxWPuPv2nbS+O4xm0vicMa\nCee8OBpdYREcnKL0AHNGBvZ5H5YnfZixsBgjDqE2R0lR9LYdcyGN5WuRn32o4PONATER\/f5Gbe5j\nHRZS1sOXkPRGGupJHQNDG4vBDn+4bZchX7MynEfHqqagi4mEVcjHNGncM5nEg5lRmCHXJkEY2vhJ\nqMixobXyCOMaD6bIeRM0hfS\/wA0Tu6P9H5AUa+QAJY83IJMcXX1daykjXupkYR1kMWH0YWLQB6vB\nD0kPpAdPE83oroJSTXcccaB6aTt0whz0JeegVyhDu9QEVd0JxtQX3L3XwhFNmFwQCS0cHM09Wfbh\nr3\/XNBZ5He1yBu0EVNfoxYiawaSBeImEYWmMhX2axQr5XLOyWDCT740U1A\/7Edh2eU01c\/kwH8Em\nL+GsX8BNW3x4mmlCpnAJWY9WkZY4C5n4+Nc\/GZpLEPis2LtAgWwmFupKL3qItFVe6Ks9GKz3YKTV\ngwmlBwt6L1aNXjhmGOzbGDhIsTxfZHG8xmKXtKS1UQJnuAo2N8RidYLF8jiLRasP82M+2EZJntev\nc1VLAXPStvBUtIfc3Ddf\/53cUuJV6JoZmLoZdFd40Usgl6ZJGIghU6MHxloPzHVujDxzc7BT3R6M\nt7phbfBrotmNebUHGxYvB7u\/xOJgmQCaL9Df9Q4G5Tv0tLyFscVN5IUofoQDlKZvc4WRLz66+fdJ\naxnLU9Uyzsq812grdcFECmRYRQCfedBfQ7xJIE11Hox1eDBU78ZwI5GCQDf5Ra+tnR5O9GHoXmXZ\nGahxqnrZG+7BqQOyHk4g7M4zmnfcxPhdgByknAmqkb1FUc5L7iCdgqjWC03lBbrKP0BX48JUL8nV\nDi9GiSjEEPEglbmBNHTqdQ2DvkoXOkvPUCg5\/gSokru5M1tLXEhLmII4dR0FWcfc2\/S1+fe1JRMf\nqfOzTwI7y70CldzrHCJebCx4xxmhlTbRzzgHSNjLn5x8Mk6ve+TnnKer804\/ff9RVSQqI11edFW6\nUSL13\/eHoL62RnpZnpoUDDXw8Wm1lZ7A9tIzAf03FX0Y+tlc\/E4w1OmFPPczQJpfRE1FZ1gjhaJv\ndxGwo9v7k8fyBIIGSC6WPTl13rRXV4vvaQcovwT83EMd5YxoWMtC0+Yi\/3csujVAUzfLM\/WyKH1y\n+tttgCwV8ayp3QtaZBTwo8fp6qxCQE8j61Q2ch5U3xqgUuETKesYlBDAzw1etzpJgU0bWdTln12b\nYw1FjKMi7\/31E+PPrqr8C1F1votU48sbAWmbGu5j0VTsvgS86qliKQ29v6pvDZAOb2ro94SluZQR\n6ZQsGotZcDDZh84vu4NMfGi51RD\/kVVfgqDWKhLiQhZFBPBWQ3lbqyLfU1iUc+r4skj+7PofEIIM\ndHP9fJQAAAAASUVORK5CYII=",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2011-08\/mental_image-1312586564.swf",
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

log.info("mental_image.js LOADED");

// generated ok 2012-05-25 10:00:15 by eric
