#ifdef GL_ES
precision highp float;
#endif

varying vec2 vTextureCoord;
varying vec3 vCoords;
uniform sampler2D uSampler;

void main(){
    vec4 color = texture2D(uSampler, vTextureCoord);
    //dym rectangle  - done 
    vec4 fragColor = vec4(color.rgb * 2.0,1.0);
    color = vec4(0.2,0.2,0.2,1.0);
    fragColor += color;

	gl_FragColor = fragColor;
}