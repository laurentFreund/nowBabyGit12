// UniverseMovement.js
// Authors: Stella NGUENA KENNE, Johanna PHAM
// Last modification date: Tue, June 5th, 2012

#pragma strict
// Make a GameObject follow a Cuadratic function 
// Over the X and Y axis.

private var anim : AnimationCurve;
private var ks : Keyframe[];
private var main : Main ;
var moving : boolean = false;
var stopMoving : boolean = false;

/** Moves an object (the camera) */
function MoveObject (thisTransform : Transform, startPos : Vector3, endPos : Vector3, time : float) {
    var i = 0.0;
    var rate = 1.0/time;

    if(!moving) {
    	moving = true; // signals "I'm moving, don't bother me!"
    	while (i < 1.0) {
    		if (i > 1.0 || stopMoving){
    			moving = false;
    			return;
    		}
			i += Time.deltaTime * rate;
			//thisTransform.position = Vector3.Lerp(startPos, endPos, i);
			/*
			thisTransform.position.x = Mathfx.Lerp(startPos.x, endPos.x, i);
			thisTransform.position.y = Mathfx.Lerp(startPos.y, endPos.y, i);
			thisTransform.position.z = Mathfx.Lerp(startPos.z, endPos.z, i);
*/
        	  
        	        	/*      	
        	thisTransform.position.x = Mathfx.Hermite(startPos.x, endPos.x, i);
			thisTransform.position.y = Mathfx.Hermite(startPos.y, endPos.y, i);
			thisTransform.position.z = Mathfx.Hermite(startPos.z, endPos.z, i);
		*/
				        	
        	thisTransform.position.x = Mathfx.Sinerp(startPos.x, endPos.x, i);
			thisTransform.position.y = Mathfx.Sinerp(startPos.y, endPos.y, i);
			thisTransform.position.z = Mathfx.Sinerp(startPos.z, endPos.z, i);
		/*
		thisTransform.position.x = Mathfx.Berp(startPos.x, endPos.x, i);
			thisTransform.position.y = Mathfx.Berp(startPos.y, endPos.y, i);
			thisTransform.position.z = Mathfx.Berp(startPos.z, endPos.z, i);
			*/
			yield; 
    	}
    	moving = false;
    }
}

    
/** Moves an object (the camera) */
function movingToUniverse (thisTransform : Transform, startPos : Vector3, endPos : Vector3, time : float) {
    var i = 0.0;
    var rate = 0.5/time;

    if(!moving) {
    	moving = true; // signals "I'm moving, don't bother me!"
    	while (i < 1.0) {
    		if (Vector3.Distance(thisTransform.position, endPos) < 0.05) {
    		Debug.Log("i > 1.0 ... stop moving");
    		   	moving = false;
				main = gameObject.GetComponent("Main") ;
				main.state = STATES.FADING_UNIV ;
	    		break;
			}
						i += Time.deltaTime * rate;
						Debug.Log("<movingToUniverse> distance="+Vector3.Distance(thisTransform.position, endPos));
		   	thisTransform.position.x = Mathfx.Sinerp(startPos.x, endPos.x, i);
			thisTransform.position.y = Mathfx.Sinerp(startPos.y, endPos.y, i);
			thisTransform.position.z = Mathfx.Sinerp(startPos.z, endPos.z, i);
			yield; 
    	}
    	moving = false;
    }
}
