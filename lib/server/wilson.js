Wilson = function(confidence){
	this.reset = function(confidence){
		if (!confidence || confidence < 0 || confidence >= 1){
			throw new Meteor.Error('domain','Confidence must be in domain:(0,1)');
		} else if (confidence > Wilson._confLimit){
			throw new Meteor.Error('singular','Not enough maclaurin terms to be accurate, lower confidence.');
		}
		this._Z = null;
		this._confidence = confidence
	}
	this.score = function(u, n, cb){
		var Z = this._Z || this._computeZ(this._confidence);
		var Z2 = Z*Z;
		var num1 = u+Z2/2;
		var num2 = Z*Math.sqrt(u*(1-(u/n))+Z2/4)
		var den = n+Z2
		var ci = [(num1-num2)/den, (num1+num2)/den]
		return cb ? cb(ci, u/n) : ci;
	}
	this._computeZ = function(confidence){
		var z = Math.SQRT2*this._aerf(confidence)
		this._Z = z;
		return z;
	}
	this.reset(confidence)
}

Wilson.lazyScore = function(u, n){
	return (u+1.9208 - 1.96*Math.sqrt(u*(1-u/n)+.9604))/(n+3.8416);
}

Wilson.prototype = Maclaurin;
