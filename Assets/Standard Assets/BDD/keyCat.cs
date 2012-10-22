// keyCat.cs
// Author: Johanna PHAM

using UnityEngine;
using System.Collections;
using System.Xml;
using System.IO;
using System.Net;
using System;
using System.Collections.Generic;

public class keyCat : MonoBehaviour{
	public static System.Collections.Generic.Dictionary<string,string> hashKeyCat;
	string keyXmlFileName = "keywords_categories_2.xml";

	void Awake () {
		DontDestroyOnLoad (transform.gameObject);
		// The hashtable is stored in memory and not destroyed
	}

	void Start(){
		// Loading the XML file stored on the tablet
		XmlTextReader textReader = new XmlTextReader(keyXmlFileName);
		XmlDocument doc = new XmlDocument();
		doc.Load(textReader);
		XmlNode node = doc.DocumentElement;
		// Debug.Log("Displaying the keyword XML...");
		// Parsing the XML and storing its data in a hashtable
		hashKeyCat = ParseKeyCat(node);
		Debug.Log("Nombre d'elements dans le hashKeyCat : " + hashKeyCat.Count);
		// Debugging
		// foreach (KeyValuePair<string,string> entry in hashKeyCat){
		//	Debug.Log("Key: " + entry.Key + "and value: " + entry.Value);
		//}
	}

	System.Collections.Generic.Dictionary<string,string> ParseKeyCat(XmlNode node){
		System.Collections.Generic.Dictionary<string,string> ht = new Dictionary<string,string>();
		try{
			int compteur = 0;
			//Debug.Log("Il y a :" + node.ChildNodes.Count + " keywords");
			foreach (XmlNode keyword in node.ChildNodes){
				string key = null;
				string value = null;
				foreach (XmlNode keyMetadata in keyword.ChildNodes){
					if (keyMetadata.Name == "keyword"){
						key = keyMetadata.InnerText;
					}
					else if (keyMetadata.Name == "category"){
						value = keyMetadata.InnerText;
						switch (value){
							case "0":
								value = "themes";
								break;
							case "1":
								value = "locations";
								break;
							case "2":
								value = "persons";
								break;
							case "3":
								value = "genre";
								break;
							case "4":
								value = "misc";
								break;
							case "5":
								value = "system";
								break;
						}
					}
					// else{
					//	Debug.Log("On est dans le else");
					//}
				}
				compteur++;
				ht.Add(key,value);
			}
		}

		catch (Exception ex){
			Console.Write("Error :" + ex.Message);
		}

		return ht;
	}

}