var label = "OK 3x6 Cabinet";
var version = "1351897052";
var name_single = "OK 3x6 Cabinet";
var name_plural = "";
var article = "an";
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
var parent_classes = ["bag_cabinet_ok_3_3", "bag_cabinet_base"];
var has_instance_props = false;

var classProps = {
	"style"	: "ok",	// defined by bag_cabinet_base (overridden by bag_cabinet_ok_3_3)
	"width"	: "3",	// defined by bag_cabinet_base (overridden by bag_cabinet_ok_3_3)
	"height"	: "6",	// defined by bag_cabinet_base (overridden by bag_cabinet_ok_3_3)
	"rows_display"	: "3"	// defined by bag_cabinet_base
};

var instancePropsDef = {};

var verbs = {};

verbs.open = { // defined by bag_cabinet_base
	"name"				: "open",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 50,
	"tooltip"			: "Inspect your storage",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (!this.isOwner(pc)) return {state:null};
		return {state:'enabled'};
	},
	"handler"			: function(pc, msg, suppress_activity){

		if (!this.isOwner(pc)){
			log.error(this+" not owner and has no key. Bailing.");
			return false;
		}

		if (this.capacity != (intval(this.classProps.width) * intval(this.classProps.height))){
			log.error(this+" capacity mismatch. Deleting.");
			delete this.capacity;
		}

		if (this.capacity != (intval(this.classProps.width) * intval(this.classProps.height))){
			log.error(this+" capacity mismatch. Bailing.");
			return false;
		}

		pc.apiSendMsgAsIs({
			type: "cabinet_start",
			itemstack_tsid: this.tsid, // the tsid of the cabinet that was opened
			cols: intval(this.classProps.width),
			rows: intval(this.classProps.height),
			rows_display: intval(this.classProps.rows_display),
			itemstacks: make_bag(this),
		});

		return true;
	}
};

// global block from bag_cabinet_ok_3_3
var capacity = 18;

function canContain(stack){ // defined by bag_cabinet_base
	if (stack.class_id == 'contraband') return 0;
	if (stack.getProp('is_element')) return 0;
	if (stack.getProp('is_trophy')) return 0;
	if (!stack.is_takeable || !stack.is_takeable()) return 0;
	if (stack.hasTag('no_bag')) return 0;
	return stack.getProp('count');
}

function isOwner(pc){ // defined by bag_cabinet_base
	if (!this.container.owner) return true;

	var is_owner = this.container.owner.tsid == pc.tsid ? true : false;

	if (is_owner) return true;

	return this.container.acl_keys_player_has_key(pc);
}

function onCreate(){ // defined by bag_cabinet_base
	this.capacity = intval(this.classProps.width) * intval(this.classProps.height);
	this.is_pack = false;
	this.is_cabinet = true;
}

function onLoad(){ // defined by bag_cabinet_base
	if (this.label != this.name_single) this.label = this.name_single;
}

function onPrototypeChanged(){ // defined by bag_cabinet_base
	this.onLoad();
}

function getDescExtras(pc){
	var out = [];
	return out;
}

var tags = [
	"cabinet",
	"ok",
	"no_trade"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-93,"y":-171,"w":191,"h":170},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAGnElEQVR42u2Y2W\/UVRTHifGBxEQl\nxiegM12I0UCJGIkJ4Ip070zLFGwHhUJlSSRqZDFCF0u36UxnOjOdmS5DW5EYWSUqoBYsLhRk90FM\nfJDEBfVJ\/4Pr+Z57z29+gDF0fsiLTHLy2+6953O\/5567zJQpd37\/x9+ldJWC\/XrAPz5Zu\/pR\/ZXf\nj65VuE627h8HVsy9KcDYukfnjgWL1O206Pp5zQNrH7vvplW8etCvToWWqI+3L1RHGhexHd6ur3hn\nf\/9p85P8\/FX3YnUpVW59k3Kwo02ov5DtaGOmHbQJX5MOMyqNbXlcvV2Sw9ZamqM6yl2qs8KldtB9\nW5l+7q50qx5vLn9Prpqtvm5\/WvVW53G5VlOuvTyHyrm4fAfdB+i+q0I\/NxXNzA7wzN5tas\/6QnYC\nay\/TYGi8pWQmO8W9ADaSo8TK2epkxzMqRM\/SEZQJetwqRNZmOonnnio3t4m2v9zTPnnAib0tqt\/\/\nEDcAR+gx1EDjAMQVcJHqXL7aAaNLtYIdFQbGqw1wAAZsL9XDM9o\/8n588oAnd79hAQIuYELUZZSB\nQygCGHy7HhDlug1M2Ks7A4v78rguynTTN7R\/KN3kbAxKmBiUYUm5qlwGhUMeS8XXAkqHAIOygEMb\nKC+gULG11OU8SUQJwPGAhyrGaZScdCJUFPbEqgxgtxmfgAjTmOTQenV51Ac0gNG+I0AZd1BCQiJj\nCpAA0OF0cxYDMEaA9rEX8upEQvmoKR9jlXV7jgBFCelxK\/W4j8LTZ8YSnMMRnIqCcQtQ18Ezkim2\nNJfrAZIj4FzB+daAj1LjAGKQmjw2qBBfqh3ZAVEnZLIcdfqX57PSAEtSvdSyfAYHbGO28yAqHTOA\nUAiNymDHPQzO4ATOAJuwhViGBFREOQAnfBpu8IUCBk7U5DsE3DqfnQFqgFSAakG6HyIH\/QYS7wAD\nZ1YWV+t3QZNMKNdV7uIQo166toCnHnR4+xIHgMcJkKcFcpQkADiDEqMrZpEK+ewMYYNKUGRg9RxL\nwbABjHBY81npGN0PLtcdkzpvLp6RPeDnBlDGS8RkIRSAwRnUkuy0A6IsFAMg1BfV0TEAch363uwk\nxACUUGk4PeZ2EtxIXQE7C1a6LfC4CXHclwHsNaoBEMoPUR0AS+ibbgUgFnUOERIBgHUZZ3gnU0dy\nlVYwtVwnVNwGCPWGqR5Ah+tm3VpArBQCKArCBm2AAOqvvxZQFJTE+M8UlGyUCRoKyhjEMzIZy1m6\nofAGQIxBTNRauQKeExMm4ZIE2Opkoj5uALHcYfsUNc6G\/Vo9KJHkaUYP+PSaDGDYTNCSxSN+Hd5U\njd4k8PxIgC3FOc7mQVkREOaICdeAmSr6bfMgEmPQlsWolzLTEBSTYcFlzUSOck1OVxLJYCjIYamR\npMjje4YxE7WMQSiE3UvCqIXyUA+GengfMhO1o5UEazHA4ER2J32+jFO+lykGy5gBROj0RlVncnJZ\nnrUGSxtBs5HdtmSG892M7P0Ai\/BIwmAcQQUY9ooyUWPs6c1qrlVWNhjYVMhWDde3nncIiFBh7AWM\nkhIaXpc9ekMgW3pRsM9Hay+2aeY7VIyb6QjKypDA\/ZbnpmcH+MP+DerDV+cxhGz3I2YPBzjc6yOk\n2cwSkGxY9bZen19kF40pJ+zNbGJlrd5MgKdHVmd\/quPDjsdtnS\/kHCJHAFzleGkH7DDn3oDpGMph\nRZK60qlNz07P7lQngJ18DskcORnMdkbBu2Y6MEGtVH0GkKErtIqyteoyw0Qmf7SZNeCPBxo4xIEK\nt3Uu5n8ErH8I9FEA7\/AdHUnYNgv4jgOWKA8LmATRc6tuA4AYTg6yWIem06iBXot1mXet\/wDYacq2\nG+UDZrLvMod9dAxltmabJKg03rJIjbxcaFl6zRw1TNcBytZR2\/sheo9v+zc9oc73Fqld6+ZeU+ed\ntYX8bpSuOxvm8FW+p2jcThrwt4P+lb\/sr7v4075adTvs5321V+DzpgEv7652Xd7lu\/L9uzXqejsR\nrVCfBEv\/+iJW3nMiWhYe7y2LHI+U9h4Ll0aTry+o63ttgf9woKhtrKckhncwfP9gR9F3h9qK1ETS\nc0Ob5OvPc0OeBnJ9179x3U12D9m0sXDxxos7qyYupKtOnRv0fnN20HPmzIDn7GehkvMbqwqPPOKa\nVkfliskqyXxktWRQAE42kL1Ctt48v4TvD9w79cX64offG9r81LcTycqLp1KVF073V55Hu2h\/PFo2\nSuXcZNPJHiS7n2zqnf+7nf7+BrX0VfxXk5ZSAAAAAElFTkSuQmCC",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2011-05\/bag_cabinet_ok_3_3-1304531855.swf",
	admin_props	: false,
	obey_physics	: false,
	in_background	: true,
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
	"cabinet",
	"ok",
	"no_trade"
];
itemDef.keys_in_location = {
	"o"	: "open"
};
itemDef.keys_in_pack = {};

log.info("bag_cabinet_ok_3_3.js LOADED");

// generated ok 2012-11-02 15:57:32 by tim
