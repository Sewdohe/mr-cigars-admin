import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData, query, where } from '@angular/fire/firestore';
import { isPermissionGranted, requestPermission, sendNotification, Options } from '@tauri-apps/api/notification';
import { Observable } from 'rxjs';
import { FirebaseOrder } from '../types';


@Injectable({
  providedIn: 'root'
})
export class TauriService {
  permissionGranted: boolean = false;
  orders$: Observable<any[]> | null = null;
  orders: FirebaseOrder[] | null = null;
  ordersLen: number = 0;
  lastOrdersLen: number = 0;

  constructor(private firestore: Firestore) {
    this.askPermission();
  }

  async askPermission() {
    this.permissionGranted = await isPermissionGranted();

    if (!this.permissionGranted) {
      const permission = await requestPermission();
      this.permissionGranted = permission === 'granted';
    }
  }

  sendNotification(options: Options) {
    console.log('sending notif')
     sendNotification({title: 'wow', body: 'WOWWWW'})
  }
}
