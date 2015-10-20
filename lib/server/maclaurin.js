Maclaurin = {_cache:{"0":1}};

Maclaurin._coeff = function(n){
	var cache = this._cache
	var sum = 0, memo = cache[n];
	if (n > (this._limit || Infinity))
		return Infinity;
	if (memo)
		return memo;
	var start = n%2?(n-1)/2:n/2;
	for (var i = start; i < n; i++){
		var k = n-i, j = k-1, l= i+1;
		var subsum = 0;
		var p = cache[i] || this._coeff(i);
		var q = cache[j] || this._coeff(j);
		if (p === Infinity)
			return this._purgeInf(i)
		subsum += 1 / (l*(l+i))
		if (i !== j){
			subsum += 1 / (k*(k+j))
		}
		subsum *= p*q;
		sum+=subsum;
	}
	if (sum === Infinity)
		return this._purgeInf(n)
	cache[n] = sum;
	return sum;
}

Maclaurin._aerf = function(a){
	if (a <= -1 || a >= 1){
		throw new Meteor.Error('domain','Erf^-1 argument must be in domain:(-1,1)')
	}
	var max = this._limit;
	var x = Math.sqrt(Math.PI)*a/2, truncSum = 0;
	var cache = this._cache;
	for (var i = 0; i < max+1; i++){
		var j = 2*i+1
		var cons = cache[i] || this._coeff(i);
		var term = Math.pow(x,j)*cons/j
		if (i === max && term > 1e-6){
			return undefined;
		}
		truncSum += term;
	}
	return truncSum;
}

Maclaurin._purgeInf = function(i){
	if (!this._limit){
		delete this._cache[i];
		this._limit = i-1;
		return Infinity;
	}
	return Infinity;
}