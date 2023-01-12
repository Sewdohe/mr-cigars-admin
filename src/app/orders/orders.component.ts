import { Component, OnInit, HostListener } from '@angular/core';
import { Firestore, collectionData, collection, where, query } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { TauriService } from '../services/tauri.service';
import { FirebaseOrder } from '../types'
import { ActivatedRoute } from '@angular/router'

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {
  orders$: Observable<any[]> | null = null;
  orders: FirebaseOrder[] | null = null;
  viewType: string | null = null;

  constructor(private firestore: Firestore, private tauri: TauriService, private route: ActivatedRoute) {
    let ordersCollection = collection(this.firestore, 'orders');
    this.viewType = this.route.snapshot.paramMap.get('viewType')
    let pendingOrdersQuery = query(ordersCollection, where("status", "==", this.viewType))
    this.orders$ = collectionData(pendingOrdersQuery)
    this.orders$.subscribe(order => this.orders = order)
  }

  ngOnInit(): void {
    this.route.params.subscribe(routeParams => {
      console.log(routeParams)
      let ordersCollection = collection(this.firestore, 'orders');
      let pendingOrdersQuery = query(ordersCollection, where("status", "==", routeParams['viewType']))
      this.orders$ = collectionData(pendingOrdersQuery)
      this.orders$.subscribe(order => this.orders = order)
    });
  }

  sendNotif() {
    this.tauri.sendNotification({ title: 'Test Notification', body: 'This is a sample notification' })
  }

  @HostListener('unloaded')
  ngOnDestroy() {
    console.log('Cleared');
  }


}
