var label = "Nice 4x8 Cabinet";
var version = "1351897052";
var name_single = "Nice 4x8 Cabinet";
var name_plural = "";
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
var parent_classes = ["bag_cabinet_nice_4_4", "bag_cabinet_base"];
var has_instance_props = false;

var classProps = {
	"style"	: "nice",	// defined by bag_cabinet_base (overridden by bag_cabinet_nice_4_4)
	"width"	: "4",	// defined by bag_cabinet_base (overridden by bag_cabinet_nice_4_4)
	"height"	: "8",	// defined by bag_cabinet_base (overridden by bag_cabinet_nice_4_4)
	"rows_display"	: "4"	// defined by bag_cabinet_base (overridden by bag_cabinet_nice_4_4)
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

// global block from bag_cabinet_nice_4_4
var capacity = 32;

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
	"nice",
	"no_trade"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-137,"y":-272,"w":270,"h":272},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAIAElEQVR42s2Y61dU1xnGza2mNSvG\nxKiAMAMzA3TFaJUEDZeYggIKyHATNRpUvCSaRiIauQ\/CCMgMzDCASHNBsmJWYmzipRrTSkBIYs2K\n90bTtF\/SD\/2arv4Db59nn3MogxplmHZ11nrWnL3P++73t999OfucSZOC+HvnpadzapdHOX770twd\nk\/6ffvXZ1k\/cBbEDbyw1\/7gnzSxU9bLIgabcaJQj5\/3PgU5tTzA12WM8XWvmOKjydPPAriUmuZ2a\n7NG9tPEWPeWhTpUlmIIGUpoSvn7H4vBzpb+OkP+W0P4PpS+ED44briw1onhnSsQ\/IRmtXakRshuZ\n2bPUJOVpJqmAqtLNUpVhlpplkX6qRh3vVWLIaUufN+C7O9UkO1P920W83nEBJkVMnVa0YMbldQtn\n\/b144ayvDK1fFPLFhkUhw7qGtiSF\/bglKVQ2JYRAoX7anBgqW5PCpCQx9AptdQ2zDehLo83Vz8yQ\nFXOfKB53FvdlRTlceTZpy4++Z+23W2W8Pi126+WA5iAB2cC+FRZxZEb+pJwroqQpxyKuXA1uf65V\n9mZF3dWPdu2FMQMTAmTgFjRENdk17devm\/Xr6mVmP0A3sli7PHLE3vB3orNGmYC0CxiwAYCtaKAR\n2elZHStdRTFyYFWMdK\/S\/kdfMxjtMFxCHxcAWOb9TvgdhD\/VsTJ6xKfZblF23gJb4IDs4T4E6kKD\nhryF0SOALLcjaH12lLLjHKQPM8RyN6GKNBva8pp1bMOVp2UyOIAMgkY7CmPEuT5FPL\/JBYxNOlci\nKFSfdQfAVbHqvjPbiiG3IKtW1Rb9mvWp4ymwDQYMyDnlRHa0rMVKZ02JnLryjXx27ZIceculIBmQ\n8412zTlWNQ8JyjLh3Kt+JR\/1n5ZPr16Uj987oCB9qCcc7dqCBehD9k4M\/1HOAM6AdG9OU0NWcwdA\nghxsrfTz8e1ei6xpCylogMxE2\/pEGfj+hpy9cW0kYGvFRpXZOwFyRR\/r\/72fT09HPeCig5PBFgRr\nQCDOv579r8u5v96UQR2S2ejDkBGIjzbaNeVw4tvU9sOyqzhBBuEzumNHPz+N+al1ollb9QEC4mzX\nogciYN+Rt+QsAinIv3yrAp68MIwNWdsHFSD2uRYV2KLKXXVbbvFhx5rXPqdsKHee9VxAgHUAZC+5\nQrHS5PDZE3L6ewRBsKG\/fadl8uZ1cRbOU4C0awQgfbhps9zjq7qtj3eHXT2h1OY+EUAOwd6sSAxj\ntHx885oc++66fDomoOc1uzrN0I5B6dOIwCz3nXxf+YyFfNNTrTLdqJ4+wQDEpP7wz1fkE0CeQMAz\nCNiPgMMI2F6ae0fAt48fVj7Hx\/i8016jPW0mDJijAXI1Hrp44RbIzxGw4\/W8\/wBmW9RKNgC7jx66\nrc+hDodaxRMG5Kqsw3PWk49H2\/khBXlkTEAfACsBSDtntkWtZGaSZe8Hb97Wp5eAdqueccvQhAFb\nMcStfzgp3eeH5dClr\/0Cel5Jl0qcnDPibVK6JFJeW2KR1SlzpBYLx3W4W+vYGJ+3O2vVYlKAORMA\nbMzRjkWt+TZpRTY8Q\/1yEJB9CHj026tyDAGb7TFSAcCtL5jVi5Ij0yLbUyLVsLtdZX4+HwGSPp1l\neWquOrWVHCTAA3XiPX9OPMMI+Kdheffy13K4\/zjuaYC0a8AQ08epH3Ldjo1+Pn3wOXrjqrSXJKst\naeKAeiCe8Vor1kj7N1+OBOzBJt190KmGvyLdpAHqeyFP2Cy7NiTA5ys\/n96B01h0seq0o5\/EAwU0\nOzhHeFJxq\/cMnAUHT+mQgypg28Zk1NukHIC0045d2lNE84sW7\/E+v451tO3BotNO6g3qHGkZDgiw\nFoBOHZAvQpTvPa\/4rlwQHwOe+R3qtHMiXytpx\/cQpw7IDHKeed2lIz7t6Jh3W5o6zQQHEHOqZrlZ\nHQgoz6YkBBpSAb3b09VK5DFsDwBptzczSm01PGHv5UsR7ntenD\/i4+t1AS5GtcVs108UkJO+BtvF\nyEtTDo\/osQgSq+Yl6zjECnAZ98IotVAYnGV1nMpnx5LFuytfvOvi1BOEvg59SqBDwQM0AhpgzXqZ\nc3AsoEOfuy7dj51Tiw1iPc+LQQGsHgXIUw2BjHcPA7Yyw6TsDEDOxTp99Ru2zfo\/gflPONrB\/ovA\nADPMDjbCwNxGfkpVOqAxbOicqrubH+0wDycGyEzcixr0YVWT\/x596pUCBMRwebh9UMyOIaNurPg0\nGfuFyxAfe+Vpmox2aK\/X\/RAQIPaxAUcm9zNtMrNBivsdg7Ke1+X6V1WqKiPyFtFmdDuco5RRR1Us\nNS8eF9yWuGlTty+effnVxeFCbXt+tvqc9nJS2PXNCaEXNyWEXlLl5DB1X\/vUFiqG\/egyrzcnhv2D\nfhR8\/mXYGXolefa7CPvA3bgegn4BPbYufmYVv+1Ra+NDJH9+iKA+EcqHXoT4PW\/DIw\/d\/6p1+mQ3\nrrdCL1ueeNgZMvVnlSw\/OeXBCtv0yS243qjbr4PWQEWxM6bsLEkIFyMG9azpUbb7CDQZum802P3Q\nz6FHoelQaN686WUr42b6ChbM6CqIm9X9vO3xatTn6ICr9WAMvAHaBJXokNsIqtcV60AF0ArdPwvK\nhjLjTY81oPMHChfM7CiKm+mdGzYlFfVh0DToYZ3rlt99ozJJ4MehJyEzZIVioaegudB86BkoHloI\nLYKe0\/8X6fXPQgsgfu2fA\/0SsjEJertsf6qeoAfHZu7fjYsfc2uFuB0AAAAASUVORK5CYII=",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2011-05\/bag_cabinet_nice_4_4-1304534661.swf",
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
	"nice",
	"no_trade"
];
itemDef.keys_in_location = {
	"o"	: "open"
};
itemDef.keys_in_pack = {};

log.info("bag_cabinet_nice_4_4.js LOADED");

// generated ok 2012-11-02 15:57:32 by tim
