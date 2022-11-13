import { Component, OnInit } from '@angular/core';
import { Firestore, collectionData, collection, CollectionReference, Query, where, query } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Product, FirebaseCart, FirebaseCartLine, FirebaseOrder } from '../types'

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {
  orders$: Observable<any[]> | null = null;
  orders: FirebaseOrder[] | null = null;

  constructor(private firestore: Firestore) {
    let ordersCollection = collection(this.firestore, 'orders');
    let pendingOrdersQuery = query(ordersCollection, where("status", "==", "Pending Review"))
    this.orders$ = collectionData(pendingOrdersQuery)
    this.orders$.subscribe(order => this.orders = order)
  }

  ngOnInit(): void {

  }

}
