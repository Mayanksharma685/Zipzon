import { COLORS } from "@/constants";
import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { ProductCardProps } from "../../src/constants/types";
import { useWishlist } from "../../src/context/WishlistContext";

export default function ProductCard({ product }: ProductCardProps) {
  const { toggleWishlist, isInWishlist } = useWishlist();
  const isLiked = isInWishlist(product._id);

  return (
    <Link href={`/product/${product._id}`} asChild>
      <TouchableOpacity style={{ width: "48%", marginBottom: 18 }}>
        <View
          style={{
            width: "100%",
            aspectRatio: 1,
            borderRadius: 16,
            overflow: "hidden",
            backgroundColor: "#F7F7F7",
            position: "relative",
            borderWidth: 1,
            borderColor: "#eee",
          }}
        >
          {/* favourite icon */}
          <TouchableOpacity
            style={{
              position: "absolute",
              top: 8,
              right: 8,
              zIndex: 20,
              padding: 8,
              backgroundColor: "#fff",
              borderRadius: 9999,
              elevation: 2,
            }}
            onPress={(e) => {
              e.stopPropagation();
              toggleWishlist(product);
            }}
          >
            <Ionicons
              name={isLiked ? "heart" : "heart-outline"}
              size={20}
              color={isLiked ? "#EF4444" : COLORS.black}
            />
          </TouchableOpacity>
          {/* is Featured */}
          {product.isFeatured && (
            <View
              style={{
                position: "absolute",
                top: 8,
                left: 8,
                zIndex: 15,
                backgroundColor: "#000",
                paddingHorizontal: 10,
                paddingVertical: 4,
                borderRadius: 6,
                opacity: 0.95,
              }}
            >
              <Text
                style={{
                  color: "#fff",
                  fontSize: 11,
                  fontWeight: "bold",
                  textTransform: "uppercase",
                  letterSpacing: 1,
                }}
              >
                FEATURED
              </Text>
            </View>
          )}
          <Image
            source={{ uri: product.images[0] }}
            style={{ width: "100%", height: "100%" }}
            resizeMode="cover"
          />
        </View>
        {/* ⭐ Star Rating */}
        <View
          style={{ flexDirection: "row", alignItems: "center", marginTop: 6 }}
        >
          <Ionicons name="star" size={14} color="#FFD700" />
          <Text style={{ fontSize: 12, color: "#666", marginLeft: 4 }}>
            {product.ratings?.average || 4.6}
          </Text>
        </View>

        <Text
          style={{ fontWeight: "bold", fontSize: 14, marginTop: 8 }}
          numberOfLines={1}
        >
          {product.name}
        </Text>
        <Text
          style={{ color: "#666", fontSize: 13, marginTop: 2 }}
          numberOfLines={1}
        >
          ${product.price}
        </Text>
      </TouchableOpacity>
    </Link>
  );
}
