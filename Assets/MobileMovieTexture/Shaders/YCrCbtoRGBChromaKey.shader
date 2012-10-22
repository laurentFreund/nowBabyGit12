//Shader "Color Space/YCrCbtoRGB Chroma Key" 
//{
//    Properties 
//    {
//        _YTex ("Y (RGB)", 2D) = "white" {}
//        _CrTex ("Cr (RGB)", 2D) = "white" {}
//        _CbTex ("Cb (RGB)", 2D) = "white" {}
//        _KeyYCrCb ("Key Color YCrCb", Vector) = (0,0,0,-0.6) 
//        _KeyScale ("Comparison Scale", Vector) = (0.2,1,1,4.5)  //Different CrCb means a more different color than a different Y
//    }
//    SubShader 
//    {
//		Tags {"Queue"="Transparent" "IgnoreProjector"="True" "RenderType"="Transparent"}
//        Pass 
//        {
//			Lighting Off Fog { Color (0,0,0,0) }
//			Blend SrcAlpha OneMinusSrcAlpha
//			ZWrite Off

//			CGPROGRAM
//			#pragma vertex vert
//			#pragma fragment frag
//
//			#include "UnityCG.cginc"
//
//			sampler2D _YTex;
//			sampler2D _CbTex;
//			sampler2D _CrTex;
//			half4 _KeyYCrCb;
//			half4 _KeyScale;
//
//			struct v2f 
//			{
//				float4  pos : SV_POSITION;
//				float2  uv : TEXCOORD0;
//			};
//
//			float4 _YTex_ST;
//			
//			v2f vert (appdata_base v)
//			{
//				v2f o;
//				o.pos = mul (UNITY_MATRIX_MVP, v.vertex);
//				o.uv = TRANSFORM_TEX (v.texcoord, _YTex);
//				return o;
//			}
//
//			half4 frag (v2f i) : COLOR
//			{
//				half4 YCbCr2R = half4(1.1643828125, 0, 1.59602734375, -.87078515625);
//				half4 YCbCr2G = half4(1.1643828125, -.39176171875, -.81296875, .52959375);
//				half4 YCbCr2B = half4(1.1643828125, 2.017234375, 0, -1.081390625);
//				
//				half4 yuvVec = half4(tex2D (_YTex, i.uv).r, tex2D (_CrTex, i.uv).g, tex2D (_CbTex, i.uv).b, 1.0);
//				
//				half4 rgbVec;
//				
//				rgbVec.x = dot(YCbCr2R, yuvVec);
//				rgbVec.y = dot(YCbCr2G, yuvVec);
//				rgbVec.z = dot(YCbCr2B, yuvVec);
//				
//				half3 deltaVec = (yuvVec.xyz - _KeyYCrCb.xyz) * _KeyScale.xyz;
//				
//				
//				rgbVec.w = (length(deltaVec) + _KeyYCrCb.w) * _KeyScale.w;
//			
//				
//				return rgbVec;
//			}
//			ENDCG
//
//		}
//	}
// }


Shader "Color Space/YCrCbtoRGB Chroma Key" 
{
    Properties 
    {
        _YTex ("Y (RGB)", 2D) = "white" {}
        _CrTex ("Cr (RGB)", 2D) = "white" {}
        _CbTex ("Cb (RGB)", 2D) = "white" {}
        _KeyYCrCb ("Key Color YCrCb", Vector) = (0,0,0,-0.6) 
        _KeyScale ("Comparison Scale", Vector) = (0.2,1,1,4.5)  //Different CrCb means a more different color than a different Y
    }
    SubShader 
    {
		Tags {"Queue"="Transparent" "IgnoreProjector"="True" "RenderType"="Transparent"}
        Pass 
        {
			Lighting Off Fog { Color (0,0,0,0) }
			Blend SrcAlpha OneMinusSrcAlpha
			ZWrite Off

			Program "vp" 
			{
				SubProgram "opengl " 
				{
					Keywords { }
					Bind "vertex" Vertex
					Bind "texcoord" TexCoord0
					Vector 5 [_YTex_ST]
						"!!ARBvp1.0
						PARAM c[6] = { program.local[0], state.matrix.mvp,program.local[5] };
						
						MAD result.texcoord[0].xy, vertex.texcoord[0], c[5], c[5].zwzw;
						DP4 result.position.w, vertex.position, c[4];
						DP4 result.position.z, vertex.position, c[3];
						DP4 result.position.y, vertex.position, c[2];
						DP4 result.position.x, vertex.position, c[1];
						END"
				}

				SubProgram "d3d9 " 
				{
					Keywords { }
					Bind "vertex" Vertex
					Bind "texcoord" TexCoord0
					Matrix 0 [glstate_matrix_mvp]
					Vector 4 [_YTex_ST]
						"vs_2_0
						dcl_position0 v0
						dcl_texcoord0 v1
						mad oT0.xy, v1, c4, c4.zwzw
						dp4 oPos.w, v0, c3
						dp4 oPos.z, v0, c2
						dp4 oPos.y, v0, c1
						dp4 oPos.x, v0, c0
						"
				}

				SubProgram "gles " 
				{
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
						uniform mediump vec4 _KeyYCrCb;
						uniform mediump vec4 _KeyScale;
						uniform sampler2D _CrTex;
						uniform sampler2D _CbTex;
						void main ()
						{
							mediump vec4 rgbVec;
							mediump vec4 yuvVec;
							lowp vec4 tmpvar_1;
							tmpvar_1.w = 1.0;
							tmpvar_1.x = texture2D (_YTex, xlv_TEXCOORD0).x;
							tmpvar_1.y = texture2D (_CrTex, xlv_TEXCOORD0).y;
							tmpvar_1.z = texture2D (_CbTex, xlv_TEXCOORD0).z;
							yuvVec = tmpvar_1;
							rgbVec.x = dot (vec4(1.16438, 0.0, 1.59603, -0.870785), yuvVec);
							rgbVec.y = dot (vec4(1.16438, -0.391762, -0.812969, 0.529594), yuvVec);
							rgbVec.z = dot (vec4(1.16438, 2.01723, 0.0, -1.08139), yuvVec);
							rgbVec.w = ((length (((yuvVec.xyz - _KeyYCrCb.xyz) * _KeyScale.xyz)) + _KeyYCrCb.w) * _KeyScale.w);
							gl_FragData[0] = rgbVec;
						}
					#endif"
				}

				SubProgram "glesdesktop " 
				{
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
						uniform mediump vec4 _KeyYCrCb;
						uniform mediump vec4 _KeyScale;
						uniform sampler2D _CrTex;
						uniform sampler2D _CbTex;
						void main ()
						{
							mediump vec4 rgbVec;
							mediump vec4 yuvVec;
							lowp vec4 tmpvar_1;
							tmpvar_1.w = 1.0;
							tmpvar_1.x = texture2D (_YTex, xlv_TEXCOORD0).x;
							tmpvar_1.y = texture2D (_CrTex, xlv_TEXCOORD0).y;
							tmpvar_1.z = texture2D (_CbTex, xlv_TEXCOORD0).z;
							yuvVec = tmpvar_1;
							rgbVec.x = dot (vec4(1.16438, 0.0, 1.59603, -0.870785), yuvVec);
							rgbVec.y = dot (vec4(1.16438, -0.391762, -0.812969, 0.529594), yuvVec);
							rgbVec.z = dot (vec4(1.16438, 2.01723, 0.0, -1.08139), yuvVec);
							rgbVec.w = ((length (((yuvVec.xyz - _KeyYCrCb.xyz) * _KeyScale.xyz)) + _KeyYCrCb.w) * _KeyScale.w);
							gl_FragData[0] = rgbVec;
						}
					#endif"
				}
			}
			
			Program "fp" 
			{
				SubProgram "opengl " 
				{
					Keywords { }
					Vector 0 [_KeyYCrCb]
					Vector 1 [_KeyScale]
					SetTexture 0 [_YTex] 2D
					SetTexture 1 [_CrTex] 2D
					SetTexture 2 [_CbTex] 2D
						"!!ARBfp1.0
						PARAM c[6] = { program.local[0..1],
								{ 1 },
								{ 1.1640625, 2.0175781, 0, -1.0810547 },
								{ 1.1640625, -0.3918457, -0.81298828, 0.52978516 },
								{ 1.1640625, 0, 1.5957031, -0.87060547 } };
						TEMP R0;
						TEMP R1;
						TEX R0.x, fragment.texcoord[0], texture[0], 2D;
						TEX R0.z, fragment.texcoord[0], texture[2], 2D;
						TEX R0.y, fragment.texcoord[0], texture[1], 2D;
						MOV R0.w, c[2].x;
						ADD R1.xyz, R0, -c[0];
						MUL R1.xyz, R1, c[1];
						DP3 R1.x, R1, R1;
						RSQ R1.x, R1.x;
						RCP R1.x, R1.x;
						ADD R1.x, R1, c[0].w;
						DP4 result.color.z, R0, c[3];
						DP4 result.color.y, R0, c[4];
						DP4 result.color.x, R0, c[5];
						MUL result.color.w, R1.x, c[1];
						END
						"
				}

				SubProgram "d3d9 " 
				{
					Keywords { }
					Vector 0 [_KeyYCrCb]
					Vector 1 [_KeyScale]
					SetTexture 0 [_YTex] 2D
					SetTexture 1 [_CrTex] 2D
					SetTexture 2 [_CbTex] 2D
						"ps_2_0
						dcl_2d s0
						dcl_2d s1
						dcl_2d s2
						def c2, 1.00000000, 0, 0, 0
						def c3, 1.16406250, 2.01757813, 0.00000000, -1.08105469
						def c4, 1.16406250, -0.39184570, -0.81298828, 0.52978516
						def c5, 1.16406250, 0.00000000, 1.59570313, -0.87060547
						dcl t0.xy
						texld r1, t0, s2
						texld r0, t0, s0
						mov_pp r1.x, r0.x
						texld r0, t0, s1
						mov_pp r1.y, r0.y
						add_pp r0.xyz, r1, -c0
						mul_pp r0.xyz, r0, c1
						dp3_pp r0.x, r0, r0
						mov_pp r1.w, c2.x
						rsq_pp r0.x, r0.x
						rcp_pp r0.x, r0.x
						add_pp r0.x, r0, c0.w
						mul_pp r0.w, r0.x, c1
						dp4_pp r0.z, r1, c3
						dp4_pp r0.x, r1, c5
						dp4_pp r0.y, r1, c4
						mov_pp oC0, r0
						"
				}

				SubProgram "gles " 
				{
					Keywords { }
					"!!GLES"
				}

				SubProgram "glesdesktop " 
				{
					Keywords { }
					"!!GLES"
				}

			}
		}
	}
 }