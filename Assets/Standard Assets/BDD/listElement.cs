// listElement.cs
// Author: Johanna PHAM

using UnityEngine;
using System.Collections;
using System.Collections.Generic;
using System.Xml;
using System.IO;
using System.Net;

public class listElement{
	public static readonly int pngNumb = 7;
	public static string resolution = "";
	public static readonly string path = "database_test/";
	public static readonly string pngPath = "medias/videos/frames/";
	public int id;
	public int mediatype;
	public string url;
	public string text;
	public int score;
	public string[] keyAreasDelimiters;
	public int associatedText;
	public int associatedAudio;
	public int associatedVideo;
	public string[] subtitles;
	public string[] subsDelimiters;
	public string[] png;
	public int previous;
	public int next;
	
	public listElement(int id, int mediatype, string url, string text, int score, List<string> keyAreasDelimiters, string associated_text, string associated_audio, string associated_video, List<string> subtitles, List<string> subsDelimiters, int previous, int next){
		this.id = id;
		this.mediatype = mediatype;
		
		if (string.IsNullOrEmpty(url) == false){
			if (mediatype == 2){
				this.url = xmlParsing.server_url + path + "medias/images/" + resolution + url;
			}
			else this.url = xmlParsing.server_url + path + url;
		}
		else this.url = "";
		
		this.text = text;
		this.score = score;
		if (keyAreasDelimiters != null)
			this.keyAreasDelimiters = keyAreasDelimiters.ToArray();
		else
			this.keyAreasDelimiters = null;
		
		if (string.IsNullOrEmpty(associated_text)) this.associatedText = -1;
		else this.associatedText = int.Parse(associated_text);

		if (string.IsNullOrEmpty(associated_audio)) this.associatedAudio = -1;
		else this.associatedAudio = int.Parse(associated_audio);
		
		if (string.IsNullOrEmpty(associated_video)) this.associatedVideo = -1;
		else this.associatedVideo = int.Parse(associated_video);

		if (subtitles != null)
			this.subtitles = subtitles.ToArray();
		else
			this.subtitles = null;
			
		if (subsDelimiters != null)
			this.subsDelimiters = subsDelimiters.ToArray();
		else
			this.subtitles = null;

		if (mediatype == 3){
			png = new string[pngNumb];
			string strUrl = url;
			// string directory = "";
			// while (strUrl.IndexOf('/') != -1){
				string[] temp = strUrl.Split('/');
				// directory += temp[0];
				strUrl = temp[temp.Length-1];
				Debug.Log("strUrl : " + strUrl);
			// }
			strUrl = (strUrl.Split('.'))[0];
			for (int j = 0; j < pngNumb; j++){
				int numFrame = j+1;
				png[j] = xmlParsing.server_url + path + pngPath + strUrl + "_frame_" + numFrame + ".png";
				Debug.Log("Adresse : " + png[j]);
			}
		}
		else{
			png = null;
		}
		
		this.previous = previous;
		this.next = next;
	}
}