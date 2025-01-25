export let cart = JSON.parse(localStorage.getItem('cart'));

if(!cart){
    cart = [
        {
            productId : 'e43638ce-6aa0-4b85-b27f-e1d07eb678c6',
            quantity : 2,
            deliveryOptionId : '1'
        },
        {
            productId : '15b6fc6f-327a-4ec4-896f-486349e85a3d',
            quantity : 1,
            deliveryOptionId : '2'
        }
    ];
}


function saveToStorage(){
    localStorage.setItem('cart',JSON.stringify(cart));
}

export function addToCart(productId){
    let matchingItem;

    cart.forEach((item) => {
        if(productId === item.productId){
            matchingItem = item;
        }
    });

    const quantity = document.querySelector(`.js-quantity-selector-${productId}`).value;

    if(matchingItem){
        matchingItem.quantity += Number(quantity);
    }
    else{
        cart.push({
            productId : productId,
            quantity : Number(quantity),
            deliveryOptionId : '1'
        });
    }

    

    saveToStorage();
}

export function deleteFromCart(productId){
    const newArr = [];

    cart.forEach((cartItem) => {
        if(cartItem.productId!==productId){
            newArr.push(cartItem);
        }
    });

    cart = newArr;
    saveToStorage();
};

export function calculateCartQuantity(){
    let cartQunatity = 0;

    cart.forEach((item) => {
        cartQunatity += item.quantity;
    })

    return cartQunatity;
}

export function updateQuantity(productId,newQuantity){
    let matchingItem;
    cart.forEach((cartItem) => {
        if(cartItem.productId===productId){
            matchingItem = cartItem;
        }
    });

    matchingItem.quantity = Number(newQuantity);

    saveToStorage();
};