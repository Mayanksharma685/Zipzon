import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { CategoryItemProps } from '../constants/types'
import { Ionicons } from '@expo/vector-icons'
import { COLORS } from '@/constants'

export default function CategoryItem({ item, isSelected, onPress }: CategoryItemProps) {
  // Fallback for 'All' category icon
  const iconName = item.icon || 'grid-outline';
  return (
    <TouchableOpacity onPress={onPress} style={{ marginRight: 16, alignItems: 'center' }}>
      <View style={{
        width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center', marginBottom: 6,
        backgroundColor: isSelected ? COLORS.primary : COLORS.light
      }}>
        <Ionicons
          name={iconName as any}
          size={28}
          color={isSelected ? '#FFF' : COLORS.black}
        />
      </View>
      <Text style={{ fontSize: 12, textAlign: 'center', fontWeight: '500', color: COLORS.black }}>{item.name}</Text>
    </TouchableOpacity>
  )
}