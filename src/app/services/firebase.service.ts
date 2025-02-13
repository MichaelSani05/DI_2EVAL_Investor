import { Injectable, inject } from '@angular/core';
import { Database, ref, get, set, child } from '@angular/fire/database';
import { equalTo, orderByChild, query } from 'firebase/database';
import { from, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FirebaseService {
  private db = inject(Database); // Inyección de dependencias para standalone

  constructor() {}

  // Obtener todos los usuarios
  getUsers(): Observable<any[]> {
    const dbRef = ref(this.db, 'users');
    return from(
      get(dbRef).then((snapshot) => (snapshot.exists() ? snapshot.val() : []))
    );
  }

  getUserById(userId: string): Observable<any> {
    const dbRef = ref(this.db);
    return from(
      get(child(dbRef, `users/${userId}`)).then((snapshot) =>
        snapshot.exists() ? snapshot.val() : null
      )
    );
  }

  // Agregar o actualizar un usuario
  saveUser(userId: string, userData: any): Promise<void> {
    const dbRef = ref(this.db, `users/${userId}`);
    return set(dbRef, userData);
  }

  getTransactionsByUserId(userId: string): Observable<any[]> {
    const transactionsRef = ref(this.db, 'transactions');
    const userTransactionsQuery = query(transactionsRef, orderByChild('userId'), equalTo(userId));

    return from(
      get(userTransactionsQuery).then((snapshot) =>
        snapshot.exists() ? Object.values(snapshot.val()) : []
      )
    );
  }
}
