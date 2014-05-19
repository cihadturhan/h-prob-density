function extend(target, source) {
    target = target || {};
    for (var prop in source) {
        if (typeof source[prop] === 'object') {
            target[prop] = extend(target[prop], source[prop]);
        } else {
            target[prop] = source[prop];
        }
    }
    return target;
}

var MathLib = (function() {
    var log10Constant = Math.log(10.0);
    return {
        niceNumber: function(x, round) {
            var exp;
            var frac;
            var niceFrac;
            exp = Math.floor(this.log10(x));
            frac = x / Math.pow(10.0, exp);
            if (round) {
                if (frac < 1.5) {
                    niceFrac = 1.0;
                } else if (frac < 3.0) {
                    niceFrac = 2.0;
                } else if (frac < 7.0) {
                    niceFrac = 5.0;
                } else {
                    niceFrac = 10.0;
                }
            } else {
                if (frac <= 1.0001) {
                    niceFrac = 1.0;
                } else if (frac <= 2.0001) {
                    niceFrac = 2.0;
                } else if (frac <= 5.0001) {
                    niceFrac = 5.0;
                } else {
                    niceFrac = 10.0;
                }
            }
            return niceFrac * Math.pow(10.0, exp);
        },
        log10: function(x) {
            return Math.log(x) / log10Constant;
        },
        niceLabels: function(nLabel, minLabel, maxLabel) {
            var label = new Array(nLabel);
            var nfrac;
            var d;
            var graphmin, graphmax;
            var range, x;
            range = niceNumber(maxLabel - minLabel, true);
            d = niceNumber(range / (nLabel - 1), true);
            graphmin = Math.floor(minLabel / d) * d;
            graphmax = Math.ceil(maxLabel / d) * d;
            nfrac = Math.max(Math.floor(this.log10(d)), 0);
            for (var i = 0; i < nLabel; i++) {
                x = graphmin + i * d;
                label[i] = x;
            }

            return label;
        },
        niceLogLabels: function(nLabel, minLabel, maxLabel) {
            var minLogLabel = this.log10(minLabel);
            var maxLogLabel = this.log10(maxLabel);
            var niceLogLabel = this.niceLabels(nLabel, minLogLabel, maxLogLabel);
            for (var i = 0; i < nLabel; i++) {
                niceLogLabel[i] = MathLib.niceNumber(
                        Math.pow(10.0, niceLogLabel[i]), false);
            }
            return niceLogLabel;
        },
        cartesianToR: function(x, y, z) {
            return Math.sqrt(x * x + y * y + z * z);
        },
        cartesianToPhi: function(x, y, z) {
            if (arguments.length == 2) {
                if (y >= 0.0) {
                    return Math.acos(y / x);
                } else {
                    return -Math.acos(y / x);
                }
            } else {
                if (z >= 0.0) {
                    return Math.acos(z / this.cartesianToR(x, y, z));
                } else {
                    return -Math.acos(z / this.cartesianToR(x, y, z));
                }
            }
        },
        cartesianToTheta: function(x, y) {
            var pi = 4.0 * Math.atan(1.0);
            if (x == 0.0) {
                if (y >= 0.0)
                    return pi / 2.0;
                else
                    return -pi / 2.0;
            } else if (y == 0.0) {
                if (x >= 0.0)
                    return 0.0;
                else
                    return pi;
            } else {
                if (x >= 0.0)
                    return Math.atan(y / x);
                else
                    return Math.atan(y / x) + pi;
            }
        }

        , linearGrid: function(n, min, max) {

            var diff = (max - min) / (n - 1);
            var retval = new Array(n);
            retval[0] = min;
            retval[n - 1] = max;
            for (var i = 1; i < n - 1; i++) {
                retval[i] = retval[0] + diff * i;
            }

            return retval;
        },
        factorial: function(n) {
            var retval = 1;
            for (var i = 2; i <= n; i++) {
                retval *= i;
            }
            return retval;
        },
        doubleFactorial: function(l) {
            var retval = 1;
            for (var i = l; i >= 2; i -= 2)
                retval *= i;
            return retval;
        },
        combination: function(n, k) {
            return this.factorial(n) / (this.factorial(k) * this.factorial(n - k));
        },
        sph2cart: function(vect) {
            //r, theta, phi
            var z = vect.x * Math.sin(vect.z);
            var rcoselev = vect.x * Math.cos(vect.z);
            var x = rcoselev * Math.cos(vect.y);
            var y = rcoselev * Math.sin(vect.y);
            return new THREE.Vector3(x, y, z);
        }
    };
})();