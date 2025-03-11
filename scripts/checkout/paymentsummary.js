import{cart,calculateCartQuantity} from '../../data/cart.js';
import {products} from '../../data/products.js';
import {deliveryOptions} from '../../data/deliveryOptions.js';
import { formatCurrency } from '../utils.js';


export function renderPaymentSummary() {
    let html = '';

    let totalPriceCents = 0;
    let totalShippingCostCents = 0;
    cart.forEach((cartItem) => {
        const productId = cartItem.productId;

        let matchingItem;

        products.forEach((product) => {
            if(product.id===productId){
              matchingItem = product;
            }
        });

        totalPriceCents += matchingItem.priceCents*cartItem.quantity;

        let deliveryOption;

        let deliveryOptionId = cartItem.deliveryOptionId;
  
        deliveryOptions.forEach((option) => {
            if(option.id === deliveryOptionId){
              deliveryOption = option;
            }
        });

        totalShippingCostCents += deliveryOption.priceCents;

    });

    let beforeTaxCents = totalPriceCents+totalShippingCostCents;
    let taxCents = beforeTaxCents*0.1;
    let afterTaxCents = beforeTaxCents+taxCents;
    console.log(formatCurrency(afterTaxCents));

    html = `
          <div class="payment-summary-title">
            Order Summary
          </div>

          <div class="payment-summary-row">
            <div>Items (${calculateCartQuantity()}):</div>
            <div class="payment-summary-money">$${formatCurrency(totalPriceCents)}</div>
          </div>

          <div class="payment-summary-row">
            <div>Shipping &amp; handling:</div>
            <div class="payment-summary-money">$${formatCurrency(totalShippingCostCents)}</div>
          </div>

          <div class="payment-summary-row subtotal-row">
            <div>Total before tax:</div>
            <div class="payment-summary-money">$${formatCurrency(beforeTaxCents)}</div>
          </div>

          <div class="payment-summary-row">
            <div>Estimated tax (10%):</div>
            <div class="payment-summary-money">$${formatCurrency(taxCents)}</div>
          </div>

          <div class="payment-summary-row total-row">
            <div>Order total:</div>
            <div class="payment-summary-money">$${formatCurrency(afterTaxCents)}</div>
          </div>

          <button class="place-order-button button-primary">
            Place your order
          </button>
    `

    document.querySelector('.js-payment-summary').innerHTML = html;
}