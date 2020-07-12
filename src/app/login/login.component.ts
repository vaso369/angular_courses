import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FirebaseService } from '../firebase.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  processing = false;
  constructor(private firebaseService: FirebaseService) {}

  public loginForm = new FormGroup({
    email: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
  });

  login(formData: FormData) {
    this.processing = true;
    this.firebaseService.login(formData['email'], formData['password']);
  }

  ngOnInit() {}
}
