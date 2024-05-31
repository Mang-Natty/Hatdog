import React, { useState } from "react";
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
} from "react-native";
import ExpandableView from "../components/ExpandableView";

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

  const cupSizes = ["S", "M", "L"];
  const products = ["A", "B", "C", "D"];
  const flavors = ["Banana", "Avocado", "Apple", "Ube"];

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
      }
    } else {
      alert(`Please select ${maxFlavorSelections} flavors for cup ${currentCupIndex + 1}.`);
    }
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
            <TouchableOpacity
              onPress={() => {
                setIsExpanded(!isExpanded);
              }}
              style={styles.rightContainer}
            >
              <ExpandableView expanded={isExpanded}>
                <View style={styles.logoContainer}>
                  <Image
                    source={require("../../assets/images/logo/main_logo.png")}
                    style={styles.image}
                  />
                </View>
                {selectedSize && isFlavorsComplete && (
                  <View style={styles.overviewContainer}>
                    <Text style={styles.overviewText}>
                      Size: {selectedSize}
                    </Text>
                    <Text style={styles.overviewText}>
                      Quantity: {quantity}
                    </Text>
                    {selectedFlavors.map((flavors, index) => (
                      <Text key={index} style={styles.overviewText}>
                        Cup {index + 1}: {flavors.join(", ")}
                      </Text>
                    ))}
                  </View>
                )}
              </ExpandableView>
            </TouchableOpacity>
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
              <Text>
                Selected {selectedSize ? "Size" : "Product"}:{" "}
                {selectedSize || selectedProduct}
              </Text>
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
    width: 75,
    height: 75,
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
    padding: 20,
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
  flavorText: {
    fontSize: 16,
  },
});

export default Home;