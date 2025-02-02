import {products} from '../data/products.js';
import {cart,deleteFromCart,calculateCartQuantity,updateQuantity,updateDeliveryOption} from '../data/cart.js';
import dayjs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js';
import {deliveryOptions} from '../data/deliveryOptions.js';


let cartItemHtml = '';

cart.forEach((cartItem) => {

    const productId = cartItem.productId;

    let matchingItem;

    products.forEach((product) => {
        if(product.id===productId){
          matchingItem = product;
        }
    });

    let deliveryOption;

    let deliveryOptionId = cartItem.deliveryOptionId;

    deliveryOptions.forEach((option) => {
        if(option.id === deliveryOptionId){
          deliveryOption = option;
        }
    });

    console.log(deliveryOption);
    const today = dayjs();

    const deliveryDate = today.add(deliveryOption.deliveryDays, 'days');
      
    const dateString = deliveryDate.format('dddd, MMMM D');


    cartItemHtml += `
        <div class="cart-item-container
        js-cart-item-container-${matchingItem.id}">
            <div class="delivery-date">
              Delivery date: ${dateString}
            </div>

            <div class="cart-item-details-grid">
              <img class="product-image"
                src="${matchingItem.image}">

              <div class="cart-item-details">
                <div class="product-name">
                  ${matchingItem.name}
                </div>
                <div class="product-price">
                  $${(matchingItem.priceCents/100).toFixed(2)}
                </div>
                <div class="product-quantity">
                  <span>
                    Quantity: <span class="quantity-label js-quantity-label-${matchingItem.id}">${cartItem.quantity}</span>
                  </span>
                  <span class="update-quantity-link link-primary js-update-link" data-product-id="${matchingItem.id}">
                    Update
                  </span>
                  <input class="quantity-input js-quantity-input">
                  <span class="save-quantity-link link-primary js-save-quantity-link" data-product-id="${matchingItem.id}">Save</span>
                  <span class="delete-quantity-link link-primary js-delete-link" data-product-id="${matchingItem.id}">
                    Delete
                  </span>
                </div>
              </div>

              <div class="delivery-options">
                <div class="delivery-options-title">
                  Choose a delivery option:
                </div>
                
                ${deliveryOptionsHtml(matchingItem,cartItem)}
                
              </div>
            </div>
          </div>
    `;
});

document.querySelector('.order-summary').innerHTML = cartItemHtml;

function updateCartQuantity(){
  let cartQuantity = calculateCartQuantity();

  document.querySelector('.js-return-to-home-link')
    .innerHTML = `${cartQuantity} items`;
}

setTimeout(() => {
  updateCartQuantity();
}, 0);

document.querySelectorAll('.js-delete-link').forEach((link) => {
    link.addEventListener('click', () => {
        const productId = link.dataset.productId;
        deleteFromCart(productId);
        const button = document.querySelector(`.js-cart-item-container-${productId}`);
        button.remove();
        updateCartQuantity();
    });
});

document.querySelectorAll('.js-update-link').forEach((link) => {
    link.addEventListener('click', () => {
        const productId = link.dataset.productId;

        const container = document.querySelector(`.js-cart-item-container-${productId}`);

        container.classList.add('is-editing-quantity');
    });
});

document.querySelectorAll('.js-save-quantity-link').forEach((saveLink) => {
    saveLink.addEventListener('click', () => {
      const productId = saveLink.dataset.productId;
      const container = document.querySelector(`.js-cart-item-container-${productId}`);

      const quantityInput = container.querySelector('.js-quantity-input');
      const quantity = quantityInput.value;
      
      updateQuantity(productId,quantity);

      let quantityLabel = document.querySelector(`.js-quantity-label-${productId}`);

      quantityLabel.innerHTML = Number(quantity);

      updateCartQuantity();

      container.classList.remove('is-editing-quantity');
    });
});

function deliveryOptionsHtml(matchingItem,cartItem){
    let html = "";

    deliveryOptions.forEach((deliveryOption) => {

      const today = dayjs();

      const deliveryDate = today.add(deliveryOption.deliveryDays, 'days');
      
      const dateString = deliveryDate.format('dddd, MMMM D');
      const priceString = deliveryOption.priceCents === 0 
      ? 'FREE' 
      : `$${(deliveryOption.priceCents / 100).toFixed(2)} -`;

      console.log(cartItem.deliveryOptionId);
      const isChecked = deliveryOption.id===cartItem.deliveryOptionId;

      html += `
                <div class="delivery-option js-delivery-option"
                data-product-id = ${matchingItem.id}
                data-delivery-option-id = ${deliveryOption.id}
                >
                  <input type="radio" 
                    ${isChecked ? 'checked' : ''}
                    class="delivery-option-input"
                    name="delivery-option-${matchingItem.id}">
                  <div>
                    <div class="delivery-option-date">
                      ${dateString}
                    </div>
                    <div class="delivery-option-price">
                      ${priceString} Shipping
                    </div>
                  </div>
                </div>
      `;
    });
    return html;
}

document.querySelectorAll('.js-delivery-option').forEach((element) => {
      element.addEventListener('click', () => {
        const productId = element.dataset.productId;
        const deliveryOptionId = element.dataset.deliveryOptionId;
        updateDeliveryOption(productId,deliveryOptionId);
      });
});
