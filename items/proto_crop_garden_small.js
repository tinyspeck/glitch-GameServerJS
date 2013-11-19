//#include include/jobs.js, include/cultivation.js

var label = "S. Crop Garden";
var version = "1347907556";
var name_single = "S. Crop Garden";
var name_plural = "S. Crop Gardens";
var article = "a";
var description = "";
var is_hidden = false;
var has_info = false;
var has_infopage = false;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 500;
var input_for = [];
var parent_classes = ["proto_crop_garden_small", "proto"];
var has_instance_props = false;

var classProps = {
	"item_class"	: "garden_new",	// defined by proto (overridden by proto_crop_garden_small)
	"job_class_id"	: "job_cult_crop_garden_small_4",	// defined by proto (overridden by proto_crop_garden_small)
	"width"	: "254",	// defined by proto (overridden by proto_crop_garden_small)
	"placement_set"	: "all"	// defined by proto (overridden by proto_crop_garden_small)
};

var instancePropsDef = {};

var verbs = {};

verbs.remove = { // defined by proto
	"name"				: "remove",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 50,
	"tooltip"			: "Remove from the location",
	"is_drop_target"		: true,
	"drop_many"			: false,
	"drop_tip"			: "Pour {$stack_name} on {$item_name}",
	"drop_ok_code"			: function(stack, pc){

		return stack.class_tsid == 'wine_of_the_dead' && this.hasInProgressJob(pc);
	},
	"conditions"			: function(pc, drop_stack){

		if (!this.container.pols_is_owner(pc)) return {state: null};

		if ((!drop_stack || drop_stack.class_tsid != 'wine_of_the_dead') && this.hasInProgressJob(pc)) return {state: 'disabled', reason: "Pour some Wine of the Dead to cancel the project first."};

		return {state:'enabled'};
	},
	"handler"			: function(pc, msg, suppress_activity){

		if (this.hasInProgressJob(pc)){
			var it = pc.getAllContents()[msg.target_itemstack_tsid];
			if (!it) return false;

			msg.target = this;
			return it.verbs['pour'].handler.call(it, pc, msg);
		}
		else{
			pc.prompts_add({
				title			: 'Please Confirm!',
				txt			: "Are you really sure you want to remove this "+this.name_single+"?",
				is_modal		: true,
				icon_buttons	: true,
				choices		: [
					{ value : 'ok', label : 'Yes' },
					{ value : 'cancel', label : 'Nevermind' }
				],
				callback	: 'prompts_itemstack_location_callback',
				itemstack_tsid		: this.tsid
			});
		}
	}
};

verbs.build_tower = { // defined by proto
	"name"				: "build tower",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 51,
	"tooltip"			: "Start a project to build a tower here",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (this.class_tsid != 'proto_furniture_tower_chassis') return {state:null};
		if (this.hasJobs(pc)) return {state:'enabled'};

		return {state:null};
	},
	"handler"			: function(pc, msg, suppress_activity){

		return this.verbs.restore.handler.call(this, pc, msg, suppress_activity);
	}
};

verbs.restore = { // defined by proto
	"name"				: "restore",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 52,
	"tooltip"			: "Start a project to restore this item",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (this.class_tsid == 'proto_furniture_tower_chassis') return {state:null};
		if (this.hasJobs(pc)) return {state:'enabled'};

		return {state:null};
	},
	"handler"			: function(pc, msg, suppress_activity){

		this.offerJobs(pc, msg);
		return true;
	}
};

function onRemoved(pc){ // defined by proto_crop_garden_small
	if (pc){
		pc.runDropTable('cult_remove_garden_small', this);
	}
}

function getEndItems(){ // defined by proto
	//this.container.geo_placement_get(this.pl_tsid);
	return this.getClassProp('item_class').split(',');
}

function modal_callback(pc, value, details){ // defined by proto
	if (value == 'ok'){
		if (this.hasInProgressJob(pc) && details.target_itemstack_tsid){
			var wine = pc.removeItemStackTsid(details.target_itemstack_tsid, 1);
			if (wine){
				wine.apiConsume(1);
				this.resetJob(pc);
				pc.sendActivity("You poured Wine of the Dead on a "+this.name_single+" and canceled the project.");
			}
			else{
				pc.sendActivity("Where'd your wine go? I can't find it.");
			}
		}
		else{
			this.removeResource(pc);
		}
	}
}

function onCreate(){ // defined by proto
	this.setAndBroadcastState('depleted');
	this.setJobData();
}

function onPlayerEnter(pc){ // defined by proto
	var jobs = this.getAvailableJobs(pc);
		
	for (var i in jobs.given){
		var qi = jobs.given[i];
		if (qi){
			var status = this.buildJobStatus(pc, qi);
			status.is_update = true;
			status.spirit_id = this.tsid;
		
			return pc.apiSendMsgAsIs(status);
		}
	}

	for (var i in jobs.open){
		var qi = jobs.open[i];
		if (qi){
			var status = this.buildJobStatus(pc, qi);
			status.is_update = true;
			status.spirit_id = this.tsid;
		
			return pc.apiSendMsgAsIs(status);
		}
	}

	for (var i in jobs.delayed){
		var qi = jobs.delayed[i];
		if (qi){
			var status = this.buildJobStatus(pc, qi);
			status.is_update = true;
			status.spirit_id = this.tsid;
		
			return pc.apiSendMsgAsIs(status);
		}
	}
}

function setJobData(){ // defined by proto
	if (!this.container) return this.apiSetTimer('setJobData', 500);

	log.info(this+' running setJobData');
	if (this.getClassProp('job_class_id') != '' && this.getClassProp('job_class_id') != undefined){
		var id = 'proto-'+this.tsid;

		log.info(this+' setting street data');
		this.container.jobs_set_street_info({id: id, type: 1});

		log.info(this+' setting class ids');
		var job_class_ids = {};

		var class_ids = this.getClassProp('job_class_id').split(',');
		var phase = 1;
		for (var i in class_ids){
			var class_id = class_ids[i];
			job_class_ids[class_id] = {in_order : phase, class_id: class_id, delay_seconds: 60};
			phase++;
		}
		this.container.jobs_set_class_ids({ id: id, job_class_ids: job_class_ids});

		if (class_ids[0]) this.updatePlayers(id, class_ids[0]);
	}
}

function getDescExtras(pc){
	var out = [];
	return out;
}

var tags = [
	"no_rube",
	"no_trade",
	"proto"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-103,"y":-52,"w":206,"h":53},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAADs0lEQVR42u1V30+bVRie0czoQhhq\ntjD6+wcsLYx+Zf3xtaXlRxkwVjoKLVBaSEHYStdoBjKDsAoyBpsGFHQLKhjdEp0x3ng1L77ohZne\nEP+CXXm9EP+Ax\/c9tIu7QDdv\/Z7kzfnOOe\/53uc87\/O1hw6pUKFChQoVKlSoUPEfkGwx6nu9hpGE\n34j+gAnJoAXDzdUYDJofDgTMStSjV+I+w26\/30hzE+I+IwYbzRhusjykUUk3WZWx8EllgJ7PndYV\n2hyatR6vQUmFLAqfX8hIuz9uhvHMxHo82igVWaMXPRpushIxM4aIHBcvjRztkgZnG7TolQ0479GB\n8h\/vpUL750pnYl4DWk9VgYhhrL0aG5c9+PQdGcs5ae\/pFfMZ9TGvbodfGnHpBIGoW0fF9WAV+3wG\ndNM8XF+FLiLW49UjJusRJXJdp7UimCjnspq83+HUCGK9spGVx1rehS8LfhReP\/VHptu8nonUtPwr\nsdHm6vpUk6WQFO2xinaOUCv55slGCzokrVCKVUj4TeghwgONJqFYprVG5HPrh2jO+yVlzxHhPibq\nMWAuXY+7iwFcz0lYyrm\/TZ53Oaj0sQNJTYRN5elGS4g89P1Q0PyIi5TaFycF2FOsHCt4xqERyvEF\n+okA5zBBbmFKkDKKM6xYdzGfFeSLTUZP4ot5Pzam3Vi66Ph9PFYXpvInKF44kNhoi3VtMGDa7SPv\nkHnFbc82aIrjfrQ5qtBce0Kss8eYRNStF+rwXmcxv6uUT23n1vOFmGjmjBWb5LPteR+uZSVcGbbv\n2PRHpQMV+\/VOYuT2296dVKsJ0wk7puJ2zPTX4q1ELTJtVuEd9lI3eY+LC39RSzvYh7TOXmNF2Yfs\nT25zzLsfnBtxaYVyESJ4c7IBdxYCWJyo38v31ayMRCx24N7z\/+iz+5th5Ubeic\/m5Cdie17GDx91\nifhuNYRvloOP4971Zqy\/6cLmlPuJ+GQmiPcu+LCS9WB5QsK1cUmMt66E8NW7AaxecmIp2\/BLUDp2\ngUoffqovtKys7FUaqileuZqpi04P2ZK53prRr9\/v7Ny+6l9dv+z6cDZTtzU3Vnf71qy8uDwpfcDx\n8Yy7sJpzbq3kpN+2Zr0PSBllZ15WPp+Tf7pxyflgY8q1RzmgPfy8HQeJ8OcbA\/bxbDZZ8cy\/bwCe\n46DH8r8tH6Vg8i9RHCnu8XjcZrMdLq5XVVZWvpzPd77Ic0Bhg79WUVFRXjyrofAsXPSl0x2GdnrW\nqn9zKlSoUKFChYr\/D\/4CzqfeBdGxGt0AAAAASUVORK5CYII=",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/proto_crop_garden_small-1333485480.swf",
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
	"no_rube",
	"no_trade",
	"proto"
];
itemDef.keys_in_location = {
	"u"	: "build_tower",
	"e"	: "remove",
	"t"	: "restore"
};
itemDef.keys_in_pack = {};

log.info("proto_crop_garden_small.js LOADED");

// generated ok 2012-09-17 11:45:56 by martlume
