import { Component } from '@angular/core';
import {NgbInputDatepicker} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-date-input',
    imports: [
        NgbInputDatepicker
    ],
  templateUrl: './date-input.html',
  styleUrl: './date-input.scss',
})
export class DateInput {}
