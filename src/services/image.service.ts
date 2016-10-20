import { Injectable } from '@angular/core';
import { AngularFire, FirebaseObjectObservable } from 'angularfire2';

import { Image } from '../models/image';

@Injectable()
export class ImageService {

	private _observableImages: Object;

	constructor(
		private af: AngularFire,
	) {
		this._observableImages = {};
	}

	getObservableImage(id: string): FirebaseObjectObservable<Image> {
		if (!this._observableImages[id]) {
			this._observableImages[id] = this.af.database.object('/images/'+id)
		}
		return this._observableImages[id];
	}

}

