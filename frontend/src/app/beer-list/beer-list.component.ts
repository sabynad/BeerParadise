import { Component, OnInit } from '@angular/core';
import { BeersService } from '../services/beers.service';
import { catchError, Observable, of, tap } from 'rxjs';
import { Beer } from '../models/Beer.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-beer-list',
  templateUrl: './beer-list.component.html',
  styleUrls: ['./beer-list.component.scss']
})
export class BeerListComponent implements OnInit {

  beers$!: Observable<Beer[]>;
  loading!: boolean;
  errorMsg!: string;

  constructor(private beer: BeersService,
              private router: Router) { }

  ngOnInit() {
    this.loading = true;
    this.beers$ = this.beer.beers$.pipe(
      tap(() => {
        this.loading = false;
        this.errorMsg = '';
      }),
      catchError(error => {
        this.errorMsg = JSON.stringify(error);
        this.loading = false;
        return of([]);
      })
    );
    this.beer.getBeers();
  }

  onClickBeer(id: string) {
    this.router.navigate(['beer', id]);
  }

}
