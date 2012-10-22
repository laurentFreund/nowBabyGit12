// hashtable_saved.cs
// Author: Thomas BAUDIN

using UnityEngine;
using System.Collections;
using System;
using System.Text;
using System.Collections.Generic;

public class hashtable_saved : MonoBehaviour {

	// Update is called once per frame
	void Update () {
		if (dynamic_weights_panel.save) {
			Debug.Log ("Poids du TestosKey : "+loadHashtable.keywordWeight["TestosKey"]);
			dynamic_weights_panel.save = false;
			Debug.Log (""+dynamic_weights_panel.save);
		}
	}
}
