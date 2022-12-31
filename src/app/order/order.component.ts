import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { Router, ActivatedRoute, ParamMap } from "@angular/router";
import { CustomerDocument, FirebaseCartLine, FirebaseOrder } from "../types";
import {
  Firestore,
  doc,
  docData,
  increment,
  DocumentReference,
  onSnapshot,
  DocumentSnapshot,
  DocumentData,
  collection,
  CollectionReference,
  getDoc,
  arrayUnion,
} from "@angular/fire/firestore";
import { Observable } from "rxjs";
import { updateDoc } from "@firebase/firestore";
// @ts-ignore
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { save } from '@tauri-apps/api/dialog';
import { readBinaryFile, writeFile } from '@tauri-apps/api/fs';

@Component({
  selector: "app-order",
  templateUrl: "./order.component.html",
  styleUrls: ["./order.component.css"],
})
export class OrderComponent implements OnInit {
  orderID: string | null = null;
  order: FirebaseOrder | null = null;
  order$: Observable<FirebaseOrder> | null = null;
  orderDatePretty: Date | null = new Date();
  displayedColumns: string[] = [
    "name",
    "flavor",
    "price",
    "quantity",
    "modifier",
    "total",
  ];
  orderRef: DocumentReference | null = null;
  orderReviewed: boolean = false;
  @ViewChild('invoice') invoice: ElementRef | null = null;
  pathTauri: string = ''

  constructor(private route: ActivatedRoute, private firestore: Firestore) {}

  ngOnInit(): void {
    const routeParams = this.route.snapshot.paramMap;

    this.orderID = routeParams.get("id");
    this.orderRef = doc(this.firestore, `orders/${this.orderID}`);
    //@ts-ignore
    this.order$ = docData(this.orderRef);

    this.order$?.subscribe((order: FirebaseOrder) => {
      this.order = order;
    });
  }

  ngAfterViewInit() {
    console.log(this.invoice);
  }

  incrementModifier(index: number): void {
    this.order!.cart[index].modifier++;
    updateDoc(this.orderRef!, { cart: this.order!.cart });
  }

  decrementModifier(index: number): void {
    this.order!.cart[index].modifier--;
    updateDoc(this.orderRef!, { cart: this.order!.cart });
  }

  confirmUpdatedInvoice(): void {
    let user: CustomerDocument;
    updateDoc(this.orderRef!, { status: "Reviewed" }).then((_val) => {
      console.log("order was confirmed");
    });

    //TODO: forEach over the user document and find the invoice
    //ID corrispoding with the currently edited invoice and update it as "reviewed"
    let usersCollectionRef = collection(this.firestore, "users");
    let userRef = doc(usersCollectionRef, this.order?.customerUID);
    getDoc(userRef).then((document) => {
      console.log(document.data());
      //@ts-ignore
      let customerData: CustomerDocument = document.data();
      let orders = customerData.orders;

      orders.forEach((order, idx) => {
        if (order.id == this.order?.id) {
          order.cart = this.order.cart;
          order.status = "Reviewed";
        }
        updateDoc(userRef, { orders: orders }).then(
          () => (this.orderReviewed = true)
        );
      });
    });
  }

  generatePDF() {
    const element = this.invoice?.nativeElement
    var opt = {
      margin: 1,
      filename: "html2pdf_example.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
    };
    console.log('Generating PDF...')
  }

  public openPDF(): void {
    let DATA: any = document.getElementById('invoice');
    let contents = ''
    html2canvas(DATA).then(async (canvas) => {
      let fileWidth = 8.5;
      let fileHeight = (canvas.height * fileWidth) / canvas.width;
      const FILEURI = canvas.toDataURL('image/png');
      let PDF = new jsPDF('p', 'in', 'letter');
      let position = 0;
      PDF.addImage(FILEURI, 'PNG', 0, position, fileWidth, fileHeight);
      PDF.save('invoice.pdf');
      // contents = PDF.output()
      // await save({}).then((data) => {this.pathTauri = data!;})
      // await writeFile({ path: this.pathTauri, contents: contents });
    });
  }
}