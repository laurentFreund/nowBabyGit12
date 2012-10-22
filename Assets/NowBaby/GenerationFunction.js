/*************************************************
// This is the functions to create the world and to use it
// it is attached to ...
// author(s) : Fabien BOURGEAIS, Nguena Stella
*************************************************/

#pragma strict


private var algo : algo;

/************************************************
// Focus on a sentence to display medias when we look at the sentence
************************************************/
function FocusSentence(sentence : GameObject[]) {
	var script : MeshRenderer;
	for(var i = 0; i<sentence.length; i++)
	{
		script = sentence[i].GetComponentInChildren(MeshRenderer);
		if (script != null) script.enabled= true;
	}
}

function UnFocusSentence(sentence : GameObject[]) {
	var script : MeshRenderer;
	for(var i = 0; i<sentence.length; i++)
	{
		script = sentence[i].GetComponentInChildren(MeshRenderer);
		if (script != null) 
			script.enabled= false;
	}
}

/************************************************
// Create a new universe
// allTexts is the array of sentence
// letter allow to return the chosen letter
// nextText is an array of string for the letter
************************************************/
function CreateUniverse(allTexts : Array, letter : GameObject, nextText : Array) {
// we destroy all the old letters	

	//select a long text with a link with the last letter and stock them in an array
//	allTexts = algo.GetText();

	// display the text
//	DisplayTexts(allTexts);//here we put in form (scripts) each letter

// we get the medias linked to the keyword
//	var tableKeywords : Array = algo.GetKeywords();
	//we get the names of medias
//	var tableName : Array = algo.GetName(tableKeywords);//name of each line is tableKeywords example line 1 : 6_1 = "black.jpeg"
	//we attach each media to its letter
//	CreateChildMedias(tableName);//also put the scripts in children
	
// we choose a letter to zoom in
//	letter = ChooseLetter(allTexts);
// we choose a text to put in the letter
//	nextText = algo.GetText();
	
}

/************************************************
// create objects for medias and put it in the right letters
************************************************/
function CreateChildMedias(tableName : Array, tableKeywords : Array)
{
	var table : Array = new Array();
	
	for(var i : int = 0; i<tableName.length; i++)
	{
		var obj : GameObject = Instantiate(Resources.Load("Child"),Vector3.zero, Quaternion.identity);
		
		//we check the type of media
		var ext : String[] = (tableName[i] as String).Split("."[0]);
		if (ext[ext.Length - 1] == "ogg" || ext[ext.Length - 1] == "ogv")//it's a video
		{
			var newMat : Material = Resources.Load("MovieMaterial", typeof(Material)) as Material;
			obj.renderer.sharedMaterial = newMat;
			
			
			var movieScript : MobileMovieTexture = obj.GetComponent(MobileMovieTexture);
	//		movieScript.setPath (tableName[i] as String);
			var filename : String = tableName[i] as String;
//			Debug.Log("tableName["+i+"]="+filename.Substring(0,filename.length-4));
			movieScript.setPath ("p13.ogv");
			movieScript.enabled = true;
			movieScript.Play();
			
		}
		else if (ext[ext.Length - 1] == "png" || ext[ext.Length - 1] == "jpg")//it's an image
		{
			var texture : Texture = Resources.Load("images/" + ext[ext.Length - 2]) as Texture;
			obj.renderer.sharedMaterial.mainTexture = texture;
		}
		else if (ext[ext.Length - 1] == "mp3")
		{
			Debug.Log("AUDIO");
			var clip0 : AudioClip;
			clip0 = Resources.Load(ext[ext.Length - 2]);
			var audio : AudioSource = obj.GetComponent(AudioSource);
			audio.clip = clip0;
			audio.enabled = true;
			audio.Play();
			obj.renderer.enabled = false;	
		}
		obj.name = tableName[i];
		var root : GameObject = GameObject.Find(tableKeywords[i]);
		obj.transform.parent = root.transform;
		var main : Main = camera.GetComponent("Main");
		obj.transform.position = root.transform.position + Vector3(main.getZDEFAULT() * Mathf.Tan(Mathf.PI/6) ,0,0);
		obj.transform.rotation.eulerAngles = Vector3(90,180,0);
		
		table.Add(obj);
	}
	return table;
}

/************************************************
// create objects for medias and put it in the right letters
************************************************/
function DestroyChildMedias(table : Array)
{
	for(var obj in table)
	{
		Destroy(obj);
	}
}


/************************************************
// This function returns a random letter
************************************************/
function ChooseLetter(allTexts : Array){

	var letters : GameObject[] = new GameObject[allTexts.length];
	var i : int =0;
	for(var sentence : GameObject[] in allTexts)
	{
		letters[i]= sentence[Random.Range(0, sentence.length-1)];
		i++;
	}
	var letter : GameObject = letters[Random.Range(0, letters.length-1)];
	return letter;
}

/************************************************
// Place all Texts in the universe
************************************************/
function DisplayTexts(allText : Array)
{
	
	
}