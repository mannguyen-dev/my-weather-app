import AsyncStorage from "@react-native-async-storage/async-storage";

export const storeData = async (key, value) => {
    try {
        await AsyncStorage.setItem(key, value);
    } catch (err) {
        console.log("Error Storing Value: ", err);
    }
};

export const getData = async (key) => {
    try {
        return await AsyncStorage.getItem(key);
    } catch (err) {
        console.log("Error Retrieving Value: ", err);
    }
};
