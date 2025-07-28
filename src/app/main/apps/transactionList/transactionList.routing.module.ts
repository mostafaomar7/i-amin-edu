import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { TransactionListListComponent } from "./transactionList-list/transactionList-list.component";
import { NewTransactionListComponent } from "./new-transactionList/new-transactionList.component";
import { TransactionListPreviewComponent } from "./transactionList-view/transactionList-preview.component";
import { WalletComponent } from "app/app/main/apps/wallet/wallet.component";

// routing
const routes: Routes = [
  {
    path: "wallet",
    component: WalletComponent,
  },
  {
    path: "list",
    component: TransactionListListComponent,
    data: { animation: "TransactionListListComponent" },
  },
  {
    path: "transactionList/view",
    component: TransactionListPreviewComponent,
  },
  {
    path: "list/new",
    component: NewTransactionListComponent,
  },
  {
    path: "list/new/:id",
    component: NewTransactionListComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TransactionListRoutingModule {}
