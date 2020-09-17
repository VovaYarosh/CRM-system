import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Position} from "../../interface";
import {Observable} from "rxjs/internal/Observable";

@Injectable({
  providedIn: 'root'
})
export class PositionsService {
  constructor(private http: HttpClient){
  }
  fetch(categoryId: string): Observable<Position[]>{
    return this.http.get<Position[]>(`/api/position/${categoryId}`)
  }
  create(position: Position): Observable<Position>{
    return this.http.post<Position>('/api/position', position)
  }
}
