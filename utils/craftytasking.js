var CRAFTYTASKING_OUPUT_TIMING_DATA = true;

function craftytasking_test(){
	var all_specs = apiFindItemPrototype('catalog_craftytasking').craftytasking_specs;
	log.info('CRAFTY -- all_specs: '+all_specs['sammich']);
}

function craftytasking_categories(){
	return {'data': {'tool': 'Tools', 
		'food': 'Food', 
		'drink': 'Drink', 
		'resources': 'Resources', 
		'gasses_bubble': 'Gasses & Bubbles', 
		'spice': 'Spices', 
		'compounds_powder': 'Alchemical Compounds & Powders', 
		'tinctures_potion': 'Tinctures & Potions', 
		'croppery_gardening': 'Croppery & Gardening Supplies', 
		'herbalism': 'Herbalism Supplies', 
		'herdkeeping': 'Herdkeeping Supplies', 
		'other': 'Other'}};
}

function craftytasking_category_items(crafty_bot, category){
	
	var cache_data = null;
	if (crafty_bot){
		crafty_data = craftytasking_build_cache(crafty_bot.getIngredientSource());		
	}
	
	var items = [];
	
	//
	// Get tags
	//
	var tags = apiFindItemPrototype('catalog_tags');

	var full_tags = {};
	var spec = null;
	var ingredients = {};
	var missing_ingredients = {};
	var tools = {};
	var missing_tools = {};
	for (var i in tags.item_tags[category]){
		ingredients = {};
		missing_ingredients = {};
		tools = {};
		missing_tools = {};
		
		// Removing for optimization tests
//		spec = craftytasking_get_build_spec(crafty_bot, tags.item_tags[category][i], 1, false);
		
/*		for (var j in spec.required_ingredients){
			if (cache_data.container_items[j] >= spec.required_ingredients[j]){
				ingredients[j] = spec.required_ingredients[j];
			}else{
				missing_ingredients[j] = spec.required_ingredients[j];
			}
		}
		for (var j in spec.required_tools){
			if (cache_data.container_items[j]){
				tools[j] = spec.required_tools[j];
			}else{
				missing_tools[j] = spec.required_tools[j].tool_wear;
			}
		}*/
		items.push({
			class_id: tags.item_tags[category][i],
			ingredients:ingredients,
			missing_ingredients:missing_ingredients,
			tools:tools,
			missing_tools:missing_tools
		});
	};

	return items;
}

/*
function craftytasking_category_items(category){
	var tags = apiFindItemPrototype('catalog_tags');
	
	var full_tags = {};
	for (var i in tags.item_tags[category]){
		full_tags[tags.item_tags[category][i]] = apiFindItemPrototype(tags.item_tags[category][i]).name_single;
	};

	return {'data':full_tags};
}
*/

function craftytasking_get_static_build_spec(class_tsid)
{
	return apiFindItemPrototype('catalog_craftytasking')['craftytasking_specs'][class_tsid];
}


function craftytasking_get_build_spec(crafty_bot, class_tsid, req_count, use_current_ingredients){
	//
	// Make recursive call with recursing parameters
	//
	
	var craftytasking_timing_build_spec_start = getTime();
	
	if (!req_count) req_count = 1;
	
//	log.info('CRAFTY -- craftytasking_get_build_spec: '+crafty_bot+' -- '+class_tsid+' x'+req_count);
	var container = null;

	if (crafty_bot){
		if (crafty_bot.isInLocation()){
			container = crafty_bot.getLocation();
		}else{
			container = crafty_bot.getContainer();		
		}
	}
	var cache_data = this.craftytasking_build_cache(container);		

	var ret = this.craftytasking_get_build_spec_with_cache(crafty_bot, class_tsid, req_count, use_current_ingredients, cache_data);
	
//	if (this.CRAFTYTASKING_OUPUT_TIMING_DATA) log.info('CRAFTYTASKING TIMING -- craftytasking_get_build_spec --'+(getTime() - craftytasking_timing_build_spec_start+'ms'));

	return ret;
}

function craftytasking_get_build_spec_with_cache(crafty_bot, class_tsid, req_count, use_current_ingredients, cache_data){
	apiResetThreadCPUClock();
	var ret = this.craftytasking_get_build_spec_recurs(crafty_bot, class_tsid, req_count, use_current_ingredients, {}, {}, {}, 0, cache_data);
  	apiResetThreadCPUClock("crafty_bot");
	return ret;
}

function craftytasking_get_build_spec_recurs(crafty_bot, class_tsid, req_count, use_current_ingredients, claimed_ingredients, required_elements, crafting_items, deep, cache_data){
	
	var pc = null;
	
	use_current_ingredients = false;

	// Verify it's a valid item
	try {
		var prot = apiFindItemPrototype(class_tsid);
	} catch(e) {
		return null;
	}

	if (!prot) return null;
	
	// Check if we've already worked down this chain
	if (crafting_items[class_tsid]){
		log.info('CRAFTYBOT '+crafty_bot+' recursivly called for '+class_tsid);
		return null;
	}else{
		crafting_items[class_tsid] = 1;
	}
	
	if (cache_data['container'] && use_current_ingredients && deep != 0){
		if (!claimed_ingredients) claimed_ingredients = {};
		if (!claimed_ingredients[class_tsid]) claimed_ingredients[class_tsid] = 0;
		
		if (class_tsid == 'firefly'){
			//
			// Since firefly is not an actual item, we need to count and claim the number of fireflys in jars
			//
			var firefly_jars = cache_data['container'].find_items('firefly_jar');
			if (firefly_jars && firefly_jars[0]){
				var diff_required = req_count - (firefly_jars[0].getInstanceProp('num_flies') -  claimed_ingredients[class_tsid]);
				claimed_ingredients[class_tsid] += req_count + diff_required;
			}

		}else if (cache_data['container_items'][class_tsid] > claimed_ingredients[class_tsid]){
			//
			// We have this item in our inventory and it has yet to be fully claimed
			//
			var diff_required = req_count - (cache_data['container_items'][class_tsid] - claimed_ingredients[class_tsid]);
			claimed_ingredients[class_tsid] += req_count + diff_required;

		}else{
			//
			// We dont have this item in our inventory, so we need to make all of it
			//
			var diff_required = req_count;
		}
	}else{	
		//
		// We are not using any items from our inventory (or this is initial the item requested)
		//
		var diff_required = req_count;
	}
	
	//
	// Setup base spec data
	//
	var spec = {};
	spec['class_tsid'] = class_tsid;
	spec['count'] = Math.ceil(req_count);
	spec['energy_cost'] = 0;
	spec['total_energy_cost'] = 0;
	spec['fuel_cost'] = 0;
	spec['total_fuel_cost'] = 0;
	spec['wait_ms'] = 0;
	spec['required_ingredients'] = {};
	spec['required_machines'] = {};
	spec['required_tools'] = {};
	
	if (diff_required > 0){
		//
		// We need to create at least one
		//
/*		if (class_tsid == 'element_green' || 
			class_tsid == 'element_red' ||
			class_tsid == 'element_blue' ||
			class_tsid == 'element_shiny'){
*/
		if (false){
			//
			// We are requesting an element, which are created in their own process, so cache the requirements here
			//
			if (!required_elements[class_tsid]) required_elements[class_tsid] = 0;
			required_elements[class_tsid] += intval(diff_required);

		}else{
//			for (var i in cache_data['recipe_cache']){
//				log.info('CRAFTY -- CACHE '+i+' -- '+cache_data['recipe_cache'][i]);
//			}


			var recipe = null;
			if (class_tsid != 'firefly'){
				recipe = {};
				recipe[class_tsid] = cache_data['recipe_cache'][class_tsid];
				if (recipe[class_tsid]){
					recipe[class_tsid]['tool_ms'] = recipe[class_tsid]['wait_ms'] * diff_required;
					recipe[class_tsid]['energy_cost'] = recipe[class_tsid]['energy_cost'] * diff_required;
					recipe[class_tsid]['tool_wear'] = 1 * diff_required;
				}else{
					recipe = null;
				}
			}

			// Change tool_ms for duration specific ingredients
			if (class_tsid == 'barnacle_talc'){
				if (diff_required > 10) recipe[class_tsid]['tool_ms'] += (diff_required - 10) * 100;
			}else if (class_tsid == 'plain_metal'){
				if (diff_required >= 1) recipe[class_tsid]['tool_ms'] += 2000;
				if (diff_required >= 2) recipe[class_tsid]['tool_ms'] += 1600;
				if (diff_required >= 3) recipe[class_tsid]['tool_ms'] += 1200;
				if (diff_required >= 4) recipe[class_tsid]['tool_ms'] += 800;
				if (diff_required >= 5) recipe[class_tsid]['tool_ms'] += 400;
				if (diff_required > 5) recipe[class_tsid]['tool_ms'] += ((diff_required - 5) * 400);
			}else if (class_tsid == 'thread'){
				if (diff_required > 10) recipe[class_tsid]['tool_ms'] += (diff_required-10) * 100;
			}

			//
			// Check if we have a usable recipe and if so prepare to use it
			//
			if (recipe && recipe[class_tsid]){
				spec['recipe_id'] = recipe[class_tsid]['id'];

				if (recipe[class_tsid]['skills']) {
					spec['required_skills'] = recipe[class_tsid]['skills'];
				}

				if (recipe[class_tsid]['tool']) {
					if (recipe[class_tsid]['tool'] == 'self'){
						spec['tool'] = {};
						spec['tool']['class_tsid'] = recipe[class_tsid]['tool'];
	 					spec['tool']['verb'] = recipe[class_tsid]['tool_verb'];					
						spec['tool']['wait_ms'] = recipe[class_tsid]['tool_ms'] + 300; // + 300 to space out timers to avoid race conditions (items needed before the GS has finished created them)
						spec['wait_ms'] = spec['tool']['wait_ms'];
					}else{
						var tools = recipe[class_tsid]['tool'].split('|');
						
						if ((tools[0] == 'meat_collector' && cache_data['meat_collector_count'] == 0) ||
						 (tools[0] == 'butterfly_milker' && cache_data['butterfly_milker_count'] == 0) ||
						 (tools[0] == 'still' && cache_data['still_count'] == 0)){
							tools[0] = null;
							recipe[class_tsid]['tool'] = null;
							recipe[class_tsid]['inputs'] = null;
						}

						if (tools[0]){
							var tool = apiFindItemPrototype(tools[0]);

							if (tool && tool.is_tool){
								spec['tool'] = {};
								spec['tool']['class_tsid'] = recipe[class_tsid]['tool'];
			 					spec['tool']['verb'] = recipe[class_tsid]['tool_verb'];					
								spec['tool']['wait_ms'] = recipe[class_tsid]['tool_ms'] + 300; // + 300 to space out timers to avoid race conditions (items needed before the GS has finished created them)
								spec['wait_ms'] = spec['tool']['wait_ms'];
			 					if (!spec['required_tools'][spec['tool']['class_tsid']]) spec['required_tools'][spec['tool']['class_tsid']] = {};

								if (tool.getClassProp('points_capacity') > 0){
									if (recipe[class_tsid]['tool_wear']) {
				 						spec['tool']['tool_wear'] = recipe[class_tsid]['tool_wear'];
					 					if (!spec['required_tools'][spec['tool']['class_tsid']]) spec['required_tools'][spec['tool']['class_tsid']] = {};
					 					if (!spec['required_tools'][spec['tool']['class_tsid']]['tool_wear']) spec['required_tools'][spec['tool']['class_tsid']]['tool_wear'] = 0;
					 					spec['required_tools'][spec['tool']['class_tsid']]['tool_wear'] += recipe[class_tsid]['tool_wear'];					
									}
								}

							}else if ((tool && tool.is_machine) || tools[0] == 'still' || tools[0] == 'butterfly_milker' || tools[0] == 'meat_collector'){
								spec['machine'] = {};
								spec['machine']['class_tsid'] = recipe[class_tsid]['tool'];
			 					spec['machine']['verb'] = recipe[class_tsid]['tool_verb'];					
								spec['machine']['wait_ms'] = recipe[class_tsid]['tool_ms'] + 300; // + 300 to space out timers to avoid race conditions (items needed before the GS has finished created them)
								spec['wait_ms'] = spec['machine']['wait_ms'];
			 					if (!spec['required_machines'][spec['machine']['class_tsid']]) spec['required_machines'][spec['machine']['class_tsid']] = {};

								if (recipe[class_tsid]['tool_fuel_cost']){
									spec['machine']['class_tsid']['fuel_cost'] = recipe[class_tsid]['tool_fuel_cost'];
				 					if (!spec['required_machines'][spec['machine']['class_tsid']]['fuel_cost']) spec['required_machines'][spec['machine']['class_tsid']]['fuel_cost'] = 0;
				 					spec['required_machines'][spec['machine']['class_tsid']]['fuel_cost'] += recipe[class_tsid]['tool_fuel_cost'];					
								}

								if (recipe[class_tsid]['tool_unit_count']){
									spec['machine']['class_tsid']['tool_unit_count'] = recipe[class_tsid]['tool_unit_count'];
				 					if (!spec['required_machines'][spec['machine']['class_tsid']]['unit_count']) spec['required_machines'][spec['machine']['class_tsid']]['unit_count'] = 0;
				 					spec['required_machines'][spec['machine']['class_tsid']]['unit_count'] += recipe[class_tsid]['tool_unit_count'];
								}
							}
						}
					}
				}

				if (recipe[class_tsid]['energy_cost']){
					spec['energy_cost'] = recipe[class_tsid]['energy_cost'];
					spec['total_energy_cost'] = spec['energy_cost'];
					spec['fuel_cost'] = spec['energy_cost'];
					spec['total_fuel_cost'] = spec['fuel_cost'];
				}
				
				var ingredients = recipe[class_tsid]['inputs'];
				if (ingredients){
					spec['ingredients'] = [];
					// A recipe, so we need the ingredients
					var ing_counter = 0;
					var level = deep+1;
					for (var i in ingredients){
						var claimed_crafting_items = {};
						for (var j in crafting_items){
							claimed_crafting_items[j] = crafting_items[j];
						}
						
						if (ingredients[i][0] == 'fuel_cell'){
							// Any fuel_cell ingredients are used to fuel machines, so add them as tool_fuel_cost instead
							if (!spec['machine']['fuel_cost']) spec['machine']['fuel_cost'] = 0;
							spec['machine']['fuel_cost'] += diff_required*ingredients[i][1];
							if (!spec['required_machines'][spec['machine']['class_tsid']]['fuel_cost']) spec['required_machines'][spec['machine']['class_tsid']]['fuel_cost'] = 0;
							spec['required_machines'][spec['machine']['class_tsid']]['fuel_cost'] += diff_required*ingredients[i][1];
							continue;
						}
						
						var ing_spec = utils.craftytasking_get_build_spec_recurs(crafty_bot, ingredients[i][0], diff_required*ingredients[i][1], use_current_ingredients, claimed_ingredients, required_elements, claimed_crafting_items, level, cache_data);
						if (ing_spec){
							var cannot_make = false;
							//
							// We have the ingredient spec, we need to add the propigated data up to the parent
							//
							if (ing_spec['required_skills']) {
								for (var s in ing_spec['required_skills']){
									if (!in_array(ing_spec['required_skills'][s], spec['required_skills'])) spec['required_skills'].push(ing_spec['required_skills'][s]);
								}
							}
							if (ing_spec['required_machines']) {
								for (var t in ing_spec['required_machines']){
									if (!spec['required_machines'][t]) spec['required_machines'][t] = {};
									if (ing_spec['required_machines'][t]['fuel_cost']){
										if (!spec['required_machines'][t]['fuel_cost']) spec['required_machines'][t]['fuel_cost'] = 0;
										spec['required_machines'][t]['fuel_cost'] += ing_spec['required_machines'][t]['fuel_cost'];
									}
									if (ing_spec['required_machines'][t]['unit_count']){
										if (!spec['required_machines'][t]['unit_count']) spec['required_machines'][t]['unit_count'] = 0;
										spec['required_machines'][t]['unit_count'] += ing_spec['required_machines'][t]['unit_count'];
									}
								}
							}
							if (ing_spec['required_ingredients']) {
								for (var r in ing_spec['required_ingredients']){
									if (!spec['required_ingredients'][r]) spec['required_ingredients'][r] = 0;
									spec['required_ingredients'][r] += ing_spec['required_ingredients'][r];
								}
								cannot_make = true;
							}
							if (ing_spec['required_tools']) {
								for (var t in ing_spec['required_tools']){
									if (!spec['required_tools'][t]) spec['required_tools'][t] = {};
									if (!spec['required_tools'][t]['tool_wear']) spec['required_tools'][t]['tool_wear'] = 0;
									spec['required_tools'][t]['tool_wear'] += ing_spec['required_tools'][t]['tool_wear'];
								}
							}
							if (ing_spec['total_energy_cost']) {
								spec['total_energy_cost'] += ing_spec['total_energy_cost'];
							}
							if (ing_spec['total_fuel_cost']) {
								spec['total_fuel_cost'] += ing_spec['total_fuel_cost'];
							}
							if (ing_spec['wait_ms']) {
								spec['wait_ms'] += ing_spec['wait_ms'];
							}

							//
							// Add the ingredient to the spec
							//
							spec['ingredients'][ing_counter] = ing_spec;
							ing_counter++;
							
							if (cannot_make){
//								break;
							}
						}else{
							if (!spec['required_ingredients'][ingredients[i][0]]) spec['required_ingredients'][ingredients[i][0]] = 0;
							spec['required_ingredients'][ingredients[i][0]] += diff_required*ingredients[i][1];
						}
					}
				}else{
					//
					// Base item (no ingredients)
					//
					if (!spec['required_ingredients'][class_tsid]) spec['required_ingredients'][class_tsid] = 0;
					spec['required_ingredients'][class_tsid] += diff_required;
				}
			}else{
				//
				// Special item (no recipe, i.e. firefly)
				//
				if (!spec['required_ingredients'][class_tsid]) spec['required_ingredients'][class_tsid] = 0;
				spec['required_ingredients'][class_tsid] += diff_required;
			}
		}
	}
	
	//
	// Special procedure to create the base elements
	//
/*	if (deep == 0 && num_keys(required_elements) > 0){
		if (!spec['required_skills']) spec['required_skills'] = [];
		if (!spec['required_tools']) spec['required_tools'] = {};
		if (!spec['required_ingredients']) spec['required_ingredients'] = [];
		if (!spec['required_machines']) spec['required_machines'] = {};

		//
		// Get the element creation spec and add the propigated data to the parent
		//
		spec['elements'] = craftytasking_get_build_element_spec(crafty_bot, required_elements, claimed_ingredients);
		if (spec['elements']['required_skills']) {
			for (var s in spec['elements']['required_skills']){
				if (!in_array(spec['elements']['required_skills'][s], spec['required_skills'])) spec['required_skills'].push(spec['elements']['required_skills'][s]);
			}
		}
		if (spec['elements']['required_tools']) {
			for (var t in spec['elements']['required_tools']){
				if (!spec['required_tools'][t]) spec['required_tools'][t] = {};
				if (spec['elements']['required_tools'][t]['tool_wear']){
					if (!spec['required_tools'][t]['tool_wear']) spec['required_tools'][t]['tool_wear'] = 0;
					spec['required_tools'][t]['tool_wear'] += spec['elements']['required_tools'][t]['tool_wear'];
				}
				if (spec['elements']['required_tools'][t]['tool_fuel_cost']){
					if (!spec['required_tools'][t]['tool_fuel_cost']) spec['required_tools'][t]['tool_fuel_cost'] = 0;
					spec['required_tools'][t]['tool_fuel_cost'] += spec['elements']['required_tools'][t]['tool_fuel_cost'];
				}
				if (spec['elements']['required_tools'][t]['tool_unit_count']){
					if (!spec['required_tools'][t]['tool_unit_count']) spec['required_tools'][t]['tool_unit_count'] = 0;
					spec['required_tools'][t]['tool_unit_count'] += spec['elements']['required_tools'][t]['tool_unit_count'];
				}
			}
		}
		if (spec['elements']['required_machines']) {
			for (var t in spec['elements']['required_machines']){
				if (!spec['required_machines'][t]) spec['required_machines'][t] = 0;
				spec['required_machines'][t] += spec['required_machines'][t];
			}
		}
		if (spec['elements']['required_ingredients']) {
			for (var r in spec['elements']['required_ingredients']){
				if (!spec['required_ingredients'][r]) spec['required_ingredients'][r] = 0;
				spec['required_ingredients'][r] += spec['elements']['required_ingredients'][r];
			}
		}
		if (spec['elements']['total_energy_cost']) spec['total_energy_cost'] += spec['elements']['total_energy_cost'];
		if (spec['elements']['total_fuel_cost']) spec['total_fuel_cost'] += spec['elements']['total_fuel_cost'];
		if (spec['elements']['wait_ms']) spec['wait_ms'] += spec['elements']['wait_ms'];
	}*/
	
/*	if (deep == 0 && pc){
		for (i in spec['required_skills']){
			if (!pc.skills_has(spec['required_skills'][i])){
				if (!spec['missing_skills']) spec['missing_skills'] = [];
				spec['missing_skills'].push(spec['required_skills'][i]);
			}
		}
		for (i in spec['required_tools']){
			if (!pc.items_has([i], 1)){
				if (!spec['missing_tools']) spec['missing_tools'] = [];
				spec['missing_tools'].push(i);
			}
		}
		for (i in spec['required_machines']){
			if (!pc.items_has(spec['required_machines'][i], 1)){
				if (!spec['missing_machines']) spec['missing_machines'] = {};
				spec['missing_machines'][i] = spec['required_machines'][i];
			}
		}
	}*/

	return spec;
}


//
// Given the make spec it will return the list of ingredients and their count that are going to be made
//
function craftytasking_get_build_spec_list(spec, depth){
	var list = {};
	depth++;
	
	for (var i in spec['ingredients']){
		var res = utils.craftytasking_get_build_spec_list(spec['ingredients'][i], depth);
		for (var j in res){
			if (j){
				if (!list[j]) list[j] = {};
				list[j]['count'] = res[j]['count'];
				list[j]['make'] = res[j]['make'];
			}
		}
	}
	
	if (depth != 1 && spec['class_tsid']){
		if (!list[spec['class_tsid']]){
			list[spec['class_tsid']] = {};	
			list[spec['class_tsid']]['count'] = 0;
		}

		if (spec['ingredients']){
			list[spec['class_tsid']]['make'] = 1;
		}else{
			list[spec['class_tsid']]['make'] = 0;			
		}

		list[spec['class_tsid']]['count'] += spec['count'];
	}
	
	return list;
}

//
// Will return a spec for buildin the elements
//
function craftytasking_get_build_element_spec(crafty_bot, required_elements, claimed_ingredients){
	var ret = {};
	
	//
	// Will loop though the most desired order, least amount of expensive rocks.
	//

	if (!required_elements['element_shiny']) required_elements['element_shiny'] = 0;
	if (!required_elements['element_green']) required_elements['element_green'] = 0;
	if (!required_elements['element_blue']) required_elements['element_blue'] = 0;
	if (!required_elements['element_red']) required_elements['element_red'] = 0;
	
	var sparkly_left = 0;
	var beryl_left = 0;
	var dullite_left = 0;

	if (crafty_bot){
		var location = crafty_bot.getLocation();
		if (location){
			sparkly_left = location.count_items('sparkly');
			beryl_left = location.count_items('beryl');
			dullite_left = location.count_items('dullite');
			log.info('sparkly_left: '+sparkly_left);
			log.info('beryl_left: '+beryl_left);
			log.info('dullite_left: '+dullite_left);
		}
	}
	var sparkly_used = 0;
	var beryl_used = 0;
	var dullite_used = 0;
	
	
	if (claimed_ingredients){
		if (claimed_ingredients['sparkly']) sparkly_left -= claimed_ingredients['sparkly'];
		if (claimed_ingredients['beryl']) beryl_left -= claimed_ingredients['beryl'];
		if (claimed_ingredients['dullite']) dullite_left -= claimed_ingredients['dullite'];
	}

	//
	// element_shiny from sparkly
	//
	var res = this.craftytasking_get_required_rocks_for_elements(required_elements, 'element_shiny', sparkly_left - sparkly_used, 6, 4, 5, 1);
	sparkly_used += res['rock_used'];
	required_elements['element_shiny'] = res.required_elements['element_shiny'];
	required_elements['element_red'] = res.required_elements['element_red'];
	required_elements['element_blue'] = res.required_elements['element_blue'];
	required_elements['element_green'] = res.required_elements['element_green'];

	//
	// element_blue from beryl
	//
	res = this.craftytasking_get_required_rocks_for_elements(required_elements, 'element_blue', beryl_left - beryl_used, 0, 4, 20, 2);
	beryl_used += res['rock_used'];
	required_elements['element_red'] = res.required_elements['element_red'];
	required_elements['element_blue'] = res.required_elements['element_blue'];
	required_elements['element_green'] = res.required_elements['element_green'];

	//
	// element_red from beryl
	//
	res = this.craftytasking_get_required_rocks_for_elements(required_elements, 'element_red', beryl_left - beryl_used, 0, 4, 20, 2);
	beryl_used += res['rock_used'];
	required_elements['element_red'] = res.required_elements['element_red'];
	required_elements['element_blue'] = res.required_elements['element_blue'];
	required_elements['element_green'] = res.required_elements['element_green'];

	//
	// element_green from dullite
	//
	res = this.craftytasking_get_required_rocks_for_elements(required_elements, 'element_green', dullite_left - dullite_used, 0, 0, 5, 8);
	dullite_used += res['rock_used'];
	required_elements['element_red'] = res.required_elements['element_red'];
	required_elements['element_green'] = res.required_elements['element_green'];

	//
	// element_red from dullite
	//
	res = this.craftytasking_get_required_rocks_for_elements(required_elements, 'element_red', dullite_left - dullite_used, 0, 0, 5, 8);
	dullite_used += res['rock_used'];
	required_elements['element_red'] = res.required_elements['element_red'];
	required_elements['element_green'] = res.required_elements['element_green'];

	//
	// element_green from beryl
	//
	res = this.craftytasking_get_required_rocks_for_elements(required_elements, 'element_green', beryl_left - beryl_used, 0, 4, 20, 2);
	beryl_used += res['rock_used'];
	required_elements['element_red'] = res.required_elements['element_red'];
	required_elements['element_blue'] = res.required_elements['element_blue'];
	required_elements['element_green'] = res.required_elements['element_green'];

	//
	// element_blue from beryl
	//
	res = this.craftytasking_get_required_rocks_for_elements(required_elements, 'element_blue', beryl_left - beryl_used, 0, 4, 20, 2);
	beryl_used += res['rock_used'];
	required_elements['element_red'] = res.required_elements['element_red'];
	required_elements['element_blue'] = res.required_elements['element_blue'];
	required_elements['element_green'] = res.required_elements['element_green'];

	//
	// element_green from sparkly
	//
	var res = this.craftytasking_get_required_rocks_for_elements(required_elements, 'element_green', sparkly_left - sparkly_used, 6, 4, 5, 1);
	sparkly_used += res['rock_used'];
	required_elements['element_shiny'] = res.required_elements['element_shiny'];
	required_elements['element_red'] = res.required_elements['element_red'];
	required_elements['element_blue'] = res.required_elements['element_blue'];
	required_elements['element_green'] = res.required_elements['element_green'];

	//
	// element_red from sparkly
	//
	var res = this.craftytasking_get_required_rocks_for_elements(required_elements, 'element_red', sparkly_left - sparkly_used, 6, 4, 5, 1);
	sparkly_used += res['rock_used'];
	required_elements['element_shiny'] = res.required_elements['element_shiny'];
	required_elements['element_red'] = res.required_elements['element_red'];
	required_elements['element_blue'] = res.required_elements['element_blue'];
	required_elements['element_green'] = res.required_elements['element_green'];

	//
	// element_blue from sparkly
	//
	var res = this.craftytasking_get_required_rocks_for_elements(required_elements, 'element_blue', sparkly_left - sparkly_used, 6, 4, 5, 1);
	sparkly_used += res['rock_used'];
	required_elements['element_shiny'] = res.required_elements['element_shiny'];
	required_elements['element_red'] = res.required_elements['element_red'];
	required_elements['element_blue'] = res.required_elements['element_blue'];
	required_elements['element_green'] = res.required_elements['element_green'];
	
	ret['required_ingredients'] = {};
	if (required_elements['element_shiny'] > 0) ret['required_ingredients']['element_shiny'] = required_elements['element_shiny'];
	if (required_elements['element_blue'] > 0) ret['required_ingredients']['element_blue'] = required_elements['element_blue'];
	if (required_elements['element_red'] > 0) ret['required_ingredients']['element_red'] = required_elements['element_red'];
	if (required_elements['element_green'] > 0) ret['required_ingredients']['element_green'] = required_elements['element_green'];
	
	var crush_skill_package = null;
/*	if (pc){
		crush_skill_package = pc.getSkillPackageDetails('refining');
	}*/

	ret['ingredients'] = [];
	var duration  = 0;
	var energy = 0;
	var sparkly_elements = 0;
	var blue_elements = 0;
	var red_elements = 0;
	var green_elements = 0;
	var tool_wear = 0;
	if (sparkly_used > 0) {
		duration = 2 + 100 + ((sparkly_used < 10) ? sparkly_used : 10) * 200;
		energy += 3 * sparkly_used;
		tool_wear += 2 * sparkly_used

		if (sparkly_used > 10) duration += (sparkly_used - 10) * 100;
		sparkly_elements = sparkly_used * 6;
		blue_elements = sparkly_used * 4;
		red_elements = sparkly_used * 5;
		green_elements = sparkly_used * 1;
		
		ret['ingredients'].push({class_tsid: 'sparkly', count: sparkly_used, wait_ms: duration, sparkly_elements: sparkly_elements, red_elements: red_elements, blue_elements: blue_elements, green_elements: green_elements});
	}
	if (beryl_used > 0) {
		duration = 2 + 100 + ((beryl_used < 10) ? beryl_used : 10) * 200;
		energy += 3 * beryl_used;
		tool_wear += 2 * beryl_used

		if (beryl_used > 10) duration += (beryl_used - 10) * 100;
		sparkly_elements = beryl_used * 0;
		blue_elements = beryl_used * 4;
		red_elements = beryl_used * 20;
		green_elements = beryl_used * 2;

		ret['ingredients'].push({class_tsid: 'beryl', count: beryl_used, wait_ms: duration, sparkly_elements: sparkly_elements, red_elements: red_elements, blue_elements: blue_elements, green_elements: green_elements});
	}
	if (dullite_used > 0) {
		duration = 2 + 100 + ((dullite_used < 10) ? dullite_used : 10) * 200;
		energy += 3 * dullite_used;
		tool_wear += 2 * dullite_used

		if (dullite_used > 10) duration += (dullite_used - 10) * 100;
		sparkly_elements = dullite_used * 0;
		blue_elements = dullite_used * 0;
		red_elements = dullite_used * 5;
		green_elements = dullite_used * 8;

		ret['ingredients'].push({class_tsid: 'dullite', count: dullite_used, wait_ms: duration, sparkly_elements: sparkly_elements, red_elements: red_elements, blue_elements: blue_elements, green_elements: green_elements});
	}
		
	ret['required_tools'] = {'ore_grinder|grand_ol_grinder':{'tool_wear': tool_wear, 'tool_fuel_cost': 0}};
	ret['required_skills'] = ['refining_1'];
	ret['total_energy_cost'] = energy;
	ret['total_fuel_cost'] = ret['total_energy_cost'];
	
	return ret;
}

function craftytasking_get_required_rocks_for_elements(required_elements, active_element, rock_left, shiny_multiplier, blue_multiplier, red_multiplier, green_multiplier){
	var rock_used = 0;

	if (required_elements[active_element] > 0){
		var rock_required = 0;

		var active_multiplier = shiny_multiplier;
		if (active_element == 'element_blue') active_multiplier = blue_multiplier;
		if (active_element == 'element_red') active_multiplier = red_multiplier;
		if (active_element == 'element_green') active_multiplier = green_multiplier;

		rock_required = Math.ceil(required_elements[active_element] / active_multiplier);

		rock_used = Math.min(rock_left, rock_required);

		if (rock_used > 0){
			required_elements['element_shiny'] -= rock_used * shiny_multiplier;
			required_elements['element_blue'] -= rock_used * blue_multiplier;
			required_elements['element_red'] -= rock_used * red_multiplier;			
			required_elements['element_green'] -= rock_used * green_multiplier;
		}		
	}
	
	return {rock_used: rock_used, 
			required_elements:{	element_shiny:required_elements['element_shiny'],
								element_blue:required_elements['element_blue'],
								element_red:required_elements['element_red'],
								element_green:required_elements['element_green']}};
}

function craftytasking_limited_spec(spec, max_steps){

	var ret = craftytasking_limited_spec_recurs(spec, max_steps);
	var spec = null;
	if (ret){
		spec = ret['spec'];
	}

	return spec;
}

function craftytasking_limited_spec_recurs(spec, max_steps){
	var limited_spec = [];
	
	if (max_steps > 0){
		if (spec['ingredients']){
			for (var i in spec['ingredients']){
				var ret = craftytasking_limited_spec_recurs(spec['ingredients'][i], max_steps);

				if (ret){
					limited_spec.push(ret['spec']);
					max_steps = ret['max_steps'];
				}
				
				if (max_steps <= 0) break;
			}

			if (max_steps <= 0){
				// Calculate other stats based on this level
					var tmp_spec = {};
					tmp_spec['total_energy_cost'] = 0;
					tmp_spec['total_fuel_cost'] = 0;
					tmp_spec['energy_cost'] = 0;
					tmp_spec['wait_ms'] = 0;
					tmp_spec['required_ingredients'] = [];
					tmp_spec['required_skills'] = [];
					tmp_spec['required_tools'] = {};
					tmp_spec['required_machines'] = {};
					for (var i in limited_spec){
						tmp_spec['total_energy_cost'] += intval(limited_spec[i]['total_energy_cost']);
						tmp_spec['total_fuel_cost'] += intval(limited_spec[i]['total_fuel_cost']);
						tmp_spec['energy_cost'] += intval(limited_spec[i]['energy_cost']);
						tmp_spec['wait_ms'] += intval(limited_spec[i]['wait_ms']);
						tmp_spec['required_ingredients'] = limited_spec[i]['required_ingredients'];
						tmp_spec['required_skills'] = limited_spec[i]['required_skills'];
						tmp_spec['required_tools'] = limited_spec[i]['required_tools'];
						tmp_spec['required_machines'] = limited_spec[i]['required_machines'];
					}
					tmp_spec['ingredients'] = limited_spec;
					return {'spec': tmp_spec, 'max_steps': 0};
			}

			max_steps--;
		}else{
			return null;
		}

		return {'spec': spec, 'max_steps': max_steps};
	}

	return null;
}

function craftytasking_recipe_request(crafty_bot, msg){
	var rsp = {};
	
	var pc = null;
	
	//log.info(msg);
	var all_recipes = apiFindItemPrototype('catalog_recipes').recipes;
	
	// Loop over the items we want to make
	for (var i in msg.class_tsids){
		var class_id = msg.class_tsids[i];
		
		// Loop over all recipes to find what makes 'class_id'
		for (var j in all_recipes){
			var r = get_recipe(j); // get_recipe sets some other stuff up for us, so let's call it
			
			// Loop over the outputs of recipe 'r' (id 'j')
			for (var o=0; o<r.outputs.length; o++){
				// Found a match!
				if (r.outputs[o][0] == class_id){
					// Copy the recipe so we don't modify the catalog
					rsp[class_id] = utils.copy_hash(r);
					rsp[class_id].id = j; // We need recipe id too
					
					// Discoverable?
					if (rsp[class_id].learnt == 0) rsp[class_id].discoverable = 1;
					
					// Get the tool that makes this recipe
					var tool = apiFindItemPrototype(r.tool);
					
					// Do we know this recipe?
					if (!pc || (pc && !pc.recipes.recipes[j])){
						// We implicitly know all transmogrification recipes
						if (!tool || tool.getClassProp('making_type') != 'transmogrification'){
							rsp[class_id].learnt = 0;
						}
					}
					else if (rsp[class_id].discoverable){
						rsp[class_id].learnt = 1;
					}
					
					if (!tool) continue;
					
					break;
				}
			}
			
			if (rsp[class_id] && rsp[class_id].learnt) break;
		}
		
		// Nothing makes this thing
		if (!rsp[class_id]) rsp[class_id] = {};
	}
	
	//log.info(rsp);
	return rsp;
}


function craftytasking_build_sequence(crafty_bot, spec, count, holder){
	log.info('CRAFTY ['+crafty_bot+'] -- craftytasking_build_sequence: '+spec.class_tsid+' -- count: '+count+' -- holder: '+holder);
	
	//
	// Build shopping list and add it's steps
	//
	var shopping_list = {};
	var ingredient_source_shopping_list = {};
	var source_item_count = 0;
	var craft_sequence = [];
	var class_id = spec.class_tsid;
	var ingredients = {};
	var missing_ingredients = {};
	var tools = {};
	var missing_tools = {};
	var element_spec = null;
	var external_crafted_items = {};
	var required_elements_multiplied = {};
	var required_elements = {};
	var elements_for_single = {};
	
	//
	// Build the shopping list for any elements first since we need to re-spec the
	// elements and determine how to get them...
	//
	if (spec.required_ingredients['element_green'] ||
		spec.required_ingredients['element_red'] ||
		spec.required_ingredients['element_blue'] ||
		spec.required_ingredients['element_shiny']){
		
		//
		// Create the new required_elements for crafting a single item
		//
		for (var i in spec.required_ingredients){
			if (i == 'element_green' ||	i == 'element_red' || i == 'element_blue' || i == 'element_shiny'){
				required_elements[i] = spec.required_ingredients[i] * count;
				elements_for_single[i] = spec.required_ingredients[i];
			}
		}
		
		//
		// Generate the new element spec (based on the new multiplier)
		//
		element_spec = this.craftytasking_get_build_element_spec(crafty_bot, required_elements, {});
		
		//
		// Add the rocks to the shopping list
		//
		for (var i in element_spec.ingredients){
			if (!shopping_list[element_spec.ingredients[i].class_tsid]) shopping_list[element_spec.ingredients[i].class_tsid] = 0;
			shopping_list[element_spec.ingredients[i].class_tsid] += (element_spec.ingredients[i].count * count);
		}

		//
		// Add the elements to the shopping list (so they show up as missing ingredients)
		//
		for (var i in element_spec.required_ingredients){
			if (!shopping_list[i]) shopping_list[i] = 0;
			shopping_list[i] += element_spec.required_ingredients[i];
		}
	}
	
	//
	// ...and then add everything else
	//
	this.craftytasking_build_shopping_list_step(crafty_bot, spec, count, true, shopping_list, holder);

	for (var i in shopping_list){
		
		source_item_count = crafty_bot.ingredientSourceCountItem(i);
		if (holder[i]){
			source_item_count += holder[i].count;
		}
		craft_sequence.push({ 	type:'fetch_ingredient',
								can_step: false,
								data: {	class_id: i,
										count: shopping_list[i],
										source_count: source_item_count}});
	
		ingredient_source_shopping_list[i] = source_item_count;
	}
	
	for (var i in shopping_list){
		if (ingredient_source_shopping_list[i] < shopping_list[i]){
			if (!missing_ingredients[i]) missing_ingredients[i] = 0;
			missing_ingredients[i] += (shopping_list[i]-ingredient_source_shopping_list[i]);
		}
		if (ingredient_source_shopping_list[i] > 0){
			if (!ingredients[i]) ingredients[i] = 0;
			ingredients[i] += ingredient_source_shopping_list[i];
		}
	}
	
	if (element_spec){

		//
		// Determine the max_count_craftable from the elements
		//
		var max_count_craftable = 99999;
		for (var i in element_spec.ingredients){
			if (element_spec.ingredients[i]['green_elements'] && elements_for_single['element_green']){
				max_count_craftable = Math.min(max_count_craftable, Math.floor(element_spec.ingredients[i]['green_elements']/elements_for_single['element_green']));
			}
			if (element_spec.ingredients[i]['red_elements'] && elements_for_single['element_red']){
				max_count_craftable = Math.min(max_count_craftable, Math.floor(element_spec.ingredients[i]['red_elements']/elements_for_single['element_red']));
			}
			if (element_spec.ingredients[i]['blue_elements'] && elements_for_single['element_blue']){
				max_count_craftable = Math.min(max_count_craftable, Math.floor(element_spec.ingredients[i]['blue_elements']/elements_for_single['element_blue']));
			}
			if (element_spec.ingredients[i]['sparkly_elements'] && elements_for_single['element_shiny']){
				max_count_craftable = Math.min(max_count_craftable, Math.floor(element_spec.ingredients[i]['sparkly_elements']/elements_for_single['element_shiny']));	
			}
		}
		if (max_count_craftable == 99999) max_count_craftable = 0;

		var element_tool = 'ore_grinder|grand_ol_grinder';
		var element_tool_count = 0;
		var element_tools = element_tool.split('|');
		var element_tool_class_id;
		for (var i in element_tools){
			element_tool_class_id = element_tools[i];
			element_tool_count = crafty_bot.ingredientSourceCountItem(element_tool_class_id, {element_tool_wear: spec['tool']['tool_wear']});
			if (element_tool_count > 0)	break;
		}

		if (element_spec['ingredients'].length > 0){
			craft_sequence.push({	type:'fetch_tool',
									can_step: element_tool_count > 0,
									data: {	class_id: element_tool,
											count: 1,
											source_count:element_tool_count}});
		}

		for (var i in element_spec['ingredients']){

			var elements = [];
			var element_count = [];
			if (element_spec['ingredients'][i]['sparkly_elements'] > 0){
				elements.push('element_shiny');
				element_count.push(element_spec['ingredients'][i]['sparkly_elements'] * element_spec['ingredients'][i]['count']);
				if (!external_crafted_items['element_shiny']) external_crafted_items['element_shiny'] = 0;
				external_crafted_items['element_shiny'] += element_spec['ingredients'][i]['sparkly_elements'];
			}
			if (element_spec['ingredients'][i]['red_elements'] > 0){
				elements.push('element_red');
				element_count.push(element_spec['ingredients'][i]['red_elements'] * element_spec['ingredients'][i]['count']);
				if (!external_crafted_items['element_red']) external_crafted_items['element_red'] = 0;
				external_crafted_items['element_red'] += element_spec['ingredients'][i]['red_elements'];
			}
			if (element_spec['ingredients'][i]['blue_elements'] > 0){
				elements.push('element_blue');
				element_count.push(element_spec['ingredients'][i]['blue_elements'] * element_spec['ingredients'][i]['count']);
				if (!external_crafted_items['element_blue']) external_crafted_items['element_blue'] = 0;
				external_crafted_items['element_blue'] += element_spec['ingredients'][i]['blue_elements'];
			}
			if (element_spec['ingredients'][i]['green_elements'] > 0){
				elements.push('element_green');
				element_count.push(element_spec['ingredients'][i]['green_elements'] * element_spec['ingredients'][i]['count']);
				if (!external_crafted_items['element_green']) external_crafted_items['element_green'] = 0;
				external_crafted_items['element_green'] += element_spec['ingredients'][i]['green_elements'];
			}			
			
			craft_sequence.push({	type: 'craft',
									can_step: (element_tool_count > 0),
									data:	{ class_id:elements, 
											count: element_count, 
											tool:element_tool, 
											energy_cost:0, 
											fuel_cost:1, 
											duration: (element_spec['ingredients'][i]['wait_ms'] * crafty_bot.getInstanceProp('time_multiplier')), 
											tool_verb:'crush', 
											ingredient_class:[element_spec['ingredients'][i]['class_tsid']], 
											ingredient_count:[element_spec['ingredients'][i]['count']]}});
		}

		for (var i in element_spec['ingredients']){
			for (var j in craft_sequence){
				if (craft_sequence[j].type == 'fetch_ingredient' && craft_sequence[j].data.class_id == element_spec['ingredients'][i]['class_tsid']){					
					ingredient_source_shopping_list[element_spec['ingredients'][i]['class_tsid']] -= (element_spec['ingredients'][i]['count']);
					craft_sequence[j].data.count = (element_spec['ingredients'][i]['count']);
					craft_sequence[j].can_step = craft_sequence[j].data.source_count >= craft_sequence[j].data.count;
				}
			}
		}
	}

	//
	// Add the crafting steps
	//
	var max_count = this.craftytasking_build_sequence_step(crafty_bot, spec, count, true, craft_sequence, ingredient_source_shopping_list, external_crafted_items, holder);
	
	//
	// Determine how many we are actually crafting
	//
	var last_action = craft_sequence[craft_sequence.length-1];
	var craft_count;
	if (last_action && last_action.data && last_action.data.class_id == class_id){
		craft_count = last_action.data.count[0];
	}
	
	//
	// Look for any missing tools and fetch any extra information (fuel, time, etc)
	//
	var craftytasking_metadata = {};
	craftytasking_metadata['energy_cost'] = 0;
	craftytasking_metadata['fuel_cost'] = 0;
	craftytasking_metadata['duration'] = 0;

	for (var i in craft_sequence){
		if (craft_sequence[i].type == 'fetch_tool'){
			if (!craft_sequence[i].data.source_count || craft_sequence[i].data.count > craft_sequence[i].data.source_count){
				if (!missing_tools[craft_sequence[i].data.class_id]) missing_tools[craft_sequence[i].data.class_id] = 0;
				missing_tools[craft_sequence[i].data.class_id] += craft_sequence[i].data.count;
			}else{
				if (!tools[craft_sequence[i].data.class_id]) tools[craft_sequence[i].data.class_id] = 0;
				tools[craft_sequence[i].data.class_id] += craft_sequence[i].data.count;
			}
		}else if (craft_sequence[i].type == 'craft'){
			craftytasking_metadata['energy_cost'] += craft_sequence[i].data['energy_cost'];
			craftytasking_metadata['fuel_cost'] += craft_sequence[i].data['fuel_cost'];
			craftytasking_metadata['duration'] += craft_sequence[i].data['duration'];
		}
	}
	
	//
	// Add the 'craft_complete' step. Add completion data if it's fully completed the request
	//
	if (class_id && craft_count != undefined){
		craft_sequence.push({	type:'craft_complete',
								can_step: true,
								data: {	class_id:class_id, 
										count: craft_count,
										ingredients: ingredients,
										missing_ingredients: missing_ingredients,
										tools: tools,
										missing_tools: missing_tools,
										energy_cost: craftytasking_metadata['energy_cost'],
										fuel_cost: craftytasking_metadata['fuel_cost'],
										duration: craftytasking_metadata['duration']}});
	}else{
		craft_sequence.push({	type:'craft_complete',
								can_step: true,
								data: {	class_id:class_id, 
										count: craft_count,
										ingredients: ingredients,
										missing_ingredients: missing_ingredients,
										tools: tools,
										missing_tools: missing_tools,
										energy_cost: craftytasking_metadata['energy_cost'],
										fuel_cost: craftytasking_metadata['fuel_cost'],
										duration: craftytasking_metadata['duration']}});
	}
	
	return craft_sequence;
}

function craftytasking_get_sequence_status(sequence){

	if (sequence[sequence.length-1].data && sequence[sequence.length-1].data.count > 0){
		return 'craftable';
	}
	
	return 'not-craftable';	
}

function craftytasking_build_sequence_step(crafty_bot, spec, count, ignore_source_item, craft_sequence, ingredient_source_shopping_list, external_crafted_items, holder){
	var container = null;
	if (crafty_bot.isInLocation()){
		container = crafty_bot.getLocation();
	}else{
		container = crafty_bot.getContainer();
	}
	
	if (!container) return 0;
	
	//
	// If the ingredientSource has the required item.
	// This will be fetched via the shopping list, so just return.
	//
	
	var source_count = 0;
	if (!ignore_source_item){
		source_count = crafty_bot.ingredientSourceCountItem(spec['class_tsid']);
		if (holder[spec['class_tsid']]){
			source_count += holder[spec['class_tsid']].count;
		}
		if (source_count >= count){
			return count;
		}else{
			count -= source_count;
		}
	}
	
	var ingredient_class = [];
	var ingredient_count = [];
	var step = 0;
	var craft_count = 0;
	
	var ingredient_craft_count = 0;
	var max_count_craftable = (!spec['ingredients']) ? 0: count;

	for (var i in spec['ingredients']){
		ingredient_craft_count = this.craftytasking_build_sequence_step(crafty_bot, spec['ingredients'][i], spec['ingredients'][i]['count']*count, false, craft_sequence, ingredient_source_shopping_list, external_crafted_items, holder);
		max_count_craftable = Math.min(max_count_craftable, Math.floor(ingredient_craft_count / spec['ingredients'][i]['count']));
	}
	
	if (external_crafted_items[spec['class_tsid']]){
		max_count_craftable += external_crafted_items[spec['class_tsid']];
	}

	//
	// Count the working tools (if necessary)
	//
	if (spec['tool'] && spec['tool']['class_tsid']){
		var tool_class_id = '';
		if (spec['tool']['class_tsid'] != 'self'){
			var tools = spec['tool']['class_tsid'].split('|');
			for (var i in tools){
				tool_class_id = tools[i];
				var tool_count = crafty_bot.ingredientSourceCountItem(tool_class_id, {tool_wear: spec['tool']['tool_wear']});
				if (tool_count < 1){
					max_count_craftable = 0;
				}
				craft_sequence.push({	
					type:'fetch_tool',
					can_step: max_count_craftable > 0,
					data: {	
						class_id: tool_class_id,
						tool_wear: spec['tool']['tool_wear'],
						source_count: tool_count,
						count: 1}});

				if (tool_count > 0) break;
			}
		}
	}
		
	if (max_count_craftable > 0){
		for (var i in spec['ingredients']){
			ingredient_class.push(spec['ingredients'][i]['class_tsid']);
			ingredient_count.push(max_count_craftable * (spec['ingredients'][i]['count']/spec['count']));
			
			for (var j in craft_sequence){
				if (craft_sequence[j].type == 'fetch_ingredient' && craft_sequence[j].data.class_id == spec['ingredients'][i]['class_tsid']){
					ingredient_source_shopping_list[spec['ingredients'][i]['class_tsid']] -= (max_count_craftable * spec['ingredients'][i]['count']);
					craft_sequence[j].data.count = Math.min(craft_sequence[j].data.count, max_count_craftable * spec['ingredients'][i]['count']);
					craft_sequence[j].can_step = true;
				}
			}
		}
	}else{
		for (var i in spec['ingredients']){
			ingredient_class.push(spec['ingredients'][i]['class_tsid']);
			ingredient_count.push(0);
			for (var j in craft_sequence){
				if (craft_sequence[j].type == 'fetch_ingredient' && craft_sequence[j].data.class_id == spec['ingredients'][i]['class_tsid']){
					craft_sequence[j].can_step = false;
				}
			}
		}
	}
	
	if (spec['tool'] && spec['tool']['class_tsid']){
		craft_sequence.push({	type:'craft',
								can_step: max_count_craftable > 0,
								data: {	class_id:[spec['class_tsid']], 
										count: [max_count_craftable], 
										tool:tool_class_id, 
										tool_wear:spec['tool']['tool_wear'] * max_count_craftable, 
										energy_cost:spec['energy_cost']*max_count_craftable,
										fuel_cost:spec['fuel_cost']*max_count_craftable,
										duration: (spec['tool']['wait_ms'] * max_count_craftable * crafty_bot.getInstanceProp('time_multiplier')), 
										tool_verb:spec['tool']['verb'], 
										ingredient_class:ingredient_class, 
										ingredient_count:ingredient_count}});
	}
	
	if (spec['machine'] && spec['machine']['class_tsid']){
		var machines = spec['machine']['class_tsid'].split('|');
		for (var i in machines){
			var machine_tmp = container.find_items_including_bags(machines[i]);
			if (machine_tmp && machine_tmp[0]){
				craft_sequence.push({	
					type:'fetch_machine',
					can_step: max_count_craftable > 0,
					data: {	class_id: machine_tmp[0].class_tsid,
							count: 1}});
			}
		}
	
		craft_sequence.push({	
			type:'use_machine',
			can_step: max_count_craftable > 0,
			data: {	class_id:[spec['class_tsid']], 
				count: [max_count_craftable], 
				machine:spec['machine']['class_tsid'], 
				energy_cost:spec['energy_cost'],
				fuel_cost:spec['fuel_cost'],
				recipe_id:spec['recipe_id'],
				duration: (spec['machine']['wait_ms'] * crafty_bot.getInstanceProp('time_multiplier')), 
				machine_verb:spec['machine']['verb'], 
				ingredient_class:ingredient_class, 
				ingredient_count:ingredient_count}});
	}
	
	function is_working_tool(it, args){ return it.is_tool && it.isWorking() && it.class_tsid == args ? true : false; }
	
	return max_count_craftable + source_count;
}

function craftytasking_build_shopping_list_step(crafty_bot, spec, multiplier, ignore_source_item, shopping_list, holder){

	//
	// Determine how many items in the ingredientSource or crafting_holder we can use
	//
	var source_count = 0;
	if (!ignore_source_item){
		source_count = crafty_bot.ingredientSourceCountItem(spec['class_tsid']);
		if (holder[spec['class_tsid']]){
			source_count += holder[spec['class_tsid']].count;
		}
	}
	
	//
	// If we need to craft something, due to not having enough in the ingredientSource (or ignoring it), craft
	//
	if (spec['ingredients'] && (ignore_source_item || source_count < (spec['count'] * multiplier))){
	
		//
		// How many items from the ingredientSource can we use? We can then craft the rest
		//
		var source_items_used = 0;
		if (!ignore_source_item){
			source_items_used = Math.floor(source_count / spec['count']) * spec['count'];
			if (source_items_used > 0){
				if (!shopping_list[spec['class_tsid']]) shopping_list[spec['class_tsid']] = 0;
				shopping_list[spec['class_tsid']] += source_items_used;
			}
		}
	
		//
		// Determine how many items we need to craft, and setup their shopping lists.
		//
		for (var i in spec['ingredients']){
			this.craftytasking_build_shopping_list_step(crafty_bot, spec['ingredients'][i], multiplier - source_items_used, false, shopping_list, holder);
		}
	
		return;
	}
	
	//
	// Add the items to the shopping list, inless they are elements, as they are fetched seperately
	//
	if (spec['class_tsid'] != 'element_shiny' && 
	    spec['class_tsid'] != 'element_green' && 
	    spec['class_tsid'] != 'element_blue' && 
	    spec['class_tsid'] != 'element_red'){
		if (!shopping_list[spec['class_tsid']]) shopping_list[spec['class_tsid']] = 0;
	
		shopping_list[spec['class_tsid']] += spec['count'] * multiplier;
	}	
}

function craftytasking_build_cache(container){
	var cache_data = {};
	cache_data['meat_collector_count'] = 0;
	cache_data['butterfly_milker_count'] = 0;
	cache_data['still_count'] = 0;
	if (container){
		cache_data['container'] = container;
		if (cache_data['container'] && cache_data['container'].hubid){
			cache_data['meat_collector_count'] = cache_data['container'].countItemClass('meat_collector');
			cache_data['butterfly_milker_count'] = cache_data['container'].countItemClass('butterfly_milker');
			cache_data['still_count'] = cache_data['container'].countItemClass('still');
		}
		
		cache_data['container_items'] = container.get_item_counts_including_bags();
	}

	cache_data['recipe_cache'] = {};
	var all_recipes = apiFindItemPrototype('catalog_recipes').recipes;
	
	var recipe = null;
	for (var i in all_recipes){
		recipe = all_recipes[i];
		recipe['id'] = i;
		for (var j in recipe.outputs){
			cache_data['recipe_cache'][recipe.outputs[j][0]] = utils.copy_hash(recipe);
		}
	}
	
	// cheese
	cache_data['recipe_cache']['cheese'] = {};
	cache_data['recipe_cache']['cheese']['recipe_id'] = null;
	cache_data['recipe_cache']['cheese']['tool'] = 'self';
	cache_data['recipe_cache']['cheese']['tool_verb'] = 'compress';
	cache_data['recipe_cache']['cheese']['tool_wear'] = 0;
	cache_data['recipe_cache']['cheese']['tool_fuel_cost'] = 0;
	cache_data['recipe_cache']['cheese']['energy_cost'] = 5;
	cache_data['recipe_cache']['cheese']['wait_ms'] = 3000 + 1000 * intval(1 / 10);
	cache_data['recipe_cache']['cheese']['inputs'] = [['butterfly_butter', 1, false]];

	// cheese_stinky
	cache_data['recipe_cache']['cheese_stinky'] = {};
	cache_data['recipe_cache']['cheese_stinky']['recipe_id'] = null;
	cache_data['recipe_cache']['cheese_stinky']['tool'] = 'self';
	cache_data['recipe_cache']['cheese_stinky']['tool_verb'] = 'age';
	cache_data['recipe_cache']['cheese_stinky']['tool_wear'] = 0;
	cache_data['recipe_cache']['cheese_stinky']['tool_fuel_cost'] = 0;
	cache_data['recipe_cache']['cheese_stinky']['energy_cost'] = 5;
	cache_data['recipe_cache']['cheese_stinky']['wait_ms'] = 3000 + 1000 * intval(1 / 10);
	cache_data['recipe_cache']['cheese_stinky']['inputs'] = [['cheese', 1, false]];

	// cheese_very_stinky
	cache_data['recipe_cache']['cheese_very_stinky'] = {};
	cache_data['recipe_cache']['cheese_very_stinky']['recipe_id'] = null;
	cache_data['recipe_cache']['cheese_very_stinky']['tool'] = 'self';
	cache_data['recipe_cache']['cheese_very_stinky']['tool_verb'] = 'age';
	cache_data['recipe_cache']['cheese_very_stinky']['tool_wear'] = 0;
	cache_data['recipe_cache']['cheese_very_stinky']['tool_fuel_cost'] = 0;
	cache_data['recipe_cache']['cheese_very_stinky']['energy_cost'] = 5;
	cache_data['recipe_cache']['cheese_very_stinky']['wait_ms'] = 3000 + 1000 * intval(1 / 10);
	cache_data['recipe_cache']['cheese_very_stinky']['inputs'] = [['cheese_stinky', 1, false]];

	// cheese_very_very_stinky
	cache_data['recipe_cache']['cheese_very_very_stinky'] = {};
	cache_data['recipe_cache']['cheese_very_very_stinky']['recipe_id'] = null;
	cache_data['recipe_cache']['cheese_very_very_stinky']['tool'] = 'self';
	cache_data['recipe_cache']['cheese_very_very_stinky']['tool_verb'] = 'age';
	cache_data['recipe_cache']['cheese_very_very_stinky']['tool_wear'] = 0;
	cache_data['recipe_cache']['cheese_very_very_stinky']['tool_fuel_cost'] = 0;
	cache_data['recipe_cache']['cheese_very_very_stinky']['energy_cost'] = 5;
	cache_data['recipe_cache']['cheese_very_very_stinky']['wait_ms'] = 3000 + 1000 * intval(1 / 10);
	cache_data['recipe_cache']['cheese_very_very_stinky']['inputs'] = [['cheese_very_stinky', 1, false]];
	
	// butterfly_butter
	cache_data['recipe_cache']['butterfly_butter'] = {};
	cache_data['recipe_cache']['butterfly_butter']['recipe_id'] = null;
	cache_data['recipe_cache']['butterfly_butter']['tool'] = 'self';
	cache_data['recipe_cache']['butterfly_butter']['tool_verb'] = 'shake';
	cache_data['recipe_cache']['butterfly_butter']['tool_wear'] = 0;
	cache_data['recipe_cache']['butterfly_butter']['tool_fuel_cost'] = 0;
	cache_data['recipe_cache']['butterfly_butter']['energy_cost'] = 2;
	cache_data['recipe_cache']['butterfly_butter']['wait_ms'] = 2000 + 1000 * intval(1 / 10);
	cache_data['recipe_cache']['butterfly_butter']['inputs'] = [['milk_butterfly', 1, false]];
	
	// meat
	cache_data['recipe_cache']['meat'] = {};
	cache_data['recipe_cache']['meat']['recipe_id'] = null;
	cache_data['recipe_cache']['meat']['tool'] = 'meat_collector';
	cache_data['recipe_cache']['meat']['tool_verb'] = 'collect';
	cache_data['recipe_cache']['meat']['tool_unit_count'] = 1;
	cache_data['recipe_cache']['meat']['tool_fuel_cost'] = 0;
	cache_data['recipe_cache']['meat']['energy_cost'] = 0;
	cache_data['recipe_cache']['meat']['wait_ms'] = 2000 + 1000 * intval(1 / 10);
	cache_data['recipe_cache']['meat']['inputs'] = [];
	
	// milk_butterfly
	cache_data['recipe_cache']['milk_butterfly'] = {};
	cache_data['recipe_cache']['milk_butterfly']['recipe_id'] = null;
	cache_data['recipe_cache']['milk_butterfly']['tool'] = 'butterfly_milker';
	cache_data['recipe_cache']['milk_butterfly']['tool_verb'] = 'collect';
	cache_data['recipe_cache']['milk_butterfly']['tool_unit_count'] = 1;
	cache_data['recipe_cache']['milk_butterfly']['tool_fuel_cost'] = 0;
	cache_data['recipe_cache']['milk_butterfly']['energy_cost'] = 0;
	cache_data['recipe_cache']['milk_butterfly']['wait_ms'] = 2000 + 1000 * intval(1 / 10);
	cache_data['recipe_cache']['milk_butterfly']['inputs'] = [];

	// hooch
	cache_data['recipe_cache']['hooch'] = {};
	cache_data['recipe_cache']['hooch']['recipe_id'] = null;
	cache_data['recipe_cache']['hooch']['tool'] = 'still';
	cache_data['recipe_cache']['hooch']['tool_verb'] = 'collect';
	cache_data['recipe_cache']['hooch']['tool_unit_count'] = 1;
	cache_data['recipe_cache']['hooch']['tool_fuel_cost'] = 0;
	cache_data['recipe_cache']['hooch']['energy_cost'] = 0;
	cache_data['recipe_cache']['hooch']['wait_ms'] = 2000 + 1000 * intval(1 / 10);
	cache_data['recipe_cache']['hooch']['inputs'] = [];

	// barnacle_talc
	cache_data['recipe_cache']['barnacle_talc'] = {};
	cache_data['recipe_cache']['barnacle_talc']['recipe_id'] = null;
	cache_data['recipe_cache']['barnacle_talc']['tool'] = 'ore_grinder|grand_ol_grinder';
	cache_data['recipe_cache']['barnacle_talc']['tool_verb'] = 'crush';
	cache_data['recipe_cache']['barnacle_talc']['tool_wear'] = 1;
	cache_data['recipe_cache']['barnacle_talc']['tool_fuel_cost'] = 0;
	cache_data['recipe_cache']['barnacle_talc']['inputs'] = [['barnacle', 1, false]];
	cache_data['recipe_cache']['barnacle_talc']['energy_cost'] = 0;
	cache_data['recipe_cache']['barnacle_talc']['wait_ms'] = 0;

	// plain_metal
	cache_data['recipe_cache']['plain_metal'] = {};
	cache_data['recipe_cache']['plain_metal']['recipe_id'] = null;
	cache_data['recipe_cache']['plain_metal']['tool'] = 'smelter';
	cache_data['recipe_cache']['plain_metal']['tool_verb'] = 'smelt';
	cache_data['recipe_cache']['plain_metal']['tool_wear'] = 1;
	cache_data['recipe_cache']['plain_metal']['tool_fuel_cost'] = 0;
	cache_data['recipe_cache']['plain_metal']['required_skills'] = ['smelting_1'];
	cache_data['recipe_cache']['plain_metal']['inputs'] = [['metal_rock', 5, false]];
	cache_data['recipe_cache']['plain_metal']['energy_cost'] = 0;
	cache_data['recipe_cache']['plain_metal']['wait_ms'] = 0;

	// grain_bushel
	cache_data['recipe_cache']['grain_bushel'] = {};
	cache_data['recipe_cache']['grain_bushel']['recipe_id'] = null;
	cache_data['recipe_cache']['grain_bushel']['tool'] = 'self';
	cache_data['recipe_cache']['grain_bushel']['tool_verb'] = 'bundle';
	cache_data['recipe_cache']['grain_bushel']['tool_wear'] = 0;
	cache_data['recipe_cache']['grain_bushel']['tool_fuel_cost'] = 0;
	cache_data['recipe_cache']['grain_bushel']['energy_cost'] = 20;
	cache_data['recipe_cache']['grain_bushel']['inputs'] = [['grain', 250, false]];
	cache_data['recipe_cache']['grain_bushel']['wait_ms'] = 0;

	// plain_crystal
	cache_data['recipe_cache']['plain_crystal'] = {};
	cache_data['recipe_cache']['plain_crystal']['recipe_id'] = null;
	cache_data['recipe_cache']['plain_crystal']['tool'] = 'crystallizer';
	cache_data['recipe_cache']['plain_crystal']['tool_verb'] = 'crystalmalize';
	cache_data['recipe_cache']['plain_crystal']['tool_wear'] = 1;
	cache_data['recipe_cache']['plain_crystal']['inputs'] = [['firefly', 7, false], ['barnacle_talc', 7, false]];
	cache_data['recipe_cache']['plain_crystal']['energy_cost'] = 0;
	cache_data['recipe_cache']['plain_crystal']['wait_ms'] = 0;

	// thread
	cache_data['recipe_cache']['thread'] = {};
	cache_data['recipe_cache']['thread']['recipe_id'] = null;
	cache_data['recipe_cache']['thread']['tool'] = 'spindle';
	cache_data['recipe_cache']['thread']['tool_verb'] = 'spin';
	cache_data['recipe_cache']['thread']['tool_wear'] = 1;
	cache_data['recipe_cache']['thread']['inputs'] = [['fiber', 7, false]];
	cache_data['recipe_cache']['thread']['energy_cost'] = 0;
	cache_data['recipe_cache']['thread']['wait_ms'] = 1 * 200;
	
	return cache_data;
}


function craftytasking_get_buildable_count(container, class_tsid){
	var cache_data = craftytasking_build_cache(container);
	cache_data['ingredients_used'] = {};
	cache_data['ingredients_craft_count'] = {};

	return craftytasking_get_buildable_count_recurs(class_tsid, cache_data, 0);
}

function craftytasking_get_buildable_count_recurs(class_tsid, cache_data, depth){

	if (!cache_data['ingredients_used'][class_tsid]) cache_data['ingredients_used'][class_tsid] = 0;
	
	if (depth != 0){
		var ingredient_avail = cache_data['container_items'][class_tsid] - cache_data['ingredients_used'][class_tsid];
		if (ingredient_avail > 0){
			return ingredient_avail;
		}
	}
		
	var recipe = cache_data['recipe_cache'][class_tsid];
	if (recipe && recipe['inputs'].length > 0){
		var make_count = 9999999;
		var ing_count = 0;
		for (var i in recipe['inputs']){
			if (cache_data['ingredients_craft_count'][recipe['inputs'][i][0]] != undefined){
				ing_count = cache_data['ingredients_craft_count'][recipe['inputs'][i][0]];
			}else{
				ing_count = craftytasking_get_buildable_count_recurs(recipe['inputs'][i][0], cache_data, depth+1);
				cache_data['ingredients_craft_count'][recipe['inputs'][i][0]] = ing_count;
			}
			var ing_make_count = Math.floor(ing_count/recipe['inputs'][i][1]);
			make_count = Math.min(make_count, ing_make_count);
			if (make_count == 0) break;
		}
		return make_count;
	}

	return 0;
}

function craftytasking_find_craftable_recipes(crafty_bot, use_current_ingredients, category){
	if (!crafty_bot) return [];
	
	// Get recipes from skills (and non-skill recipes)
/*	var skills = crafty_bot.learned_skills;
	var skill_recipe_ids = get_recipe_ids_for_skill(null);
	for (var i in skills){
		skill_recipe_ids = skill_recipe_ids.concat(get_recipe_ids_for_skill(i));
	}
	
	// Narrow down recipes based on category (if any)
	var recipes = [];
	var prot = null;
	var tmp_recipe = null;
	for (var j in skill_recipe_ids){
		tmp_recipe = get_recipe(skill_recipe_ids[j]);
		if (!tmp_recipe) continue;
		for (var k in tmp_recipe.outputs){
			if (category){
				prot = apiFindItemPrototype(tmp_recipe.outputs[k][0]);
				if (!prot || !prot.hasTag(category)){
					continue;
				}
			}

			recipes.push(tmp_recipe);
		}
	}*/
	
	var recipes = apiFindItemPrototype('catalog_recipes').recipes;
	
	// Build cache
	var cache_data = craftytasking_build_cache(crafty_bot.getLocation());
	cache_data['ingredients_used'] = {};
	cache_data['ingredients_craft_count'] = {};

	// Get the buildable count for each item
	var avail_recipes = [];
	var recipe = null;
	for (var i in recipes){
		recipe = recipes[i];

		cache_data['ingredients_used'] = {};
		if (craftytasking_get_buildable_count_recurs(recipe.outputs[0][0], cache_data, 0) > recipe.outputs[0][1]){
			avail_recipes.push(recipe.outputs[0][0]);
		}
	}
	
	return avail_recipes;
}

/*function craftytasking_test(crafty_bot, indexID){

	var craftytasking_timing_craftytasking_test_start = getTime();
	
	if (!indexID) indexID = 0;

	var recipe = null;
	var count = 0 ;
	var all_recipes = apiFindItemPrototype('catalog_recipes').recipes;
	var batch_time = null;
	var step_start = null;
	for (var j = 0; j < 45; j++){
		batch_time = getTime();
		for (var i in all_recipes){
			recipe = all_recipes[i];
			recipe['id'] = i;
			step_start = getTime();
	
			this.craftytasking_get_build_spec(crafty_bot, i, 1, false)
			count++;

//			log.info('CRAFTYTASKING TIMING -- test: ['+indexID+'] -- count: '+count+' -- time: '+(getTime() - step_start)+'ms -- Batch '+j);
		}

		apiResetThreadCPUClock();
		var fooCpuTime = apiResetThreadCPUClock("crafty_bot");
		log.info('CRAFTYTASKING TIMING -- '+indexID+' -- Batch '+j+' complete. Took: '+(getTime() - batch_time)+'ms');
	}

	log.info('CRAFTYTASKING TIMING -- craftytasking_test --'+(getTime() - craftytasking_timing_craftytasking_test_start+'ms'));
}*/

function get_string_list_from_class_tsid(class_tsid, count){
	var string = '';
	var items = class_tsid.split('|');
	var first = true;
	for (var i in items){
		var item = apiFindItemPrototype(items[i]);
		if (string == ''){
			if (count == 1){
				string += item.article;	
			}else{
				string += 'some';
			}
		}
		if (!first) string += ' or';
		if (count == 1){
			string += ' '+item.name_single;
		}else{
			string += ' '+item.name_plural;
		}
		first = false;
	}
	return string;
}