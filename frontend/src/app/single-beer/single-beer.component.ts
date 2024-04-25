import { Component, OnInit } from '@angular/core';
import { Beer } from '../models/Beer.model';
import { BeersService } from '../services/beers.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { catchError, EMPTY, map, Observable, of, switchMap, take, tap } from 'rxjs';

@Component({
  selector: 'app-single-beer',
  templateUrl: './single-beer.component.html',
  styleUrls: ['./single-beer.component.scss']
})
export class SingleBeerComponent implements OnInit {

  loading!: boolean;
  beer$!: Observable<Beer>;
  userId!: string;
  likePending!: boolean;
  liked!: boolean;
  disliked!: boolean;
  errorMessage!: string;

  constructor(private beers: BeersService,
    private route: ActivatedRoute,
    private auth: AuthService,
    private router: Router) { }

  ngOnInit() {
    this.userId = this.auth.getUserId();
    this.loading = true;
    this.userId = this.auth.getUserId();
    this.beer$ = this.route.params.pipe(
      map(params => params['id']),
      switchMap(id => this.beers.getBeerById(id)),
      tap(beer => {
        this.loading = false;
        if (beer.usersLiked.find(user => user === this.userId)) {
          this.liked = true;
        } else if (beer.usersDisliked.find(user => user === this.userId)) {
          this.disliked = true;
        }
      })
    );
  }

  onLike() {
    if (this.disliked) {
      return;
    }
    this.likePending = true;
    this.beer$.pipe(
      take(1),
      switchMap((beer: Beer) => this.beers.likeBeer(beer._id, !this.liked).pipe(
        tap(liked => {
          this.likePending = false;
          this.liked = liked;
        }),
        map(liked => ({ ...beer, likes: liked ? beer.likes + 1 : beer.likes - 1 })),
        tap(beer => this.beer$ = of(beer))
      )),
    ).subscribe();
  }

  onDislike() {
    if (this.liked) {
      return;
    }
    this.likePending = true;
    this.beer$.pipe(
      take(1),
      switchMap((beer: Beer) => this.beers.dislikeBeer(beer._id, !this.disliked).pipe(
        tap(disliked => {
          this.likePending = false;
          this.disliked = disliked;
        }),
        map(disliked => ({ ...beer, dislikes: disliked ? beer.dislikes + 1 : beer.dislikes - 1 })),
        tap(beer => this.beer$ = of(beer))
      )),
    ).subscribe();
  }

  onBack() {
    this.router.navigate(['/beers']);
  }

  onModify() {
    this.beer$.pipe(
      take(1),
      tap(beer => this.router.navigate(['/modify-beer', beer._id]))
    ).subscribe();
  }

  onDelete() {
    this.loading = true;
    this.beer$.pipe(
      take(1),
      switchMap(beer => this.beers.deleteBeer(beer._id)),
      tap(message => {
        console.log(message);
        this.loading = false;
        this.router.navigate(['/beers']);
      }),
      catchError(error => {
        this.loading = false;
        this.errorMessage = error.message;
        console.error(error);
        return EMPTY;
      })
    ).subscribe();
  }
}
