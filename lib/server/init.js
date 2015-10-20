Maclaurin._coeff(1e300);
for (var i = 3; i < Infinity; i++){
	var conf = 1 - 1/(i*i*i);
	var aerf = Maclaurin._aerf(conf);
	if (aerf === undefined){
		var i_prev = i-1
		var conf_prev = 1 - 1/(i_prev*i_prev*i_prev)
		Wilson._confLimit = conf_prev;
		break;
	}
}