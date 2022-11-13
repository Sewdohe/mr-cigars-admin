import { Component } from "@angular/core";

@Component({
  selector: "app-root",
  template: `
    <div class="container mat-app-background">
      <router-outlet></router-outlet>
    </div>
  `,
  styles: [
    `
    `,
  ],
  standalone: false,
})
export class AppComponent {
  
}
