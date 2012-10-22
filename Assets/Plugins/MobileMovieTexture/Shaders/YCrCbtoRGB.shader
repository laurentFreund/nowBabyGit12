// Shader "Color Space/YCrCbtoRGB" 
// {
    // Properties 
    // {
        // _YTex ("Y (RGB)", 2D) = "white" {}
        // _CbTex ("Cb (RGB)", 2D) = "white" {}
        // _CrTex ("Cr (RGB)", 2D) = "white" {}
    // }
    // SubShader 
    // {
		// Tags { "RenderType"="Opaque" }
        // Pass 
        // {
			// ColorMask RGB
			// Lighting Off Fog { Color (0,0,0,0) }

			// CGPROGRAM
			// #pragma vertex vert
			// #pragma fragment frag

			// #include "UnityCG.cginc"

			// sampler2D _YTex;
			// sampler2D _CbTex;
			// sampler2D _CrTex;

			// struct v2f 
			// {
				// float4  pos : SV_POSITION;
				// float2  uv : TEXCOORD0;
			// };

			// float4 _YTex_ST;
			
			// const half4x4 YCbCr2RGB = half4x4(
			// 1.1643828125, 0, 1.59602734375, -.87078515625,
			// 1.1643828125, -.39176171875, -.81296875, .52959375,
			// 1.1643828125, 2.017234375, 0, -1.081390625,
			// 0, 0, 0, 1);

			// v2f vert (appdata_base v)
			// {
				// v2f o;
				// o.pos = mul (UNITY_MATRIX_MVP, v.vertex);
				// o.uv = TRANSFORM_TEX (v.texcoord, _YTex);
				// return o;
			// }

			// half4 frag (v2f i) : COLOR
			// {
				// half4 yuvVec = half4(tex2D (_YTex, i.uv).r, tex2D (_CbTex, i.uv).g, tex2D (_CrTex, i.uv).b, 1.0);
				
				// half4 rgbVec; // = mul(YCbCr2RGB,yuvVec);
				
				// rgbVec.x = dot(YCbCr2RGB[0], yuvVec);
				// rgbVec.y = dot(YCbCr2RGB[1], yuvVec);
				// rgbVec.z = dot(YCbCr2RGB[2], yuvVec);
				// rgbVec.w = 1.0f;
			
				
				// return rgbVec;
			// }
			// ENDCG

		// }
	// }
// Fallback "VertexLit"
// }


Shader "Color Space/YCrCbtoRGB" 
{
    Properties 
    {
        _YTex ("Y (RGB)", 2D) = "white" {}
        _CbTex ("Cb (RGB)", 2D) = "white" {}
        _CrTex ("Cr (RGB)", 2D) = "white" {}
    }
    SubShader 
    {
		Tags { "RenderType"="Opaque" }
        Pass 
        {
			ColorMask RGB
			Lighting Off Fog { Color (0,0,0,0) }

			Program "vp" {
// Vertex combos: 1
//   opengl - ALU: 5 to 5
//   d3d9 - ALU: 5 to 5
SubProgram "opengl " {
Keywords { }
Bind "vertex" Vertex
Bind "texcoord" TexCoord0
Vector 5 [_YTex_ST]
"!!ARBvp1.0
# 5 ALU
PARAM c[6] = { program.local[0],
		state.matrix.mvp,
		program.local[5] };
MAD result.texcoord[0].xy, vertex.texcoord[0], c[5], c[5].zwzw;
DP4 result.position.w, vertex.position, c[4];
DP4 result.position.z, vertex.position, c[3];
DP4 result.position.y, vertex.position, c[2];
DP4 result.position.x, vertex.position, c[1];
END
# 5 instructions, 0 R-regs
"
}

SubProgram "d3d9 " {
Keywords { }
Bind "vertex" Vertex
Bind "texcoord" TexCoord0
Matrix 0 [glstate_matrix_mvp]
Vector 4 [_YTex_ST]
"vs_2_0
; 5 ALU
dcl_position0 v0
dcl_texcoord0 v1
mad oT0.xy, v1, c4, c4.zwzw
dp4 oPos.w, v0, c3
dp4 oPos.z, v0, c2
dp4 oPos.y, v0, c1
dp4 oPos.x, v0, c0
"
}

SubProgram "gles " {
Keywords { }
"!!GLES
#define SHADER_API_GLES 1
#define tex2D texture2D


#ifdef VERTEX
#define gl_ModelViewProjectionMatrix glstate_matrix_mvp
uniform mat4 glstate_matrix_mvp;

varying highp vec2 xlv_TEXCOORD0;

uniform highp vec4 _YTex_ST;
attribute vec4 _glesMultiTexCoord0;
attribute vec4 _glesVertex;
void main ()
{
  gl_Position = (gl_ModelViewProjectionMatrix * _glesVertex);
  xlv_TEXCOORD0 = ((_glesMultiTexCoord0.xy * _YTex_ST.xy) + _YTex_ST.zw);
}



#endif
#ifdef FRAGMENT

varying highp vec2 xlv_TEXCOORD0;
uniform sampler2D _YTex;
uniform sampler2D _CrTex;
uniform sampler2D _CbTex;
void main ()
{
  mediump vec4 rgbVec;
  mediump vec4 yuvVec;
  lowp vec4 tmpvar_1;
  tmpvar_1.w = 1.0;
  tmpvar_1.x = texture2D (_YTex, xlv_TEXCOORD0).x;
  tmpvar_1.y = texture2D (_CbTex, xlv_TEXCOORD0).y;
  tmpvar_1.z = texture2D (_CrTex, xlv_TEXCOORD0).z;
  yuvVec = tmpvar_1;
  rgbVec.x = dot (vec4(1.16438, 0.0, 1.59603, -0.870785), yuvVec);
  rgbVec.y = dot (vec4(1.16438, -0.391762, -0.812969, 0.529594), yuvVec);
  rgbVec.z = dot (vec4(1.16438, 2.01723, 0.0, -1.08139), yuvVec);
  rgbVec.w = 1.0;
  gl_FragData[0] = rgbVec;
}



#endif"
}

SubProgram "glesdesktop " {
Keywords { }
"!!GLES
#define SHADER_API_GLES 1
#define tex2D texture2D


#ifdef VERTEX
#define gl_ModelViewProjectionMatrix glstate_matrix_mvp
uniform mat4 glstate_matrix_mvp;

varying highp vec2 xlv_TEXCOORD0;

uniform highp vec4 _YTex_ST;
attribute vec4 _glesMultiTexCoord0;
attribute vec4 _glesVertex;
void main ()
{
  gl_Position = (gl_ModelViewProjectionMatrix * _glesVertex);
  xlv_TEXCOORD0 = ((_glesMultiTexCoord0.xy * _YTex_ST.xy) + _YTex_ST.zw);
}



#endif
#ifdef FRAGMENT

varying highp vec2 xlv_TEXCOORD0;
uniform sampler2D _YTex;
uniform sampler2D _CrTex;
uniform sampler2D _CbTex;
void main ()
{
  mediump vec4 rgbVec;
  mediump vec4 yuvVec;
  lowp vec4 tmpvar_1;
  tmpvar_1.w = 1.0;
  tmpvar_1.x = texture2D (_YTex, xlv_TEXCOORD0).x;
  tmpvar_1.y = texture2D (_CbTex, xlv_TEXCOORD0).y;
  tmpvar_1.z = texture2D (_CrTex, xlv_TEXCOORD0).z;
  yuvVec = tmpvar_1;
  rgbVec.x = dot (vec4(1.16438, 0.0, 1.59603, -0.870785), yuvVec);
  rgbVec.y = dot (vec4(1.16438, -0.391762, -0.812969, 0.529594), yuvVec);
  rgbVec.z = dot (vec4(1.16438, 2.01723, 0.0, -1.08139), yuvVec);
  rgbVec.w = 1.0;
  gl_FragData[0] = rgbVec;
}



#endif"
}

}
Program "fp" {
// Fragment combos: 1
//   opengl - ALU: 8 to 8, TEX: 3 to 3
//   d3d9 - ALU: 6 to 6, TEX: 3 to 3
SubProgram "opengl " {
Keywords { }
Matrix 0 [YCbCr2RGB]
SetTexture 0 [_YTex] 2D
SetTexture 1 [_CbTex] 2D
SetTexture 2 [_CrTex] 2D
"!!ARBfp1.0
# 8 ALU, 3 TEX
PARAM c[5] = { program.local[0..3],
		{ 1 } };
PARAM c0 = { 1.1643828125, 0, 1.59602734375, -.87078515625 };
PARAM c1 = { 1.1643828125, -.39176171875, -.81296875, .52959375 };
PARAM c2 = { 1.1643828125, 2.017234375, 0, -1.081390625 };	
#PARAM c[4] = { 1.00000000, 0, 0, 0 };
TEMP R0;
TEX R0.x, fragment.texcoord[0], texture[0], 2D;
TEX R0.y, fragment.texcoord[0], texture[1], 2D;
TEX R0.z, fragment.texcoord[0], texture[2], 2D;
MOV R0.w, c[4].x;
DP4 result.color.z, R0, c2;
DP4 result.color.y, R0, c1;
DP4 result.color.x, R0, c0;
MOV result.color.w, c[4].x;
END
# 8 instructions, 1 R-regs
"
}

SubProgram "d3d9 " {
Keywords { }
Matrix 0 [YCbCr2RGB]
SetTexture 0 [_YTex] 2D
SetTexture 1 [_CbTex] 2D
SetTexture 2 [_CrTex] 2D
"ps_2_0
; 6 ALU, 3 TEX
dcl_2d s0
dcl_2d s1
dcl_2d s2
def c0, 1.1643828125, 0, 1.59602734375, -.87078515625
def c1, 1.1643828125, -.39176171875, -.81296875, .52959375
def c2,	1.1643828125, 2.017234375, 0, -1.081390625
def c3,	0, 0, 0, 1.00000000
dcl t0.xy
texld r0, t0, s2
mov_pp r1.z, r0.z
texld r0, t0, s0
mov_pp r1.x, r0.x
texld r0, t0, s1
mov_pp r1.y, r0.y
mov_pp r1.w, c3.w
dp4_pp r0.z, r1, c2
dp4_pp r0.x, r1, c0
dp4_pp r0.y, r1, c1
mov_pp r0.w, c3.w 
mov_pp oC0, r0
"
}

SubProgram "gles " {
Keywords { }
"!!GLES"
}

SubProgram "glesdesktop " {
Keywords { }
"!!GLES"
}

}

#LINE 63


		}
	}
Fallback "VertexLit"
}
