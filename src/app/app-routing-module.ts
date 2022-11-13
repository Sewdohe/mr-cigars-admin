import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router'; // CLI imports router
import { OrderComponent } from './order/order.component';
import { OrdersComponent } from './orders/orders.component';

const routes: Routes = [
  {
    path: '',
    component: OrdersComponent
  },
  {
    path: 'order/:id',
    component: OrderComponent
  }
]; // sets up routes constant where you define your routes

// configures NgModule imports and exports
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
