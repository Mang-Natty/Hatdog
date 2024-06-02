import React, { useState, useEffect } from "react";
import Icon from 'react-native-vector-icons/MaterialIcons';
import IconCheck from 'react-native-vector-icons/FontAwesome6';
import {
  StyleSheet,
  View,
  Text,
  ImageBackground,
  TouchableWithoutFeedback,
  Keyboard,
  SafeAreaView,
  TouchableOpacity,
  Image,
  Modal,
  ScrollView,
} from "react-native";
import ConfirmationModal from "../modal/ConfirmationModal";
import { storeData, getData } from "../utils/storage"; 

const bgImage = require("../../assets/images/background/bg_blue.png");

const Home = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [flavorModalVisible, setFlavorModalVisible] = useState(false);
  const [selectedFlavors, setSelectedFlavors] = useState([]);
  const [currentCupIndex, setCurrentCupIndex] = useState(0);
  const [isFlavorsComplete, setIsFlavorsComplete] = useState(false);
  const [orders, setOrders] = useState([]); 
  const [cupSizes, setCupSizes] = useState([]);
  const [products, setProducts] = useState([]);
  const [flavors, setFlavors] = useState([]);
  const [prices, setPrices] = useState({});
  const [editingOrderIndex, setEditingOrderIndex] = useState(null); 

  const [confirmationModalVisible, setConfirmationModalVisible] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState("");
  const [confirmAction, setConfirmAction] = useState(() => () => {});

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const cupSizesData = await getData('cupSizes');
    const productsData = await getData('products');
    const flavorsData = await getData('flavors');
    const pricesData = await getData('prices');

    if (cupSizesData) setCupSizes(cupSizesData);
    if (productsData) setProducts(productsData);
    if (flavorsData) setFlavors(flavorsData);
    if (pricesData) setPrices(pricesData);

    const ordersData = await getData('orders');
    if (ordersData) setOrders(ordersData);
  };

  const getFlavorSelectionCount = (size) => {
    switch (size) {
      case "S":
        return 1;
      case "M":
        return 2;
      case "L":
        return 3;
      default:
        return 0;
    }
  };

  const handleSizeSelect = (size) => {
    setSelectedSize(size);
    setSelectedProduct(null);
    setQuantity(1);
    setSelectedFlavors([]);
    setIsFlavorsComplete(false);
    setModalVisible(true);
  };

  const handleProductSelect = (product) => {
    setSelectedProduct(product);
    setSelectedSize(null);
    setQuantity(1);
    setSelectedFlavors([]);
    setIsFlavorsComplete(false);
    setModalVisible(true);
  };

  const incrementQuantity = () => {
    setQuantity(quantity + 1);
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleProceed = () => {
    setModalVisible(false);
    if (selectedSize) {
      setSelectedFlavors(Array(quantity).fill([]));
      setCurrentCupIndex(0);
      setFlavorModalVisible(true);
    } else if (selectedProduct) {
      addOrder();
    }
  };

  const handleCancel = () => {
    setModalVisible(false);
  };

  const handleFlavorSelect = (flavor) => {
    const maxFlavorSelections = getFlavorSelectionCount(selectedSize);
    const flavorsForCurrentCup = selectedFlavors[currentCupIndex];

    if (flavorsForCurrentCup.length < maxFlavorSelections) {
      const newFlavors = [...flavorsForCurrentCup, flavor];
      updateFlavorSelections(currentCupIndex, newFlavors);
    }
  };

  const updateFlavorSelections = (index, flavors) => {
    const newSelections = [...selectedFlavors];
    newSelections[index] = flavors;
    setSelectedFlavors(newSelections);
  };

  const handleFlavorModalClose = () => {
    const maxFlavorSelections = getFlavorSelectionCount(selectedSize);
    if (selectedFlavors[currentCupIndex].length === maxFlavorSelections) {
      if (currentCupIndex < quantity - 1) {
        setCurrentCupIndex(currentCupIndex + 1);
      } else {
        setFlavorModalVisible(false);
        setIsFlavorsComplete(true);
        if (editingOrderIndex !== null) {
          updateOrder();
        } else {
          addOrder();
        }
      }
    } else {
      alert(`Please select ${maxFlavorSelections} flavors for cup ${currentCupIndex + 1}.`);
    }
  };

  const calculateTotalPrice = (size, quantity) => {
    const sizePrice = prices[size] || 0;
    return sizePrice * quantity;
  };

  const addOrder = async () => {
    const newOrder = {
      size: selectedSize,
      quantity: quantity,
      flavors: selectedFlavors,
      total: calculateTotalPrice(selectedSize, quantity)
    };
    const updatedOrders = [...orders, newOrder];
    setOrders(updatedOrders);
    await storeData('orders', updatedOrders);
  };

  const updateOrder = async () => {
    const updatedOrders = orders.map((order, index) =>
      index === editingOrderIndex
        ? { size: selectedSize, quantity, flavors: selectedFlavors, total: calculateTotalPrice(selectedSize, quantity) }
        : order
    );
    setOrders(updatedOrders);
    await storeData('orders', updatedOrders);
    setEditingOrderIndex(null);
  };

  const handleEditOrder = (orderIndex) => {
    const orderToEdit = orders[orderIndex];
    setSelectedSize(orderToEdit.size);
    setQuantity(orderToEdit.quantity);
    setSelectedFlavors(orderToEdit.flavors);
    setCurrentCupIndex(0);
    setIsFlavorsComplete(false);
    setModalVisible(true);
    setEditingOrderIndex(orderIndex);
  };

  const handleDeleteOrder = async (orderIndex) => {
    const updatedOrders = orders.filter((_, index) => index !== orderIndex);
    setOrders(updatedOrders);
    await storeData('orders', updatedOrders); // Save updated orders to AsyncStorage
  };

  const handleTransferOrder = async (orderIndex) => {
    const orderToTransfer = orders[orderIndex];
    const updatedOrders = orders.filter((_, index) => index !== orderIndex);
    setOrders(updatedOrders);
    await storeData('orders', updatedOrders); // Save updated orders to AsyncStorage

    // Implement transfer logic here, for example:
    // sendOrderToKitchen(orderToTransfer);
  };

  const showConfirmationModal = (message, action) => {
    setConfirmationMessage(message);
    setConfirmAction(() => action);
    setConfirmationModalVisible(true);
  };

  const handleConfirm = () => {
    confirmAction();
    setConfirmationModalVisible(false);
  };

  const handleCancelConfirm = () => {
    setConfirmationModalVisible(false);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={{ flex: 1 }}>
        <ImageBackground
          source={bgImage}
          resizeMode="cover"
          style={styles.bgImage}
        >
          <SafeAreaView style={styles.container}>
            <View style={styles.leftContainer}>
              {/* Cup Sizes Section */}
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.text}>CUP SIZES</Text>
                </View>
                <View style={styles.row}>
                  {cupSizes.map((size, index) => (
                    <TouchableOpacity
                      key={index}
                      style={styles.cupSizes}
                      onPress={() => handleSizeSelect(size)}
                    >
                      <Text>{size}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
              {/* Products Section */}
              <View>
                <View style={styles.sectionHeader}>
                  <Text style={styles.text}>PRODUCTS</Text>
                </View>
                <View style={styles.row}>
                  {products.map((product, index) => (
                    <TouchableOpacity
                      key={index}
                      style={styles.cupSizes}
                      onPress={() => handleProductSelect(product)}
                    >
                      <Text>{product}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>

            {/* Right Container */}
            <View style={styles.rightContainer}>
              <TouchableOpacity
                onPress={() => setIsExpanded(!isExpanded)}
                style={styles.header}
              >
                <Image
                  source={require("../../assets/images/logo/main_logo.png")}
                  style={styles.image}
                />
                <Text style={styles.headerText}>Current # {'\n'} of orders: {orders.length}</Text>
                <Text>{isExpanded ? 'Minimize' : 'View Details'}</Text>
              </TouchableOpacity>

              {isExpanded && (
                <ScrollView style={styles.scrollContainer}>
                  {orders.map((order, orderIndex) => (
                    <View key={orderIndex} style={styles.overviewContainer}>
                      <Text style={styles.orderTextHeader}>Order {orderIndex + 1}</Text>
                      <Text style={styles.orderText}>Size: {order.size}</Text>
                      <Text style={styles.orderText}>Quantity: {order.quantity}</Text>
                      {order.flavors.map((flavorList, index) => (
                        <Text key={index} style={styles.flavorText}>
                        Cup {index + 1}: {flavorList.join([,'\n'])}
                      </Text>
                      ))}
                      <Text>Total: {order.total}</Text>

                      <View style={styles.buttonContainer}>
                        <TouchableOpacity
                          style={styles.editButton}
                          onPress={() => handleEditOrder(orderIndex)}
                        >
                          <Text>
                            <Icon name="edit" size={24} color="#fff" />
                          </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() =>
                            showConfirmationModal("Are you sure you want to delete this order?", () =>
                              handleDeleteOrder(orderIndex)
                        )
                          }
                          style={styles.deleteButton}
                        >
                          <Text>
                            <Icon name="delete" size={24} color="#fff" />
                          </Text>                    
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() =>
                            showConfirmationModal("Are you sure you want to mark this order as done?", () =>
                              handleTransferOrder(orderIndex)
                            )
                          }
                          style={styles.doneButton}
                        >
                          <Text>
                            <IconCheck name="check" size={24} color="#fff"></IconCheck>
                          </Text>                    
                        </TouchableOpacity>
                      </View>
                      
                    </View>
                  ))}
                </ScrollView>
              )}
            </View>
            <ConfirmationModal
            visible={confirmationModalVisible}
            message={confirmationMessage}
            onConfirm={handleConfirm}
            onCancel={handleCancelConfirm}
          />
          </SafeAreaView>
        </ImageBackground>

        {/* Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text>Select Quantity:</Text>
              <View style={styles.quantityContainer}>
                <TouchableOpacity onPress={decrementQuantity} style={styles.quantityButton}>
                  <Text style={styles.buttonText}>-</Text>
                </TouchableOpacity>
                <Text style={styles.quantityText}>{quantity}</Text>
                <TouchableOpacity onPress={incrementQuantity} style={styles.quantityButton}>
                  <Text style={styles.buttonText}>+</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.action}>
                <TouchableOpacity onPress={handleProceed} style={styles.actionButton}>
                  <Text style={styles.buttonText}>Proceed</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleCancel} style={styles.actionButton}>
                  <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* Flavor Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={flavorModalVisible}
          onRequestClose={() => setFlavorModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text>Select Flavors for Cup {currentCupIndex + 1}:</Text>
              {flavors.map((flavor, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.flavorButton,
                    selectedFlavors[currentCupIndex]?.includes(flavor) && styles.selectedFlavorButton,
                  ]}
                  onPress={() => handleFlavorSelect(flavor)}
                >
                  <Text style={styles.flavorText}>{flavor}</Text>
                </TouchableOpacity>
              ))}
              <TouchableOpacity onPress={handleFlavorModalClose} style={styles.actionButton}>
                <Text style={styles.buttonText}>Done</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  bgImage: {
    flex: 1,
    objectFit: "cover",
  },
  container: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  leftContainer: {
    width: "70%",
    height: "90%",
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 24,
    opacity: 1,
  },
  rightContainer: {
    height: "90%",
    backgroundColor: "#ffffff",
    borderRadius: 20,
    marginLeft: 20,
    paddingHorizontal: 20,
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 24,
  },
  headerText: {
    textAlign: "center",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: 18,
    paddingTop: 20,
    fontWeight: "700",
  },
  text: {
    color: "#ffffff",
    fontWeight: "bold",
  },
  cupSizes: {
    width: 160,
    height: 160,
    backgroundColor: "#D9D9D9",
    borderRadius: 10,
    marginLeft: 5,
    marginRight: 15,
    justifyContent: "center",
    alignItems: "center",
    cursor: "pointer",
  },
  image: {
    width: 85,
    height: 110,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: 300,
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
  quantityButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ddd",
    borderRadius: 20,
  },
  buttonText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  quantityText: {
    fontSize: 18,
    marginHorizontal: 20,
  },
  action: {
    flexDirection: "row",
    marginTop: 20,
  },
  actionButton: {
    marginHorizontal: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#007BFF",
    borderRadius: 5,
  },
  section: {
    marginBottom: 20,
  },
  sectionHeader: {
    width: "15%",
    height: "14%",
    backgroundColor: "#1F4259",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    marginLeft: 5,
    marginBottom: 10,
  },
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  logoContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  overviewContainer: {
    padding: 20,
  },
  overviewText: {
    fontSize: 18,
    marginVertical: 5,
  },
  flavorButton: {
    padding: 10,
    backgroundColor: "#ddd",
    borderRadius: 5,
    marginVertical: 5,
    width: "80%",
    alignItems: "center",
  },
  selectedFlavorButton: {
    borderColor: "#007BFF",
    borderWidth: 2,
  },
  orderTextHeader: {
    fontWeight: "700",
    fontSize: 16,
  },
  flavorText: {
    // fontSize: 16,
    fontStyle: "italic",
    fontWeight: "700"
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  editButton: {
    backgroundColor: "#FFA500",
    padding: 6,
    marginHorizontal: 5,
    borderRadius: 30,
  },
  deleteButton: {
    backgroundColor: "#FF0000",
    padding: 6,
    marginHorizontal: 5,
    borderRadius: 30,
  },
  doneButton: {
    backgroundColor: "#008000",
    padding: 6,
    marginHorizontal: 5,
    borderRadius: 30,
  },
});

export default Home;
