var label = "Bug Acknowledgment";
var version = "1292132068";
var name_single = "Bug Acknowledgment";
var name_plural = "Bug Acknowledgment";
var article = "a";
var description = "We are aware of the issue and are working on it!";
var is_hidden = false;
var has_info = true;
var has_infopage = false;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 0;
var input_for = [];
var parent_classes = ["broken_sign"];
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
	"no_trade"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-63,"y":-111,"w":126,"h":111},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAJkUlEQVR42u2YeUyVZxbG2zqTjs1k\nzBhrFCoUrIpl3\/dNuCwXuMC9LAqKgojFpSIqVVCRHWXfBEVFGUUrIooLsuhFQFlEFlkEFalONdM4\nlc50Jv2nk2fO+\/JdQ602VSD9p1\/yRMy3\/d7znuec89133vn9+A2OH\/99YOXToQ141LsKd9sC8LA7\nCE\/uhmD00Vp8\/3U413dfrcboSDC+HV7VVbDXWJ4Rr6875WBA3YxvhtMrhzpWQ37eCYNtPmiocsHF\nUw7ytjr3WIV6b\/jEfjvy+ejzh6sIcCWaLrkhKVp3JD1Ob9OUAv5zZGNlTbkj2mrFGGz1Rm+zNwrT\njJEeb1D58rX\/+++F2M4GXwy1SfH33mWorXBCZoIhMuINSqYM8OlgGDqvuaO3SYKBm1540h+Ia+dc\nUXPGBTdrJCN3mmVypp5GmfxRX8hIQ5Uzv\/Zhpy+aq8XISjRCepx+19Rs7\/NE1a\/7V+Jeu0yQlGuI\n1HfDC10NHui46vYTdTWMLWb4ti+qTtgjdZc+cpKNMCWAg7fWeT69uwIxW3TRdV2GzCRTVJSK8PhO\nAI4W2OLZgyAcybPBSNcytNZ5giKJniYpblRLcK\/DDyV5ZkiO0UP+XmNkxunbTjrgk3sRJZvXadJW\nSfC3IjuEBC7ArWveWLdaA\/Iqd2xZp4XcVHOcLLbHMqkaas+6wk30EZove0DqoYqcJAPERemgKMMU\nU2KW\/\/wjcqQ425qc64eKY46oLndB+1UvXDrljAsnnXAo15q20h9ZyWa4TxEryrBEE8Ed22+L3VF6\nSIvV44D5e00m3yh4njqjt3UVNodrckVv1kGAjxrKSxywPnQxtm7QQpD\/fOzcqouYSF2ErliAzERT\nlBbaYttGbdpqL6TE6HJAZpSsRIPJNcqPo3GeZcUiSN1VUJRpCU\/xPNriT+jlWhwucr0mrM1mY03Q\nQp6bX0ToUOkxwcql87GCwNtq3Tgc077dU2CUH55tj42myHi7zcP2TTrYsGYx\/LxUER6igUjKSxY1\nS9MPsXr5An5u2+faHNxAdyY\/X39W9AKQGaVgn8nkGuVfT2LkpZRL+9MtUFJgg\/x95sgjQ7CXh60c\ni9pS6ccIJuOInZQ5nNRdFcxUybuMcKrY6gUg04FMs8k1ylBHOI\/CzWpXPO4LRVejjEqNJzobxtR\/\nU0p55o2eRm9qe064dl6Mq1TAq8oc0VLjgaJ0k58AFqaZvrL7vJ1Bfqiyba+ToOe6B\/qaJeiQ++BO\nkwf1YCfKJWN0yt2om4gISMT\/vtNInaPLD8OdfnhABfo+KStB\/wVc4g5dvsVZCQYjk7S9e2I76t14\nR3jQ4U+N35UixbqGGLu36cDRdg5yU4w58O1rBMiuE8Dud\/hQN5Fg7y49yj1d6sUG5GBD7E8zoXuM\nkJpqOGPCgA971sgVLWukeynqK0U4T21re4QmNq3VwM4t2rx0fHnImkP3NntysHu3fKgN+tAWi7F3\ntx4HU4jBTZpRBtuDOBybSliONV92odyyx\/rVCyHzUEGgrxpWLZvPAVtrXDHQ4o27rTKCk1FRl1Hu\nOr6I3HixjpKRYBA7wfISZ8u2qP+GJ0XPn9qcG5ouOlFfNYeN+WwCU4cbudZ5yRwE+qmh4byIw\/U2\ne9G\/UgyQzh6z+Rkc00Hm5Ika5dlIZOztq+6Uez4c8Eq5iOdZCk0lS6VURsIXw8xoFhXt+XTOAY0X\nnMjVEg7GItl\/0xtlByxeCViYxlvexIzyoPMzeR\/llMKV7fVj5mi+7Ezjkx0KqXzEkyuZg4\/mW6D7\nujdu0YIYWB+pl8awonTjVwLmpRpPzChsvB\/qCObJzlyZGGNAOWOCgjQzHMm3oiga4MRBOxoGrLlp\nzh+3pwV4EaAHB2Pb3FonJjMYvRKQtbsJGWX0SaYnG0R5yejw5WbIJzgn+7nY84Ue78X+3h\/D3VkZ\nvp6qCKK+K5Oo0LeKC82CnlS4PfmW56W+GpCJdZS3NsrjgfCsgRYpj2D3da+xPhuqwcG2btAc68XB\niyAWKcNVpMRbnrODEgfroWLdTbpSvgTZSYavB2ROftvRa7g7uIuVCkW5uEtlpumSGMXZFqg+LaLV\nW1APNkZGojGO7reiuqiF+O16HKyLuk4nfQJUllq\/Fo4VawaYnWT05qPXcIfvjPFgvGRQNJMp73wk\nY+5d7qeOTZ8thhdNOIqIdV2XcLBOuQduy91xvMj8tQ4+kmvBAZlZ3rw4t3p7jgfrbxlz5QqCYlsZ\n6KvOh9KNYRo02Zj+DKyDvvxu0UfTwUzj19ZABngo25xH8o2NcuGUrKTurDNNy4tQQ9+zNWdENKqb\nIiFan7uYge2LM0TURk1+DYMbD8bUSAX9UI4pB9hPbs2nSDHnjgGa4nCOOQGavd3odSjXcpRt3bnj\nS2illjTOq1PeOWJPlC4f9U+X2GHL+k+p9OhzMAZbWWrHwdrrxWij8lJf6Ujzo0kZ1bpUgjxB29lU\nnGX2VR7VPhY5BqgQGSXrV8N13fDSYw2+8aIr6mgGLDtoA\/YBnkzdYxtF7PQRWyovqoiO1EbjJRfe\nj\/NSTehDyhYiu7lYF7IQZ47a0pStyXKL\/R6jQ1pI+iQ0QF3M8o4Bjld6vH4znZ9O+uMvsb1Her+l\n1j3qYtkS6hRjYpGrPu1AhdgOl790QDXpSrkjhy8ttELFUTv61LSmaXo+smk+zEoy4u0vK0n\/G3qe\nD0lGEpGWkCzzUoy\/ZwNrUbopmcSM52NOsiFbjB5Ji7SANPtl2GmkP5H+0lrrdkkBx1Rb4YikaK0K\nOucyT2m6v9RdeeeOCM38xB06Z44VmA+cPmz9SHEtW0BthYhPPNnJ+kN0zxpSCGkFKYDk6+aklBK9\nWetO7DbtHvZbTQ4tiEoNrMw\/dBHglBmHwDNNAfgHIcQzKI++q6OXsB+JmGorHOgz89NcOufIIMfJ\ngyQNC3aOGh\/tFhq5WK+OWLvwMp0PJ4WSgknLSf5CRCUkMcnB1WFuYEiAeqCOzl9Z9OaSZjEOgWfa\n+CiykH4QFqaucvKwjaQk11JamGbmZ281m+XRIiH8bBuMSeYkK5JdXobfLgUgi5zCIAFSlUw6H0ha\nyiInLIhttR3JlKQtPFedpPIS3Acvw40\/FNFkYZ4p5IOS8BA1YRs0SJrsJUU5XhE0ag2yrWUfVlfP\nOVG+2sDZbs56AcaIpC9cryHcryY8T0l4\/kzhfe8LXnij4z0hutOF1c0UVsoePEd4Ccubj5hSYnWd\n0hN0Nwv\/VxbOzxGunyXc\/2cBhkXp3an+4fXdX6Hfj9\/s+D\/W6zf6hKLjfAAAAABJRU5ErkJggg==\n",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2010-12\/1292132455-7229.swf",
	admin_props	: false,
	obey_physics	: false,
	in_background	: false,
	in_foreground	: false,
	has_status	: false,
	not_selectable	: false,
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
	"no_trade"
];
itemDef.keys_in_location = {};
itemDef.keys_in_pack = {};

log.info("broken_sign.js LOADED");

// generated ok 2010-12-11 21:34:28
