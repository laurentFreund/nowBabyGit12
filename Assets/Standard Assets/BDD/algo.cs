// algo.cs
// Author: Johanna PHAM

using UnityEngine;
using System.Collections;
using System.Xml;
using System.IO;
using System.Net;
using System.Collections.Generic;
using System;
using System.Linq;

public class algo : MonoBehaviour{



	public static readonly string[] tab_fields = new string[]{"themes", "locations", "persons", "genre", "misc", "system", "direct_links", "associated_audio", "associated_text", "authors"}; // the metadata fields of a media
	public static readonly string[] tab_direct_cat = new string[]{"direct_links", "associated_audio", "associated_text"}; // metadata which directly link a media to another
	public static readonly string[] tab_key_cat = new string[]{"themes", "locations", "persons", "genre", "misc", "system"}; // keywords
	public static readonly string[] tab_key_area_fields = new string[]{"themes", "locations", "persons", "genre", "misc", "system", "direct_links"}; // a key area's metadata
	public static System.Collections.Generic.Dictionary<string,string[]> previous_data_m = null; // the previous environment
	public static string defaultBackgroundUrl = "http://195.83.139.57/git/now_baby/database_test/medias/images/low/119_BPP_founders_2.png"; // if no background is associated with the main theme of the environment
	public static readonly int MaxScore = 1000000; // the maximum score a media can get
	public static readonly int MaxWeight = 100; // the maximum weight a parameter can have
	public static int NumberOfRelatedElements = 0; // number of related elements
	public static int NumberOfRandomElements = 0; // number of random elements
	public static int MinElements = 1;
	public static int MaxElements;



	// The main function: the algorithm
	public static listElement[] algorithm(string input, System.Collections.Generic.Dictionary<int,mediaItem> mediasHashtable,
										System.Collections.Generic.Dictionary<string,int> keywordWeight,
										System.Collections.Generic.Dictionary<string,string> backgrounds,
										System.Collections.Generic.Dictionary<string,int> categoryWeight,
										System.Collections.Generic.Dictionary<string,int> mediatypeWeight,
										System.Collections.Generic.Dictionary<string,int[]> acceptedDimensions,
										int authorsWeight){
		MaxElements = loadHashtable.mediasHashtable.Count;
		System.Random random = new System.Random();
		NumberOfRelatedElements = random.Next(MinElements,MaxElements-1);
		// Debug.Log("NumberOfRelatedElements : " + NumberOfRelatedElements);
		NumberOfRandomElements = random.Next(MinElements,loadHashtable.mediasHashtable.Count-NumberOfRelatedElements);

		// All the metadata related to the selected media is referenced with "_m"
		int id_m = -1; // the id of the selected media
		int key_area_m = -1; // the key area selected within a media

		Debug.Log("Running the algorithm");
		
		// The input looks either like "[id_m]", where [id_m] is the selected media id in the database
		// or "[id_m]_[key_area_m]", where [key_area_m] is the beginning of the selected key area
		try{
			if (input.IndexOf('_')>=0){
				string[] tmp = input.Split('_');
				id_m = int.Parse(tmp[0]);
				key_area_m = int.Parse(tmp[1]);
			}
			else id_m = int.Parse(input);
		}
		catch{
			Debug.Log("Error. Incorrect id.");
			return null;
		}

		// Calling the "storeSelectedMediaMetadata" method
		System.Collections.Generic.Dictionary<string,string[]> current_data_m = storeSelectedMediaMetadata(id_m, key_area_m, tab_fields, tab_key_area_fields, mediasHashtable);
		if (current_data_m == null) return null;
// To-Do
// Somewhere in the code, insert:
// previous_data_m = current_data_m;

		// Declaring two lists: "chosen media" (which have some common metadata with the selected media) and rejected media
		List<listElement> ChosenMedia = new List<listElement>();
		List<listElement> RejectedMedia = new List<listElement>();

/*		string backgroundTheme = defineWeights(current_data_m, previous_data_m);
		if (string.IsNullOrEmpty(backgroundTheme)){
			Debug.Log("No main theme. No background.");
			return null;
		}
		if (backgrounds.ContainsKey(backgroundTheme)){
			new listElement(-1, 2, backgrounds[backgroundTheme], null, MaxScore, null, null, null, null, null);
		}
		else{
			new listElement(-1, 2, defaultBackgroundUrl, null, MaxScore, null, null, null, null, null);
		}*/

		// Comparing each media of the table with the selected media
		foreach (int id in mediasHashtable.Keys){
			if (id != id_m){ // We exclude the selected media from the environment	
				// If the media has key areas
				List<string> keyAreaDelimiters = getKeyAreas(id, mediasHashtable);

				// If the media has subtitles
				List<string> subtitles = new List<string>();
				List<string> subsDelimiters = new List<string>();
				if (string.IsNullOrEmpty(mediasHashtable[id].mediaData["subtitles"]) == false){
					string strSubs = mediasHashtable[id].mediaData["subtitles"];
					//Debug.Log("Voici la strSubs : " + strSubs);
					string[] subs_list = strSubs.Split('|');
					foreach (string subs in subs_list){
						if (string.IsNullOrEmpty(subs) == false){
						string[] subs_data = subs.Split('~');
						string subs_delimiters = subs_data[0] + "_" + subs_data[1];
						subsDelimiters.Add(subs_delimiters);
						subtitles.Add(subs_data[2]);
						}
					}
				}
				// else Debug.Log("No subtitles found.");

				// If the media is directly linked with the selected media (or an associated audio/video/text)
				if (isDirectlyChosen(id, tab_direct_cat, current_data_m)){
					// We insert the media in the list of chosen media
					ChosenMedia.Add(new listElement(
						id,
						int.Parse(mediasHashtable[id].mediaData["mediatype"]),
						mediasHashtable[id].mediaData["link"],
						mediasHashtable[id].mediaData["text"],
						MaxScore,
						keyAreaDelimiters,
						mediasHashtable[id].mediaData["associated_text"],
						mediasHashtable[id].mediaData["associated_audio"],
						mediasHashtable[id].mediaData["associated_video"],
						subtitles,
						subsDelimiters,
						int.Parse(mediasHashtable[id].mediaData["previous"]),
						int.Parse(mediasHashtable[id].mediaData["next"])));
				}
				else{
					int media_score = outputScore(
						id,
						current_data_m,
						mediasHashtable,
						keywordWeight,
						categoryWeight,
						mediatypeWeight,
						acceptedDimensions,
						authorsWeight);
					// If the similarity rate is not null, we add the media to the ChosenMedia list
					if (media_score != 0){
						ChosenMedia.Add(new listElement(
							id,
							int.Parse(mediasHashtable[id].mediaData["mediatype"]),
							mediasHashtable[id].mediaData["link"],
							mediasHashtable[id].mediaData["text"],
							media_score, keyAreaDelimiters,
							mediasHashtable[id].mediaData["associated_text"],
							mediasHashtable[id].mediaData["associated_audio"],
							mediasHashtable[id].mediaData["associated_video"],
							subtitles,
							subsDelimiters,
							int.Parse(mediasHashtable[id].mediaData["previous"]),
							int.Parse(mediasHashtable[id].mediaData["next"])));
					}
					// Else, the media is rejected
					else{
						RejectedMedia.Add(new listElement(
							id,
							int.Parse(mediasHashtable[id].mediaData["mediatype"]),
							mediasHashtable[id].mediaData["link"],
							mediasHashtable[id].mediaData["text"],
							0,
							keyAreaDelimiters,
							mediasHashtable[id].mediaData["associated_text"],
							mediasHashtable[id].mediaData["associated_audio"],
							mediasHashtable[id].mediaData["associated_video"],
							subtitles,
							subsDelimiters,
							int.Parse(mediasHashtable[id].mediaData["previous"]),
							int.Parse(mediasHashtable[id].mediaData["next"])));
					}
				}
			}
		}

		// We sort the list of chosen media in descending order of scores
		ChosenMedia.Sort(compareListElements.Compare);
		// We add the 20 most relevant media to the environment
		List<listElement> Environment = new List<listElement>();
		for (int i = 0; i < Math.Min(NumberOfRelatedElements, ChosenMedia.Count); i++){
			Environment.Add(ChosenMedia[i]);
		}
		
		Debug.Log("Taille de ChosenMedia : " + ChosenMedia.Count);
		Debug.Log("Taille de RejectedMedia : " + RejectedMedia.Count);

		// We add 10 random media chosen from the rejected list
		System.Random rand = new System.Random();
		for (int j = 0; j < NumberOfRandomElements; j++){
			Environment.Add(RejectedMedia[rand.Next(RejectedMedia.Count)]);
		}
		
		// For debugging
		
		//foreach (listElement chosenItem in ChosenMedia){
			//Debug.Log("Chosen id: " + chosenItem.id + " and score " + chosenItem.score);
		//}
		
/*		foreach (listElement rejectedItem in RejectedMedia){
			Debug.Log("Rejected id: " + rejectedItem.id);
		}*/
		
/*		Debug.Log("There are " + Environment.Count + " elements in the environment.");
		foreach (listElement item in Environment){
			Debug.Log("********** New Item **********");
			Debug.Log("Id: " + item.id);
			Debug.Log ("Score: " + item.score);
			foreach (string delimiters in item.keyAreasDelimiters){
				Debug.Log("Key area delimiters: " + delimiters);
			}
		}*/

		listElement[] Env = Environment.ToArray();
		
		Debug.Log("Nombre d'elements dans Env : " + Env.Length);
		
		// NumberOfElements = Env.Length;

		return Env;
	}



	// This method stores the selected media's metadata in the hashtable "current_data_m" and returns it
	public static System.Collections.Generic.Dictionary<string,string[]> storeSelectedMediaMetadata(int id_m,
																								int key_area_m,
																								string[] tab_fields,
																								string[] tab_key_area_fields,
															System.Collections.Generic.Dictionary<int,mediaItem> mediasHashtable){
		System.Collections.Generic.Dictionary<string,string[]> current_data_m = new Dictionary<string,string[]>();
		foreach (string field in tab_fields){
			current_data_m.Add(field, null);
		}
		if (mediasHashtable.ContainsKey(id_m)){
		// If the selected media is in the database
			if (key_area_m != -1){
			// If a key area was selected
				// Debug.Log("Voici le key area : " + key_area_m);
				string key_areas_field = mediasHashtable[id_m].mediaData["key_areas"];
				int beginning = key_areas_field.IndexOf(Convert.ToString(key_area_m) + "~");
				key_areas_field = key_areas_field.Substring(beginning);
				int end = key_areas_field.Length;
				int end2 = key_areas_field.IndexOf("|");
				if (end2 != -1){
					end = end2;
				}
				key_areas_field = key_areas_field.Substring(0, end);
				// Debug.Log("key_areas_field: " + key_areas_field);
				string[] key_area_data = key_areas_field.Split('~');
				int index = -2;
				foreach (string key_data in key_area_data){
					if (index >= 0){
						current_data_m[tab_key_area_fields[index]] = key_data.Split(',');
						//foreach (string str in current_data_m[tab_key_area_fields[index]]){
						//	Debug.Log("Voici les " + tab_key_area_fields[index] + " : " + str);
						//}
					}
					index++;
				}
			}
			else{
				foreach (string field in tab_fields){
						current_data_m[field] = (mediasHashtable[id_m].mediaData[field]).Split(',');
						// We store the selected media's metadata
						// from the medias hashtable
						// to current_data_m
						
				}
			}
		}
		else{
		// If the selected media is not in the database
			Debug.Log("Item not found.");
			return null;
		}
		return current_data_m;
	}



	// This method returns the key area delimiters of all the key areas within a media
	public static List<string> getKeyAreas(int id,	System.Collections.Generic.Dictionary<int,mediaItem> mediasHashtable){
		List<string> keyAreaDelimiters = new List<string>();
		if (mediasHashtable[id].mediaData["link_type"] == "0" && mediasHashtable[id].mediaData["mediatype"] == "0"){
		// If the media is a short text (not an archive)
			// Debug.Log("Voici l'id : " + id);
			if (string.IsNullOrEmpty(mediasHashtable[id].mediaData["key_areas"]) == false){
			// If the text contains key areas
				string strKeyAreas = mediasHashtable[id].mediaData["key_areas"];
				// Debug.Log("Voici la strKeyAreas : " + strKeyAreas);
				string[] key_areas_array = strKeyAreas.Split('|');
				foreach (string key_areas in key_areas_array){
					if (string.IsNullOrEmpty(key_areas) == false){
						string[] key_area_data = key_areas.Split('~');
						string area_delimiters = key_area_data[0] + "_" + key_area_data[1];
						keyAreaDelimiters.Add(area_delimiters);
					}
				}
			}
		}
		// else Debug.Log("No key areas found.");
		return keyAreaDelimiters;
	}
	


	// This method determines whether a media is directly linked to the selected media, or not
	public static bool isDirectlyChosen(int id, string[] tab_direct_cat, System.Collections.Generic.Dictionary<string,string[]> current_data_m){
		foreach (string cat in tab_direct_cat){
			if (current_data_m[cat] != null && Array.IndexOf(current_data_m[cat],Convert.ToString(id)) != -1){
				return true;
			}
		}
		return false;
	}



	// This method outputs the score a media gets, that is, the similarity rate between a given media and the selected one
	public static int outputScore(int id,
								System.Collections.Generic.Dictionary<string,string[]> current_data_m,
								System.Collections.Generic.Dictionary<int,mediaItem> mediasHashtable,
								System.Collections.Generic.Dictionary<string,int> keywordWeight,
								System.Collections.Generic.Dictionary<string,int> categoryWeight,
								System.Collections.Generic.Dictionary<string,int> mediatypeWeight,
								System.Collections.Generic.Dictionary<string,int[]> acceptedDimensions,
								int authorsWeight){
		int media_score = 0;
		if (mediatypeWeight[mediasHashtable[id].mediaData["mediatype"]] == 0){
		// If the media's mediatype has a null weight, the media will be rejected
			return media_score;
		}
		else{
			foreach (string dimension in acceptedDimensions.Keys){
				int dim = int.Parse(mediasHashtable[id].mediaData[dimension]);
				if (acceptedDimensions[dimension][0] != acceptedDimensions[dimension][1] && dim!=0){
					if (acceptedDimensions[dimension][0] > dim || dim > acceptedDimensions[dimension][1]) return media_score;
				}
			}
			foreach (string category in categoryWeight.Keys){
			int keywords_score = 0;
				if (categoryWeight[category] != 0){
					if (current_data_m[category] != null && string.IsNullOrEmpty(mediasHashtable[id].mediaData[category]) == false){
						string[] media_keywords = (mediasHashtable[id].mediaData[category]).Split(',');
						IEnumerable<string> common_keywords = media_keywords.Intersect(current_data_m[category]);
						foreach (string common_keyword in common_keywords){
							//Debug.Log(common_keyword);
							keywords_score += keywordWeight[common_keyword];
						}
					}
					media_score += keywords_score*categoryWeight[category];
				}
			}
			if (authorsWeight != 0){
				if (current_data_m["authors"] != null && string.IsNullOrEmpty(mediasHashtable[id].mediaData["authors"]) == false){
					string[] media_authors = (mediasHashtable[id].mediaData["authors"]).Split(',');
					IEnumerable<string> common_authors = media_authors.Intersect(current_data_m["authors"]);
					foreach (string common_author in common_authors){
						media_score += authorsWeight;
					}
				}
			}
			media_score = media_score*mediatypeWeight[mediasHashtable[id].mediaData["mediatype"]];
			return media_score;
		}
	}
	
/*	public static string defineWeights(System.Collections.Generic.Dictionary<string,string[]> current_data_m,
										System.Collections.Generic.Dictionary<string,string[]> previous_data_m){
		int maxWeight = 0;
		string main_theme = null;
		System.Random rand = new System.Random();
		List<string> keys = new List<string>();
		foreach (KeyValuePair<string,int> entry in loadHashtable.categoryWeight){
			keys.Add(entry.Key);
		}
		foreach (string category in keys){
			loadHashtable.categoryWeight[category] = rand.Next(MaxWeight);
		}
		keys.Clear();
		foreach (KeyValuePair<string,int> entry in loadHashtable.mediatypeWeight){
			keys.Add(entry.Key);
		}
		foreach (string mediatype in keys){
			loadHashtable.mediatypeWeight[mediatype] = rand.Next(MaxWeight);
		}
		keys.Clear();
		foreach (KeyValuePair<string,int[]> entry in loadHashtable.mediasHashtable){
			keys.Add(entry.Key);
		}
		foreach (string dimension in keys){
			loadHashtable.acceptedDimensions[dimension][0] = rand.Next(MaxWeight/2);
			loadHashtable.acceptedDimensions[dimension][1] = rand.Next(loadHashtable.acceptedDimensions[dimension][0], MaxWeight);
		}
		loadHashtable.authorsWeight = rand.Next(MaxWeight);
		if (previous_data_m == null){
			foreach (string field in tab_fields){
				if (tab_key_cat.Contains(field)){
					foreach (string keyword in current_data_m[field]){
						loadHashtable.keywordWeight[keyword] = rand.Next(MaxWeight);
						if (loadHashtable.keywordWeight[keyword] >= maxWeight){
							maxWeight = loadHashtable.keywordWeight[keyword];
							main_theme = keyword;
						}
					}
				}
			}
		}
		else{
			List<string> new_keywords = new List<string>();
			List<string> old_keywords = new List<string>();
			foreach (string field in tab_fields){
				if (tab_key_cat.Contains(field)){
					foreach (string keyword in current_data_m[field]){
						if (previous_data_m[field].Contains(keyword) == false) new_keywords.Add(keyword);
						else old_keywords.Add(keyword);
					}
				}
			}
			int offset = rand.Next(MaxWeight);
			foreach (string kw in new_keywords){
				loadHashtable.keywordWeight[kw] = rand.Next(MaxWeight) + offset;
				if (loadHashtable.keywordWeight[kw] >= maxWeight){
					maxWeight = loadHashtable.keywordWeight[kw];
					main_theme = kw;
				}
			}
			foreach (string kw in old_keywords){
				loadHashtable.keywordWeight[kw] = rand.Next(MaxWeight);
			}
		}
		return null;
	}*/
}
