#ifdef GL_ES
precision highp float;
#endif

varying vec2 vTextureCoord;
varying vec3 vCoords;
uniform sampler2D uSampler;

void main(){
    vec4 color = texture2D(uSampler, vTextureCoord);
    color += vec4(0.0,0.2,0.0,1.0);
    if (color.r > 0.5)
        color.r = 0.5;
    if (color.b > 0.5)
        color.b = 0.5;

	gl_FragColor = color;
}