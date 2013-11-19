//#include include/takeable.js

var label = "Brick";
var version = "1337965214";
var name_single = "Brick";
var name_plural = "Bricks";
var article = "a";
var description = "A solid, oblong rectangular mass, useful to those who build.";
var is_hidden = false;
var has_info = true;
var has_infopage = false;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 5;
var base_cost = 280;
var input_for = [];
var parent_classes = ["brick", "takeable"];
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

function onLoad(){ // defined by brick
	log.info(this+' replacing with '+(this.count*2)+' urth');
	this.apiSetTimerX('replaceWith', 500, 'grade_aa_earth_block', null, this.count*2);
}

function onPrototypeChanged(){ // defined by brick
	this.onLoad();
}

function getDescExtras(pc){
	var out = [];
	out.push([2, "You can make this using <a href=\"\/items\/713\/\" glitch=\"item|blockmaker\">Blockmaker<\/a>."]);
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
		'position': {"x":-35,"y":-39,"w":69,"h":39},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAGRUlEQVR42u2YWVIbVxSGtYMswVV5\nSJlReAKERkACCUmIecZCyOABY+wY2zGDcRzHUxzj2HHiIRXiqrx7Cb0ElpAlsISb893uI7Uw5crw\nkDyoq\/663bfv8J\/\/DLelQKB+1a\/6Vb\/q11++7uUiwacTyQ8\/TKedH2czFq\/ns87ruewf0hrwciZj\nvh3uMZvZyP79oW7nzXzO+a085OyVCg7z7uZje9f62ovz0Zb4dj4afzadsng0nvzsHxP7vTxy7H15\nuPjzfPbgxUzaANnMfD\/ZZ4Skfd6d6q8BRN+czZm3gldzA+a59DEe8juDMXO3ELfjvhtPmm+GEmY9\nEzJfFxLm\/nC3We\/vdG6kQ85yoq34SWIvpjPx59P9u7LBARuCpxMp83i01zwY6Tb3huJmKxe1i7K5\nkntXzJv35SGLXxbyH5H34\/FY0pLkXhQ1q6l2czYeNEs9bWYx0bpzJLFfS\/n4y9m0wySr1ESftXIn\nHzMbAxEsNFdSp8xK8qTZyEXsJoz9SZSCkB+43RolY4Aawlg1+E4hZlZkvXJ30MzHWs1UpMXelxPB\nDzXE3peGC6\/mss7zQ65ySabEUle9J2O4pduS9quBErgJQ7ZzMXM7EzY30p3mWt8ZC57p3xQjGQPK\n3W3mnMASEpQSrWZOSNIKQccSezufib8r5vZVcj9eCDmUUJeBvcWCJbmVjVpSGECfvnumseaRABjD\neNRfSZ4WV56xmBS1ivHWCkFwVp7PSbuYCO4Hnk2mdlUBFr0uCzBxIxuxG0GOQNcYREXeLfectLGn\nc0kU3h+VMBhBEjwc67VkITgabq4odqn3RA05P9nAE5nMBLVUXbOe6TQPRnssCdyGW26mu6wS\/lj6\nO7g5EDKrstd0tMXifI\/r2gs+ghAuJapkA0LgANUIfj+uSszcSoc+6gdfZbrM1dRpu9iFnhM2zg6P\n0US6LOO2BzXeqhsveJnK87K0eq8kaaejQnA7F3UgiEJ3B+M2TlBxIxs+kpyfJApc72+3z6h+2KD1\n\/g47Zr0\/JOPDFQJSPmoSgxhkHHF3zjfGEpSK77DYpm9h7m8PhMWl1Q1lXIUYQJ0l2UTHQJBMpd9P\ndDV5yqxJbUNRf2wt+xSbjDRbkku+92AGgjv5uCW4JfXsy772SklgIxRAUSWvKoEr4jpU0X5czhxw\nO1NVn1p5ra\/jI4IKSsq4ENTkWBDluFcDKgQJflrdxCohSkFQN0Mt1IPgmhDS\/jsSXw9He70kc0uJ\nqo3K3F\/3CPoTouy5FFKLCVWzxczGWlw1qYNSAhwloa4D3B8V+LQQJzHI7ocjPeaRkPMb4lcQlcl+\n+UCwiYCiSk6zmKTAxcQdbnUzudWMdDXtB\/jiYEHcyCaooTG06alDPJIM\/n5qJuWGluT6VEIBS7A7\nWJOt5333uHpCXD0hCs5EXVArAxJ7zlHlZE2KNS6DBAQOK4oxejbLl4dVSd\/hToymddFhLvuUQ53R\ncJOtd8te9pKxkASDoUZLbqircScgWea4sRX2Wdsh1p6oENF+1KJwayzS3sq4xhFbS3K6FKW+aSjw\nfjHRZskBiKEQm+tJoiqiGO8o4BDMdTSs2XMYghd7WeCMBKfEQCxoB11Onq7EJe4lazW2cBcZT6xy\nElE3NfOJTdTkuLxkj7QmS+6K97WCUkDPX0jzBUOfxJzJC7ls5\/HqdyAEbcWXRRbi7rmoiUIfzxet\nOm128phsuNLrbkgm26LOyeOVGS1DlCjm4kJdb8ErvoDSMiJrDQmpKatcK\/cH+dDxeM0nlhLUwovk\nLIxqqLIqJCkBpD6LQnYrH7buhhxkIKeGqVElb44SxKg5TylKCe7UWOP+SHJcEjsOi7Kx\/apIVD93\n3Ixrq\/RhgC3g6Y5KXBIal7y5+l6NnROCSrzkUw\/FCkIu7yHX2eAkT31+9G+S6WizQzxAYMqmdpON\nQY4fFuGed5QAPwE2hgD9mgR8OFTVarHhgHHUvtmYqxoYF9WUXL6zce+TvzsIyFxn446LBsci1Liv\nC0iqm2EveNkQd6MsLsQIDNByoShaY5tt0EOUFoJ5n2ouGnb\/9U\/NXPsXQWIDVA1p3GHxikECiacD\nDAEY5TcQT2CMj9xBvqOx8J\/9fh7oajhmDZJaVuMZAS7lff1fhvpVv+rX\/+T6E71Ngu1dmARZAAAA\nAElFTkSuQmCC",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/brick-1334274899.swf",
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
	"no_trade"
];
itemDef.keys_in_location = {
	"p"	: "pickup"
};
itemDef.keys_in_pack = {
	"r"	: "drop",
	"g"	: "give"
};

log.info("brick.js LOADED");

// generated ok 2012-05-25 10:00:14 by eric
