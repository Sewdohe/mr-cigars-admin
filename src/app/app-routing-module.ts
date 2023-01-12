import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router'; // CLI imports router
import { CustomersComponent } from './customers/customers.component';
import { DashComponent } from './dash/dash.component';
import { OrderComponent } from './order/order.component';
import { OrdersComponent } from './orders/orders.component';


const routes: Routes = [
  {
    path: '',
    component: DashComponent
  },
  {
    path: 'orders/:viewType',
    component: OrdersComponent
  },
  {
    path: 'order/:id',
    component: OrderComponent
  },
  {
    path: 'customers',
    component: CustomersComponent
  }
]; // sets up routes constant where you define your routes

// configures NgModule imports and exports
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
