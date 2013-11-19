//#include include/jobs.js, include/cultivation.js

var label = "Sparkly Rock";
var version = "1347907556";
var name_single = "Sparkly Rock";
var name_plural = "Sparkly Rocks";
var article = "a";
var description = "";
var is_hidden = false;
var has_info = false;
var has_infopage = false;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 1500;
var input_for = [];
var parent_classes = ["proto_sparkly_rock", "proto"];
var has_instance_props = false;

var classProps = {
	"item_class"	: "rock_sparkly_1, rock_sparkly_2, rock_sparkly_3",	// defined by proto (overridden by proto_sparkly_rock)
	"job_class_id"	: "job_cult_sparkly_rock_2",	// defined by proto (overridden by proto_sparkly_rock)
	"width"	: "274",	// defined by proto (overridden by proto_sparkly_rock)
	"placement_set"	: "all"	// defined by proto (overridden by proto_sparkly_rock)
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

function onRemoved(pc){ // defined by proto_sparkly_rock
	if (pc){
		pc.runDropTable('cult_remove_sparkly_rock', this);
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
	"proto",
	"no_trade"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-78,"y":-126,"w":155,"h":130},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAHeElEQVR42u2YWWxcdxnFG0pLKSUO\nlVpaRNUihFBBVQSCigqJ8hLoCyEICYUH2geQEBQUEAE1FAhFSVsiqiQgRbgscRJIqBPXje04sR2v\n433G9iwez77v653N4xlvh\/P95zriCaXYOK2UkY6v59qZ+\/ufb43vuOP26\/brXf4C8GR9Fd+SK\/UE\n9eA7Bi6lVXZXl9e91WWgtIRcrrIymynVj8Wz5cffCc7tzJZXr5VqQG2lIQXK9+nKWmncnv7MLQWM\n5qo\/LdYaUMurwNo6wFCr92XeD6SrWp\/J13RL4PpM+aYJR6LgSxRRWFxGjYTLq2uoknCxvo5seQXZ\nUh1D1vDpWwLYPxc8bg9mYPGnEUwWkNQWUajUkGMiRrNlhFJFTDnj6DRYtO13z5dvMsxHtTF7DHO+\nFDxRDb5EAYFkEb54Ae5oHvPBLC4bbGi9bsK\/+oxf387CeC6QLJwOpMqI5WuwRwqwBTKw0U17KKsc\ntfL9rDeFjtF5XBqYxVsj1u0LM3OsvVJbQ64KpewiEM4vI5qvI5iuwBktKjizL42uMTv+eXVCpLX2\nmbanWGK5xfYpZwLh7BLixQaoRqXLa3AQzh7WYA5kYfIk0Wd04ULvlNKZTsPhbQGMZCua0Z1ULsVz\nFViZayZvGmP2KIYsQQxbQxixhVWBTC6E0TVuV3l49sqYxvS4i7rn\/wZnsEV3O2Il5lsWAVapFMXo\nfEQBiUYJKYAiKZ7+Gbdyr63fhC6DGYls6TkCfpPaQ71\/ywGd8fIBZ6zM8DHHpL0QcsweUWBjCzHl\noMjkTmAhnIPRFUfbgAmDMy7YfHGE00Wsrq0hrVVOEnDrR2FUWzlu9jcq1sJKlX43TsCN0E4yrI5I\nDh62GidbjStWRP\/0AuZ9MTbwFaQLi0jlF+EOpzEy553pMoQ+tKWA8+HC4DTzz8IiWIhosARzKhcl\nvBOOGEdbkZVcho+hd8cavdEeSCCjlVGpLaNcrSOczMNo96N3ch5nu8ePbxmcP1XfbQtpqgF7+HAr\nIW2hPDwcdSN0L0i4VLGKEgdxhlcvXQylS5wwVTUGVzgGy9Ua\/LEMTI4gLg\/PquL5x5WxR7cEMJhb\nPj3hiCvHrAyx5Jg7VoCXgKIct4PCYh1pwkVk1BGuskTX2DPrBBQHYxlNhXvM4sXF60bVI892bZGL\nHG1qSoh7Imckr\/LMzzkcFKcKVQW54WCIjhb5vSwSG\/fs\/jhGzW68NTSjqlsAL\/RMDm4absAaeXqW\njVd6mzeex5wnARMr1M9ck4IIEzCarSDKvhjKlJDg4iB5GGdBSCuK8J4AT9qD6Biek56o1NJpQEvH\nyOaXCZM7csDkjEBkdIR5jcLmTyFFEKnkhFZRoRWwFJ2UBq5xs5FCkapeCLGYOPr6TB4FdQNO17lO\nw+5NAXoimdP2QBKOYAr+RA7+eA6BRJ77Xk2FsLy0qlRaWmGY60jQuawA8yqAMnkkfyVNznWP3xh\/\nG05yDB7YFKArnH3Z4o3DGUojnCoQbInr\/braolfXG5v0Kr\/ky0sIJTXlnkgauYu5OuVKsJnHMGyL\nom3QrKBky2kfNqs8pIvtmwKcdkReMLlicEeyKPLB7BiorzS2Z1FxsYYMm3CI8B7+joRe5I03iqnh\nHieNLYZrRl+jegkpV4FkHgY2BdgzEzhsdCXVliyuxFgQCeZZmvmWZ+VK4Vi8Ujgx5luGRVFWi6tM\nGzvzTxbbEbo3aI2idzaI8z3TG2vYhoPgY2SqvPd\/4btz1h2\/LG7MsJKHrBHueinMsR+qAmA\/lAW1\ne9KFdoNdjTsn78u6Nc3QCpysZ30zfgxYorhmCqC1f7ZRHMzHU2\/04Nhf2\/Cd7x\/8Gp9179sBk9Ps\nop7onvKWZrggyDgbIaCEbJzLgcBI454kwJVJN1oHbRi2hFVRzPC+XMU5OdSbw1b0myPonvYruD+d\n78Yrza04cupC6eBLr\/2Wz5FKfuRmXXwf9WHq8T179+\/tmPBiwBxWDxJI+V4gBXp8Ia5cujrtRdeE\nW201UhDi3rAtgkECX6G7b1yfwVUj3RswK9cE7vCJM54vP7Pvu3zOF3W4XbqL\/xVyhw74gABSX\/jV\nseaj7UOzic4x\/h9j0IK2IQt7mk89XEAlnL0mv3JLJGByGDmIwEkoz3SN4hzz7c+tfXj19Yv42e9O\n9vGzv0o9SX2ceoi6n7qPuvtmwnuvfqKHqU9RTz37w4O\/Pnzib71HT533NV\/qp2Mu9M+FuHLFFGyP\n0ctc5CgzzKuQXhyYw1\/eHEDzpevKtd+\/frHy\/IuvduzZt\/8QP+8Z6mnqMeojuiFNN+PgjeKgZD3\/\noH6yh\/STCuznH37ksX0\/OnTktb9fHk5KVYpLG5NBgE6c7VRh\/OWxZtv+7x04+ZVvfPsF3bGn9Hz7\nJPWonkr368+RyL3n7VbxDt1yOdlO\/cMe1E\/9CeqzP37x5Zd+fvSPpw8eOdnyk9\/8oeX5Q6+0\/OAX\nR45\/7kt79vLnn9ZhPkZ9VD\/oA3pbkc+T1f+urdxbd+ghuFv\/8A\/op9+ph2jXf6hJv3+f\/nv36P\/u\nztt\/tLz9eje9\/g3GFpFrlmfRnwAAAABJRU5ErkJggg==",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/proto_sparkly_rock-1333485702.swf",
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
	"proto",
	"no_trade"
];
itemDef.keys_in_location = {
	"u"	: "build_tower",
	"e"	: "remove",
	"t"	: "restore"
};
itemDef.keys_in_pack = {};

log.info("proto_sparkly_rock.js LOADED");

// generated ok 2012-09-17 11:45:56 by martlume
