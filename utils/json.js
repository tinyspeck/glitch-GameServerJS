// This JSON-stringifier is based on Douglas Crockford's original json2.js
// https://github.com/douglascrockford/JSON-js/blob/master/json2.js
// The original work has been released into the public domain.
//
// public api

function JSON_stringify(value, space) {

	var indent = '';

	if (typeof space === 'number') {
		for (var i=0; i < space; i++){
			indent += ' ';
		}
	} else if (typeof space === 'string') {
		indent = space;
	}

	return this._JSON_str('x', {'x': value}, indent, '');
}


// internal guts below here

function _JSON_quote(string) {

	var escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;
	var meta = {    // table of character substitutions
		'\b': '\\b',
		'\t': '\\t',
		'\n': '\\n',
		'\f': '\\f',
		'\r': '\\r',
		'"' : '\\"',
		'\\': '\\\\'
	};

        escapable.lastIndex = 0;
	return escapable.test(string) ? '"' + string.replace(escapable, function (a) {
		var c = meta[a];
		return typeof c === 'string' ? c :
			'\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
	}) + '"' : '"' + string + '"';
}



function _JSON_str(key, holder, indent, gap) {

	var i,          // The loop counter.
		k,          // The member key.
		v,          // The member value.
		length,
		mind = gap,
		partial,
		value = holder[key];

	switch (typeof value) {
		case 'string':
			return this._JSON_quote(value);
		case 'number':
			return isFinite(value) ? String(value) : 'null';
		case 'boolean':
		case 'null':
			return String(value);
		case 'object':
			if (!value) {
				return 'null';
			}

			gap += indent;
			partial = [];

			if (value instanceof Array) {

				length = value.length;
				for (i = 0; i < length; i += 1) {
					partial[i] = this._JSON_str(i, value, indent, gap) || 'null';
				}

				v = partial.length === 0 ? '[]' : gap ?
					'[\n' + gap + partial.join(',\n' + gap) + '\n' + mind + ']' :
					'[' + partial.join(',') + ']';
				gap = mind;
				return v;
			}

			for (k in value) {
				//if (Object.prototype.hasOwnProperty.call(value, k)) {
					v = this._JSON_str(k, value, indent, gap);
					if (v) {
						partial.push(this._JSON_quote(k) + (gap ? ': ' : ':') + v);
					}
				//}
			}

			v = partial.length === 0 ? '{}' : gap ?
				'{\n' + gap + partial.join(',\n' + gap) + '\n' + mind + '}' :
				'{' + partial.join(',') + '}';
			gap = mind;
			return v;
	}
}


