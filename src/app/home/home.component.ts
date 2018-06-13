import { Component, OnInit, OnDestroy } from '@angular/core';
import {Router} from '@angular/router';
import { MatDialog, MatDialogRef } from '@angular/material';

import { CountryService } from '../services/country.service';
import { DataShareService } from '../services/data-share.service';
import { CountriesListComponent } from '../countries-list/countries-list.component';
import { CountryInfoComponent } from '../country-info/country-info.component';

// import * as countries from '../../data/countries.json';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {
  public searchTerm  = '';
  // public data = require('../../data/countries.json');
  public searchedCountry = [];
  isSearched = false;

  constructor(private router: Router,
              private service: CountryService,
              private shareDataService: DataShareService,
              public matDialog: MatDialog) {

  }

  ngOnInit() {
    console.log('state on home init: ' + this.shareDataService.searchedData);
  }

  ngOnDestroy(): void {
    // this.shareDataService.searchedData = this.searchedCountry;
    console.log('state on home destry: ' + this.shareDataService.searchedData.length + '==' + this.shareDataService.searchedData);
  }

  public onSearchInputChange(event: any): void {
    console.log(event.target.value);
    this.searchTerm = event.target.value;
  }

  public onSearchButtonClick(event: any): void {
    console.log('on clicked called');
    // clear searched entry
    // console.log(this.data.name);
    this.service.fetchCountries(this.searchTerm)
                .subscribe((response) => {
                  // this.searchedCountry = [];
                  // set searchTerm to empty so that it will be cleared from the input field
                  this.searchTerm = '';
                  console.log('response inside: ' + response.json());
                  this.searchedCountry = response.json();
                  this.isSearched = true;
                  // set the state in data share service done in destroy
                  this.shareDataService.searchedData = this.searchedCountry;


                  // navigate to 404 if no country is found
                  if (this.searchedCountry.length === 0 && this.isSearched) {
                    this.router.navigate(['**']);
                  }
                  // If only one country is found for the search term
                  // navigate to that country info route
                  if (this.searchedCountry.length === 1 && this.isSearched) {
                    // show dialog of country info
                    let matDialogRef = this.matDialog.open(CountryInfoComponent, {
                      height: '40%',
                      width: '60%',
                      data: {country: this.searchedCountry[0]}
                    });

                    //this.router.navigate(['country', this.searchedCountry[0].alpha2Code]);
                    // this.router.navigateByUrl('country/ne');
                  }

                  // if search result contains more than one country display modal
                  // if (this.searchedCountry.length > 1 && this.isSearched) {



                  //   // TODO: matdialogRef close
                  // }
                }, (error: Response) => {
                  // TODO: handle Errors
                  // display toast and log errors

                  console.log(error);
                });

    console.log('outside: ' + this.searchedCountry);
    console.log('length of searched items: ' + this.searchedCountry.length);

    // this.searchedCountry = this.data.filter(con =>
    //   con.name === this.searchTerm
    // );


  }
}
