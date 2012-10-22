// mediaItem.cs
// Author: Johanna PHAM

using UnityEngine;
using System.Collections;
using System.Collections.Generic;
using System.Xml;
using System.IO;
using System.Net;

// Unitron command line endings

public class mediaItem{
	public System.Collections.Generic.Dictionary<string,string> mediaData;

// To-Do: Remove the "upload_date" from the XML file
// To-Do : Remove the "last_modification_date" from the XML file

	public mediaItem(System.Collections.Generic.Dictionary<string,string> data){
		this.mediaData = data;
	}
}