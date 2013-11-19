var label = "Crown Game Lock";
var version = "1313087079";
var name_single = "Crown Game Lock";
var name_plural = "Crown Game Lock";
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
var parent_classes = ["crown_game_lock"];
var has_instance_props = false;

var classProps = {
};

var instancePropsDef = {};

var verbs = {};

function buildState(){ // defined by crown_game_lock
	if (!this.spawned) return 'visible:false';
	return 'scene:1';
}

function onCreate(){ // defined by crown_game_lock
	this.state = 1;
	this.spawned = 1;
}

function onPlayerCollision(pc){ // defined by crown_game_lock
	if (!this.spawned) return;

	this.spawned = 0;
	this.broadcastState();
	this.container.apiSendAnnouncement({
		type: "quoin_got",
		delta: 4,
		stat: 'time',
		x: this.x,
		y: this.y,
		pc_tsid: pc.tsid
	});
	pc.announce_sound('QUOIN_GOT');

	this.apiSetTimer("onRespawn", 1000 * 12);

	pc.games_it_game_lock();
}

function onRespawn(){ // defined by crown_game_lock
	this.spawned = 1;
	this.broadcastState();
}

function getDescExtras(pc){
	var out = [];
	return out;
}

var tags = [
	"crown",
	"game",
	"lock",
	"no_trade"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-13,"y":-34,"w":26,"h":34},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAE4UlEQVR42u2Y+0+bVRjH+Q\/81R80\nRJ2MGDfMMC6aaAFnvLEgg9HBJtix4QBdXbmsxEq9bOUyarksQMptMDpu67oZmAMFMhIg5SIgEGQw\nShnjkoHlGi4hfH2fk76kxiIUukhMT\/LNOe17nnM+5znPe855j5OTjQmAM6eQ9fX1erMM2CTxdbii\njpMPp2ecnmbiOhBzMllCrK6uYnFx0aqsAT81SK5hFXWytraGyclJDAwMoL+\/f1saGRmxBO6gWbA3\nXAi1vLS0hOHhYczMzDDPbZVoMFNTUxugvb29vCcNdvOkOeZM1JnBYGCQJpMJo6Oj7Pfg4CDr2JrI\ncwsLC1hZWWH1WltbUVVVxfOr7AVYQK0ZjUaMj48zsM7Ozn+ooaEBdXV1TFS2fDY\/P89sqZyTk4Ox\nsTEe0tkegKbl5WW0tLRgdnaW5SQCyc\/Ph0wmg1gs\/pskEglUKhUDpbo0KBKVy8vLodVqeUD5buHc\nqBV6Kdra2jA0NITGxkbU1tZCqVRCJBKhrKwMPT09rA6f5ubmDDSAxMREVp+mmp5TuaSkBLGxsXYD\nFFArFGvd3d3o6OhAfX09CgsLkZycjJSUFMslxGCxNtbzAystLUVfXx+LW7ItLi5mA+OXHbsAUoDz\nQV5TU4PMzEzI5XJLr4VYsaXFmdmQpqenmW1RURELA7sC8stEZWUlU1pa2kYntK5tZdvU1MTCg2wL\nCgrsD0hT1N7eDp1Ox0TTu1UnlrYUj5STbW5urv0B6SWg+KE3kGLIEtC8MwisSMzbkp1er2e5Wq1G\nZGTk7gFpjeKDvauri4GRaB0jQL6TrRJvS2875RkZGQgODuYf074ut3lXMXuAHQoW52dxR6thsUNK\nTU2FQqGAUChE2bUU3LyuxG2NalOVFGVt2GZnZyMmJgb+\/v5obrgLw2DPzjxpHhWqb2UhOsQdlyXe\nuBR3BlERARCHHUOQ7zvw\/\/gwjr79LI6\/+zw0V4S4kylCZfZp\/KwORXXeGfxacBZ1hWH4OvwIQgPf\ng+jEESay8\/vQndkGvf8cnkw8YpA2AdKIZqYeozw5AMUKH9xQCqH4SgDZ54ch8nZGuJ8LJKcO4qLo\nEBRiARK5Z0kXPJAs8UBKlCeU0Z74McYLqlgvLvdEPGdH9tnf+6DiagiadBe58ifcfx7QXU\/mp1tg\niwcx0t+KtC\/eQJ7UAxWXvdGsCcfDuu\/QrI3Cb3e\/4Tr6DJ335P+q\/vsJXP4tU2XeOWZDYBHHXbmB\nvsCUKD1h+65iDfBehhBN106j+9Z5GH+Jw0htHB5UXcDv2nC0aES4nxeI0sQPkBcvQJb0TaRJ3HHl\nSzckhB+A9FNXxJzcD0mgCyL99uGsz4v\/DWB1pi9+Un2E8gQvFMrfglr6Oq5GHYJK\/BqSIg7iUtir\niBe9AukpV0Qee2lvA57337e3AaOELg5AB6AD0AHoAHQA\/p+3uj1\/WAg9uoePW+KAl\/fueTCWO7ie\nNntvN4Ds2kKTcNJugIpzBxAdtH8DjFd7czUP6GbzpSW7qfpzHA\/0tzGgr8CQ\/gaGGtIx0abG48ak\nbQGS19JlvlDKgpD+Qxj3KZrKRGDGh707v8ykj2n+w32rNDvRB9NYL6ZHu\/HkURcmjR0w\/NGyHVOT\ntYunnV6BCMx31fTNLLe4ZjNt1rlFHRVvZ9HWtm5X\/wIx5liIYx5lhgAAAABJRU5ErkJggg==",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2011-08\/crown_game_lock-1313025945.swf",
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
	"crown",
	"game",
	"lock",
	"no_trade"
];
itemDef.keys_in_location = {};
itemDef.keys_in_pack = {};

log.info("crown_game_lock.js LOADED");

// generated ok 2011-08-11 11:24:39 by mygrant
