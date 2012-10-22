		// Main.js
		// Authors: Laurent FREUND, Johanna PHAM
		// Last modification date: Wed, June 6th, 2012
		// This script contains the architecture of the project and calls all the other functions.
		
		#pragma strict
		
		private var textFunctions : TextFunctions;
		var table : GameObject[];
		
		// all the texts
		var allTexts : Array = new Array(); 
		var tableKeywords : Array = new Array(); 
		var tableName : Array = new Array();
		var tableChild : Array = new Array();
		
	//	var curve = new AnimationCurve(Keyframe(0, 0), Keyframe(0.1, 0.8), Keyframe(0.2, 0.5), Keyframe(1, 1));
	
		private var zMin : int = 100 ;
		private var zMax : int = 150 ;
		private var nFRONT : int = 5 ;
		private var nBACK : int = 5;
		private var zSTEP : int = 10;
		private var zDEFAULT : int = (nFRONT+1)*zSTEP ;
		private var nbToDisplay : int = nFRONT + nBACK + 1;
		private var OFFSET_SCREEN_FOCUS : int = 50 ;
		private var TRANSITION_SPEED : float = 1.0; 
		
		var sentence : GameObject[];
		
		var letter : GameObject ;
		
		private var move : UniverseMovement;
		private var body : Rigidbody;
		
		private var charging : boolean = false;
		private var swiping : boolean = false;
		private var timer : float;
		private var defaultTimerValue : float = 2.0f;
		private var swInfo : SwipeInfo;
		private var drInfo : DragInfo;
		private var dragging : boolean = false;
		var defaultSpeed : float = 2.0f;
		var highSpeed : float = 15.0f;
		private var speedZooming : float;
		var zoomingTime : float = 2.0f;
		
		private var swipeOrDragEnabled : boolean = true;
		var selectedSentence : GameObject[];
		var selectedLetter : int;
		
		enum UNIVERS {LINES, VORTEX, CIRCLES, WAVES, ALL, SEAWEEDS, COCENTRIC_CIRCLES};
		enum STATES {SCENE_INIT, NEXT_SENTENCE, MOVING2NEXT, MOVING2UNIV, FADING_UNIV, DESTROYING_UNIVERSE,TELEPORTING_UNIVERSE, SENTENCE_FOCUS, TRANSITION_UNIVERSE, BLACK_OUT};
		var state : STATES = STATES.SCENE_INIT;
		private var autoTimer : float;
		private var selectedIndex : int;
		
		private var endTimeSentence : float; // duration of the sentence scrolling
		
		private var transition : UniversLetter8;
		private var transitionDone : boolean = true;
		
		private var genFunc : GenerationFunction;
		private var parse : xmlParsing;
		private var load : loadHashtable;
		private var initialized : boolean = true;
		private var fading : boolean = false; // FLAG for fadding (LF)
		private var fadingInit : boolean = false;
		private var blackOrWhite : boolean = false; // true if black
		private var allDestroyed : boolean = false ; // FLAG for destroying (LF)
		private var movingUnivers : boolean = false ; // FLAG when we want to move universe (LF)  
		private var allFaded : boolean = false;
		private var teleported : boolean = false;
		private var turnOn : boolean = true; // turn on/off the lights
		
		var prevCameraPosZ : float;
		var prevCameraPos : Vector3;
		var nextCameraPos : Vector3;
		
		private var univ : createUnivers;
		private var currentUnivers : UNIVERS;
		private var tmpUniv: int =0  ; 
		var fadingTimer : float;
		private var transitionSentence : GameObject[];
		
		private var speedLine : float = 0;
		
		private var allStr = [
				 "0. I don't know which one belongs to the CIA. I'm trying to figure it out."
				,"1. Then we want to talk about violence. Because it’s going to be important, Because I don’t know why everybody’s so scared about it."
				,"2. They're going to draft you all and send you to Vietnam; I guess you going to go over there and make love to the Vietnamese."
				,"3. You see that on television all the time, even today about the Vietnam war. Do you ever see’em?s"
				,"4. Those dirty, filthy, rotten, Communist, rebels threw a Molotov cocktail and killed civilians."
				,"5. And then the other guy comes on and says, \"And in the meantime, our good GI boys have been bombing the hell out of North Vietnam.\""
				,"6. In the Vietnamese war, let America prove something to us. We will not fight in their war."
				,"7. How could you let them destroy your humanity? How could you let them put you in a uniform and go fight people who have never done anything to you."
				,"8. How could you? When are we going to get the strength to tell this country we will not let her destroy us?"
				,"9- 1. You tell them we are no longer going to kill people just because a honky says \"Kill.\""
				,"10- You tell them, \"When we decide to kill, we will decide who we gonna kill.\""
				
		/*		,"We believe that this racist government has robbed us, "
				,"and now we are demanding the overdue debt of forty acres and two mules."
				," Forty acres and two mules were promised cent years ago as restitution for slave labor and mass murder of Black people."
				, "We will accept the payment in currency, "
				,"which will be distributed to our many communities. "
				,"The Germans are now aiding the Jews in Israel for the genocide of the Jewish people. "
				,"The Germans murdered six million Jews. "
				,"The American racist has taken part in the slaughter of over fifty million Black people;"
				," therefore, we feel that this is a modest demand that we make. "
				,"Freedom"
				,"People"
				,"ALL RIGHT"
				,"TODAY"
				,"4. We Want Decent Housing Fit For The Shelter Of Human Beings."
				,"We believe that if the White Landlords will not give decent housing to our Black community,"
				,"then the housing and the land should be made into cooperatives so that our community, "
				,"with government aid,"
				,"can build and make decent housing for its people."*/	
				/*,"5. We Want Education For Our People That Exposes"
				,"The True Nature Of This Decadent American Society."
		,"We Want Education That Teaches Us Our True History "
		,"And Our Role In The Present-Day Society."
		,"We believe in an educational system that will give to our people a knowledge of self."
		,"If a man does not have knowledge of himself and his position in society and the world,"
		,"then he has little chance to relate to anything else."
		,"6. We Want All Black Men To Be Exempt From Military Service."
		, "We believe that Black people should not be forced to fight in the military service to defend a racist government that does not protect us."
		,"We will not fight and kill other people of color in the world who,"
		,"like Black people,"
		,"are being victimized by the White racist government of America."
		,"We will protect ourselves from the force and violence of the racist police and the racist military,"
		,"by whatever means necessary."
		,"7. We Want An Immediate End To Police Brutality And Murder Of Black People."
		,"We believe we can end police brutality in our Black community by organizing Black self-defense groups that are dedicated to defending our Black community from racist police oppression and brutality."
		,"The Second Amendment to the Constitution of the United States gives a right to bear arms."
		,"We therefore believe that all Black people should arm themselves for self- defense."
		,"8. We Want Freedom For All Black Men "
		,"Held In Federal,"
		,"State,"
		,"County And City Prisons And Jails."
		,"We believe that all Black people should be released from the many jails and prisons because they have not received a fair and impartial trial."
		,"9 .We Want All Black People When Brought To Trial To Be Tried In Court By A Jury Of Their Peer Group Or People From Their BlackCommunities,"
		,"As Defined By The Constitution Of The United States."
		,"We believe that the courts should follow the United States Constitution so that Black people will receive fair trials."
		,"The Fourteenth Amendment of the U.S. Constitution gives a man a right to be tried by his peer group."
		,"A peer is a person from a similar economic,"
		,"social,"
		,"religious,"
		,"geographical,"
		,"environmental,"
		,"historical and racial background."
		,"To do this the court will be forced to select a jury from the Black community from which the Black defendant came."
		,"We have been,"
		,"and are being,"
		,"tried by all-White juries that have no understanding of the "
		, "average reasoning man"
		,"of the Black community."
		,"1O. We Want Land,"
		,"Bread,"
		,"Housing,"
		,"Education,"
		,"Clothing,"
		,"Justice And Peace."*/
				];
		
		function Start () {
		
				//parse = GetComponent(xmlParsing);
			//load = GetComponent(loadHashtable);
			//load.load();
				
		
			table = new GameObject[allStr.length];
			
			// instantiate classes
			univ = GetComponent(createUnivers);
			textFunctions = GetComponent(TextFunctions);
			genFunc = GetComponent(GenerationFunction);
			move = GetComponent(UniverseMovement);
	      	transition = GetComponent(UniversLetter8);
			univ.createArrays(allStr);
	
			Init();
		}
		
		/**
		* init the univers
		*/
		function Init(){	
			allTexts.Clear();
			
			//place Universe
			//currentUnivers = Random.Range(0,6);
			//tmpUniv = (tmpUniv + 1 ) % 7 ;
			currentUnivers = UNIVERS.ALL ;
			univ.placeUnivers(currentUnivers, allStr, sentence, table, allTexts, blackOrWhite) ;
			
			// compute number to hide that are to far away
			if (allStr.length < nbToDisplay)
				nbToDisplay = allStr.length ;
		
			   // hide sentences that are to far away
			for(var i=0 ; i < allStr.length ; i++){
			   if (i > nBACK)
			   		textFunctions.setVisibleSentence( allTexts[i] ,false, Color.grey) ;
			   else 
			   		textFunctions.setVisibleSentence( allTexts[i] ,true, Color.grey) ;
			}
			
			camera.backgroundColor = blackOrWhite ? Color.black : Color.white;
			//fadingOutAll(allTexts, blackOrWhite ? Color.white : Color.black, 1000);
			blackOrWhite = !blackOrWhite;

			// We choose a random letter
			selectedIndex = 0; //Random.Range(0,allStr.length);
		
			        	
			letter = table[selectedIndex];
			Debug.Log("[Init()] The letter to be moved is: " + letter.name);
			selectedSentence = allTexts[selectedIndex];
			
			// compute audio time  for the first sentence
			// audio
			selectedSentence[0].AddComponent(AudioSource);
			selectedSentence[0].audio.clip = Resources.Load("audio/speech_carmichael_" + selectedIndex);
			selectedSentence[0].audio.panLevel = 0;
			if(!selectedSentence[0].audio.isPlaying)
		    	selectedSentence[0].audio.Play();
	
			if (hasAudio(selectedSentence[0]) == true){
				endTimeSentence = getAudioDuration(selectedSentence);
	    	} else{
				endTimeSentence = getScrollingDuration(selectedSentence, univ.tableSpeed[selectedIndex]);
			}
		
			// position
			for (var j = 0; j < selectedSentence.length; j++){
				selectedSentence[j].transform.position.z = zDEFAULT;
			}
			camera.transform.position.x = selectedSentence[0].transform.position.x ;
			camera.transform.position.y = selectedSentence[0].transform.position.y ;
					
			selectSentence();
			initialized = true;
			movingUnivers = true ; // LF
			move.moving = false ;
			fading = false ;
			state = STATES.SCENE_INIT;
		}
		
		/**
		* Graphic is Continously updated
		*/
		function Update () {
	
			if (transition.enabled){
		    	if (!transition.stopZooming)
					transition.ZoomLetter(transitionSentence);
		     	else{
		     		Debug.Log("Stop Zooming");
		     		transition.stopZooming = true;
		     		transition.enabled = false;
		     		for (var i = 0; i < transitionSentence.length; i++)
		     			Destroy(transitionSentence[i]);
		   		}
		   	}
	
			// move Univers
			if (!allDestroyed){
				univ.moveUnivers(allTexts, currentUnivers, selectedSentence, state, selectedSentence.length/endTimeSentence);
			}
			
			// digit move
			if (swiping){
				if (timer > 0.0f){
					camera.transform.Translate(-Vector2(swInfo.direction.x/100, swInfo.direction.y/100) * swInfo.speed/500 * Time.deltaTime);
					timer-=Time.deltaTime;
				}
				else{
					swiping = false;
					timer = defaultTimerValue;
				}
			}
			// digit drag
			else if (dragging){
				if (timer > 0.0f){
					camera.transform.Translate(-drInfo.delta/20 * defaultSpeed * Time.deltaTime);
					timer-=Time.deltaTime;
				}
				else{
					dragging = false;
					timer = defaultTimerValue;
				}
			}
		    //Finite State Machine SCENE_INIT, NEXT_SENTENCE, MOVING2NEXT, MOVING2UNIV, SENTENCE_FOCUS, TRANSITION_UNIVERSE, BLACK_OUT
		    else{
			    switch(state){
				    // start of the app
			        case STATES.SCENE_INIT: 
//			        	Debug.Log("[SCENE_INIT]");
		
						if (!initialized){
							Init();
				        }
				        if (charging){
				        	charging = false;
				        	state = STATES.MOVING2UNIV;
				        }
			        	else if ((Time.time - autoTimer) > endTimeSentence && !transition.enabled)
			        		state = STATES.NEXT_SENTENCE;
			            break;
			            
			        // [NEXT_SENTENCE] enter in a new sentence
			        case STATES.NEXT_SENTENCE:
//			        	Debug.Log("> [NEXT_SENTENCE]");
			        	deselectSentence();
			        	
			        	// teleport one sentence from front to back
			        	if (camera.transform.position.z >= zDEFAULT-zSTEP){ // test if we are at the beginning of zooming
							var indexToTeleportBack : int = (selectedIndex-nFRONT-1 < 0) ? selectedIndex-nFRONT+allTexts.length-1 : selectedIndex-nFRONT-1 ;
							Debug.Log("\t [NEXT_SENTENCE] selectedIndex="+selectedIndex+",nFRONT="+nFRONT+"Teleport : "+indexToTeleportBack);
							textFunctions.teleportSentenceBack(allTexts[indexToTeleportBack], allStr.Length, zSTEP);
						}
						// display a new sentence
						var indexSetVisible : int = (selectedIndex+nBACK+1)%allTexts.length;
						Debug.Log("\t [NEXT_SENTENCE] indexSetVisible: " + indexSetVisible);
						textFunctions.setVisibleSentence(allTexts[indexSetVisible], true, Color.grey);			
						
						deselectSentence();
						
			        	 	//We add medias to these letters
			        		var number : int = Random.Range(0,27);
			        		var name : String;
			        		
			        		if(number < 12) name = "p" + number + ".png";
			        		else name = "p" + number + ".ogv";
			        		//Debug.Log("name : " + name);
			        		
			        		var tabName : Array = new Array();
			        		tabName.push(name);
			        	
			        		var tabKeywords : Array = new Array();
			        		tabKeywords.push(selectedSentence[0].name);
			        	
			        		tableChild = genFunc.CreateChildMedias(tabName, tabKeywords);
			        		
						
						selectedIndex = (selectedIndex + 1) % allTexts.length;
//						Debug.Log("\t [NEXT_SENTENCE] selectedIndex: " + selectedIndex);
						
						// delete prev audio
						if (selectedIndex > 0)	//Destroys the sound before creating a new one
	        				Destroy(selectedSentence[0].GetComponent(AudioSource));
	
						selectedSentence = allTexts[selectedIndex];
						
						// audio
						selectedSentence[0].AddComponent(AudioSource);
						selectedSentence[0].audio.clip = Resources.Load("audio/speech_carmichael_" + selectedIndex );
						selectedSentence[0].audio.panLevel = 0;
						if(!selectedSentence[0].audio.isPlaying)
		        			selectedSentence[0].audio.Play();
	
			        	selectSentence(); // display in red the current
			      	
			        	// compute scrolling time
			        	if (hasAudio(selectedSentence[0]) == true){
	//		        		  endTimeSentence = selectedSentence[0].audio.clip.length;	
			        		endTimeSentence = getAudioDuration(selectedSentence);
			        	}
			        	else{
			        		endTimeSentence = getScrollingDuration(selectedSentence, univ.tableSpeed[selectedIndex]);
			        	}
			        	

						//speedZooming = (selectedSentence[0].transform.position.z - zDEFAULT) / zoomingTime;						
						prevCameraPos = camera.transform.position ; 
						nextCameraPos = Vector3(selectedSentence[0].transform.position.x - OFFSET_SCREEN_FOCUS,
												selectedSentence[0].transform.position.y,
												prevCameraPos.z+ zSTEP);	
				    	state = STATES.MOVING2NEXT;
			        	break;
			        	
			        // [MOVING2NEXT] translating to the next sentence
			        case STATES.MOVING2NEXT: 
//			        	Debug.Log("[MOVING2NEXT]Moving to next : "+selectedIndex);
						move.MoveObject(camera.transform, prevCameraPos, nextCameraPos, 1.5);
			        	// go to next state if the camera and the current sentence moves are finished
			        		autoTimer = Time.time;
			        		fading = false ;
			        		allDestroyed = false ; 
			        		state = STATES.SENTENCE_FOCUS;
			        	break;
			        	
			      
			        // [SENTENCE_FOCUS]scrolling the new sentence	
			        case STATES.SENTENCE_FOCUS:
//			        	Debug.Log("[SENTENCE_FOCUS] selectedIndex sentenceFocus: " + selectedIndex);
			        	//selectSentence();
			      
			        	//Debug.Log("endTime: " + endTimeSentence);
			        	if ((Time.time - autoTimer) > endTimeSentence){
			        		state = STATES.NEXT_SENTENCE;
			        		genFunc.DestroyChildMedias(tableChild);
			        	}
			            break;
			        
			        // [MOVING2UNIV] move (translating) to the next universe (on tap)
       // [MOVING2UNIV] move (translating) to the next universe (on tap)
	        case STATES.MOVING2UNIV:
	        	Debug.Log("> [MOVING2UNIV]");
	        	//	move.MoveObject (camera.transform,prevCameraPos, nextCameraPos, 3.2) ; 

				if (!move.moving)
					selectedSentence[0].audio.volume -= 0.005;

		      	Debug.Log(" Moving Camera ......................................");
       			move.movingToUniverse (camera.transform,prevCameraPos, nextCameraPos, TRANSITION_SPEED) ; 	
       
       			if (!move.moving)
       				state = STATES.FADING_UNIV ;
       			break ;
       	   case STATES.FADING_UNIV:
	        	Debug.Log("> [FADING_UNIV]");
				fadingOutAround(allTexts, 1000); // TIME = 1
				if (!fading) 
       				state = STATES.DESTROYING_UNIVERSE ;
				break ;		
		case STATES.DESTROYING_UNIVERSE:
	        	Debug.Log("> [DESTROYING_UNIVERSE]");
	        	
	        	transitionSentence = new GameObject[selectedSentence.length];
	        	for (var j = 0; j < selectedSentence.length; j++)
	        		transitionSentence[j] = Instantiate (selectedSentence[j], selectedSentence[j].transform.position, selectedSentence[j].transform.rotation) ;
	        		
				destroyAll() ;

		        // teleporting the camera and the selected sentence
	         	teleportBackToZero(transitionSentence);		 	
			 	state = STATES.BLACK_OUT;

	         	// Attach UniversLetter8.js to the zoomed letter         		
	         	//transition = selectedSentence[selectedLetter].AddComponent(UniversLetter8);
				//transition.UniversLetter(Camera.mainCamera, selectedSentence, turnOn, selectedLetter);
   	            break;
	                   
				case STATES.BLACK_OUT:
					Debug.Log(">[BLACK_OUT]");
					initialized = false;
					transition.enabled = true;
					transition.stopZooming = false;
					break;
			        default:
			            break;
				}
			}
		}
	
	/**
	* Teleports the camera and the selectedSentence back to the origin
	**/
	function teleportBackToZero(sentence : GameObject[]){
		var distanceToTeleportX : float = camera.transform.position.x;
		var distanceToTeleportY : float = camera.transform.position.y;
		var distanceToTeleportZ : float = camera.transform.position.z;

		camera.transform.position.x = 0;
		camera.transform.position.y = 0;
		camera.transform.position.z = 0;

		Debug.Log("Camera To zero : "+camera.transform.position.z);
		for (var i = 0; i < sentence.length; i++){
			sentence[i].transform.position.x -= distanceToTeleportX;
			sentence[i].transform.position.y -= distanceToTeleportY;
			sentence[i].transform.position.z -= distanceToTeleportZ;

		}
		teleported = true;
	}
	
	
		/**
		* Destroys all the texts of the previous scene
		**/
		function destroyAll(){
		  	for (var sentence : GameObject [] in allTexts) {
//		  		if (sentence != selectedSentence){
			  		for (var letter : GameObject in sentence){
		  				Destroy(letter);
		  			}
//		  		}
		    }
		    allDestroyed = true;
		}
		
		/**
		* Changes the display of the selected sentence
		**/
		function selectSentence(){
			for (var i = 0; i < selectedSentence.length; i++){
				if (selectedSentence[i].renderer != null){
						selectedSentence[i].renderer.material.color = Color.red;
				}
			}
		}
		
		/**
		* Changes the display of the deselected sentence
		**/
		function deselectSentence(){
			for (var i = 0; i < selectedSentence.length; i++){
					if (selectedSentence[i].renderer != null)
						selectedSentence[i].renderer.material.color = Color.green;
			}
		}
		
		
		/**
		* Returns the duration of the audio track associated to a sentence
		*/
		function getAudioDuration(sent : GameObject[]){
			//return 2;
			return sent[0].audio.clip.length+2;
		}
		
		/** 
		* Returns the duration of the scrolling of a sentence 
		*/
		function getScrollingDuration(sent : GameObject[], speed : float){
			return (sent.length / speed);
			//return 3;
		}
		
		/**
		* test is an audio document is associted to the sentence
		*/ 
		function hasAudio(sent : GameObject){
			if(sent.GetComponent(AudioSource) == null)
				return false;
			else
				return true;
	
		}
		
		/**
		*  Add "Gesture" to the scene to use this function and switch to the appropriate platform (build settings) 
		*/
		function OnEnable(){
			//	Gesture.onChargingE += OnCharging;
				Gesture.onShortTapE += OnTap;
				Gesture.onLongTapE += OnTap;
				Gesture.onDoubleTapE += OnTap;
				Gesture.onSwipeE += OnSwipe;
				Gesture.onDraggingE += OnDrag;
			//	Gesture.onChargeEndE += OnChargeEnd;
		}
		
		/** 
		* Add "Gesture" to the scene to use this function and switch to the appropriate platform (build settings) 
		*/
		function OnDisable(){
			//	Gesture.onChargingE -= OnCharging;
				Gesture.onShortTapE -= OnTap;
				Gesture.onLongTapE -= OnTap;
				Gesture.onDoubleTapE -= OnTap;
				Gesture.onSwipeE -= OnSwipe;
				Gesture.onDraggingE -= OnDrag;
			//	Gesture.onChargeEndE -= OnChargeEnd;
		}
		
		/** 
		* When the user touches the screen and holds their finger down 
		*/
		function OnCharging(cInfo : ChargedInfo){
			if (state == STATES.NEXT_SENTENCE || state == STATES.SENTENCE_FOCUS){
				if (!charging){
					charging = true;
					Debug.Log("charging");
					selectedLetter = Random.Range(0, selectedSentence.Length-1);
					state = STATES.MOVING2UNIV;
				}
			}
		}
		
		/**
		* When the user's tap is released
		**/
		function OnChargeEnd(cInfo : ChargedInfo){
			charging = false;
		}
		
		/**
		*  When the user swipes the screen 
		*/
		function OnSwipe(sw : SwipeInfo){
			if (state == STATES.NEXT_SENTENCE || state == STATES.SENTENCE_FOCUS)
				swipeOrDragEnabled = true;
			else
				swipeOrDragEnabled = false;
			if (swipeOrDragEnabled){
				Debug.Log("swiping");
				swInfo = sw;
				swiping = true;
				timer = defaultTimerValue;
			}
		}
		
		/**
		 * When the user drags their finger on the screen 
		 */
		function OnDrag(dr : DragInfo){
			if (state == STATES.NEXT_SENTENCE || state == STATES.SENTENCE_FOCUS)
				swipeOrDragEnabled = true;
			else
				swipeOrDragEnabled = false;
			if (swipeOrDragEnabled){
				Debug.Log("swiping");
				drInfo = dr;
				dragging = true;
				timer = defaultTimerValue;
			}
		}
		
		/**
		* tap on the screen
		*/
		function OnTap(vec : Vector2){
			if (state != STATES.SCENE_INIT){
				Debug.Log("OnTap");
				
				do{
					selectedLetter = Random.Range(0, selectedSentence.Length-1);
				}while (selectedSentence[selectedLetter].renderer == null);
				
	//			move.stopMoving = true;	
				prevCameraPos = camera.transform.position; 
				nextCameraPos = Vector3(selectedSentence[selectedLetter].renderer.bounds.center.x,
										selectedSentence[selectedLetter].renderer.bounds.center.y,
										prevCameraPos.z);
				
				selectedSentence[selectedLetter].renderer.material.color = Color.gray ;
				Debug.Log("selectedLetter: " + selectedSentence[selectedLetter].name);
	//			move.moving = false;
	//			move.stopMoving = false;
	//	       	move.MoveObject (camera.transform,prevCameraPos, nextCameraPos, 3.2) ; 
			
	//	       	fadingTimer = Time.time;
	 			movingUnivers = false ;
				state = STATES.MOVING2UNIV;
			}
		}
		
		/**
		* fading all the sentence excepted selectedSentence
		*/
		function fadingOutAll(allTexts : Array, endColor : Color, time : float){
		var i = 0.0;
		var rate = 4.0/time;
	
		if(!fadingInit) {
			fadingInit = true; // signals "I'm moving, don't bother me!"
			while (i < 1.0) {
				//	if (i > 0.01) {
				i += Time.deltaTime * rate;
//				Debug.Log ("fadingInit i="+i);
				// for all letters						
				for (var sentence : GameObject [] in allTexts) {
						if ((sentence[0].renderer != null) && (Mathf.Abs(sentence[0].renderer.material.color.r - endColor.r) < 0.01)) {
							Debug.Log("i > 0.001 ... stop fadingInit");
							fadingInit = false ;
							break;
						}
	
						for (var let in sentence){
							if (let.renderer != null){
								let.renderer.material.color = Color.Lerp (let.renderer.material.color, endColor, i);
							}
						}
				}
				yield; 
			}
			fadingInit = false;
		}
	}
		
		/**
	* fading all the sentence expected the selected one LF
	*/
	function fadingOutAround (allTexts : Array, time : float) {
		var i = 0.0;
		var rate = 1.0/time;
	
		if(!fading) {
			fading = true; // signals "I'm moving, don't bother me!"
			while (i < 1.0) {
				if (i > 0.001) {
					Debug.Log("i > 0.001 ... stop fadding");
					fading = false ;
					state = STATES.DESTROYING_UNIVERSE ;
					break;
				}
				i += Time.deltaTime * rate;
				Debug.Log ("fadingi="+i);
				// for all letters						
				for (var sentence : GameObject [] in allTexts) {
					if (sentence != selectedSentence){
						for (var let in sentence){
							if (let.renderer != null){
								let.renderer.material.color = Color.Lerp (let.renderer.material.color, Color(255,255,255), i);
							}
						}
					}
				}
				yield; 
			}
			fading = false;
		}
	}
	
	/**
	*	getter for ZSTEP
	*/
function getZSTEP() {
	return zSTEP ;
}
/**
	*	getter for ZDEFAULT
	*/
function getZDEFAULT() {
	return zDEFAULT ;
}