import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FirebaseService } from '../firebase.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css'],
})
export class NavComponent implements OnInit {
  public href: string = '';
  constructor(
    private firebaseService: FirebaseService,
    private router: Router,
    private route: ActivatedRoute,
    location: Location
  ) {
    router.events.subscribe((val) => {
      this.href = location.path();
    });
  }

  userStatus = this.firebaseService.userStatus;

  logout() {
    this.firebaseService.logOut();
  }

  ngOnInit() {
    this.firebaseService.userChanges();

    this.firebaseService.userStatusChanges.subscribe((x) => {
      this.userStatus = x;
      console.log(this.userStatus);
    });
  }
}
