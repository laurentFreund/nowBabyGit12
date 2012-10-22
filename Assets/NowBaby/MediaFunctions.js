/*************************************************
// This is the functions to display medias
// it is attached to every media bound to a letter
// author(s) : Fabien BOURGEAIS, Nguena Stella
*************************************************/

#pragma strict
var speed : float = 20.0f;
var height : float;

/************************************************
// zoom in the media 
************************************************/
function ZoomInMedia(media : GameObject) {
 	height = media.transform.position.z;	
	var i : int;
	if (height > 0.5f){
		media.transform.Translate(-Vector3(0,0,1) * speed * Time.deltaTime);
	}
	else{
		height = 0.0f;
	}
}

/************************************************
// zoom out the media 
************************************************/
function ZoomOutMedia(media : GameObject) {
	height = media.transform.position.z;	
	var i : int;
	if (height < 40){
		media.transform.Translate(Vector3(0,0,1) * speed * Time.deltaTime);
	}
	else{
		height = 0.0f;
	}
}

/************************************************
// play the movietexture bound to the current object
************************************************/
function PlayMovie() {

}