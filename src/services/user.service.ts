import { Injectable } from '@angular/core';
import { AngularFire, FirebaseObjectObservable } from 'angularfire2';

import { User } from '../models/user';

@Injectable()
export class UserService {

	private _observableUsers: Object;

	constructor(
		private af: AngularFire,
	) {
		this._observableUsers = {};
	}

	getObservableUser(id: string): FirebaseObjectObservable<User> {
		if (!this._observableUsers[id]) {
			this._observableUsers[id] = this.af.database.object('/users/'+id)
		}
		return this._observableUsers[id];
	}

}
