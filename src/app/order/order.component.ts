import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { CustomerDocument, FirebaseCartLine, FirebaseOrder } from '../types';
import { Firestore, doc, docData, increment, DocumentReference, onSnapshot, DocumentSnapshot, DocumentData, collection, CollectionReference, getDoc, arrayUnion } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { updateDoc } from '@firebase/firestore';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {
  orderID: string | null = null;
  order: FirebaseOrder | null = null;
  order$: Observable<FirebaseOrder> | null = null;
  orderDatePretty: Date | null = new Date()
  displayedColumns: string[] = ['name', 'flavor','price', 'quantity', 'modifier', 'total'];
  orderRef: DocumentReference | null = null;

  constructor(
    private route: ActivatedRoute,
    private firestore: Firestore) { }

  ngOnInit(): void {
    const routeParams = this.route.snapshot.paramMap;

    this.orderID = routeParams.get('id')
    this.orderRef = doc(this.firestore, `orders/${this.orderID}`);
    //@ts-ignore
    this.order$ = docData(this.orderRef)

    this.order$?.subscribe((order: FirebaseOrder) => {
      this.order = order;
    })
  }

  incrementModifier(index: number): void {
    this.order!.cart[index].modifier ++;
    updateDoc(this.orderRef!, { cart: this.order!.cart})
  }

  decrementModifier(index: number): void {
    this.order!.cart[index].modifier --;
    updateDoc(this.orderRef!, { cart: this.order!.cart})
  }

  confirmUpdatedInvoice(): void {
    let user: CustomerDocument;
    updateDoc(this.orderRef!, { status: 'Reviewed'}).then(_val => {
     console.log('order was confirmed') 
    })

    //TODO: forEach over the user document and find the invoice
    //ID corrispoding with the currently edited invoice and update it as "reviewed"
    let usersCollectionRef = collection(this.firestore, 'users');
    let userRef = doc(usersCollectionRef, this.order?.customerUID);
    getDoc(userRef).then((document) => {
      console.log(document.data()) 
      //@ts-ignore
      let customerData: CustomerDocument = document.data();
      let orders = customerData.orders;

      orders.forEach((order, idx) => {
        if(order.id == this.order?.id){
          order.cart = this.order.cart;
          order.status = "Reviewed"
        }
        updateDoc(userRef, {orders: orders})
      })
    })
    
  }

}
