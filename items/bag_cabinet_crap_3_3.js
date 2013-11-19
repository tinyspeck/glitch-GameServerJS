var label = "Crap 3x6 Cabinet";
var version = "1351897052";
var name_single = "Crap 3x6 Cabinet";
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
var parent_classes = ["bag_cabinet_crap_3_3", "bag_cabinet_base"];
var has_instance_props = false;

var classProps = {
	"style"	: "crap",	// defined by bag_cabinet_base (overridden by bag_cabinet_crap_3_3)
	"width"	: "3",	// defined by bag_cabinet_base (overridden by bag_cabinet_crap_3_3)
	"height"	: "6",	// defined by bag_cabinet_base (overridden by bag_cabinet_crap_3_3)
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

// global block from bag_cabinet_crap_3_3
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
	"crap",
	"no_trade"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-96,"y":-190,"w":198,"h":190},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAJJElEQVR42t2Y2W\/jVxXHK0BFUIEq\nISF4oU8VlK1SQQKxKFS8MTOZyeIl3u0kk8ykGalIbXlBoUgUJJh2Jks7Mx2YbHb2eLdjZ3FmmrEd\n73aSKaioIJU3HlD\/gtPzPfd3HatAOzZvRPrKv9j39zufe8655577e+SR\/7e\/f\/1j4el\/vhfo+ii9\n15jsuhdw\/ps+7r6HhkjfsYbSs9YMlPG7qvnwc5QLj1EuNEb7fhftzg\/Q3oKheZvSwn+Q8RvGQztz\nStuzkJXYDm39ySJiW\/TQgInbppfDN\/r\/Hnqjj\/iTordMFH3TRDHWxuu9tDbTQ+szvUr8\/9LkBZp\/\n9dzHak7r6qlmRWcpdtP8bFuh9E91TwTY8NIUa\/oCLTMUtGJoe2WY3gqNUnrBQvurLjqMjVIh+Txl\no8\/J9UFohPbXfDImPu+gyB178148B8\/Es2HDP3meqkHP420BxufME4k5CyXnrbS36qXMqpsyK24O\ns4\/KcR+VogwVtPGnm7LrVtYAVZJjdHfzEt1fs9JhyKkUdlIh4qJi1EfH+z+n8tZlykVGKL1olWcn\n56wUn7XQO3uXutoCrKeGJupbw7R5y8wGvJTbtFEh7KZyzE2FkJ0qcY9cVxM+KjIAIAvhQcpsKMB8\n0CGAgCswJCaS3xig3LpFfce\/3V110O6Sg2CnbcC3M6MTb++NirEsPxgQta0hgSqG7dRIDzOkAoY3\nczwmu+GhXQ59KeptwhUFxi7j4HGoHPPKhDAGv8POO\/faBdy9OBFZe10AczJzM9VTw3S4aaVKzEVH\n6YtUZS8CtsRG4JnK1iW6uz7CKTBIJYaAxwAGYTKFkAIEcF4mNEDB2y5KL11sH\/CEAXfDr6h8Ctop\nu2aiMnuqBCDW0TYDJjyUW+sXw9nVfqrvjFM5Md7iPSfVkoMsn0ymzP9rrx9uDsjEAZhiwHfvjz3R\nFuCDveGuKoc0K17wqjDBADwSsdPxzkVqpIaoGBxQ4AzUYMBSfEwtjqDyLIDgbUwK9wIUE4Mn4cV8\n0EknuyPU9o4BQEAUowgP5wx7qhRxCFw5apeH1pIew7AK8dHuOBVjl1V+sYcAByDxNl\/Xt7x8j1eA\nJdybKrdhp21AXgRdeDAAVUgsAgO4StRBDxgQBgEskAxwvKs8KCs+pMDhrUaKw5xwy6QwHs8FIMbg\n+fi\/c0DkUtgh4dVeACBWXgPXMYdAaEDkoF4cknc8thp3UZ3HHKV8hhd5cYVszZXdOWBaAyov4eHV\nGIMy1IOdYflUkE6BqXBNPM68KOFGOki+sscxBnCViLoGYKW5sh0S8o4AUetQ+7QxBchQSQ7Llodq\ncQWIsFWNwv3Xwq8ktxBC5JsAJtXYctiqQPkZ+E2XHthpG\/Boe2gCN2KnUCXCLt6DoZPtQTaKsDnF\nICDqW4Ni6HjvipQXpIT2+HHaJ2MhTA4pAi\/iuQWuAh0BylaHwoz9NmyX\/MODYQCAELzYCoh6d5K5\nIuWlKB70yD0A1BPC\/chH\/FZLeGUc7HQEiPDmN9TOoQFhRAMep7xiHIBIdIQMgFhU8IxOCYzFfX\/e\nG2l6XXtwe8EsadQxoGxhDFgxFocG1CFDyAWcPSh5lxpR5YOvsXrVghpSYOxxDYg8RGSScx0CVpND\nEywJMYy1AmqDrYDZoIfur5oYcJR3HwfdX7c3Af+yf6k5Hl7Hd1JPeeLbfi5Dyf8BEAmv86mecIsR\nGKyxERgTQF69tYNfU2iOGwRewTvLnIvF31LG3yv3YEJ6YeFaAyLEyVlz54AVvhF9HBoCnYMIE4xV\nozblkbQqvm+tWLihtckejF4xfLNbinQt7iTujE4XFUsAI6eAlU4Ay0nfRDkxKIUagHigXpE1I9R6\nFWMbU0XZJV2M9IwtXq9i7zY8CFg8B8\/DKk4t8o7CdjoGrHK7hB7wtA6e5pJazcPN7Q6tVZ49iEIN\n70gp4TwshcwyHoCYIJ4jezLvIGk\/71Jx39\/aBizFBt1oPAGI1alqoUp65F2rB2GszuNQzwoR92kn\ngz1avO2We1Q99EhK4Hmom4d8nGBbmbYBKwlvVynG5SChAPW+ivAAEgJcwwBscKkAYDHqkbTQgLIY\nDM9Ls5BQgLKwkj7dfXcOWIqq5hIAaJs0JEKHfVh7o9kpG+cMFGvkWCk00GwYZAdJuGXxwONy8OoU\nsMCARQY8DKtuWUK4pQAh9IMNo33SgDg84SxS0AclLlG6yT1KD6mdBePQfBgTKrADCh0BRrxdBT7L\n4rwLw9jQdU8Ig60dNZpZWbkMdsJnX3TUuKcgu4nHyDe1aAq84OpGXqPG5jbtyMPOAfNGyJBfukMu\nR53SpuOzKK27VXkDJSY+LActdQ62Sp7Jtie5NyiwmKxshzz+kM\/aHQPeC47LoUaHDEZgDI0B+jnd\njQBE3jSEMRkPHayq4pvfsMg98Ba8hrKC0Krj64C8ochGLlM+7GkfEH+hlWsCmOeuFw8sRVTYYAjh\nlo7bOBfj7UGB8\/U487wAooai9S8ZC6Y17zAZ\/IYVn1x7GbWwM8DE8i9oL2BtHt7hRUjCJgcodZrL\n8yEJByWsyPr2uIzHNe4REOznONcYcLI7bdrE2\/HAC3Sw4e4MkF0v71hyGzblxaBdwobygDAhtPI\/\nwsm\/a0AsLNwj72siyls4usoqj6rFpF8u4b1PPuTpHDD0Zn\/z\/d7Ca92ixWtKc1fP0MKrZ2lpupe\/\nV5\/+yT5auHaeZv9wRjT\/2jkZtzjZ0\/y8+bsztDx1gVLzPJGQpzPAjdu2J\/Deb\/OWif74e7xk7Kbl\n6Z62tHj9PMN2f6QAeLDuqj0s16Osx1iPj3m\/\/8ydqz3Zhevsnet9bKyPAlOm95dmLKXlGUt5adpc\nCUybq6xaYMpSh\/xT5saHZXxf80+bqv4pU4Wvy2s3Big576YEKz7vorUb1hO2+RXWl1lfYH2e9RnW\nJ1vhPsX6LOBYX2Q99cpLP70dmO6jpZl+WnnDRL+88uwxf29i9bLOGuphmVk2lpPlYXlZbpaDZWX1\ns86zfsY6M\/2bc++mAx5K+d2UXHSR1\/zMi\/z9D1lf+xDko\/\/Nk59mfcm44TusH7DweuwnxvX3WF83\nfn+K9Q3Wt1jfNvR0y\/U3jd8x9qvGNb77EevHxud3WU+yPsf6RCvIB\/KYbknoXbIdAAAAAElFTkSu\nQmCC",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2011-05\/bag_cabinet_crap_3_3-1304540604.swf",
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
	"crap",
	"no_trade"
];
itemDef.keys_in_location = {
	"o"	: "open"
};
itemDef.keys_in_pack = {};

log.info("bag_cabinet_crap_3_3.js LOADED");

// generated ok 2012-11-02 15:57:32 by tim
