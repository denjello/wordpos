
var uubench = require('uubench'),
	fs = require('fs'),
	_ = require('underscore')._,
	WordPOS = require('./wordpos'),
	wordpos = new WordPOS('dict');

suite = new uubench.Suite({
  type: 'fixed',
  iterations: 10,
  //delay: 750,
  sync: true,
	
  start: function(tests){
    console.log('starting %d tests', tests.length);
  },

  result: function(name, stats){
    var persec = 1000 / stats.elapsed
      , ops = .5 + stats.iterations * persec;
    
    console.log('  \033[90m%s : \033[36m%d \033[90mops/s\033[0m', name, ops | 0, stats);
	pos && console.log(out(pos));
  },
  
  done: function(time){
    console.log('done in %d msecs', time );
  },
  
  section: function(name, stats) {
	console.log('\033[35m%s\033[0m',name);
  }
});


function out(res){
	return _(res).keys().map(function(k){ return k + ':' + res[k].length });
}



var	text1 = 'laksasdf', 
	text128 = fs.readFileSync('text-128.txt', 'utf8'),
	text,
	pos,
	str = "This is some sample text. This text can contain multiple sentences. It also works with urls like.";


function getPOS(next){
	wordpos.getPOS(text, function(res){
		pos = res;
		next();
	});
}

function getNouns(next){
	wordpos.getNouns(text, function(res){
		pos = {nouns: res};
		next();
	});
}

function getVerbs(next){
	wordpos.getVerbs(text, function(res){
		pos = {verbs: res};
		next();
	});
}

function getAdjectives(next){
	wordpos.getAdjectives(text, function(res){
		pos = {adjectives: res};
		next();
	});
}

function getAdverbs(next){
	wordpos.getAdverbs(text, function(res){
		pos = {adverbs: res};
		next();
	});
}

/*
 * one word
 */
suite.section('--1 word--', function(next){
	text = text1;
	next();
});
suite.bench('getPOS', getPOS);
suite.bench('getNouns', getNouns);
suite.bench('getVerbs', getVerbs);
suite.bench('getAdjectives', getAdjectives);
suite.bench('getAdverbs', getAdverbs);


/*
 * 128 words
 */
suite.section('--128 words--', function(next){
	suite.options.iterations = 1;
	text = text128;
	next();
});
suite.bench('getPOS', getPOS);
suite.bench('getNouns', getNouns);
suite.bench('getVerbs', getVerbs);
suite.bench('getAdjectives', getAdjectives);
suite.bench('getAdverbs', getAdverbs);


suite.run();
