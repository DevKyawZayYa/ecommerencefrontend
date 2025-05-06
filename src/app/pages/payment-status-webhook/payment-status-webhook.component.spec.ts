import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentStatusWebhookComponent } from './payment-status-webhook.component';

describe('PaymentStatusWebhookComponent', () => {
  let component: PaymentStatusWebhookComponent;
  let fixture: ComponentFixture<PaymentStatusWebhookComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaymentStatusWebhookComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaymentStatusWebhookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
