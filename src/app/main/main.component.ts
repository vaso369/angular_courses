import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseService } from '../firebase.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css'],
})
export class MainComponent implements OnInit {
  courses = [];
  constructor(
    private firebaseService: FirebaseService,
    private router: Router
  ) {}

  goToAdmin() {
    if (
      this.firebaseService.currentUser &&
      this.firebaseService.currentUser.role === 'admin'
    ) {
      this.router.navigate(['/admin']);
    } else {
      console.log('You dont have the permission to go to admin only pages');
    }
  }
  goToCourse(id: number) {
    this.router.navigate(['course/' + id]);
  }
  ngOnInit() {
    this.courses = this.firebaseService.getCourses();
  }
  ngOnDestroy(): void {}
}
