/*************************************************
// This is the script to display the media on which it is attached
// author(s) : Fabien BOURGEAIS, Nguena Stella
*************************************************/

#pragma strict

var pause : boolean = false;
private var MediaFunctions : MediaFunctions;

function Start() {
	MediaFunctions = GetComponent("MediaFunctions");
}
// Disables the behaviour when it is invisible

function OnBecameInvisible () {
    enabled = false; // undisplay the media
}

// Enables the behaviour when it is visible

function OnBecameVisible () {
	if( pause == false && enabled == false) 
	{
    enabled = true; // display the media
    MediaFunctions.ZoomInMedia(this.gameObject);
    if( renderer.material.name == "MovieMaterial") // this is a video
    {
    	pause = true; 
    }
    //else yield(1);
    }
    else if(pause == false && enabled == true)
    {
    	MediaFunctions.ZoomOutMedia(this.gameObject);
    }
    else // for a video
    {
    	MediaFunctions.PlayMovie();
    	pause = false;
    }
}