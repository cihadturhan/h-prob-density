// ShaderParticleGroup 0.7.5
//
// (c) 2014 Luke Moody (http://www.github.com/squarefeet)
//     & Lee Stemkoski (http://www.adelphi.edu/~stemkoski/)
//
// Based on Lee Stemkoski's original work:
//    (https://github.com/stemkoski/stemkoski.github.com/blob/master/Three.js/js/ParticleEngine.js).
//
// ShaderParticleGroup may be freely distributed under the MIT license (See LICENSE.txt)

var SPE = SPE || {};

SPE.ready = function(callback) {
    var count = false;

    SPE.loadShader('js/ShaderParticleEngine/vshader.glsl', function(response) {
        SPE.shaders.vertex = response;
        count++;
        finished();
    });

    SPE.loadShader('js/ShaderParticleEngine/fshader.glsl', function(response) {
        SPE.shaders.fragment = response;
        count++;
        finished();
    });


    function finished() {
        if (count == 2 && callback && typeof callback === 'function') {
            callback();
        }
    }

};

SPE.Group = function(options) {
    var that = this;

    that.fixedTimeStep = parseFloat(typeof options.fixedTimeStep === 'number' ? options.fixedTimeStep : 0.016);

    // Uniform properties ( applied to all particles )
    that.maxAge = parseFloat(options.maxAge || 3);
    that.texture = options.texture || null;
    that.hasPerspective = parseInt(typeof options.hasPerspective === 'number' ? options.hasPerspective : 1, 10);
    that.colorize = parseInt(typeof options.colorize === 'number' ? options.colorize : 1, 10);

    // Material properties
    that.blending = typeof options.blending === 'number' ? options.blending : THREE.AdditiveBlending;
    that.transparent = typeof options.transparent === 'number' ? options.transparent : 1;
    that.alphaTest = typeof options.alphaTest === 'number' ? options.alphaTest : 0.5;
    that.depthWrite = options.depthWrite || false;
    that.depthTest = options.depthTest || true;

    // Create uniforms
    that.uniforms = {
        duration: {type: 'f', value: that.maxAge},
        texture: {type: 't', value: that.texture},
        hasPerspective: {type: 'i', value: that.hasPerspective},
        colorize: {type: 'i', value: that.colorize}
    };

    // Create a map of attributes that will hold values for each particle in this group.
    that.attributes = {
        acceleration: {type: 'v3', value: []},
        velocity: {type: 'v3', value: []},
        alive: {type: 'f', value: []},
        age: {type: 'f', value: []},
        size: {type: 'v3', value: []},
        angle: {type: 'v4', value: []},
        colorStart: {type: 'c', value: []},
        colorMiddle: {type: 'c', value: []},
        colorEnd: {type: 'c', value: []},
        opacity: {type: 'v3', value: []}
    };

    // Emitters (that aren't static) will be added to this array for
    // processing during the `tick()` function.
    that.emitters = [];

    // Create properties for use by the emitter pooling functions.
    that._pool = [];
    that._poolCreationSettings = null;
    that._createNewWhenPoolEmpty = 0;
    that.maxAgeMilliseconds = that.maxAge * 1000;

    // Create an empty geometry to hold the particles.
    // Each particle is a vertex pushed into this geometry's
    // vertices array.
    that.geometry = new THREE.Geometry();
    that.geometry.__dirtyVertices = true;

    // Create the shader material using the properties we set above.
    that.material = new THREE.ShaderMaterial({
        uniforms: that.uniforms,
        attributes: that.attributes,
        vertexShader: SPE.shaders.vertex,
        fragmentShader: SPE.shaders.fragment,
        blending: that.blending,
        transparent: that.transparent,
        alphaTest: that.alphaTest,
        depthWrite: that.depthWrite,
        depthTest: that.depthTest
    });

    // And finally create the ParticleSystem. It's got its `dynamic` property
    // set so that THREE.js knows to update it on each frame.
    that.mesh = new THREE.ParticleSystem(that.geometry, that.material);
};

SPE.Group.prototype = {
    updateEmitter: function(emitter) {
        var that = this;
        var vertices = that.geometry.vertices = [],
                start = 0,
                a = that.attributes,
                acceleration = a.acceleration.value = [],
                velocity = a.velocity.value = [],
                alive = a.alive.value = [],
                age = a.age.value = [],
                size = a.size.value = [],
                angle = a.angle.value = [],
                colorStart = a.colorStart.value = [],
                colorMiddle = a.colorMiddle.value = [],
                colorEnd = a.colorEnd.value = [],
                opacity = a.opacity.value = [];

        var dP, P0, P1, rp, Pmax = 0, numPts = 0, ptot = 0,
                p0, p1,
                d, rd, currPts, intVal, floatVal, i2 = 0, j2 = 0,
                angpMax = -Infinity, radpMax = -Infinity,
                angP = [],
                radP = [];


        for (var i = 0; i < radial.length; i++) {
            radP[i] = emitter.func.evalRad(radial[i]);
            if (radP[i] > radpMax) {
                radpMax = radP[i];
            }
        }

        for (var j = 0; j < angular.length; j++) {
            angP[j] = emitter.func.evalAng(angular[j].x, angular[j].y);
            if (angP[j] > angpMax) {
                angpMax = angP[j];
            }
        }


        Pmax = angpMax * radpMax;

        for (var i = 0; i < radial.length; i++) {
            for (var j = 0; j < angular.length; j++) {
                ptot += radP[i] * angP[j];
            }
        }

        var rl = radial.length, al = angular.length, alsqrt = Math.floor(Math.sqrt(al)), tincr = 2 * Math.PI / alsqrt;

        for (var i = 0; i < rl; i++) {
            for (var j = 0; j < al; j++) {
                i == rl ? (i2 = rl) : i2 = i + 1;
                j2 = (j + 1) % al;
                P0 = radP[i] * angP[j];
                //P1 = radP[i2] * angP[j2];
                dP = P0 / ptot;


                currPts = dP * emitter.particleCount;

                intVal = Math.floor(currPts);
                floatVal = currPts % 1;

                currPts = intVal + (floatVal > Math.random() ? 1 : 0);

                if (currPts > 0) {
                    p0 = new THREE.Vector3(radial[i], angular[j].x - tincr / 2, angular[j].y - tincr / 2);
                    p1 = new THREE.Vector3(radial[i2], angular[j].x + tincr / 2, angular[j].y + tincr / 2);

                    d = MathLib.sph2cart(p0).distanceTo(MathLib.sph2cart(p1));
                }


                for (var k = 0; k < currPts; k++) {
                    rp = randBtwVect(p0, p1);

                    vertices[numPts] = MathLib.sph2cart(rp);
                    velocity[numPts] = new THREE.Vector3();

                    alive[numPts] = (1.0);

                    age[numPts] = 0.0;

                    acceleration[numPts] = new THREE.Vector3();

                    size[numPts] = new THREE.Vector3(emitter.sizeStart, emitter.sizeStart, emitter.sizeStart);

                    angle[numPts] = new THREE.Vector4();

                    var color = new THREE.Color();
                    rd = MathLib.sph2cart(p0).distanceTo(vertices[numPts]);
                    var val = (Math.exp(P0 / Pmax) - 1) / (Math.E - 1);

                    color.setHSL(0.8 - val * 0.8, 0.8, 0.3 + val / 2);

                    colorStart[numPts] = color;
                    colorMiddle[numPts] = color;
                    colorEnd[numPts] = color;

                    opacity[numPts] = new THREE.Vector3(1, emitter.opacityMiddle, emitter.opacityEnd);
                    numPts++;
                }
            }
        }

        setCount(numPts);

        console.log(+new Date());
        console.log(vertices);


        // Cache properties on the emitter so we can access
        // them from its tick function.
        emitter.verticesIndex = parseFloat(start);
        emitter.attributes = a;
        emitter.vertices = that.geometry.vertices;
        emitter.maxAge = that.maxAge;
        emitter.particleCount = numPts;

        // Assign a unique ID to this emitter
        emitter.__id = that._generateID();

        return that;
    }
    /**
     * The main particle group update function. Call this once per frame.
     *
     * @param  {Number} dt
     * @return {this}
     */
};


// Extend ShaderParticleGroup's prototype with functions from utils object.
for (var i in SPE.utils) {
    SPE.Group.prototype[ '_' + i ] = SPE.utils[i];
}

SPE.loadShader = function(fileName, callback)
{

    function reqListener() {

        if (this.readyState == 4 && this.status == 200)
        {
            if (callback && typeof callback === 'function')
                callback(this.response);
        } else if (this.status >= 400 && this.status <= 501) {
            console.log('A problem occured ' + this.statusText);
        }
    }

    var oReq = new XMLHttpRequest();
    oReq.open("get", fileName, true);
    oReq.onreadystatechange = reqListener;
    oReq.send();
};


// The all-important shaders
SPE.shaders = {
    vertex: '',
    fragment: ''
};
