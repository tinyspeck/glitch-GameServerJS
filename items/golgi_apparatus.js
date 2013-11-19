var label = "Glitchian Remnant Symbol for Baqalic Caesura quest";
var version = "1308951017";
var name_single = "Glitchian Remnant Symbol for Baqalic Caesura quest";
var name_plural = "Glitchian Remnant Symbols for Baqalic Caesura quest";
var article = "a";
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
var parent_classes = ["golgi_apparatus"];
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
	"no_rube",
	"no_trade"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-22,"y":-40,"w":43,"h":40},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAANKElEQVR42u2YB09bebrG9xvsR5iP\ncD\/C6K60K+3u7JRIm9mdhWRCSAMCBIIhpth0MM0U9wZuGNtgMDbYmBpqGAKBEEL1Oe4Vdxub9t7\/\nMcrcke7cwJS9q5Xukf6yhFx+533e53nfw29+8\/\/Xf19HnLXfYvyZuxh3UoMrFmfw\/pczZtncjFmK\nXvlTMxh\/ruBfAGVCUMa7tsF5jV23CI7JNXAubIFtdh2splXAx5cBG10EbHAOzDw9YFyDiPjMPx2M\ngMJ7xzRO\/QL413bAv7kL7rUtcC2vg3l6DnZ0I\/DdgBRWZX2w2S+HDbEYdiWDYOYPI0jdxj8NEuOO\nfWpmD2KeyUUI7x5BaPcAjt+9h5jNDAkXDraVRdgaV8GslA1aei2Md1TDdGcNjNSVgaqGBCtddMA4\nSsB4o5RfFcw5KP3EMSDRWMUDENx8CzEMg4j5AE68VjgLu9Mniu\/CgWkU1nQDsCxngZHRCNrKh2Ao\nvw86chaMvMiCFVoDYCxxGtLM13\/yq8D5xoSfevRczK4ehOC7bYjs70Hcdvg9GHFc79dgUyeHVyo+\nrPQzYUlMhzl2LUy0PIPxqm9hoioLhsvuwlpLLQLkAcaWoKP+5aY5nuFQ3CMccE8ZIfB2EwLv3qCq\nWb4HC1h3YXt2FBZVPFhAYPMSOsyLaDDVUgCjpX8FVdFXIM37EgSPPwfhk1tgqMiGw55OBCkCM1sx\n87PBAibOb70T7Bmnmg2uuUnwrS+D\/80i+LcWwL29DOaNBTh6ZbrcmlBero9KLlaH+BcrSubFkrTj\nYlHccjHbXnhhqPrmUlNCAH4Ggkd\/Aub9P8NIWQasNlcAxuQiSFnwZ8EFp9n\/cTzNDtrl3Sg2dOBe\nmQb\/+iyE9lbBs2q42J3XX7w2qi62pwbPX+uk52vDwrOlAcbZnLj9dIJbf2ZiV58tCOrOTcyK84XO\ngsvZhiwk8T\/AWJkJK93IKDQCkJWW+SfD+Wc4d\/0mNlh4jWDTisE1r0dw03AadFzGHPuXezOasw2j\n+mxtVHq2qhGerqp5qSV5d2pKQEvqGdSkmlaSlFBzUpMteSnGky9O+fm3zscaHl3OdhTBLL0ERqpz\nYIdeh6rHBGuvCH4mXC3gkhawTg7AvlF+sb+gvcA25i\/WjKqzBSX\/dF7FTy0oOcmlAc7JUn\/3Ceq7\nhInXmJhgVyd0HaS4ruZefKLu3gk778ukqvR2apiccT5CzYLxpqcw2\/IccG5bGtCpFtxc4uMpToff\nxAILlwK4kAo2Y9\/ltqH\/Ymd66HwHSfl2Unn6aqQ3+WqIn1iUd8ZeDfHir4a4sWUlK7qqYsZeq1mJ\nNSktvsQojk\/UP4iZGh\/FDRXfhM30ByEz\/X7ygF0I+7xysPLrUQHakcRM8I7zRDeGO57mgL0PRQCP\nDFYd7\/xIL0ouDwpPF4hqqbnJdb0kuSRrj71kVwSRISKTbGpgkkEOTAppIWFNYZBXmhkQFn8dGCjP\nCOlqsiNTzY8i+\/RsN07PDlo5BQlHbxnYhFVg5TUAzm4Du4wNRK\/fAI4tuoKrRiOIBNgw4wwb5cYt\nekHYYujz7+l7fdtakWemu8Qpf37LZ2RUHc\/zKIH+0q\/dY20lvomuUm\/Pk794unM+9wmLbh+rKjOP\n52kPXO+7Htvw7ocuKzs\/5JRVJu1pQAqqIAHYDkRCXB\/ARlZaVnsfFTD6Q8DV7Slc0xM1j7ADr4e4\nJ6uKnsi6kuF9yy\/ftXILX661PlgdqLzrHG8tODa15NrHGx449PX3nWN12W7piwzf244n6zgz7w3O\nyH2Pdz\/GLKx8t1NRE3HIKlN24Quw8VH7sBrANcS8vnpXhkA9x3kBWMd94iRw1tMA3lvpXlfQ\/etD\n7MRMb0tEUX7Hp6Vkupbbnrx9xyyYnm5+vKWm3rNM0HIshqYcq7Hxkd3Y+MCppd5xm1n5qxZm3gYB\niPU8wV3KhoBDUR1z9JHPbEIy+q1qsEvbgVDtmpzjfkrknFffCU55FSr985SNXxS28Io8Fs6zozlh\ns39FTo+Y2gq9oqefOZkP\/mCTPPvSMlqdhenq7pvH67PN+tos83BlBq6pzLBqKXcchros9xIt+yhd\nwZ7cPSuvyO5WNyJ5q07svSWXVlQIIh2IlAhM8T\/56IS4gusCC6sACIfhXQ8DSBIHzsg5xOSNe1NM\nqkfb9NRrqL3nQDBWRenXmCD3z0figs8PFMVfHWjKbh8Mv\/jbkbzoK1yQ+5kV3YCDm\/NHz3j1Hf9y\n0\/1DvOfJoVNS4XH210TtEnLKwnoGWCcJvGMMIEbnx6Wd4micimYk6WMwd2SlzF2PQhgzz4nzSWZc\nWrOLKZq3jB1FNi31W+9Y3T2roQFVrCH7APXZ3jD17ns1+W+7Q6W3968Ab+HCvM9sjId\/cIoLv\/CO\nUv5xrCr7u9vCKbC6VfUBZI4EcvAFRi8Ap6oN\/FNsjCjQR6X1jHYhQ+SBuf3embnrccTMK\/FggnKr\nuY+yj8vqNvH+xlfGuuwdTVWmVVl62zxSlXGgqsjcFZVlYCNNeZYlJskyVp+9r6NmHg2R\/25RkW7b\nZ7ue+7aUbZFByv3QcM3DgFvV4HfIqVG7iJQiCmEVUIBICmSML66r3gbOJIGFmYsc9Txh4T7zW4Qk\nOy4k7WO9FVtYH+UV3lc5M9WYtTNWexcXF355iAD2himZ76gZ\/7nVdP+P70RlmUdLPIp3U9HqPzL2\nRhxLmhPbwmBqS8tLzPU2xbel9UGXsjboEJef4F2PAOt+Dj4D82bGIPqOuCPizlxyauSNoDK+LqlJ\nrIookYmaTPci7cHeXBOCq75jUb\/42szP\/dOBivTXXSTlznA76UjPpzmWtWL\/9qwmtD87GNqbVoS3\nx3sjr4eYsWV5e3xRUBtzqZBzpZVxKyfvHKPng3uYDkTPf1Taq+qh1WkAbbP0BxcOSUXCpaoLLgmp\nJ8ui6vgYnRSWoR7SVXzj1FMy7GM1d\/D2b393RACqUQVNXS8sh4v64O5Lrf9wYdS+PTXg3zZIwjuG\nvsjmCCf63UBHfLmvMY711wbtssoYSoVTjJ4DDlnjB2k\/nnmErYk3WrnFYGHnpxwyShRFgH9N1hxf\nkzTEZ3m1UQ3lrm+k7Lazv\/iWbYyagXdn\/95MOFddevtQ\/uyrIxU124rPKV3hdeNOcHV4Fzf1Od5p\nOeF1JT3+nbQpblHUB+zSqqhNRDrFu5+imV6ZhiPy9kaz1qPtSAeyo7c07lLUhFxDzd7XMlrkzUBr\nfFVGi64q6JFlQbVf11rkXRFUe4wteTY1NctmaH5im2aQ3SsqVvD9uCgYWFLtHc\/JDo6nhGbfGNPq\n0bY5kWP9V3AlpxZWIQrkijQc8bs3W6OQvXFGIWrYx2cOSXncNVAbcA\/RPFv9tPBrWWPsjbI1+lbT\nHd4eYYXfj\/FDuwbR1TH2pl\/fjwtC73Xc0JvBrsjxjPjQN8HFvLpum1fT4nIrEZyk8gqOU4QcSwVi\nQl2bdz+U161B603HIzSoi07tkoroFrc0tsYjx6YZpDiqWmxV0hjdULRHEEB4uq81bOptCb2bkMb2\nTdKoeUqWODDwY3t6bnxKUBc9HKI7fKMddvdgM5qztQG7mBwles7KeQ7OgeZ01t1oS\/nhzCU2Fbw7\nB6zoiw5E5fFtef3pEqvkRN9WGF\/kVsWWhbXRDXlz5KW4OTLOqYuMcWrDL2Xt4VeqnvCMuCUyyqqJ\nanso0eGOF3GLssntVNX7nDJK0N5bmrAJnp855TWA1hwghsC1bv2xdYrIPryHACw+Peolx7dkjadr\nAnJygVmSWOKR4ysCBCmqjRo41dEVcaMXmce9repwbw10+Jf6GoJT7KqQqYcc3hRXR9zDtKhH25ry\njdEv0n324dxU0v+xUk0wN7DOIsC7clA4F5\/ahWWJNWFl6rW0IbmtpKW2+puTm8r2pJFVFTcyyiPe\n0U6LR0u3ekY7rB5Nq92toTld6nqPe7Ah6FHXx1z91BM0ws7sfeVgF1ejfmMGr50QH7u8+h40qIvT\nAW3lFpzbhaSTHSE5scyrTM1zy5Mz7PITE4OcGOsqSyyyySHXYKMrfVQNbudALZKSeuySVoRsvWUx\npEDKyskHnPEMbSZV4NH1bPykfvtRiVH5cVZ5ev6mZeYhowhJiTVuWWqOUXo62V2aMtJLkvr2ohOz\npOrYKaf6HbKqgFNaGbSLX0TQ1InbBMVoI8m9xFC+4T0kcCparh9dNzYJMUEUNCBkxjpzAa3gCPLZ\nqYVXnHzDKk6ts4tPttjP47iwLIKqFLX1lcbswpIEaoekhVt4ilan9OeIPia+xzfB2vhFkv6Yi4kq\nEk9racgulPJMBMl5emnj5p8TsN8fBET8zcLIRe\/LSVfdwiGDa7A9PU+J4P3JLr1ZFTkbRHgSe6CV\nj56s+OVgE6ANFy2SOCP\/6vQUoCDPB2J3w5ml6TnqMzCuxhWKj1\/ca9f9n4WA\/BAJ38OiPe3DIYDc\nwx0\/gGJjRHR8dD3\/tSE\/PP\/+bycNhZr\/V+2xnwNK7IY\/PP9nVfp3vP4LegXydHIv7GgAAAAASUVO\nRK5CYII=",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2011-06\/golgi_apparatus-1308951047.swf",
	admin_props	: false,
	obey_physics	: false,
	in_background	: false,
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
	"no_rube",
	"no_trade"
];
itemDef.keys_in_location = {};
itemDef.keys_in_pack = {};

log.info("golgi_apparatus.js LOADED");

// generated ok 2011-06-24 14:30:17
