
function Diffeq(j) {

    /*this.neq = j;
     this.x = new Array(this.neq);
     this.der = new Array(this.neq);
     this.x_old = new Array(this.neq);
     this.der_old = new Array(this.neq);
     this.k1 = new Array(this.neq);
     this.k2 = new Array(this.neq);
     this.k3 = new Array(this.neq);
     this.k4 = new Array(this.neq);**/

    for (var i = 0; i < this.neq; i++) {
        this.x[i] = 0.0;
        this.der[i] = 0.0;
        this.x_old[i] = 0.0;
        this.der_old[i] = 0.0;
        this.k1[i] = 0.0;
        this.k2[i] = 0.0;
        this.k3[i] = 0.0;
        this.k4[i] = 0.0;
    }
    this.time = 0.0;

    var opts = {
        updateEuler: function(step) {
            for (var i = 0; i < this.neq; i++) {
                x_old[i] = this.x[i];
            }
            this.deriv(this.neq, this.time, this.x, der);
            for (var i = 0; i < this.neq; i++) {
                this.x[i] = this.x[i] + step * der[i];
            }
            this.time = this.time + step;
        },
        updateIEuler: function(step) {
            for (var i = 0; i < this.neq; i++) {
                x_old[i] = this.x[i];
            }

            this.this.deriv(this.neq, this.time, this.x, der);

            for (var i = 0; i < this.neq; i++) {
                der_old[i] = der[i];
                this.x[i] = this.x[i] + step * der[i];
            }
            this.deriv(this.neq, this.time, this.x, der);

            for (var i = 0; i < this.neq; i++) {
                this.x[i] = x_old[i] + step * 0.5 * (der[i] +
                        der_old[i]);
            }
            this.time = this.time + step;
        },
        updateRKutta4: function(step) {
            for (var i = 0; i < this.neq; i++) {
                x_old[i] = this.x[i];
            }
            var time_old = this.time;
            this.deriv(this.neq, this.time, this.x, der);
            for (var i = 0; i < this.neq; i++) {
                k1[i] = step * der[i];
                this.x[i] = x_old[i] + 0.5 * k1[i];
            }
            this.time = time_old + step / 2.0;
            this.deriv(this.neq, this.time, this.x, der);
            for (var i = 0; i < this.neq; i++) {
                k2[i] = step * der[i];
                this.x[i] = x_old[i] + 0.5 * k2[i];
            }
            this.deriv(this.neq, this.time, this.x, der);
            this.time = time_old + step;
            for (var i = 0; i < this.neq; i++) {
                k3[i] = step * der[i];
                this.x[i] = x_old[i] + k3[i];
            }
            this.deriv(this.neq, this.time, this.x, der);
            var con6 = 1.0 / 6.0;
            for (var i = 0; i < this.neq; i++) {
                k4[i] = step * der[i];
                this.x[i] = x_old[i] + (k1[i] + 2.0 * k2[i] + 2.0 * k3[i] + k4[i]) * con6;
            }
        },
        deriv: function(n, t, xd, xdp) {

        }

    };

    extend(this, opts);

    return this;
}


function diffeqDriver(j) {
    extend(this, new Diffeq(j));

    this.init = function(j) {
        var theEquation = new diffeqDriver(2);

        var initialTime = 0.0;
        var finalTime = 1.05;
        var timeStep = 0.05;

        theEquation.x[0] = 1.0;
        theEquation.x[1] = 0.0;

        onsole.log("Time\t\tx0\t\tx1");

        while (theEquation.time <= finalTime) {
            console.log(this.round(theEquation.time) + "\t\t" + this.round(theEquation.x[0]) + "\t\t" + this.round(theEquation.x[1]));
            theEquation.updateRKutta4(timeStep);
        }
    }

    this.deriv = function(n, time, x, der) {
        this.der[0] = x[1];
        this.der[1] = -4 * Math.PI * Math.PI * x[0];
    };

    this.round = function(x) {
        var y = x * 10000.0;
        y += 0.5;
        y = Math.float(y);
        y /= 10000.0;
        return y;
    };

    return this;

}