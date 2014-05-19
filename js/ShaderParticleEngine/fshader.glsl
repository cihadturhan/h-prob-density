uniform sampler2D texture;
uniform int colorize;
varying vec4 vColor;
varying float vAngle;

void main() {
    float c = cos(vAngle);
    float s = sin(vAngle);
    vec2 rotatedUV = vec2(c * (gl_PointCoord.x - 0.5) + s * (gl_PointCoord.y - 0.5) + 0.5,
    c * (gl_PointCoord.y - 0.5) - s * (gl_PointCoord.x - 0.5) + 0.5);
    vec4 rotatedTexture = texture2D( texture, rotatedUV );
    if( colorize == 1 ) {
        gl_FragColor = vColor * rotatedTexture;
    }
    else {
        gl_FragColor = rotatedTexture;
    }
}