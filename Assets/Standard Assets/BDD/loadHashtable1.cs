// loadHashtable1.cs
// Author: Johanna PHAM

using UnityEngine;
using System.Collections;
using System.Xml;
using System.IO;
using System.Net;
using System;
using System.Collections.Generic;

public class loadHashtable1 : MonoBehaviour{
		public static Hashtable hash;
		
		void Awake () {
		DontDestroyOnLoad (transform.gameObject);
		// The hashtable is stored in memory and not destroyed
	}

	void Start(){
		// Loading the XML file stored on the tablet
		XmlTextReader textReader = new XmlTextReader("database.xml");
		XmlDocument doc = new XmlDocument();
		doc.Load(textReader);
		XmlNode node = doc.DocumentElement;
		Debug.Log("Displaying the XML...");
		// Parsing the XML and storing its data in a hashtable
		hash = ParseNode(node);
		Debug.Log("I'm here!");
		
foreach (Hashtable item in (List<Hashtable>)hash["inb_medias_1"]){
	Debug.Log("id: " + item["id"]);
	Debug.Log("title: " + item["title"]);
	Debug.Log("");
}
	}

	Hashtable ParseNode(XmlNode node){
		Hashtable ht = new Hashtable();
		// loop through all nodes within the node
		try{
			foreach (XmlNode n in node.ChildNodes){
				string name = n.Name;
				object value = null;
				// if it has nodes within this node, and more than just one, then parse them
				if (n.HasChildNodes){
					if (n.ChildNodes.Count > 1){
						value = (object)ParseNode(n);
					}
					else{
					// if theres only one, it may be the value, so take the value
						if (n.ChildNodes[0].NodeType == XmlNodeType.Text){
							value = (object)n.ChildNodes[0].Value;
						}
						else{
							value = (object)ParseNode(n);
						}
					}
				}
				else value = (object)n.Value;
			
				// as hashtables can't have a key the same, and xml can have two nodes of the same name
				// we have to put the hashtables into a list if there are more than one of the same node
				// example: <test></test> -> ht["test"] = Hashtable
				// but: <test></test><test></test> -> ht["test"] = List<hashtable>
				if (ht.ContainsKey(name)){
					// list exists, add to it
					if (ht[name] is List<Hashtable>){
						List<Hashtable> list = (List<Hashtable>)ht[name];
						list.Add((Hashtable)value);
						ht[name] = list;
					}
					// list doesn't exist, so create it
					else if (ht[name] is Hashtable){
						List<Hashtable> list = new List<Hashtable>();
						Hashtable htTmp = (Hashtable)ht[name];
						list.Add(htTmp);
						list.Add((Hashtable)value);
						ht[name] = list;
					}
				}
				else{
					ht.Add(name, value);
    			}
			}
		}
			
		catch (Exception ex){
			Console.Write("Error :" + ex.Message);
		}
		
		return ht; // and return it
		//</Hashtable></Hashtable></Hashtable></Hashtable></Hashtable></Hashtable>
	}
}
