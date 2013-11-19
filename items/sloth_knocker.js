var label = "Knocker";
var version = "1335229584";
var name_single = "Knocker";
var name_plural = "Knockers";
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
var parent_classes = ["sloth_knocker"];
var has_instance_props = false;

var classProps = {
};

var instancePropsDef = {};

var verbs = {};

verbs.knock = { // defined by sloth_knocker
	"name"				: "knock",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 50,
	"tooltip"			: "Knock to call the Sloth",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (!pc.skills_has('animalkinship_3')){
			return {state:'disabled', reason:'You must have Animal Kinship 3 to knock this Knocker.'}
		}

		var sloth = pc.findCloseStack('npc_sloth', 600);
		if (!sloth.isHiding()){
			return {state:'disabled', reason:'The Sloth is already here'};
		}

		return {state:'enabled'};
	},
	"handler"			: function(pc, msg, suppress_activity){

		this.setAndBroadcastState('tool_animation');
		this.apiSetTimerX('setAndBroadcastState', 1*1000, '1');
		pc.announce_sound('SLOTH_KNOCKER');

		var sloth = pc.findCloseStack('npc_sloth', 600);

		if (!sloth){
			pc.sendActivity('The knock was not heard by any Sloths.');
		}

		sloth.callSloth(pc);
	}
};

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
		'position': {"x":-17,"y":-51,"w":34,"h":52},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAH10lEQVR42uWYe1BTVx7HO1PGcdQq\nM1XLCBZWWaGAIqW8A0QNBBIgwfB+JYRHiKAgQUNAyjvhjUAQsYRElCIgItoCyrpxi7br2pWubme7\ndbvszmzHmZ3ZZWb9wz+\/e86dS+eO21qVSDuzZ+Y3nHu5yf3k+zu\/xzmvvfZ\/OuyJ8YnZ\/RxgliG8\nOPcCiUlZ0J+FWnREceZS1px+ari1HCg+qxwdJcQUxNzZa4efUj0BB1DBzmuIFRDby167cOarCkdf\nnEIvjB1lElFksHnAqJOrFFJrgK\/HpKebi5CjdMFqA9L15eTouFU1ZmmwnuuvwphFD8upStD5BVMd\nDucnPBGEvivkqLqqrrYbtTTI+jo0S611alwcamLACrIloNcdDYXknh5HDyUtxUYEhbOAVPHNq0L3\n0Wib3NhSwsA0nshFtVaB1IQDyJfHMfeWIY2tpchOEz1x2e7QxwK6vHK4uakuCYVrrilAe70KuqIo\n6DV8ZMl8IRL4o0ApQVN1PgNJnysvyYAg3HeRjWr3Vws3179p0KhbqqvIQY9eiXuzNbh6JhVjXRKM\ndIjRpAlE9D5PKNNFaKjMZWyguxzpiRHY8uYmLRvNa18Z4PhQo7mqTA5LZzbuX6\/EVzfrcedyMebH\nCjBtSsF4dwxKMj2QFOfPuJ0CttUfgr5KBb+9bo\/WrLGrZJO47ceNj43OLbVqGLSx+HggBZO9Ulw5\nLWPArp\/NxOxgGj5sj0Z3ZRiSo5xRrIqHjriXQp45eYxRMUYYvMAJGNsOU0+52dSpxqxFjuE2EXGp\niPk7dz4PM5ZcmPTRaNcGoauChzTR28hO5kH\/fj5jdL3SFFSYexBx0SELnKRuu2FpTVo0N4mgy\/fD\nULMQEz2xGGoRo682klHxV0NyNJb4I1vqgsoCH1wx5cHcmoDcVB4aSKQ3VavQ26ahgIgThZhtCvfr\nYZXkmukg6g77Iy\/BDfrSMMwRoEOpHhAGb0VsmANkgu3ofZ+P5rIgfH1ThwfTKnx+WUmUjkZRbgxJ\nR3lMZJ80FCNeHIrcrFiJTeCumaTVxhoxZgZkGGiIwMXuOEyeSsSVD+T46AMSGD0ynKkXoFkTjNFu\nKeYvZKBTF4pp8rz1fCoudIqgzghkFKTR39euQVlRKrKSIhdsAvi7yZzF0e5EXOhKREd5COPekwSg\nTOEFQ2kAmYfAWBVOIjgW96fVGO2KIeAJaD0eDF3eHmhzvBAj8GTgqFEle1pKIRXxEB\/J815RY7v0\noNt7zpKM4zm7MdWfSty4Db1VYRjpjMOgIQqmxkicaxGiQxuMTyfyGXdeOp2Fz8blKEx1g4i3BSL+\nL5Eo3YeZS71MsGiL09CpP4JYYfAT8oqEFTW2i7ebJMNtUagp9MWlHjGShU6QCXdCkxOItuMhRD0e\nY0ezPPH5FTXUybtIXixCpcqb+THRvK2QRAehTqfE5HkD2huKoMwQo7QwGfvD3v0TeUXRSwOO9Qs2\nWZoiF2+ckzOAQ82ROF0djpT4MKQlCKCSi6HK3I\/spEDGzrbEIEW8C7+fLkfOwR3kMz7QKDyQEPUO\njh1OgVopJbU6FpWaTCQRRd13bZ8hr8l4acCLRrGcJt6eEyTiZDtxVOFjKEj2rBSFuZgzkyIfVpRm\noJYoQ+bEIsxleeHjzdoDmOhLf1JVsJdZl92VoUiJehvppJHQFqejtlzJAHp77nzAdt6BL1367s8W\nT94ey0L9kfcQstfezHbN1N4rLIx\/MzRoT6enu4v5F9s2uy3v5AK83zJEh7r0aRSeJOIFjFXkeyNR\n7EOahnQcUcmwx2PHPAu2smT9t982Ld0cTscJosbG9XZCFo7HibrlNt+Bs9Wka0oR5r8tp6eK\/9Cs\nj0B\/7X6IQx3+xT7LZ7tr\/ooB\/3G3CdfNSaQ6+M1z1HPlPOLAWT92nJfSLSi\/QxdWT2s2zYPHlbux\nbu3r2RzlXFbcNDy614LLp6Q0Mhc4gM\/qiN3Zl1PoQBpkX\/2mEXevlpHEzYOHy\/p2tt0KtAngP+93\nMYCFqe9wAe1\/ZJ9SxM6ZH\/Kfb0YWv\/m0hQkYUaiDmYWj37HhKW+8+PjDtXLSAKTgmHL3o+cEtGc3\n8N+Nx38dwd\/vnmQAZQLH+ae+Y2VHI7dGc62fjGSRhByMjeteFz8H4Ian\/08Bv7TWkzYsmDQVW6gn\nIm12JEIKfeeXs2qmlEn2OxlYwB9rNL9T5dt7RgkFnDHLmVQV6mM\/Tm4fsFnLP6iPCLd+qMStcRUt\nZ48dNq8Tv8gJwZ2po1bq3sHGCBxOc4OvxxsGNk3ZbpA8tkRTBd1rkNq74Oy4Ucy68pljojvW\/O3C\nKdJ9K3C6Zh+k+xwes8vEtkcgpkZBtYlUg+G2aAZyqEX4uDzXTzPRHeP9vWBGkfM1S+YkVe4vt1sY\n9bSkEwrYbd\/znEvkxUdneYiVlixaFWhtvnFeiS9mK\/DHGzWLX99qslL7YlZn\/WRMvUBz3r\/\/fBaL\ndzpxtlkEfYkfonhbZzhZwPZbTm2+7yaigpVG4nJ9pTZ1JgOfTR37H7s6kIm+Gj7ZHvgiM9b5IQfO\n65Vu2tOinYo12V53mzUBTNr4Ias+5EO6nx2Mcpz0FLhaR8IbHN9afyBVtMOQl7jLnCtznclLcF3I\niHFeSIhwXKC5jqaTbVvWJHOU4z1PYNn6ZNWdA\/As463aidYPgLqy7vs+MNeVBsV\/AREqO9HrLBQ7\nAAAAAElFTkSuQmCC",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-03\/sloth_knocker-1332890693.swf",
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
	"no_trade"
];
itemDef.keys_in_location = {
	"k"	: "knock"
};
itemDef.keys_in_pack = {};

log.info("sloth_knocker.js LOADED");

// generated ok 2012-04-23 18:06:24 by tim
