import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, Alert, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const Favorite = ({ navigation }) => {
    const [favorites, setFavorites] = useState([]);

    const loadFavorite = useCallback(async () => {
        try {
            const value = await AsyncStorage.getItem('favorites');
            if (value !== null) {
                setFavorites(JSON.parse(value));
            }
        } catch (error) {
            console.error('Error loading favorite toy:', error);
        }
    }, []);

    useFocusEffect(
        useCallback(() => {
            loadFavorite();
        }, [loadFavorite])
    );

    const removePerfume = async (perfume) => {
        try {
            const newFavorite = favorites.filter((item) => item.id !== perfume.id);
            await AsyncStorage.setItem('favorites', JSON.stringify(newFavorite));
            setFavorites(newFavorite);
            Alert.alert('Success', 'Toy removed from favorites!');
        } catch (error) {
            console.error('Error removing toy:', error);
            Alert.alert('Error', 'Failed to remove toy from favorites!');
        }
    };

    const removeAllPerfumes = async () => {
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

    const renderPerfumeItem = ({ item }) => (
        <View style={styles.orchidItemContainer}>
            <TouchableOpacity
                style={styles.orchidItemContent}
                onPress={() => navigation.navigate('Detail', { perfume: item })}
            >
                <Image source={{ uri: item.image }} style={styles.orchidItemImage} />
                <Text style={styles.orchidItemName}>{item.toyName}</Text>
                {/* ellipsizeMode='tail' */}
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleDeleteConfirmation(item)}
            >
                <Ionicons name="trash" size={40} color="white" />
            </TouchableOpacity>
        </View>
    );


    const handleDeleteConfirmation = (perfume) => {
        Alert.alert(
            'Confirm Delete',
            'Are you sure you want to remove this perfume from favorites?',
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'OK', onPress: () => removePerfume(perfume) },
            ],
            { cancelable: false }
        );
    };

    return (
        <View style={styles.container}>
            {favorites.length > 1 && (
                <TouchableOpacity onPress={removeAllPerfumes} style={styles.removeAllButton}>
                    <Ionicons name="trash" size={32} color="white" />
                    <Text style={styles.removeAllButtonText}>Remove All</Text>
                </TouchableOpacity>
            )}

            {favorites.length > 0 ? (
                <FlatList
                    data={favorites}
                    renderItem={renderPerfumeItem}
                    keyExtractor={(item) => item.perfumeName}
                    contentContainerStyle={styles.listContainer}
                />
            ) : (
                <Text style={styles.emptyListText}>No favorite perfumes yet</Text>
            )}
        </View>
    );
};

export default Favorite;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 10,
    },
    listContainer: {
        paddingBottom: 20,
    },
    orchidItemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 10,
        backgroundColor: '#f0f0f0',
        padding: 10,
        borderRadius: 10,
    },
    orchidItemContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    orchidItemImage: {
        width: 80,
        height: 80,
        borderRadius: 10,
        marginRight: 10,
    },
    orchidItemName: {
        fontSize: 10,
        fontWeight: 'bold',

    },
    deleteButton: {
        backgroundColor: 'red',
        padding: 5,
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
