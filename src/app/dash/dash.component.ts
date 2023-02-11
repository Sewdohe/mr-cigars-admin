import { Component, OnInit, Optional } from "@angular/core";
import { Messaging, getToken, onMessage } from "@angular/fire/messaging";
import { EMPTY, from, Observable } from "rxjs";
import { share, tap } from "rxjs/operators";
import { environment } from "src/environments/environment";

@Component({
  selector: "app-dash",
  templateUrl: "./dash.component.html",
  styleUrls: ["./dash.component.css"],
})
export class DashComponent implements OnInit {
  token$: Observable<any> = EMPTY;
  message$: Observable<any> = EMPTY;
  showRequest = false;

  ngOnInit(): void {
    this.request();
    this.getAndStoreToken();
  }

  constructor(@Optional() private messaging: Messaging) {
    console.log("messaging", messaging);
    if (messaging) {
      this.token$ = from(
        navigator.serviceWorker
          .register("firebase-messaging-sw.js", { type: "module", scope: "__" })
          .then((serviceWorkerRegistration) => {
            getToken(messaging, {
              serviceWorkerRegistration,
              vapidKey: environment.firebase.vapidKey,
            });
          })
      ).pipe(
        tap((token) => {
          console.log("FCM", { token })
          console.warn('IM WORKING')
        }),
        share()
      );
      this.message$ = new Observable((sub) =>
        onMessage(messaging, (it) => sub.next(it))
      ).pipe(tap((token) => console.log("FCM", { token })));
    }
  }
  
  getAndStoreToken() {
    this.token$.subscribe(token => {
      console.log(token)
    })
  }

  request() {
    Notification.requestPermission();
  }
}
