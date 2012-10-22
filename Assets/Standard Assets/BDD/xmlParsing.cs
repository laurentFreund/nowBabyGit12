// xmlParsing.cs
// Author: Johanna PHAM

using UnityEngine;
using System.Collections;
using System.Xml;
using System.IO;
using System.Net;

public class xmlParsing : MonoBehaviour{
	public static readonly string server_url = "http://195.83.139.57/git/now_baby/";
	public static readonly string db_url = "database_test/";
	public static readonly string xml_url = "xml/";
	public static readonly string update_file_name = "update_level.txt";
	public static readonly string medias_radix = "xml_inb_medias_1_";
	public static readonly string keywords_radix = "xml_inb_keywords_";
	
	IEnumerator Start(){
		Debug.Log ("Parsing");
		
		// Reading which version of the xml file the application must load
		string url1 = server_url + db_url + xml_url + update_file_name;
		WebClient wc = new WebClient();
		string upd = wc.DownloadString(url1);
		Debug.Log(upd);

		// Loading XML data from a URL
		string url2 = server_url + db_url + xml_url + medias_radix + upd + ".xml";
		string url3 = server_url + db_url + xml_url + keywords_radix + upd + ".xml";
		
		// Debug.Log(url3);
		
		WWW www = new WWW(url2);
		WWW www2 = new WWW(url3);
		
		yield return www;
		yield return www2;
		
		if (www.error == null || www2.error == null){
			// XML has been successfully loaded
			Debug.Log("XML loaded:" + www.text);
			Debug.Log("XML Loaded:" + www2.text);
			
			//Creating a new XML document from the loaded data

			XmlDocument xmlDoc = new XmlDocument();
			xmlDoc.LoadXml(www.text);

			XmlDocument xmlDoc2 = new XmlDocument();
			xmlDoc2.LoadXml(www2.text);
			
			xmlDoc.Save(Application.persistentDataPath + "/database.xml");
			xmlDoc2.Save(Application.persistentDataPath + "/keywords.xml");
			
			loadHashtable.load();
			
		}
		else{
			Debug.Log("ERROR: " + www.error);
		}
	}
}