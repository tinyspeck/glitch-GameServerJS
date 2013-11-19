//#include include/cultivation.js

var label = "Barnacle Pod";
var version = "1351115132";
var name_single = "Barnacle Pod";
var name_plural = "Barnacle Pods";
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
var parent_classes = ["barnacle_pod"];
var has_instance_props = true;

var classProps = {
};

function initInstanceProps(){
	this.instanceProps = {};
	this.instanceProps.cultivation_max_wear = "240";	// defined by barnacle_pod
	this.instanceProps.cultivation_wear = "";	// defined by barnacle_pod
}

var instancePropsDef = {
	cultivation_max_wear : ["Max wear"],
	cultivation_wear : ["Current wear"],
};

var instancePropsChoices = {
	cultivation_max_wear : [""],
	cultivation_wear : [""],
};

var verbs = {};

verbs.remove = { // defined by barnacle_pod
	"name"				: "remove",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 50,
	"tooltip"			: "",
	"is_drop_target"		: true,
	"drop_many"			: false,
	"drop_tip"			: "Pour {$stack_name} on {$item_name}",
	"drop_ok_code"			: function(stack, pc){

		return this.proto_class && stack.class_tsid == 'wine_of_the_dead';
	},
	"conditions"			: function(pc, drop_stack){

		if (this.container.pols_is_pol() && !this.container.pols_is_owner(pc)) return {state:null};
		if (this.proto_class && drop_stack && drop_stack.class_tsid == 'wine_of_the_dead') return {state:'enabled'};
		return {state:null};
	},
	"handler"			: function(pc, msg, suppress_activity){

		var it = pc.getAllContents()[msg.target_itemstack_tsid];
		if (!it) return false;

		msg.target = this;
		return it.verbs['pour'].handler.call(it, pc, msg);
	}
};

function make_config(){ // defined by barnacle_pod
	var ret = {};
	ret = this.buildConfig(ret);
	return ret;
}

function onContainerChanged(oldContainer, newContainer){ // defined by barnacle_pod
	if (!oldContainer){
		var x = this.x;
		var y = this.y;

		this.b1 = newContainer.createAndReturnItem('mortar_barnacle', 1, x+37, y-43, 0);
		if (this.b1){
			this.b1.setProp('pod', this);
			this.b1.setInstanceProp('blister', 4);
		}

		this.b2 = newContainer.createAndReturnItem('mortar_barnacle', 1, x+19, y-105, 0);
		if (this.b2){
			this.b2.setProp('pod', this);
			this.b2.setInstanceProp('blister', 3);
		}

		this.b3 = newContainer.createAndReturnItem('mortar_barnacle', 1, x-26, y-63, 0);
		if (this.b3){
			this.b3.setProp('pod', this);
			this.b3.setInstanceProp('blister', 3);
		}
	}
}

function onDepleted(){ // defined by barnacle_pod
	if (this.isDepleted()){
		if (this.b1) this.b1.apiCancelTimer('onGrow');
		if (this.b2) this.b2.apiCancelTimer('onGrow');
		if (this.b3) this.b3.apiCancelTimer('onGrow');

		if ((!this.b1 || !this.b1.isUseable()) && (!this.b2 || !this.b2.isUseable()) && (!this.b3 || !this.b3.isUseable())){
			if (this.b1) this.b1.apiDelete();
			if (this.b2) this.b2.apiDelete();
			if (this.b3) this.b3.apiDelete();

			delete this.b1;
			delete this.b2;
			delete this.b3;

			this.replaceWithDepleted();
		}
	}
}

function onRemoved(){ // defined by barnacle_pod
	if (this.b1) this.b1.apiDelete();
	if (this.b2) this.b2.apiDelete();
	if (this.b3) this.b3.apiDelete();

	delete this.b1;
	delete this.b2;
	delete this.b3;
}

function onCreate(){ // needed for initializing props
	this.initInstanceProps();
}

function getDescExtras(pc){
	var out = [];
	out.push([2, "Scraping this yields <a href=\"\/items\/639\/\" glitch=\"item|barnacle\">Mortar Barnacles<\/a>."]);
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
		'position': {"x":-74,"y":-183,"w":162,"h":177},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAJzElEQVR42s1YSW9b5xX1wkhQTSRF\nihJFzTNFUpw0kZTEeRJnDaRmSraGaJY1WoNN27Jj13Zix25c2IDrRRYusvGqBYoutOiiQFHA2aWL\nAlp2qUV+wOm9j5JhuIXjVEpjAhfv+9575Hfeueee+z2eO\/czf1oNal2bvmn53Mf6MRu0NrNJBwb6\nUQK0GFTl1hY9GKjJVCX6KEGG7Jp0m1H7oE2vjbYbm9Jhj8PW7XSWfzQAZ5PqAwKGNkPTa3Oz7iDu\ns0RdVt3BL552t9st6u12vUqEOjDVp4XLogcXjN+qTCW9lbqPpkic1lZ0tqjR66nD6pgm7TDIdb3u\n8oNfFFjEa09HvfZXLmtrKmgzgFMcd1TqpuK1B+spzeuoowxnyuK7FRj2OaKWZj1H+r\/dPxeuiM4G\nG3AjpsS2X479YCGWvCUY9pRjYaARQ76Ko2BXyVGvp+yNR4a8Dt0H2YLgXRQ8PjnP2mnXN6VO5omI\nNxV0mtHRov8PE96LFC6nQ4W4G1PgYV8xrvO4R4F+hxaT8XqsjKgRczRgqrf+4GK8LsWaDDu0trjf\nlfogttgK2LuszYbDE+YYXEeL4ejtyvN2KHVvMyBUrEdmSxNbd+MK3COAj\/qVAkieb4UqEezSIu7R\nw9+lwVRPPSYpWJdcUHG\/89BpaU3b2k0HP9p9TgCd3MjAGDT52au37wt0ltjizrLDpK\/i1bi\/JL3u\nLTi61l2I25EiPOwvxtdJJR4nlLgdLcKtqAI3wkW45JJh2FwAT2s1Aa56kIrUvp6I1R4E7eoXTM7b\nmftxD0s0pDYmtDaO4ZD2IOFvElLEOuJYS2mO+FqoS4k5VyG2fQW4TgwyoPuU1i96FXjQW4wblGY+\nv+qU4aJZglS7GHFdLjwNObZTFcd0f5VoLKI+HI81HvJTDgWqlsOOEhvHcHeNAHJ9XHPQby3EJYcU\n664CXCMg+8TUnVgR0sTmzVAG8IJNikWKSWs+RtrECDflIqw9JUCu1r6Q54iP\/o7idLir9EXUXnrg\nMSseDPqrBdFP96qQ6lBi2S7DpqcAVwKFYB0yY2tuGdIBOUUhtujaODE30CxCjz4PIW0uHi0ufnq6\nPkql\/27fjLRKU+52Dfydjei2aahDGDFuLcJ8lxSrxOBlnxwbAlC5AGrSKsEunVt2yDDSKsYosRcj\n9nr0kn+duQEPNYujY8TCvK2AWFNg0qYkMHJMEwhmh0EwyCmar1MxbNG1zzqlGGkR46JFglEC2G8S\nIaDORaRJ8vJMwSUNYl2qVXy0RDriSmSWdjl9lEoWfkyXh4l2CRbsUgFUkoAs2mRC6sfaJIg25SGo\nzkFAkwuvKgd9+uLomQIcbBYdLlIaN92URgLHRzZhthXWnp8W76bgNCaNojdaS9A4aRIjdAyMKhce\nVd5fzxTcgDEvPUMpWhB0JhPsgovg12TGbCf3KKbouqsumwBkI0hgAgQ2QqxxtXpU2XDUZSKolX0\/\n7zSc3X6QK400dDTbIcUO9VUW\/BV\/JvaJQbYTbmsbxOhFSqWvPhvO2mzYKZwEyFWfAWavzUKgMe9v\nfzxt5b77meoqWWZtzZGuto5tZJPsY42YZGNmG7kfL8LNcCFVcj6GqSAClEouBE9jDpyUUgexGqBx\njyEXZ165Exb56yUS+xKJf5pMdt4mFSqUU8zMcacQei4dGewyGfYFcz4GSHv9BtIgFUucUt1vyGjS\nq84+u23WzR5LOVvDtCUfy7ZMgez62d9kWHdnYo\/mt6hTXAvKBdA73gKB3UV6oJmOfMzR97i1RbQ5\n6CfQMdLzmQEcN8tnBkwZJoYJKLeqDTZjArpHWrxDDHI7Y5Ac2wRum86zDU13SDBvzydPzBdsZ7BZ\njEFKP3WQs9tNJ435LwUWaIEZWojNlj1viar5aoDbGWuvSOi13HNvRTLzq5TqHS8xTQ\/yGX2fvZBT\nzF7Zrck5Ox0mjPnf8wIMjlvZGLUp1h9XLC\/O7HHw5oD9cMeXMW4uJJYCs71GMUe\/wVr0U\/H4KOKG\nM9JhL6V2lKyDgXFcIPa4la05M22MQewRW1e7M6AuUatjkFsU7JWsv+EWkQCOjdrXmC10lJgp7\/R\/\nh0y0F7aFacfBaYnQMWnKo3RJhX7KYDndc8TqAlc4AePtFFc5Mz5BDzLBcqCePGVhaeSTBkVwk914\nyBe9mhxh43t\/3lD+u22z7Q83\/4cX+YRR7vOrec+WK7Sw8fYTQFKha8x2ZsBx6hdJY8wuxxKNTzYO\n7J8MmgutjzTIht1ZnUUARfhmtVX37FIbnq60YndA9dN16VOJtrgTOOozrYt2Mm9ApIjBQVr0s858\nrBCQFUon71iYJQY2d8xmnNjn3uxtzBFan6MuC\/Y6SrW+GFeTOtwY1uHLUQ29AigO3wvmmysdumcb\n5lfPtyyvn6+3p7\/dMon6jbKX5sosOKhl+bkjEFhmM0RVGCMdjQnalNBmIE9gKHmss5P0s+64IIJ0\nv6ueO0oeAk1UzeYyXEk0YT+pwaK3EvNhFSa6VUf97vf8ufT7\/dDy09VO\/GbJirlwA55MNWPMVgIb\ntamumix01lCr0smpZeUR0Cz4hI1AJvUeVYYdv1qEqIH2hfYi9JIh8zXevXgbc+FvkmPGV4+vp9vx\naMKERXc55l1lQmzGVZj21byfwUVPiS3dU4sZeykW6MtXYrW41teAjZgGs\/4qjDvoDcxUCpu6CB21\nYgIqgo0YdTdQujQShHRkxJ0VeL5hwYvLVvyWtHXBVY2V7jp8NdmOZ3MW7MUaMOsow7KnAnPOMmHM\nAHdGTBhy1bAGz78X5FdjjdiLVGPUqsREpxJLnjJsBSuFuDvUiIfjBtwZNeH6gAFrUS3WKDU7PY3Y\n6TfQQ9QLDH0x2Yxr9KDJ1iLcm2rHfkIjsPUGlLMUU\/YSAdiSpxwXu5R\/sjfkpw3lueb3Avzzt9Oi\n\/TEjLtPiY\/ZybHVX4kq0GrvhKlyP1+AGLcrzNI35HAcD36T71gMVwpjPbcbq8fmMFeuDRkzYSnGB\nHlRgisBxZhbcZZi2l\/4zoJU+alD8qoeWzv2gin265RbtDuow6anGUGcZRswK4QkZwOVgFTYClQJo\nHm+HqrBHYNf9FcRMuXAfj5kVPr9J11kqiTYFRi3FGLMK8cOwufgvo2bl57RcJUX2T3WV806VyNjd\nJBu01OSa3SpJ0KWSDNDr5P6cs\/TxbrT6gBb\/OwH9bpXA0B4Ru5EqXCYwN\/tqcTtRh+s9NXi80IEn\n6y6s9GgQb1FQ0ch\/cKqkT+j3i4\/j03M\/4+cTCvHxQgWWanF0oK1wO9FS+Iy09N2ss+QfS95MGmkO\na534S0XuJw10r+T\/\/fff+XeOb86TCcsudBVH4kapk+aa0y70bwFwEeiwOUKnAAAAAElFTkSuQmCC\n",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-03\/barnacle_pod-1332893457.swf",
	admin_props	: true,
	obey_physics	: false,
	in_background	: true,
	in_foreground	: false,
	has_status	: false,
	not_selectable	: true,
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
	"e"	: "remove"
};
itemDef.keys_in_pack = {};

log.info("barnacle_pod.js LOADED");

// generated ok 2012-10-24 14:45:32 by martlume
