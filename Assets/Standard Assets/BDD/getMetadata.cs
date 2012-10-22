// getMetadata.cs
// Author: Johanna PHAM

using UnityEngine;
using System.Collections;

public class getMetadata : MonoBehaviour {
	public static listElement getMeta(int id, System.Collections.Generic.Dictionary<int,mediaItem> table_medias){
		Debug.Log("COUCOUOUUUOUOUOUOUOUOU");
		if (table_medias.ContainsKey(id)){
			Debug.Log("id " + id);
			Debug.Log("mediatype " + int.Parse(table_medias[id].mediaData["mediatype"]));
			listElement meta = new listElement(id, int.Parse(table_medias[id].mediaData["mediatype"]), table_medias[id].mediaData["link"], table_medias[id].mediaData["text"], 0, null, table_medias[id].mediaData["associated_text"], table_medias[id].mediaData["associated_audio"], table_medias[id].mediaData["associated_video"], null, null, int.Parse(table_medias[id].mediaData["previous"]), int.Parse(table_medias[id].mediaData["next"]));
			return meta;
		}
		else{
			Debug.Log("id not found");
			return null;
		}
	}
}
