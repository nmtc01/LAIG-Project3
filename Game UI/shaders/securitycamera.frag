#ifdef GL_ES
precision highp float;
#endif

varying vec2 vTextureCoord;
varying vec3 vCoords;
uniform sampler2D uSampler;

uniform float timeFactor;

void main() {
    vec2 vAtualTextureCoord = vec2(vTextureCoord.x,1.0-vTextureCoord.y); 
    vec4 color = texture2D(uSampler, vAtualTextureCoord);
    //dym rectangle  - done 
    vec4 fragColor = vec4(color.rgb * 2.0 * (0.5-sqrt((vTextureCoord.x-0.5)*(vTextureCoord.x-0.5)+(vTextureCoord.y-0.5)*(vTextureCoord.y-0.5))),1.0);
    //noise
    if(mod(-vAtualTextureCoord.y * 20.0 + timeFactor, 2.0) > 1.0) { // - to invert line flow 
        color = vec4(0.2,0.2,0.2,1.0);

        fragColor += color;
    }

	gl_FragColor = fragColor;
}