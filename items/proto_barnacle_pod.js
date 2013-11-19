//#include include/jobs.js, include/cultivation.js

var label = "Barnacle Pod";
var version = "1347907556";
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
var base_cost = 300;
var input_for = [];
var parent_classes = ["proto_barnacle_pod", "proto"];
var has_instance_props = false;

var classProps = {
	"item_class"	: "barnacle_pod",	// defined by proto (overridden by proto_barnacle_pod)
	"job_class_id"	: "job_cult_barnacle_pod_2",	// defined by proto (overridden by proto_barnacle_pod)
	"width"	: "226",	// defined by proto (overridden by proto_barnacle_pod)
	"placement_set"	: "all"	// defined by proto (overridden by proto_barnacle_pod)
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

function onRemoved(pc){ // defined by proto_barnacle_pod
	if (pc){
		pc.runDropTable('cult_remove_barnacle_pod', this);
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
		'position': {"x":-74,"y":-183,"w":162,"h":177},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAKg0lEQVR42s2YWVBb5xXH\/ZBJJmYR\nO4h9B4GEkAQIIYE2tKGdRewIMIvZ930Rmw3B2Nh4iaEQknqNk5a4naRt0paHPHSm0xnnLX3oDI99\n5CEPffz3fBfb43E7TlKTxnfmzP3u1YXvd8\/2P9KZMz\/xUSDJFstzcwbOvKmHQiJSK2RiMNA3ErBI\nIkhQ5ueCgcpkybw3EtKmEfrkUtGmPFfkLJTm+OwGrbpMp0t4YwC7qrMPCQxySc4TRZ740G0qcuqV\n4sOfPeylpaW8ijL9gcemQnulCPqiXLCCMStjvNXGJPEbUyQ6ZQGK87NRYUjHcJPQp5VEiCtKEw5\/\nVjCHUeNzGjUHemWB16qWgIXYrU0St7vTDke9widObTxO1YsvV6DdpHUW5eUy8\/2357vtic4uayaW\nXDGYMkdg2RqJfmMs6g0J6K3JQp0p8dhaEntcYYh\/3iNtRq34B7UFrneRsfWz+yx3CnNzvM+uPQ6j\n16pTQJWf+x9NeNYROeCzRWLdxcfVymgssnU5H1VaEdrcGRhsyIZLm4n2iozDc+50L8tJu1akdpv1\n3h\/kLdYKWO9S5kmOnnmOwanyJccvVp5RFSN+0QPsOHy86fvykzX88eAyvni4hl9ujeByYxbW3XxM\n2JJgLRHBbciFuUSI9vIMtJGxvGQF5TbrjnRFBT51oezwe9XnGdCzBxkYg6Z+dvDic5biWLVbF39U\nbUo8uLnWsX9\/Zx6P763jwe4CDu6s4N72DFaGKrHqjMIFJx9L9igM6cNQrwiHoSCFgJM3vY60Jy2u\ntEOrJnufOefFyH1\/D\/NkesdaRGpm9TbRocecw4WI5RGzEa\/wmH1mK4nB7rUR7G1N4evf7+Lx\/Q3s\nbo1h7+ooLi92YkgXhkXKw2E6n1MEw1sYBLc4AIZMf\/VrFUdHVTKvyZF91OzKOmJvWWdJHrBrY9XM\n6stSOcjRZuFhgyUDd3fmcOf2HH7zYANbqz24snwe11d7OcCeklD0qkPRR9amDEGDPAj2nADYRa8J\nyKq10mY4ZmezKtpnL4nbd2riDg0K\/matOYVL+o4KATpsYoLqxYc3J3H78hAWxhpw7UIP1ufbMN5d\niX51GCYM4Wgmz9Xk8VCeGwibKABbfX3vvJ6OUum\/rJuOglBvaaEQ5uIslKmFpBBSNCujsDxWi9kh\nssEazA\/XYXnSC99oA0rzEjFjisCANgwNBUFoJO+5yHvlucH\/PPUGXJcX5GwiL\/Sow+FV8dGmjsGY\nIQIdymB0UZhnCG6GINl5ss8Dj6UAlZJANOQH4VxRMBoJsErGgyU7AI6c4AenClctCRJ7C4KO+ymP\nWCWOUchmLBHwUfKzxHeJA9FYFAmHPBYacTSUAqrWvCAMaMLQJA+GMycQ1mx\/WIQBMAr8UZkb7TxV\nwNo83tGwMQYXG6VYrBJgvDSca8ILZZEYJ1gzbV5GxsJYLeU9zzUPratlQbA9BaPKhUEQ+JdThVtu\n0\/g+25vGnw6u4Lf3L+Lj3XksegvxHqnFBqnEJbJ2CqE+3Y8A\/GAlGAvBOshrrFoNAj9o00\/MKgr7\ntkcnOb158KtHa7zffbJx\/GhvCXvXxvDpR8u4+\/4UtZBuTBrDseaK4mRtjDx6jkJpyvCDLs0PGjId\nAekzTsA0aWdhyQr86xevW7kvH7\/6YGHi9sYwvvrsBr48uIHtzRHsUgO+sdaHRl0KfJSHG+4orNgj\nqd+FoJ4KwkKhZIVgyPKHjkKqJa9aaF0uCcCpV+5NX8uTe9vz+PTDVZKwRSyON3BwrAFXqpKwWRGN\nraoYXKUzgx3QhqJVEYIayr1aORVTgwoz7UYs9Vgx16qBMdvv9MaslfKihOlWHT66NYMHv1ggORvF\n+kIHLvnasTLVDIuUj1kapy6Q1i5YIzg5m6awj1CV92lCcWmqHvskeY\/2fHh89wI+f7iK1fHa9VMD\nbFZEdHaY0rBFHrtGSrEy5cV7BLc43ojeVgcpQzB8VMUMktkUwU1RU2ZtaMCZhasrXdgmZdml3P3o\n5jS+\/PUW7u3M\/+v0ep805EGnKgSjTRoOiikDa8QDHS7oRJHkMZpSaEJh08oKtZwLDpaLUZinUM81\nKjipY3p8fa0HH+8t4vNHm\/ji0010tdg7TgXQIw359jwBdpLAnysT0aAphFWZwVVlLw0AzHvMlgmK\n9cNp00njnrPQukGOpQkv1snjF+dasH99Encplz+8Pg2bsXD5VAArSKYaqXU0kX4yayXFGNZTjumY\n+EdghoWWvDVfdgI1RHrLICdYmF3ZmB6oIcgm+Gh4WJ1tpnFsjOsCuoK0\/deGaymMlNtp4mAS5qBz\ntSwQ51WhnJ4yWKat3dwYFYZ+AmPjVAd5mnm8hV6khT7v9Zox2V+N+ZF6bCydx8h5N8Z7qpCX+O6f\n2R4bPZKED6YU6s9X\/ocv8h5phMmczWa2AE7CWEF0P53rmGp0FZ\/AsVmvj\/SWeZdZP63ZWMWmlxYa\nZNuqtRjtquCGh9GucsjSwmEU8nBnuEC8MyTH9mABZmoEP74\/mgS8CaYE2owT6aJJ5jmElzxYS1PJ\n+eIQDBLIIIWcTSyk1xxY91Nvusn7TJuLs8Ogyo6CLNEfmvQAmHKjMV8txlK9GFcahfQVgH\/0Spg7\ncyrxzpjiYG+i6MneaKHv0YSMVyUNe6BIOgstSZaZKQLBMm\/ahP40zwVyEwozjzQQNTI2EPC4geBZ\n+D10bSJFsdLz+gymKIGw5IShShGPOU8OlquF6DMmoccuQEuZ4Liq9BU\/Lj1ctg1sDxfjRr8S3fZM\n3GrPQ5M6FmqSqZLUsyhOJakSR5BkBRLoWZi4QeAk9AZO1vxpmuHBKQlGsyYKFaQi7DM2vRizAmDO\niUCnKQM3Owqx1SJDX2kCevTxnI27aSI3pb7ag32GWLWvPA2dmjj00h\/PudKwUJmJMZcQXeZkNGvp\nG5gsDmoKkyotiEB5UJNHSzMpXMJg2MShqC1OxN5YEfYnlXifcqtVn4LBsnRcayvETncRZl2Z6NLG\nY8CQiG5dPLdmgNMNMtTpU1kOvvVKyGtNWZh1pKBRGYOW4hj0G+IxYU3ibL2OVKFZgrVGGRZrJBhx\nijBCoZkuz8J0lYReIoPz0OW2PCzQi1YXROFSeyGWPULOW8+hdHFo18RyYP2GBJwrifmDJjPEJ0kI\nULwS8KtHHbzlJikmafMmTQImypIw50zBjD0Zi+5ULNGm7NpHa3aPGQMfp+dGLYncmt0bd2XgYqcS\no7VStKjj0EovynmK4Fhkekvj0aGJ+4dFFLqVyX+3nLYO+EEVuz1RypupFaPNkIK64ng0KPjcGzKA\nSWsyxixJHDRbT9mSMUuwo+ZE8kwC9xxbM6+w++P0OUsVj5xPXwGi0aTk7Lt6RfTXjYqYi7RdEpnf\nj+0qb+kEPGlZTlhtUWqAolQQbNULgmu8qpjlbl3c9RlnyiFt\/jcC\/WaYYNpLYjHjSMYkwaxUpmHV\nk47F8lRc71Xh1qgeg+VCuPP5VDQR3+kEobfo\/0c\/tXfO\/ITH22RBTzcKL0oJctbII6c8+ZE7lEvf\ndOli\/95vPAkjXUOZHnSFH\/B2Jj0b\/P\/++e+tl87P71MTDmstiXa4paE6uha+7kb\/BhT5e0eTDxAj\nAAAAAElFTkSuQmCC",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/proto_barnacle_pod-1333485481.swf",
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

log.info("proto_barnacle_pod.js LOADED");

// generated ok 2012-09-17 11:45:56 by martlume
