import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, Alert, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';

const Automatic = ({ navigation }) => {
    const [watches, setWatches] = useState([]);
    const [favorites, setFavorites] = useState([]);

    const loadWatches = useCallback(async () => {
        try {
            const response = await axios.get('https://667699a7145714a1bd7239a6.mockapi.io/Toy');
            const automaticWatches = response.data.filter(watch => watch.modern);
            const sortedWatches = automaticWatches.sort((a, b) => b.price - a.price);
            setWatches(sortedWatches);
        } catch (error) {
            console.error('Error loading watches:', error);
        }
    }, []);

    const loadFavorites = useCallback(async () => {
        try {
            const value = await AsyncStorage.getItem('favorites');
            if (value !== null) {
                setFavorites(JSON.parse(value));
            }
        } catch (error) {
            console.error('Error loading favorites:', error);
        }
    }, []);

    useFocusEffect(
        useCallback(() => {
            loadWatches();
            loadFavorites();
        }, [loadWatches, loadFavorites])
    );

    const toggleFavorite = async (watch) => {
        try {
            const favoriteExists = favorites.some(item => item.id === watch.id);
            let updatedFavorites;
            if (favoriteExists) {
                updatedFavorites = favorites.filter(item => item.id !== watch.id);
            } else {
                updatedFavorites = [...favorites, watch];
            }
            await AsyncStorage.setItem('favorites', JSON.stringify(updatedFavorites));
            setFavorites(updatedFavorites);
            Alert.alert('Success', favoriteExists ? 'Watch removed from favorites!' : 'Watch added to favorites!');
        } catch (error) {
            console.error('Error updating favorites:', error);
            Alert.alert('Error', 'Failed to update favorites!');
        }
    };

    const handleDeleteConfirmation = (watch) => {
        Alert.alert(
            'Confirm Delete',
            'Are you sure you want to remove this toy from favorites?',
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'OK', onPress: () => toggleFavorite(watch) },
            ],
            { cancelable: false }
        );
    };

    const removeAllFavorites = async () => {
        Alert.alert(
            'Confirm Delete All',
            'Are you sure you want to remove all toy from favorites?',
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'OK', onPress: confirmRemoveAll },
            ],
            { cancelable: false }
        );
    };

    const confirmRemoveAll = async () => {
        try {
            await AsyncStorage.setItem('favorites', JSON.stringify([]));
            setFavorites([]);
            Alert.alert('Success', 'All toy removed from favorites!');
        } catch (error) {
            console.error('Error removing all toy:', error);
            Alert.alert('Error', 'Failed to remove all toy from favorites!');
        }
    };

    const renderWatchItem = ({ item }) => (
        <View style={styles.watchItemContainer}>
            <TouchableOpacity
                style={styles.watchItemContent}
                onPress={() => navigation.navigate('Detail', { perfume: item })}
            >
                <Image source={{ uri: item.image }} style={styles.watchItemImage} />
                <View style={styles.watchItemDetails}>
                    <Text style={styles.watchItemName}>{item.toyName}</Text>
                    <Text style={styles.watchItemPrice}>${item.price}</Text>
                </View>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.favoriteButton}
                onPress={() => handleDeleteConfirmation(item)}
            >
                <Ionicons name={favorites.some(fav => fav.id === item.id) ? 'heart' : 'heart-outline'} size={24} color="red" />
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.container}>
            {favorites.length > 1 && (
                <TouchableOpacity onPress={removeAllFavorites} style={styles.removeAllButton}>
                    <Ionicons name="trash" size={24} color="white" />
                    <Text style={styles.removeAllButtonText}>Remove All</Text>
                </TouchableOpacity>
            )}
            {watches.length > 0 ? (
                <FlatList
                    data={watches}
                    renderItem={renderWatchItem}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.listContainer}
                />
            ) : (
                <Text style={styles.emptyListText}>No automatic toy available</Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 10,
    },
    listContainer: {
        paddingBottom: 20,
    },
    watchItemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 10,
        backgroundColor: '#f0f0f0',
        padding: 10,
        borderRadius: 10,
    },
    watchItemContent: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    watchItemImage: {
        width: 80,
        height: 80,
        borderRadius: 10,
        marginRight: 10,
    },
    watchItemDetails: {
        flex: 1,
    },
    watchItemName: {
        fontSize: 14,
        fontWeight: 'bold',
        flexWrap: 'wrap', // Allow text to wrap
    },
    watchItemPrice: {
        fontSize: 14,
        color: 'gray',
    },
    favoriteButton: {
        padding: 10,
        borderRadius: 5,
    },
    removeAllButton: {
        flexDirection: 'row',
        alignSelf: 'center',
        marginTop: 20,
        padding: 10,
        backgroundColor: 'red',
        borderRadius: 5,
        alignItems: 'center',
    },
    removeAllButtonText: {
        color: 'white',
        marginLeft: 10,
        fontSize: 16,
    },
    emptyListText: {
        alignSelf: 'center',
        fontSize: 18,
        marginTop: 20,
    },
});

export default Automatic;
