import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, Image, Pressable, StyleSheet, ScrollView, TouchableWithoutFeedback } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import Ribbon from './Ribbon';

const companyCategory = [
    {
        id: '0',
        category: 'All',
    },
];

const Home = () => {
    const navigation = useNavigation();
    const [favorites, setFavorites] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [perfume, setPerfume] = useState([]);
    const [allPerfumes, setAllPerfumes] = useState([]);

    useFocusEffect(
        useCallback(() => {
            loadFavorites();
        }, [])
    );

    useEffect(() => {
        loadFavorites();
        fetchPerfumes();
    }, []);

    const loadFavorites = async () => {
        try {
            const favoritesString = await AsyncStorage.getItem('favorites');
            if (favoritesString) {
                const favoritesArray = JSON.parse(favoritesString);
                setFavorites(favoritesArray);
            }
        } catch (error) {
            console.error('Error loading favorites:', error);
        }
    };

    const fetchPerfumes = async () => {
        try {
            const response = await fetch('https://667699a7145714a1bd7239a6.mockapi.io/Toy');
            const data = await response.json();
            setAllPerfumes(data);
            setPerfume(data);
            initializeCategories(data);
        } catch (error) {
            console.error('Error fetching perfumes:', error);
        }
    };

    const initializeCategories = (data) => {
        let count = 1;
        let companyCateFilter = ['All'];
        data.forEach((item) => {
            if (!companyCateFilter.includes(item.address)) { //cho nay
                let { address } = item; //doi cho nay
                companyCategory.push({ id: count, category: address }); //cho nay
                companyCateFilter.push(address); //cho nay
                count += 1;
            }
        });
    };

    const selectCategory = (category) => {
        setSelectedCategory(category);
        let filteredPerfume = allPerfumes;

        if (category.category !== 'All') {
            filteredPerfume = allPerfumes.filter((perfume) => perfume.address === category.category); //cho nay
        }

        setPerfume(filteredPerfume);
    };

    const addToFavorites = async (perfume) => {
        try {
            const perfumeExists = favorites.some(item => item.id === perfume.id);
            let updatedFavorites;

            if (perfumeExists) {
                updatedFavorites = favorites.filter(item => item.id !== perfume.id);
            } else {
                updatedFavorites = [...favorites, perfume];
            }

            setFavorites(updatedFavorites);
            await AsyncStorage.setItem('favorites', JSON.stringify(updatedFavorites));
        } catch (error) {
            console.error('Error adding to favorites:', error);
        }
    };

    const renderItem = ({ item }) => {
        const isFavorite = favorites.some(favorite => favorite.id === item.id);

        return (
            <Pressable
                onPress={() => navigation.navigate('Detail', { perfume: item })}
                style={({ pressed }) => [
                    styles.cardContainer,
                    { backgroundColor: pressed ? '#f0f0f0' : '#fff' }
                ]}
            >
                <View style={styles.cardContent}>
                    <Image source={{ uri: item.image }} style={styles.image} />
                    {item.modern && (
                        <Ribbon text="True" />
                    )}
                    <View style={styles.perfumeInfo}>
                        <Text numberOfLines={2} ellipsizeMode="tail" style={styles.perfumeName}>{item.toyName}</Text>
                        <Text style={styles.price}>Price: ${item.price}</Text>
                    </View>
                    <Pressable onPress={() => addToFavorites(item)}>
                        <Ionicons name={isFavorite ? 'heart' : 'heart-outline'} size={24} color={isFavorite ? 'red' : 'black'} />
                    </Pressable>
                </View>
            </Pressable>
        );
    };

    return (
        <View style={styles.container}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryContainer}>
                {companyCategory.map((category) => {
                    return (
                        <TouchableWithoutFeedback key={category.id} onPress={() => selectCategory(category)}>
                            <View
                                style={{
                                    ...styles.categoryButton,
                                    backgroundColor: selectedCategory === category ? '#8C8EA3' : '#F8F8FF',
                                }}
                            >
                                <Text
                                    style={{
                                        ...styles.categoryText,
                                        color: selectedCategory === category ? 'white' : 'black',
                                    }}
                                >
                                    {category.category}
                                </Text>
                            </View>
                        </TouchableWithoutFeedback>
                    );
                })}
            </ScrollView>

            <FlatList
                numColumns={2}
                data={perfume}
                renderItem={renderItem}
                keyExtractor={item => item.id.toString()}
                style={{ padding: 10 }}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
    },
    cardContainer: {
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        width: '50%',
        
        marginBottom: 13,
        marginLeft: 3
    },
    categoryContainer: {
        flexDirection: 'row',
        paddingHorizontal: 10,
        
    },
    categoryButton: {
        width: 100,
        height: 50,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#8C8EA3',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
        marginTop: 18,
        marginBottom: 20
    },
    categoryText: {
        fontSize: 14,
        color: 'white',
        textAlign: 'center',
    },
    searchContainer: {
        paddingHorizontal: 10,
        marginTop: 10,
        marginBottom: 5,
    },
    searchInput: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
    },
    scrollViewContent: {
        alignItems: 'center',
    },
    cardContent: {
        alignItems: 'center',
        padding: 16,
        width: '100%',
        
    },
    image: {
        width: 100,
        height: 100,
        marginRight: 16,
    },
    perfumeInfo: {
        flex: 1,
    },
    perfumeName: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
        textAlign: 'center'
    },
    price: {
        fontSize: 16,
        fontWeight: 'bold'
    },
});

export default Home;
