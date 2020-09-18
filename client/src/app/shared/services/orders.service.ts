import {HttpClient} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {Order} from "../../interface";
import {Observable} from "rxjs/internal/Observable";

@Injectable({
  providedIn: 'root'
})

export class OrdersService {
  constructor(
    private http: HttpClient
  ){}
  create(order: Order): Observable<Order>{
    return this.http.post<Order>('/api/order', order)
  }
}
