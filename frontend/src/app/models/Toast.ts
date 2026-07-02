import {Signal, TemplateRef} from '@angular/core';

export interface Toast {
  header: string;
  body: TemplateRef<any> | Signal<string> | string;
  delay?: number;
  classname?: string;
}
