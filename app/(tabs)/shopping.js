import { View, Text } from 'react-native';
import { useState } from 'react';
import { getAllRecipes } from "@/services/recipes";
import { FlatList } from 'react-native-web';

export default function ShoppingScreen() {

    const [recipes, setRecipes] = useState([]);

    return (
        <View> 
            <Text>Shopping Screen</Text>
            <FlatList
                data={recipes}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 80 }}
                ListEmptyComponent={
                  <Text>No se encontraron recetas.</Text>
                }
                renderItem = {({ item: recipe }) => (
                    <View key={recipe.id}>
                        <Text>{recipe.title}</Text>
                    </View>
                )}
            />
        </View>
    );
}