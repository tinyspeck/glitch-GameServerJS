var label = "Notice Board";
var version = "1309568906";
var name_single = "Notice Board";
var name_plural = "Notice Boards";
var article = "a";
var description = "A notice board. You can post notes on it yourself, or read notes someone else has posted. Take a gander at it and see if you can find anything interesting — reading builds character!";
var is_hidden = false;
var has_info = true;
var has_infopage = false;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 0;
var input_for = [];
var parent_classes = ["bag_notice_board"];
var has_instance_props = false;

var classProps = {
};

var instancePropsDef = {};

var verbs = {};

verbs.view = { // defined by bag_notice_board
	"name"				: "view",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 50,
	"tooltip"			: "Read or take notes from the notice board",
	"is_drop_target"		: false,
	"handler"			: function(pc, msg, suppress_activity){

		// Assemble and send the view msg.

		var msg = {
			type : 'notice_board_start',
			itemstack_tsid: this.tsid
		}

		pc.apiSendMsg(msg);

		// broadcast the current contents of the notice board
		this.updateStatus(pc);

		return true;
	}
};

verbs.add_note = { // defined by bag_notice_board
	"name"				: "add a note",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: true,
	"include_target_items_from_location"		: false,
	"is_single"			: 1,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 50,
	"tooltip"			: "Add a note to this notice board",
	"is_drop_target"		: true,
	"drop_many"			: false,
	"drop_tip"			: "Add the note to the notice board.",
	"drop_ok_code"			: function(stack, pc){

		if(stack.class_tsid == "note") {
			return true;
		} else {
			return false;
		}
	},
	"conditions"			: function(pc, drop_stack){

		if (this.isBagFull()) {
			return {state : 'disabled', reason : "The notice board is full."};
		}

		var items = pc.apiGetAllItems();

		for (var i in items){
			var it = items[i];
			if (it.class_tsid == 'note') {
				return {state:'enabled'};
			}
		}

		return {state : 'disabled', reason : "You have no notes to add."};
	},
	"requires_target_item_count"	: false,
	"choices_are_stacks"	: true,
	"valid_items"		: function(pc){

		var items = pc.apiGetAllItems();
		var choices = [];

		for (var i in items){
			var it = items[i];
			if (it.class_tsid == 'note') {
				choices.push(it.tsid);
			}
		}

		if (choices.length){
			return {
				'ok' : 1,
				'choices' : choices,
			};
		} else {
			pc.sendActivity("You have no notes to post!");
			return {
				'ok' : 0,
				'txt' : "You have no notes to post!",
			};
		}
	},
	"handler"			: function(pc, msg, suppress_activity){

		return this.addNote(pc, msg);
	}
};

function addNote(pc, msg){ // defined by bag_notice_board
	if(this.isBagFull()) {
		// notice board is full!
		pc.sendActivity("The notice board is already full! You'll have to remove a note before you can add another.", 3000, pc);
		return false;
	}

	var stack = pc.removeItemStackTsid(msg.target_itemstack_tsid, 1);
	if(!stack) {
		return false;
	}

	if(this.addItemStack(stack, null, pc) == 0) {
		// Update the board.
		this.updateStatus(pc);	
		return true;
	} else {
		// Failed to add to notice board. Give back to PC and report error.
		pc.addItemStack(stack, null, pc);
		return false;
	}
}

function canContain(stack){ // defined by bag_notice_board
	return true;
}

function onCreate(){ // defined by bag_notice_board
	this.capacity = 10;
}

function readNote(pc, msg){ // defined by bag_notice_board
	var note = apiFindObject(msg.note_itemstack_tsid);

	if(note) {
		note.readNote(pc);
		return true;
	} else {
		return false;
	}
}

function takeNote(pc, msg){ // defined by bag_notice_board
	/* remove note */
	var note = this.removeItemStackTsid(msg.note_itemstack_tsid);

	if (note) {
		/* give the note to the player! */
		if(pc.addItemStack(note) > 0) {
			pc.sendActivity("You don't have enough space in your inventory to take the note.");
		}
		this.updateStatus(pc);
		return true;
	} else {
		// error, attempt to remove non-existent note.
		return false;
	}
}

function updateStatus(pc){ // defined by bag_notice_board
	var msg = {
	   type: "notice_board_status",
	   itemstack_tsid: this.tsid,  //tsid of the notice board
	   max_notes: 10,  //how many notes can this board hold
	   notes: {}, // notes to view
	};

	var contents = this.getAllContents();

	// assemble note list.
	for (var i in contents) {
		var it = contents[i];
		var editor = apiFindObject(it.last_editor);
		var body = it.contents.substring(0,200);

		if(editor) {
			msg.notes[it.tsid] = {
				title : it.title,
				body : it.contents,
				updated : it.last_edited,
				can_take : true,
				pc : {	tsid : it.last_editor,
					label : editor.label }
			};
		} else {
			msg.notes[it.tsid] = {
				title : it.title,
				body : it.contents,
				updated : it.last_edited,
				can_take : true
			};
		}
	}

	pc.apiSendLocMsg(msg);

	/* finally update the image */

	var newState = "m"+ this.countContents();

	this.setAndBroadcastState(newState);
}

function getDescExtras(pc){
	var out = [];
	return out;
}

var tags = [
	"no_trade"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-105,"y":-149,"w":210,"h":150},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAJr0lEQVR42u1YaVMc1xXlfySp5Fv8\nIVWJq2TZYpmdfRNoRUtcqgiJZQZmYABJIIQlswyz9iw9G8MggdYYhGVtUVSZOGWnkpQTfYj+z805\ntxvkKPkBdhVddat7uvu9d945d+upqzs4Do6D40d+vN4MPP7btr\/2jy8n5fv2r+dzOF+Tf7+al+++\nmlXjNe2fTwK1bx+O1ni2LFj77unV2t+\/vFL7+uHUf9nzSlDt\/fsc85f7wzqe6\/P6VfVy7eXaoD1n\nuPbX3bnHdU8LAxIZc8nnlxtlecQpi0NNOLvUYkG3xMaaJDPlkbvLXXJvuVseRHrl\/kqPPFw9KqVr\nbVKZb5fybLtsfNYlm7e65VG0T34f65etxR7Jz7TJ2lyHFK62SW6qBb\/bxZxuExP3M+FmSU\/6ZONm\np9xd6sbcPXJvpVevH6z2ydP8Gfn6UahW93LtLMA0yOqwQyJDjbICoLFRjyQDPkn4PRK5VC\/xUaek\nJ3wSuVwv0eEGPWeCXjHG3XjWJKmAE+87JTvhlQR+793LBH04e8QY80oUc69ewlhYwu\/CeiACcy\/B\nbl44bK2Pe8RAe1Y8ZwH8InlKjAmPvsCXo2AxM96CCTHgEiYd4oROBVOcapM02M5PtEgm5JU07iX9\nDjFDHimDlfJ0qwKLYRP6jKDxnhlukdJUhxh+N8wGPOIAGQ0KZvHiEZDilAQ2szR4REl6VrABPi+d\nBdVeiWFXBEegK4MNWNgj6QAmGm7EhATiFBMs5mEpPxf2SA6M8ZwZc0oBcq0BpKHMuQHQBbAOvOOT\nImTNBSEp2QTI+AgYHvNI3O9UJt8p51QcxLCdOi1\/ug+AOwYZ9OkLfMAB8WFINopFsFOyQPZUMiyq\nFnBJliAAjCBzQZcUAbCA65S\/Se+VwGYRfkfAOpbgRl2SwBqpgBvrEJADrLkA1LUv8R4OAqyunH6h\nAE1IR+R8GMVLCUy0AqozIZ8yR4B5ODWZK061ApAX52bJgb1C2CclmBl0Sj4E8GMOvcdnNBNgOTYJ\ndUrhDlUlHeTGXdZamHMFrhWD5Mlx776r7RgDlsRPzAGJB5r2g4S7yk406wQJ+FdspFEZ2JjrkRQk\niGPnGUienyRLLQpm\/UqrlMNeqcy0wA9bwKxD1q4gUoNk2oXrdmVvdbAeQF3qMsa4R\/3bgNQxACXA\nCAiiDxLHPkD6YDZsOa21I5fuKg6gmaBHnZ1nSmoEKLEHvtYOg4QAR6teBcApsDrhluq1djDdAOAW\ny9wIWcyMWRLnQ63wWx9Y9Og6uRDI4Jr0vxHHPlHbxmkL4Kv1c8hPreq0lFSjc8wGFfKqUSICpE8x\nGPKw0hSYu8rIbZbbyINV5MQigBQmPfqMTJYxLxk0kSVMzJfDvDnIyE3mJpuVxRQDEMYA4e9kgOx6\n5YvkaXm9ZQPMYRFGVhovMI0YkNZQH2mw0ggXBsjNG0dl\/RoSL1jZmOsEe15Zw9i1GTAJYPmQG2A7\n9D7BV3FdwZks5qBEZbpd0poNmtVtqBIBkskkpaYfgk2C3DFsgPRB5kECTIw6NJXkgm5lycQuS0gR\njEj+pr\/lJym30wIA1sjevYVuAIXU8DsCJtjCpFvZrOAexxWgxBqC0Rzn+D3XgUJYj764Sv8HBqY1\nAn0MH9wHGAk49CYdlv5BKQl0\/WonQEJO5Lds0G37k9uWt1XuLvTI1nyXPLzVK48+79Nr+mI+5ITE\nGGfLbYLZLJTJAVhxkm4C1q90wP98KivXZnBSZqa5JFLSjnHSAvh647zEmFShO19aGvxEfTAFaa3A\nsPJfYqQecrVrUNxd6JXbqLF3rqOO3kANvt6htjXfCZa8CpRSV8DmBoJmHSyWkZ5M+jPkNe30Qybp\nb+mgT4MzC\/AMVqaZ3fQJebVpA1wcsvIfX6Y\/xIbq1RcJsMDACFs5j0yUsOi9z47K5ny3AqTEtyE1\nwd2ebVOpS2GPMkmgBYwpY1PMj1nISha5Ya1IqNkRlDv6YnLMyosEGEe1eWraDLIWr9jOSjMYJAGX\nXTksX6S0rLP0pTJy3cYsGeuSrRsACSYf3OyTMuS8A7YqCBiCpgvwvcoMU1Azqgz8MEg\/bLfLoFNz\nLBsLkkIGNZqR0Cn1s\/wpC+Cj+EkABINsCtiFaJ3FZJBE08u4S4MmjRLGvMaUQRY35wmwR\/3tzvVu\nLO4GwA71PYKuIHkzkHIIKCuZI7oh5fpMpxUgkJuphgVh+dIRq8Nhx2Pbs8Ip+fMDuxav+NkeubSs\nxZFaGE28Lky3qiQFu86SSS6WHUdZs4OlDKsSGDZT1Y7Gp9FNgEwzfDcDYx4sMgf6LWXWZ3tAAlIQ\nyyxkTTNhI0gpOSsLe0IFyCheGrZqIfMgC7klt0stCfBpjUArF5JBLsr0UdZS50V66VD\/XIO\/Ms0Q\nPFMMu5s8qwhUKCA4DGw8CxAmNwpXMblZSM9+0wgy3TRZUYx3tpb65KvK4B8VIBmkY9JJtcPgLiHB\nXuOZ4MRol3TiqWatDtXZTu1icmgQ8nberEy3WcwCZIl+N8k+kCkK6QluY+VYyIyxRQBk10OJ33U1\nbm1altHUPkJXPjfUtKtBsjxq9WJsINmjkU2yqD7id6jc0csAD6Y5qRFoUpCUzvA3AqBHu5xSuEWD\nic9Y5sh6FVKWZzoQsaj18LW43V\/mJqwazMRMYtgksB+NaKfdIE9yJ2XmQsOuBkkS8rDVWrz4yT6L\nzO5Ww+BVNktYRMFiM+wDi5R3r+Wa8Gleq1xpV39kKSTIbMitwMkcWUxgbtZhAouPUjGrxJG9yNC7\nxvXW7z5GkAxIaaEzqgCNCRsgdpHSXGh1NGSRXYcGDBbSyAar67NdWmEM5DYCJFhKrG2\/SotOBv5a\nmrEaVo4phFsVXCHcpv1l1G5YuR6BkTV2Mmz\/ieVF6bzcj\/TfqLsXOS5pOOteq81EmZ\/uUJDLqCra\nbQSs1GNOtmgLz06HAJmGmMjZ4htglfmNTQFTEwGTQeZVfkyZ+I5ha5Xid4nNGiuIpZz1TcKGlVLz\n+kX5vLysDlbrtpaPv9lc6pHqQhc+AbuBuheF+gS+qs7Kc3xZPcmdQfs9II\/TA\/h9HgPPyUsO\/p79\nYe23sps6ITuJY7LNz87oUdmO98tO8hg+I4\/i07QLn5+o0wiODazDT9aH0WP4zDwmm4v9ZEq2lnEv\ndgL3+uVB9Li83vjUSjNHfvPT5Ee\/+kmN9mnvr98Ezh1+G75Y\/3b0zEdvL\/R++D\/GZ+9bj++X37g+\n\/kWt4cOf6TxNh35eGz5z6M3773HO\/zd+79meDZ08pGtNXXRf458Lx2HBH6h1E+AHsMM\/UPvg4M+p\ng+Pg+LEf\/wElKWv8pb\/ifQAAAABJRU5ErkJggg==",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2011-05\/bag_notice_board-1304632544.swf",
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
	"no_trade"
];
itemDef.keys_in_location = {
	"n"	: "add_note",
	"v"	: "view"
};
itemDef.keys_in_pack = {};

log.info("bag_notice_board.js LOADED");

// generated ok 2011-07-01 18:08:26 by martlume
