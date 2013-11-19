//#include include/takeable.js

var label = "Cubimal Series 1 Box";
var version = "1347677204";
var name_single = "Cubimal Series 1 Box";
var name_plural = "Cubimal Series 1 Boxes";
var article = "a";
var description = "Contains one (1) Series 1 Cubimal. Open it up to find out which one is inside. Collect them all!";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 5000;
var input_for = [];
var parent_classes = ["cubimal_package", "cubimal_package_base", "takeable"];
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

verbs.open = { // defined by cubimal_package_base
	"name"				: "open",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 53,
	"tooltip"			: "What's inside the boooooxxxxx????",
	"is_drop_target"		: false,
	"handler"			: function(pc, msg, suppress_activity){

		var failed = 0;
		var orig_count = this.count;
		var self_msgs = [];
		var self_effects = [];
		var they_effects = [];

		var chance = (randInt(0, 10000) / 100);

		for (var i in this.cubimals){
			if (chance <= i){
				var s = this.replaceWith('npc_cubimal_'+this.cubimals[i]);
				self_msgs.push("You got a "+s.label+"!");
				break;
			}
		}

		var pre_msg = this.buildVerbMessage(msg.count, 'open', 'opened', failed, self_msgs, self_effects, they_effects);
		if (!suppress_activity && pre_msg) pc.sendActivity(pre_msg);

		return failed ? false : true;
	}
};

// global block from cubimal_package
// The cubimals and their relative chances
var cubimals = {
	'17': 'chick',
	'34': 'piggy',
	'50': 'butterfly',

	'58': 'crab',
	'66': 'batterfly',
	'74': 'frog',
	'82': 'firefly',

	'84': 'bureaucrat',
	'86': 'cactus',
	'88': 'snoconevendor',
	'90': 'squid',
	'92': 'juju',

	'93.25': 'smuggler',
	'94.50': 'deimaginator',
	'95.75': 'greeterbot',
	'97': 'dustbunny',

	'97.5': 'gwendolyn',
	'98': 'unclefriendly',
	'98.5': 'helga',
	'99': 'magicrock',
	'99.5': 'yeti',

	'99.75': 'rube',
	'100': 'rook',
};

function getDescExtras(pc){
	var out = [];

	// automatically generated source information...
	out.push([2, "This can be purchased from a <a href=\"\/items\/1000008\/\" glitch=\"item|npc_streetspirit_toys\">Toy Vendor<\/a>."]);
	return out;
}

var tags = [
	"npc",
	"toys",
	"cubimal",
	"rube_special"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-15,"y":-26,"w":30,"h":26},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAM3klEQVR42u2YaVOa6Z7G\/QbzEfIR\nzpt5b80n6KpO95l0EjUaOybuuO+IgCvIIrsLuICCCgIuBIVHQUBQcYtb1ERNYkxMWjvpTnJmzplr\n7udGiXbS59SpmvNiqvquugoKtfw913+9SUj44\/xxrp7A0ca10NMV7uxelJnZXWCmibyPw8zU9hzj\n3goyrq2A\/uFmgDux6eeOrc9wnUT2NYZrW5nKs656Ey2r7sSRNebf\/+\/BnkSv+fYW9QQIzE4Ewc2H\nWFk1YHlFj6XlDkSXtFhYVGN+QYnIvBzhiBRzYTGCoWYEgo2YDQiJ+HCF5HAGFOied0AfGUFn2Ib2\n4BCjJVLPmhlN0MJT+vu5tcNt3MI+wbV\/COZ7Gk1kHkf0np0wJh\/Pwb3pQ3jFhM1FMTYWmvEo0oBH\nYQFW53hYDdVgOVCJpdkyRP3FiPoKsTiTj3kmB\/PeLEQ89+FlSmHy66ALDYHAQBUwQ+Hvh9xvgnzW\nBP6IEtwBGR6Iy5DEy0n8XTDvk\/Cf3CRsD7eCcG0GML7pR4CArUSasTDDw5y3Og60PFuOJX\/JORAH\nC9O5FGjEmAJbXxJmRu\/AO5mLXp86BjQ7QIGkvj5IZnoJWD\/qx3TIVdeiQF2HQqKkumwk87O5X4B5\nngSusXnEAo1t+EByCJPLQ4iGGwkQ9wrQzFgupkezwTgfwDtyD1O2u5i0pmJu8i5CD+8g6EoG40qH\nydtMgWQ+IwUST\/dAxHRTMIFDjRw1F+miYjRaVChS1hGwnJiEuZ8BJ\/cW\/m10wydhgeyPGNjWPLCu\nTmFoZRLWqB2TYTXJIQF8s3WY8XMx7asGM11JQlYGj7cEk55CuCc5eOjOhethNqyTZTB4Wq4ANXv1\naGb0UMxZIHRqcV9WQcGy5dVQj\/Uhu7WCgqUIcpEizMUdYZ6ewtnXvd\/YVr2nF0CWZTcGllwwRcfR\ntziG\/qUJmNfc6I2O0aTumLOe59AgDZmShKzt3CHpTB9aLwE1erpQP9WBlpluqCPDqLHI4mBV+hbI\n7Xq0DuqQ1sCJwRGwH5sycF+cjjsN+UyC\/+mSjU1+13YQY1t+OEkRWIl7bJUZInZ0XQLSEiB1wEKB\n1KFBtM\/boItYoQkPQcYCBkiihwYgC\/ZDu0j+btlBpV8dA29YQaHylFw0mtWQ2\/Qo1zUgrT7\/imvZ\nstso1n6LfOVNpDYSwJ\/+8h6X9fbTe7z6eIaXH0+JfsLhhxMcEO2+O8LSq8eIEi0cb2Hu5To8+wtw\nbvvh2PJhaN2DjogN2vAwVTNjoM6xqhqSUrek1k40GNuQKSqjRRArhByk8bORLcjAXWEOOKobKNFd\nR7Hue9xt4lwFfPvpHd4QnXz6mer1R1ZnFPiYAB9\/INAffqI6Inrx4W1czz+yeoNnH97Q98\/I+0Oq\nE7jXAihVC3G7Ngu3eVlxMFbFdamQ1l2Hsu5b5NbfR0n7dZR2focyovSWQiaBQDGsa28uw10Cu4B7\neQ53REWgfo3p+a8EitUvJzgkOvjlNdX++1fY\/+UVnpJX+\/wUhbvsGhtSUgQUTsWPKa8xk8KVdvwZ\nucp0\/CgqXkp48+ln5muuHf96guevV3D4IoSDFwEcPJ\/F\/nM\/9o8XcHiygYOTdeyfPML+220KdngB\ndg7Hgj15f0xlX\/DEwTKb0iFUX0c5ybXUhnwKphZch0b4HfKbslCgSUZGaz5+FBfjXmsJKOBvw\/ny\n3Qs82TBgb70Lu486sLOqxeMVFbaXFdhakmEzKolPkvX52CTZ3rHh6dkhBYvDvTvG3ruXcCx6KFy+\nKBWNpACaSI5xVWwRcOJw2vrvkNtCKlhUFIfLkJQi4fWnM4aFuxzOZy8XYmBrOjxeVRM4JYFrw1ZU\negmskYy5eqyF+fExt7nriLu2dw63S8Q6yIa0SHKHwrWQPKtV30JaUwGFa2u4AU5zNgUrEOVA3XwT\nMlEKaUdlSHj14YyJwZ3Gc+0JceOza23nrrViY1FEwJri83eNgnGxEqyOzeAgN+7aLtURdojsxME7\n9XkolqVSOBHJszrtbdxtLiRgWVdck7YkQ99yAypxCh7Iywngx5+5lyuULYK9naHzcMq\/4prwimuf\nR18pmcVF53AxsJ2fjyjwaJSh+VYiT4Oo63s0tN9AVmsO6YsxsDJFFpT6FBS0caAV3Ua3+Af0tP6A\nzLYKFvCUy4Idvn8dbx2722YCJ425ttDyd1yriG8uizMFdHNh4TZPn2H59S52CeD7\/\/qAydUA0ki+\nZbdmIl\/6gG0fcddE7XdhNN6AyfQDSlX5cTi95DYyFZVIIA2Zu3d2BDJRsHi0RVvH400TARLB5+Z\/\n4dpK8PNKFdtgis43mDyyVmVT11y7IfSvuPDk9AXYM0UA7zYX0JCyrt0XVyFDXEFDajLF4AYGbqJc\nzUFv601oSK4WK4qRpaqKAQYOlsHszcO7F8H6yRNsb\/TCP1mHIWM55pjaS65VxVyj4Yy5tjCdD8dA\nOlxD6XTfc+2E0Ls0iu6oE4ZFBw5OjzC1FqSu3ROVgyNToFTRR8KpQoa0DP39MTiz+SYqNAUoaytE\nlrIK2apqZKurkcBsh7mu9Vm4NmYxse6Hi2hr3YAFXx2cg6XkteZzEVxZRGN7n9eZQZ74Bowdt8ia\nlU4XDf28HR1hK7RkXpvmxzC2PE1DmisVkXzrQ5nSiCKFjlRpOQWzWG7BZE5CnqqCuibo4EBIlKOp\nQYI5NMYdiU7BvuSBbWkStogb0UXV7xTBZ9cutuSg+x5dSr32FMy4H0A5bYJi2gi5txcyouaJDjiW\nGZpveXIxylUmVKj7UazsIFVaAV1fGuQ9GRSOdU2hfwCrKRldvfeQo61lEiTOTu7A7ChZwx0w+kbQ\n7R1GYLbpimu+cQ70bXfR3noHenky+tTJ6FXeIstpGnUt5E5F8GEKWVCTIBxSQuQiS4Fdg6aJdnDN\nUjhWp3FPUoL8NgmFq9SYUazS0SJgxbrGwuWoa9DZQx54IAWD\/anIayeA\/F4Zt3tqGPpJC\/RTg9CM\n9uGhp+kL1xhnFqYHMzHZfQ\/D2hSM9idd2ZwDE7cwO34DdRY5eGYZuVdIUN3firLuRtiJg2y+cRRS\nCleibkeWoiaWa+pylPVkgj+UhMKuEgpnNxNZ7iC\/g8cktNm68nSjRmicvVA5etDpMqNrrPPKpefi\njhHxPEB4KuOSawTMdZvA3YR\/7D\/hH\/0eRRo+qoxilHQ1oERfj3wND+a5cZpvWXIucpSCmGvnhVAz\nkAbBMHHemoQifSmFcxA4nYmMxk4+k0C6QKJ1xo6ZaQEGp3oR2lnG7O4SRib4560jBxFvJsKeDAL3\nIwFL+8I1\/9if4Rv9Do7hm2Sf49GlNKetmgBV4oG0HP2zTtp0WTA21xoMuajtKqQhZcGE1mTUjySj\n2FCGTmMmeIZyFHTxwdELYoDvz\/Zorh3tu\/HX\/\/kbPvz3X7BOFoLnz304OQqSqaIklyYh5kM8RMg4\n+61rPue3mHF8Q343RPtetryKFEM+eJoM0utKsXiwQeEqdUUwDqbCSqD0lnvI1XJRb4vBNZAiKzJU\ngkPAWLgCg+CU0y345hxwl4Zza3MIz98eY4xUtMWnx3DIhuDWIgKbC1h\/to31l7vYPHuGDVanh1in\nOqDL7sn7n7D0jGza+6vo8Y\/AZkvB1NB\/UODDs2NaCOKeHPJ5EkYIkGEwA7m6WgrGqmqAE4PTCwic\ncCl+afdtRBLtYTeUE71EPdB5+qDz9kHl7obI3o7mES3EDh3kpDKlpCpFTh0MfhvcWyEwT6MYIvcX\n9awF8hlyJyHtRcqQuy7TSyB+oICamR5632GbbmtvDuz2ZKIU9AyT1tLOQ1U\/B4X66phrFE4guXIP\n5vTUJyrGe6AY747BESndBrSM6NBk06B1tB0yVwckEzrUWxWoJW2jpl+CWouUPHkb6h0K+m2AaMpA\nwS40MJpFAXXuZgyS2yLbdCXGXDgcKXA6U9BkLAKns+7LkH7tKF3d0Hp6qeQTXdS1RqsaYuIW61rr\nuA7C4bZ46+BaJKi3y8G3SlHW14ii7noUGoSoMreQ+64SzQ870WPPpYA942XUZTbfZP15xLn7KNNX\nUbiCr4X0a4cF00z1QDbeSV1rGFaRUGqpa6JRDeoGZdS1KpMYtYMSCEdkBE6C0t4GCnYBVzssBndI\nhOKe+vjn1ZYWMu6cbNNl+xrRZ9fYn38R0q+ddq\/x27aJLjvrWv2wEuJRLXVNNKoGj4SSda3SJAJv\nSAKBTYa64VaU\/Abi9+DYz\/sXRilcPKTEtUKDgGHT65\/+mk0wprhG4BIb7W15\/EEZt9IklpT3tTDV\nZhFTZ5Wc8sg\/vIBgX2sGRX8Xjn1tJqlyEVKOnv+0sJuf8i\/7ApPNFfbJWVVbmhN5NlkeAeGWGJu4\nBMxWRPLpMhwLW2OWEEA+8y8F++P8fz3\/C9SPG0\/vXLlWAAAAAElFTkSuQmCC",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2011-09\/cubimal_package-1315334378.swf",
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
	"npc",
	"toys",
	"cubimal",
	"rube_special"
];
itemDef.keys_in_location = {
	"p"	: "pickup"
};
itemDef.keys_in_pack = {
	"r"	: "drop",
	"g"	: "give",
	"o"	: "open"
};

log.info("cubimal_package.js LOADED");

// generated ok 2012-09-14 19:46:44 by martlume
