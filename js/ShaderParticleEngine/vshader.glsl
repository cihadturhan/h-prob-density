uniform float duration;
uniform int hasPerspective;
attribute vec3 colorStart;
attribute vec3 colorMiddle;
attribute vec3 colorEnd;
attribute vec3 opacity;
attribute vec3 acceleration;
attribute vec3 velocity;
attribute float alive;
attribute float age;
attribute vec3 size;
attribute vec4 angle;
// values to be passed to the fragment shader
varying vec4 vColor;
varying float vAngle;
// Integrate acceleration into velocity and apply it to the particles position
vec4 GetPos() {
vec3 newPos = vec3( position );
// Move acceleration & velocity vectors to the value they
// should be at the current age
vec3 a = acceleration * age;
vec3 v = velocity * age;
// Move velocity vector to correct values at this age
v = v + (a * age);
// Add velocity vector to the newPos vector
newPos = newPos + v;
// Convert the newPos vector into world-space
vec4 mvPosition = modelViewMatrix * vec4( newPos, 1.0 );
    return mvPosition;
}
        
void main() {
    float positionInTime = (age / duration);
    float lerpAmount1 = (age / (0.5 * duration)); // percentage during first half
    float lerpAmount2 = ((age - 0.5 * duration) / (0.5 * duration)); // percentage during second half
    float halfDuration = duration / 2.0;
    float pointSize = 0.0;
    vAngle = 0.0;
    if( alive > 0.5 ) {
        // lerp the color and opacity
        if( positionInTime < 0.5 ) {
            vColor = vec4( mix(colorStart, colorMiddle, lerpAmount1), mix(opacity.x, opacity.y, lerpAmount1) );
        }
        else {
            vColor = vec4( mix(colorMiddle, colorEnd, lerpAmount2), mix(opacity.y, opacity.z, lerpAmount2) );
        }
         // Get the position of this particle so we can use it
          // when we calculate any perspective that might be required.
        vec4 pos = GetPos();
         // Determine the angle we should use for this particle.
        if( angle[3] == 1.0 ) {
            vAngle = -atan(pos.y, pos.x);
        }
        else if( positionInTime < 0.5 ) {
            vAngle = mix( angle.x, angle.y, lerpAmount1 );
        }
        else {
            vAngle = mix( angle.y, angle.z, lerpAmount2 );
        }
         // Determine point size.
        if( positionInTime < 0.5) {
            pointSize = mix( size.x, size.y, lerpAmount1 );
        }
        else {
            pointSize = mix( size.y, size.z, lerpAmount2 );
        }
        if( hasPerspective == 1 ) {
            pointSize = pointSize * ( 300.0 / length( pos.xyz ) );
        }
         // Set particle size and position
        gl_PointSize = pointSize;
        gl_Position = projectionMatrix * pos;
    }
    else {
// Hide particle and set its position to the (maybe) glsl
// equivalent of Number.POSITIVE_INFINITY
        vColor = vec4( 0.0, 0.0, 0.0, 0.0 );
        gl_Position = vec4(1000000000.0, 1000000000.0, 1000000000.0, 0.0);
    }
}