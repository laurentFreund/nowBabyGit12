/*************************************************
// This is the functions to create text
// It is used by other scripts instantiating the script
// author(s) : Fabien BOURGEAIS
*************************************************/

#pragma strict

//used for MoveCircle
var currentRotation : float = 0;
var rotation : Quaternion;

//used by vortex functions
var circularVortexRadius : float = 0;
var ellipticVortexRadius : float = 0;

/**
* Creates a text
**/
function CreateText(text : String, id : int, posStart : Vector3, table : GameObject[], line : int, size : float, startAngle : float, blackOrWhite : boolean)
{	

	var TableObject : GameObject[] = new GameObject[text.Length];
	
	if (text.Length == 0) return null;

	//TableObject[0] = Instantiate(Resources.Load(""+text[0]), Vector3(posCenter.x, posCenter.y + radius, posCenter.z), Quaternion.Euler(0,180,0));
	//ZoomLetter(size, TableObject[0]);
	
	for(var i : int = 0; i < text.Length; i++)	{//create 1 gameobject per letter and place it
		var textu : String = ""+text[i];
		//we save the name of the prefab in textu
		//be careful with names which have changed in the editor
		if(textu == " ") 
			textu = "space";
		else if(textu == ".") 
			textu = "point";
		else if(textu == "A" || textu == "B" ||textu == "C" ||textu == "D" ||textu == "E" ||textu == "F" ||textu == "G" ||textu == "H" ||textu == "I" ||textu == "J" ||textu == "K" ||textu == "L" ||textu == "M" ||textu == "N" ||textu == "O" ||textu == "P" ||textu == "Q" ||textu == "R" ||textu == "S" ||textu == "T" ||textu == "U" ||textu == "V" ||textu == "W" ||textu == "X" ||textu == "Y" ||textu == "Z") {
			textu = textu + textu;
		}
		
//		Debug.Log("text : "+textu);
		TableObject[i] = Instantiate(Resources.Load(textu), posStart, Quaternion.Euler(0,180,0));
		// make the object invisible
		if (textu !="space") {
			TableObject[i].renderer.material.color = blackOrWhite ? Color.black : Color.white;

	//		TableObject[i].transform.GetComponent(Renderer).enabled = false;
		}
		
		//zoom the letter by size
		//ZoomLetter(size, TableObject[i]);
		
		if (i!=0) 
			TableObject[i].name = ""+ id + "_" + i;
		else 
			TableObject[i].name = ""+ id + "_" + text.Length;	
	}
	
	table[line] = TableObject[0];//we return the first letter in the table of GameObject
	//return table;
	return TableObject ; // L. Freund, DEBUG
}

/**
* Returns a random radius, which lets the circle contain the whole text
**/
function ComputeRandomRadius(sent : GameObject[]){
	var width : float = 0.0f;
	for (var i = 0; i < sent.length; i++){
		if (sent[i].transform.renderer != null)
		width += sent[i].transform.renderer.bounds.size.x;//GetComponent(MeshFilter).mesh.bounds.size.x;
		//Debug.Log("bounds: " + sent[i].GetComponent(MeshFilter).mesh.bounds.size.x);
	}
	//Debug.Log("width: " + width);
	var borneMin : float = width/(Mathf.PI);
	do {
		borneMin += 1.6 ;	
	}while (borneMin < 6);
	
	return Random.Range(borneMin,2*borneMin);
}


/************************************************
// Place your text in circle
// sentence
// radius : for the size (z must be equal to 0)
// startAngle
// posStart
************************************************/
function PlaceCircleText(sentence : GameObject[], radius : float, startAngle : float, center : Vector3) {   
    var angleTmp : float = startAngle;
    var width : float;
    
	for (var k = 0; k < sentence.length; k++){
		if (sentence[k].transform.renderer != null)
			width += sentence[k].transform.renderer.bounds.size.x;
	}
	width = width/sentence.Length;
    
    for(var i : int = 0; i < sentence.Length; i++) {
    	if(i==0)
    		sentence[i].transform.RotateAround(center, -Vector3.forward, startAngle);
    	else {
    		//var angle : float = Mathf.Atan((sentence[i-1].GetComponent(MeshFilter).mesh.bounds.size.x+sentence[i].GetComponent(MeshFilter).mesh.bounds.size.x)/radius);
			var angle : float = Mathf.Atan((sentence[i-1].GetComponent(MeshFilter).sharedMesh.bounds.size.x+width)/radius);
			angle = angle*180/Mathf.PI;
			angleTmp += angle;
			sentence[i].transform.RotateAround(center, -Vector3.forward, angleTmp);	
		}
		//we turn the letter toward center
    	//var target : Vector3 = sentence[i].transform.position-center;
    	//var turningAngle : float =  Vector3.Angle(sentence[i].transform.TransformDirection(0,1,0), target);
		//sentence[i].transform.Rotate(0,0,transform.eulerAngles.z-turningAngle);
	}
}


/************************************************
// Move your text in circle with rotation of txt
// center : put your center here
// radius : for the size (z must be equal to 0)
// rotationSpeed
// obj : your first letter you want to move
// Bourgeais & Pham 31 mai 12
************************************************/
function MoveTextCircle(center : Vector3, radius : Vector3, rotationSpeed : float, sentence : GameObject[], currentRot : float) {   
    currentRot += Time.deltaTime * rotationSpeed * 2;
    for (var i = 0; i < sentence.length; i++)
    	sentence[i].transform.RotateAround(center, -Vector3.forward, -currentRot);	
	return currentRot;
}

/************************************************
// Move your text in circle with rotation of txt
// center : put your center here
// radius : for the size (z must be equal to 0)
// rotationSpeed
// obj : your first letter you want to move
// Bourgeais & Pham 31 mai 12
************************************************/
function placeTextLine(begin : Vector3, sentence : GameObject[]) {   
    // += Time.deltaTime * speed;
    
    var width : float = 0.0 ;
    var borderPrecX : float ;
    
    // compute the average size of a letter
    for (var k = 0; k < sentence.length; k++)
		if (sentence[k].transform.renderer != null)
			width += sentence[k].transform.renderer.bounds.size.x;

	width = width/sentence.Length;
    
	// place letters on a line
    borderPrecX = begin.x;
    for (var i = 0; i < sentence.length; i++){
    	sentence[i].transform.Translate(borderPrecX, 0, 0, Camera.main.transform);
 		borderPrecX += sentence[i].GetComponent(MeshFilter).sharedMesh.bounds.size.x + width;
  }   
}
 
/************************************************
// Change your object size and return the new one
// size :
// obj : is your first letter
************************************************/
/*function ZoomLetter (size : float, obj : GameObject)
{
	var mesh : Mesh = obj.GetComponent(MeshFilter).sharedMesh;
    var vertices : Vector3[] = mesh.vertices;
	for (var i = 0; i < vertices.Length; i++)
	{
		vertices[i]  = size * vertices[i] ;
	} 
	mesh.vertices = vertices;
    mesh.RecalculateBounds();   
}*/

/************************************************
// Place your text in vortex
// sentence
// center
************************************************/
function PlaceVortexText(sentence : GameObject[], center : Vector3)
{  
   		var k : float = 0.0f;
    	var decalage : float = 0.0f;
    	var index : float = 0.0f;
     for(var i : int = 0; i < sentence.Length; i++) {
    	
    	if(i != 0)
    	{
    		if (i < 5)
    			k = i*2.0f;
    		else if(i < 9){
    			k = (i-4)*3/2f ;
    			decalage = 8.0f;
    		}	
    		else if(i < 15){
    			k = (i-8)*4/3f ;
    			decalage = 14.0f;
    		}
    		else if(i < 31){
    			k = (i-14)*1.0f ;
    			decalage = 22.0f;
    		}
    		else if(i < 51){
    			k = (i-30)/2.0f ;
    			decalage = 38.0f;
    		}
    		else if(i < 90){
    			k = (i-50)/3.0f ;
    			decalage = 48.0f;
    		}
    		else{
    			k = (i-89)/3.5f;
    			decalage = 61.0f;
    		}
    	}
    	index = k  + decalage;
    	
    	//caul des coordonnées
    	var newX = ((index+0.05)/3.0f * Mathf.Cos( (index+0.05)/5.0f ));
    	var newY = ((index+0.05)/3.0f * Mathf.Sin( (index+0.05)/5.0f ));
    	var newPosition = Vector3(newX + center.x,newY + center.y,center.z);
    	//positionnement
    	sentence[sentence.Length-i-1].transform.position = newPosition ;
//    	Debug.Log("index : " + index +" i : "+ i);
    	//orientation de la lettre
    	sentence[sentence.Length-i-1].transform.rotation = Quaternion.Euler(0,180,Mathf.Atan2(newX,newY)* Mathf.Rad2Deg);
		// make the object visible
		if (sentence[sentence.Length-i-1].transform.renderer != null)
			sentence[sentence.Length-i-1].transform.renderer.enabled = true;
			
	}
}


/************************************************
// Move your text in vortex
// center : put your center here
// sentence
************************************************/
function MoveTextVortex( sentence : GameObject[], center : Vector3, amplitude : float )
{  
	var length = sentence.Length;
	
	var newX : float = 0;
	var newY : float = 0;
	var newPosition : Vector3 = Vector3(newX,newY,40);
	
	
	
	
	var maxX = ((length+61+0.05)/amplitude * Mathf.Cos( (length+61+0.05)/5 ));
    var maxY = ((length+61+0.05)/amplitude * Mathf.Sin( (length+61+0.05)/5 ));
    var maxRadius = Vector3(maxX + center.x,maxY + center.y, center.z);
    var maxVortexMagnitude = (maxRadius-center).magnitude + 2;
	
	for(var i : int = 0; i < length; i++) {
		var j : int = 0;
		
		
		
		do {
			var k : float = 0.0f;
			var decalage : float = 0.0f;
			if(i != 0)
			{
				if (i < 5)
	    			k = i*2.0f;
	    		else if(i < 9){
	    			k = (i-4)*3/2f ;
	    			decalage = 8.0f;
	    		}	
	    		else if(i < 15){
	    			k = (i-8)*4/3f ;
	    			decalage = 14.0f;
	    		}
	    		else if(i < 31){
	    			k = (i-14)*1.0f ;
	    			decalage = 22.0f;
	    		}
	    		else if(i < 51){
	    			k = (i-30)/2.0f ;
	    			decalage = 38.0f;
	    		}
	    		else if(i < 90){
	    			k = (i-50)/3.0f ;
	    			decalage = 48.0f;
	    		}
	    		else{
	    			k = (i-89)/3.5f;
	    			decalage = 61.0f;
	    		}
			}
			var index = k + decalage - j*(length+61.0f);
			
	    	newX = ((0.5*(Time.time + 0.1) + index )/amplitude * Mathf.Cos( (0.5*(Time.time + 0.1) + index)/5 ));
	    	newY = ((0.5*(Time.time + 0.1) + index )/amplitude * Mathf.Sin( (0.5*(Time.time + 0.1) + index)/5 ));
	    	newPosition = Vector3(newX + center.x ,newY + center.y, center.z);
	    	
	    	j++ ;
    	}while ( (newPosition - center).magnitude > maxVortexMagnitude);
    	
//    	if(i==(length - 1)) Debug.Log(" norme = " + (newPosition-center).magnitude + " et max vaut" + maxVortexMagnitude);
    	
    	//positionnement
    	sentence[length-i-1].transform.position.x = newPosition.x ;
    	sentence[length-i-1].transform.position.y = newPosition.y ;
    	    	    	
    	//orientation de la lettre
    	sentence[length-i-1].transform.rotation = Quaternion.Euler(0,180,Mathf.Atan2(newX,newY)* Mathf.Rad2Deg);
	}	
}


/************************************************
// Place your text in sinusoide
// sentence
// center
************************************************/
function PlaceSinusoideTextY(sentence : GameObject[], center : Vector3, amplitude : float, period : float)
{  
	var currentWidth : float = 0;
	var length = sentence.Length;
	
    for(var i : int = 0; i < length; i++) {
    	//caul des coordonnées
    	var newY = - currentWidth + (length*1.7/2);
    	var newX = amplitude * Mathf.Sin(newY/period);
    	var newPosition = Vector3(newX + center.x,newY + center.y,center.z);
    	var angle = Mathf.Atan2(-1, amplitude / period * Mathf.Cos(newY/period))* Mathf.Rad2Deg + 180 ;
    	
    	//positionnement
    	sentence[i].transform.position = newPosition ;
    	
    	//orientation de la lettre
    	sentence[i].transform.rotation = Quaternion.Euler(0,180,angle);
    	
    	// make the object visible
		if (sentence[i].transform.renderer != null){
			sentence[i].transform.renderer.enabled = true;
			currentWidth += sentence[i].transform.renderer.bounds.size.x + 0.3;	
		}
		else
			currentWidth += 1.7 ;	
	}
}

/************************************************
// Place your text in sinusoide
// sentence
// center
************************************************/
function PlaceSinusoideTextX(sentence : GameObject[], center : Vector3, amplitude : float, period : float)
{  
	var currentWidth : float = 0;
	var length = sentence.Length;
	
    for(var i : int = 0; i < length; i++) {
    	//caul des coordonnées
    	var newX = currentWidth - (length*1.7/2);
    	var newY = amplitude * Mathf.Sin(newX/period);
    	var newPosition = Vector3(newX + center.x,newY + center.y,center.z);
    	var angle = Mathf.Atan2(1, amplitude / period * Mathf.Cos(newX/period))* Mathf.Rad2Deg - 90 ;
    	//positionnement
    	sentence[i].transform.position = newPosition ;
    	
    	//orientation de la lettre
    	sentence[i].transform.rotation = Quaternion.Euler(0,180,angle);
    	
    	// make the object visible
		if (sentence[i].transform.renderer != null){
			sentence[i].transform.renderer.enabled = true;
			currentWidth += sentence[i].transform.renderer.bounds.size.x + 0.3;	
		}
		else
			currentWidth += 1.7 ;	
	}
}



/************************************************
// Move your text in sinusoide
// center : put your center here
// sentence
************************************************/
function MoveTextSinusoideX( sentence : GameObject[], center : Vector3, amplitude : float, period : float, speed : float)
{  
	var currentWidth : float = 0;
	var length = sentence.Length;
	var width = length*1.7;
	
	
    for(var i : int = 0; i < length; i++) {
    	//caul des coordonnées
    	var newX = -Time.time*speed + currentWidth - (length*1.7/2);
    	var newY = amplitude * Mathf.Sin(newX/period);
    	var newPosition = Vector3(newX + center.x,newY + center.y,center.z);
    	var angle = Mathf.Atan2(1, amplitude / period * Mathf.Cos(newX/period))* Mathf.Rad2Deg - 90 ;
    	//Debug.Log("length = " + length + "et x = " + newX );
    	
    	//positionnement
    	sentence[i].transform.position.x = newPosition.x ;
    	sentence[i].transform.position.y = newPosition.y ;
    	
    	//orientation de la lettre
    	sentence[i].transform.rotation = Quaternion.Euler(0,180,angle);
    	
    	// make the object visible
		if (sentence[i].transform.renderer != null){
			sentence[i].transform.renderer.enabled = true;
			currentWidth += sentence[i].transform.renderer.bounds.size.x + 0.3;	
		}
		else
			currentWidth += 1.7 ;	
	}
	
}

/************************************************
// Move your text in sinusoide
// center : put your center here
// sentence
************************************************/
function MoveTextSinusoideY( sentence : GameObject[], center : Vector3, amplitude : float, speed : float, period : float)
{  
	var currentWidth : float = 0;
	var length = sentence.Length;
	var width = length*1.7;
	
	 for(var i : int = 0; i < length; i++) {
    	//caul des coordonnées
    	var newY = Time.time*speed - currentWidth + (length*1.7/2);
    	var newX = amplitude * Mathf.Sin(newY/period);
    	var newPosition = Vector3(newX + center.x,newY + center.y,center.z);
    	var angle = Mathf.Atan2(-1, amplitude / period * Mathf.Cos(newY/period))* Mathf.Rad2Deg + 180 ;
    	
    	//positionnement
    	sentence[i].transform.position = newPosition ;
    	
    	//orientation de la lettre
    	sentence[i].transform.rotation = Quaternion.Euler(0,180,angle);
    	
    	// make the object visible
		if (sentence[i].transform.renderer != null){
			sentence[i].transform.renderer.enabled = true;
			currentWidth += sentence[i].transform.renderer.bounds.size.x + 0.3;	
		}
		else
			currentWidth += 1.7 ;	
	}	
}

/**
* display a sentence or hide it
* change the color 
*/
function setVisibleSentence( sentence : GameObject[], on : boolean , color : Color ) {
	for(var i=0 ; i < sentence.length ; i++) 
		if (sentence[i].transform.renderer != null) {
			sentence[i].transform.renderer.material.color = color ;
			sentence[i].transform.renderer.enabled = on;
			}
}

/**
* set the Color of a sentence
*/
function setColor(sentence : GameObject[], color : Color) {
	for(var i=0 ; i < sentence.length ; i++) 
		if (sentence[i].transform.renderer != null) 
			sentence[i].transform.renderer.material.color = color ;
}


/**
* teleport a sentence backward
*/
function teleportSentenceBack( sentence : GameObject[], nbTotal : int, step : float) {
			Debug.Log("[teleportSentence()] old z = "+sentence[0].transform.position.z);

	for(var i=0 ; i < sentence.length ; i++) {
		if (sentence[i].transform.renderer != null)
			sentence[i].transform.renderer.enabled = false;
			sentence[i].transform.position.z = sentence[i].transform.position.z + nbTotal*step;
	}
				Debug.Log("[teleportSentence()] new z = "+sentence[0].transform.position.z);

}

/**
* move the Text in Line 
*/
function MoveTextLine(sentence : GameObject[], speed : float){
	for (var i = 0 ; i < sentence.length; i++){
		sentence[i].transform.Translate(Vector2(2, 0) * Time.deltaTime *speed);
	}
}

/**
* move the Text in Line 
*/
function MoveTextLineAndRotate(sentence : GameObject[], speed : float, speedRotate: float){
	for (var i = 0 ; i < sentence.length; i++){
		if (sentence[i].transform.renderer !=null)
	    	sentence[i].transform.RotateAround(sentence[i].transform.renderer.bounds.center, Vector3.up, Time.deltaTime*speedRotate);
		sentence[i].transform.Translate(Vector3.left * Time.deltaTime*speed, Space.World);
	
				}
}
/* tmp */
function CreateText_noRenderer(text : String, id : int, posStart : Vector3, table : GameObject[], line : int, size : float, startAngle : float){	

	var TableObject : GameObject[] = new GameObject[text.Length];
	
	if (text.Length == 0) return null;

	//TableObject[0] = Instantiate(Resources.Load(""+text[0]), Vector3(posCenter.x, posCenter.y + radius, posCenter.z), Quaternion.Euler(0,180,0));
	//ZoomLetter(size, TableObject[0]);
	
	for(var i : int = 0; i < text.Length; i++)	{//create 1 gameobject per letter and place it
		var textu : String = ""+text[i];
		//we save the name of the prefab in textu
		//be careful with names which have changed in the editor
		if(textu == " ") 
			textu = "space";
		else if(textu == ".") 
			textu = "point";
		else if(textu == "A" || textu == "B" ||textu == "C" ||textu == "D" ||textu == "E" ||textu == "F" ||textu == "G" ||textu == "H" ||textu == "I" ||textu == "J" ||textu == "K" ||textu == "L" ||textu == "M" ||textu == "N" ||textu == "O" ||textu == "P" ||textu == "Q" ||textu == "R" ||textu == "S" ||textu == "T" ||textu == "U" ||textu == "V" ||textu == "W" ||textu == "X" ||textu == "Y" ||textu == "Z") {
			textu = textu + textu;
		}
		
//		Debug.Log("text : "+textu);
		TableObject[i] = Instantiate(Resources.Load(textu), posStart, Quaternion.Euler(0,180,0));
		// make the object invisible
		if (textu !="space") {
			TableObject[i].renderer.enabled = false;
	//		TableObject[i].transform.GetComponent(Renderer).enabled = false;
		}
		
	}
	return TableObject ; // L. Freund, DEBUG
}
