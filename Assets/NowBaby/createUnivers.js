// createUnivers.js
// Authors: Laurent FREUND, Johanna PHAM, fabien Bourgeais, Aziz Sene
// Last modification date: Thu, June 21st, 2012

#pragma strict

// rotation speed
var speedMin : float = 5.0f ;
var speedMax : float = 8.0f ;

// size of the screen
private var xMin : int =-1 ;
private var xMax : int =5 ;
private var yMin : int =-20 ;
private var yMax : int = 20 ;

var tablePos : Vector3[];
var tableAmp : float[];
var tablePer : float[];
var tableRadius : Vector3[];
var tableSpeed : float[];
var tableRot : float[];


// amplitude
var ampMin : float = 1.0f;
var ampMax : float = 5.0f;

// period
var perMin : float = 8.0f;
var perMax : float = 15.0f;

// radius
var radiusMin : int =3 ;

// max zoom
private var size : float = 1.0f;
var sizeMax : int = 10;

private var main : Main;
private var textFunctions : TextFunctions;
private var speed : float = 0;

/**
* Creates arrays
*/
function createArrays(allStr : String[]){
	tablePos = new Vector3[allStr.length];
	tableAmp = new float[allStr.length];
	tablePer = new float[allStr.length];
	tableRadius = new Vector3[allStr.length];
	tableSpeed = new float[allStr.length];
	tableRot = new float[allStr.length];
}


/**
* create all the universe
*/
function placeUnivers(univers : UNIVERS, allStr : String[], sentence : GameObject[], table : GameObject[], allTexts : Array, blackOrWhite : boolean){
	main = gameObject.GetComponent("Main");
	textFunctions = gameObject.GetComponent("TextFunctions");
	
	switch (univers) {
		case UNIVERS.VORTEX : placeUniversVortex(allStr, main, sentence, table, allTexts, blackOrWhite); break;
		case UNIVERS.LINES : placeUniversLines(allStr, main, sentence, table, allTexts, blackOrWhite); break;
		case UNIVERS.WAVES : placeUniversWaves(allStr, main, sentence, table, allTexts, blackOrWhite); break;
		case UNIVERS.SEAWEEDS : placeUniversSeaweeds(allStr, main, sentence, table, allTexts, blackOrWhite); break;
		case UNIVERS.CIRCLES : placeUniversCircles(allStr, main, sentence, table, allTexts, blackOrWhite); break;
		case UNIVERS.COCENTRIC_CIRCLES : placeUniversCocentricCircles(allStr, main, sentence, table, allTexts, blackOrWhite); break;
		default: placeUniversAll(allStr, main, sentence, table, allTexts, blackOrWhite); break;
	}
}

/**
* place an univers with lines
*/
function placeUniversLines(allStr : String[], main : Main, sentence : GameObject[], table : GameObject[], allTexts : Array, blackOrWhite : boolean){
	// CREATE object
	for(var i=0 ; i < allStr.length ; i++){
		Debug.Log("zDEFAULT: " + main.getZDEFAULT() + "zSTEP: " + main.getZSTEP());
//		Debug.Log("palceUniversLine, z = "+ (main.getZDEFAULT() + i*main.getZSTEP()));
		tablePos[i] = Vector3(Random.Range(xMin, xMax), Random.Range(yMin, yMax), main.getZDEFAULT() + i*main.getZSTEP()); // random starting position
		tableSpeed[i] = Random.Range(speedMin, speedMax);// compute random speed
		
		//create the sentences
		sentence = textFunctions.CreateText(allStr[i], i , tablePos[i], table, i, size, 0, blackOrWhite); 
		allTexts.push(sentence);
		
		//we choose a radius
	/*	var radius : float = textFunctions.ComputeRandomRadius(sentence);
		tableRadius[i] = Vector3(radius,0,0);
		
		//we place the letters
		
		if (i%3 ==  1) 
			textFunctions.PlaceVortexText(sentence, Vector3(tablePos[i].x, tablePos[i].y - tableRadius[i].x, tablePos[i].z));
		else if (i%3 == 2) 
			textFunctions.PlaceCircleText(sentence , radius , Random.Range(0,360), tablePos[i]);
		else 
			textFunctions.PlaceSinusoideText(sentence, Vector3(tablePos[i].x, tablePos[i].y - tableRadius[i].x, tablePos[i].z), tableAmp[i]/2, tablePer[i]);
		*/
		textFunctions.placeTextLine(tablePos[i], sentence);
	}
}

/**
* place a universe only with circles
**/
function placeUniversCircles(allStr : String[], main : Main, sentence : GameObject[], table : GameObject[], allTexts : Array, blackOrWhite : boolean){
	for(var i=0 ; i < allStr.length ; i++){
		tablePos[i] = Vector3(Random.Range(xMin, xMax), Random.Range(yMin, yMax), main.getZDEFAULT() + i*main.getZSTEP()); // random starting position
		tableAmp[i] = Random.Range(ampMin, ampMax);
		tableSpeed[i] = Random.Range(speedMin, speedMax);// compute random speed
		
		var theSentence : GameObject[] = textFunctions.CreateText_noRenderer(allStr[i], i , Vector3(0, 0, 0), table, i, size, 0); 
		
		//we choose a radius
		var radius : float = textFunctions.ComputeRandomRadius(theSentence);
		tableRadius[i] = Vector3(radius,0,0);
		
		//create the sentences
		sentence = textFunctions.CreateText(allStr[i], i , Vector3(tablePos[i].x, tablePos[i].y + radius, tablePos[i].z), table, i, size, 0, blackOrWhite); 
		allTexts.push(sentence);
		
		
		
		//we place the letters
		textFunctions.PlaceCircleText(sentence , radius , Random.Range(0,360), tablePos[i]);
		
		for (var letter : GameObject in theSentence){
			Destroy(letter);
		}
	}
}

/**
* place a universe only with cocentric circles
**/
function placeUniversCocentricCircles(allStr : String[], main : Main, sentence : GameObject[], table : GameObject[], allTexts : Array, blackOrWhite : boolean){
	
	var x = Random.Range(xMin, xMax);
	var y = Random.Range(yMin, yMax);
	
	for(var i=0 ; i < allStr.length ; i++){
		tableSpeed[i] = Random.Range(speedMin, speedMax);// compute random speed
		tablePos[i]  = Vector3(x, y, main.getZDEFAULT() + i*main.getZSTEP());
		
		var theSentence : GameObject[] = textFunctions.CreateText_noRenderer(allStr[i], i , Vector3(0, 0, 0), table, i, size, 0); 
		
		//we choose a radius
		var radius : float = textFunctions.ComputeRandomRadius(sentence);
		tableRadius[i] = Vector3(radius,0,0);
		
		
		//create the sentences
		sentence = textFunctions.CreateText(allStr[i], i , Vector3(tablePos[i].x, tablePos[i].y + radius, tablePos[i].z), table, i, size, 0, blackOrWhite); 
		allTexts.push(sentence);
		
		
		//we place the letters
		textFunctions.PlaceCircleText(sentence , radius , Random.Range(0,360), tablePos[0]);
		
		for (var letter : GameObject in theSentence){
			Destroy(letter);
		}
	}
}


/**
* place a universe only with vortex
**/
function placeUniversVortex(allStr : String[], main : Main, sentence : GameObject[], table : GameObject[], allTexts : Array, blackOrWhite : boolean){
	for(var i=0 ; i < allStr.length ; i++){
		tablePos[i] = Vector3(Random.Range(xMin, xMax), Random.Range(yMin, yMax), main.getZDEFAULT() + i*main.getZSTEP()); // random starting position
		tableAmp[i] = Random.Range(ampMin, ampMax);
		tableSpeed[i] = Random.Range(speedMin, speedMax);// compute random speed
		
		//create the sentences
		sentence = textFunctions.CreateText(allStr[i], i , tablePos[i], table, i, size, 0, blackOrWhite); 
		allTexts.push(sentence);
		
		//we choose a radius
		var radius : float = textFunctions.ComputeRandomRadius(sentence);
		tableRadius[i] = Vector3(radius,0,0);
		
		//we place the letters
		textFunctions.PlaceVortexText(sentence , Vector3(tablePos[i].x, tablePos[i].y - tableRadius[i].x, tablePos[i].z));
	}
}


/**
* place a universe only with waves
**/
function placeUniversWaves(allStr : String[], main : Main, sentence : GameObject[], table : GameObject[], allTexts : Array, blackOrWhite : boolean){
	for(var i=0 ; i < allStr.length ; i++){
		tablePos[i] = Vector3(Random.Range(xMin, xMax), Random.Range(yMin, yMax), main.getZDEFAULT() + i*main.getZSTEP()); // random starting position
		tableAmp[i] = Random.Range(ampMin, ampMax);// compute random magnitude
		tablePer[i] = Random.Range(perMin, perMax);// compute random period
		tableSpeed[i] = Random.Range(speedMin, speedMax);// compute random speed
		
		//create the sentences
		sentence = textFunctions.CreateText(allStr[i], i , tablePos[i], table, i, size, 0, blackOrWhite); 
		allTexts.push(sentence);
		
		//we choose a radius
		var radius : float = textFunctions.ComputeRandomRadius(sentence);
		tableRadius[i] = Vector3(radius,0,0);
		
		//we place the letters
		textFunctions.PlaceSinusoideTextX(sentence , Vector3(tablePos[i].x, tablePos[i].y - tableRadius[i].x, tablePos[i].z), tableAmp[i], tablePer[i]);
	}
}


/**
* place a universe only with seaweeds
**/
function placeUniversSeaweeds(allStr : String[], main : Main, sentence : GameObject[], table : GameObject[], allTexts : Array, blackOrWhite : boolean){
	for(var i=0 ; i < allStr.length ; i++){
		tablePos[i] = Vector3(Random.Range(xMin, xMax), Random.Range(yMin, yMax), main.getZDEFAULT() + i*main.getZSTEP()); // random starting position
		tableAmp[i] = Random.Range(ampMin, ampMax);// compute random magnitude
		tablePer[i] = Random.Range(perMin, perMax);// compute random period
		tableSpeed[i] = Random.Range(speedMin, speedMax);// compute random speed
		
		//create the sentences
		sentence = textFunctions.CreateText(allStr[i], i , tablePos[i], table, i, size, 0, blackOrWhite); 
		allTexts.push(sentence);
		
		//we choose a radius
		var radius : float = textFunctions.ComputeRandomRadius(sentence);
		tableRadius[i] = Vector3(radius,0,0);
		
		//we place the letters
		textFunctions.PlaceSinusoideTextY(sentence , Vector3(tablePos[i].x, tablePos[i].y - tableRadius[i].x, tablePos[i].z), tableAmp[i], tablePer[i]);
	}
}



/**
* place a universe with all movements
**/
function placeUniversAll(allStr : String[], main : Main, sentence : GameObject[], table : GameObject[], allTexts : Array, blackOrWhite : boolean){
	for(var i=0 ; i < allStr.length ; i++){
		tablePos[i] = Vector3(Random.Range(xMin/2, xMax/2), Random.Range(yMin/2, yMax/2), main.getZDEFAULT() + i*main.getZSTEP()); // random starting position
		tableAmp[i] = Random.Range(ampMin, ampMax);// compute random magnitude
		tablePer[i] = Random.Range(perMin, perMax);// compute random period
		tableSpeed[i] = Random.Range(speedMin, speedMax);// compute random speed
		
		var theSentence = textFunctions.CreateText_noRenderer(allStr[i], i , tablePos[i], table, i, size, 0); 
		
		//we choose a radius
		var radius : float = textFunctions.ComputeRandomRadius(theSentence);
		tableRadius[i] = Vector3(radius,0,0);
		
		
		//create the sentences
		if(i%5 != 3)
			sentence = textFunctions.CreateText(allStr[i], i , tablePos[i], table, i, size, 0, blackOrWhite); 
		else
			sentence = textFunctions.CreateText(allStr[i], i , Vector3(tablePos[i].x, tablePos[i].y + radius, tablePos[i].z), table, i, size, 0, blackOrWhite);
		
		
		allTexts.push(sentence);
		
		
		//we place the letters
		switch (i %5 ) {
			case 0 : textFunctions.PlaceSinusoideTextY(sentence , Vector3(tablePos[i].x, tablePos[i].y - tableRadius[i].x, tablePos[i].z), tableAmp[i], tablePer[i]);
					 break;//seaweeds
			case 1 : textFunctions.placeTextLine(tablePos[i], sentence);
					 break;//lines		
			case 2 : textFunctions.PlaceVortexText(sentence , Vector3(tablePos[i].x, tablePos[i].y - tableRadius[i].x, tablePos[i].z));
					 break;//vortex
			case 3 : textFunctions.PlaceCircleText(sentence , radius , Random.Range(0,360), tablePos[i]);
					 break;//circle
			default: textFunctions.PlaceSinusoideTextX(sentence , Vector3(tablePos[i].x, tablePos[i].y - tableRadius[i].x, tablePos[i].z), tableAmp[i], tablePer[i]);
					 break;//waves			
		
		}
		
		for (var letter : GameObject in theSentence){
			Destroy(letter);
		}	
		
	}
}




/**
* move the universe
* 	allTexts all text to display
*	univers : MoveType of univers (LINE/ALL/CIRCLES/...)
*   selectedsSentence : sentence displayed
*	state : state int the state-machine 
*/
function moveUnivers(allTexts : Array, univers : UNIVERS, selectedSentence : GameObject[], state : STATES, speedSelected){
	var i : int = 0;
  	for (var sentence : GameObject [] in allTexts) {
//  		Debug.Log("i " + i);
  		if (!((sentence == selectedSentence && state == STATES.TRANSITION_UNIVERSE)
  			|| (sentence == selectedSentence && state == STATES.MOVING2UNIV)
  			|| (sentence == selectedSentence && state == STATES.MOVING2NEXT)
  			|| (sentence == selectedSentence && state == STATES.FADING_UNIV)
  			|| (sentence == selectedSentence && state == STATES.DESTROYING_UNIVERSE))){
  		/*	
  			if(sentence == selectedSentence)
  			{
  			
  			switch (univers) {
				case UNIVERS.VORTEX : textFunctions.MoveTextVortex(sentence, Vector3(tablePos[i].x, tablePos[i].y - tableRadius[i].x, tablePos[i].z), tableAmp[i]); break;
				case UNIVERS.LINES : textFunctions.MoveTextLine(sentence, speed); //(i%2)==1 ? - tableSpeed[i] : tableSpeed[i]); break;
				//case UNIVERS.WAVES : textFunctions.MoveTextSinusoideX(sentence , Vector3(tablePos[i].x, tablePos[i].y - tableRadius[i].x, tablePos[i].z), tableAmp[i], tablePer[i], (i%2)==1 ? - tableSpeed[i] : tableSpeed[i]); break;
				case UNIVERS.WAVES : textFunctions.MoveTextSinusoideX(sentence , Vector3(tablePos[i].x, tablePos[i].y - tableRadius[i].x, tablePos[i].z), tableAmp[i], tablePer[i], speed); break;

				//case UNIVERS.SEAWEEDS : textFunctions.MoveTextSinusoideY(sentence , Vector3(tablePos[i].x, tablePos[i].y - tableRadius[i].x, tablePos[i].z), tableAmp[i], tablePer[i], (i%2)==1 ? - tableSpeed[i] : tableSpeed[i]); break;
				case UNIVERS.SEAWEEDS : textFunctions.MoveTextSinusoideY(sentence , Vector3(tablePos[i].x, tablePos[i].y - tableRadius[i].x, tablePos[i].z), tableAmp[i], tablePer[i], speed); break;

				//case UNIVERS.CIRCLES : textFunctions.MoveTextCircle(tablePos[i], tableRadius[i], (i%2)==1 ? - tableSpeed[i]/2 : tableSpeed[i]/2, sentence, tableRot[i]); break;
				case UNIVERS.CIRCLES : textFunctions.MoveTextCircle(tablePos[i], tableRadius[i], speed, sentence, tableRot[i]); break;

				//case UNIVERS.COCENTRIC_CIRCLES : textFunctions.MoveTextCircle(tablePos[i], tableRadius[i], (i%2)==1 ? - tableSpeed[i]/2 : tableSpeed[i]/2, sentence, tableRot[i]); break; break;
				case UNIVERS.COCENTRIC_CIRCLES : textFunctions.MoveTextCircle(tablePos[i], tableRadius[i], speed, sentence, tableRot[i]); break; break;

				default: 
						switch (i %5 ) {
							case 0 : textFunctions.MoveTextSinusoideY(sentence , Vector3(tablePos[i].x, tablePos[i].y - tableRadius[i].x, tablePos[i].z), tableAmp[i], tablePer[i],speed); // (i%2)==1 ? - tableSpeed[i] : tableSpeed[i]);
									 break;//seaweeds
							case 1 : textFunctions.MoveTextLine(sentence, speed); //(i%2)==1 ? - tableSpeed[i] : tableSpeed[i]);
									 break;//lines		
							case 2 : textFunctions.MoveTextVortex(sentence, Vector3(tablePos[i].x, tablePos[i].y - tableRadius[i].x, tablePos[i].z), tableAmp[i]);
									 break;//vortex
							//case 3 : textFunctions.MoveTextCircle(tablePos[i], tableRadius[i], (i%2)==1 ? - tableSpeed[i]/2 : tableSpeed[i]/2, sentence, tableRot[i]);
							case 3 : textFunctions.MoveTextCircle(tablePos[i], tableRadius[i], speed, sentence, tableRot[i]);

									 break;//circle
							default: textFunctions.MoveTextSinusoideX(sentence , Vector3(tablePos[i].x, tablePos[i].y - tableRadius[i].x, tablePos[i].z), tableAmp[i], tablePer[i], speed); //(i%2)==1 ? - tableSpeed[i] : tableSpeed[i]);
									 break;//waves			
						}
						break;
					}
					i++;
				}
			}
			else {
			*/
			var speed : int ; 
  			if(sentence == selectedSentence)
  				speed = speedSelected ;
  			else 	
  				speed = tableSpeed[i] ;
  				// (i%2)==1 ? - tableSpeed[i] : tableSpeed[i])
			switch (univers) {
				case UNIVERS.VORTEX : textFunctions.MoveTextVortex(sentence, Vector3(tablePos[i].x, tablePos[i].y - tableRadius[i].x, tablePos[i].z), tableAmp[i]); break;
				case UNIVERS.LINES : textFunctions.MoveTextLine(sentence,speed); break;
				case UNIVERS.WAVES : textFunctions.MoveTextSinusoideX(sentence , Vector3(tablePos[i].x, tablePos[i].y - tableRadius[i].x, tablePos[i].z), tableAmp[i], tablePer[i], speed); break;
				//case UNIVERS.WAVES : textFunctions.MoveTextSinusoideX(sentence , Vector3(tablePos[i].x, tablePos[i].y - tableRadius[i].x, tablePos[i].z), tableAmp[i], tablePer[i], speed); break;

				case UNIVERS.SEAWEEDS : textFunctions.MoveTextSinusoideY(sentence , Vector3(tablePos[i].x, tablePos[i].y - tableRadius[i].x, tablePos[i].z), tableAmp[i], tablePer[i], (i%2)==1 ? - tableSpeed[i] : tableSpeed[i]); break;
				//case UNIVERS.SEAWEEDS : textFunctions.MoveTextSinusoideY(sentence , Vector3(tablePos[i].x, tablePos[i].y - tableRadius[i].x, tablePos[i].z), tableAmp[i], tablePer[i], speed); break;

				case UNIVERS.CIRCLES : textFunctions.MoveTextCircle(tablePos[i], tableRadius[i], (i%2)==1 ? - tableSpeed[i]/2 : tableSpeed[i]/2, sentence, tableRot[i]); break;
				//case UNIVERS.CIRCLES : textFunctions.MoveTextCircle(tablePos[i], tableRadius[i], speed, sentence, tableRot[i]); break;

				case UNIVERS.COCENTRIC_CIRCLES : textFunctions.MoveTextCircle(tablePos[i], tableRadius[i], (i%2)==1 ? - tableSpeed[i]/2 : tableSpeed[i]/2, sentence, tableRot[i]); break; break;
				//case UNIVERS.COCENTRIC_CIRCLES : textFunctions.MoveTextCircle(tablePos[i], tableRadius[i], speed, sentence, tableRot[i]); break; break;

				default: 
						switch (i %5 ) {
							case 0 : textFunctions.MoveTextSinusoideY(sentence , Vector3(tablePos[i].x, tablePos[i].y - tableRadius[i].x, tablePos[i].z), tableAmp[i], tablePer[i],(i%2)==1 ? - tableSpeed[i] : tableSpeed[i]);
									 break;//seaweeds
							case 1 : textFunctions.MoveTextLine(sentence, (i%2)==1 ? - tableSpeed[i] : tableSpeed[i]);
									 break;//lines		
							case 2 : textFunctions.MoveTextVortex(sentence, Vector3(tablePos[i].x, tablePos[i].y - tableRadius[i].x, tablePos[i].z), tableAmp[i]);
									 break;//vortex
							case 3 : textFunctions.MoveTextCircle(tablePos[i], tableRadius[i], (i%2)==1 ? - tableSpeed[i]/2 : tableSpeed[i]/2, sentence, tableRot[i]);
							//case 3 : textFunctions.MoveTextCircle(tablePos[i], tableRadius[i], speed, sentence, tableRot[i]);

									 break;//circle
							default: textFunctions.MoveTextSinusoideX(sentence , Vector3(tablePos[i].x, tablePos[i].y - tableRadius[i].x, tablePos[i].z), tableAmp[i], tablePer[i],(i%2)==1 ? - tableSpeed[i] : tableSpeed[i]);
									 break;//waves			
						}
						break;
					}
					i++;
				}
			
			}
		
}
  		
			
/*	    		textFunctions.MoveTextVortex(sentence, Vector3(tablePos[i].x, tablePos[i].y - tableRadius[i].x, tablePos[i].z), tableAmp[i]/2);
//					textFunctions.MoveTextSinusoide(sentence, Vector3(tablePos[i].x, tablePos[i].y - tableRadius[i].x, tablePos[i].z), tableAmp[i]/2, tableSpeed[i]/4, tablePer[i]);
		}
		i++;
	}	
}*/