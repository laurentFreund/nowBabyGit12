// dynamic_weights_panel.cs
// Author: Thomas BAUDIN

using UnityEngine;
using System.Collections;
using System;
using System.Text;
using System.Collections.Generic;

public class dynamic_weights_panel : MonoBehaviour
{
//*****************  KEYWORDS CATEGORIES  ******************
	public enum categories {
		themes,
		locations,
		persons,
		genre,
		misc,
		system,
		nb_categories
	};
	
	const int themes = (int)categories.themes;
	const int locations = (int)categories.locations;
	const int persons = (int)categories.persons;
	const int genre = (int)categories.genre;
	const int misc = (int)categories.misc;
	const int system = (int)categories.system;
	const int nb_categories = (int)categories.nb_categories;
	
	int[] nb_cat = new int[nb_categories];
	static float[] categories_field = new float[nb_categories];
//-----------------------------------------------------------
	
//*********************  MEDIA TYPE  ************************
	public enum media_type {
		text_type,
		audio_type,
		image_type,
		video_type,
		nb_media_type
	};
	
	const int text_type = (int)media_type.text_type;
	const int audio_type = (int)media_type.audio_type;
	const int image_type = (int)media_type.image_type;
	const int video_type = (int)media_type.video_type;
	const int nb_media_type = (int)media_type.nb_media_type;
	
	static float[] media_type_field = new float[nb_media_type];
//-----------------------------------------------------------

//****************  DIMENSIONS SETTINGS  ********************
	public enum dimensions {
		length_min,
		length_max,
		weight_min,
		weight_max,
		width_min,
		width_max,
		height_min,
		height_max,
		nb_dimensions
	};
	
	const int length_min = (int)dimensions.length_min;
	const int length_max = (int)dimensions.length_max;
	const int weight_min = (int)dimensions.weight_min;
	const int weight_max = (int)dimensions.length_max;
	const int width_min = (int)dimensions.width_min;
	const int width_max = (int)dimensions.length_max;
	const int height_min = (int)dimensions.height_min;
	const int height_max = (int)dimensions.length_max;
	const int nb_dimensions = (int)dimensions.nb_dimensions;
	
	int[] length_tab = new int[2];
	int[] weight_tab = new int[2];
	int[] width_tab = new int[2];
	int[] height_tab = new int[2];
	
	static float[] dimensions_field = new float[nb_dimensions];
//----------------------------------------------------------
	
	public static bool save = false;
	int[] cpt = new int[nb_categories];
	const int size_keyword_vector = 30;	//Update the maximum value!
	Vector2[] tab_scroll = new Vector2[nb_categories];
	static float[][] keyword_vector = new float[nb_categories][];
	static string[][] keyword_name = new string[nb_categories][];
	static float author;

	void Start() {
		for (int i=0; i<nb_categories; i++)	//default values for keywords categories
			categories_field[i] = 1.0f;
		
		for (int i=0; i<nb_media_type; i++)	//default values for media type
			media_type_field[i] = 1.0f;
		
		for (int i=0; i<nb_dimensions; i++)	//default values for dimensions settings
			dimensions_field[i] = 1.0f;
		
		author = 1.0f;	//default value for other media settings
		
		for (int i=0; i<nb_categories; i++) {	//init of the keywords svector
			keyword_name[i] = new string[size_keyword_vector];
			nb_cat[i] = 0;
		}
		
		foreach (KeyValuePair<string,string> entry in keyCat.hashKeyCat){
			switch (entry.Value) {
				case "themes":
					keyword_name[themes][nb_cat[themes]] = entry.Key;
					nb_cat[themes]++;
					break;
				case "locations":
					keyword_name[locations][nb_cat[locations]] = entry.Key;
					nb_cat[locations]++;
					break;
				case "persons":
					keyword_name[persons][nb_cat[persons]] = entry.Key;
					nb_cat[persons]++;
					break;
				case "genre":
					keyword_name[genre][nb_cat[genre]] = entry.Key;
					nb_cat[genre]++;
					break;
				case "misc":
					keyword_name[misc][nb_cat[misc]] = entry.Key;
					nb_cat[misc]++;
					break;
				case "system":
					keyword_name[system][nb_cat[system]] = entry.Key;
					nb_cat[system]++;
					break;
				default:
					Debug.Log("!--Error: default switch case line 132--!");
					break;
			}
		}
		
		for (int i=0; i<nb_categories; i++) {	//default values for all keywords
			keyword_vector[i] = new float[nb_cat[i]];
			for (int j=0; j<nb_cat[i]; j++)
				keyword_vector[i][j] = 1.0f;
		}
		
		for (int i=0; i<nb_categories; i++) {
			tab_scroll[i] = Vector2.zero;	//init scroll if keywords list exceeds window length
			cpt[i] = 0;	//init the counter of keywords by categories
		}
	}
	
	void OnGUI() {
		GUIStyle style = new GUIStyle();
		style.alignment = TextAnchor.UpperLeft;
		const int panel_x = 0;
		const int panel_y = 0;	
		int panel_X = Screen.width;
		int panel_Y = Screen.height;
		
		GUI.Box(new Rect(panel_x, panel_y, panel_X, panel_Y), "------------------------------------------------------------------------------------------------------------------------------------------------ Weights settings panel ------------------------------------------------------------------------------------------------------------------------------------------------");
		
//***********************************************************  WEIGHTS PANEL OF KEYWORDS'S CATEGORIES  *******************************************************
		const int panel_key_x = panel_x+40;
		const int panel_key_y = panel_y+40;
		const int key_cat_Box_x = panel_key_x+10;
		const int key_cat_Box_y = panel_key_y+40;
		const int key_cat_Box_X = 300;
		const int key_cat_Box_Y = 370;
		const int key_cat_Box_dx = 330;
		const int key_cat_Box_dy = 30;
		const int panel_key_cat_dy = 25;
		const int keyword_space_X = 200;	// < key_cat_Box_X
		const int keyword_label_X = 180;
		const int keyword_label_Y = 20;
		const int keyword_textField_x = keyword_label_X+10;
		const int keyword_textField_X = 60;
		const int keyword_textField_Y = 20;
		const int panel_key_X = 3*key_cat_Box_dx-10;
		const int panel_key_Y = 2*(key_cat_Box_Y+panel_key_cat_dy)+30;
		const int key_cat_scroll_y = key_cat_Box_y+60;
		const int key_cat_scroll_Y = key_cat_Box_Y-60;
		const int key_cat_scroll_x = key_cat_Box_x+4;
		
		GUI.Box(new Rect(panel_key_x, panel_key_y, panel_key_X, panel_key_Y), "Keyword's categories");
		
		for (int i=0; i<nb_categories; i++) {
			if (i<3) {
				GUI.Box(new Rect(key_cat_Box_x+key_cat_Box_dx*i, key_cat_Box_y, key_cat_Box_X, key_cat_Box_Y), Enum.GetName(typeof(categories), i));
				categories_field[i] = GUI.HorizontalSlider(new Rect(key_cat_Box_x+130+key_cat_Box_dx*i, key_cat_Box_y+20, keyword_textField_X, keyword_textField_Y), categories_field[i], 0.0f, 1.0f);
				GUI.Label(new Rect(key_cat_Box_x+200+key_cat_Box_dx*i, key_cat_Box_y+20, 20, 20), ""+categories_field[i]);
				tab_scroll[i] = GUI.BeginScrollView (new Rect (key_cat_scroll_x+key_cat_Box_dx*i, key_cat_scroll_y, key_cat_Box_X-5, key_cat_scroll_Y), tab_scroll[i], new Rect (0, 0, keyword_space_X, panel_key_cat_dy*nb_cat[i]));
					for (int j=0; j<nb_cat[i]; j++) {
						GUI.Label(new Rect(0, panel_key_cat_dy*j, keyword_label_X, keyword_label_Y), keyword_name[i][j]);
						keyword_vector[i][j] = GUI.HorizontalSlider(new Rect(keyword_textField_x, panel_key_cat_dy*j, keyword_textField_X, keyword_textField_Y), keyword_vector[i][j], 0.0f, 1.0f);
						GUI.Label(new Rect(keyword_textField_x+keyword_textField_X+10, panel_key_cat_dy*j, 20, 20), ""+keyword_vector[i][j]);
					}
				GUI.EndScrollView();
			}
			else {
				GUI.Box(new Rect(key_cat_Box_x+key_cat_Box_dx*(i-3), key_cat_Box_y+key_cat_Box_Y+key_cat_Box_dy, key_cat_Box_X, key_cat_Box_Y), Enum.GetName(typeof(categories), i));
				categories_field[i] = GUI.HorizontalSlider(new Rect(key_cat_Box_x+130+key_cat_Box_dx*(i-3), key_cat_Box_y+key_cat_Box_Y+key_cat_Box_dy+20, keyword_textField_X, keyword_textField_Y), categories_field[i], 0.0f, 1.0f);
				GUI.Label(new Rect(key_cat_Box_x+200+key_cat_Box_dx*(i-3), key_cat_Box_y+key_cat_Box_Y+key_cat_Box_dy+20, 20, 20), ""+categories_field[i]);
				tab_scroll[i] = GUI.BeginScrollView (new Rect (key_cat_scroll_x+key_cat_Box_dx*(i-3), key_cat_Box_y+key_cat_Box_Y+key_cat_scroll_y-50, key_cat_Box_X-5, key_cat_scroll_Y), tab_scroll[i], new Rect (0, 0, keyword_space_X, panel_key_cat_dy*nb_cat[i]));
					for (int j=0; j<nb_cat[i]; j++) {
						GUI.Label(new Rect(0,panel_key_cat_dy*j, keyword_label_X, keyword_label_Y), keyword_name[i][j]);
						keyword_vector[i][j] = GUI.HorizontalSlider(new Rect(keyword_textField_x, panel_key_cat_dy*j, keyword_textField_X, keyword_textField_Y), keyword_vector[i][j], 0.0f, 1.0f);
						GUI.Label(new Rect(keyword_textField_x+keyword_textField_X+10, panel_key_cat_dy*j, 20, 20), ""+keyword_vector[i][j]);
					}
				GUI.EndScrollView();
			}
		}
		
//**********************************************************  WEIGHTS PANEL OF MEDIAS TYPE  ***************************************************************
		const int panel_media_x = panel_x + 1050;
		const int panel_media_y = panel_y + 40;
		const int panel_media_X = 250;
		const int panel_media_Y = 150;
		const int panel_media_dy = 25;
		
		GUI.Box(new Rect(panel_media_x, panel_media_y, panel_media_X, panel_media_Y), "Media's types");
		
		for (int i=0; i<nb_media_type; i++) {
			GUI.Label(new Rect(panel_media_x+10, panel_media_y+40+panel_media_dy*i, 120, 21), Enum.GetName(typeof(media_type), i));
			media_type_field[i] = GUI.HorizontalSlider(new Rect(panel_media_x+160, panel_media_y+40+panel_media_dy*i, 60, 20), media_type_field[i], 0.0f, 1.0f);
			GUI.Label(new Rect(panel_media_x+225, panel_media_y+40+panel_media_dy*i, 20, 20), ""+media_type_field[i]);
		}
		
//********************************************************  WEIGHTS PANEL FOR DIMENSION SETTINGS  ********************************************************
		const int panel_visual_set_x = panel_x + 1050;
		const int panel_visual_set_y = panel_y + 210;
		const int panel_visual_set_X = 250;
		const int panel_visual_set_Y = 250;
		const int panel_visual_set_dy = 25;
		
		GUI.Box(new Rect(panel_visual_set_x, panel_visual_set_y, panel_visual_set_X, panel_visual_set_Y), "Visual media settings");
		
		for (int i=0; i<nb_dimensions; i++) {
			GUI.Label(new Rect(panel_visual_set_x+10, panel_visual_set_y+40+panel_visual_set_dy*(i-length_min), 120, 20), Enum.GetName(typeof(dimensions), i));
			if (i==length_min || i==weight_min || i==width_min || i==height_min ) {
				if (dimensions_field[i]>dimensions_field[i+1])
					dimensions_field[i] = GUI.HorizontalSlider(new Rect(panel_visual_set_x+160, panel_visual_set_y+40+panel_visual_set_dy*i, 60, 20), dimensions_field[i+1], 0.0f, 1.0f);
				else
					dimensions_field[i] = GUI.HorizontalSlider(new Rect(panel_visual_set_x+160, panel_visual_set_y+40+panel_visual_set_dy*i, 60, 20), dimensions_field[i], 0.0f, 1.0f);
			}
			else {
				if (dimensions_field[i]<dimensions_field[i-1])
					dimensions_field[i] = GUI.HorizontalSlider(new Rect(panel_visual_set_x+160, panel_visual_set_y+40+panel_visual_set_dy*i, 60, 20), dimensions_field[i-1], 0.0f, 1.0f);
				else
					dimensions_field[i] = GUI.HorizontalSlider(new Rect(panel_visual_set_x+160, panel_visual_set_y+40+panel_visual_set_dy*i, 60, 20), dimensions_field[i], 0.0f, 1.0f);
			}
			GUI.Label(new Rect(panel_visual_set_x+225, panel_visual_set_y+40+panel_visual_set_dy*i, 20, 20), ""+dimensions_field[i]);
		}
				
//********************************************************  WEIGHTS PANEL OF OTHER SETTINGS  *******************************************************
		const int panel_other_set_x = panel_x + 1050;
		const int panel_other_set_y = panel_y + 480;
		const int panel_other_set_X = 250;
		const int panel_other_set_Y = 250;
		
		GUI.Box(new Rect(panel_other_set_x, panel_other_set_y, panel_other_set_X, panel_other_set_Y), "Other media settings");
		
		GUI.Label(new Rect(panel_other_set_x+10, panel_other_set_y+40, 120, 20), "Author");
		author = GUI.HorizontalSlider(new Rect(panel_other_set_x+160, panel_other_set_y+40, 60, 20), author, 0.0f, 1.0f);
		GUI.Label(new Rect(panel_other_set_x+225, panel_other_set_y+40, 20, 20), ""+author);
		
//***********************************************************  SAVE AND SEND WEIGHTS  ***********************************************************
		if (GUI.Button(new Rect(panel_other_set_x+50,panel_other_set_y+280,150,40),"Save")) {
			Save();
			save = true;
			Debug.Log(""+save);
		}
	}
	
	void Save() {
		for (int i=0; i<2; i++) {	//Update dimensions values
			length_tab[i] = (int)(100*dimensions_field[i+length_min]);
			weight_tab[i] = (int)(100*dimensions_field[i+weight_min]);
			width_tab[i] = (int)(100*dimensions_field[i+width_min]);
			height_tab[i] = (int)(100*dimensions_field[i+height_min]);
		}
		
		loadHashtable.acceptedDimensions["length"] = length_tab;
		loadHashtable.acceptedDimensions["weight"] = weight_tab;
		loadHashtable.acceptedDimensions["width"] = width_tab;
		loadHashtable.acceptedDimensions["height"] = height_tab;
		
		for (int i=0; i<nb_media_type; i++)	//Update media type values
			loadHashtable.mediatypeWeight[""+i] = (int)(100*media_type_field[i]);
		
		for (int i=0; i<nb_categories; i++) {
			loadHashtable.categoryWeight[Enum.GetName(typeof(categories), i)] = (int)(100*categories_field[i]);	//Update media categories values
			cpt[i] = 0;	//init keywords's counter for each category 
		}
		
		foreach (KeyValuePair<string,string> entry in keyCat.hashKeyCat){
			switch (entry.Value) {
				case "themes":
					loadHashtable.keywordWeight[entry.Key] = (int)(100*keyword_vector[themes][cpt[themes]]);
					cpt[themes]++;
					break;
				case "locations":
					loadHashtable.keywordWeight[entry.Key] = (int)(100*keyword_vector[locations][cpt[locations]]);
					cpt[locations]++;
					break;
				case "persons":
					loadHashtable.keywordWeight[entry.Key] = (int)(100*keyword_vector[persons][cpt[persons]]);
					cpt[persons]++;
					break;
				case "genre":
					loadHashtable.keywordWeight[entry.Key] = (int)(100*keyword_vector[genre][cpt[genre]]);
					cpt[genre]++;
					break;
				case "misc":
					loadHashtable.keywordWeight[entry.Key] = (int)(100*keyword_vector[misc][cpt[misc]]);
					cpt[misc]++;
					break;
				case "system":
					loadHashtable.keywordWeight[entry.Key] = (int)(100*keyword_vector[system][cpt[system]]);
					cpt[system]++;
					break;
				default:
					Debug.Log("!--Error: default switch case line 203--!");
					break;
			}
		}
//		Debug.Log ("Poids du \"Vietnam\""+((int)(100*keyword_vector[locations][3])));
		Debug.Log ("\"Ignore\" system weight : "+(loadHashtable.keywordWeight["Ignore"]));
	}
}
