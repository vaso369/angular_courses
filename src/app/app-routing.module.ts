import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    data: { roles: ['user', 'admin'] },
    loadChildren: './main/main.module#MainModule',
  },
  {
    path: 'course/:id',
    canActivate: [AuthGuard],
    data: { roles: ['user', 'admin'] },
    loadChildren: './course/course.module#CourseModule',
  },
  {
    path: 'add-course',
    canActivate: [AuthGuard],
    data: { roles: ['user', 'admin'] },
    loadChildren: './course/add/add.module#AddModule',
  },
  { path: 'signup', loadChildren: './signup/signup.module#SignupModule' },
  { path: 'login', loadChildren: './login/login.module#LoginModule' },
  {
    path: 'admin',
    canActivate: [AuthGuard],
    data: { roles: ['admin'] },
    loadChildren: './admin/admin.module#AdminModule',
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled' }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
