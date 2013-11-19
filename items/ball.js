var label = "Ball";
var version = "1322781562";
var name_single = "Ball";
var name_plural = "Balls";
var article = "a";
var description = "Ball!";
var is_hidden = false;
var has_info = true;
var has_infopage = false;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 0;
var input_for = [];
var parent_classes = ["ball"];
var has_instance_props = false;

var classProps = {
};

var instancePropsDef = {};

var verbs = {};

verbs.hit = { // defined by ball
	"name"				: "hit",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: true,
	"is_emote"			: false,
	"sort_on"			: 50,
	"tooltip"			: "Hit the Ball",
	"is_drop_target"		: false,
	"handler"			: function(pc, msg, suppress_activity){

		this.apiHitTheBall(200,10,0.5);
		return true;
	}
};

// global block from ball
var item_height=70;
var item_width=70;

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
		'position': {"x":-38,"y":-90,"w":76,"h":71},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAJ6ElEQVR42u2Y93ZU1xXG9QR5g7yB\n38BvwAOAQJYQGBACQkkgEsV0wQKEICCZsgCDBS5x6IZlMI4dVFAZNL1oepVGgzT1Ti\/K9917rnQl\nhA0hxP9k1tpr5t57zt6\/8+29z5yZurr\/v36nV8OQ6w\/L+\/XLWnTWYyfG\/QMXvZHsJdhln\/LO687x\nQPiw1fN4\/YilZ3nf2ErO+eBgy5\/rP96ss33f7QlJD2LxwliuUDHmixVzoVSxwKzi3Zwvyff5fFTK\nV57OpIvHHb5wff\/Yxg8KdjUwmRvM5MrGbKESLpWrU+VKLV6p1tLV6my2Wpst1Gp8r2VqtVq0XKlG\nSpWqE8AjgOS8+1PxwuZRW9t\/TU06qu\/Td3S5ghJUKPWns2V9Nl\/2FErVMILHKtVqvApAAKmApdrs\nbGV2drYM47UE+OlytWrBojj\/x3i61GZ09r03JB2sHTbd\/GZiOv9TIlP+JSWVh9O5siVXrLgKxWqg\nWK5OQsFpKJiEamkAZgGUE0ZgCYb7tZlytRYtlWtupP1f8EN\/Rx3egfeCbNVZb92MxPJPsOJ\/wiEd\nv0Ca9FDCjrT5SpVKGMpEEXwGEMnaLJUk0GwKRugEbFrAsSS8+WLViAwQ8GEsUdw6Zmn\/j+DWD5va\nboSm8o+mkyUV8HkqW2YdseiNUHG8WCZkVYasAIRAgIxXZ+XPr6As6rA2gVoMAo5lYcc8AFb6sdgn\nKJkeTzj76ajl43drCGwfF\/wTuWdw8EsiU6Kjn4SCA0gxC57dyU4FZNULyCAbAkCTNNTkBGozDON9\nL8a4iqWKDek1QL1hLPJ5MlP+YSZVeggBDtk9\/W8Nt2LA+NFRmzfcl0iX9Jlc5Qmc0JFcg0mpzCIf\nBuDLrLK92BGckG5AegDjQzp9hMK1G\/edRW49UA0L0rGTMZ9+niUUwAexZOkLZKpl1LbsrZpik87a\n9ygWL3qy+eoj1Mh9OHgMR+w8Ou5DmlmHo0iTHumiiiqks0SryO8OXPO+Cc\/VvZDzOP9n+KE\/+qX\/\n29GZ4iGrZ+A3ARsHDDd7g9H8VLFU7YeC\/8DEe7FE6dF0qvRU0ygDQkUdVDQAkhDcnO0CisZr3uci\nOG4IcFSfOwH9sK6\/R3rvTSVK3yFOL5rxsM2z6Vc34naTK22TcmU\/Vnwr8qrw98np4l04YBp+ECpy\n9WqzqJBUSAFVjKnnNe\/zOcexdp8vUo9+78A\/49xEvCvBaO6w3b9qScBPBg2GbyKx3AT2t1tYDVZU\nwP5X1KrIVau1yFQxKJUZEaAvNcZr3udzFY7zOJ9NJ6sHv\/TPOF+GY4VrqMWz3pC0btS0sB7r+162\n7TI5UyMJqfgV4LCS\/PVwLK+qeEeoqKZahWRQpo1qvhCKqsbrQZHWBXCYTz\/3NeoxznXAMe7n+Crd\nbXaaF2zgTYNG39VANItuyvVge7kcnMyxs7iqrydeFVgjaqqZGhXy5+Q8aF9agVWtTwPGcc80cPRz\nV4abKdK\/qt4lxO3xTWQ73UGpedCwcW7P22FwJq8BsMsTls57J7JchawiJuGbpPCtSPVdjZJM04+L\nQBcbm4HPOY41rIX7TqSWpaRV72+IfxocO\/FdraS3X9990O5Ln\/VEMqfcIeksznFcxUWs5qpINQtY\nC8n0cIOlmgSlooSgSs8EEO2pAHssNuT7i+BuCjjGYbxuxD3jiWTJsdfqTtWPmP9Yt3rI+JCAx8YD\nmRM4sXS6wxJXwVRT8msaSDplWlg794SaDExlHs+8bryvgnE89zvOXwqO8c56md6QdNwVzBwBD0qv\np655yBzfB8BDdn+6wxnInHSFJEosQwY0kHDGdHw1oTQOVSAoFWE3EuKBxmSomPL8jlCN8zi\/dwk4\nNbUnIdJRwB0Ez5YxmwkKmuK7rZ7UZ4A8PO7PHAMkJe7SQM6lWzQO1fxagFIRpp52W0Dfjs7fU8ZM\ny83AeZyv1tzrcCGJ8SkWebajN+qaAPhXizu1x+ZJHZAhA4AMLoT0K5CXsZGy2+ZBY4VbApZp+1Zj\nvKZafM5xKhizQT8XAkrHqnCMx7gUaT84yLPD6ErWrRzQP9hp9iTbUJR7l4DkZNYGC\/hzoSZXr6ad\ndiOsANB6I\/OfbwgoFUxVjX7ojw3JmleVY1zG3weONoj2F3Bhmxnb2DpmTywNyZpk41DNiLzaHg3o\nZQF7VQBT3TkT96\/Iik3mtGD00yW6lf47ZDhFuaMOf+qgwwdAb3K7yZ2UTzCNL4yGHbjQQu4XjcOC\nZVfRGVd7RoAyEFPPoEzXxeDrxn2NzzlOBeN8+qG\/48gS\/TOODDfuT0GUNL6PU7sBuMXgSswdFDbo\n7PE5SFGTLFR20xGhJrchBVSpT6aIQWnnBbRq58X9swKK4znvlNhGOkRKD4qGYLxOVzB9whlMdzj8\n6XaLJ9lqcCbmvu5WDRq6N+kdccrK3LNx2tHd+2zetKomQemYKz8pYFVlWatdwk4LU5VSU8l5nH9E\noxr9Mw5AU13uUOYUxhx3BFLbTO7EGp01vuDQQMhW\/biAdCd3WZSUc3XcK1VQ1stRActmYmCqQoVV\n4zXvHxNQHM95BzVge0QztCHOOU84fR6AZ6DiZw5v8lP0RcMLU\/z1Q+sQIPFwq9GV2DGnpgYUjpmS\nAyL9KjDTdURjhwUQn3Mcx3Me65v7Lv3RL\/2f84Qyl7yRDH5AZaBiej3iN41a4ysGDL1Lng2bh0zd\nLWO2BIt022JQOfUK7F4N8JuMzzmO49tlKHdqlwBjlqjYFV9EugzrBuAWxFuts8XrBww+\/j564wl7\nzZBxZctLW2ITCnUhqNJIhN0lp8ctq9FuVWp23pT7bTKQAiXPg3U4Aukedzhz3R+VbgSi0hf+yexV\nNBYWkWwcBdygMc4\/m37zN4oCaU1s0DsEqFNOPWFZpyow1di5hKkqcRzHcx6aIEXFrgcIN5ntDUWz\nX8JOoHMbRiyAM7wdnBZyg86aYNEesPlSp93BNGE3C2X\/hKBbhW0T9meTK7HL7Em0AXC3zZs8xHlI\nJWvsoi8sXfFPSMFcoYxfjuU7kVh2G8avGjbHV\/SP+Xg+fed\/GdaOGj9ap7P4WvT2+HlPSOrF4Xaz\n0Skr22JQjHsWbYsM6JbB9qPujqAOT2Dz7UJXY27mgjfM+dLTqZl8pyuQbkYzNEC1FX1jve\/1Pw0n\nrxsxPVwNh00oYhZyM2wNlF0rjCq3Anqr0YkUu5N7UItQPd0BSMKcwzbSCdjtWATBGnFQaUCn\/moz\nvLOaw+aNzSNmH+ulYQSrR6BPGEzY2pe2OCF3AJKpQ7qTPDa16u2J1WiAxmFLnEe81dhz5RPzh3it\ngWNuRU3DJt9K1E49gr7JVuB5Aw7FjXhHPfc24sfQ\/+Sv4PmNXb+sAbBI14Mm\/HxYZL3NL0xtOLqv\n\/GBq\/d6vfwNQ0AZNkH80xwAAAABJRU5ErkJggg==",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2010-08\/1282623566-2437.swf",
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
	"h"	: "hit"
};
itemDef.keys_in_pack = {};

log.info("ball.js LOADED");

// generated ok 2011-12-01 15:19:22 by martlume
