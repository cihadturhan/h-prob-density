function Complex(R, I) {
    var r;
    var i;

    if (typeof R == 'undefined') {
        r = 0;
        i = 0;
    } else if (R.constructor === Complex) {
        r = R.getReal();
        i = R.getImag();
    } else if (typeof I == 'undefined') {
        i = 0;
    } else {
        r = R;
        i = I;
    }

    var opts = {
        r: r,
        i: i,
        set: function(r, i) {
            this.r = r;
            this.i = i;
        },
        setReal: function(r) {
            this.r = r;
        },
        setImag: function(i) {
            this.i = i;
        },
        exp: function() {
            var result = new Complex(this);
            result.set(Math.exp(this.r) * Math.cos(this.i), Math.exp(this.r) * Math.sin(this.i));
            return result;
        },
        conjugate: function() {
            var result = new Complex(this);
            result.setImag(-this.i);
            return result;
        }, getReal: function() {
            return this.r;
        }, getImag: function() {
            return this.i;
        }, times: function(z) {
            if (z.constructor === Complex) {
                var result = new Complex(this);
                result.setReal(this.r * z.getReal() - this.i * z.getImag());
                result.setImag(this.i * z.getReal() + this.r * z.getImag());
                return result;
            } else {
                var result = new Complex(this);
                result.setReal(this.r * z);
                result.setImag(this.i * z);
                return result;
            }
        },
        plus: function(z) {
            if (z.constructor === Complex) {
                var result = new Complex(this);
                result.setReal(this.r + z.getReal());
                result.setImag(this.i + z.getImag());
                return result;
            } else {
                var result = new Complex(this);
                result.setReal(this.r + z);
                return result;
            }
        },
        minus: function(z) {
            if (z.constructor === Complex) {
                var result = new Complex(this);
                result.setReal(this.r - z.getReal());
                result.setImag(this.i - z.getImag());
                return result;
            } else {
                var result = new Complex(this);
                result.setReal(this.r - z);
                return result;
            }
        },
        length: function() {
            return this.times(this.conjugate()).getReal();
        }
    };

    extend(this, opts);

    return this;
}