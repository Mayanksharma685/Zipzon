import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { COLORS } from "../../src/constants";
import { HeaderProps } from "../../src/constants/types";

export default function Header({
  title,
  showBack,
  showSearch,
  showCart,
  showMenu,
  showLogo,
}: HeaderProps) {
  const router = useRouter();
  const { itemCount } = { itemCount: 5 }; // Replace with actual cart item count from state or context

  return (
    <View className="flex-row items-center justify-between px-4 py-3 bg-white">
      {/* Left side - Menu/Back */}
      <View className="w-12 flex-row items-center">
        {showMenu && (
          <TouchableOpacity>
            <Ionicons name="menu" size={28} color={COLORS.primary} />
          </TouchableOpacity>
        )}

        {showBack && (
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color={COLORS.primary} />
          </TouchableOpacity>
        )}
      </View>

      {/* Center - Logo/Title */}
      <View className="flex-1 items-center justify-center">
        {showLogo ? (
          <Image
            source={require("../logo.png")}
            style={{ width: 100, height: 25 }}
            resizeMode="contain"
          />
        ) : (
          title && (
            <Text
              className="text-xl font-bold"
              style={{ color: COLORS.primary }}
            >
              {title}
            </Text>
          )
        )}
      </View>

      {/* Right side - Search/Cart */}
      <View className="w-12 flex-row items-center justify-end gap-4">
        {showSearch && (
          <TouchableOpacity>
            <Ionicons name="search" size={24} color={COLORS.primary} />
          </TouchableOpacity>
        )}
        {showCart && (
          <TouchableOpacity onPress={() => router.push("/(tabs)/cart")}>
            <View className="relative">
              <Ionicons name="bag-outline" size={24} color={COLORS.primary} />
              <View className="absolute -top-2 -right-2 bg-red-500 rounded-full w-5 h-5 items-center justify-center">
                <Text className="text-white text-[10px] font-bold">
                  {itemCount}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}
