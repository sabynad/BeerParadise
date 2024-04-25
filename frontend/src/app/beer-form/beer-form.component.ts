import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BeersService } from '../services/beers.service';
import { Beer } from '../models/Beer.model';
import { AuthService } from '../services/auth.service';
import { catchError, EMPTY, switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-beer-form',
  templateUrl: './beer-form.component.html',
  styleUrls: ['./beer-form.component.scss']
})
export class BeerFormComponent implements OnInit {

  beerForm!: UntypedFormGroup;
  mode!: string;
  loading!: boolean;
  beer!: Beer;
  errorMsg!: string;
  imagePreview!: string;

  constructor(private formBuilder: UntypedFormBuilder,
              private route: ActivatedRoute,
              private router: Router,
              private beers: BeersService,
              private auth: AuthService) { }

  ngOnInit() {
    this.loading = true;
    this.route.params.pipe(
      switchMap(params => {
        if (!params['id']) {
          this.mode = 'new';
          this.initEmptyForm();
          this.loading = false;
          return EMPTY;
        } else {
          this.mode = 'edit';
          return this.beers.getBeerById(params['id'])
        }
      }),
      tap(beer => {
        if (beer) {
          this.beer = beer;
          this.initModifyForm(beer);
          this.loading = false;
        }
      }),
      catchError(error => this.errorMsg = JSON.stringify(error))
    ).subscribe();
  }

  initEmptyForm() {
    this.beerForm = this.formBuilder.group({
      name: [null, Validators.required],
      manufacturer: [null, Validators.required],
      description: [null, Validators.required],
      image: [null, Validators.required],
      mainIngredient: [null, Validators.required],
      degree: [1, Validators.required],
      degreeValue: [{value: 1, disabled: true}]
    });
    this.beerForm.get('degree')!.valueChanges.subscribe(
      (value) => {
        this.beerForm.get('degreeValue')!.setValue(value);
      }
    );
  }

  initModifyForm(beer: Beer) {
    this.beerForm = this.formBuilder.group({
      name: [beer.name, Validators.required],
      manufacturer: [beer.manufacturer, Validators.required],
      description: [beer.description, Validators.required],
      image: [beer.imageUrl, Validators.required],
      mainIngredient: [beer.mainIngredient, Validators.required],
      degree: [beer.degree, Validators.required],
      degreeValue: [{value: beer.degree, disabled: true}]
    });
    this.beerForm.get('degree')!.valueChanges.subscribe(
      (value) => {
        this.beerForm.get('degreeValue')!.setValue(value);
      }
    );
    this.imagePreview = this.beer.imageUrl;
  }

  onSubmit() {
    this.loading = true;
    const newBeer = new Beer();
    newBeer.name = this.beerForm.get('name')!.value;
    newBeer.manufacturer = this.beerForm.get('manufacturer')!.value;
    newBeer.description = this.beerForm.get('description')!.value;
    newBeer.mainIngredient = this.beerForm.get('mainIngredient')!.value;
    newBeer.degree = this.beerForm.get('degree')!.value;
    newBeer.userId = this.auth.getUserId();
    if (this.mode === 'new') {
      this.beers.createBeer(newBeer, this.beerForm.get('image')!.value).pipe(
        tap(({ message }) => {
          console.log(message);
          this.loading = false;
          this.router.navigate(['/beers']);
        }),
        catchError(error => {
          console.error(error);
          this.loading = false;
          this.errorMsg = error.message;
          return EMPTY;
        })
      ).subscribe();
    } else if (this.mode === 'edit') {
      this.beers.modifyBeer(this.beer._id, newBeer, this.beerForm.get('image')!.value).pipe(
        tap(({ message }) => {
          console.log(message);
          this.loading = false;
          this.router.navigate(['/beers']);
        }),
        catchError(error => {
          console.error(error);
          this.loading = false;
          this.errorMsg = error.message;
          return EMPTY;
        })
      ).subscribe();
    }
  }

  onFileAdded(event: Event) {
    const file = (event.target as HTMLInputElement).files![0];
    this.beerForm.get('image')!.setValue(file);
    this.beerForm.updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }
}
