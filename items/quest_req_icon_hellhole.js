var label = "Quest Log icon: Hell Hole";
var version = "1333669470";
var name_single = "Quest Log icon: Hell Hole";
var name_plural = "Quest Log icon: Hell Hole";
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
var parent_classes = ["quest_req_icon_hellhole"];
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
		'position': {"x":-87,"y":-187,"w":175,"h":187},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAIzElEQVR42s2Y+1PTZxbG\/Q\/4E9x1\nq5WLQlBUFI0gUjAgoEQIkARJCPeEe0Au4SbGW+mFzm5dp9idpc6KHRkHXWbqlmnZdsaCxEuVMaOg\nQoC0szDT\/WE7s5dnz3m\/fEMCwbJWu2bmnQxDJvnknOc853mzZs0LPr5+S9M5EqsOWPM6Prq2xelH\nVVrcTMh0jCZmh752gB\/vUk0w4Lvb9qNXmTx\/56BO\/9rAnVJEK6\/sTUV\/zCGc3BKDdsVe9MUdxlRO\naedrAWjfEj34RVw6zkXGC0A+jWG70Z+YjimDZXDOZA34v1bv7NZ9YEAZjs\/TEQc+PtaM\/iQNJo1l\n81P5Fb+8Lu2K6NCT4dGOPmrtH6ISPXDXbHbw419\/e4KWVA36D2owa+vA3VTD4C1VtjijCVrlK27r\nXgvDvB0RC0dKjk\/13lEmiQryo6\/pBPKCtuBuQwvuHTKAB+nG\/iO4sEuFWypt5ysAiw1gzckwn8Wn\nYzKzEF3b43wg5dOqUArA6aoG3E05KgBlrZ6IiMGYqdwxZ32JGm0N29OdTx9YHxoloBiOz0iK3i8g\nv+54ZAxcBVUC7qt4jc\/\/2yP3YbzMOj9T3fjzW94WtkdfHBwBBuwIj8b1OLUHcDwjH58d0KBnbzK6\ndrzlgTsZGYtrKVlwFUqA3lrt1uRhbmoa53LyMVpQBvfx07YXhjujiFlbEhIxz+2q2LRD+oAo1SKg\nJh+T2mJM6krI\/8yYyrVgyliGKVMFXPmVAvB2hmnZpP\/7xx\/g\/GYEltAdeNhyHC8MWBK8zcFwfNjj\n+AO8WzyZVSQB6ksxddTM\/keA5QJwwmjBQ4MZrpIa9MarPYC\/TdTgrx9ewB\/zymDduhuzDW0vBlga\nHNEpwxUGb\/WpAsM9TjdhMnspIFUvr5yqVyH05yqqFoBPiqpwbk\/iMp1ezzLgqblWyIDOvLCjA9ru\nO4dybZPP06dp3ZYAGY5P1aZInzfn4WDIh9S+JwyZw4AWD+DDnBLRXlcxA1rhNJVjuqwO35rKcFmV\njo9iUvDevkTM1DVjTFuE6zGHxT7ncyZiH84qE9BJ\/7+YoR+cO39+7TLAvI0KpQxnCAyHOWTbcsCs\nQoIrxFepOgynHcVYVsEy\/bmKa+AqtWLaUkuAxzBdUY+ZqkbM1DRhptYGFz07Duo9FvQJfZG7Vwcw\n3HNZWNXNqlrMXbq03I6MQeE2GVC\/MUw8ewMKH\/TS3+10I24kZWJYnSsBFlRK7SXAaQIc0RZgupwA\nKwmwWgZsxrS1CZ\/HZ3je98aZLvznnz\/iHz\/8HXWhu+DuOHXFb4uNgVsGvVvMpzlsj+eNhNUsGRAG\nvJ9dAJfJV3\/TpLGrNBjjpMPpygYJ0GoT7Z091oL7VDXvL89V5EE6G6PCd\/ZTFv+AQeHz3Fo+MqB1\n805fQNYe2ctYZj4eZBYIwIlcs2ivM7eUjlnojwF\/v1uFB0YzZgjw+\/c+wFNuNQPWt2K2sQ1\/8ppy\nPuy3pD+47WeXhw1DoGLt0urx8dZhj\/IgAUr+dystF6NHjBgiLfrT37eGUnxAGhvONAn9fd\/5Phwm\nCwG24Bm1mgFnbccxTKZ9kQbofFwqzlD1RipqJ\/xWrzh4m94foLcOu3cnLrRXMmgnDcst0qE\/\/fUm\nHMHvdiXgZoZRAI7V2YT+uL2zDVTBpnYB6G7pgLvNTpvlJL47cZrOqe4V9Bcu\/C9tfQhS3wj2abOs\nw0VASX+36cOduuJl+nMu6KsnOhl3coqF\/u5UHPMCbIOLnp1lVkzWt3gA3R2nO+fs9oAVByRnowKH\nCZAhs94M9atDbq\/kfwyYt2DQC+0tkvyPq8evvUoae1RYKaxlQJ2zqD8C5Aq6mzvwuLYJ7nb7T+9m\nuXpy5Y4GKrB03fkA0v516op8AK\/SwMivO0PJmwdoqrxO2MuQrkDoTx6QieoGTFIKd7eewGybfX7F\nyon1tilCGLR31bwPm6enxfrFgPBIX7yov8JqvEubwBtwQJWBcWo5A\/5FY1zUX2M7RvRF+EZLoYP+\npvY+v3pFgRGWlQbEe0j69h\/2GxDkAfk0OQPHFFGeL3SeEhBPMwMOqI969MftdRhKaECoeq32iZ8M\nCHlB4d0rwXEmlAG\/SMoWgDcSM5fv3wX9sf9dU+tQE7YLnbRjBSAZ9MARAqyXAJ3mGjyrk9rrbjup\nXw2gYyXAspDtHsC7aqNHf4sJpnIxIJRKgLx\/\/5yegybFbtzLswjAIV2hR39jJVWSvRDgqiIWb5CV\nAOUJ5guTv4D6mFrdk5AmXtujUlNAqJP2L22N95UqXNx\/SEzx\/ZJqPCKrYf09pmfZ\/1YLaFsJUJ7g\nSzGpy\/TXn5yJ5q1Kz2t40du2R+MW6Yv37zA987B8SQNyu6AcD6i1E3Shkgz6BFfQsSrApTnQ3wR\/\nnaJbNGiNCZ8mqDGQnIV7ZDWsv1FtIS6QMfM+5ap3xSTiS10+hijRnNubJI48ILPNUntn2+2Dq07S\nKw2KiPt0MZL9j\/PfU67iUv0tDIiTJrr3QDq6aM3xl2vbGo3RovKF9kr71y0Dttm7Vw34SXSSUkcZ\n0Nug5QkW9vKcCxLvXyfdNYZo9Q3R7e2J2Sr270BaDt7evh\/D+RbPgMj7l+3luebs7zGaqlVWbo60\nHF4f3J25IXSejZvvEHzFfJ7\/ifwnEnQdnLTaeimdyAH1MmW8K2naJQGB9Wf\/+b\/fJP0mqJv3M0P2\nxaX5XJBGKUYtDah8\/5gur8coex8Bcv7jFdev1nvp7zhmW+yWl\/brAiWbQd7PDNkbewjj7IMr6E8A\nivsHJ+gmT4L+PMsktVcKCFde6u8zsevWBajXhwgjZ8hzUQcwTjpc7QWJA8IgVVHSX\/v\/rrvVQqa8\nEWTLfjN0XvxOQ0n5Hm0G74DqMeglFyTev48o0XD+cze2vtrfDaVqbhK6rAnbiXei4tGXpMFQuoF2\nrlnoz98F6VlNI7W3zbLml3oc+HXg2oRfbVRqNmzWZ27YbDNsDO+2hGwfrN28c+LD6CRcTc4W8cqR\nXyYH1BfW3X8B1NEr4UMU7EgAAAAASUVORK5CYII=",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/quest_req_icon_hellhole-1333669470.swf",
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
	"no_rube",
	"no_trade"
];
itemDef.keys_in_location = {};
itemDef.keys_in_pack = {};

log.info("quest_req_icon_hellhole.js LOADED");

// generated ok 2012-04-05 16:44:30
