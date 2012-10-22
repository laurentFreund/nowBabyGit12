////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//  Title :			UniversLetter8.js                                                                                                                                                     //
//  Authors :		Déthié SAMB, Thomas BAUDIN                                                                                                                                            //
//  Creation date :	06/06/2012                                                                                                                                                            //
//  Last release :	11/06/2012                                                                                                                                                            //
//  Purpose :		zooming in a letter full of text.                                                                                                                                     //
//  Inputs :		                                                                                                                                                                      //
//  Outputs :		                                                                                                                                                                      //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

#pragma strict

var xmin : float = 0;
var xmax : float = 0;
var ymax : float = 0;
var	ymin : float = 0;
private var displayLength : int = 0;
private var alive : boolean = true;
var done = false;
var visible = false;
private var speedZoom : float = 1.0f;
var distance : float;
var positioningTime : float = 2.0f;
var positioningSpeed : float;
var stopZooming = false;
var main : Main;
private var speed : float = 20.0f;

function ZoomLetter(sentence : GameObject[]){
	main = GetComponent("Main");
	for (var j : int = 0; j < sentence.Length; j++){
		if (sentence[j].transform.position.z < 0.2){
			stopZooming = true;
			break;
		}
		if (sentence[j].transform.position.z < 5.0f)
			main.state = STATES.SCENE_INIT;
		sentence[j].transform.position.z -= speed*Time.deltaTime;	//	Time.deltaTime = 0.02;
//		Debug.Log("Zooming");
	}
}

/*
function to call in the main Script.
*/

function UniversLetter(cam : Camera, letter : GameObject[], /*text : String, */turnOn : boolean, targetLetter : int) {
/*	if (text.Length < 3000)
		text *= (3000 / text.Length);
	var TableObject = new GameObject[text.Length];
	Debug.Log("length: " + text.Length);*/
	
/*	PP.renderer.material.color = Color.grey;
	o.renderer.material.color = Color.grey;
	w.renderer.material.color = Color.grey;
	e.renderer.material.color = Color.grey;
*/
/*	SquareLetter(letter[targetLetter]);
	//CenterCamera(cam, letter);
	//DisplayText (letter[targetLetter], text, TableObject, turnOn);*/
	for (var i : int = 0; i < 1000; i++) {
		if (letter[targetLetter].transform.position.z < 0.5){
			yield WaitForSeconds(1);
			done = true;
			break;
		}
/*		if (!visible && letter[targetLetter].transform.position.z < 7)
			makeVisible(TableObject, text);*/
		Zoom(letter/*, TableObject*/);
		if (alive) {
			ChangeBack(letter[targetLetter], cam, /*TableObject, */turnOn);
		}
		yield WaitForSeconds(0.04);
//		Debug.Log("i = " + i);
	}
	
/*	for (var j : int = 0; j < displayLength; j++) {
		Destroy(TableObject[j], 0);
	}*/
}
/*
function makeVisible(table : GameObject[], text : String){
	for (var i = 0; i < text.length; i++){
		if (text[i] != " "){
			if (table[i] == null)
				break;
	    	table[i].renderer.enabled = true;
	    	//Debug.Log(i + "-" + text[i]);
	    }
	}
	visible = true;
}
*/
/*
Place the camera in front of the zooming letter.
*//*
function CenterCamera(cam : Camera, letter : GameObject) {
	cam.transform.position.x = letter.transform.position.x + 0.3;
	cam.transform.position.y = letter.transform.position.y + 0.5;
}
*/
function Zoom(letter : GameObject[]/*, TableObject : GameObject[]*/) {
	//var moveVector : Vector3 = Vector3(camera.mainCamera.transform.position.x - transform.position.x,
	//							camera.mainCamera.transform.position.y - transform.position.y,
	//							0.5 - transform.position.z);
/*	for (var i : int = 0; i < displayLength; i++) {
		TableObject[i].transform.position.z -= speedZoom*Time.deltaTime;
		//TableObject[i].transform.position.x -= positioningSpeed*Time.deltaTime;
		//TableObject[i].transform.position.y -= positioningSpeed*Time.deltaTime;
		//TableObject[i].transform.Translate(moveVector.normalized * speedZoom * Time.deltaTime);
	}*/
	for (var j : int = 0; j < letter.Length; j++) {
		letter[j].transform.position.z -= speedZoom*Time.deltaTime;	//	Time.deltaTime = 0.02;
		//letter[j].transform.position.x -= positioningSpeed*Time.deltaTime;
		//letter[j].transform.position.y -= positioningSpeed*Time.deltaTime;
		//letter[j].transform.Translate(-moveVector.normalized * speedZoom * Time.deltaTime);
	}
/*	PP.transform.position.z -= 0.5 * Time.deltaTime;
	o.transform.position.z -= 0.5 * Time.deltaTime;
	w.transform.position.z -= 0.5 * Time.deltaTime;
	e.transform.position.z -= 0.5 * Time.deltaTime;*/
}

/*
displays the text into the zooming letter.
*//*
function DisplayText(letter : GameObject, text : String, TableObject : GameObject[], turnOn : boolean) {
	
	var localScale_xyz : float = 0.02;
	var space_carac : float= 2 * localScale_xyz;	//selon x
	var space_line : float= localScale_xyz * 1.5;	//selon y
	var nb_carac_per_line : float = (xmax - xmin) / space_carac;	//selon x
	var first_carac_x = xmin;
	var first_carac_y = ymax;
	var first_carac_z = letter.transform.position.z - 0.02;
	var cpt_carac = 0;
	var cpt_line = 0;
	
	if (turnOn)
		letter.renderer.material.color = Color.black;
	else
		letter.renderer.material.color = Color.white;
	
	for(var i : int = 0; i < text.Length && first_carac_y-space_line*(cpt_line-1) > ymin; i++) {	//create 1 gameobject per letter and place it
		var textu : String = "" + text[i];
		if(textu == " ") {
			textu = "space";
		}
		else if(textu == ".") {
			textu = "point";
		}
		TableObject[i] = Instantiate(Resources.Load(textu), new Vector3(first_carac_x+space_carac*cpt_carac, first_carac_y-space_line*cpt_line, first_carac_z), Quaternion.Euler(0,180,0));
		TableObject[i].transform.localScale = Vector3(localScale_xyz, localScale_xyz, 1);
		TableObject[i].name = "TableObject[" + i + "]" ;
		TableObject[i].AddComponent(Rigidbody);
		TableObject[i].rigidbody.useGravity =  false;
		TableObject[i].rigidbody.drag = 20;
		if (textu != "space") {
			if (turnOn)
				TableObject[i].renderer.material.color = Color.white;
			else
				TableObject[i].renderer.material.color = Color.black;
		}
		
		if (cpt_carac<nb_carac_per_line) {
			cpt_carac++;
		}
		else {
			cpt_carac = 0;
			cpt_line++;
		}
		displayLength = i+1;
		
		//if (text[i] != " ")
		if (TableObject[i].renderer != null)
			TableObject[i].renderer.enabled = false;
		
		visible = false;
	}
}
*/
/*
computes the letter bounds.
*//*
function SquareLetter(letter : GameObject) {
	xmin = letter.renderer.bounds.min.x;
//	Debug.Log("xmin: " + xmin);
	xmax = letter.renderer.bounds.max.x;
//	Debug.Log("xmax : " + xmax);
	ymin = letter.renderer.bounds.min.y;
	ymax = letter.renderer.bounds.max.y;*/
/*	distance = Vector3((xmax - xmin)/2 - camera.mainCamera.transform.position.x,
						(ymax - ymin)/2 - camera.mainCamera.transform.position.y,
						0).magnitude;
	positioningSpeed = distance / positioningTime;*//*
}*/

/*
changes the background color, destroys the zooming letter and makes the text fall by using gravity.
*/
function ChangeBack(letter : GameObject, cam : Camera, /*TableObject : GameObject[], */turnOn : boolean) {
	if (letter.transform.position.z < 0.5) {
		alive = false;
		if (turnOn)
			cam.backgroundColor = Color.black;
		else
			cam.backgroundColor = Color.white;
		//Destroy(letter);
/*		for (var i : int = 0; i < displayLength; i++) {
			TableObject[i].rigidbody.useGravity =  true;
			TableObject[i].rigidbody.drag = 30;
		}*/
		/*for (var j : int = 0; j < displayLength; j++) {
			Destroy(TableObject[j]);
		}*/
		
//		return true;
	}
//	return false;
}
