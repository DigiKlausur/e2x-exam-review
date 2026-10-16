import {Component, inject, OnInit} from '@angular/core';
import {environment} from '../../../../environments/environment';
import {Router} from '@angular/router';
import {NgbAlert} from '@ng-bootstrap/ng-bootstrap';
import {AuthService} from '../../../services/auth-service/auth-service';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.html',
  styleUrl: './landing-page.scss',
  imports: [
    NgbAlert
  ]
})
export class LandingPage implements OnInit {
  private readonly router: Router = inject(Router);
  private authService: AuthService = inject(AuthService);

  protected authFailed: boolean = false;

  async ngOnInit(): Promise<void> {
    if(this.authService.hasRole(environment.keycloak.roleMappings.lecturer)){
      await this.router.navigate(['/', 'manage']);
    }else if(this.authService.hasRole(environment.keycloak.roleMappings.student)){
      await this.router.navigate(['/', 'review']);
    }else {
      this.authFailed = true;
    }
  }
}
