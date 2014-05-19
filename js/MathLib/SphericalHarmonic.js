function SphericalHarmonic(l, m) {

    if (arguments.length == 0) {
        this.l = 0;
        this.m = 0;
    } else if (arguments.length == 2) {
        this.l = l;
        this.m = m;
    }

    var opts = {
        setL: function(l) {
            this.l = l;
        },
        setM: function(m) {
            this.m = m;
        },
        setLM: function(l, m) {
            this.l = l;
            this.m = m;
        },
        getL: function() {
            return this.l;
        },
        getM: function() {
            return this.m;
        },
        eval: function(theta, phi) {
            var absm = Math.abs(this.m);
            var sign;
            if (absm % 2 == 1)
                sign = -1.0;
            else
                sign = 1.0;
            var P = new AssocLegendre(this.l, absm);
            var retval = new Complex(0.0, absm * phi);
            retval = retval.exp();
            var factor = sign *
                    Math.sqrt((2 * this.l + 1) / (4.0 * Math.PI) *
                            MathLib.factorial(this.l - this.m) / MathLib.factorial(this.l + this.m)) *
                    P.eval(Math.cos(theta));
            retval = retval.times(factor);

            if (this.m < 0) {
                retval = retval.conjugate();
                retval = retval.times(sign);
            }
            return retval;
        }
    };

    extend(this, opts);
    return this;
}
