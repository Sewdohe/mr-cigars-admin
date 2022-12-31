import { Component, OnInit } from '@angular/core';
import { Firestore, collectionData, collection, CollectionReference, Query, where, query } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { User } from '../types';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.css']
})
export class CustomersComponent implements OnInit {
  users$: Observable<User[]>;

  constructor(private firestore: Firestore) {
    let ordersCollection = collection(this.firestore, 'users');
    // @ts-ignore
    this.users$ = collectionData<User>(ordersCollection);
  }

  ngOnInit(): void {
  }

}
