//#include elizadata.js

/*
  eliza.js v.1.1 - ELIZA JS library (N.Landsteiner 2005)
  Eliza is a mock Rogerian psychotherapist.
  Original program by Joseph Weizenbaum in MAD-SLIP for "Project MAC" at MIT.
  cf: Weizenbaum, Joseph "ELIZA - A Computer Program For the Study of Natural Language
      Communication Between Man and Machine"
      in: Communications of the ACM; Volume 9 , Issue 1 (January 1966): p 36-45.
  JavaScript implementation by Norbert Landsteiner 2005; <http://www.masserk.at>

  Modified for our usage on 11/11/11 by Myles Grant
*/

var _dataParsed = false;

function eliza(){
	this.capitalizeFirstLetter=true;
	this.memSize=20;
	if (!this._dataParsed) this.eliza_init();
	this.eliza_reset();
}

function eliza_reset(){
	this.quit=false;
	this.mem=[];
	this.lastchoice=[];
	for (var k=0; k<this.elizaKeywords.length; k++) {
		this.lastchoice[k]=[];
		var rules=this.elizaKeywords[k][2];
		for (var i=0; i<rules.length; i++) this.lastchoice[k][i]=-1;
	}
}

function eliza_init() {
	// parse data and convert it from canonical form to internal use
	// prodoce synonym list
	var synPatterns={};
	for (var i in this.elizaSynons) synPatterns[i]='('+i+'|'+this.elizaSynons[i].join('|')+')';

	// 1st convert rules to regexps
	// expand synonyms and insert asterisk expressions for backtracking
	var sre=/@(\S+)/;
	var are=/(\S)\s*\*\s*(\S)/;
	var are1=/^\s*\*\s*(\S)/;
	var are2=/(\S)\s*\*\s*$/;
	var are3=/^\s*\*\s*$/;
	var wsre=/\s+/g;
	for (var k=0; k<this.elizaKeywords.length; k++) {
		var rules=this.elizaKeywords[k][2];
		this.elizaKeywords[k][3]=k; // save original index for sorting
		for (var i=0; i<rules.length; i++) {
			var r=rules[i];
			// check mem flag and store it as decomp's element 2
			if (r[0].charAt(0)=='$') {
				var ofs=1;
				while (r[0].charAt[ofs]==' ') ofs++;
				r[0]=r[0].substring(ofs);
				r[2]=true;
			}
			else {
				r[2]=false;
			}
			// expand synonyms (v.1.1: work around lambda function)
			var m=sre.exec(r[0]);
			while (m) {
				var sp=(synPatterns[m[1]])? synPatterns[m[1]]:m[1];
				r[0]=r[0].substring(0,m.index)+sp+r[0].substring(m.index+m[0].length);
				m=sre.exec(r[0]);
			}
			// expand asterisk expressions (v.1.1: work around lambda function)
			if (are3.test(r[0])) {
				r[0]='\\s*(.*)\\s*';
			}
			else {
				m=are.exec(r[0]);
				if (m) {
					var lp='';
					var rp=r[0];
					while (m) {
						lp+=rp.substring(0,m.index+1);
						if (m[1]!=')') lp+='\\b';
						lp+='\\s*(.*)\\s*';
						if ((m[2]!='(') && (m[2]!='\\')) lp+='\\b';
						lp+=m[2];
						rp=rp.substring(m.index+m[0].length);
						m=are.exec(rp);
					}
					r[0]=lp+rp;
				}
				m=are1.exec(r[0]);
				if (m) {
					var lp='\\s*(.*)\\s*';
					if ((m[1]!=')') && (m[1]!='\\')) lp+='\\b';
					r[0]=lp+r[0].substring(m.index-1+m[0].length);
				}
				m=are2.exec(r[0]);
				if (m) {
					var lp=r[0].substring(0,m.index+1);
					if (m[1]!='(') lp+='\\b';
					r[0]=lp+'\\s*(.*)\\s*';
				}
			}
			// expand white space
			r[0]=r[0].replace(wsre, '\\s+');
			wsre.lastIndex=0;
		}
	}
	// now sort keywords by rank (highest first)
	this.elizaKeywords.sort(this.eliza_sortKeywords);
	// and compose regexps and refs for pres and posts
	this.pres={};
	this.posts={};

	var a=[];
	for (var i=0; i<this.elizaPres.length; i+=2) {
		a.push(this.elizaPres[i]);
		this.pres[this.elizaPres[i]]=this.elizaPres[i+1];
	}
	this.preExp = new RegExp('\\b('+a.join('|')+')\\b');

	a=[];
	for (var i=0; i<this.elizaPosts.length; i+=2) {
		a.push(this.elizaPosts[i]);
		this.posts[this.elizaPosts[i]]=this.elizaPosts[i+1];
	}
	this.postExp = new RegExp('\\b('+a.join('|')+')\\b');

	// done
	this._dataParsed=true;
}

function eliza_sortKeywords(a,b) {
	// sort by rank
	if (a[1]>b[1]) return -1;
	else if (a[1]<b[1]) return 1;
	// or original index
	else if (a[3]>b[3]) return 1;
	else if (a[3]<b[3]) return -1;
	else return 0;
}

function eliza_transform(text) {
	var rpl='';
	this.quit=false;
	// unify text string
	text=text.toLowerCase();
	text=text.replace(/@#\$%\^&\*\(\)_\+=~`\{\[\}\]\|:;<>\/\\\t/g, ' ');
	text=text.replace(/\s+-+\s+/g, '.');
	text=text.replace(/\s*[,\.\?!;]+\s*/g, '.');
	text=text.replace(/\s*\bbut\b\s*/g, '.');
	text=text.replace(/\s{2,}/g, ' ');
	// split text in part sentences and loop through them
	var parts=text.split('.');
	for (var i=0; i<parts.length; i++) {
		var part=parts[i];
		if (part !== '') {
			// check for quit expression
			for (var q=0; q<elizaQuits.length; q++) {
				if (elizaQuits[q]==part) {
					this.quit=true;
					return this.getFinal();
				}
			}
			// preprocess (v.1.1: work around lambda function)
			var m=this.preExp.exec(part);
			if (m) {
				var lp='';
				var rp=part;
				while (m) {
					lp+=rp.substring(0,m.index)+this.pres[m[1]];
					rp=rp.substring(m.index+m[0].length);
					m=this.preExp.exec(rp);
				}
				part=lp+rp;
			}
			this.sentence=part;
			// loop trough keywords
			for (var k=0; k<this.elizaKeywords.length; k++) {
				if (part.search(new RegExp('\\b'+this.elizaKeywords[k][0]+'\\b', 'i'))>=0) {
					rpl = this.eliza_execRule(k);
				}
				if (rpl !== '') return rpl;
			}
		}
	}
	// nothing matched try mem
	rpl=this.eliza_memGet();
	// if nothing in mem, so try xnone
	if (rpl === '') {
		this.sentence=' ';
		var k = this.eliza_getRuleIndexByKey('xnone');
		if (k >= 0) rpl=this.eliza_execRule(k);
	}
	// return reply or default string
	return (rpl !== '')? rpl : 'I am at a loss for words.';
}

function eliza_execRule(k) {
	var rule=this.elizaKeywords[k];
	//log.info("rule: "+rule);
	var decomps=rule[2];
	var paramre=/\(([0-9]+)\)/;
	for (var i=0; i<decomps.length; i++) {
		log.info("decomps[i]: "+decomps[i]);
		var m=this.sentence.match(decomps[i][0]);
		if (m !== null) {
			var reasmbs=decomps[i][1];
			var memflag=decomps[i][2];
			var ri= Math.floor(Math.random()*reasmbs.length);
			if ((this.lastchoice[k][i]>ri) || (this.lastchoice[k][i]==ri)) {
				ri= ++this.lastchoice[k][i];
				if (ri>=reasmbs.length) {
					ri=0;
					this.lastchoice[k][i]=-1;
				}
			}
			else {
				this.lastchoice[k][i]=ri;
			}
			var rpl=reasmbs[ri];
			if (rpl.search('^goto ', 'i') === 0) {
				var ki=this.eliza_getRuleIndexByKey(rpl.substring(5));
				if (ki>=0) return this.eliza_execRule(ki);
			}
			// substitute positional params (v.1.1: work around lambda function)
			log.info('rpl: '+rpl);
			var m1=paramre.exec(rpl);
			log.info('m1: '+m1);
			if (m1) {
				var lp='';
				var rp=rpl;
				while (m1) {
					log.info('m1[1]: '+m1[1]);
					log.info('m: '+m);
					var param = m[intval(m1[1])];
					log.info('param: '+param);

					// postprocess param
					var m2=this.postExp.exec(param);
					log.info('m2: '+m2);
					if (m2) {
						var lp2='';
						var rp2=param;
						while (m2) {
							lp2+=rp2.substring(0,m2.index)+this.posts[m2[1]];
							rp2=rp2.substring(m2.index+m2[0].length);
							m2=this.postExp.exec(rp2);
						}
						param=lp2+rp2;
					}
					lp+=rp.substring(0,m1.index)+param;
					rp=rp.substring(m1.index+m1[0].length);
					m1=paramre.exec(rp);
				}
				rpl=lp+rp;
			}
			log.info('rpl: '+rpl);
			rpl=this.eliza_postTransform(rpl);
			log.info('rpl: '+rpl);
			if (memflag) this.eliza_memSave(rpl);
			else return rpl;
		}
	}
	return '';
}

function eliza_postTransform(s) {
	// final cleanings
	s=s.replace(/\s{2,}/g, ' ');
	s=s.replace(/\s+\./g, '.');
	for (var i=0; i<elizaPostTransforms.length; i+=2) {
		s=s.replace(elizaPostTransforms[i], elizaPostTransforms[i+1]);
		elizaPostTransforms[i].lastIndex=0;
	}

	// capitalize first char (v.1.1: work around lambda function)
	if (this.capitalizeFirstLetter) {
		var re=/^([a-z])/;
		var m=re.exec(s);
		if (m) s=m[0].toUpperCase()+s.substring(1);
	}
	return s;
}

function eliza_getRuleIndexByKey(key) {
	for (var k=0; k<this.elizaKeywords.length; k++) {
		if (this.elizaKeywords[k][0]==key) return k;
	}
	return -1;
}

function eliza_memSave(t) {
	this.mem.push(t);
	if (this.mem.length>this.memSize) this.mem.shift();
}

function eliza_memGet() {
	if (this.mem.length) {
		var n=Math.floor(Math.random()*this.mem.length);
		var rpl=this.mem[n];
		for (var i=n+1; i<this.mem.length; i++) this.mem[i-1]=this.mem[i];
		this.mem.length--;
		return rpl;
	}
	else return '';
}

function eliza_getFinal() {
	return elizaFinals[Math.floor(Math.random()*elizaFinals.length)];
}

function eliza_getInitial() {
	return elizaInitials[Math.floor(Math.random()*elizaInitials.length)];
}

// eof