
function routingGetItems(){

	var out = {};

	for (var i in this.items){

		var it = this.items[i];
		var key = it.getRoutingClass();

		if (key) out[key] = intval(out[key]) + 1;
	}

	if (out['npc_fox_ranger']) out['npc_fox'] = out['npc_fox_ranger'];
	if (out['wood_tree_enchanted']) out['wood_tree'] = out['wood_tree_enchanted'];

	return out;
}
