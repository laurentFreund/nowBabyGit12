// compareListElements.cs
// Author: Johanna PHAM

using System;
using System.Collections.Generic;

public class compareListElements{
	public static int Compare(listElement x, listElement y){
		if (x == null){
			if (y == null){
				// If x is null and y is null, they're equal. 
				return 0;
			}
			else{
				// If x is null and y is not null, y is greater.
				return 1;
			}
		}
		else{
			// If x is not null...
			if (y == null){
			// ...and y is null, x is greater.
				return -1;
			}
			else{
				// ...and y is not null, compare the 
				// score of the two listElement.
				if (x.score < y.score){
					return 1;
				}
				else if (x.score > y.score){
					return -1;
				}
				else{
					return 0;
				}
			}
		}
	}
}
