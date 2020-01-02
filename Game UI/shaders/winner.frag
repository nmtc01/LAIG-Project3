#ifdef GL_ES
precision highp float;
#endif

varying vec2 vTextureCoord;
varying vec3 vCoords;
uniform sampler2D uSampler;

uniform float timeFactor;

void main() { 
    vec4 color = texture2D(uSampler, vTextureCoord);

	gl_FragColor = color;
}