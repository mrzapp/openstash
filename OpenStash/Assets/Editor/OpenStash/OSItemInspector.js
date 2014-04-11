#pragma strict

import System.Collections.Generic;

@CustomEditor ( OSItem )
public class OSItemInspector extends Editor {
	override function OnInspectorGUI () {
		var item : OSItem = target as OSItem;
		var inventory : OSInventory = OSInventory.GetInstance ();

		if ( !inventory ) {
			for ( var i : OSInventory in Resources.FindObjectsOfTypeAll (  typeof ( OSInventory ) ) ) {
				OSInventory.instance = i;
			}

			EditorGUILayout.LabelField ( "There is no OSInventory prefab in this project." );
			return;
		}
	
		// Name and description
		EditorGUILayout.LabelField ( "Id", EditorStyles.boldLabel );
		item.id = EditorGUILayout.TextField ( "Name", item.id );
		item.description = EditorGUILayout.TextField ( "Description", item.description );

		// Category
		EditorGUILayout.Space ();
		EditorGUILayout.LabelField ( "Category", EditorStyles.boldLabel );

		item.catIndex = EditorGUILayout.Popup ( "Category", item.catIndex, inventory.GetCategoryStrings () );
		
		if ( item.subcatIndex >= inventory.categories [ item.catIndex ].subcategories.Length ) {
			item.subcatIndex = 0;
		}
		
		item.subcatIndex = EditorGUILayout.Popup ( "Subcategory", item.subcatIndex, inventory.categories [ item.catIndex ].subcategories );
		
		// Slot width and height
		EditorGUILayout.Space ();
		EditorGUILayout.LabelField ( "Slot dimensions", EditorStyles.boldLabel );
		EditorGUILayout.BeginHorizontal ();

		item.slotWidth = EditorGUILayout.IntField ( item.slotWidth );
		EditorGUILayout.LabelField ( "x", GUILayout.Width ( 20 ) );
		item.slotHeight = EditorGUILayout.IntField ( item.slotHeight );

		EditorGUILayout.EndHorizontal ();
		
		if ( item.slotWidth < 1 ) { item.slotWidth = 1; }
		if ( item.slotHeight < 1 ) { item.slotHeight = 1; }

		// Attributes
		EditorGUILayout.Space ();
		EditorGUILayout.LabelField ( "Attributes", EditorStyles.boldLabel );
		EditorGUILayout.BeginHorizontal ();
		
		EditorGUILayout.BeginVertical ();
		
		for ( var i : int = 0; i < item.attributes.Length; i++ ) {
			EditorGUILayout.BeginHorizontal ();
			
			item.attributes[i].keyIndex = EditorGUILayout.Popup ( item.attributes[i].keyIndex, inventory.attributes );
			item.attributes[i].value = EditorGUILayout.FloatField ( item.attributes[i].value );

			if ( GUILayout.Button ( "X" ) ) {
				var tmpAttr : List.< OSAttribute > = new List.< OSAttribute > ( item.attributes );

				tmpAttr.RemoveAt ( i );

				item.attributes = tmpAttr.ToArray ();
			}
			
			EditorGUILayout.EndHorizontal ();
		}
		
		if ( GUILayout.Button ( "Add" ) ) {
			tmpAttr = new List.< OSAttribute > ( item.attributes );

			tmpAttr.Add ( new OSAttribute () );

			item.attributes = tmpAttr.ToArray ();
		}
		
		EditorGUILayout.EndVertical ();

		EditorGUILayout.EndHorizontal ();

		// Textures
		EditorGUILayout.Space ();
		EditorGUILayout.LabelField ( "Textures", EditorStyles.boldLabel );

		item.thumbnail = EditorGUILayout.ObjectField ( "Thumbnail", item.thumbnail as Object, typeof ( Texture2D ), false ) as Texture2D;
		item.preview = EditorGUILayout.ObjectField ( "Preview", item.preview as Object, typeof ( Texture2D ), false ) as Texture2D;
	}
}