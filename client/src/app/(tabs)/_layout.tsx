import { View, Text } from 'react-native'
import React from 'react'
import { Tabs } from 'expo-router'
import { Feather, Ionicons } from '@expo/vector-icons'
import { COLORS } from '../../constants/theme'
import { useCart } from "@/context/CartContext";

export default function TabLayout() {

  const {cartItems} = useCart();
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#000",
        tabBarInactiveTintColor: "gray",
        tabBarShowLabel: false,
        tabBarStyle: {
            backgroundColor: COLORS.white,
            borderTopWidth: 1,
            height: 70,            
            paddingBottom: 32,     
            paddingTop: 8,         
        }
      }}
    >
      <Tabs.Screen name='index' options={{
        tabBarIcon: ({ color, focused }) => <Ionicons name={focused ? 'home' : 'home-outline'} size={26} color={color}/>
      }}/>
      <Tabs.Screen name='favorites' options={{
        tabBarIcon: ({ color, focused }) => <Ionicons name={focused ? 'heart' : 'heart-outline'} size={26} color={color}/>
      }}/>
      <Tabs.Screen
  name='cart'
  options={{
    tabBarIcon: ({ color, focused }) => (
      <View className='relative'>

        <Feather
          name={focused ? 'shopping-cart' : 'shopping-cart'}
          size={26}
          color={color}
        />
        {cartItems.length > 0 && 
        <View className='absolute -top-2 -right-2 bg-accent size-3 rounded-full items-center justify-center'>
          <Ionicons name='ellipse' size={6} color="white" />
        </View>
  }

      </View>
    ),
  }}
/>
      <Tabs.Screen name='profile' options={{
        tabBarIcon: ({ color, focused }) => <Ionicons name={focused ? 'person' : 'person-outline'} size={26} color={color}/>
      }}/>
    </Tabs>
  )
}

