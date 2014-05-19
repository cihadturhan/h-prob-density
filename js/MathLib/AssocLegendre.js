
function AssocLegendre(l, m) {

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
            return l;
        },
        getM: function() {
            return this.m;
        },
        eval: function(u) {
            if (l < 0 || this.m < 0 || this.m > l) {
                console.error("WARNING: improper values l,m = " + l + "," + this.m + ".");
            }
            var last, current, next;
            if (l < this.m) {
                current = 0.0;
            } else if (l == this.m && this.m == 0) {
                current = 1.0;
            } else {
                last = 0.0;
                if (this.m == 0) {
                    current = 1.0;
                } else {
                    current = MathLib.doubleFactorial(2 * this.m - 1) * Math.pow((1 - u * u), 0.5 * (this.m));
                }
                if (l != this.m) {
                    for (var k = this.m; k < l; k++) {
                        next = ((2 * k + 1) * u * current - (k + this.m) * last) / (k + 1 - this.m);
                        last = current;
                        current = next;
                    }
                }
            }
            return current;
        }
    };

    extend(this, opts);

    return this;
}

