import { storeData } from "./storage";

export const initializeData = async () => {
    const initialCupSizes = ['S', 'M', 'L']
    const initialFlavors = ['Vanilla', 'Chocolate', 'Strawberry']
    const initialProducts = ['Drumstick', 'Corndog']
    const initialPrices = { 'S': 60, 'M': 80, 'L': 120 };

    await storeData('cupSizes', initialCupSizes);
    await storeData('flavors', initialFlavors);
    await storeData('products', initialProducts);
    await storeData('prices', initialPrices);
}