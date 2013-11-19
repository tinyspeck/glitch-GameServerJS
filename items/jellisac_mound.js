//#include include/cultivation.js

var label = "Jellisac Mound";
var version = "1351114896";
var name_single = "Jellisac Mound";
var name_plural = "Jellisac Mounds";
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
var parent_classes = ["jellisac_mound"];
var has_instance_props = true;

var classProps = {
};

function initInstanceProps(){
	this.instanceProps = {};
	this.instanceProps.cultivation_max_wear = "240";	// defined by jellisac_mound
	this.instanceProps.cultivation_wear = "";	// defined by jellisac_mound
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

verbs.remove = { // defined by jellisac_mound
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

function make_config(){ // defined by jellisac_mound
	var ret = {};
	ret = this.buildConfig(ret);
	return ret;
}

function onContainerChanged(oldContainer, newContainer){ // defined by jellisac_mound
	if (!oldContainer){
		var x = this.x;
		var y = this.y;

		this.j1 = newContainer.createAndReturnItem('jellisac', 1, x+38, y-44, 0);
		if (this.j1){
			this.j1.setProp('mound', this);
			this.j1.setInstanceProp('blister', 1);
		}

		this.j2 = newContainer.createAndReturnItem('jellisac', 1, x-45, y-64, 0);
		if (this.j2){
			this.j2.setProp('mound', this);
			this.j2.setInstanceProp('blister', 1);
		}

		this.j3 = newContainer.createAndReturnItem('jellisac', 1, x-3, y-86, 0);
		if (this.j3){
			this.j3.setProp('mound', this);
			this.j3.setInstanceProp('blister', 2);
		}
	}
}

function onDepleted(){ // defined by jellisac_mound
	if (this.isDepleted()){
		if (this.j1) this.j1.apiCancelTimer('onGrow');
		if (this.j2) this.j2.apiCancelTimer('onGrow');
		if (this.j3) this.j3.apiCancelTimer('onGrow');

		if ((!this.j1 || !this.j1.isUseable()) && (!this.j2 || !this.j2.isUseable()) && (!this.j3 || !this.j3.isUseable())){
			if (this.j1) this.j1.apiDelete();
			if (this.j2) this.j2.apiDelete();
			if (this.j3) this.j3.apiDelete();

			delete this.j1;
			delete this.j2;
			delete this.j3;

			//log.info("Replacing mound with depleted mound "+this);
			this.replaceWithDepleted();
		}
	}
}

function onRemoved(){ // defined by jellisac_mound
	if (this.j1) this.j1.apiDelete();
	if (this.j2) this.j2.apiDelete();
	if (this.j3) this.j3.apiDelete();

	delete this.j1;
	delete this.j2;
	delete this.j3;
}

function onCreate(){ // needed for initializing props
	this.initInstanceProps();
}

function getDescExtras(pc){
	var out = [];
	out.push([2, "Scooping this yields <a href=\"\/items\/700\/\" glitch=\"item|jellisac_clump\">Clumps of Jellisacs<\/a>."]);
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
		'position': {"x":-104,"y":-151,"w":228,"h":145},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAHqElEQVR42u2XyW8b9xXHDVsStVHc\n93WGw0Vch6LMRdRCSZSsXaIWy5IsS3Ycy4oXuY2cyq5d2q7jtEbRpgiKXIo6QA4t2kP+gB509aFA\nDgVy6MWnouhJh+b+7Xs\/0oEV+5A4Sd2DfsDDbCTn877f994Mjx07WkfraB2t\/++1VM7oKiPpAY6V\n8ZMDz\/f5\/BuHOz2W2Tgz3v1sdSKLc9N58HZxpEtEZVg9mC+r1f856KWljG4oG6kOZsMHBVVGPiUh\nl5Qw0B3CRF9cgK5P5bBQTmP+eQyrn80Nqzus7A8KtzqRm50dVA8I6kvZbfxSchngtetg1rfCamxD\n2GfBcD6Ciwt9OEuQZ8a6D4PWYX8QVddm8htjvTGoYSeBmMFwHCZdC5qbGtCqaYS2tQlBrxmlkyFc\nmO\/F5mxBqMmWvwhZKauff7+1NtpV7e1SxM05FI+JlNPDYmhFU+MJNJw4jsaG42K\/vbWRPmMEf55h\nLlSKOH0qc1hFEWr1e4E7N9PzZDjfKewLkXJqyI5OyQIPWdtCygmwhhNo1jSghaK1uREeWwcifgv6\nCHJ1MidUZMgXlRRNNJT2vTZYKRfemSqlnvWoASheC1nZCrupHTHZgmTQBr9TD03TCQHFFreTvR1t\nTWhvaYKP4BWPEZ0EOZQNCxW5HhmSty9aXRlMp741XDkj64pqcCQZciERdFIDaKFt00DX3ixA2WKZ\n6q+N1GIwDj7PzWLQNgtAVplVjwfsAma93jRft5uVfC3IRNAqqxE3bCatUKhZ2NeENlLIrG+D32Ui\n9RqFpXze0NEiIA0dNUBWORGwIUjJcD1yZ7OSPIZesvt1mqaQ9g8kgnayTSO6k7cGbQuMBMHHXI9O\ni7Z2rVUjAPV0vYNU9tj01CgWxAiQlWSrM1EvylTL52YKuEgdvjaZ\/W5NM5KTd0I+E9mqgZFU4Tnn\ntmpFA\/AxzUG6sZmANKLu2Fo9BavLNRv22xCRbGJfos8qHmoyv5WAbeBxxSNomSxfGu2qxanMwbcC\nHM4GPuNGYMu4ttzWDoS8JhFWGi8BaoKuiFM0C89CTsBBTZRQrOK8GnbQd3QCnsuA1fU5DUiRK1yX\nbPP5uR5hNQ9zhuRn+Tfv4owEn0MvVGEAj02HOHVwlIJhlDogB6tqo3MRsj0bcyEbdVG3W4X9DCcG\nOW25yRKKTQz6HlX6apA\/hz1fKXwzwHIuMDuaVxCl+tFrNcI+p1lLP2wixQxUhy0058ykhI2awV4b\nKVJt\/OQTHoJ0i9IQ9VkvAW4uTpaTZnj+rXGymsH4scg12ZuWDnXzp3d7X93dQxn5SSlDLwJJr1CG\nb8YWWY3tYhbaaMsWdpNSaVIwSLYzYFSu2csqtbWQraQYNxZb76KGclraxT4ryAmy3Qv1p01fl4xO\nn3n\/iz+cH\/h0t7D\/5GYPPqF4JWB\/yv+smPShL+UX6ojxoa3NQIuhTTzuGC4ZcghAnotxqj1+ejBg\nPGAVihmpszkhr72D5qae1NPBQU5EJSuSlESKFOcnE29jdC5OCV4c9OJ3O\/34+HovHm+qLwOOZqXU\nYJcEgkQx7qUv2ujHjaLOeDhz5lEqcoZjexMKWUxdyvbyjTKdToJ31wCpFFhtfizK9TcfHk1cp6xe\nDc4uwDoJsBi1485iDLemA\/jxmB9XR3w49vsrad+fqqX9P1ZLn39yq+9gezICrr9yNoBspxvJAP+Q\nA4W4B2Q9uuhtJirbRCQo+HrAaUSURggrxw1STHlF15tJce54N0F5KUGPTStAe6hOBRR9h4f5TN6H\nn8yGUK2EsUNQV4a92Cp58M5ECMf++udLur2lOO6dTePGWADvLSZwbSqC28spLPTJKKkeAZGPeVCI\n1fY5UkoNPElbflrwjRgwQwnkKZksqWgii7k0zKSkuf4sF9fpdzIROyo9BDYXwY1TfgF1rezDJQLj\n7bWy9+8rI+FfCls\/2ojt359XcG1UwtsDbiHv7rgfd+aCeLgUwuOVCD5+K4XdqSDuLESxPabgKiWx\nWVYwTdmPdbsxU\/ATlAMn6wr2p\/0okFKs3HTeg4cXM\/hg6yRur6dxfzWFD1Zi2JtWcJ0U2xr0CMD3\nJiRcHvT8YyxpeqS6O4KE1iAA7y7H9++tpbE1IuPSgAc3xyXcnQ3gp9MyHi4GRdyZCYh4MB\/E\/Yoi\nrvMxf4bj\/eUofrORxuOzKj7c7MKvKX6+mhbxYCWJXyyHcWsqgLdGKLmxIM73uQTcO0NehmLV\/jUS\nMz8gnDBF26HGeHcusn99Ooy1fi\/O5OzYKLrEF98lJfcmZfxsLiCgGKg6pwggzvbWFF9TcJP2fzTK\nqku4Tdf4+B59nmNvSsIuHe+SWndXVWwOyfV7OLHR68Jyzv63mbR1mzC8FJpXjpWH85Jve9A9sNrj\nOPQCuT3oDJ\/OWOdKIcOVmZT18o1R76PbU\/IjAvnVVsn9lyvDnqebRdfT9YLjKZXEfziZGlQtAU6K\nk6nS9n0qlSqV0YUhP05n6RUsY\/tnf9iwRrdxf2Xld1hfz+z4K44tAyF9ZTZtWZxNW7fmM9YHa3nH\nb1dz9o+uToa++PDGEB5t0et\/0fvvhFv79ks2voF1\/EVl7s0r1b0Jubqet1+mwzf\/p\/5oHa2jdbRq\n67+pafnaH39lJQAAAABJRU5ErkJggg==",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-03\/jellisac_mound-1332893464.swf",
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

log.info("jellisac_mound.js LOADED");

// generated ok 2012-10-24 14:41:36 by martlume
