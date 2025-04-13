import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-test-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container mt-5">
      <button class="btn btn-primary" (click)="showModal = true">
        Show Modal
      </button>

      <!-- Modal -->
      <div class="modal" [class.show]="showModal" [style.display]="showModal ? 'block' : 'none'">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Test Modal</h5>
              <button type="button" class="btn-close" (click)="showModal = false"></button>
            </div>
            <div class="modal-body">
              <p>This is a test modal!</p>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" (click)="showModal = false">Close</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Backdrop -->
      <div class="modal-backdrop" [class.show]="showModal" [style.display]="showModal ? 'block' : 'none'"></div>
    </div>
  `,
  styles: [`
    .modal {
      background: rgba(0, 0, 0, 0.5);
    }
    .modal-backdrop {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
    }
  `]
})
export class TestModalComponent {
  showModal = false;
} 