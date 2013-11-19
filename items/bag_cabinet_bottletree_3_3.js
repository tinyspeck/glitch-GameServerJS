var label = "Bottletree 3x6 Cabinet";
var version = "1351897052";
var name_single = "Bottletree 3x6 Cabinet";
var name_plural = "Bottletree 3x6 Cabinets";
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
var parent_classes = ["bag_cabinet_bottletree_3_3", "bag_cabinet_base"];
var has_instance_props = false;

var classProps = {
	"style"	: "crap",	// defined by bag_cabinet_base
	"width"	: "3",	// defined by bag_cabinet_base (overridden by bag_cabinet_bottletree_3_3)
	"height"	: "6",	// defined by bag_cabinet_base (overridden by bag_cabinet_bottletree_3_3)
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

// global block from bag_cabinet_bottletree_3_3
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
	"bottleree",
	"shimla",
	"cabinet",
	"no_trade"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-112,"y":-220,"w":263,"h":213},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAIuUlEQVR42u2Yy1Nb5xnG3caT2IBB\nQgKBBIiruF9szE2AQBK6IgTowk3iJomLuF8EAjsumTptkknSJlPHky46XnTnGecfyLRs0pluOln0\nD2inCy+6YaarbuKnz3skz2TVhUx2PjPvnIsO3\/f7nud933MON2683d5ub7fr2T47Nhsfr7Xt\/2qt\n9dnjlcbLjxPNl59ttl7+Ntl2+Tn3X6W6r74+68PT0148SfXg6UkPvji8e\/Uk3Xd5GKg5Pp9u0vwk\nYN8+DxddxFqfPYiY8HChARdRE3651IiP4s0gGL7cacNX+534+qgTvz\/u4nEHr7WD8Phw2YQHc7XY\n8VUg6TVcpRcaJ68d8CBQ++woWIPzuXp8sNzIMOHTzTZCdOATQn4ab8GXW+34aK0ZvztswSebjdie\nqMLJTC1+HTPhY15\/FKnH\/mQVQSuvdnymzmu0tW9fJtv1G3EcqsWuz4CYRYNdlxbHvlIcjJcgPaXD\nrrsc84MaJB1aJTadWsTtGqyMFmPbU4b9KQWOKlYg7qz887UB7gdqrw6DtUjP1SE9U4NNTn5IqGNf\nBkz2Z5M67BFwUcA9Jdhxl2CP+yQh1wi5SsjFEY1i8+5EJTa9elyLio+TXcs7VO84LHC12HaXcnIt\njsZLkaJ66cnM\/kFAhwNvOZYIcUhgWYAAbhNwnYBrNg2WLMVYd5XjgDavufRYd1f\/5o0B407Ds21f\nFViB2JnQ0zYNtsVaApwQ7GyqFKd+Ak7rcEjAmLUEp5MCS4UnSpW93L8xRqtHirE8SoX9lRyrEhtu\nw+UbAya9Vd\/vT9XgmAUSsxUrlu16tBk4gjwkmAA+DGQBbfyNYCe8luL+iGrK\/UlHVsVhNQ6na7Dl\nNSDuMLx6\/jz8Ts5wF6M3bibcFRAFkz4jElbmENU4oHUCkc4qd8b9IwIeEzBBBeU87dcp95xmVdzh\nwjakYMRmb7Wi4oaHkM4GS86Aq46ykZjLwIGk6gyKApJTMuEhIV9be8Y8fH86A7hmK1HARV2BlHsk\nHfaYt5tjWixSwcWxKhywojc57oq94VHOgJseg22LBXLE\/Fu26Th5saLEgTdjcfpHgA+zOZigxefM\ny3Oen2fVFUBRfZM2x1nNsyN6ulLBSjYg4az+JmfAmFN\/kXBVYIf9b5XJnbAWY4tFImpIaxH7zqmU\n7AXwwFOOdVuJAizV\/Row5csAJrOAMwNqxMbKsMJFL9kq\/5Yz4KKt\/MMYrT2YqkZ0SI04AaUapUEf\neTMTn2UBBWqffTA1nr0+lVFQlBYFd8XiLODCoJpPmUqsufVMHeMPOQOueysuNryV2B6vRISDxkYz\ngFu0+VDy0JtRUQDE7j32uItAGdIC7M9Y\/\/r3fTZuKRIZY86sQmRUR7hyrI5VvAqYm405AbKCLzfH\nqwhYoax62aLGugC65CmiV2wTxTJVLZVahl8EMopmVM0cy0KkacviVtkLZwdUbDFlzMEKrDr0mLG0\nW3IG3KB6626DMmhEsVlDqBqkLCZs0zJlcldG0W0Cvk9rFZuzVh9zLykh1S9dYJltZqa\/CPPDWiT4\nNFm0lSFqa1x9IwXjTj1CvRx0UIWjyXqsDRuQsrbiyFKPhJnWMuETbB\/xkZJssdBSNmexVQpK6YFj\nmfyTXJaxwgPsify7RasOc8PG3FpN1Fr+nVgQc5RjuqeQK1fhYqmbz+JOnEU7sNpXh7XeWiT767Bj\nbkBqpAknliYcDZmwO1CD7T4qPVqPYyvv6zMg2luiODF1vxBTvWolB0XBGXPpRW5txlX59yV7ORZG\nSuG7V4ggVz47UIRQXxGO+PJwt74QAR7HXHVwthXC1lwETwuLyd6EpcF6zHbpkSTs0l0jTkJtLDQj\nW4xKGWucMTdcgpnBEixYDU9ze80KN\/wnzieJALo678Df\/RpSpVgVZeHIa5S8BEh1RoaYZ1Y1woSe\npdqh3kJMEMR3X4UZWxX894roBBfBsQL8PcJxQwNahAcNL3IFvIxay7BgN2KsrQDerju0pwgBQkqr\nkIgy9xbMGeAI1UgQVF4IlljxAi7HEeZukLACJ+rZOZarh4U3XEoFtQjlanEq2nw5bylFhIAjLflw\ntBcoE0wyh4JUKZRVUxSbJ+Rsv5ZAKrYklXIuvVPak1RtiCEOOKneSHM+\/H1lmLfQYrMW0\/3lezkB\nfp4yXyiAtGK4tVgZeIyQHio50Z0BFVUUVXsEWKOASRpInob7VMpC\/LxPFuYmnJULNTfkYX60HHND\nJQiymv33ajpyAnzxxHdvya7nG0cZ4p4qmE15CqStNR+ujjvKhAIrOSUA\/u5igmbzTjnP7CU1nFzY\nKP92sDEPAao2b9EhzL2\/V\/tm3yaPEp2X0qvkuRlkQvfX52G4USALYGeIomK9AHg61QrsWPbc2ZH5\nTXJOUkQWaOXfxMZ0CPZrMNWnvpruLX2z7xL5Hk4tNH4vXT\/JV6Qo30C6a29jgDbJhJamfAxnw96m\nwmhLRqUhiabMsZkhCwuZNVhg3oUHpXJ13051l9Zd53fxxTo\/urcIuTNRgRDzx9FZJCogwDwKc\/KI\nhU2XrSbI4+BAMSb5m9wzTbWW7Toll4NmNXwD+Tjd09mv9cM94FUZPT3vXkWdxTiYMf0pPV\/3j1So\nGqcz1cqnaJr787kaPGCczdawMRuxN1nxr+1xw1\/X3OXfrHnrzyNuk93dX\/DDnP02go47z64VcGWq\ncH9y9A7ifu2rao2miZfEnlZGN8PMGDVVFrxory1Al6kQ1WW3PnjvvZtuXh9k3Ge0M+rnffq\/LE6w\nyU+q8fy5uujaAKPjef+MOPKwMm36jqcmRlcWzMGQ\/7XMG3Xv\/qHFmPeyvSbv35rCm495bYExxXAy\nhhj35v1tJzPWW1jgWPa7t+LXB+jRvow4il9VGYq\/4KmeUctokUkZAwx5p7NngR3Z45HsIrqzaovq\nuvDIrZcxb\/5\/+7pu\/ZHnP\/sp\/xv3c8Z7jNuMPEY+o+BHkZ\/97Z0bb7e32\/\/f\/gcvS8zjWqrMagAA\nAABJRU5ErkJggg==",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2011-05\/bag_cabinet_bottletree_3_3-1304555371.swf",
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
	"bottleree",
	"shimla",
	"cabinet",
	"no_trade"
];
itemDef.keys_in_location = {
	"o"	: "open"
};
itemDef.keys_in_pack = {};

log.info("bag_cabinet_bottletree_3_3.js LOADED");

// generated ok 2012-11-02 15:57:32 by tim
