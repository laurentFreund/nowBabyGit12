// loadHashtable.cs
// Author: Johanna PHAM

using UnityEngine;
using System.Collections;
using System.Xml;
using System.IO;
using System.Net;
using System;
using System.Collections.Generic;

public class loadHashtable : MonoBehaviour{
	public static System.Collections.Generic.Dictionary<int,mediaItem> mediasHashtable;
	public static System.Collections.Generic.Dictionary<string,int> keywordWeight;
	public static string xmlFileName;
	public static string keyXmlFileName;
	public static System.Collections.Generic.Dictionary<string,string> backgrounds;

	public static System.Collections.Generic.Dictionary<string,int> categoryWeight;
	public static System.Collections.Generic.Dictionary<string,int> mediatypeWeight;
	public static System.Collections.Generic.Dictionary<string,int[]> acceptedDimensions;
	public static int authorsWeight;

	void Awake () {
		DontDestroyOnLoad (transform.gameObject);
		// The hashtable is stored in memory and not destroyed
	}

	void Start(){
	}
	
	public static void load(){
		Debug.Log("COUCOUUUUUUUUUUU");

		xmlFileName = Application.persistentDataPath + "/database.xml";
		keyXmlFileName = Application.persistentDataPath + "/keywords.xml";

		// Loading the XML file stored on the tablet
		XmlTextReader textReader = new XmlTextReader(xmlFileName);
		XmlDocument doc = new XmlDocument();
		doc.Load(textReader);
		XmlNode node = doc.DocumentElement;
		// Debug.Log("Displaying the database XML...");
		// Parsing the XML and storing its data in a hashtable
		mediasHashtable = ParseNode(node);
		Debug.Log("Nombre d'elements dans mediasHashtable : " + mediasHashtable.Count);
		// Debug.Log("YOOOOOO");

		// foreach (int key in mediasHashtable.Keys){
		//	Debug.Log("Cle (id) : " + key);
			//Debug.Log("Valeur du titre : " + (mediasHashtable[key]).title);
		//}

		// Loading the XML file stored on the tablet
		XmlTextReader textReader2 = new XmlTextReader(keyXmlFileName);
		//XmlDocument doc2 = new XmlDocument();
		doc.Load(textReader2);
		XmlNode node2 = doc.DocumentElement;
		// Debug.Log("Displaying the keyword XML...");
		// Parsing the XML and storing its data in a hashtable
		keywordWeight = ParseKey(node2);
		Debug.Log("Nombre d'elements dans le keywordWeight : " + keywordWeight.Count);
		
		categoryWeight = new Dictionary<string,int>{{"themes",1},{"locations",1},{"persons",1},{"genre",1},{"misc",1},{"system",1}};
		mediatypeWeight = new Dictionary<string,int>{{"0",1},{"1",1},{"2",1},{"3",1}};
		acceptedDimensions = new Dictionary<string,int[]>{{"length", new int[]{0,0}},{"weight", new int[]{0,0}},{"height", new int[]{0,0}},{"width", new int[]{0,0}}};
		authorsWeight = 1;
		
		/*foreach (string key in keywordWeight.Keys){
			Debug.Log("Cle (keyword) : " + key);
		}*/
	
	}

	public static System.Collections.Generic.Dictionary<int,mediaItem> ParseNode(XmlNode node){
		System.Collections.Generic.Dictionary<int,mediaItem> ht = new Dictionary<int,mediaItem>();
		// loop through all nodes
		try{
			foreach (XmlNode media in node.ChildNodes){
				// Debug.Log("node a " + node.ChildNodes.Count + " enfants");
				System.Collections.Generic.Dictionary<string,string> mediaValue = new Dictionary<string,string>();
				int key = 0;
				foreach (XmlNode metadata in media.ChildNodes){
					if (metadata.Name == "id"){
						key = Convert.ToInt32(metadata.InnerText);
					}
					else{
						if (metadata.InnerText == null){
							mediaValue.Add(metadata.Name, "");
						}
						else{
							mediaValue.Add(metadata.Name, metadata.InnerText);
						}
					}
				}
				mediaItem itemValue = new mediaItem(mediaValue);
				ht.Add(key,itemValue);
				// Debug.Log("Un media a un titre : " + ht[key].mediaData["title"]);
			}
		}

		catch (Exception ex){
			Console.Write("Error :" + ex.Message);
		}

		return ht;
	}
	
	public static System.Collections.Generic.Dictionary<string,int> ParseKey(XmlNode node){
		backgrounds = new Dictionary<string,string>();
		System.Collections.Generic.Dictionary<string,int> ht = new Dictionary<string,int>();
		// loop through all nodes
		try{
			int compteur = 0;
			Debug.Log("Il y a : " + node.ChildNodes.Count + " keywords");
			foreach (XmlNode keyword in node.ChildNodes){
				string key = null;
				int keywordValue = 1;
				string backgroundUrl = null;
				foreach (XmlNode keyMetadata in keyword.ChildNodes){
					if (keyMetadata.Name == "keyword"){
						key = keyMetadata.InnerText;
						//Debug.Log("Voici la " + compteur + " cle : " + key);
					}
					if (keyMetadata.Name == "background" && string.IsNullOrEmpty(keyMetadata.InnerText) == false){
						backgroundUrl = keyMetadata.InnerText;
						// Debug.Log("Voici le background : " + backgroundUrl);
					}
				}
				compteur++;
				// Debug.Log("Valeur du compteur : " + compteur);
				ht.Add(key,keywordValue);
				if (string.IsNullOrEmpty(backgroundUrl) == false){
					// Debug.Log("COUCOUUUUUUUU");
					backgrounds.Add(key,backgroundUrl);
					// Debug.Log("CONCON");
				}
			}
			// Debug.Log("Compteur au final vaut : " + compteur);
		}

		catch (Exception ex){
			Debug.Log("Error :" + ex.Message);
		}

		return ht;
	}

}