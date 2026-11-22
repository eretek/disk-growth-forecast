/*! Eretek Online Araçlar #45 — Disk Büyüme ve Dolum Tahmini */
ERT.def('45', {
	run: function (v, c) {
		var rate = v.rate, used = v.used, src = 'rate';
		if (v.d1 && v.d2 && v.u1 !== null && v.u2 !== null) {
			var t1 = Date.parse(v.d1), t2 = Date.parse(v.d2);
			if (!(t2 > t1)) { throw c.fe('d2', 'order'); }
			rate = (v.u2 - v.u1) / ((t2 - t1) / 86400000); used = v.u2; src = 'trend';
		}
		if (rate === null || rate === undefined) { throw c.fe('rate', 'needRate'); }
		if (used === null || used === undefined) { throw c.fe('used', 'req'); }
		if (used > v.cap) { throw c.fe('used', 'over'); }
		var th = v.cap * (v.th || 100) / 100, kv = [[c.t('rate'), c.n(rate, 2) + ' GB/' + c.t('day')], [c.t('free'), c.n(v.cap - used, 1) + ' GB'], [c.t('pct'), c.pct(used / v.cap)]], msgs = [], vv = { rate: Math.round(rate * 1000) / 1000 };
		if (rate <= 0) { msgs.push(['ok', c.t('noGrowth')]); vv.daysFull = null; }
		else {
			var dF = (v.cap - used) / rate, dT = (th - used) / rate, base = src === 'trend' ? Date.parse(v.d2) : Date.now();
			var fmt = function (d) { return new Date(base + d * 86400000).toISOString().slice(0, 10); };
			kv.push([c.t('toTh', { p: v.th || 100 }), dT <= 0 ? c.t('already') : c.n(Math.floor(dT), 0) + ' ' + c.t('days') + ' (' + fmt(dT) + ')'], [c.t('toFull'), c.n(Math.floor(dF), 0) + ' ' + c.t('days') + ' (' + fmt(dF) + ')']);
			vv.daysFull = Math.round(dF * 1000) / 1000; vv.daysTh = Math.round(dT * 1000) / 1000;
			msgs.push(dT <= 0 ? ['err', c.t('overTh')] : (dT < 30 ? ['warn', c.t('soon')] : ['ok', c.t('ok')]));
		}
		msgs.push(['info', c.t(src === 'trend' ? 'linTrend' : 'linRate')]);
		return { big: vv.daysFull === null ? c.t('noGrowthB') : c.t('big', { n: c.n(Math.floor(vv.daysFull), 0) }), kv: kv, msgs: msgs, v: vv };
	}
});
