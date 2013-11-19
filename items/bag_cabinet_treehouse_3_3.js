var label = "Treehouse 3x6 Cabinet";
var version = "1351897052";
var name_single = "Treehouse 3x6 Cabinet";
var name_plural = "Treehouse 3x6 Cabinets";
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
var parent_classes = ["bag_cabinet_treehouse_3_3", "bag_cabinet_base"];
var has_instance_props = false;

var classProps = {
	"style"	: "crap",	// defined by bag_cabinet_base
	"width"	: "3",	// defined by bag_cabinet_base (overridden by bag_cabinet_treehouse_3_3)
	"height"	: "6",	// defined by bag_cabinet_base (overridden by bag_cabinet_treehouse_3_3)
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

// global block from bag_cabinet_treehouse_3_3
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
	"house",
	"cabinet",
	"treehouse",
	"no_trade"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-99,"y":-196,"w":215,"h":196},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAJrElEQVR42u2YWWycZxWGiyqEQEAF\ngsINagglqdqUtFm8xUviPd7ibWyPl\/F4je14ieMkdrxNvDuOHS\/x7sSOs+AmIYQgVVVVYK64ReIO\noSK4JOIiF9zA1eF9Po+jCAnaeOACCUtHM\/P\/n\/\/vPe855z3n+1955f9\/\/4W\/Rxu1gRvTZcFb18uD\n99eqgk8264JbK\/7g5nxF8N6SL3B\/zR94dLP6uX201eCubS37N57cOR18cqc+8M\/2s9v1j3c+ee6D\nGzVB7cOz214K3OqcN+HmXLndW660jevltjBRZMtTJbaua3eWKm1tutRdvzFT5q6x7v6Nattc8Lm1\nS5MltjZTaj9e8ZsAuHuLV4vd9cXQPZ5zW+tvzJbZ7FihzY16Ej43wDM1MW801cRb2+kT1lgVZ3W+\nY9ZYHed+v2it9cdtZ117Y6J1nU21Cy3Jz+\/xebE1xV3H+H624YS11CXYuaZEO1Mbb\/WVx+yMntFS\ndyLhpVhMTt772vRIYfC0P9bOn0myK4FcO10Za96CIzY3XuQ2r6uIMa1xm5bq+tWBPOvtSDdv3mGb\nHMq3ycF8qy6LsYriSLs2XGA9ulece8imdO+cHHLPkPMFWe+1PVipf+2l81AhCVaVRlv\/hZN2T+Hq\nPZ9urfL+0a06G+3NsXYBe7heY6N9OeYrjrAP1qrtusA3yKkPtxrd70tn06ymPMaFe0qAq0qj7MHN\nGhvpzXbP7WxLsdPVsQd3VSj3lv3BerHWcy7NVq55bfBSlgv5TzfrbKzvlAsN+QUjbHx70ecY9Ykx\nFYLdmq+w\/osZDqAKwiYu57p7d5WzPGu4O9sGujJt15V8X1XWrlwpVshK8g9bbuZB90mYixSqk8nv\nuO\/5WQctKWG\/Zae9a+Weo\/o8YJUlUQpthPvf9KS3LTF+n8VG\/sBiIvZa1JE9FnFojwUEPnAhY\/cA\nP9xqCJLYgKBI\/N4og9EygeA7+eQ59b4DWJjznsVFv2nVYrK6PNoxypoafQe0V44lCSRgYyP3WvTR\nvS7EWFgAqc7yogiX0BTDxdZkq1diU321Ch33MJw4EftDFdIxVWiSW0sKXFRVt9QmOEaz0981j5xK\nit\/v2OyU85fa03YP8Od3G4JUZYPyrr3xhBI+1YZ7siQJx7VxigMAS1VlUWJoO9Qw2HMu3Tp1nzUD\nnRnWJSAwn6cUKfdEbIc8bp81Vcdb3\/kwGNxSB8FDgAwpqXnYVSU6soP3sIv0IEWEFBapeip8SMnf\n13HSRrqzlGcnnfZ5cg65deRvRso7cibaydLu292t2mBnW6pjbmowz0Z6sm12tNAuNCdbT3u6E1\/0\nDAcIbWnhEQca\/RuX9ACUCh+Wc+cak1y+ons1ZdGO7W5JEM\/fNUDJSbBDbHWLxTm1o2tDBW7TPnm9\nw+iAKpGO0KbO4SuRIAvQzEiB07yrl\/Pc9yv9p5yTFEyjwtqqFMlMOeDk67ycDYPBuse0LJialwAv\nTRSrD3tdx4CZQYVxVIKLNpJvld5I58jClSKbEKjZUY9jHND9coacg\/32hkQrFJti8FlYIWbyACB5\neHfJ74aEm2ruYwofIMbEJqGkwsmzhqpYdRKPbUigJ+UEXWVe67h2+WKmK5ReFRARKcx53xSdP4Ql\n1J88bArgYbdC8ZP1WjeN3FG3gEHHkvoz3aBLeQSbLXJmUSyva9KZVu9dmNieYGbUXQY6M11HYT3t\nD2lSf3\/aHY7MABC2yLWH6p\/TyqetVb8L2bXBguf5BZPkJPpHSwTYsoDxOaMQTw3ka12uVRRFOoDI\nEBW\/MuV1E05YIYbBYVUvAGHiruY4CmDhSrFjaVgyQvjYtE3iTBrQk5cmix1AphiYBiAShCOwXVZ4\n1EUhrBz85ePmAOAwco+cYtAk8QklNqjQjfbkuLxCYpaulrg1DKgAJP+o5sGuLKOvsxaAyM3cmIc8\n\/GNYAGnmAIQ92GFsIvFnhgvtujYYvpQtUc5y1QmDsALApRcATgog8sQwO64pqF\/PrJIW4qj+J7hr\ngB\/dbwowcaBXq9dK7e5ipRvzGV5XJr0OIOHF6CwvAlxw1btdxbNyblJCj6bSiSiS2opjLlXONoYB\nkCIhtxDZW9crngPcYZNCoHBGQmHbAagOJIe8LgU4oxBichGAPK9XLZCKB6ByMBhWiJEHeu+8ioKp\nelXAAIFwA5D2xxpyrDUkMxQUB6IlV8lFqvh8V\/mA6lClU8nVCjEaqP8NDyAyw8awcGfJ5zYGnE5h\nbvPLAjekDZEaCoWQctLDOAlSCMjM9gSeYM0yugrnFPRUeRkeQFparQ5HVCXysaGNSW7YY4SfGi5T\n2P12U6Hn2qq0jTV85xqOUbkYfbfBH+eKBIDLWqviCoYzsAbGJcTo16p6MB1ifRZApS7HqO4Gf4IG\ngEQ7q3bHZMMwS2\/eOeHV+2Jcp2FyBiDjGfeZMdFRFUuYDKr6nKhObDNIsQDQaaBEd2f8YgiN1DmD\nQTT1+FvWJABVGmZb6xMccPK0o3l7jiTEAJwQu5pwwgOIbjEt07I2FyoccxQJIezVRnzS7nYO5OQc\nWrmpgQHDqcuSKtKBKkYRAMvRdGroP8AgYeIkhxbCHHKB\/jGtcB6mOqlKuggA1+QAlQ7TDBYwDCDC\niVAzuNLu6CToZHgMPmrZoDI5kQ2p57IhOUnBsCFnXioYXaPSmaxhd0H312fLXd6yFt2kH7cqT7ta\nU11KcK5ZVFuU3DzbNcBfPGoOjvXn6Gx7yAEk8ZEV9A2AHdqoLzSI8o6G4yXX58Y9zwcF1sKiY03d\ng3CTh2f0P3QYCnDXAD9Y8wevKHcYjUZCA8P27JflWh\/hp4Nc0jUOQxwvaWPdrvukOV2klxNWxnxC\njQxxmIJFHA4H4BfEwq8ZVslBXrfxHsWv8y3MwByMID0ckqh0vsNWs4DyWm0+NE7xmykbQBUaVHmf\nM61182I5BDBLdlj2PdkXPwvYl2Tfl8VMBE799rwSOzfjR07\/+qRlzQol71l4+UMl7rynYWPeBRJi\nDvUfP2hy3YQhlt+8SBrtPWU+rWOmxPEXAHbLfLJ02XHZPtlX\/xXAV0OeJEoynvGgtMS3\/ywWf5WV\neuDj5IS3PlFh\/E7V9\/vMlHd+o9z6VML7p6T4\/Z8qv54K0FOde58K3N8ZKKhspchf3YskhVtnkb\/Q\ng6u80X8jEiGAfbKCEMBY2V7Zlz8zxvK40F8aNR55+I2+UBgyZNmyPFmhrFhWKquQVcr8sqoXzB+6\nzv0yWYnMI8vnGWp3K3GRb07re7xsz79jbTd\/r4a8\/JrsG7JvyV6XfUf23dAnv78t+6bs67KvfJ4c\n+5\/7+wfVpRgydlJRhwAAAABJRU5ErkJggg==",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2011-05\/bag_cabinet_treehouse_3_3-1304628151.swf",
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
	"house",
	"cabinet",
	"treehouse",
	"no_trade"
];
itemDef.keys_in_location = {
	"o"	: "open"
};
itemDef.keys_in_pack = {};

log.info("bag_cabinet_treehouse_3_3.js LOADED");

// generated ok 2012-11-02 15:57:32 by tim
