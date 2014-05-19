function Laguerre(n, a) {
    this.n = n;
    this.a = a;

    var opts = {
        setN: function(n) {
            this.n = n;
        },
        setA: function(a) {
            this.a = a;
        },
        eval: function(x) {
            var ret = 0;
            for (var i = 0; i <= n; i++) {
                ret += Math.pow(-1, i) * MathLib.combination(n + a, n - i) * Math.pow(x, i) / MathLib.factorial(i);
            }
            return ret;
        }
    };

    extend(this, opts);
    return this;
}