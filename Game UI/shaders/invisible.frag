#ifdef GL_ES
precision highp float;
#endif

uniform sampler2D uSampler;
varying vec2 vTextureCoord;

void main(){
	discard;
	gl_FragColor = texture2D(uSampler, vTextureCoord);
}