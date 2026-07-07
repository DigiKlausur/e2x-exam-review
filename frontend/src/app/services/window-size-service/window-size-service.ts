import { Injectable, Signal, signal, WritableSignal } from '@angular/core';

export namespace WindowSizeService {
  export interface WindowSize {
    width: number;
    height: number;
  }
}

@Injectable({
  providedIn: 'root',
})
export class WindowSizeService {
  private _windowSize: WritableSignal<WindowSizeService.WindowSize>;

  constructor() {
    this._windowSize = signal<WindowSizeService.WindowSize>({ width: window.innerWidth, height: window.innerHeight });

    window.addEventListener('resize', () => this.updateWindowSize());
  }

  private updateWindowSize(): void {
    this._windowSize.set({ width: window.innerWidth, height: window.innerHeight });
  }

  public get windowSize(): Signal<WindowSizeService.WindowSize> {
    return this._windowSize.asReadonly();
  }
}
