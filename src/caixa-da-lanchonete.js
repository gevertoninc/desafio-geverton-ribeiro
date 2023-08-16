import { menu } from "./menu";
import { paymentMethods } from "./paymentMethods";

class CaixaDaLanchonete {
  calcularValorDaCompra(paymentMethodInput, itemsInput) {
    try {
      const paymentMethod = getPaymentMethod({ paymentMethodInput });

      const items = getItems({ itemsInput });

      const partialPrice = calculatePartialPrice({ items });

      const totalPrice = calculateTotalPrice({
        partialPrice,
        priceModifier: paymentMethod.priceModifier,
      });

      const formattedTotalPrice = formatTotalPrice({ totalPrice });

      return formattedTotalPrice;
    } catch (error) {
      return error;
    }
  }
}

function getPaymentMethod({ paymentMethodInput }) {
  const paymentMethod = paymentMethods.find(
    (item) => item.code === paymentMethodInput
  );

  if (!paymentMethod) {
    throw "Forma de pagamento inválida!";
  }

  return paymentMethod;
}

function getItems({ itemsInput }) {
  if (itemsInput.length === 0) {
    throw "Não há itens no carrinho de compra!";
  }

  const items = itemsInput.map((item) => {
    const [code, quantity] = item.split(",");

    return { code, quantity };
  });

  return items;
}

function calculatePartialPrice({ items }) {
  const partialPrice = items.reduce((partialPrice, item) => {
    const { code, quantity } = item;

    const menuItem = getMenuItem({ code });

    validateExtraItem({ items, menuItem });

    const numericQuantity = getNumericQuantity({ quantity });

    return partialPrice + menuItem.price * numericQuantity;
  }, 0);

  return partialPrice;
}

function getMenuItem({ code }) {
  const menuItem = menu.find((item) => item.code === code);

  if (!menuItem) {
    throw "Item inválido!";
  }

  return menuItem;
}

function validateExtraItem({ items, menuItem }) {
  if (
    menuItem.extraCode &&
    !items.some((item) => item.code === menuItem.extraCode)
  ) {
    throw "Item extra não pode ser pedido sem o principal";
  }
}

function getNumericQuantity({ quantity }) {
  const numericQuantity = parseInt(quantity);

  if (!numericQuantity) {
    throw "Quantidade inválida!";
  }

  return numericQuantity;
}

function calculateTotalPrice({ partialPrice, priceModifier }) {
  const total = partialPrice + partialPrice * priceModifier;

  return total;
}

function formatTotalPrice({ totalPrice }) {
  const totalPriceAsNumber = totalPrice.toFixed(2);

  const [integerPart, decimalPart] = totalPriceAsNumber.split(".");

  const formattedIntegerPart = integerPart.replace(
    /\B(?=(\d{3})+(?!\d))/g,
    ","
  );

  const formattedTotalPrice = `R$ ${formattedIntegerPart},${decimalPart}`;

  return formattedTotalPrice;
}

export { CaixaDaLanchonete };
